'use client';

import { useState, type CSSProperties, type PointerEvent, type RefObject } from 'react';
import { locationById } from './city-config';
import type { CitySceneHandle } from './city-scene';
import type { RoamAction, RoamStatus } from './city-roam';
import r from './city-roam.module.css';
import { CityRoamMap } from './city-roam-map';

export function CityRoamHud({ status, scene, showIntro, touchControls }: { status: RoamStatus | null; scene: RefObject<CitySceneHandle | null>; showIntro: boolean; touchControls: boolean }) {
  const [boost, setBoost] = useState(false);
  const driving = status?.vehicle !== 'avatar', near = locationById(status?.near);
  function hold(event: PointerEvent<HTMLButtonElement>, action: RoamAction, pressed: boolean) {
    event.preventDefault();
    if (pressed) event.currentTarget.setPointerCapture(event.pointerId);
    scene.current?.roamInput(action, pressed);
  }
  function pad(action: RoamAction, label: string, glyph: string) {
    return <button type="button" aria-label={label} onPointerDown={event => hold(event, action, true)} onPointerUp={event => hold(event, action, false)} onPointerCancel={event => hold(event, action, false)} onLostPointerCapture={() => scene.current?.roamInput(action, false)} onKeyDown={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); scene.current?.roamInput(action, true); } }} onKeyUp={event => { if (event.key === ' ' || event.key === 'Enter') scene.current?.roamInput(action, false); }} onBlur={() => scene.current?.roamInput(action, false)}><span aria-hidden="true">{glyph}</span></button>;
  }
  return <section className={r.hud} aria-label="Free roam controls" data-roam-hud>
    <CityRoamMap status={status} />
    {showIntro && <div className={r.instructions} data-roam-intro><b>The city is yours.</b><span>{driving ? 'Drive the streets. Park and step out to explore.' : 'Walk the city. Return to your car whenever you like.'}</span><span className={r.keyGuide}><kbd>WASD</kbd> / arrows · {driving ? 'drive' : 'walk'} <kbd>E</kbd> {driving ? 'step out' : 'enter car'} <kbd>F</kbd> visit <kbd>C</kbd> camera</span><span>Drag the scene to look around.</span></div>}
    {near && <button type="button" className={r.waypoint} data-roam-waypoint data-target={near.id} aria-label={'Visit ' + near.name} style={{ '--waypoint-color': near.accent } as CSSProperties} onClick={() => scene.current?.roamCommand('visit')}>
      <span className={r.waypointGlyph} aria-hidden="true"><svg className={r.waypointPin} viewBox="0 0 24 24"><path d="m12 3 8 9-8 9-8-9Z" /><circle cx="12" cy="12" r="2" /></svg><svg className={r.waypointArrow} viewBox="0 0 24 24"><path d="m8 5 7 7-7 7" /></svg></span>
      <span className={r.waypointCopy}><span>Visit {near.name}</span><small aria-hidden="true"><span className={r.waypointKeyboardHint}>Press <kbd>F</kbd></span><span className={r.waypointTapHint}>Tap to visit</span><i />{Math.round(Math.hypot((status?.x ?? 0) - near.position[0], (status?.z ?? 0) - near.position[2]))} m</small></span>
    </button>}
    {status?.contact && <div className={r.context} role="status" data-roam-contact><span>{status.contact}</span></div>}
    {!status?.contact && !near && status?.blocked && <div className={r.context} role="status"><span>Path blocked. Turn or reverse.</span></div>}
    {touchControls && <div className={r.controls} data-roam-touch-controls>
      <div className={r.pad} role="group" aria-label={driving ? 'Touch driving controls' : 'Touch walking controls'}>
        <div />{pad('forward', driving ? 'Accelerate' : 'Walk forward', '↑')}<div />
        {pad('left', driving ? 'Steer left' : 'Walk left', '←')}{pad('back', driving ? 'Reverse' : 'Walk backward', '↓')}{pad('right', driving ? 'Steer right' : 'Walk right', '→')}
      </div>
      <div className={r.actions}>
        <button type="button" className={r.primary} disabled={!driving && !status?.canEnter} onClick={() => { setBoost(false); scene.current?.roamInput('boost', false); scene.current?.roamCommand('vehicle'); }}><kbd>E</kbd>{driving ? 'Step out of car' : status?.canEnter ? 'Enter car' : 'Return to your car'}</button>
        <div className={r.actionRow}>{driving ? pad('brake', 'Brake', 'Brake') : <button type="button" aria-pressed={boost} onClick={() => { setBoost(!boost); scene.current?.roamInput('boost', !boost); }}>Run</button>}</div>
      </div>
    </div>}
  </section>;
}
