import * as THREE from 'three';
import { seeded } from './city-kit';
import { clamp01, smooth, smoother } from './city-journey-motion';

/**
 * The opening after the logo: the visitor starts in space above the city. Particles gather out of the
 * stars into the welcome headline, which turns solid (the page's own h1, glowing), holds, and zaps away
 * in a glitch. The stars stretch into a short warp, the camera dives from orbit onto the plaza facing the
 * gate, and carries on down the avenue onto the waiting car, stopping at "Enter StatOz City".
 *
 * All times are seconds on the reveal clock, which starts when loading reaches 100.
 */
export const INTRO = {
  /** The logo glides into the header. */
  lift: 1.5,
  /** Particles fly in and lock into the headline, roughly left to right. */
  formStart: .55, formEnd: 2.75,
  /** A sweep of light crosses the forming text. */
  sweepStart: 2.0, sweepEnd: 2.8,
  /** The particles fade as the solid headline glows into their place. */
  solidStart: 2.6, solidEnd: 3.0,
  /** The solid headline glitches and collapses; its particles flare out as sparks. */
  zapStart: 4.0, zapEnd: 4.5,
  /** The warp: stars stretch and the planet rushes up. */
  warpStart: 4.2, warpEnd: 5.3,
  /** The space backdrop opens on the city, seen from high above. */
  openStart: 5.05, openEnd: 5.7,
  /** The camera's dive from orbit to the plaza. */
  diveStart: 5.0, diveEnd: 7.4,
  /** The page scrolls itself from the welcome view to the "Enter StatOz City" stop: down the avenue to the car. */
  driveStart: 6.8, driveEnd: 9.6,
  /** The header nav and cues take over. */
  landed: 7.2,
  settled: 9.8,
} as const;

export type IntroTextPhase = 'forming' | 'solid' | 'zap' | 'gone';
/** Which state the HTML headline is in at reveal time t; the page styles it from this. */
export function introTextPhase(t: number): IntroTextPhase {
  return t < INTRO.solidStart ? 'forming' : t < INTRO.zapStart ? 'solid' : t < INTRO.zapEnd ? 'zap' : 'gone';
}

const NOISE = `
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p){ float n = hash(p); return vec2(n, hash(p + n + 17.17)); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = .5; for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
`;

/**
 * Deep space, cyberpunk-tinted: three parallax star layers that twinkle, cyan and magenta nebulae, and
 * the night side of a planet below whose top glows with the city's grid. uWarp streaks the stars toward
 * the centre, uDive brings the planet up to fill the frame, uFlash is the brief light as the warp ends.
 */
export function createSpaceBackdrop() {
  const uniforms = { uFade: { value: 1 }, uPulse: { value: 0 }, uTime: { value: 0 }, uAspect: { value: 1 }, uWarp: { value: 0 }, uDive: { value: 0 }, uFlash: { value: 0 } };
  const material = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, uniforms,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: NOISE + `
      uniform float uFade, uPulse, uTime, uAspect, uWarp, uDive, uFlash; varying vec2 vUv;
      // Star radius is in screen heights, so stars stay pin-sharp whatever the cell size.
      float starLayer(vec2 p, float scale, float density, float seed, float radius){
        vec2 g = p * scale + seed, id = floor(g), f = fract(g) - .5;
        float h = hash(id);
        if (h > density) return 0.0;
        vec2 o = (hash2(id + seed) - .5) * .7;
        float d = length(f - o) / scale / radius;
        float tw = .55 + .45 * sin(uTime * (1.2 + h * 4.0) + h * 60.0);
        return exp(-d * d) * tw * (.4 + .6 * hash(id + 3.1));
      }
      float stars(vec2 p){
        return starLayer(p, 22.0, .2, 1.0, .0024) * 1.1 + starLayer(p, 48.0, .16, 7.0, .0017) * .8 + starLayer(p, 100.0, .12, 13.0, .0012) * .6;
      }
      void main(){
        vec2 p = (vUv - .5) * vec2(uAspect, 1.0);
        float r = length(p);
        // Stars, pushed outward and smeared toward the centre during the warp.
        vec3 col = vec3(0.0);
        float push = 1.0 + uWarp * uWarp * 1.6;
        float s = stars(p / push);
        if (uWarp > .002) {
          for (int i = 1; i < 9; i++) s += stars(p / (push * (1.0 + float(i) * .045 * uWarp))) * (1.0 - float(i) / 9.0) * uWarp;
        }
        col += vec3(.82, .93, 1.0) * s * (1.0 - uDive * .5);
        // Nebulae drift slowly; cyan to the upper left, magenta to the right.
        float n1 = fbm(p * 1.7 + vec2(uTime * .012, 0.0) + 3.0), n2 = fbm(p * 2.3 - vec2(0.0, uTime * .01) + 9.0);
        float m1 = smoothstep(.48, .9, n1) * exp(-dot(p - vec2(-.45, .22), p - vec2(-.45, .22)) * 2.2);
        float m2 = smoothstep(.5, .92, n2) * exp(-dot(p - vec2(.55, .05), p - vec2(.55, .05)) * 2.0);
        col += vec3(.05, .42, .62) * m1 * .55 + vec3(.55, .08, .48) * m2 * .42;
        // A deep blue base with a soft lift behind the logo.
        col += mix(vec3(.004, .008, .02), vec3(.016, .04, .075), exp(-dot(p - vec2(0.0, .06), p - vec2(0.0, .06)) * 4.0));
        // The planet: its limb climbs from the bottom edge and fills the frame as we dive.
        float rise = uDive * uDive;
        float radius = mix(2.4, 7.0, rise), horizon = mix(-.56, .95, rise);
        vec2 c = vec2(0.0, horizon - radius);
        float d = length(p - c) - radius;
        vec2 q = (p - c) / radius;
        float inside = 1.0 - smoothstep(-.002, .002, d);
        // Night side: a fine street grid with pin-point lights, densest where the city sits.
        float city = exp(-dot(q - vec2(0.0, 1.0), q - vec2(0.0, 1.0)) * mix(60.0, 10.0, rise));
        vec2 gridUv = q * mix(70.0, 48.0, rise);
        vec2 line = abs(fract(gridUv) - .5);
        float grid = (1.0 - smoothstep(0.0, .03, .5 - max(line.x, line.y))) * .4;
        vec2 lightUv = gridUv * 3.0, cell = floor(lightUv), f = fract(lightUv) - .5 - (hash2(cell) - .5) * .5;
        float lights = step(.78, hash(cell)) * exp(-dot(f, f) * 90.0) * (.6 + .4 * sin(uTime * 2.0 + hash(cell + 1.0) * 30.0));
        vec3 surface = vec3(.006, .012, .024) + (vec3(.1, .55, .8) * grid + mix(vec3(1.0, .66, .34), vec3(.45, .9, 1.0), hash(cell + 5.0)) * lights * 1.3) * city;
        col = mix(col, surface, inside);
        float rim = exp(-abs(d) * mix(55.0, 18.0, rise));
        float air = exp(-max(d, 0.0) * mix(9.0, 4.0, rise)) * (1.0 - inside);
        col += vec3(.24, .78, 1.0) * rim * .9 + vec3(.06, .32, .55) * air * .45 + vec3(.6, .15, .55) * air * .12 * (1.0 - rise);
        // The logo's pulse, the end-of-warp light and a gentle vignette.
        col += vec3(.02, .09, .14) * uPulse * exp(-dot(p, p) * 16.0);
        col += vec3(.55, .88, 1.0) * uFlash * (1.0 - r * .6);
        col *= 1.0 - smoothstep(.45, 1.1, r) * .5;
        gl_FragColor = vec4(max(col, vec3(0.0)), uFade);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  return {
    mesh,
    /** Drives the backdrop for reveal time t (seconds). */
    reveal(t: number) {
      uniforms.uWarp.value = smooth(INTRO.warpStart, INTRO.warpEnd - .3, t) * (1 - smooth(INTRO.openStart + .1, INTRO.openEnd, t));
      uniforms.uDive.value = smoother(INTRO.warpStart, INTRO.openEnd, t);
      uniforms.uFlash.value = Math.exp(-(((t - (INTRO.openStart + .12)) / .2) ** 2)) * .55;
      uniforms.uFade.value = 1 - smooth(INTRO.openStart, INTRO.openEnd, t);
      uniforms.uPulse.value = 0;
    },
    frame(time: number, width: number, height: number) { uniforms.uTime.value = time % 1000; uniforms.uAspect.value = width / Math.max(height, 1); },
    get pulse() { return uniforms.uPulse.value; },
    set pulse(value: number) { uniforms.uPulse.value = value; },
  };
}

/**
 * The welcome headline as sparkling light. Each particle starts somewhere in the starfield at a random
 * depth, curves in and locks onto a pixel of the heading as the browser lays it out, so the text forms
 * exactly under the page's h1. The particles then fade as that h1 glows in as solid text; when it zaps
 * away, about half of them flare back as sparks.
 */
export function createIntroText(mobile: boolean) {
  const count = mobile ? 7000 : 18000;
  const geometry = new THREE.BufferGeometry();
  const target = new Float32Array(count * 2), start = new Float32Array(count * 3), seed = new Float32Array(count * 2), tint = new Float32Array(count);
  // Three needs a position attribute to size the draw; the shader places each point itself.
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(target, 2));
  geometry.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 2));
  geometry.setAttribute('aTint', new THREE.BufferAttribute(tint, 1));
  geometry.setDrawRange(0, 0);
  const uniforms = { uForm: { value: 0 }, uSolid: { value: 0 }, uBurst: { value: 0 }, uSweep: { value: -2 }, uTime: { value: 0 }, uPixel: { value: 1 }, uHalf: { value: new THREE.Vector2(1, 1) } };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec2 aTarget; attribute vec3 aStart; attribute vec2 aSeed; attribute float aTint;
      uniform float uForm, uSolid, uBurst, uSweep, uTime, uPixel; uniform vec2 uHalf;
      varying float vBright; varying float vFlare; varying float vTint; varying float vHeat;
      void main(){
        float s = clamp((uForm - aSeed.y * .5) / .5, 0.0, 1.0);
        float e = 1.0 - pow(1.0 - s, 3.0);
        vec2 travel = aTarget - aStart.xy, side = vec2(-travel.y, travel.x);
        vec2 p = mix(aStart.xy, aTarget, e) + side * sin(3.14159 * e) * (aSeed.x - .5) * .55;
        p += vec2(sin(uTime * 2.1 + aSeed.x * 50.0), cos(uTime * 1.7 + aSeed.y * 40.0)) * .7 * e;
        // The zap: about half the particles flare back as sparks, kicked outward with an electric jitter.
        float spark = step(.55, aSeed.x), b = uBurst;
        vec2 away = normalize(aTarget + (aSeed - .5) * 160.0 + vec2(.001));
        vec2 jitter = vec2(sin(uTime * 60.0 + aSeed.y * 90.0), cos(uTime * 53.0 + aSeed.x * 70.0)) * 6.0 * b;
        p += (away * (1.0 - pow(1.0 - b, 3.0)) * (90.0 + aSeed.y * 520.0) + jitter) * spark;
        float depth = mix(aStart.z, 1.0, e);
        float flare = step(.982, aSeed.x);
        float size = (1.4 + aSeed.x * 1.5) * depth * (1.0 + b * 1.5 * spark) * (1.0 + flare * 4.5);
        float twinkle = pow(.5 + .5 * sin(uTime * (2.4 + aSeed.x * 6.0) + aSeed.y * 80.0), 14.0);
        float sweep = exp(-pow((aTarget.x / uHalf.x - uSweep) * 2.6, 2.0));
        // Fades as the solid text takes over; the sparks then flash and die away.
        float shown = max(1.0 - uSolid, spark * smoothstep(0.0, .04, b) * 1.6) * (1.0 - smoothstep(.25, 1.0, b));
        vBright = (.62 + .9 * twinkle + 1.4 * sweep * e) * smoothstep(0.0, .08, s) * shown * mix(.35, 1.0, depth);
        vFlare = flare; vTint = aTint; vHeat = 1.0 - e;
        gl_PointSize = size * uPixel;
        gl_Position = vec4(p / uHalf, 0.0, 1.0);
      }`,
    fragmentShader: `
      varying float vBright; varying float vFlare; varying float vTint; varying float vHeat;
      void main(){
        vec2 q = gl_PointCoord * 2.0 - 1.0;
        float d = length(q);
        float core = exp(-d * d * 5.0);
        float cross = vFlare * (exp(-abs(q.x) * 16.0) * exp(-abs(q.y) * 1.8) + exp(-abs(q.y) * 16.0) * exp(-abs(q.x) * 1.8));
        float a = clamp((core + cross) * vBright, 0.0, 2.0);
        vec3 tint = mix(vec3(.93, .97, 1.0), vec3(.36, .87, 1.0), vTint);
        vec3 color = mix(tint, vec3(1.0), clamp(vHeat * .7 + .15, 0.0, 1.0));
        gl_FragColor = vec4(color * a, a);
      }`,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false; points.renderOrder = 20; points.name = 'intro-text'; points.visible = false;
  return {
    points,
    /** Lays the particles onto the heading's glyphs, as drawn in the page. */
    sample(heading: HTMLElement | null, host: HTMLElement, pixelRatio: number) {
      const width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1), origin = host.getBoundingClientRect();
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.textBaseline = 'middle';
      const lines = heading ? Array.from(heading.children) as HTMLElement[] : [];
      const box = heading?.getBoundingClientRect();
      const align = heading ? getComputedStyle(heading).textAlign : 'center';
      if (heading && box && box.width > 0 && lines.length) {
        lines.forEach((line, index) => {
          const style = getComputedStyle(line);
          // offsetTop ignores the line's own entrance transform, so the text lands where it rests.
          const top = line.offsetParent === heading ? line.offsetTop : line.offsetTop - heading.offsetTop;
          ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
          ctx.fillStyle = index === 0 ? '#ff0000' : '#00ff00';
          const centred = align === 'center' || align === '-webkit-center';
          ctx.textAlign = centred ? 'center' : 'left';
          const x = centred ? box.left - origin.left + box.width / 2 : box.left - origin.left + (line.offsetParent === heading ? line.offsetLeft : line.offsetLeft - heading.offsetLeft);
          ctx.fillText(line.textContent || '', x, box.top - origin.top + top + line.offsetHeight / 2);
        });
      } else {
        const size = Math.min(width * .08, 110);
        ctx.font = `700 ${size}px sans-serif`; ctx.textAlign = 'center';
        ctx.fillStyle = '#ff0000'; ctx.fillText('Welcome Home,', width / 2, height * .42);
        ctx.fillStyle = '#00ff00'; ctx.fillText('StatOz Wizard.', width / 2, height * .42 + size * 1.1);
      }
      const data = ctx.getImageData(0, 0, width, height).data, candidates: number[] = [];
      // A phone's smaller headline is sampled at every pixel, so its strokes stay as dense as on desktop.
      const step = mobile ? 1 : 2;
      for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) { const i = (y * width + x) * 4; if (data[i + 3] > 120) candidates.push(x, y, data[i + 1] > data[i] ? 1 : 0); }
      const available = candidates.length / 3, total = Math.min(count, available), random = seeded(77);
      for (let i = 0; i < total; i++) {
        const index = Math.floor(i / total * available) * 3, x = candidates[index] + (random() - .5) * 1.6, y = candidates[index + 1] + (random() - .5) * 1.6;
        target[i * 2] = x - width / 2; target[i * 2 + 1] = height / 2 - y;
        // Out of the starfield, spread wider than the screen and at a random depth.
        const angle = random() * Math.PI * 2, reach = Math.sqrt(random()) * Math.max(width, height) * .85;
        start[i * 3] = Math.cos(angle) * reach; start[i * 3 + 1] = Math.sin(angle) * reach * .8; start[i * 3 + 2] = .15 + random() * .6;
        // The text assembles roughly left to right, with some scatter.
        seed[i * 2] = random(); seed[i * 2 + 1] = clamp01(x / width * .75 + random() * .25);
        tint[i] = candidates[index + 2];
      }
      (['aTarget', 'aStart', 'aSeed', 'aTint'] as const).forEach(name => { (geometry.attributes[name] as THREE.BufferAttribute).needsUpdate = true; });
      geometry.setDrawRange(0, total);
      uniforms.uHalf.value.set(width / 2, height / 2); uniforms.uPixel.value = pixelRatio;
    },
    /** Drives the text for reveal time t (seconds). */
    reveal(t: number, time: number) {
      uniforms.uForm.value = clamp01((t - INTRO.formStart) / (INTRO.formEnd - INTRO.formStart));
      uniforms.uSweep.value = THREE.MathUtils.lerp(-1.6, 1.6, smooth(INTRO.sweepStart, INTRO.sweepEnd, t));
      uniforms.uSolid.value = smooth(INTRO.solidStart, INTRO.solidEnd, t);
      uniforms.uBurst.value = clamp01((t - INTRO.zapStart) / .9);
      uniforms.uTime.value = time % 1000;
      points.visible = t > INTRO.formStart && t < INTRO.zapStart + .9;
    },
    hide() { points.visible = false; },
  };
}

/**
 * The dive from orbit to the street. Position eases in and out, so the city is held from high above
 * as it first appears, then the camera sweeps down; the gaze lifts to the hero view only near the end.
 */
const DIVE_FROM = new THREE.Vector3(-30, 240, 118), DIVE_LOOK = new THREE.Vector3(-6, 0, -12);
const look = new THREE.Vector3();
export function applyDive(camera: THREE.PerspectiveCamera, heroTarget: THREE.Vector3, t: number) {
  const d = clamp01((t - INTRO.diveStart) / (INTRO.diveEnd - INTRO.diveStart));
  if (d >= 1) return false;
  const e = d * d * (3 - 2 * d), lift = smooth(.45, 1, d);
  camera.position.lerpVectors(DIVE_FROM, camera.position, e);
  look.lerpVectors(DIVE_LOOK, heroTarget, lift);
  camera.lookAt(look);
  camera.rotateZ(Math.sin(Math.PI * d) * .07 * (1 - d));
  return true;
}
