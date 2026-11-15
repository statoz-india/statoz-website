import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { CITY_LOCATIONS, CITY_PALETTE as P, type CityLocationId } from './city-config';
import { buildDistrict } from './city-district';
import { createCityKit } from './city-kit';
import { buildLandmarks } from './city-landmarks';
import { createCityLife } from './city-life';
import { buildVenues } from './city-venues';
import { buildGateway, cityEnvironment } from './city-gateway';

export type CityWorld = Awaited<ReturnType<typeof buildCityWorld>>;
/** Yields to the browser between build stages, so input and painting are not blocked by one long task. */
const breathe = () => new Promise<void>(resolve => setTimeout(resolve, 0));

// Clickable volume and highlight radius for each place, sized to its stands and forecourt.
const FOOTPRINT: Record<CityLocationId, { pick: [number, number, number]; ring: number }> = {
  basketball: { pick: [40, 5, 36], ring: 25 }, cricket: { pick: [62, 6, 62], ring: 36 }, football: { pick: [62, 6, 50], ring: 37 }, racing: { pick: [66, 5, 38], ring: 36 },
  news: { pick: [18, 44, 14], ring: 12.5 }, clubhouse: { pick: [17, 12, 15], ring: 12 }, help: { pick: [14, 14, 14], ring: 9.5 }, download: { pick: [25, 11, 13], ring: 16 }, 'city-hall': { pick: [19, 18, 18], ring: 14 },
};
// Plots for the CC0 building kits: [x, z, height, maximum width, maximum depth].
const STRIP_PLOTS = [
  [-105, -66, 11, 12, 18], [-105, -44, 9, 12, 18], [-105, -22, 12, 12, 18], [-105, 17, 10, 12, 16], [-105, 35, 9, 12, 14], [-105, 59, 11, 12, 12], [-105, 72, 8, 12, 10],
  [96.5, -66, 10, 17, 18], [96.5, -44, 8, 17, 18], [96.5, -22, 10, 17, 18], [96.5, 17, 9, 17, 16], [96.5, 35, 8, 17, 14], [96.5, 59, 9, 17, 12], [96.5, 72, 7, 17, 10],
] as const;
const NORTH_PLOTS = [[-74, -71.5, 13, 24, 13], [-37, -71.5, 14, 24, 13], [32, -71.5, 12, 24, 13], [59, -71.5, 15, 24, 13], [15.5, -72.5, 9, 9, 11], [75, -71.5, 8, 6.5, 12]] as const;

export async function buildCityWorld(scene: THREE.Scene, renderer: THREE.WebGLRenderer, mobile: boolean) {
  const kit = createCityKit(scene);
  const assets: THREE.Object3D[] = [];
  let disposed = false;

  const district = buildDistrict(kit, mobile); await breathe();
  buildGateway(kit);
  const environment = cityEnvironment(renderer);
  scene.environment = environment.texture; scene.environmentIntensity = .16;
  const venues = buildVenues(kit); await breathe();
  const landmarks = buildLandmarks(kit); await breathe();
  const life = createCityLife(kit.seats, venues.race.x, venues.race.z); kit.moving.add(life.group);
  kit.finalize(); await breathe();
  await kit.rebatch();

  // The CC0 kits supply street buildings and cars. At night their facades carry a little of their own light.
  const ktxLoader = new KTX2Loader().setTranscoderPath('/statoz-website/assets/city/basis/').setWorkerLimit(1).detectSupport(renderer);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).setKTX2Loader(ktxLoader);
  const litFacades = new Map<THREE.Material, THREE.Material>();
  const lit = (original: THREE.Material) => {
    if (!(original instanceof THREE.MeshStandardMaterial) || !original.map) return original;
    if (!litFacades.has(original)) { const copy = original.clone(); copy.emissiveMap = original.map; copy.emissive = new THREE.Color('#93a9cf'); copy.emissiveIntensity = .42; litFacades.set(original, copy); }
    return litFacades.get(original)!;
  };
  function placeModel(template: THREE.Object3D, x: number, z: number, height: number, rotation = 0, maxWidth = Infinity, maxDepth = Infinity) {
    const model = template.clone(true);
    const bounds = new THREE.Box3().setFromObject(model); const size = bounds.getSize(new THREE.Vector3()); const center = bounds.getCenter(new THREE.Vector3());
    const scale = Math.min(height / Math.max(size.y, .01), maxWidth / Math.max(size.x, .01), maxDepth / Math.max(size.z, .01));
    model.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z));
    const holder = new THREE.Group(); holder.add(model); holder.scale.setScalar(scale); holder.rotation.y = rotation; holder.position.set(x, .05, z);
    holder.traverse(item => { if (item instanceof THREE.Mesh) item.material = Array.isArray(item.material) ? item.material.map(lit) : lit(item.material); });
    kit.source.add(holder); return holder;
  }
  const traffic: THREE.Group[] = [];
  const assetReady = loader.loadAsync('/statoz-website/assets/city/city-kit.glb').then(async gltf => {
    if (disposed) { disposeObject(gltf.scene); return; }
    assets.push(gltf.scene);
    const templates = gltf.scene.children;
    const buildings = templates.filter(item => item.name.startsWith('building-') || item.name.startsWith('downtown-'));
    STRIP_PLOTS.forEach(([x, z, height, width, depth], i) => { const model = buildings[i % Math.max(buildings.length, 1)]; if (model) placeModel(model, x, z, height, x < 0 ? Math.PI / 2 : -Math.PI / 2, depth, width); });
    const carModel = templates.find(item => item.name === 'race-car');
    if (carModel) for (const [i, car] of venues.cars.entries()) {
      for (const child of [...car.children]) car.remove(child);
      const mesh = carModel.clone(true); const bounds = new THREE.Box3().setFromObject(mesh); const size = bounds.getSize(new THREE.Vector3());
      mesh.traverse(object => { if (object instanceof THREE.Mesh) { const tint = (original: THREE.Material) => original.name === 'pylon' ? kit.material([P.pink, P.cyan, P.gold][i], .08) : original; object.material = Array.isArray(object.material) ? object.material.map(tint) : tint(object.material); } });
      mesh.position.sub(bounds.getCenter(new THREE.Vector3())); mesh.position.y += size.y / 2;
      const holder = new THREE.Group(); holder.add(mesh); holder.scale.setScalar(3.3 / Math.max(size.z, size.x)); car.add(holder);
    }
    if (carModel) for (let i = 0; i < 6; i++) {
      const model = carModel.clone(true); const bounds = new THREE.Box3().setFromObject(model); const size = bounds.getSize(new THREE.Vector3());
      model.position.sub(bounds.getCenter(new THREE.Vector3())); model.position.y += size.y / 2;
      const holder = new THREE.Group(); holder.add(model); holder.scale.setScalar(2.6 / Math.max(size.z, size.x)); kit.moving.add(holder); traffic.push(holder);
    }
    await kit.rebatch();
    if (disposed) return;
    document.documentElement.dataset.cityAssets = 'base-loaded';
    const downtown = await loader.loadAsync('/statoz-website/assets/city/downtown-kit.glb');
    if (disposed) { disposeObject(downtown.scene); return; }
    assets.push(downtown.scene);
    NORTH_PLOTS.forEach(([x, z, height, width, depth], index) => placeModel(downtown.scene.children[index % downtown.scene.children.length], x, z, height, index % 2 ? 0 : Math.PI, width, depth));
    await kit.rebatch();
    if (disposed) return;
    document.documentElement.dataset.cityAssets = 'loaded';
  }).catch(() => { if (!disposed) document.documentElement.dataset.cityAssets = 'unavailable'; });

  const pickBoxes = CITY_LOCATIONS.map(location => {
    const dimensions = FOOTPRINT[location.id].pick;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), new THREE.MeshBasicMaterial());
    mesh.position.set(location.position[0], dimensions[1] / 2, location.position[2]); mesh.userData.locationId = location.id; mesh.updateMatrixWorld(true); return mesh;
  });
  const selection = new THREE.Mesh(new THREE.RingGeometry(1, 1.03, 96), new THREE.MeshBasicMaterial({ color: P.cyan, transparent: true, opacity: .6, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  selection.rotation.x = -Math.PI / 2; selection.position.y = .16; selection.visible = false; scene.add(selection);

  function disposeObject(root: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>(); const textures = new Set<THREE.Texture>();
    root.traverse(item => {
      if (item instanceof THREE.Mesh || item instanceof THREE.Line || item instanceof THREE.Points) {
        geometries.add(item.geometry);
        for (const mat of Array.isArray(item.material) ? item.material : [item.material]) { materials.add(mat); for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value); }
      }
    });
    geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose());
  }
  return {
    assetReady, pickBoxes, lifeCounts: { ...life.counts, stands: kit.stands },
    highlight(id: CityLocationId | null) {
      const location = CITY_LOCATIONS.find(item => item.id === id); selection.visible = !!location;
      if (location) { selection.position.set(location.position[0], .16, location.position[2]); selection.scale.setScalar(FOOTPRINT[location.id].ring); (selection.material as THREE.MeshBasicMaterial).color.set(location.accent); }
    },
    update(time: number) {
      life.update(time); landmarks.update(time);
      venues.cars.forEach((car, i) => { const angle = time * .14 + i * Math.PI * 2 / venues.cars.length; car.position.copy(venues.racingPath(angle)); car.rotation.y = Math.atan2(-Math.sin(angle) * venues.raceRadiusX, Math.cos(angle) * 13.5); });
      // Traffic keeps to the left, and drives in from the wider city.
      traffic.forEach((car, i) => { const east = i % 2 === 0, street = i < 3 ? 3 : 48; car.position.set((((time * 4.3 + i * 47) % 300) - 150) * (east ? 1 : -1), .07, street + (east ? -1.6 : 1.6)); car.rotation.y = (east ? 1 : -1) * Math.PI / 2; });
    },
    /** The sky travels with the camera so the horizon never comes closer. */
    follow(camera: THREE.Camera) { district.follow(camera); },
    /** Slower devices keep the scene but lose the extra venue lights. */
    reduce() { venues.lights.forEach(light => { light.visible = false; }); },
    dispose() {
      disposed = true; landmarks.dispose(); ktxLoader.dispose(); environment.dispose(); scene.environment = null;
      for (const root of [kit.source, kit.batch, kit.details, kit.moving, selection, ...assets]) { disposeObject(root); root.removeFromParent(); }
      for (const box of pickBoxes) disposeObject(box);
      kit.disposeShared();
    },
  };
}
