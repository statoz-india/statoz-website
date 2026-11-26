import * as THREE from 'three';
import { CITY_PALETTE as P } from './city-config';
import { seeded } from './city-kit';

/**
 * GPU particles for the opening and the city. Motion is computed in vertex shaders from a few
 * uniforms, so the CPU only writes a handful of numbers per frame.
 */

/** Dust in the floodlight beams, haze motes over the avenue, and fireflies in the park. */
export function createMotes(mobile: boolean, volumes: { center: THREE.Vector3; radius: number; height: number; color: string; count: number }[]) {
  const random = seeded(902), scale = mobile ? .3 : 1;
  const total = volumes.reduce((sum, volume) => sum + Math.round(volume.count * scale), 0);
  const position = new Float32Array(total * 3), color = new Float32Array(total * 3), seed = new Float32Array(total), group = new Float32Array(total);
  let i = 0;
  volumes.forEach((volume, v) => {
    const tint = new THREE.Color(volume.color);
    for (let n = 0; n < Math.round(volume.count * scale); n++, i++) {
      const angle = random() * Math.PI * 2, radius = Math.sqrt(random()) * volume.radius;
      position.set([volume.center.x + Math.cos(angle) * radius, volume.center.y + random() * volume.height, volume.center.z + Math.sin(angle) * radius], i * 3);
      color.set(tint.toArray(), i * 3); seed[i] = random(); group[i] = v;
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3)); geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1)); geometry.setAttribute('aGroup', new THREE.BufferAttribute(group, 1));
  const uniforms = { uTime: { value: 0 }, uPixel: { value: Math.min(devicePixelRatio, 1.5) }, uPower: { value: new Array(8).fill(1) } };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    vertexShader: `attribute float aSeed; attribute float aGroup; uniform float uTime, uPixel; uniform float uPower[8]; varying vec3 vColor; varying float vAlpha;
      void main(){ vec3 p = position; float t = uTime * (.08 + aSeed*.12) + aSeed*40.0;
        p += vec3(sin(t*1.3)*1.6, sin(t*.7 + aSeed*9.0)*1.1 + mod(uTime*.15*aSeed, 2.0) - 1.0, cos(t*1.1)*1.6);
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        float power = uPower[int(aGroup)];
        gl_PointSize = (.8 + aSeed*1.6) * uPixel * clamp(45.0 / -mv.z, .5, 2.2);
        vAlpha = power * (.18 + .38*abs(sin(t*2.0))) * smoothstep(320.0, 40.0, -mv.z) * smoothstep(6.0, 22.0, -mv.z); vColor = color; }`,
    fragmentShader: `varying vec3 vColor; varying float vAlpha; void main(){ float d = length(gl_PointCoord - .5); float a = (1.0 - smoothstep(.0, .5, d)) * vAlpha; gl_FragColor = vec4(vColor * a, a); }`,
  });
  const points = new THREE.Points(geometry, material); points.frustumCulled = false; points.name = 'ambient-motes';
  return { points, setPower(index: number, value: number) { uniforms.uPower.value[index] = value; }, update(time: number) { uniforms.uTime.value = time; } };
}

/** Short ballistic sparks, pooled. Used where logo pieces meet and when a mission choice is made. */
/** Burst sparks. `size` scales the points for close-up scenes such as the loader logo. */
export function createSparks(capacity = 640, size = 1) {
  const origin = new Float32Array(capacity * 3), velocity = new Float32Array(capacity * 3), birth = new Float32Array(capacity).fill(-99), tint = new Float32Array(capacity * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(origin, 3));
  geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocity, 3));
  geometry.setAttribute('aBirth', new THREE.BufferAttribute(birth, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(tint, 3));
  const uniforms = { uTime: { value: 0 }, uPixel: { value: Math.min(devicePixelRatio, 1.5) * size }, uGravity: { value: 14 } };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    vertexShader: `attribute vec3 aVelocity; attribute float aBirth; uniform float uTime, uPixel, uGravity; varying vec3 vColor; varying float vAlpha;
      void main(){ float age = uTime - aBirth; float life = clamp(age / .9, 0.0, 1.0);
        vec3 p = position + aVelocity * age * (1.0 - life*.45) - vec3(0.0, .5 * uGravity * age * age, 0.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = (age < 0.0 || life >= 1.0) ? 0.0 : (2.6 - life*1.8) * uPixel * clamp(50.0 / -mv.z, .5, 4.0);
        vAlpha = (1.0 - life) * (1.0 - life); vColor = color; }`,
    fragmentShader: `varying vec3 vColor; varying float vAlpha; void main(){ float d = length(gl_PointCoord - .5); float a = (1.0 - smoothstep(.1, .5, d)) * vAlpha; gl_FragColor = vec4(vColor * 1.8 * a, a); }`,
  });
  const points = new THREE.Points(geometry, material); points.frustumCulled = false; points.renderOrder = 14; points.name = 'sparks';
  let cursor = 0;
  const random = seeded(4242), color = new THREE.Color();
  return {
    points,
    emit(at: THREE.Vector3, hue: string, amount: number, speed = 9, time = uniforms.uTime.value) {
      color.set(hue);
      for (let n = 0; n < amount; n++) {
        const i = cursor; cursor = (cursor + 1) % capacity;
        const theta = random() * Math.PI * 2, phi = Math.acos(random() * 2 - 1), v = speed * (.35 + random() * .65);
        origin.set([at.x, at.y, at.z], i * 3);
        velocity.set([Math.sin(phi) * Math.cos(theta) * v, Math.abs(Math.cos(phi)) * v * .9 + speed * .2, Math.sin(phi) * Math.sin(theta) * v], i * 3);
        birth[i] = time; tint.set([color.r, color.g, color.b], i * 3);
      }
      for (const name of ['position', 'aVelocity', 'aBirth', 'color']) (geometry.attributes[name] as THREE.BufferAttribute).needsUpdate = true;
    },
    update(time: number) { uniforms.uTime.value = time; },
  };
}

/** Light streaks rushing past the windshield, scaled by speed. Rendered in camera space. */
export function createSpeedStreaks(mobile: boolean) {
  const count = mobile ? 80 : 220, random = seeded(515);
  const quad = new THREE.InstancedBufferGeometry();
  quad.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, 0, 1, 0, 0, 1, 1, 0, -1, 1, 0], 3));
  quad.setIndex([0, 1, 2, 0, 2, 3]);
  const lane = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2, radius = 2.2 + random() * 9;
    lane.set([Math.cos(angle) * radius, Math.sin(angle) * radius * .55 + 1.2, random()], i * 3);
  }
  quad.setAttribute('aLane', new THREE.InstancedBufferAttribute(lane, 3)); quad.instanceCount = count;
  const uniforms = { uTravel: { value: 0 }, uSpeed: { value: 0 }, uTint: { value: new THREE.Color(P.cyan) } };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute vec3 aLane; uniform float uTravel, uSpeed; varying float vAlpha; varying float vAlong;
      void main(){ float z = -2.0 - fract(aLane.z - uTravel) * 70.0; float len = .4 + uSpeed * 5.5;
        vec3 p = vec3(aLane.xy + vec2(position.x * .025, 0.0), z + position.y * len);
        gl_Position = projectionMatrix * vec4(p, 1.0);
        vAlong = position.y; vAlpha = uSpeed * smoothstep(-72.0, -40.0, z) * smoothstep(-2.0, -10.0, z); }`,
    fragmentShader: `uniform vec3 uTint; varying float vAlpha; varying float vAlong; void main(){ float a = vAlpha * vAlong * .28; gl_FragColor = vec4(mix(vec3(1.0), uTint, .6) * a, a); }`,
  });
  const mesh = new THREE.Mesh(quad, material); mesh.frustumCulled = false; mesh.renderOrder = 20; mesh.name = 'speed-streaks';
  return {
    mesh,
    /** speed: 0..1 normalised; distance in metres drives the streak travel. */
    update(speed: number, distance: number) { uniforms.uSpeed.value = speed; uniforms.uTravel.value = distance / 70; mesh.visible = speed > .01; },
  };
}
