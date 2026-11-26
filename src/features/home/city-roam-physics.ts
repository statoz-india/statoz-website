import { bodySeparation, playerBody, type CityBody, type CityContact } from './city-contact';
/** Small, deterministic collision layer shared by keyboard, touch and gamepad input. */
export type CitySolid = { minX: number; maxX: number; minZ: number; maxZ: number; minY: number; maxY: number };
/** A raised playing surface (a rectangle, or an ellipse when `round`) whose top is `y`. */
export type RoamFloor = { x: number; z: number; halfX: number; halfZ: number; round: boolean; y: number };
export const ROAM_BOUNDS = { minX: -116, maxX: 116, minZ: -96, maxZ: 164 };
// Start in the northbound left lane, clear of oncoming traffic at x = -15.2.
export const ROAM_SPAWN = { x: -18.8, z: 70, heading: 0 };

/** Whether a circle of `radius` at (x, z) overlaps the floor. */
function onFloor(floor: RoamFloor, x: number, z: number, radius = 0) {
  if (floor.round) return Math.hypot((x - floor.x) / (floor.halfX + radius), (z - floor.z) / (floor.halfZ + radius)) <= 1;
  return Math.abs(x - floor.x) <= floor.halfX + radius && Math.abs(z - floor.z) <= floor.halfZ + radius;
}

export function createRoamSpace(solids: CitySolid[], floors: readonly RoamFloor[] = []) {
  const cells = new Map<string, CitySolid[]>(), cellSize = 8;
  for (const solid of solids) {
    if (solid.maxX - solid.minX > 240 || solid.maxZ - solid.minZ > 260) continue;
    for (let x = Math.floor(solid.minX / cellSize); x <= Math.floor(solid.maxX / cellSize); x++) for (let z = Math.floor(solid.minZ / cellSize); z <= Math.floor(solid.maxZ / cellSize); z++) {
      const key = x + '/' + z; if (!cells.has(key)) cells.set(key, []); cells.get(key)!.push(solid);
    }
  }
  let bodies: readonly CityBody[] = [], contact: CityContact | null = null;
  function dynamicHit(x: number, z: number, heading: number, car: boolean, from?: { x: number; z: number }) {
    const shape = playerBody(x, z, heading, car, car ? 0 : floorAt(x, z));
    for (const other of bodies) {
      if (other.id === shape.id) continue;
      const result = bodySeparation(shape, other);
      if (result.gap >= -.002) continue;
      if (from && result.gap >= bodySeparation({ ...shape, x: from.x, z: from.z }, other).gap - 1e-6) continue;
      return { id: other.id, kind: other.kind, x: result.x, z: result.z, nx: result.nx, nz: result.nz, speed: 0 } satisfies CityContact;
    }
    return null;
  }
  function staticClear(x: number, z: number, radius: number, height = 1.8) {
    if (x - radius < ROAM_BOUNDS.minX || x + radius > ROAM_BOUNDS.maxX || z - radius < ROAM_BOUNDS.minZ || z + radius > ROAM_BOUNDS.maxZ) return false;
    for (let gx = Math.floor((x - radius) / cellSize); gx <= Math.floor((x + radius) / cellSize); gx++) for (let gz = Math.floor((z - radius) / cellSize); gz <= Math.floor((z + radius) / cellSize); gz++) {
      for (const solid of cells.get(gx + '/' + gz) || []) {
        if (solid.minY > height || solid.maxY < .48) continue;
        const dx = x - Math.max(solid.minX, Math.min(x, solid.maxX)), dz = z - Math.max(solid.minZ, Math.min(z, solid.maxZ));
        if (dx * dx + dz * dz < radius * radius) return false;
      }
    }
    return true;
  }
  function carClear(x: number, z: number, heading: number, from?: { x: number; z: number }) {
    const hit = dynamicHit(x, z, heading, true, from);
    if (hit) { contact = hit; return false; }
    for (const offset of [-1.25, 0, 1.25]) {
      const px = x + Math.sin(heading) * offset, pz = z + Math.cos(heading) * offset;
      // Pitches, courts and the circuit are for people: the car stops at their edge.
      if (!staticClear(px, pz, 1.05, 1.5) || floors.some(floor => onFloor(floor, px, pz, 1.05))) return false;
    }
    return true;
  }
  /** The height people stand at: the top of a playing surface, or 0 on the street. */
  function floorAt(x: number, z: number) { let y = 0; for (const floor of floors) if (floor.y > y && onFloor(floor, x, z)) y = floor.y; return y; }
  function clear(x: number, z: number, radius: number, height = 1.8) { return staticClear(x, z, radius, height) && !dynamicHit(x, z, 0, false); }
  function move(position: { x: number; z: number }, dx: number, dz: number, heading: number, car: boolean) {
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / .25));
    let blocked = false; contact = null;
    const free = (x: number, z: number) => {
      if (car) return carClear(x, z, heading, position);
      const hit = dynamicHit(x, z, heading, false, position);
      if (hit) { contact = hit; return false; }
      return staticClear(x, z, .36);
    };
    for (let step = 0; step < steps; step++) {
      const nx = position.x + dx / steps, nz = position.z + dz / steps;
      if (free(nx, nz)) { position.x = nx; position.z = nz; }
      else if (!car) {
        if (free(nx, position.z)) position.x = nx;
        if (free(position.x, nz)) position.z = nz;
        blocked = true;
      } else { blocked = true; break; }
    }
    return blocked;
  }
  // Collision spring arm: sample the view segment against the same authored solids.
  function cameraDistance(from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }) {
    const length = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
    for (let distance = .8; distance < length; distance += .3) {
      const t = distance / length, x = from.x + (to.x - from.x) * t, y = from.y + (to.y - from.y) * t, z = from.z + (to.z - from.z) * t;
      for (const solid of cells.get(Math.floor(x / cellSize) + '/' + Math.floor(z / cellSize)) || []) {
        if (x >= solid.minX - .3 && x <= solid.maxX + .3 && z >= solid.minZ - .3 && z <= solid.maxZ + .3 && y > solid.minY - .2 && y < solid.maxY + .25) return Math.max(.65, distance - .5) / length;
      }
    }
    return 1;
  }
  return { clear, carClear, move, cameraDistance, floorAt, setBodies(next: readonly CityBody[]) { bodies = next; }, contact: () => contact, count: solids.length };
}
