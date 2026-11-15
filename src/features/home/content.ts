import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/storeLinks';

export type ProductId = 'sports' | 'games';
export type ProductShowcase = { id: ProductId; name: string; availability: 'Web preview'; href: string; summary: string };
export const products: Record<ProductId, ProductShowcase> = {
  sports: { id: 'sports', name: 'StatOz Sports', availability: 'Web preview', href: 'https://pai45.github.io/statoz-next-sports-web/', summary: 'Follow the match. Read the stats. Make your call.' },
  games: { id: 'games', name: 'StatOz Games', availability: 'Web preview', href: 'https://pai45.github.io/statoz-next-games-web/', summary: 'Find your next game. Make it your own.' },
};
export const featuredGames = [
  { name: 'Hoop Legacy', sport: 'Basketball', slug: 'hoop-legacy', image: 'hoop-legacy', description: 'Build your player. Own the blacktop.' },
  { name: 'Pitch Rush', sport: 'Football', slug: 'pitch-rush', image: 'pitch-rush', description: 'Eleven a side. One more match.' },
  { name: 'Cricketer', sport: 'Cricket', slug: 'cricketer', image: 'cricketer', description: 'Read the line. Own the chase.' },
  { name: 'Formula', sport: 'Motorsport', slug: 'portfolio-formula', image: 'formula', description: 'Find your line. Earn your place.' },
  { name: 'Longbow', sport: 'Archery', slug: 'longbow', image: 'longbow', description: 'Read the wind. Let it fly.' },
  { name: 'Open Golf', sport: 'Golf', slug: 'open-golf', image: 'open-golf', description: 'One course. One perfect putt.' },
] as const;
export const appStores = [
  { name: 'Google Play', platform: 'Android', store: 'playstore' as const, href: PLAY_STORE_URL },
  { name: 'App Store', platform: 'iPhone & iPad', store: 'apple' as const, href: APP_STORE_URL },
];
export const homeFaq = [
  { question: 'What is StatOz?', answer: 'A home for people who love sport. Explore match predictions, stats and quizzes with StatOz Sports, or discover skill games in StatOz Games. The current StatOz mobile app is also available on Google Play and the App Store.' },
  { question: 'How are Sports and Games different?', answer: 'Sports brings together match discovery, predictions, picks and sports quizzes. Games is a separate arcade with football, cricket, basketball, racing, golf and archery experiences.' },
  { question: 'What does “Web preview” mean?', answer: 'You can explore the newer Sports and Games experiences in your browser. They are development previews: some fixtures, results and player data are examples, and features may change. Preview screens do not represent a live sports feed.' },
  { question: 'Can I play on my phone?', answer: 'Yes. You can try the web previews in a supported mobile browser, or download the current StatOz app for Android, iPhone and iPad. The store app and the new previews may have different features. The app offers optional in-app purchases.' },
  { question: 'Does my progress carry between experiences?', answer: 'The web previews keep their own progress on your device. Shared accounts and progress across the previews and the current mobile app are not available. Clearing browser data can remove locally saved progress.' },
];
export const legacyAnchors = {
  nations: 'sports', predict: 'sports', picks: 'sports', progression: 'how-it-works', leaderboard: 'how-it-works',
  features: 'sports', cards: 'games', shop: 'games', who: 'how-it-works', squad: 'games', streaks: 'how-it-works', ranks: 'how-it-works',
} as const;
