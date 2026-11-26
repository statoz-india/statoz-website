import { publicAsset } from '@statoz/design-system/asset';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import type { CityKit } from './city-kit';
import { CITY_PALETTE as P } from './city-config';
import { crestEmblem, crestMaterials, CREST_SIZE } from './city-crest';
import { AVENUE } from './city-roads';

const GATE = { x: -17, z: 100, half: 11, height: 17.2 };
const PLAZA = { minX: -47, maxX: 13, minZ: 176, maxZ: 214, top: 1.2 };

/**
 * The way into StatOz City. A raised, wet plaza where the opening is framed; an avenue of uplit
 * trees; and one calm gate: two tapered pylons with light seams that rise as the car approaches,
 * and a floating lintel carrying the emblem and the name in metal letters.
 */
export function buildGateway(kit: CityKit, facadeBox: (w: number, h: number, d: number, x: number, z: number) => THREE.Mesh, mobile: boolean) {
  const { box, material } = kit;
  const resources: { dispose(): void }[] = [];
  // Gunmetal, not black: a metal's colour is its reflectance, and a near-black one reflects nothing of the city.
  // Satin rather than mirror: facing the dark avenue, a pure metal only reflects darkness; a little diffuse
  // lets the moon and the street lamps model the pylons.
  const metal = new THREE.MeshPhysicalMaterial({ color: '#4f5e70', metalness: .6, roughness: .36, clearcoat: .5, clearcoatRoughness: .22, envMapIntensity: 1.5 });
  const seamMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(P.cyan).multiplyScalar(2.2), toneMapped: false });
  const underglow = new THREE.MeshBasicMaterial({ color: new THREE.Color('#dff7ff').multiplyScalar(1.6), toneMapped: false });
  resources.push(metal, seamMaterial, underglow);

  // Pylons: tapered profiles, bevelled, with a recessed groove that holds the light seam.
  const profile = new THREE.Shape(); profile.moveTo(-.9, 0); profile.lineTo(.9, 0); profile.lineTo(.5, GATE.height); profile.lineTo(-.5, GATE.height); profile.closePath();
  const pylonGeometry = new THREE.ExtrudeGeometry(profile, { depth: 2.4, bevelEnabled: true, bevelThickness: .06, bevelSize: .06, bevelSegments: 2 }); pylonGeometry.translate(0, 0, -1.2);
  const seams: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const pylon = new THREE.Mesh(pylonGeometry, metal); pylon.position.set(GATE.x + side * GATE.half, 0, GATE.z); pylon.castShadow = true; kit.details.add(pylon);
    const groove = box(.18, GATE.height - 1.2, .2, GATE.x + side * (GATE.half - .74), GATE.height / 2, GATE.z, material('#05080d', 0, .5)); groove.rotation.z = side * -.023;
    const seamGeometry = new THREE.BoxGeometry(.07, GATE.height - 1.6, .07); seamGeometry.translate(0, (GATE.height - 1.6) / 2, 0);
    const seam = new THREE.Mesh(seamGeometry, seamMaterial); seam.position.set(GATE.x + side * (GATE.half - .78), .6, GATE.z + .04); seam.rotation.z = side * -.023;
    kit.details.add(seam); seams.push(seam); resources.push(seamGeometry);
  }
  resources.push(pylonGeometry);
  // A floating lintel: a slim blade with a light line beneath it.
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(GATE.half * 2 + 2.2, .42, 1.7), metal); lintel.position.set(GATE.x, GATE.height + .55, GATE.z); lintel.castShadow = true; kit.details.add(lintel);
  const underline = new THREE.Mesh(new THREE.BoxGeometry(GATE.half * 2 - 1.4, .04, .5), underglow); underline.position.set(GATE.x, GATE.height + .32, GATE.z); kit.details.add(underline);
  resources.push(lintel.geometry, underline.geometry);
  const gateLight = new THREE.PointLight('#bfefff', 0, 34, 1.7); gateLight.position.set(GATE.x, GATE.height - 2, GATE.z + 3); kit.details.add(gateLight);

  // The emblem and the name sit on the lintel; the letters load with a small subset of Droid Sans Bold.
  const texture = new THREE.TextureLoader().load(publicAsset('/assets/icons/app_logo.png')); texture.colorSpace = THREE.SRGBColorSpace;
  const emblemMaterials = crestMaterials(texture);
  const emblem = crestEmblem(emblemMaterials); emblem.scale.setScalar(1.7 / CREST_SIZE); emblem.position.set(GATE.x - 6.3, GATE.height + 1.65, GATE.z); kit.details.add(emblem);
  const letterMaterial = new THREE.MeshPhysicalMaterial({ color: '#c9d6df', metalness: 1, roughness: .28, clearcoat: .6, emissive: P.cyan, emissiveIntensity: 0, envMapIntensity: 1.8 });
  resources.push(texture, letterMaterial, ...Object.values(emblemMaterials));
  let letters: THREE.Mesh | null = null, disposed = false;
  new FontLoader().load(publicAsset('/assets/city/fonts/droid_sans_bold.typeface.json'), font => {
    if (disposed) return;
    const geometry = new TextGeometry('STATOZ CITY', { font, size: 1.18, depth: .3, curveSegments: 6, bevelEnabled: true, bevelThickness: .03, bevelSize: .025, bevelSegments: 2 });
    geometry.computeBoundingBox(); const box3 = geometry.boundingBox!;
    geometry.translate(-(box3.max.x + box3.min.x) / 2, 0, -.15);
    letters = new THREE.Mesh(geometry, letterMaterial); letters.position.set(GATE.x + 1.2, GATE.height + .78, GATE.z); letters.castShadow = true; kit.details.add(letters);
    resources.push(geometry);
  });

  // The avenue: two rows of uplit trees on each promenade, slim lamps, and a lawn strip.
  const lawn = material('#10302a', 0, .95);
  for (const side of [-1, 1]) {
    for (let z = 92; z <= 162; z += 18) box(2.6, .14, 14, AVENUE.x + side * 8.8, .16, z + 6, lawn);
    for (let z = 94; z <= 166; z += 9) {
      for (const offset of [6.6, 11]) {
        const x = AVENUE.x + side * offset + (z % 18 ? 0 : side * .4);
        if (offset === 11 && (z / 9) % 2) continue;
        kit.tree(x, z, .95);
        kit.pool(x, z, 2.4, '#d9f4ff', .32, .2); box(.3, .06, .3, x + .6, .18, z, material('#e4f8ff', 2));
      }
    }
    for (let z = 104; z <= 164; z += 20) {
      const x = AVENUE.x + side * 4.2;
      box(.12, 7.2, .12, x, 3.6, z, material('#2b3646', 0, .4)); box(.5, .1, 1.6, x - side * .3, 7.2, z, material('#2b3646', 0, .4));
      box(.36, .05, 1.3, x - side * .3, 7.14, z, material('#f2f8ff', 2.2));
      kit.pool(x - side * 1.6, z, 5.4, '#e7f3ff', .34); kit.reflection(x - side * 1.4, z, '#e7f3ff', .55, 9);
      kit.lampSpot(x - side * .3, 5.9, z, '#e7f3ff');
    }
  }
  // Set-back towers frame the avenue without crowding it.
  // Set-back towers frame the far end of the avenue; the near blocks stay low so the plaza feels open.
  for (const side of [-1, 1]) for (const [z, h, w, offset] of [[104, 34, 11, 37], [124, 24, 12, 41], [150, 9, 16, 38]] as const) {
    const x = AVENUE.x + side * offset;
    box(w + 2, 3.2, 14, x, 1.6, z, material('#141c28', 0, .6));
    facadeBox(w, h, 11, x, z); box(w * .62, 2, 6.5, x, h + 1, z, material('#1b2433', 0, .5));
    if (h > 20) box(w + .3, .18, 11.3, x, h + .09, z, material(P.cyan, .5));
    kit.claim('avenue tower', x - w / 2 - 1, z - 7, x + w / 2 + 1, z + 7);
  }

  // The plaza: a raised terrace of wet granite, reached by broad steps from the avenue.
  const plazaWidth = PLAZA.maxX - PLAZA.minX, plazaDepth = PLAZA.maxZ - PLAZA.minZ, cx = (PLAZA.minX + PLAZA.maxX) / 2, cz = (PLAZA.minZ + PLAZA.maxZ) / 2;
  box(plazaWidth, PLAZA.top, plazaDepth, cx, PLAZA.top / 2, cz, material('#141d2a', 0, .7));
  for (let step = 0; step < 4; step++) box(plazaWidth - 18, PLAZA.top * (step + 1) / 4, 2, cx, PLAZA.top * (step + 1) / 8, PLAZA.minZ - 7 + step * 2, material('#1a2533', 0, .7));
  for (const side of [-1, 1]) {
    const x = side < 0 ? PLAZA.minX + .4 : PLAZA.maxX - .4;
    box(.8, .9, plazaDepth, x, PLAZA.top + .45, cz, material('#1a2533', 0, .7)); box(.84, .05, plazaDepth, x, PLAZA.top + .92, cz, material(P.cyan, .45));
  }
  const granite = kit.canvasTexture(256, 256, (c, w, h) => {
    c.fillStyle = '#121a26'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 2400; i++) { c.fillStyle = 'rgba(160,190,220,' + (Math.random() * .05) + ')'; c.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
    c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2);
  });
  granite.wrapS = granite.wrapT = THREE.RepeatWrapping; granite.repeat.set(plazaWidth / 3, plazaDepth / 3);
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(plazaWidth - 1.6, plazaDepth), new THREE.MeshStandardMaterial({ map: granite, roughness: .22, metalness: .1, transparent: !mobile, opacity: mobile ? 1 : .62, envMapIntensity: 1.6 }));
  surface.rotation.x = -Math.PI / 2; surface.position.set(cx, PLAZA.top + .012, cz); surface.receiveShadow = true; kit.details.add(surface);
  resources.push(surface.geometry, surface.material as THREE.Material, granite);
  let mirror: Reflector | null = null;
  if (!mobile) {
    mirror = new Reflector(new THREE.PlaneGeometry(plazaWidth - 1.6, plazaDepth), { textureWidth: 512, textureHeight: 384, color: '#55657a', clipBias: .003 });
    mirror.rotation.x = -Math.PI / 2; mirror.position.set(cx, PLAZA.top + .006, cz); kit.details.add(mirror);
    // The reflection reuses this frame's shadow maps, leaves out small moving things, and refreshes on
    // alternate frames: the plaza is only on screen while the camera drifts slowly, so a frame's lag is invisible.
    const reflect = mirror.onBeforeRender, skip = new Set(['statoz-coupe', 'free-roam-car', 'free-roam-avatar', 'tail-trails', 'headline-stream', 'speed-streaks', 'sparks', 'ambient-motes', 'city-moving']);
    // Lights stay on in the reflection: a different light count would give every reflected material a second
    // shader program, and linking those synchronously froze the first frame for seconds. Only the meshes go.
    const hideable = new Map<THREE.Object3D, THREE.Object3D[]>();
    const meshesOf = (root: THREE.Object3D, out: THREE.Object3D[] = []) => {
      let lit = false; root.traverse(object => { if ((object as THREE.Light).isLight) lit = true; });
      if (!lit) out.push(root); else for (const child of root.children) meshesOf(child, out);
      return out;
    };
    let tick = 0;
    mirror.onBeforeRender = function (...args: Parameters<THREE.Object3D['onBeforeRender']>) {
      if (tick++ % 2) return;
      const [renderer, scene] = args, autoUpdate = renderer.shadowMap.autoUpdate, hidden: THREE.Object3D[] = [];
      renderer.shadowMap.autoUpdate = false;
      for (const child of scene.children) {
        if (!child.visible || !skip.has(child.name)) continue;
        if (!hideable.has(child)) hideable.set(child, meshesOf(child));
        for (const object of hideable.get(child)!) if (object.visible) { object.visible = false; hidden.push(object); }
      }
      reflect.apply(this, args);
      hidden.forEach(object => { object.visible = true; }); renderer.shadowMap.autoUpdate = autoUpdate;
    };
  }
  // Slim light lines mark the top of the steps; they read as light, not as objects.
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    const x = AVENUE.x + side * (7.5 + i * 2.2);
    box(.36, 2.2 - i * .45, .36, x, PLAZA.top + (2.2 - i * .45) / 2, PLAZA.minZ + 1.2, material('#0f1722', 0, .4));
    box(.06, 1.8 - i * .45, .38, x, PLAZA.top + .2 + (1.8 - i * .45) / 2, PLAZA.minZ + 1.2, material('#d8f3ff', 1.6));
    kit.pool(x, PLAZA.minZ + 1.6, 2.2, '#cdeeff', .3, PLAZA.top + .03);
  }
  kit.claim('plaza', PLAZA.minX, PLAZA.minZ - 8, PLAZA.maxX, PLAZA.maxZ);

  return {
    /** wake: 0..1 as the car approaches. */
    setWake(wake: number) {
      seams.forEach(seam => { seam.scale.y = Math.max(.001, wake); });
      underglow.color.setScalar(.4 + 1.4 * wake); letterMaterial.emissiveIntensity = .14 * wake; gateLight.intensity = 60 * wake;
    },
    /** The mirror floor only renders while the plaza can be seen. */
    setPlazaVisible(visible: boolean) { if (mirror) mirror.visible = visible; },
    dispose() { disposed = true; resources.forEach(resource => resource.dispose()); mirror?.dispose(); letters?.geometry.dispose(); },
  };
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

/**
 * Reflections of the finished, fully lit city: a cube snapshot from above the grounds, filtered to the
 * same 256 size as `cityEnvironment`, so materials keep their compiled programs when the scene switches
 * to it. The snapshot renders into linear HDR targets, which use the same programs as the composer's
 * target; without a composer the city's programs were compiled for the screen, so don't call it there.
 */
export function captureCityEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene, position: THREE.Vector3) {
  const cube = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
  const camera = new THREE.CubeCamera(.5, 2400, cube); camera.position.copy(position);
  // This can run before the first city frame, so the faces must create and draw the sun's shadow map themselves.
  const previous = renderer.getRenderTarget();
  try { camera.update(renderer, scene); }
  finally { renderer.setRenderTarget(previous); }
  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromCubemap(cube.texture);
  generator.dispose(); cube.dispose();
  return target;
}
