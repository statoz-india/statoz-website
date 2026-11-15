import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';

const url = process.env.CITY_TEST_URL || 'http://127.0.0.1:4411/';
const probe = createServer();
await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(0, '127.0.0.1', resolve); });
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const browser = await chromium.launch({ headless: true, channel: 'chromium', args: ['--remote-debugging-port=' + port] });
try {
  const frames = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 950 } });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.bringToFront();
    await page.waitForFunction(() => document.querySelector('[data-scene-status]').getAttribute('data-scene-status') !== 'loading', null, { timeout: 60000 });
    if (await page.locator('[data-simple]').getAttribute('data-simple') === 'true') {
      frames.push({ viewport: width, quality: 'simple', note: 'Capability fallback: this browser is using the lightweight city.' });
      await context.close(); continue;
    }
    await page.waitForFunction(() => document.documentElement.dataset.cityAssets === 'loaded', null, { timeout: 60000 });
    await page.waitForTimeout(10000);
    frames.push(await page.locator('[data-quality]').evaluate(host => {
      const gl = host.querySelector('canvas').getContext('webgl2');
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      return { viewport: innerWidth, gpu: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), visibility: document.visibilityState, ...host.dataset };
    }));
    console.log(JSON.stringify({ frameSample: frames[frames.length - 1] }));
    await context.close();
  }
  const summary = { frames, note: 'Local desktop browser lab measurements. Mobile widths are emulation, not physical-phone benchmarks.' };
  await writeFile('docs/qa/city-performance.json', JSON.stringify(summary, null, 2));
  if (process.env.CITY_SKIP_LIGHTHOUSE !== 'true') {
    const result = await lighthouse(url, { port, output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    await writeFile('docs/qa/city-lighthouse.json', result.report);
    const report = { runtimeError: result.lhr.runtimeError, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([name, category]) => [name, category.score])), LCP: result.lhr.audits['largest-contentful-paint'].numericValue, CLS: result.lhr.audits['cumulative-layout-shift'].numericValue, TBT: result.lhr.audits['total-blocking-time'].numericValue };
    await writeFile('docs/qa/city-performance.json', JSON.stringify({ ...summary, lighthouse: report }, null, 2));
    console.log(JSON.stringify(report));
  }
} finally { await browser.close(); }
