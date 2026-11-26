'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { CITY_LOCATIONS, type CityLocationId, type CityMode } from './city-config';
import type { CityRuntime, CityRuntimeState } from './city-runtime';
import type { RoamStatus } from './city-roam';
import s from './city.module.css';

export type CitySceneHandle = Pick<CityRuntime, 'overview' | 'zoom' | 'getPose' | 'roamInput' | 'roamCommand'>;
type Props = {
  apiRef: RefObject<CitySceneHandle | null>;
  mode: CityMode;
  focused: CityLocationId | null;
  journey: boolean;
  panelOpen: boolean;
  activityPaused: boolean;
  force3D: boolean;
  onSelect: (id: CityLocationId) => void;
  onReady: () => void;
  onFailure: () => void;
  onLightweight: () => void;
  onTourStop: (id: CityLocationId | null) => void;
  onLeave: () => void;
  onRoamStatus: (status: RoamStatus) => void;
  onExitRoam: () => void;
};

export default function CityScene(props: Props) {
  const root = useRef<HTMLDivElement>(null);
  const runtime = useRef<CityRuntime | null>(null);
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    let disposed = false;
    let idle: number | undefined;
    let usesIdleCallback = false;
    let context: WebGL2RenderingContext | null = null;
    const host = root.current!;
    const start = async () => {
      try {
        const canvas = host.querySelector('canvas')!;
        context = canvas.getContext('webgl2', { alpha: false, antialias: true, powerPreference: 'high-performance' });
        if (!context) { latest.current.onFailure(); return; }
        const debug = context.getExtension('WEBGL_debug_renderer_info');
        const renderer = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '';
        if (!latest.current.force3D && /swiftshader|llvmpipe|software rasterizer|microsoft basic render|softpipe/i.test(renderer)) {
          context.getExtension('WEBGL_lose_context')?.loseContext();
          latest.current.onLightweight();
          return;
        }
        const { createCityRuntime } = await import('./city-runtime');
        if (disposed) return;
        const instance = await createCityRuntime(host, {
          onSelect: id => latest.current.onSelect(id),
          onReady: () => latest.current.onReady(),
          onFailure: () => latest.current.onFailure(),
          onTourStop: id => latest.current.onTourStop(id),
          onLeave: () => latest.current.onLeave(),
          onRoamStatus: status => latest.current.onRoamStatus(status),
          onExitRoam: () => latest.current.onExitRoam(),
        }, context);
        if (disposed) { instance.dispose(); return; }
        runtime.current = instance;
        latest.current.apiRef.current = instance;
        instance.setState(latest.current);
      } catch { if (!disposed) latest.current.onFailure(); }
    };
    const requestIdle = window.requestIdleCallback;
    if (typeof requestIdle === 'function') { usesIdleCallback = true; idle = requestIdle.call(window, () => { void start(); }, { timeout: 1200 }); }
    else idle = window.setTimeout(() => { void start(); }, 40);
    return () => {
      disposed = true;
      if (usesIdleCallback && idle !== undefined) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      if (runtime.current) runtime.current.dispose();
      else if (context && !context.isContextLost()) context.getExtension('WEBGL_lose_context')?.loseContext();
      runtime.current = null;
      latest.current.apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    const state: CityRuntimeState = { mode: props.mode, focused: props.focused, journey: props.journey, panelOpen: props.panelOpen, activityPaused: props.activityPaused };
    runtime.current?.setState(state);
  }, [props.mode, props.focused, props.journey, props.panelOpen, props.activityPaused]);

  return <div ref={root} className={s.scene} data-city-scene data-mode={props.mode}>
    <canvas className={s.canvas} aria-label={props.mode === 'roam' ? 'Free roam in StatOz City. Use W A S D or arrow keys to move, E to enter or exit the car, F to visit a nearby place, Escape for overview.' : 'Interactive 3D model of StatOz City'} tabIndex={!props.journey && props.mode !== 'tour' ? 0 : -1} />
    <div className={s.worldLabels} aria-label="City landmarks" inert={props.journey}>
      <svg className={s.labelLeaders} aria-hidden="true">{CITY_LOCATIONS.map(location => <g key={location.id} data-city-link={location.id} style={{ color: location.accent }}><path /><circle r="3" /></g>)}</svg>
      {CITY_LOCATIONS.map(location => <button key={location.id} type="button" data-city-label={location.id} data-kind={location.category} className={s.worldLabel} style={{ '--location-accent': location.accent } as React.CSSProperties} onClick={() => props.onSelect(location.id)} aria-label={'Visit ' + location.shortName}>
        <span className={s.labelText}><b>{location.shortName}</b></span>
      </button>)}
    </div>
  </div>;
}
