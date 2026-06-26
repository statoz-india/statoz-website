export const ROUTES = {
  home: "/#top",
  nations: "/#nations",
  predict: "/#predict",
  picks: "/#picks",
  progression: "/#progression",
  leaderboard: "/#leaderboard",
  features: "/#features",
  cards: "/#cards",
  games: "/#games",
  shop: "/#shop",
  who: "/#who",
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
  { href: ROUTES.predict, label: "Predict" },
  { href: ROUTES.picks, label: "Picks" },
  { href: ROUTES.games, label: "Games" },
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
