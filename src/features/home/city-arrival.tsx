'use client';

import { useEffect, useState } from 'react';
import { BrandIcon } from '@statoz/design-system/web/icons/brand';
import { observeArrival, type ArrivalState } from './city-journey-motion';
import a from './city-arrival.module.css';

/**
 * The loader's HTML layer: a counter and a hairline under the 3D logo, which the canvas draws.
 * Until the 3D runtime starts, a flat logo holds the centre so there is never an empty screen.
 */
export default function CityArrival() {
  const [state, setState] = useState<ArrivalState>({ phase: 'waiting', progress: 0, time: 0 });
  const [creep, setCreep] = useState(0);
  useEffect(() => observeArrival(setState), []);
  // While the runtime downloads, the counter creeps to a few percent so the page is visibly alive.
  useEffect(() => {
    if (state.phase !== 'waiting') return;
    const timer = window.setInterval(() => setCreep(value => Math.min(.08, value + .004)), 60);
    return () => clearInterval(timer);
  }, [state.phase]);
  const progress = state.phase === 'waiting' ? creep : state.progress;
  const done = state.phase === 'reveal' || state.phase === 'settled';
  return <div className={a.loader} data-phase={state.phase} aria-hidden={done || undefined} role={done ? undefined : 'status'} aria-label={done ? undefined : 'Loading StatOz City'}>
    {/* Hidden rather than removed once the 3D logo takes over: removing it would invalidate it as the largest contentful paint. */}
    <div className={a.flatLogo} data-hidden={state.phase !== 'waiting' || undefined}><BrandIcon name="logo" size={96} alt="" priority /></div>
    <div className={a.meter}>
      <span className={a.count}>{String(Math.round(progress * 100)).padStart(3, '0')}</span>
      <span className={a.bar}><i style={{ transform: `scaleX(${progress})` }} /></span>
      <span className={a.label}>STATOZ CITY</span>
    </div>
  </div>;
}
