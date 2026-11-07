// Renders the Passport home page from site.config.mjs.
// Markup only; styles live in src/styles.css, behaviour in src/js/.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

export function render(cfg, { assetVersion = '' } = {}) {
  const tokens = { brand: cfg.brand.name, destination: cfg.destination.name };
  // Fill {brand} / {destination}, then escape.
  const fill = (s) => String(s ?? '').replace(/\{(brand|destination)\}/g, (_, k) => tokens[k]);
  const t = (s) => esc(fill(s));
  const v = assetVersion ? `?v=${assetVersion}` : '';

  // ---- photos -------------------------------------------------------------
  const photo = (key) => {
    const p = cfg.photos[key];
    if (!p) throw new Error(`site.config.mjs: no photo with key "${key}"`);
    return p;
  };
  const isUnsplash = (src) => /^https:\/\/images\.unsplash\.com\//.test(src);
  const sized = (src, w) => (isUnsplash(src) ? `${src}${src.includes('?') ? '&' : '?'}w=${w}&q=72&auto=format` : src);
  const srcset = (src) => (isUnsplash(src) ? [480, 960, 1200, 1600].map((w) => `${sized(src, w)} ${w}w`).join(', ') : '');

  const img = (key, sizes, { eager = false } = {}) => {
    const p = photo(key);
    const set = srcset(p.src);
    return `<img src="${esc(sized(p.src, 960))}"${set ? ` srcset="${esc(set)}" sizes="${sizes}"` : ''} width="${p.w}" height="${p.h}" alt="${t(p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  };
  const fig = (key, ratio, sizes, opts = {}) =>
    `<figure class="fig${opts.fill ? ' fig--fill' : ''}" style="--ratio:${ratio}"><div class="fig__frame">${img(key, sizes, opts)}</div></figure>`;

  // ---- small pieces -------------------------------------------------------
  const ARROW = '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  const ARROW_L = '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M14 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  const btn = (label, href, aria) =>
    `<a class="btn" href="${esc(href)}"${aria ? ` aria-label="${t(aria)}"` : ''}><span class="btn__label">${t(label)}</span><span class="btn__arrow">${ARROW}</span></a>`;
  // Headline split into word boxes; `accent` tints the last word.
  const words = (s, accent) => {
    const w = fill(s).split(/\s+/).filter(Boolean);
    return w.map((x, i) => `<span class="wb${accent && i === w.length - 1 ? ' wb--accent' : ''}" style="--i:${i}">${esc(x)}</span>`).join(' ');
  };
  const motifSvg = (cls) => {
    const m = cfg.motif;
    const paths = [...m.paths, ...(m.accents || []), ...(m.details || [])].map((d) => `<path d="${esc(d)}"/>`).join('');
    const dot = m.dot ? `<circle cx="${m.dot[0]}" cy="${m.dot[1]}" r="${m.dot[2]}"/>` : '';
    return `<svg class="motif ${cls}" viewBox="0 0 190 110" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}${dot}</svg>`;
  };
  const langSwitch = (mod) => {
    const langs = cfg.brand.languages || [];
    if (!langs.length) return '';
    const items = langs
      .map((l) => `<a class="lang-switch__link" href="${esc(l.href)}" hreflang="${esc(l.code)}" lang="${esc(l.code)}"${l.current ? ' aria-current="true"' : ''}><span aria-hidden="true">${esc(l.code.toUpperCase())}</span><span class="lang-switch__sr">${esc(l.label)}</span></a>`)
      .join('<span class="lang-switch__sep" aria-hidden="true">·</span>');
    return `<nav class="lang-switch lang-switch--${mod}" aria-label="Language">${items}</nav>`;
  };

  // ---- derived data -------------------------------------------------------
  const regions = cfg.regions;
  const places = regions.flatMap((r) => r.places);
  // The collage shows places in number order.
  const collagePlaces = [...places].sort((a, b) => String(a.no).localeCompare(String(b.no), undefined, { numeric: true })).slice(0, 9);
  // Collage frame shapes and drift speeds are part of the layout.
  const COLLAGE = [
    [0.75, 0.05], [4 / 3, 0.08], [0.8, 0.03], [1, 0.07], [0.75, 0.04],
    [4 / 3, 0.08], [1.25, 0.03], [0.75, 0.06], [1, 0.04],
  ];
  const brand = cfg.brand;
  const contact = cfg.contact;
  const addr = contact.address || {};
  const addrLine = [addr.street, addr.locality && [addr.locality, addr.postalCode].filter(Boolean).join(' '), addr.country].filter(Boolean).map(fill).join(', ');
  const title = fill(brand.title);
  const description = fill(brand.description);
  const url = brand.url || '';
  const ogImage = sized(photo(cfg.band.photo).src, 1600);
  const firstPhoto = photo(collagePlaces[0].photo);
  const heroTitle = cfg.destination.heroTitle.map(fill);
  const menuLinks = [
    { label: 'Home', href: '#main' },
    ...cfg.nav.links,
    cfg.nav.cta,
  ];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: brand.name,
    description,
    ...(url && { url }),
    ...(contact.email && { email: contact.email }),
    ...(addr.street && {
      address: { '@type': 'PostalAddress', streetAddress: fill(addr.street), addressLocality: fill(addr.locality), postalCode: fill(addr.postalCode), addressCountry: fill(addr.country) },
    }),
  };

  // ---- sections -----------------------------------------------------------
  const head = `
<a class="skip" href="#main">Skip to content</a>
<header class="head" data-head>
<a class="wordmark" href="#main" aria-label="${esc(brand.name)}, home"><span class="wordmark__name">${t(brand.wordmark.main)}</span>${brand.wordmark.suffix ? `<span class="wordmark__sfx">${t(brand.wordmark.suffix)}</span>` : ''}</a>
<nav class="topnav" aria-label="Primary">
<button class="topnav__a" type="button" data-menu-open aria-controls="menu" aria-expanded="false">${t(cfg.nav.destinationsLabel)}</button>
${cfg.nav.links.map((l) => `<a class="topnav__a" href="${esc(l.href)}">${t(l.label)}</a>`).join('\n')}
</nav>
<div class="head__actions">
${langSwitch('header')}
<button class="head__menu" type="button" data-menu-open aria-controls="menu" aria-expanded="false"><span class="box__txt">Menu</span><span class="burger" aria-hidden="true"></span></button>
<a class="head__cta" href="${esc(cfg.nav.cta.href)}">${t(cfg.nav.cta.label)}</a>
</div>
</header>`;

  const menu = `
<div class="menu" id="menu" aria-hidden="true" inert>
<div class="menu__scrim" data-menu-close></div>
<div class="menu__media" aria-hidden="true">
${places.map((p) => `<img data-key="${esc(p.no)}" data-src="${esc(sized(photo(p.photo).src, 960))}" alt="" decoding="async">`).join('\n')}
${motifSvg('menu__art')}
</div>
<div class="menu__panel" role="dialog" aria-modal="true" aria-label="Site menu">
<div class="menu__top">
<button class="box box--paper" type="button" data-menu-close>Close <span class="x" aria-hidden="true"></span></button>
<a class="box box--line" href="${esc(cfg.nav.cta.href)}" data-menu-close>${t(cfg.nav.cta.label)} ${ARROW}</a>
</div>
<div class="menu__groups">
${regions
  .map(
    (r) => `<div class="menu__group"><p class="label">${t(r.name)}</p><ul>
${r.places.map((p) => `<li><a class="menu__big" href="${esc(p.href)}" data-menu-img="${esc(p.no)}" data-menu-close>${t(p.name)}<sup>${esc(p.no)}</sup></a></li>`).join('\n')}
</ul></div>`
  )
  .join('\n')}
</div>
<ul class="menu__links">
${menuLinks.map((l) => `<li><a href="${esc(l.href)}" data-menu-close>${t(l.label)}</a></li>`).join('\n')}
</ul>
<div class="menu__contact"><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></div>
${langSwitch('menu')}
</div>
</div>`;

  const hero = `
<section class="home-hero" data-hero>
<div class="home-hero__intro"><p class="home-hero__tagline">${t(cfg.destination.heroTagline)}</p></div>
<h1 class="home-hero__title" aria-label="${esc(heroTitle.join(' '))}">
${heroTitle.map((line, i) => `<span class="t t${i + 1}" aria-hidden="true">${esc(line)}</span>`).join('\n')}
</h1>
<div class="vase-col"><div class="vase-stick">
<canvas class="vase" data-vase role="img" aria-label="${t(cfg.feature.ariaLabel)}"></canvas>
<p class="label vase__cap">${t(cfg.feature.caption)} · <span data-glaze-name>${t(cfg.feature.glaze[0].name)}</span></p>
</div></div>
<ul class="collage" aria-label="Destinations">
${collagePlaces
  .map(
    (p, i) => `<li class="collage__item ci-${i + 1}" data-speed="${COLLAGE[i][1]}"><a href="${esc(p.href)}">${fig(p.photo, COLLAGE[i][0], '(min-width: 900px) 22vw, 50vw', { eager: i < 2 })}<span class="collage__label">${t(p.short || p.name)}<sup>${esc(p.no)}</sup></span></a></li>`
  )
  .join('\n')}
</ul>
<p class="home-hero__scroll label"><svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v11M4 9l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg> ${t(cfg.destination.scrollCue)}</p>
</section>`;

  const feel = cfg.destination.feel;
  const intro = `
<section class="intro-statement"><p class="statement reveal"><span class="indent"></span>${t(cfg.destination.statement)}</p></section>
<section class="split23">
<div class="split23__media reveal-img">${fig(feel.photo, '4 / 5', '(min-width: 900px) 66vw, 100vw')}</div>
<div class="split23__text">
<p class="label">${t(feel.label)}</p>
<p class="split23__lead reveal">${t(feel.lead)}</p>
${feel.body.map((b) => `<p class="reveal">${t(b)}</p>`).join('\n')}
${btn(feel.cta.label, feel.cta.href)}
</div>
</section>`;

  const explore = `
<section class="explore" id="explore" aria-labelledby="explore-h">
<div class="explore__left">
<h2 class="boxed reveal" id="explore-h">${words(cfg.destination.explore.heading, true)}</h2>
<div class="explore__motif">${motifSvg('explore__art')}</div>
<p class="explore__text reveal">${t(cfg.destination.explore.text)}</p>
</div>
<div class="explore__right">
${regions
  .map(
    (r) => `<article class="xrow reveal">
<div class="xrow__head">
<h3 class="boxed boxed--sm">${words(r.name)}</h3>
<ul class="xrow__list">${r.places.map((p) => `<li><a href="${esc(p.href)}">${t(p.name)}<sup>${esc(p.no)}</sup></a></li>`).join('')}</ul>
${btn(r.cta.label, r.cta.href)}
</div>
<div class="xrow__media">${fig(r.photo, '16 / 10', '(min-width: 900px) 25vw, 100vw')}<p class="label xrow__text">${t(r.text)}</p></div>
</article>`
  )
  .join('\n')}
</div>
</section>`;

  const b = cfg.band;
  const band = `
<section class="band" aria-label="${t(b.caption)}">
<div class="band__media" data-parallax>${fig(b.photo, 'auto', '100vw', { fill: true })}</div>
<h2 class="band__title">
<span class="band__l">${b.title[0].map((w) => `<span class="line"><span>${t(w)}</span></span>`).join('')}</span>
<span class="band__r">${b.title[1].map((w) => `<span class="line"><span>${t(w)}</span></span>`).join('')}</span>
</h2>
<p class="band__corner band__corner--l label">${t(b.caption)}</p>
<p class="band__corner band__corner--r label">${t(b.coords)}</p>
</section>`;

  const card = ({ photo: ph, tags, title: ttl, href, meta, text, cta, aria }) => `<article class="card">
<div class="card__media">${fig(ph, '4 / 3', '(min-width: 900px) 33vw, 85vw')}<span class="card__tags">${tags.map((x) => `<span>${t(x)}</span>`).join('')}</span></div>
<div class="card__body">
<h3 class="card__title"><a href="${esc(href)}">${t(ttl)}</a></h3>
<div class="card__meta"><p class="label">${meta.map(t).join('<br>')}</p><p class="label card__text">${t(text)}</p></div>
${btn(cta, href, `${fill(cta)}: ${fill(ttl)}`)}
</div>
</article>`;

  const slider = (id, heading, ctaObj, cards, alt) => `
<section class="slider${alt ? ' slider--alt' : ''}" id="${id}" aria-labelledby="${id}-h">
<div class="slider__head">
<h2 class="boxed reveal" id="${id}-h">${words(heading, true)}</h2>
${btn(ctaObj.label, ctaObj.href)}
<div class="slider__arrows">
<button class="round" type="button" data-slide="-1" aria-controls="${id}-track" aria-label="Previous">${ARROW_L}</button>
<button class="round" type="button" data-slide="1" aria-controls="${id}-track" aria-label="Next">${ARROW}</button>
</div>
</div>
<div class="slider__track" id="${id}-track" tabindex="0" role="region" aria-label="${t(heading)}">
${cards.map(card).join('\n')}
</div>
</section>`;

  const planCards = [
    ...cfg.guides.map((g) => ({ photo: g.photo, tags: g.tags, title: g.title, href: g.href, meta: g.meta, text: g.text, cta: g.cta })),
    ...cfg.journeys.map((j) => ({ photo: j.photo, tags: [`${j.nights} nights`], title: j.name, href: j.href, meta: [j.season], text: j.summary, cta: cfg.journeyCta })),
  ];
  const journalCards = cfg.journal.articles.map((a) => ({ photo: a.photo, tags: [a.tag], title: a.title, href: a.href, meta: [a.date], text: a.summary, cta: 'Read' }));

  const s = cfg.seasons;
  const season = `
<section class="season" id="season" aria-labelledby="season-h" data-season>
<div class="season__head">
<p class="label">${t(s.label)}</p>
<h2 class="season__month" id="season-h" data-season-month>${t(s.months[0].month)}</h2>
${btn(s.cta.label, s.cta.href)}
</div>
<div class="season__body">
${s.months
  .map(
    (m, i) => `<div class="season__panel" data-month="${i}" data-month-name="${t(m.month)}"${i ? ' hidden' : ''}>
<p class="season__note">${t(m.note)}</p>
<ul class="dl">
${m.items.map((it) => `<li><span class="dl__k">${t(it.name)}${it.native ? ` <span class="ko">${t(it.native)}</span>` : ''}</span><span class="dl__v">${t(it.text)}</span><span class="dl__w label">${t(it.where)}</span></li>`).join('\n')}
</ul>
</div>`
  )
  .join('\n')}
</div>
</section>`;

  const p = cfg.plan;
  const plan = `
<section class="plan" id="plan" aria-labelledby="plan-h">
<div class="plan__left">
<h2 class="boxed reveal" id="plan-h">${words(p.heading, true)}</h2>
<p class="plan__text reveal">${t(p.text)}</p>
${btn(p.cta.label, p.cta.href)}
</div>
<ol class="timeline">
${p.steps.map((st, i) => `<li class="reveal"><span class="label">${String(i + 1).padStart(2, '0')}</span><h3>${t(st.title)}</h3><p>${t(st.text)}</p></li>`).join('\n')}
</ol>
</section>`;

  const outline = `<svg class="motif contact__vase" viewBox="0 0 120 200" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${cfg.feature.outline.map((d) => `<path d="${esc(d)}"/>`).join('')}</svg>`;
  const contactSec = `
<section class="contact" id="contact" aria-labelledby="contact-h">
<div class="contact__main">
<h2 class="contact__label" id="contact-h">${t(contact.heading)}</h2>
<div class="contact__lines">
<a class="contact__big" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>
${contact.cta ? `<a class="contact__cta" href="${esc(contact.cta.href || `mailto:${contact.email}`)}">${t(contact.cta.label)} ${ARROW}</a>` : ''}
</div>
<p class="contact__small label">${t(contact.hours)}</p>
</div>
<aside class="contact__aside">
<p class="contact__note">${t(contact.note)}</p>
${outline}
</aside>
</section>`;

  const year = brand.year ?? new Date().getFullYear();
  const foot = `
<footer class="foot">
<div class="foot__grid">
<div class="foot__brand">
<a class="foot__mark" href="#main">${t(brand.wordmark.main)}${brand.wordmark.suffix ? ` <span>${t(brand.wordmark.suffix)}</span>` : ''}</a>
<p class="foot__line">${t(contact.footerLine)}</p>
<p><a class="foot__email" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></p>
${addrLine ? `<p class="foot__addr">${esc(addrLine)}</p>` : ''}
</div>
${regions
  .map(
    (r) => `<nav class="foot__col" aria-label="${t(r.name)}"><p class="label">${t(r.name)}</p><ul>${r.places.map((pl) => `<li><a href="${esc(pl.href)}">${t(pl.name)}</a></li>`).join('')}</ul></nav>`
  )
  .join('\n')}
<nav class="foot__col" aria-label="${t(cfg.footer.exploreLabel)}"><p class="label">${t(cfg.footer.exploreLabel)}</p><ul>${menuLinks
    .slice(1)
    .map((l) => `<li><a href="${esc(l.href)}">${t(l.label)}</a></li>`)
    .join('')}</ul></nav>
</div>
<div class="foot__base label">
<p>© ${esc(year)} ${esc(brand.name)}</p>
<ul class="foot__legal">${cfg.footer.legal.map((l) => `<li><a href="${esc(l.href)}">${t(l.label)}</a></li>`).join('')}</ul>
</div>
</footer>`;

  // Data for the feature object script.
  const featureData = {
    profile: cfg.feature.profile,
    glaze: cfg.feature.glaze.map((g) => ({ rgb: g.rgb, name: fill(g.name) })),
    inlayLight: cfg.feature.inlayLight,
    inlayDark: cfg.feature.inlayDark,
    crackle: cfg.feature.crackle,
    shadow: hexToRgb(cfg.colours.deep),
    motif: cfg.motif,
  };

  const preloadSet = srcset(firstPhoto.src);
  const fontPreloads = [cfg.fonts.display.files[0], cfg.fonts.text.files[0]]
    .map((f) => `<link rel="preload" href="/fonts/${esc(f.src)}" as="font" type="font/woff2" crossorigin>`)
    .join('\n');

  return `<!doctype html>
<html lang="${esc(brand.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(brand.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${url ? `<meta property="og:url" content="${esc(url)}">\n<link rel="canonical" href="${esc(url)}">` : ''}
<meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${esc(cfg.colours.paper)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${preloadSet ? `<link rel="preload" as="image" imagesrcset="${esc(preloadSet)}" imagesizes="(min-width: 900px) 22vw, 50vw" fetchpriority="high">` : `<link rel="preload" as="image" href="${esc(firstPhoto.src)}" fetchpriority="high">`}
${fontPreloads}
<link rel="stylesheet" href="/styles.css${v}">
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="page-home">
${head}
${menu}
<main id="main" tabindex="-1">
${hero}
${intro}
${explore}
${band}
${slider('journeys', cfg.planYourself.heading, cfg.planYourself.cta, planCards)}
${season}
${plan}
${slider('journal', cfg.journal.heading, cfg.journal.cta, journalCards, true)}
${contactSec}
</main>
${foot}
<script type="application/json" id="feature-data">${JSON.stringify(featureData).replace(/</g, '\\u003c')}</script>
<script src="/js/site.js${v}" defer></script>
<script src="/js/feature.js${v}" defer></script>
</body>
</html>
`;
}

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
