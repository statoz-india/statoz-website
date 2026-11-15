import { colors } from '@statoz/design-system/web/tokens/colors';

export type CityLocationId = 'basketball' | 'cricket' | 'football' | 'racing' | 'news' | 'clubhouse' | 'help' | 'download' | 'city-hall';
export type CityMode = 'tour' | 'explore';
export type CityPoint = [number, number, number];
export type CityLocation = {
  id: CityLocationId;
  name: string;
  shortName: string;
  category: 'sport' | 'city';
  number: string;
  accent: string;
  position: CityPoint;
  camera: CityPoint;
  map: [number, number];
  tagline: string;
  description: string;
  fallbackHref: string;
};

export const CITY_LINKS = { sports: 'https://web.statoz.in/', games: 'https://games.statoz.in/' } as const;
export const CITY_PALETTE = {
  ...colors.accent,
  background: colors.background.muted,
  road: colors.background.primary,
  building: colors.background.elevated,
  text: colors.text.default,
  muted: colors.text.muted,
};

export const CITY_LOCATIONS: readonly CityLocation[] = [
  { id: 'basketball', name: 'The Blacktop', shortName: 'Basketball', category: 'sport', number: '01', accent: colors.accent.orange,
    position: [-39, 0, 26], camera: [-4, 42, 77], map: [32, 62], tagline: 'Where the city finds its rhythm.',
    description: 'Under the lights. Above the rim. Follow the world of basketball or step onto the blacktop for one more game.', fallbackHref: CITY_LINKS.games },
  { id: 'cricket', name: 'The Oval', shortName: 'Cricket', category: 'sport', number: '02', accent: colors.accent.cyan,
    position: [-49, 0, -30], camera: [-2, 58, 31], map: [28, 29], tagline: 'Every ball. A new possibility.',
    description: 'The hush before the run-up. The sound off the bat. Find your cricket fix, from matchday moments to your next chase.', fallbackHref: CITY_LINKS.sports },
  { id: 'football', name: 'The Floodlights', shortName: 'Football', category: 'sport', number: '03', accent: colors.accent.lime,
    position: [22, 0, -27], camera: [64, 50, 29], map: [59, 32], tagline: 'Your game. Your home ground.',
    description: 'Ninety minutes are only the beginning. Follow the football conversation or put your own skills to the test.', fallbackHref: CITY_LINKS.sports },
  { id: 'racing', name: 'Neon Circuit', shortName: 'Racing', category: 'sport', number: '04', accent: colors.accent.violet,
    position: [48, 0, 25.5], camera: [101, 54, 88], map: [75, 62], tagline: 'Find your line after dark.',
    description: 'Street lights become starting lights. Explore motorsport or chase the next perfect lap.', fallbackHref: CITY_LINKS.games },
  { id: 'news', name: 'StatOz News', shortName: 'News', category: 'city', number: '05', accent: colors.accent.pink,
    position: [1, 0, -65], camera: [37, 43, -12], map: [49, 13], tagline: 'Stories from every corner of sport.',
    description: 'Inside the newsroom: product guides, community stories, and the thinking behind StatOz.', fallbackHref: '/statoz-website/blog/' },
  { id: 'clubhouse', name: 'The Clubhouse', shortName: 'About', category: 'city', number: '06', accent: colors.accent.gold,
    position: [-80.5, 0, 23], camera: [-46, 30, 68], map: [11, 59], tagline: 'Built for the love of sport.',
    description: 'Meet StatOz, a home for the fan and player in you.', fallbackHref: '/statoz-website/about/' },
  { id: 'help', name: 'Visitor Centre', shortName: 'Help', category: 'city', number: '07', accent: colors.accent.cyan,
    position: [4, 0, 62], camera: [35, 32, 105], map: [51, 87], tagline: 'Your first stop for a little direction.',
    description: 'Find your way around the city, learn how StatOz works, or get in touch.', fallbackHref: '/statoz-website/faq/' },
  { id: 'download', name: 'App Station', shortName: 'Get the app', category: 'city', number: '08', accent: colors.accent.lime,
    position: [-30, 0, 62], camera: [2, 32, 104], map: [35, 87], tagline: 'Take your home ground with you.',
    description: 'On the commute. At half-time. Wherever sport takes you.', fallbackHref: '/statoz-website/download/' },
  { id: 'city-hall', name: 'City Hall', shortName: 'City Hall', category: 'city', number: '09', accent: colors.accent.violet,
    position: [68.5, 0, -48], camera: [105, 39, -2], map: [86, 22], tagline: 'The details behind the city.',
    description: 'Privacy, terms, and credits for the people who helped build this world.', fallbackHref: '/statoz-website/privacyPolicy/' },
];

export const CITY_OVERVIEW = { position: [137, 143, 177] as CityPoint, target: [0, 0, 0] as CityPoint };
export const CITY_TOUR = ['basketball', 'cricket', 'football', 'racing', 'news', 'clubhouse', 'download', 'help', 'city-hall'] as const;
export const locationById = (id: string | null | undefined) => CITY_LOCATIONS.find(location => location.id === id);
export const cityHref = (id: CityLocationId) => '/#city/' + id;

const legacyDestinations: Record<string, CityLocationId> = {
  sports: 'football', play: 'basketball', games: 'racing', faq: 'help', 'how-it-works': 'help',
  nations: 'football', predict: 'football', picks: 'football', features: 'football',
  progression: 'help', leaderboard: 'help', who: 'help', streaks: 'help', ranks: 'help',
  cards: 'basketball', shop: 'racing', squad: 'basketball', download: 'download',
};

export function locationFromHash(hash: string) {
  const fragment = hash.replace(/^#/, '');
  return locationById(fragment.startsWith('city/') ? fragment.slice(5) : legacyDestinations[fragment]);
}
