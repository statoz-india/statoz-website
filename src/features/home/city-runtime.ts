import { publicAsset } from '@statoz/design-system/asset';
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
import { captureCityEnvironment, cityEnvironment } from './city-gateway';
import { CITY_LOCATIONS, CITY_OVERVIEW, CITY_PALETTE, locationById, type CityLocationId, type CityMode } from './city-config';
import { createCityDrive } from './city-drive';
import { createCityRoam, type RoamStatus } from './city-roam';
import { cityAudio } from './city-audio';
import { createCrest, CREST_SIZE, CREST_TIMING } from './city-crest';
import { createMotes, createSparks } from './city-particles';
import { applyDive, createIntroText, createSpaceBackdrop, INTRO, introTextPhase } from './city-intro';
import { JOURNEY_CHAPTERS, JOURNEY_END, journeyAnchor } from './city-journey-config';
import { arrivalState, clamp01, journeyProgress, observeJourneyProgress, publishArrival, publishDisplayProgress, setDampedProgress, smooth, smoother } from './city-journey-motion';

export type CityRuntimeState = { mode: CityMode; focused: CityLocationId | null; journey: boolean; panelOpen: boolean; activityPaused: boolean };
type Callbacks = { onSelect: (id: CityLocationId) => void; onReady: () => void; onFailure: () => void; onTourStop: (id: CityLocationId | null) => void; onLeave: () => void; onRoamStatus: (status: RoamStatus) => void; onExitRoam: () => void };
export type CityRuntime = Awaited<ReturnType<typeof createCityRuntime>>;
const ARRIVAL_KEY = 'statoz-arrival-v3';

/** The grade: cyan-and-white before the gate, full colour after it; a vignette, cool shadows, grain and speed fringing. */
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uBloom: { value: 1 }, uSpeed: { value: 0 }, uTime: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uBloom, uSpeed, uTime; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 p = vUv - .5; float r = length(p * vec2(1.0, .84));
      vec2 shift = p * (.0005 + uSpeed * .004) * smoothstep(.15, .7, r);
      vec4 c = vec4(texture2D(tDiffuse, vUv + shift).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - shift).b, 1.0);
      float luma = dot(c.rgb, vec3(.2126, .7152, .0722));
      vec3 duo = vec3(luma) * vec3(.74, .98, 1.22);
      c.rgb = mix(mix(duo, c.rgb, .42), c.rgb, uBloom);
      c.rgb *= 1.0 - smoothstep(.36, .92, r) * .42;
      c.rgb = mix(c.rgb, c.rgb * vec3(.93, 1.0, 1.12), (1.0 - smoothstep(0.0, .45, luma)) * .55);
      c.rgb += (hash(vUv * 900.0 + uTime) - .5) * .003;
      gl_FragColor = max(c, vec4(0.0));
    }`,
};

export async function createCityRuntime(host: HTMLDivElement, callbacks: Callbacks, webglContext?: WebGL2RenderingContext) {
  const canvas = host.querySelector('canvas')!;
  const shell = host.closest<HTMLElement>('[data-scene-status]')!;
  const labels = Array.from(host.querySelectorAll<HTMLButtonElement>('[data-city-label]'));
  const leaders = new Map(Array.from(host.querySelectorAll<SVGGElement>('[data-city-link]')).map(element => [element.dataset.cityLink, { group: element, path: element.querySelector('path')!, dot: element.querySelector('circle')! }]));
  const renderer = new THREE.WebGLRenderer({ canvas, context: webglContext, antialias: true, powerPreference: 'high-performance', alpha: false });
  const scene = new THREE.Scene(); scene.background = new THREE.Color(HAZE); scene.fog = new THREE.FogExp2(HAZE, .0024);
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 1100);
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
  const debug = renderer.getContext().getExtension('WEBGL_debug_renderer_info');
  const gpuName = debug ? String(renderer.getContext().getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '';
  const software = /swiftshader|llvmpipe|software rasterizer|microsoft basic render|softpipe/i.test(gpuName);
  const lightweight = mobile || software;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ratio = Math.min(window.devicePixelRatio, software ? 1 : mobile ? 1.2 : 1.5);
  renderer.setPixelRatio(ratio);
  renderer.shadowMap.enabled = !lightweight;
  // PCFSoftShadowMap is deprecated and silently swapped for PCF at render time, which invalidates every
  // pre-compiled shadow-receiving program. Ask for PCF directly so pre-compilation is not wasted.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const environment = cityEnvironment(renderer);
  scene.environment = environment.texture; scene.environmentIntensity = .28;
  // On desktop the placeholder is replaced by a snapshot of the lit city once it has loaded.
  let cityReflections: THREE.WebGLRenderTarget | null = null;

  let disposed = false, ready = false, focusedTween = false, warmed = false, compiling = false, gpuReleased = false;
  // ——— Loader: the logo is reforged from its fragments while the city loads, on the same canvas. ———
  const loaderScene = new THREE.Scene(); loaderScene.environment = environment.texture; loaderScene.environmentIntensity = .9;
  const loaderCamera = new THREE.PerspectiveCamera(30, 1, .5, 400); loaderCamera.position.set(0, 0, 90);
  // Space behind the logo: stars, nebulae and the planet the city sits on (see city-intro.ts).
  const space = createSpaceBackdrop();
  const backdropScene = new THREE.Scene(); backdropScene.add(space.mesh);
  loaderScene.add(new THREE.AmbientLight('#9ec9ff', .5));
  const loaderKey = new THREE.DirectionalLight('#ffffff', 2.4); loaderKey.position.set(20, 30, 60); loaderScene.add(loaderKey);
  const loaderRim = new THREE.DirectionalLight(CITY_PALETTE.cyan, 3); loaderRim.position.set(-40, 10, -30); loaderScene.add(loaderRim);
  const logoTexture = new THREE.TextureLoader().load(publicAsset('/assets/icons/app_logo.png')); logoTexture.colorSpace = THREE.SRGBColorSpace; logoTexture.anisotropy = 8;
  const crest = createCrest(logoTexture); loaderScene.add(crest.group);
  const loaderSparks = createSparks(420, 3.4); loaderScene.add(loaderSparks.points);
  const introText = createIntroText(mobile); loaderScene.add(introText.points);
  let introDone = false, autoDrive: { from: number; top: number } | 'done' | null = null;
  let seen = false;
  try { seen = !!sessionStorage.getItem(ARRIVAL_KEY); sessionStorage.setItem(ARRIVAL_KEY, 'true'); } catch {}
  // A visitor who arrives mid-page or at a place link skips the reveal and lands in the settled city.
  // The lights-on reveal plays once per tab session. A revisit, a mid-page arrival or a place link lands settled.
  let skipReveal = seen || !!window.location.hash || window.scrollY > 30 || reducedMotion;
  // The logo is reforged on its own clock, slow on a first visit; a revisit in the same tab plays it quicker.
  // Input during the build hurries it along once the city has loaded.
  const pace = seen ? 1.7 : 1;
  let buildClock = 0, buildSpeed = seen ? 3.2 : 1, rush = false;
  const rushInput = () => { rush = true; };
  window.addEventListener('wheel', rushInput, { passive: true }); window.addEventListener('touchstart', rushInput, { passive: true }); window.addEventListener('keydown', rushInput);
  let stage = .08, shown = 0, loadClock = 0, loaderLast = performance.now(), revealStart = -1, revealClock = 0, revealLast = performance.now(), settled = false, crestLanded = false;
  const setStage = (value: number) => { stage = Math.max(stage, value); };
  function headerLogoRect() {
    const logo = shell.querySelector('[data-city-header] > a img, [data-city-header] > a > :first-child');
    return logo?.getBoundingClientRect() ?? null;
  }
  /** Places the crest on the z = 0 plane so it covers a screen rectangle of the given size. */
  function placeCrest(screenX: number, screenY: number, sizePx: number) {
    const visible = 2 * loaderCamera.position.z * Math.tan(THREE.MathUtils.degToRad(loaderCamera.fov / 2)), unit = visible / Math.max(height, 1);
    crest.group.position.set((screenX - width / 2) * unit, -(screenY - height / 2) * unit, 0);
    crest.group.scale.setScalar(sizePx * unit / CREST_SIZE);
  }
  const crestSize = () => Math.min(width, height) * (mobile ? .38 : .26);
  function loaderFrame() {
    const now = performance.now(), dt = Math.min(.05, (now - loaderLast) / 1000); loaderLast = now;
    loadClock += dt;
    // A long frame never fast-forwards the build: its clock advances at most 1/20 s per frame. Until the
    // city has loaded the clock stops at the hold, where the last piece hovers and crackles.
    const loaded = stage >= 1, holding = !loaded && buildClock >= CREST_TIMING.hold;
    if (rush && loaded) buildSpeed = Math.min(5, buildSpeed + dt * 6);
    buildClock = Math.min(loaded ? CREST_TIMING.done : CREST_TIMING.hold, buildClock + dt * buildSpeed);
    // The counter follows real loading and never runs ahead of the build: it reaches 100 as the ball lands.
    const goal = Math.min(stage, buildClock / CREST_TIMING.land);
    shown += (goal - shown) * Math.min(1, dt * 4);
    if (loaded && buildClock >= CREST_TIMING.land && shown > .985) shown = 1;
    publishArrival({ progress: shown });
    const size = crestSize();
    crest.setField(width / 2 * CREST_SIZE / size, height / 2 * CREST_SIZE / size);
    placeCrest(width / 2, height * .44, size);
    crest.group.rotation.set(0, 0, 0);
    crest.update(buildClock, loadClock, dt, holding);
    space.pulse = crest.pulse; space.frame(loadClock, width, height);
    flushContacts(loadClock);
    loaderSparks.update(loadClock);
    renderer.autoClear = true; renderer.render(backdropScene, loaderCamera);
    renderer.autoClear = false; renderer.clearDepth(); renderer.render(loaderScene, loaderCamera); renderer.autoClear = true;
  }
  function flushContacts(time: number) {
    while (crest.contacts.length) { const contact = crest.contacts.shift()!; loaderSparks.emit(contact.position, contact.strength > .9 ? '#e9fbff' : CITY_PALETTE.cyan, Math.round(8 + contact.strength * 34), (8 + contact.strength * 12) * crest.group.scale.x, time); }
  }

  let width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1);
  const sizeLoader = () => { width = Math.max(host.clientWidth, 1); height = Math.max(host.clientHeight, 1); renderer.setSize(width, height, false); loaderCamera.aspect = width / height; loaderCamera.updateProjectionMatrix(); };
  sizeLoader();
  // Every loader material compiles off the main thread first (the flat logo holds the screen meanwhile),
  // so the build's first frames never stall on shader linking.
  const dormant: THREE.Object3D[] = [];
  loaderScene.traverse(object => { if (!object.visible) { object.visible = true; dormant.push(object); } });
  const loaderCompiled = renderer.compileAsync(loaderScene, loaderCamera).catch(() => undefined);
  dormant.forEach(object => { object.visible = false; });
  void Promise.race([loaderCompiled, new Promise(resolve => setTimeout(resolve, 1500))]).then(() => {
    if (disposed || warmed) return;
    loaderLast = performance.now();
    publishArrival({ phase: 'loading', progress: 0 }); host.dataset.arrival = 'loading';
    if (!document.hidden) renderer.setAnimationLoop(loaderFrame);
  });

  const fill = new THREE.HemisphereLight('#93afe6', '#182338', .78); scene.add(fill);
  const key = new THREE.DirectionalLight('#aebfff', 1.05); key.position.set(60, 95, 38); key.castShadow = !lightweight;
  key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -118; key.shadow.camera.right = 118; key.shadow.camera.top = 112; key.shadow.camera.bottom = -104; key.shadow.camera.far = 240; key.shadow.normalBias = .2; key.shadow.radius = 3; scene.add(key);
  const blue = new THREE.DirectionalLight(CITY_PALETTE.cyan, .55); blue.position.set(-70, 35, -65); scene.add(blue);
  const pink = new THREE.PointLight(CITY_PALETTE.pink, 150, 70, 1.6); pink.position.set(-5, 17, 16); scene.add(pink);
  await document.fonts.ready;
  setStage(.16);
  const world = await buildCityWorld(scene, renderer, mobile);
  setStage(.5);
  const drive = createCityDrive(scene, camera, host);
  const roam = createCityRoam(scene, camera, host, { onStatus: callbacks.onRoamStatus, onVisit: callbacks.onSelect, onExit: callbacks.onExitRoam, onContact: contact => {
    world.reactContact(contact);
    if (contact.kind !== 'person' && contact.speed > 2) sparks.emit(new THREE.Vector3(contact.x, .55, contact.z), CITY_PALETTE.gold, Math.min(28, Math.round(contact.speed * 1.4)), 2.5, elapsed);
  } });
  void world.assetReady.then(() => { if (!disposed) roam.setSolids(world.roamSolids(), world.roamFloors); });
  // Dust in the floodlight beams and over the avenue; fireflies in the park.
  const motes = createMotes(mobile, [
    { center: new THREE.Vector3(22, 0, -27), radius: 30, height: 20, color: '#dff4ff', count: 900 },
    { center: new THREE.Vector3(-49, 0, -30), radius: 32, height: 22, color: '#dff4ff', count: 900 },
    { center: new THREE.Vector3(-41, 0, 26), radius: 20, height: 14, color: '#ffe9cf', count: 500 },
    { center: new THREE.Vector3(48, 0, 25.5), radius: 26, height: 14, color: '#efe4ff', count: 600 },
    { center: new THREE.Vector3(-17, 6, 100), radius: 9, height: 12, color: '#cfeeff', count: 120 },
    { center: new THREE.Vector3(47.6, 0, 60.7), radius: 16, height: 4, color: '#e9ff9a', count: 160 },
  ]);
  scene.add(motes.points);
  const sparks = createSparks(); scene.add(sparks.points);
  if (software) world.reduce();
  void world.assetReady.then(() => setStage(.82));

  // Desktop renders through an anti-aliased HDR target with bloom and the grade. Mobile uses emissive materials directly.
  let composer: EffectComposer | null = null, grade: ShaderPass | null = null;
  if (!lightweight) {
    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: Math.min(4, renderer.capabilities.maxSamples) }));
    composer.setPixelRatio(ratio);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), .3, .45, 1.15));
    grade = new ShaderPass(GradeShader); composer.addPass(grade);
    composer.addPass(new OutputPass());
  }
  function disposeComposer() {
    if (!composer) return;
    for (const pass of composer.passes) pass.dispose();
    composer.dispose(); composer = null; grade = null;
  }

  let state: CityRuntimeState = { mode: 'tour', focused: null, journey: true, panelOpen: false, activityPaused: false };
  let lastStop: CityLocationId | null = null;
  let lastFrame = performance.now(), elapsed = 0, lastWorldTime = -1, frames = 0, sampleTime = 0, samples = 0, average = 0, adapted = software;
  const dummy = { progress: journeyProgress() };
  let display = dummy.progress, settledAt = 0;
  const pointer = new THREE.Vector2(), pointerEase = new THREE.Vector2();
  const rest = new THREE.Vector3(), upAxis = new THREE.Vector3(0, 1, 0);
  let swayAmount = 0, trafficGap = Infinity;
  const mobileOverview = new THREE.Vector3(225, 265, 310);
  const overviewPosition = () => width < 701 ? mobileOverview.clone() : new THREE.Vector3(...CITY_OVERVIEW.position);
  const context = gsap.context(() => {}, host);
  let cameraTween: gsap.core.Timeline | null = null;
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
    if (state.mode === 'roam' && !state.journey && !state.focused) return { x: 0, y: 0 };
    const atPlace = !!(state.focused || lastStop);
    if (state.journey) return drive.view();
    return width < 701 ? { x: -.025, y: atPlace ? -.01 : -.06 } : { x: atPlace ? -.14 : -.08, y: atPlace ? .03 : 0 };
  }

  function resize() {
    width = Math.max(host.clientWidth, 1); height = Math.max(host.clientHeight, 1);
    camera.aspect = width / height;
    (scene.fog as THREE.FogExp2).density = width < 701 ? .0015 : .0024;
    ({ x: shiftX, y: shiftY } = frameTarget()); applyViewOffset();
    renderer.setSize(width, height, false); composer?.setSize(width, height);
    loaderCamera.aspect = width / height; loaderCamera.updateProjectionMatrix();
    host.querySelector('[data-city-link]')?.parentElement?.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    drive.resize(width, height);
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
    const progress = THREE.MathUtils.clamp(display, 0, JOURNEY_END);
    const pose = drive.sample(progress, 0, elapsed, true);
    controls.target.copy(pose.target);
    lastStop = null; world.highlight(null);
    host.dataset.cameraChapter = JOURNEY_CHAPTERS[Math.min(JOURNEY_END, Math.floor(progress))].id;
    host.dataset.cameraPosition = camera.position.toArray().map(n => n.toFixed(2)).join(',');
  }
  // Scroll sets the target; the frame loop eases toward it. Big jumps (links, replay) snap.
  const unobserveJourney = observeJourneyProgress(value => {
    dummy.progress = value;
    if (Math.abs(value - display) > 1.6 || reducedMotion) { display = value; publishDisplayProgress(display, 0); applyTour(); }
  });
  setDampedProgress(true);

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
    const roaming = !next.journey && next.mode === 'roam' && !next.focused;
    roam.setActive(roaming, next.panelOpen || next.activityPaused);
    if (roaming) {
      cameraTween?.kill(); focusedTween = false; controls.enabled = false; lastStop = null; world.highlight(null); measureOverlays(); return;
    }
    controls.enabled = !next.journey && next.mode === 'explore' && !next.panelOpen && !focusedTween;
    if (next.journey) {
      cameraTween?.kill(); focusedTween = false; controls.enabled = false;
      applyTour(); measureOverlays(); return;
    }
    camera.fov = width < 701 ? 54 : 50; camera.updateProjectionMatrix();
    if (next.focused && (next.focused !== previous.focused || previous.journey)) {
      const place = locationById(next.focused)!;
      lastStop = place.id;
      const offset = new THREE.Vector3(...place.camera);
      if (width < 701) offset.sub(new THREE.Vector3(...place.position)).multiplyScalar(1.35).add(new THREE.Vector3(...place.position));
      animateTo(offset, new THREE.Vector3(place.position[0], place.id === 'news' ? 12 : 1.5, place.position[2]));
      world.highlight(place.id);
    } else if (previous.journey || previous.mode === 'roam' || next.mode === 'tour' && previous.mode !== 'tour') {
      lastStop = null;
      if (previous.journey) { camera.position.copy(overviewPosition()); controls.target.set(...CITY_OVERVIEW.target); camera.lookAt(controls.target); controls.update(); }
      else animateTo(overviewPosition(), new THREE.Vector3(...CITY_OVERVIEW.target), .8);
    }
    if (next.mode === 'explore' && previous.mode !== 'explore') lastStop = null;
    world.highlight(state.focused ?? (state.mode === 'tour' ? lastStop : null));
    measureOverlays();
  }

  const raycaster = new THREE.Raycaster(); const pick = new THREE.Vector2(); let down: { x: number; y: number; time: number } | null = null;
  const pointerDown = (event: PointerEvent) => { if (event.isPrimary && event.button === 0) down = { x: event.clientX, y: event.clientY, time: performance.now() }; else down = null; };
  const pointerUp = (event: PointerEvent) => {
    if (!down || state.journey || state.mode === 'roam' || state.panelOpen || !event.isPrimary || performance.now() - down.time > 600 || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) { down = null; return; }
    down = null;
    const bounds = canvas.getBoundingClientRect(); pick.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(pick, camera); const intersection = raycaster.intersectObjects(world.pickBoxes, false)[0];
    if (intersection) callbacks.onSelect(intersection.object.userData.locationId);
  };
  const cancelPointer = () => { down = null; };
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', cancelPointer);
  // The hero leans gently toward the pointer on desktop.
  const pointerMove = (event: PointerEvent) => { if (event.pointerType === 'mouse') pointer.set(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1); };
  window.addEventListener('pointermove', pointerMove, { passive: true });
  // Any input during the reveal skips straight to the settled city.
  const skip = () => { if (revealStart !== -1 && !settled) skipReveal = true; };
  window.addEventListener('wheel', skip, { passive: true }); window.addEventListener('touchstart', skip, { passive: true }); window.addEventListener('keydown', skip);

  function zoom(factor: number) {
    if (state.journey || state.mode !== 'explore' || state.panelOpen) return;
    const offset = camera.position.clone().sub(controls.target); const distance = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
    camera.position.copy(controls.target).add(offset.setLength(distance)); controls.update();
  }
  function overview() {
    if (disposed) return;
    if (state.mode === 'roam') return;
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
      const placement = !state.journey && state.mode !== 'roam' && place.id !== active && projected.z < 1 && projected.z > -1 && x > -35 && x < width + 35 && y > 100 && y < height - 25 && !state.panelOpen
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

  /**
   * The reveal. Times are seconds after loading reaches 100 (see INTRO): the logo lifts into the header,
   * particles form the welcome text in space, the warp bursts it apart and the camera dives from orbit.
   * During the dive each ground's floodlights clunk on, rooms ripple outward and the street glows.
   */
  const zones = [0, 0, 0, 0, 0], clunked = [true, false, false, false, false];
  const grounds = [new THREE.Vector3(22, 0, -27), new THREE.Vector3(-49, 0, -30), new THREE.Vector3(-41, 0, 26), new THREE.Vector3(48, 0, 25.5)];
  function arrival(now: number) {
    if (settled) return 1;
    if (revealStart === -1) return 0;
    if (revealStart === -2) { revealStart = now; performance.mark('city:reveal'); }
    // A long frame never fast-forwards the sequence: the clock advances at most 1/20 s per frame.
    revealClock += Math.min(.05, Math.max(0, (now - revealLast) / 1000)) * pace; revealLast = now;
    let t = revealClock;
    if (skipReveal) t = INTRO.settled + 1;
    // The solid headline in space: the page styles the h1 from this.
    const textPhase = introTextPhase(t);
    if (shell.dataset.introText !== textPhase) shell.dataset.introText = textPhase;
    // After the dive the page scrolls itself down the avenue to the car and stops at "Enter StatOz City".
    // Any wheel, touch or key input skips the reveal and hands the scroll back at once.
    if (!skipReveal && t >= INTRO.driveStart && autoDrive !== 'done') {
      if (autoDrive === null) { const entry = document.getElementById(journeyAnchor('entry')); autoDrive = { from: window.scrollY, top: entry ? entry.getBoundingClientRect().top + window.scrollY : 0 }; }
      if (autoDrive.top > 0) window.scrollTo({ top: THREE.MathUtils.lerp(autoDrive.from, autoDrive.top, smoother(INTRO.driveStart, INTRO.driveEnd, t)), behavior: 'instant' });
      if (t >= INTRO.driveEnd) autoDrive = 'done';
    }
    // The city wakes as it comes into view during the dive.
    const wake = INTRO.openStart + .15;
    for (let i = 1; i <= 4; i++) { const on = wake + (i - 1) * .2, flicker = t > on && t < on + .22 ? (Math.sin((t - on) * 90) > -.2 ? 1 : .25) : 1; zones[i] = clamp01((t - on) / .16) * flicker; if (t > on && !clunked[i]) { clunked[i] = true; if (t < INTRO.settled - 1) cityAudio.clunk(); } }
    zones[0] = smooth(wake + .3, wake + 1.2, t);
    world.setPower({ zones, ripple: Math.max(0, (t - wake - .4) / 1.6) * 280, windows: 1, neon: smooth(wake + .2, wake + 1.3, t), signs: smooth(wake + .5, wake + 1.6, t) });
    motes.setPower(0, zones[1]); motes.setPower(1, zones[2]); motes.setPower(2, zones[3]); motes.setPower(3, zones[4]); motes.setPower(4, zones[0]); motes.setPower(5, zones[0]);
    publishArrival({ time: t });
    if (t >= INTRO.landed && !shell.dataset.introLanded) shell.dataset.introLanded = 'true';
    if (t >= INTRO.settled) { settled = true; settledAt = now; publishArrival({ phase: 'settled', progress: 1 }); host.dataset.arrival = 'settled'; world.setPower({ zones: [1, 1, 1, 1, 1], ripple: 9999, windows: 1, neon: 1, signs: 1 }); for (let i = 0; i < 6; i++) motes.setPower(i, 1); }
    return t;
  }
  /** Draws space, the logo and the particle text over the city until the backdrop has opened onto it. */
  function overlay(t: number, frameTime: number, delta: number) {
    if (introDone) return;
    if (!crestLanded) {
      const target = headerLogoRect(), size = crestSize();
      // A slow, eased glide on a gentle arc, turning slightly as it rises (a steeper tilt catches the sky and washes out).
      const lift = smoother(.05, INTRO.lift, t), startX = width / 2, startY = height * .44;
      const toX = target ? target.left + target.width / 2 : 40, toY = target ? target.top + target.height / 2 : 40, toSize = target ? Math.max(target.width, target.height) : 30;
      const bow = Math.sin(Math.PI * lift) * Math.min(width, height) * .06;
      placeCrest(THREE.MathUtils.lerp(startX, toX, lift) + bow, THREE.MathUtils.lerp(startY, toY, lift), THREE.MathUtils.lerp(size, toSize, lift));
      crest.group.rotation.set(-Math.sin(Math.PI * lift) * .1, Math.sin(Math.PI * lift) * .14, 0);
      crest.update(CREST_TIMING.done, frameTime, delta);
      if (t >= INTRO.lift) { crestLanded = true; crest.group.visible = false; host.dataset.logoLanded = 'true'; shell.dataset.logoLanded = 'true'; }
    }
    space.reveal(t); space.frame(frameTime, width, height);
    introText.reveal(t, frameTime);
    flushContacts(frameTime); loaderSparks.update(frameTime);
    renderer.autoClear = false; renderer.render(backdropScene, loaderCamera); renderer.clearDepth(); renderer.render(loaderScene, loaderCamera); renderer.autoClear = true;
    if (t >= INTRO.openEnd) { introDone = true; introText.hide(); }
  }

  function frame() {
    if (disposed || document.hidden) return;
    const now = performance.now(), rawDelta = Math.max((now - lastFrame) / 1000, 0), delta = Math.min(rawDelta, .06); lastFrame = now;
    if (!state.activityPaused && !reducedMotion) elapsed += delta;
    // Ease the displayed progress toward the scroll target.
    const before = display;
    display += (dummy.progress - display) * (1 - Math.exp(-delta * 7));
    if (Math.abs(dummy.progress - display) < 1e-4) display = dummy.progress;
    const velocity = delta > 0 ? (display - before) / delta : 0;
    publishDisplayProgress(display, velocity);
    const t = arrival(now);
    const driveActive = state.journey && !state.panelOpen && !focusedTween;
    const drivePose = drive.sample(display, state.activityPaused ? 0 : Math.min(rawDelta, .25), elapsed, driveActive);
    if (driveActive) {
      controls.target.copy(drivePose.target);
      const chapterId = JOURNEY_CHAPTERS[Math.min(JOURNEY_END, Math.floor(display))].id;
      if (host.dataset.cameraChapter !== chapterId) host.dataset.cameraChapter = chapterId;
      // The settled hero drifts: a slow push-in and a gentle lean toward the pointer.
      const hero = drive.state.heroWeight;
      if (hero > .001 && !reducedMotion) {
        pointerEase.lerp(pointer, Math.min(1, delta * 2.5));
        const drift = smooth(0, 8, settled ? (now - settledAt) / 1000 : 0) * .03;
        camera.position.lerp(drivePose.target, drift * hero);
        camera.position.x += pointerEase.x * 1.4 * hero; camera.position.y -= pointerEase.y * .5 * hero;
        camera.lookAt(drivePose.target);
      }
      // The opening dive from orbit overrides the hero pose until it lands.
      if (!settled && revealStart !== -1 && !skipReveal) applyDive(camera, drivePose.target, t);
      host.dataset.cameraPosition = camera.position.toArray().map(n => n.toFixed(2)).join(',');
    }
    if (!state.journey && state.mode === 'explore' && !focusedTween && !state.panelOpen) {
      controls.target.x = THREE.MathUtils.clamp(controls.target.x, -112, 112); controls.target.z = THREE.MathUtils.clamp(controls.target.z, -100, 95); controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 20); controls.update();
      // Panning well away from a venue leaves it; orbiting and zooming around it do not.
      const visiting = locationById(state.focused);
      if (visiting && Math.hypot(controls.target.x - visiting.position[0], controls.target.z - visiting.position[2]) > (visiting.category === 'sport' ? 46 : 34)) {
        state = { ...state, focused: null }; world.highlight(null); callbacks.onLeave();
      }
    } else if (!driveActive && (state.mode !== 'roam' || state.focused)) camera.lookAt(controls.target);
    if (!state.journey && state.mode === 'roam' && !state.focused) { roam.setBodies(world.bodies()); roam.update(delta, elapsed); }
    const goal = frameTarget(), ease = reducedMotion ? 1 : Math.min(1, delta * 3.2);
    if (Math.abs(goal.x - shiftX) > .0004 || Math.abs(goal.y - shiftY) > .0004) { shiftX += (goal.x - shiftX) * ease; shiftY += (goal.y - shiftY) * ease; applyViewOffset(); }
    if (!state.journey && state.mode === 'roam' && !state.focused) roam.projectWaypoint(width, height);
    const carPosition = drive.carState().position;
    if (lastWorldTime !== elapsed) {
      const gap = world.update(elapsed, state.journey ? { x: carPosition.x, z: carPosition.z } : state.mode === 'roam' ? roam.vehiclePosition() : null, state.journey, !state.journey && state.mode === 'roam' ? roam.bodies() : []);
      for (const contact of world.drainContacts()) { if (contact.receiver === 'npc') world.reactContact(contact); else roam.receiveContact(contact); }
      if (state.journey && display > 1.3 && display < 5) trafficGap = Math.min(trafficGap, gap);
      motes.update(elapsed); sparks.update(elapsed); lastWorldTime = elapsed;
    }
    world.setEntrance(state.journey ? drive.state.gateWake : 1, state.journey && display < 1.4);
    // A held venue drifts gently from side to side. Only the rendered pose moves, so the tour and
    // focus tweens keep exclusive ownership of the camera's resting position.
    swayAmount += (((!state.journey && state.mode === 'tour' && state.focused) && !focusedTween && !state.panelOpen && !reducedMotion ? 1 : 0) - swayAmount) * Math.min(1, delta * 2.4);
    const swaying = swayAmount > .002;
    if (swaying) {
      rest.copy(camera.position);
      camera.position.sub(controls.target).applyAxisAngle(upAxis, Math.sin(elapsed * .21) * .2 * swayAmount).add(controls.target);
      camera.lookAt(controls.target);
    }
    if (grade) { grade.uniforms.uBloom.value = state.journey ? drive.state.colorBloom : 1; grade.uniforms.uSpeed.value = state.journey ? drive.state.inside * Math.min(1, drive.state.speed / 18) : 0; grade.uniforms.uTime.value = (now / 1000) % 100; }
    const nearest = Math.min(...grounds.map(ground => ground.distanceTo(camera.position)));
    cityAudio.update(state.journey ? Math.min(1, drive.state.speed / 18) : 0, 1 - smooth(25, 95, nearest), elapsed);
    world.follow(camera);
    renderer.info.reset();
    if (composer) composer.render(delta); else renderer.render(scene, camera);
    overlay(t, now / 1000, delta);
    host.dataset.shaderPrograms = String(renderer.info.programs?.length || 0);
    if (frames % 30 === 0) measureOverlays();
    if (frames % 2 === 0) projectLabels();
    if (swaying) camera.position.copy(rest);
    if (frames % 30 === 0) { host.dataset.activityTime = elapsed.toFixed(3); host.dataset.trafficGap = Number.isFinite(trafficGap) ? trafficGap.toFixed(2) : 'none'; }
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
    gpuReleased = true; roam.dispose(); drive.dispose(); crest.dispose(); logoTexture.dispose(); environment.dispose(); cityReflections?.dispose(); world.dispose(); disposeComposer(); renderer.dispose(); renderer.forceContextLoss();
  }
  const visibility = () => { lastFrame = performance.now(); loaderLast = performance.now(); cityAudio.suspend(document.hidden); renderer.setAnimationLoop(document.hidden ? null : warmed ? frame : loaderFrame); };
  document.addEventListener('visibilitychange', visibility);
  // Keep the loader running while textures load and the GPU compiles shaders.
  // KHR_parallel_shader_compile avoids synchronous first-draw linking.
  const target = () => composer ? composer.readBuffer : null;
  // The kit's source meshes are hidden for good once merged into batches; compiling them is wasted work.
  const retired = (object: THREE.Object3D) => object.name === 'city-source-geometry' && !object.visible;
  /**
   * Creates the city's shader programs a few at a time between loader frames, so the logo keeps moving.
   * Subtrees that hold lights are split further: compiling one on its own would count its lights twice.
   */
  async function compileGradually() {
    const lit = (root: THREE.Object3D) => { let found = false; root.traverse(object => { if ((object as THREE.Light).isLight) found = true; }); return found; };
    const materialsOf = (root: THREE.Object3D) => { const set = new Set<THREE.Material>(); root.traverse(object => { const material = (object as THREE.Mesh).material; if (material) (Array.isArray(material) ? material : [material]).forEach(m => set.add(m)); }); return set; };
    const queue: THREE.Object3D[] = [];
    const collect = (root: THREE.Object3D) => { for (const child of root.children) { if (retired(child)) continue; if (lit(child) || (child.children.length && materialsOf(child).size > 3)) collect(child); else queue.push(child); } };
    collect(scene);
    const seen = new Set<THREE.Material>();
    let slice = performance.now();
    for (const chunk of queue) {
      if (disposed) return;
      const materials = materialsOf(chunk);
      if (!materials.size || [...materials].every(material => seen.has(material))) continue;
      materials.forEach(material => seen.add(material));
      renderer.setRenderTarget(target()); renderer.compile(chunk, camera, scene); renderer.setRenderTarget(null);
      if (performance.now() - slice > 10) { await new Promise(resolve => setTimeout(resolve, 0)); slice = performance.now(); }
    }
  }
  void (async () => {
    await Promise.all([world.assetReady, drive.ready, roam.ready]);
    if (disposed) return;
    compiling = true;
    let restore = drive.warmup(), restoreRoam = roam.warmup();
    try {
      performance.mark('city:compile-start');
      await compileGradually();
      // Programs depend on where they draw: the composer renders into an HDR target, so compile for that
      // target, not the screen. A full pass then catches anything left (meshes that carry lights, fonts and
      // late assets) and waits for the GPU; repeat until nothing new appears.
      for (let pass = 0, known = -1; pass < 4 && !disposed; pass++) {
        const count = renderer.info.programs?.length ?? 0;
        if (count === known) break;
        known = count;
        const parked = scene.children.map((child, index) => ({ child, index })).filter(({ child }) => retired(child));
        parked.forEach(({ child }) => scene.remove(child));
        renderer.setRenderTarget(target());
        const compiled = renderer.compileAsync(scene, camera);
        renderer.setRenderTarget(null);
        parked.forEach(({ child, index }) => { scene.add(child); scene.children.splice(scene.children.indexOf(child), 1); scene.children.splice(index, 0, child); });
        await compiled;
      }
      performance.mark('city:compiled');
    }
    finally { restore(); restoreRoam(); compiling = false; }
    if (disposed) { releaseGpu(); return; }
    setStage(1);
    // Hold until the logo is complete and still, then draw the first city frame. That frame links the shadow
    // programs and uploads textures, a short pause that cannot be seen on a motionless logo. The loader is
    // redrawn in the same task, so the city frame itself never reaches the screen.
    await new Promise<void>(resolve => { const wait = () => (disposed || (shown >= 1 && buildClock >= CREST_TIMING.done) ? resolve() : setTimeout(wait, 30)); wait(); });
    if (disposed) { releaseGpu(); return; }
    compiling = true;
    // Metal, glass, paint and wet ground reflect the finished city at full power. The snapshot is taken
    // before the warm frame, so the materials pick up the new map behind the still logo too.
    if (composer) {
      cityReflections = captureCityEnvironment(renderer, scene, new THREE.Vector3(-5, 10, 12));
      scene.environment = cityReflections.texture; scene.environmentIntensity = .75; performance.mark('city:reflections');
    }
    restore = drive.warmup(); restoreRoam = roam.warmup();
    try { if (composer) composer.render(0); else renderer.render(scene, camera); performance.mark('city:warm-frame'); }
    finally { restore(); restoreRoam(); compiling = false; }
    if (disposed) { releaseGpu(); return; }
    loaderLast = performance.now(); loaderFrame();
    world.setPower({ zones: [0, 0, 0, 0, 0], ripple: 0, windows: 1, neon: 0, signs: 0 });
    for (let i = 0; i < 6; i++) motes.setPower(i, 0);
    // The welcome text forms where the page lays out its headline.
    if (!skipReveal) introText.sample(shell.querySelector<HTMLElement>('[data-particle-heading]'), host, ratio);
    revealStart = -2; publishArrival({ phase: 'reveal', progress: 1, time: 0 }); host.dataset.arrival = 'reveal';
    warmed = true; visibility();
  })().catch(() => { if (disposed) releaseGpu(); else callbacks.onFailure(); });
  // Browser tests read actual world state (animation, pause) through the scene graph.
  (window as unknown as { __cityDebug?: { scene: THREE.Scene; camera: THREE.PerspectiveCamera } }).__cityDebug = { scene, camera };
  host.dataset.quality = software ? 'software' : mobile ? 'mobile' : 'desktop';
  host.dataset.people = String(world.lifeCounts.people); host.dataset.athletes = String(world.lifeCounts.athletes); host.dataset.stands = String(world.lifeCounts.stands);

  return {
    setState, overview, zoom, roamInput: roam.input, roamCommand: roam.command,
    getPose: () => ({ position: camera.position.toArray(), target: controls.target.toArray() }),
    /** Sparks over a point in the city, used by mission previews. */
    burst(at: THREE.Vector3, color: string) { sparks.emit(at, color, 60, 10, elapsed); },
    dispose() {
      if (disposed) return; disposed = true;
      setDampedProgress(false);
      if (arrivalState().phase !== 'settled') publishArrival({ phase: 'settled', progress: 1 });
      savePose(); renderer.setAnimationLoop(null); cameraTween?.kill(); unobserveJourney(); context.revert(); controls.removeEventListener('end', savePose); controls.dispose(); resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', cancelPointer);
      window.removeEventListener('pointermove', pointerMove); window.removeEventListener('wheel', rushInput); window.removeEventListener('touchstart', rushInput); window.removeEventListener('keydown', rushInput); window.removeEventListener('wheel', skip); window.removeEventListener('touchstart', skip); window.removeEventListener('keydown', skip);
      canvas.removeEventListener('keydown', keydown); canvas.removeEventListener('webglcontextlost', contextLost); document.removeEventListener('visibilitychange', visibility);
      if (!compiling) releaseGpu();
      delete document.documentElement.dataset.cityAssets;
      delete (window as unknown as { __cityDebug?: unknown }).__cityDebug;
    },
  };
}
