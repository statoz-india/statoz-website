import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('.cache/city-captures', { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
try {
  for (const [name, width, height] of [['desktop', 1440, 950], ['mobile', 375, 950]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto(process.env.CITY_TEST_URL || 'http://127.0.0.1:4410/', { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForFunction(() => document.documentElement.dataset.cityAssets === 'loaded', null, { timeout: 60000 });
    await page.waitForFunction(() => document.querySelector('[data-scene-status]')?.getAttribute('data-scene-status') === 'ready', null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.addStyleTag({ content: '[data-scene-status] > :not([data-mode]), [data-city-label], [data-city-link] {visibility:hidden!important} [data-mode], [data-mode] canvas {visibility:visible!important}' });
    const image = await page.screenshot();
    await sharp(image).resize(name === 'desktop' ? 1600 : 750, name === 'desktop' ? 1000 : 1900, { fit: 'cover' }).webp({ quality: 82 }).toFile('public/assets/city/' + (name === 'desktop' ? 'city-poster' : 'city-mobile') + '.webp');
    console.log('Captured the actual ' + name + ' city poster.');
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const page = await context.newPage(); await page.goto(process.env.CITY_TEST_URL || 'http://127.0.0.1:4410/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.cityAssets === 'loaded', null, { timeout: 60000 });
  await page.waitForFunction(() => document.querySelector('[data-scene-status]')?.getAttribute('data-scene-status') === 'ready', null, { timeout: 60000 });
  await page.addStyleTag({ content: 'header,[data-city-controls],#city-navigation,[data-city-label],[data-city-link],[class*="dockHeading"]{visibility:hidden!important}' });
  await sharp(await page.screenshot()).jpeg({ quality: 88 }).toFile('public/assets/city/city-social.jpg');
  await context.close();
} finally { await browser.close(); }
