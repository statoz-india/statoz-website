import * as THREE from 'three';
import { CITY_PALETTE as P } from './city-config';

export type CitySeat = { x: number; y: number; z: number; heading: number; accent: string };
type Point = readonly [number, number];
type Actor = {
  role: 'walk' | 'basketball' | 'football' | 'cricket' | 'spectator' | 'marshal';
  x: number; y: number; z: number; heading: number; phase: number;
  shirt: string; skin: string; route?: ReturnType<typeof route>; index: number;
};

function route(points: readonly Point[]) {
  let length = 0;
  const segments = points.map((point, i) => {
    const next = points[(i + 1) % points.length];
    const distance = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const segment = { from: point, to: next, start: length, distance };
    length += distance; return segment;
  });
  return { segments, length };
}

/** Original low-poly citizens, articulated and instanced into six draw calls. */
export function createCityLife(seats: CitySeat[], raceX: number, raceZ: number) {
  const group = new THREE.Group(); group.name = 'statoz-city-life';
  const actors: Actor[] = [];
  const skin = ['#c8946e', '#87553e', '#e7b998', '#a96e4c'];
  const shirts = [P.cyan, P.pink, P.gold, P.violet, P.lime, P.text];
  function actor(role: Actor['role'], x: number, z: number, index: number, shirt: string, y = -.12, heading = 0) {
    const person: Actor = { role, x, z, y, heading, index, shirt, skin: skin[actors.length % skin.length], phase: actors.length * 1.73 };
    actors.push(person); return person;
  }
  const paths: readonly (readonly Point[])[] = [
    [[-71.4, 8.6], [-65.6, 8.6], [-65.6, 42.6], [-71.4, 42.6]], // between the Clubhouse and the Blacktop
    [[-76, -1.8], [-22, -1.8], [-22, -1.1], [-76, -1.1]], // the pavement south of the Oval
    [[53, -42], [57, -42], [57, -8], [53, -8]], // the kiosk concourse beside the Floodlights
    [[-62, 70], [-22, 70], [-22, 76], [-62, 76]],
    [[16, 70], [71, 70], [71, 76], [16, 76]],
    [[-12, -57], [57, -57], [57, -55.6], [-12, -55.6]], // behind the north stand, past the newsroom
    Array.from({ length: 24 }, (_, i) => [-5 + Math.cos(i / 24 * Math.PI * 2) * 9.4, 23 + Math.sin(i / 24 * Math.PI * 2) * 9.4] as Point),
  ];
  paths.forEach((points, i) => {
    const walk = route(points);
    for (let j = 0; j < (i === 6 ? 7 : 4); j++) actor('walk', points[0][0], points[0][1], j, shirts[(i + j) % shirts.length]).route = walk;
  });
  for (let i = 0; i < 6; i++) actor('basketball', -45 + i % 3 * 7, 20 + Math.floor(i / 3) * 11, i, i < 3 ? P.orange : P.cyan, .35);
  for (let i = 0; i < 10; i++) actor('football', i < 2 ? (i ? 43 : 1) : 5 + (i - 2) % 4 * 10, i < 2 ? -27 : -35 + Math.floor((i - 2) / 4) * 16, i, i % 2 ? P.lime : P.text, .35);
  const cricket: Point[] = [[-47.7, -21], [-49, -46], [-49, -18.5], [-64, -39], [-34, -40], [-31, -26], [-61, -16], [-48, -50]];
  cricket.forEach(([x, z], i) => actor('cricket', x, z, i, i === 0 ? P.gold : P.cyan, .35, i === 0 ? Math.PI : 0));
  // Stands offer a scattering of occupied seats, so the crowd already has gaps in it.
  seats.forEach((seat, i) => actor('spectator', seat.x, seat.z, i, i % 3 ? seat.accent : shirts[i % shirts.length], seat.y - .85, seat.heading));
  for (let i = 0; i < 3; i++) actor('marshal', raceX - 8 + i * 6, raceZ + 5, i, P.orange, .245, Math.PI);

  const cloth = new THREE.MeshStandardMaterial({ color: P.text, roughness: .92, metalness: 0, emissive: P.text, emissiveIntensity: .08 });
  function instances(geometry: THREE.BufferGeometry, count: number, name: string) {
    const mesh = new THREE.InstancedMesh(geometry, cloth, count); mesh.name = name;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; group.add(mesh); return mesh;
  }
  const torso = instances(new THREE.CylinderGeometry(.5, .38, 1, 6), actors.length, 'jerseys');
  const heads = instances(new THREE.IcosahedronGeometry(1, 1), actors.length * 2, 'heads-and-hair');
  const hips = instances(new THREE.BoxGeometry(1, 1, 1), actors.length, 'shorts');
  const limbs = instances(new THREE.CylinderGeometry(1, 1, 1, 5), actors.length * 8, 'articulated-limbs');
  const shoes = instances(new THREE.BoxGeometry(1, 1, 1), actors.length * 2, 'shoes');
  const balls = instances(new THREE.IcosahedronGeometry(1, 2), 3, 'sports-balls');
  const color = new THREE.Color();
  actors.forEach((person, i) => {
    torso.setColorAt(i, color.set(person.shirt)); heads.setColorAt(i * 2, color.set(person.skin)); heads.setColorAt(i * 2 + 1, color.set(person.role === 'cricket' ? person.shirt : P.road)); hips.setColorAt(i, color.set(person.role === 'cricket' ? person.shirt : P.building));
    for (let part = 0; part < 8; part++) limbs.setColorAt(i * 8 + part, color.set(part < 4 ? person.skin : person.role === 'cricket' ? person.shirt : P.building));
    for (let foot = 0; foot < 2; foot++) shoes.setColorAt(i * 2 + foot, color.set(person.role === 'walk' ? P.road : P.text));
  });
  [P.orange, P.text, P.racing].forEach((tint, i) => balls.setColorAt(i, color.set(tint)));
  const batGeometry = new THREE.BoxGeometry(.23, .95, .12); batGeometry.translate(0, -.45, 0);
  const bat = new THREE.Mesh(batGeometry, new THREE.MeshStandardMaterial({ color: P.gold, roughness: .8 })); group.add(bat);

  const dummy = new THREE.Object3D();
  const a = new THREE.Vector3(), b = new THREE.Vector3(), direction = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let current: Actor, cosine = 1, sine = 0;
  function point(out: THREE.Vector3, x: number, y: number, z: number) { out.set(current.x + x * cosine + z * sine, current.y + y, current.z - x * sine + z * cosine); }
  function piece(mesh: THREE.InstancedMesh, index: number, x: number, y: number, z: number, w: number, h: number, d: number) {
    point(dummy.position, x, y, z); dummy.rotation.set(0, current.heading, 0); dummy.scale.set(w, h, d); dummy.updateMatrix(); mesh.setMatrixAt(index, dummy.matrix);
  }
  function limb(index: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, radius: number) {
    point(a, ax, ay, az); point(b, bx, by, bz); direction.subVectors(b, a);
    const length = direction.length();
    dummy.position.copy(a).add(b).multiplyScalar(.5); dummy.quaternion.setFromUnitVectors(up, direction.normalize()); dummy.scale.set(radius, length, radius); dummy.updateMatrix(); limbs.setMatrixAt(index, dummy.matrix);
  }
  function ball(index: number, x: number, y: number, z: number, radius: number) {
    dummy.position.set(x, y, z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(radius); dummy.updateMatrix(); balls.setMatrixAt(index, dummy.matrix);
  }
  const basketball = actors.find(person => person.role === 'basketball')!;
  const bowler = actors.find(person => person.role === 'cricket' && person.index === 1)!;
  const batter = actors.find(person => person.role === 'cricket' && person.index === 0)!;
  const passTargets: Point[] = [[6, -34], [25, -20], [36, -33], [14, -21]];

  let tick = 0;
  function update(time: number) {
    const shot = time % 5.2 / 5.2, delivery = time % 7 / 7, turn = tick++;
    actors.forEach((person, i) => {
      // Seated spectators only shift now and then, so a quarter of them are re-posed each frame.
      if (person.role === 'spectator' && turn > 0 && (i + turn) % 4) return;
      let stride = 0, cheer = 0, shotPose = 0;
      if (person.role === 'walk') {
        const path = person.route!;
        const distance = (time * 1.15 + person.phase * 5) % path.length;
        const segment = path.segments.find(item => distance < item.start + item.distance) || path.segments[path.segments.length - 1];
        const t = (distance - segment.start) / segment.distance;
        person.x = THREE.MathUtils.lerp(segment.from[0], segment.to[0], t); person.z = THREE.MathUtils.lerp(segment.from[1], segment.to[1], t);
        person.heading = Math.atan2(segment.to[0] - segment.from[0], segment.to[1] - segment.from[1]); stride = Math.sin(time * 7 + person.phase) * .30;
      } else if (person.role === 'basketball') {
        person.x = -45 + person.index % 3 * 7 + Math.sin(time * .6 + person.phase) * 2.4;
        person.z = 20 + Math.floor(person.index / 3) * 11 + Math.cos(time * .7 + person.phase) * 1.7;
        person.heading = Math.atan2(-24.75 - person.x, 26 - person.z); stride = Math.sin(time * 8 + person.phase) * .32;
        if (person.index === 0 && shot > .58 && shot < .82) { shotPose = 1; stride *= .2; }
      } else if (person.role === 'football') {
        if (person.index > 1) { person.x = 5 + (person.index - 2) % 4 * 10 + Math.sin(time * .55 + person.phase) * 2; person.z = -35 + Math.floor((person.index - 2) / 4) * 16 + Math.cos(time * .65 + person.phase) * 2; }
        person.heading = Math.atan2(22 - person.x, -27 - person.z); stride = Math.sin(time * 8 + person.phase) * (person.index < 2 ? .06 : .4);
      } else if (person.role === 'cricket') {
        if (person.index === 1) { person.z = -46 + Math.min(delivery / .33, 1) * 9; stride = delivery < .33 ? Math.sin(time * 10) * .4 : 0; shotPose = delivery > .28 && delivery < .4 ? .85 : 0; }
        if (person.index === 0) shotPose = delivery > .4 && delivery < .57 ? .7 : 0;
      } else if (person.role === 'spectator') cheer = Math.max(0, Math.sin(time * 1.2 + person.phase) - .65) * 2;
      current = person; cosine = Math.cos(person.heading); sine = Math.sin(person.heading);
      const seated = person.role === 'spectator';
      const bob = seated ? 0 : Math.abs(stride) * .07;
      piece(torso, i, 0, 1.29 + bob, 0, .58, .74, .43);
      piece(heads, i * 2, 0, 1.88 + bob, 0, .23, .26, .23);
      piece(heads, i * 2 + 1, 0, 2.06 + bob, -.025, .23, .13, .23);
      piece(hips, i, 0, .87 + bob, 0, .47, .29, .32);
      for (const side of [-1, 1]) {
        const part = side < 0 ? 0 : 1, swing = stride * side;
        const elbowY = 1.18 + shotPose * .65 + cheer * .75, wristY = .99 + shotPose * 1.15 + cheer;
        limb(i * 8 + part * 2, side * .3, 1.56 + bob, 0, side * .37, elbowY, -swing, .09);
        limb(i * 8 + part * 2 + 1, side * .37, elbowY, -swing, side * .36, wristY, -swing * 1.6 - shotPose * .08, .075);
        const kneeZ = seated ? .48 : swing * .5, kneeY = seated ? .83 : .5;
        const footZ = seated ? .49 : swing, footY = seated ? .35 : .14 + Math.max(0, swing) * .3;
        limb(i * 8 + 4 + part * 2, side * .14, .88, 0, side * .16, kneeY, kneeZ, .105);
        limb(i * 8 + 5 + part * 2, side * .16, kneeY, kneeZ, side * .16, footY, footZ, .09);
        piece(shoes, i * 2 + part, side * .16, footY - .025, footZ + .07, .22, .14, .36);
      }
    });
    if (shot < .59) ball(0, basketball.x + .6, .78 + Math.abs(Math.sin(time * 10)) * .58, basketball.z, .32);
    else {
      const t = Math.min((shot - .59) / .28, 1);
      ball(0, THREE.MathUtils.lerp(basketball.x, -24.75, t), THREE.MathUtils.lerp(2.3, 4, t) + Math.sin(t * Math.PI) * 4.8, THREE.MathUtils.lerp(basketball.z, 26, t), .32);
      if (shot > .87) ball(0, -24.75, 4 - (shot - .87) / .13 * 3.2, 26, .32);
    }
    const pass = time / 2.8, start = passTargets[Math.floor(pass) % passTargets.length], end = passTargets[(Math.floor(pass) + 1) % passTargets.length], t = pass % 1;
    ball(1, THREE.MathUtils.lerp(start[0], end[0], t), .85 + Math.sin(t * Math.PI) * .25, THREE.MathUtils.lerp(start[1], end[1], t), .38);
    if (delivery < .35) ball(2, bowler.x + .3, 2.1, bowler.z + .3, .16);
    else if (delivery < .48) { const t = (delivery - .35) / .13; ball(2, -49, 1.3 - Math.sin(t * Math.PI) * .65, THREE.MathUtils.lerp(-37, -22, t), .16); }
    else { const t = (delivery - .48) / .52; ball(2, THREE.MathUtils.lerp(-49, -34, t), .6 + Math.sin(t * Math.PI) * 4, THREE.MathUtils.lerp(-22, -39, t), .16); }
    const batting = delivery > .4 && delivery < .57 ? .7 : 0;
    bat.position.set(batter.x - .36, batter.y + .99 + batting * 1.15, batter.z + batting * .08); bat.rotation.set(batting ? -1.3 : .3, 0, -.22);
    for (const mesh of [torso, heads, hips, limbs, shoes, balls]) mesh.instanceMatrix.needsUpdate = true;
  }
  update(0);
  return { group, update, counts: { people: actors.length, walkers: actors.filter(person => person.role === 'walk').length, athletes: 24, spectators: actors.filter(person => person.role === 'spectator').length } };
}
