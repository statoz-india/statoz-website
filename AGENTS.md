# StatOz website
Independent local website at port 4410. Use npm run dev, npm run check, npm run build, npm test.
Source provenance: docs/SOURCE.md. Never write to the original Desktop website folders.
Homepage compositions live in src/features/home. Keep CSS scoped and consume vendored design-system tokens. Preserve secondary routes and layouts.
This is an explorable cyberpunk city introducing the products, not a live scores dashboard. Sports opens web.statoz.in and Games opens games.statoz.in. Keep product/preview claims factual and identify current store app downloads separately. Never invent ratings, user counts, live data or cross-product progress.
City locations have one manifest in src/features/home/city-config.ts. Free asset provenance is in public/assets/city/manifest.json; rebuilding and camera ownership are documented in docs/CITY.md. Keep rendering on one canvas and bound texture-transcoder workers.
Push, publish or change production only when explicitly requested.
