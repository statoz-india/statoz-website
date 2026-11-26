import { publicAsset } from '@statoz/design-system/asset';
import * as THREE from 'three';
import type { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CITY_PALETTE as P } from './city-config';
import type { CityKit } from './city-kit';

/** Local exports from Games. A missing optional asset never prevents exploring the city. */
export function loadCityGameAssets(kit: CityKit, loader: GLTFLoader) {
  let disposed = false;
  const roots: THREE.Object3D[] = [], screens: { texture: THREE.Texture; start: number; cycle: boolean }[] = [];
  const textures: THREE.Texture[] = [];
  const tile = (texture: THREE.Texture, index: number) => { texture.offset.set(index % 5 / 5, (2 - Math.floor(index / 5)) / 3); };
  const promises = [
    loader.loadAsync(publicAsset('/assets/city/refinement/contest-props.glb')).then(async gltf => {
      roots.push(gltf.scene); if (disposed) return;
      const rack = gltf.scene.getObjectByName('Rack'), pedestal = gltf.scene.getObjectByName('Pedestal');
      for (const [index, x] of [-48, -41, -34].entries()) {
        if (!rack) break;
        const stand = rack.clone(true); stand.position.set(x, .4, 16.9); stand.scale.setScalar(1.35); kit.source.add(stand);
        for (let b = 0; b < 5; b++) kit.cylinder(.17, .3, x + (b - 2) * .36, 1.8, 16.9, kit.material(index === 2 ? P.gold : P.orange), 10);
      }
      if (pedestal) { const prop = pedestal.clone(true); prop.position.set(-53, .4, 26); prop.scale.setScalar(1.5); kit.source.add(prop); }
      await kit.rebatch();
    }),
    new THREE.TextureLoader().loadAsync(publicAsset('/assets/city/refinement/games-atlas.webp')).then(async atlas => {
      textures.push(atlas); if (disposed) return;
      atlas.colorSpace = THREE.SRGBColorSpace; atlas.anisotropy = 4;
      const bezel = kit.material('#0f1621', 0, .45);
      /** A screen in a bezel. `standOn` is the height its posts stand on; stand-mounted screens have none. */
      function display(x: number, y: number, z: number, w: number, h: number, index: number, yaw = 0, cycle = false, standOn?: number) {
        const texture = atlas.clone(); texture.repeat.set(1 / 5, 1 / 3); tile(texture, index); textures.push(texture);
        const mesh = kit.panel(texture, x, y, z, w, h, yaw); mesh.name = 'game-catalogue-display'; screens.push({ texture, start: index, cycle });
        const back = { x: -Math.sin(yaw), z: -Math.cos(yaw) }, side = { x: Math.cos(yaw), z: -Math.sin(yaw) };
        kit.box(w + .36, h + .36, .22, x + back.x * .13, y, z + back.z * .13, bezel).rotation.y = yaw;
        if (standOn === undefined) return;
        const post = y - h / 2 - .18 - standOn;
        for (const end of [-1, 1]) kit.box(.24, post, .24, x + side.x * end * w * .32 + back.x * .3, standOn + post / 2, z + side.z * end * w * .32 + back.z * .3, kit.metal).rotation.y = yaw;
      }
      // The arcade wall hosts all fifteen games in a slowly changing programme, on the shop roof.
      display(-62, 7.4, 61.5, 8.8, 5.5, 0, 0, true, 4.6);
      // Small gallery screens at the actual sports grounds, using their own game artwork.
      display(-60.7, 2, 14.7, 3.6, 2.25, 0, 0, false, 0);
      display(-60.7, 2, 17.3, 3.6, 2.25, 13, 0, false, 0);
      display(43, 7.7, 11.8, 8, 5, 3, 0, false, .4);
      display(28, 5.5, -48.8, 6, 3.75, 2);
      display(-74, 6, -49.8, 5.8, 3.6, 7);
      await kit.rebatch();
    }),
  ];
  const ready = Promise.allSettled(promises).then(results => {
    if (!disposed) document.documentElement.dataset.cityRefinement = results.every(result => result.status === 'fulfilled') ? 'loaded' : 'partial';
    return results;
  });
  return {
    ready,
    update(time: number) { for (const screen of screens) if (screen.cycle) tile(screen.texture, (Math.floor(time / 7) + screen.start) % 15); },
    dispose() {
      disposed = true;
      // Loaded prototypes can resolve after unmount; their resources still need freeing.
      void ready.then(() => {
        const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
        for (const root of roots) root.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(mat => materials.add(mat)); } });
        geometries.forEach(geometry => geometry.dispose()); materials.forEach(mat => mat.dispose()); textures.forEach(texture => texture.dispose());
      });
    },
  };
}
