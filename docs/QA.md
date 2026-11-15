# Website validation

Completed 2026-11-14. This is a local homepage revamp, based on the existing Desktop website. Nothing was pushed or deployed.

## Implemented

- Stadium hero with separate desktop/mobile artwork, responsive AVIF delivery, WebP fallback, and equal-size web/app actions.
- Sports and Games entry points, a current public Sports screenshot, six game previews, daily ritual section, app-store ticket, and native FAQ disclosure controls.
- Responsive navigation, keyboard focus and Escape handling, skip link, reduced-motion support, and server-rendered content that remains available without JavaScript.
- Existing blog, about, FAQ, game, download, and legal routes retained. Legacy URLs and hashes lead to the relevant new sections.
- Existing analytics hooks extended for product selection and web launches. Remote analytics loading is disabled for local review.
- Local fonts, generated social image, updated metadata, and separated homepage/legacy styles.

## Checks

| Check | Result |
| --- | --- |
| Production build, including TypeScript | Passed; 31 pages generated |
| Playwright | 7 passed |
| Responsive homepage | 375, 768, 1024, 1440 px; no horizontal overflow |
| Axe WCAG 2 A/AA and 2.1 AA checks | No detected violations at all four widths |
| Keyboard, mobile menu, legacy hash, analytics events | Passed |
| No-JavaScript content and FAQ / reduced motion | Passed |
| Retained routes, redirects, sitemap, robots, manifest, 404 | Passed |
| Seven retained page render checks | HTTP 200; expected heading styles; no horizontal overflow |
| External product, game, quiz and store destinations | All 11 returned HTTP 200 |
| npm dependency audit after updates | Zero reported vulnerabilities |

External checks verify destinations, not every game or store installation flow. The full site was tested in Chromium; no physical-device or Safari/Firefox run was performed. The embedded preview browser was unavailable, so validation used Playwright and inspected screenshots.

## Mobile Lighthouse

Production server on localhost, Lighthouse 13.6.0 default mobile simulation. Latest run after the last build and the audit script's browser-cleanup fix; this is a lab result, not field data. Runs varied from 91 to 94 on the final page.

| Metric | Result |
| --- | --- |
| Performance | 94 / 100 |
| Accessibility | 100 / 100 |
| Best practices | 100 / 100 |
| SEO | 100 / 100 |
| Largest Contentful Paint | 3.04 seconds |
| Cumulative Layout Shift | 0 |

The 90+ performance target is met. LCP remains above the 2.5-second target under the simulated mobile conditions. Validate again on the eventual host and continue reducing initial delivery cost before treating that target as achieved. The first local audit was 85/100 with 4.30-second LCP; font compression/subsetting, separate legacy CSS, and responsive hero assets improved the result.

Mobile stadium AVIF: 33,189 bytes; desktop AVIF: 69,513 bytes. Space Grotesk delivery font: 20,780 bytes, down from the 136,676-byte TTF. Fonts and image originals are retained for reproducibility. Font rebuild: `python scripts/prepare-font.py` after installing the documented conversion tools.

## Review artifacts

- [Desktop hero](qa/hero-desktop.png) and [mobile hero](qa/hero-mobile.png).
- Full homepage: [375 px](qa/home-375.png), [768 px](qa/home-768.png), [1024 px](qa/home-1024.png), [1440 px](qa/home-1440.png).
- [Browser results](qa/browser-results.json), [Lighthouse report](qa/lighthouse.json), [destination checks](qa/destinations.json), and [retained-page checks](qa/retained-pages.json).
- [Source provenance](SOURCE.md), [asset hashes](asset-provenance.json), and [image prompts](image-prompts.md).

Secondary-page content remains from the source website, apart from corrected download claims. A complete rewrite of those pages is a separate pass.

## Reproduce

From this project: `npm ci`, `npm run build`, then `npm test`.
For performance and retained-page captures, run `npm run start`, followed in another terminal by `node scripts/performance.mjs` and `node scripts/check-secondary-pages.mjs`.
For local editing, run `npm run website` from the parent StatOz folder and open http://127.0.0.1:4410. Use `npm.cmd` in PowerShell if script execution is blocked.
