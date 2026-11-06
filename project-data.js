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
    ],
    toolkit: ['HTML', 'CSS', 'JavaScript', 'Supabase Auth', 'PostgreSQL', 'Supabase Storage', 'RLS', 'Netlify', 'PWA', 'Codex'],
    caseStudy: [
      {
        id: 'outcome', label: '项目成果', code: 'RESULT 01', title: '把分散的实习申请整理成可持续跟进的档案',
        summary: 'InternTrack 面向正在寻找实习与校招机会的大学生，集中管理岗位投递、申请状态、面试安排、简历版本和后续行动。',
        paragraphs: ['用户注册登录后，可以记录公司、岗位、地点、薪资、链接、截止日期、投递日期与备注，并在“想投递、已投递、笔试、面试、Offer、拒绝”等状态间持续更新。', '首页汇总申请总数、面试数量、Offer 数量、回复率和近期跟进事项；面试轮次、简历 PDF、状态历史与下一步行动也能关联到具体申请。'],
        points: ['支持账号注册登录，并通过用户身份隔离个人求职数据。', '管理实习申请、面试安排、简历版本与状态历史。', '设置跟进日期和下一步行动，避免遗漏重要节点。', '支持 CSV 导出、响应式布局和电脑端 PWA 安装。'],
        note: '体验入口 · 注册登录后新增申请，并在概览页持续追踪进度'
      },
      {
        id: 'solution', label: '问题与方案', code: 'CASE 02', title: '解决多平台投递带来的信息分散与状态混乱',
        summary: '招聘网站、企业官网、邮箱和聊天软件中的申请信息彼此分散，普通备忘录又无法管理状态、文件和历史。',
        paragraphs: ['项目将账号、申请、面试、简历与跟进拆成清晰模块，让用户在同一页面查看当前进度和下一步任务。', '每条记录都保存用户 ID，并使用 Supabase RLS 从后端限制访问；响应式网页与 PWA 则让同一套系统同时适用于电脑和手机。'],
        points: ['Supabase 同时提供身份验证、数据库与文件存储，降低后端搭建成本。', 'RLS 保证每个账号只能读取和修改自己的数据。', '网页方案比原生应用更容易跨设备使用和免费部署。', '当前不自动抓取招聘平台数据，以降低接口、维护与合规风险。'],
        note: '目标用户 · 同时投递多个岗位、需要持续跟进的大学生'
      },
      {
        id: 'evidence', label: '制作过程', code: 'PROCESS 03', title: '从数据结构、安全策略到跨设备体验',
        summary: '制作先明确用户流程与数据关系，再逐步连接前端页面、Supabase 服务和公开部署。',
        paragraphs: ['页面流程从注册登录开始，依次进入申请概览、申请管理、面试安排、简历版本与个人资料。数据库则围绕用户、申请、面试、简历和状态历史建立关联。', '开发过程中持续用不同账号和不同设备验证数据隔离、表单操作、弹窗位置、文件上传与移动端显示，而不是只检查静态界面。'],
        points: ['整理需求并设计 PostgreSQL 表、主外键和用户 ID。', '连接 Supabase Authentication、数据库与 Storage。', '编写 RLS 策略，并用两个账号验证数据互不可见。', '加入统计、CSV 导出、跟进提醒、响应式布局与 PWA。', '迁移到 Netlify，移除 Google Fonts 与外部 CDN 依赖。'],
        note: '验证重点 · 功能可用、数据隔离、手机适配与公网访问'
      },
      {
        id: 'iterations', label: '迭代记录', code: 'VERSIONS 04', title: '从数据库骨架迭代到可公开使用的 PWA',
        summary: '五个阶段逐步补齐核心功能、行动提醒、跨设备适配和国内网络访问。',
        paragraphs: ['V0.1 建立用户、申请、面试和简历数据结构；V0.2 接入注册登录与增删改查；V0.3 增加跟进、状态历史、统计和 CSV 导出。', 'V0.4 完成手机适配、PWA 和公开部署；V0.5 迁移 Netlify、改用本地 Supabase 库并修复移动端弹窗。'],
        points: ['修正误填的 /rest/v1/ 地址，注册和数据库请求恢复正常。', '把误放在 Logs 页的 SQL 改到 SQL Editor 执行。', '针对国内访问问题迁移托管并减少外部资源依赖。', '将手机端弹窗改为屏幕居中，并限制内部滚动高度。'],
        note: '当前版本 · V0.5 Netlify 国内优化版'
      },
      {
        id: 'reflection', label: '学习复盘', code: 'REVIEW 05', title: '从页面制作走向真实需求、数据安全与部署',
        summary: '项目让我开始同时考虑用户流程、数据库结构、权限隔离、设备兼容和长期维护。',
        paragraphs: ['先明确问题再决定功能、把大型项目拆成可验证的小模块，是本次最有效的方法；截图、错误提示、控制台与单项测试也帮助我更快定位问题。', '目前仍缺少密码找回、自动提醒、批量导入、完整分析图表和原生鸿蒙版本，免费托管服务的网络与额度也需要持续观察。'],
        points: ['掌握前端页面与 Supabase 后端服务的连接方式。', '理解用户身份、RLS 与个人数据隔离的重要性。', '提高移动端适配、部署迁移和真实错误排查能力。', '后续计划增加提醒、筛选、图表、数据导入与更稳定的部署。'],
        note: '项目总结 · 让每一次投递都有记录、状态与明确的下一步'
      }
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
    ],
    toolkit: ['HTML', 'CSS', 'JavaScript', 'IndexedDB', 'MediaRecorder API', 'Media Session API', 'LocalStorage', 'Responsive Web', 'Netlify', 'Codex'],
    caseStudy: [
      {
        id: 'outcome', label: '项目成果', code: 'RESULT 01', title: '把英语精听、跟读和学习记录放进一个播放器',
        summary: '回声册是一款面向英语精听与跟读练习的 AB 复读器，材料、片段、录音、笔记和播放设置都能保存在当前设备。',
        paragraphs: ['用户可以导入 MP3、M4A、WAV 或 MP4，建立材料合集，并通过独立 A、B 标记设置循环区间；播放速度覆盖 0.1–3.0 倍，还支持 0.1 秒和 0.5 秒精细调整。', '应用支持保存片段、记录笔记、跟读录音和手机录音导入，并为每份材料恢复上次使用的倍速、区间与进度。'],
        points: ['IndexedDB 持久保存材料、学习记录、片段与录音。', '进度条可拖动，A/B 标记保持独立锁定并显示各自时间。', '支持跟读录音，也提供系统录音后导入的兼容方案。', '接入 Media Session，改善锁屏与后台媒体控制体验。'],
        note: '体验入口 · 导入一份英语音频，设置 A/B 区间后开始循环精听'
      },
      {
        id: 'solution', label: '问题与方案', code: 'CASE 02', title: '解决普通播放器无法沉淀精听过程的问题',
        summary: '普通播放器适合连续播放，却不方便反复精听、精确调整区间，也无法把材料、录音和笔记组织成长期档案。',
        paragraphs: ['项目用材料合集管理输入内容，以独立 A/B 标记、广范围变速和细粒度调整支持逐句练习，再用片段、笔记和录音记录学习结果。', '数据优先保存在设备本地，避免登录与服务器维护成本，也保护个人学习材料；相应代价是暂时不能跨设备同步。'],
        points: ['面向精听、影子跟读和移动端碎片学习场景。', '进度拖动不改变 A/B 区间，避免误触破坏已选片段。', '录音能力同时提供浏览器直录和外部录音导入两条路径。', '当前受浏览器权限、后台播放、本地空间和清理数据影响。'],
        note: '方案取舍 · 优先保证无需账号、可离线保存和低维护成本'
      },
      {
        id: 'evidence', label: '制作过程', code: 'PROCESS 03', title: '围绕真实手机测试逐步完善媒体能力',
        summary: '制作从最小 AB 播放器开始，持续依据手机录屏、参考截图和真机反馈补齐存储、录音与后台控制。',
        paragraphs: ['先完成导入、播放与 A/B 循环，再加入 IndexedDB、合集、速度、片段、笔记和录音；随后集中处理移动端操作尺寸、标记拖动、时间标签和锁屏播放。', '每次调整都回归测试材料切换、区间循环、倍速、录音权限、刷新恢复与不同浏览器表现，避免新增功能破坏原有学习流程。'],
        points: ['建立音频导入、播放、A/B 循环和材料管理。', '加入 0.1–3.0 倍速与 0.1/0.5 秒区间微调。', '加入片段、笔记、跟读录音和外部录音导入。', '缩小标记并允许拖动进度，同时锁定 A/B 位置。', '部署到 HTTPS 环境并接入 Media Session。'],
        note: '验证重点 · 区间准确、设置可恢复、录音可用与手机操作顺畅'
      },
      {
        id: 'iterations', label: '迭代记录', code: 'VERSIONS 04', title: '九次迭代把基础复读器变成学习资料库',
        summary: '版本从基础播放逐步扩展到持久存储、移动端、录音兼容和锁屏控制。',
        paragraphs: ['V1–V3 完成 AB 播放、IndexedDB 合集、移动适配和 Netlify 部署；V4–V6 扩展倍速、区间微调、录音导入与初始 A/B 设置。', 'V7–V9 优化标记尺寸和进度拖动，加入 Media Session，并锁定拖动时的 A/B 区间与时间标签位置。'],
        points: ['部分手机在 file:// 环境无法录音，改用 Netlify HTTPS。', '保留浏览器直录，同时增加系统录音后导入的备用路径。', '将初始 A 设为 0、B 设为音频末尾，降低首次使用门槛。', '后续计划增加导入导出、波形、字幕、学习统计与 PWA。'],
        note: '当前版本 · V9 区间锁定与时间标签优化版'
      },
      {
        id: 'reflection', label: '学习复盘', code: 'REVIEW 05', title: '理解媒体权限、设备差异与兼容方案',
        summary: '项目让我把需求拆成播放器状态、浏览器存储、录音权限、移动交互和后台媒体控制等具体问题。',
        paragraphs: ['真实手机测试和小步迭代比只在电脑浏览器检查更有效；遇到浏览器能力不一致时，为关键任务准备备用路径也比强求单一方案更可靠。', '当前设备本地保存无法跨设备同步，清除浏览器数据会丢失资料，录音格式与后台播放也会受系统限制。'],
        points: ['掌握 IndexedDB 中较大媒体数据和学习状态的组织方式。', '理解安全上下文、麦克风权限和 Media Session 的限制。', '提高响应式媒体控件与复杂状态同步的处理能力。', '下一步将探索备份恢复、波形字幕、学习统计和跨设备方案。'],
        note: '项目总结 · 让每一次重复播放都能留下可继续学习的记录'
      }
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
    ],
    toolkit: ['React', 'TypeScript', 'Vite', 'CSS', 'LocalStorage', 'Notification API', 'Web Audio API', 'GitHub Actions', 'GitHub Pages'],
    caseStudy: [
      {
        id: 'outcome',
        label: '项目成果',
        code: 'RESULT 01',
        title: '把专注、休息与反馈组合成完整节奏',
        summary: '专注一刻是一款面向学生和办公用户的番茄钟应用，提供专注与休息倒计时、自定义时长、提醒和专注统计。',
        paragraphs: [
          '用户可以开始、暂停、重置或跳过当前阶段。大型进度圆环持续展示时间变化，浏览器标题也会同步剩余时间，因此切换到其他标签页后仍能掌握进度。',
          '一次专注结束后，应用会播放提示音、发送浏览器通知并更新今日、本周和累计统计；时间设置与专注记录都会保存在本地。'
        ],
        points: [
          '默认提供 25 分钟专注与休息模式，并允许用户自定义时长。',
          '使用目标结束时间计算剩余秒数，减少浏览器后台运行造成的计时误差。',
          '提供提示音、系统通知和页面标题三种反馈，降低错过提醒的概率。',
          '记录今日、本周、累计次数和累计分钟，帮助用户看到长期成果。',
          '电脑和手机均可完成核心计时流程。'
        ],
        note: '体验入口 · 选择模式与时长，点击开始即可进入一个专注周期'
      },
      {
        id: 'solution',
        label: '问题与方案',
        code: 'CASE 02',
        title: '解决普通计时器缺少节奏与记录的问题',
        summary: '手机自带计时器只能完成一次倒计时，无法自然衔接专注和休息，也不能积累专注次数。',
        paragraphs: [
          '目标用户需要快速开始、在离开页面后仍收到结束提醒，并了解自己完成了多少次专注。应用因此将计时控制、阶段切换、通知和统计放在同一流程中。',
          '普通的“每秒减一”在标签页进入后台后容易产生误差，所以计时逻辑改为用目标结束时间减去当前时间，恢复页面时也能得到更准确的剩余秒数。'
        ],
        points: [
          '专注与休息采用明确的双模式，结束后可以顺畅进入下一阶段。',
          '声音和通知同时提醒，避免用户切换页面后错过结束时间。',
          '设置和记录写入 LocalStorage，刷新后仍能保留。',
          '浏览器通知需要用户授权，后台计时和自动播放仍会受不同浏览器限制。'
        ],
        note: '目标用户 · 学生、办公人员与需要阶段性专注的使用者'
      },
      {
        id: 'evidence',
        label: '制作过程',
        code: 'PROCESS 03',
        title: '从核心计时到通知、统计和自动部署',
        summary: '制作顺序先验证专注与休息的核心倒计时，再逐步加入控制、视觉反馈、浏览器能力和数据保存。',
        paragraphs: [
          '页面以大型圆形计时器为视觉中心，主要操作紧邻计时器；统计和时间设置作为辅助区域，避免干扰开始专注这一核心动作。',
          '开发时持续检查计时准确性、暂停恢复、模式切换、结束提醒和统计更新，而不是只确认界面是否显示。'
        ],
        points: [
          '建立专注与休息模式，实现开始、暂停、重置和跳过。',
          '使用 SVG 制作进度圆环，并加入自定义时长。',
          '接入 Notification API 与 Web Audio API，完成系统通知和提示音。',
          '保存统计与设置，同步更新浏览器标题。',
          '配置 GitHub Actions 构建 Vite 项目，并把 dist 发布到 GitHub Pages。'
        ],
        note: '验证标准 · 计时准确、暂停可恢复、提醒可触达、统计同步更新'
      },
      {
        id: 'iterations',
        label: '迭代记录',
        code: 'VERSIONS 04',
        title: '从基本倒计时到完整专注反馈',
        summary: '两个阶段的迭代先保证核心流程成立，再解决提醒、记录与部署问题。',
        paragraphs: [
          'V1.0 完成专注与休息倒计时、开始、暂停和重置，使用户能够完成一个基本番茄钟周期。',
          'V1.1 加入跳过、自定义时长、提示音、通知、页面标题同步和专注统计，使应用从计时器变成较完整的时间管理工具。'
        ],
        points: [
          '首次发布源文件到 GitHub Pages 后出现空白页，控制台提示无法加载 src/main.tsx。',
          '确认 Pages 不能直接运行开发源文件后，改为通过 Vite 生成生产构建。',
          '使用 GitHub Actions 自动安装依赖、构建并发布 dist，公网访问恢复正常。',
          '下一步计划增加任务关联、长休息、历史图表与连续专注记录。'
        ],
        note: '当前版本 · V1.1'
      },
      {
        id: 'reflection',
        label: '学习复盘',
        code: 'REVIEW 05',
        title: '理解时间误差、浏览器能力与生产构建',
        summary: '这个项目让我同时练习了定时器逻辑、声音与通知、统计数据以及自动化发布。',
        paragraphs: [
          '最有效的方法是用目标结束时间计算剩余时间，而不是依赖每秒减一；通过控制台和 GitHub Actions 日志排查部署问题，也提高了定位错误的效率。',
          '最大的不足是统计只保存在当前浏览器，也没有任务名称和长期趋势图。后续会补充长休息规则、每日趋势、连续专注天数、背景音乐和数据导出。'
        ],
        points: [
          '掌握了准确计时、暂停恢复和阶段切换的状态处理。',
          '理解了通知授权、声音自动播放等浏览器限制。',
          '理解了开发源文件与 Vite 生产构建文件之间的区别。',
          '形成了先验证核心流程、再逐步增加反馈与统计的开发方法。'
        ],
        note: '项目总结 · 用可见反馈帮助用户建立专注与休息的稳定节奏'
      }
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
    ],
    toolkit: ['React', 'TypeScript', 'Vite', 'CSS', 'Fetch API', 'Open-Meteo API', 'Geolocation API', 'LocalStorage', 'GitHub Actions', 'GitHub Pages'],
    caseStudy: [
      {
        id: 'outcome', label: '项目成果', code: 'RESULT 01', title: '把天气查询压缩成清晰的一页体验',
        summary: '晴屿天气支持城市搜索、当前位置、实时天气、六日预报和常用城市收藏，只保留出行前真正需要的信息。',
        paragraphs: [
          '首次进入时默认展示北京天气，避免空白页面。用户可以输入城市或授权当前位置，查询成功后看到温度、天气状况、体感温度、湿度、风速和未来六日趋势。',
          '常用城市可以收藏并快速切换；查询过程中有加载提示，城市不存在、网络失败或定位失败时都会给出可继续操作的说明。'
        ],
        points: ['城市搜索与默认城市天气。', '当前位置查询与授权失败反馈。', '当前天气、详细指标与六日预报。', '收藏、切换和删除常用城市，并在本地保存。', '完整的加载、网络与空结果状态。'],
        note: '体验入口 · 搜索城市或使用当前位置，随后查看天气并收藏常用地点'
      },
      {
        id: 'solution', label: '问题与方案', code: 'CASE 02', title: '无需密钥也能安全部署的天气服务',
        summary: '部分天气网站信息复杂、广告较多，课程建议的接口又需要在前端配置 API Key，静态部署时存在泄露风险。',
        paragraphs: [
          '项目面向需要快速确认出行天气的学生和普通用户，因此把查询入口、当前天气、六日预报和收藏集中在一页，并按信息重要程度排列。',
          '比较不同服务后选择无需 API Key 的 Open-Meteo：先把城市名称转换为经纬度，再使用经纬度请求当前天气和预报，避免把秘密写进前端代码。'
        ],
        points: ['只展示温度、体感、湿度、风速和天气状况等关键信息。', '查询、加载与错误状态分开管理，失败后页面仍可继续操作。', '定位被拒绝时保留手动搜索路径。', '同名城市目前优先使用首个匹配结果，未来需要增加地区选择。'],
        note: '目标用户 · 查询出行天气并保存常用城市的学生与普通用户'
      },
      {
        id: 'evidence', label: '制作过程', code: 'PROCESS 03', title: '从地理编码到天气数据与权限反馈',
        summary: '制作先验证 API 返回数据，再根据真实字段设计 TypeScript 类型和页面状态。',
        paragraphs: [
          '页面顺序为品牌与数据来源、搜索和定位、收藏城市、加载或错误提示、当前天气卡片、六日预报，让用户先完成查询，再阅读结果。',
          '判断标准包括不同城市能否查询、字段是否正确、定位失败是否有提示、收藏能否保留，以及网络异常后页面是否仍然可操作。'
        ],
        points: ['研究地理编码与天气接口，定义地点和天气类型。', '把城市名称转换为经纬度，再获取当前天气和六日预报。', '将天气代码转换成中文描述和图标。', '加入定位、收藏、LocalStorage、加载与错误状态。', '完成响应式样式并通过 GitHub Actions 发布。'],
        note: '验证标准 · 查询准确、权限可解释、异常可恢复、收藏可保留'
      },
      {
        id: 'iterations', label: '迭代记录', code: 'VERSIONS 04', title: '从单次查询到完整天气使用流程',
        summary: 'V1.0 先建立接口链路，V1.1 再补齐预报、定位、收藏与异常反馈。',
        paragraphs: ['V1.0 完成城市搜索、当前天气、温度、湿度和风速，验证地理编码与天气接口能够正确连接。', 'V1.1 加入六日预报、自动定位、收藏城市、加载状态和错误提示，使应用具备连续使用的完整流程。'],
        points: ['从需要 API Key 的服务切换到 Open-Meteo，简化部署并降低密钥风险。', '增加默认城市，避免首次访问时内容为空。', '增加网络、城市名称和定位权限的异常处理。', '下一步计划加入空气质量、小时预报、天气预警与多城市比较。'],
        note: '当前版本 · V1.1'
      },
      {
        id: 'reflection', label: '学习复盘', code: 'REVIEW 05', title: '学会读取 API 文档并设计异步反馈',
        summary: '项目让我理解了接口数据、异步请求、定位权限和用户反馈之间的完整关系。',
        paragraphs: ['先在浏览器中检查接口返回，再据此设计 TypeScript 类型，明显减少了字段理解错误；把查询、加载和错误状态分开后，页面逻辑也更清楚。', '当前不足包括同名城市识别不够细、收藏无法跨设备同步、天气信息种类有限。未来会补充小时天气、空气质量、降水概率和天气预警。'],
        points: ['掌握 Fetch API 与第三方天气数据的组合调用。', '练习加载、错误、空结果和权限拒绝等完整状态。', '理解静态前端不能安全保存私密 API Key。', '形成先验证真实数据、再设计界面与类型的工作方法。'],
        note: '项目总结 · 用安全、清晰的方式完成城市天气与未来趋势查询'
      }
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
    ],
    toolkit: ['React', 'TypeScript', 'Vite', 'CSS', 'LocalStorage', 'Codex', 'GitHub', 'Vercel'],
    caseStudy: [
      {
        id: 'outcome', label: '项目成果', code: 'RESULT 01', title: '让任务从记录变成可判断的行动清单',
        summary: '轻舟待办支持任务分类、优先级、截止日期、多条件筛选和完成率统计，面向学生与个人事务管理场景。',
        paragraphs: ['用户在同一页面填写标题、描述、分类、优先级和截止日期，随后可以搜索、组合筛选、编辑、完成或删除任务。', '顶部统计区持续展示全部任务、待完成数量和完成率；逾期且未完成的任务会显示醒目状态，所有数据自动保存在当前浏览器。'],
        points: ['新增、编辑、完成和删除任务。', '按关键词、状态、分类和优先级组合筛选。', '显示全部任务、待完成数量与完成率。', '提供逾期状态、空状态和响应式布局。', '使用 LocalStorage 自动保存，刷新后不丢失。'],
        note: '体验入口 · 添加一项任务，再使用搜索与筛选管理清单'
      },
      {
        id: 'solution', label: '问题与方案', code: 'CASE 02', title: '解决任务增多后难以判断与查找的问题',
        summary: '普通待办只能添加和删除；当课程作业、复习计划与日常安排同时出现时，用户很难判断优先级、逾期情况和整体进度。',
        paragraphs: ['项目主要面向学生和个人事务管理用户，核心需求是快速记录、区分轻重缓急、查找任务并看到完成进度。', '因此在基础列表上增加分类、优先级、截止日期、搜索和统计。项目以个人练习和单设备使用为主，所以选择 LocalStorage，避免额外搭建服务器。'],
        points: ['任务信息结构化，减少只靠标题辨认任务的困难。', '统一过滤逻辑同时判断关键词、状态、分类和优先级。', '统计卡片把清单状态转化为可见进度。', '限制是数据不能跨设备同步，清除浏览器数据后可能丢失。'],
        note: '目标用户 · 管理课程、复习计划与个人安排的学生和普通用户'
      },
      {
        id: 'evidence', label: '制作过程', code: 'PROCESS 03', title: '先建立数据模型，再逐步验证管理流程',
        summary: '页面采用顶部统计、左侧任务表单和右侧任务列表，使创建与管理无需频繁跳转。',
        paragraphs: ['功能清单从新增、编辑、删除和完成开始，再扩展分类、优先级、截止日期、搜索、多条件筛选、统计、本地保存和移动端适配。', '判断标准不是界面是否出现，而是筛选结果是否准确、刷新后数据是否保留、电脑和手机是否都能完成核心操作。'],
        points: ['定义标题、描述、分类、优先级、截止日期、状态与创建时间。', '完成表单以及新增、编辑、完成、删除流程。', '接入 LocalStorage 自动保存。', '统一搜索和多条件过滤逻辑，实时计算统计。', '完成响应式样式、生产构建、GitHub 托管与 Vercel 部署。'],
        note: '验证标准 · 操作真实可用、筛选准确、刷新保留、移动端正常'
      },
      {
        id: 'iterations', label: '迭代记录', code: 'VERSIONS 04', title: '从最小任务清单到进阶管理工具',
        summary: '迭代遵循先完成最小可用版本，再按真实管理需求增加复杂度。',
        paragraphs: ['V1.0 完成任务新增、完成、删除和 LocalStorage 保存，验证最基本的任务管理流程。', 'V1.1 增加编辑、分类、优先级、截止日期、多条件筛选和完成率统计，让任务较多时仍能快速查找与判断。'],
        points: ['最初一次加入所有功能导致筛选逻辑混乱，随后拆分并逐项验证。', '统一过滤函数解决多个筛选条件组合时结果不准确的问题。', '任务数量与列表内容现在会随条件同步更新。', '下一步计划增加标签、子任务、提醒、导出和云端同步。'],
        note: '当前版本 · V1.1'
      },
      {
        id: 'reflection', label: '学习复盘', code: 'REVIEW 05', title: '理解状态、表单与数据持久化的关系',
        summary: '这个项目让我把任务数据结构、表单状态、组合筛选和统计计算串成了一套完整前端流程。',
        paragraphs: ['先完成最小版本、每加一个功能立即测试，是最有效的方法；它避免了同时修改多个逻辑后难以判断错误来源。', '当前不足是没有账号、云端同步、提醒和独立分类管理。后续希望加入子任务、到期通知、统计图表与数据导出。'],
        points: ['学会定义清晰的任务数据结构。', '掌握表单新增与编辑状态的复用。', '理解多个筛选条件必须作用于同一份数据。', '练习 LocalStorage 持久化与派生统计。'],
        note: '项目总结 · 用分类、筛选和统计让个人任务更容易执行'
      }
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
    ],
    toolkit: ['React', 'TypeScript', 'Vite', 'CSS', 'React Markdown', 'remark-gfm', 'rehype-highlight', 'highlight.js', 'LocalStorage', 'Vercel'],
    caseStudy: [
      {
        id: 'outcome', label: '项目成果', code: 'RESULT 01', title: '编辑、预览与管理集中在同一个工作区',
        summary: '墨记支持多篇笔记管理、Markdown 实时预览、GFM 语法、代码高亮、快捷键和自动保存。',
        paragraphs: ['桌面端以侧边栏、编辑器和预览区组成三栏工作区，输入 Markdown 后立即显示标题、列表、引用、表格和代码效果。', '用户可以新建、搜索、切换和删除笔记；Tab 可插入缩进，Ctrl/Cmd+B 可快速添加加粗格式。手机端改为编辑与预览切换，避免内容区域过窄。'],
        points: ['多篇笔记的新建、搜索、切换与删除。', 'Markdown 实时预览和 GitHub 风格表格、任务列表。', '多语言代码块语法高亮。', 'Tab 与加粗快捷键以及删除确认。', 'LocalStorage 自动保存和移动端模式。'],
        note: '体验入口 · 编辑欢迎笔记或新建内容，右侧立即查看排版结果'
      },
      {
        id: 'solution', label: '问题与方案', code: 'CASE 02', title: '减少 Markdown 编辑与检查之间的反复切换',
        summary: '普通文本编辑器无法直观显示 Markdown 最终效果，零散笔记也容易丢失或难以查找。',
        paragraphs: ['项目面向学生、程序学习者和习惯使用 Markdown 的用户，他们需要快速编辑、实时检查排版、管理多篇内容并自动保留。', '桌面端采用编辑与预览并排对照，移动端则用模式切换适应有限空间；侧边栏承担笔记管理和标题搜索。'],
        points: ['输入与渲染实时联动，减少保存后再检查的步骤。', '多笔记列表替代单篇编辑器，适合持续记录。', 'GFM 和代码高亮补齐学习笔记常见格式。', '当前限制包括无云同步、图片上传、导出和回收站。'],
        note: '目标用户 · 学生、程序学习者与 Markdown 记录者'
      },
      {
        id: 'evidence', label: '制作过程', code: 'PROCESS 03', title: '逐层接入 Markdown 解析、增强语法与快捷操作',
        summary: '先完成基础文本渲染，再依次加入笔记管理、GFM、代码高亮、快捷键和移动端适配。',
        paragraphs: ['基础解析能够显示标题和列表，但表格、任务列表及代码块不完整，因此进一步接入 remark-gfm、rehype-highlight 和 highlight.js。', '判断标准包括输入是否立即预览、代码是否高亮、刷新后内容是否保留、快捷键是否生效，以及手机是否容易编辑。'],
        points: ['定义笔记结构并创建侧边栏、编辑区和预览区。', '实现新建、切换、删除和标题搜索。', '接入 React Markdown、GFM 与代码高亮。', '加入 Tab、Ctrl/Cmd+B 和 LocalStorage 自动保存。', '适配移动端切换，构建后部署到 Vercel。'],
        note: '验证标准 · 实时渲染、语法完整、快捷键可用、刷新保留'
      },
      {
        id: 'iterations', label: '迭代记录', code: 'VERSIONS 04', title: '从单篇编辑器到完整笔记管理流程',
        summary: '两个版本分别验证渲染能力与长期记录体验。',
        paragraphs: ['V1.0 完成单篇 Markdown 编辑和实时预览，确认输入内容能够正确转换为页面。', 'V1.1 增加新建、删除、搜索、自动保存、代码高亮、快捷键和移动端切换，使应用能够管理多篇长期笔记。'],
        points: ['基础 Markdown 渲染不足以覆盖表格、任务列表与代码块。', '增加专用插件并配置高亮样式后，常用语法能够完整显示。', '欢迎笔记同时承担功能示例与首次使用引导。', '下一步计划加入文件导入导出、图片上传、主题切换和云同步。'],
        note: '当前版本 · V1.1'
      },
      {
        id: 'reflection', label: '学习复盘', code: 'REVIEW 05', title: '学会集成第三方解析工具并管理实时状态',
        summary: '项目让我理解文本输入、React 状态更新和即时渲染之间的关系，也练习了工具集成与快捷键处理。',
        paragraphs: ['先实现基础文本渲染，再逐项加入 GFM、代码高亮和快捷键，能够把复杂问题拆成易验证的小步骤。', '当前仍缺少云端同步、图片上传、文件导出和误删恢复。后续希望增加深色主题、自动目录、PDF 导出与回收站。'],
        points: ['掌握 React Markdown 及相关插件的组合使用。', '理解编辑器、预览区与当前笔记之间的状态同步。', '练习键盘事件处理和响应式布局。', '形成先验证基础能力、再增加增强功能的迭代方式。'],
        note: '项目总结 · 让 Markdown 写作、预览与管理保持在一个连续流程中'
      }
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
    ],
    toolkit: ['React', 'TypeScript', 'Vite', 'CSS', 'SVG', 'IntersectionObserver', 'LocalStorage', 'GitHub Actions', 'GitHub Pages', 'Netlify', 'Codex'],
    caseStudy: [
      {
        id: 'outcome', label: '项目成果', code: 'RESULT 01', title: '把近期项目整理成一段有章节感的浏览旅程',
        summary: 'Cen’s Field Notes 是一个以草地、纸张拼贴和手账翻页为视觉语言的个人作品集，集中展示个人介绍、技能、项目、过程与联系方式。',
        paragraphs: ['页面从开场纸张动画进入草地与山丘主视觉，随后依次浏览 About、近期作品、创作过程和联系入口。项目区采用手账翻页结构，展示介绍、技术标签、截图和在线链接。', '滚动进入、拼贴微动效、动态小牛和章节导航共同维持连续体验，同时支持响应式布局与减少动态效果偏好。'],
        points: ['集中展示个人简介、能力、4 个项目与开发过程。', '以手账翻页替代普通卡片网格，建立鲜明的个人视觉语言。', '提供项目详情、在线入口、GitHub 与章节导航。', '同时发布到 GitHub Pages 和 Netlify，并适配手机。'],
        note: '体验入口 · 从开场页向下滚动，按章节浏览个人资料与近期作品'
      },
      {
        id: 'solution', label: '问题与方案', code: 'CASE 02', title: '解决项目链接分散且普通网格缺少记忆点的问题',
        summary: '个人介绍、练习项目和部署链接原本分散在不同位置，普通白底项目网格虽然清楚，却难以传达创作者的个性。',
        paragraphs: ['网站用一条连续长页面整合简介、技能、作品、过程和联系信息，并以草地、纸张拼贴、笔记本翻页形成统一叙事。', '方案避免复杂 3D，在 CSS、SVG 和轻量浏览器能力范围内实现动效，以兼顾加载速度、移动端表现与后续维护。'],
        points: ['面向教师、评审、同学和潜在合作对象。', '信息结构先保证易读，再用拼贴和手账元素建立识别度。', '项目数据集中维护，新增作品时不必重写整页结构。', '受静态站点限制，内容仍需手动更新，字体也必须考虑网页授权。'],
        note: '设计方向 · 自然、轻松、像一本可以浏览的个人田野笔记'
      },
      {
        id: 'evidence', label: '制作过程', code: 'PROCESS 03', title: '先搭信息章节，再逐步统一视觉和动效',
        summary: '制作按“结构—内容—视觉—交互—部署”的顺序推进，避免一开始只堆叠装饰效果。',
        paragraphs: ['页面被拆成主视觉、个人介绍、近期作品、制作过程和联系五个章节；项目区使用左侧内容、右侧截图和底部分页的手账结构。', '在 React、TypeScript 与 Vite 基础上集中维护项目数据，再加入配色、纸张纹理、拼贴插画、滚动进入、翻页、悬停、章节导航和 SVG/CSS 动态小牛。'],
        points: ['建立五章信息架构和连续滚动路线。', '完成项目数据、截图、标签和链接的统一渲染。', '补齐各章节拼贴元素，避免只有首屏有视觉主题。', '加入 IntersectionObserver 动画、响应式与 reduced motion。', '配置 GitHub Actions，并完成 GitHub Pages 与 Netlify 部署。'],
        note: '制作原则 · 先让信息完整可读，再逐层增加视觉与互动'
      },
      {
        id: 'iterations', label: '迭代记录', code: 'VERSIONS 04', title: '从基础信息页迭代为完整的手账式作品集',
        summary: '五个版本持续加强视觉一致性、项目浏览体验、动效与部署稳定性。',
        paragraphs: ['V1.0 完成简介、技能和项目信息；V1.1 建立草地、山丘与纸张手账方向；V1.2 为其他章节补充拼贴并加入翻页。', 'V1.3 完成开场、滚动、呼吸、翻页、悬停、萤火虫和动态小牛；V1.4 优化手机、减少动态效果并完成双平台部署。'],
        points: ['GitHub Pages 初次出现 404，原因是没有可用生产构建。', '补齐根目录配置与 Actions 工作流，并调整 Pages 发布设置。', '早期只有首屏具有拼贴风格，后续统一其他章节的视觉语言。', '下一步计划补充更完整案例、深色模式、分析与联系表单。'],
        note: '当前版本 · V1.4 响应式与双平台部署版'
      },
      {
        id: 'reflection', label: '学习复盘', code: 'REVIEW 05', title: '把视觉表达、信息结构和真实发布连接起来',
        summary: '项目让我系统练习作品集的信息架构、视觉风格、交互动效、响应式适配与持续部署。',
        paragraphs: ['先确定章节和内容，再逐步增加视觉细节，是最有效的制作顺序；集中维护项目数据、结合浏览器检查与构建日志，也让修改和排错更稳定。', '目前仍有字体授权、静态内容更新、联系方式和自动化数据等限制，移动端性能也需要继续观察。'],
        points: ['理解个人作品集不仅要“好看”，还要快速说明能力和项目价值。', '掌握 React 数据组织、滚动动画、SVG/CSS 插画与响应式处理。', '提高 GitHub Actions、Pages 和 Netlify 的部署排查能力。', '后续将继续完善案例、联系入口、数据分析和授权明确的网页字体。'],
        note: '项目总结 · 用统一的视觉叙事让作品、过程与个人能力同时被看见'
      }
    ]
  }
];


