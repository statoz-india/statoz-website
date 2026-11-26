import type { CityMode } from './city-config';
import type { RoamCommand, RoamStatus } from './city-roam';
import c from './city-settings.module.css';

type Props = { mode: CityMode; simple: boolean; paused: boolean; sound: boolean; touchControls: boolean; ready: boolean; status: RoamStatus | null; onMode: (mode: CityMode) => void; onCommand: (command: RoamCommand) => void; onPause: () => void; onSound: () => void; onSimple: () => void; onTouchControls: () => void };
export function CitySettings(p: Props) {
  const driving = p.status?.vehicle !== 'avatar';
  return <div className={c.settings}>
    {!p.simple && p.mode === 'roam' && <section><h3>Your explorer</h3><div className={c.actions}><button type="button" disabled={!p.ready || !driving && !p.status?.canEnter} onClick={() => p.onCommand('vehicle')}>{driving ? 'Step out of car' : p.status?.canEnter ? 'Enter car' : 'Return to your parked car'}<kbd>E</kbd></button><button type="button" onClick={() => p.onCommand('camera')}>Change camera view<kbd>C</kbd></button></div></section>}
    <section><h3>City</h3><div className={c.actions}>
      <button type="button" aria-pressed={p.paused} onClick={p.onPause}>{p.paused ? 'Resume city activity' : 'Pause city activity'}<span>{p.paused ? 'Paused' : 'Playing'}</span></button>
      <button type="button" aria-pressed={p.sound} onClick={p.onSound}>City sound<span>{p.sound ? 'On' : 'Off'}</span></button>
      <button type="button" aria-pressed={p.simple} onClick={p.onSimple}>{p.simple ? 'Switch to 3D view' : 'Switch to simple view'}<span>{p.simple ? 'Map' : '3D'}</span></button>
      {!p.simple && <button type="button" onClick={() => p.onMode(p.mode === 'roam' ? 'tour' : 'roam')}>{p.mode === 'roam' ? 'City overview' : 'Free roam'}<span aria-hidden="true">↗</span></button>}
    </div></section>
    {!p.simple && <section><h3>Controls</h3><div className={c.actions}><button type="button" aria-pressed={p.touchControls} onClick={p.onTouchControls}>On-screen movement controls<span>{p.touchControls ? 'On' : 'Off'}</span></button></div><dl className={c.keys}><div><dt>Move / drive</dt><dd><kbd>WASD</kbd> / arrows</dd></div><div><dt>Run / faster</dt><dd><kbd>Shift</kbd></dd></div><div><dt>Brake</dt><dd><kbd>Space</kbd></dd></div><div><dt>Enter / exit car</dt><dd><kbd>E</kbd></dd></div><div><dt>Visit a place</dt><dd><kbd>F</kbd></dd></div><div><dt>Camera view</dt><dd><kbd>C</kbd> Chase / close / cockpit</dd></div><div><dt>Look around</dt><dd>Drag the scene</dd></div><div><dt>City overview</dt><dd><kbd>Esc</kbd></dd></div></dl></section>}
  </div>;
}
