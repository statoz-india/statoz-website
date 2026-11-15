# StatOz City validation

Recorded on 15 November 2026 against the local production build of the night-match revision: the venue HUD, rebuilt grounds and landmarks, the filled district and the night lighting, alongside the opening journey. The implementation is local only; nothing was pushed or published.

## Automated checks

- `npm run check`: passed.
- `npm run build`: passed, including TypeScript and generation of the existing routes.
- `npm test`: 18 passed in 46.2 seconds. [Machine-readable report](qa/browser-results.json). One earlier full run failed once in the entrance test while waiting for hydration; it passed in three isolated runs and three later full runs, so treat it as a possible timing flake to watch.
- No dependency changes in this refinement. The preceding dependency audit reported zero vulnerabilities.
- The preceding destination checks returned HTTP 200 for Sports and Games: `https://web.statoz.in/` and `https://games.statoz.in/`.

The browser suite covers loaded 3D assets at 375, 768, 1024, and 1440 pixels; label collisions with fixed controls; dock typography fitting within its cells; all four venue destinations; clicking a rendered ground; scroll tours and orbit controls; touch swipes and dragging; landscape layout; the place HUD, its action cards, previous/next stepping, keyboard focus, Escape, browser Back, cold place links, landmark links to full pages, and the city guide and credits dialogs; news articles and retained pages; reduced motion; JavaScript-disabled navigation; and WebGL loss/recovery. The new activity test verifies the populated scene, pause/resume, and available exploration controls while paused. Automated axe accessibility checks passed at all four primary widths.

A separate software-renderer probe confirmed that the default SwiftShader browser enters Simple view, retains all nine destinations, passes axe checks, and exposes an explicit Explore in 3D action.

## Production performance measurements

The test browser was full Chromium on Windows with an NVIDIA GeForce RTX 3070 Ti Laptop GPU. These are local laboratory results, not field measurements or physical-phone benchmarks. [Scene measurements](qa/city-performance.json) and [full Lighthouse report](qa/city-lighthouse.json).

| Measurement | Before the revision | Now |
| --- | --- | --- |
| Desktop city overview, 1440-pixel viewport | 75.0 fps; 351 draw calls; 363,230 triangles | 75.0 fps; 576 draw calls; 529,943 triangles |
| Mobile city overview, 390-pixel viewport on the same laptop GPU | 75.0 fps; 248 draw calls; 226,780 triangles | 75.0 fps; 361 draw calls; 341,518 triangles |
| Lighthouse mobile Performance | 74/100 | 70/100 |
| Lighthouse Accessibility / Best Practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| Largest contentful paint | 1.07 seconds | 1.06 seconds |
| Cumulative layout shift | 0 | 0 |
| Total blocking time | 1.39 seconds | 1.45 seconds |

Lighthouse used simulated mobile networking and 4× CPU slowdown. Its final run had no runtime error or warnings. The measured LCP and CLS meet the planned 2.5-second and 0.1 thresholds, and desktop animation meets the 60-fps target. A 390-pixel viewport on this GPU does not establish the 30-fps physical-phone target.

The poster and HTML controls appear before the 3D runtime loads. Models and asynchronous shader warmup finish before rendering begins. Building the larger city in one task first raised total blocking time to 2.20 seconds (Lighthouse 66). The world is now built in stages and its geometry merge pauses every 24 ms, which returned blocking time to 1.45 seconds. Draw calls and triangles rose by roughly half; frame rate on this GPU is unchanged at the display's 75 Hz cap, which says nothing about phones. Startup CPU work remains the main performance limitation; a 70 score is not a claim of a fully optimized mobile release.

Before public release, measure startup responsiveness, sustained rendering, memory, touch gestures, and recovery on physical Android hardware and iOS Safari. Confirm production CDN caching and compression when a deployment is authorized. Simple view remains available for reduced motion, missing WebGL, software rendering, and user preference.

## Visual review

Screenshots show the actual rendered city and were reviewed alongside browser checks:

Arriving at a place keeps the city sharp: the venue is the artwork, its name and story sit on the left, and its actions replace the dock. Each of the nine places was reviewed at 1440 pixels and at phone width, and the HUD was measured against the action cards at 1920×1080, 1366×650, 1280×600, 1024×768 and 812×375 with no overlap. The night-match lighting, twelve stands, about 336 people, rebuilt landmarks and district are documented in [CITY-DETAILS.md](CITY-DETAILS.md). The current suite writes the journey screenshots below; the city and venue images further down predate this revision.

- [Journey, 1440 pixels](qa/journey-1440.png), [1024](qa/journey-1024.png), [768](qa/journey-768.png), [375](qa/journey-375.png)
- Earlier refinement: [desktop, 1440 pixels](qa/city-1440.png)
- [Laptop, 1024 pixels](qa/city-1024.png)
- [Tablet, 768 pixels](qa/city-768.png)
- [Phone, 375 pixels](qa/city-375.png)
- [Phone landscape](qa/city-landscape.png)
- [Basketball players and stand](qa/city-life-basketball.png)
- [Cricket players and stand](qa/city-life-cricket.png)
- [Football players and stand](qa/city-life-football.png)
- [Circuit, spectators, and pit crew](qa/city-life-racing.png)

The city uses free CC0 models from Kenney and the Standard edition of Quaternius Downtown City MegaKit. Optimized models, textures, and the transcoder are served locally. [Asset provenance](../public/assets/city/manifest.json) records sources, licenses, hashes, and modifications; [authored detail provenance](../public/assets/city/authored-details.json) records the original figures, stands, and source-model palette adaptations. [CITY.md](CITY.md) explains rebuilding and implementation.

## Reproduce

Run `npm run check` and `npm run build`, then `npm test`. The tests use full Chromium with hardware acceleration. Set `CITY_TEST_PORT=4411` to run beside the development preview on port 4410.

With production running on port 4411, run `node scripts/performance-city.mjs` for scene measurements and Lighthouse. `node scripts/probe-city.mjs --software-only` checks the software-rendering fallback. Set `CITY_TEST_URL` to use a different local port.

`node scripts/inspect-city-life.mjs` captures all four venues close up and compares frames a second apart to confirm rendered activity, rather than just checking a clock value. The script reports browser errors and the instantiated crowd/athlete/stand counts.

The older [QA.md](QA.md) documents the previous stadium homepage and is retained as historical evidence.
