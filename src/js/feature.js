// The turning feature object in the hero.
// It is drawn as a surface of revolution on a 2D canvas. Shading is computed
// once per size; each frame only the texture lookup moves, so it stays cheap.
// The inlay (light and dark motifs, bands, petals) and the crackle are painted
// into an offscreen texture. Scrolling through the hero deepens the glaze.
// Shape, colours and motifs come from site.config.mjs (via #feature-data).
(() => {
  const canvas = document.querySelector('[data-vase]');
  const dataEl = document.getElementById('feature-data');
  if (!canvas || !canvas.getContext || !dataEl) return;
  const CFG = JSON.parse(dataEl.textContent);
  // Start only once the page has loaded and the browser is idle, so the object
  // never competes with text and photos for the first paint.
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 200));
  if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });

  function start() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('[data-hero]');
  const nameEl = document.querySelector('[data-glaze-name]');

  // ---- profile: radius (in units of object height) from lip (t=0) to foot (t=1)
  const P = CFG.profile;
  const r = (t) => {
    // Catmull-Rom through the control points
    let i = 0;
    while (i < P.length - 2 && P[i + 1][0] < t) i++;
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const u = (t - p1[0]) / (p2[0] - p1[0] || 1);
    const u2 = u * u, u3 = u2 * u;
    return 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3);
  };
  const RMAX = Math.max(...P.map((p) => p[1]));

  // ---- inlay texture: R = light slip, G = dark slip, B = crackle
  const TW = 1024, TH = 512;
  const tex = document.createElement('canvas');
  tex.width = TW; tex.height = TH;
  const tc = tex.getContext('2d');
  tc.fillStyle = '#000'; tc.fillRect(0, 0, TW, TH);
  const WHITE = '#f00', BLACK = '#0f0';
  const M = CFG.motif;
  const motif = new Path2D(M.paths.join(''));
  const motifDark = new Path2D((M.accents || []).join(''));
  const dot = M.dot ? new Path2D(`M${M.dot[0]} ${M.dot[1]}m-${M.dot[2] + 0.4} 0a${M.dot[2] + 0.4} ${M.dot[2] + 0.4} 0 1 0 ${2 * (M.dot[2] + 0.4)} 0a${M.dot[2] + 0.4} ${M.dot[2] + 0.4} 0 1 0-${2 * (M.dot[2] + 0.4)} 0`) : null;
  const filler = M.filler ? new Path2D(M.filler) : null;

  // Draw a motif so it looks undistorted once wrapped round the object at height v.
  const place = (u, v, size, rot, draw) => {
    const rv = r(v);
    const sx = (TW / (2 * Math.PI * rv)) * size, sy = TH * size;
    for (const off of [-TW, 0, TW]) {
      tc.save();
      tc.translate(u * TW + off, v * TH);
      tc.scale(sx / 190, sy / 190);
      tc.rotate(rot);
      tc.translate(-95, -55);
      draw();
      tc.restore();
    }
  };
  const stroke = (path, color, w) => { tc.strokeStyle = color; tc.lineWidth = w; tc.lineCap = 'round'; tc.lineJoin = 'round'; if (path) tc.stroke(path); else tc.stroke(); };
  const drawMotif = () => { stroke(motif, WHITE, 5); stroke(motifDark, BLACK, 3.5); if (dot) { tc.fillStyle = BLACK; tc.fill(dot); } };
  const drawFiller = () => { if (filler) stroke(filler, WHITE, 4.5); };
  // medallions: double rings (light inside dark), motif rising inside
  const medal = (u, v, rad) => {
    place(u, v, rad * 2, 0, () => {
      tc.beginPath(); tc.arc(95, 55, 93, 0, Math.PI * 2); tc.strokeStyle = BLACK; tc.lineWidth = 3; tc.stroke();
      tc.beginPath(); tc.arc(95, 55, 84, 0, Math.PI * 2); tc.strokeStyle = WHITE; tc.lineWidth = 4; tc.stroke();
    });
    place(u, v, rad * 1.45, -0.55, drawMotif);
  };
  const bands = (v, color, w) => { w *= TW / 2048; tc.fillStyle = color; tc.fillRect(0, v * TH - w / 2, TW, w); };
  // shoulder: collar of lappets
  bands(0.115, WHITE, 3); bands(0.122, BLACK, 2);
  for (let i = 0; i < 12; i++) {
    const u = i / 12;
    place(u + 1 / 24, 0.155, 0.075, Math.PI, () => { tc.beginPath(); tc.moveTo(20, 20); tc.bezierCurveTo(20, 110, 170, 110, 170, 20); stroke(null, WHITE, 6); });
  }
  bands(0.205, BLACK, 2); bands(0.212, WHITE, 3);
  // body: four medallions, motifs descending between them, scattered fillers
  for (let i = 0; i < 4; i++) {
    const u = i / 4;
    medal(u, 0.36 + (i % 2) * 0.1, 0.085);
    place(u + 0.125, 0.33 + (i % 2) * 0.16, 0.1, 2.5, drawMotif);
    place(u + 0.08, 0.56 - (i % 2) * 0.24, 0.07, 0, drawFiller);
    place(u + 0.18, 0.62 - (i % 2) * 0.06, 0.06, 0.2, drawFiller);
    place(u + 0.19, 0.26 + (i % 2) * 0.04, 0.05, -0.1, drawFiller);
  }
  // foot: petal band
  bands(0.79, WHITE, 3); bands(0.797, BLACK, 2);
  for (let i = 0; i < 16; i++) {
    place(i / 16, 0.87, 0.07, 0, () => {
      tc.beginPath(); tc.moveTo(30, 100); tc.quadraticCurveTo(30, 10, 95, -10); tc.quadraticCurveTo(160, 10, 160, 100);
      stroke(null, WHITE, 6);
      tc.beginPath(); tc.moveTo(60, 100); tc.quadraticCurveTo(62, 40, 95, 22); tc.quadraticCurveTo(128, 40, 130, 100);
      stroke(null, BLACK, 3);
    });
  }
  bands(0.955, BLACK, 2);
  // crackle (blue channel): crazing lines all over the glaze
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  tc.globalCompositeOperation = 'lighter';
  tc.strokeStyle = '#00f'; tc.lineWidth = 0.8;
  for (let i = 0; i < 700; i++) {
    let x = rnd() * TW, y = rnd() * TH;
    tc.beginPath(); tc.moveTo(x, y);
    const n = 2 + (rnd() * 4) | 0;
    let a = rnd() * Math.PI * 2;
    for (let k = 0; k < n; k++) { a += (rnd() - 0.5) * 1.6; x += Math.cos(a) * (7 + rnd() * 15); y += Math.sin(a) * (5 + rnd() * 11); tc.lineTo(x, y); }
    tc.stroke();
  }
  tc.globalCompositeOperation = 'source-over';
  const T = tc.getImageData(0, 0, TW, TH).data;

  // ---- glaze colour by scroll progress
  const STOPS = CFG.glaze.map((g) => g.rgb);
  const NAMES = CFG.glaze.map((g) => g.name);
  const [LR, LG, LB] = CFG.inlayLight;
  const [DR, DG, DB] = CFG.inlayDark;
  const [SR, SG, SB] = CFG.shadow;
  const CRACKLE = CFG.crackle;
  const glaze = (p) => {
    const x = Math.min(0.999, Math.max(0, p)) * (STOPS.length - 1);
    const i = Math.floor(x), f = x - i;
    const a = STOPS[i], b = STOPS[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, i + (f > 0.5 ? 1 : 0)];
  };

  // ---- geometry cache
  let W = 0, H = 0, img = null, buf = null, base = null;
  let pix = null; // Float32Array per pixel: [index, shade, spec, u0, v, alpha]
  const L = (() => { const v = [-0.5, -0.38, 0.78]; const m = Math.hypot(...v); return v.map((x) => x / m); })();
  const Hh = (() => { const v = [L[0], L[1], L[2] + 1]; const m = Math.hypot(...v); return v.map((x) => x / m); })();

  const setup = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = 1; // CSS pixels: the glaze is smooth, and 1× keeps each frame cheap
    W = Math.max(1, Math.round(rect.width * dpr));
    H = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = W; canvas.height = H;
    img = ctx.createImageData(W, H);
    buf = img.data;
    base = new Uint8ClampedArray(buf.length);
    const S = Math.min(H * 0.9, (W * 0.4) / RMAX);
    const cx = W * 0.5, y0 = (H - S) * 0.42;
    // soft shadow under the foot
    const sy = y0 + S * 1.005, sr = r(1) * S * 1.9;
    for (let y = Math.floor(sy - sr * 0.3); y < sy + sr * 0.3; y++) {
      if (y < 0 || y >= H) continue;
      for (let x = Math.floor(cx - sr); x < cx + sr; x++) {
        const dx = (x - cx) / sr, dy = (y - sy) / (sr * 0.22);
        const d = dx * dx + dy * dy;
        if (d < 1) { const i = (y * W + x) * 4; base[i] = SR; base[i + 1] = SG; base[i + 2] = SB; base[i + 3] = (1 - d) * 70; }
      }
    }
    const list = [];
    for (let y = Math.max(0, Math.floor(y0)); y < Math.min(H, y0 + S); y++) {
      const t = (y - y0) / S;
      const R = r(t) * S;
      const dR = (r(Math.min(1, t + 0.004)) - r(Math.max(0, t - 0.004))) / 0.008; // dR/dy, dimensionless
      for (let x = Math.floor(cx - R - 1); x <= Math.ceil(cx + R + 1); x++) {
        if (x < 0 || x >= W) continue;
        const dx = x + 0.5 - cx;
        const a = Math.min(1, Math.max(0, R - Math.abs(dx) + 0.5));
        if (a <= 0) continue;
        const sn = Math.max(-1, Math.min(1, dx / R));
        const cs = Math.sqrt(1 - sn * sn);
        const m = Math.hypot(1, dR);
        const nx = sn / m, ny = dR / m, nz = cs / m; // screen y points down
        const diff = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
        const spec = Math.pow(Math.max(0, nx * Hh[0] + ny * Hh[1] + nz * Hh[2]), 60) * 0.85
          + Math.pow(Math.max(0, nx * 0.2 + ny * -0.6 + nz * 0.77), 180) * 0.35;
        const rim = Math.pow(1 - cs, 3) * 0.18;
        const shade = 0.42 + diff * 0.68 - Math.pow(1 - cs, 2) * 0.18;
        list.push((y * W + x) * 4, shade, spec + rim, Math.asin(sn) / (2 * Math.PI), t, a);
      }
    }
    pix = new Float32Array(list);
  };

  const progress = () => {
    if (!hero) return 0;
    const h = hero.offsetHeight - innerHeight * 0.6;
    return Math.min(1, Math.max(0, scrollY / Math.max(1, h)));
  };

  let lastName = -1;
  const render = (time) => {
    const p = progress();
    const [gr, gg, gb, ni] = glaze(p);
    if (nameEl && ni !== lastName) { nameEl.textContent = NAMES[ni]; lastName = ni; }
    const rot = reduce ? 0.1 + p * 0.25 : time * 0.000022 + p * 0.35;
    buf.set(base);
    for (let k = 0; k < pix.length; k += 6) {
      const i = pix[k], shade = pix[k + 1], spec = pix[k + 2];
      let u = pix[k + 3] + rot; u -= Math.floor(u);
      const tx = (u * TW) | 0, ty = Math.min(TH - 1, (pix[k + 4] * TH) | 0);
      const ti = (ty * TW + tx) * 4;
      const wIn = T[ti] / 255 * 0.92, bIn = T[ti + 1] / 255 * 0.9, cr = T[ti + 2] / 255 * CRACKLE;
      // glaze over slip: inlay reads through the glaze, slightly tinted
      let R0 = gr, G0 = gg, B0 = gb;
      R0 += (LR - R0) * wIn; G0 += (LG - G0) * wIn; B0 += (LB - B0) * wIn;
      R0 += (DR - R0) * bIn; G0 += (DG - G0) * bIn; B0 += (DB - B0) * bIn;
      const s = shade * (1 - cr);
      const sp = spec * 255;
      buf[i] = R0 * s + sp; buf[i + 1] = G0 * s + sp; buf[i + 2] = B0 * s + sp;
      buf[i + 3] = 255 * pix[k + 5];
    }
    ctx.putImageData(img, 0, 0);
  };

  let visible = true, raf = 0;
  let last = 0;
  const loop = (t) => {
    raf = 0;
    if (!visible || document.hidden) return;
    if (t - last >= 32) { last = t; render(t); } // ~30 fps is plenty for a slow turn
    if (!reduce) raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  setup();
  render(performance.now());
  if (!reduce) kick();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  addEventListener('scroll', () => { if (reduce) render(0); }, { passive: true });
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { setup(); render(performance.now()); }, 150); });
  }
})();
