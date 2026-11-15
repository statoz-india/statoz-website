import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';

await mkdir('docs/qa', { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.CITY_TEST_URL || 'http://127.0.0.1:4410/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('[data-scene-status]')?.getAttribute('data-scene-status') === 'ready', null, { timeout: 60000 });
  if (await page.locator('[data-simple]').getAttribute('data-simple') === 'true') await page.getByRole('button', { name: 'Switch to 3D view', exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.cityAssets === 'loaded', null, { timeout: 60000 });
  for (const sport of ['Basketball', 'Cricket', 'Football', 'Racing']) {
    await page.getByRole('navigation', { name: 'Sports grounds' }).getByRole('link', { name: sport, exact: true }).click();
    await page.waitForTimeout(1400);
    await page.keyboard.press('Escape');
    await page.getByRole('tab', { name: 'Explore', exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    const hidden = await page.addStyleTag({ content: 'header,main,[data-city-label],[data-city-link]{visibility:hidden!important}' });
    const first = await page.screenshot({ path: 'docs/qa/city-life-' + sport.toLowerCase() + '.png', clip: { x: 260, y: 150, width: 1050, height: 700 } });
    await page.waitForTimeout(1000);
    const second = await page.screenshot({ clip: { x: 260, y: 150, width: 1050, height: 700 } });
    const moving = createHash('sha256').update(first).digest('hex') !== createHash('sha256').update(second).digest('hex');
    if (!moving) throw new Error(sport + ' activity did not change the rendered frame.');
    console.log(JSON.stringify({ sport, renderedActivity: moving }));
    await hidden.evaluate(element => element.remove());
  }
  if (errors.length) throw new Error(JSON.stringify(errors));
  console.log(JSON.stringify({ errors, scene: await page.locator('[data-quality]').evaluate(element => ({ ...element.dataset })) }));
  await context.close();
} finally { await browser.close(); }
