import * as THREE from 'three';
import { bodySeparation, sweepBody, type CityBody, type CityContact } from './city-contact';
import { CITY_PALETTE as P } from './city-config';
import { BONES, type Clip, type ClipName, type PeopleKit } from './city-kenney';
import { junctionPhase, onRoad, pavementGraph, seeded, walkRoute, type Crossing, type WalkNode } from './city-streets';

export type CitySeat = { x: number; y: number; z: number; heading: number; accent: string };
type Point = readonly [number, number];
type Role = 'walk' | 'basketball' | 'football' | 'cricket' | 'spectator' | 'marshal';
/** Which Kenney character a person is, their size, and a team colour on the shirt (fans and players). */
type Look = { variant: number; scale: number; tint: string | null; phone: boolean };
type Activity = 'look' | 'phone' | 'chat' | 'stand';
/** A pedestrian's mind: where they are going, what they are doing, and how they move. */
type Mind = {
  zone: number; path: number[]; step: number; along: number; target: number;
  state: 'walk' | 'wait' | 'idle'; timer: number; activity: Activity; patience: number; crossing: Crossing | null;
  pace: number; side: number; vx: number; vz: number; stride: number; lookYaw: number; texting: boolean;
  leader: Actor | null; offset: number;
};
type Actor = {
  collider: CityBody; reactUntil: number; lastContact: number; reactX: number; reactZ: number;
  role: Role; x: number; y: number; z: number; heading: number; phase: number; index: number; look: Look; mind?: Mind;
  /** Rendering: batch instance per bone, the pose drawn last frame, and the clip it is blending into. */
  ids: number[]; pose: Float32Array; from: Float32Array; clip: ClipName | null; since: number; lastX: number; lastZ: number;
};
export type CityLifeContext = { cars: readonly { x: number; z: number; speed: number; hx: number; hz: number }[]; coupe: { x: number; z: number } | null; bodies?: readonly CityBody[] };

// Hangout zones are the walkways inside blocks that have no pavement link: people stroll, stop and talk.
const ZONES: Point[][] = [
  [[53, -42], [57, -42], [57, -8], [53, -8]], // the kiosk concourse beside the Floodlights
  [[-62, 70], [-22, 70], [-22, 76], [-62, 76]],
  [[16, 70], [71, 70], [71, 76], [16, 76]],
  [[-12, -57], [57, -57], [57, -55.6], [-12, -55.6]], // behind the north stand, past the newsroom
  Array.from({ length: 24 }, (_, i) => [-5 + Math.cos(i / 24 * Math.PI * 2) * 5.4, 23 + Math.sin(i / 24 * Math.PI * 2) * 5.4] as Point), // the fountain plaza
];
const HOTSPOTS: Point[] = [[-49, -30], [22, -27], [-41, 26], [48, 25.5], [-5, 23], [-17, 90]];
// The walkway between the Clubhouse and the Blacktop joins the pavements on z = 3 and z = 48.
const WALKWAY: Point[] = [[-70.8, 7.75], [-70.8, 43.25]];
// The Kenney Mini Characters packed into people.glb: thirteen citizens and a worker (the circuit marshals).
const CITIZENS = ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'male-f', 'male-g', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'];
const VARIANTS = [...CITIZENS, 'worker'];
const FANS = [P.cyan, P.pink, P.gold, P.violet, P.lime];
/** Adult height in city units, and how far a walk cycle carries a person. */
// People stand at three quarters of the original 1.95 m figure. Strides shrink with them, and walking speed
// follows the square root of leg length, so smaller people keep a natural cadence rather than scurrying.
const SIZE = .75, ADULT = 1.95 * SIZE, STEP = 1.3 * SIZE, GAIT = Math.sqrt(SIZE);
/** Scales a hand-held prop's height above the playing surface with the players. */
const hand = (height: number) => .425 + (height - .425) * SIZE;

function polyline(points: readonly Point[]) {
  let length = 0; const starts: number[] = [];
  points.forEach((p, i) => { starts.push(length); const q = points[(i + 1) % points.length]; length += Math.hypot(q[0] - p[0], q[1] - p[1]); });
  const at = (u: number): Point => {
    u = ((u % length) + length) % length; let i = starts.findLastIndex(s => s <= u); if (i < 0) i = 0;
    const p = points[i], q = points[(i + 1) % points.length], d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, t = (u - starts[i]) / d;
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  };
  return { length, at };
}

/** Kenney Mini Characters for everyone in the city: pedestrians, players, crowd and marshals, in one batch. */
export function createCityLife(seats: CitySeat[], raceX: number, raceZ: number, mobile = false) {
  const group = new THREE.Group(); group.name = 'statoz-city-life';
  const random = seeded(2026), pick = <T,>(list: readonly T[]) => list[Math.floor(random() * list.length)];
  const actors: Actor[] = [];
  function dress(role: Role, team?: string): Look {
    const fan = role === 'walk' ? random() < .22 : role === 'spectator' ? random() < .45 : false;
    return { variant: role === 'marshal' ? VARIANTS.indexOf('worker') : Math.floor(random() * CITIZENS.length), scale: .94 + random() * .12, tint: team ?? (fan ? pick(FANS) : null), phone: role === 'walk' && random() < .35 };
  }
  function actor(role: Role, x: number, z: number, index: number, look: Look, y = .12, heading = 0) {
    const person: Actor = { collider: { id: 'person-' + actors.length, kind: 'person', x, z, y, radius: .29 * look.scale, halfLength: 0, heading, vx: 0, vz: 0 }, reactUntil: 0, lastContact: -99, reactX: 0, reactZ: 0, role, x, z, y, heading, index, look, phase: actors.length * 1.73, ids: [], pose: new Float32Array(BONES.length * 7), from: new Float32Array(BONES.length * 7), clip: null, since: 0, lastX: x, lastZ: z };
    actors.push(person); return person;
  }

  // ------------------------------------------------------------ the street cast
  const graph: WalkNode[] = pavementGraph(HOTSPOTS, [{ iz: 1, side: 1, x: WALKWAY[0][0] }, { iz: 2, side: -1, x: WALKWAY[1][0] }], [WALKWAY]);
  const totalWeight = graph.reduce((sum, node) => sum + node.weight, 0);
  const pickNode = (awayFrom?: WalkNode) => {
    for (let tries = 0; tries < 12; tries++) {
      let roll = random() * totalWeight; const node = graph.find(item => (roll -= item.weight) <= 0) ?? graph[0];
      if (!awayFrom || Math.hypot(node.x - awayFrom.x, node.z - awayFrom.z) > 28) return node;
    }
    return graph[Math.floor(random() * graph.length)];
  };
  const mind = (zone: number): Mind => ({ zone, path: [], step: 0, along: 0, target: 0, state: 'walk', timer: 0, activity: 'stand', patience: 0, crossing: null,
    pace: (1.05 + random() * .45) * GAIT, side: .25 + random() * .45, vx: 0, vz: 0, stride: random() * 6, lookYaw: 0, texting: false, leader: null, offset: 0 });
  const streets = mobile ? 26 : 40, zoneCount = mobile ? 10 : 15;
  for (let i = 0; i < streets; i++) {
    const solo = i % 4 !== 3, kid = !solo && i % 12 === 11;
    const look = dress('walk'); if (kid) { look.scale = .66; look.phone = false; }
    if (solo) {
      const start = pickNode(), person = actor('walk', start.x, start.z, i, look); person.mind = mind(-1);
      const goal = pickNode(start); person.mind.path = walkRoute(graph, start.id, goal.id); person.mind.step = 1;
      // Begin part-way along the first pavement, so nobody starts on a corner with everyone else.
      const next = graph[person.mind.path[1] ?? start.id], t = random() * .8;
      person.x += (next.x - start.x) * t; person.z += (next.z - start.z) * t;
      if (graph[start.id].links.find(link => link.to === next.id)?.crossing) { person.x = start.x; person.z = start.z; }
    } else {
      // Every fourth person walks with the one before: a friend, or a child beside a parent.
      const leader = actors[actors.length - 1], person = actor('walk', leader.x + .8, leader.z, i, look);
      person.mind = mind(-1); person.mind.leader = leader; person.mind.offset = random() < .5 ? -.78 : .78; person.mind.pace = leader.mind!.pace;
    }
  }
  for (let i = 0; i < zoneCount; i++) {
    const zone = i % ZONES.length, line = polyline(ZONES[zone]), along = random() * line.length, [x, z] = line.at(along);
    const person = actor('walk', x, z, streets + i, dress('walk'), .02); person.mind = mind(zone); person.mind.along = along; person.mind.target = along;
    person.mind.state = 'idle'; person.mind.timer = random() * 6; person.mind.activity = pick(['look', 'chat', 'stand', 'phone'] as const); person.mind.pace = (.8 + random() * .4) * GAIT;
  }
  const zoneLines = ZONES.map(polyline);

  // ------------------------------------------------------------ the sports cast
  for (let i = 0; i < 6; i++) actor('basketball', -47 + i % 3 * 7, 20 + Math.floor(i / 3) * 11, i, dress('basketball', i < 3 ? P.orange : P.cyan), .425);
  for (let i = 0; i < 10; i++) actor('football', i < 2 ? (i ? 43 : 1) : 5 + (i - 2) % 4 * 10, i < 2 ? -27 : -35 + Math.floor((i - 2) / 4) * 16, i, dress('football', i % 2 ? P.lime : P.text), .425);
  const cricket: Point[] = [[-47.7, -21], [-49, -46], [-49, -18.5], [-64, -39], [-34, -40], [-31, -26], [-61, -16], [-48, -50]];
  cricket.forEach(([x, z], i) => actor('cricket', x, z, i, dress('cricket', i === 0 ? P.gold : '#eef2f4'), .425, i === 0 ? Math.PI : 0));
  // Stands offer a scattering of occupied seats, so the crowd already has gaps in it.
  seats.forEach((seat, i) => actor('spectator', seat.x, seat.z, i, dress('spectator', i % 3 ? undefined : seat.accent), seat.y, seat.heading));
  for (let i = 0; i < 3; i++) actor('marshal', raceX - 8 + i * 6, raceZ + 5, i, dress('marshal', P.orange), .32, Math.PI);

  // ------------------------------------------------------------ props that stay procedural
  const balls = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ roughness: .7 }), 3);
  balls.name = 'sports-balls'; balls.frustumCulled = false; group.add(balls);
  const color = new THREE.Color();
  [P.orange, P.text, P.racing].forEach((tint, i) => balls.setColorAt(i, color.set(tint)));
  const batGeometry = new THREE.BoxGeometry(.2, .95, .11); batGeometry.translate(0, -.45, 0);
  const bat = new THREE.Mesh(batGeometry, new THREE.MeshStandardMaterial({ color: '#d9b26b', roughness: .8 })); bat.visible = false; group.add(bat);
  // Soft contact shadows ground everyone who stands on open ground.
  const grounded = actors.filter(person => person.role !== 'spectator');
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 64;
  const sc = shadowCanvas.getContext('2d')!, gradient = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(0,0,0,.55)'); gradient.addColorStop(.6, 'rgba(0,0,0,.22)'); gradient.addColorStop(1, 'rgba(0,0,0,0)'); sc.fillStyle = gradient; sc.fillRect(0, 0, 64, 64);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas), shadowGeometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const shadows = new THREE.InstancedMesh(shadowGeometry, new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, toneMapped: false }), grounded.length);
  shadows.name = 'people-contact-shadows'; shadows.frustumCulled = false; shadows.renderOrder = 1; group.add(shadows);

  // ------------------------------------------------------------ Kenney characters
  let kit: PeopleKit | null = null, batch: THREE.BatchedMesh | null = null, base = 1, sitLift = 0, armReach = -.2;
  function setKit(next: PeopleKit) {
    kit = next; base = ADULT / next.height;
    const index = VARIANTS.map(name => Math.max(0, next.variants.findIndex(variant => variant.name === name)));
    // A seated person's seat line: hip height in the sit pose plus the bottom of the torso piece.
    const torso = next.variants[0].parts[2]; torso.computeBoundingBox();
    sitLift = next.clips.sit.frames[0][2 * 7 + 1] + torso.boundingBox!.min.y;
    const arm = next.variants[0].parts[4]; arm.computeBoundingBox(); armReach = arm.boundingBox!.min.y;
    const material = new THREE.MeshStandardMaterial({ map: next.texture, roughness: .82, metalness: 0 });
    // A team colour recolours the shirt piece while keeping the texture's shading; everyone gets a little
    // self-light so the crowd still reads under the night sky.
    material.onBeforeCompile = shader => {
      // Batch colours reach the fragment shader as vec4 vColor (USE_COLOR_ALPHA in three r184).
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
          if ( vColor.r + vColor.g + vColor.b < 2.97 ) diffuseColor.rgb = vColor.rgb * ( .6 + .65 * dot( diffuseColor.rgb, vec3( .299, .587, .114 ) ) );
        #endif`).replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * .14;');
    };
    material.customProgramCacheKey = () => 'city-people-kenney-v1';
    const vertices = next.variants.reduce((sum, variant) => sum + variant.parts.reduce((s, part) => s + part.attributes.position.count, 0), 0);
    batch = new THREE.BatchedMesh(actors.length * BONES.length, vertices, 0, material); batch.name = 'city-people';
    batch.sortObjects = false; batch.perObjectFrustumCulled = false; batch.frustumCulled = false;
    const geometry = next.variants.map(variant => variant.parts.map(part => part.attributes.position.count ? batch!.addGeometry(part) : -1));
    for (const person of actors) {
      const ids = geometry[index[person.look.variant]];
      person.ids = ids.map(id => id < 0 ? -1 : batch!.addInstance(id));
      person.ids.forEach((id, b) => { if (id >= 0) batch!.setColorAt(id, color.set(b === 2 && person.look.tint ? person.look.tint : '#ffffff')); });
    }
    group.add(batch); bat.visible = true;
    if (last >= 0) { const at = last; last = -1; update(at); }
  }

  const actorMatrix = new THREE.Matrix4(), partMatrix = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), r = new THREE.Quaternion(), s3 = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), Y = new THREE.Vector3(0, 1, 0);
  const scratch = new Float32Array(BONES.length * 7);
  /** Blends two poses: positions lerp, rotations nlerp along the short way round. */
  function mix(a: Float32Array, b: Float32Array, w: number, out: Float32Array) {
    for (let k = 0; k < BONES.length; k++) {
      const o = k * 7;
      for (let j = 0; j < 3; j++) out[o + j] = a[o + j] + (b[o + j] - a[o + j]) * w;
      const sign = a[o + 3] * b[o + 3] + a[o + 4] * b[o + 4] + a[o + 5] * b[o + 5] + a[o + 6] * b[o + 6] < 0 ? -1 : 1;
      let len = 0; for (let j = 3; j < 7; j++) { out[o + j] = a[o + j] + (b[o + j] * sign - a[o + j]) * w; len += out[o + j] * out[o + j]; }
      len = Math.sqrt(len) || 1; for (let j = 3; j < 7; j++) out[o + j] /= len;
    }
  }
  function sample(clip: Clip, t: number, loop: boolean, out: Float32Array) {
    const n = clip.frames.length; let f = t / clip.duration * n;
    f = loop ? ((f % n) + n) % n : Math.min(Math.max(f, 0), n - 1);
    const i0 = Math.floor(f), i1 = loop ? (i0 + 1) % n : Math.min(i0 + 1, n - 1);
    mix(clip.frames[i0], clip.frames[i1], f - i0, out);
  }
  /** Poses one person from a clip (blending out of the previous one) and writes their six parts. */
  function render(person: Actor, clip: ClipName, t: number, loop: boolean, time: number, y = person.y) {
    if (!kit || !batch) return;
    sample(kit.clips[clip], t, loop, scratch);
    if (person.clip === null) { person.pose.set(scratch); person.clip = clip; person.since = time - 1; }
    else if (person.clip !== clip) { person.from.set(person.pose); person.clip = clip; person.since = time; }
    const fade = Math.min(1, (time - person.since) / .28);
    if (fade < 1) mix(person.from, scratch, fade * fade * (3 - 2 * fade), person.pose); else person.pose.set(scratch);
    actorMatrix.compose(p.set(person.x, y, person.z), q.setFromAxisAngle(Y, person.heading).multiply(r.setFromAxisAngle(s3.set(0, 0, 1), person.reactUntil > time ? Math.sin((person.reactUntil - time) * 18) * .045 * Math.min(1, (person.reactUntil - time) * 4) : 0)), s3.setScalar(base * person.look.scale));
    for (let b = 0; b < BONES.length; b++) {
      const id = person.ids[b]; if (id < 0) continue;
      partMatrix.compose(p.fromArray(person.pose, b * 7), r.fromArray(person.pose, b * 7 + 3), one).premultiply(actorMatrix);
      batch.setMatrixAt(id, partMatrix);
    }
  }
  function ball(index: number, x: number, y: number, z: number, radius: number) {
    partMatrix.compose(p.set(x, y, z), r.identity(), s3.setScalar(radius)); balls.setMatrixAt(index, partMatrix);
  }

  // ------------------------------------------------------------ pedestrian minds
  const basketball = actors.find(person => person.role === 'basketball')!;
  const bowler = actors.find(person => person.role === 'cricket' && person.index === 1)!;
  const batter = actors.find(person => person.role === 'cricket' && person.index === 0)!;
  const passTargets: Point[] = [[6, -34], [25, -20], [36, -33], [14, -21]];
  const walkers = actors.filter(person => person.mind);
  const solidPeople = actors.filter(person => person.role !== 'spectator');
  const contacts: CityContact[] = [];
  let contactCount = 0;
  group.userData.people = solidPeople;
  function syncBody(person: Actor) {
    Object.assign(person.collider, { x: person.x, z: person.z, y: person.y, heading: person.heading, vx: person.mind?.vx ?? person.collider.vx, vz: person.mind?.vz ?? person.collider.vz });
    return person.collider;
  }
  function react(contact: CityContact, time: number) {
    const person = solidPeople.find(person => person.collider.id === contact.id);
    if (!person || time - person.lastContact < .8) return;
    person.lastContact = time; person.reactUntil = time + .9; person.reactX = -contact.nx; person.reactZ = -contact.nz; contactCount++;
    if (person.mind) { person.mind.texting = false; person.mind.vx = 0; person.mind.vz = 0; }
  }
  function constrain(person: Actor, x: number, z: number, context: CityLifeContext, time: number, dt = 1 / 60) {
    if (!context.bodies?.length) return;
    const body = { ...syncBody(person), x, z, vx: (person.x - x) / Math.max(dt, .001), vz: (person.z - z) / Math.max(dt, .001) };
    const hit = sweepBody(body, person.x - x, person.z - z, context.bodies);
    person.x = body.x; person.z = body.z;
    if (hit) {
      react({ ...hit, id: person.collider.id, kind: 'person', nx: -hit.nx, nz: -hit.nz }, time);
      if (time - person.lastContact < .001) {
        if (hit.id.startsWith('player-')) contacts.push({ ...hit, id: person.collider.id, kind: 'person', nx: -hit.nx, nz: -hit.nz });
        else if (hit.kind === 'vehicle') contacts.push({ ...hit, receiver: 'npc' });
      }
      if (person.mind) person.mind.vx = person.mind.vz = 0;
    }
    person.collider.vx = (person.x - x) / Math.max(dt, .001); person.collider.vz = (person.z - z) / Math.max(dt, .001);
    syncBody(person);
  }
  group.userData.walkers = walkers; // read by the browser checks (stuck or overlapping people)
  // Street furniture (lamp posts, signal posts, planters, benches, trees) as boxes on a 4-unit grid.
  type Box = { minX: number; maxX: number; minZ: number; maxZ: number };
  const furniture = new Map<string, Box[]>(), cell = (x: number, z: number) => Math.floor(x / 4) + ',' + Math.floor(z / 4);
  const nearby = (x: number, z: number) => furniture.get(cell(x, z)) ?? [];
  /** Distance from (x, z) to a box, and the direction to step away from it. */
  const away = (box: Box, x: number, z: number) => {
    let ox = x - THREE.MathUtils.clamp(x, box.minX, box.maxX), oz = z - THREE.MathUtils.clamp(z, box.minZ, box.maxZ), d = Math.hypot(ox, oz);
    if (d < 1e-4) { ox = x - (box.minX + box.maxX) / 2; oz = z - (box.minZ + box.maxZ) / 2; d = 0; }
    const n = Math.hypot(ox, oz) || 1; return { d, nx: ox / n, nz: oz / n };
  };
  function setObstacles(boxes: readonly Box[]) {
    furniture.clear();
    for (const box of boxes) {
      if (box.maxX - box.minX > 8 || box.maxZ - box.minZ > 8) continue;
      for (let x = Math.floor((box.minX - 1) / 4); x <= Math.floor((box.maxX + 1) / 4); x++) for (let z = Math.floor((box.minZ - 1) / 4); z <= Math.floor((box.maxZ + 1) / 4); z++) {
        const key = x + ',' + z; if (!furniture.has(key)) furniture.set(key, []); furniture.get(key)!.push(box);
      }
    }
    // Route corners never sit on a post: step each one clear of anything within reach.
    for (const node of graph) for (let pass = 0; pass < 3; pass++) for (const box of nearby(node.x, node.z)) {
      const { d, nx, nz } = away(box, node.x, node.z); if (d < .65) { node.x += nx * (.65 - d); node.z += nz * (.65 - d); }
    }
  }
  const turn = (from: number, to: number, rate: number) => { let d = to - from; d = Math.atan2(Math.sin(d), Math.cos(d)); return from + THREE.MathUtils.clamp(d, -rate, rate); };

  /** A zebra is safe once the signal stops the cars crossing it and nothing is still rolling towards it. */
  function safeToCross(crossing: Crossing, time: number, context: CityLifeContext, patience: number) {
    if (context.coupe && Math.hypot(context.coupe.x - crossing.x, context.coupe.z - crossing.z) < 14) return false;
    const close = context.cars.some(car => car.speed > .4 && Math.hypot(car.x - crossing.x, car.z - crossing.z) < (patience > 25 ? 6 : 11));
    return !close && (junctionPhase(crossing.ix, crossing.iz, time) === crossing.axis || patience > 25);
  }
  function chooseGoal(person: Actor) {
    const m = person.mind!, here = graph[m.path[m.path.length - 1] ?? 0] ?? graph[0];
    const goal = pickNode(here); m.path = walkRoute(graph, here.id, goal.id); m.step = 1; m.state = 'walk'; m.texting = person.look.phone && random() < .3;
  }
  function idle(person: Actor, seconds: number) {
    const m = person.mind!; m.state = 'idle'; m.timer = seconds;
    m.activity = person.look.phone && random() < .5 ? 'phone' : random() < .5 ? 'look' : 'stand';
  }
  function think(person: Actor, dt: number, time: number, context: CityLifeContext) {
    const m = person.mind!;
    let tx = person.x, tz = person.z, pace = 0;
    if (m.leader) {
      // Companions keep beside their leader, and stop and talk when the leader stops.
      const leader = m.leader, lm = leader.mind!, rx = Math.cos(leader.heading), rz = -Math.sin(leader.heading);
      tx = leader.x + rx * m.offset; tz = leader.z + rz * m.offset;
      pace = lm.state === 'walk' ? Math.max(.6 * GAIT, Math.hypot(lm.vx, lm.vz)) * 1.15 : .8 * GAIT;
      // Once the leader stops, stay put (the leader turns to face us), closing in only if left behind.
      const apart = Math.hypot(leader.x - person.x, leader.z - person.z);
      if (lm.state !== 'walk') { if (apart > 1.6) { tx = leader.x + (person.x - leader.x) / apart; tz = leader.z + (person.z - leader.z) / apart; } else { tx = person.x; tz = person.z; } }
      m.state = lm.state === 'walk' ? 'walk' : 'idle'; m.activity = lm.state === 'idle' ? 'chat' : 'stand';
      if (lm.state === 'idle' && lm.activity !== 'phone') lm.activity = 'chat';
      if (Math.hypot(tx - person.x, tz - person.z) < .2) pace = 0;
    } else if (m.zone >= 0) {
      const line = zoneLines[m.zone];
      if (m.state === 'idle') { m.timer -= dt; if (m.timer <= 0) { m.target = m.along + (random() < .5 ? -1 : 1) * (4 + random() * Math.min(18, line.length * .4)); m.state = 'walk'; } }
      else {
        const dir = Math.sign(m.target - m.along), stepLength = Math.min(Math.abs(m.target - m.along), m.pace * dt); m.along += dir * stepLength;
        if (Math.abs(m.target - m.along) < .05) idle(person, 4 + random() * 10);
      }
      [tx, tz] = line.at(m.along + (m.state === 'walk' ? Math.sign(m.target - m.along) * .6 : 0)); pace = m.state === 'walk' ? m.pace : 0;
    } else {
      const node = graph[m.path[m.step]];
      if (m.state === 'idle') { m.timer -= dt; if (m.timer <= 0) chooseGoal(person); }
      else if (!node) idle(person, 4 + random() * 9);
      else {
        const prev = graph[m.path[m.step - 1]] ?? node, link = prev.links.find(item => item.to === node.id);
        if (m.state === 'wait') {
          m.patience += dt;
          if (link?.crossing && safeToCross(link.crossing, time, context, m.patience)) { m.state = 'walk'; m.crossing = link.crossing; }
        } else if (link?.crossing && m.crossing !== link.crossing && Math.hypot(prev.x - person.x, prev.z - person.z) < .9) { m.state = 'wait'; m.patience = 0; }
        const dx = node.x - prev.x, dz = node.z - prev.z, len = Math.hypot(dx, dz) || 1, side = link?.crossing ? m.side * .4 : m.side;
        tx = node.x + dz / len * side; tz = node.z - dx / len * side;
        if (m.state === 'wait') { tx = prev.x + dz / len * side; tz = prev.z - dx / len * side; }
        pace = m.state === 'walk' ? m.pace * (m.crossing ? 1.3 : m.texting ? .75 : 1) : 0;
        if (m.state === 'walk' && Math.hypot(tx - person.x, tz - person.z) < .7) {
          m.step++; m.crossing = null;
          if (m.step >= m.path.length) idle(person, 4 + random() * 9);
        }
      }
    }
    // Steering: seek the target, keep apart from neighbours, ease velocity, then face the direction of travel.
    let dx = tx - person.x, dz = tz - person.z; const distance = Math.hypot(dx, dz);
    const speed = pace * Math.min(1, distance / .5); dx = distance > 1e-4 ? dx / distance * speed : 0; dz = distance > 1e-4 ? dz / distance * speed : 0;
    for (const other of walkers) {
      if (other === person) continue;
      const ox = person.x - other.x, oz = person.z - other.z, d = Math.hypot(ox, oz);
      if (d > 0 && d < .85) { dx += ox / d * (.85 - d) * 2.5; dz += oz / d * (.85 - d) * 2.5; }
    }
    // Step round street furniture: push off it and slide along it in the direction of travel.
    for (const box of nearby(person.x, person.z)) {
      const { d, nx, nz } = away(box, person.x, person.z);
      if (d < .7) { const push = (.7 - d) * 4, slide = Math.sign(-nz * dx + nx * dz) || 1; dx += (nx - nz * slide * .6) * push; dz += (nz + nx * slide * .6) * push; }
    }
    // Predict the visitor's approach, then step aside rather than seeking through them.
    for (const body of context.bodies ?? []) {
      const separation = bodySeparation(syncBody(person), body);
      const approach = Math.max(0, body.vx * separation.nx + body.vz * separation.nz);
      const reach = body.kind === 'vehicle' ? 1.4 + Math.min(2.5, approach * .22) : .65;
      if (separation.gap < reach) {
        const pressure = Math.max(0, 1 - separation.gap / reach);
        const inward = dx * separation.nx + dz * separation.nz;
        if (inward < 0) { dx -= inward * separation.nx; dz -= inward * separation.nz; }
        dx += separation.nx * pressure * (body.kind === 'vehicle' ? 2.4 : 1.2);
        dz += separation.nz * pressure * (body.kind === 'vehicle' ? 2.4 : 1.2);
        m.texting = false;
      }
    }
    if (person.reactUntil > time) { dx = person.reactX * .65; dz = person.reactZ * .65; person.heading = turn(person.heading, Math.atan2(-person.reactX, -person.reactZ), dt * 8); }
    const fromX = person.x, fromZ = person.z;
    m.vx += (dx - m.vx) * Math.min(1, dt * 5); m.vz += (dz - m.vz) * Math.min(1, dt * 5);
    person.x += m.vx * dt; person.z += m.vz * dt;
    for (const box of nearby(person.x, person.z)) { const { d, nx, nz } = away(box, person.x, person.z); if (d < .3) { person.x += nx * (.3 - d); person.z += nz * (.3 - d); } }
    constrain(person, fromX, fromZ, context, time, dt);
    const moving = Math.hypot(m.vx, m.vz);
    if (moving > .15) person.heading = turn(person.heading, Math.atan2(m.vx, m.vz), dt * 6);
    else if (m.activity === 'chat') {
      const partner = m.leader ?? walkers.find(other => other.mind?.leader === person);
      if (partner) person.heading = turn(person.heading, Math.atan2(partner.x - person.x, partner.z - person.z), dt * 3);
    }
    // Walk cycles follow distance travelled, so feet keep pace with the ground.
    m.stride += moving * dt / STEP;
    const surface = m.zone >= 0 || onRoad(person.x, person.z) ? .02 : .12;
    person.y += (surface - person.y) * Math.min(1, dt * 10);
  }

  let tick = 0, last = -1;
  function update(time: number, context: CityLifeContext = { cars: [], coupe: null }) {
    const dt = last < 0 ? 0 : Math.min(.1, Math.max(0, time - last)); last = time;
    if (dt > 0) for (const person of walkers) think(person, dt, time, context);
    const shot = time % 5.2 / 5.2, delivery = time % 7 / 7, turnIndex = tick++;
    actors.forEach((person, i) => {
      // Seated spectators only shift now and then, so a quarter of them are re-posed each frame.
      if (person.role === 'spectator' && turnIndex > 0 && (i + turnIndex) % 4) return;
      const t = time + person.phase;
      const oldX = person.x, oldZ = person.z;
      if (person.mind && person.reactUntil > time) { render(person, 'interact-right', time - person.lastContact, false, time); return; }
      if (person.mind) {
        const m = person.mind, moving = Math.hypot(m.vx, m.vz);
        if (moving > .2) render(person, 'walk', m.stride * (kit?.clips.walk.duration ?? 1), true, time);
        else if (m.state === 'idle' && m.activity === 'phone') render(person, 'holding-right', t, true, time);
        else if (m.state === 'idle' && m.activity === 'chat') render(person, Math.sin(t * .45) > .35 ? 'interact-right' : Math.sin(t * .31) > .6 ? 'emote-yes' : 'idle', t, true, time);
        else render(person, 'idle', t, true, time);
        return;
      }
      // Players run while they move; the clip follows how far they have come since the last frame.
      if (person.role === 'basketball') {
        person.x = -47 + person.index % 3 * 7 + Math.sin(time * .6 + person.phase) * 2.4;
        person.z = 20 + Math.floor(person.index / 3) * 11 + Math.cos(time * .7 + person.phase) * 1.7;
        person.heading = Math.atan2(-26.75 - person.x, 26 - person.z);
        constrain(person, oldX, oldZ, context, time, dt);
        if (person.reactUntil > time) { render(person, 'interact-right', time - person.lastContact, false, time); return; }
        if (person.index === 0 && shot > .58 && shot < .82) render(person, 'holding-both-shoot', (shot - .58) * 5.2, false, time);
        else render(person, 'sprint', t, true, time);
      } else if (person.role === 'football') {
        if (person.index > 1) { person.x = 5 + (person.index - 2) % 4 * 10 + Math.sin(time * .55 + person.phase) * 2; person.z = -35 + Math.floor((person.index - 2) / 4) * 16 + Math.cos(time * .65 + person.phase) * 2; }
        person.heading = Math.atan2(22 - person.x, -27 - person.z);
        constrain(person, oldX, oldZ, context, time, dt);
        if (person.reactUntil > time) { render(person, 'interact-right', time - person.lastContact, false, time); return; }
        render(person, person.index < 2 ? 'crouch' : 'sprint', t, true, time);
      } else if (person.role === 'cricket') {
        constrain(person, oldX, oldZ, context, time, dt);
        if (person.reactUntil > time) { render(person, 'interact-right', time - person.lastContact, false, time); return; }
        if (person.index === 1) {
          person.z = -46 + Math.min(delivery / .33, 1) * 9;
          constrain(person, oldX, oldZ, context, time, dt);
          if (person.reactUntil > time) { render(person, 'interact-right', time - person.lastContact, false, time); return; }
          if (delivery < .3) render(person, 'sprint', t, true, time);
          else if (delivery < .45) render(person, 'attack-melee-right', (delivery - .3) * 7, false, time);
          else render(person, 'idle', t, true, time);
        } else if (person.index === 0) {
          if (delivery > .4 && delivery < .57) render(person, 'attack-melee-right', (delivery - .4) * 7, false, time);
          else render(person, 'idle', t, true, time);
        } else render(person, 'crouch', t, true, time);
      } else if (person.role === 'marshal') { constrain(person, oldX, oldZ, context, time, dt); render(person, person.reactUntil > time || Math.sin(t * .2) > .7 ? 'interact-right' : 'idle', t, true, time); }
      else if (person.role === 'spectator') {
        // Fans jump up and cheer now and then; otherwise they sit on their seat.
        const cheering = Math.sin(time * 1.2 + person.phase) > .82;
        if (cheering) render(person, 'emote-yes', t, true, time, person.y - .55);
        else render(person, 'sit', t, true, time, person.y - .1 - sitLift * base * person.look.scale);
      }
    });
    if (batch) {
      // The bat is held in the batter's right hand and follows the swing.
      if (batter.ids[4] >= 0) {
        batch.getMatrixAt(batter.ids[4], partMatrix);
        bat.matrixAutoUpdate = false;
        bat.matrix.copy(partMatrix).multiply(actorMatrix.compose(p.set(0, armReach, .02), q.setFromAxisAngle(s3.set(1, 0, 0), -.5), s3.setScalar(SIZE / (base * batter.look.scale))));
        bat.matrixWorldNeedsUpdate = true;
      }
      batch.userData.probe = basketball.pose[3 * 7 + 3];
    }
    grounded.forEach((person, i) => {
      const size = 1.05 * SIZE * person.look.scale;
      partMatrix.compose(p.set(person.x, person.y + .015, person.z), r.identity(), s3.set(size, 1, size)); shadows.setMatrixAt(i, partMatrix);
    });
    shadows.instanceMatrix.needsUpdate = true;
    if (shot < .59) ball(0, basketball.x + .55 * SIZE, .425 + .3 * SIZE + Math.abs(Math.sin(time * 10)) * .6 * SIZE, basketball.z, .3 * SIZE);
    else {
      const t = Math.min((shot - .59) / .28, 1);
      ball(0, THREE.MathUtils.lerp(basketball.x, -26.75, t), THREE.MathUtils.lerp(hand(2.3), 4, t) + Math.sin(t * Math.PI) * 4.8, THREE.MathUtils.lerp(basketball.z, 26, t), .3 * SIZE);
      if (shot > .87) ball(0, -26.75, 4 - (shot - .87) / .13 * 3.2, 26, .3 * SIZE);
    }
    const pass = time / 2.8, start = passTargets[Math.floor(pass) % passTargets.length], end = passTargets[(Math.floor(pass) + 1) % passTargets.length], t = pass % 1;
    ball(1, THREE.MathUtils.lerp(start[0], end[0], t), .425 + .36 * SIZE + Math.sin(t * Math.PI) * .25, THREE.MathUtils.lerp(start[1], end[1], t), .36 * SIZE);
    if (delivery < .35) ball(2, bowler.x + .3 * SIZE, hand(1.9), bowler.z + .3 * SIZE, .16 * SIZE);
    else if (delivery < .48) { const t = (delivery - .35) / .13; ball(2, -49, hand(1.3 - Math.sin(t * Math.PI) * .65), THREE.MathUtils.lerp(-37, -22, t), .16 * SIZE); }
    else { const t = (delivery - .48) / .52; ball(2, THREE.MathUtils.lerp(-49, -34, t), hand(.6) + Math.sin(t * Math.PI) * 4, THREE.MathUtils.lerp(-22, -39, t), .16 * SIZE); }
    solidPeople.forEach(syncBody);
    balls.instanceMatrix.needsUpdate = true;
  }
  update(0);

  return {
    group, update, setKit, setObstacles, react,
    bodies: () => kit && batch ? solidPeople.map(syncBody) : [],
    drainContacts: () => contacts.splice(0),
    contactCount: () => contactCount,
    /** A value that changes while the players move and holds still while the city is paused (browser checks). */
    probe: () => batch?.userData.probe ?? null,
    /** People on the carriageway right now (on a zebra), for drivers to give way to. */
    onRoad: () => walkers.filter(person => onRoad(person.x, person.z)).map(person => ({ x: person.x, z: person.z, radius: .45 })),
    counts: { people: actors.length, walkers: walkers.length, athletes: 24, spectators: actors.filter(person => person.role === 'spectator').length },
    dispose() { batch?.dispose(); (batch?.material as THREE.Material | undefined)?.dispose(); shadowTexture.dispose(); shadowGeometry.dispose(); },
  };
}
