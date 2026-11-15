export const ROUTES = {
  home: "/#top",
  nations: "/#sports",
  predict: "/#sports",
  picks: "/#sports",
  progression: "/#how-it-works",
  leaderboard: "/#how-it-works",
  features: "/#sports",
  cards: "/#games",
  games: "/#games",
  pitchDuel: "/games/pitch-duel",
  penaltyShootout: "/games/penalty-shootout",
  footballChess: "/games/football-chess",
  shop: "/#games",
  who: "/#how-it-works",
  download: "/download",
  about: "/about",
  faq: "/faq",
  blog: "/blog",
  iplJourney: "/blog/ipl-2026-prediction-journey",
  predictionQuizGuide: "/blog/how-statoz-prediction-quiz-works",
  terms: "/termsAndConditions",
  privacy: "/privacyPolicy",
} as const;

export const PRIMARY_NAV_LINKS = [
  { href: ROUTES.predict, label: "Sports" },
  { href: ROUTES.games, label: "Games" },
  { href: ROUTES.progression, label: "How It Works" },
  { href: ROUTES.blog, label: "Blog" },
  { href: ROUTES.faq, label: "FAQ" },
];

export const FOOTER_NAV_LINKS = [
  { t: "Predict", href: ROUTES.predict },
  { t: "Picks", href: ROUTES.picks },
  { t: "Streaks & XP", href: ROUTES.progression },
  { t: "Leaderboard", href: ROUTES.leaderboard },
  { t: "Card Pool", href: ROUTES.cards },
  { t: "Games", href: ROUTES.games },
  { t: "Shop", href: ROUTES.shop },
  { t: "Download", href: ROUTES.download },
  { t: "FAQ", href: ROUTES.faq },
];
