import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { publicAsset } from '@statoz/design-system/asset';
import { CITY_PALETTE as P } from './city-config';
import { paintCarNavigation, type CarNavigation } from './city-car-navigation';

/** Licensed dashboard, real upholstery/vent meshes, and screens fixed into the dashboard. */
export function createCarCockpit() {
  const group = new THREE.Group(); group.name = 'statoz-cockpit';
  const screenCanvas = document.createElement('canvas'); screenCanvas.width = 1024; screenCanvas.height = 576;
  const clusterCanvas = document.createElement('canvas'); clusterCanvas.width = 768; clusterCanvas.height = 256;
  const screen = new THREE.CanvasTexture(screenCanvas), cluster = new THREE.CanvasTexture(clusterCanvas);
  for (const texture of [screen, cluster]) { texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; }
  const screenMaterial = new THREE.MeshBasicMaterial({ map: screen, color: '#c8d8df', toneMapped: false });
  const clusterMaterial = new THREE.MeshBasicMaterial({ map: cluster, color: '#c8d8df', toneMapped: false });
  const trim = new THREE.MeshStandardMaterial({ color: '#161c23', roughness: .64, metalness: .18 });
  const satin = new THREE.MeshStandardMaterial({ color: '#7a858c', roughness: .32, metalness: .85 });
  const display = new THREE.Group(); display.name = 'dashboard-navigation'; display.position.set(-.1, .98, -.4); display.rotation.set(-.15, .14, 0); group.add(display);
  const bezel = new THREE.Mesh(new RoundedBoxGeometry(.48, .285, .026, 4, .016), trim); display.add(bezel);
  const map = new THREE.Mesh(new THREE.PlaneGeometry(.444, .25), screenMaterial); map.position.z = .014; map.name = 'dashboard-map-screen'; display.add(map);
  const mount = new THREE.Mesh(new RoundedBoxGeometry(.18, .055, .12, 3, .014), trim); mount.position.set(-.1, .817, -.43); group.add(mount);
  const instruments = new THREE.Mesh(new THREE.PlaneGeometry(.288, .096), clusterMaterial); instruments.name = 'dashboard-instruments'; instruments.position.set(.37, .8545, -.394); instruments.rotation.x = -.14; group.add(instruments);
  const floor = new THREE.Mesh(new RoundedBoxGeometry(1.34, .065, 1.75, 2, .025), trim); floor.position.set(0, .28, .12); group.add(floor);
  const mirror = new THREE.Mesh(new RoundedBoxGeometry(.2, .056, .025, 3, .014), trim); mirror.position.set(0, 1.265, -.16); group.add(mirror);
  const mirrorFace = new THREE.Mesh(new THREE.PlaneGeometry(.18, .039), new THREE.MeshStandardMaterial({ color: '#253b48', metalness: .95, roughness: .09, envMapIntensity: 1.3 })); mirrorFace.position.set(0, 0, .014); mirror.add(mirrorFace);
  const lip = new THREE.Mesh(new RoundedBoxGeometry(.48, .005, .004, 2, .002), satin); lip.position.set(0, -.136, .014); display.add(lip);
  // A separate close-view liner gives the driver thin padded pillars and a proper ceiling,
  // instead of showing the exterior model's thick display-mesh window surrounds.
  const liner = new THREE.Group(); liner.name = 'cockpit-headliner'; liner.visible = false; group.add(liner);
  const lining = new THREE.MeshStandardMaterial({ color: '#171f27', roughness: .96 });
  const ceiling = new THREE.Mesh(new RoundedBoxGeometry(1.35, .035, 1.25, 4, .015), lining); ceiling.position.set(0, 1.4, .4); liner.add(ceiling);
  for (const side of [-1, 1]) {
    const pillar = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(side * .74, .9, -.65), new THREE.Vector3(side * .69, 1.12, -.4), new THREE.Vector3(side * .62, 1.38, -.12)]), 16, .027, 8), lining); liner.add(pillar);
  }
  const header = new THREE.Mesh(new RoundedBoxGeometry(1.26, .05, .065, 3, .025), lining); header.position.set(0, 1.37, -.12); liner.add(header);
  const fonts = { display: getComputedStyle(document.documentElement).getPropertyValue('--font-disp').trim() || 'sans-serif', body: getComputedStyle(document.documentElement).getPropertyValue('--font-ui').trim() || 'sans-serif' };
  let cancelled = false, wheel: THREE.Object3D | undefined, lastPaint = -Infinity;
  const axis = new THREE.Vector3(0, .28, .96).normalize();
  function paint(navigation: CarNavigation, force = false) {
    const now = performance.now(); if (!force && now - lastPaint < 90) return;
    lastPaint = now; paintCarNavigation(screenCanvas.getContext('2d')!, clusterCanvas.getContext('2d')!, navigation, fonts);
    screen.needsUpdate = true; cluster.needsUpdate = true;
    group.userData.navigation = { x: navigation.x, z: navigation.z, heading: navigation.heading, destination: navigation.destination, remaining: navigation.remaining, progress: navigation.progress, paintedAt: now };
  }
  paint({ x: -18.5, z: 116, heading: 0, speed: 0, destination: 'StatOz City' }, true);
  const ready = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(publicAsset('/assets/city/statoz-cockpit.glb')).then(gltf => {
    if (cancelled) { dispose(gltf.scene); return; }
    group.add(gltf.scene); wheel = gltf.scene.getObjectByName('cockpit-steering_wheel');
    if (!wheel) throw new Error('Cockpit steering wheel missing');
    gltf.scene.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; if (object.material.name.includes('ambient_glow')) { const material = object.material as THREE.MeshStandardMaterial; material.emissive.set(P.cyan); material.emissiveIntensity = .18; } } });
    group.userData.assetReady = true;
  });
  return {
    group, ready, screenCanvas, clusterCanvas, screen, cluster, paint,
    update(steer: number, inside: number, portrait: boolean) { if (wheel) wheel.quaternion.setFromAxisAngle(axis, -steer * 4.2); liner.visible = inside > .3; display.position.x = portrait ? 0 : -.1; mount.position.x = display.position.x; },
    grip(angle: number, target: THREE.Vector3) { target.set(Math.cos(angle) * .17, Math.sin(angle) * .17, -Math.sin(angle) * .05); if (wheel) target.applyQuaternion(wheel.quaternion); target.x += .37; target.y += .8; target.z -= .141; return target; },
    cancelLoad() { cancelled = true; },
  };
}

function dispose(root: THREE.Object3D) {
  const materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>(), geometries = new Set<THREE.BufferGeometry>();
  root.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); for (const material of Array.isArray(object.material) ? object.material : [object.material]) { materials.add(material); for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value); } } });
  geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose());
}
