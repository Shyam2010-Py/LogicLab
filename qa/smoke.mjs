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

    const visual = await page.evaluate(() => {
      const rect = el => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {left:r.left, top:r.top, right:r.right, bottom:r.bottom, width:r.width, height:r.height};
      };
      const header = document.querySelector('.page-header');
      const breadcrumb = header?.querySelector('.breadcrumb');
      const title = header?.querySelector('.page-title');
      const subtitle = header?.querySelector('.page-subtitle');
      const content = document.querySelector('.page-content');
      const headerStyle = header ? getComputedStyle(header) : null;
      const boxes = [...document.querySelectorAll('.card, .feature-card, .stat-card, .gate-display, .circuit-visual')]
        .slice(0, 40)
        .map(rect);
      return {
        viewportWidth: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        headerDisplay: headerStyle?.display ?? null,
        headerPosition: headerStyle?.position ?? null,
        header: rect(header),
        breadcrumb: rect(breadcrumb),
        title: rect(title),
        subtitle: rect(subtitle),
        content: rect(content),
        boxes
      };
    });

    if (visual.scrollWidth > visual.viewportWidth + 1 || visual.bodyScrollWidth > visual.viewportWidth + 1) {
      errors.push(`horizontal overflow: ${JSON.stringify({scrollWidth:visual.scrollWidth,bodyScrollWidth:visual.bodyScrollWidth,viewportWidth:visual.viewportWidth})}`);
    }

    if (visual.header) {
      if (visual.headerDisplay !== 'block') errors.push(`page-header display is ${visual.headerDisplay}, expected block`);
      if (visual.headerPosition !== 'relative') errors.push(`page-header position is ${visual.headerPosition}, expected relative`);
      if (visual.breadcrumb && visual.title && visual.title.top < visual.breadcrumb.bottom - 1) errors.push('page title overlaps breadcrumb');
      if (visual.title && visual.subtitle && visual.subtitle.top < visual.title.bottom - 1) errors.push('page subtitle overlaps title');
      if (visual.header.right > visual.viewportWidth + 1) errors.push(`page-header exceeds viewport: ${JSON.stringify(visual.header)}`);
    }

    for (const box of visual.boxes) {
      if (box && box.right > visual.viewportWidth + 1) {
        errors.push(`content box exceeds viewport: ${JSON.stringify(box)}`);
        break;
      }
    }

    if (viewport.isMobile) {
      const header = await page.locator('.page-header').count();
      if (header) {
        const display = await page.locator('.page-header').first().evaluate(el => getComputedStyle(el).display);
        if (display !== 'block') errors.push(`mobile page-header display is ${display}, expected block`);
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
      console.log(`  visual: header=${visual.headerDisplay}/${visual.headerPosition}, titleTop=${visual.title?.top?.toFixed(1) ?? 'n/a'}, subtitleTop=${visual.subtitle?.top?.toFixed(1) ?? 'n/a'}, scrollWidth=${visual.scrollWidth}`);
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
