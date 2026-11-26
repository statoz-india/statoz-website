import { memo } from 'react';
import { CITY_LOCATIONS } from './city-config';
import type { RoamStatus } from './city-roam';
import r from './city-roam.module.css';

// A small vector relief of the same district; no second canvas or render loop.
const project = (x: number, z: number, height = 0): [number, number] => [160 + x * .62 - (z - 25) * .5, 86 + x * .21 + (z - 25) * .24 - height];
const points = (corners: number[][], height = 0) => corners.map(([x, z]) => project(x, z, height).join(',')).join(' ');
const plate = [[-116, -98], [116, -98], [116, 170], [-116, 170]];
function Block({ x, z, w, d, h, color }: { x: number; z: number; w: number; d: number; h: number; color?: string }) {
  const corners = [[x - w / 2, z - d / 2], [x + w / 2, z - d / 2], [x + w / 2, z + d / 2], [x - w / 2, z + d / 2]];
  const roof = corners.map(([x, z]) => project(x, z, h)), base = corners.map(([x, z]) => project(x, z));
  return <g stroke="var(--ds-color-accent-cyan)" strokeWidth=".45" strokeOpacity=".44">
    <polygon points={[roof[1], roof[2], base[2], base[1]].map(p => p.join(',')).join(' ')} fill="var(--ds-color-background-primary)" />
    <polygon points={[roof[2], roof[3], base[3], base[2]].map(p => p.join(',')).join(' ')} fill="var(--ds-color-background-elevated)" />
    <polygon points={roof.map(p => p.join(',')).join(' ')} fill={color || 'var(--ds-color-border-strong)'} fillOpacity={color ? .55 : .8} />
  </g>;
}
const Relief = memo(function Relief() {
  return <>
    {[8, 5, 2].map(depth => <polygon key={depth} points={points(plate, -depth)} fill="var(--ds-color-background-muted)" stroke="var(--ds-color-accent-cyan)" strokeOpacity={depth === 8 ? .45 : .15} strokeWidth=".6" />)}
    <polygon points={points(plate)} fill="var(--ds-color-background-primary)" stroke="var(--ds-color-accent-cyan)" strokeOpacity=".55" strokeWidth=".65" />
    <g fill="none" stroke="var(--ds-color-accent-cyan)" strokeWidth=".5" strokeOpacity=".18">
      {[0, 1, 2, 3, 4, 5].map(level => {
        const scale = 1 - level * .12;
        const contour = Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2, noise = 1 + Math.sin(a * 3 + level * .35) * .07; return project(Math.cos(a) * 107 * scale * noise, 34 + Math.sin(a) * 127 * scale * noise, level * .5); });
        return <polygon key={level} points={contour.map(p => p.join(',')).join(' ')} />;
      })}
      {[-90, -45, 0, 45, 90].map(x => <polyline key={x} points={points([[x, -98], [x, 170]])} strokeOpacity=".1" />)}
    </g>
    <g fill="none" stroke="var(--ds-color-border-strong)" strokeWidth="3.3">
      {[-94, -17, 82, 111].map(x => <polyline key={x} points={points([[x, -98], [x, x === -17 ? 164 : 95]])} />)}
      {[-83, 3, 48, 83].map(z => <polyline key={z} points={points([[-116, z], [116, z]])} />)}
    </g>
    {Array.from({ length: 15 }, (_, i) => <Block key={i} x={-104 + i * 14.8} z={-94} w={7 + i % 3} d={9} h={7 + i * 7 % 15} />)}
    {[-105, 97].flatMap((x, side) => [-61, -39, -17, 19, 39, 62].map((z, i) => <Block key={x + '/' + z} x={x} z={z} w={9} d={12} h={4 + (i + side) % 4 * 2} />))}
    {CITY_LOCATIONS.map(place => <g key={place.id}><title>{place.name}</title><Block x={place.position[0]} z={place.position[2]} w={place.category === 'sport' ? 42 : 12} d={place.category === 'sport' ? 30 : 12} h={place.category === 'sport' ? 2.7 : place.id === 'news' ? 19 : 7} color={place.accent} /></g>)}
    <polyline points={points([[-49, -44], [-49, -16]])} fill="none" stroke="var(--ds-color-accent-cyan)" strokeWidth=".7" />
    <polygon points={points([[0, -42], [44, -42], [44, -12], [0, -12]], 3)} fill="none" stroke="var(--ds-color-accent-lime)" strokeWidth=".6" />
  </>;
});

export function CityRoamMap({ status }: { status: RoamStatus | null }) {
  const at = project(status?.x ?? -17, status?.z ?? 70, 5), car = project(status?.carX ?? -17, status?.carZ ?? 70, 3);
  const heading = status?.heading ?? 0;
  const arrowYaw = Math.atan2(-.62 * Math.sin(heading) + .5 * Math.cos(heading), .21 * Math.sin(heading) + .24 * Math.cos(heading)) * 180 / Math.PI;
  return <div className={r.mapPanel} data-roam-map>
    <div className={r.mapHeader}><span><i /> STATOZ / DISTRICT 01</span><b>{status?.vehicle === 'avatar' ? 'ON FOOT' : `${status?.speed ?? 0} km/h`}</b></div>
    <svg viewBox="0 0 320 180" className={r.map} role="img" aria-label="3D topographical city map showing your position, raised buildings and sports grounds">
      <Relief />
      {status?.vehicle === 'avatar' && <g transform={`translate(${car.join(' ')})`}><title>Your parked car</title><rect x="-3" y="-2" width="6" height="4" rx="1" fill="var(--ds-color-accent-gold)" stroke="var(--ds-color-background-primary)" strokeWidth="1" /></g>}
      <g transform={`translate(${at.join(' ')})`}><title>You are here</title><ellipse cy="4" rx="8" ry="3" fill="var(--ds-color-accent-cyan)" opacity=".2" /><path d="M0 0v7" stroke="var(--ds-color-accent-cyan)" strokeWidth="1" /><circle r="5" fill="var(--ds-color-background-primary)" stroke="var(--ds-color-accent-cyan)" strokeWidth="1" /><path transform={`rotate(${arrowYaw})`} d="M0-4 3 3 0 1-3 3Z" fill="var(--ds-color-text-default)" /></g>
      <g transform="translate(286 31)" fill="var(--ds-color-text-subtle)"><path transform="rotate(64)" d="m0-4 3 9-3-2-3 2Z" /><text x="0" y="-8" fontSize="7" textAnchor="middle">N</text></g>
    </svg>
  </div>;
}
