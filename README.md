# StatOz website

Marketing site for **StatOz**, the free sports prediction game (EPL, IPL, La Liga, NBA):
predict fixtures, earn XP and Oz Coins, play arcade games and climb the leaderboard.
No cash, not gambling. Live at <https://www.statoz.in> (hosted on Vercel).

Built with **Next.js 16 (App Router) + React 19 + TypeScript**, styled with plain global CSS.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run indexnow` | After a deploy: submit every sitemap URL to IndexNow (Bing, Yandex…) |

## Structure

```
src/
  app/
    layout.tsx            root layout: fonts, metadata, site JSON-LD, GTM / GA4 / AdSense
    page.tsx              homepage: composes the sections below in order
    globals.css           the whole design system (tokens, cards, HUD chrome, responsive)
    faq/ about/           FAQ and company pages
    termsAndConditions/   legal pages
    privacyPolicy/
    download/             download page
    blog/                 blog index, /blog/[slug] posts, RSS feed, per-post share images
    predictions/[league]  league landing pages (/predictions/epl, /predictions/ipl)
    [section]/            short URLs (/picks, /predict…) that 308 to homepage sections
    get/                  device redirect behind download.statoz.in (App Store / Play Store)
    llms.txt/ llms-full.txt/   plain-text site summaries for AI assistants
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx twitter-image.tsx not-found.tsx
  components/
    Ticker Header ScrollRail          top marquee, sticky nav, section progress rail
    Hero Nations Predict Picks        homepage sections…
    Progression Leaderboard Features
    Squad Games Shop WhoFor Download Faq
    Footer
    BlogChrome                        header/footer wrapper for non-home pages
    ArticleView FaqList Breadcrumbs   shared layouts for posts, league pages and FAQs
    JsonLd                            renders structured data safely
    Effects                           DOM effects: cursor glow, scroll-reveal, count-up,
                                      card tilt, hero parallax, header shadow
    DeferredPixelBlast + PixelBlast   hero WebGL background (three.js), loaded when idle
    AnalyticsEvents                   delegated click tracking -> GA4 events
    LayoutModeSync                    keeps ?layout=false mode right on client navigation
  lib/
    data.ts             homepage content: cards, quiz steps, picks, leaderboards, shop…
    blog.ts             blog posts (one object per post)
    leagues.ts          league landing pages
    faqData.ts about.ts FAQ and About copy
    site.ts             domain, brand names, description, shared Open Graph
    routes.ts           every internal URL + nav link lists
    storeLinks.ts       App Store / Play Store / web app URLs
    seo.ts              keywords + pageMetadata() used by every page
    structuredData.ts   schema.org graph and FAQ/breadcrumb helpers
    llms.ts             content for llms.txt / llms-full.txt
    analytics.ts        trackEvent()
    layoutMode.ts       ?layout=false (in-app webview) support
public/
  assets/               player portraits, avatars, packs, icons, backgrounds, brand marks
  ads.txt app-ads.txt   ad network declarations
  <key>.txt             IndexNow key file
docs/seo-aeo-geo.md     how search, AI-answer and structured-data work is set up
```

## How it's wired

- **Styling** is plain global CSS with custom properties, no Tailwind. Fonts come from
  `next/font/google` (Orbitron, Onest, Space Mono) and are exposed as `--font-disp`,
  `--font-ui` and `--font-mono`.
- **Server components by default.** Only `Header`, `ScrollRail`, `Leaderboard`, `Effects`,
  `AnalyticsEvents`, `LayoutModeSync` and `DeferredPixelBlast` run in the browser.
- **Everything is prerendered** except `/get`, which has to read the visitor's user agent.
- **Content is data-driven.** Edit `src/lib/*.ts` rather than the components. A new blog
  post is one object in `BLOG_POSTS`; the sitemap, RSS feed, llms files and schema pick it
  up automatically. A new card is a `PLAYERS` entry plus `public/assets/players/<id>.webp`.
- **In-app webview mode.** FAQ, About, Terms and Privacy accept `?layout=false`, which hides
  the site header and footer. A small script in `<head>` sets `<html data-layout="bare">`
  before first paint, so the pages stay static. See `src/lib/layoutMode.ts`.
- **SEO / AI search.** Every page builds metadata through `pageMetadata()` in `seo.ts`.
  `robots.ts` names the major search and AI crawlers. See `docs/seo-aeo-geo.md`.

## Notes

- Player art uses plain `<img>` because the cards rely on CSS `object-fit` and masking.
- Scroll-reveal elements start hidden and fade in via IntersectionObserver; visitors with
  `prefers-reduced-motion` see everything immediately.
