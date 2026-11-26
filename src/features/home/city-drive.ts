import * as THREE from 'three';
import { CITY_OVERVIEW, CITY_PALETTE as P, type CityPoint } from './city-config';
import { JOURNEY_CHAPTERS, JOURNEY_END, JOURNEY_MISSIONS } from './city-journey-config';
import { clamp01, missionChoice, observeMissionChoice, smooth, smoother } from './city-journey-motion';
import { createDriveCar, DRIVER_EYE } from './city-drive-car';
import { createSparks, createSpeedStreaks } from './city-particles';

const V = (p: CityPoint) => new THREE.Vector3(...p);
/** The coupe waits on the approach, just short of the gate at z = 100. */
export const DRIVE_START: CityPoint = [-18.5, 0, 116];
export const GATE_Z = 100;
// Left-hand traffic throughout: the coupe keeps to the left lane of every street it uses.
const stops: CityPoint[] = [DRIVE_START, [-18.5, 0, -20], [22, 0, 4.6], [-15.5, 0, 26], [48, 0, 46.4]];
const routePoints: CityPoint[][] = [
  [stops[0], stops[1]],
  [stops[1], [-18.5, 0, -84.6], [83.5, 0, -84.6], [83.5, 0, 4.6], stops[2]],
  [stops[2], [-15.5, 0, 4.6], stops[3]],
  [stops[3], [-15.5, 0, 46.4], stops[4]],
];
const STOP_NAMES = ['The Oval', 'The Floodlights', 'The Blacktop', 'Neon Circuit'];
const VENUES: CityPoint[] = [[-49, 0, -30], [22, 0, -27], [-41, 0, 26], [48, 0, 25.5]];
const VENUE_SCALE: [number, number][] = [[27, 27], [29, 21], [20, 15], [28, 17]];
const ACCENTS = [P.cyan, P.lime, P.gold, P.violet];

/** Straight sections with bounded corner arcs keep the coupe inside the streets. */
function road(points: CityPoint[]) {
  const curve = new THREE.CurvePath<THREE.Vector3>(), vertices = points.map(V); let last = vertices[0];
  for (let i = 1; i < vertices.length - 1; i++) {
    const c = vertices[i], before = c.clone().sub(vertices[i - 1]), after = vertices[i + 1].clone().sub(c);
    const radius = Math.min(4.5, before.length() * .3, after.length() * .3);
    const entry = c.clone().addScaledVector(before.normalize(), -radius), exit = c.clone().addScaledVector(after.normalize(), radius);
    curve.add(new THREE.LineCurve3(last, entry)); curve.add(new THREE.QuadraticBezierCurve3(entry, c, exit)); last = exit;
  }
  curve.add(new THREE.LineCurve3(last, vertices.at(-1)!)); return curve;
}
const routes = routePoints.map(road), lengths = routes.map(path => path.getLength());
/** The coupe's exact paths, so street traffic can keep its manoeuvres clear of them. */
export const DRIVE_ROUTES: readonly THREE.CurvePath<THREE.Vector3>[] = routes;
const navigationRoutes = routes.map(path => path.getSpacedPoints(150));
const offsets = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = lengths.reduce((a, b) => a + b, 0);

type Pose = { position: THREE.Vector3; target: THREE.Vector3; fov: number };
const bezier = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3, t: number) => {
  const q = 1 - t; return a.clone().multiplyScalar(q * q * q).addScaledVector(b, 3 * q * q * t).addScaledVector(c, 3 * q * t * t).addScaledVector(d, t * t * t);
};
/** A crane move: rise away from the first pose, travel high, and settle into the second. */
function crane(from: Pose, to: Pose, t: number, lift: number): Pose {
  if (t <= 0) return from; if (t >= 1) return to;
  const span = from.position.distanceTo(to.position), rise = Math.min(lift, 4 + span * .32);
  const p1 = from.position.clone().add(new THREE.Vector3(0, rise, 0)).addScaledVector(from.position.clone().sub(from.target).setY(0).normalize(), rise * .4);
  const p2 = to.position.clone().add(new THREE.Vector3(0, rise * .8, 0)).addScaledVector(to.position.clone().sub(to.target).setY(0).normalize(), rise * .5);
  const t1 = from.target.clone().lerp(to.target, .25).add(new THREE.Vector3(0, rise * .15, 0)), t2 = from.target.clone().lerp(to.target, .75);
  return { position: bezier(from.position, p1, p2, to.position, t), target: bezier(from.target, t1, t2, to.target, t), fov: THREE.MathUtils.lerp(from.fov, to.fov, t) };
}

export function createCityDrive(scene: THREE.Scene, camera: THREE.PerspectiveCamera, host: HTMLElement) {
  const shell = host.closest<HTMLElement>('[data-scene-status]')!;
  const mobile = window.innerWidth <= 700;
  const car = createDriveCar(); scene.add(car.group, car.trail);

  const streaks = createSpeedStreaks(mobile); scene.add(streaks.mesh);
  const sparks = createSparks(); scene.add(sparks.points);
  const signals = new THREE.Group(); signals.name = 'mission-signals'; scene.add(signals);

  // Mission grounds answer with their own light: soft roving beams and a boundary ring.
  type VenueEffect = { group: THREE.Group; uniforms: { uActive: { value: number }; uColor: { value: THREE.Color } }; beams: THREE.Mesh[]; ring: THREE.Mesh; center: THREE.Vector3; pulse: number };
  const beamGeometry = new THREE.ConeGeometry(7, 22, 24, 1, true);
  const venueEffects: VenueEffect[] = VENUES.map((venue, i) => {
    const group = new THREE.Group(); signals.add(group);
    const uniforms = { uActive: { value: 0 }, uColor: { value: new THREE.Color(ACCENTS[i]) } };
    const material = new THREE.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'varying vec2 vUv; uniform vec3 uColor; uniform float uActive; void main(){ float edge = pow(max(0.0, sin(vUv.x * 3.14159)), 3.0); float v = smoothstep(0.0, .08, vUv.y) * (1.0 - smoothstep(.8, 1.0, vUv.y)); gl_FragColor = vec4(uColor * edge * v * .08 * uActive, 1.0); }' });
    const beams = [new THREE.Mesh(beamGeometry, material), new THREE.Mesh(beamGeometry, material)]; beams.forEach(beam => group.add(beam));
    const ring = new THREE.Mesh(new THREE.RingGeometry(1, 1.012, 96), new THREE.MeshBasicMaterial({ color: ACCENTS[i], transparent: true, opacity: .4, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    ring.position.set(venue[0], .5, venue[2]); ring.rotation.x = -Math.PI / 2; ring.scale.set(...VENUE_SCALE[i], 1); group.add(ring);
    return { group, uniforms, beams, ring, center: V(venue), pulse: 0 };
  });
  // A choice made in a mission preview lights its ground and throws sparks over it.
  const unobserveChoice = observeMissionChoice((next, previous) => {
    const index = next.sport !== previous.sport ? 0 : next.prediction !== previous.prediction ? 1 : next.answer !== previous.answer ? 2 : next.game !== previous.game ? 3 : -1;
    if (index < 0) return;
    const effect = venueEffects[index]; effect.pulse = 1;
    sparks.emit(effect.center.clone().add(new THREE.Vector3(0, 6, 0)), ACCENTS[index], mobile ? 40 : 90, 11, clock);
  });

  // Chevrons along the road after the gate show the way between stops.
  const chevron = new THREE.Shape(); chevron.moveTo(-.3, 0); chevron.lineTo(0, .38); chevron.lineTo(.3, 0); chevron.lineTo(.3, .16); chevron.lineTo(0, .54); chevron.lineTo(-.3, .16); chevron.closePath();
  const markers = new THREE.InstancedMesh(new THREE.ShapeGeometry(chevron), new THREE.MeshBasicMaterial({ color: P.cyan, transparent: true, opacity: .32, depthWrite: false, toneMapped: false }), 28);
  markers.frustumCulled = false; markers.instanceMatrix.setUsage(THREE.DynamicDrawUsage); signals.add(markers);
  const celebration = new THREE.Mesh(new THREE.SphereGeometry(.32, 16, 12), new THREE.MeshStandardMaterial({ color: P.gold, emissive: P.gold, emissiveIntensity: 1 })); signals.add(celebration);

  const missionPoses: Pose[] = JOURNEY_MISSIONS.map(chapter => ({ position: V(chapter.camera), target: V(chapter.target), fov: 50 }));
  const heroChapter = JOURNEY_CHAPTERS[0];
  let width = 1440, height = 950, clock = 0, lastDistance = 0, speed = 0, steerSmooth = 0;
  let view = { x: 0, y: 0 };
  const state = { gateWake: 0, colorBloom: 0, carLights: 0, inside: 0, speed: 0, distance: 0, mode: 'hero', heroWeight: 1 };
  const markerDummy = new THREE.Object3D(), markerSide = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const local = (x: number, y: number, z: number) => car.group.localToWorld(new THREE.Vector3(x, y, z));
  const fit = (pose: Pose): Pose => width < 701 ? { position: pose.position.clone().sub(pose.target).multiplyScalar(1.3).add(pose.target), target: pose.target.clone(), fov: pose.fov + 6 } : pose;
  // On a portrait phone the hero stands a little higher on the plaza and looks a little lower, so the avenue fills the lower half.
  const hero = (): Pose => ({ position: V(heroChapter.camera).add(new THREE.Vector3(0, width < 701 ? 1.6 : 0, width < 701 ? 4 : 0)), target: V(heroChapter.target).add(new THREE.Vector3(0, width < 701 ? -16 : 0, 0)), fov: width < 701 ? 64 : 46 });
  const overview = (): Pose => ({ position: V(width < 701 ? [225, 265, 310] : CITY_OVERVIEW.position), target: V(CITY_OVERVIEW.target), fov: width < 701 ? 54 : 50 });
  const chase = (): Pose => ({ position: local(width < 701 ? 3.6 : 2.8, width < 701 ? 2.4 : 1.9, width < 701 ? 8.4 : 6.6), target: local(0, .8, -1.6), fov: width < 701 ? 58 : 50 });
  function cockpit(time: number, speedFactor: number, steer: number): Pose {
    const bob = Math.sin(time * 8.3) * .004 * speedFactor, lift = Math.abs(Math.sin(time * 6.1)) * .006 * speedFactor;
    // Portrait screens sit the eye a little higher and further back, so the road shows above the wheel.
    const portrait = width < 701, eye = DRIVER_EYE.clone().add(new THREE.Vector3(portrait ? -.23 : 0, portrait ? .02 : 0, portrait ? .04 : 0));
    const look = new THREE.Vector3((portrait ? -.5 : DRIVER_EYE.x) + Math.sin(steer) * -9, eye.y - (portrait ? 2.25 : 1), -14);
    return { position: local(eye.x + bob, eye.y + lift, eye.z), target: car.group.localToWorld(look), fov: THREE.MathUtils.lerp(portrait ? 86 : 70, portrait ? 90 : 74, speedFactor) };
  }
  /** The orbit from the chase position, around the driver's door, into the driver's seat. */
  function orbitIn(t: number): Pose {
    const e = smoother(0, 1, t);
    const start = new THREE.Vector3(width < 701 ? 3.6 : 2.8, width < 701 ? 2.4 : 1.9, width < 701 ? 8.4 : 6.6), end = DRIVER_EYE.clone().add(new THREE.Vector3(width < 701 ? -.23 : 0, width < 701 ? .02 : 0, width < 701 ? .04 : 0));
    const position = bezier(start, new THREE.Vector3(4.4, 1.7, 2.2), new THREE.Vector3(1.6, 1.25, .4), end, e);
    const target = bezier(new THREE.Vector3(0, .8, -1.6), new THREE.Vector3(0, .9, -4), new THREE.Vector3(.3, 1, -9), new THREE.Vector3(width < 701 ? -.5 : DRIVER_EYE.x, end.y - (width < 701 ? 2.25 : 1), -14), e);
    return { position: car.group.localToWorld(position), target: car.group.localToWorld(target), fov: THREE.MathUtils.lerp(width < 701 ? 58 : 50, width < 701 ? 86 : 70, e) };
  }
  function placeCar(routeIndex: number, travel: number) {
    const path = routes[routeIndex], at = THREE.MathUtils.clamp(travel, 0, 1);
    const position = path.getPointAt(at), direction = path.getTangentAt(Math.min(.9999, at)).normalize();
    car.group.position.copy(position); car.group.rotation.set(0, Math.atan2(-direction.x, -direction.z), 0); car.group.updateMatrixWorld(true);
    const next = path.getTangentAt(Math.min(.9999, at + .02));
    let steer = Math.atan2(-next.x, -next.z) - car.group.rotation.y; steer = Math.atan2(Math.sin(steer), Math.cos(steer));
    return { distance: offsets[routeIndex] + at * lengths[routeIndex], steer: THREE.MathUtils.clamp(steer * 2.2, -.5, .5) };
  }

  function resize(w: number, h: number) {
    width = w; height = h;
  }

  function sample(progress: number, dt: number, time: number, active: boolean): Pose {
    const p = active ? THREE.MathUtils.clamp(progress, 0, JOURNEY_END) : JOURNEY_END;
    if (dt > 0) clock = time;
    let pose: Pose, inside = 0, routeIndex = 0, travel = 0, mode = 'hero', reading = 0;
    // Welcome → entry: the camera cranes down the avenue to the waiting coupe, then orbits into the seat.
    if (p < 1.3) {
      placeCar(0, 0);
      const heroPose = hero(), chasePose = chase();
      const descend = smoother(.1, 1, p);
      if (p < 1) {
        const p1 = heroPose.position.clone().add(new THREE.Vector3(0, 1.5, -28));
        const p2 = chasePose.position.clone().add(new THREE.Vector3(0, 7, 16));
        const t1 = new THREE.Vector3(-17, 9, 70), t2 = car.group.localToWorld(new THREE.Vector3(0, 1.2, -14));
        pose = { position: bezier(heroPose.position, p1, p2, chasePose.position, descend), target: bezier(heroPose.target, t1, t2, chasePose.target, descend), fov: THREE.MathUtils.lerp(heroPose.fov, chasePose.fov, descend) };
        mode = p < .1 ? 'hero' : 'chase';
      } else { pose = orbitIn((p - 1) / .3); inside = smooth(1.22, 1.3, p); mode = inside > .5 ? 'cockpit' : 'orbit'; }
    } else if (p < 2) {
      routeIndex = 0; travel = smoother(1.3, 1.88, p);
      placeCar(0, travel);
      const arrival = smoother(1.84, 2, p);
      pose = crane(cockpit(time, Math.min(1, speed / 18), steerSmooth), fit(missionPoses[0]), arrival, 16);
      inside = 1 - smooth(1.84, 1.9, p); mode = inside > .5 ? 'cockpit' : 'exterior';
    } else if (p < 5) {
      const chapter = Math.floor(p), t = p - chapter;
      routeIndex = chapter - 1;
      travel = smoother(.58, .88, t); placeCar(routeIndex, travel);
      const leave = smoother(.44, .6, t), arrival = smoother(.86, 1, t);
      const here = fit(missionPoses[chapter - 2]), next = fit(missionPoses[chapter - 1]);
      const seat = cockpit(time, Math.min(1, speed / 18), steerSmooth);
      pose = arrival > 0 ? crane(seat, next, arrival, 16) : crane(here, seat, leave, 16);
      inside = smooth(.54, .6, t) * (1 - smooth(.86, .92, t)); reading = 1 - smooth(.42, .5, t);
      mode = inside > .5 ? 'cockpit' : 'exterior';
    } else {
      routeIndex = 3; travel = 1; placeCar(3, 1);
      const out = smoother(5.48, 6, p);
      pose = crane(fit(missionPoses[3]), overview(), out, 30); reading = 1 - smooth(5.42, 5.6, p);
      mode = p >= 6 ? 'overview' : 'exterior';
    }
    const { distance, steer } = placeCar(routeIndex, travel);
    if (dt > 0) {
      const raw = Math.abs(distance - lastDistance) / dt;
      speed += (Math.min(raw, 40) - speed) * Math.min(1, dt * 4); lastDistance = distance;
      steerSmooth += (steer - steerSmooth) * Math.min(1, dt * 5);
    } else { lastDistance = distance; steerSmooth = steer; }
    const speedFactor = Math.min(1, speed / 18);
    car.setVisible(true);
    car.setLights(smooth(.55, .95, p));
    car.setRoofOpen(inside > .3);
    car.update(distance, steerSmooth, inside, speed, dt, time);
    // Speed streaks only belong to the cockpit view while the car is really moving.
    streaks.update(inside * smooth(.12, .5, speedFactor), distance);
    sparks.update(clock);

    state.gateWake = smooth(1.08, 1.38, p);
    state.colorBloom = smooth(GATE_Z + 1, GATE_Z - 9, car.group.position.z) * (p >= 1.3 ? 1 : 0) + (p >= 2 ? 1 : 0);
    state.colorBloom = Math.min(1, state.colorBloom);
    state.carLights = smooth(.55, .95, p); state.inside = inside; state.speed = speed; state.distance = distance; state.mode = mode;
    state.heroWeight = 1 - smooth(.02, .2, p);

    // Mission grounds light up while their copy is on screen.
    const current = Math.floor(p) - 2;
    venueEffects.forEach((effect, i) => {
      const stage = i + 2, presence = smooth(stage - .16, stage + .02, p) * (1 - smooth(stage + .45, stage + .62, p));
      effect.pulse = Math.max(0, effect.pulse - (dt || 0) * .8);
      const active = presence + effect.pulse * .8;
      effect.group.visible = active > .001; effect.uniforms.uActive.value = active;
      (effect.ring.material as THREE.MeshBasicMaterial).opacity = .35 * active + effect.pulse * .3;
      effect.beams.forEach((beam, j) => { const phase = time * .24 + j * Math.PI, source = effect.center.clone().add(new THREE.Vector3((j ? 1 : -1) * 17, 22, -15)); const target = effect.center.clone().add(new THREE.Vector3(Math.sin(phase) * 10, .4, Math.cos(phase) * 7)); beam.position.copy(source).add(target).multiplyScalar(.5); beam.quaternion.setFromUnitVectors(up, source.sub(target).normalize()); });
    });
    const sport = missionChoice().sport, sportColors: Record<string, string> = { Cricket: P.cyan, Football: P.lime, Basketball: P.gold, Racing: P.violet };
    (venueEffects[0].ring.material as THREE.MeshBasicMaterial).color.set(sport ? sportColors[sport] || P.cyan : P.cyan);
    markers.visible = p >= 1.9 && p < 5.5;
    if (markers.visible) {
      const markerRoute = Math.max(1, Math.min(3, Math.floor(p) - 1)), path = routes[markerRoute], length = lengths[markerRoute];
      const along = Math.max(0, distance - offsets[markerRoute]);
      for (let i = 0; i < 28; i++) { const at = (along + 6 + i * 3.6) % length, position = path.getPointAt(at / length), direction = path.getTangentAt(at / length); markerDummy.position.copy(position).addScaledVector(markerSide.crossVectors(direction, up).normalize(), -1.15); markerDummy.position.y = .12; markerDummy.rotation.set(-Math.PI / 2, 0, Math.atan2(-direction.x, -direction.z)); markerDummy.updateMatrix(); markers.setMatrixAt(i, markerDummy.matrix); }
      markers.instanceMatrix.needsUpdate = true;
    }
    celebration.visible = current === 2 && missionChoice().answer === 1;
    if (celebration.visible) { const phase = time % 2 / 2; celebration.position.set(THREE.MathUtils.lerp(-37, -26.75, phase), 2 + Math.sin(phase * Math.PI) * 6, 26); }

    // Copy sits on the left, so the camera frames the scene a little to the right while reading.
    const reveal = smooth(JOURNEY_END - .35, JOURNEY_END, p);
    view = { x: mobile ? -.025 * reveal : THREE.MathUtils.lerp(-.15 * reading, -.08, reveal), y: mobile ? THREE.MathUtils.lerp(-.16 * reading, -.06, reveal) : 0 };
    shell.style.setProperty('--drive-reading', String(reading)); shell.style.setProperty('--drive-cockpit', String(inside));
    host.dataset.cameraMode = mode; host.dataset.carPosition = car.group.position.toArray().map(n => n.toFixed(2)).join(',');
    host.dataset.driveDistance = distance.toFixed(3); host.dataset.speed = speed.toFixed(2);

    paintHud(routeIndex, travel);
    if (active) {
      camera.position.copy(pose.position); camera.fov = pose.fov; camera.updateProjectionMatrix(); camera.lookAt(pose.target);
    }
    return pose;
  }

  // One heading-up city navigation texture follows the same path, pose and progress as the car.
  function paintHud(routeIndex: number, travel: number) {
    if (state.inside < .05) return;
    car.paintNavigation({ x: car.group.position.x, z: car.group.position.z, heading: car.group.rotation.y, speed,
      destination: STOP_NAMES[routeIndex], remaining: lengths[routeIndex] * (1 - travel),
      route: navigationRoutes[routeIndex], progress: travel });
  }

  return {
    sample, resize, state, ready: car.ready, view: () => view,
    carState: () => ({ position: car.group.position.clone(), heading: car.group.rotation.y, lane: stops }),
    dispose() {
      car.cancelLoad();
      unobserveChoice();
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
      for (const root of [car.group, car.trail, streaks.mesh, sparks.points, signals]) {
        root.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) { geometries.add(object.geometry); for (const m of Array.isArray(object.material) ? object.material : [object.material]) { materials.add(m); for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value); } } });
        root.removeFromParent();
      }
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
    },
    warmup() {
      const saved: { object: THREE.Object3D; visible: boolean; culled: boolean }[] = [];
      for (const root of [car.group, car.trail, streaks.mesh, sparks.points, signals]) root.traverse(object => { saved.push({ object, visible: object.visible, culled: object.frustumCulled }); object.visible = true; object.frustumCulled = false; });
      return () => saved.forEach(({ object, visible, culled }) => { object.visible = visible; object.frustumCulled = culled; });
    },
    routes, total: TOTAL,
  };
}
export type CityDrive = ReturnType<typeof createCityDrive>;
