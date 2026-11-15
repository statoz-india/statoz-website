import * as THREE from 'three';
import type { CityKit } from './city-kit';
import { CITY_PALETTE as P } from './city-config';

/** The south approach stays on the existing north/south street. */
export function buildGateway(kit: CityKit) {
  const { box, material } = kit;
  const x = -17, z = 100;
  const alloy = material('#12263a', 0, .26);
  const neon = material(P.cyan, 1.6, .2);
  const wet = material('#081722', 0, .18);
  box(26, .1, 48, x, .02, z + 9, wet);
  for (const side of [-1, 1]) {
    box(3, 17, 4, x + side * 11, 8.5, z, alloy);
    box(.22, 16, .2, x + side * 9.45, 8, z + 2.1, neon);
    box(.35, .08, 44, x + side * 8, .12, z + 7, neon);
    for (let i = 0; i < 7; i++) {
      box(.8, 1.5, .8, x + side * 8.5, .8, z - 12 + i * 6, alloy);
      box(.82, .14, .82, x + side * 8.5, 1.55, z - 12 + i * 6, neon);
    }
    // Long pools follow the emissive bars on the wet entrance apron.
    for (let i = 0; i < 5; i++) kit.pool(x + side * 8, z + i * 6, 5, P.cyan, .13, .14);
  }
  box(25, 3.7, 4, x, 16.5, z, alloy);
  box(25.2, .2, .2, x, 18.45, z + 2.1, neon);
  box(19, .16, .2, x, 14.65, z + 2.1, neon);
  kit.sign('STATOZ CITY', 'YOUR HOME GROUND', x + 1.9, 16.5, z + 2.14, 15, 2.5, P.cyan, 0);
  const texture = new THREE.TextureLoader().load('/assets/icons/app_logo.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false }));
  logo.position.set(x - 7.7, 16.5, z + 2.2); kit.details.add(logo);
  const light = new THREE.PointLight(P.cyan, 100, 50, 1.6); light.position.set(x, 11, z + 4); kit.details.add(light);
}

/** A small, locally authored lighting environment gives metal and wet ground reflected neon. */
export function cityEnvironment(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#101d32');
  const resources: THREE.Mesh[] = [];
  for (const [x, y, z, tint] of [[-9, 5, 0, P.cyan], [9, 4, -2, P.violet], [0, 8, -8, '#d7e8ff'], [0, 3, 9, P.cyan]] as const) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(2), side: THREE.DoubleSide }));
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); scene.add(mesh); resources.push(mesh);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(scene, .12, .1, 100);
  generator.dispose(); resources.forEach(mesh => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); });
  return target;
}
