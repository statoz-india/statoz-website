/* Canonical production origin -used for metadataBase, canonical URLs,
   sitemap and robots. TODO: confirm the live domain (App Store listing is
   India `/in/`, so this defaults to .in). */
export const SITE_URL = "https://www.statoz.in";

export const SITE_NAME = "StatOz";

export const SITE_DESCRIPTION =
  "Free sports prediction game. Predict World Cup 2026 and EPL fixtures, win Oz Coins, build accuracy streaks and climb the global leaderboard. No cash, not gambling.";

/* A page's `openGraph` replaces the parent's wholesale, so every page spreads
   this in to keep the brand, locale and share image. */
export const SHARED_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: "en_IN",
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "StatOz – the free sports prediction game",
    },
  ],
};
