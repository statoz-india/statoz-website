import { CITY_LINKS, CITY_OVERVIEW, type CityLocationId, type CityPoint } from './city-config';

export type JourneyChapterId = 'welcome' | 'predict' | 'knowledge' | 'games' | 'city';
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
  via?: CityPoint[];
  targetVia?: CityPoint[];
  poster: string;
  action: { label: string; href: string };
};

export const JOURNEY_CHAPTERS: readonly JourneyChapter[] = [
  { id: 'welcome', label: 'Arrival', eyebrow: 'YOUR HOME GROUND AWAITS', title: 'Welcome home,', emphasis: 'Sports Wizard.',
    description: 'Your teams. Your instincts. Your home ground.', accent: 'cyan', location: null,
    camera: [-17, 7, 133], target: [-17, 8, 91], via: [[-17, 7, 103], [-17, 10, 84], [9, 30, 23]], targetVia: [[-17, 8, 65], [-4, 6, 5], [24, 4, -27]], poster: 'welcome',
    action: { label: 'Step inside', href: '#journey-predict' } },
  { id: 'predict', label: 'Predict', eyebrow: '01 / TRUST YOUR INSTINCTS', title: 'Follow your teams.', emphasis: 'Make your call.',
    description: 'Follow your favourites across sports. Predict what happens next.', accent: 'lime', location: 'football',
    camera: [56, 18, 7], target: [20, 2, -28], via: [[42, 35, 12], [-5, 28, 4]], targetVia: [[3, 3, -20], [-37, 3, 20]], poster: 'predict',
    action: { label: 'Make your call', href: CITY_LINKS.sports } },
  { id: 'knowledge', label: 'Knowledge', eyebrow: '02 / BRING YOUR A GAME', title: 'Know your sport?', emphasis: 'Prove it.',
    description: 'Take on sports quizzes and challenges. Rise through the ranks.', accent: 'gold', location: 'basketball',
    camera: [-12, 13, 48], target: [-40, 3, 25], via: [[-3, 25, 53], [44, 24, 59]], targetVia: [[-10, 2, 25], [45, 2, 25]], poster: 'knowledge',
    action: { label: 'Prove your knowledge', href: CITY_LINKS.sports + 'quiz/' } },
  { id: 'games', label: 'Games', eyebrow: '03 / ONE MORE ROUND', title: '15 games.', emphasis: 'Find your next obsession.',
    description: 'Multiple sports. New challenges. Always another round.', accent: 'violet', location: 'racing',
    camera: [87, 16, 58], target: [48, 2, 25.5], via: [[110, 43, 91], [128, 89, 141]], targetVia: [[35, 2, 15], [10, 1, 5]], poster: 'games',
    action: { label: 'Find my game', href: CITY_LINKS.games } },
  { id: 'city', label: 'City', eyebrow: 'WELCOME TO STATOZ CITY', title: 'The city', emphasis: 'is yours.',
    description: 'Pick a ground. Follow your curiosity.', accent: 'cyan', location: null,
    camera: CITY_OVERVIEW.position, target: CITY_OVERVIEW.target, poster: 'city',
    action: { label: 'Explore Sports', href: CITY_LINKS.sports } },
];

// Snapshot of the enabled Games catalogue. Assets are local, optimized cover copies;
// names and destinations follow the product registry, including Rally Dash's legacy id.
export const JOURNEY_GAMES = [
  { name: 'Hoop Legacy', slug: 'hoop-legacy', sport: 'Basketball', image: '/statoz-website/assets/stadium/hoop-legacy.webp' },
  { name: 'Cricketer', slug: 'cricketer', sport: 'Cricket', image: '/statoz-website/assets/stadium/cricketer.webp' },
  { name: 'Pitch Rush', slug: 'pitch-rush', sport: 'Football', image: '/statoz-website/assets/stadium/pitch-rush.webp' },
  { name: 'Formula', slug: 'portfolio-formula', sport: 'Motorsport', image: '/statoz-website/assets/stadium/formula.webp' },
  { name: 'Longbow', slug: 'longbow', sport: 'Archery', image: '/statoz-website/assets/stadium/longbow.webp' },
  { name: 'Open Golf', slug: 'open-golf', sport: 'Golf', image: '/statoz-website/assets/stadium/open-golf.webp' },
  { name: 'Penalty Cup', slug: 'penalty-cup', sport: 'Football', image: '/statoz-website/assets/journey/penalty-cup.webp' },
  { name: 'Yorker', slug: 'yorker', sport: 'Cricket', image: '/statoz-website/assets/journey/yorker.webp' },
  { name: 'Rim Rush', slug: 'rim-rush', sport: 'Basketball', image: '/statoz-website/assets/journey/rim-rush.webp' },
  { name: 'Racer', slug: 'racer', sport: 'Motorsport', image: '/statoz-website/assets/journey/racer.webp' },
  { name: '5v5 Football Chess', slug: 'football-chess', sport: 'Football', image: '/statoz-website/assets/journey/football-chess.webp' },
  { name: 'Fot Duel', slug: 'pitch-duel', sport: 'Football', image: '/statoz-website/assets/journey/pitch-duel.webp' },
  { name: 'Rally Dash', slug: 'rally', sport: 'Motorsport', image: '/statoz-website/assets/journey/rally.webp' },
  { name: 'Vibe Basketball', slug: 'vibe-basketball', sport: 'Basketball', image: '/statoz-website/assets/journey/vibe-basketball.webp' },
  { name: 'Holdover', slug: 'holdover', sport: 'Precision', image: '/statoz-website/assets/journey/holdover.webp' },
] as const;

export const journeyAnchor = (id: JourneyChapterId) => id === 'city' ? 'city-explore' : 'journey-' + id;

export function scrollToJourney(id: JourneyChapterId, smooth = true) {
  const target = document.getElementById(journeyAnchor(id));
  if (!target) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: smooth && !reduced ? 'smooth' : 'instant' });
}
