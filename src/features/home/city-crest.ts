import * as THREE from 'three';
import { CITY_PALETTE as P } from './city-config';
import { seeded } from './city-kit';
import { clamp01, smooth, smoother } from './city-journey-motion';

/**
 * The StatOz icon as a model made from its own parts: one glossy slab carrying the unmodified
 * app_logo.png (the bezel, goal line and pitch are all the original art), a recessed goal mouth, and
 * the icon's own flat octagonal ball cut from the same image. Measurements come from the 512 px
 * original, mapped to a 26-unit square; continuous UVs make the pieces read as one icon once assembled.
 */
const S = 26, H = S / 2, CORNER = 4.6;
const GOAL = { left: -6.1, right: 6.1, top: 6.08, bottom: -4.42 };
/** Front face of the slab (half its 1.2 depth plus the bevel), and the ball's centre just proud of it. */
const FRONT = .76, BALL_Z = .67;
type Point = [number, number];

function arc(cx: number, cy: number, radius: number, from: number, to: number, steps = 8): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => { const a = from + (to - from) * i / steps; return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius] as Point; });
}
/** Keeps the part of a convex polygon on the side where n·p <= c. */
function clip(poly: Point[], nx: number, ny: number, c: number): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c;
    if (da <= 0) out.push(a);
    if (da * db < 0) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
}
/** Ray-cast point-in-polygon test. */
function inside(poly: Point[], [x, y]: Point) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
const area = (poly: Point[]) => Math.abs(poly.reduce((sum, p, i) => { const q = poly[(i + 1) % poly.length]; return sum + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const centroid = (poly: Point[]): Point => { const n = poly.length; return [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n]; };

/** Logo units from app_logo.png pixels (512 px square, y down). */
const fromPixels = (x: number, y: number): Point => [(x / 512 - .5) * S, (.5 - y / 512) * S];
/**
 * The ball is the icon's own octagon. Its centre and the distance to each flat side (every 45°, clockwise
 * from +x in image space) were measured from the bright fill of app_logo.png; 5 px adds its dark outline.
 */
const BALL_PIXELS = { x: 256.1, y: 264.4, sides: [75.9, 80.3, 86.6, 80.4, 76.1, 78.8, 83.4, 78] };
function ballPolygon(): Point[] {
  const d = BALL_PIXELS.sides.map(side => side + 5), corners: Point[] = [];
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4, b = a + Math.PI / 4, da = d[k], db = d[(k + 1) % 8], det = Math.sin(b - a);
    corners.push(fromPixels(BALL_PIXELS.x + (da * Math.sin(b) - db * Math.sin(a)) / det, BALL_PIXELS.y + (db * Math.cos(a) - da * Math.cos(b)) / det));
  }
  return corners;
}

// The slab is a rounded square with the goal mouth cut through it.
const OUTLINE: Point[] = [
  ...arc(H - CORNER, -H + CORNER, CORNER, -Math.PI / 2, 0), ...arc(H - CORNER, H - CORNER, CORNER, 0, Math.PI / 2),
  ...arc(-H + CORNER, H - CORNER, CORNER, Math.PI / 2, Math.PI), ...arc(-H + CORNER, -H + CORNER, CORNER, Math.PI, Math.PI * 1.5),
];
const MOUTH: Point[] = [[GOAL.left, GOAL.bottom], [GOAL.right, GOAL.bottom], [GOAL.right, GOAL.top], [GOAL.left, GOAL.top]];
// Four convex regions tile the slab around the mouth, so every Voronoi cell clips to one convex shard.
const REGIONS: Point[][] = [
  [[-H, GOAL.bottom], [GOAL.left, GOAL.bottom], [GOAL.left, H], ...arc(-H + CORNER, H - CORNER, CORNER, Math.PI / 2, Math.PI)],
  [[GOAL.right, GOAL.bottom], [H, GOAL.bottom], ...arc(H - CORNER, H - CORNER, CORNER, 0, Math.PI / 2), [GOAL.right, H]],
  [[GOAL.left, GOAL.top], [GOAL.right, GOAL.top], [GOAL.right, H], [GOAL.left, H]],
  [[H, GOAL.bottom], [-H, GOAL.bottom], ...arc(-H + CORNER, -H + CORNER, CORNER, Math.PI, Math.PI * 1.5), ...arc(H - CORNER, -H + CORNER, CORNER, Math.PI * 1.5, Math.PI * 2)],
];

/** Seeded Voronoi shards with deliberately uneven sizes. */
function shardPolygons() {
  const random = seeded(2604), shards: Point[][] = [];
  REGIONS.forEach((region, index) => {
    const xs = region.map(p => p[0]), ys = region.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const seeds: Point[] = [], wanted = [5, 5, 4, 6][index];
    for (let attempt = 0; seeds.length < wanted && attempt < 400; attempt++) {
      const candidate: Point = [minX + random() * (maxX - minX), minY + random() * (maxY - minY)];
      const spacing = 1.8 + random() * 3.6;
      if (inside(region, candidate) && seeds.every(seed => Math.hypot(seed[0] - candidate[0], seed[1] - candidate[1]) > spacing)) seeds.push(candidate);
    }
    seeds.forEach((seed, i) => {
      let cell = region;
      seeds.forEach((other, j) => {
        if (i === j) return;
        cell = clip(cell, other[0] - seed[0], other[1] - seed[1], (other[0] ** 2 + other[1] ** 2 - seed[0] ** 2 - seed[1] ** 2) / 2);
      });
      if (cell.length > 2 && area(cell) > .05) shards.push(cell);
    });
  });
  return shards;
}

function pathOf<T extends THREE.Path>(path: T, points: Point[]) { points.forEach(([x, y], i) => i ? path.lineTo(x, y) : path.moveTo(x, y)); path.closePath(); return path; }
const logoUV = {
  generateTopUV: (_g: THREE.ExtrudeGeometry, v: number[], a: number, b: number, c: number) => [a, b, c].map(i => new THREE.Vector2(v[i * 3] / S + .5, v[i * 3 + 1] / S + .5)),
  generateSideWallUV: (_g: THREE.ExtrudeGeometry, v: number[], a: number, b: number, c: number, d: number) => [a, b, c, d].map(i => new THREE.Vector2(v[i * 3] / S + .5, v[i * 3 + 2] * .1)),
};
function extrude(points: Point[], depth = 1.2, bevel = .16, holes: Point[][] = []) {
  const shape = pathOf(new THREE.Shape(), points);
  holes.forEach(hole => shape.holes.push(pathOf(new THREE.Path(), hole)));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * .8, bevelSegments: 2, curveSegments: 1, steps: 1, UVGenerator: logoUV });
  geometry.translate(0, 0, -depth / 2); return geometry;
}

export type CrestMaterials = ReturnType<typeof crestMaterials>;
export function crestMaterials(texture: THREE.Texture) {
  return {
    face: new THREE.MeshPhysicalMaterial({ map: texture, roughness: .24, metalness: .05, clearcoat: 1, clearcoatRoughness: .08, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: .22, envMapIntensity: 1 }),
    side: new THREE.MeshPhysicalMaterial({ color: '#0b2534', metalness: .92, roughness: .26, clearcoat: .7, emissive: P.cyan, emissiveIntensity: .05, envMapIntensity: 1.4 }),
    recess: new THREE.MeshStandardMaterial({ color: '#03101a', roughness: .6, metalness: .3 }),
    wall: new THREE.MeshStandardMaterial({ color: '#0a1e2c', roughness: .4, metalness: .6 }),
    glow: new THREE.MeshBasicMaterial({ color: new THREE.Color(P.cyan).multiplyScalar(1.6), toneMapped: false }),
  };
}

/** Builds every part once. The animated crest uses the shards; the small gate emblem only the assembled parts. */
export function crestParts(materials: CrestMaterials, withShards = true) {
  const shards = withShards ? shardPolygons().map(polygon => {
    const [cx, cy] = centroid(polygon);
    const geometry = extrude(polygon); geometry.translate(-cx, -cy, 0);
    return { polygon, geometry, home: new THREE.Vector3(cx, cy, 0), area: area(polygon) };
  }) : [];
  const face = new THREE.Mesh(extrude(OUTLINE, 1.2, .16, [MOUTH]), [materials.face, materials.side]); face.name = 'logo-face'; face.castShadow = true;

  const recess = new THREE.Group(); recess.name = 'logo-goal-mouth';
  const width = GOAL.right - GOAL.left, height = GOAL.top - GOAL.bottom, midY = (GOAL.top + GOAL.bottom) / 2;
  const back = new THREE.Mesh(new THREE.BoxGeometry(width, height, .2), materials.recess); back.position.set(0, midY, -1.35); recess.add(back);
  for (const [w, h, x, y] of [[.12, height, GOAL.left + .06, midY], [.12, height, GOAL.right - .06, midY], [width, .12, 0, GOAL.top - .06]] as const) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 2.1), materials.wall); wall.position.set(x, y, -.3); recess.add(wall);
    const line = new THREE.Mesh(new THREE.BoxGeometry(w + .04, h + .04, .05), materials.glow); line.position.set(x, y, FRONT + .04); recess.add(line);
  }

  // The ball is flat: the icon's own octagon, cut from the same image so it is exactly the logo's ball.
  const ballShape = ballPolygon(), [bx, by] = centroid(ballShape);
  const ballGeometry = extrude(ballShape, .3, .06); ballGeometry.translate(-bx, -by, 0);
  const ball = new THREE.Mesh(ballGeometry, [materials.face, materials.side]); ball.name = 'logo-ball'; ball.position.set(bx, by, BALL_Z);
  return { shards, face, recess, ball, ballShape };
}

/** A small, fully assembled emblem for in-world signage. */
export function crestEmblem(materials: CrestMaterials) {
  const parts = crestParts(materials, false), group = new THREE.Group(); group.name = 'statoz-emblem';
  group.add(parts.face, parts.recess, parts.ball);
  return group;
}

export type CrestContact = { position: THREE.Vector3; strength: number };

/**
 * Seconds on the build clock. Fragments drift in the dark, are struck awake one by one, then pulled
 * home; the ball spins in last. The loader holds at `hold`, with the ball hovering and crackling,
 * until the city has loaded, then the ball slams home at `land` and the seams cool.
 */
export const CREST_TIMING = { awaken: 1.1, pull: 2.4, recess: 4.8, ball: 5.1, hold: 5.9, land: 6.6, swap: 7.3, done: 8 } as const;
const PULL_TIME = 1.25, TURNS = 4;

const PLAIN_VERTEX = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
/** A glow strip whose v runs from a fragment's edge (0) inward (1). Heat whitens it. */
const SEAM_FRAGMENT = `uniform float uGlow; uniform float uHeat; varying vec2 vUv;
  void main(){ float v = clamp(vUv.y, 0.0, 1.0); float edge = exp(-v * 4.5) * (1.0 - v);
    vec3 color = mix(vec3(.22, .82, 1.0), vec3(1.0, .97, .9), clamp(uHeat * (.4 + edge), 0.0, 1.0));
    gl_FragColor = vec4(max(color * edge * uGlow, vec3(0.0)), 1.0); }`;
/** A lightning strip: a white core with a cyan halo, faded at both ends. */
const BOLT_FRAGMENT = `uniform float uAlpha; varying vec2 vUv;
  void main(){ float d = abs(vUv.y - .5) * 2.0; float ends = smoothstep(0.0, .06, vUv.x) * (1.0 - smoothstep(.94, 1.0, vUv.x));
    float core = 1.0 - smoothstep(0.0, .28, d); float halo = exp(-d * d * 5.0) * .5;
    gl_FragColor = vec4(max(mix(vec3(.25, .8, 1.0), vec3(1.0), core) * (core + halo) * ends * uAlpha, vec3(0.0)), 1.0); }`;
/** The energy at the heart of the goal: a soft core, a wide halo and an anamorphic streak. */
const CORE_FRAGMENT = `uniform float uPower; varying vec2 vUv;
  void main(){ vec2 p = vUv - .5; float d = length(p) * 2.0;
    float glow = exp(-d * d * 6.0) * .55 + exp(-d * 14.0) * .9 + exp(-abs(p.y) * 90.0) * exp(-abs(p.x) * 4.0) * .5;
    vec3 color = mix(vec3(.2, .75, 1.0), vec3(1.0), exp(-d * 9.0));
    gl_FragColor = vec4(max(color * glow * uPower, vec3(0.0)), 1.0); }`;
const additive = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>, depthTest = true) => new THREE.ShaderMaterial({ uniforms, vertexShader: PLAIN_VERTEX, fragmentShader, transparent: true, depthWrite: false, depthTest, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });

/** A glowing strip along a polygon's outline, in coordinates relative to `center`. */
function seamGeometry(polygon: Point[], center: Point, z: number, width = .7) {
  const positions: number[] = [], uvs: number[] = [], index: number[] = [];
  polygon.forEach(([x, y]) => {
    const dx = center[0] - x, dy = center[1] - y, length = Math.hypot(dx, dy) || 1, k = Math.min(width, length * .45) / length;
    positions.push(x - center[0], y - center[1], z, x - center[0] + dx * k, y - center[1] + dy * k, z);
    uvs.push(0, 0, 0, 1);
  });
  for (let i = 0; i < polygon.length; i++) { const a = i * 2, b = ((i + 1) % polygon.length) * 2; index.push(a, b, a + 1, b, b + 1, a + 1); }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(index);
  return geometry;
}

type Endpoint = (out: THREE.Vector3) => THREE.Vector3;
const BOLT_SEGMENTS = 16;
function createBolt() {
  const n = BOLT_SEGMENTS + 1, positions = new Float32Array(n * 6), uvs = new Float32Array(n * 4), index: number[] = [];
  for (let i = 0; i < n; i++) { uvs.set([i / BOLT_SEGMENTS, 0, i / BOLT_SEGMENTS, 1], i * 4); if (i < BOLT_SEGMENTS) { const a = i * 2; index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
  const geometry = new THREE.BufferGeometry();
  const attribute = new THREE.BufferAttribute(positions, 3); attribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', attribute); geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); geometry.setIndex(index);
  const material = additive(BOLT_FRAGMENT, { uAlpha: { value: 0 } }, false);
  const mesh = new THREE.Mesh(geometry, material); mesh.frustumCulled = false; mesh.renderOrder = 20; mesh.visible = false;
  return { mesh, material, attribute, offsets: new Float32Array(n), from: null as Endpoint | null, to: null as Endpoint | null, born: 0, life: 0, next: 0, power: 1, flicker: 1, width: .45 };
}
/** Midpoint displacement: a jagged profile pinned at both ends. */
function jag(offsets: Float32Array) {
  offsets[0] = 0; offsets[BOLT_SEGMENTS] = 0;
  for (let step = BOLT_SEGMENTS, amplitude = 1; step > 1; step /= 2, amplitude *= .52) {
    const half = step / 2;
    for (let i = half; i < BOLT_SEGMENTS; i += step) offsets[i] = (offsets[i - half] + offsets[i + half]) / 2 + (Math.random() - .5) * amplitude;
  }
}

/** The loader logo, reforged from its fragments as the build clock runs from 0 to CREST_TIMING.done. */
export function createCrest(texture: THREE.Texture) {
  const T = CREST_TIMING;
  const materials = crestMaterials(texture);
  const parts = crestParts(materials);
  const group = new THREE.Group(); group.name = 'statoz-crest';
  const body = new THREE.Group(); group.add(body);
  const shardGroup = new THREE.Group(), seamGroup = new THREE.Group();
  body.add(shardGroup, parts.face, parts.recess, parts.ball, seamGroup);
  const random = seeded(77);
  const ballHome = parts.ball.position.clone();
  const glowBase = materials.glow.color.clone();

  const flights = parts.shards.map(shard => {
    const material = materials.face.clone();
    const mesh = new THREE.Mesh(shard.geometry, [material, materials.side]); shardGroup.add(mesh);
    const seamMaterial = additive(SEAM_FRAGMENT, { uGlow: { value: 0 }, uHeat: { value: 0 } });
    const seam = new THREE.Mesh(seamGeometry(shard.polygon, [shard.home.x, shard.home.y], FRONT + .03), seamMaterial); seam.renderOrder = 4; seamGroup.add(seam);
    const angle = Math.atan2(shard.home.y - 1, shard.home.x) + (random() - .5) * .8;
    return {
      mesh, material, seam, seamMaterial, home: shard.home, area: shard.area,
      direction: new THREE.Vector2(Math.cos(angle), Math.sin(angle)), reach: .34 + random() * .4, depth: -26 + random() * 32,
      axis: new THREE.Vector3(random() - .5, random() - .5, random() - .5).normalize(), spin: .35 + random() * .6, phase: random() * Math.PI * 2,
      swirl: (random() < .5 ? -1 : 1) * (5 + random() * 8), rank: shard.area + random() * 10,
      ignite: 0, pull: 0, land: 0, delay: shard.home.distanceTo(ballHome) * .018, neighbour: null as null | { mesh: THREE.Mesh; land: number },
    };
  });
  type Flight = typeof flights[number];
  // Lightning wakes the fragments in a sweep around the circle; the largest are pulled home first.
  const sweep = (f: Flight) => { const a = Math.PI / 2 - Math.atan2(f.direction.y, f.direction.x); return ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2); };
  [...flights].sort((a, b) => sweep(a) - sweep(b)).forEach((f, i, all) => { f.ignite = T.awaken + 1.35 * i / Math.max(1, all.length - 1); });
  [...flights].sort((a, b) => b.rank - a.rank).forEach((f, i, all) => { f.pull = Math.max(T.pull + 2.05 * i / Math.max(1, all.length - 1), f.ignite + .45); f.land = f.pull + PULL_TIME; });
  flights.forEach(f => { f.neighbour = flights.filter(o => o !== f).sort((a, b) => a.home.distanceTo(f.home) - b.home.distanceTo(f.home))[0] ?? null; });

  // The ball carries its own rim glow.
  const ballSeamMaterial = additive(SEAM_FRAGMENT, { uGlow: { value: 0 }, uHeat: { value: 0 } });
  const ballSeam = new THREE.Mesh(seamGeometry(parts.ballShape, [ballHome.x, ballHome.y], .24, .55), ballSeamMaterial); ballSeam.renderOrder = 5; parts.ball.add(ballSeam);

  // The energy sits inside the goal, so fragments and the ball pass in front of it; the fuse flash is drawn over everything.
  const coreMaterial = additive(CORE_FRAGMENT, { uPower: { value: 0 } });
  const core = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), coreMaterial); core.position.set(ballHome.x, ballHome.y, -.9); core.renderOrder = 3; body.add(core);
  const flashMaterial = additive(CORE_FRAGMENT, { uPower: { value: 0 } }, false);
  const flashMesh = new THREE.Mesh(core.geometry, flashMaterial); flashMesh.position.set(ballHome.x, ballHome.y, FRONT + .6); flashMesh.renderOrder = 19; body.add(flashMesh);
  const light = new THREE.PointLight(P.cyan, 0, 0, 2); light.position.set(ballHome.x, ballHome.y, 7); body.add(light);

  const shockMaterial = new THREE.MeshBasicMaterial({ color: P.cyan, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
  const shock = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 96), shockMaterial); shock.position.set(ballHome.x, ballHome.y, FRONT + .3); shock.renderOrder = 6; body.add(shock);
  const shineMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uMap: { value: texture }, uSweep: { value: -1 }, uStrength: { value: 0 } },
    vertexShader: PLAIN_VERTEX,
    fragmentShader: 'uniform sampler2D uMap; uniform float uSweep; uniform float uStrength; varying vec2 vUv; void main(){ float a = texture2D(uMap, vUv).a; float d = (vUv.x + vUv.y) * .5 - uSweep; float band = exp(-d * d * 90.0); gl_FragColor = vec4(vec3(.7, .93, 1.0) * band * a * uStrength, 1.0); }',
  });
  const shine = new THREE.Mesh(new THREE.PlaneGeometry(S, S), shineMaterial); shine.position.z = FRONT + .32; shine.renderOrder = 7; body.add(shine);

  const bolts = Array.from({ length: 14 }, createBolt); bolts.forEach(bolt => body.add(bolt.mesh));
  const points: THREE.Vector3[] = Array.from({ length: BOLT_SEGMENTS + 1 }, () => new THREE.Vector3());
  const a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3();
  function spawn(from: Endpoint, to: Endpoint, life: number, power: number, time: number, width = .45) {
    const bolt = bolts.find(item => !item.mesh.visible) ?? bolts.reduce((oldest, item) => item.born < oldest.born ? item : oldest);
    Object.assign(bolt, { from, to, born: time, life, power, next: 0, width }); bolt.mesh.visible = true;
  }
  function layBolts(time: number) {
    for (const bolt of bolts) {
      if (!bolt.mesh.visible) continue;
      const age = time - bolt.born;
      if (age > bolt.life || age < 0 || !bolt.from || !bolt.to) { bolt.mesh.visible = false; continue; }
      if (time >= bolt.next) { jag(bolt.offsets); bolt.next = time + .045; bolt.flicker = .55 + Math.random() * .45; }
      bolt.from(a); bolt.to(b); d.subVectors(b, a);
      const length = d.length(); let px = -d.y, py = d.x; const pl = Math.hypot(px, py) || 1; px /= pl; py /= pl;
      points.forEach((point, i) => { point.copy(a).addScaledVector(d, i / BOLT_SEGMENTS); point.x += px * bolt.offsets[i] * length * .15; point.y += py * bolt.offsets[i] * length * .15; });
      const array = bolt.attribute.array as Float32Array, half = bolt.width / 2;
      points.forEach((point, i) => {
        const next = points[Math.min(i + 1, BOLT_SEGMENTS)], prev = points[Math.max(i - 1, 0)];
        let nx = -(next.y - prev.y), ny = next.x - prev.x; const nl = Math.hypot(nx, ny) || 1; nx = nx / nl * half; ny = ny / nl * half;
        array.set([point.x + nx, point.y + ny, point.z, point.x - nx, point.y - ny, point.z], i * 6);
      });
      bolt.attribute.needsUpdate = true;
      bolt.material.uniforms.uAlpha.value = bolt.power * bolt.flicker * Math.sqrt(Math.max(0, 1 - age / bolt.life));
    }
  }
  const coreAt: Endpoint = out => out.set(ballHome.x, ballHome.y, .4);
  const ballAt: Endpoint = out => out.copy(parts.ball.position);
  const meshAt = (mesh: THREE.Object3D): Endpoint => out => out.copy(mesh.position);
  const fixed = (x: number, y: number, z: number): Endpoint => out => out.set(x, y, z);
  const corners = [fixed(GOAL.left, GOAL.top, FRONT), fixed(GOAL.right, GOAL.top, FRONT), fixed(GOAL.left, GOAL.bottom, FRONT), fixed(GOAL.right, GOAL.bottom, FRONT)];
  const rim = () => { const p = OUTLINE[Math.floor(Math.random() * OUTLINE.length)]; return fixed(p[0], p[1], FRONT); };

  const contacts: CrestContact[] = [];
  const field = new THREE.Vector2(60, 40), temp = new THREE.Vector3(), control = new THREE.Vector3(), hover = new THREE.Vector3(), from = new THREE.Vector3();
  const tumble = new THREE.Quaternion(), identity = new THREE.Quaternion();
  const holdRate = TURNS * Math.PI * 2 * 3 * (1 - (T.hold - T.ball) / (T.land - T.ball)) ** 2 / (T.land - T.ball);
  let last = -1, jolt = 0, crackle = 0, holdSpin = 0, releaseFrom = -1, releaseTo = 0, releaseAt = 0, pulse = 0;

  const bezier = (p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, t: number, out: THREE.Vector3) => {
    const u = 1 - t; return out.set(u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y, u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z);
  };
  /** Where a fragment floats before it is pulled: a slow drift, a wind-up outward once struck, a tremble while charged. */
  function drift(f: Flight, t: number, out: THREE.Vector3) {
    const fx = Math.min(field.x, field.y * 1.3), fy = field.y, charge = smooth(f.ignite, f.pull + .1, t);
    out.set(f.direction.x * fx * f.reach, f.direction.y * fy * f.reach, f.depth);
    out.x += Math.sin(t * .6 + f.phase) * 1.4 + f.direction.x * 2.6 * charge;
    out.y += Math.cos(t * .5 + f.phase * 1.7) * 1.4 + f.direction.y * 2.6 * charge;
    out.z += Math.sin(t * .4 + f.phase * 2.3) * 2;
    const tremble = charge * (1 - smooth(f.pull, f.pull + .35, t)) * .22;
    out.x += Math.sin(t * 41 + f.phase * 5) * tremble; out.y += Math.cos(t * 37 + f.phase * 3) * tremble;
    return out;
  }
  const world = (object: THREE.Object3D) => object.getWorldPosition(new THREE.Vector3());

  return {
    group, materials, contacts,
    /** Bloom for the backdrop: the core's energy and the fuse flash. */
    get pulse() { return pulse; },
    /** The visible half-extent around the logo, in logo units, so the fragments scatter across the screen. */
    setField(x: number, y: number) { field.set(Math.max(x, 22), Math.max(y, 22)); },
    /** t: build clock (seconds). time: wall seconds for flicker. holding: the clock is paused at `hold`. */
    update(t: number, time: number, dt: number, holding = false) {
      const previous = last < 0 ? t - 1e-4 : last; last = t;
      const crossed = (at: number) => previous < at && t >= at;
      // ——— Fragments ———
      let landed = 0;
      for (const f of flights) {
        const s = clamp01((t - f.pull) / PULL_TIME);
        drift(f, t, temp);
        if (s <= 0) f.mesh.position.copy(temp);
        else if (s < 1) {
          control.copy(temp).lerp(f.home, .55); control.x += -f.direction.y * f.swirl; control.y += f.direction.x * f.swirl; control.z = temp.z * .5 + 7;
          bezier(temp, control, f.home, Math.pow(s, 2.6), f.mesh.position);
        } else {
          const u = t - f.land; f.mesh.position.copy(f.home); f.mesh.position.z += -.6 * Math.exp(-u * 8) * Math.sin(u * 26);
          landed++;
        }
        tumble.setFromAxisAngle(f.axis, f.phase + f.spin * t);
        f.mesh.quaternion.copy(tumble).slerp(identity, smoother(f.ignite - .2, f.land, t));
        f.seam.position.copy(f.mesh.position); f.seam.quaternion.copy(f.mesh.quaternion);
        // Dull metal in the dark until lightning strikes it.
        const level = Math.min(1, .08 + .3 * smooth(0, 1.2, t) + .62 * smooth(f.ignite, f.ignite + .6, t));
        f.material.color.setScalar(level);
        f.material.emissiveIntensity = .22 * level + (t >= f.ignite ? .7 * Math.exp(-(t - f.ignite) * 5) : 0) + (t >= f.land ? .45 * Math.exp(-(t - f.land) * 7) : 0) + (t >= T.land ? .8 * Math.exp(-(t - T.land) * 3) : 0);
        f.material.envMapIntensity = .5 + .5 * level;
        let glow = 0, heat = .15;
        if (t >= f.ignite) glow = .45 + 1.6 * Math.exp(-(t - f.ignite) * 5);
        if (t >= f.pull) glow = Math.max(glow, .45 + .35 * smooth(f.pull, f.land, t));
        if (t >= f.land) { glow = .6 + 1.5 * Math.exp(-(t - f.land) * 6); heat = .15 + .7 * Math.exp(-(t - f.land) * 8); }
        glow *= .88 + .12 * Math.sin(time * 23 + f.phase * 9);
        const fuse = t - T.land - f.delay;
        if (fuse >= 0) { glow = 2.4 * Math.exp(-fuse * 2.8); heat = Math.exp(-fuse * 2); }
        f.seamMaterial.uniforms.uGlow.value = glow * (1 - smooth(T.swap + .2, T.done, t));
        f.seamMaterial.uniforms.uHeat.value = heat;
        f.seam.visible = glow > .002 && t < T.done;
        f.mesh.visible = t < T.swap;
        if (crossed(f.ignite)) { spawn(coreAt, meshAt(f.mesh), .3, 1.3, time); contacts.push({ position: world(f.mesh), strength: .12 }); }
        if (crossed(f.land)) {
          contacts.push({ position: world(f.mesh), strength: Math.min(1, .25 + f.area / 22) });
          jolt = Math.min(1.2, jolt + .14 + f.area / 140);
          if (f.neighbour && t >= f.neighbour.land) spawn(meshAt(f.mesh), meshAt(f.neighbour.mesh), .16, 1, time, .32);
        }
      }
      shardGroup.visible = t < T.swap; parts.face.visible = t >= T.swap;
      const fuseFlash = t >= T.land ? Math.exp(-(t - T.land) * 3) : 0;
      materials.face.emissiveIntensity = .22 + .8 * fuseFlash;

      // ——— The goal mouth forms once the frame has closed ———
      const recessIn = smoother(T.recess, T.recess + .8, t);
      parts.recess.scale.set(1, 1, Math.max(.001, recessIn)); parts.recess.visible = recessIn > 0;
      materials.glow.color.copy(glowBase).multiplyScalar(smooth(T.recess + .3, T.recess + 1, t) * (1 + 1.5 * fuseFlash));

      // ——— The ball: rises spinning like a coin, hovers until the city is ready, then slams home ———
      const ball = parts.ball; ball.visible = t >= T.ball;
      const fx = Math.min(field.x, field.y * 1.3), fy = field.y;
      if (ball.visible) {
        hover.set(ballHome.x, ballHome.y + Math.sin(time * 2.2) * .35 * (1 - smooth(T.hold, T.land, t)), 11);
        if (t < T.hold) {
          const s = clamp01((t - T.ball) / (T.hold - T.ball));
          from.set(-fx * .2, -fy * 1.15, 18); control.set(fx * .5, -fy * .3, 28);
          bezier(from, control, hover, 1 - (1 - s) ** 3, ball.position);
        } else if (t < T.land) ball.position.lerpVectors(hover, ballHome, Math.pow((t - T.hold) / (T.land - T.hold), 2.4));
        else { const u = t - T.land; ball.position.copy(ballHome); ball.position.z += -.5 * Math.exp(-u * 9) * Math.sin(u * 30); }
        if (holding) { holdSpin += dt * holdRate; releaseFrom = -1; }
        else if (holdSpin > 0 && releaseFrom < 0) { releaseFrom = holdSpin; releaseTo = Math.ceil(holdSpin / (Math.PI * 2)) * Math.PI * 2; releaseAt = Math.min(t, T.land - .1); }
        const extra = releaseFrom < 0 ? holdSpin : THREE.MathUtils.lerp(releaseFrom, releaseTo, smoother(releaseAt, T.land, t));
        const u = clamp01((t - T.ball) / (T.land - T.ball));
        ball.rotation.set((1 - u) * .5, TURNS * Math.PI * 2 * (1 - (1 - u) ** 3) + extra, (1 - u) * .2);
      }
      const ballCharge = smooth(T.ball, T.ball + .4, t) * (.85 + .15 * Math.sin(time * 19));
      ballSeamMaterial.uniforms.uGlow.value = t < T.land ? ballCharge : 2.6 * Math.exp(-(t - T.land) * 2.6) * (1 - smooth(T.swap + .2, T.done, t));
      ballSeamMaterial.uniforms.uHeat.value = t < T.land ? .2 : Math.exp(-(t - T.land) * 2);
      if (crossed(T.land)) {
        contacts.push({ position: world(ball), strength: 1 }, { position: world(ball), strength: 1 });
        jolt = 1.4;
        for (let i = 0; i < 7; i++) spawn(ballAt, rim(), .3 + Math.random() * .25, 1.5, time, .5);
      }

      // ——— Lightning: crackling between the core, the fragments and the ball ———
      crackle += dt * (t < T.awaken || t >= T.land ? 0 : t < T.pull ? 3 : t < T.ball ? 6 : 10);
      while (crackle >= 1) {
        crackle -= 1;
        const charged = flights.filter(f => t >= f.ignite && t < f.land), settled = flights.filter(f => t >= f.land && f.neighbour);
        if (t >= T.ball && Math.random() < .7) spawn(corners[Math.floor(Math.random() * 4)], ballAt, .1 + Math.random() * .1, 1.1, time, .36);
        else if (charged.length && Math.random() < .65) spawn(coreAt, meshAt(charged[Math.floor(Math.random() * charged.length)].mesh), .12 + Math.random() * .1, 1, time);
        else if (settled.length) { const f = settled[Math.floor(Math.random() * settled.length)]; spawn(meshAt(f.mesh), meshAt(f.neighbour!.mesh), .1 + Math.random() * .08, .8, time, .3); }
      }
      layBolts(time);

      // ——— Core energy, light and the fuse flash ———
      const base = smooth(.8, 2.2, t) * (.55 + .2 * Math.sin(time * 7.3) ** 2) + .35 * landed / Math.max(1, flights.length) + .25 * ballCharge;
      const flash = fuseFlash * 3.2 * (1 - smooth(T.land + .8, T.done, t));
      const power = base * (1 - smooth(T.land, T.land + .25, t));
      coreMaterial.uniforms.uPower.value = power; core.visible = power > .002; core.scale.setScalar(12 + 9 * base);
      flashMaterial.uniforms.uPower.value = flash; flashMesh.visible = flash > .002; flashMesh.scale.setScalar(14 + 30 * flash);
      light.intensity = (power + flash * .5) * 20;
      pulse = base * .5 + flash * .6;
      const wave = clamp01((t - T.land) / 1.1);
      shock.visible = t >= T.land && wave < 1; shock.scale.setScalar(4.6 * (1 + (1 - (1 - wave) ** 3) * 4));
      shockMaterial.opacity = (1 - wave) ** 1.5 * .85;
      const gleam = clamp01((t - (T.swap - .1)) / .9);
      shineMaterial.uniforms.uSweep.value = THREE.MathUtils.lerp(-.25, 1.25, smoother(0, 1, gleam));
      shineMaterial.uniforms.uStrength.value = .55 * Math.sin(Math.PI * gleam);
      shine.visible = gleam > 0 && gleam < 1;

      // ——— The whole logo turns slowly to face the viewer, and jolts as pieces strike home ———
      const settle = smoother(0, T.land, t);
      jolt *= Math.exp(-dt * 7);
      body.rotation.set(.16 * (1 - settle), -.42 * (1 - settle), 0);
      body.position.set(Math.sin(time * 71) * .22 * jolt, Math.cos(time * 89) * .22 * jolt, -.7 * jolt);
      body.scale.setScalar(.9 + .1 * smoother(0, T.done, t));
    },
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>(), all = new Set<THREE.Material>();
      group.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => all.add(m)); } });
      Object.values(materials).forEach(m => all.add(m));
      geometries.forEach(g => g.dispose()); all.forEach(m => m.dispose());
    },
  };
}
export type Crest = ReturnType<typeof createCrest>;
export const CREST_SIZE = S;
