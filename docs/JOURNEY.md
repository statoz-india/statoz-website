# Enter your home ground

The opening is a cinematic trip through the real 3D city: the south gateway,
football stadium, basketball court and race track, then the city overview.
All four chapters use full-screen environments, headlines and product CTAs.
Prediction/quiz samples and the cover wall have been removed from this entrance.

## Scroll and camera ownership

`city-journey-motion.ts` is the shared scroll clock. The HTML controller measures
real document chapter offsets (150svh each), publishes progress from 0 to 4,
and synchronizes copy visibility, posters, the header gradient and the handoff.
Only active copy is interactive. Native wheel, touch and keyboard scrolling
remain available; anchor jumps focus their semantic section. The brief text
entrance is once per tab session and cancels on user input.

`city-journey-config.ts` owns copy, links, accents, camera poses and curved
travel waypoints. Camera travel starts after the reading portion of each stop.
The runtime samples centripetal Catmull-Rom paths and interpolates the look target.
A small render-only drift adds life without changing the saved pose. Scroll,
venue focus and OrbitControls each have exclusive camera ownership. At progress
4 the camera reaches the existing overview before Explore becomes available.
Scrolling back retraces the route. Pause motion freezes ambient activity while
scroll navigation continues. Hidden tabs stop rendering.

## Artwork and lighting

The new gateway uses original geometry along the existing south street and the
unmodified Sports logo. A locally authored PMREM environment adds neon response
to glossy paving and metal; floodlit sports surfaces retain a matte finish.
Desktop uses restrained bloom. Mobile retains the same camera journey with
lighter rendering, and adaptive quality still reduces expensive effects.

Run `node scripts/capture-journey.mjs` with the local preview running to capture
all five desktop/mobile chapter posters from the actual Three.js scene. Set
CITY_TEST_URL to select the server. Provenance is recorded beside the posters
in public/assets/journey/scenes/manifest.json. No generated brand artwork is used.

Reduced motion and WebGL fallback use the matching chapter posters and final
static map. Without JavaScript, chapters use normal document flow and the
complete destination directory remains available. The header contains the logo,
Sports and Games; the City guide remains in the Visitor Centre.

## Verification

Run npm run check, npm run build and npm test. Tests cover responsive layout,
accessibility, reversed camera poses, pause/navigation, one-canvas ownership,
CTAs, transparent header, fallbacks, touch, keyboard, deep links and retained
routes. Browser emulation is not physical iOS/Android testing. Analytics retain
chapter-view, skip, replay and web-launch events under the existing opt-in loader.
