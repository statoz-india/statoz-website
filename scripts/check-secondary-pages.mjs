import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const results = [];
try {
  for (const route of ['/about', '/blog', '/faq', '/download', '/games/pitch-duel', '/privacyPolicy', '/termsAndConditions']) {
    const response = await page.goto('http://127.0.0.1:4410' + route);
    await page.evaluate(() => document.fonts.ready);
    const details = await page.evaluate(() => {
      const title = document.querySelector('main h1, main h2');
      return {
        heading: title?.textContent,
        headingSize: title ? getComputedStyle(title).fontSize : null,
        stylesheets: Array.from(document.styleSheets).map(sheet => sheet.href),
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    await page.screenshot({ path: 'docs/qa/retained-' + route.slice(1).replaceAll('/', '-') + '.png' });
    results.push({ route, status: response?.status(), ...details });
  }
} finally {
  await browser.close();
}
await writeFile('docs/qa/retained-pages.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results.map(({ stylesheets, ...result }) => result), null, 2));
if (results.some(result => result.status !== 200 || !result.heading || result.horizontalOverflow)) process.exitCode = 1;
