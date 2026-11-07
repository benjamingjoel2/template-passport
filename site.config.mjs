// ---------------------------------------------------------------------------
// Passport — Tourground Launch Pad template
//
// Everything that makes a site belong to one brand lives in this file.
// Change the values, run `npm run build`, and deploy the `dist/` folder.
//
// Anything in [square brackets] is a placeholder to replace.
// In any text field, {brand} and {destination} are swapped for
// brand.name and destination.name at build time.
// ---------------------------------------------------------------------------

export default {
  // ---- Brand ---------------------------------------------------------------
  brand: {
    name: '[Brand name]',
    // The header wordmark: a large serif word with a small mono suffix.
    wordmark: { main: '[Brand]', suffix: 'Travel' },
    // Used for <title>, meta description, Open Graph and structured data.
    title: '{brand} — {destination} for curious travellers.',
    description: '[One sentence on what you do in {destination} and who it is for.]',
    // Full public URL, with trailing slash. Leave empty until you have a domain.
    url: '',
    // Language of the page (BCP 47).
    lang: 'en-GB',
    // Copyright year in the footer: "© [Year] [Brand name]".
    year: new Date().getFullYear(),
    // Optional extra languages for the header switch, e.g.
    // [{ code: 'en', label: 'English', href: '/', current: true }, { code: 'fr', label: 'Français', href: '/fr/' }]
    // Leave empty to hide the switch.
    languages: [],
  },

  // ---- Destination ---------------------------------------------------------
  destination: {
    name: '[Destination]',
    // The huge mixed serif headline in the hero: three lines.
    // Lines one and two are light and tinted, line three is heavier and in ink.
    heroTitle: ['[City] first,', 'then the quiet', 'country'],
    heroTagline: '{destination} for curious travellers: [the city you start in], then [the quieter places most visitors miss].',
    scrollCue: 'Scroll into {destination}',
    // The large statement under the hero.
    statement: '[We plan private trips through {destination} for people who want something less rehearsed. A few days in the gateway city, then out to the places that make the country: mountains, coast, villages and the people who still make things by hand.]',
    // "How a trip feels" block beside the big framed photo.
    feel: {
      label: 'How a trip feels',
      photo: 'p01',
      lead: '[One sentence on the pace of a trip with you.]',
      body: [
        '[Every route follows the season. Say what moves with the calendar here, and how people travel between places.]',
        '[A short, memorable line about how you plan.]',
      ],
      cta: { label: 'Sample journeys', href: '#journeys' },
    },
    // "Where we go": the regions, and the places within them.
    explore: {
      heading: 'Where we go',
      text: '[Nine places, in three regions. Say how they are joined and why the season matters.]',
    },
  },

  // ---- Colours -------------------------------------------------------------
  // The defaults are the Passport palette. Keep the contrast between
  // paper / ink and deep / paper when you change them.
  colours: {
    paper: '#F3EFE4',      // page background (the cream gallery)
    paperDeep: '#E9E3D3',  // alternate section background
    tintPale: '#D6E3D9',   // photo placeholders, soft fills
    tint: '#9FBFAE',       // secondary accent
    accent: '#2F6152',     // headline tint, highlighted words
    deep: '#1F3B33',       // menu panel, footer, hover states
    ink: '#1A1C1B',        // body text, buttons
    signal: '#A3302A',     // focus rings and small flags
    muted: '#5B574D',      // secondary text
  },

  // ---- Fonts ---------------------------------------------------------------
  // Files live in public/fonts/. Swap the files and names to change the type.
  fonts: {
    display: {
      family: 'Hahmlet',
      files: [{ src: 'Hahmlet-300-600.woff2', weight: '300 600' }],
      fallback: "Georgia, 'Times New Roman', serif",
    },
    text: {
      family: 'Instrument Sans',
      files: [{ src: 'InstrumentSans-400-600.woff2', weight: '400 600' }],
      fallback: 'system-ui, -apple-system, sans-serif',
    },
    mono: {
      family: 'IBM Plex Mono',
      files: [
        { src: 'IBMPlexMono-400.woff2', weight: '400' },
        { src: 'IBMPlexMono-500.woff2', weight: '500' },
      ],
      fallback: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
    },
  },

  // ---- Photos --------------------------------------------------------------
  // Every photo on the page is picked from this list by its key.
  // `src` is a local path (e.g. '/photos/harbour.webp', put the file in
  // public/photos/) or an Unsplash image URL (sizes are generated for you).
  // `w` and `h` are the original pixel size; `alt` describes the photo.
  // The defaults are placeholder stock photos from Unsplash: replace them all.
  photos: {
    p01: { src: 'https://images.unsplash.com/photo-1780458715937-781ae003b160', w: 2400, h: 1600, alt: '[Placeholder] A narrow lane of old wooden houses with the modern city beyond' },
    p02: { src: 'https://images.unsplash.com/photo-1685875207365-2466c524a56b', w: 2400, h: 1600, alt: '[Placeholder] Painted houses stacked up a hillside' },
    p03: { src: 'https://images.unsplash.com/photo-1684134549350-be5fd0d8feaa', w: 2400, h: 1600, alt: '[Placeholder] Stone stairways and a gate up to temple halls' },
    p04: { src: 'https://images.unsplash.com/photo-1677697086793-20af2377db6a', w: 2400, h: 1600, alt: '[Placeholder] A stone-paved street lined with trees and shops' },
    p05: { src: 'https://images.unsplash.com/photo-1700062790758-14b3c9ca052f', w: 2400, h: 3600, alt: '[Placeholder] A path to a village house with hills behind' },
    p06: { src: 'https://images.unsplash.com/photo-1609766418178-cc976c0fa435', w: 2400, h: 1350, alt: '[Placeholder] A white lighthouse on a rocky shore' },
    p07: { src: 'https://images.unsplash.com/photo-1584802513426-8c0bf80e6a8c', w: 2400, h: 1603, alt: '[Placeholder] Thatched houses below a green hill' },
    p08: { src: 'https://images.unsplash.com/photo-1478071735433-5d8f19ad0fca', w: 2400, h: 1600, alt: '[Placeholder] Granite ridges rising out of fog' },
    p09: { src: 'https://images.unsplash.com/photo-1706442969354-58c81fa38bd5', w: 2400, h: 1800, alt: '[Placeholder] A viewing telescope looking out over a valley' },
    band: { src: 'https://images.unsplash.com/photo-1761654887830-1a45f7a35ede', w: 2400, h: 1602, alt: '[Placeholder] Fishing boats in a harbour below the hills' },
    g01: { src: 'https://images.unsplash.com/photo-1638964663550-e2123ac8900b', w: 2400, h: 1591, alt: '[Placeholder] A palace hall and its stone courtyard' },
    g02: { src: 'https://images.unsplash.com/photo-1737970876808-b08a18fed899', w: 2400, h: 1600, alt: '[Placeholder] A temple gate in the forest' },
    g03: { src: 'https://images.unsplash.com/photo-1624176193860-dd7866e5a8aa', w: 2400, h: 1408, alt: '[Placeholder] Skewers and fried street food' },
    j03: { src: 'https://images.unsplash.com/photo-1785686856914-828bceeb9e64', w: 2400, h: 1579, alt: '[Placeholder] A green crater rising over the sea' },
    a02: { src: 'https://images.unsplash.com/photo-1778296745133-863c51cc11bf', w: 2400, h: 1600, alt: '[Placeholder] A wooden house around a stone courtyard' },
    a03: { src: 'https://images.unsplash.com/photo-1742734704375-af03a327e8b9', w: 2400, h: 1600, alt: '[Placeholder] A market food stall with dishes laid out' },
    a04: { src: 'https://images.unsplash.com/photo-1728694884774-f2bfea5a3a24', w: 2400, h: 1625, alt: '[Placeholder] A lit bridge over a bay at night' },
    a05: { src: 'https://images.unsplash.com/photo-1765375783706-05aeeaf59e5f', w: 2400, h: 1714, alt: '[Placeholder] A busy street at night' },
  },

  // ---- Regions and places --------------------------------------------------
  // Three regions of three places fill the hero's scattered photo collage
  // (nine frames, numbered in the order the places are listed across regions),
  // the menu, the "Where we go" rows and the footer columns.
  regions: [
    {
      name: '[Region one]',
      text: '[Two lines on this region: what you do there and why.]',
      photo: 'p01',
      cta: { label: 'Explore', href: '#journeys' },
      places: [
        { no: '01', name: '[Place one]', short: '[Place one]', photo: 'p01', href: '#explore' },
        { no: '08', name: '[Place eight]', short: '[Place eight]', photo: 'p08', href: '#explore' },
        { no: '09', name: '[Place nine]', short: '[Place nine]', photo: 'p09', href: '#explore' },
      ],
    },
    {
      name: '[Region two]',
      text: '[Two lines on this region: what you do there and why.]',
      photo: 'p03',
      cta: { label: 'Explore', href: '#journeys' },
      places: [
        { no: '03', name: '[Place three]', short: '[Place three]', photo: 'p03', href: '#explore' },
        { no: '05', name: '[Place five]', short: '[Place five]', photo: 'p05', href: '#explore' },
        { no: '02', name: '[Place two]', short: '[Place two]', photo: 'p02', href: '#explore' },
      ],
    },
    {
      name: '[Region three]',
      text: '[Two lines on this region: what you do there and why.]',
      photo: 'p07',
      cta: { label: 'Explore', href: '#journeys' },
      places: [
        { no: '04', name: '[Place four]', short: '[Place four]', photo: 'p04', href: '#explore' },
        { no: '07', name: '[Place seven]', short: '[Place seven]', photo: 'p07', href: '#explore' },
        { no: '06', name: '[Place six]', short: '[Place six]', photo: 'p06', href: '#explore' },
      ],
    },
  ],

  // ---- Feature object ------------------------------------------------------
  // The slowly turning object in the hero, drawn live on a canvas as a
  // surface of revolution. Its glaze deepens as the visitor scrolls through
  // the hero. Change the silhouette, glaze colours and inlaid motifs here.
  feature: {
    caption: '[Name the object, what it is made of]',
    ariaLabel: '[Describe the object for screen readers], turning slowly. Its colour deepens as you scroll.',
    // Silhouette: [height from lip (0) to foot (1), radius as a share of height].
    profile: [
      [0.0, 0.07], [0.025, 0.085], [0.045, 0.06], [0.08, 0.075], [0.13, 0.16], [0.2, 0.235],
      [0.28, 0.262], [0.36, 0.258], [0.46, 0.236], [0.58, 0.198], [0.7, 0.16], [0.8, 0.13],
      [0.88, 0.116], [0.94, 0.118], [0.975, 0.128], [1.0, 0.124],
    ],
    // Glaze colours, from the top of the hero to the bottom, with a name for
    // each one (shown after the caption).
    glaze: [
      { rgb: [207, 224, 210], name: '[pale glaze]' },
      { rgb: [160, 194, 176], name: '[light glaze]' },
      { rgb: [111, 156, 138], name: '[deep glaze]' },
      { rgb: [59, 100, 88], name: '[darkest glaze]' },
    ],
    // Colours of the light and dark inlay that shows through the glaze.
    inlayLight: [236, 238, 226],
    inlayDark: [40, 48, 44],
    // Crackle in the glaze, 0 (none) to 1.
    crackle: 0.16,
    // Line drawing of the object used beside the contact block (SVG paths in a 120×200 box).
    outline: [
      'M52 6h16M50 10c0 4 4 6 4 10 0 6-22 12-30 30-10 22-6 50 6 76 8 18 12 36 12 56 0 6-4 8-4 10h40c0-2-4-4-4-10 0-20 4-38 12-56 12-26 16-54 6-76-8-18-30-24-30-30 0-4 4-6 4-10z',
      'M42 74a18 18 0 1 0 36 0a18 18 0 1 0-36 0',
      'M39 74a21 21 0 1 0 42 0a21 21 0 1 0-42 0',
      'M48 80c6-3 14-4 22-1-6 3-14 4-22 1zM50 79c-4-3-8-7-12-8M59 77c-1-6 1-12 6-16 0 6 0 11-2 16M62 78c5-5 10-8 16-9-3 4-8 7-13 10',
      'M30 132c8-4 16 0 18 6M72 132c8-4 16 0 18 6M40 34c6 2 10 6 10 10M80 34c-6 2-10 6-10 10',
    ],
  },

  // ---- Motif ---------------------------------------------------------------
  // A line drawing repeated in the menu, beside "Where we go", and inlaid on
  // the feature object. SVG paths in a 190×110 box.
  motif: {
    // Main strokes: drawn in line, and inlaid light on the feature object.
    paths: [
      'M66 74c14-8 40-9 62-1-12 8-40 10-62 1z',
      'M68 73c-12-6-24-16-36-22-5-2-9-3-12-2',
      'M90 70c-6-22-1-44 18-64 2 20 2 40-4 62',
      'M95 66c4-14 4-28 10-42',
      'M104 71c16-20 40-34 72-40-12 16-34 32-58 44',
      'M112 70c14-12 28-22 46-30',
      'M128 73c6 2 10 6 9 11',
    ],
    // Accent strokes: drawn in line, and inlaid dark on the feature object.
    accents: ['M128 73l50 14M127 75l46 20', 'M15.6 50.6 3 55'],
    // Fine details: drawn in line only (too small to inlay).
    details: ['M100 67c3-12 6-22 10-30', 'M120 72c12-9 26-17 40-22', 'M173 95l6 2M178 87l6 0', 'M19 47.6c1.4-1.6 3-1.8 4.4-.8'],
    // A dot (cx, cy, r), drawn dark.
    dot: [18, 50, 2.6],
    // A second, smaller motif scattered on the feature object (clouds by default).
    filler: 'M10 44c-6-10 2-22 14-20 2-10 16-14 24-6 6-10 24-10 28 2 12-4 24 6 20 18M24 24c-6 4-4 12 2 12 5 0 6-6 2-8M48 18c-5 5-3 12 3 12 5 0 6-6 1-8M76 20c-6 4-4 12 2 12 5 0 6-6 2-8M96 44c8 0 14 4 16 10',
  },

  // ---- Navigation ----------------------------------------------------------
  nav: {
    destinationsLabel: 'Destinations', // opens the menu
    links: [
      { label: 'Journeys', href: '#journeys' },
      { label: 'Seasons', href: '#season' },
      { label: 'How we plan', href: '#plan' },
      { label: 'Journal', href: '#journal' },
    ],
    cta: { label: 'Enquire', href: '#contact' },
  },

  // ---- Full-bleed photo band -----------------------------------------------
  band: {
    photo: 'band',
    // Two words on the left, two on the right.
    title: [['[Slow]', '[boats]'], ['[to the]', '[islands]']],
    caption: '[Place shown, region]',
    coords: '[00° 00′ N, 000° 00′ E]',
  },

  // ---- "Plan it yourself" slider: guides, then journeys ---------------------
  planYourself: {
    heading: 'Plan it yourself',
    cta: { label: 'Enquire', href: '#contact' },
  },
  guides: [
    { title: '[Guide or tool one]', tags: ['Tool', '[Topic]'], meta: ['[Short detail]', '[short detail]'], text: '[One sentence on what this helps a traveller do.]', photo: 'g01', cta: 'Pick', href: '#contact' },
    { title: '[Guide two]', tags: ['Guide', '[Topic]'], meta: ['[Short detail]', '[short detail]'], text: '[One sentence on what this guide covers.]', photo: 'g02', cta: 'Read', href: '#contact' },
    { title: '[Guide three]', tags: ['Calendar', '[Topic]'], meta: ['[Short detail]', '[short detail]'], text: '[One sentence on what this calendar shows.]', photo: 'g03', cta: 'Open', href: '#season' },
  ],

  // ---- Journeys ------------------------------------------------------------
  journeys: [
    { name: '[Journey one]', nights: 12, season: '[Best months]', summary: '[The route in one or two sentences: where it starts, the highlights, where it ends.]', photo: 'p03', href: '#contact' },
    { name: '[Journey two]', nights: 10, season: '[Best months]', summary: '[The route in one or two sentences: where it starts, the highlights, where it ends.]', photo: 'band', href: '#contact' },
    { name: '[Journey three]', nights: 7, season: '[Best months]', summary: '[The route in one or two sentences: where it starts, the highlights, where it ends.]', photo: 'j03', href: '#contact' },
    { name: '[Journey four]', nights: 9, season: '[Best months]', summary: '[The route in one or two sentences: where it starts, the highlights, where it ends.]', photo: 'p08', href: '#contact' },
  ],
  journeyCta: 'See the route',

  // ---- Seasons: "this month" panel, follows today's date --------------------
  // Twelve months, January first. `native` is optional (a name in the local
  // script or language, shown small after the name).
  seasons: {
    label: 'At the table this month',
    cta: { label: 'Full calendar', href: '#contact' },
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ].map((month) => ({
      month,
      note: `[What ${month} is like in {destination}, in one sentence.]`,
      items: [
        { name: '[Dish or event]', native: '', text: '[What it is]', where: '[Where]' },
        { name: '[Dish or event]', native: '', text: '[What it is]', where: '[Where]' },
        { name: '[Dish or event]', native: '', text: '[What it is]', where: '[Where]' },
      ],
    })),
  },

  // ---- How we plan ---------------------------------------------------------
  plan: {
    heading: 'How we plan',
    text: '[No prices online and no package codes. Each trip is drawn up for you, and you change it until it fits.]',
    cta: { label: 'Start an enquiry', href: '#contact' },
    steps: [
      { title: 'A conversation', text: '[Tell us when, who and what you like. A call if you prefer.]' },
      { title: 'A first route', text: '[Within a week: places, nights, transport and stays, with the reasons.]' },
      { title: 'Refine it', text: '[Swap a place, add a night, slow it down. We quote once it fits.]' },
      { title: 'Go', text: '[Tickets, guides and drivers arranged. A phone number that answers while you are there.]' },
    ],
  },

  // ---- Journal -------------------------------------------------------------
  journal: {
    heading: 'From the journal',
    cta: { label: 'All articles', href: '#journal' },
    articles: [
      { title: '[Article title one]', tag: '[Craft]', date: '[Date]', summary: '[One sentence on the article.]', photo: 'g01', href: '#journal' },
      { title: '[Article title two]', tag: '[Stays]', date: '[Date]', summary: '[One sentence on the article.]', photo: 'a02', href: '#journal' },
      { title: '[Article title three]', tag: '[Food]', date: '[Date]', summary: '[One sentence on the article.]', photo: 'a03', href: '#journal' },
      { title: '[Article title four]', tag: '[Getting around]', date: '[Date]', summary: '[One sentence on the article.]', photo: 'a04', href: '#journal' },
      { title: '[Article title five]', tag: '[Families]', date: '[Date]', summary: '[One sentence on the article.]', photo: 'a05', href: '#journal' },
    ],
  },

  // ---- Contact and footer --------------------------------------------------
  contact: {
    heading: 'Get in touch',
    email: 'hello@example.com',
    hours: '[Mon–Fri, 09:00–18:00 local time]',
    // Link under the email address. Point it at your enquiry form, or set to null.
    cta: { label: 'plan your journey', href: '' }, // empty href = email link
    note: '[We answer every enquiry ourselves, usually within two working days. Tell us when you can travel and what you like; we send back a first route, not a brochure.]',
    footerLine: '[We answer every enquiry ourselves, usually within two working days.]',
    // Street address for the footer and structured data. Leave fields empty to hide.
    address: {
      street: '[Street address]',
      locality: '[Town or city]',
      postalCode: '[Postcode]',
      country: '[Country]',
    },
  },
  footer: {
    exploreLabel: 'Explore',
    legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Booking terms', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
};
