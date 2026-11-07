// Builds the static site into dist/. No dependencies: `node build.mjs`.
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './site.config.mjs';
import { render } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

// ---- check the config -----------------------------------------------------
const need = ['brand.name', 'brand.wordmark.main', 'destination.name', 'destination.heroTitle', 'colours.paper', 'colours.ink', 'fonts.display', 'fonts.text', 'fonts.mono', 'photos', 'regions', 'feature.profile', 'feature.glaze', 'journeys', 'contact.email', 'seasons.months'];
for (const path of need) {
  if (path.split('.').reduce((o, k) => o?.[k], config) == null) fail(`site.config.mjs is missing "${path}".`);
}
if (config.destination.heroTitle.length !== 3) fail('destination.heroTitle needs exactly three lines.');
if (config.seasons.months.length !== 12) fail('seasons.months needs twelve months, January first.');
if (config.feature.glaze.length < 2) fail('feature.glaze needs at least two colours.');
const placeCount = config.regions.reduce((n, r) => n + r.places.length, 0);
if (placeCount < 9) console.warn(`! The hero collage has nine frames; only ${placeCount} places are listed.`);
for (const [k, c] of Object.entries(config.colours)) {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) fail(`colours.${k} must be a hex colour like #1A1C1B.`);
}

// ---- styles: tokens from the config, then the template stylesheet ---------
const c = config.colours;
const f = config.fonts;
const fam = (x) => `'${x.family}',${x.fallback}`;
const faces = [f.display, f.text, f.mono]
  .flatMap((x) => x.files.map((file) => `@font-face{font-family:'${x.family}';src:url(/fonts/${file.src}) format('woff2');font-weight:${file.weight};font-display:swap}`))
  .join('\n');
const tokens = `:root{--paper:${c.paper};--paper-deep:${c.paperDeep};--tint-pale:${c.tintPale};--tint:${c.tint};--accent:${c.accent};--deep:${c.deep};--ink:${c.ink};--signal:${c.signal};--muted:${c.muted};--f-display:${fam(f.display)};--f-text:${fam(f.text)};--f-mono:${fam(f.mono)}}`;
const css = `${tokens}\n${faces}\n${await readFile(join(root, 'src/styles.css'), 'utf8')}`;

const siteJs = await readFile(join(root, 'src/js/site.js'), 'utf8');
const featureJs = await readFile(join(root, 'src/js/feature.js'), 'utf8');
const version = createHash('sha1').update(css + siteJs + featureJs).digest('hex').slice(0, 8);

let html;
try {
  html = render(config, { assetVersion: version });
} catch (e) {
  fail(e.message);
}

// ---- favicon: the brand's initial on the deep colour ----------------------
const initial = [...config.brand.name.replace(/[^\p{L}\p{N}]/gu, '')][0]?.toUpperCase() || '·';
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="${c.deep}"/><text x="32" y="45" text-anchor="middle" font-family="Georgia,serif" font-size="38" fill="${c.tint}">${initial.replace(/[<&>]/g, '')}</text></svg>`;

// ---- write ----------------------------------------------------------------
await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'js'), { recursive: true });
await cp(join(root, 'public'), out, { recursive: true });
await writeFile(join(out, 'index.html'), html);
await writeFile(join(out, 'styles.css'), css);
await writeFile(join(out, 'js/site.js'), siteJs);
await writeFile(join(out, 'js/feature.js'), featureJs);
await writeFile(join(out, 'favicon.svg'), favicon);

// Every local file the page points at must exist.
const refs = [...html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)].map((m) => m[1]).filter((p) => p !== '/');
for (const ref of new Set(refs)) {
  try {
    await readFile(join(out, ref));
  } catch {
    fail(`index.html points at ${ref}, which is not in dist/. Put the file in public/.`);
  }
}
console.log(`✔ Built ${config.brand.name} → dist/ (assets v${version})`);
