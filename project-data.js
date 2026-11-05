window.YLZ_DEFAULT_PROJECTS = [
  {
    id: 'wuzhou',
    name: 'TASTE OF WUZHOU',
    description: '一个无需商家入驻、专注真实美食探索的网站',
    introduction: '这是一个没有商家入驻，全靠自己填入，真实无广，还能评论嘿嘿！',
    completionDate: '2026-09-13',
    url: 'https://illustrious-seahorse-315f27.netlify.app/',
    tags: ['TASTY', 'FOOD', 'WUZHOU'],
    cover: 'assets/wuzhou-cover.png',
    images: [
      'assets/projects/wuzhou-detail-1.jpg',
      'assets/projects/wuzhou-detail-2.jpg',
      'assets/projects/wuzhou-detail-3.jpg'
    ],
    imageNames: [
      '屏幕截图 2026-09-23 192621.png',
      '屏幕截图 2026-09-23 192535.png',
      '屏幕截图 2026-09-23 192510.png'
    ],
    caseStudy: [
      {
        id: 'outcome',
        label: '项目成果',
        code: 'RESULT 01',
        title: '从美食手账到可真实使用的本地探索工具',
        summary: '项目已上线公开访问，收录 45 家梧州真实店铺，以手账首页、美食地图与店铺详情串联完整体验。',
        points: [
          '10 类美食目录，支持首页推荐、地图搜索、店铺详情、评论与收藏。',
          '支持用户投稿与管理员审核，并通过重复店铺检测减少脏数据。',
          '路线规划支持起点与最多 8 个途经点，可选择驾车、公交、步行或骑行。',
          '个人中心集中管理收藏、投稿和评论；弱网时自动读取本地缓存，避免页面清空。'
        ],
        note: '公开访问 · 45 家真实店铺 · 10 类美食 · 4 种导航方式'
      },
      {
        id: 'solution',
        label: '问题与方案',
        code: 'CASE 02',
        title: '解决移动端弱网下“45 家店铺消失”的问题',
        summary: '在手机 4G/5G 环境中，云端请求失败后程序回退到空数组，页面只剩 6 张占位卡且地图标记全部消失。',
        points: [
          '定位到 supadb.js：原有降级只返回空数据，没有任何可用缓存。',
          '增加 8 秒请求超时与 20 秒熔断，避免网络异常时长时间卡住。',
          '云端读取成功后同步写入本地缓存；请求失败时改为读取最近一次成功数据。',
          '最终在弱网与离线场景下仍能展示 45 家店铺，验证“有数据的降级”才是真正降级。'
        ],
        note: '用户场景 · 本地居民与游客在移动网络中临时查找美食'
      },
      {
        id: 'evidence',
        label: '过程证据',
        code: 'PROCESS 03',
        title: '需求、设计与 AI 协作都留下可复查的依据',
        summary: '项目从一句“森系治愈、像手账本的梧州美食地图”开始，逐步拆成可实现、可验证的模块。',
        points: [
          '需求演进：地图、目录、投稿审核、收藏、个人中心、路线导航逐步加入。',
          '视觉决策：双页横线手账、低饱和抹茶绿、奶油纸色与旧粉色，配合线性图标和手写标题。',
          'AI 对话策略：先写约束再写目标；描述故障时同时提供现象、复现步骤与期望结果。',
          '典型修复证据包括 SVG 动画重叠、云端失败导致空白，以及本地首位用户自动成为管理员的权限漏洞。'
        ],
        note: '验证方式 · 截图复现、代码定位、移动网络测试、刷新与离线回归'
      },
      {
        id: 'iterations',
        label: '迭代记录',
        code: 'VERSIONS 04',
        title: '从 V1.0 到 V2.3 的持续修正',
        summary: '每次更新围绕“改了什么、为什么改、效果如何、下一步是什么”推进，而不是只增加功能。',
        points: [
          '2026.09.10 · V1.0–V1.2：完成首版、本地降级与统一视觉系统。',
          '2026.09.11 · V1.3–V1.4：修复加载、地图显示与猫狗 SVG 动画重叠。',
          '2026.09.12–09.14 · V1.5–V2.2：加入防重复、路线、收藏、个人中心、权限安全与移动端优化。',
          '2026.09.29 · V2.3：建立弱网缓存机制，完成移动网络与离线回归。'
        ],
        note: '当前版本 · V2.3'
      },
      {
        id: 'reflection',
        label: '学习复盘',
        code: 'REVIEW 05',
        title: '从“能运行”走向“能被别人稳定使用”',
        summary: '这次实践让我把模糊想法转化成模块、约束和验收条件，也开始用工程视角管理数据、权限和版本。',
        points: [
          '有效方法：先设约束、再做功能；用手机 4G、硬刷新与离线状态做真实验收。',
          '失败经验：没有缓存的降级、默认管理员逻辑、静态资源版本未更新都会让“看似可用”失效。',
          '能力变化：从反复试错转向理解机制，从独立编码转向记录问题与管理迭代。',
          '下一步：接入 Git 版本管理、建立离线回归清单、用 IndexedDB 缓存图片并尝试 PWA。'
        ],
        note: '可迁移原则 · 降级方案必须提前准备可用数据'
      }
    ]
  },
  {
    id: 'project-1790157433584',
    name: '民族乐器科普',
    description: '给小朋友认识民族乐器的网站',
    introduction: '国乐乐器启蒙网，汇集80余种民族乐器。看图识器、聆听乐音，趣味闯关答题，带小朋友轻松领略国乐之美。',
    url: 'https://app-ec8r7si0j3ep.miaoda.online/',
    tags: ['INSTRUMENT', 'MUSIC', 'CHILDREN'],
    cover: 'assets/projects/instrument-cover.jpg',
    coverName: '屏幕截图 2026-09-23 192733.png',
    images: [
      'assets/projects/instrument-detail-1.jpg',
      'assets/projects/instrument-detail-2.jpg',
      'assets/projects/instrument-cover.jpg'
    ],
    imageNames: [
      '屏幕截图 2026-09-23 192753.png',
      '屏幕截图 2026-09-23 192744.png',
      '屏幕截图 2026-09-23 192733.png'
    ]
  },
  {
    id: 'interntrack',
    name: 'InternTrack',
    description: '大学生实习申请与面试进度管理系统',
    introduction: '面向大学生的实习申请管理系统，集中追踪岗位、投递进度、面试安排、简历版本与后续跟进。',
    url: 'https://astounding-centaur-ad4d27.netlify.app/',
    tags: ['CAREER', 'APPLICATION', 'SUPABASE'],
    cover: 'assets/projects/interntrack-desktop.png',
    coverName: 'interntrack-desktop.png',
    images: [
      'assets/projects/interntrack-desktop.png',
      'assets/projects/interntrack-tablet.png',
      'assets/projects/interntrack-mobile.png'
    ],
    imageNames: [
      'interntrack-desktop.png',
      'interntrack-tablet.png',
      'interntrack-mobile.png'
    ]
  },
  {
    id: 'echo-library',
    name: '回声册',
    description: '为英语精听设计的 AB 循环复读与材料管理工具',
    introduction: '面向英语精听的个人复读工具，支持材料管理、AB循环、变速播放、学习进度记忆与笔记。',
    url: 'projects/echo-library/index.html',
    tags: ['ENGLISH', 'AB REPEAT', 'STUDY TOOL'],
    cover: 'assets/projects/echo-library-desktop.png',
    coverName: 'echo-library-desktop.png',
    images: [
      'assets/projects/echo-library-desktop.png',
      'assets/projects/echo-library-tablet.png',
      'assets/projects/echo-library-mobile.png'
    ],
    imageNames: [
      'echo-library-desktop.png',
      'echo-library-tablet.png',
      'echo-library-mobile.png'
    ]
  },
  {
    id: 'pomodoro-focus',
    name: '专注一刻',
    description: '支持专注、休息与记录统计的番茄钟计时器',
    introduction: '可自定义专注和休息时长，记录完成次数与累计分钟，帮助保持稳定节奏。',
    completionDate: '',
    url: 'https://cen35.github.io/pomodoro-focus/',
    tags: ['POMODORO', 'FOCUS', 'REACT'],
    cover: 'assets/projects/pomodoro-cover.png',
    coverName: '番茄钟计时器.png',
    images: [
      'assets/projects/pomodoro-cover.png',
      'assets/projects/pomodoro-repository.png',
      'assets/projects/pomodoro-deployment.png'
    ],
    imageNames: [
      '番茄钟计时器.png',
      '番茄钟 GitHub 仓库.png',
      '番茄钟部署记录.png'
    ]
  },
  {
    id: 'weather-query',
    name: '晴屿天气',
    description: '支持城市搜索、定位与六日预报的天气查询应用',
    introduction: '调用 Open-Meteo API，支持城市搜索、定位、收藏与天气错误提示。',
    completionDate: '',
    url: 'https://cen35.github.io/weather-query/',
    tags: ['WEATHER', 'API', 'GEOLOCATION'],
    cover: 'assets/projects/weather-cover.png',
    coverName: '天气查询应用.png',
    images: [
      'assets/projects/weather-cover.png',
      'assets/projects/weather-repository.png',
      'assets/projects/weather-deployment.png'
    ],
    imageNames: [
      '天气查询应用.png',
      '天气应用 GitHub 仓库.png',
      '天气应用部署记录.png'
    ]
  },
  {
    id: 'advanced-todo',
    name: '进阶待办',
    description: '支持分类、筛选、搜索与统计的任务管理应用',
    introduction: '可添加、编辑、删除与筛选任务，使用浏览器本地存储保存进度。',
    completionDate: '',
    url: 'https://advanced-todo-steel.vercel.app/',
    tags: ['TODO', 'PRODUCTIVITY', 'LOCAL STORAGE'],
    cover: 'assets/projects/advanced-todo-cover.png',
    coverName: '进阶待办事项应用.png',
    images: [
      'assets/projects/advanced-todo-cover.png',
      'assets/projects/advanced-todo-deployment.png'
    ],
    imageNames: [
      '进阶待办事项应用.png',
      '进阶待办部署记录.png'
    ]
  },
  {
    id: 'markdown-notes',
    name: '墨记',
    description: '支持实时预览与本地保存的 Markdown 笔记应用',
    introduction: '左侧管理笔记，中间编辑 Markdown，右侧实时预览，并自动保存到浏览器。',
    completionDate: '',
    url: 'https://markdown-notes-blue-pi.vercel.app/',
    tags: ['MARKDOWN', 'NOTES', 'PREVIEW'],
    cover: 'assets/projects/markdown-notes-cover.png',
    coverName: 'Markdown 笔记应用.png',
    images: [
      'assets/projects/markdown-notes-cover.png',
      'assets/projects/markdown-notes-deployment.png'
    ],
    imageNames: [
      'Markdown 笔记应用.png',
      'Markdown 笔记部署记录.png'
    ]
  },
  {
    id: 'short-portfolio',
    name: '短期作品集',
    description: '用于集中展示近期前端练习与项目成果的个人作品集',
    introduction: '以翻页手账形式整理近期作品，展示项目介绍、技术标签与在线访问入口。',
    completionDate: '',
    url: 'https://precious-douhua-dfb190.netlify.app/',
    tags: ['PORTFOLIO', 'REACT', 'VITE'],
    cover: 'assets/projects/short-portfolio-cover.png',
    coverName: '短期个人作品集.png',
    images: [
      'assets/projects/short-portfolio-cover.png',
      'assets/projects/short-portfolio-repository.png',
      'assets/projects/short-portfolio-deployment.png'
    ],
    imageNames: [
      '短期个人作品集.png',
      '作品集 GitHub 仓库.png',
      '作品集部署记录.png'
    ]
  }
];

