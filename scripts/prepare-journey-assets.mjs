import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = new URL('../../statoz-games/public/', import.meta.url);
const output = new URL('../public/assets/journey/', import.meta.url);
const covers = {
  'penalty-cup': 'assets/games/covers/launch-2026-11-01/penalty-cup.webp',
  yorker: 'assets/games/covers/launch-2026-11-06/yorker.webp',
  'rim-rush': 'assets/games/covers/launch-2026-11-06/rim-rush.webp',
  racer: 'assets/games/covers/launch-2026-11-01/f1-racing.webp',
  'football-chess': 'assets/games/covers/launch-2026-11-06/football-chess.webp',
  'pitch-duel': 'assets/games/home/covers/fot-duel.webp',
  rally: 'assets/games/rally-dash/cover.webp',
  'vibe-basketball': 'assets/games/covers/vibe-basketball.webp',
  holdover: 'assets/games/covers/launch-2026-11-06/holdover.webp',
};

await mkdir(output, { recursive: true });
for (const [name, path] of Object.entries(covers)) {
  await sharp(fileURLToPath(new URL(path, source))).resize(360, 240, { fit: 'cover' }).webp({ quality: 78 }).toFile(fileURLToPath(new URL(name + '.webp', output)));
}
await writeFile(new URL('manifest.json', output), JSON.stringify({
  source: 'Local StatOz Games product artwork; optimized copies for the opening journey.',
  regenerate: 'node scripts/prepare-journey-assets.mjs',
  covers,
}, null, 2) + '\n');
console.log('Prepared ' + Object.keys(covers).length + ' journey covers.');
