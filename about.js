(() => {
  const aboutView = document.querySelector('#aboutView');
  const openButton = document.querySelector('#openAbout');
  const backButton = document.querySelector('#backFromAbout');
  const character = document.querySelector('#aboutCharacter');
  const aboutForm = document.querySelector('#aboutContentForm');
  const book = document.querySelector('#aboutBook');
  const sheets = [document.querySelector('#aboutSheetOne'), document.querySelector('#aboutSheetTwo'), document.querySelector('#aboutSheetThree')];
  const pageContents = [document.querySelector('#aboutPageOneContent'), document.querySelector('#aboutPageTwoContent'), document.querySelector('#aboutPageThreeContent')];
  const nextButtons = [document.querySelector('#aboutNextPage1'), document.querySelector('#aboutNextPage2')];
  const previousButtons = [document.querySelector('#aboutPreviousPage2'), document.querySelector('#aboutPreviousPage3')];
  const particleCanvas = document.querySelector('#aboutPageParticles');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!aboutView || !openButton || !backButton || !character || !book || sheets.some(sheet => !sheet)) return;

  const defaults = {
    title: 'ABOUT ME',
    items: [
      { key: 'identity', question: '姓名、班级与个人简介', answer: '姓名：YLZ\n班级：请在“管理资料卡”中填写\n个人简介：我喜欢观察生活中的真实需要，并把想法变成可以被看见、点击和使用的网页作品。' },
      { key: 'work', question: '学习方向', answer: '我目前主要学习网页视觉设计、前端开发与交互体验设计，并持续练习把创意转化为完整作品。' },
      { key: 'why', question: '工具与技能', answer: '请在“管理资料卡”中填写你使用的设计工具、开发技术，以及最能体现个人能力的技能。' },
      { key: 'traits', question: '个人特点', answer: '请在“管理资料卡”中填写你的性格特点、做事方式，以及你希望别人如何认识你。' },
      { key: 'interests', question: '兴趣与灵感', answer: '请在“管理资料卡”中填写你的兴趣爱好，以及日常创作灵感通常来自哪里。' },
      { key: 'goals', question: '成长目标', answer: '请在“管理资料卡”中填写你接下来希望学习、尝试或完成的目标。' }
    ]
  };
  const cloneDefaults = () => JSON.parse(JSON.stringify(defaults));
  const normalizeContent = saved => {
    if (!saved || !Array.isArray(saved.items)) return null;
    return {
      schemaVersion: 2,
      title: String(saved.title || defaults.title),
      items: defaults.items.map((item, index) => ({
        ...item,
        question: String(saved.items[index]?.question || item.question),
        answer: String(saved.items[index]?.answer || item.answer)
      }))
    };
  };
  const loadContent = () => {
    try { return normalizeContent(JSON.parse(localStorage.getItem('ylz-about-content'))) || cloneDefaults(); }
    catch { return cloneDefaults(); }
  };

  let content = loadContent();
  let currentPage = 0;
  let changingPage = false;
  let pointerFrame = 0;
  let pendingPointer = null;

  const buildProfileSection = item => {
    const section = document.createElement('section');
    section.className = 'about-profile-section';
    const heading = document.createElement('h3');
    const copy = document.createElement('p');
    heading.textContent = item.question;
    copy.textContent = item.answer;
    section.append(heading, copy);
    return section;
  };
  const renderContent = () => {
    pageContents.forEach(node => node.replaceChildren());
    document.querySelectorAll('[data-about-page-title]').forEach(node => { node.textContent = content.title; });
    content.items.slice(0, 2).forEach(item => pageContents[0].append(buildProfileSection(item)));
    content.items.slice(2, 4).forEach(item => pageContents[1].append(buildProfileSection(item)));
    content.items.slice(4, 6).forEach(item => pageContents[2].append(buildProfileSection(item)));
    content.items.forEach((item, index) => {
      const questionInput = document.querySelector(`#editAboutQuestion${index + 1}`);
      const answerInput = document.querySelector(`#editAboutAnswer${index + 1}`);
      if (questionInput) questionInput.value = item.question;
      if (answerInput) answerInput.value = item.answer;
    });
    const titleInput = document.querySelector('#editAboutTitle');
    if (titleInput) titleInput.value = content.title;
  };

  class PageParticleTransition {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas?.getContext('2d');
      this.raf = 0;
      this.points = [];
      this.frame = this.frame.bind(this);
    }
    resize() {
      if (!this.ctx) return;
      const bounds = book.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      this.width = Math.max(1, bounds.width); this.height = Math.max(1, bounds.height);
      this.canvas.width = Math.round(this.width * dpr); this.canvas.height = Math.round(this.height * dpr);
      this.canvas.style.width = `${this.width}px`; this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    play(direction, finish) {
      if (!this.ctx || reduceMotion.matches) { finish(); return; }
      cancelAnimationFrame(this.raf);
      this.resize();
      this.started = performance.now(); this.duration = 390; this.finish = finish;
      const count = Math.round(Math.min(260, Math.max(150, this.width * .22)));
      this.points = Array.from({ length: count }, () => ({
        x: Math.random() * this.width, y: 22 + Math.random() * (this.height - 44),
        vx: direction * (22 + Math.random() * 76) + (Math.random() - .5) * 25,
        vy: (Math.random() - .5) * 64, size: .7 + Math.random() * 2.4,
        delay: Math.random() * .32,
        color: Math.random() > .7 ? '#ffc9df' : (Math.random() > .55 ? '#ffe8f1' : '#fffdfd')
      }));
      this.canvas.classList.add('is-active');
      this.raf = requestAnimationFrame(this.frame);
    }
    frame(now) {
      const progress = Math.min(1, (now - this.started) / this.duration);
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.globalCompositeOperation = 'lighter';
      for (const point of this.points) {
        const t = Math.max(0, Math.min(1, (progress - point.delay) / (1 - point.delay)));
        if (!t) continue;
        const eased = 1 - Math.pow(1 - t, 3);
        ctx.globalAlpha = Math.sin(Math.PI * t) * .82; ctx.fillStyle = point.color;
        ctx.beginPath(); ctx.arc(point.x + point.vx * eased, point.y + point.vy * eased, point.size * (1 - t * .35), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      if (progress < 1) this.raf = requestAnimationFrame(this.frame);
      else { this.canvas.classList.remove('is-active'); ctx.clearRect(0, 0, this.width, this.height); this.finish?.(); }
    }
  }

  const pageParticles = new PageParticleTransition(particleCanvas);
  const setPage = (index, { animate = true } = {}) => {
    if (changingPage || index === currentPage || index < 0 || index > 2) return;
    const from = currentPage;
    const swap = () => {
      sheets[from].classList.remove('is-visible', 'is-dispersing');
      sheets[from].setAttribute('aria-hidden', 'true');
      sheets[index].classList.add('is-visible', 'is-revealing');
      sheets[index].setAttribute('aria-hidden', 'false');
      currentPage = index;
      requestAnimationFrame(() => sheets[index].classList.remove('is-revealing'));
      changingPage = false;
      const focusTarget = index === 0 ? nextButtons[0] : (index === 2 ? previousButtons[1] : (index > from ? nextButtons[1] : previousButtons[0]));
      focusTarget?.focus({ preventScroll: true });
      window.YLZDecayCards?.forEach(card => card.wake?.());
    };
    changingPage = true;
    sheets[from].classList.add('is-dispersing');
    if (!animate || reduceMotion.matches) swap(); else pageParticles.play(index > from ? 1 : -1, swap);
  };
  const resetFirstPage = () => {
    currentPage = 0; changingPage = false;
    sheets[0].classList.add('is-visible'); sheets[0].classList.remove('is-dispersing', 'is-revealing'); sheets[0].setAttribute('aria-hidden', 'false');
    sheets.slice(1).forEach(sheet => { sheet.classList.remove('is-visible', 'is-dispersing', 'is-revealing'); sheet.setAttribute('aria-hidden', 'true'); });
  };

  class GalaxyBackground {
    constructor(canvas) {
      this.canvas = canvas; this.ctx = canvas?.getContext('2d'); this.stars = []; this.pointer = { x: 0, y: 0, active: false }; this.raf = 0; this.last = 0;
      if (!this.ctx) return;
      this.resize = this.resize.bind(this); this.frame = this.frame.bind(this);
      new ResizeObserver(this.resize).observe(canvas.parentElement);
      window.addEventListener('pointermove', event => {
        if (!aboutView.classList.contains('is-active') || reduceMotion.matches) return;
        this.pointer = { x: event.clientX, y: event.clientY, active: true };
      }, { passive: true });
      window.addEventListener('blur', () => { this.pointer.active = false; });
    }
    resize() {
      const box = this.canvas.parentElement.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 1.5);
      this.width = Math.max(1, box.width); this.height = Math.max(1, box.height);
      this.canvas.width = Math.round(this.width * dpr); this.canvas.height = Math.round(this.height * dpr);
      this.canvas.style.width = `${this.width}px`; this.canvas.style.height = `${this.height}px`; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(420, Math.max(210, this.width * .28)));
      this.stars = Array.from({ length: count }, () => ({ x: Math.random() * this.width, y: Math.random() * this.height, r: .35 + Math.random() * 1.45, a: .1 + Math.random() * .65, s: .05 + Math.random() * .13 }));
      this.draw(0);
    }
    draw(dt) {
      const ctx = this.ctx; ctx.clearRect(0, 0, this.width, this.height);
      for (const star of this.stars) {
        if (!reduceMotion.matches) star.y = (star.y + star.s * dt * 60) % this.height;
        let x = star.x, y = star.y;
        if (this.pointer.active && !reduceMotion.matches) {
          const dx = x - this.pointer.x, dy = y - this.pointer.y, distance = Math.hypot(dx, dy);
          if (distance < 150 && distance > .1) { const force = (1 - distance / 150) * 18; x += dx / distance * force; y += dy / distance * force; }
        }
        ctx.globalAlpha = star.a; ctx.fillStyle = '#f6efff'; ctx.beginPath(); ctx.arc(x, y, star.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    frame(now) {
      this.raf = 0;
      if (!aboutView.classList.contains('is-active') || document.hidden) { this.last = 0; return; }
      const dt = this.last ? Math.min(.05, (now - this.last) / 1000) : 1 / 60; this.last = now; this.draw(dt);
      if (!reduceMotion.matches) this.raf = requestAnimationFrame(this.frame);
    }
    wake() { if (!this.raf) this.raf = requestAnimationFrame(this.frame); }
  }

  const galaxy = new GalaxyBackground(document.querySelector('#aboutGalaxyCanvas'));
  const enterAbout = () => {
    resetFirstPage(); renderContent(); showView('about');
    aboutView.classList.remove('is-entering'); void aboutView.offsetWidth; aboutView.classList.add('is-entering');
    setTimeout(() => aboutView.classList.remove('is-entering'), 430);
    galaxy.wake(); window.YLZDecayCards?.forEach(card => card.wake?.()); backButton.focus({ preventScroll: true });
  };
  const leaveAbout = () => { renderDirectory(); showView('directory'); openButton.focus({ preventScroll: true }); };
  window.YLZAbout = { enter: enterAbout, leave: leaveAbout };

  nextButtons[0]?.addEventListener('click', () => setPage(1));
  nextButtons[1]?.addEventListener('click', () => setPage(2));
  previousButtons[0]?.addEventListener('click', () => setPage(0));
  previousButtons[1]?.addEventListener('click', () => setPage(1));
  openButton.addEventListener('click', enterAbout); backButton.addEventListener('click', leaveAbout);
  window.addEventListener('keydown', event => {
    if (!aboutView.classList.contains('is-active')) return;
    if (event.key === 'Escape') leaveAbout();
    if (event.key === 'ArrowRight') setPage(currentPage + 1);
    if (event.key === 'ArrowLeft') setPage(currentPage - 1);
  });

  character.addEventListener('pointermove', event => {
    if (reduceMotion.matches) return;
    const bounds = character.getBoundingClientRect();
    pendingPointer = { x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5 };
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0; character.style.setProperty('--about-ry', `${pendingPointer.x * 3}deg`); character.style.setProperty('--about-rx', `${pendingPointer.y * -2}deg`);
    });
  }, { passive: true });
  character.addEventListener('pointerleave', () => { character.style.setProperty('--about-rx', '0deg'); character.style.setProperty('--about-ry', '0deg'); });

  if (aboutForm) aboutForm.addEventListener('submit', async event => {
    event.preventDefault();
    content = {
      schemaVersion: 2,
      title: document.querySelector('#editAboutTitle').value.trim() || defaults.title,
      items: defaults.items.map((item, index) => ({
        key: item.key,
        question: document.querySelector(`#editAboutQuestion${index + 1}`).value.trim() || item.question,
        answer: document.querySelector(`#editAboutAnswer${index + 1}`).value.trim() || item.answer
      }))
    };
    localStorage.setItem('ylz-about-content', JSON.stringify(content)); renderContent();
    const submitButton = aboutForm.querySelector('button[type="submit"]'); const previousLabel = submitButton?.textContent;
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = '正在保存…'; }
    try {
      if (window.YLZCloudStore?.enabled) {
        const session = await window.YLZCloudStore.ensureAdminSession(); if (!session) throw new Error('管理员登录未完成');
        await window.YLZCloudStore.saveAboutContent(content); alert('三页个人资料已保存到云端。');
      } else alert('个人资料已保存在当前浏览器。Supabase 尚未连接。');
    } catch (error) { alert(`云端保存失败：${error.message}\n内容已暂存在当前浏览器。`); }
    finally { if (submitButton) { submitButton.disabled = false; submitButton.textContent = previousLabel; } }
  });

  resetFirstPage(); renderContent();
  (async () => {
    if (!window.YLZCloudStore?.enabled) return;
    try {
      const remote = normalizeContent(await window.YLZCloudStore.loadAboutContent()); if (!remote) return;
      content = remote; localStorage.setItem('ylz-about-content', JSON.stringify(content)); renderContent();
    } catch (error) { console.warn('个人资料云端读取失败，继续使用本地内容。', error); }
  })();
})();
