import * as THREE from 'three';
import { CITY_PALETTE as P, locationById } from './city-config';
import type { CityKit } from './city-kit';
import type { RoamFloor } from './city-roam-physics';

const center = (id: 'basketball' | 'cricket' | 'football' | 'racing') => { const [x, , z] = locationById(id)!.position; return { x, z }; };
const PITCH_LINE = '#d5f4ee';

/** Sports surfaces are drawn at the correct proportions, then lit in 3D. */
function fieldTexture(kit: CityKit, kind: 'basketball' | 'football' | 'cricket') {
  const { blend } = kit;
  return kit.canvasTexture(1024, kind === 'cricket' ? 1024 : 640, (c, w, h) => {
    c.fillStyle = kind === 'basketball' ? blend(P.building, P.cyan, .12) : blend(P.background, P.lime, .13); c.fillRect(0, 0, w, h);
    if (kind !== 'basketball') for (let i = 0; i < 12; i++) { c.fillStyle = blend(P.background, P.lime, i % 2 ? .21 : .13); c.fillRect(i * w / 12, 0, w / 12, h); }
    // Seeded grain gives the courts and turf a material finish without extra maps.
    let grain = 621;
    c.fillStyle = P.text; c.globalAlpha = .055;
    for (let i = 0; i < 9000; i++) { grain = (Math.imul(grain, 1664525) + 1013904223) >>> 0; const x = grain % w; grain = (Math.imul(grain, 1664525) + 1013904223) >>> 0; c.fillRect(x, grain % h, 1, kind === 'basketball' ? 1 : 3); }
    c.globalAlpha = 1;
    c.strokeStyle = PITCH_LINE; c.lineWidth = 4; c.lineCap = 'round';
    if (kind === 'basketball') {
      c.fillStyle = blend(P.building, P.orange, .58); c.fillRect(26, 176, 210, 288); c.fillRect(w - 236, 176, 210, 288);
      c.strokeStyle = blend(P.text, P.orange, .15);
      c.strokeRect(26, 26, w - 52, h - 52); c.beginPath(); c.moveTo(w / 2, 26); c.lineTo(w / 2, h - 26); c.stroke();
      c.beginPath(); c.arc(w / 2, h / 2, 85, 0, Math.PI * 2); c.stroke();
      for (const flip of [false, true]) { c.save(); if (flip) { c.translate(w, 0); c.scale(-1, 1); } c.strokeRect(26, 176, 210, 288); c.beginPath(); c.arc(236, h / 2, 89, -Math.PI / 2, Math.PI / 2); c.stroke(); c.beginPath(); c.arc(100, h / 2, 265, -1.25, 1.25); c.stroke(); c.restore(); }
      c.fillStyle = P.text; c.font = '600 26px sans-serif'; c.textAlign = 'center'; c.fillText('STATOZ', w / 2, h - 55);
    } else if (kind === 'football') {
      c.strokeRect(24, 24, w - 48, h - 48); c.beginPath(); c.moveTo(w / 2, 24); c.lineTo(w / 2, h - 24); c.stroke();
      c.beginPath(); c.arc(w / 2, h / 2, 85, 0, Math.PI * 2); c.stroke(); c.fillStyle = PITCH_LINE; c.beginPath(); c.arc(w / 2, h / 2, 5, 0, Math.PI * 2); c.fill();
      c.strokeRect(24, 130, 165, 380); c.strokeRect(w - 189, 130, 165, 380); c.strokeRect(24, 229, 65, 182); c.strokeRect(w - 89, 229, 65, 182);
      for (const flip of [false, true]) { c.save(); if (flip) { c.translate(w, 0); c.scale(-1, 1); } c.beginPath(); c.arc(148, h / 2, 85, -1.05, 1.05); c.stroke(); c.beginPath(); c.arc(24, 24, 18, 0, Math.PI / 2); c.stroke(); c.beginPath(); c.arc(24, h - 24, 18, -Math.PI / 2, 0); c.stroke(); c.restore(); }
    } else {
      c.beginPath(); c.ellipse(w / 2, h / 2, 477, 477, 0, 0, Math.PI * 2); c.stroke();
      c.setLineDash([10, 12]); c.lineWidth = 2; c.beginPath(); c.ellipse(w / 2, h / 2, 180, 265, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#baa986'; c.fillRect(462, 315, 100, 394); c.fillStyle = '#c9b795'; c.fillRect(473, 330, 78, 364);
      for (const z of [345, 679]) { c.beginPath(); c.moveTo(440, z); c.lineTo(584, z); c.moveTo(460, z - 35); c.lineTo(460, z + 35); c.moveTo(564, z - 35); c.lineTo(564, z + 35); c.stroke(); }
    }
  });
}

export function buildVenues(kit: CityKit) {
  const { box, cylinder, material, blend, metal, dark } = kit;
  const lights: { light: THREE.PointLight; zone: number; base: number }[] = [];
  let zone = 0;
  /** One soft light over each ground stands in for its floodlights and spills onto the surroundings. */
  function glow(x: number, y: number, z: number, accent: string, intensity: number, reach = 96) {
    const light = new THREE.PointLight(blend('#ffffff', accent, .24), intensity, reach, 1.7); light.position.set(x, y, z); kit.details.add(light); lights.push({ light, zone, base: intensity });
  }
  function surface(kind: 'basketball' | 'football' | 'cricket', geometry: THREE.BufferGeometry, x: number, z: number) {
    const map = fieldTexture(kit, kind);
    const field = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map, roughness: .86, metalness: .02, emissiveMap: map, emissive: '#b4d8ee', emissiveIntensity: .34 }));
    field.rotation.x = -Math.PI / 2; field.position.set(x, .4, z); kit.source.add(field);
  }
  /** Raised playing surfaces: people walk on them at their height; the free-roam car may not drive onto them. */
  const floors: RoamFloor[] = [];
  function apron(x: number, z: number, w: number, d: number, accent: string, surface = .4) {
    floors.push({ x, z, halfX: w / 2, halfZ: d / 2, round: false, y: surface });
    box(w, .25, d, x, .17, z, material('#243245'));
    for (const side of [-1, 1]) { box(w, .12, .12, x, .36, z + side * d / 2, material(accent, 1)); box(.12, .12, d, x + side * w / 2, .36, z, material(accent, 1)); }
  }

  // The Floodlights: a horseshoe of stands, open towards the south-east so the pitch stays in view.
  kit.setZone('football'); zone = 1;
  {
    const { x, z } = center('football'), accent = P.lime, w = 47, d = 32;
    apron(x, z, w + 3, d + 3, accent); surface('football', new THREE.PlaneGeometry(w - 2, d - 2), x, z);
    for (const side of [-1, 1]) {
      const gx = x + side * 23.1, post = material('#dbeef0');
      box(.2, 3, .2, gx, 1.9, z - 4, post); box(.2, 3, .2, gx, 1.9, z + 4, post); box(.2, .2, 8.2, gx, 3.4, z, post);
      for (let i = 0; i <= 8; i++) kit.line([new THREE.Vector3(gx, 3.3, z - 4 + i), new THREE.Vector3(gx + side * 2.4, .5, z - 4 + i)], '#75949a', false, .6);
      for (let i = 0; i < 4; i++) kit.line([new THREE.Vector3(gx + side * i * .8, 3.3 - i * .93, z - 4), new THREE.Vector3(gx + side * i * .8, 3.3 - i * .93, z + 4)], '#75949a', false, .6);
    }
    kit.grandstand({ x, z: z - d / 2 - 2.6, heading: 0, width: 44, rows: 8, accent, roof: true });
    kit.grandstand({ x: x - w / 2 - 1.9, z, heading: Math.PI / 2, width: 28, rows: 6, accent, roof: true });
    kit.grandstand({ x: x + w / 2 + 2.1, z, heading: -Math.PI / 2, width: 26, rows: 3, accent });
    // Pitch-side boards and dugouts on the open touchline.
    for (let i = 0; i < 6; i++) box(6.6, .85, .18, x - 18 + i * 7.2, .82, z + d / 2 + .95, material(i % 2 ? accent : P.text, .5));
    for (const side of [-1, 1]) {
      const bench = kit.group(x + side * 9, z + d / 2 + 3.2, Math.PI);
      box(5.2, .18, 1.9, 0, 2.05, .1, material('#1a2638'), bench); box(5.2, 1.95, .14, 0, 1, -.8, material('#1a2638'), bench); box(4.8, .2, .6, 0, .55, -.3, material(blend(P.building, accent, .5), .06), bench);
      for (const edge of [-1, 1]) box(.14, 1.95, 1.7, edge * 2.6, 1, 0, material('#1a2638'), bench);
    }
    // Three masts: the south-east corner stays open so nothing stands between the usual viewpoint and the pitch.
    kit.floodlight(x - 29, z - 21.5, 21, x - 11, z - 7); kit.floodlight(x + 27.5, z - 20.5, 21, x + 11, z - 7); kit.floodlight(x - 29, z + 20.5, 21, x - 11, z + 7);
    // The big screen names the ground from the far corner, facing the usual approach.
    for (const offset of [-3.6, 3.6]) box(.4, 11, .4, x - 27.2 + offset * .7, 5.5, z - 18.2 - offset * .7, metal);
    kit.sign('THE FLOODLIGHTS', 'YOUR GAME. YOUR HOME GROUND.', x - 27.2, 13.3, z - 18.2, 12, 5, accent, Math.PI / 4);
    kit.pool(x, z, 30, '#dff4ff', .2, .46); glow(x, 24, z, accent, 760);
  }

  // The Oval: a round ground with terraces on the far arc, a pavilion, sight screens and boundary boards.
  kit.setZone('cricket'); zone = 2;
  {
    const { x, z } = center('cricket'), accent = P.cyan;
    const at = (degrees: number, radius: number) => { const a = degrees * Math.PI / 180; return { a, x: x + Math.cos(a) * radius, z: z + Math.sin(a) * radius, heading: Math.atan2(-Math.cos(a), -Math.sin(a)) }; };
    cylinder(26.3, .25, x, .17, z, material('#243245'), 72); kit.ring(x, z, 26.2, accent, .14, .31, 1);
    kit.claim('oval rim', x - 26.3, z - 26.3, x + 26.3, z + 26.3);
    floors.push({ x, z, halfX: 26.3, halfZ: 26.3, round: true, y: .4 });
    surface('cricket', new THREE.CircleGeometry(25, 96), x, z); kit.ring(x, z, 24.55, '#f4f8ff', .1, .43, .5);
    for (const end of [-1, 1]) for (let i = -1; i <= 1; i++) box(.12, 1.4, .12, x + i * .38, 1.1, z + end * 8.5, material('#dfcfac'));
    for (const degrees of [157.5, 180, 202.5, 247.5, 270, 292.5]) { const seat = at(degrees, 28.2); kit.grandstand({ x: seat.x, z: seat.z, heading: seat.heading, width: 10.6, rows: 5, accent, fill: .26, roof: degrees === 202.5 || degrees === 247.5 }); }
    // Sight screens are matt and lit by the floodlights; a self-lit white board clips to pure white.
    for (const end of [-1, 1]) { box(6.6, 3.4, .22, x, 2.2, z + end * 25.6, material('#b4bfcc', .03, .9)); for (const leg of [-1, 1]) box(.2, .7, 1.2, x + leg * 2.6, .5, z + end * 25.6, metal); }
    for (let degrees = -18; degrees <= 126; degrees += 9) {
      if (degrees > 78 && degrees < 102) continue;
      const spot = at(degrees, 25.6); const board = box(3.7, .72, .16, spot.x, .72, spot.z, material(degrees % 2 ? accent : P.text, .5)); board.rotation.y = Math.PI / 2 - spot.a;
    }
    // The pavilion faces the middle from the far corner.
    const home = at(225, 28.4), pavilion = kit.group(home.x, home.z, home.heading);
    const cream = material('#b9b3a4', .05), stone = material('#4a5468'), slate = material(blend(P.building, accent, .22), 0, .55), warm = '#ffdca0';
    box(11, .6, 8.8, 0, .3, -4.4, stone, pavilion); box(10.4, 3.2, 6.4, 0, 2.2, -5.2, cream, pavilion);
    box(11, .24, 2.6, 0, 3.94, -.9, stone, pavilion); for (let i = -2; i <= 2; i++) box(.2, 3.3, .2, i * 2.6, 2.25, .2, cream, pavilion);
    box(11, .1, .1, 0, 4.95, .3, metal, pavilion); box(11, .1, .1, 0, 4.5, .3, metal, pavilion);
    box(9.4, 2.8, 5.4, 0, 5.47, -5.6, cream, pavilion); kit.prism(11.6, 2.6, 7.8, 0, 6.87, -5.3, slate, pavilion);
    box(11.7, .14, .22, 0, 9.5, -5.3, material(accent, .9), pavilion);
    box(2.4, 2.8, 2.4, 0, 8.9, -3.9, cream, pavilion); const cap = cylinder(1.95, 1.9, 0, 11.25, -3.9, slate, 4, pavilion, .02); cap.rotation.y = Math.PI / 4;
    box(.08, 3, .08, 0, 13.6, -3.9, metal, pavilion); box(1.5, .8, .05, .8, 14.6, -3.9, material(accent, .7), pavilion);
    kit.panel(kit.canvasTexture(128, 128, c => {
      c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(64, 64, 60, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#1d293d'; c.lineWidth = 7; c.stroke();
      c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(64, 64); c.lineTo(64, 26); c.moveTo(64, 64); c.lineTo(90, 76); c.stroke();
    }), 0, 9.1, -2.68, 1.8, 1.8, 0, pavilion);
    for (const wx of [-3.9, -1.95, 1.95, 3.9]) kit.windowQuad(pavilion, wx, 2.35, -2, 1.25, 1.7, 0, warm, 1.25);
    box(1.5, 2.3, .12, 0, 1.75, -2, material('#2b2520'), pavilion);
    for (let i = -2; i <= 2; i++) kit.windowQuad(pavilion, i * 1.75, 5.55, -2.9, 1, 1.35, 0, warm, 1.1);
    kit.sign('THE OVAL', '', 0, 3.3, .42, 7.6, 1, accent, 0, pavilion);
    kit.pool(home.x - Math.cos(home.a) * 3, home.z - Math.sin(home.a) * 3, 9, warm, .5, .32);
    for (const [degrees, radius] of [[135, 36], [315, 36], [225, 39.5]] as const) { const mast = at(degrees, radius), aim = at(degrees, 9); kit.floodlight(mast.x, mast.z, 23, aim.x, aim.z, '#eaf6ff', 11); }
    kit.pool(x, z, 32, '#dff4ff', .18, .46); glow(x, 28, z, accent, 900, 104);
  }

  // The Blacktop: a street court with bleachers, a mural wall and festoon lights overhead.
  kit.setZone('basketball'); zone = 3;
  {
    const { x, z } = center('basketball'), accent = P.orange, w = 33, d = 23;
    apron(x, z, w + 3, d + 3, accent); surface('basketball', new THREE.PlaneGeometry(w - 2, d - 2), x, z);
    for (const side of [-1, 1]) {
      const hx = x + side * 15;
      box(.3, 4.8, .3, hx + side * 1.5, 2.7, z, metal); box(2.6, .22, .25, hx + side * .3, 4.6, z, metal);
      box(.2, 2.1, 3.2, hx, 4.7, z, material('#d6dfeb')); box(.23, 1, 1.5, hx - side * .13, 4.55, z, material('#39445b'));
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(.65, .07, 6, 22), material(accent, .65)); hoop.rotation.x = Math.PI / 2; hoop.position.set(hx - side * .75, 4, z); kit.source.add(hoop);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; kit.line([new THREE.Vector3(hx - side * .75 + Math.cos(a) * .65, 4, z + Math.sin(a) * .65), new THREE.Vector3(hx - side * .75 + Math.cos(a) * .4, 3.2, z + Math.sin(a) * .4)], '#b3c0d3'); }
    }
    kit.grandstand({ x, z: z - d / 2 - 1.9, heading: 0, width: 22, rows: 3, accent, fill: .34 });
    kit.claim('blacktop apron', x - (w + 3) / 2, z - d / 2 - 1.9 - 3.7, x + (w + 3) / 2, z + d / 2 + 1.9 + 2.7);
    kit.grandstand({ x, z: z + d / 2 + 1.9, heading: Math.PI, width: 22, rows: 2, accent, fill: .34 });
    // Mural wall behind the west basket.
    const wallX = x - w / 2 - 3.4;
    box(.7, 7.6, 23.4, wallX, 3.92, z, material('#141c2c')); box(.9, .2, 23.6, wallX, 7.8, z, material(accent, 1));
    kit.panel(kit.canvasTexture(1024, 300, (c, cw, ch) => {
      c.fillStyle = '#10182a'; c.fillRect(0, 0, cw, ch);
      const bands: [string, number, number][] = [[P.orange, -120, 300], [P.pink, 210, 150], [P.cyan, 520, 110], [P.orange, 760, 380]];
      for (const [tint, start, width] of bands) { c.fillStyle = tint; c.globalAlpha = .82; c.beginPath(); c.moveTo(start, ch); c.lineTo(start + width, ch); c.lineTo(start + width + 190, 0); c.lineTo(start + 190, 0); c.fill(); }
      c.globalAlpha = 1; c.textAlign = 'center'; c.textBaseline = 'middle';
      kit.fitText(c, 'THE BLACKTOP', '800', 150, cw * .9); c.lineWidth = 16; c.strokeStyle = '#0a101d'; c.strokeText('THE BLACKTOP', cw / 2, ch * .44); c.fillStyle = '#ffffff'; c.fillText('THE BLACKTOP', cw / 2, ch * .44);
      kit.fitText(c, 'WHERE THE CITY FINDS ITS RHYTHM.', '600', 34, cw * .8); c.lineWidth = 9; c.strokeText('WHERE THE CITY FINDS ITS RHYTHM.', cw / 2, ch * .82); c.fillText('WHERE THE CITY FINDS ITS RHYTHM.', cw / 2, ch * .82);
    }), wallX + .37, 4, z, 21.6, 6.3, Math.PI / 2);
    // Chain-link backstop behind the east basket, low enough to see over.
    for (let i = -2; i <= 2; i++) box(.14, 4.4, .14, x + w / 2 + 1.3, 2.5, z + i * 2.2, metal);
    for (const y of [1.6, 3, 4.6]) box(.08, .08, 9, x + w / 2 + 1.3, y, z, material('#5a6a85'));
    // Festoon lights strung across the court.
    for (const offset of [-9, 0, 9]) {
      const points: THREE.Vector3[] = [];
      for (const end of [-1, 1]) box(.16, 9.2, .16, x + offset, 4.72, z + end * 12.9, metal);
      for (let i = 0; i <= 14; i++) { const t = i / 14, point = new THREE.Vector3(x + offset, 9.2 - Math.sin(t * Math.PI) * .9, z - 12.9 + t * 25.8); points.push(point); if (i > 0 && i < 14) box(.22, .22, .22, point.x, point.y - .16, point.z, material(i % 2 ? '#ffd9a0' : accent, 2)); }
      kit.line(points, '#5a6a85');
    }
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1]]) kit.floodlight(x + sx * 17.4, z + sz * 12.6, 12, x + sx * 7, z + sz * 4, '#fff0dc', 7);
    kit.pool(x, z, 22, '#ffe9cf', .2, .46); glow(x, 17, z, accent, 520, 78);
  }

  // Neon Circuit: an oval road surface with kerbs, a pit complex, grandstand, gates and barriers.
  // Scaled to sit inside its block, clear of the pavements on all four sides.
  kit.setZone('racing'); zone = 4;
  const race = center('racing'), stretch = 1.6, k = .9, raceRadiusX = 13.5 * k * stretch;
  const racingPath = (angle: number) => new THREE.Vector3(race.x + Math.cos(angle) * raceRadiusX, .5, race.z + Math.sin(angle) * 13.5 * k);
  {
    const { x, z } = race, accent = P.violet;
    apron(x, z, 54, 33, accent, .46);
    kit.claim('circuit apron', x - 27, z - 16.5, x + 27, z + 16.5);
    const flat = (inner: number, outer: number, mat: THREE.Material, y: number) => { const mesh = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 100), mat); mesh.rotation.x = -Math.PI / 2; mesh.scale.x = stretch; mesh.position.set(x, y, z); kit.source.add(mesh); };
    flat(16.8 * k, 18 * k, material(blend(P.road, accent, .13), 0, .9), .43); flat(10.6 * k, 16.8 * k, dark, .45);
    for (const radius of [10.7 * k, 16.7 * k]) kit.ring(x, z, radius, accent, .1, .48).scale.x = stretch;
    for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2; box(1.3, .025, .1, x + Math.cos(a) * raceRadiusX, .49, z + Math.sin(a) * 13.5 * k, material(blend(P.text, P.road, .45))).rotation.y = Math.atan2(-Math.cos(a) * 13.5, -Math.sin(a) * raceRadiusX); }
    for (let i = 0; i < 88; i++) { const a = i / 88 * Math.PI * 2; box(1.4, .15, .55, x + Math.cos(a) * 16.6 * k * stretch, .55, z + Math.sin(a) * 16.6 * k, material(i % 2 ? '#c7d3e4' : accent, .15)).rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a) * stretch); }
    // Pit complex in the infield: garages below, a glazed deck above, and a timing tower.
    box(18, 2.6, 6, x, 1.75, z, material('#141c2c', 0, .4));
    for (let i = 0; i < 6; i++) { box(2.4, 1.9, .12, x - 7.5 + i * 3, 1.5, z + 3.02, material(i % 2 ? '#2a3a55' : '#fff2d6', i % 2 ? 0 : .7)); }
    box(18.6, .3, 6.8, x, 3.2, z, material(accent, .55)); box(14, 2.1, 4.6, x - 1, 4.4, z, material('#1a2740', 0, .35));
    for (let i = 0; i < 7; i++) kit.windowQuad(null, x - 6.6 + i * 1.86, 4.45, z + 2.3, 1.5, 1.2, 0, '#bfe6ff', 1.1);
    box(15, .22, 5.4, x - 1, 5.6, z, material(accent, .9));
    box(2.2, 11, 2.2, x + 9.6, 5.9, z, material('#141c2c', 0, .4)); box(2.6, .3, 2.6, x + 9.6, 11.5, z, material(accent, 1.2));
    for (const level of [5.2, 7, 8.8]) box(2.3, .22, 2.3, x + 9.6, level, z, material(accent, 1));
    box(20, .7, .22, x, .82, z + 7.2, material('#c7d3e4')); box(20, .03, 2, x, .47, z + 5.6, material('#2a3a55'));
    // Start line, lights gantry and grid.
    for (let i = 0; i < 10; i++) for (let row = 0; row < 2; row++) box(.82, .025, .58, x + 15.6 + i * .84, .5, z - .3 + row * .6, material((i + row) % 2 ? P.text : P.background));
    for (const gx of [x + 14.6, x + 24.6]) box(.25, 7.5, .25, gx, 4, z - .7, metal);
    box(10.3, .55, .6, x + 19.6, 7.7, z - .7, material(accent, .4));
    for (let i = 0; i < 5; i++) box(.4, .34, .15, x + 17.8 + i * .9, 7.4, z - .3, material(i < 3 ? P.lime : '#33415a', i < 3 ? 1.6 : 0));
    for (let i = 0; i < 6; i++) { const a = -.1 - i * .085, spot = racingPath(a), lane = i % 2 ? 1.2 : -1.2; box(.1, .02, 1.5, spot.x + lane, .49, spot.z, material(P.text, .3)); box(1.1, .02, .1, spot.x + lane, .49, spot.z + .75, material(P.text, .3)); }
    // Neon gates over the circuit.
    const gate = (angle: number, tint: string) => {
      const cos = Math.cos(angle), sin = Math.sin(angle), inner = new THREE.Vector3(x + cos * 10.1 * k * stretch, 0, z + sin * 10.1 * k), outer = new THREE.Vector3(x + cos * 17.5 * k * stretch, 0, z + sin * 17.5 * k);
      const span = inner.distanceTo(outer), mid = inner.clone().add(outer).multiplyScalar(.5), heading = Math.atan2(outer.x - inner.x, outer.z - inner.z);
      for (const foot of [inner, outer]) box(.3, 5.6, .3, foot.x, 3.2, foot.z, material(tint, .9));
      box(.34, .34, span + .3, mid.x, 6, mid.z, material(tint, 1.5)).rotation.y = heading;
      kit.pool(mid.x, mid.z, 6, tint, .45, .52);
    };
    gate(Math.PI / 2, P.pink); gate(Math.PI, P.cyan); gate(-Math.PI / 2, accent);
    // Tyre barriers on the open side, catch fencing on the far side.
    for (let i = 0; i < 16; i++) { const a = .28 + i * .075; for (let level = 0; level < 2; level++) box(.95, .5, .95, x + Math.cos(a) * 18.1 * k * stretch, .68 + level * .52, z + Math.sin(a) * 17.6 * k, material((i + level) % 3 ? '#1b2334' : (i % 2 ? P.pink : '#dfe7f3'), 0, .8)).rotation.y = a; }
    const fence: THREE.Vector3[] = [];
    for (let i = 0; i <= 18; i++) { const a = Math.PI * .92 + i * .085, fx = x + Math.cos(a) * 18.1 * k * stretch, fz = z + Math.sin(a) * 17.5 * k; if (fz < z - 15.3) continue; box(.12, 3, .12, fx, 1.9, fz, metal); fence.push(new THREE.Vector3(fx, 3.3, fz)); }
    if (fence.length > 1) { kit.line(fence, accent, false, .7); kit.line(fence.map(point => point.clone().setY(2.2)), '#5a6a85', false, .6); }
    const stand = kit.grandstand({ x: x - 28.4, z, heading: Math.PI / 2, width: 24, rows: 7, accent, roof: true });
    kit.sign('NEON CIRCUIT', 'FIND YOUR LINE AFTER DARK.', 0, 9.9, -2.2, 15, 2.6, accent, 0, stand);
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1]]) kit.floodlight(x + sx * 25.6, z + sz * 15.4, 13, x + sx * 14, z + sz * 7, '#f1eaff', 8);
    kit.pool(x, z, 30, '#e9ddff', .16, .5); glow(x, 22, z, accent, 640);
  }

  const cars: THREE.Group[] = [];
  for (const color of [P.pink, P.cyan, P.gold]) {
    const car = new THREE.Group(); car.userData.dynamic = true; kit.moving.add(car); cars.push(car);
    box(1.3, .55, 2.8, 0, .4, 0, material(color, .2), car); box(.9, .4, 1.2, 0, .85, -.25, dark, car);
    for (const side of [-1, 1]) for (const end of [-1, 1]) box(.35, .5, .55, side * .72, .35, end * .8, material('#080b15'), car);
    box(1.7, .15, .4, 0, .7, -1.1, material(color), car); box(.8, .1, .1, 0, .4, 1.45, material('#ffffff', 1), car);
  }
  return { lights, cars, racingPath, raceRadiusX, race, floors };
}
