import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='public/assets/stadium/';
for(const name of ['stadium-desktop','stadium-mobile']){
 await sharp(root+name+'.png').resize({width:name.endsWith('desktop')?1920:780,withoutEnlargement:true}).webp({quality:name.endsWith('desktop')?80:74}).toFile(root+name+'.webp');
 await sharp(root+name+'.png').resize({width:name.endsWith('desktop')?1920:780,withoutEnlargement:true}).avif({quality:48,effort:6}).toFile(root+name+'.avif');
}
const social=Buffer.from('<svg width="1200" height="630"><rect width="1200" height="630" fill="#06101c" opacity=".35"/><text x="75" y="100" fill="#5cdfff" font-family="sans-serif" font-weight="bold" font-size="30">StatOz</text><text x="75" y="250" fill="white" font-family="sans-serif" font-weight="bold" font-size="70">Your daily home</text><text x="75" y="335" fill="#5cdfff" font-family="sans-serif" font-weight="bold" font-size="70">for sport.</text><text x="78" y="405" fill="white" font-family="sans-serif" font-size="20">SPORTS  /  GAMES  /  YOUR HOME GROUND</text></svg>');
await sharp(root+'stadium-desktop.png').resize(1200,630,{fit:'cover'}).composite([{input:social}]).jpeg({quality:88}).toFile(root+'social-cover.jpg');
const sources={
 'stadium-desktop.png':'C:/Users/priya/.codex/generated_images/01a1d4f7-d9d4-7441-9e7a-611766a6c82a/exec-62f0b9a4-c357-4924-8030-165c1b418659.png',
 'stadium-mobile.png':'C:/Users/priya/.codex/generated_images/01a1d4f7-d9d4-7441-9e7a-611766a6c82a/exec-90ddf9c2-909c-4532-95a4-da107350c833.png',
 'hoop-legacy.webp':'statoz-games-web/public/assets/games/covers/launch-2026-11-06/hoop-legacy.webp',
 'pitch-rush.webp':'statoz-games-web/public/assets/games/home/covers/pitch-rush.webp',
 'cricketer.webp':'statoz-games-web/public/assets/games/covers/launch-2026-11-01/cricketer.webp',
 'formula.webp':'statoz-games-web/public/assets/games/covers/formula-2026-11-06/formula.webp',
 'longbow.webp':'statoz-games-web/public/assets/games/covers/launch-2026-11-06/longbow.webp',
 'open-golf.webp':'statoz-games-web/public/assets/games/covers/launch-2026-11-01/open-golf.webp',
 'sports-preview.webp':'https://pai45.github.io/statoz-next-sports-web/',
 'games-preview.webp':'https://pai45.github.io/statoz-next-games-web/'
};
const manifest=[];for(const [file,source] of Object.entries(sources)){manifest.push({file,source,sha256:createHash('sha256').update(await readFile(root+file)).digest('hex')});}
await writeFile('docs/asset-provenance.json',JSON.stringify(manifest,null,2));
