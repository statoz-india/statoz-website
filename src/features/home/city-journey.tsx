"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';
import { CityIcon } from './city-icons';
import { JOURNEY_CHAPTERS, journeyAnchor, scrollToJourney, type JourneyChapterId } from './city-journey-config';
import { publishJourneyProgress, smooth } from './city-journey-motion';
import j from './city-journey.module.css';

type Props = {
  active: JourneyChapterId; enhanced: boolean; cityFocused: boolean; map?: ReactNode;
  paused: boolean; onPause: () => void; onChapterChange: (id: JourneyChapterId) => void;
};
export default function CityJourney({ active, enhanced, cityFocused, map, paused, onPause, onChapterChange }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<JourneyChapterId>());
  const [entrance, setEntrance] = useState(false);
  const entranceAllowed = useRef<boolean | null>(null);
  useEffect(() => {
    const story = root.current!;
    const shell = story.closest<HTMLElement>('[data-scene-status]')!;
    const sections = Array.from(story.querySelectorAll<HTMLElement>('[data-journey-chapter]'));
    let frame = 0;
    let offsets: number[] = [];
    const measure = () => { offsets = sections.map(section => section.getBoundingClientRect().top + scrollY); schedule(); };
    const update = () => {
      frame = 0;
      offsets = sections.map(section => section.getBoundingClientRect().top + scrollY);
      const y = window.scrollY;
      let index = Math.max(0, offsets.findLastIndex(top => y >= top - 1));
      index = Math.min(4, index);
      const value = index === 4 ? 4 : index + Math.max(0, Math.min(1, (y - offsets[index]) / (offsets[index + 1] - offsets[index])));
      const shown = value >= 3.999 ? 4 : Math.min(3, Math.floor(value + .15));
      onChapterChange(JOURNEY_CHAPTERS[shown].id);
      shell.style.setProperty('--city-reveal', String(smooth(3.7, 4, value)));
      shell.dataset.journeyProgress = value.toFixed(4);
      sections.forEach((section, i) => {
        const relative = value - i;
        const opacity = i === 4 ? smooth(3.65, 3.86, value) * (1 - smooth(3.9, 4, value)) :
          smooth(-.22, -.01, relative) * (1 - smooth(.48, .74, relative));
        const inner = section.querySelector<HTMLElement>('[data-chapter-copy]')!;
        inner.style.setProperty('--copy-opacity', String(opacity));
        inner.style.setProperty('--copy-shift', (relative < 0 ? (1 - opacity) * 32 : -(1 - opacity) * 22) + 'px');
        inner.style.visibility = opacity > .01 ? 'visible' : 'hidden';
        inner.inert = opacity < .5;
        const poster = section.querySelector<HTMLElement>('[data-chapter-poster]')!;
        poster.style.opacity = String(smooth(-.45, -.02, relative) * (1 - smooth(.6, 1, relative)));
      });
      publishJourneyProgress(value);
    };
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    measure(); update();
    const observer = new ResizeObserver(measure); observer.observe(story);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); };
  }, [onChapterChange]);
  useEffect(() => {
    if (!enhanced || seen.current.has(active)) return;
    seen.current.add(active); trackEvent('journey_chapter_view', { chapter_id: active });
  }, [active, enhanced]);
  useEffect(() => {
    if (entranceAllowed.current === null) {
      entranceAllowed.current = !matchMedia('(prefers-reduced-motion: reduce)').matches && scrollY < 30 && !location.hash;
      try { if (sessionStorage.getItem('statoz-journey-arrived-v1')) entranceAllowed.current = false;
        if (entranceAllowed.current) sessionStorage.setItem('statoz-journey-arrived-v1', 'true'); } catch {}
    }
    if (!entranceAllowed.current) return;
    setEntrance(true);
    const stop = () => setEntrance(false);
    const scrolled = () => { if (scrollY > 2) stop(); };
    const timer = setTimeout(stop, 1500);
    window.addEventListener('scroll', scrolled, { passive: true });
    for (const event of ['wheel', 'touchstart', 'keydown']) window.addEventListener(event, stop, { once: true, passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', scrolled); for (const event of ['wheel', 'touchstart', 'keydown']) window.removeEventListener(event, stop); };
  }, []);
  function jump(event: MouseEvent<HTMLAnchorElement>, id: JourneyChapterId) {
    if (!enhanced || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (id === 'city') trackEvent('journey_skip', { chapter_id: active });
    scrollToJourney(id); document.getElementById(journeyAnchor(id))?.focus({ preventScroll: true });
  }
  return <div className={j.story} ref={root} data-entrance={entrance || undefined}>
    <nav className={j.progress} aria-label="Opening journey" inert={active === 'city'}>
      {JOURNEY_CHAPTERS.slice(0, 4).map((chapter, i) => <a key={chapter.id} href={'#' + journeyAnchor(chapter.id)} onClick={event => jump(event, chapter.id)} aria-current={active === chapter.id ? 'step' : undefined}><span className={j.progressNumber}>0{i + 1}</span><span className={j.progressLabel}>{chapter.label}</span><span className={j.progressLine} /></a>)}
    </nav>
    <div className={j.journeyTools} inert={active === 'city'}>
      <a href="#city-explore" onClick={event => jump(event, 'city')}>Skip intro <span aria-hidden="true">&#8599;</span></a>
      <button type="button" onClick={onPause} aria-pressed={paused} disabled={!enhanced}><CityIcon name={paused ? 'play' : 'pause'} />{paused ? 'Resume motion' : 'Pause motion'}</button>
    </div>
    {JOURNEY_CHAPTERS.map((chapter, i) => <section key={chapter.id} id={journeyAnchor(chapter.id)} data-journey-chapter={chapter.id} data-active={active === chapter.id || undefined} data-focused={chapter.id === 'city' && cityFocused || undefined} className={j.chapter} tabIndex={-1} aria-labelledby={chapter.id + '-title'} style={{ '--journey-accent': `var(--ds-color-accent-${chapter.accent})` } as CSSProperties}>
      <picture className={j.chapterPoster} data-chapter-poster aria-hidden="true"><source media="(max-width:700px)" srcSet={'/assets/journey/scenes/' + chapter.poster + '-mobile.webp'} /><img src={'/assets/journey/scenes/' + chapter.poster + '.webp'} alt="" width="1440" height="950" fetchPriority={i === 0 ? 'high' : 'auto'} loading={i === 0 ? 'eager' : 'lazy'} /></picture>
      <div className={j.chapterInner} data-chapter-copy>
        <div className={j.copy} data-city-heading>
          <p className={j.eyebrow}><span className={j.chapterNumber}>0{i + 1}</span>{chapter.eyebrow}</p>
          {i === 0 ? <h1 id="welcome-title"><span>{chapter.title}</span><em>{chapter.emphasis}</em></h1> : <h2 id={chapter.id + '-title'}><span>{chapter.title}</span><em>{chapter.emphasis}</em></h2>}
          <p className={j.description}>{chapter.description}</p>
          {chapter.id !== 'city' && <div className={j.actions}><a className={j.primary} href={chapter.action.href} onClick={i === 0 ? event => jump(event, 'predict') : undefined} data-analytics-event={i ? 'web_launch' : undefined} data-analytics-product={chapter.id === 'games' ? 'games' : 'sports'} data-analytics-cta-location={'journey_' + chapter.id}><span>{chapter.action.label}</span><span className={j.actionArrow}><CityIcon name="arrow" /></span></a></div>}
          {i === 0 && <p className={j.welcomeNote}>FOLLOW. <i /> PREDICT. <i /> PLAY.</p>}
        </div>
        {chapter.id !== 'city' && <a className={j.nextChapter} href={'#' + journeyAnchor(JOURNEY_CHAPTERS[i + 1].id)} onClick={event => jump(event, JOURNEY_CHAPTERS[i + 1].id)}><span>{i === 3 ? 'THE CITY IS WAITING' : 'SCROLL TO EXPLORE'}</span><span aria-hidden="true">&#8595;</span></a>}
        <span className={j.sceneCaption} aria-hidden="true">{['THE GATEWAY', 'UNDER THE FLOODLIGHTS', 'THE BLACKTOP', 'NEON CIRCUIT', 'YOUR HOME GROUND'][i]}<i />STATOZ CITY</span>
      </div>
      {chapter.id === 'city' && map && <div className={j.cityMap} data-simple-map>{map}</div>}
    </section>)}
  </div>;
}
