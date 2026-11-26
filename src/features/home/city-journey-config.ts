import { publicAsset } from '@statoz/design-system/asset';
import { CITY_LINKS, CITY_OVERVIEW, type CityLocationId, type CityPoint } from './city-config';
import { smoothScroll } from './city-scroll';

export type JourneyChapterId = 'welcome' | 'entry' | 'follow' | 'predict' | 'knowledge' | 'games' | 'city';
type JourneyChapter = {
  id: JourneyChapterId;
  label: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  accent: 'cyan' | 'lime' | 'gold' | 'violet';
  location: CityLocationId | null;
  camera: CityPoint;
  target: CityPoint;
  poster: string;
  action: { label: string; href: string };
  span: number;
  mission?: number;
};

// Each idea is stated once: the eyebrow names the stop, the heading makes the promise, the
// description says what the product does, and the button says what happens next.
export const JOURNEY_CHAPTERS: readonly JourneyChapter[] = [
  { id: 'welcome', label: 'Arrival', eyebrow: 'A WORLD THAT PLAYS YOUR WAY', title: 'Welcome Home,', emphasis: 'StatOz Wizard.', span: 170,
    description: 'Follow. Predict. Play. One city, built around you.', accent: 'cyan', location: null,
    camera: [-17, 5.2, 206], target: [-17, 31, 40], poster: 'welcome',
    action: { label: 'Enter StatOz City', href: '#journey-entry' } },
  { id: 'entry', label: 'The drive', eyebrow: 'THE DRIVE', title: 'Enter', emphasis: 'StatOz City.', span: 250,
    description: '', accent: 'cyan', location: null, camera: [-17, 4, 145], target: [-17, 2, 95], poster: 'entry',
    action: { label: 'Start the drive', href: '#journey-follow' } },
  { id: 'follow', label: 'Follow', eyebrow: '01 / FOLLOW', title: 'Your teams.', emphasis: 'Every moment.', span: 250, mission: 1,
    description: 'Scores and results for the teams you follow, across every sport.', accent: 'cyan', location: 'cricket',
    camera: [-6, 13, -3], target: [-42, 2, -24], poster: 'follow', action: { label: 'Start following', href: CITY_LINKS.sports } },
  { id: 'predict', label: 'Predict', eyebrow: '02 / PREDICT', title: 'Feel the game.', emphasis: 'Make your call.', span: 230, mission: 2,
    description: 'Call the result before kick-off, then see how it played out.', accent: 'lime', location: 'football',
    camera: [48, 14, 24], target: [20, 2, -22], poster: 'predict', action: { label: 'Make a prediction', href: CITY_LINKS.sports } },
  { id: 'knowledge', label: 'Quiz', eyebrow: '03 / QUIZ', title: 'Know your sport?', emphasis: 'Prove it.', span: 220, mission: 3,
    description: 'Quick quizzes that put your sports knowledge to the test.', accent: 'gold', location: 'basketball',
    camera: [1, 12, 44], target: [-37, 2, 25], poster: 'knowledge', action: { label: 'Take a quiz', href: CITY_LINKS.sports + 'quiz/' } },
  { id: 'games', label: 'Play', eyebrow: '04 / PLAY', title: 'One more game.', emphasis: 'Always.', span: 210, mission: 4,
    description: 'Quick sports games, ready to play in your browser.', accent: 'violet', location: 'racing',
    camera: [76, 14, 69], target: [48, 2, 28], poster: 'games', action: { label: 'Find my game', href: CITY_LINKS.games } },
  { id: 'city', label: 'City', eyebrow: 'STATOZ CITY', title: 'The city', emphasis: 'is yours.', span: 100,
    description: 'Pick a ground and explore.', accent: 'cyan', location: null,
    camera: CITY_OVERVIEW.position, target: CITY_OVERVIEW.target, poster: 'city',
    action: { label: 'Explore Sports', href: CITY_LINKS.sports } },
];

export const JOURNEY_END = JOURNEY_CHAPTERS.length - 1;
export const JOURNEY_MISSIONS = JOURNEY_CHAPTERS.filter(chapter => chapter.mission);

// Snapshot of the enabled Games catalogue. Assets are local, optimized cover copies;
// names and destinations follow the product registry, including Rally Dash's legacy id.
export const JOURNEY_GAMES = [
  { name: 'Hoop Legacy', slug: 'hoop-legacy', sport: 'Basketball', image: publicAsset('/assets/stadium/hoop-legacy.webp') },
  { name: 'Cricketer', slug: 'cricketer', sport: 'Cricket', image: publicAsset('/assets/stadium/cricketer.webp') },
  { name: 'Pitch Rush', slug: 'pitch-rush', sport: 'Football', image: publicAsset('/assets/stadium/pitch-rush.webp') },
  { name: 'Formula', slug: 'portfolio-formula', sport: 'Motorsport', image: publicAsset('/assets/stadium/formula.webp') },
  { name: 'Longbow', slug: 'longbow', sport: 'Archery', image: publicAsset('/assets/stadium/longbow.webp') },
  { name: 'Open Golf', slug: 'open-golf', sport: 'Golf', image: publicAsset('/assets/stadium/open-golf.webp') },
  { name: 'Penalty Cup', slug: 'penalty-cup', sport: 'Football', image: publicAsset('/assets/journey/penalty-cup.webp') },
  { name: 'Yorker', slug: 'yorker', sport: 'Cricket', image: publicAsset('/assets/journey/yorker.webp') },
  { name: 'Rim Rush', slug: 'rim-rush', sport: 'Basketball', image: publicAsset('/assets/journey/rim-rush.webp') },
  { name: 'Racer', slug: 'racer', sport: 'Motorsport', image: publicAsset('/assets/journey/racer.webp') },
  { name: '5v5 Football Chess', slug: 'football-chess', sport: 'Football', image: publicAsset('/assets/journey/football-chess.webp') },
  { name: 'Fot Duel', slug: 'pitch-duel', sport: 'Football', image: publicAsset('/assets/journey/pitch-duel.webp') },
  { name: 'Rally Dash', slug: 'rally', sport: 'Motorsport', image: publicAsset('/assets/journey/rally.webp') },
  { name: 'Vibe Basketball', slug: 'vibe-basketball', sport: 'Basketball', image: publicAsset('/assets/journey/vibe-basketball.webp') },
  { name: 'Holdover', slug: 'holdover', sport: 'Precision', image: publicAsset('/assets/journey/holdover.webp') },
] as const;

export const journeyAnchor = (id: JourneyChapterId) => id === 'city' ? 'city-explore' : 'journey-' + id;

export function scrollToJourney(id: JourneyChapterId, smooth = true) {
  const target = document.getElementById(journeyAnchor(id));
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY;
  const scroller = smoothScroll();
  if (scroller) { scroller.scrollTo(top, { immediate: !smooth }); return; }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: smooth && !reduced ? 'smooth' : 'instant' });
}
