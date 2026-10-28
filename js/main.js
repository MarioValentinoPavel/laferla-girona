// La Ferla · «Claroscuro»: el titular sube palabra a palabra y tres platos de la casa entran en columna y flotan;
// en la carta la sala queda en penumbra y una luz de vela sigue al cursor. El botón de WhatsApp lleva el mensaje escrito.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const L = () => document.documentElement.lang;
  const T = (es, ca, en) => (L() === 'ca' ? ca : L() === 'en' ? en : es);
  const has = () => typeof gsap !== 'undefined' && !reduce;

  function hero() {
    if (!has()) return;
    gsap.fromTo('.hd', { y: 120, opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.out', stagger: .14, delay: .2 });
    gsap.fromTo('.hd img', { scale: 1.3 }, { scale: 1, duration: 2.4, ease: 'expo.out', stagger: .14, delay: .2 });
    [['.hd1', -60], ['.hd2', 50], ['.hd3', -110]].forEach(([s, y]) => gsap.to(s, { y, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));
  }

  // la luz de la vela sobre la carta
  function candle() {
    if (!fine || reduce) return;
    const sec = document.getElementById('platos');
    let x = 50, y = 40, tx = 50, ty = 40, on = false;
    sec.addEventListener('pointerenter', () => { on = true; sec.classList.add('lit'); });
    sec.addEventListener('pointerleave', () => { on = false; sec.classList.remove('lit'); });
    sec.addEventListener('pointermove', (e) => { const r = sec.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width) * 100; ty = ((e.clientY - r.top) / r.height) * 100; });
    const tick = (t) => {
      if (on) {
        // un leve temblor, como una llama
        const fl = Math.sin(t / 130) * .25 + Math.sin(t / 47) * .15;
        x += (tx - x) * .12; y += (ty - y) * .12;
        sec.style.setProperty('--x', (x + fl) + '%'); sec.style.setProperty('--y', (y + fl * .6) + '%');
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function wa() {
    const set = () => { const msg = T('Hola, me gustaría reservar una mesa en La Ferla.', 'Hola, voldria reservar una taula a La Ferla.', 'Hello, I would like to book a table at La Ferla.'); document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => (a.href = 'https://wa.me/34648088263?text=' + encodeURIComponent(msg))); };
    document.addEventListener('langchange', set); set();
  }

  function init() { hero(); candle(); wa(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
