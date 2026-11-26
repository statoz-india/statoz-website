import { publicAsset } from '@statoz/design-system/asset';
import * as THREE from 'three';
import { CITY_PALETTE as P } from './city-config';
import type { CityKit } from './city-kit';

/** Streets run east-west at these z values and north-south at these x values. */
export const STREETS_Z = [-83, 3, 48, 83] as const;
export const STREETS_X = [-94, -17, 82, 111] as const;
export const ROAD_HALF_Z = 3.65, ROAD_HALF_X = 3.3, PAVEMENT = 2.2;
/** The approach avenue: the x = −17 street south of the district, ending at the hero plaza. */
export const AVENUE = { x: -17, from: 86.65, to: 168, promenade: 10 };
const DISTRICT = { minX: -116, maxX: 116, minZ: -98, maxZ: 92 }, FAR = 420;

export type Rect = { minX: number; minZ: number; maxX: number; maxZ: number };
type Piece = Rect & { axis: number; center: number; half: number; start: number; end: number; crossStart: number; crossEnd: number };

/** Road segments between junctions, junction squares, and pavements that never overlap. */
export function roadLayout() {
  const roads: Piece[] = [], pavements: Rect[] = [];
  const spans = (cuts: number[], half: number, from: number, to: number) => {
    const out: [number, number, boolean, boolean][] = []; let start = from, joined = false;
    for (const cut of [...cuts].sort((a, b) => a - b)) { if (cut - half > start) out.push([start, cut - half, joined, true]); start = cut + half; joined = true; }
    if (to > start) out.push([start, to, joined, false]); return out;
  };
  for (const z of STREETS_Z) for (const [a, b, js, je] of spans([...STREETS_X], ROAD_HALF_X, -FAR, FAR))
    roads.push({ minX: a, maxX: b, minZ: z - ROAD_HALF_Z, maxZ: z + ROAD_HALF_Z, axis: 0, center: z, half: ROAD_HALF_Z, start: a, end: b, crossStart: js ? 1 : 0, crossEnd: je ? 1 : 0 });
  for (const x of STREETS_X) for (const [a, b, js, je] of spans([...STREETS_Z], ROAD_HALF_Z, -FAR, x === AVENUE.x ? AVENUE.to : FAR))
    roads.push({ minX: x - ROAD_HALF_X, maxX: x + ROAD_HALF_X, minZ: a, maxZ: b, axis: 1, center: x, half: ROAD_HALF_X, start: a, end: b, crossStart: js ? 1 : 0, crossEnd: je ? 1 : 0 });
  for (const x of STREETS_X) for (const z of STREETS_Z) roads.push({ minX: x - ROAD_HALF_X, maxX: x + ROAD_HALF_X, minZ: z - ROAD_HALF_Z, maxZ: z + ROAD_HALF_Z, axis: 2, center: 0, half: 0, start: 0, end: 0, crossStart: 0, crossEnd: 0 });
  // East-west pavements run through the corners; north-south pavements stop at their outer edge.
  for (const z of STREETS_Z) for (const [a, b] of spans([...STREETS_X], ROAD_HALF_X, DISTRICT.minX, DISTRICT.maxX)) for (const side of [-1, 1])
    pavements.push({ minX: a, maxX: b, minZ: side < 0 ? z - ROAD_HALF_Z - PAVEMENT : z + ROAD_HALF_Z, maxZ: side < 0 ? z - ROAD_HALF_Z : z + ROAD_HALF_Z + PAVEMENT });
  for (const x of STREETS_X) for (const [a, b] of spans([...STREETS_Z], ROAD_HALF_Z + PAVEMENT, DISTRICT.minZ, DISTRICT.maxZ)) for (const side of [-1, 1])
    pavements.push({ minX: side < 0 ? x - ROAD_HALF_X - PAVEMENT : x + ROAD_HALF_X, maxX: side < 0 ? x - ROAD_HALF_X : x + ROAD_HALF_X + PAVEMENT, minZ: a, maxZ: b });
  // The avenue's promenades are wide enough for two rows of trees.
  for (const side of [-1, 1]) pavements.push({ minX: side < 0 ? AVENUE.x - ROAD_HALF_X - AVENUE.promenade : AVENUE.x + ROAD_HALF_X, maxX: side < 0 ? AVENUE.x - ROAD_HALF_X : AVENUE.x + ROAD_HALF_X + AVENUE.promenade, minZ: 83 + ROAD_HALF_Z + PAVEMENT, maxZ: AVENUE.to });
  return { roads, pavements };
}

function quads(rects: (Rect & Partial<Piece>)[], y: number, withRoadData: boolean) {
  const position: number[] = [], index: number[] = [], data: number[] = [], extent: number[] = [], uv: number[] = [];
  rects.forEach((r, i) => {
    position.push(r.minX, y, r.minZ, r.maxX, y, r.minZ, r.maxX, y, r.maxZ, r.minX, y, r.maxZ);
    uv.push(r.minX / 9, r.minZ / 9, r.maxX / 9, r.minZ / 9, r.maxX / 9, r.maxZ / 9, r.minX / 9, r.maxZ / 9);
    const o = i * 4; index.push(o, o + 2, o + 1, o, o + 3, o + 2);
    if (withRoadData) for (let k = 0; k < 4; k++) { data.push(r.axis!, r.center!, r.half!, 0); extent.push(r.start!, r.end!, r.crossStart!, r.crossEnd!); }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(position.map((_, i) => i % 3 === 1 ? 1 : 0), 3));
  if (withRoadData) { geometry.setAttribute('aRoad', new THREE.Float32BufferAttribute(data, 4)); geometry.setAttribute('aSpan', new THREE.Float32BufferAttribute(extent, 4)); }
  geometry.setIndex(index); return geometry;
}

const NOISE = 'float rh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); } float rn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f); return mix(mix(rh(i), rh(i+vec2(1,0)), u.x), mix(rh(i+vec2(0,1)), rh(i+vec2(1,1)), u.x), u.y); }';

/** Builds the road surface, pavements and kerbs. Returns the corridors for the layout audit. */
export function buildRoads(kit: CityKit) {
  const layout = roadLayout();
  const neon = { value: 1 };
  const roadMaterial = new THREE.MeshStandardMaterial({ color: '#0c141f', roughness: .8, metalness: .05, envMapIntensity: 1.3 });
  const textures: THREE.Texture[] = [];
  let disposed = false;
  const surfaceReady = Promise.allSettled(['asphalt-color', 'asphalt-normal', 'asphalt-roughness'].map(name => new THREE.TextureLoader().loadAsync(publicAsset('/assets/city/refinement/') + name + '.webp').then(map => {
    if (disposed) { map.dispose(); return map; }
    map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 4; textures.push(map); return map;
  }))).then(results => {
    if (disposed || results.some(result => result.status === 'rejected')) return;
    const maps = results.map(result => (result as PromiseFulfilledResult<THREE.Texture>).value);
    maps[0].colorSpace = THREE.SRGBColorSpace;
    roadMaterial.map = maps[0]; roadMaterial.normalMap = maps[1]; roadMaterial.normalScale.set(.32, .32);
    roadMaterial.roughnessMap = maps[2]; roadMaterial.color.set('#263748'); roadMaterial.needsUpdate = true;
  });
  roadMaterial.onBeforeCompile = shader => {
    shader.uniforms.uNeon = neon;
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 aRoad; attribute vec4 aSpan; varying vec4 vRoad; varying vec4 vSpan; varying vec3 vRoadWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRoad = aRoad; vSpan = aSpan; vRoadWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uNeon; varying vec4 vRoad; varying vec4 vSpan; varying vec3 vRoadWorld; float paintMask; float edgeGlow; float puddle;\n' + NOISE)
      .replace('#include <map_fragment>', `#include <map_fragment>
        vec2 w = vRoadWorld.xz; float grain = rn(w * 3.1) * .5 + rn(w * 17.0) * .5;
        puddle = smoothstep(.56, .78, rn(w * .055) * .7 + rn(w * .21) * .3);
        paintMask = 0.0; edgeGlow = 0.0;
        if (vRoad.x < 1.5) {
          float along = vRoad.x < .5 ? w.x : w.y, across = (vRoad.x < .5 ? w.y : w.x) - vRoad.y, halfW = vRoad.z;
          float fromStart = along - vSpan.x, toEnd = vSpan.y - along, nearest = min(fromStart * (vSpan.z > .5 ? 1.0 : 99.0), toEnd * (vSpan.w > .5 ? 1.0 : 99.0));
          float dash = step(abs(across), .07) * step(fract(along / 7.0), .36) * step(6.8, nearest);
          float edge = step(abs(abs(across) - (halfW - .32)), .055);
          float crossing = step(.6, nearest) * step(nearest, 3.0) * step(fract((across + halfW) / 1.1), .55) * step(abs(across), halfW - .45);
          paintMask = max(max(dash, edge * step(3.4, nearest)), crossing);
          float edgeOffset = (abs(across) - (halfW - .1)) / .05; edgeGlow = exp(-edgeOffset * edgeOffset) * step(3.0, nearest);
        }
        diffuseColor.rgb *= .78 + grain * .36;
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * .55, puddle);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.62, .68, .74), paintMask * (1.0 - puddle * .35));`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(mix(.86, .12, puddle), .55, paintMask);')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(${new THREE.Color(P.cyan).toArray().map(n => n.toFixed(3)).join(',')}) * edgeGlow * .55 * uNeon;`);
  };
  const road = new THREE.Mesh(quads(layout.roads, .02, true), roadMaterial); road.receiveShadow = true; road.name = 'road-network';
  const pavementMaterial = new THREE.MeshStandardMaterial({ color: '#1a2739', roughness: .82, metalness: .04 });
  pavementMaterial.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vPaveWorld;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvPaveWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vPaveWorld; float wet;\n' + NOISE)
      .replace('#include <map_fragment>', '#include <map_fragment>\nvec2 g = abs(fract(vPaveWorld.xz / vec2(1.2, .6)) - .5); float joint = step(.47, max(g.x * 1.0, g.y)); wet = smoothstep(.6, .8, rn(vPaveWorld.xz * .07)); diffuseColor.rgb *= (.92 + rn(floor(vPaveWorld.xz / vec2(1.2, .6))) * .16) * (1.0 - joint * .35) * (1.0 - wet * .3);')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(.85, .3, wet);');
  };
  const pavement = new THREE.Mesh(quads(layout.pavements, .12, false), pavementMaterial); pavement.receiveShadow = true; pavement.name = 'pavements';
  kit.details.add(road, pavement);
  // Kerbs give every pavement edge that faces a road a real step.
  const kerb = kit.material('#3a4a61', 0, .7);
  for (const p of layout.pavements) {
    const width = p.maxX - p.minX, depth = p.maxZ - p.minZ;
    if (width > depth) for (const z of [p.minZ, p.maxZ]) { if (layout.roads.some(r => r.axis < 2 && Math.abs((z === p.minZ ? r.maxZ : r.minZ) - z) < .01 && r.maxX > p.minX && r.minX < p.maxX)) kit.box(width, .14, .14, (p.minX + p.maxX) / 2, .07, z + (z === p.minZ ? .07 : -.07), kerb); }
    else for (const x of [p.minX, p.maxX]) { if (layout.roads.some(r => r.axis < 2 && Math.abs((x === p.minX ? r.maxX : r.minX) - x) < .01 && r.maxZ > p.minZ && r.minZ < p.maxZ)) kit.box(.14, .14, depth, x + (x === p.minX ? .07 : -.07), .07, (p.minZ + p.maxZ) / 2, kerb); }
  }
  return {
    ...layout,
    surfaceReady,
    dispose() { disposed = true; textures.forEach(texture => texture.dispose()); },
    setNeon(power: number) { neon.value = power; },
    /** Solid footprints that reach into a road or a pavement. */
    audit(claims: { label: string; minX: number; minZ: number; maxX: number; maxZ: number }[]) {
      const overlaps = (a: Rect, b: Rect) => a.minX < b.maxX - .01 && a.maxX > b.minX + .01 && a.minZ < b.maxZ - .01 && a.maxZ > b.minZ + .01;
      return claims.filter(c => layout.roads.some(r => overlaps(c, r)) || layout.pavements.some(p => overlaps(c, p))).map(c => c.label);
    },
  };
}
