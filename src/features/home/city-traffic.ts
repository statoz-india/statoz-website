import * as THREE from 'three';
import { sweepBody, type CityBody, type CityContact } from './city-contact';
import type { VehicleKit, VehicleModel } from './city-kenney';
import { ROAD_HALF_X, ROAD_HALF_Z, STREETS_X, STREETS_Z } from './city-roads';
import { junctionPhase, LANE, seeded, signalLamp } from './city-streets';

/*
 * Street traffic: ten original low-poly vehicle designs drawn with three batched meshes, driving a lane
 * graph built from the street grid. Cars follow the car ahead, stop for signals and people on zebras,
 * wait for oncoming traffic before turning right across it, and turn round out of sight at the far ends
 * of the streets, so nothing ever appears or vanishes in view.
 */

// ---------------------------------------------------------------- the fleet (Kenney Car Kit)
/** Street vehicles from the Kenney Car Kit: how common each is, how many at most, and how fast it drives. */
const FLEET = [
  { id: 'sedan', cruise: 10, weight: 4, max: 8 }, { id: 'hatchback-sports', cruise: 10.5, weight: 3, max: 6 }, { id: 'taxi', cruise: 10.5, weight: 3, max: 6 },
  { id: 'suv', cruise: 9.5, weight: 3, max: 6 }, { id: 'suv-luxury', cruise: 10, weight: 2, max: 4 }, { id: 'sedan-sports', cruise: 11.5, weight: 2, max: 4 },
  { id: 'van', cruise: 8.5, weight: 2, max: 4 }, { id: 'delivery', cruise: 8, weight: 2, max: 3 }, { id: 'delivery-flat', cruise: 8, weight: 1, max: 2 },
  { id: 'truck', cruise: 7.5, weight: 1, max: 2 }, { id: 'truck-flat', cruise: 7.5, weight: 1, max: 2 }, { id: 'police', cruise: 11, weight: 1, max: 2 },
  { id: 'ambulance', cruise: 10, weight: 1, max: 1 }, { id: 'garbage-truck', cruise: 6.5, weight: 1, max: 1 }, { id: 'firetruck', cruise: 8, weight: 1, max: 1 },
] as const;
const HEAVY = new Set<string>(['truck', 'truck-flat', 'garbage-truck', 'firetruck', 'delivery', 'delivery-flat']);
/** A Kenney sedan is scaled to 3.3 city units long (three quarters of the original 4.4, in step with the
 * city's people); every model shares the same scale, so lengths, wheels, shadows and light pools follow. */
const SEDAN_LENGTH = 4.4 * .75;

// ---------------------------------------------------------------- lane graph
type Node = { x: number; z: number; ix: number; iz: number; dead: boolean; out: Edge[]; into: Edge[] };
type Edge = { from: Node; to: Node; dx: number; dz: number; axis: 'ew' | 'ns'; sx: number; sz: number; ex: number; ez: number; length: number; inner: boolean };
type Segment = { kind: 'line' | 'quad' | 'cubic'; p: number[]; length: number };
type Turn = 'straight' | 'left' | 'right' | 'uturn';
type Car = {
  collider: CityBody; contactHold: number; impact: number;
  model: VehicleModel; heavy: boolean; L: number; W: number; cruise: number; body: number; lamp: number; wheels: number[]; spin: number; steer: number; yaw: number; beam: number;
  edge: Edge; next: Edge; turn: Turn; seg: Segment; inJunction: boolean; s: number; speed: number; accel: number;
  committed: boolean; waiting: number; x: number; z: number; hx: number; hz: number; pitch: number;
  /** Overtaking: sideways offset towards the oncoming lane, its target, and time spent held up. */
  shift: number; shiftTarget: number; blocked: number;
  /** After a mid-street U-turn: the lane to continue on. */
  pending: { edge: Edge; seg: Segment } | null;
};
export type TrafficObstacle = { x: number; z: number; radius: number };

const EXTENT = 236, STOP = 3.3, AVENUE_X = 1;
const LENS = [new THREE.Color(3, .25, .2), new THREE.Color(2.6, 1.5, .2), new THREE.Color(.3, 2.6, 1)];
const LENS_OFF = [new THREE.Color('#2a1010'), new THREE.Color('#2a2410'), new THREE.Color('#0f2418')];
function matrixOf(mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number) { mesh.setMatrixAt(i, new THREE.Matrix4().makeTranslation(x, y, z)); }
function lineSeg(ax: number, az: number, bx: number, bz: number): Segment { return { kind: 'line', p: [ax, az, bx, bz], length: Math.hypot(bx - ax, bz - az) }; }
function sample(seg: Segment, t: number, out: { x: number; z: number; tx: number; tz: number }) {
  const p = seg.p, u = 1 - t;
  if (seg.kind === 'line') { out.x = p[0] + (p[2] - p[0]) * t; out.z = p[1] + (p[3] - p[1]) * t; out.tx = p[2] - p[0]; out.tz = p[3] - p[1]; }
  else if (seg.kind === 'quad') {
    out.x = u * u * p[0] + 2 * u * t * p[2] + t * t * p[4]; out.z = u * u * p[1] + 2 * u * t * p[3] + t * t * p[5];
    out.tx = 2 * u * (p[2] - p[0]) + 2 * t * (p[4] - p[2]); out.tz = 2 * u * (p[3] - p[1]) + 2 * t * (p[5] - p[3]);
  } else {
    out.x = u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6]; out.z = u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7];
    out.tx = 3 * u * u * (p[2] - p[0]) + 6 * u * t * (p[4] - p[2]) + 3 * t * t * (p[6] - p[4]); out.tz = 3 * u * u * (p[3] - p[1]) + 6 * u * t * (p[5] - p[3]) + 3 * t * t * (p[7] - p[5]);
  }
  const n = Math.hypot(out.tx, out.tz) || 1; out.tx /= n; out.tz /= n; return out;
}
function curve(kind: 'quad' | 'cubic', p: number[]): Segment {
  const seg: Segment = { kind, p, length: 0 }, a = { x: 0, z: 0, tx: 0, tz: 0 }, b = { x: 0, z: 0, tx: 0, tz: 0 };
  sample(seg, 0, a); for (let i = 1; i <= 12; i++) { sample(seg, i / 12, b); seg.length += Math.hypot(b.x - a.x, b.z - a.z); a.x = b.x; a.z = b.z; }
  return seg;
}

function buildGraph() {
  const nodes: Node[] = [], junction: Node[][] = [];
  const node = (x: number, z: number, ix: number, iz: number, dead: boolean) => { const n: Node = { x, z, ix, iz, dead, out: [], into: [] }; nodes.push(n); return n; };
  STREETS_X.forEach((x, ix) => { junction[ix] = STREETS_Z.map((z, iz) => node(x, z, ix, iz, false)); });
  const edges: Edge[] = [];
  const connect = (a: Node, b: Node) => {
    for (const [from, to] of [[a, b], [b, a]] as const) {
      const len = Math.hypot(to.x - from.x, to.z - from.z), dx = (to.x - from.x) / len, dz = (to.z - from.z) / len, axis = dx ? 'ew' : 'ns';
      const clear = (n: Node) => n.dead ? 0 : axis === 'ew' ? ROAD_HALF_X : ROAD_HALF_Z, lx = dz * LANE, lz = -dx * LANE;
      const sx = from.x + dx * clear(from) + lx, sz = from.z + dz * clear(from) + lz, ex = to.x - dx * clear(to) + lx, ez = to.z - dz * clear(to) + lz;
      const edge: Edge = { from, to, dx, dz, axis, sx, sz, ex, ez, length: Math.hypot(ex - sx, ez - sz), inner: !from.dead && !to.dead };
      from.out.push(edge); to.into.push(edge); edges.push(edge);
    }
  };
  // East-west streets run beyond the district to turning points out of sight; so do the north-south ones,
  // except the approach avenue south of the city, which stays clear for the arrival and the coupe.
  STREETS_Z.forEach((z, iz) => { const row = [node(-EXTENT, z, -1, iz, true), ...STREETS_X.map((_, ix) => junction[ix][iz]), node(EXTENT, z, -1, iz, true)]; row.reduce((a, b) => { connect(a, b); return b; }); });
  STREETS_X.forEach((x, ix) => { const column = [node(x, -EXTENT, ix, -1, true), ...junction[ix], ...(ix === AVENUE_X ? [] : [node(x, EXTENT, ix, -1, true)])]; column.reduce((a, b) => { connect(a, b); return b; }); });
  return { nodes, edges };
}
const turnOf = (a: Edge, b: Edge): Turn => {
  if (a.dx * b.dx + a.dz * b.dz < -.5) return 'uturn';
  const cross = a.dx * b.dz - a.dz * b.dx; return Math.abs(cross) < .5 ? 'straight' : cross < 0 ? 'left' : 'right';
};
function maneuver(a: Edge, b: Edge): Segment {
  const turn = turnOf(a, b);
  if (turn === 'straight') return lineSeg(a.ex, a.ez, b.sx, b.sz);
  if (turn === 'uturn') { const k = 3.2; return curve('cubic', [a.ex, a.ez, a.ex + a.dx * k, a.ez + a.dz * k, b.sx + a.dx * k, b.sz + a.dz * k, b.sx, b.sz]); }
  const cx = a.dx ? b.sx : a.ex, cz = a.dx ? a.ez : b.sz;
  return curve('quad', [a.ex, a.ez, cx, cz, b.sx, b.sz]);
}

/**
 * During the opening the coupe sweeps its route in a fraction of a second, so traffic never uses a lane or
 * a junction movement that comes within 3.2 of that path. Oncoming lanes sit 3.3 or more to the side and
 * stay open. A lane is only usable if it leads somewhere usable, so no car is ever trapped at a junction.
 */
function conflicts(edges: Edge[], path: readonly { x: number; z: number }[]) {
  const cells = new Map<string, { x: number; z: number }[]>(), key = (x: number, z: number) => Math.floor(x / 4) + ',' + Math.floor(z / 4);
  for (const p of path) { const k = key(p.x, p.z); if (!cells.has(k)) cells.set(k, []); cells.get(k)!.push(p); }
  const near = (x: number, z: number) => {
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const p of cells.get(key(x + i * 4, z + j * 4)) ?? []) if (Math.hypot(p.x - x, p.z - z) < 3.2) return true;
    return false;
  };
  const point = { x: 0, z: 0, tx: 0, tz: 0 };
  const touches = (seg: Segment) => { const steps = Math.max(2, Math.ceil(seg.length)); for (let i = 0; i <= steps; i++) { sample(seg, i / steps, point); if (near(point.x, point.z)) return true; } return false; };
  const blockedEdge = new Set(edges.filter(edge => touches(lineSeg(edge.sx, edge.sz, edge.ex, edge.ez))));
  const blockedMove = new Set<string>();
  for (const a of edges) for (const b of a.to.out) if (touches(maneuver(a, b))) blockedMove.add(moveKey(a, b));
  // Keep only lanes with a clear way onward; repeat until nothing more drops out.
  const viable = new Set(edges.filter(edge => !blockedEdge.has(edge)));
  for (let changed = true; changed;) {
    changed = false;
    for (const edge of [...viable]) if (!edge.to.out.some(next => viable.has(next) && !blockedMove.has(moveKey(edge, next)) && (next.to !== edge.from || edge.to.dead))) { viable.delete(edge); changed = true; }
  }
  return { viable, blockedMove };
}
const moveKeys = new WeakMap<Edge, number>(); let moveIndex = 0;
function moveKey(a: Edge, b: Edge) {
  for (const edge of [a, b]) if (!moveKeys.has(edge)) moveKeys.set(edge, moveIndex++);
  return moveKeys.get(a) + '>' + moveKeys.get(b);
}

// ---------------------------------------------------------------- headlight pools
function beamTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 128;
  const g = canvas.getContext('2d')!;
  for (let y = 0; y < 128; y++) {
    const t = y / 127, spread = .18 + t * .32, fade = Math.pow(1 - t, 1.6) * Math.min(1, t * 8);
    const row = g.createLinearGradient(0, 0, 64, 0);
    row.addColorStop(0, 'rgba(255,240,215,0)'); row.addColorStop(.5 - spread, 'rgba(255,240,215,0)');
    row.addColorStop(.5, `rgba(255,240,215,${fade})`); row.addColorStop(.5 + spread, 'rgba(255,240,215,0)'); row.addColorStop(1, 'rgba(255,240,215,0)');
    g.fillStyle = row; g.fillRect(0, 127 - y, 64, 1);
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

// ---------------------------------------------------------------- traffic
export function createCityTraffic(coupePath: readonly { x: number; z: number }[], mobile: boolean) {
  const group = new THREE.Group(); group.name = 'city-traffic';
  const random = seeded(4401);
  const { nodes, edges } = buildGraph(), { viable, blockedMove } = conflicts(edges, coupePath);
  let closing = true;

  const total = mobile ? 18 : 32;
  let bodies: THREE.BatchedMesh | null = null, lamps: THREE.BatchedMesh | null = null, scaleOf = 1;
  const beamGeometry = new THREE.PlaneGeometry(1, 1); beamGeometry.rotateX(-Math.PI / 2); beamGeometry.translate(0, 0, .5);
  const beamTex = beamTexture();
  // Soft contact shadows keep every car on the road.
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 64;
  const shade = shadowCanvas.getContext('2d')!, falloff = shade.createRadialGradient(32, 32, 4, 32, 32, 32);
  falloff.addColorStop(0, 'rgba(0,0,0,.7)'); falloff.addColorStop(.55, 'rgba(0,0,0,.45)'); falloff.addColorStop(1, 'rgba(0,0,0,0)'); shade.fillStyle = falloff; shade.fillRect(0, 0, 64, 64);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas), shadowGeometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const shadows = new THREE.InstancedMesh(shadowGeometry, new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, toneMapped: false }), total);
  shadows.name = 'traffic-contact-shadows'; shadows.frustumCulled = false; shadows.renderOrder = 1; shadows.count = 0; group.add(shadows);
  const beams = new THREE.InstancedMesh(beamGeometry, new THREE.MeshBasicMaterial({ map: beamTex, color: '#ffe6c4', transparent: true, opacity: .34, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), total);
  beams.name = 'traffic-headlight-pools'; beams.frustumCulled = false; beams.renderOrder = 2; beams.count = 0; group.add(beams);
  // The signal heads on the four central junctions (city-district) show the same phases the cars obey:
  // lit lenses sit just proud of the painted ones, facing north-south traffic.
  const heads: { ix: number; iz: number; lamp: 0 | 1 | 2 }[] = [];
  const lenses = new THREE.InstancedMesh(new THREE.BoxGeometry(.27, .27, .02), new THREE.MeshBasicMaterial({ toneMapped: false }), 24);
  lenses.name = 'traffic-signal-lenses';
  [1, 2].forEach(ix => [1, 2].forEach(iz => [-1, 1].forEach(corner => ([0, 1, 2] as const).forEach(lamp => {
    const px = STREETS_X[ix] + corner * 4.3, pz = STREETS_Z[iz] + corner * 4.6;
    matrixOf(lenses, heads.length, px, [5.05, 4.6, 4.15][lamp], pz + corner * .265); heads.push({ ix, iz, lamp });
  }))));
  group.add(lenses);

  const brakeLights = new THREE.InstancedMesh(new THREE.BoxGeometry(1, .1, .04), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, .12, .12), toneMapped: false }), total);
  brakeLights.name = 'traffic-brake-lights'; brakeLights.frustumCulled = false; brakeLights.count = 0; group.add(brakeLights);
  const cars: Car[] = [];
  const colliders: CityBody[] = [];
  const contacts: CityContact[] = [];
  let contactCount = 0;
  group.userData.cars = cars; // read by the browser checks (stuck cars, spacing)
  const open = edges.filter(edge => viable.has(edge) && edge.length > 14);

  /**
   * The cast arrives with the Kenney models: one batch draws every body and wheel (they share the kit's
   * colormap), and a second draws the self-lit lamp faces found on each model.
   */
  function setKit(kit: VehicleKit) {
    const fleet = FLEET.filter(item => kit.models.has(item.id)); if (!fleet.length) return;
    scaleOf = SEDAN_LENGTH / (kit.models.get('sedan') ?? kit.models.get(fleet[0].id)!).size.z;
    const material = new THREE.MeshStandardMaterial({ map: kit.texture, roughness: .42, metalness: .22, envMapIntensity: 1.2 });
    material.onBeforeCompile = shader => { shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * .08;'); };
    material.customProgramCacheKey = () => 'city-traffic-kenney-v1';
    const models = fleet.map(item => kit.models.get(item.id)!);
    const vertices = models.reduce((sum, model) => sum + model.body.attributes.position.count + model.wheels.reduce((w, wheel) => w + wheel.geometry.attributes.position.count, 0), 0);
    const lampVertices = models.reduce((sum, model) => sum + model.lamps.attributes.position.count, 0);
    bodies = new THREE.BatchedMesh(total * 5, vertices, 0, material); bodies.name = 'traffic-bodies';
    lamps = new THREE.BatchedMesh(total, Math.max(3, lampVertices), 0, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })); lamps.name = 'traffic-lamps';
    for (const mesh of [bodies, lamps]) { mesh.sortObjects = false; mesh.perObjectFrustumCulled = false; mesh.frustumCulled = false; group.add(mesh); }
    const ids = models.map(model => ({ body: bodies!.addGeometry(model.body), wheels: model.wheels.map(wheel => bodies!.addGeometry(wheel.geometry)), lamp: model.lamps.attributes.position.count ? lamps!.addGeometry(model.lamps) : -1 }));
    const counts = fleet.map(() => 0);
    const pick = () => {
      const pool: number[] = fleet.map((item, i) => counts[i] < item.max ? item.weight : 0), sum = pool.reduce((a, b) => a + b, 0);
      let roll = random() * sum; for (let i = 0; i < pool.length; i++) { roll -= pool[i]; if (roll <= 0) return i; } return 0;
    };
    for (let i = 0; i < total; i++) {
      const index = pick(), item = fleet[index], model = models[index];
      let edge: Edge | undefined, s = 0;
      for (let attempt = 0; attempt < 40 && !edge; attempt++) {
        const candidate = open[Math.floor(random() * open.length)];
        if (!candidate.inner && random() < .6) continue;
        const at = 3 + random() * Math.max(1, candidate.length - STOP - 8);
        if (cars.every(other => other.edge !== candidate || Math.abs(other.s - at) > 14)) { edge = candidate; s = at; }
      }
      if (!edge) continue;
      counts[index]++;
      const L = model.size.z * scaleOf, W = model.size.x * scaleOf;
      const collider: CityBody = { id: 'traffic-' + i, kind: 'vehicle', x: 0, z: 0, y: .02, radius: W / 2, halfLength: Math.max(0, (L - W) / 2), heading: 0, vx: 0, vz: 0 };
      const car: Car = { collider, contactHold: 0, impact: 0, model, heavy: HEAVY.has(item.id), L, W, cruise: item.cruise * (.9 + random() * .2), body: bodies.addInstance(ids[index].body), lamp: ids[index].lamp < 0 ? -1 : lamps.addInstance(ids[index].lamp), wheels: ids[index].wheels.map(id => bodies!.addInstance(id)), spin: 0, steer: 0, yaw: 0, beam: W / 1.9, edge, next: edge, turn: 'straight', seg: lineSeg(edge.sx, edge.sz, edge.ex, edge.ez), inJunction: false, s, speed: item.cruise * .6, accel: 0, committed: false, waiting: 0, x: 0, z: 0, hx: 0, hz: 1, pitch: 0, shift: 0, shiftTarget: 0, blocked: 0, pending: null };
      plan(car); cars.push(car); colliders.push(collider); place(car); car.yaw = Math.atan2(car.hx, car.hz);
    }
    brakeLights.count = beams.count = shadows.count = cars.length;
    if (last >= 0) draw(last, 0);
  }

  /** Chooses the exit at the end of the current lane: mostly straight, staying inside the district. */
  function plan(car: Car) {
    const options = car.edge.to.out.filter(edge => edge.to !== car.edge.from || car.edge.to.dead);
    const usable = closing && viable.has(car.edge) ? options.filter(edge => viable.has(edge) && !blockedMove.has(moveKey(car.edge, edge))) : options;
    const pool = (usable.length ? usable : options).map(edge => {
      const turn = turnOf(car.edge, edge); let w = turn === 'straight' ? 2.2 : turn === 'uturn' ? 1 : 1;
      if (!edge.inner && !car.edge.to.dead) w *= .35;
      if (car.heavy && turn !== 'straight' && turn !== 'uturn') w *= .5;
      return { edge, w };
    });
    let roll = random() * pool.reduce((a, b) => a + b.w, 0);
    car.next = pool.find(item => (roll -= item.w) <= 0)?.edge ?? pool[0].edge; car.turn = turnOf(car.edge, car.next); car.committed = false;
  }

  const point = { x: 0, z: 0, tx: 0, tz: 0 };
  function place(car: Car) { sample(car.seg, Math.min(1, car.s / car.seg.length), point); car.x = point.x - point.tz * car.shift; car.z = point.z + point.tx * car.shift; car.hx = point.tx; car.hz = point.tz; Object.assign(car.collider, { x: car.x, z: car.z, heading: Math.atan2(-car.hx, -car.hz), vx: car.hx * car.speed, vz: car.hz * car.speed }); }

  /** May this car leave its stop line now? Signals, the junction box, oncoming traffic, room beyond, the coupe. */
  function mayEnter(car: Car, time: number, coupe: { x: number; z: number } | null) {
    const n = car.edge.to; if (n.dead) return true;
    const patient = car.waiting > 40, right = car.turn === 'right';
    if (junctionPhase(n.ix, n.iz, time) !== car.edge.axis && !patient) return false;
    // A player driving the coupe through a junction has it to themselves.
    if (coupe && Math.hypot(coupe.x - n.x, coupe.z - n.z) < 9) return false;
    const opposite = (other: Car) => other.edge.dx === -car.edge.dx && other.edge.dz === -car.edge.dz;
    for (const other of cars) {
      if (other === car) continue;
      const entering = other.edge.to === n && (other.inJunction || other.committed);
      if (entering) {
        // Cross traffic still in (or committed to) the box, or any right turn against oncoming traffic: a right
        // turn sweeps across the far lane, so only one of an opposing pair goes at a time.
        if (other.edge.axis !== car.edge.axis) return false;
        if (opposite(other) && (other.turn === 'right' || right)) return false;
      } else if (right && !patient && other.edge.to === n && opposite(other) && other.turn !== 'right' && other.speed > 1 && other.edge.length - other.s < 22) return false;
      // Never block the box: the exit lane needs room for the whole car, and two cars never merge at once.
      if (!other.inJunction && other.edge === car.next && other.s < car.L + 3) return false;
      if (other.inJunction && other.next === car.next && other.edge !== car.edge) return false;
    }
    return true;
  }

  let last = -1, nearest = Infinity, coupeLast: { x: number; z: number } | null = null;
  const matrix = new THREE.Matrix4(), carMatrix = new THREE.Matrix4(), scaled = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, 'YXZ'), pos = new THREE.Vector3(), scale = new THREE.Vector3(1, 1, 1);
  const wheelQ = new THREE.Quaternion(), spinQ = new THREE.Quaternion(), axisX = new THREE.Vector3(1, 0, 0), axisY = new THREE.Vector3(0, 1, 0);
  function update(time: number, people: TrafficObstacle[], coupe: { x: number; z: number } | null, journey: boolean, blockers: readonly CityBody[] = [], pedestrians: readonly CityBody[] = []) {
    const dt = last < 0 ? 0 : Math.min(.1, Math.max(0, time - last)); last = time;
    const coupeSpeed = coupe && coupeLast && dt > 0 ? Math.hypot(coupe.x - coupeLast.x, coupe.z - coupeLast.z) / dt : 0;
    coupeLast = coupe ? { x: coupe.x, z: coupe.z } : null;
    if (journey !== closing) { closing = journey; for (const car of cars) if (!car.inJunction && !car.committed) plan(car); }
    if (dt > 0) for (const car of cars) {
      car.contactHold = Math.max(0, car.contactHold - dt); car.impact = Math.max(0, car.impact - dt * 2.4);
      // Look along the car's own heading for anything in its lane: other cars, the coupe, people on zebras.
      let gap = Infinity;
      const ahead = (x: number, z: number, length: number, width: number) => {
        const rx = x - car.x, rz = z - car.z, f = rx * car.hx + rz * car.hz, side = Math.abs(rx * car.hz - rz * car.hx);
        if (f > 0 && f < 34 && side < (car.W + width) / 2 + .25) gap = Math.min(gap, f - (car.L + length) / 2);
      };
      for (const other of cars) if (other !== car && (other.hx * car.hx + other.hz * car.hz > -.2 || other.inJunction || other.shift > .5 || car.shift > .5)) ahead(other.x, other.z, other.L, other.W);
      const before = gap;
      if (coupe) ahead(coupe.x, coupe.z, 4.8, 2.1);
      for (const obstacle of blockers) ahead(obstacle.x, obstacle.z, 2 * (obstacle.halfLength + obstacle.radius), 2 * obstacle.radius);
      // Held up behind a parked coupe (free roam): pull out and pass once the oncoming lane is clear.
      const heldByCoupe = !!coupe && gap < before && gap < 8 && coupeSpeed < .3 && !car.inJunction;
      car.blocked = heldByCoupe ? car.blocked + dt : Math.max(0, car.blocked - dt);
      const remaining = car.seg.length - car.s, oncomingClear = (reach: number) => cars.every(other => {
        if (other === car || other.hx * car.hx + other.hz * car.hz > -.5) return true;
        const rx = other.x - car.x, rz = other.z - car.z, f = rx * car.hx + rz * car.hz, right = -(rx * car.hz - rz * car.hx);
        return f < -5 || f > reach || Math.abs(right - 2 * LANE) > 2.4;
      });
      if (heldByCoupe && car.shiftTarget === 0 && !car.pending && car.blocked > 2.5) {
        // Room to pass and pull back in before the stop line: overtake. Otherwise, after a while, turn round.
        if (remaining > gap + car.L + 4.8 + 12 && oncomingClear(40)) car.shiftTarget = 2 * LANE;
        else if (car.blocked > 8 && gap > 3.5 && oncomingClear(14)) {
          const back = car.edge.to.out.find(edge => edge.to === car.edge.from);
          if (back) {
            const tx = car.x - car.hz * 2 * LANE, tz = car.z + car.hx * 2 * LANE, k = 3;
            car.seg = curve('cubic', [car.x, car.z, car.x + car.hx * k, car.z + car.hz * k, tx + car.hx * k, tz + car.hz * k, tx, tz]);
            car.pending = { edge: back, seg: lineSeg(tx, tz, back.ex, back.ez) }; car.s = 0; car.committed = true; car.blocked = 0; car.turn = 'uturn';
          }
        }
      }
      if (car.shiftTarget > 0 && coupe) {
        const behind = (coupe.x - car.x) * car.hx + (coupe.z - car.z) * car.hz < -car.L - 3;
        if (behind || remaining < 8) car.shiftTarget = 0;
      } else if (!coupe) car.shiftTarget = 0;
      const previousShift = car.shift;
      car.shift += (car.shiftTarget - car.shift) * Math.min(1, dt * 1.6);
      for (const person of people) ahead(person.x, person.z, person.radius * 2, person.radius * 2);
      // Stop line: hold before the zebra unless the junction can take the car.
      if (!car.inJunction && !car.committed) {
        const toLine = car.seg.length - STOP - car.s - car.L / 2;
        if (car.edge.to.dead || toLine < car.speed * car.speed / 12 + .4) {
          if (car.shift < .2 && mayEnter(car, time, coupe)) car.committed = true;
          else { gap = Math.min(gap, toLine + 2); car.waiting += dt; }
        }
      }
      let limit = car.cruise;
      if (car.pending) limit = 3;
      else if (car.inJunction) limit = car.turn === 'straight' ? car.cruise * .8 : car.turn === 'uturn' ? 3 : 4.6;
      else if (!car.committed && car.seg.length - car.s < 16 && car.turn !== 'straight') limit = Math.min(limit, 5.5);
      const safe = Math.sqrt(Math.max(0, 2 * 6 * (gap - 2.2)));
      const target = car.contactHold > 0 ? 0 : Math.min(limit, safe), change = THREE.MathUtils.clamp(target - car.speed, -9 * dt, 3 * dt);
      car.speed = Math.max(0, car.speed + change); car.accel = change / dt;
      if (car.speed > .3) car.waiting = Math.max(0, car.waiting - dt * 2);
      // Hard contact complements anticipatory braking. Sweep the actual footprint so a
      // moving NPC cannot pass through a stationary visitor or their parked car.
      if (!journey) {
        const destination = { x: 0, z: 0, tx: 0, tz: 0 };
        sample(car.seg, Math.min(1, (car.s + car.speed * dt) / car.seg.length), destination);
        destination.x -= destination.tz * car.shift; destination.z += destination.tx * car.shift;
        const body = { ...car.collider, heading: Math.atan2(-destination.tx, -destination.tz), vx: car.hx * car.speed, vz: car.hz * car.speed };
        const obstacles = [...colliders.filter(other => other !== car.collider), ...blockers, ...pedestrians];
        const hit = sweepBody(body, destination.x - car.x, destination.z - car.z, obstacles);
        if (hit) {
          const oldSpeed = car.speed;
          car.shift = previousShift; car.speed = 0; car.accel = -Math.min(12, oldSpeed / dt);
          if (car.contactHold <= 0) {
            car.contactHold = .65; car.impact = Math.min(1, .15 + hit.speed / 16); contactCount++;
            if (hit.id.startsWith('person-')) contacts.push({ ...hit, receiver: 'npc' });
            if (hit.id.startsWith('player-')) contacts.push({ ...hit, id: car.collider.id, kind: 'vehicle', nx: -hit.nx, nz: -hit.nz });
          }
        }
      }
      car.s += car.speed * dt;
      while (car.s >= car.seg.length) {
        car.s -= car.seg.length;
        if (car.pending) { car.edge = car.pending.edge; car.seg = car.pending.seg; car.pending = null; car.inJunction = false; plan(car); }
        else if (!car.inJunction) { car.seg = maneuver(car.edge, car.next); car.inJunction = true; }
        else { car.edge = car.next; car.seg = lineSeg(car.edge.sx, car.edge.sz, car.edge.ex, car.edge.ez); car.inJunction = false; plan(car); }
      }
      place(car);
    }
    draw(time, dt);
    nearest = Infinity;
    if (coupe) for (const car of cars) nearest = Math.min(nearest, Math.hypot(coupe.x - car.x, coupe.z - car.z));
    heads.forEach((head, i) => {
      const state = signalLamp(head.ix, head.iz, time, 'ns'), lit = ['red', 'amber', 'green'][head.lamp] === state;
      lenses.setColorAt(i, lit ? LENS[head.lamp] : LENS_OFF[head.lamp]);
    });
    if (lenses.instanceColor) lenses.instanceColor.needsUpdate = true;
    return nearest;
  }
  /** Writes every car's body, wheels (spinning, front pair steering), lamps, light pool and shadow. */
  function draw(time: number, dt: number) {
    if (!bodies || !lamps) return;
    cars.forEach((car, i) => {
      place(car);
      const heading = Math.atan2(car.hx, car.hz), turnRate = dt > 0 ? Math.atan2(Math.sin(heading - car.yaw), Math.cos(heading - car.yaw)) / dt : 0; car.yaw = heading;
      car.steer += (THREE.MathUtils.clamp(turnRate * .35, -.45, .45) - car.steer) * Math.min(1, dt * 8);
      car.pitch += (THREE.MathUtils.clamp(-car.accel * .006, -.035, .025) - car.pitch) * Math.min(1, dt * 6);
      car.spin += car.speed * dt / Math.max(.05, (car.model.wheels[0]?.radius ?? .3) * scaleOf);
      e.set(car.pitch + Math.sin(time * 30) * car.impact * .025, heading, Math.sin(time * 24) * car.impact * .018); q.setFromEuler(e); pos.set(car.x, .02, car.z); carMatrix.compose(pos, q, scale.set(1, 1, 1));
      matrix.copy(carMatrix).multiply(scaled.makeScale(scaleOf, scaleOf, scaleOf));
      bodies!.setMatrixAt(car.body, matrix); if (car.lamp >= 0) lamps!.setMatrixAt(car.lamp, matrix);
      car.model.wheels.forEach((wheel, w) => {
        wheelQ.setFromAxisAngle(axisY, wheel.position.z > 0 ? car.steer : 0).multiply(spinQ.setFromAxisAngle(axisX, car.spin)).multiply(wheel.rotation);
        matrix.compose(pos.copy(wheel.position).multiplyScalar(scaleOf), wheelQ, scale.set(scaleOf, scaleOf, scaleOf)).premultiply(carMatrix);
        bodies!.setMatrixAt(car.wheels[w], matrix);
      });
      pos.set(car.x, .035, car.z); e.set(0, heading, 0); q.setFromEuler(e);
      matrix.compose(pos, q, scale.set(car.W * 1.3, 1, car.L * 1.15)); shadows.setMatrixAt(i, matrix);
      pos.set(car.x + car.hx * car.L / 2, .05, car.z + car.hz * car.L / 2);
      matrix.compose(pos, q, scale.set(3.4 * car.beam, 1, 8.5 * car.beam)); beams.setMatrixAt(i, matrix);
      pos.set(car.x - car.hx * (car.L / 2 + .025), .5, car.z - car.hz * (car.L / 2 + .025));
      const lit = car.contactHold > 0 || car.accel < -1;
      matrix.compose(pos, q, scale.set(lit ? car.W * .7 : 0, lit ? 1 : 0, 1)); brakeLights.setMatrixAt(i, matrix);
    });
    brakeLights.instanceMatrix.needsUpdate = true; beams.instanceMatrix.needsUpdate = true; shadows.instanceMatrix.needsUpdate = true;
    void time;
  }

  return {
    group, update, setKit,
    /** Positions for people deciding whether a zebra is safe to step onto. */
    vehicles: () => cars,
    bodies: () => colliders,
    drainContacts: () => contacts.splice(0),
    react(contact: CityContact) {
      const car = cars.find(car => car.collider.id === contact.id);
      if (!car || car.contactHold > 0) return;
      car.contactHold = .65; car.speed = 0; car.accel = -Math.min(12, contact.speed * 2);
      car.impact = Math.min(1, .15 + contact.speed / 16); contactCount++;
      car.collider.vx = car.collider.vz = 0;
    },
    contactCount: () => contactCount,
    counts: { openLanes: viable.size, lanes: edges.length },
    reduce() { beams.visible = false; },
    dispose() { brakeLights.geometry.dispose(); (brakeLights.material as THREE.Material).dispose(); lenses.geometry.dispose(); (lenses.material as THREE.Material).dispose(); for (const mesh of [bodies, lamps]) if (mesh) { (mesh.material as THREE.Material).dispose(); mesh.dispose(); } beams.geometry.dispose(); beamTex.dispose(); (beams.material as THREE.Material).dispose(); shadowTexture.dispose(); shadowGeometry.dispose(); void nodes; },
  };
}
