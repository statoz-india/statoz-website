import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { gsap } from 'gsap';
import { HAZE } from './city-district';
import { buildCityWorld } from './city-world';
import { CITY_LOCATIONS, CITY_OVERVIEW, CITY_PALETTE, locationById, type CityLocationId, type CityMode } from './city-config';
import { JOURNEY_CHAPTERS } from './city-journey-config';
import { observeJourneyProgress, journeyProgress, smooth } from './city-journey-motion';

export type CityRuntimeState = { mode: CityMode; focused: CityLocationId | null; journey: boolean; panelOpen: boolean; activityPaused: boolean };
type Callbacks = { onSelect: (id: CityLocationId) => void; onReady: () => void; onFailure: () => void; onTourStop: (id: CityLocationId | null) => void; onLeave: () => void };
export type CityRuntime = Awaited<ReturnType<typeof createCityRuntime>>;

export async function createCityRuntime(host: HTMLDivElement, callbacks: Callbacks, webglContext?: WebGL2RenderingContext) {
  const canvas = host.querySelector('canvas')!;
  const labels = Array.from(host.querySelectorAll<HTMLButtonElement>('[data-city-label]'));
  const leaders = new Map(Array.from(host.querySelectorAll<SVGGElement>('[data-city-link]')).map(element => [element.dataset.cityLink, { group: element, path: element.querySelector('path')!, dot: element.querySelector('circle')! }]));
  const renderer = new THREE.WebGLRenderer({ canvas, context: webglContext, antialias: true, powerPreference: 'high-performance', alpha: false });
  const scene = new THREE.Scene(); scene.background = new THREE.Color(HAZE); scene.fog = new THREE.FogExp2(HAZE, .0024);
  const camera = new THREE.PerspectiveCamera(45, 1, .2, 1100);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = .065; controls.enabled = false;
  controls.minDistance = 30; controls.maxDistance = 430; controls.minPolarAngle = .25; controls.maxPolarAngle = 1.18;
  controls.panSpeed = .65; controls.rotateSpeed = .55; controls.zoomSpeed = .7; controls.screenSpacePanning = false;
  // Vertical gestures always belong to the document, including in Explore.
  controls.enableZoom = false;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.PAN;
  canvas.style.touchAction = 'pan-y pinch-zoom';
  controls.listenToKeyEvents(canvas);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.info.autoReset = false;
  const mobile = window.innerWidth <= 700;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ratio = Math.min(window.devicePixelRatio, mobile ? 1.2 : 1.5);
  renderer.setPixelRatio(ratio);
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // It is night: a dim sky and cool moonlight give form, and the grounds bring their own light.
  const fill = new THREE.HemisphereLight('#7c98de', '#0a1322', .65); scene.add(fill);
  const key = new THREE.DirectionalLight('#aebfff', 1.05); key.position.set(60, 95, 38); key.castShadow = !mobile;
  key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -118; key.shadow.camera.right = 118; key.shadow.camera.top = 112; key.shadow.camera.bottom = -104; key.shadow.camera.far = 240; key.shadow.normalBias = .2; key.shadow.radius = 3; scene.add(key);
  const blue = new THREE.DirectionalLight(CITY_PALETTE.cyan, .55); blue.position.set(-70, 35, -65); scene.add(blue);
  const pink = new THREE.PointLight(CITY_PALETTE.pink, 150, 70, 1.6); pink.position.set(-5, 17, 16); scene.add(pink);
  await document.fonts.ready;
  const world = await buildCityWorld(scene, renderer, mobile);

  // Desktop renders through an anti-aliased HDR target with bloom and a gentle grade: lamps flare,
  // the frame darkens toward its edges, and shadows lean cool. Mobile uses emissive materials directly.
  let composer: EffectComposer | null = null;
  if (!mobile) {
    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: Math.min(4, renderer.capabilities.maxSamples) }));
    composer.setPixelRatio(ratio);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), .28, .45, 1.2));
    composer.addPass(new ShaderPass({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main() { vec4 c = texture2D(tDiffuse, vUv); vec2 p = vUv - .5; float edge = smoothstep(.36, .9, length(p * vec2(1.0, .84))); c.rgb *= 1.0 - edge * .4; float luma = dot(c.rgb, vec3(.2126, .7152, .0722)); c.rgb = mix(c.rgb, c.rgb * vec3(.93, 1.0, 1.12), (1.0 - smoothstep(0.0, .45, luma)) * .55); gl_FragColor = max(c, vec4(0.0)); }',
    }));
    composer.addPass(new OutputPass());
  }
  function disposeComposer() {
    if (!composer) return;
    for (const pass of composer.passes) pass.dispose();
    composer.dispose(); composer = null;
  }

  let state: CityRuntimeState = { mode: 'tour', focused: null, journey: true, panelOpen: false, activityPaused: false };
  let width = 1, height = 1, disposed = false, ready = false, focusedTween = false, warmed = false, compiling = false, gpuReleased = false;
  let lastStop: CityLocationId | null = null;
  let lastFrame = performance.now(), elapsed = 0, lastWorldTime = -1, frames = 0, sampleTime = 0, samples = 0, average = 0, adapted = false;
  const dummy = { progress: journeyProgress() };
  const rest = new THREE.Vector3(), upAxis = new THREE.Vector3(0, 1, 0);
  let swayAmount = 0;
  const mobileOverview = new THREE.Vector3(225, 265, 310);
  const overviewPosition = () => width < 701 ? mobileOverview.clone() : new THREE.Vector3(...CITY_OVERVIEW.position);
  const chapterPosition = (index: number) => {
    if (index === JOURNEY_CHAPTERS.length - 1) return overviewPosition();
    const chapter = JOURNEY_CHAPTERS[index];
    const position = new THREE.Vector3(...chapter.camera);
    if (width < 701) position.sub(new THREE.Vector3(...chapter.target)).multiplyScalar(index === 0 ? 1.5 : 1.25).add(new THREE.Vector3(...chapter.target));
    return position;
  };
  let paths: THREE.CatmullRomCurve3[] = [];
  let targets: THREE.CatmullRomCurve3[] = [];
  const context = gsap.context(() => {}, host);
  let cameraTween: gsap.core.Timeline | null = null;
  const shell = host.closest<HTMLElement>('[data-scene-status]')!;
  type Rect = { x: number; y: number; width: number; height: number };
  let fixedObstacles: Rect[] = [];
  const labelSizes = new Map<HTMLButtonElement, { width: number; height: number }>();
  // Labels keep clear of the header, dock, controls, and whichever heading or place HUD is showing.
  function measureOverlays() {
    const origin = host.getBoundingClientRect();
    const rect = (element: Element) => { const bounds = element.getBoundingClientRect(); return { x: bounds.x - origin.x - 6, y: bounds.y - origin.y - 6, width: bounds.width + 12, height: bounds.height + 12 }; };
    fixedObstacles = Array.from(shell.querySelectorAll('[data-city-header], [data-city-dock], aside[data-city-controls], [data-journey-chapter="city"] [data-city-heading], [data-city-hud][data-open]')).filter(element => getComputedStyle(element).visibility !== 'hidden').map(rect);
    labels.forEach(label => labelSizes.set(label, { width: label.offsetWidth, height: label.offsetHeight }));
  }
  // The place HUD sits on the left, so a focused venue is framed further right than the overview.
  let shiftX = -.08, shiftY = 0;
  function applyViewOffset() {
    camera.setViewOffset(width, height, width * shiftX, height * shiftY, width, height); camera.updateProjectionMatrix();
  }
  function frameTarget() {
    const atPlace = !!(state.focused || lastStop);
    if (state.journey) { const reveal = smooth(3.7, 4, dummy.progress); return width < 701 ? { x: -.025 * reveal, y: -.23 + .17 * reveal } : { x: -.19 + .11 * reveal, y: .015 * (1 - reveal) }; }
    return width < 701 ? { x: -.025, y: atPlace ? -.01 : -.06 } : { x: atPlace ? -.14 : -.08, y: atPlace ? .03 : 0 };
  }

  function resize() {
    width = Math.max(host.clientWidth, 1); height = Math.max(host.clientHeight, 1);
    camera.aspect = width / height;
    camera.fov = width < 701 ? 54 : 50;
    (scene.fog as THREE.FogExp2).density = width < 701 ? .0015 : .0024;
    ({ x: shiftX, y: shiftY } = frameTarget()); applyViewOffset();
    renderer.setSize(width, height, false); composer?.setSize(width, height);
    host.querySelector('[data-city-link]')?.parentElement?.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    paths = JOURNEY_CHAPTERS.slice(0, 4).map((chapter, i) => new THREE.CatmullRomCurve3([
      chapterPosition(i), ...(chapter.via || []).map(point => new THREE.Vector3(...point)), chapterPosition(i + 1),
    ], false, 'centripetal'));
    targets = JOURNEY_CHAPTERS.slice(0, 4).map((chapter, i) => new THREE.CatmullRomCurve3([new THREE.Vector3(...chapter.target), ...(chapter.targetVia || []).map(point => new THREE.Vector3(...point)), new THREE.Vector3(...JOURNEY_CHAPTERS[i + 1].target)], false, 'centripetal'));
    if (state.journey) applyTour();
    measureOverlays();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
  applyTour();
  try {
    const saved = JSON.parse(sessionStorage.getItem('statoz-city-camera-v1') || 'null');
    if (window.location.hash === '#city-explore' && saved?.mode === 'explore' && Array.isArray(saved.position) && Array.isArray(saved.target) && saved.position.length === 3 && saved.target.length === 3 && [...saved.position, ...saved.target].every((value: unknown) => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) < 600)) {
      camera.position.fromArray(saved.position); controls.target.fromArray(saved.target); controls.update();
    }
  } catch {}
  const savePose = () => { try { sessionStorage.setItem('statoz-city-camera-v1', JSON.stringify({ mode: state.mode, position: camera.position.toArray(), target: controls.target.toArray() })); } catch {} };
  controls.addEventListener('end', savePose);

  function applyTour() {
    if (disposed || !state.journey || state.panelOpen || focusedTween) return;
    const progress = THREE.MathUtils.clamp(dummy.progress, 0, 4);
    const index = Math.min(3, Math.floor(progress));
    const travel = smooth(.45, 1, progress - index);
    if (!paths[index]) return;
    camera.position.copy(paths[index].getPoint(travel));
    controls.target.copy(targets[index].getPoint(travel));
    camera.lookAt(controls.target);
    lastStop = null;
    world.highlight(null);
    host.dataset.cameraChapter = JOURNEY_CHAPTERS[Math.min(4, Math.round(progress))].id;
    host.dataset.cameraPosition = camera.position.toArray().map(n => n.toFixed(2)).join(',');
  }
  const unobserveJourney = observeJourneyProgress(value => { dummy.progress = value; applyTour(); });

  function animateTo(position: THREE.Vector3, target: THREE.Vector3, duration = 1.2) {
    if (reducedMotion) duration = 0;
    cameraTween?.kill(); focusedTween = true; controls.enabled = false;
    context.add(() => {
      cameraTween = gsap.timeline({ defaults: { duration, ease: 'power2.inOut' }, onComplete: () => { focusedTween = false; controls.update(); controls.enabled = !state.journey && state.mode === 'explore' && !state.panelOpen; } });
      cameraTween.to(camera.position, { x: position.x, y: position.y, z: position.z }, 0);
      cameraTween.to(controls.target, { x: target.x, y: target.y, z: target.z }, 0);
    });
  }
  function setState(next: CityRuntimeState) {
    if (disposed) return;
    const previous = state; state = { ...next };
    host.dataset.activityPaused = String(next.activityPaused);
    controls.enabled = !next.journey && next.mode === 'explore' && !next.panelOpen && !focusedTween;
    if (next.journey) {
      cameraTween?.kill(); focusedTween = false; controls.enabled = false;
      applyTour(); measureOverlays(); return;
    }
    if (next.focused && (next.focused !== previous.focused || previous.journey)) {
      const place = locationById(next.focused)!;
      lastStop = place.id;
      const offset = new THREE.Vector3(...place.camera);
      if (width < 701) offset.sub(new THREE.Vector3(...place.position)).multiplyScalar(1.35).add(new THREE.Vector3(...place.position));
      animateTo(offset, new THREE.Vector3(place.position[0], place.id === 'news' ? 12 : 1.5, place.position[2]));
      world.highlight(place.id);
    } else if (previous.journey || next.mode === 'tour' && previous.mode !== 'tour') {
      lastStop = null;
      if (previous.journey) { camera.position.copy(overviewPosition()); controls.target.set(...CITY_OVERVIEW.target); camera.lookAt(controls.target); controls.update(); }
      else animateTo(overviewPosition(), new THREE.Vector3(...CITY_OVERVIEW.target), .8);
    }
    if (next.mode === 'explore' && previous.mode !== 'explore') lastStop = null;
    world.highlight(state.focused ?? (state.mode === 'tour' ? lastStop : null));
    measureOverlays();
  }

  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2(); let down: { x: number; y: number; time: number } | null = null;
  const pointerDown = (event: PointerEvent) => { if (event.isPrimary && event.button === 0) down = { x: event.clientX, y: event.clientY, time: performance.now() }; else down = null; };
  const pointerUp = (event: PointerEvent) => {
    if (!down || state.journey || state.panelOpen || !event.isPrimary || performance.now() - down.time > 600 || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) { down = null; return; }
    down = null;
    const bounds = canvas.getBoundingClientRect(); pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera); const intersection = raycaster.intersectObjects(world.pickBoxes, false)[0];
    if (intersection) callbacks.onSelect(intersection.object.userData.locationId);
  };
  const cancelPointer = () => { down = null; };
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', cancelPointer);

  function zoom(factor: number) {
    if (state.journey || state.mode !== 'explore' || state.panelOpen) return;
    const offset = camera.position.clone().sub(controls.target); const distance = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
    camera.position.copy(controls.target).add(offset.setLength(distance)); controls.update();
  }
  function overview() {
    if (disposed) return;
    state.focused = null; lastStop = null; world.highlight(null); callbacks.onTourStop(null);
    animateTo(overviewPosition(), new THREE.Vector3(...CITY_OVERVIEW.target));
  }
  const keydown = (event: KeyboardEvent) => {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(.8); }
    if (event.key === '-') { event.preventDefault(); zoom(1.25); }
    if (event.key === 'Home') { event.preventDefault(); overview(); }
  };
  canvas.addEventListener('keydown', keydown);
  const contextLost = (event: Event) => { event.preventDefault(); callbacks.onFailure(); };
  canvas.addEventListener('webglcontextlost', contextLost);

  const projected = new THREE.Vector3();
  const intersects = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  function projectLabels() {
    const occupied = [...fixedObstacles];
    const active = state.focused ?? lastStop;
    for (const label of labels) {
      const place = locationById(label.dataset.cityLabel)!;
      const altitude = place.category === 'sport' ? 3 : place.id === 'news' ? 35 : 9;
      projected.set(place.position[0], altitude, place.position[2]).project(camera);
      const x = (projected.x + 1) / 2 * width, y = (1 - projected.y) / 2 * height;
      const anchorX = x.toFixed(1), anchorY = y.toFixed(1);
      if (label.dataset.anchorX !== anchorX) label.dataset.anchorX = anchorX;
      if (label.dataset.anchorY !== anchorY) label.dataset.anchorY = anchorY;
      const size = labelSizes.get(label)!;
      if (!size.width || !size.height) { label.style.visibility = 'hidden'; leaders.get(place.id)!.group.style.visibility = 'hidden'; continue; }
      const candidates = [
        { x: x - size.width / 2, y: y - size.height - 13 },
        { x: x - size.width - 18, y: y - size.height / 2 },
        { x: x + 18, y: y - size.height / 2 },
        { x: x - size.width / 2, y: y + 13 },
      ].map(point => ({ x: THREE.MathUtils.clamp(point.x, 12, width - size.width - 12), y: point.y, ...size }));
      // The place being visited is named by the HUD, so its own label steps aside.
      const placement = !state.journey && place.id !== active && projected.z < 1 && projected.z > -1 && x > -35 && x < width + 35 && y > 100 && y < height - 25 && !state.panelOpen
        ? candidates.find(candidate => candidate.y > 100 && candidate.y + candidate.height < height - 12 && !occupied.some(obstacle => intersects(candidate, obstacle))) : undefined;
      label.style.visibility = placement ? 'visible' : 'hidden';
      const leader = leaders.get(place.id)!; leader.group.style.visibility = placement ? 'visible' : 'hidden';
      if (placement) {
        label.style.transform = 'translate(' + Math.round(placement.x) + 'px,' + Math.round(placement.y) + 'px)'; occupied.push(placement);
        const endX = THREE.MathUtils.clamp(x, placement.x + 10, placement.x + placement.width - 10), endY = y > placement.y + placement.height ? placement.y + placement.height - 8 : placement.y + 8;
        leader.path.setAttribute('d', 'M' + anchorX + ' ' + anchorY + 'L' + endX.toFixed(1) + ' ' + endY.toFixed(1));
        leader.dot.setAttribute('cx', anchorX); leader.dot.setAttribute('cy', anchorY);
      }
    }
  }
  function frame() {
    if (disposed || document.hidden) return;
    const now = performance.now(), rawDelta = Math.max((now - lastFrame) / 1000, 0), delta = Math.min(rawDelta, .06); lastFrame = now;
    if (!state.activityPaused && !reducedMotion) elapsed += delta;
    if (!state.journey && state.mode === 'explore' && !focusedTween && !state.panelOpen) {
      controls.target.x = THREE.MathUtils.clamp(controls.target.x, -112, 112); controls.target.z = THREE.MathUtils.clamp(controls.target.z, -100, 95); controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 20); controls.update();
      // Panning well away from a venue leaves it; orbiting and zooming around it do not.
      const visiting = locationById(state.focused);
      if (visiting && Math.hypot(controls.target.x - visiting.position[0], controls.target.z - visiting.position[2]) > (visiting.category === 'sport' ? 46 : 34)) {
        state = { ...state, focused: null }; world.highlight(null); callbacks.onLeave();
      }
    } else camera.lookAt(controls.target);
    const goal = frameTarget(), ease = reducedMotion ? 1 : Math.min(1, delta * 3.2);
    if (Math.abs(goal.x - shiftX) > .0004 || Math.abs(goal.y - shiftY) > .0004) { shiftX += (goal.x - shiftX) * ease; shiftY += (goal.y - shiftY) * ease; applyViewOffset(); }
    if (lastWorldTime !== elapsed) { world.update(elapsed); lastWorldTime = elapsed; }
    // A held venue drifts gently from side to side. Only the rendered pose moves, so the tour and
    // focus tweens keep exclusive ownership of the camera's resting position.
    swayAmount += (((state.journey || state.mode === 'tour' && state.focused) && !focusedTween && !state.panelOpen && !reducedMotion ? 1 : 0) - swayAmount) * Math.min(1, delta * 2.4);
    const swaying = swayAmount > .002;
    if (swaying) {
      rest.copy(camera.position);
      camera.position.sub(controls.target).applyAxisAngle(upAxis, Math.sin(elapsed * .21) * (state.journey ? .018 : .2) * swayAmount).add(controls.target);
      camera.lookAt(controls.target);
    }
    world.follow(camera);
    renderer.info.reset();
    if (composer) composer.render(delta); else renderer.render(scene, camera);
    if (frames % 30 === 0) measureOverlays();
    if (frames % 2 === 0) projectLabels();
    if (swaying) camera.position.copy(rest);
    if (frames % 30 === 0) host.dataset.activityTime = elapsed.toFixed(3);
    frames++;
    if (!ready) { ready = true; callbacks.onReady(); }
    if (frames > 90 && !state.panelOpen) { sampleTime += rawDelta; samples++; }
    if (samples >= 120) {
      average = samples / sampleTime; host.dataset.fps = average.toFixed(1); host.dataset.drawCalls = String(renderer.info.render.calls); host.dataset.triangles = String(renderer.info.render.triangles);
      if (!adapted && average < 28) { adapted = true; ratio = Math.min(ratio, 1); renderer.setPixelRatio(ratio); disposeComposer(); renderer.shadowMap.enabled = false; world.reduce(); resize(); host.dataset.quality = 'reduced'; }
      sampleTime = 0; samples = 0;
    }
  }
  function releaseGpu() {
    if (gpuReleased) return;
    gpuReleased = true; world.dispose(); disposeComposer(); renderer.dispose(); renderer.forceContextLoss();
  }
  const visibility = () => { lastFrame = performance.now(); renderer.setAnimationLoop(document.hidden || !warmed ? null : frame); };
  document.addEventListener('visibilitychange', visibility);
  // Keep the usable poster/HTML visible while textures load and the GPU compiles
  // shaders. KHR_parallel_shader_compile avoids synchronous first-draw linking.
  void (async () => {
    await world.assetReady;
    if (disposed) return;
    compiling = true;
    try { await renderer.compileAsync(scene, camera); }
    finally { compiling = false; }
    if (disposed) { releaseGpu(); return; }
    warmed = true; visibility();
  })().catch(() => { if (disposed) releaseGpu(); else callbacks.onFailure(); });
  host.dataset.quality = mobile ? 'mobile' : 'desktop';
  host.dataset.people = String(world.lifeCounts.people); host.dataset.athletes = String(world.lifeCounts.athletes); host.dataset.stands = String(world.lifeCounts.stands);

  return {
    setState, overview, zoom,
    getPose: () => ({ position: camera.position.toArray(), target: controls.target.toArray() }),
    dispose() {
      if (disposed) return; disposed = true;
      savePose(); renderer.setAnimationLoop(null); cameraTween?.kill(); unobserveJourney(); context.revert(); controls.removeEventListener('end', savePose); controls.dispose(); resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', cancelPointer);
      canvas.removeEventListener('keydown', keydown); canvas.removeEventListener('webglcontextlost', contextLost); document.removeEventListener('visibilitychange', visibility);
      if (!compiling) releaseGpu();
      delete document.documentElement.dataset.cityAssets;
    },
  };
}
