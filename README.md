# Passport

A Tourground Launch Pad template for a destination travel brand: a one-page site with a cream gallery hero, a huge mixed serif headline, scattered photos that drift as you scroll, and a feature object that turns slowly and deepens in colour as the visitor scrolls past it.

The build is plain Node with no dependencies. It writes a static site to `dist/`.

## Launch a new brand

1. **Copy the template.** Create a new repo from this one (or `git clone` it and push it to a new remote).
2. **Edit `site.config.mjs`.** This is the only file that changes between brands. Replace everything in `[square brackets]`:
   - `brand`: name, wordmark, page title and description, public URL, language, copyright year
   - `destination`: the three-line hero headline, the tagline, the opening statement, and the "How a trip feels" block
   - `colours` and `fonts`
   - `photos`: every image on the page, by key
   - `regions`: three regions of three places. These fill the collage, the menu, "Where we go" and the footer
   - `feature`: the turning object's silhouette, glaze colours and names, caption and outline drawing
   - `motif`: the line drawing used in the menu, beside "Where we go" and inlaid on the feature object
   - `journeys`, `guides`, `seasons`, `plan`, `journal`
   - `contact` and `footer`

   In any text, `{brand}` and `{destination}` are replaced with the brand and destination names.
3. **Add your files.**
   - Photos: put them in `public/photos/` and point to them as `/photos/name.webp`. Give each photo its pixel size (`w`, `h`) and alt text. Unsplash URLs also work, and the build makes the responsive sizes for you. About 1600px wide is enough.
   - Fonts: put `.woff2` files in `public/fonts/` and list them under `fonts`.
4. **Build and check.**
   ```bash
   npm run build
   ```
   ```bash
   npm run preview
   ```
   The preview runs at http://localhost:4321. The build stops with a message if the config is missing something or points at a file that isn't there.
5. **Check phones.** This step needs Playwright (`npm i -D playwright`):
   ```bash
   npm run check:mobile
   ```
   It loads the page at phone widths from 320px to 430px, with the menu open and closed, and fails if anything scrolls sideways.
6. **Deploy `dist/`** to any static host. On Cloudflare Pages, Netlify or Vercel, set the build command to `npm run build` and the output directory to `dist`.

The footer reads `© [Year] [Brand name]`. Both values come from `brand.year` (the current year by default) and `brand.name`.

## What not to change

The layout, motion and type scale live in `src/styles.css`, `src/js/site.js` and `src/js/feature.js`. They are shared by every brand built from Passport, so leave them alone when you launch a brand. Colour and font tokens are generated from the config, so you don't need to edit the CSS to rebrand.

## Files

| Path | What it is |
| --- | --- |
| `site.config.mjs` | All brand content and settings |
| `build.mjs` | Checks the config and builds `dist/` |
| `src/render.mjs` | Page markup |
| `src/styles.css` | Layout, type and motion |
| `src/js/site.js` | Menu, scroll reveals, parallax, sliders, the "this month" panel |
| `src/js/feature.js` | The turning feature object (canvas) |
| `public/` | Fonts and any local photos, copied as they are |
| `scripts/check-mobile.mjs` | Checks that nothing scrolls sideways at phone widths |

The default fonts are Hahmlet, Instrument Sans and IBM Plex Mono, all under the SIL Open Font License. The default photos are placeholders from Unsplash; replace them before launch.
