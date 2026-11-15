import type { CSSProperties, ReactNode, RefObject } from 'react';
import Link from 'next/link';
import StoreIcon from '@/components/StoreIcon';
import { BLOG_POSTS } from '@/lib/blog';
import { appStores, featuredGames } from './content';
import { CITY_LINKS, CITY_LOCATIONS, CITY_TOUR, locationById, type CityLocation, type CityLocationId } from './city-config';
import { CityIcon } from './city-icons';
import { DestinationGlyph } from './city-sport-art';
import s from './city.module.css';

export type CityCommand = 'guide' | 'credits';
type Action = {
  id: string;
  tone: 'primary' | 'secondary' | 'quiet';
  kicker?: string;
  label: string;
  detail?: string;
  href?: string;
  command?: CityCommand;
  image?: string;
  store?: 'playstore' | 'apple';
  analytics?: Record<string, string>;
};

const PRODUCT_NOTE = 'Opens the StatOz product in this tab. Some experiences may include preview or example data.';
const featuredGame: Partial<Record<CityLocationId, typeof featuredGames[number]>> = {
  basketball: featuredGames.find(game => game.sport === 'Basketball'),
  cricket: featuredGames.find(game => game.sport === 'Cricket'),
  football: featuredGames.find(game => game.sport === 'Football'),
  racing: featuredGames.find(game => game.sport === 'Motorsport'),
};

/** What a visitor can do at each place. Long documents stay on their own pages. */
export function placeContent(place: CityLocation): { actions: Action[]; note?: string } {
  if (place.category === 'sport') {
    const game = featuredGame[place.id];
    const actions: Action[] = [
      { id: 'sports', tone: 'primary', kicker: 'StatOz Sports', label: 'Explore Sports', detail: 'Matches, predictions and quizzes', href: CITY_LINKS.sports,
        analytics: { event: 'web_launch', product: 'sports', location: place.id, 'cta-location': 'city_venue' } },
      { id: 'games', tone: 'secondary', kicker: 'StatOz Games', label: 'Play Games', detail: game ? 'Featuring ' + game.name : 'Find your next game', image: game ? '/statoz-website/assets/stadium/' + game.image + '.webp' : undefined, href: CITY_LINKS.games,
        analytics: { event: 'web_launch', product: 'games', location: place.id, 'cta-location': 'city_venue' } },
    ];
    if (place.id === 'football') actions.push({ id: 'guides', tone: 'quiet', label: 'Game guides', href: '/games/pitch-duel' });
    return { actions, note: PRODUCT_NOTE };
  }
  if (place.id === 'news') return { actions: [
    ...BLOG_POSTS.map<Action>(post => ({ id: post.slug, tone: 'secondary', kicker: post.eyebrow, label: post.title, href: post.href, analytics: { event: 'blog_post_click', 'post-slug': post.slug, 'post-title': post.title } })),
    { id: 'all', tone: 'quiet', label: 'All stories', href: '/blog' },
  ] };
  if (place.id === 'clubhouse') return { actions: [
    { id: 'about', tone: 'primary', kicker: 'Our story', label: 'About StatOz', detail: 'Who we are and what we are building', href: '/about' },
    { id: 'contact', tone: 'secondary', kicker: 'Say hello', label: 'Contact us', detail: 'support@statoz.in', href: 'mailto:support@statoz.in' },
  ] };
  if (place.id === 'help') return { actions: [
    { id: 'faq', tone: 'primary', kicker: 'FAQ', label: 'How StatOz works', detail: 'Answers to common questions', href: '/faq' },
    { id: 'guide', tone: 'secondary', kicker: 'Find your way', label: 'City guide', detail: 'A map of every destination', command: 'guide' },
    { id: 'support', tone: 'quiet', label: 'Contact support', href: 'mailto:support@statoz.in' },
  ], note: 'Scroll up to revisit the opening journey. Switch to Explore and drag sideways to orbit; use the zoom buttons or +/− to zoom, arrow keys to pan, and Home to reset the view.' };
  if (place.id === 'download') return { actions: appStores.map<Action>(store => ({ id: store.store, tone: 'secondary', kicker: store.platform, label: store.name, href: store.href, store: store.store,
    analytics: { event: 'download_cta_click', store: store.store, 'cta-location': 'city_app_station', 'cta-label': store.name } })),
    note: 'Current mobile app. Optional in-app purchases. Features may differ from the web experiences.' };
  return { actions: [
    { id: 'privacy', tone: 'secondary', kicker: 'How we handle data', label: 'Privacy', href: '/privacyPolicy' },
    { id: 'terms', tone: 'secondary', kicker: 'The rules of play', label: 'Terms', href: '/termsAndConditions' },
    { id: 'credits', tone: 'quiet', label: 'City credits', command: 'credits' },
  ] };
}

const analyticsProps = (analytics?: Record<string, string>) => Object.fromEntries(Object.entries(analytics || {}).map(([key, value]) => ['data-analytics-' + key, value]));
const tourIndex = (id: CityLocationId) => CITY_TOUR.indexOf(id as typeof CITY_TOUR[number]);
export function neighbour(id: CityLocationId, step: 1 | -1) {
  return locationById(CITY_TOUR[(tourIndex(id) + step + CITY_TOUR.length) % CITY_TOUR.length])!;
}

/** The place name and story, set over the city instead of inside a dialog. */
export function PlaceTitle({ place, open, titleRef, onStep, onCommand }: { place: CityLocation; open: boolean; titleRef: RefObject<HTMLHeadingElement | null>; onStep: (id: CityLocationId) => void; onCommand: (command: CityCommand) => void }) {
  const { actions, note } = placeContent(place);
  const quiet = actions.filter(action => action.tone === 'quiet');
  const previous = neighbour(place.id, -1), next = neighbour(place.id, 1);
  return <section className={s.hud} data-city-hud data-open={open || undefined} inert={!open} aria-labelledby="city-place-title" style={{ '--location-accent': place.accent } as CSSProperties}>
    <div className={s.hudBody} key={place.id}>
      <p className={s.hudEyebrow}><span className={s.hudGlyph}><DestinationGlyph destination={place.id} /></span><b>{place.shortName}</b><i>{String(tourIndex(place.id) + 1).padStart(2, '0')} / {String(CITY_LOCATIONS.length).padStart(2, '0')}</i></p>
      <h2 id="city-place-title" ref={titleRef} tabIndex={-1}>{place.name}</h2>
      <p className={s.hudTagline}>{place.tagline}</p>
      <p className={s.hudDescription}>{place.description}</p>
      {note && <p className={s.hudNote}>{note}</p>}
      {quiet.length > 0 && <div className={s.hudLinks}>{quiet.map(action => <ActionLink key={action.id} action={action} className={s.actionQuiet} onCommand={onCommand}>{action.label}<CityIcon name="arrow" /></ActionLink>)}</div>}
      <div className={s.hudStepper}>
        <button type="button" onClick={() => onStep(previous.id)} aria-label={'Previous place: ' + previous.shortName}><CityIcon name="chevron" /></button>
        <button type="button" onClick={() => onStep(next.id)} aria-label={'Next place: ' + next.shortName}><span>{next.shortName}</span><CityIcon name="chevron" /></button>
      </div>
    </div>
  </section>;
}

function ActionLink({ action, className, onCommand, children }: { action: Action; className: string; onCommand: (command: CityCommand) => void; children: ReactNode }) {
  if (action.command) return <button type="button" className={className} onClick={() => onCommand(action.command!)}>{children}</button>;
  return action.href!.startsWith('/') ? <Link href={action.href!} className={className} {...analyticsProps(action.analytics)}>{children}</Link>
    : <a href={action.href} className={className} {...analyticsProps(action.analytics)}>{children}</a>;
}

/** Action cards that take the dock's place while a visitor is at a venue. */
export function PlaceActions({ place, open, onLeave, onCommand }: { place: CityLocation; open: boolean; onLeave: () => void; onCommand: (command: CityCommand) => void }) {
  const cards = placeContent(place).actions.filter(action => action.tone !== 'quiet');
  return <nav className={s.hudActions} data-city-actions data-open={open || undefined} inert={!open} aria-label={place.name + ' actions'} style={{ '--location-accent': place.accent } as CSSProperties}>
    <div className={s.actionCards} key={place.id}>{cards.map(action => <ActionLink key={action.id} action={action} className={action.tone === 'primary' ? s.actionPrimary : s.actionCard} onCommand={onCommand}>
      {action.image && <span className={s.actionArt}><img src={action.image} alt="" width="168" height="112" loading="lazy" decoding="async" /></span>}
      {action.store && <span className={s.actionStore}><StoreIcon store={action.store} /></span>}
      <span className={s.actionText}>{action.kicker && <small>{action.kicker}</small>}<b>{action.label}</b>{action.detail && <em>{action.detail}</em>}</span>
      <CityIcon name="arrow" />
    </ActionLink>)}</div>
    <button type="button" className={s.hudBack} onClick={onLeave}><CityIcon name="arrow" />Back to the city</button>
  </nav>;
}
