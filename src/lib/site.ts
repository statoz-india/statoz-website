/* Canonical production origin, used for metadataBase, canonical URLs,
   sitemap and robots. Live on Vercel; the apex statoz.in 308-redirects here. */
export const SITE_URL = "https://www.statoz.in";

export const SITE_NAME = "StatOz";

/* Every way people write the name. Schema, llms files and keywords all use
   this list so search engines and AI models treat them as one brand. */
export const BRAND_NAMES = ["StatOz", "Statoz", "Stat Oz"] as const;

export const SITE_DESCRIPTION =
  "Free sports prediction game. Predict EPL, La Liga, UCL, NBA and IPL matches, win Oz Coins, play arcade games and climb the leaderboard. No cash, not gambling.";

/* India-first site: html lang, schema inLanguage and Open Graph locale. */
export const SITE_LANGUAGE = "en-IN";

export const SUPPORT_EMAIL = "support@statoz.in";

/* Stable PNG URLs for schema and AI answers. PNG on purpose: not every
   crawler reads SVG or WebP. Keep these paths fixed. */
export const LOGO_PATH = "/assets/brand/statoz-logo.png";
export const APP_ICON_PATH = "/assets/brand/app-icon.png";
export const BRAND_IMAGE_SIZE = 1200;

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
