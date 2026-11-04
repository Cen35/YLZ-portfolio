(() => {
  const aboutView = document.querySelector('#aboutView');
  const openButton = document.querySelector('#openAbout');
  const backButton = document.querySelector('#backFromAbout');
  const folder = document.querySelector('#aboutFolder');
  const folderToggle = document.querySelector('#aboutFolderToggle');
  const answer = document.querySelector('#aboutAnswer');
  const answerQuestion = document.querySelector('#aboutAnswerQuestion');
  const answerText = document.querySelector('#aboutAnswerText');
  const answerIndex = document.querySelector('#aboutAnswerIndex');
  const answerLabel = document.querySelector('#aboutAnswerLabel');
  const character = document.querySelector('#aboutCharacter');
  const questions = [...document.querySelectorAll('[data-about-question]')];
  const aboutForm = document.querySelector('#aboutContentForm');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!aboutView || !openButton || !folder || !folderToggle || !answer || !character) return;

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
  const legacyItems = [
    { question: '你是谁？', answer: '我是 YLZ，一名独立开发者。我喜欢观察生活里的真实需要，再把它们变成能被看见、点击和使用的网页作品。' },
    { question: '你在做什么？', answer: '我从视觉、页面结构到前端交互一起思考，持续制作实用工具、学习产品和带有个人风格的网页体验。' },
    { question: '为什么创作？', answer: '我享受把模糊想法一步步变清晰的过程。每一件作品既解决一个具体问题，也记录我不断学习和尝试的新方法。' }
  ];

  const cloneDefaults = () => JSON.parse(JSON.stringify(defaults));
  const loadContent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('ylz-about-content'));
      if (!saved || !Array.isArray(saved.items)) return cloneDefaults();
      return {
        schemaVersion: 2,
        title: String(saved.title || defaults.title),
        items: defaults.items.map((item, index) => {
          const savedQuestion = String(saved.items[index]?.question || item.question);
          const savedAnswer = String(saved.items[index]?.answer || item.answer);
          return {
            ...item,
            question: saved.schemaVersion === 2 ? savedQuestion : item.question,
            answer: savedAnswer === legacyItems[index]?.answer ? item.answer : savedAnswer
          };
        })
      };
    } catch {
      return cloneDefaults();
    }
  };

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

  let content = loadContent();
  let answerTimer = 0;
  let folderVisibilityTimer = 0;
  let pointerFrame = 0;
  let pendingPointer = null;

  const renderContent = () => {
    const pageTitle = document.querySelector('#aboutPageTitle');
    if (pageTitle) pageTitle.textContent = content.title;
    document.querySelector('#aboutFolderLabel').textContent = content.title;
    content.items.forEach((item, index) => {
      const node = document.querySelector(`[data-about-question-text="${item.key}"]`);
      if (node) node.textContent = item.question;
      const questionInput = document.querySelector(`#editAboutQuestion${index + 1}`);
      const answerInput = document.querySelector(`#editAboutAnswer${index + 1}`);
      if (questionInput) questionInput.value = item.question;
      if (answerInput) answerInput.value = item.answer;
    });
    const titleInput = document.querySelector('#editAboutTitle');
    if (titleInput) titleInput.value = content.title;
  };

  const setFolderOpen = open => {
    folder.classList.toggle('is-open', open);
    folderToggle.setAttribute('aria-expanded', String(open));
    folderToggle.querySelector('small').textContent = open ? '选择一份档案查看' : '点击查看个人简介与能力';
    questions.forEach(button => button.tabIndex = open ? 0 : -1);
    if (!open) hideAnswer();
  };

  const setFolderAnswerState = active => {
    clearTimeout(folderVisibilityTimer);
    const apply = () => {
      folder.classList.toggle('is-answer-active', active);
      folder.setAttribute('aria-hidden', String(active));
      folderToggle.tabIndex = active ? -1 : 0;
      questions.forEach(button => button.tabIndex = active ? -1 : (folder.classList.contains('is-open') ? 0 : -1));
    };
    if (!active && !reduceMotion.matches) folderVisibilityTimer = setTimeout(apply, 150);
    else apply();
  };

  const hideAnswer = ({ restoreFocus = false } = {}) => {
    const selectedQuestion = questions.find(question => question.classList.contains('is-selected'));
    clearTimeout(answerTimer);
    answer.classList.remove('is-visible', 'is-arriving', 'is-leaving');
    answer.classList.add('is-empty');
    answer.setAttribute('aria-hidden', 'true');
    questions.forEach(question => {
      question.classList.remove('is-selected');
      question.setAttribute('aria-selected', 'false');
    });
    setFolderAnswerState(false);
    if (restoreFocus && selectedQuestion) {
      const focusDelay = reduceMotion.matches ? 0 : 470;
      setTimeout(() => selectedQuestion.focus({ preventScroll: true }), focusDelay);
    }
  };

  const showAnswer = button => {
    const index = questions.indexOf(button);
    const item = content.items[index];
    if (!item) return;
    questions.forEach(question => {
      const selected = question === button;
      question.classList.toggle('is-selected', selected);
      question.setAttribute('aria-selected', String(selected));
    });
    answer.setAttribute('aria-labelledby', button.id);
    answer.classList.toggle('has-profile-photo', index === 0);
    clearTimeout(answerTimer);
    setFolderAnswerState(true);
    const update = () => {
      answerLabel.textContent = `PROFILE FILE / ${String(index + 1).padStart(2, '0')}`;
      answerQuestion.textContent = item.question;
      answerText.textContent = item.answer;
      answerIndex.textContent = `${String(index + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
      answer.classList.remove('is-empty', 'is-leaving');
      answer.classList.add('is-visible');
      answer.setAttribute('aria-hidden', 'false');
      if (!reduceMotion.matches) {
        void answer.offsetWidth;
        answer.classList.add('is-arriving');
        answerTimer = setTimeout(() => answer.classList.remove('is-arriving'), 260);
      }
    };
    if (reduceMotion.matches) update();
    else if (answer.classList.contains('is-empty')) answerTimer = setTimeout(update, 125);
    else {
      answer.classList.remove('is-arriving');
      answer.classList.add('is-leaving');
      answerTimer = setTimeout(update, 115);
    }
  };

  class GalaxyBackground {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas?.getContext('2d');
      this.stars = [];
      this.pointer = { x: 0, y: 0, active: false };
      this.warp = 0;
      this.raf = 0;
      this.last = 0;
      this.visible = false;
      this.density = 1;
      this.glowIntensity = .3;
      this.flareIntensity = 1;
      this.starSpeed = .5;
      if (!this.ctx) return;
      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);
      this.resizeObserver = new ResizeObserver(this.resize);
      this.resizeObserver.observe(canvas.parentElement);
      window.addEventListener('pointermove', event => {
        if (!aboutView.classList.contains('is-active') || reduceMotion.matches) return;
        this.pointer.x = event.clientX;
        this.pointer.y = event.clientY;
        this.pointer.active = true;
      }, { passive: true });
      window.addEventListener('pointerdown', () => {
        if (!aboutView.classList.contains('is-active') || reduceMotion.matches) return;
        this.warp = Math.min(1.6, this.warp + 1);
        this.wake();
      }, { passive: true });
      window.addEventListener('blur', () => { this.pointer.active = false; });
    }

    reset(star, randomDepth = true) {
      const spread = Math.max(this.width, this.height);
      star.x = (Math.random() - .5) * spread * 2.2;
      star.y = (Math.random() - .5) * spread * 1.45;
      star.z = randomDepth ? Math.random() * spread + 1 : spread;
      star.pz = star.z;
      star.size = .35 + Math.random() * 1.55;
      star.color = Math.random() > .82 ? (Math.random() > .5 ? '#ffb4e7' : '#9feeff') : '#f4efff';
    }

    resize() {
      const box = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.6);
      this.width = Math.max(1, box.width);
      this.height = Math.max(1, box.height);
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(520, Math.max(230, this.width * .34 * this.density)));
      this.stars = Array.from({ length: count }, () => { const star = {}; this.reset(star); return star; });
      this.draw(0);
    }

    wake() {
      this.visible = true;
      if (!this.raf) this.raf = requestAnimationFrame(this.frame);
    }

    draw(dt) {
      const ctx = this.ctx;
      const cx = this.width / 2;
      const cy = this.height / 2;
      const focal = Math.max(this.width, this.height) * .7;
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.globalCompositeOperation = 'lighter';
      const speed = 58 * this.starSpeed * (1 + this.warp * 14);
      for (const star of this.stars) {
        star.pz = star.z;
        if (!reduceMotion.matches) star.z -= speed * dt;
        if (star.z < 1) this.reset(star, false);
        let x = star.x / star.z * focal + cx;
        let y = star.y / star.z * focal + cy;
        if (this.pointer.active && !reduceMotion.matches) {
          const dx = x - this.pointer.x;
          const dy = y - this.pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 180 && distance > .1) {
            const force = (1 - distance / 180) * 45;
            x += dx / distance * force;
            y += dy / distance * force;
          }
        }
        if (x < -40 || x > this.width + 40 || y < -40 || y > this.height + 40) { this.reset(star, false); continue; }
        const depth = 1 - star.z / Math.max(this.width, this.height);
        const alpha = Math.max(.08, Math.min(.9, depth + .12));
        ctx.fillStyle = star.color;
        const radius = Math.max(.45, star.size * (.45 + depth * .72));
        if (star.size > 1.25) {
          ctx.globalAlpha = alpha * this.glowIntensity * .18;
          ctx.beginPath();
          ctx.arc(x, y, radius * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    frame(now) {
      this.raf = 0;
      if (!aboutView.classList.contains('is-active') || document.hidden) { this.last = 0; return; }
      const dt = this.last ? Math.min(.05, (now - this.last) / 1000) : 1 / 60;
      this.last = now;
      this.warp *= Math.exp(-dt * 1.9);
      if (this.warp < .002) this.warp = 0;
      this.draw(dt);
      if (!reduceMotion.matches || this.warp > 0) this.raf = requestAnimationFrame(this.frame);
    }
  }

  const galaxy = new GalaxyBackground(document.querySelector('#aboutGalaxyCanvas'));

  const enterAbout = () => {
    setFolderOpen(false);
    questions.forEach(question => { question.classList.remove('is-selected'); question.setAttribute('aria-selected', 'false'); });
    showView('about');
    aboutView.classList.remove('is-entering');
    void aboutView.offsetWidth;
    aboutView.classList.add('is-entering');
    setTimeout(() => aboutView.classList.remove('is-entering'), 520);
    galaxy.wake();
    backButton.focus({ preventScroll: true });
  };

  const leaveAbout = () => {
    aboutView.classList.remove('is-entering');
    renderDirectory();
    showView('directory');
    openButton.focus({ preventScroll: true });
  };

  window.YLZAbout = { enter: enterAbout, leave: leaveAbout };

  folderToggle.addEventListener('click', () => setFolderOpen(!folder.classList.contains('is-open')));
  questions.forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const isCurrentAnswer = button.classList.contains('is-selected') && answer.classList.contains('is-visible');
    if (isCurrentAnswer) hideAnswer();
    else showAnswer(button);
  }));
  answer.addEventListener('click', () => {
    if (answer.classList.contains('is-visible')) hideAnswer({ restoreFocus: true });
  });
  answer.addEventListener('keydown', event => {
    if (!answer.classList.contains('is-visible') || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    hideAnswer({ restoreFocus: true });
  });

  character.addEventListener('pointermove', event => {
    if (reduceMotion.matches) return;
    const bounds = character.getBoundingClientRect();
    pendingPointer = { x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5 };
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      character.style.setProperty('--about-ry', `${pendingPointer.x * 3}deg`);
      character.style.setProperty('--about-rx', `${pendingPointer.y * -2}deg`);
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
    localStorage.setItem('ylz-about-content', JSON.stringify(content));
    renderContent();
    const submitButton = aboutForm.querySelector('button[type="submit"]');
    const previousLabel = submitButton?.textContent;
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = '正在保存…'; }
    try {
      if (window.YLZCloudStore?.enabled) {
        const session = await window.YLZCloudStore.ensureAdminSession();
        if (!session) throw new Error('管理员登录未完成');
        await window.YLZCloudStore.saveAboutContent(content);
        alert('个人资料卡已保存到云端，所有设备都会显示这份内容。');
      } else {
        alert('个人资料卡已保存在当前浏览器。Supabase 尚未连接，暂时无法同步到其他设备。');
      }
    } catch (error) {
      alert(`云端保存失败：${error.message}\n内容已暂存在当前浏览器，请确认已运行最新的 Supabase 设置脚本。`);
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = previousLabel; }
    }
  });

  openButton.addEventListener('click', enterAbout);
  backButton.addEventListener('click', leaveAbout);
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && aboutView.classList.contains('is-active')) leaveAbout();
  });
  renderContent();
  (async () => {
    if (!window.YLZCloudStore?.enabled) return;
    try {
      const remote = normalizeContent(await window.YLZCloudStore.loadAboutContent());
      if (!remote) return;
      content = remote;
      localStorage.setItem('ylz-about-content', JSON.stringify(content));
      renderContent();
    } catch (error) {
      console.warn('个人资料卡云端读取失败，继续使用本地内容。', error);
    }
  })();
})();
