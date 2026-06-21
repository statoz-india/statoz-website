# StatOz -World Cup 2026 Card Duel Arena

A FIFA-inspired, gamified, cyberpunk-HUD landing page for StatOz, built with **Next.js
(App Router) + React 19 + TypeScript**. Same bespoke design as the original static
build, now componentised and ready to drop into the wider StatOz app.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build` (production build) · `npm run start` (serve the build).

## Structure

```
src/
  app/
    layout.tsx        root layout -next/font (Saira Condensed / Onest / Space Mono), metadata
    page.tsx          composes every section in order
    globals.css       the whole design system (tokens, FUT card, HUD chrome, responsive)
  components/
    Header.tsx        sticky nav + mobile menu  (client)
    Hero.tsx          headline + 3-card FIFA fan + store CTAs
    Nations.tsx       qualified-nations marquee
    Edge.tsx          "the scoreboard is the judge" -why prediction
    Duel.tsx          four-step how-it-works
    Squad.tsx         data-driven FUT card grid + filter tabs  (client)
    Rating.tsx        SMART Rating skill-score profile card
    Features.tsx      bento feature grid
    StatBand.tsx      count-up stats
    Arena.tsx         leaderboard + crowd-probability fixtures
    WhoFor.tsx        three personas
    Download.tsx      install CTA
    Faq.tsx           accordion (native <details>)
    Footer.tsx        socials + columns + legal
    Effects.tsx       all DOM interactions in one client effect
                      (cursor glow, scroll-reveal, count-up, card tilt, hero parallax)
    BrandMark.tsx     the STAT◯Z octagon wordmark
  lib/
    data.ts           PLAYERS / BOARD / FIX -edit here to change the cards, ladder, fixtures
public/assets/        player portraits + brand marks
```

## How it's wired

- **Styling** is plain global CSS with custom properties -no Tailwind -so the design is
  pixel-identical to the static version. Fonts are loaded via `next/font/google` and exposed
  as `--font-disp` / `--font-ui` / `--font-mono`, which `globals.css` consumes.
- **Server components** by default. Only `Header`, `Squad` and `Effects` are client components
  (`"use client"`), since they need state or DOM APIs.
- **Content is data-driven.** Squad cards, the leaderboard and the open fixtures all render
  from `src/lib/data.ts`. Add a player object + a matching `public/assets/players/<id>.webp`
  and it appears in the grid.

## Notes

- Plain `<img>` is used for the player art (the cards rely on CSS `object-fit`/masking).
  Swap to `next/image` if you want automatic optimization.
- Scroll-reveal elements start hidden and fade in via IntersectionObserver; users with
  `prefers-reduced-motion` see everything immediately.
