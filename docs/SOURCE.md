# Source and asset provenance
The website logo at `public/assets/icons/app_logo.png` is an unmodified copy of `statoz-sports-web/public/assets/icons/app_logo.png`, the asset used by Sports' `BrandIcon name="logo"`. SHA-256: `be73bc45c4189247a80272898ce55d4231ea07d25c045d058de0949a3c2af2c3`. Homepage, shared header and footer use that same design-system icon.

Created 2026-11-13 from C:/Users/priya/OneDrive/Desktop/statoz-website-2.
Original remote: https://github.com/statoz-india/statoz-website.git.
Its nested .publish-repo snapshot is b87ca2f (2026-06-26); the outer working source contains additional layout and route changes and was copied as the base. Originals were not modified.
Only src, public, package manifests, TypeScript/Next config, next-env and .gitignore were copied. No credentials, Git metadata, caches or nested publication checkout were copied.
Design system: accepted @statoz/design-system 0.2.0 tarball from statoz-products/vendor. Fonts from statoz-sports-web/src/app/fonts. Game artwork from statoz-games-web/public/assets/games, source hashes recorded in asset-provenance.json. Product capture provenance is recorded with asset hashes.
Stadium images generated with built-in ImageGen. Full prompts and original output paths: image-prompts.md. Fictional stadiums without club marks. Delivery derivatives are compressed. Social artwork combines the panorama with the site's headline.
Kept Next App Router, secondary pages, game content and analytics hooks. Replaced homepage, navigation, footer and shared metadata. Secondary copy is retained except unsupported download ratings/bonus claims; a complete secondary-page content refresh is outside this homepage pass.

Final dependency pass on 2026-11-14: Next.js 16.4.6, React 19.2.8, and patched browser compatibility metadata. The design-system archive retains its original bytes; a scoped npm peer override selects the app's patched Next version. Reference advisories: https://github.com/advisories/GHSA-2464-fhr4-w9xw and https://github.com/advisories/GHSA-673q-mjm6-r5xr.

Space Grotesk was converted locally from TTF to WOFF2 using fonttools 4.68.0 and Brotli 1.2.1. The delivery font is checked in; these conversion tools are not runtime dependencies. Legacy page styles load through BlogChrome and the download page, and game detail styles load only with game detail routes.

The delivery font contains Latin and common punctuation characters; the complete original TTF remains available. Rebuild instructions are in scripts/prepare-font.py. Orbitron's OFL license is from https://raw.githubusercontent.com/google/fonts/main/ofl/orbitron/OFL.txt and is stored alongside the font.
