import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CITY_PALETTE as P } from './city-config';
import { seeded, type CityKit } from './city-kit';

/** Extra city life shares the world's activity clock, batches and disposal lifecycle. */
export function buildCityRefinement(kit: CityKit, mobile: boolean) {
  const { box, cylinder, material, metal } = kit;
  const random = seeded(16441);
  const steel = material('#35465b', 0, .38), concrete = material('#243246', 0, .86);
  const glass = material('#103046', .12, .2), warm = material('#ffce94', .7);
  const cyan = material(P.cyan, 1.2);
  const rotors: THREE.Group[] = [];
  let reduced = false;

  // Enclosed skywalks tie the northern towers into a neighbourhood.
  for (const [x, z, length, y] of [[-60, -108, 30, 25], [29, -129, 38, 24]]) {
    box(length, .55, 3.2, x, y, z, steel);
    box(length, .3, 3.2, x, y + 2.8, z, metal);
    for (const side of [-1, 1]) {
      box(length, 2.25, .09, x, y + 1.5, z + side * 1.5, glass);
      box(length, .065, .12, x, y + .45, z + side * 1.58, cyan);
      for (let bay = -length / 2 + 1; bay < length / 2; bay += 2.5) {
        box(.08, 2.4, .14, x + bay, y + 1.5, z + side * 1.55, steel);
        box(1.7, 1.35, .05, x + bay + .8, y + 1.6, z + side * 1.56, material('#ffd9a4', .35));
      }
    }
  }

  // Roofs have a purpose: condenser banks, ducts, service ladders and access rails.
  for (const [i, x] of [-83, -72.6, -62, -51.6].entries()) {
    for (let unit = 0; unit < 2; unit++) {
      box(1.65, .85, 1.35, x - 2.2 + unit * 3.4, 4.94, 57.9, steel);
      cylinder(.5, .07, x - 2.2 + unit * 3.4, 5.4, 57.9, metal, 12);
      for (let slat = 0; slat < 5; slat++) box(1.4, .045, .04, x - 2.2 + unit * 3.4, 5.45, 57.5 + slat * .2, concrete);
    }
    box(.24, 1.6, .24, x + 3.4, 5.25, 56.8, steel);
    box(2.5, .14, .5, x + 2.25, 5.95, 56.8, steel);
    // Building service ladders are behind the shopfronts, away from the boulevard.
    for (const side of [-.32, .32]) box(.06, 4.5, .08, x + side, 2.3, 54.86, steel);
    for (let rung = 0; rung < 11; rung++) box(.7, .05, .08, x, .4 + rung * .4, 54.86, steel);
    kit.claim('shop roof services ' + i, x - 4.5, 55, x + 4.5, 61.7);
    const fan = kit.group(x - 2.2, 57.9, 0, 5.47, kit.moving); fan.name = 'rooftop-condenser-fan';
    box(.9, .04, .1, 0, 0, 0, metal, fan); box(.1, .04, .9, 0, 0, 0, metal, fan); mergeAssembly(fan); rotors.push(fan);
  }

  // A transparent arcade canopy and occupied terraces give the high street a human scale.
  for (const x of [-85.7, -80.2, -74.8, -69.6, -64.2, -59]) {
    cylinder(.72, .12, x, .9, 65.7, steel, 16);
    cylinder(.07, .8, x, .46, 65.7, metal, 8);
    for (const dx of [-1.1, 1.1]) {
      box(.55, .13, .6, x + dx, .52, 65.7, concrete);
      box(.55, .55, .09, x + dx, .85, 65.35, metal);
      cylinder(.075, .19, x + dx * .2, 1.06, 65.7, warm, 8);
    }
  }
  for (const x of [-86, -75, -64, -53]) {
    box(.08, 3.5, .08, x, 1.9, 63.1, steel);
    box(9.8, .08, .8, x + 4.6, 3.7, 63.1, material('#235c68', .06, .33));
  }
  // Street furniture stays in reserved concourses, leaving every road and pavement clear.
  for (const [x, z, tint] of [[-76, 15, P.cyan], [-76, 37, P.orange], [59, -39, P.lime], [59, -16, P.gold]] as const) {
    box(1.5, 2.8, .72, x, 1.5, z, metal);
    box(1.25, 1.9, .06, x, 1.65, z + .4, glass);
    box(1.1, .07, .08, x, 2.65, z + .44, material(tint, 1));
    kit.sign('STATOZ', 'CITY GUIDE', x, 2.1, z + .45, 1.05, .65, tint);
    box(.44, .4, .25, x + .25, .75, z + .52, steel);
    cylinder(.35, .95, x + 1.5, .6, z, metal, 10);
    cylinder(.38, .08, x + 1.5, 1.08, z, steel, 10);
  }

  // Elevated transit sits behind the grounds. Only the piers touch the ground.
  const transitZ = -92, railY = 17.5;
  box(330, .65, 2.8, 0, railY, transitZ, concrete);
  for (const side of [-1, 1]) {
    box(330, .16, .12, 0, railY + .5, transitZ + side * .95, steel);
    box(330, .08, .08, 0, railY + .22, transitZ + side * 1.42, cyan);
  }
  for (const x of [-148, -121, -73, -37, 15, 60, 99, 149]) {
    box(1.4, railY, 1.4, x, railY / 2, transitZ, concrete);
    box(3.4, .8, 3, x, railY - .65, transitZ, steel);
    kit.claim('transit pier', x - .7, transitZ - .7, x + .7, transitZ + .7);
  }
  const train = kit.group(0, transitZ, 0, railY + .45, kit.moving); train.name = 'city-night-tram';
  for (let car = 0; car < 3; car++) {
    const cx = (car - 1) * 8.5;
    box(8.1, 1.7, 2.2, cx, 1.1, 0, material('#aabac9', 0, .3), train);
    box(7.7, .22, 2.08, cx, 2.03, 0, metal, train);
    box(7.9, .1, 2.23, cx, .64, 0, cyan, train);
    for (const side of [-1, 1]) {
      for (let window = 0; window < 6; window++) box(.85, .69, .035, cx - 3 + window * 1.18, 1.45, side * 1.12, warm, train);
      box(.1, 1.5, .06, cx + 1.1, 1.1, side * 1.14, steel, train);
    }
    if (car < 2) box(.45, 1.05, 1.6, cx + 4.25, .9, 0, metal, train);
  }
  box(.06, .2, 1.4, 12.6, 1.1, 0, material('#effaff', 1.5), train);
  box(.06, .13, 1.4, -12.6, 1.1, 0, material(P.pink, .8), train);

  // Merge every rigid moving assembly once; a train is a handful of draws, not 70 meshes.
  function mergeAssembly(root: THREE.Group) {
    root.updateMatrixWorld(true);
    const inverse = root.matrixWorld.clone().invert();
    const groups = new Map<THREE.Material, THREE.BufferGeometry[]>();
    root.traverse(child => {
      if (!(child instanceof THREE.Mesh) || Array.isArray(child.material)) return;
      const geometry = child.geometry.clone().applyMatrix4(inverse.clone().multiply(child.matrixWorld));
      if (!groups.has(child.material)) groups.set(child.material, []);
      groups.get(child.material)!.push(geometry);
    });
    root.clear();
    for (const [mat, parts] of groups) {
      const geometry = mergeGeometries(parts); parts.forEach(part => part.dispose());
      if (geometry) root.add(new THREE.Mesh(geometry, mat));
    }
  }
  mergeAssembly(train);

  // Courier drones move above the service lanes; their light is never a full-screen overlay.
  const drones: THREE.Group[] = [];
  for (let i = 0; i < (mobile ? 1 : 3); i++) {
    const drone = kit.group(0, 0, 0, 0, kit.moving); drone.name = 'city-courier-drone';
    box(1.2, .38, .8, 0, 0, 0, steel, drone);
    box(.52, .4, .56, 0, -.36, 0, material(P.gold, .05), drone);
    for (const side of [-1, 1]) {
      box(2.8, .08, .12, 0, .06, side * .54, metal, drone);
      for (const dx of [-1.1, 1.1]) {
        cylinder(.42, .04, dx, .17, side * .54, metal, 12, drone);
        box(.17, .07, .15, dx, -.06, side * .54, cyan, drone);
      }
    }
    mergeAssembly(drone); drones.push(drone);
  }

  // Water falls from a physical fountain head, while low steam drifts from roof vents.
  const fountain = new THREE.Group(); fountain.name = 'park-fountain'; kit.moving.add(fountain);
  const jets = new THREE.BufferGeometry(), drops = new Float32Array((mobile ? 60 : 140) * 3);
  const dropCount = drops.length / 3;
  const seeds = Array.from({ length: dropCount }, () => [random(), random()]);
  jets.setAttribute('position', new THREE.BufferAttribute(drops, 3).setUsage(THREE.DynamicDrawUsage));
  const water = new THREE.Points(jets, new THREE.PointsMaterial({ color: '#b3f5ff', size: .075, transparent: true, opacity: .6, depthWrite: false }));
  water.frustumCulled = false; fountain.add(water);
  const steamMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    uniforms: { uTime: { value: 0 }, uPower: { value: 1 } },
    vertexShader: `attribute float aPhase; uniform float uTime; varying float vAge;
      void main(){ float t=fract(aPhase+uTime*.11); vAge=t; vec3 p=position+vec3(sin(t*4.+aPhase*8.)*.7,t*5.,t*1.5); vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=min(80.,(1.+t*3.)*220./max(1.,-mv.z)); }`,
    fragmentShader: `varying float vAge; uniform float uPower; void main(){ float r=length(gl_PointCoord-.5)*2.; float a=(1.-smoothstep(.05,1.,r))*sin(vAge*3.14159)*.085*uPower; gl_FragColor=vec4(.54,.68,.78,a); }`,
  });
  const smokeGeometry = new THREE.BufferGeometry(), smokePos: number[] = [], phases: number[] = [];
  for (const [x, z, y] of [[-83, 57.9, 5.4], [-62, 57.9, 5.4], [-37, -104, 41]]) for (let i = 0; i < (mobile ? 6 : 12); i++) { smokePos.push(x, y, z); phases.push(random()); }
  smokeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(smokePos, 3)); smokeGeometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
  const steam = new THREE.Points(smokeGeometry, steamMaterial); steam.name = 'roof-vent-steam'; steam.frustumCulled = false; kit.moving.add(steam);

  return {
    update(time: number) {
      train.position.x = (time * 7 + 90) % 380 - 190;
      drones.forEach((drone, i) => {
        const angle = time * .075 + i * 2.1;
        drone.position.set(Math.cos(angle) * (92 + i * 12), 17 + i * 5 + Math.sin(time * 1.4 + i) * .25, Math.sin(angle) * 72 - 10);
        drone.rotation.set(Math.sin(time * .7 + i) * .035, -angle, Math.cos(time * .5 + i) * .035);
      });
      rotors.forEach((rotor, i) => { rotor.rotation.y = time * (1.2 + i * .12); });
      steamMaterial.uniforms.uTime.value = time;
      seeds.forEach(([phase, angle], i) => {
        const t = (time * .6 + phase) % 1, r = t * 3.5;
        drops.set([47.6 + Math.cos(angle * Math.PI * 2) * r, .4 + Math.sin(t * Math.PI) * 3.3, 60.7 + Math.sin(angle * Math.PI * 2) * r], i * 3);
      });
      jets.attributes.position.needsUpdate = true;
    },
    setPower(power: number) { steamMaterial.uniforms.uPower.value = power; fountain.visible = power > .3; drones.forEach((drone, i) => { drone.visible = power > .3 && (!reduced || i === 0); }); train.visible = power > .3; },
    reduce() { reduced = true; steam.visible = false; drones.slice(1).forEach(drone => { drone.visible = false; }); },
  };
}
