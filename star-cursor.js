(() => {
  const canvas = document.createElement('canvas');
  canvas.className = 'star-cursor-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  document.body.append(canvas);
  const fine = matchMedia('(any-pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const colors = ['#a5f3fc', '#f9a8df', '#d6bcff'];
  let x = 0, y = 0, visible = false, pressed = false, hover = false;
  let lastX = 0, lastY = 0, lastTime = 0, frame = 0;
  let stars = [];
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    schedule();
  }
  function star(cx, cy, radius, rotation, color, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = radius * 1.5;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 ? radius * .43 : radius;
      const px = Math.cos(angle) * r, py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function draw(now) {
    frame = 0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    stars = stars.filter(p => now - p.born < p.life);
    for (const p of stars) {
      const age = (now - p.born) / p.life;
      star(p.x + p.vx * age, p.y + p.vy * age, p.size * (1 - age * .75), p.rotation + age, p.color, (1 - age) ** 2 * .85);
    }
    if (visible) {
      star(x, y, pressed ? 10 : hover ? 14 : 12, -.15, '#a5f3fc', 1);
      star(x, y, pressed ? 7 : hover ? 10 : 8.5, -.15, '#f9c3ec', 1);
    }
    if (stars.length) schedule();
  }
  function hide() {
    visible = false;
    pressed = false;
    stars = [];
    root.classList.remove('star-cursor-active');
    schedule();
  }
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !fine.matches) { hide(); return; }
    x = e.clientX; y = e.clientY;
    if (!visible) { lastX = x; lastY = y; }
    visible = true;
    root.classList.add('star-cursor-active');
    const now = performance.now(), distance = Math.hypot(x - lastX, y - lastY);
    if (!reduced.matches && distance >= 8 && now - lastTime >= 24) {
      const count = Math.min(3, Math.ceil(distance / 18));
      for (let i = 1; i <= count; i++) {
        stars.push({ x: lastX + (x - lastX) * i / count, y: lastY + (y - lastY) * i / count,
          vx: (Math.random() - .5) * 22, vy: 12 + Math.random() * 18,
          size: 2.5 + Math.random() * (pressed ? 5 : 3.5), rotation: Math.random() * Math.PI,
          color: colors[Math.floor(Math.random() * colors.length)], born: now, life: 420 + Math.random() * 260 });
      }
      stars = stars.slice(-54);
      lastX = x; lastY = y; lastTime = now;
    }
    schedule();
  }, { passive: true });
  window.addEventListener('pointerover', e => {
    hover = !!e.target.closest('button,a,input,textarea,[role="button"],[role="option"]');
  }, { passive: true });
  window.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { pressed = true; schedule(); } });
  window.addEventListener('pointerup', () => { pressed = false; schedule(); });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  fine.addEventListener('change', hide);
  reduced.addEventListener('change', () => { stars = []; schedule(); });
  window.addEventListener('resize', resize);
  resize();
})();
