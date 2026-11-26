/** Shared horizontal capsules: a circle for a person, a rounded footprint for a car. */
export type CityBody = {
  id: string; kind: 'vehicle' | 'person'; x: number; z: number; y: number;
  radius: number; halfLength: number; heading: number; vx: number; vz: number;
};
export type CityContact = {
  id: string; kind: CityBody['kind'] | 'world'; x: number; z: number;
  nx: number; nz: number; speed: number; receiver?: 'player' | 'npc';
};
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export function playerBody(x: number, z: number, heading: number, car: boolean, y = 0): CityBody {
  return { id: car ? 'player-car' : 'player-foot', kind: car ? 'vehicle' : 'person', x, z, y, radius: car ? .98 : .36, halfLength: car ? 1.45 : 0, heading, vx: 0, vz: 0 };
}

/** Closest points on two capsule axes, including parallel and zero-length axes. Normal faces B → A. */
export function bodySeparation(a: CityBody, b: CityBody) {
  const ax = Math.sin(a.heading) * a.halfLength, az = Math.cos(a.heading) * a.halfLength;
  const bx = Math.sin(b.heading) * b.halfLength, bz = Math.cos(b.heading) * b.halfLength;
  const a0x = a.x - ax, a0z = a.z - az, b0x = b.x - bx, b0z = b.z - bz;
  const ux = 2 * ax, uz = 2 * az, vx = 2 * bx, vz = 2 * bz, rx = a0x - b0x, rz = a0z - b0z;
  const aa = ux * ux + uz * uz, bb = vx * vx + vz * vz, uv = ux * vx + uz * vz;
  const ur = ux * rx + uz * rz, vr = vx * rx + vz * rz;
  let s = 0, t = 0;
  if (aa < 1e-8) t = bb < 1e-8 ? 0 : clamp(vr / bb);
  else if (bb < 1e-8) s = clamp(-ur / aa);
  else {
    const denom = aa * bb - uv * uv;
    s = denom > 1e-8 ? clamp((uv * vr - ur * bb) / denom) : 0;
    t = (uv * s + vr) / bb;
    if (t < 0) { t = 0; s = clamp(-ur / aa); }
    else if (t > 1) { t = 1; s = clamp((uv - ur) / aa); }
  }
  const px = a0x + ux * s, pz = a0z + uz * s, qx = b0x + vx * t, qz = b0z + vz * t;
  let nx = px - qx, nz = pz - qz;
  const distance = Math.hypot(nx, nz);
  if (distance > 1e-6) { nx /= distance; nz /= distance; }
  else {
    nx = a.x - b.x; nz = a.z - b.z;
    const n = Math.hypot(nx, nz);
    if (n > 1e-6) { nx /= n; nz /= n; } else { nx = Math.cos(b.heading); nz = -Math.sin(b.heading); }
  }
  return { gap: Math.abs(a.y - b.y) > 1.65 ? Infinity : distance - a.radius - b.radius, nx, nz, x: qx + nx * b.radius, z: qz + nz * b.radius };
}

/** Sweeps in short increments. Starting in contact never prevents moving back out. */
export function sweepBody(body: CityBody, dx: number, dz: number, obstacles: readonly CityBody[]) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / .18));
  const trial = { ...body };
  let contact: CityContact | null = null;
  for (let i = 0; i < steps; i++) {
    trial.x += dx / steps; trial.z += dz / steps;
    let hit = false;
    for (const other of obstacles) {
      if (other.id === body.id || Math.max(Math.abs(trial.x - other.x), Math.abs(trial.z - other.z)) > body.halfLength + other.halfLength + body.radius + other.radius + 2) continue;
      const result = bodySeparation(trial, other);
      if (result.gap < -.002 && result.gap < bodySeparation(body, other).gap - 1e-6) {
        hit = true;
        contact = { id: other.id, kind: other.kind, x: result.x, z: result.z, nx: result.nx, nz: result.nz, speed: Math.max(0, -(body.vx - other.vx) * result.nx - (body.vz - other.vz) * result.nz) };
        break;
      }
    }
    if (hit) break;
    body.x = trial.x; body.z = trial.z;
  }
  return contact;
}
