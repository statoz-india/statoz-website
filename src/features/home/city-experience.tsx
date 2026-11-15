'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { FilterChips } from '@statoz/design-system/web/components/navigation/filter-chips';
import { BrandIcon } from '@/components/PagesBrandIcon';
import { trackEvent } from '@/lib/analytics';
import { homeFaq } from './content';
import { CITY_LINKS, CITY_LOCATIONS, CITY_PALETTE, cityHref, locationById, locationFromHash, type CityLocationId, type CityMode } from './city-config';
import { CityIcon } from './city-icons';
import { PlaceActions, PlaceTitle, type CityCommand } from './city-hud';
import { DestinationGlyph } from './city-sport-art';
import CityScene, { type CitySceneHandle } from './city-scene';
import CityJourney from './city-journey';
import { scrollToJourney, type JourneyChapterId } from './city-journey-config';
import s from './city.module.css';
import j from './city-journey.module.css';

const SESSION_KEY = 'statoz-city-view-v1';
const atCityHash = () => !!locationFromHash(window.location.hash);
/** Leaving a place should not leave its address behind. */
function clearPlaceHash() { if (atCityHash()) window.history.replaceState(null, '', '/'); }

function CityMap({ selected, onSelect, large = false }: { selected: CityLocationId | null; onSelect: (id: CityLocationId) => void; large?: boolean }) {
  return <div className={large ? s.largeMap : s.miniMap}>
    <svg viewBox="0 0 300 225" role={large ? 'group' : 'img'} aria-label="Map of StatOz City: four sports grounds and five city landmarks">
      <defs><pattern id={large ? 'grid-large' : 'grid-mini'} width="15" height="15" patternUnits="userSpaceOnUse"><path d="M15 0H0V15" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth=".6" /></pattern></defs>
      <rect width="300" height="225" fill={'url(#' + (large ? 'grid-large' : 'grid-mini') + ')'} />
      <g fill="none" stroke="currentColor" strokeWidth="5" opacity=".18"><path d="M20 104H278M141 24V204M24 177H276M68 18V210M227 20V207" /><path d="M20 53H278" strokeWidth="2" /></g>
      <g fill="none" strokeWidth="1.1"><ellipse cx="84" cy="66" rx="38" ry="32" stroke={CITY_PALETTE.cyan} /><rect x="143" y="52" width="63" height="40" stroke={CITY_PALETTE.lime} /><rect x="73" y="126" width="49" height="29" stroke={CITY_PALETTE.orange} /><rect x="201" y="123" width="67" height="45" rx="20" stroke={CITY_PALETTE.violet} /></g>
      {CITY_LOCATIONS.map(location => { const point = <>
        <circle cx={location.map[0] * 3} cy={location.map[1] * 2.25} r={large ? 23 : 12} fill="transparent" />
        <circle cx={location.map[0] * 3} cy={location.map[1] * 2.25} r={selected === location.id ? 5 : 3.2} fill={location.accent} stroke={selected === location.id ? 'white' : 'none'} strokeWidth="1.5" />
        {large && <text x={location.map[0] * 3 + 8} y={location.map[1] * 2.25 - 8} fill="currentColor" fontSize="7.5">{location.shortName.toUpperCase()}</text>}
      </>; return large ? <a key={location.id} href={cityHref(location.id)} onClick={event => { event.preventDefault(); onSelect(location.id); }} aria-label={'Visit ' + location.shortName} aria-current={selected === location.id ? 'location' : undefined}>{point}</a> : <g key={location.id}>{point}</g>; })}
      <text x="280" y="18" fill="currentColor" fontSize="9" textAnchor="middle">N</text><path d="m280 23-3 7h6l-3-7Z" fill="currentColor" />
      <circle cx="146" cy="114" r="4" fill="white" /><text x="156" y="117" fill="currentColor" fontSize="8">STATOZ PLAZA</text>
    </svg>
  </div>;
}

function Credits() {
  return <div className={s.credits}><p>Free CC0 models, adapted for StatOz.</p><a href="https://quaternius.com/packs/downtowncitymegakit.html">Quaternius Downtown City MegaKit</a><a href="https://kenney.nl/statoz-website/assets/city-kit-commercial">Kenney City Kit</a><a href="https://kenney.nl/statoz-website/assets/city-kit-roads">Kenney Roads</a><a href="https://kenney.nl/statoz-website/assets/racing-kit">Kenney Racing Kit</a><a href="/statoz-website/assets/city/manifest.json">Asset sources and licenses</a><p>Built with Three.js and GSAP, with original venues, landmarks, people and signage.</p></div>;
}

export default function CityExperience() {
  const [enhanced, setEnhanced] = useState(false);
  const [mode, setMode] = useState<CityMode>('tour');
  const [focused, setFocused] = useState<CityLocationId | null>(null);
  const [tourStop, setTourStop] = useState<CityLocationId | null>(null);
  const [sheet, setSheet] = useState<CityCommand | null>(null);
  const [simple, setSimple] = useState(false);
  const [force3D, setForce3D] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [sceneStatus, setSceneStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [retry, setRetry] = useState(0);
  const [activityPaused, setActivityPaused] = useState(false);
  const [chapter, setChapter] = useState<JourneyChapterId>('welcome');
  const inJourney = chapter !== 'city';
  const dialog = useRef<HTMLDialogElement>(null);
  const scene = useRef<CitySceneHandle | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const announce = useRef(false);
  const leaving = useRef(false);
  // A place is either chosen directly or reached by scrolling the tour. Both present the same HUD.
  const place = locationById(focused || tourStop);
  const [shown, setShown] = useState(place);
  if (place && place !== shown) setShown(place);
  const hudOpen = !!place;

  useEffect(() => {
    setEnhanced(true);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => { setReduced(media.matches); if (media.matches) setSimple(true); };
    motion();
    try {
      if (localStorage.getItem('statoz-city-simple') === 'true') setSimple(true);
      if (sessionStorage.getItem('statoz-city-force-3d') === 'true') setForce3D(true);
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (!window.location.hash && saved) {
        if (saved.mode === 'explore') setMode('explore');
      }
    } catch { /* Private browsing may disable storage. Navigation still works. */ }
    const follow = () => {
      // Leaving a place steps back through history. If that lands on the place link the visit
      // began with, the address is cleared instead of reopening the place.
      if (leaving.current) { leaving.current = false; clearPlaceHash(); }
      const target = locationFromHash(window.location.hash);
      setSheet(null);
      if (target) { setFocused(target.id); requestAnimationFrame(() => scrollToJourney('city', false)); }
      else if (['', '#', '#top', '#home'].includes(window.location.hash)) { setFocused(null); setTourStop(null); scene.current?.overview(); }
    };
    const initial = locationFromHash(window.location.hash);
    if (initial) { setFocused(initial.id); requestAnimationFrame(() => scrollToJourney('city', false)); }
    window.addEventListener('hashchange', follow);
    window.addEventListener('popstate', follow);
    media.addEventListener('change', motion);
    return () => { window.removeEventListener('hashchange', follow); window.removeEventListener('popstate', follow); media.removeEventListener('change', motion); };
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ focused, mode })); } catch {}
  }, [enhanced, focused, mode]);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    if (sheet && !modal.open) { modal.showModal(); modal.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true }); }
    if (!sheet && modal.open) modal.close();
    if (sheet) modal.querySelector<HTMLDivElement>('[data-panel-scroll]')?.scrollTo(0, 0);
  }, [sheet]);

  // Keyboard and pointer selections land on the place title, so its actions are the next stop.
  useEffect(() => {
    if (!focused || !announce.current) return;
    announce.current = false;
    title.current?.focus({ preventScroll: true });
  }, [focused]);

  const selectLocation = useCallback((id: CityLocationId) => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body && !active.closest('[data-city-hud], [data-city-actions], dialog')) returnFocus.current = active;
    announce.current = true;
    setFocused(id); setSheet(null);
    scrollToJourney('city', false);
    // One history entry represents "at a place", so Back always returns to the city.
    if (window.location.hash !== '#city/' + id) window.history[window.history.state?.cityPanel ? 'replaceState' : 'pushState']({ cityPanel: true }, '', cityHref(id));
    trackEvent('city_location_select', { location_id: id, input_method: 'destination', page_path: '/' });
  }, []);

  const leave = useCallback(() => {
    const target = returnFocus.current;
    returnFocus.current = null;
    setFocused(null); setTourStop(null); setSheet(null);
    if (atCityHash()) {
      if (window.history.state?.cityPanel) { leaving.current = true; window.history.back(); }
      else window.history.replaceState(null, '', '/');
    }
    scene.current?.overview();
    requestAnimationFrame(() => { if (target?.isConnected) target.focus({ preventScroll: true }); });
  }, []);

  const tourStopChanged = useCallback((id: CityLocationId | null) => {
    setTourStop(id); setFocused(null); clearPlaceHash();
  }, []);
  const driftedAway = useCallback(() => { setFocused(null); clearPlaceHash(); }, []);
  // The journey reports its first chapter before this component reads the address. A place link
  // that is still being followed into the city must survive that report.
  const entering = useRef<boolean | null>(null);
  const chapterChanged = useCallback((id: JourneyChapterId) => {
    if (entering.current === null) entering.current = atCityHash();
    if (id === 'city') entering.current = false;
    setChapter(id);
    if (id !== 'city' && !entering.current) { setFocused(null); setTourStop(null); clearPlaceHash(); }
  }, []);

  function replayJourney() {
    setFocused(null); setTourStop(null); setSheet(null); clearPlaceHash();
    trackEvent('journey_replay');
    scrollToJourney('welcome');
    document.getElementById('journey-welcome')?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!hudOpen || sheet) return;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !event.defaultPrevented) leave(); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [hudOpen, sheet, leave]);

  function changeMode(value: string) {
    const next = value === 'Explore' ? 'explore' : 'tour';
    // Explore keeps the current place so it can be orbited; the tour reports its own stop.
    setMode(next); setFocused(next === 'explore' ? place?.id ?? null : null); setTourStop(null);
    trackEvent('city_navigation_mode', { mode: next });
  }
  function toggleSimple() {
    const next = !simple;
    setSimple(next);
    if (!next) { setForce3D(true); setSceneStatus('loading'); try { sessionStorage.setItem('statoz-city-force-3d', 'true'); } catch {} }
    try { localStorage.setItem('statoz-city-simple', String(next)); } catch {}
  }

  return <div className={`${s.city} ${j.shell}`} data-enhanced={enhanced} data-scene-status={sceneStatus} data-simple={simple} data-place={place?.id} data-journey={inJourney}>
    <a href="#city-explore" className={s.skipLink} onClick={event => { if (enhanced) { event.preventDefault(); scrollToJourney('city', false); document.getElementById('city-explore')?.focus({ preventScroll: true }); trackEvent('journey_skip', { chapter_id: chapter }); } }}>Skip to destinations</a>
    <div className={j.stage}>
    <div className={s.poster} aria-hidden="true"><picture><source media="(max-width: 700px)" srcSet="/statoz-website/assets/journey/scenes/welcome-mobile.webp" /><img src="/statoz-website/assets/journey/scenes/welcome.webp" width="1600" height="1000" alt="" fetchPriority="high" /></picture></div>
    {!simple && enhanced && sceneStatus !== 'failed' && <CityScene key={retry} apiRef={scene} mode={mode} focused={focused} journey={inJourney} panelOpen={!!sheet} activityPaused={activityPaused} force3D={force3D} onSelect={selectLocation} onReady={() => setSceneStatus('ready')} onFailure={() => { setSceneStatus('failed'); setSimple(true); }} onLightweight={() => { setSceneStatus('ready'); setSimple(true); }} onTourStop={tourStopChanged} onLeave={driftedAway} />}
    <div className={s.atmosphere} data-city-atmosphere aria-hidden="true" />
    </div>
    <div className={j.chrome}>

    <header className={s.header} data-city-header>
      <a href="#journey-welcome" className={s.brand} onClick={event => { if (enhanced) { event.preventDefault(); replayJourney(); } }} aria-label="StatOz City home"><BrandIcon name="logo" size={30} alt="" priority /><b>Stat<span>Oz</span></b></a>
      <nav className={s.headerNav} aria-label="Primary"><a className={j.productLink} data-product="sports" href={CITY_LINKS.sports} data-analytics-event="web_launch" data-analytics-product="sports" data-analytics-cta-location="city_header">Sports <span aria-hidden="true">↗</span></a><a className={j.productLink} data-product="games" href={CITY_LINKS.games} data-analytics-event="web_launch" data-analytics-product="games" data-analytics-cta-location="city_header">Games <span aria-hidden="true">↗</span></a></nav>
    </header>

    <div className={s.main}>

      {shown && <PlaceTitle place={shown} open={hudOpen} titleRef={title} onStep={selectLocation} onCommand={setSheet} />}


      <aside className={s.viewTools} aria-label="City view controls" data-city-controls>
        <button type="button" aria-label="Return to city overview" title="City overview" disabled={!enhanced} onClick={leave}><CityIcon name="reset" /></button>
        {!simple && mode === 'explore' && <><button type="button" aria-label="Zoom in" onClick={() => scene.current?.zoom(0.8)}><CityIcon name="plus" /></button><button type="button" aria-label="Zoom out" onClick={() => scene.current?.zoom(1.25)}><CityIcon name="minus" /></button></>}
        {!simple && <button type="button" aria-label={activityPaused ? 'Resume city activity' : 'Pause city activity'} title={activityPaused ? 'Resume activity' : 'Pause activity'} aria-pressed={activityPaused} onClick={() => setActivityPaused(value => !value)}><CityIcon name={activityPaused ? 'play' : 'pause'} /></button>}
        <button type="button" aria-label={simple ? 'Switch to 3D view' : 'Switch to simple view'} title={simple ? 'Explore in 3D' : 'Simple view'} disabled={!enhanced} aria-pressed={simple} onClick={toggleSimple}>{simple ? <span className={s.view3DLabel}>3D</span> : <CityIcon name="map" />}</button>
      </aside>

      <div className={s.srOnly} aria-live="polite" aria-atomic="true">{focused ? '' : place ? place.name : 'City overview'}</div>

      <div className={s.bottomBar} data-city-dock data-hud={hudOpen || undefined} inert={inJourney}>
        <nav id="city-navigation" className={s.dock} aria-label="Sports grounds" tabIndex={-1} inert={hudOpen}>{CITY_LOCATIONS.filter(item => item.category === 'sport').map(item => <a href={enhanced ? cityHref(item.id) : item.fallbackHref} key={item.id} style={{ '--location-accent': item.accent } as CSSProperties} onClick={event => { event.preventDefault(); selectLocation(item.id); }}><span className={s.dockGlyph}><DestinationGlyph destination={item.id} /></span><span className={s.dockSport}>{item.shortName}</span><CityIcon name="arrow" /></a>)}</nav>
        {shown && <PlaceActions place={shown} open={hudOpen} onLeave={leave} onCommand={setSheet} />}
        <div className={s.bottomTools} data-city-controls><p><CityIcon name={mode === 'tour' ? 'mouse' : 'compass'} /><span>{simple ? 'Tap a destination' : sceneStatus === 'loading' ? 'Loading city…' : mode === 'tour' ? 'Pick a ground · Scroll up to revisit' : 'Drag sideways to orbit · Scroll up to revisit'}</span></p><button type="button" className={j.cityReplay} onClick={replayJourney}>Replay journey <span aria-hidden="true">↶</span></button><FilterChips options={['Overview', 'Explore']} selected={mode === 'tour' ? 'Overview' : 'Explore'} onSelect={changeMode} label="City navigation mode" className={s.modeTabs} /></div>
      </div>

      {sceneStatus === 'failed' && <div className={s.recovery} role="status">The 3D view couldn’t load. Every destination is available on the map.<button type="button" onClick={() => { setSceneStatus('loading'); setSimple(false); setRetry(value => value + 1); }}>Retry 3D</button></div>}
      {simple && reduced && <span className={s.srOnly}>Reduced motion is enabled. The static map provides access to every destination.</span>}
    </div>

    <dialog ref={dialog} className={s.directoryDialog} aria-labelledby="city-sheet-title" onCancel={event => { event.preventDefault(); setSheet(null); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setSheet(null); } }}>
      <div className={s.panelHeader}><span>{sheet === 'credits' ? 'City Hall' : 'Explore'}</span><button type="button" onClick={() => setSheet(null)} aria-label="Close"><CityIcon name="close" /></button></div>
      <div className={s.panelBody} data-panel-scroll>
        <h2 id="city-sheet-title" tabIndex={-1}>{sheet === 'credits' ? 'City credits' : 'City guide'}</h2>
        {sheet === 'credits' ? <Credits /> : <><CityMap selected={focused} onSelect={selectLocation} large /><nav className={s.directoryList} aria-label="All city destinations">{CITY_LOCATIONS.map(item => <a href={cityHref(item.id)} key={item.id} onClick={event => { event.preventDefault(); selectLocation(item.id); }} style={{ '--location-accent': item.accent } as CSSProperties}><span><DestinationGlyph destination={item.id} /></span><div><b>{item.shortName}</b>{item.name !== item.shortName && <small>{item.name}</small>}</div><CityIcon name="arrow" /></a>)}</nav><button type="button" className={s.simpleViewButton} onClick={toggleSimple}>{simple ? 'Switch to 3D' : 'Simple view'} <CityIcon name="map" /></button></>}
      </div>
    </dialog>

    </div>
    <main id="main" className={j.journeyMain}><CityJourney active={chapter} enhanced={enhanced} cityFocused={hudOpen} map={simple ? <CityMap selected={focused} onSelect={selectLocation} large /> : undefined} onChapterChange={chapterChanged} paused={activityPaused} onPause={() => setActivityPaused(value => !value)} /></main>
    <noscript><style>{`
      [data-city-controls], [data-city-label] { display:none!important; }
      .${j.chapter} { height:auto; min-height:100svh; }
      .${j.chapterInner} { position:relative; opacity:1; visibility:visible; transform:none; min-height:100svh; height:auto; }
      .${j.chapterPoster} { position:absolute; opacity:1; }
      .${j.chapter}:last-child .${j.chapterInner}, .${j.journeyTools} { display:none; }
    `}</style></noscript>
    <div className={`${s.noScript} ${j.directory}`} hidden={enhanced} data-static-directory><h2>Welcome to StatOz City.</h2><p>Choose a destination below, or enable JavaScript to explore the 3D city.</p><a href={CITY_LINKS.sports}>Explore Sports <span aria-hidden="true">↗</span></a><a href={CITY_LINKS.games}>Play Games <span aria-hidden="true">↗</span></a><a href="/blog">StatOz News</a><a href="/about">The Clubhouse · About</a><a href="/faq">Visitor Centre · FAQ</a><a href="/download">App Station · Downloads</a><a href="/privacyPolicy">Privacy</a><a href="/termsAndConditions">Terms</a><details><summary>What is StatOz?</summary><p>{homeFaq[0].answer}</p></details></div>
  </div>;
}
