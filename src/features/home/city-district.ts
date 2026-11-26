import * as THREE from 'three';
import { CITY_PALETTE as P } from './city-config';
import { seeded, type CityKit } from './city-kit';
import { buildRoads, STREETS_X, STREETS_Z } from './city-roads';

export { STREETS_X, STREETS_Z };
export const HAZE = '#0a1a2f';
/** The approach avenue is kept clear of far-city blocks, so the entrance can breathe. */
const avenueClear = (x: number, z: number, margin = 0) => Math.abs(x + 17) < 46 + margin && z > 84 - margin && z < 320;
// Mostly warm rooms with some cool office light; colour stays with the signs and venues.
const WINDOWS = ['#ffd9a0', '#ffe6bd', '#ffd9a0', '#dcecff', '#a9d8ff'] as const;
const nearStreet = (value: number, streets: readonly number[], margin: number) => streets.some(street => Math.abs(value - street) < margin);

/** Streets, pavements, parks, shops, the surrounding skyline and the night sky. */
export function buildDistrict(kit: CityKit, mobile: boolean) {
  const { box, cylinder, material, blend, metal, dark } = kit;
  const random = seeded(8061);
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];

  // One continuous ground: the district sits on a wider city that fades into haze.
  const land = new THREE.Mesh(new THREE.PlaneGeometry(3200, 3200), material('#060d19', 0, .95));
  land.rotation.x = -Math.PI / 2; land.position.y = -.09; land.receiveShadow = true; kit.details.add(land);
  box(224, .3, 184, 0, -.22, -3, material('#0f1c2d', 0, .85));
  const roads = buildRoads(kit);
  // Crossings are painted by the road shader; signals stand on the pavement corners of the four central junctions.
  for (const x of STREETS_X) for (const z of STREETS_Z) {
    if ((x === -17 || x === 82) && (z === 3 || z === 48)) for (const corner of [-1, 1]) {
      const px = x + corner * 4.3, pz = z + corner * 4.6;
      box(.16, 4.4, .16, px, 2.2, pz, metal); box(.5, 1.5, .4, px, 4.6, pz, material('#0b111c'));
      box(.26, .26, .08, px, 5.05, pz + corner * .22, material(P.racing, 1.6)); box(.26, .26, .08, px, 4.6, pz + corner * .22, material('#3a3320')); box(.26, .26, .08, px, 4.15, pz + corner * .22, material('#17382a'));
    }
  }

  // Street lighting: warm on the main streets, with a pool of light under every lamp.
  const amber = '#ffcf8e';
  function lamp(x: number, z: number, armX: number, armZ: number, tint = amber) {
    box(.16, 5.8, .16, x, 2.9, z, metal); box(armX ? 2 : .14, .12, armZ ? 2 : .14, x + armX * .95, 5.8, z + armZ * .95, metal);
    box(armX ? 1.1 : .4, .12, armZ ? 1.1 : .4, x + armX * 1.5, 5.7, z + armZ * 1.5, material(tint, 2.2));
    kit.pool(x + armX * 2.6, z + armZ * 2.6, 4.8, tint, .3);
    kit.reflection(x + armX * 2.2, z + armZ * 2.2, tint, .5, 8);
    // A metre under the head: any closer and the light floods the lamp's own arm into a bloom halo.
    kit.lampSpot(x + armX * 1.5, 4.6, z + armZ * 1.5, tint);
  }
  for (const z of STREETS_Z) for (let x = -104; x <= 104; x += 16) {
    if (nearStreet(x, STREETS_X, 6.5) || (z === 3 && x > 14 && x < 82)) continue;
    if (z === 83) lamp(x, z - 4.3, 0, 1); else lamp(x, z + 4.3, 0, -1);
  }
  for (const x of STREETS_X.slice(0, 3)) for (let z = -70; z <= 74; z += 18) {
    if (nearStreet(z, STREETS_Z, 7.5) || (x === -17 && z > 6 && z < 42)) continue;
    lamp(x + 3.95, z, -1, 0);
  }

  // Parked cars and small street buildings share a few simple forms.
  const carColors = ['#c9d3e0', '#2b3b57', '#8a94a6', '#1d2638', '#31506b', '#6b2f3c'];
  function parked(x: number, z: number, heading: number) {
    const car = kit.group(x, z, heading), body = material(pick(carColors), 0, .35);
    box(1.9, .62, 4.2, 0, .5, 0, body, car); box(1.7, .56, 2.2, 0, 1.05, -.2, material('#0c1522', 0, .25), car); box(1.5, .1, .1, 0, .62, 2.1, material('#fff6dc', .5), car); box(1.5, .1, .1, 0, .62, -2.1, material(P.racing, .5), car);
  }
  /** One shopfront design: a glazed front with a warm interior, slim fascia lettering, one muted awning. */
  function shop(x: number, z: number, width: number, depth: number, height: number, tint: string, name: string) {
    const shell = kit.group(x, z), stone = material('#202b3c', 0, .75), frame = material('#0c131e', 0, .4);
    box(width, height, depth, 0, height / 2, -.4, stone, shell); box(width + .2, .24, depth + .2, 0, height + .12, -.4, frame, shell);
    box(width - .6, 2.7, .1, 0, 1.55, depth / 2 - .35, material('#0a1420', 0, .12), shell);
    kit.windowQuad(shell, 0, 1.55, depth / 2 - .3, width - 1, 2.5, 0, '#ffd9a8', .85);
    for (let mullion = -1; mullion <= 1; mullion++) box(.08, 2.7, .12, mullion * (width - .6) / 3, 1.55, depth / 2 - .28, frame, shell);
    box(width - .4, .55, .16, 0, 3.25, depth / 2 - .3, frame, shell);
    kit.panel(kit.canvasTexture(512, 64, (c, w, h) => { c.fillStyle = '#0c131e'; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; kit.fitText(c, name, '600', 30, w * .6); c.fillStyle = '#d7e3ee'; c.fillText(name, w / 2, h / 2 + 1); c.fillStyle = tint; c.fillRect(w * .44, h - 8, w * .12, 3); }), 0, 3.25, depth / 2 - .21, width - 1.2, .48, 0, shell);
    const awning = box(width - .8, .08, 1.4, 0, 3.62, depth / 2 + .3, material('#2b3546', 0, .6), shell); awning.rotation.x = .16;
    box(width - .8, .04, .05, 0, 3.52, depth / 2 + .98, material(tint, .5), shell);
    kit.pool(x, z + depth / 2 + 1.6, 4.6, '#ffe2b0', .42);
    kit.lampSpot(x, 2.4, z + depth / 2 + .9, '#ffd9a8');
    kit.claim('shop ' + name, x - width / 2, z - depth / 2 - .4, x + width / 2, z + depth / 2 + 1);
  }
  function billboard(x: number, z: number, yaw: number, title: string, line: string, tint: string, height = 10) {
    const frame = kit.group(x, z, yaw);
    for (const leg of [-3.6, 3.6]) box(.4, height, .4, leg, height / 2, -.5, metal, frame);
    box(12.4, .3, 1.2, 0, height - 2.9, -.2, metal, frame);
    kit.sign(title, line, 0, height, 0, 12, 5, tint, 0, frame);
    for (const lampX of [-4, 0, 4]) box(.5, .16, .9, lampX, height - 2.75, .7, material('#fff2d6', 1.6), frame);
  }

  // South-west: a row of small shops facing the boulevard.
  shop(-83, 58.5, 9.4, 6.4, 4.4, P.orange, 'CAFE'); shop(-72.6, 58.5, 9.6, 6.4, 4.4, P.cyan, 'KIT ROOM');
  shop(-62, 58.5, 9.4, 6.4, 4.4, P.violet, 'ARCADE'); shop(-51.6, 58.5, 9, 6.4, 4.4, P.gold, 'RECORDS');
  for (const x of [-88.5, -77.8, -67, -56.4, -45.8]) kit.tree(x, 64.6, .75);

  // South-east: a park with a pond, lawns, paths and benches.
  const lawn = material('#12352f', 0, .95);
  box(21.5, .1, 12.6, 28.6, .04, 60.7, lawn); box(20.6, .1, 12.6, 66.8, .04, 60.7, lawn);
  cylinder(6.6, .16, 47.6, .08, 60.7, material('#33445e'), 40); cylinder(5.1, .2, 47.6, .12, 60.7, material('#1b6f8c', .35, .2), 40);
  cylinder(.5, 1.5, 47.6, .9, 60.7, material(P.cyan, 1.4), 10); kit.pool(47.6, 60.7, 9, P.cyan, .7, .26);
  for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2; const seat = box(2.6, .5, .8, 47.6 + Math.cos(a) * 7.6, .4, 60.7 + Math.sin(a) * 7.6, material('#2a3b55')); seat.rotation.y = -a + Math.PI / 2; }
  for (const [x0, x1] of [[19.5, 38], [57.5, 76]]) for (let i = 0; i < 9; i++) kit.tree(x0 + random() * (x1 - x0), 55.5 + random() * 10.4, 1);
  for (const x of [22, 34, 61, 73]) { box(.18, 1.1, .18, x, .6, 68.2, metal); box(.34, .2, .34, x, 1.25, 68.2, material('#ffe2b0', 2)); kit.pool(x, 68.2, 3.6, '#ffe2b0', .6); }

  // North-centre: a concourse of kiosks beside the football ground, and a car park by City Hall.
  for (const [z, tint] of [[-37, P.lime], [-25, P.orange], [-13, P.pink]] as const) {
    const kiosk = kit.group(55, z, -Math.PI / 2);
    box(3, 2.5, 2.4, 0, 1.25, 0, material('#1f2a3f'), kiosk); box(3.4, .16, 3.2, 0, 2.7, .3, material(tint, .35), kiosk).rotation.x = .12;
    kit.windowQuad(kiosk, 0, 1.6, 1.2, 2.3, 1, 0, '#ffe9c4', 1.1); kit.pool(55 - 2.4, z, 4, '#ffe9c4', .5);
  }
  box(17.4, .06, 27.4, 69, .03, -17.4, material('#0b1220', 0, .55));
  for (const row of [64.6, 73.4]) for (let i = 0; i <= 9; i++) {
    const z = -29.6 + i * 2.72; box(4.6, .02, .08, row, .07, z, material('#7c8ba3'));
    if (i < 9 && random() < .68) parked(row, z + 1.36, row < 69 ? Math.PI / 2 : -Math.PI / 2);
  }
  for (const z of [-25, -10]) { box(.22, 7, .22, 69, 3.5, z, metal); box(2.6, .16, .7, 69, 7, z, material('#eaf3ff', 2)); kit.pool(69, z, 9, '#e3efff', .5); kit.lampSpot(69, 5.8, z, '#e3efff'); }
  for (const z of [-34.6, -3.6]) for (const x of [62, 67, 72, 77]) kit.tree(x, z, .8);

  // The StatOz products are advertised in-world, as they are in the header.
  billboard(-55.5, -71.5, Math.PI / 4, 'STATOZ SPORTS', 'WEB.STATOZ.IN', P.cyan, 12);
  billboard(-104.5, -5, Math.PI / 3, 'STATOZ GAMES', 'GAMES.STATOZ.IN', P.pink, 10);

  // Trees shade the west bank of the Oval, the boulevard planters and the strip verges.
  for (let i = 0; i < 10; i++) kit.tree(-86.4 - (i % 2) * 1.6, -56 + i * 5.4, 1);
  for (const x of [-65, -51, -12, 20, 36, 52, 68]) { box(4, .55, 3.5, x, .4, 73, metal); box(3.5, .2, 3, x, .8, 73, material(blend(P.building, P.lime, .1))); kit.tree(x, 73, 1.05); }
  for (const z of [-8, 26, 46, 66]) { kit.tree(-104, z, .9); kit.tree(98, z - 20, .9); }

  // A facade atlas: 8 bays by 16 floors of mullions, spandrels and rooms, some lit, some dark.
  const facadeBase = kit.canvasTexture(512, 1024, (c, w, h) => {
    c.fillStyle = '#18222f'; c.fillRect(0, 0, w, h);
    for (let floor = 0; floor < 16; floor++) for (let bay = 0; bay < 8; bay++) {
      const x = bay * 64, y = floor * 64, glass = c.createLinearGradient(x, y, x + 64, y + 64);
      glass.addColorStop(0, '#0d1a2a'); glass.addColorStop(.6, '#132538'); glass.addColorStop(1, '#0b1522');
      c.fillStyle = glass; c.fillRect(x + 6, y + 10, 52, 44);
      c.fillStyle = '#273447'; c.fillRect(x + 31, y + 10, 2, 44);
    }
  });
  const facadeLit = kit.canvasTexture(512, 1024, (c, w, h) => {
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    const rooms = ['#ffcf8f', '#ffe0b0', '#ffd49a', '#d8e9ff', '#9fd2ff'];
    for (let floor = 0; floor < 16; floor++) {
      const dark = random() < .22;
      for (let bay = 0; bay < 8; bay++) {
        if (dark || random() < .55) continue;
        const x = bay * 64, y = floor * 64, room = c.createLinearGradient(x, y + 10, x, y + 54);
        const tint = pick(rooms); room.addColorStop(0, tint); room.addColorStop(1, '#3a2a18');
        c.globalAlpha = .45 + random() * .55; c.fillStyle = room; c.fillRect(x + 6, y + 10, 52, 44);
        if (random() < .4) { c.globalAlpha = .6; c.fillStyle = '#000'; c.fillRect(x + 6 + random() * 30, y + 10, 10 + random() * 10, 44); }
        c.globalAlpha = 1;
      }
    }
  });
  for (const texture of [facadeBase, facadeLit]) { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; }
  const facadeMaterial = kit.rippled(new THREE.MeshStandardMaterial({ map: facadeBase, emissiveMap: facadeLit, emissive: '#ffffff', emissiveIntensity: .95, roughness: .42, metalness: .35, envMapIntensity: .8 }));
  /** A box with facade UVs scaled to real bays (4 m) and floors (3.2 m), offset per tower. */
  function facadeBox(w: number, h: number, d: number, x: number, z: number) {
    const geometry = new THREE.BoxGeometry(w, h, d), uv = geometry.attributes.uv as THREE.BufferAttribute;
    const u0 = Math.floor(random() * 8) / 8, v0 = Math.floor(random() * 16) / 16;
    for (let face = 0; face < 6; face++) {
      const across = face < 2 ? d : w, top = face === 2 || face === 3;
      for (let k = 0; k < 4; k++) { const i = face * 4 + k; uv.setXY(i, top ? .01 : u0 + uv.getX(i) * across / 17.6, top ? .01 : v0 + uv.getY(i) * h / 46.4); }
    }
    const mesh = new THREE.Mesh(geometry, facadeMaterial); mesh.position.set(x, h / 2, z); kit.source.add(mesh); return mesh;
  }
  /** A lit tower. Near the drive it wears the facade atlas; further out, instanced windows are enough. */
  function tower(x: number, z: number, w: number, d: number, h: number, crown: string | null, gain = .72, textured = false) {
    if (avenueClear(x, z, 6)) return;
    const variant = Math.abs(Math.round(x + z)) % 4;
    if (textured && h > 28 && variant !== 0) {
      facadeBox(w, h * .66, d, x, z);
      const upper = facadeBox(w * .76, h * .34, d * .78, x + (variant === 2 ? w * .1 : 0), z);
      upper.position.y += h * .66;
      box(w + .5, .3, d + .5, x, h * .66, z, material('#34445b', 0, .42));
    }
    else if (textured) facadeBox(w, h, d, x, z);
    else box(w, h, d, x, h / 2, z, material(pick(['#17243a', '#1b2740', '#141f33', '#1f2b46']), 0, .38));
    const roofW = textured && h > 28 && variant !== 0 ? w * .76 : w;
    const roofD = textured && h > 28 && variant !== 0 ? d * .78 : d;
    const roofX = x + (textured && h > 28 && variant === 2 ? w * .1 : 0);
    box(roofW + .2, .35, roofD + .2, roofX, h + .1, z, material('#35465c', 0, .48));
    box(w * .4, 1.8, d * .35, roofX, h + 1.1, z, metal);
    for (const side of [-1, 1]) {
      box(.12, .65, roofD, roofX + side * roofW / 2, h + .55, z, metal);
      box(roofW, .65, .12, roofX, h + .55, z + side * roofD / 2, metal);
      if (textured) for (let fin = 0; fin < 3; fin++) box(.16, h * .61, .22, x + (fin - 1) * w * .34, h * .32, z + side * (d / 2 + .1), material('#334158', 0, .45));
    }
    for (const dx of [-w * .25, w * .25]) {
      box(w * .22, .8, d * .23, roofX + dx, h + .65, z + d * .2, material('#455266', 0, .45));
      cylinder(w * .075, .1, roofX + dx, h + 1.1, z + d * .2, metal, 10);
    }
    if (textured && h > 30 && variant === 0) for (let floor = 6; floor < h - 3; floor += 7) {
      box(w * .7, .18, 1, x, floor, z + d / 2 + .35, material('#35465c', 0, .45));
      box(w * .7, .55, .07, x, floor + .37, z + d / 2 + .8, metal);
      for (const dx of [-1, 1]) box(.12, .55, .7, x + dx * w * .35, floor + .37, z + d / 2 + .4, metal);
    }
    if (crown) {
      for (const side of [-1, 1]) { box(roofW + .3, .14, .14, roofX, h + .2, z + side * roofD / 2, material(crown, .75)); box(.14, .14, roofD + .3, roofX + side * roofW / 2, h + .2, z, material(crown, .75)); }
      if (random() < .4) { box(.16, h * .22, .16, x, h * 1.14 + h * .11, z, metal); box(.4, .4, .4, x, h * 1.25, z, material(P.racing, 1.8)); }
    }
    if (textured) return;
    const rows = Math.max(2, Math.floor((h - 2) / 2.5)), lit = .26 + random() * .26;
    for (const [yaw, across, px, pz] of [[0, w, x, z + d / 2], [Math.PI, w, x, z - d / 2], [Math.PI / 2, d, x + w / 2, z], [-Math.PI / 2, d, x - w / 2, z]] as const) {
      kit.facade(null, px, h / 2 + .4, pz, across - 1.2, h - 2.6, yaw, Math.max(2, Math.floor(across / 1.9)), rows, WINDOWS, lit, gain);
    }
  }
  // Taller towers stand to the north, behind the grounds. The west stays mid-rise behind the
  // heading, and the south and east stay low so nothing rises between the usual viewpoints and the city.
  const crowns = [P.cyan, P.pink, P.cyan, P.violet];
  for (let i = 0; i < 15; i++) tower(-105 + i * 15, -104 - (i % 3) * 2, 8 + i % 4 * 1.3, 8 + i % 3, 16 + (i * 13 % 31), crowns[i % 4], .72, true);
  for (let i = 0; i < 12; i++) tower(-104 + i * 19, -127 - (i % 2) * 4, 10 + i % 3 * 2, 10 + i % 2 * 2, 28 + (i * 17 % 44), crowns[(i + 1) % 4], .72, true);
  for (let i = 0; i < 9; i++) tower(-124 + i * 31, -156 - (i % 3) * 6, 13 + i % 3 * 2, 12, 46 + (i * 23 % 50), crowns[(i + 2) % 4]);
  for (let i = 0; i < 9; i++) tower(-128 - (i % 2) * 3, -78 + i * 19, 9 + i % 3, 9 + i % 2 * 2, 10 + (i * 11 % 17), i % 3 ? null : crowns[i % 4]);
  for (let i = 0; i < 7; i++) tower(-153 - (i % 3) * 4, -84 + i * 26, 12 + i % 2 * 2, 12, 16 + (i * 19 % 22), i % 2 ? null : crowns[(i + 1) % 4]);
  if (!mobile) {
    for (let i = 0; i < 9; i++) tower(127 + (i % 2) * 3, -84 + i * 19, 9, 9 + i % 2 * 2, 7 + (i * 7 % 10), null, .42, true);
    for (let i = 0; i < 7; i++) tower(150 + (i % 3) * 4, -80 + i * 26, 11, 11, 11 + (i * 9 % 13), null, .42);
    for (let i = 0; i < 11; i++) { const x = -110 + i * 22; if (!nearStreet(x, STREETS_X, 9)) tower(x, 112 + (i % 3) * 3, 10, 9, 5 + (i * 7 % 7), null, .42); }
  }

  // Beyond the towers: silhouettes and scattered lights out to the horizon.
  const cells: { x: number; z: number; w: number; d: number; h: number }[] = [];
  for (let gx = -19; gx <= 19; gx++) for (let gz = -19; gz <= 19; gz++) {
    const x = gx * 27 + (random() - .5) * 7, z = gz * 27 + (random() - .5) * 7 - 3;
    if ((x > -172 && x < 168 && z > -178 && z < 142) || avenueClear(x, z, 14) || nearStreet(x, STREETS_X, 9) || nearStreet(z, STREETS_Z, 9) || random() < .34) continue;
    const far = Math.min(1, Math.hypot(x, z) / 480), tall = z < -60 || x < -60;
    cells.push({ x, z, w: 12 + random() * 9, d: 12 + random() * 9, h: (tall ? 22 + random() * 62 : 7 + random() * 22) * (1 - far * .35) });
  }
  const blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material('#0b1524', 0, .92), cells.length), placer = new THREE.Object3D();
  cells.forEach((cell, i) => { placer.position.set(cell.x, cell.h / 2, cell.z); placer.scale.set(cell.w, cell.h, cell.d); placer.updateMatrix(); blocks.setMatrixAt(i, placer.matrix); });
  blocks.name = 'far-city'; blocks.frustumCulled = false; kit.details.add(blocks);
  const sparkCount = mobile ? 1400 : 3200, position = new Float32Array(sparkCount * 3), color = new Float32Array(sparkCount * 3), tint = new THREE.Color();
  for (let i = 0; i < sparkCount; i++) {
    const cell = cells[Math.floor(random() * cells.length)], onFace = random() < .72;
    position.set([cell.x + (random() - .5) * cell.w * 1.05, onFace ? 1.5 + random() * (cell.h - 2) : .6, cell.z + (random() - .5) * cell.d * 1.05], i * 3);
    tint.set(pick(WINDOWS)).multiplyScalar(.4 + random() * .45); color.set(tint.toArray(), i * 3);
  }
  const sparks = new THREE.BufferGeometry(); sparks.setAttribute('position', new THREE.BufferAttribute(position, 3)); sparks.setAttribute('color', new THREE.BufferAttribute(color, 3));
  const lights = new THREE.Points(sparks, new THREE.PointsMaterial({ size: 2.1, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: .9, depthWrite: false, toneMapped: false }));
  lights.name = 'far-city-lights'; lights.frustumCulled = false; kit.details.add(lights);

  // Night sky: haze glows at the horizon and darkens overhead. It travels with the camera.
  const sky = new THREE.Group(); sky.name = 'sky'; kit.details.add(sky);
  const gradient = kit.canvasTexture(4, 512, (c, w, h) => {
    const fill = c.createLinearGradient(0, 0, 0, h);
    fill.addColorStop(0, '#03060f'); fill.addColorStop(.3, '#060d1d'); fill.addColorStop(.43, '#0c1d38'); fill.addColorStop(.485, '#16335a'); fill.addColorStop(.5, HAZE); fill.addColorStop(1, HAZE);
    c.fillStyle = fill; c.fillRect(0, 0, w, h);
  });
  const vault = new THREE.Mesh(new THREE.SphereGeometry(940, 32, 20), new THREE.MeshBasicMaterial({ map: gradient, side: THREE.BackSide, fog: false, depthWrite: false })); vault.renderOrder = -10; sky.add(vault);
  const starCount = 420, stars = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) { const a = random() * Math.PI * 2, lift = .1 + random() * .9, flat = Math.sqrt(1 - lift * lift); stars.set([Math.cos(a) * flat * 900, lift * 900, Math.sin(a) * flat * 900], i * 3); }
  const starField = new THREE.BufferGeometry(); starField.setAttribute('position', new THREE.BufferAttribute(stars, 3));
  sky.add(new THREE.Points(starField, new THREE.PointsMaterial({ color: '#cfe0ff', size: 1.4, sizeAttenuation: false, transparent: true, opacity: .7, depthWrite: false, fog: false, toneMapped: false })));

  return { roads, facadeBox, follow(camera: THREE.Camera) { sky.position.copy(camera.position); } };
}
