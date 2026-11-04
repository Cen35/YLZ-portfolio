(() => {
  const container = document.querySelector('#projectParticles');
  if (!container) return;

  const config = {
    particleColors: ['#ffffff'],
    particleCount: 200,
    particleSpread: 10,
    speed: 0.1,
    particleBaseSize: 100,
    moveParticlesOnHover: true,
    alphaParticles: false,
    disableRotation: false
  };

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!context) return;
  container.appendChild(canvas);

  const surface = container.parentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const particles = Array.from({ length: config.particleCount }, () => ({
    x: Math.random(),
    y: Math.random(),
    depth: 0.35 + Math.random() * 0.65,
    phase: Math.random() * Math.PI * 2,
    driftX: (Math.random() - 0.5) * 0.000085,
    driftY: (Math.random() - 0.5) * 0.000085,
    size: 0.55 + Math.random() * 1.65
  }));

  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let frame = 0;
  let visible = false;
  let pageVisible = !document.hidden;
  let lastTime = performance.now();
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let cloudX = 0;
  let cloudY = 0;
  let pendingPointer = null;
  let surfaceRect = null;
  let lastDrawTime = 0;
  const drawInterval = 1000 / 45;

  // Render the glow once and reuse it for every particle. Rebuilding a blurred
  // shadow 200 times per frame was the largest source of pointer jank.
  const glowSprite = document.createElement('canvas');
  const glowSize = 32;
  glowSprite.width = glowSize;
  glowSprite.height = glowSize;
  const glowContext = glowSprite.getContext('2d');
  const glowGradient = glowContext.createRadialGradient(16, 16, 0, 16, 16, 16);
  glowGradient.addColorStop(0, 'rgba(255,255,255,1)');
  glowGradient.addColorStop(.18, 'rgba(255,255,255,.95)');
  glowGradient.addColorStop(.48, 'rgba(255,255,255,.34)');
  glowGradient.addColorStop(1, 'rgba(255,255,255,0)');
  glowContext.fillStyle = glowGradient;
  glowContext.fillRect(0, 0, glowSize, glowSize);

  const draw = () => {
    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = 'lighter';

    const rotation = config.disableRotation ? 0 : Math.sin(elapsed * 0.000055) * 0.055;
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const centerX = width / 2;
    const centerY = height / 2;

    for (const particle of particles) {
      const baseX = particle.x * width;
      const baseY = particle.y * height;
      const relativeX = baseX - centerX;
      const relativeY = baseY - centerY;
      const rotatedX = relativeX * cosine - relativeY * sine + centerX;
      const rotatedY = relativeX * sine + relativeY * cosine + centerY;
      const waveX = Math.sin(elapsed * 0.00012 + particle.phase) * 10 * particle.depth;
      const waveY = Math.cos(elapsed * 0.00009 + particle.phase) * 7 * particle.depth;
      const x = rotatedX + waveX + cloudX * particle.depth;
      const y = rotatedY + waveY + cloudY * particle.depth;
      const radius = particle.size * (config.particleBaseSize / 72) * particle.depth;

      const spriteSize = Math.max(4, radius * 6.5);
      context.globalAlpha = .58 + particle.depth * .42;
      context.drawImage(glowSprite, x - spriteSize / 2, y - spriteSize / 2, spriteSize, spriteSize);
    }

    context.restore();
  };

  const resize = () => {
    const rect = container.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    surfaceRect = surface.getBoundingClientRect();
    draw();
  };

  const handlePointerMove = event => {
    if (!config.moveParticlesOnHover) return;
    pendingPointer = { x: event.clientX, y: event.clientY };
  };

  const handlePointerLeave = () => {
    pendingPointer = null;
    pointerX = 0;
    pointerY = 0;
  };

  const update = time => {
    if (pendingPointer) {
      const rect = surfaceRect || surface.getBoundingClientRect();
      pointerX = ((pendingPointer.x - rect.left) / Math.max(1,rect.width) - 0.5) * -34;
      pointerY = ((pendingPointer.y - rect.top) / Math.max(1,rect.height) - 0.5) * -24;
      pendingPointer = null;
    }
    const delta = Math.min(40, time - lastTime);
    lastTime = time;
    elapsed += delta * config.speed;
    cloudX += (pointerX - cloudX) * 0.045;
    cloudY += (pointerY - cloudY) * 0.045;

    for (const particle of particles) {
      particle.x += particle.driftX * delta * config.speed;
      particle.y += particle.driftY * delta * config.speed;
      if (particle.x < -0.03) particle.x = 1.03;
      if (particle.x > 1.03) particle.x = -0.03;
      if (particle.y < -0.03) particle.y = 1.03;
      if (particle.y > 1.03) particle.y = -0.03;
    }

    if (time - lastDrawTime >= drawInterval) {
      draw();
      lastDrawTime = time;
    }
    frame = requestAnimationFrame(update);
  };

  const stop = () => {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const start = () => {
    if (reducedMotion.matches) {
      stop();
      draw();
      return;
    }
    if (!visible || !pageVisible || frame) return;
    lastTime = performance.now();
    frame = requestAnimationFrame(update);
  };

  const syncPlayback = () => {
    if (visible && pageVisible) start();
    else stop();
  };

  surface.addEventListener('pointermove', handlePointerMove, { passive: true });
  surface.addEventListener('pointerleave', handlePointerLeave, { passive: true });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0 });
  visibilityObserver.observe(container);

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    syncPlayback();
  });
  reducedMotion.addEventListener?.('change', syncPlayback);

  resize();
})();
