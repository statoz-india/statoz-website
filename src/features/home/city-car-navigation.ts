import { CITY_LOCATIONS, CITY_PALETTE as P } from './city-config';
import { STREETS_X, STREETS_Z } from './city-roads';

export type CarNavigation = {
  x: number; z: number; heading: number; speed: number;
  destination: string; remaining?: number;
  route?: readonly { x: number; z: number }[]; progress?: number;
};

/** Physical instrument textures. The map is heading-up and follows real world coordinates. */
export function paintCarNavigation(map: CanvasRenderingContext2D, cluster: CanvasRenderingContext2D, state: CarNavigation, fonts: { display: string; body: string }) {
  const { x, z, heading, speed } = state, width = map.canvas.width, height = map.canvas.height;
  const px = width * .53, py = height * .65, scale = 4.1;
  const cos = Math.cos(heading), sin = Math.sin(heading);
  const project = (wx: number, wz: number) => {
    const dx = wx - x, dz = wz - z;
    return [px + (dx * cos - dz * sin) * scale, py + (dx * sin + dz * cos) * scale] as const;
  };
  map.fillStyle = '#07141f'; map.fillRect(0, 0, width, height);
  map.save(); map.beginPath(); map.rect(0, 68, width, height - 132); map.clip();
  // Quiet blocks around the same street grid, plus the actual grounds from the city manifest.
  map.fillStyle = '#102532'; map.strokeStyle = '#19323e'; map.lineWidth = 1;
  for (let i = 0; i < STREETS_X.length - 1; i++) for (let j = 0; j < STREETS_Z.length - 1; j++) {
    const corners = [[STREETS_X[i] + 8, STREETS_Z[j] + 8], [STREETS_X[i + 1] - 8, STREETS_Z[j] + 8], [STREETS_X[i + 1] - 8, STREETS_Z[j + 1] - 8], [STREETS_X[i] + 8, STREETS_Z[j + 1] - 8]];
    map.beginPath(); corners.forEach(([wx, wz], n) => { const [sx, sy] = project(wx, wz); n ? map.lineTo(sx, sy) : map.moveTo(sx, sy); }); map.closePath(); map.fill(); map.stroke();
  }
  const road = (a: [number, number], b: [number, number]) => { const from = project(...a), to = project(...b); map.beginPath(); map.moveTo(...from); map.lineTo(...to); map.stroke(); };
  map.lineCap = 'round'; map.strokeStyle = '#203e4d'; map.lineWidth = 19;
  for (const wx of STREETS_X) road([wx, -180], [wx, wx === -17 ? 180 : 140]);
  for (const wz of STREETS_Z) road([-180, wz], [180, wz]);
  map.strokeStyle = '#49616b'; map.lineWidth = 2;
  for (const wx of STREETS_X) road([wx, -180], [wx, wx === -17 ? 180 : 140]);
  for (const wz of STREETS_Z) road([-180, wz], [180, wz]);
  for (const place of CITY_LOCATIONS.filter(place => place.category === 'sport' || ['news', 'city-hall', 'download'].includes(place.id))) {
    const [sx, sy] = project(place.position[0], place.position[2]);
    if (sx < -50 || sx > width + 50 || sy < 35 || sy > height - 45) continue;
    map.fillStyle = place.accent; map.globalAlpha = .18;
    map.fillRect(sx - (place.category === 'sport' ? 34 : 16), sy - 18, place.category === 'sport' ? 68 : 32, 36); map.globalAlpha = 1;
    map.fillStyle = '#d2e0e5'; map.textAlign = 'center'; map.font = `500 19px ${fonts.body}`;
    map.fillText(place.name.toUpperCase(), sx, sy - 28);
  }
  const route = state.route;
  if (route?.length) {
    const at = Math.max(0, Math.min(route.length - 1, Math.floor((state.progress || 0) * (route.length - 1))));
    const path = (from: number, to: number, color: string, lineWidth: number) => {
      map.strokeStyle = color; map.lineWidth = lineWidth; map.lineJoin = 'round'; map.beginPath();
      for (let i = from; i <= to; i++) { const point = project(route[i].x, route[i].z); i === from ? map.moveTo(...point) : map.lineTo(...point); } map.stroke();
    };
    path(0, route.length - 1, '#1f4d5d', 11);
    path(at, route.length - 1, P.cyan, 9);
    const end = project(route[route.length - 1].x, route[route.length - 1].z);
    map.fillStyle = P.gold; map.fillRect(end[0] - 6, end[1] - 6, 12, 12);
  }
  // Fixed car arrow; roads, labels and route travel beneath it as the car moves and turns.
  map.fillStyle = '#06111b'; map.strokeStyle = '#d7f8ff'; map.lineWidth = 3;
  map.beginPath(); map.moveTo(px, py - 22); map.lineTo(px + 15, py + 14); map.lineTo(px, py + 7); map.lineTo(px - 15, py + 14); map.closePath(); map.fill(); map.stroke();
  map.fillStyle = P.cyan; map.beginPath(); map.moveTo(px, py - 15); map.lineTo(px + 8, py + 7); map.lineTo(px, py + 3); map.lineTo(px - 8, py + 7); map.closePath(); map.fill();
  map.restore();
  map.fillStyle = '#0b1c29'; map.fillRect(0, 0, width, 68); map.fillRect(0, height - 64, width, 64);
  map.fillStyle = P.cyan; map.font = `600 32px ${fonts.display}`; map.textAlign = 'left'; map.fillText('STATOZ NAV', 26, 45);
  const distance = state.remaining === undefined ? 'FREE DRIVE' : `${Math.max(0, Math.round(state.remaining))} m`;
  map.textAlign = 'right'; map.fillStyle = '#e8f3f7'; map.font = `500 32px ${fonts.body}`; map.fillText(distance, width - 26, 45);
  map.textAlign = 'left'; map.fillStyle = '#d9ebef'; map.font = `500 36px ${fonts.body}`; map.fillText(state.destination, 26, height - 22, width - 190);
  map.textAlign = 'right'; map.fillStyle = P.cyan; map.font = `600 22px ${fonts.body}`; map.fillText('HEADING UP', width - 24, height - 25);

  const cw = cluster.canvas.width, ch = cluster.canvas.height, kmh = Math.round(Math.abs(speed) * 3.6);
  cluster.fillStyle = '#040a10'; cluster.fillRect(0, 0, cw, ch);
  // Analog-inspired dial scales surround a clean digital speed readout.
  for (const [cx, label, fill] of [[cw * .18, 'DRIVE', Math.min(1, kmh / 120)], [cw * .82, 'POWER', Math.min(1, Math.abs(speed) / 20)]] as const) {
    cluster.strokeStyle = '#25404c'; cluster.lineWidth = 3;
    for (let i = 0; i <= 12; i++) {
      const angle = Math.PI * (.8 + i / 12 * 1.4), r = 75;
      cluster.beginPath(); cluster.moveTo(cx + Math.cos(angle) * (r - (i % 3 ? 5 : 12)), 114 + Math.sin(angle) * (r - (i % 3 ? 5 : 12))); cluster.lineTo(cx + Math.cos(angle) * r, 114 + Math.sin(angle) * r); cluster.stroke();
    }
    const angle = Math.PI * (.8 + fill * 1.4);
    cluster.strokeStyle = P.cyan; cluster.lineWidth = 4; cluster.beginPath(); cluster.moveTo(cx, 114); cluster.lineTo(cx + Math.cos(angle) * 59, 114 + Math.sin(angle) * 59); cluster.stroke();
    cluster.fillStyle = '#92abb6'; cluster.textAlign = 'center'; cluster.font = `500 15px ${fonts.body}`; cluster.fillText(label, cx, 223);
  }
  cluster.fillStyle = '#edfaff'; cluster.textAlign = 'center'; cluster.font = `600 94px ${fonts.display}`; cluster.fillText(String(kmh).padStart(2, '0'), cw / 2, 145);
  cluster.fillStyle = '#99b1bc'; cluster.font = `500 21px ${fonts.body}`; cluster.fillText('km/h', cw / 2, 177);
  cluster.fillStyle = P.cyan; cluster.font = `600 20px ${fonts.display}`; cluster.fillText(speed < -.2 ? 'R' : kmh ? 'D' : 'P', cw / 2, 218);
}
