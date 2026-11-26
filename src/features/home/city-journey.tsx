'use client';

import { publicAsset } from '@statoz/design-system/asset';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { trackEvent } from '@/lib/analytics';
import { CityIcon } from './city-icons';
import { CityChapterDetail } from './city-chapter-detail';
import { JOURNEY_CHAPTERS, JOURNEY_END, JOURNEY_MISSIONS, journeyAnchor, scrollToJourney, type JourneyChapterId } from './city-journey-config';
import { observeDisplayProgress, publishJourneyProgress, smooth } from './city-journey-motion';
import j from './city-journey.module.css';
import d from './city-drive.module.css';
import m from './city-motion.module.css';

type Props = { active: JourneyChapterId; enhanced: boolean; cityFocused: boolean; map?: ReactNode; onChapterChange: (id: JourneyChapterId) => void };
const SESSION = 'statoz-drive-missions-v1';
const ROUTE_GLYPHS: Partial<Record<JourneyChapterId, ReactNode>> = {
  follow: <path d="M5 21V4h14l-3 4 3 4H5" />,
  predict: <path d="M4 4v16h16M7 15l4-5 4 2 5-7" />,
  knowledge: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zm10 3 2 2 4-5" />,
  games: <path d="m8 4 13 8-13 8V4ZM3 7v10" />,
};

/** How visible a chapter's copy is at a given display progress. Mission copy waits for the camera to settle. */
function copyPresence(index: number, value: number) {
  const relative = value - index, chapter = JOURNEY_CHAPTERS[index];
  if (index === JOURNEY_END) return smooth(JOURNEY_END - .32, JOURNEY_END - .12, value) * (1 - smooth(JOURNEY_END - .06, JOURNEY_END, value)) + (value >= JOURNEY_END ? 0 : 0);
  if (chapter.id === 'welcome') return 1 - smooth(.02, .12, value);
  if (chapter.id === 'entry') return smooth(-.12, -.02, relative) * (1 - smooth(.22, .32, relative));
  // Fully revealed as the chapter begins, so a chapter link lands on complete, usable copy.
  return smooth(-.12, -.015, relative) * (1 - smooth(.4, .47, relative));
}

export default function CityJourney({ active, enhanced, cityFocused, map, onChapterChange }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<JourneyChapterId>());
  const [visited, setVisited] = useState<string[]>([]);
  useEffect(() => {
    try { const saved = JSON.parse(sessionStorage.getItem(SESSION) || '{}'); if (Array.isArray(saved.visited)) setVisited(saved.visited); } catch {}
  }, []);
  // Scroll decides the target progress and the active chapter; the display progress styles the copy.
  useEffect(() => {
    const story = root.current!;
    const shell = story.closest<HTMLElement>('[data-scene-status]')!;
    const sections = Array.from(story.querySelectorAll<HTMLElement>('[data-journey-chapter]'));
    let frame = 0;
    let reported: JourneyChapterId | null = null;
    const update = () => {
      frame = 0;
      const offsets = sections.map(section => section.getBoundingClientRect().top + scrollY);
      const index = Math.min(JOURNEY_END, Math.max(0, offsets.findLastIndex(top => scrollY >= top - 1)));
      const value = index === JOURNEY_END ? JOURNEY_END : index + Math.max(0, Math.min(1, (scrollY - offsets[index]) / (offsets[index + 1] - offsets[index])));
      const nextChapter = JOURNEY_CHAPTERS[index].id;
      if (nextChapter !== reported) {
        const initial = reported === null; reported = nextChapter;
        // Commit only at chapter boundaries, before transferring camera ownership.
        // A render-heavy frame must not leave interactive HTML on the previous stop.
        if (initial) onChapterChange(nextChapter);
        else flushSync(() => onChapterChange(nextChapter));
      }
      shell.dataset.journeyProgress = value.toFixed(4); shell.dataset.driveStage = JOURNEY_CHAPTERS[index].id;
      publishJourneyProgress(value);
    };
    const routes = Array.from(story.querySelectorAll<HTMLElement>('[data-route]'));
    const paint = (value: number) => {
      shell.style.setProperty('--city-reveal', String(smooth(JOURNEY_END - .35, JOURNEY_END, value)));
      // The route bar fills continuously: each segment fills while its chapter is on screen.
      routes.forEach(route => { const index = JOURNEY_CHAPTERS.findIndex(chapter => chapter.id === route.dataset.route); route.style.setProperty('--route-fill', Math.max(0, Math.min(1, value - index)).toFixed(3)); });
      shell.toggleAttribute('data-journey-moving', value > .02);
      sections.forEach((section, i) => {
        const presence = copyPresence(i, value), relative = value - i;
        const inner = section.querySelector<HTMLElement>('[data-chapter-copy]')!;
        inner.style.setProperty('--copy-opacity', presence.toFixed(4));
        inner.style.setProperty('--copy-shift', ((1 - presence) * (relative < 0 ? 26 : -18)).toFixed(2) + 'px');
        inner.style.visibility = presence > .01 ? 'visible' : 'hidden'; inner.inert = presence < .5;
        const poster = section.querySelector<HTMLElement>('[data-chapter-poster]')!;
        poster.style.opacity = String(smooth(-.35, -.01, relative) * (1 - smooth(.65, 1, relative)));
      });
    };
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const observer = new ResizeObserver(schedule); observer.observe(story);
    const unobserve = observeDisplayProgress(paint);
    window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); unobserve(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [onChapterChange]);
  useEffect(() => {
    if (!enhanced || seen.current.has(active)) return;
    seen.current.add(active); trackEvent('journey_chapter_view', { chapter_id: active });
    if (JOURNEY_MISSIONS.some(chapter => chapter.id === active)) setVisited(old => {
      if (old.includes(active)) return old;
      const next = [...old, active];
      try { const saved = JSON.parse(sessionStorage.getItem(SESSION) || '{}'); sessionStorage.setItem(SESSION, JSON.stringify({ ...saved, visited: next })); } catch {}
      return next;
    });
  }, [active, enhanced]);
  function jump(event: MouseEvent<HTMLAnchorElement>, id: JourneyChapterId) {
    if (!enhanced || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); scrollToJourney(id); document.getElementById(journeyAnchor(id))?.focus({ preventScroll: true });
  }
  return <div className={j.story} ref={root}>
    <nav className={d.routeNav + ' ' + m.routeNav} aria-label="Opening journey" inert={active === 'city'} data-hidden={active === 'city' || undefined}>
      {JOURNEY_MISSIONS.map(chapter => <a key={chapter.id} href={'#' + journeyAnchor(chapter.id)} onClick={event => jump(event, chapter.id)} aria-current={active === chapter.id ? 'step' : undefined} data-route={chapter.id} data-visited={visited.includes(chapter.id) || undefined} style={{ '--route-accent': 'var(--ds-color-accent-' + chapter.accent + ')' } as CSSProperties}>
        <span className={d.routeSurface} aria-hidden="true" />
        <svg className={d.routeGlyph} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">{ROUTE_GLYPHS[chapter.id]}</svg>
        <b>{chapter.label}</b>
        <span className={d.routeFill} aria-hidden="true" />
      </a>)}
    </nav>
    {JOURNEY_CHAPTERS.map((chapter, i) => <section key={chapter.id} id={journeyAnchor(chapter.id)} data-journey-chapter={chapter.id} data-active={active === chapter.id || undefined} data-focused={chapter.id === 'city' && cityFocused || undefined} className={j.chapter + (chapter.mission ? ' ' + d.missionChapter : '')} tabIndex={-1} aria-labelledby={chapter.id + '-title'} style={{ '--journey-accent': 'var(--ds-color-accent-' + chapter.accent + ')', height: chapter.span + 'svh' } as CSSProperties}>
      <picture className={j.chapterPoster} data-chapter-poster aria-hidden="true"><source media="(max-width:700px)" srcSet={publicAsset('/assets/journey/scenes/') + chapter.poster + '-mobile.webp'} /><img src={publicAsset('/assets/journey/scenes/') + chapter.poster + '.webp'} alt="" width="1440" height="950" fetchPriority={i === 0 ? 'high' : 'auto'} loading={i === 0 ? 'eager' : 'lazy'} /></picture>
      <div className={j.chapterInner + ' ' + m.chapter + ' ' + (chapter.id === 'welcome' ? d.welcome + ' ' + m.welcome : chapter.id === 'entry' ? m.entry : '')} data-chapter-copy>
        <div className={j.copy + ' ' + m.copy} data-city-heading>
          <div className={j.briefing} data-journey-briefing>
          {!chapter.mission && <p className={j.eyebrow + ' ' + m.eyebrow}>{chapter.eyebrow}</p>}
          {i === 0
            ? <h1 id="welcome-title" data-particle-heading className={m.heading}><span>{chapter.title}</span><em>{chapter.emphasis}</em></h1>
            : <h2 id={chapter.id + '-title'} className={m.heading}><span>{chapter.title}</span>{chapter.mission ? ' ' : null}<em>{chapter.emphasis}</em></h2>}
          {chapter.description && <p className={j.description + ' ' + m.description}>{chapter.description}</p>}
          </div>
          {chapter.mission && <CityChapterDetail id={chapter.id} action={<div className={j.actions + ' ' + d.missionActions + ' ' + m.actions}><a className={j.primary} data-magnetic href={chapter.action.href} data-analytics-event="web_launch" data-analytics-product={chapter.id === 'games' ? 'games' : 'sports'} data-analytics-cta-location={'journey_' + chapter.id}><span>{chapter.action.label}</span><span className={j.actionArrow}><CityIcon name="arrow" /></span></a></div>} />}
        </div>
        {(chapter.id === 'welcome' || chapter.id === 'entry') && <a className={j.nextChapter + ' ' + m.cue} href={'#' + journeyAnchor(JOURNEY_CHAPTERS[i + 1].id)} onClick={event => jump(event, JOURNEY_CHAPTERS[i + 1].id)}><span>{chapter.id === 'welcome' ? 'Scroll to enter' : 'Scroll to drive'}</span><span aria-hidden="true" className={j.cueLine} /></a>}
      </div>
      {chapter.id === 'city' && map && <div className={j.cityMap} data-simple-map>{map}</div>}
    </section>)}
  </div>;
}
