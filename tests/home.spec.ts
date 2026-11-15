import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function chapter(page: Page, id: string) {
  await expect(page.locator('[data-enhanced]')).toHaveAttribute('data-enhanced', 'true');
  await page.locator(`[data-journey-chapter="${id}"]`).evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY, behavior: 'instant' }));
  await expect(page.locator(`[data-journey-chapter="${id}"]`)).toHaveAttribute('data-active', 'true');
}

async function ready3D(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('statoz-city-force-3d', 'true'));
  await page.goto('/');
  await expect(page.locator('[data-scene-status]')).toHaveAttribute('data-scene-status', 'ready', { timeout: 60000 });
  await expect(page.locator('html')).toHaveAttribute('data-city-assets', 'loaded', { timeout: 60000 });
}

for (const width of [375, 768, 1024, 1440]) {
  test(`journey layout and accessibility at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sports Wizard.');
    await expect(page.getByRole('navigation', { name: 'Opening journey' }).getByRole('link')).toHaveCount(4);
    for (const id of ['welcome', 'predict', 'knowledge', 'games', 'city']) {
      await chapter(page, id);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(true);
      const audit = await new AxeBuilder({ page }).include(`[data-journey-chapter="${id}"]`).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(audit.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })), id).toEqual([]);
    }
    await chapter(page, 'welcome');
    await page.screenshot({ path: `docs/qa/journey-${width}.png` });
    expect(errors).toEqual([]);
  });
}

test('cinematic chapters reverse to the same camera positions and pause ambient motion', async ({ page }) => {
  await ready3D(page);
  const scene = page.locator('[data-city-scene]');
  await chapter(page, 'predict'); const predictionPose = await scene.getAttribute('data-camera-position');
  await chapter(page, 'knowledge'); expect(await scene.getAttribute('data-camera-position')).not.toBe(predictionPose);
  await chapter(page, 'games'); await chapter(page, 'predict');
  await expect(scene).toHaveAttribute('data-camera-position', predictionPose!);
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await expect(scene).toHaveAttribute('data-activity-paused', 'true');
  await page.waitForTimeout(700); const time = await scene.getAttribute('data-activity-time');
  await page.waitForTimeout(700); expect(await scene.getAttribute('data-activity-time')).toBe(time);
  await chapter(page, 'games'); expect(await scene.getAttribute('data-camera-position')).not.toBe(predictionPose);
  await expect(page.getByRole('link', { name: 'Find my game' })).toBeVisible();
});

test('keyboard chapter links, rapid scroll and replay preserve navigation', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Opening journey' });
  const knowledge = navigation.getByRole('link', { name: /Knowledge/ });
  await knowledge.focus(); await page.keyboard.press('Enter');
  await expect(knowledge).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('#journey-knowledge')).toBeFocused();
  await chapter(page, 'city'); await chapter(page, 'predict'); await chapter(page, 'games');
  await expect(navigation.getByRole('link', { name: /Games/ })).toHaveAttribute('aria-current', 'step');
  await chapter(page, 'city');
  await page.locator('[data-city-dock]').getByRole('button', { name: 'Replay journey' }).click();
  await expect(navigation.getByRole('link', { name: /Arrival/ })).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('#journey-welcome')).toBeFocused();
});

test('cinematic CTAs, authentic logo, transparent header and scene posters', async ({ page, request }) => {
  await page.goto('/');
  const header = page.locator('[data-city-header]');
  await expect(header.getByRole('navigation').getByRole('link')).toHaveCount(2);
  await expect(header.getByRole('button')).toHaveCount(0);
  await expect(header.locator('img')).toHaveAttribute('src', /app_logo/);
  for (const [id, label, href] of [['predict', 'Make your call', 'https://web.statoz.in/'], ['knowledge', 'Prove your knowledge', 'https://web.statoz.in/quiz/'], ['games', 'Find my game', 'https://games.statoz.in/']]) {
    await chapter(page, id); await expect(page.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
  }
  for (const id of ['welcome', 'predict', 'knowledge', 'games', 'city']) for (const suffix of ['', '-mobile']) expect((await request.get('/assets/journey/scenes/' + id + suffix + '.webp')).ok()).toBe(true);
  await chapter(page, 'city');
  expect(await header.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  await expect(page.getByRole('navigation', { name: 'Opening journey' })).toBeHidden();
});

test('one canvas follows scrolling and Explore allows scrolling back', async ({ page }) => {
  await ready3D(page); await expect(page.locator('canvas')).toHaveCount(1);
  const label = page.locator('[data-city-label="football"]');
  await chapter(page, 'city');
  await expect(label).toBeVisible();
  const initial = await label.getAttribute('style');
  await page.getByRole('tab', { name: 'Explore', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Zoom in', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect.poll(() => label.getAttribute('style')).not.toBe(initial);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(1100, 430); await page.mouse.wheel(0, -1000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(before - 300);
  await expect(page.locator('[data-scene-status]')).toHaveAttribute('data-journey', 'true');
  await chapter(page, 'welcome'); await expect(page.locator('canvas')).toHaveCount(1);
});

test('grounds retain products and Escape restores focus', async ({ page }) => {
  await page.goto('/'); await chapter(page, 'city');
  for (const [sport, title] of [['Basketball', 'The Blacktop'], ['Cricket', 'The Oval'], ['Football', 'The Floodlights'], ['Racing', 'Neon Circuit']]) {
    const ground = page.getByRole('navigation', { name: 'Sports grounds' }).getByRole('link', { name: new RegExp(sport) });
    await ground.click(); await expect(page.locator('[data-city-hud] h2')).toHaveText(title);
    const actions = page.locator('[data-city-actions]');
    await expect(actions.getByRole('link', { name: /Explore Sports/ })).toHaveAttribute('href', 'https://web.statoz.in/');
    await expect(actions.getByRole('link', { name: /Play Games/ })).toHaveAttribute('href', 'https://games.statoz.in/');
    await page.keyboard.press('Escape'); await expect(ground).toBeFocused();
    await expect(page.locator('[data-city-hud]')).not.toHaveAttribute('data-open');
  }
});

test('city activity pauses and context loss offers recovery', async ({ page }) => {
  await ready3D(page); await chapter(page, 'city');
  const scene = page.locator('[data-quality]');
  await page.getByRole('button', { name: 'Pause city activity' }).click();
  await expect(scene).toHaveAttribute('data-activity-paused', 'true');
  await page.waitForTimeout(700); const paused = await scene.getAttribute('data-activity-time');
  await page.waitForTimeout(700); expect(await scene.getAttribute('data-activity-time')).toBe(paused);
  const supported = await page.locator('canvas').evaluate(canvas => {
    const extension = (canvas as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context');
    extension?.loseContext(); return !!extension;
  });
  test.skip(!supported, 'Browser does not expose context-loss simulation.');
  await expect(page.locator('[data-simple]')).toHaveAttribute('data-simple', 'true');
  await expect(page.getByRole('button', { name: 'Retry 3D' })).toBeVisible();
  await chapter(page, 'predict');
  await expect(page.getByRole('link', { name: 'Make your call', exact: true })).toBeVisible();
});

test('guide and legacy deep links enter the city; Back leaves a venue', async ({ page }) => {
  await page.goto('/#city/help'); await page.locator('[data-city-actions]').getByRole('button', { name: /City guide/ }).click();
  const directory = page.getByRole('navigation', { name: 'All city destinations' });
  await expect(directory.getByRole('link')).toHaveCount(9);
  await directory.getByRole('link', { name: /Cricket/ }).click();
  await expect(page).toHaveURL(/#city\/cricket$/);
  await expect(page.locator('[data-scene-status]')).toHaveAttribute('data-journey', 'false');
  await expect(page.locator('[data-city-hud] h2')).toHaveText('The Oval');
  await page.goBack(); await expect(page.locator('[data-city-hud] h2')).toHaveText('Visitor Centre');
  await page.goto('/#predict'); await expect(page.locator('[data-city-hud] h2')).toHaveText('The Floodlights');
  await expect(page.locator('[data-scene-status]')).toHaveAttribute('data-journey', 'false');
});

test('reduced motion and failed WebGL keep the complete usable story', async ({ browser, baseURL }) => {
  for (const reduced of [true, false]) {
    const context = await browser.newContext({ reducedMotion: reduced ? 'reduce' : 'no-preference', viewport: { width: 375, height: 812 } });
    if (!reduced) await context.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
    const page = await context.newPage(); await page.goto(baseURL!);
    await expect(page.locator('[data-simple]')).toHaveAttribute('data-simple', 'true');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('[data-journey-chapter]')).toHaveCount(5);
    await chapter(page, 'knowledge'); await expect(page.getByRole('link', { name: 'Prove your knowledge' })).toBeVisible();
    await chapter(page, 'city');
    await expect(page.locator('[data-simple-map]')).toBeVisible();
    await page.getByRole('navigation', { name: 'Sports grounds' }).getByRole('link', { name: /Basketball/ }).click();
    await expect(page.locator('[data-city-hud] h2')).toHaveText('The Blacktop');
    await page.keyboard.press('Escape');
    await page.goto(baseURL! + '/#city/help'); await page.locator('[data-city-actions]').getByRole('button', { name: /City guide/ }).click();
    await page.getByRole('navigation', { name: 'All city destinations' }).getByRole('link', { name: /Get the app/ }).click();
    await expect(page.locator('[data-city-actions]').getByRole('link', { name: /Google Play/ })).toBeVisible();
    await context.close();
  }
});

test('touch scrolls through the journey and back from the city', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage(); await page.goto(baseURL!);
  const input = await context.newCDPSession(page);
  async function swipe(startY: number, endY: number) {
    await input.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 210, y: startY }] });
    for (let i = 1; i <= 8; i++) await input.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 210, y: startY + (endY - startY) * i / 8 }] });
    await input.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await swipe(620, 270); await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await chapter(page, 'city'); const before = await page.evaluate(() => scrollY);
  await swipe(390, 720); await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(before - 100);
  await context.close();
});

test('landscape retains usable CTAs and grounds', async ({ page }) => {
  await page.setViewportSize({ width: 812, height: 375 }); await page.goto('/'); await chapter(page, 'knowledge');
  await expect(page.getByRole('link', { name: 'Prove your knowledge' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await chapter(page, 'city');
  await page.getByRole('navigation', { name: 'Sports grounds' }).getByRole('link', { name: /Racing/ }).click();
  await expect(page.locator('[data-city-hud] h2')).toHaveText('Neon Circuit');
});

test('entrance runs once per session and scrolling interrupts it', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('[data-enhanced]')).toHaveAttribute('data-enhanced', 'true');
  await page.evaluate(() => sessionStorage.removeItem('statoz-journey-arrived-v1'));
  await page.reload({ waitUntil: 'domcontentloaded' }); await expect(page.locator('[data-entrance]')).toHaveCount(1);
  await page.mouse.wheel(0, 100); await expect(page.locator('[data-entrance]')).toHaveCount(0);
  await page.reload(); await expect(page.locator('[data-entrance]')).toHaveCount(0);
});

test('story and directory work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  const page = await context.newPage(); await page.goto(baseURL!);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sports Wizard');
  await expect(page.locator('[data-journey-chapter]')).toHaveCount(5);
  await expect(page.getByRole('link', { name: 'Prove your knowledge' })).toHaveAttribute('href', 'https://web.statoz.in/quiz/');
  const directory = page.locator('[data-static-directory]');
  await directory.locator('summary').click(); await expect(directory.locator('details')).toHaveAttribute('open', '');
  await expect(directory.getByRole('link', { name: 'Explore Sports', exact: true })).toHaveAttribute('href', 'https://web.statoz.in/');
  await context.close();
});

test('retained pages and asset provenance resolve', async ({ request }) => {
  for (const route of ['/about', '/blog', '/blog/how-statoz-prediction-quiz-works', '/download', '/faq', '/termsAndConditions', '/privacyPolicy', '/games/pitch-duel', '/sitemap.xml', '/robots.txt', '/manifest.webmanifest', '/predict', '/assets/city/manifest.json', '/assets/journey/manifest.json']) expect((await request.get(route)).status(), route).toBe(200);
  expect((await request.get('/not-a-real-page')).status()).toBe(404);
});

test('place links open cold; landmarks use full pages; steps and credits stay in the city', async ({ page }) => {
  await page.goto('/#city/city-hall');
  const hud = page.locator('[data-city-hud]'), actions = page.locator('[data-city-actions]');
  await expect(hud.locator('h2')).toHaveText('City Hall');
  await expect(page.locator('[data-scene-status]')).toHaveAttribute('data-journey', 'false');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(actions.getByRole('link', { name: /Privacy/ })).toHaveAttribute('href', '/privacyPolicy');
  await expect(actions.getByRole('link', { name: /Terms/ })).toHaveAttribute('href', '/termsAndConditions');
  await hud.getByRole('button', { name: 'City credits' }).click();
  const credits = page.getByRole('dialog');
  await expect(credits.getByRole('heading', { level: 2 })).toHaveText('City credits');
  await expect(credits.getByRole('link', { name: 'Asset sources and licenses' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(credits).toHaveCount(0);
  await expect(hud.locator('h2')).toHaveText('City Hall');
  await hud.getByRole('button', { name: 'Next place: Basketball' }).click();
  await expect(hud.locator('h2')).toHaveText('The Blacktop'); await expect(page).toHaveURL(/#city\/basketball$/);
  await hud.getByRole('button', { name: 'Previous place: City Hall' }).click();
  await expect(hud.locator('h2')).toHaveText('City Hall');
  await actions.getByRole('button', { name: 'Back to the city' }).click();
  await expect(hud).not.toHaveAttribute('data-open'); await expect(page).not.toHaveURL(/#city\//);
  await page.goto('/#city/clubhouse');
  await expect(actions.getByRole('link', { name: /About StatOz/ })).toHaveAttribute('href', '/about');
  await page.goto('/#city/help');
  await expect(actions.getByRole('link', { name: /How StatOz works/ })).toHaveAttribute('href', '/faq');
  await page.goto('/#city/news');
  await actions.getByRole('link', { name: /How the StatOz Prediction Quiz Works/ }).click();
  await expect(page).toHaveURL(/\/blog\/how-statoz-prediction-quiz-works/);
  await page.getByRole('link', { name: 'Return to City', exact: true }).click();
  await expect(hud.locator('h2')).toHaveText('StatOz News');
});
