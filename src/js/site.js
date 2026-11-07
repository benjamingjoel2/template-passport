// Passport — page behaviour. No dependencies.
(() => {
  const d = document, html = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) html.classList.add('no-motion');

  // ---- header: shrink the wordmark and hide the box nav after the first screen
  const head = d.querySelector('[data-head]');
  const onScrollHead = () => html.classList.toggle('is-scrolled', scrollY > 80);
  onScrollHead();

  // ---- menu panel
  const menu = d.getElementById('menu');
  const openers = d.querySelectorAll('[data-menu-open]');
  let lastFocus = null;
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    html.classList.toggle('menu-open', open);
    openers.forEach((b) => b.setAttribute('aria-expanded', String(open)));
    if (open) {
      lastFocus = d.activeElement;
      setTimeout(() => menu.querySelector('.menu__panel button, .menu__panel a')?.focus(), 60);
    } else if (lastFocus) lastFocus.focus();
  };
  // menu preview photos load only when the menu is first opened
  let menuImgsLoaded = false;
  const loadMenuImgs = () => {
    if (menuImgsLoaded || !menu) return;
    menuImgsLoaded = true;
    menu.querySelectorAll('img[data-src]').forEach((i) => { i.src = i.dataset.src; });
  };
  openers.forEach((b) => {
    b.addEventListener('click', () => { loadMenuImgs(); setMenu(true); });
    b.addEventListener('mouseenter', loadMenuImgs, { once: true });
  });
  d.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  d.addEventListener('keydown', (e) => {
    if (!menu?.classList.contains('is-open')) return;
    if (e.key === 'Escape') setMenu(false);
    if (e.key === 'Tab') {
      const f = [...menu.querySelectorAll('.menu__panel a, .menu__panel button')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // image preview beside the menu
  const imgs = menu ? [...menu.querySelectorAll('.menu__media img')] : [];
  menu?.querySelectorAll('[data-menu-img]').forEach((a) => {
    const show = () => imgs.forEach((i) => i.classList.toggle('is-on', i.dataset.key === a.dataset.menuImg));
    a.addEventListener('mouseenter', show);
    a.addEventListener('focus', show);
  });

  // ---- reveal on scroll
  const toReveal = d.querySelectorAll('.reveal, .reveal-img, .boxed, .band, .xrow, .hl');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    toReveal.forEach((el) => io.observe(el));
  } else toReveal.forEach((el) => el.classList.add('is-in'));

  // ---- parallax: hero/band photos drift, collage tiles float at their own speed
  const para = [...d.querySelectorAll('[data-parallax]')];
  const floats = [...d.querySelectorAll('[data-speed]')];
  const wide = matchMedia('(min-width: 900px)');
  let ticking = false;
  const frame = () => {
    ticking = false;
    onScrollHead();
    if (reduce) return;
    const vh = innerHeight;
    para.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around centre
      el.style.transform = `translate3d(0, ${(-p * 6).toFixed(2)}%, 0)`;
    });
    if (wide.matches) floats.forEach((el) => {
      // offsetTop ignores transforms, so the drift stays bounded around the tile's own position
      let top = 0;
      for (let n = el; n; n = n.offsetParent) top += n.offsetTop;
      const delta = scrollY + vh / 2 - (top + el.offsetHeight / 2);
      if (Math.abs(delta) > vh * 1.5) return;
      el.style.transform = `translate3d(0, ${(-delta * parseFloat(el.dataset.speed)).toFixed(1)}px, 0)`;
    });
    else floats.forEach((el) => (el.style.transform = ''));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  frame();

  // ---- sliders
  d.querySelectorAll('.slider').forEach((s) => {
    const track = s.querySelector('.slider__track');
    const [prev, next] = s.querySelectorAll('[data-slide]');
    if (!track || !prev) return;
    const step = () => (track.querySelector('.card')?.getBoundingClientRect().width || 300) + 24;
    const sync = () => {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    s.querySelectorAll('[data-slide]').forEach((b) =>
      b.addEventListener('click', () => track.scrollBy({ left: step() * Number(b.dataset.slide), behavior: reduce ? 'auto' : 'smooth' }))
    );
    track.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  });

  // ---- "this month" panel follows today's date
  const season = d.querySelector('[data-season]');
  if (season) {
    const mo = new Date().getMonth();
    let name = '';
    season.querySelectorAll('[data-month]').forEach((p) => {
      const on = Number(p.dataset.month) === mo;
      p.hidden = !on;
      if (on) name = p.dataset.monthName;
    });
    const h = season.querySelector('[data-season-month]');
    if (h && name) h.textContent = name;
  }
})();
