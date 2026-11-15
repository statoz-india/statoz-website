import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('docs/qa', { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
try {
  for (const width of [1440, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 950 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text().slice(0, 250)); });
    await page.goto(process.env.CITY_TEST_URL || 'http://127.0.0.1:4410/', { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForFunction(() => document.querySelector('[data-scene-status]')?.getAttribute('data-scene-status') !== 'loading', null, { timeout: 60000 });
    if (await page.locator('[data-scene-status]').getAttribute('data-scene-status') === 'ready') {
      try { await page.waitForFunction(() => ['loaded', 'unavailable'].includes(document.documentElement.dataset.cityAssets || ''), null, { timeout: 60000 }); }
      catch { console.log(JSON.stringify({ width, assets: await page.locator('html').getAttribute('data-city-assets'), errors })); throw new Error('City assets did not settle within 60 seconds.'); }
    }
    await page.waitForTimeout(1800);
    await page.screenshot({ path: 'docs/qa/city-' + width + '.png' });
    console.log(JSON.stringify({ width, status: await page.locator('[data-scene-status]').getAttribute('data-scene-status'), assets: await page.locator('html').getAttribute('data-city-assets'), errors, diagnostics: await page.locator('[data-quality]').evaluateAll(items => items.map(item => ({ ...item.dataset }))) }));
    if (width === 1440) {
      await page.getByRole('navigation', { name: 'Sports grounds' }).getByRole('link', { name: /Football/ }).click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'docs/qa/city-venue.png' });
    }
    await context.close();
  }
} finally { await browser.close(); }
