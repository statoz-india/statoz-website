import { publicAsset } from '@statoz/design-system/asset';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { CITY_LOCATIONS, CITY_PALETTE as P, type CityLocationId } from './city-config';
import { buildDistrict } from './city-district';
import { createCityKit } from './city-kit';
import { buildLandmarks } from './city-landmarks';
import { createCityLife } from './city-life';
import { createCityTraffic } from './city-traffic';
import { loadPeople, loadVehicles, type VehicleKit } from './city-kenney';
import { DRIVE_ROUTES } from './city-drive';
import { buildVenues } from './city-venues';
import { buildGateway } from './city-gateway';
import { buildCityRefinement } from './city-refinement';
import { loadCityGameAssets } from './city-game-assets';
import type { CityBody, CityContact } from './city-contact';
import { createCircuitContact } from './city-circuit-contact';
import type { CitySolid } from './city-roam-physics';

export type CityWorld = Awaited<ReturnType<typeof buildCityWorld>>;
const AXLE = new THREE.Vector3(1, 0, 0);
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
  let disposed = false, reduced = false;

  performance.mark('city:start');
  const district = buildDistrict(kit, mobile); performance.mark('city:district'); await breathe();
  const gateway = buildGateway(kit, district.facadeBox, mobile); performance.mark('city:gateway'); await breathe();
  const venues = buildVenues(kit); performance.mark('city:venues'); await breathe();
  kit.setZone('city');
  const landmarks = buildLandmarks(kit); performance.mark('city:landmarks'); await breathe();
  const refinement = buildCityRefinement(kit, mobile); await breathe();
  const life = createCityLife(kit.seats, venues.race.x, venues.race.z, mobile); kit.moving.add(life.group);
  // Street traffic keeps every manoeuvre clear of the coupe's own route, sampled every unit along it.
  const coupePath = DRIVE_ROUTES.flatMap(path => path.getSpacedPoints(Math.ceil(path.getLength())).map(point => ({ x: point.x, z: point.z })));
  const traffic = createCityTraffic(coupePath, mobile); kit.moving.add(traffic.group);
  const circuit = createCircuitContact(venues.cars, venues.racingPath);
  kit.finalize(); performance.mark('city:finalize'); await breathe();
  await kit.rebatch(); performance.mark('city:rebatch');
  // Street lamps shed real light on people, cars, trees and walls near the view. A fixed pool of lights moves
  // between the lamps nearest where the camera looks and fades in and out; the light count never changes, so
  // no program recompiles. Phones keep the painted pools only.
  const lampPool = Array.from({ length: mobile ? 0 : 6 }, () => {
    const light = new THREE.PointLight('#ffcf8e', 0, 15, 2); light.name = 'street-lamp-light'; scene.add(light);
    return { light, spot: -1, level: 0 };
  });
  const look = new THREE.Vector3(), focus = new THREE.Vector3();
  let streetPower = 1, lampClock = performance.now();
  function lightLamps(camera: THREE.Camera) {
    const now = performance.now(), ease = Math.min(1, (now - lampClock) / 1000 * 4); lampClock = now;
    if (!lampPool.length) return;
    // Where the view rests on the street: along the view until it meets the ground, at most 70 m away.
    camera.getWorldDirection(look);
    focus.copy(camera.position).addScaledVector(look, look.y < -.05 ? Math.min(70, camera.position.y / -look.y) : 40);
    const nearest: { spot: number; distance: number }[] = [];
    kit.lampSpots.forEach((lamp, spot) => {
      const distance = lamp.position.distanceToSquared(focus);
      if (distance > 42 * 42) return;
      if (nearest.length < lampPool.length) nearest.push({ spot, distance });
      else { const worst = nearest.reduce((a, b) => (b.distance > a.distance ? b : a)); if (distance < worst.distance) Object.assign(worst, { spot, distance }); }
    });
    const wanted = new Set(nearest.map(item => item.spot));
    for (const item of lampPool) if (item.spot >= 0 && !wanted.has(item.spot) && item.level < .02) item.spot = -1;
    for (const spot of wanted) {
      if (lampPool.some(item => item.spot === spot)) continue;
      const free = lampPool.find(item => item.spot < 0); if (!free) break;
      free.spot = spot; free.level = 0; free.light.position.copy(kit.lampSpots[spot].position); free.light.color.copy(kit.lampSpots[spot].color);
    }
    for (const item of lampPool) {
      item.level += ((item.spot >= 0 && wanted.has(item.spot) ? 1 : 0) - item.level) * ease;
      item.light.intensity = reduced ? 0 : 40 * item.level * streetPower;
    }
  }
  // Nothing solid may stand in a road or on a pavement. The result is published for the browser tests.
  const layoutIssues = district.roads.audit(kit.claims);
  document.documentElement.dataset.cityLayout = layoutIssues.length ? layoutIssues.join(' | ') : 'clear';

  // The CC0 kits supply street buildings and cars. At night their facades carry a little of their own light.
  const ktxLoader = new KTX2Loader().setTranscoderPath(publicAsset('/assets/city/basis/')).setWorkerLimit(1).detectSupport(renderer);
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
  let gameAssets: ReturnType<typeof loadCityGameAssets> | undefined;
  // Kenney Mini Characters and Car Kit: everyone in the city, the street traffic and the circuit cars.
  const raceWheels: { car: THREE.Group; wheel: THREE.Object3D; base: THREE.Quaternion; radius: number }[] = [];
  function raceCars(vehicles: VehicleKit) {
    const material = new THREE.MeshStandardMaterial({ map: vehicles.texture, roughness: .35, metalness: .3 });
    const glow = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
    for (const [i, car] of venues.cars.entries()) {
      const model = vehicles.models.get(i % 2 ? 'race-future' : 'race'); if (!model) continue;
      car.clear();
      const scale = 4.2 * .75 / Math.max(model.size.x, model.size.z), holder = new THREE.Group(); holder.scale.setScalar(scale); car.add(holder);
      Object.assign(circuit.bodies()[i], { radius: model.size.x * scale / 2, halfLength: Math.max(0, (model.size.z - model.size.x) * scale / 2) });
      holder.add(new THREE.Mesh(model.body, material));
      if (model.lamps.attributes.position.count) holder.add(new THREE.Mesh(model.lamps, glow));
      for (const wheel of model.wheels) {
        const mesh = new THREE.Mesh(wheel.geometry, material); mesh.position.copy(wheel.position); mesh.quaternion.copy(wheel.rotation); holder.add(mesh);
        raceWheels.push({ car, wheel: mesh, base: wheel.rotation.clone(), radius: wheel.radius * scale });
      }
    }
  }
  const kenney = Promise.all([loadPeople(), loadVehicles()]).then(([people, vehicles]) => {
    if (disposed) return;
    life.setKit(people); traffic.setKit(vehicles); raceCars(vehicles);
  });
  const baseReady = loader.loadAsync(publicAsset('/assets/city/city-kit.glb')).then(async gltf => {
    if (disposed) { disposeObject(gltf.scene); return; }
    assets.push(gltf.scene);
    const templates = gltf.scene.children;
    const buildings = templates.filter(item => item.name.startsWith('building-') || item.name.startsWith('downtown-'));
    STRIP_PLOTS.forEach(([x, z, height, width, depth], i) => { const model = buildings[i % Math.max(buildings.length, 1)]; if (model) placeModel(model, x, z, height, x < 0 ? Math.PI / 2 : -Math.PI / 2, depth, width); });
    await kit.rebatch();
    if (disposed) return;
    document.documentElement.dataset.cityAssets = 'base-loaded'; performance.mark('city:kit-loaded');
    const downtown = await loader.loadAsync(publicAsset('/assets/city/downtown-kit.glb'));
    if (disposed) { disposeObject(downtown.scene); return; }
    assets.push(downtown.scene);
    NORTH_PLOTS.forEach(([x, z, height, width, depth], index) => placeModel(downtown.scene.children[index % downtown.scene.children.length], x, z, height, index % 2 ? 0 : Math.PI, width, depth));
    await kit.rebatch();
    if (disposed) return;
    gameAssets = loadCityGameAssets(kit, loader);
    await gameAssets.ready;
    await kenney;
    await district.roads.surfaceReady;
    if (!disposed) document.documentElement.dataset.cityAssets = 'loaded';
  }).catch(() => { if (!disposed) document.documentElement.dataset.cityAssets = 'unavailable'; });
  const assetReady = baseReady;

  /** Individual authored solids remain available behind the render batches. */
  function collectSolids() {
      const solids: CitySolid[] = [], bounds = new THREE.Box3();
      kit.source.updateMatrixWorld(true);
      kit.source.traverse(object => {
        if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh) return;
        bounds.setFromObject(object);
        const size = bounds.getSize(new THREE.Vector3());
        if (size.y < .45 || bounds.max.y < .5 || bounds.min.y > 30 || bounds.min.x > 130 || bounds.max.x < -130 || bounds.min.z > 170 || bounds.max.z < -110) return;
        solids.push({ minX: bounds.min.x, maxX: bounds.max.x, minZ: bounds.min.z, maxZ: bounds.max.z, minY: bounds.min.y, maxY: bounds.max.y });
      });
      for (const object of kit.details.children) if (object instanceof THREE.InstancedMesh && (object.name === 'city-broadleaf-trees' || object.name === 'city-conifers')) {
        const trees = object as THREE.InstancedMesh, matrix = new THREE.Matrix4(), point = new THREE.Vector3();
        for (let i = 0; i < trees.count; i++) { trees.getMatrixAt(i, matrix); point.setFromMatrixPosition(matrix); solids.push({ minX: point.x - .23, maxX: point.x + .23, minZ: point.z - .23, maxZ: point.z + .23, minY: 0, maxY: 3 }); }
      }
      return solids;
  }
  // People step round the same posts, planters and trees that the free-roam car collides with.
  life.setObstacles(collectSolids());

  const pickBoxes = CITY_LOCATIONS.map(location => {
    const dimensions = FOOTPRINT[location.id].pick;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), new THREE.MeshBasicMaterial());
    mesh.position.set(location.position[0], dimensions[1] / 2, location.position[2]); mesh.userData.locationId = location.id; mesh.updateMatrixWorld(true); return mesh;
  });
  const selection = new THREE.Mesh(new THREE.RingGeometry(1, 1.03, 96), new THREE.MeshBasicMaterial({ color: P.cyan, transparent: true, opacity: .6, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  selection.rotation.x = -Math.PI / 2; selection.position.y = .16; selection.visible = false; scene.add(selection);

  function disposeObject(root: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>(); const textures = new Set<THREE.Texture>(); const skeletons = new Set<THREE.Skeleton>();
    root.traverse(item => {
      if (item instanceof THREE.Mesh || item instanceof THREE.Line || item instanceof THREE.Points) {
        if (item instanceof THREE.SkinnedMesh) skeletons.add(item.skeleton);
        geometries.add(item.geometry);
        for (const mat of Array.isArray(item.material) ? item.material : [item.material]) { materials.add(mat); for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value); }
      }
    });
    geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose()); skeletons.forEach(item => item.dispose());
  }
  let simulationTime = -1;
  return {
    assetReady, pickBoxes, lifeCounts: { ...life.counts, ...traffic.counts, stands: kit.stands },
    roamSolids: collectSolids,
    bodies: () => [...traffic.bodies(), ...circuit.bodies(), ...life.bodies()],
    reactContact(contact: CityContact) {
      if (contact.kind === 'vehicle') { traffic.react(contact); circuit.react(contact); }
      if (contact.kind === 'person') life.react(contact, Math.max(0, simulationTime));
    },
    drainContacts: () => [...traffic.drainContacts(), ...circuit.drainContacts(), ...life.drainContacts()],
    /** Playing surfaces people stand on and the free-roam car keeps off. */
    roamFloors: venues.floors,
    highlight(id: CityLocationId | null) {
      const location = CITY_LOCATIONS.find(item => item.id === id); selection.visible = !!location;
      if (location) { selection.position.set(location.position[0], .16, location.position[2]); selection.scale.setScalar(FOOTPRINT[location.id].ring); (selection.material as THREE.MeshBasicMaterial).color.set(location.accent); }
    },
    update(time: number, drive?: { x: number; z: number } | null, journey = false, playerBodies: readonly CityBody[] = []) {
      const previous = simulationTime < 0 ? time : simulationTime;
      const duration = Math.min(.1, Math.max(0, time - previous));
      const steps = Math.max(1, Math.ceil(duration / (1 / 60)));
      let nearest = Infinity;
      for (let i = 1; i <= steps; i++) {
        const at = time - duration + duration * i / steps;
        life.update(at, { cars: traffic.vehicles(), coupe: drive ?? null, bodies: journey ? [] : [...playerBodies, ...traffic.bodies(), ...circuit.bodies()] });
        nearest = traffic.update(at, life.onRoad(), drive ?? null, journey, playerBodies, journey ? [] : life.bodies());
        circuit.update(duration / steps, at, journey ? [] : [...playerBodies, ...life.bodies()]);
      }
      simulationTime = time;
      kit.setTime(time); landmarks.update(time); refinement.update(time); gameAssets?.update(time);
      for (const { car, wheel, base, radius } of raceWheels) wheel.quaternion.setFromAxisAngle(AXLE, circuit.distance(car) / radius).multiply(base);
      // Traffic keeps to the left, gives way to people on zebras and to the coupe, and never leaves view abruptly.
      return nearest;
    },
    /** The sky travels with the camera so the horizon never comes closer. */
    follow(camera: THREE.Camera) { district.follow(camera); lightLamps(camera); },
    /** Slower devices keep the scene but lose the extra venue lights. */
    reduce() { reduced = true; refinement.reduce(); traffic.reduce(); venues.lights.forEach(item => { item.light.intensity = 0; }); },
    layoutIssues,
    /** Lights-on: zones are [streets, football, cricket, basketball, racing], each 0..1. */
    setPower(power: { zones: number[]; ripple: number; windows: number; neon: number; signs: number }) {
      kit.setPower(power); district.roads.setNeon(power.neon); streetPower = power.zones[0];
      refinement.setPower(power.neon);
      // Light membership never changes here (that would recompile every shader); only intensity does.
      venues.lights.forEach(item => { item.light.intensity = reduced ? 0 : item.base * power.zones[item.zone]; });
    },
    setEntrance(wake: number, plazaVisible: boolean) { gateway.setWake(wake); gateway.setPlazaVisible(plazaVisible); },
    dispose() {
      disposed = true; traffic.dispose(); life.dispose(); landmarks.dispose(); gateway.dispose(); gameAssets?.dispose(); district.roads.dispose(); ktxLoader.dispose();
      for (const root of [kit.source, kit.batch, kit.details, kit.moving, selection, ...assets]) { disposeObject(root); root.removeFromParent(); }
      for (const box of pickBoxes) disposeObject(box);
      for (const { light } of lampPool) { light.removeFromParent(); light.dispose(); }
      kit.disposeShared();
    },
  };
}
