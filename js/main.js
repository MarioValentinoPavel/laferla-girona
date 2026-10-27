// La Ferla · «Claroscuro»: una cerilla enciende la vela, y la vela ilumina cada plato (reiluminado en canvas)
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const WA = 'https://wa.me/34648088263?text=';

  // ---------- llama: dibuja una vela con su halo en un contexto ----------
  function drawFlame(g, x, y, s, t, lean) {
    const fl = 1 + Math.sin(t * .012) * .05 + Math.sin(t * .031 + 1) * .04 + Math.sin(t * .07) * .02;
    // halo
    let gr = g.createRadialGradient(x, y, 0, x, y, s * 14 * fl);
    gr.addColorStop(0, 'rgba(255,190,110,.42)'); gr.addColorStop(.25, 'rgba(255,150,70,.16)'); gr.addColorStop(1, 'rgba(255,120,40,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, s * 14 * fl, 0, 7); g.fill();
    // llama (gota)
    const h = s * 2.6 * fl, w = s * .9, tip = lean * s * .8;
    g.save(); g.translate(x, y);
    gr = g.createRadialGradient(0, -h * .25, 0, 0, -h * .2, h);
    gr.addColorStop(0, '#fffbe8'); gr.addColorStop(.35, '#ffd27a'); gr.addColorStop(.8, 'rgba(255,120,30,.6)'); gr.addColorStop(1, 'rgba(255,90,20,0)');
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, s * .5);
    g.bezierCurveTo(w, s * .3, w * .8, -h * .5, tip, -h);
    g.bezierCurveTo(-w * .8, -h * .5, -w, s * .3, 0, s * .5); g.fill();
    g.fillStyle = 'rgba(80,120,255,.35)'; g.beginPath(); g.ellipse(0, s * .25, w * .45, s * .35, 0, 0, 7); g.fill();
    g.restore();
    return fl;
  }

  // ---------- arranque: cerilla ----------
  function intro() {
    const box = document.getElementById('intro');
    if (reduce || !box) { box && box.remove(); return Promise.resolve(); }
    document.body.classList.add('lock');
    const cv = document.getElementById('introFx'), g = cv.getContext('2d');
    const d = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; g.scale(d, d);
    const cx = innerWidth / 2, cy = innerHeight / 2, sparks = [];
    for (let i = 0; i < 40; i++) { const a = Math.random() * 7, v = 1 + Math.random() * 5; sparks.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, l: 1 }); }
    return new Promise((res) => {
      const t0 = performance.now();
      const step = (now) => {
        const t = now - t0;
        g.fillStyle = '#0d0a07'; g.fillRect(0, 0, innerWidth, innerHeight);
        sparks.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += .12; p.l -= .025; if (p.l > 0) { g.fillStyle = `rgba(255,${180 + Math.random() * 60 | 0},90,${p.l})`; g.fillRect(p.x, p.y, 2, 2); } });
        const k = Math.min(1, Math.max(0, (t - 180) / 700));
        if (k > 0) {
          const r = Math.max(innerWidth, innerHeight) * (k * k) * 1.2;
          const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r + 1);
          gr.addColorStop(0, 'rgba(255,170,90,.35)'); gr.addColorStop(1, 'rgba(255,170,90,0)');
          g.fillStyle = gr; g.fillRect(0, 0, innerWidth, innerHeight);
          drawFlame(g, cx, cy, 8 + 10 * k, now, Math.sin(now * .01) * .3);
        }
        if (t < 1500) requestAnimationFrame(step);
        else { box.classList.add('done'); document.body.classList.remove('lock'); setTimeout(() => box.remove(), 1200); res(); }
      };
      requestAnimationFrame(step);
    });
  }

  // ---------- portada: la vela ilumina el título ----------
  function heroFlame() {
    const hero = document.getElementById('hero'), cv = document.getElementById('flame'), g = cv.getContext('2d');
    let W, H, d, lean = 0, tl = 0, vis = true;
    const size = () => { const r = cv.getBoundingClientRect(); d = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); };
    size(); new ResizeObserver(size).observe(cv);
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(cv);
    hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); tl = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .78) * -3)); });
    hero.addEventListener('pointerleave', () => (tl = 0));
    const draw = (t) => {
      const mob = W < 700, x = W * (mob ? .82 : .8), y = H * (mob ? .2 : .42), s = mob ? 9 : 13;
      lean += (tl - lean) * .05;
      g.clearRect(0, 0, W, H);
      // cuerpo de la vela
      const cw = s * 2.2, ch = H * .5;
      const wg = g.createLinearGradient(x - cw / 2, 0, x + cw / 2, 0);
      wg.addColorStop(0, '#5a4630'); wg.addColorStop(.35, '#f1e3c6'); wg.addColorStop(.6, '#d8c6a3'); wg.addColorStop(1, '#3d2f20');
      g.fillStyle = wg; g.fillRect(x - cw / 2, y + s * .6, cw, ch);
      g.fillStyle = '#2a1e14'; g.fillRect(x - .8, y - s * .1, 1.6, s * .8);
      // luz general sobre la escena
      const big = g.createRadialGradient(x, y, 0, x, y, Math.max(W, H) * .9);
      big.addColorStop(0, 'rgba(255,170,90,.20)'); big.addColorStop(.4, 'rgba(255,140,60,.06)'); big.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = big; g.fillRect(0, 0, W, H);
      drawFlame(g, x, y, s, t + lean * 40, lean + Math.sin(t * .004) * .15);
    };
    if (reduce) { draw(0); return; }
    const loop = (t) => { if (vis) draw(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  // ---------- platos: reiluminado con la vela ----------
  const lits = [];
  function prepare(fig) {
    const cv = fig.querySelector('canvas'), g = cv.getContext('2d', { willReadFrequently: true });
    const img = new Image();
    img.onload = () => {
      const W = 270, H = 360; cv.width = W; cv.height = H;
      const s = Math.max(W / img.width, H / img.height), iw = img.width * s, ih = img.height * s;
      g.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
      const src = g.getImageData(0, 0, W, H).data, n = W * H;
      const al = new Float32Array(n * 3), lum = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const r = src[i * 4] / 255, gg = src[i * 4 + 1] / 255, b = src[i * 4 + 2] / 255;
        al[i * 3] = r * r; al[i * 3 + 1] = gg * gg; al[i * 3 + 2] = b * b;
        lum[i] = .3 * r + .59 * gg + .11 * b;
      }
      // altura suavizada (dos pasadas de caja)
      const tmp = new Float32Array(n);
      for (let pass = 0; pass < 2; pass++) {
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let a = 0, c = 0; for (let k = -2; k <= 2; k++) { const xx = x + k; if (xx >= 0 && xx < W) { a += lum[y * W + xx]; c++; } } tmp[y * W + x] = a / c; }
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let a = 0, c = 0; for (let k = -2; k <= 2; k++) { const yy = y + k; if (yy >= 0 && yy < H) { a += tmp[yy * W + x]; c++; } } lum[y * W + x] = a / c; }
      }
      const N = new Float32Array(n * 3), str = 1.8;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const nx = (lum[y * W + Math.max(0, x - 1)] - lum[y * W + Math.min(W - 1, x + 1)]) * str;
        const ny = (lum[Math.max(0, y - 1) * W + x] - lum[Math.min(H - 1, y + 1) * W + x]) * str;
        const l = 1 / Math.hypot(nx, ny, 1);
        N[i * 3] = nx * l; N[i * 3 + 1] = ny * l; N[i * 3 + 2] = l;
      }
      const out = g.createImageData(W, H);
      const L = { fig, cv, g, W, H, al, N, out, lx: W * .42, ly: H * .3, tx: W * .42, ty: H * .3, over: false, vis: false };
      new IntersectionObserver(([e]) => (L.vis = e.isIntersecting)).observe(fig);
      const toLocal = (e) => { const r = cv.getBoundingClientRect(); L.tx = (e.clientX - r.left) / r.width * W; L.ty = (e.clientY - r.top) / r.height * H; };
      fig.addEventListener('pointermove', (e) => { L.over = true; toLocal(e); });
      fig.addEventListener('pointerdown', (e) => { L.over = true; toLocal(e); });
      fig.addEventListener('pointerleave', () => { if (e2pointerFine()) L.over = false; });
      lits.push(L);
      render(L, 0);
      fig.classList.add('ready');
    };
    img.src = fig.dataset.src;
  }
  const e2pointerFine = () => fine;

  function render(L, t) {
    const { W, H, al, N, out } = L, o = out.data;
    const fl = 1 + Math.sin(t * .013) * .05 + Math.sin(t * .029 + 2) * .04;
    const Z = W * .5, R2 = (W * .75) * (W * .75), lx = L.lx, ly = L.ly;
    for (let y = 0, i = 0; y < H; y++) {
      const dy = ly - y;
      for (let x = 0; x < W; x++, i++) {
        const dx = lx - x, inv = 1 / Math.sqrt(dx * dx + dy * dy + Z * Z);
        const Lx = dx * inv, Ly = dy * inv, Lz = Z * inv;
        const nx = N[i * 3], ny = N[i * 3 + 1], nz = N[i * 3 + 2];
        const diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
        const att = 1 / (1 + (dx * dx + dy * dy) / R2 * 2.4);
        let hx = Lx, hy = Ly, hz = Lz + 1; const hl = 1 / Math.sqrt(hx * hx + hy * hy + hz * hz);
        const sp = Math.max(0, (nx * hx + ny * hy + nz * hz) * hl);
        const spec = Math.pow(sp, 40) * .12 * att;
        const k = (.03 + 1.9 * (.45 + .55 * diff) * att * att) * fl;
        o[i * 4] = Math.min(255, Math.sqrt(al[i * 3] * k + spec) * 255);
        o[i * 4 + 1] = Math.min(255, Math.sqrt(al[i * 3 + 1] * k * .84 + spec * .85) * 255);
        o[i * 4 + 2] = Math.min(255, Math.sqrt(al[i * 3 + 2] * k * .62 + spec * .6) * 255);
        o[i * 4 + 3] = 255;
      }
    }
    L.g.putImageData(out, 0, 0);
    drawFlame(L.g, lx, ly - 4, 4.2, t, (L.tx - L.lx) * .03);
  }

  function litLoop() {
    document.querySelectorAll('.lit').forEach(prepare);
    if (reduce) return;
    const loop = (t) => {
      lits.forEach((L) => {
        if (!L.vis) return;
        if (!L.over) { L.tx = L.W * (.42 + Math.sin(t * .0006 + L.W) * .08); L.ty = L.H * (.3 + Math.cos(t * .0005) * .05); }
        L.lx += (L.tx - L.lx) * .14; L.ly += (L.ty - L.ly) * .14;
        render(L, t);
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ---------- WhatsApp con mensaje en el idioma ----------
  function wa() {
    const msg = () => I18N.t('Hola, quería reservar una mesa en La Ferla. Somos __ personas, para el día __ a las __.', 'Hola, voldria reservar una taula a La Ferla. Som __ persones, per al dia __ a les __.', 'Hi, I would like to book a table at La Ferla. We are __ people, on __ at __.');
    const set = () => document.querySelectorAll('a[href^="https://wa.me/34648088263"]').forEach((a) => (a.href = WA + encodeURIComponent(msg())));
    document.addEventListener('langchange', set); set();
  }

  function header() {
    const top = document.querySelector('.top'); let last = 0;
    addEventListener('scroll', () => {
      const y = scrollY; top.classList.toggle('solid', y > 40);
      if (y > 600 && y > last + 4) top.classList.add('hide'); else if (y < last - 4) top.classList.remove('hide');
      last = y;
    }, { passive: true });
  }

  function motion() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('h2.rv').forEach((h) => gsap.from(h, { opacity: 0, y: 40, filter: 'blur(10px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' }, clearProps: 'filter' }));
    gsap.utils.toArray('.cocina-txt p, .marco-txt p, .marco blockquote, .rs blockquote, .res-txt > p, .reservar dl, .platos-note').forEach((el) => gsap.from(el, { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));
    gsap.utils.toArray('.lit, .marco figure, .cocina-img').forEach((el) => gsap.from(el, { opacity: 0, y: 70, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 95%' } }));
    gsap.to('.cocina-img img', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.cocina', scrub: true } });
  }

  function heroIn() {
    if (reduce || typeof gsap === 'undefined') return;
    gsap.from('.hero-k, .hero h1 span, .hero h1 em, .hero-p, .hero-cta, .hero-rate', { opacity: 0, y: 36, filter: 'blur(8px)', duration: 1.6, stagger: .1, ease: 'expo.out', clearProps: 'filter' });
  }

  function init() {
    heroFlame(); litLoop(); wa(); header();
    if (!reduce && typeof gsap !== 'undefined') motion();
    intro().then(heroIn);
    document.fonts && document.fonts.ready.then(() => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
