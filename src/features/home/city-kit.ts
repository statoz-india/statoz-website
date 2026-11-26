import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CITY_PALETTE as P } from './city-config';
import type { CitySeat } from './city-life';

export type CityKit = ReturnType<typeof createCityKit>;
export type StandOptions = { x: number; z: number; heading: number; width: number; rows: number; accent: string; roof?: boolean; fill?: number; run?: number; rise?: number };

/** Deterministic variation, so the city is the same on every visit. */
export function seeded(seed: number) {
  let value = seed >>> 0;
  return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
}

/**
 * Shared authoring tools for the city. Opaque static geometry goes into `source` and is merged by
 * material; lights, glass and beams are collected and built once as a handful of draw calls.
 */
export function createCityKit(scene: THREE.Scene) {
  const source = new THREE.Group(), batch = new THREE.Group(), details = new THREE.Group(), moving = new THREE.Group();
  source.name = 'city-source-geometry'; moving.name = 'city-moving';
  scene.add(source, batch, details, moving);
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const geometries = new Map<string, THREE.BufferGeometry>();
  const seats: CitySeat[] = [];
  const random = seeded(4410);
  let stands = 0;
  // Lighting zones let the arrival switch the city on in order: 0 is the streets and landmarks,
  // 1–4 are the four grounds. Pools, beams, road reflections and floodlight heads carry a zone.
  let zone = 0;
  const ZONES = { city: 0, football: 1, cricket: 2, basketball: 3, racing: 4 } as const;
  const zonePower = { value: [1, 1, 1, 1, 1] };
  const windowUniforms = { uRipple: { value: 9999 }, uWindows: { value: 1 } };
  const treeTime = { value: 0 };
  const floodLamps: THREE.MeshStandardMaterial[] = [];
  const panelMaterials: THREE.MeshBasicMaterial[] = [];
  /** Footprints of solid things, checked against road and pavement corridors. */
  const claims: { label: string; minX: number; minZ: number; maxX: number; maxZ: number }[] = [];
  function claim(label: string, minX: number, minZ: number, maxX: number, maxZ: number) { claims.push({ label, minX, minZ, maxX, maxZ }); }
  function setZone(name: keyof typeof ZONES) { zone = ZONES[name]; }
  // A floodlight head is a bank of separate lamps in a dark housing, not one glowing slab.
  let lampBank: THREE.Texture | null = null;
  function floodLamp() {
    lampBank ??= canvasTexture(256, 128, (c, w, h) => {
      c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
      for (let row = 0; row < 3; row++) for (let column = 0; column < 6; column++) {
        const x = (column + .5) * w / 6, y = (row + .5) * h / 3, glow = c.createRadialGradient(x, y, 0, x, y, 17);
        glow.addColorStop(0, '#ffffff'); glow.addColorStop(.55, '#f4fbff'); glow.addColorStop(.8, 'rgba(200,225,255,.35)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = glow; c.fillRect(x - 18, y - 18, 36, 36);
      }
    });
    if (!floodLamps[zone]) floodLamps[zone] = new THREE.MeshStandardMaterial({ color: '#1c2531', roughness: .5, metalness: .3, emissive: '#eef8ff', emissiveMap: lampBank, emissiveIntensity: 2.4 });
    return floodLamps[zone];
  }
  /** Emissive light that switches on with the window wave: rooms nearer the entrance light first. */
  function rippled<T extends THREE.MeshStandardMaterial>(material: T) {
    material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, windowUniforms);
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vRippleWorld;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvRippleWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uRipple; uniform float uWindows; varying vec3 vRippleWorld;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance *= uWindows * (1.0 - smoothstep(uRipple - 26.0, uRipple, length(vRippleWorld.xz - vec2(-17.0, 70.0)) + fract(sin(dot(floor(vRippleWorld.xy * .3), vec2(12.9, 78.2))) * 4375.5) * 14.0));');
    };
    return material;
  }
  /** Adds a per-vertex zone attribute and scales a material's colour by that zone's power. */
  function zoned(material: THREE.Material) {
    material.onBeforeCompile = shader => {
      shader.uniforms.uZonePower = zonePower;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute float aZone; uniform float uZonePower[5]; varying float vZonePower;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvZonePower = uZonePower[int(aZone + .5)];');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vZonePower;')
        .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= vZonePower;');
    };
    return material;
  }

  function material(color: string, glow = 0, roughness = .65) {
    const key = color + '/' + glow + '/' + roughness;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness: roughness < .5 ? .45 : .12, emissive: glow ? color : '#000000', emissiveIntensity: glow }));
    return materials.get(key)!;
  }
  const blend = (base: string, tint: string, amount: number) => '#' + new THREE.Color(base).lerp(new THREE.Color(tint), amount).getHexString();
  const metal = material(P.building, 0, .4), dark = material(P.road, 0, .42);

  function group(x: number, z: number, heading = 0, y = .12, parent: THREE.Object3D = source) {
    const item = new THREE.Group(); item.position.set(x, y, z); item.rotation.y = heading; parent.add(item); item.updateMatrixWorld(true); return item;
  }
  function box(w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material = metal, parent: THREE.Object3D = source) {
    const mesh = new THREE.Mesh(unitBox, mat);
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d);
    parent.add(mesh); return mesh;
  }
  function shared(key: string, create: () => THREE.BufferGeometry) {
    if (!geometries.has(key)) geometries.set(key, create());
    return geometries.get(key)!;
  }
  function cylinder(radius: number, height: number, x: number, y: number, z: number, mat: THREE.Material, segments = 32, parent: THREE.Object3D = source, topRadius = radius) {
    const mesh = new THREE.Mesh(shared('cylinder/' + segments + '/' + (topRadius / radius).toFixed(3), () => new THREE.CylinderGeometry(topRadius / radius, 1, 1, segments)), mat);
    mesh.position.set(x, y, z); mesh.scale.set(radius, height, radius); parent.add(mesh); return mesh;
  }
  /** A gable: triangular in section, with its ridge along local x (or z). */
  function prism(w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material, parent: THREE.Object3D = source, ridge: 'x' | 'z' = 'x') {
    const mesh = new THREE.Mesh(shared('prism', () => {
      const a = [-.5, 0, -.5], b = [-.5, 0, .5], c = [-.5, 1, 0], e = [.5, 0, -.5], f = [.5, 0, .5], g = [.5, 1, 0];
      const faces = [[a, b, c], [e, g, f], [b, f, g, c], [e, a, c, g], [a, e, f, b]];
      const position: number[] = [], index: number[] = [], uv: number[] = [];
      for (const face of faces) {
        const start = position.length / 3;
        face.forEach((point, i) => { position.push(...point); uv.push(i % 2, i > 1 ? 1 : 0); });
        index.push(start, start + 1, start + 2);
        if (face.length === 4) index.push(start, start + 2, start + 3);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geometry.setIndex(index); geometry.computeVertexNormals(); return geometry;
    }), mat);
    mesh.position.set(x, y, z); mesh.scale.set(ridge === 'x' ? w : d, h, ridge === 'x' ? d : w); if (ridge === 'z') mesh.rotation.y = Math.PI / 2;
    parent.add(mesh); return mesh;
  }
  function dome(radius: number, x: number, y: number, z: number, mat: THREE.Material, parent: THREE.Object3D = source) {
    const mesh = new THREE.Mesh(shared('dome', () => new THREE.SphereGeometry(1, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2)), mat);
    mesh.position.set(x, y, z); mesh.scale.setScalar(radius); parent.add(mesh); return mesh;
  }
  function line(points: THREE.Vector3[], color: string, closed = false, opacity = 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });
    const object = closed ? new THREE.LineLoop(geometry, lineMaterial) : new THREE.Line(geometry, lineMaterial);
    details.add(object); return object;
  }
  function ring(x: number, z: number, radius: number, color: string, width = .12, y = .15, glow = 1.1) {
    const mesh = new THREE.Mesh(new THREE.RingGeometry(radius - width, radius, 72), material(color, glow));
    mesh.rotation.x = -Math.PI / 2; mesh.position.set(x, y, z); source.add(mesh); return mesh;
  }

  // Signs are drawn at the proportions of their boards, and type shrinks to fit rather than squashing.
  const displayFont = () => getComputedStyle(document.body).getPropertyValue('--font-disp').split(',')[0] || 'sans-serif';
  function fitText(ctx: CanvasRenderingContext2D, text: string, weight: string, size: number, maxWidth: number) {
    do { ctx.font = weight + ' ' + Math.round(size) + 'px ' + displayFont() + ', sans-serif'; size *= .94; } while (ctx.measureText(text).width > maxWidth && size > 8);
  }
  function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void) {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    draw(canvas.getContext('2d')!, width, height);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; return texture;
  }
  function textTexture(text: string, subtitle: string, accent: string, aspect = 4) {
    const height = 256, width = Math.min(2048, Math.max(128, Math.round(height * aspect)));
    return canvasTexture(width, height, ctx => {
      ctx.fillStyle = P.background; ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = accent; ctx.fillRect(0, height - 8, width, 4);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      fitText(ctx, text, '700', height * (subtitle ? .46 : .58), width * .88);
      ctx.fillStyle = '#ffffff'; ctx.fillText(text, width / 2, height * (subtitle ? .4 : .5));
      if (subtitle) { fitText(ctx, subtitle, '500', height * .13, width * .86); ctx.fillStyle = accent; ctx.fillText(subtitle, width / 2, height * .77); }
    });
  }
  function panel(map: THREE.Texture, x: number, y: number, z: number, width: number, height: number, rotation = 0, parent?: THREE.Object3D) {
    const panelMaterial = new THREE.MeshBasicMaterial({ map, toneMapped: false }); panelMaterials.push(panelMaterial);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), panelMaterial);
    mesh.position.set(x, y, z); mesh.rotation.y = rotation;
    if (parent) { parent.add(mesh); parent.updateWorldMatrix(true, true); details.attach(mesh); } else details.add(mesh);
    return mesh;
  }
  /** A lit board with a frame behind it. Positions are local to `parent` when one is given. */
  function sign(text: string, subtitle: string, x: number, y: number, z: number, width: number, height: number, color: string, rotation = 0, parent?: THREE.Object3D) {
    const backing = box(width + .4, height + .4, .36, x - Math.sin(rotation) * .22, y, z - Math.cos(rotation) * .22, material(color, .35), parent || source); backing.rotation.y = rotation;
    return panel(textTexture(text, subtitle, color, width / height), x, y, z, width, height, rotation, parent);
  }

  // Lit windows: one instanced quad each, placed in world space.
  const windowItems: { matrix: THREE.Matrix4; color: THREE.Color }[] = [];
  const helper = new THREE.Object3D();
  function windowQuad(parent: THREE.Object3D | null, x: number, y: number, z: number, w: number, h: number, yaw: number, color: string, gain = 1) {
    helper.position.set(x + Math.sin(yaw) * .05, y, z + Math.cos(yaw) * .05); helper.rotation.set(0, yaw, 0); helper.scale.set(w, h, 1); helper.updateMatrix();
    const matrix = helper.matrix.clone();
    if (parent) { parent.updateWorldMatrix(true, false); matrix.premultiply(parent.matrixWorld); }
    windowItems.push({ matrix, color: new THREE.Color(color).multiplyScalar(gain) });
  }
  /** A grid of windows on one wall, some of them dark. */
  function facade(parent: THREE.Object3D | null, x: number, y: number, z: number, width: number, height: number, yaw: number, columns: number, rows: number, colors: readonly string[], lit = .7, gain = 1) {
    const cellW = width / columns, cellH = height / rows;
    for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
      if (random() > lit) continue;
      const along = (column + .5) * cellW - width / 2;
      windowQuad(parent, x + Math.cos(yaw) * along, y + (row + .5) * cellH - height / 2, z - Math.sin(yaw) * along, cellW * .62, cellH * .58, yaw, colors[Math.floor(random() * colors.length)], gain * (.75 + random() * .5));
    }
  }

  // Light that lands on the ground, and light that hangs in the air.
  const poolItems: { x: number; y: number; z: number; radius: number; color: THREE.Color; zone: number }[] = [];
  function pool(x: number, z: number, radius: number, color: string, strength = 1, y = .14) { poolItems.push({ x, y, z, radius, color: new THREE.Color(color).multiplyScalar(strength), zone }); }
  const beamItems: { from: THREE.Vector3; to: THREE.Vector3; spread: number; color: THREE.Color; zone: number }[] = [];
  function beam(from: THREE.Vector3, to: THREE.Vector3, spread: number, color: string, strength = 1) { beamItems.push({ from: from.clone(), to: to.clone(), spread, color: new THREE.Color(color).multiplyScalar(strength), zone }); }
  /** Where a lamp sheds real light. The world lends a few moving lights to the lamps nearest the view. */
  const lampSpots: { position: THREE.Vector3; color: THREE.Color }[] = [];
  function lampSpot(x: number, y: number, z: number, color: string) { lampSpots.push({ position: new THREE.Vector3(x, y, z), color: new THREE.Color(color) }); }
  // Wet asphalt: each street light leaves a long streak that stretches away from the viewer.
  const reflectionItems: { x: number; z: number; color: THREE.Color; length: number; zone: number }[] = [];
  function reflection(x: number, z: number, color: string, strength = 1, length = 9) { reflectionItems.push({ x, z, color: new THREE.Color(color).multiplyScalar(strength), length, zone }); }

  /** A tiered stand facing local +z. Seats it creates are offered to the crowd. */
  function grandstand(options: StandOptions) {
    const { width, rows, accent, roof = false, fill = .28, run = 1, rise = .56 } = options;
    const stand = group(options.x, options.z, options.heading); stand.name = 'spectator-stand';
    const concrete = material('#263449'), wall = material('#1a2638'), seat = material(blend(P.building, accent, .5), .06), steel = material('#33415a', 0, .4);
    const bays = Math.max(1, Math.round(width / 8)), aisle = .9, bayWidth = (width - aisle * (bays - 1)) / bays, base = .5, depth = rows * run, top = base + (rows - 1) * rise;
    const point = new THREE.Vector3();
    for (let row = 0; row < rows; row++) {
      const level = base + row * rise, z = -(row + .5) * run;
      box(width, level, run, 0, level / 2, z, concrete, stand);
      for (let bay = 0; bay < bays; bay++) {
        const x = -width / 2 + bayWidth / 2 + bay * (bayWidth + aisle);
        box(bayWidth, .14, .62, x, level + .36, z + .05, seat, stand);
        box(bayWidth, .5, .1, x, level + .62, z - .3, seat, stand);
        for (let place = x - bayWidth / 2 + .55; place < x + bayWidth / 2 - .3; place += 1.15) {
          if (random() > fill) continue;
          point.set(place, level + .56, z + .05).applyMatrix4(stand.matrixWorld);
          seats.push({ x: point.x, y: point.y, z: point.z, heading: options.heading, accent });
        }
      }
    }
    box(width + .6, top + 2.4, .45, 0, (top + 2.4) / 2, -depth - .22, wall, stand);
    box(width + .7, .2, .5, 0, top + 2.35, -depth - .2, material(accent, .9), stand);
    box(width + .2, base + .45, .16, 0, (base + .45) / 2, .1, wall, stand);
    for (const side of [-1, 1]) {
      // Stepped flank walls follow the rake of the seating.
      for (let step = 0; step < 3; step++) box(.3, base + top * (step + 1) / 3 + .9, depth / 3, side * (width / 2 + .15), (base + top * (step + 1) / 3 + .9) / 2, -depth * (step + .5) / 3, wall, stand);
    }
    if (roof) {
      const height = top + 3.5, reach = depth * .86, tilt = .1;
      const canopy = box(width + 1.4, .26, reach, 0, height + reach * tilt / 2, -depth + reach / 2 - .3, material('#152133', 0, .5), stand); canopy.rotation.x = -tilt;
      box(width + 1.4, .16, .28, 0, height + reach * tilt + .02, -depth + reach - .32, material(accent, 1.1), stand);
      box(width - 1.5, .1, .5, 0, height + reach * tilt * .78 - .2, -depth + reach * .82, material('#eaf6ff', 1.7), stand);
      for (let i = 0; i <= bays; i++) { const x = -width / 2 + i * width / bays; box(.34, height + .2, .34, x, (height + .2) / 2, -depth - .05, steel, stand); const raker = box(.2, .2, reach * .7, x, height - .5 + reach * .35 * tilt, -depth + reach * .35, steel, stand); raker.rotation.x = -tilt - .16; }
    }
    stands++; return stand;
  }

  /** A slender light mast aimed at a point on the pitch. */
  function floodlight(x: number, z: number, height: number, aimX: number, aimZ: number, color = '#eaf6ff', spread = 9) {
    const mast = group(x, z, Math.atan2(aimX - x, aimZ - z));
    box(.42, height, .42, 0, height / 2, 0, metal, mast); cylinder(.8, .4, 0, .2, 0, metal, 8, mast);
    for (const level of [.35, .65]) box(.9, .12, .12, 0, height * level, 0, metal, mast);
    const head = box(3.6, 2, .45, 0, height + .7, .25, dark, mast); head.rotation.x = .5;
    const lamps = box(3.2, 1.6, .2, 0, height + .62, .5, floodLamp(), mast); lamps.rotation.x = .5;
    beam(new THREE.Vector3(x, height + .6, z), new THREE.Vector3(aimX, .5, aimZ), spread, color, 1);
  }

  /** Low-poly trees share one instanced mesh. */
  const treeItems: { x: number; z: number; scale: number }[] = [];
  function tree(x: number, z: number, scale = 1) { treeItems.push({ x, z, scale: scale * (.85 + random() * .35) }); }

  function finalize() {
    if (windowItems.length) {
      // Rooms switch on in a wave that spreads outward from the entrance.
      const quad = new THREE.PlaneGeometry(1, 1), origin = new THREE.Vector3(-17, 0, 70), at = new THREE.Vector3();
      const distances = new Float32Array(windowItems.map(item => at.setFromMatrixPosition(item.matrix).setY(0).distanceTo(origin) + random() * 14));
      quad.setAttribute('aDist', new THREE.InstancedBufferAttribute(distances, 1));
      const windowMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
      windowMaterial.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, windowUniforms);
        shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute float aDist; uniform float uRipple; varying float vLit;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLit = 1.0 - smoothstep(uRipple - 26.0, uRipple, aDist);');
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uWindows; varying float vLit;')
          .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= vLit * uWindows;');
      };
      const glass = new THREE.InstancedMesh(quad, windowMaterial, windowItems.length);
      windowItems.forEach((item, i) => { glass.setMatrixAt(i, item.matrix); glass.setColorAt(i, item.color); });
      glass.name = 'lit-windows'; glass.frustumCulled = false; details.add(glass);
    }
    if (poolItems.length) {
      const quads = poolItems.map(item => {
        const quad = new THREE.PlaneGeometry(item.radius * 2, item.radius * 2); quad.rotateX(-Math.PI / 2); quad.translate(item.x, item.y, item.z);
        quad.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: 4 }, () => item.color.toArray()).flat(), 3));
        quad.setAttribute('aZone', new THREE.Float32BufferAttribute(new Array(4).fill(item.zone), 1)); return quad;
      });
      const glow = canvasTexture(128, 128, ctx => {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255,255,255,.7)'); gradient.addColorStop(.3, 'rgba(255,255,255,.32)'); gradient.addColorStop(.7, 'rgba(255,255,255,.07)'); gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
      });
      const pools = new THREE.Mesh(mergeGeometries(quads, false)!, zoned(new THREE.MeshBasicMaterial({ map: glow, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })));
      quads.forEach(quad => quad.dispose()); pools.name = 'light-pools'; pools.renderOrder = 2; details.add(pools);
    }
    if (beamItems.length) {
      const down = new THREE.Vector3(0, -1, 0), direction = new THREE.Vector3(), rotation = new THREE.Quaternion();
      const cones = beamItems.map(item => {
        const length = item.from.distanceTo(item.to);
        const cone = new THREE.CylinderGeometry(.7, item.spread, length, 20, 1, true); cone.translate(0, -length / 2, 0);
        direction.subVectors(item.to, item.from).normalize(); rotation.setFromUnitVectors(down, direction);
        cone.applyQuaternion(rotation); cone.translate(item.from.x, item.from.y, item.from.z);
        cone.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: cone.attributes.position.count }, () => item.color.toArray()).flat(), 3));
        cone.setAttribute('aZone', new THREE.Float32BufferAttribute(new Array(cone.attributes.position.count).fill(item.zone), 1)); return cone;
      });
      // The cone fades at its silhouette and toward the ground, so it reads as haze rather than a solid.
      const haze = new THREE.ShaderMaterial({
        vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, uniforms: { strength: { value: .13 }, uZonePower: zonePower },
        vertexShader: 'attribute float aZone; uniform float uZonePower[5]; varying vec3 vNormal; varying vec3 vView; varying float vAlong; varying vec3 vTint; void main() { vTint = color * uZonePower[int(aZone + .5)]; vAlong = uv.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vView = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'uniform float strength; varying vec3 vNormal; varying vec3 vView; varying float vAlong; varying vec3 vTint; void main() { float facing = clamp(abs(dot(normalize(vNormal), normalize(vView))), 0.0001, 1.0); float along = clamp(vAlong, 0.0001, 1.0); float body = pow(facing, 2.4) * (.08 + pow(along, 2.2)) * smoothstep(0.0, .12, along); gl_FragColor = vec4(max(vTint * strength * body, vec3(0.0)), 1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
      });
      const beams = new THREE.Mesh(mergeGeometries(cones, false)!, haze);
      cones.forEach(cone => cone.dispose()); beams.name = 'light-beams'; beams.renderOrder = 3; beams.frustumCulled = false; details.add(beams);
    }
    if (reflectionItems.length) {
      const quad = new THREE.InstancedBufferGeometry();
      quad.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, 0, 1, 0, 0, 1, 1, 0, -1, 1, 0], 3)); quad.setIndex([0, 1, 2, 0, 2, 3]);
      quad.setAttribute('aCenter', new THREE.InstancedBufferAttribute(new Float32Array(reflectionItems.flatMap(item => [item.x, .05, item.z])), 3));
      quad.setAttribute('aTint', new THREE.InstancedBufferAttribute(new Float32Array(reflectionItems.flatMap(item => item.color.toArray())), 3));
      quad.setAttribute('aLength', new THREE.InstancedBufferAttribute(new Float32Array(reflectionItems.map(item => item.length)), 1));
      quad.setAttribute('aZone', new THREE.InstancedBufferAttribute(new Float32Array(reflectionItems.map(item => item.zone)), 1));
      quad.instanceCount = reflectionItems.length;
      const streaks = new THREE.Mesh(quad, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uZonePower: zonePower },
        vertexShader: 'attribute vec3 aCenter; attribute vec3 aTint; attribute float aLength; attribute float aZone; uniform float uZonePower[5]; varying vec2 vQuad; varying vec3 vTint; void main(){ vec2 away = aCenter.xz - cameraPosition.xz; float dist = length(away); vec2 d = dist > .01 ? away / dist : vec2(0.0, -1.0); vec2 s = vec2(-d.y, d.x); float len = aLength * clamp(dist / 30.0, .4, 1.6); vec3 p = aCenter + vec3(s.x * position.x * .55 + d.x * (position.y - .15) * len, 0.0, s.y * position.x * .55 + d.y * (position.y - .15) * len); vQuad = position.xy; vTint = aTint * uZonePower[int(aZone + .5)]; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }',
        fragmentShader: 'varying vec2 vQuad; varying vec3 vTint; void main(){ float across = exp(-vQuad.x * vQuad.x * 5.0); float along = pow(clamp(1.0 - vQuad.y, 0.0, 1.0), 1.8) * smoothstep(0.0, .15, vQuad.y + .02); gl_FragColor = vec4(max(vTint * across * along * .55, vec3(0.0)), 1.0); }' }));
      streaks.name = 'wet-road-reflections'; streaks.frustumCulled = false; streaks.renderOrder = 2; details.add(streaks);
    }
    if (treeItems.length) {
      const paint = (geometry: THREE.BufferGeometry, color: string) => {
        const tint = new THREE.Color(color), positions = geometry.attributes.position, colors: number[] = [];
        for (let i = 0; i < positions.count; i++) colors.push(...tint.clone().multiplyScalar(.86 + .14 * Math.sin(positions.getY(i) * 1.7 + positions.getX(i) * 2)).toArray());
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const result = geometry.index ? geometry.toNonIndexed() : geometry; if (result !== geometry) geometry.dispose(); return result;
      };
      for (const broadleaf of [false, true]) {
        const trunk = paint(new THREE.CylinderGeometry(.12, .23, broadleaf ? 2.5 : 1.4, 7).translate(0, broadleaf ? 1.25 : .7, 0), '#5e4838');
        const foliage = broadleaf ? [
          paint(new THREE.IcosahedronGeometry(1, 1).scale(1.35, 1.3, 1.2).translate(-.45, 3.1, .1), '#276454'),
          paint(new THREE.IcosahedronGeometry(1, 1).scale(1.1, 1.5, 1.05).translate(.55, 3.6, -.15), '#337b5c'),
          paint(new THREE.IcosahedronGeometry(1, 1).scale(.85, 1, .9).translate(.12, 4.25, .05), '#398366'),
        ] : [paint(new THREE.ConeGeometry(1.25, 2.3, 9).translate(0, 2.2, 0), '#1c5a4c'), paint(new THREE.ConeGeometry(.9, 1.9, 9).translate(0, 3.5, 0), '#24705a')];
        const parts = [trunk, ...foliage], shape = mergeGeometries(parts, false)!; parts.forEach(part => part.dispose());
        const items = treeItems.filter((_, i) => (i % 4 !== 0) === broadleaf);
        const leaves = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .88 });
        leaves.onBeforeCompile = shader => {
          shader.uniforms.uCityWindTime = treeTime;
          shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nuniform float uCityWindTime;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat phase=instanceMatrix[3].x*.17+instanceMatrix[3].z*.12; transformed.x+=sin(uCityWindTime*.85+phase)*smoothstep(1.3,4.3,position.y)*.075; transformed.z+=cos(uCityWindTime*.7+phase)*smoothstep(1.3,4.3,position.y)*.045;\n#endif');
        };
        const trees = new THREE.InstancedMesh(shape, leaves, items.length);
        trees.name = broadleaf ? 'city-broadleaf-trees' : 'city-conifers';
        items.forEach((item, i) => { helper.position.set(item.x, .1, item.z); helper.rotation.set(0, item.x * 1.7 + item.z, 0); helper.scale.setScalar(item.scale); helper.updateMatrix(); trees.setMatrixAt(i, helper.matrix); });
        trees.castShadow = true; trees.receiveShadow = true; trees.frustumCulled = false; details.add(trees);
      }
    }
  }

  /**
   * Static meshes are merged by material, which keeps draw calls low however much is authored.
   * Each call merges only what was added since the last one, so the building kits that arrive
   * later do not cause the whole city to be merged again. Work pauses every few milliseconds so
   * the page stays responsive while it runs.
   */
  async function rebatch() {
    source.updateMatrixWorld(true);
    const groups = new Map<string, { material: THREE.Material; geometries: THREE.BufferGeometry[] }>();
    const pending: THREE.Mesh[] = [];
    source.traverse(object => {
      if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || Array.isArray(object.material) || object.userData.batched) return;
      object.userData.batched = true; pending.push(object);
    });
    let slice = performance.now();
    const pause = async () => { if (performance.now() - slice > 24) { await new Promise<void>(resolve => setTimeout(resolve, 0)); slice = performance.now(); } };
    for (const object of pending) {
      await pause();
      const geometry = object.geometry.clone();
      // glTF quantization uses normalized integer attributes. Expand before baking world
      // transforms, and use a common array type when merging with authored geometry.
      for (const [name, attribute] of Object.entries(geometry.attributes as Record<string, THREE.BufferAttribute>)) {
        if (attribute.array instanceof Float32Array && !attribute.normalized) continue;
        const values = new Float32Array(attribute.count * attribute.itemSize);
        for (let i = 0; i < attribute.count; i++) for (let c = 0; c < attribute.itemSize; c++) values[i * attribute.itemSize + c] = attribute.getComponent(i, c);
        geometry.setAttribute(name, new THREE.BufferAttribute(values, attribute.itemSize));
      }
      geometry.applyMatrix4(object.matrixWorld);
      const key = (object.material as THREE.Material).uuid + '/' + Object.entries(geometry.attributes as Record<string, THREE.BufferAttribute>).map(([name, attribute]) => name + attribute.itemSize).sort().join(',') + '/' + !!geometry.index;
      if (!groups.has(key)) groups.set(key, { material: object.material as THREE.Material, geometries: [] });
      groups.get(key)!.geometries.push(geometry);
    }
    for (const item of groups.values()) {
      await pause();
      const geometry = mergeGeometries(item.geometries, false);
      item.geometries.forEach(part => part.dispose());
      if (geometry) { const mesh = new THREE.Mesh(geometry, item.material); mesh.castShadow = true; mesh.receiveShadow = true; batch.add(mesh); }
    }
    source.visible = false;
  }

  return {
    source, batch, details, moving, seats, random, metal, dark, claims, lampSpots, lampSpot,
    material, blend, group, box, cylinder, prism, dome, line, ring, canvasTexture, textTexture, fitText, panel, sign,
    windowQuad, facade, pool, beam, reflection, grandstand, floodlight, tree, finalize, rebatch, claim, setZone, zoned, rippled,
    get stands() { return stands; },
    setTime(time: number) { treeTime.value = time; },
    /**
     * Lighting for the arrival. zones: power of streets and each ground (0..1); windows: the radius of the
     * lit-room wave in metres; neon: emissive strips and lamps; signs: lit boards.
     */
    setPower(power: { zones?: number[]; ripple?: number; windows?: number; neon?: number; signs?: number }) {
      if (power.zones) power.zones.forEach((value, i) => { zonePower.value[i] = value; floodLamps[i]?.emissiveIntensity !== undefined && (floodLamps[i].emissiveIntensity = 2.4 * value); });
      if (power.ripple !== undefined) windowUniforms.uRipple.value = power.ripple;
      if (power.windows !== undefined) windowUniforms.uWindows.value = power.windows;
      if (power.neon !== undefined) materials.forEach(item => { if (item.userData.glow === undefined) item.userData.glow = item.emissiveIntensity; if (item.userData.glow) item.emissiveIntensity = item.userData.glow * power.neon!; });
      if (power.signs !== undefined) panelMaterials.forEach(item => item.color.setScalar(power.signs!));
    },
    disposeShared() { unitBox.dispose(); geometries.forEach(geometry => geometry.dispose()); },
  };
}
