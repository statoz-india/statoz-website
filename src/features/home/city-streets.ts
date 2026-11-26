import { PAVEMENT, ROAD_HALF_X, ROAD_HALF_Z, STREETS_X, STREETS_Z } from './city-roads';

/**
 * Shared street rules for cars and people: signal phases at the sixteen junctions, the left-hand
 * lane offset, and the pavement graph people route across (crossings sit on the painted zebras).
 */
export type Phase = 'ew' | 'ns' | null;
/** Lane centre from the street's centre line. Traffic keeps to the left, as the coupe does. */
export const LANE = 1.8;
const CYCLE = 18, GREEN = 7.5, CLEAR = 1.5;

/** Which axis may move at junction (ix, iz): east-west, north-south, or neither (all-red clearance). */
export function junctionPhase(ix: number, iz: number, time: number): Phase {
  const t = ((time + ix * 4.7 + iz * 2.9) % CYCLE + CYCLE) % CYCLE;
  return t < GREEN ? 'ew' : t < GREEN + CLEAR ? null : t < CYCLE - CLEAR ? 'ns' : null;
}

/** What a signal head facing traffic on `axis` shows: green while that axis moves, amber in the clearance after it. */
export function signalLamp(ix: number, iz: number, time: number, axis: 'ew' | 'ns'): 'green' | 'amber' | 'red' {
  const t = ((time + ix * 4.7 + iz * 2.9) % CYCLE + CYCLE) % CYCLE, start = axis === 'ew' ? 0 : GREEN + CLEAR;
  const local = ((t - start) % CYCLE + CYCLE) % CYCLE;
  return local < GREEN ? 'green' : local < GREEN + CLEAR ? 'amber' : 'red';
}

/** Small deterministic generator, so the city's cast and traffic are the same on every visit. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0; let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** True when (x, z) is on carriageway rather than pavement. */
export function onRoad(x: number, z: number) {
  return STREETS_X.some(sx => Math.abs(x - sx) < ROAD_HALF_X) || STREETS_Z.some(sz => Math.abs(z - sz) < ROAD_HALF_Z);
}

export type Crossing = { ix: number; iz: number; axis: 'ew' | 'ns'; x: number; z: number };
export type WalkLink = { to: number; length: number; crossing?: Crossing };
export type WalkNode = { id: number; x: number; z: number; links: WalkLink[]; weight: number };

const PX = ROAD_HALF_X + PAVEMENT / 2, PZ = ROAD_HALF_Z + PAVEMENT / 2;

/**
 * Corners sit where an east-west pavement runs through the corner square of each junction. Pavements
 * link neighbouring corners; zebra crossings link the corners either side of a road, just outside the
 * junction box. `splits` adds a node part-way along an east-west pavement, where a walkway joins it.
 */
export function pavementGraph(hotspots: readonly (readonly [number, number])[], splits: readonly { iz: number; side: -1 | 1; x: number }[], walkways: readonly (readonly [number, number])[][]) {
  const nodes: WalkNode[] = [], corner = new Map<string, number>();
  const add = (x: number, z: number) => {
    const near = hotspots.reduce((best, [hx, hz]) => Math.min(best, Math.hypot(hx - x, hz - z)), Infinity);
    nodes.push({ id: nodes.length, x, z, links: [], weight: 1 + 3 * Math.exp(-(near * near) / 1800) }); return nodes.length - 1;
  };
  const link = (a: number, b: number, crossing?: Crossing) => {
    const length = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].z - nodes[b].z);
    nodes[a].links.push({ to: b, length, crossing }); nodes[b].links.push({ to: a, length, crossing });
  };
  STREETS_X.forEach((x, ix) => STREETS_Z.forEach((z, iz) => { for (const sx of [-1, 1]) for (const sz of [-1, 1]) corner.set(`${ix},${iz},${sx},${sz}`, add(x + sx * PX, z + sz * PZ)); }));
  const at = (ix: number, iz: number, sx: number, sz: number) => corner.get(`${ix},${iz},${sx},${sz}`)!;
  // East-west pavements, with any walkway junctions inserted in order along them.
  STREETS_Z.forEach((z, iz) => { for (const sz of [-1, 1] as const) for (let ix = 0; ix < STREETS_X.length - 1; ix++) {
    const from = at(ix, iz, 1, sz), to = at(ix + 1, iz, -1, sz);
    const inserted = splits.filter(s => s.iz === iz && s.side === sz && s.x > nodes[from].x && s.x < nodes[to].x).sort((a, b) => a.x - b.x).map(s => add(s.x, z + sz * PZ));
    [from, ...inserted, to].reduce((a, b) => { link(a, b); return b; });
  } });
  // North-south pavements.
  STREETS_X.forEach((_, ix) => { for (const sx of [-1, 1]) for (let iz = 0; iz < STREETS_Z.length - 1; iz++) link(at(ix, iz, sx, 1), at(ix, iz + 1, sx, -1)); });
  // Zebras: across each north-south road (walkers move east-west, so they cross on the east-west phase), and the reverse.
  STREETS_X.forEach((x, ix) => STREETS_Z.forEach((z, iz) => {
    for (const sz of [-1, 1]) link(at(ix, iz, -1, sz), at(ix, iz, 1, sz), { ix, iz, axis: 'ew', x, z: z + sz * PZ });
    for (const sx of [-1, 1]) link(at(ix, iz, sx, -1), at(ix, iz, sx, 1), { ix, iz, axis: 'ns', x: x + sx * PX, z });
  }));
  // Walkways through blocks join the pavement nodes nearest their ends.
  for (const way of walkways) {
    const ids = way.map(([x, z]) => nodes.find(node => Math.hypot(node.x - x, node.z - z) < .01)?.id ?? add(x, z));
    ids.reduce((a, b) => { link(a, b); return b; });
  }
  return nodes;
}

/** A* across the pavement graph. Crossings cost a little more, so people do not zig-zag across roads. */
export function walkRoute(nodes: WalkNode[], from: number, to: number) {
  const g = new Map<number, number>([[from, 0]]), came = new Map<number, number>(), open = new Set([from]);
  const h = (id: number) => Math.hypot(nodes[id].x - nodes[to].x, nodes[id].z - nodes[to].z);
  while (open.size) {
    let current = -1, best = Infinity;
    for (const id of open) { const f = g.get(id)! + h(id); if (f < best) { best = f; current = id; } }
    if (current === to) { const path = [to]; while (came.has(path[0])) path.unshift(came.get(path[0])!); return path; }
    open.delete(current);
    for (const next of nodes[current].links) {
      const cost = g.get(current)! + next.length + (next.crossing ? 6 : 0);
      if (cost < (g.get(next.to) ?? Infinity)) { g.set(next.to, cost); came.set(next.to, current); open.add(next.to); }
    }
  }
  return [from];
}
