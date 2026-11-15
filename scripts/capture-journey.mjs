import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const output = 'public/assets/journey/scenes';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
try {
  for (const [suffix, width, height] of [['', 1440, 950], ['-mobile', 750, 1624]]) {
    // Render the mobile camera at CSS phone width, with a 2x capture.
    const context = await browser.newContext({ viewport: { width: suffix ? 375 : width, height: suffix ? 812 : height }, deviceScaleFactor: suffix ? 2 : 1 });
    await context.addInitScript(() => sessionStorage.setItem('statoz-city-force-3d', 'true'));
    const page = await context.newPage();
    await page.goto(process.env.CITY_TEST_URL || 'http://127.0.0.1:4410/');
    await page.waitForFunction(() => document.documentElement.dataset.cityAssets === 'loaded' && document.querySelector('[data-scene-status]')?.dataset.sceneStatus === 'ready', null, { timeout: 60000 });
    await page.addStyleTag({ content: '.ignore-capture{display:none} [data-chapter-copy],[data-chapter-poster],header,[data-city-controls],[data-city-dock],[data-city-label],[data-city-link],[data-city-atmosphere],nav[aria-label="Opening journey"],[class*="journeyTools"]{visibility:hidden!important}' });
    for (const id of ['welcome', 'predict', 'knowledge', 'games', 'city']) {
      await page.locator(`[data-journey-chapter="${id}"]`).evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }));
      await page.waitForTimeout(700);
      await sharp(await page.screenshot()).resize(width, height).webp({ quality: 83 }).toFile(`${output}/${id}${suffix}.webp`);
      console.log(`Captured ${id}${suffix}`);
    }
    await context.close();
  }
  await writeFile(`${output}/manifest.json`, JSON.stringify({ source: 'Local captures of the actual StatOz Three.js city', script: 'scripts/capture-journey.mjs', logo: 'Unmodified StatOz Sports app_logo.png', chapters: ['welcome', 'predict', 'knowledge', 'games', 'city'] }, null, 2));
} finally { await browser.close(); }
