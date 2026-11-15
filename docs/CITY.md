# StatOz City

The homepage is an explorable cyberpunk sports district. Run `npm run dev` and open http://127.0.0.1:4410. The experience stays local; no publishing is configured.

The four chapter opening introduces Sports and Games before arriving at the city overview. See [JOURNEY.md](JOURNEY.md) for its copy, interactions, scrolling and assets. The compact ground dock uses original sport symbols. Venue names and actions sit over the city; the city guide retains access to all nine destinations.

## Exploring

- Scroll or swipe vertically through the opening. Scroll back from the city to revisit chapters; Skip intro skips ahead and Replay journey returns to the start.
- Explore: drag to orbit and right-drag to pan. Horizontal touch drags orbit; vertical swipes and the wheel scroll the page. Zoom buttons or +/- zoom, arrow keys pan a focused canvas, and Home returns to the overview.
- Select a ground, its floating label, a map destination, or a destination in City guide. Sports opens https://web.statoz.in/ and Games opens https://games.statoz.in/ in the current tab.
- Arriving at a ground or landmark keeps the city on screen. Its name, tagline and story sit beside the venue, and two or three action cards take the dock's place; nothing is blurred or boxed in. Escape, Back, Back to the city, or the overview control return to the city. Previous and next controls step through all nine places. In Explore, panning well away from a place leaves it.
- Long documents open on their own pages: About, FAQ, Privacy and Terms. Only the city guide and city credits use a native dialog.
- News articles retain their canonical pages and have a Return to City link.
- Simple view provides the same destinations through a static map. Reduced motion starts in Simple view. A server-rendered directory also works without JavaScript.
- Pause city activity freezes people, sports action, cars, and traffic while leaving camera controls available.
- A native WebGL capability probe runs before downloading the 3D runtime. Known software renderers start in Simple view; Explore in 3D explicitly opts into rendering for the current session. Supported hardware GPUs open the 3D city automatically.

## Implementation

`src/features/home/city-config.ts` is the single location manifest. The lightweight React scene wrapper loads the Three.js runtime after initial paint. The runtime has one renderer, a shared document-scroll clock and curved camera journey, and exclusive camera ownership for tours, OrbitControls, and focus transitions. React does not rerender on every frame.

The world contains authored sports geometry and markings, reusable city materials, merged static meshes, instanced windows/greenery, and locally served GLB assets. KTX2 textures are transcoded with one worker to bound peak memory. Mobile uses a lower pixel ratio, no bloom, and fog matched to its more distant overview camera. Sustained frame rates below 28 fps lower resolution and remove expensive desktop effects. Rendering stops in hidden tabs; unmounting disposes controls, timelines, workers, render targets, geometry, materials, and textures.

The city is lit as a night match. A dim sky and cool moonlight give form; each ground has one soft light, floodlight masts with hazy beams, and pools of light under every street lamp. Haze, a horizon glow, stars, a far skyline and scattered distant lights carry the district to the horizon. Desktop renders through an anti-aliased HDR target with bloom, a vignette and a cool shadow grade.

The world is authored in five modules. `city-kit.ts` holds shared tools: merged static geometry, tiered stands, floodlights, signs that fit their boards, instanced windows and trees, light pools and beams. `city-venues.ts` builds the four grounds as real venues: a horseshoe football stadium with a big screen, a round cricket ground with a pavilion and sight screens, a street court with bleachers, a mural wall and festoon lights, and a circuit with a pit complex, grandstand, neon gates and barriers. `city-landmarks.ts` gives the Clubhouse, newsroom, App Station, Visitor Centre and City Hall their own silhouettes. `city-district.ts` lays out streets, pavements, crossings, signals, shops, a park, a car park, billboards, the skyline and the sky. `city-world.ts` assembles them with the CC0 building kits. Near-side stands and masts stay low or absent so the pitches remain visible from the usual viewpoints. `city-sport-art.tsx` contains the original destination symbols.

The city includes twelve authored stands and about 340 instanced people: walking citizens, active athletes, spectators, and pit marshals. `city-life.ts` owns articulated poses and sports loops; seated spectators are re-posed a quarter at a time. Building normalization retains model root offsets and fits each model to a reserved plot; the revised circuit stays between the roads. Labels reserve space around UI controls and use leader lines to retain their world anchors. See [CITY-DETAILS.md](CITY-DETAILS.md) for the art direction, counts, budgets, and placement corrections.

The interactive poster and HTML remain usable during loading. Rendering begins after the model kits and asynchronous shader compilation are ready, which avoids blocking the first visible frame on GPU shader linking. Disposing a scene during compilation defers GPU teardown until compilation settles.

Company, Privacy, and Terms copy stays on the existing pages, which the Clubhouse and City Hall link to. The original text remains in `city-documents.tsx`; no legal text was rewritten.

## Asset sources and rebuilding

The shipped models are selected from Quaternius Downtown City MegaKit Standard and Kenney City Kit Commercial, City Kit Roads, and Racing Kit. Each is CC0. The project uses the free Standard Quaternius archive, not its paid Source edition. Source files, hashes, modifications, and licenses are recorded in `public/assets/city/manifest.json` and its adjacent `licenses` directory.

The downloaded archives and editable source cache stay under ignored `.cache/city-assets`. To reproduce:

1. `node scripts/acquire-city-assets.mjs` downloads the free source archives and official Khronos WASM encoder. Internet access is required; no account or purchase is used.
2. `python scripts/extract-city-assets.py` extracts runtime sources and licenses into the workspace, checking archive paths.
3. `node scripts/prepare-city-assets.mjs` selects models, reduces exterior geometry/textures, merges shared resources, encodes mipmapped KTX2 textures, and writes Meshopt-compressed GLB kits.
4. With a preview running, `node scripts/capture-city.mjs` creates loading posters and social artwork from the actual rendered scene.

The two GLB kits total 1,781,848 bytes. The locally served Basis transcoder adds 584,862 bytes. Original venue layouts, signs, and brand compositions are authored in this project. Poly Haven and ambientCG were researched as optional material sources; no files from them are represented as shipped assets.

## Checking

Run `npm run check`, `npm run build`, and `npm test`. To check a production build alongside an existing development server, set `CITY_TEST_PORT=4411` before `npm test`. Playwright starts that port automatically when needed.

With production serving on port 4411, `node scripts/performance-city.mjs` records Lighthouse and scene diagnostics. `CITY_TEST_URL` can select another local server for capture/performance scripts. Physical Android and iOS Safari checks remain necessary before a public release; browser emulation is recorded separately.

Automated 3D checks use full Chromium (`channel: chromium`) with hardware acceleration. The separate default headless shell uses SwiftShader software rendering on this Windows host; its frame rates do not represent the laptop GPU. The capability fallback applies to real software-rendered browsers too.
