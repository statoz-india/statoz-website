import { publicAsset } from '@statoz/design-system/asset';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

/*
 * Kenney Mini Characters and Car Kit (CC0), packed by scripts/build-kenney-assets.mjs.
 *
 * People: every character shares one rig whose meshes are rigidly weighted, so each character is split
 * into six rigid parts, each pre-transformed into its bone's space. A person's part is then drawn with
 * `person matrix × baked bone pose`, which lets the whole city's crowd share one batched draw call.
 * Vehicles: bodies, wheels and lamp faces are separated so wheels can spin and lamps can glow.
 */
export const BONES = ['leg-left', 'leg-right', 'torso', 'arm-left', 'arm-right', 'head'] as const;
export type ClipName = 'idle' | 'walk' | 'sprint' | 'sit' | 'emote-yes' | 'holding-right' | 'interact-right' | 'attack-melee-right' | 'holding-both-shoot' | 'crouch' | 'drive';
/** One frame: per bone, position (3) and quaternion (4), relative to the character root. */
export type Pose = Float32Array;
export type Clip = { duration: number; frames: Pose[] };
export type PeopleKit = {
  variants: { name: string; parts: THREE.BufferGeometry[] }[];
  clips: Record<ClipName, Clip>; texture: THREE.Texture; height: number;
  /** A fully skinned, independently animated character for the free-roam avatar and the coupe driver. */
  character(name: string): { root: THREE.Object3D; mixer: THREE.AnimationMixer; play(clip: ClipName, fade?: number): void };
};
export type VehicleModel = { id: string; body: THREE.BufferGeometry; lamps: THREE.BufferGeometry; wheels: { geometry: THREE.BufferGeometry; position: THREE.Vector3; rotation: THREE.Quaternion; radius: number }[]; size: THREE.Vector3 };
export type VehicleKit = { models: Map<string, VehicleModel>; texture: THREE.Texture; source: THREE.Object3D };

const loader = () => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const clean = (root: THREE.Object3D) => root.traverse(object => { object.name = object.name.replace(/_\d+$/, ''); });

/** Copies a geometry into plain float, non-indexed position/normal/uv, transformed by `matrix`. */
function flatten(geometry: THREE.BufferGeometry, matrix: THREE.Matrix4, filter?: (a: number, b: number, c: number) => boolean) {
  const position = geometry.attributes.position, normal = geometry.attributes.normal, uv = geometry.attributes.uv, index = geometry.index;
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix), v = new THREE.Vector3(), out = { position: [] as number[], normal: [] as number[], uv: [] as number[] };
  const count = index ? index.count : position.count, at = (i: number) => index ? index.getX(i) : i;
  for (let t = 0; t < count; t += 3) {
    const a = at(t), b = at(t + 1), c = at(t + 2);
    if (filter && !filter(a, b, c)) continue;
    for (const i of [a, b, c]) {
      v.fromBufferAttribute(position, i).applyMatrix4(matrix); out.position.push(v.x, v.y, v.z);
      v.fromBufferAttribute(normal, i).applyMatrix3(normalMatrix).normalize(); out.normal.push(v.x, v.y, v.z);
      out.uv.push(uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0);
    }
  }
  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.Float32BufferAttribute(out.position, 3));
  result.setAttribute('normal', new THREE.Float32BufferAttribute(out.normal, 3));
  result.setAttribute('uv', new THREE.Float32BufferAttribute(out.uv, 2));
  return result;
}

let people: Promise<PeopleKit> | null = null;
export function loadPeople() {
  return people ??= loader().loadAsync(publicAsset('/assets/city/kenney/people.glb')).then(gltf => {
    clean(gltf.scene);
    for (const clip of gltf.animations) for (const track of clip.tracks) track.name = track.name.replace(/_\d+(?=\.)/, '');
    gltf.scene.updateMatrixWorld(true);
    const roots = gltf.scene.children.filter(child => child.name.startsWith('character-'));
    let texture: THREE.Texture | null = null;
    const variants = roots.map(root => {
      const buckets: THREE.BufferGeometry[][] = BONES.map(() => []);
      root.traverse(object => {
        if (!(object instanceof THREE.SkinnedMesh)) return;
        texture ??= (object.material as THREE.MeshStandardMaterial).map;
        const { skeleton, bindMatrix, geometry } = object, skinIndex = geometry.attributes.skinIndex, skinWeight = geometry.attributes.skinWeight;
        // Rigid weights: the strongest joint of a triangle's first vertex owns the triangle.
        const joint = (i: number) => { let best = 0, weight = -1; for (let k = 0; k < 4; k++) { const w = skinWeight.getComponent(i, k); if (w > weight) { weight = w; best = skinIndex.getComponent(i, k); } } return best; };
        skeleton.bones.forEach((bone, j) => {
          const b = (BONES as readonly string[]).indexOf(bone.name); if (b < 0) return;
          const toBone = new THREE.Matrix4().multiplyMatrices(skeleton.boneInverses[j], bindMatrix);
          const part = flatten(geometry, toBone, a => joint(a) === j);
          if (part.attributes.position.count) buckets[b].push(part);
        });
      });
      return { name: root.name.replace('character-', ''), parts: buckets.map(list => list.length > 1 ? mergeFlat(list) : list[0] ?? empty()) };
    });
    // Bake every clip from the first character: all characters share the rig, so the poses fit them all.
    const rig = roots[0], bones = BONES.map(name => rig.getObjectByName(name)!), mixer = new THREE.AnimationMixer(rig);
    const rest = new Map<THREE.Object3D, [THREE.Vector3, THREE.Quaternion, THREE.Vector3]>();
    rig.traverse(object => rest.set(object, [object.position.clone(), object.quaternion.clone(), object.scale.clone()]));
    const clips = {} as Record<ClipName, Clip>, p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    for (const clip of gltf.animations) {
      rest.forEach(([position, quaternion, scale], object) => { object.position.copy(position); object.quaternion.copy(quaternion); object.scale.copy(scale); });
      const action = mixer.clipAction(clip); action.reset().play();
      const count = Math.max(2, Math.round(clip.duration * 30)), frames: Pose[] = [];
      for (let f = 0; f < count; f++) {
        mixer.setTime(f / count * clip.duration); rig.updateMatrixWorld(true);
        const pose = new Float32Array(BONES.length * 7);
        bones.forEach((bone, b) => { bone.matrixWorld.decompose(p, q, s); pose.set([p.x, p.y, p.z, q.x, q.y, q.z, q.w], b * 7); });
        frames.push(pose);
      }
      action.stop(); clips[clip.name as ClipName] = { duration: Math.max(clip.duration, 1 / 30), frames };
    }
    rest.forEach(([position, quaternion, scale], object) => { object.position.copy(position); object.quaternion.copy(quaternion); object.scale.copy(scale); });
    const height = new THREE.Box3().setFromObject(rig).getSize(new THREE.Vector3()).y || 1;
    const kit: PeopleKit = {
      variants, clips, texture: texture!, height,
      character(name) {
        const source = roots.find(root => root.name === 'character-' + name) ?? roots[0], root = cloneSkeleton(source);
        root.position.set(0, 0, 0);
        const own = new THREE.AnimationMixer(root), actions = new Map<string, THREE.AnimationAction>();
        let current: THREE.AnimationAction | null = null;
        return { root, mixer: own, play(clip, fade = .2) {
          const found = gltf.animations.find(item => item.name === clip); if (!found) return;
          const next = actions.get(clip) ?? own.clipAction(found); actions.set(clip, next);
          if (next === current) return;
          next.reset().fadeIn(fade).play(); current?.fadeOut(fade); current = next;
        } };
      },
    };
    return kit;
  });
}
function empty() { const g = new THREE.BufferGeometry(); for (const [name, size] of [['position', 3], ['normal', 3], ['uv', 2]] as const) g.setAttribute(name, new THREE.Float32BufferAttribute([], size)); return g; }
function mergeFlat(list: THREE.BufferGeometry[]) {
  const out = empty();
  for (const name of ['position', 'normal', 'uv'] as const) out.setAttribute(name, new THREE.Float32BufferAttribute(list.flatMap(g => Array.from(g.attributes[name].array as Float32Array)), name === 'uv' ? 2 : 3));
  return out;
}

let vehicles: Promise<VehicleKit> | null = null;
export function loadVehicles() {
  return vehicles ??= loader().loadAsync(publicAsset('/assets/city/kenney/vehicles.glb')).then(async gltf => {
    clean(gltf.scene); gltf.scene.updateMatrixWorld(true);
    let texture: THREE.Texture | null = null;
    gltf.scene.traverse(object => { if (object instanceof THREE.Mesh) texture ??= (object.material as THREE.MeshStandardMaterial).map; });
    const pixels = await readPixels(texture!);
    const models = new Map<string, VehicleModel>();
    for (const root of gltf.scene.children) {
      const inverse = root.matrixWorld.clone().invert(), bodies: THREE.BufferGeometry[] = [], wheels: VehicleModel['wheels'] = [];
      root.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const local = new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld);
        if (object.name.startsWith('wheel')) {
          // Wheels keep their own frame so they can spin about the axle.
          const position = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3(); local.decompose(position, rotation, scale);
          const geometry = flatten(object.geometry, new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z));
          geometry.computeBoundingBox(); const box = geometry.boundingBox!;
          wheels.push({ geometry, position, rotation, radius: Math.max(box.max.y - box.min.y, box.max.z - box.min.z) / 2 });
        } else bodies.push(flatten(object.geometry, local));
      });
      const body = bodies.length > 1 ? mergeFlat(bodies) : bodies[0];
      body.computeBoundingBox(); const size = body.boundingBox!.getSize(new THREE.Vector3());
      models.set(root.name, { id: root.name, body, wheels, size, lamps: lampFaces(body, pixels) });
    }
    return { models, texture: texture!, source: gltf.scene };
  });
}

async function readPixels(texture: THREE.Texture) {
  const image = texture.image as CanvasImageSource & { width: number; height: number };
  const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
  const context = canvas.getContext('2d', { willReadFrequently: true })!; context.drawImage(image, 0, 0);
  return { data: context.getImageData(0, 0, image.width, image.height).data, width: image.width, height: image.height };
}

/**
 * Finds each model's real headlight and tail-light faces: bright, near-white or warm faces on the nose
 * and red faces on the tail, facing outwards, in the middle band of the body. They are copied slightly
 * proud of the body with self-lit colours (the lamps glow; the paint does not).
 */
function lampFaces(body: THREE.BufferGeometry, pixels: { data: Uint8ClampedArray; width: number; height: number }) {
  const position = body.attributes.position, normal = body.attributes.normal, uv = body.attributes.uv, box = body.boundingBox!;
  const length = box.max.z - box.min.z, height = box.max.y - box.min.y;
  const out = { position: [] as number[], normal: [] as number[], uv: [] as number[], color: [] as number[] };
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), m = new THREE.Vector3();
  for (let i = 0; i < position.count; i += 3) {
    n.fromBufferAttribute(normal, i).add(m.fromBufferAttribute(normal, i + 1)).add(m.fromBufferAttribute(normal, i + 2)).normalize();
    a.fromBufferAttribute(position, i); b.fromBufferAttribute(position, i + 1); c.fromBufferAttribute(position, i + 2);
    const cz = (a.z + b.z + c.z) / 3, cy = (a.y + b.y + c.y) / 3, band = (cy - box.min.y) / height;
    if (band < .18 || band > .72) continue;
    const u = (uv.getX(i) + uv.getX(i + 1) + uv.getX(i + 2)) / 3, v = (uv.getY(i) + uv.getY(i + 1) + uv.getY(i + 2)) / 3;
    const px = Math.min(pixels.width - 1, Math.max(0, Math.floor(u * pixels.width))), py = Math.min(pixels.height - 1, Math.max(0, Math.floor(v * pixels.height)));
    const k = (py * pixels.width + px) * 4, r = pixels.data[k] / 255, g = pixels.data[k + 1] / 255, bl = pixels.data[k + 2] / 255;
    const front = cz > box.max.z - length * .14 && n.z > .55, rear = cz < box.min.z + length * .14 && n.z < -.55;
    const white = Math.min(r, g, bl) > .82, warm = r > .92 && g > .72 && bl < .55, red = r > .72 && g < .42 && bl < .45;
    const glow = front && (white || warm) ? [2.4, 2.15, 1.7] : rear && red ? [2.4, .18, .2] : null;
    if (!glow) continue;
    for (let j = 0; j < 3; j++) {
      a.fromBufferAttribute(position, i + j).addScaledVector(n, .004); out.position.push(a.x, a.y, a.z);
      out.normal.push(n.x, n.y, n.z); out.uv.push(0, 0); out.color.push(...glow);
    }
  }
  const lamps = new THREE.BufferGeometry();
  lamps.setAttribute('position', new THREE.Float32BufferAttribute(out.position, 3));
  lamps.setAttribute('normal', new THREE.Float32BufferAttribute(out.normal, 3));
  lamps.setAttribute('color', new THREE.Float32BufferAttribute(out.color, 3));
  return lamps;
}
