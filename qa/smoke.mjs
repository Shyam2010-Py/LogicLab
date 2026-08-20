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
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  const errors = [];
  const badResponses = [];

  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('response', response => {
    if (response.status() >= 400 && new URL(response.url()).origin === 'http://127.0.0.1:8000') {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  try {
    const response = await page.goto(`http://127.0.0.1:8000/${file}`, { waitUntil: 'networkidle', timeout: 15000 });
    if (!response || response.status() >= 400) throw new Error(`Page load failed: ${response?.status() ?? 'no response'}`);

    await page.waitForTimeout(100);

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
        // The responsive CSS intentionally keeps the header as flex so its
        // children can be stacked with flex-direction: column. The previous
        // assertion incorrectly required display:block and caused false QA failures.
        const validStackedLayout = layout.display === 'block' ||
          (layout.display === 'flex' && layout.flexDirection === 'column');
        if (!validStackedLayout) {
          errors.push(`mobile page-header is not stacked: ${JSON.stringify(layout)}`);
        }
      }
    }

    // Exercise every checkbox without assuming page-specific IDs.
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    for (let i = 0; i < Math.min(checkboxCount, 16); i++) {
      await checkboxes.nth(i).click();
    }

    // Exercise tabs.
    const tabs = page.locator('.tab');
    for (let i = 0; i < await tabs.count(); i++) {
      await tabs.nth(i).click();
    }

    // Exercise common interactive examples.
    for (const selector of ['[data-gate]', '[data-quick]', '[data-arith-example]', '[data-comp]']) {
      const controls = page.locator(selector);
      for (let i = 0; i < Math.min(await controls.count(), 8); i++) {
        await controls.nth(i).click();
      }
    }

    // Exercise notes search when present.
    const notesSearch = page.locator('#notesSearch');
    if (await notesSearch.count()) {
      await notesSearch.fill('logic');
      await notesSearch.fill('');
    }

    // Re-check layout after interactions.
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
