import { publicAsset } from '@statoz/design-system/asset';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CITY_LOCATIONS, CITY_PALETTE as P, locationById, type CityLocationId } from './city-config';
import type { CityKit } from './city-kit';

const spot = (id: CityLocationId) => { const [x, , z] = locationById(id)!.position; return { x, z }; };

/** The five city landmarks. Each has its own silhouette, lit windows and a readable sign. */
export function buildLandmarks(kit: CityKit) {
  const { box, cylinder, material, metal } = kit;
  let live = true;
  const resources: { dispose(): void }[] = [];

  // The plaza carries the in-world StatOz banner and the three-bar monument.
  cylinder(6.3, .5, -5, .2, 23, material('#172b40'), 48);
  kit.ring(-5, 23, 6, P.cyan, .14, .48); kit.ring(-5, 23, 4.7, P.pink, .07, .49);
  for (let i = 0; i < 3; i++) { const h = [5.5, 8.5, 7][i]; box(.75, h, 1.4, -7 + i * 2, .5 + h / 2, 23, material(i === 2 ? P.pink : P.cyan, .8)); box(.8, .12, 1.45, -7 + i * 2, .5 + h + .06, 23, material('#ffffff', 2)); }
  kit.claim('plaza', -11.3, 16.7, 1.3, 29.3);
  for (const [x, z] of [[-8.5, 37], [1, 37], [-8.5, 9.6], [1, 9.6]]) {
    box(5, .65, 2, x, .5, z, metal); box(4.5, .4, 1.5, x, 1, z, material(kit.blend(P.building, P.lime, .15)));
    box(5, .3, 1, x, .8, z + 2, material(kit.blend(P.building, P.gold, .15)));
  }
  // A low plaza sign keeps the entrance flight and both sports grounds unobstructed.
  box(.5, 5.7, .5, -10, 2.85, 16, metal); box(.5, 5.7, .5, 2, 2.85, 16, metal);
  kit.sign('StatOz', 'YOUR DAILY HOME FOR SPORTS', -4, 6.8, 16.5, 14, 3, P.cyan);
  box(15, .16, .2, -4, 8.6, 16.4, material(P.pink, 1.4));
  kit.pool(-5, 23, 12, P.cyan, .5, .52); kit.pool(-4, 19, 9, P.pink, .4, .52);

  // The Clubhouse: a sports pavilion with a pitched roof, veranda and clock turret.
  {
    const { x, z } = spot('clubhouse'), home = kit.group(x, z), gold = P.gold, warm = '#ffd98f';
    const cream = material('#c7bfa8', .05), timber = material('#3b2d24'), slate = material('#222e42', 0, .55), stone = material('#49536a');
    box(16, .5, 12, 0, .25, 0, stone, home); box(13, 4.4, 8, 0, 2.7, -1.5, cream, home);
    for (const post of [-6.5, -2.2, 2.2, 6.5]) box(.3, 4.4, .3, post, 2.7, 2.52, timber, home);
    box(13.2, .3, .3, 0, 4.75, 2.52, timber, home);
    kit.prism(14.6, 3.2, 10, 0, 4.9, -1.5, slate, home); box(14.7, .14, .24, 0, 8.14, -1.5, material(gold, .9), home);
    box(2.6, 2.4, 2.6, 0, 8.6, -1.5, cream, home); cylinder(2.1, 2.1, 0, 10.85, -1.5, slate, 4, home, .02).rotation.y = Math.PI / 4; box(.36, .36, .36, 0, 12.05, -1.5, material(gold, 1), home);
    const clock = kit.canvasTexture(128, 128, c => {
      c.fillStyle = '#fff3cf'; c.beginPath(); c.arc(64, 64, 60, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#3b2d24'; c.lineWidth = 7; c.stroke();
      c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(64, 64); c.lineTo(64, 24); c.moveTo(64, 64); c.lineTo(88, 80); c.stroke();
    });
    kit.panel(clock, 0, 8.7, -.18, 1.9, 1.9, 0, home); kit.panel(clock, 1.32, 8.7, -1.5, 1.9, 1.9, Math.PI / 2, home);
    // Veranda, steps and rails.
    box(15, .2, 3.6, 0, .7, 4.2, stone, home); const porch = box(15, .2, 3.8, 0, 4, 4.3, slate, home); porch.rotation.x = .13;
    for (const post of [-7, -4.2, -1.4, 1.4, 4.2, 7]) box(.22, 3, .22, post, 2.3, 5.9, timber, home);
    for (const side of [-1, 1]) for (const rail of [1.2, 1.75]) box(5.6, .1, .1, side * 4.2, rail, 5.9, timber, home);
    for (let i = 0; i < 3; i++) box(3.4, .2, .5, 0, .5 - i * .18, 6.3 + i * .5, stone, home);
    box(1.6, 2.6, .12, 0, 2.1, 2.53, timber, home); kit.windowQuad(home, 0, 3.75, 2.56, 1.6, .5, 0, warm, 1.3);
    for (const wx of [-4.4, 4.4]) kit.windowQuad(home, wx, 2.75, 2.5, 2.4, 2, 0, warm, 1.2);
    for (const side of [-1, 1]) for (const wz of [-3.8, -1.5, .8]) kit.windowQuad(home, side * 6.5, 2.75, wz, 1.5, 1.9, side * Math.PI / 2, warm, 1.05);
    box(13, .08, .16, 0, 3.72, 2.9, material('#ffe2a8', 1.8), home);
    kit.sign('CLUBHOUSE', 'FOR THE LOVE OF SPORT', 0, 4.95, 6.25, 9.6, 1.9, gold, 0, home);
    // A trophy and flags on the lawn.
    box(1.5, 1.1, 1.5, 5.6, .55, 8.6, stone, home); box(.3, .5, .3, 5.6, 1.35, 8.6, material(gold, .5, .3), home); cylinder(.3, .9, 5.6, 2.05, 8.6, material(gold, .55, .3), 10, home, .58);
    for (const [fx, tint] of [[-6.2, gold], [-4.6, P.cyan]] as const) { box(.1, 6, .1, fx, 3, 8.4, metal, home); box(1.6, .9, .05, fx + .85, 5.4, 8.4, material(tint, .6), home); }
    for (const [tx, tz] of [[-7, 9.4], [7.6, 9.6], [-6, -7.6], [6, -7.6]]) kit.tree(x + tx, z + tz, .9);
    kit.pool(x, z + 5, 9, warm, .7); kit.pool(x + 5.6, z + 8.6, 3.2, gold, .6);
  }

  // StatOz News: a broadcast tower wrapped in moving tickers, with a studio at street level.
  const tickers: THREE.Texture[] = [];
  let beacon: THREE.Mesh;
  {
    const { x, z } = spot('news'), tower = kit.group(x, z), pink = P.pink, body = material('#151e36', 0, .35), glass = ['#dfeaff', '#ffd6ea', '#a9d4ff'];
    box(17, 4.6, 13, 0, 2.3, 0, material('#111829', 0, .4), tower); box(17.4, .26, 13.4, 0, 4.72, 0, material(pink, .7), tower);
    for (let i = 0; i < 5; i++) kit.windowQuad(tower, -4.4 + i * 2.2, 2.4, 6.5, 1.9, 2.4, 0, '#ffe7f2', 1.05);
    for (let i = 0; i < 4; i++) kit.windowQuad(tower, 8.5, 2.4, -3.3 + i * 2.2, 1.9, 2.4, Math.PI / 2, '#ffe7f2', 1);
    box(6, .3, 2.4, 0, 3.5, 7.5, material(pink, .55), tower);
    box(12.5, 22, 9.5, 0, 15.85, -.4, body, tower);
    for (const [yaw, face, width] of [[0, 4.35, 11], [Math.PI, -5.15, 11], [Math.PI / 2, 6.25, 8], [-Math.PI / 2, -6.25, 8]] as const) {
      const along = yaw === 0 || yaw === Math.PI, px = along ? 0 : face, pz = along ? face : -.4, columns = along ? 6 : 4;
      kit.facade(tower, px, 8, pz, width, 3.8, yaw, columns, 2, glass, .8);
      if (yaw !== 0 && yaw !== Math.PI / 2) kit.facade(tower, px, 16.3, pz, width, 7.4, yaw, columns, 4, glass, .75);
      kit.facade(tower, px, 24.3, pz, width, 3.4, yaw, columns, 2, glass, .8);
    }
    // Two LED bands run a factual, scrolling line around the tower.
    const strip = kit.canvasTexture(2048, 64, (c, w, h) => {
      c.fillStyle = '#0a0f1e'; c.fillRect(0, 0, w, h); c.fillStyle = pink; c.textBaseline = 'middle';
      c.font = '700 38px ' + (getComputedStyle(document.body).getPropertyValue('--font-disp').split(',')[0] || 'sans-serif') + ', sans-serif';
      const line = 'STATOZ NEWS   •   STORIES FROM EVERY CORNER OF SPORT   •   ';
      for (let offset = 0; offset < w; offset += c.measureText(line).width) c.fillText(line, offset, h / 2 + 2);
    });
    for (const [faceWidth, faces] of [[12.5, [[0, 0, 4.35], [Math.PI, 0, -5.15]]], [9.5, [[Math.PI / 2, 6.25, -.4], [-Math.PI / 2, -6.25, -.4]]]] as const) {
      const map = strip.clone(); map.wrapS = THREE.RepeatWrapping; map.repeat.x = faceWidth / 35.2; map.needsUpdate = true; tickers.push(map);
      for (const level of [11.3, 21.3]) for (const [yaw, px, pz] of faces) kit.panel(map, px + Math.sin(yaw) * .07, level, pz + Math.cos(yaw) * .07, faceWidth, 1.1, yaw, tower);
    }
    kit.sign('STATOZ NEWS', 'STORIES FROM EVERY CORNER OF SPORT', 0, 16.3, 4.62, 10.4, 5.6, pink, 0, tower);
    kit.sign('NEWS', 'THE CITY IS LISTENING', 6.52, 16.3, -.4, 7.6, 5.6, pink, Math.PI / 2, tower);
    box(13.6, .7, 10.6, 0, 27.2, -.4, material(pink, .6), tower); box(9, 3.6, 6.6, 0, 29.35, -.4, body, tower); box(9.6, .3, 7.2, 0, 31.3, -.4, material(pink, .5), tower);
    for (const dx of [-2.7, 2.5]) { cylinder(.14, .9, dx, 31.9, 1.1, metal, 6, tower); const dish = cylinder(.22, .5, dx, 32.7, 1.4, material('#d6dfeb'), 14, tower, 1.3); dish.rotation.x = .9; }
    box(.32, 12, .32, 0, 37.4, -.4, metal, tower); for (const [level, span] of [[34, 2.6], [37, 1.9], [40, 1.2]]) box(span, .12, .12, 0, level, -.4, metal, tower);
    beacon = new THREE.Mesh(new THREE.BoxGeometry(.7, .7, .7), new THREE.MeshBasicMaterial({ color: pink, toneMapped: false })); beacon.position.set(x, 43.9, z - .4); kit.moving.add(beacon);
    // An outside-broadcast van waits beside the studio.
    const van = kit.group(x + 11.2, z + 3.4);
    box(2.3, 2.2, 5, 0, 1.4, 0, material('#dfe7f3'), van); box(2.34, .4, 5.04, 0, 1.3, 0, material(pink, .5), van); box(2.1, .9, 1.3, 0, 1.75, 2.1, material('#16233a', 0, .3), van);
    for (const side of [-1, 1]) for (const end of [-1, 1]) box(.3, .7, .8, side * 1.1, .4, end * 1.6, material('#080b15'), van);
    cylinder(.2, .4, 0, 2.95, -1, material('#d6dfeb'), 12, van, .9).rotation.x = -.6;
    kit.pool(x, z + 8, 11, pink, .7); kit.pool(x + 11, z, 7, '#ffe7f2', .4);
  }

  // App Station: a curved glass pavilion, and beside it a phone sculpture showing only the real app icon.
  {
    const { x, z } = spot('download'), station = kit.group(x - 3.4, z), lime = P.lime;
    const stone = material('#1d2a3a', 0, .7), graphite = new THREE.MeshPhysicalMaterial({ color: '#0b1017', metalness: .65, roughness: .3, clearcoat: .8, envMapIntensity: 1.4 });
    const steel = new THREE.MeshStandardMaterial({ color: '#9db0bf', metalness: 1, roughness: .2, envMapIntensity: 1.6 });
    resources.push(graphite, steel);
    box(20.6, .3, 12, 0, .15, 0, stone, station); box(20.8, .04, .2, 0, .32, 6, material(lime, .7), station);
    // Glazed back wall with warm rooms behind it, slim columns, and a vaulted roof shell.
    box(18, 3.8, .14, 0, 2.2, -3.7, material('#0b1824', 0, .1), station);
    for (let i = 0; i < 5; i++) kit.windowQuad(station, -7.6 + i * 3.8, 2.2, -3.62, 3.3, 3.2, 0, '#ffd9a8', .42);
    for (const cx of [-8.6, -2.9, 2.9, 8.6]) for (const cz of [-3.2, 3.6]) kit.cylinder(.13, 5, cx, 2.8, cz, material('#2b394b', 0, .3), 12, station);
    const roofGeometry = new THREE.CylinderGeometry(14, 14, 20, 48, 1, true, Math.PI / 2 - .38, .76); roofGeometry.rotateZ(Math.PI / 2);
    const roofMaterial = new THREE.MeshPhysicalMaterial({ color: '#16212e', metalness: .7, roughness: .35, clearcoat: .5, side: THREE.DoubleSide }); resources.push(roofGeometry, roofMaterial);
    const roof = new THREE.Mesh(roofGeometry, roofMaterial); roof.position.set(0, 5.3 - 13, .2); roof.castShadow = true; station.add(roof); station.updateWorldMatrix(true, true); kit.details.attach(roof);
    for (const edge of [-1, 1]) box(20, .06, .1, 0, 5.32, .2 + edge * 5.15, material(lime, edge > 0 ? 1 : .4), station);
    for (const bx of [-4.5, 3]) { box(3.2, .1, .8, bx, .78, 1.6, material('#2b394b', 0, .4), station); for (const leg of [-1.3, 1.3]) box(.1, .45, .7, bx + leg, .52, 1.6, material('#2b394b', 0, .4), station); }
    kit.pool(x - 3.4, z + 1, 10, '#ffe9cf', .36, .34);
    // The name in metal letters along the roof edge.
    const letterMaterial = new THREE.MeshPhysicalMaterial({ color: '#d4e1ea', metalness: 1, roughness: .26, emissive: lime, emissiveIntensity: .06, envMapIntensity: 1.6 }); resources.push(letterMaterial);
    new FontLoader().load(publicAsset('/assets/city/fonts/droid_sans_bold.typeface.json'), font => {
      if (!live) return;
      const geometry = new TextGeometry('APP STATION', { font, size: .62, depth: .16, curveSegments: 5, bevelEnabled: true, bevelThickness: .015, bevelSize: .012, bevelSegments: 1 });
      geometry.computeBoundingBox(); geometry.translate(-(geometry.boundingBox!.max.x + geometry.boundingBox!.min.x) / 2, 0, 0); resources.push(geometry);
      const letters = new THREE.Mesh(geometry, letterMaterial); letters.position.set(x - 3.4, 5.36, z + 5.1); kit.details.add(letters);
    });
    // The phone: graphite body, a thin steel frame, a camera island, and a screen drawn from brand assets.
    const phone = kit.group(x - 13.6, z + 1.6, -.45);
    const body = new THREE.Mesh(new RoundedBoxGeometry(3.4, 6.8, .42, 6, .42), graphite); body.position.set(0, 4, 0); phone.add(body);
    const rim = new THREE.Mesh(new RoundedBoxGeometry(3.52, 6.92, .32, 6, .44), steel); rim.position.set(0, 4, -.02); phone.add(rim);
    const island = new THREE.Mesh(new RoundedBoxGeometry(1.25, 1.25, .12, 4, .2), graphite); island.position.set(-.85, 6.55, -.26); phone.add(island);
    for (const [lx, ly] of [[-1.1, 6.8], [-.6, 6.8], [-1.1, 6.3]]) { const lens = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .08, 20), steel); lens.rotation.x = Math.PI / 2; lens.position.set(lx, ly, -.34); phone.add(lens); }
    const stand = new THREE.Mesh(new RoundedBoxGeometry(3, .55, 1.5, 3, .1), graphite); stand.position.set(0, .4, 0); phone.add(stand);
    resources.push(body.geometry, rim.geometry, island.geometry, stand.geometry);
    const screen = kit.canvasTexture(512, 1024, (c, w, h) => { c.fillStyle = '#061019'; c.fillRect(0, 0, w, h); });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 6.5), new THREE.MeshBasicMaterial({ map: screen, toneMapped: false })); screenMesh.position.set(0, 4, .216); phone.add(screenMesh);
    resources.push(screenMesh.geometry, screenMesh.material as THREE.Material, screen);
    phone.updateWorldMatrix(true, true); for (const part of [...phone.children]) kit.details.attach(part);
    const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; });
    void Promise.all([load(publicAsset('/assets/brand/app-icon.png')), load(publicAsset('/assets/brand/statoz-wordmark-v2.png'))]).then(([icon, wordmark]) => {
      if (!live) return;
      const c = (screen.image as HTMLCanvasElement).getContext('2d')!, w = 512, h = 1024;
      const glow = c.createRadialGradient(w / 2, 380, 20, w / 2, 380, 420); glow.addColorStop(0, '#0f3a4a'); glow.addColorStop(1, '#061019');
      c.fillStyle = glow; c.fillRect(0, 0, w, h);
      c.save(); c.beginPath(); c.roundRect(w / 2 - 130, 250, 260, 260, 58); c.clip(); c.drawImage(icon, w / 2 - 130, 250, 260, 260); c.restore();
      const wordWidth = 300, wordHeight = wordWidth * wordmark.height / wordmark.width; c.drawImage(wordmark, w / 2 - wordWidth / 2, 580, wordWidth, wordHeight);
      c.textAlign = 'center'; kit.fitText(c, 'GET THE APP', '700', 34, w * .7); c.fillStyle = lime; c.fillText('GET THE APP', w / 2, 600 + wordHeight + 70);
      c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.roundRect(w / 2 - 60, h - 40, 120, 8, 4); c.fill();
      screen.needsUpdate = true;
    }).catch(() => {});
    // Store plinths carry the Google Play and Apple glyphs.
    for (const [index, glyph] of ([publicAsset('/assets/icons/playstore.svg'), publicAsset('/assets/icons/apple.svg')] as const).entries()) {
      const plinth = kit.group(x - 10.2 + index * 1.9, z + 3.8, -.3);
      box(1.5, 1, 1.5, 0, .5, 0, material('#141e2b', 0, .5), plinth); box(1.52, .04, 1.52, 0, 1.01, 0, material(lime, .9), plinth);
      const face = kit.canvasTexture(128, 128, c => { c.fillStyle = '#0b131d'; c.fillRect(0, 0, 128, 128); });
      kit.panel(face, 0, .55, .76, 1.1, 1.1 * 0.62, 0, plinth); resources.push(face);
      void load(glyph).then(image => { if (!live) return; const c = (face.image as HTMLCanvasElement).getContext('2d')!; c.filter = 'invert(1)'; c.drawImage(image, 36, 24, 56, 56); c.filter = 'none'; face.needsUpdate = true; }).catch(() => {});
    }
    kit.pool(x - 13.6, z + 4, 6, lime, .5); kit.reflection(x - 13.6, z + 2.6, lime, .25, 6);
    kit.claim('app station', x - 13.7, z - 6, x + 6.9, z + 6);
    kit.claim('app station phone', x - 15.4, z - .2, x - 11.8, z + 5.4);
  }

  // Visitor Centre: a round information pavilion under a beacon.
  {
    const { x, z } = spot('help'), centre = kit.group(x, z), cyan = P.cyan;
    cylinder(7, .4, 0, .2, 0, material('#1b2f44'), 40, centre); kit.ring(x, z, 7, cyan, .16, .56);
    cylinder(4.6, 4.2, 0, 2.5, 0, material('#17394a', 0, .3), 28, centre);
    for (let i = 1; i < 16; i++) { const a = i / 16 * Math.PI * 2; kit.windowQuad(centre, Math.sin(a) * 4.6, 2.75, Math.cos(a) * 4.6, 1.35, 2.4, a, '#9fdcf0', .55); }
    box(1.7, 2.7, .2, 0, 1.75, 4.6, material('#0d1b29'), centre);
    cylinder(6.8, .36, 0, 4.82, 0, material('#13212f', 0, .5), 40, centre); kit.ring(x, z, 6.8, cyan, .2, 5.14);
    cylinder(2, .5, 0, 5.25, 0, material('#bfefff', .9), 24, centre); cylinder(.16, 6.6, 0, 8.8, 0, metal, 8, centre);
    const info = kit.canvasTexture(256, 256, c => {
      c.fillStyle = '#071625'; c.fillRect(0, 0, 256, 256); c.strokeStyle = cyan; c.lineWidth = 14; c.beginPath(); c.arc(128, 128, 104, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(128, 74, 17, 0, Math.PI * 2); c.fill(); c.fillRect(112, 106, 32, 92);
    });
    for (const yaw of [Math.PI / 4, Math.PI * 1.25]) { kit.panel(info, Math.sin(yaw) * .12, 13.6, Math.cos(yaw) * .12, 3.6, 3.6, yaw, centre); }
    box(3.9, 3.9, .16, 0, 13.6, 0, material(cyan, .5), centre).rotation.y = Math.PI / 4;
    // A welcome board and a map of the city by the door.
    for (const leg of [-2.1, 2.1]) box(.2, 2.2, .2, 7.2 - Math.sin(1.25) * .3, 1.2, 3 - leg * Math.sin(1.25), metal, centre);
    kit.sign('HELLO.', 'VISITOR CENTRE', 7.4, 2.7, 3, 5.6, 2.2, cyan, 1.25, centre);
    const map = kit.canvasTexture(512, 360, (c, w, h) => {
      c.fillStyle = '#081423'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(92,223,255,.18)'; c.lineWidth = 2;
      for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(i * w / 8, 0); c.lineTo(i * w / 8, h); c.moveTo(0, i * h / 8); c.lineTo(w, i * h / 8); c.stroke(); }
      for (const place of CITY_LOCATIONS) { c.fillStyle = place.accent; c.beginPath(); c.arc(place.map[0] * w / 100, place.map[1] * h / 100, place.id === 'help' ? 15 : 9, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#ffffff'; c.textAlign = 'center'; kit.fitText(c, 'YOU ARE HERE', '700', 30, w * .6); c.fillText('YOU ARE HERE', w / 2, 38);
    });
    box(3.8, 2.8, .2, -6.6, 2.1, 6.2, metal, centre).rotation.y = .35; for (const leg of [-1.5, 1.5]) box(.16, 1.4, .16, -6.6 + Math.cos(.35) * leg, .8, 6.2 - Math.sin(.35) * leg, metal, centre);
    kit.panel(map, -6.6 + Math.sin(.35) * .12, 2.1, 6.2 + Math.cos(.35) * .12, 3.4, 2.4, .35, centre);
    for (const side of [-1, 1]) box(3, .5, .9, side * 3.6, .65, 6.4, material('#22364c'), centre);
    kit.pool(x, z, 12.5, '#c8f1ff', .6);
  }

  // City Hall: steps, a colonnade, a pediment and a dome.
  {
    const { x, z } = spot('city-hall'), hall = kit.group(x, z), violet = P.violet, warm = '#ffe1b0';
    const stone = material('#8a8d96'), pale = material('#a7a9b0'), base = material('#5b5f6b');
    for (let i = 0; i < 4; i++) box(13, .28 * (i + 1), .7, 0, .14 * (i + 1), 9.75 - i * .7, base, hall);
    box(18, 1.2, 14, 0, .6, 0, base, hall); box(15.4, 1.2, 2.6, 0, .6, 8.1, base, hall);
    box(16, 7.4, 11, 0, 4.9, -1, stone, hall);
    for (let i = 0; i < 6; i++) { const cx = -6.25 + i * 2.5; cylinder(.46, 6.4, cx, 4.4, 8.1, pale, 12, hall); box(1.2, .25, 1.2, cx, 1.32, 8.1, pale, hall); box(1.2, .25, 1.2, cx, 7.5, 8.1, pale, hall); }
    box(15.4, 1, 4.6, 0, 8.1, 6.8, stone, hall); kit.prism(15.8, 2.5, 4.8, 0, 8.6, 6.8, pale, hall, 'z');
    box(16.6, .5, 11.6, 0, 8.85, -1, pale, hall); box(13, 1.3, 8.4, 0, 9.75, -1, stone, hall);
    cylinder(3.7, 2.4, 0, 11.6, -1, pale, 20, hall);
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; kit.windowQuad(hall, Math.sin(a) * 3.7, 11.7, -1 + Math.cos(a) * 3.7, .9, 1.4, a, '#eadcff', 1.1); }
    kit.dome(3.7, 0, 12.8, -1, material('#9a9eab', .05, .5), hall);
    cylinder(.75, 1.5, 0, 17.1, -1, material(violet, 1.1), 10, hall); box(.1, 2.6, .1, 0, 19.1, -1, metal, hall); box(1.4, .8, .05, .8, 19.9, -1, material(violet, .7), hall);
    box(1.9, 3.8, .15, 0, 3.1, 4.56, material('#2a2233'), hall);
    for (let i = 0; i < 5; i++) if (i !== 2) kit.windowQuad(hall, -5 + i * 2.5, 4.9, 4.5, 1.3, 3.6, 0, warm, 1);
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++) kit.windowQuad(hall, side * 8, 4.9, -5 + i * 2.7, 1.3, 3.6, side * Math.PI / 2, warm, .95);
    kit.sign('CITY HALL', '', 0, 8.1, 9.14, 8.6, .78, violet, 0, hall);
    for (const side of [-1, 1]) { box(.2, 3.6, .2, side * 7.6, 1.8, 9.9, metal, hall); box(.6, .6, .6, side * 7.6, 3.8, 9.9, material('#fff0d2', 2), hall); kit.pool(x + side * 7.6, z + 9.9, 4, warm, .7); }
    for (const tx of [-7.5, 7.5]) kit.tree(x + tx, z + 12.6, 1);
    kit.pool(x, z + 9, 10, violet, .6); kit.pool(x, z - 1, 13, '#e6d9ff', .3, .9);
  }

  return {
    update(time: number) {
      tickers.forEach(map => { map.offset.x = time * .045; });
      beacon.visible = time % 1.6 < 1.05;
    },
    dispose() { live = false; resources.forEach(resource => resource.dispose()); },
  };
}
