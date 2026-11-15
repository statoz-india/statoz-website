import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const channel of process.argv.includes('--software-only') ? [undefined] : [undefined, 'chromium']) {
  const browser = await chromium.launch({ headless: true, channel });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
    await page.bringToFront();
    await page.waitForFunction(() => document.querySelector('[data-scene-status]').getAttribute('data-scene-status') === 'ready', null, { timeout: 60000 });
    if (await page.locator('[data-simple]').getAttribute('data-simple') === 'true') {
      if (!await page.getByRole('button', { name: 'Switch to 3D view', exact: true }).isVisible()) throw new Error('Missing explicit 3D opt-in.');
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      if (audit.violations.length) throw new Error(JSON.stringify(audit.violations.map(item => item.id)));
      await page.getByRole('button', { name: 'Open city guide', exact: true }).click();
      const count = await page.getByRole('navigation', { name: 'All city destinations' }).getByRole('link').count();
      if (count !== 9) throw new Error('Missing city destinations.');
      console.log(JSON.stringify({ channel: channel || 'default', view: 'simple', accessibilityViolations: 0, destinations: count, explicit3D: true }));
      continue;
    }
    await page.waitForFunction(() => document.documentElement.dataset.cityAssets === 'loaded', null, { timeout: 60000 });
    const sample = await page.evaluate(async () => {
      const gl = document.querySelector('canvas').getContext('webgl2');
      const extension = gl.getExtension('WEBGL_debug_renderer_info');
      const gpu = extension ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      const start = performance.now(); let count = 0;
      const fps = await new Promise(resolve => { const tick = () => { count++; if (performance.now() - start > 2500) resolve(count / ((performance.now() - start) / 1000)); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
      return { gpu, fps, visibility: document.visibilityState, diagnostics: { ...document.querySelector('[data-quality]').dataset } };
    });
    console.log(JSON.stringify({ channel: channel || 'default', ...sample }));
  } finally { await browser.close(); }
}
