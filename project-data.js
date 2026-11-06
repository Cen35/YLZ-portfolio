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
    toolkit: [
      'HTML5 多页面',
      'CSS3 手账视觉',
      '原生 JavaScript',
      'Supabase · PostgreSQL · RLS',
      '高德地图 JS API 2.0',
      'localStorage 本地降级',
      'Netlify',
      'Trae / AI 辅助编码'
    ],
    caseStudy: [
      {
        id: 'outcome',
        label: '项目成果',
        code: 'RESULT 01',
        title: '从美食手账到可真实使用的本地探索工具',
        summary: '项目已上线公开访问，收录 45 家梧州真实店铺。它不是只用于展示的静态页面，而是一套从发现美食、地图找店、查看详情到收藏、评论和规划路线的完整本地探索体验。',
        paragraphs: [
          '网站以“翻开的横线手账本”为核心视觉：左页展示每日轮换的真实店铺推荐，右页提供 10 类美食目录。点击目录会直接进入地图并聚焦对应分类，让视觉设计同时承担导航功能。',
          '数据层采用云端优先、本地降级的双层结构。Supabase 负责多用户共享、登录、收藏、投稿和评论；浏览器本地缓存负责网络异常时继续提供最近一次成功同步的数据。'
        ],
        points: [
          '手账式首页提供每日推荐与手动换一批，10 类目录可直接联动地图。',
          '地图支持关键词搜索、地图选点新增店铺，以及使用高德 POI 校正坐标。',
          '店铺详情包含封面大图、美食投稿、评论和收藏，真实内容可以持续补充。',
          '登录用户可以投稿店铺，管理员审核通过后才公开展示；同名店铺会被主动拦截。',
          '路线规划支持起点与最多 8 个途经点，可选择驾车、公交、步行或骑行。',
          '个人中心集中管理资料、收藏、投稿和评论；弱网时自动读取本地缓存。'
        ],
        note: '公开访问 · 45 家真实店铺 · 10 类美食 · 4 种导航方式'
      },
      {
        id: 'solution',
        label: '问题与方案',
        code: 'CASE 02',
        title: '解决移动端弱网下“45 家店铺消失”的问题',
        summary: '项目上线一段时间后，手机端偶尔只剩 6 张固定占位卡片，地图上也没有任何店铺标记。这个现象并不是样式崩溃，而是云端请求失败后错误地回退到一份空数据。',
        paragraphs: [
          '主要用户是通过手机 4G/5G 临时查找美食的本地居民和游客。对他们来说，页面虽然打开但没有店铺，实际体验等同于产品不可用，因此必须从数据链路而不是界面层面解决。',
          '排查 supadb.js 后发现，原有方案只有“请求失败就降级”，却从未把成功读取的云端数据写入本地。降级目标本身是空的，所以网络故障最终表现成了数据消失。'
        ],
        points: [
          '增加 8 秒请求超时，避免 DNS 或网络异常时页面长时间等待。',
          '连续失败后进入 20 秒熔断冷却期，避免每个操作都重复等待云端。',
          '任何一次云端读取成功后，都按 id 合并写入本地缓存。',
          '请求失败时读取最近一次成功数据，同时保留本地尚未同步的新增内容。',
          '改造店铺、美食和评论等 7 个读取接口，并升级资源版本号防止旧脚本缓存。',
          '最终在弱网和离线状态下仍可浏览首页、地图、店铺详情与评论。'
        ],
        note: '用户场景 · 本地居民与游客在移动网络中临时查找美食'
      },
      {
        id: 'evidence',
        label: '过程证据',
        code: 'PROCESS 03',
        title: '需求、设计与 AI 协作都留下可复查的依据',
        summary: '项目的起点只有一句“做一个梧州本地的美食地图网站，风格要森系治愈、像手账本”。后续需求不是一次给全，而是按照先能看、再能用、最后能给别人用的顺序逐步形成。',
        paragraphs: [
          '视觉上放弃常见的卡片网格，改为翻开的双页手账；色彩使用低饱和抹茶绿、奶油纸色和少量旧粉；图标统一成只描边、不填色的手写线稿，地图标记也改成食物旗子。',
          '与 AI 协作时，逐渐形成三种有效方法：先给明确约束再描述目标；用“现象、复现步骤、期望结果”说明问题；每次修改后都要求给出改动说明和可执行的验证方法。'
        ],
        points: [
          '需求演进：地图、目录、投稿审核、收藏、个人中心和路线导航逐步加入。',
          '审美纠偏：明确不要过于规整的字体、树叶插画和高饱和色，减少无效返工。',
          'Bug 描述：准确指出“选择公交但仍显示骑行”，定位到不同路径规划结果字段。',
          '安全事件：根据其他用户意外获得管理员权限的现象，追查旧版本地会话和错误降级配置。',
          '验证方式：结合聊天记录、问题截图、代码定位、手机真机、硬刷新与离线回归。'
        ],
        note: '验证方式 · 截图复现、代码定位、移动网络测试、刷新与离线回归',
        images: [
          { src: 'assets/case-study/wuzhou/image5.png', alt: 'Supabase 和高德地图配置检查记录', caption: '配置检查：确认 Supabase RLS、项目地址和高德地图域名白名单等上线前提。' },
          { src: 'assets/case-study/wuzhou/image6.png', alt: '梧州美食网站视觉需求对话记录', caption: '视觉需求：把抽象的“手账感”拆成装订线、贴纸、纸张与标题约束。' },
          { src: 'assets/case-study/wuzhou/image7.png', alt: '公交路线错误问题的对话与验证记录', caption: 'Bug 复现：明确“选择公交却仍显示骑行”的现象与操作路径。' },
          { src: 'assets/case-study/wuzhou/image8.png', alt: '管理员权限异常问题的对话记录', caption: '安全问题：根据用户反馈定位旧版本地会话造成的管理员越权。' }
        ]
      },
      {
        id: 'iterations',
        label: '迭代记录',
        code: 'VERSIONS 04',
        title: '从 V1.0 到 V2.3 的持续修正',
        summary: '项目共经历 8 个可辨识版本。每次更新都记录改了什么、为什么改、效果如何以及下一步是什么，版本号同时被用于静态资源缓存管理。',
        paragraphs: [
          '早期迭代重点是先建立能运行的地图、店铺列表和视觉方向；中期开始补充防重复、路线、收藏与个人主页；上线后则把重点转向权限、移动端、弱网和缓存。',
          '这套记录让我能够把一次次“改好一点”还原成具体决策，也能从版本中追查问题是在哪一阶段引入、又通过什么验证被关闭。'
        ],
        points: [
          'V1.0：用 HTML、CSS、JavaScript、Supabase 和高德地图搭出首版。',
          'V1.1：新增 localdb.js，让云端不可用时核心功能仍能继续运行。',
          'V1.2–V1.4：确立手账视觉，统一图标，并解决加载页 SVG 动画与定位冲突。',
          'V1.5：加入店铺名归一化去重、路线面板与四种出行方式。',
          'V1.6：加入收藏、个人主页、投稿编辑删除和评论管理。',
          'V2.1–V2.2：收紧管理员权限来源，修复旧会话并优化移动端封面与导航。',
          'V2.3：建立 7 个读取接口的成功写缓存、失败读缓存机制。'
        ],
        note: '当前版本 · V2.3'
      },
      {
        id: 'reflection',
        label: '学习复盘',
        code: 'REVIEW 05',
        title: '从“能运行”走向“能被别人稳定使用”',
        summary: '这次实践让我从只能描述“想要一个好看的网站”，成长为能够把想法拆成模块、约束和验收条件，并开始用工程视角管理数据、权限、缓存和版本。',
        paragraphs: [
          '能力变化最明显的地方，是遇到问题时不再只依靠反复试错，而是能追到具体机制：例如动画覆盖 transform、公交与骑行的返回字段不同、降级路径没有准备数据。',
          '项目也让我理解了“本机能运行”和“能放心给别人使用”的差距。部署、权限、弱网、缓存、版本号与回归测试并不是上线后的附加工作，而是产品可用性的一部分。'
        ],
        points: [
          '有效方法：先定约束再谈风格，用真机、4G、硬刷新和断网状态做验收。',
          '失败经验：只做降级不做缓存，会把网络故障放大成数据消失。',
          '失败经验：为了方便测试而保留的默认管理员逻辑，最终会成为权限后门。',
          '工程习惯：建立版本号、部署包、迭代日志与回归清单，减少回溯成本。',
          '后续计划：引入图片 IndexedDB 缓存与 PWA 离线壳，补充营业时间、价格和附近推荐。',
          '内容计划：继续整理 45 家店的招牌菜，让网站除了地图之外也具备可读内容。'
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


