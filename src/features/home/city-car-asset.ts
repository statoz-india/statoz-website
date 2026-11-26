import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { publicAsset } from '@statoz/design-system/asset';

/** The licensed, sculpted fastback exterior; each car owns its loaded GPU resources. */
export function loadCarAsset(parent: THREE.Group, headlamp: THREE.Material, tail: THREE.Material) {
  const holder = new THREE.Group(); holder.name = 'statoz-fastback-asset'; holder.rotation.y = Math.PI; parent.add(holder);
  const wheels: { pivot: THREE.Group; spin: THREE.Object3D; front: boolean; radius: number }[] = [];
  const roof: THREE.Object3D[] = [], windows: THREE.Object3D[] = [], glass: THREE.MeshStandardMaterial[] = [];
  let cancelled = false, roofOpen = false;
  const ready = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(publicAsset('/assets/city/statoz-fastback.glb')).then(gltf => {
    if (cancelled) { disposeCarAsset(gltf.scene); return; }
    holder.add(gltf.scene);
    // The source glTF faces +Z (its Blender source uses -Y). Rotate the entire rig once;
    // hub-centred wheel pivots remain intact, with independent steering and axle rotation.
    for (const suffix of ['fl', 'fr', 'rl', 'rr']) {
      const wheel = gltf.scene.getObjectByName('muscle-car_wheel_' + suffix);
      if (!wheel) throw new Error('Fastback wheel missing: ' + suffix);
      const pivot = new THREE.Group(); pivot.name = 'fastback-steer-' + suffix;
      pivot.position.copy(wheel.position); wheel.parent!.add(pivot); pivot.add(wheel); wheel.position.set(0, 0, 0);
      wheels.push({ pivot, spin: wheel, front: suffix[0] === 'f', radius: suffix[0] === 'f' ? .33 : .355 });
    }
    gltf.scene.traverse(object => {
      if (object.name === 'hero-roof' || object.name === 'hero-greenhouse') { roof.push(object); object.visible = !roofOpen; }
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true; object.receiveShadow = true;
      if (object.material.name === 'hero-headlamps' || object.material.name === 'hero-taillamps') {
        const previous = object.material; object.material = previous.name === 'hero-headlamps' ? headlamp : tail; previous.dispose();
      }
      if (object.material instanceof THREE.MeshStandardMaterial && object.material.name.includes('window_glass')) {
        const material = object.material;
        material.color.set('#397585'); material.metalness = .3; material.roughness = .12;
        material.opacity = .3; material.transparent = true; material.depthWrite = false; material.side = THREE.DoubleSide;
        material.envMapIntensity = 1.5; glass.push(material); windows.push(object); object.visible = !roofOpen; object.castShadow = false;
      }
    });
    holder.userData.assetReady = true;
  });
  return {
    holder, ready,
    setRoofOpen(open: boolean) { roofOpen = open; roof.forEach(part => { part.visible = !open; }); windows.forEach(part => { part.visible = !open; }); },
    update(distance: number, steer: number, inside: number) {
      wheels.forEach(wheel => { wheel.spin.rotation.x = distance / wheel.radius; wheel.pivot.rotation.y = wheel.front ? steer : 0; });
      glass.forEach(material => { material.opacity = THREE.MathUtils.lerp(.3, .035, inside); });
    },
    cancelLoad() { cancelled = true; },
  };
}

function disposeCarAsset(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
    }
  });
  geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
}
