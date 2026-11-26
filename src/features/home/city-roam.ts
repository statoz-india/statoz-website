import * as THREE from 'three';
import { bodySeparation, playerBody, type CityBody, type CityContact } from './city-contact';
import { CITY_LOCATIONS, CITY_PALETTE as P, type CityLocationId } from './city-config';
import { createDriveCar, DRIVER_EYE } from './city-drive-car';
import { createRoamSpace, ROAM_SPAWN, type CitySolid, type RoamFloor } from './city-roam-physics';
import { loadPeople } from './city-kenney';

export type RoamAction = 'forward' | 'back' | 'left' | 'right' | 'boost' | 'brake';
export type RoamCommand = 'vehicle' | 'visit' | 'reset' | 'camera';
export type RoamStatus = { vehicle: 'car' | 'avatar'; speed: number; x: number; z: number; carX: number; carZ: number; heading: number; near: CityLocationId | null; canEnter: boolean; blocked: boolean; contact?: string };
const BINDINGS: Record<string, RoamAction> = { KeyW: 'forward', ArrowUp: 'forward', KeyS: 'back', ArrowDown: 'back', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', ShiftLeft: 'boost', ShiftRight: 'boost', Space: 'brake' };
const COMMANDS: Record<string, RoamCommand> = { KeyE: 'vehicle', KeyF: 'visit', KeyR: 'reset', KeyC: 'camera' };
const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

/** One controller owns player input and the chase camera only while free roam is active. */
export function createCityRoam(scene: THREE.Scene, camera: THREE.PerspectiveCamera, host: HTMLElement, options: { onStatus: (status: RoamStatus) => void; onVisit: (id: CityLocationId) => void; onExit: () => void; onContact?: (contact: CityContact) => void }) {
  const canvas = host.querySelector('canvas')!;
  const car = createDriveCar(); car.group.name = 'free-roam-car'; scene.add(car.group, car.trail); car.setLights(1);
  const avatar = new THREE.Group(); avatar.name = 'free-roam-avatar'; scene.add(avatar);
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = avatar) => {
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };
  // On foot the visitor is a Kenney Mini Character that idles, walks and sprints with their speed.
  let rig: { mixer: THREE.AnimationMixer; play(clip: 'idle' | 'walk' | 'sprint', fade?: number): void } | null = null;
  const avatarReady = loadPeople().then(kit => {
    const character = kit.character('female-c'); character.root.scale.setScalar(1.95 * .75 / kit.height); // matches the city's people (city-life SIZE)
    character.root.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.frustumCulled = false; } });
    avatar.add(character.root); character.play('idle', 0); rig = character;
  }).catch(() => undefined);
  const ring = add(new THREE.RingGeometry(.42, .47, 32), new THREE.MeshBasicMaterial({ color: P.cyan, transparent: true, opacity: .7, side: THREE.DoubleSide, depthWrite: false }), 0, .015, 0);
  ring.rotation.x = -Math.PI / 2;
  const position = new THREE.Vector3(ROAM_SPAWN.x, .16, ROAM_SPAWN.z), parked = position.clone();
  const target = new THREE.Vector3(), desired = new THREE.Vector3(), look = new THREE.Vector3();
  const waypoint = new THREE.Vector3(), waypointView = new THREE.Vector3();
  const shell = host.closest<HTMLElement>('[data-scene-status]')!;
  let space = createRoamSpace([]), active = false, suspended = false, driving = true, speed = 0, heading = 0, parkedHeading = 0;
  let distance = 0, phase = 0, yaw = 0, pitch = .38, lastLook = 0, reportAt = 0, blocked = false, near: CityLocationId | null = null;
  let drag: { id: number; x: number; y: number } | null = null, started = false, cameraMode = 0;
  const contactTimes = new Map<string, number>();
  let dynamicBodies: readonly CityBody[] = [];
  let contactMessage = '', contactUntil = 0, simulationTime = 0, impulse = 0, recover = 0, contactCount = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function receiveContact(contact: CityContact) {
    const time = simulationTime;
    if (suspended || contactTimes.has(contact.id) || contact.speed < .15) return;
    const other = dynamicBodies.find(body => body.id === contact.id);
    // A bump against the parked coupe should not shake a visitor walking elsewhere.
    if (other && bodySeparation(playerBody(position.x, position.z, heading, driving, position.y), other).gap > .5) return;
    contactTimes.set(contact.id, time); contactCount++;
    const strength = Math.min(1, contact.speed / 16); impulse = Math.max(impulse, .16 + strength * .65); recover = .16;
    contactMessage = contact.kind === 'person' ? driving ? 'Give people space.' : 'Excuse me! Make a little room.' : contact.kind === 'vehicle' ? 'Vehicle contact. Check your surroundings.' : 'Easy. Turn or reverse to get clear.';
    contactUntil = time + 1.5;
    if (driving) speed = 0;
    host.dataset.roamContacts = String(contactCount); host.dataset.roamContactKind = contact.kind;
    options.onContact?.(contact); report();
  }
  const keys = new Set<string>(), touch = new Set<RoamAction>();
  const clearInput = () => { keys.clear(); touch.clear(); drag = null; speed = 0; };
  const held = (action: RoamAction) => touch.has(action) || [...keys].some(code => BINDINGS[code] === action);
  const canEnter = () => !driving && Math.hypot(position.x - parked.x, position.z - parked.z) < 4.4;
  function report() {
    const status: RoamStatus = { vehicle: driving ? 'car' : 'avatar', speed: Math.round(Math.abs(speed) * 3.6), x: position.x, z: position.z, carX: parked.x, carZ: parked.z, heading, near, canEnter: canEnter(), blocked, contact: simulationTime < contactUntil ? contactMessage : undefined };
    options.onStatus(status);
    host.dataset.roamVehicle = status.vehicle; host.dataset.roamPosition = `${position.x.toFixed(2)},${position.z.toFixed(2)}`;
    host.dataset.roamSpeed = String(status.speed); host.dataset.roamBlocked = String(blocked); host.dataset.roamNear = near || '';
  }
  function reset() { contactTimes.clear(); contactUntil = 0; impulse = 0; recover = 0; clearInput(); parked.set(ROAM_SPAWN.x, .16, ROAM_SPAWN.z); position.copy(parked); if (!driving) position.x -= 2.8; heading = ROAM_SPAWN.heading; parkedHeading = heading; yaw = heading; pitch = .38; speed = 0; blocked = false; car.group.position.copy(parked); car.group.rotation.y = heading; car.resetTrail(); report(); }
  function command(command: RoamCommand) {
    if (!active || suspended) return;
    if (command === 'reset') { reset(); return; }
    if (command === 'camera') { cameraMode = (cameraMode + 1) % (driving ? 3 : 2); return; }
    if (command === 'visit') { if (near) { clearInput(); options.onVisit(near); } return; }
    cameraMode = 0;
    if (driving) {
      speed = 0;
      const candidates = [[-2.8, 0], [2.8, 0], [0, 3.8], [0, -3.8]];
      const exit = candidates.map(([x, z]) => ({ x: position.x + x * Math.cos(heading) + z * Math.sin(heading), z: position.z - x * Math.sin(heading) + z * Math.cos(heading) })).find(point => space.clear(point.x, point.z, .4));
      if (!exit) { blocked = true; report(); return; }
      parked.copy(position); parkedHeading = heading; position.set(exit.x, .16, exit.z); driving = false;
    } else if (canEnter()) { position.copy(parked); heading = parkedHeading; driving = true; }
    // Restore the complete exterior when parking; the avatar branch does not animate the car.
    car.setRoofOpen(false); car.update(distance, 0, 0, 0, 0, 0); car.driver.visible = driving;
    speed = 0; report();
  }
  function keyDown(event: KeyboardEvent) {
    if (!active || suspended || event.altKey || event.metaKey || event.ctrlKey || (event.target instanceof Element && event.target.closest('input,textarea,select,dialog,[contenteditable=true]'))) return;
    if (event.target instanceof HTMLButtonElement && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) return;
    if (BINDINGS[event.code]) { event.preventDefault(); event.stopPropagation(); keys.add(event.code); }
    else if (COMMANDS[event.code]) { event.preventDefault(); if (!event.repeat) command(COMMANDS[event.code]); }
    else if (event.code === 'Escape') { event.preventDefault(); options.onExit(); }
  }
  const keyUp = (event: KeyboardEvent) => { keys.delete(event.code); };
  const blur = () => clearInput();
  const pointerDown = (event: PointerEvent) => { if (!active || suspended || event.button !== 0) return; canvas.focus({ preventScroll: true }); drag = { id: event.pointerId, x: event.clientX, y: event.clientY }; canvas.setPointerCapture(event.pointerId); };
  const pointerMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    yaw -= (event.clientX - drag.x) * .006; pitch = THREE.MathUtils.clamp(pitch + (event.clientY - drag.y) * .004, .12, .85);
    drag.x = event.clientX; drag.y = event.clientY; lastLook = performance.now();
  };
  const pointerUp = (event: PointerEvent) => { if (drag?.id === event.pointerId) { drag = null; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); } };
  const lostPointer = () => { drag = null; };
  const visibility = () => { if (document.hidden) clearInput(); };
  window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp); window.addEventListener('blur', blur); document.addEventListener('visibilitychange', visibility);
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerUp); canvas.addEventListener('lostpointercapture', lostPointer);
  car.setVisible(false); avatar.visible = false;
  return {
    ready: Promise.all([car.ready, avatarReady]),
    warmup() {
      const saved: { object: THREE.Object3D; visible: boolean; culled: boolean }[] = [];
      for (const root of [car.group, car.trail, avatar]) root.traverse(object => { saved.push({ object, visible: object.visible, culled: object.frustumCulled }); object.visible = true; object.frustumCulled = false; });
      return () => saved.forEach(({ object, visible, culled }) => { object.visible = visible; object.frustumCulled = culled; });
    },
    setBodies(bodies: readonly CityBody[]) { dynamicBodies = bodies; space.setBodies(bodies); },
    receiveContact,
    bodies() {
      if (!active) return [];
      const coupe = playerBody(parked.x, parked.z, parkedHeading, true);
      if (driving) { coupe.vx = -Math.sin(heading) * speed; coupe.vz = -Math.cos(heading) * speed; return [coupe]; }
      const visitor = playerBody(position.x, position.z, heading, false, position.y);
      visitor.vx = -Math.sin(heading) * speed; visitor.vz = -Math.cos(heading) * speed;
      return [coupe, visitor];
    },
    setSolids(solids: CitySolid[], floors: readonly RoamFloor[] = []) { space = createRoamSpace(solids, floors); host.dataset.roamSolids = String(space.count); },
    setActive(value: boolean, paused: boolean) {
      if (active !== value || suspended !== paused) clearInput();
      if (value && !active) { if (!started) { reset(); started = true; } yaw = heading; camera.fov = 58; camera.updateProjectionMatrix(); canvas.focus({ preventScroll: true }); }
      active = value; suspended = paused; car.setVisible(value); avatar.visible = value && !driving;
      host.dataset.roamActive = String(value); canvas.style.touchAction = value ? 'none' : 'pan-y pinch-zoom';
    },
    input(action: RoamAction, pressed: boolean) { if (!active || suspended) return; if (pressed) touch.add(action); else touch.delete(action); },
    command,
    position: () => ({ x: position.x, z: position.z }),
    vehiclePosition: () => ({ x: parked.x, z: parked.z }),
    /** Place the visit affordance over its destination, or on the matching screen edge. */
    projectWaypoint(width: number, height: number) {
      const marker = shell.querySelector<HTMLElement>('[data-roam-waypoint]');
      if (!marker) return;
      const place = CITY_LOCATIONS.find(place => place.id === near);
      if (!active || suspended || !place || marker.dataset.target !== place.id) { marker.style.visibility = 'hidden'; return; }
      camera.updateMatrixWorld();
      waypoint.set(place.position[0], place.category === 'sport' ? 4 : 5.5, place.position[2]);
      waypointView.copy(waypoint).applyMatrix4(camera.matrixWorldInverse);
      waypoint.project(camera);
      const halfW = marker.offsetWidth / 2 + 16, halfH = marker.offsetHeight / 2 + 12;
      const mobile = width <= 700, touch = !!shell.querySelector('[data-roam-touch-controls]');
      const left = halfW, right = Math.max(left, width - halfW);
      const top = Math.min(height * .4, 108 + halfH);
      // Seated HUD markers stay in the windshield, clear of the physical GPS screen below.
      const bottom = Math.max(top, (driving && cameraMode === 2 ? height * .42 : height - (height < 540 ? 120 : mobile && touch ? 285 : 165)) - halfH);
      let x = (waypoint.x + 1) * width / 2, y = (1 - waypoint.y) * height / 2;
      let dx = x - width / 2, dy = y - height / 2;
      const behind = waypointView.z >= -.1;
      if (behind) { dx = -dx; dy = -dy; if (Math.hypot(dx, dy) < 1) dy = 1; }
      const offscreen = behind || waypoint.z < -1 || waypoint.z > 1 || x < left || x > right || y < top || y > bottom;
      if (offscreen) {
        const cx = width / 2, cy = THREE.MathUtils.clamp(height / 2, top, bottom);
        const tx = dx > 0 ? (right - cx) / dx : dx < 0 ? (left - cx) / dx : Infinity;
        const ty = dy > 0 ? (bottom - cy) / dy : dy < 0 ? (top - cy) / dy : Infinity;
        const t = Math.min(tx, ty);
        x = cx + dx * t; y = cy + dy * t;
      }
      marker.style.left = x.toFixed(1) + 'px'; marker.style.top = y.toFixed(1) + 'px';
      marker.style.setProperty('--waypoint-angle', Math.atan2(dy, dx).toFixed(4) + 'rad');
      marker.dataset.offscreen = String(offscreen); marker.dataset.location = place.id;
      marker.style.visibility = 'visible';
    },
    update(dt: number, time: number) {
      if (!active) return;
      dt = Math.min(dt, .05);
      // Manual movement and feedback keep their clock when ambient motion is reduced.
      if (!suspended) simulationTime += dt;
      if (!suspended) {
        const body = playerBody(position.x, position.z, heading, driving, position.y);
        for (const [id] of contactTimes) {
          const other = dynamicBodies.find(body => body.id === id);
          if (id === 'world' ? !blocked : !other || bodySeparation(body, other).gap > .3) contactTimes.delete(id);
        }
      }
      if (!suspended) { impulse = Math.max(0, impulse - dt * 2.8); recover = Math.max(0, recover - dt); }
      let forward = Number(held('forward')) - Number(held('back')), steer = Number(held('left')) - Number(held('right'));
      const pad = navigator.getGamepads?.()[0];
      if (pad && !suspended) { const dead = (v: number) => Math.abs(v) < .18 ? 0 : v; forward ||= -dead(pad.axes[1] || 0); steer ||= -dead(pad.axes[0] || 0); }
      if (suspended) { forward = 0; steer = 0; speed = 0; }
      const cockpitView = driving && cameraMode === 2;
      host.dataset.roamCamera = cockpitView ? 'cockpit' : cameraMode === 1 ? 'near' : 'chase';
      if (driving) {
        const goal = recover > 0 ? 0 : forward * (forward < 0 ? 6 : held('boost') ? 20 : 14);
        const rate = held('brake') ? 12 : forward ? 2 : 3;
        speed += ((held('brake') ? 0 : goal) - speed) * (1 - Math.exp(-rate * dt));
        if (Math.abs(speed) < .035) speed = 0;
        const nextHeading = heading + steer * THREE.MathUtils.clamp(speed / 7, -1.1, 1.1) * dt;
        if (space.carClear(position.x, position.z, nextHeading)) heading = nextHeading;
        blocked = space.move(position, -Math.sin(heading) * speed * dt, -Math.cos(heading) * speed * dt, heading, true);
        if (blocked) {
          const hit = space.contact();
          const impact = hit ? Math.max(0, speed * (Math.sin(heading) * hit.nx + Math.cos(heading) * hit.nz)) : Math.abs(speed);
          receiveContact(hit ? { ...hit, speed: Math.max(impact, Math.abs(speed)) } : { id: 'world', kind: 'world', x: position.x - Math.sin(heading) * 2.2, z: position.z - Math.cos(heading) * 2.2, nx: Math.sin(heading), nz: Math.cos(heading), speed: impact });
          speed = 0;
        }
        distance += speed * dt; parked.copy(position); parkedHeading = heading;
        car.group.position.copy(position); car.group.rotation.y = heading;
        car.setRoofOpen(cockpitView);
        if (!suspended) car.update(distance, steer * .4, cockpitView ? 1 : 0, Math.abs(speed), dt, time);
        if (cockpitView) car.paintNavigation({ x: position.x, z: position.z, heading, speed, destination: near ? CITY_LOCATIONS.find(place => place.id === near)!.name : 'Explore StatOz City' });
        if (!drag && performance.now() - lastLook > 1800 && Math.abs(speed) > .5) yaw += wrap(heading - yaw) * (1 - Math.exp(-dt * 2.2));
      } else {
        const norm = Math.max(1, Math.hypot(forward, steer)), pace = held('boost') ? 7 : 3.5;
        const dx = (-Math.sin(yaw) * forward - Math.cos(yaw) * steer) / norm * pace * dt;
        const dz = (-Math.cos(yaw) * forward + Math.sin(yaw) * steer) / norm * pace * dt;
        const beforeX = position.x, beforeZ = position.z;
        blocked = space.move(position, dx, dz, heading, false);
        const hit = space.contact();
        if (hit && blocked) receiveContact({ ...hit, speed: Math.hypot(dx, dz) / Math.max(dt, .001) });
        const px = position.x - parked.x, pz = position.z - parked.z;
        // The parked coupe is still solid when the visitor steps out.
        if (Math.abs(px * Math.cos(parkedHeading) - pz * Math.sin(parkedHeading)) < 1.35 && Math.abs(px * Math.sin(parkedHeading) + pz * Math.cos(parkedHeading)) < 2.7) { position.x = beforeX; position.z = beforeZ; blocked = true; }
        speed = dt ? Math.hypot(position.x - beforeX, position.z - beforeZ) / dt : 0;
        if (speed > .1) heading += wrap(Math.atan2(-dx, -dz) - heading) * (1 - Math.exp(-dt * 14));
        if (!suspended) phase += speed * dt * 2.4;
        // Stand on courts, pitches and the circuit rather than sinking into them.
        position.y = Math.max(.16, space.floorAt(position.x, position.z) + .04);
        avatar.position.copy(position); avatar.rotation.y = heading;
        rig?.play(speed > 4.5 ? 'sprint' : speed > .35 ? 'walk' : 'idle');
        if (!suspended) rig?.mixer.update(dt);
      }
      if (!reduced) {
        car.bodywork.rotation.z = Math.sin(time * 29) * impulse * .025;
        avatar.rotation.z = Math.sin(time * 17) * impulse * .035;
      }
      avatar.visible = !driving;
      car.driver.visible = driving && !cockpitView;
      // Pull the follow camera in before it crosses a building or a stand.
      target.set(position.x, driving ? 1.5 : 1.25, position.z);
      const boom = cameraMode === 1 ? driving ? 7 : 4.5 : driving ? 12 : 7;
      desired.set(target.x + Math.sin(yaw) * Math.cos(pitch) * boom, target.y + Math.sin(pitch) * boom + (driving ? 1 : .4), target.z + Math.cos(yaw) * Math.cos(pitch) * boom);
      // Cast in world coordinates before turning the desired position into a boom vector.
      // Mutating it first tests an unrelated diagonal across the city and pulls the camera
      // into the rear bodywork, even when the actual road behind the car is clear.
      const boomFraction = space.cameraDistance(target, desired);
      desired.sub(target).multiplyScalar(boomFraction).add(target);
      // Follow the desired boom directly after collision; smoothing a blocked pose can cross walls.
      const blend = 1 - Math.exp(-dt * 9);
      camera.position.lerp(desired, blend);
      const safe = space.cameraDistance(target, camera.position); if (safe < 1) camera.position.sub(target).multiplyScalar(safe).add(target);
      look.copy(target); if (driving) { look.x -= Math.sin(heading) * Math.abs(speed) * .12; look.z -= Math.cos(heading) * Math.abs(speed) * .12; }
      camera.lookAt(look);
      if (cockpitView) {
        const portrait = host.clientWidth <= 700;
        desired.copy(DRIVER_EYE); if (portrait) { desired.x -= .23; desired.y += .02; desired.z += .04; }
        look.set((portrait ? -.5 : DRIVER_EYE.x) - Math.sin(THREE.MathUtils.clamp(wrap(yaw - heading), -.7, .7)) * 5, desired.y - (portrait ? 2.25 : 1) - (pitch - .38) * 2, -14);
        car.group.updateMatrixWorld(true); car.group.localToWorld(desired); car.group.localToWorld(look);
        camera.position.copy(desired); camera.lookAt(look);
      }
      if (!reduced && !suspended && impulse > .001) {
        // Shake the rendered camera only; collision and steering stay stable.
        camera.position.x += Math.sin(time * 61) * impulse * .07;
        camera.position.y += Math.sin(time * 47) * impulse * .045;
        camera.lookAt(look);
      }
      const fov = cockpitView ? host.clientWidth <= 700 ? 86 : 70 : 58;
      if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
      near = null; let best = Infinity;
      for (const place of CITY_LOCATIONS) { const distance = Math.hypot(position.x - place.position[0], position.z - place.position[2]); const reach = place.category === 'sport' ? 36 : 16; if (distance < reach && distance / reach < best) { near = place.id; best = distance / reach; } }
      if (performance.now() > reportAt) { report(); reportAt = performance.now() + 120; }
    },
    dispose() {
      car.cancelLoad();
      clearInput(); window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); window.removeEventListener('blur', blur); document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerUp); canvas.removeEventListener('lostpointercapture', lostPointer);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
      for (const root of [car.group, car.trail, avatar]) { root.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); for (const mat of Array.isArray(object.material) ? object.material : [object.material]) { materials.add(mat); for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value); } } }); root.removeFromParent(); }
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); canvas.style.touchAction = 'pan-y pinch-zoom';
    },
  };
}
