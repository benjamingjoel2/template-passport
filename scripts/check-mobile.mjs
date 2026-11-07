// Checks that the built page never scrolls sideways on phones.
// Needs Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`.
// Usage: npm run build && npm run check:mobile
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  // Fall back to a globally installed copy (found through NODE_PATH).
  try { ({ chromium } = createRequire(import.meta.url)('playwright')); } catch { /* not installed */ }
}
if (!chromium) {
  console.log('Playwright is not installed; skipping the phone check. Run: npm i -D playwright');
  process.exit(0);
}

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  try {
    const body = await readFile(join(dist, path.endsWith('/') ? `${path}index.html` : path));
    res.writeHead(200, { 'content-type': types[extname(path)] || 'text/html' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const url = `http://localhost:${server.address().port}/`;

const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
const browser = await chromium.launch({ proxy });
const widths = [320, 360, 375, 390, 414, 430];
let failed = false;
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true });
  await page.goto(url, { waitUntil: 'load' });
  // Walk the whole page so scroll-driven motion and reveals run.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
  const check = () => page.evaluate(() => {
    const doc = document.documentElement;
    scrollTo(500, scrollY);
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, scrollX: scrollX };
  });
  // Some phone browsers ignore overflow-x:hidden on <body>, so also measure
  // with that guard switched off: nothing in the layout may stick out.
  const unguarded = await page.evaluate(() => {
    const els = [document.documentElement, document.body];
    const before = els.map((e) => e.style.overflowX);
    els.forEach((e) => (e.style.overflowX = 'visible'));
    const r = { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, scrollX: 0 };
    els.forEach((e, i) => (e.style.overflowX = before[i]));
    return r;
  });
  const closed = await check();
  await page.click('.head__menu');
  await page.waitForTimeout(800);
  const open = await check();
  const bad = [unguarded, closed, open].some((r) => r.scrollWidth > r.clientWidth || r.scrollX !== 0);
  console.log(`${bad ? '✖' : '✔'} ${width}px  page ${closed.scrollWidth}/${closed.clientWidth}  unguarded ${unguarded.scrollWidth}/${unguarded.clientWidth}  menu open ${open.scrollWidth}/${open.clientWidth}`);
  failed ||= bad;
  await page.close();
}
await browser.close();
server.close();
if (failed) {
  console.error('\nThe page scrolls sideways on at least one phone width.');
  process.exit(1);
}
