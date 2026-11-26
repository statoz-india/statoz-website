import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CITY_PALETTE as P } from './city-config';
import { loadCarAsset } from './city-car-asset';
import { createCarCockpit } from './city-car-cockpit';
import { loadPeople } from './city-kenney';

/**
 * The StatOz fastback: a licensed exterior and authored cockpit, in metres with its nose along local −Z. It is right-hand drive for
 * left-hand traffic: the driver sits on the car's right (+X). The same model serves the outside
 * shots and the cockpit: the cabin, windshield, dashboard, wheel, hands and HUD are real geometry.
 */
export const DRIVER_EYE = new THREE.Vector3(.37, 1.16, .52);

export function createDriveCar() {
  const group = new THREE.Group(); group.name = 'statoz-coupe';
  const bodywork = new THREE.Group(); group.add(bodywork);
  const cockpitDetail = createCarCockpit();
  const exterior = new THREE.Group(), cockpit = cockpitDetail.group;
  bodywork.add(exterior, cockpit);

  const neon = new THREE.MeshBasicMaterial({ color: new THREE.Color(P.cyan).multiplyScalar(2.2), toneMapped: false });
  const headlamp = new THREE.MeshBasicMaterial({ color: new THREE.Color('#e9fbff').multiplyScalar(3), toneMapped: false });
  const tail = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff2457').multiplyScalar(1.6), toneMapped: false });
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => { const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh; };

  // A coherent fastback mesh replaces the old lofted shell and decorative wheel-arch rings.
  const asset = loadCarAsset(exterior, headlamp, tail);
  // Seat the quad lamp lenses just ahead of the baked grille so their luminous faces
  // remain visible at a low driving angle, with the source bezels framing each lens.
  for (const side of [-1, 1]) for (const x of [.4, .576]) {
    const lens = add(new THREE.SphereGeometry(.055, 16, 10), headlamp, exterior, side * x, .61, -2.35);
    lens.scale.z = .18; lens.castShadow = false;
  }
  for (const side of [-1, 1]) {
    add(new RoundedBoxGeometry(.025, .018, 1.65, 2, .008), neon, exterior, side * .86, .26, .08);
  }

  // The driver: a Kenney Mini Character in the kit's driving pose, seated on the right, facing the nose (−Z).
  const driver = new THREE.Group(); driver.name = 'coupe-driver'; driver.position.set(DRIVER_EYE.x, 0, 0); bodywork.add(driver);
  let driverMixer: THREE.AnimationMixer | null = null;
  const driverReady = loadPeople().then(kit => {
    const rig = kit.character('male-d'), scale = 1.02 / kit.height, hip = kit.clips.drive.frames[0];
    rig.root.scale.setScalar(scale); rig.root.rotation.y = Math.PI;
    rig.root.position.set(0, .56 - hip[2 * 7 + 1] * scale, .74 + hip[2 * 7 + 2] * scale);
    rig.root.traverse(object => { if (object instanceof THREE.Mesh) object.frustumCulled = false; });
    driver.add(rig.root); rig.play('drive', 0); rig.mixer.update(0); driverMixer = rig.mixer;
  }).catch(() => undefined);

  // Headlights reach down the road; a soft glow sits under the car.
  const headlights: THREE.SpotLight[] = [];
  for (const side of [-1, 1]) {
    const light = new THREE.SpotLight('#cff6ff', 0, 46, .36, .6, 1.3); light.position.set(side * .58, .62, -2.3);
    light.target.position.set(side * 1.4, 0, -24); group.add(light, light.target); headlights.push(light);
  }
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 64;
  const glowContext = glowCanvas.getContext('2d')!, glowGradient = glowContext.createRadialGradient(32, 32, 0, 32, 32, 32);
  glowGradient.addColorStop(0, 'rgba(255,255,255,.9)'); glowGradient.addColorStop(.55, 'rgba(255,255,255,.25)'); glowGradient.addColorStop(1, 'rgba(255,255,255,0)'); glowContext.fillStyle = glowGradient; glowContext.fillRect(0, 0, 64, 64);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3, 6), new THREE.MeshBasicMaterial({ color: P.cyan, map: new THREE.CanvasTexture(glowCanvas), transparent: true, opacity: .22, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = .03; bodywork.add(glow);

  // Tail-light trails: a ribbon through recent rear positions, fading with age.
  const TRAIL = 46, trailPositions = new Float32Array(TRAIL * 2 * 3), trailAlpha = new Float32Array(TRAIL * 2);
  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3)); trailGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(trailAlpha, 1));
  const trailIndex: number[] = []; for (let i = 0; i < TRAIL - 1; i++) { const p = i * 2; trailIndex.push(p, p + 1, p + 2, p + 1, p + 3, p + 2); } trailGeometry.setIndex(trailIndex);
  const trail = new THREE.Mesh(trailGeometry, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: 'attribute float aAlpha; varying float vAlpha; void main(){ vAlpha = aAlpha; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying float vAlpha; void main(){ gl_FragColor = vec4(vec3(1.0, .16, .34) * vAlpha * 1.4, vAlpha); }' }));
  trail.frustumCulled = false; trail.name = 'tail-trails';
  const history: THREE.Vector3[] = [];
  const rear = new THREE.Vector3(), side = new THREE.Vector3();

  // Static cockpit details are merged by material, so small meshes become a handful of draw
  // calls. The loaded exterior, steering wheel and driver keep their independent animation pivots.
  for (const part of [exterior]) {
    const groups = new Map<string, { material: THREE.Material; geometries: THREE.BufferGeometry[]; meshes: THREE.Mesh[] }>();
    for (const child of [...part.children]) {
      if (!(child instanceof THREE.Mesh) || child.children.length || Array.isArray(child.material)) continue;
      child.updateMatrix();
      const geometry = child.geometry.clone().applyMatrix4(child.matrix);
      const key = (child.material as THREE.Material).uuid + '/' + Object.keys(geometry.attributes).sort().join(',') + '/' + !!geometry.index;
      if (!groups.has(key)) groups.set(key, { material: child.material as THREE.Material, geometries: [], meshes: [] });
      groups.get(key)!.geometries.push(geometry); groups.get(key)!.meshes.push(child);
    }
    for (const item of groups.values()) {
      if (item.meshes.length < 2) { item.geometries.forEach(geometry => geometry.dispose()); continue; }
      const merged = mergeGeometries(item.geometries, false);
      item.geometries.forEach(geometry => geometry.dispose());
      if (!merged) continue;
      item.meshes.forEach(mesh => { part.remove(mesh); mesh.geometry.dispose(); });
      const mesh = new THREE.Mesh(merged, item.material); mesh.castShadow = true; part.add(mesh);
    }
  }

  let lightPower = 1, brake = 0, roll = 0, squat = 0, lastSpeed = 0, visible = true;
  return {
    group, bodywork, trail, driver,
    screenCanvas: cockpitDetail.screenCanvas, clusterCanvas: cockpitDetail.clusterCanvas, screen: cockpitDetail.screen, cluster: cockpitDetail.cluster,
    paintNavigation: cockpitDetail.paint,
    ready: Promise.all([asset.ready, cockpitDetail.ready, driverReady]),
    cancelLoad() { asset.cancelLoad(); cockpitDetail.cancelLoad(); },
    // Keep light membership stable across journey/roam handoffs; visibility changes otherwise
    // recompile every lit city shader on the first interactive frame.
    setVisible(value: boolean) { visible = value; bodywork.visible = value; trail.visible = value; headlights.forEach(light => { light.visible = true; light.intensity = value ? 32 * lightPower : 0; }); },
    setLights(power: number) { lightPower = power; headlamp.color.setScalar(.2 + 2.8 * power); },
    /** Portrait screens see too much ceiling from the seat, so the roof panel slides open there. */
    setRoofOpen(open: boolean) { asset.setRoofOpen(open); },
    /** distance in metres, steer in radians, inside 0..1 for the cockpit, speed in m/s. */
    update(distance: number, steer: number, inside: number, speed: number, dt: number, time: number) {
      asset.update(distance, steer, inside);
      cockpitDetail.update(steer, inside, window.innerWidth <= 700);
      const accel = dt > 0 ? (speed - lastSpeed) / dt : 0; lastSpeed = speed;
      brake += ((accel < -1.2 || speed < .2 ? 1 : 0) - brake) * Math.min(1, dt * 6);
      tail.color.setRGB(1.1 + brake * 1.3, .04 + brake * .03, .16 * (1 + brake));
      roll += (THREE.MathUtils.clamp(-steer * speed * .05, -.035, .035) - roll) * Math.min(1, dt * 4);
      squat += (THREE.MathUtils.clamp(-accel * .004, -.02, .02) - squat) * Math.min(1, dt * 5);
      for (const part of [exterior, cockpit, driver]) part.rotation.set(squat, 0, roll);
      headlights.forEach(light => { light.intensity = visible ? 32 * lightPower : 0; });
      // The camera occupies the driver's seat. Hide the old mannequin there rather than
      // drawing oversized placeholder forearms across the instrument panel.
      driver.visible = inside < .5;
      cockpit.visible = inside > .02 || bodywork.visible;
      driverMixer?.update(dt);
      // Trail through the rear lamp position, resampled every 0.6 m of travel.
      group.updateMatrixWorld();
      rear.set(0, .8, 2.34).applyMatrix4(group.matrixWorld);
      if (!history.length || history[0].distanceTo(rear) > .6) { history.unshift(rear.clone()); if (history.length > TRAIL) history.pop(); }
      if (history.length && history[0].distanceTo(rear) > 30) history.length = 0;
      side.set(1, 0, 0).applyQuaternion(group.quaternion).multiplyScalar(.72);
      const moving = Math.min(1, speed / 6);
      for (let i = 0; i < TRAIL; i++) {
        const p = history[Math.min(i, history.length - 1)] || rear;
        trailPositions.set([p.x - side.x, p.y, p.z - side.z, p.x + side.x, p.y, p.z + side.z], i * 6);
        const fade = (1 - i / TRAIL) ** 2 * moving * .55 * (i < history.length ? 1 : 0);
        trailAlpha[i * 2] = trailAlpha[i * 2 + 1] = fade;
      }
      (trailGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true; (trailGeometry.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    },
    resetTrail() { history.length = 0; },
  };
}
export type DriveCar = ReturnType<typeof createDriveCar>;
