import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const artifacts = path.join(root, 'qa', 'artifacts');
fs.mkdirSync(artifacts, { recursive: true });

const pages = fs.readdirSync(root)
  .filter(name => name.endsWith('.html'))
  .sort();

const viewports = [
  { name: 'desktop', width: 1366, height: 768, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true }
];

const browser = await chromium.launch({ headless: true });
let failures = 0;

async function runPage(file, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    deviceScaleFactor: 1,
    serviceWorkers: 'block'
  });
  const page = await context.newPage();
  const errors = [];
  const badResponses = [];

  // Keep smoke navigation deterministic without intercepting application
  // controls. Only anchors are prevented, while buttons/inputs remain real.
  await page.addInitScript(() => {
    document.addEventListener('click', (event) => {
      const anchor = event.target?.closest?.('a');
      if (anchor) event.preventDefault();
    }, true);
  });

  page.setDefaultTimeout(2500);
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('response', response => {
    if (response.status() >= 400 && new URL(response.url()).origin === 'http://127.0.0.1:8000') {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  async function clickVisible(selector, label, max = 8) {
    const controls = page.locator(`${selector}:visible:not([disabled])`);
    const count = Math.min(await controls.count(), max);
    for (let i = 0; i < count; i++) {
      try {
        await controls.nth(i).click({ timeout: 1000 });
      } catch (error) {
        errors.push(`${label} interaction failed: ${error.message}`);
      }
    }
  }

  try {
    const response = await page.goto(`http://127.0.0.1:8000/${file}`, {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    if (!response || response.status() >= 400) {
      throw new Error(`Page load failed: ${response?.status() ?? 'no response'}`);
    }

    // components.js injects the shared shell asynchronously. Wait for the
    // actual footer instead of guessing with a fixed 350 ms delay.
    const footer = page.locator('.site-footer').first();
    try {
      await footer.waitFor({ state: 'attached', timeout: 3000 });
    } catch {
      errors.push('shared footer missing after 3s shell readiness wait');
    }

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth
    }));
    if (overflow.scrollWidth > overflow.clientWidth + 1 || overflow.bodyScrollWidth > overflow.clientWidth + 1) {
      errors.push(`horizontal overflow: ${JSON.stringify(overflow)}`);
    }

    if (viewport.isMobile) {
      const header = page.locator('.page-header').first();
      if (await header.count()) {
        const layout = await header.evaluate(el => {
          const style = getComputedStyle(el);
          return { display: style.display, flexDirection: style.flexDirection };
        });
        const validStackedLayout = layout.display === 'block' ||
          (layout.display === 'flex' && layout.flexDirection === 'column');
        if (!validStackedLayout) {
          errors.push(`mobile page-header is not stacked: ${JSON.stringify(layout)}`);
        }
      }
    }

    if (await footer.count()) {
      const footerText = await footer.innerText();
      for (const required of [
        'Ghanashyam Pabbuleti',
        'Diploma in Electronics & Communication Engineering',
        'SV Government Polytechnic College, Tirupati'
      ]) {
        if (!footerText.includes(required)) {
          errors.push(`footer missing: ${required}`);
        }
      }
    }

    await clickVisible('input[type="checkbox"]', 'checkbox', 8);
    await clickVisible('.tab', 'tab', 8);
    await clickVisible('[data-gate]', 'gate', 8);
    await clickVisible('[data-quick]', 'quick action', 8);
    await clickVisible('[data-arith-example]', 'arithmetic example', 8);
    await clickVisible('[data-comp]', 'complement control', 8);

    const notesSearch = page.locator('#notesSearch:visible:not([disabled])').first();
    if (await notesSearch.count()) {
      try {
        await notesSearch.fill('logic', { timeout: 1000 });
        await notesSearch.fill('', { timeout: 1000 });
      } catch (error) {
        errors.push(`notes search interaction failed: ${error.message}`);
      }
    }

    const overflowAfter = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth
    }));
    if (overflowAfter.scrollWidth > overflowAfter.clientWidth + 1 || overflowAfter.bodyScrollWidth > overflowAfter.clientWidth + 1) {
      errors.push(`horizontal overflow after interaction: ${JSON.stringify(overflowAfter)}`);
    }

    if (badResponses.length) errors.push(`bad resources: ${badResponses.join(' | ')}`);

    if (errors.length) {
      failures++;
      await page.screenshot({ path: path.join(artifacts, `${file}-${viewport.name}.png`), fullPage: true });
      console.error(`FAIL ${file} [${viewport.name}]`);
      for (const error of errors) console.error(`  - ${error}`);
    } else {
      console.log(`PASS ${file} [${viewport.name}]`);
    }
  } catch (error) {
    failures++;
    await page.screenshot({ path: path.join(artifacts, `${file}-${viewport.name}-exception.png`), fullPage: true }).catch(() => {});
    console.error(`FAIL ${file} [${viewport.name}] - ${error.message}`);
  } finally {
    await context.close();
  }
}

for (const file of pages) {
  for (const viewport of viewports) {
    await runPage(file, viewport);
  }
}

await browser.close();
if (failures) {
  console.error(`\n${failures} page/view combinations failed.`);
  process.exit(1);
}
console.log(`\nAll ${pages.length * viewports.length} page/view combinations passed.`);
