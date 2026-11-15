# StatOz website
A scrollable opening journey into an explorable 3D sports city. “Welcome home, Sports Wizard” introduces predictions, sports knowledge challenges, and 15 games before opening the city for exploration. Scroll backwards to revisit any chapter. Basketball, cricket, football, and racing venues connect to the products; city landmarks house supporting information. Local project with no production deployment configured.

City architecture, controls, free asset sources, and rebuilding instructions: [docs/CITY.md](docs/CITY.md). Current validation and screenshots: [docs/CITY-QA.md](docs/CITY-QA.md).

## Run
Node 22+. Run `npm ci`, then `npm run dev`. Open http://127.0.0.1:4410.
From the parent StatOz folder use `npm run website`. In PowerShell with blocked scripts use `npm.cmd`.

## Verify
`npm run check` checks TypeScript. `npm run build` creates the production build. `npm test` runs browser checks and starts the production server when needed; build first. Install the browser with `npx playwright install chromium` if needed. `npm run start` serves production on port 4410. Set `CITY_TEST_PORT=4411` to test alongside development. With production running, set `CITY_TEST_URL` to its local address and run `node scripts/performance-city.mjs` for a Lighthouse mobile audit and scene measurements.
Homepage locations and destinations: src/features/home/city-config.ts. Opening copy, camera stops and game destinations: src/features/home/city-journey-config.ts. The city and opening share one Three.js renderer; chapter content uses semantic HTML and normal document scrolling. Journey interaction, assets and checks: docs/JOURNEY.md. Original website provenance: docs/SOURCE.md.
Analytics are off for local review. Set NEXT_PUBLIC_ENABLE_ANALYTICS=true at build time only for an authorized production deployment. Existing GA property is retained with one loader. Events include web_launch, product_select, download_cta_click, section_view, blog_post_click, city_location_select, and city_navigation_mode.
Web previews are separate from the store app; they use demo data and local progress. The website does not host games or provide live scores.

## Dependencies and assets
Next.js is pinned to 16.4.6. The vendored design-system archive is unchanged; a scoped npm override permits the patched Next.js version instead of its older exact peer pin. Playwright and playwright-core are aligned to prevent incompatible browser-test types. Commit package-lock.json with dependency updates.

City assets use free CC0 Kenney and Quaternius models, optimized into local Meshopt/KTX2 GLB kits. [docs/CITY.md](docs/CITY.md) documents the acquisition and preparation scripts. `node scripts/capture-city.mjs` creates city posters and social artwork from the actual scene. The previous `npm run assets:prepare` stadium-image workflow remains available. `npm run capture:products` refreshes product screenshots and checks external destinations; it requires internet access. Body typography uses a WOFF2 conversion of the source Space Grotesk variable font, with its license retained. Previous artwork prompts remain in docs/image-prompts.md.

Current validation results and screenshot links: [docs/CITY-QA.md](docs/CITY-QA.md). [docs/QA.md](docs/QA.md) retains the previous stadium validation. Secondary page copy remains from the source website; the Clubhouse and City Hall link to the company and legal pages.
