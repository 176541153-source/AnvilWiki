/**
 * Landing page configuration — text content for the project landing pages
 * at /landing (English) and /zh/landing (中文). They introduce the AnvilWiki
 * template itself, NOT the demo game.
 *
 * This is separate from site.ts (which holds the DEMO GAME config).
 * The landing page represents the PROJECT, so its copy lives here.
 *
 * 👉 This file is NOT part of the "apply template" config layer — fork users
 *    don't need to touch it. It describes the AnvilWiki open-source project.
 */

/** Keep in sync with package.json "version" (used by the announcement bar). */
export const PROJECT_VERSION = '1.11.2';

export type LandingLocale = 'en' | 'zh';

interface ManualCopy {
  label: string;
  description: string;
}

export interface LandingContent {
  htmlLang: string;
  title: string;
  description: string;
  announcement: { text: string; href: string } | null;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    tertiaryCta: { label: string; href: string };
    installCommand: string;
    screenshotCaption: string;
  };
  socialProof: {
    lighthouse: { label: string; score: number }[];
    poweredBy: string;
  };
  features: { icon: string; title: string; description: string }[];
  compare: {
    title: string;
    subtitle: string;
    columns: string[];
    rows: { label: string; values: string[] }[];
  };
  showcase: {
    title: string;
    subtitle: string;
    points: string[];
    cta: { label: string; href: string };
    browserUrl: string;
    mobileCaption: string;
  };
  docsEntry: {
    title: string;
    cards: { icon: string; title: string; description: string; href: string }[];
    readLabel: string;
  };
  devGuide: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string; command: string; linkLabel: string; href: string }[];
    allDocs: { label: string; href: string };
  };
  handbook: {
    hubTitle: string;
    hubSubtitle: string;
    manuals: { learn: ManualCopy; dev: ManualCopy };
    chapterLabel: string;
    /** Empty for en ("Chapter 3"); "章" for zh ("第 3 章"). */
    chapterSuffix: string;
    backToHub: string;
    prevLabel: string;
    nextLabel: string;
    editLabel: string;
    updatedLabel: string;
    readLabel: string;
    tldrLabel: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  community: {
    badge: string;
    title: string;
    subtitle: string;
    qrAlt: string;
    qrCaption: string;
    qrNote: string;
  };
  footer: { tagline: string; license: string; madeWith: string; author: string };
}

const RELEASES = 'https://github.com/PNGTRID/AnvilWiki/releases';

const en: LandingContent = {
  htmlLang: 'en',
  title: 'AnvilWiki — Open-Source Game Wiki Template for Cloudflare',
  description:
    'An open-source game wiki template with an AI-native content workflow: pick the right game, generate pages by talking to your AI tool, codes pages stay fresh on autopilot. Lighthouse 4×100, free on Cloudflare, 100% ad revenue yours.',
  announcement: {
    text: `v${PROJECT_VERSION} shipped — the landing header now links straight to the Learning and Development manuals, anchored to each manual's section in the docs center.`,
    href: RELEASES,
  },
  hero: {
    badge: 'Open Source · MIT · Cloudflare Pages',
    title: 'Turn a trending game into a traffic site — in 24 hours, not weeks',
    subtitle:
      'AnvilWiki pairs an SEO-hardened game wiki template (Astro + Cloudflare Pages, Lighthouse 4×100, free unlimited bandwidth) with an AI-native content workflow that ships inside your repo: pick the right game, generate pages by just talking to your AI tool, codes pages stay fresh on autopilot. Every ad dollar is yours.',
    primaryCta: { label: 'Get Started', href: '#docs' },
    secondaryCta: { label: 'Star on GitHub', href: 'https://github.com/PNGTRID/AnvilWiki' },
    tertiaryCta: { label: 'Live Demo', href: '/' },
    installCommand: `git clone https://github.com/PNGTRID/AnvilWiki.git
cd anvilwiki
pnpm install && pnpm dev`,
    screenshotCaption: 'The live demo — a complete wiki for the fictional game "Anvil Quest"',
  },
  socialProof: {
    lighthouse: [
      { label: 'Performance', score: 100 },
      { label: 'Accessibility', score: 100 },
      { label: 'Best Practices', score: 100 },
      { label: 'SEO', score: 100 },
    ],
    poweredBy: 'Powered by Astro + Cloudflare Pages — free unlimited bandwidth',
  },
  features: [
    {
      icon: 'lucide:bot',
      title: 'AI-Native Content Workflow',
      description:
        'Agent skills ship inside the repo (.agent/skills/, Agent Skills open standard). Tell ZCode / Claude Code / Codex "write a boss guide from these notes" — you get a build-passing MDX page, auto-verified by schema + lint. No scripts to learn.',
    },
    {
      icon: 'lucide:crosshair',
      title: 'Game Selection Playbook',
      description:
        'The fork-user funnel most templates ignore: a 4-layer game-selection scoring model (demand validation via Trends + SERP gap check) plus a "first-day 10 pages" plan — because the 2-8 week window after a game blows up is where all the traffic lives.',
    },
    {
      icon: 'lucide:ticket',
      title: 'Codes Pages on Autopilot',
      description:
        'Structured codes frontmatter (status/expiry/source) auto-renders Active one-click-copy blocks + an Expired table that keeps long-tail "is X still working" traffic. A weekly audit workflow files an issue whenever pages go stale — freshness without you remembering.',
    },
    {
      icon: 'lucide:dollar-sign',
      title: '100% Your Revenue',
      description:
        'Built-in AdSense slots, sponsor card and affiliate CTA component — all env-gated, off by default. No platform cut, unlike hosted wiki farms that eat your earnings.',
    },
    {
      icon: 'lucide:zap',
      title: 'SEO Engineering + Blazing Fast',
      description:
        'Sitemap with lastmod, JSON-LD suite, hreflang, Quick Answer blocks for AI search, llms.txt — on top of Astro zero-JS and Lighthouse 4×100 out of the box.',
    },
    {
      icon: 'lucide:cloud',
      title: 'Free Forever',
      description:
        'Deploy to Cloudflare Pages with zero config: free unlimited bandwidth + global CDN + SSL. i18n built in (English at root, fallback so URLs never 404). No hosting bills, ever.',
    },
  ],
  compare: {
    title: 'Why AnvilWiki?',
    subtitle: 'How it compares to other options for game content sites.',
    columns: ['AnvilWiki', 'Fandom', 'Starlight', 'Next.js DIY'],
    rows: [
      {
        label: 'Best for',
        values: ['Game SEO content sites', 'Community wikis', 'Product docs', 'Custom apps'],
      },
      {
        label: 'AI content pipeline',
        values: ['Skills ship in repo', 'None', 'None', 'Build yourself'],
      },
      {
        label: 'Game selection guide',
        values: ['Funnel + first-day plan', 'None', 'None', 'None'],
      },
      {
        label: 'Ad revenue',
        values: ['100% yours', 'Platform-split', 'None', 'DIY'],
      },
      {
        label: 'Hosting cost',
        values: ['Free, unlimited BW', 'Free (hosted)', 'Pay your own', 'Pay your own'],
      },
      {
        label: 'SEO built-in',
        values: ['Full suite', 'Platform-controlled', 'Docs-focused', 'Build yourself'],
      },
      {
        label: 'Performance',
        values: ['Lighthouse 4×100', 'Medium', 'High', 'Varies'],
      },
      {
        label: 'You own it',
        values: ['Yes (MIT)', 'No', 'Yes', 'Yes'],
      },
    ],
  },
  showcase: {
    title: 'See it in action',
    subtitle:
      'A live demo built with AnvilWiki — a complete game wiki for the fictional "Anvil Quest".',
    points: [
      'Real game wiki layout (Hero → QuickStart → content modules → CTA)',
      'Measured Lighthouse Performance 100 on a full content site',
      'Real i18n: English at root + Japanese prefixed, with fallback',
      'Working ad slots, search, comments — all env-gated, off by default',
    ],
    cta: { label: 'View live demo →', href: '/' },
    browserUrl: 'anvilwiki.pages.dev/bosses/emberfang',
    mobileCaption: 'Mobile-first: clean first screen, scrollable tables, tap-to-copy codes.',
  },
  docsEntry: {
    title: 'Get started in minutes',
    cards: [
      {
        icon: 'lucide:crosshair',
        title: 'Pick Your Game',
        description:
          'Which game is worth a wiki? A 4-layer selection funnel plus the first-day 10-pages plan.',
        href: '/landing/docs/pick-your-game',
      },
      {
        icon: 'lucide:rocket',
        title: 'Quick Start',
        description: 'Fork, configure, and deploy to Cloudflare Pages in 5 minutes.',
        href: '/landing/docs/launch-your-site',
      },
      {
        icon: 'lucide:palette',
        title: 'Apply Template',
        description: 'Swap the demo game for yours — config, theme, content, locales.',
        href: '/landing/docs/customize',
      },
      {
        icon: 'lucide:search',
        title: 'SEO Guide',
        description: 'How AnvilWiki handles sitemaps, JSON-LD, hreflang, and more.',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/seo.md',
      },
    ],
    readLabel: 'Read',
  },
  devGuide: {
    title: 'How to use it — 5 steps',
    subtitle:
      'From fork to a live site in about 30 minutes. Every step ships with a full doc behind it.',
    steps: [
      {
        title: 'Fork & run locally',
        description:
          'Clone your fork and start the dev server — the demo wiki (fictional game "Anvil Quest") works out of the box.',
        command: 'pnpm install && pnpm dev',
        linkLabel: 'README',
        href: 'https://github.com/PNGTRID/AnvilWiki#readme',
      },
      {
        title: 'Make it yours',
        description:
          'One interactive CLI swaps game identity, theme color, locales and nav — and resets demo values (incl. wrangler.toml).',
        command: 'pnpm apply-template',
        linkLabel: 'apply-template.md',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md',
      },
      {
        title: 'Write pages by chatting',
        description:
          'Open the repo in ZCode / Claude Code / Codex and just talk — agent skills ship inside the repo and the Zod schema gates every page.',
        command: '"write a boss guide from these notes"',
        linkLabel: 'content-format.md',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/content-format.md',
      },
      {
        title: 'Deploy for free',
        description:
          'Push to GitHub and connect Cloudflare Pages — the Astro build is auto-detected; free unlimited bandwidth + global CDN.',
        command: 'pnpm build && git push',
        linkLabel: 'deployment.md',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/deployment.md',
      },
      {
        title: 'Stay fresh',
        description:
          'A weekly audit workflow flags stale pages, codes skills keep redemption pages current, and upstream updates sync cleanly.',
        command: 'pnpm refresh-audit',
        linkLabel: 'staying-up-to-date.md',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/staying-up-to-date.md',
      },
    ],
    allDocs: {
      label: 'Open the docs center — two hands-on manuals with copy-paste AI prompts',
      href: '/landing/docs',
    },
  },
  handbook: {
    hubTitle: 'AnvilWiki Docs',
    hubSubtitle:
      'Two hands-on manuals, written as step-by-step SOPs with copy-paste AI prompts. The Learning Manual takes you from game selection to a live, indexed, monetized wiki; the Development Manual covers architecture, customization, integrations, and upstream sync.',
    manuals: {
      learn: {
        label: 'Learning Manual',
        description:
          'From zero to an earning game wiki: pick the right game, set up in 30 minutes, write 10 pages with AI on day one, deploy free, then run a 30-minute weekly ops loop.',
      },
      dev: {
        label: 'Development Manual',
        description:
          'For deep customizers and contributors: the three-layer architecture and change map, customization SOPs, env-gated integrations, CI, and how to sync upstream or contribute back.',
      },
    },
    chapterLabel: 'Chapter',
    chapterSuffix: '',
    backToHub: 'All docs',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    editLabel: 'Edit on GitHub',
    updatedLabel: 'Updated',
    readLabel: 'Read chapter',
    tldrLabel: 'TL;DR',
  },
  finalCta: {
    title: 'Ready to launch your game wiki?',
    subtitle: 'Fork, configure, deploy — all in 30 minutes, completely free.',
    primaryCta: { label: 'Get Started', href: '#docs' },
    secondaryCta: { label: 'Read the Docs', href: 'https://github.com/PNGTRID/AnvilWiki#readme' },
  },
  community: {
    badge: 'Community',
    title: 'Join the discussion',
    subtitle:
      'Questions about deploying your own wiki, feature ideas, or just want to chat about game content sites? Scan the QR code to add the maintainer on WeChat and join the group.',
    qrAlt: 'WeChat QR code — scan to add the maintainer and join the discussion group',
    qrCaption: 'Scan with WeChat',
    qrNote: 'WeChat group · 中文/English both welcome',
  },
  footer: {
    tagline: 'Open-source game wiki site template. Free, fast, beginner-friendly.',
    license: 'MIT License',
    madeWith: 'Built with Astro · Deployed on Cloudflare Pages',
    author: 'Open-sourced by 袁锐钦 (Yuan Ruiqin), lead of the PNGTRIBE team',
  },
};

const zh: LandingContent = {
  htmlLang: 'zh',
  title: 'AnvilWiki — 开源游戏 Wiki 模板 + AI 内容工作流',
  description:
    '开源游戏 wiki 模板 + AI 原生内容工作流:选对游戏、和 AI 对话就能产页、codes 页自动保鲜。Lighthouse 4×100、Cloudflare 免费部署、广告收入 100% 归你。',
  announcement: {
    text: `v${PROJECT_VERSION} 发布 —— landing 导航栏新增「学习手册 / 开发手册」入口,直达文档中心对应手册区块。`,
    href: RELEASES,
  },
  hero: {
    badge: '开源 · MIT 协议 · Cloudflare Pages',
    title: '把一个爆发期游戏,24 小时变成你的流量站',
    subtitle:
      'AnvilWiki = SEO 强化到极致的游戏 wiki 模板(Astro + Cloudflare Pages,Lighthouse 4×100,免费无限带宽)+ 随仓库分发的 AI 内容工作流:选对游戏、跟 AI 对话就能产页、codes 页自动保鲜——每一分广告收入都归你。',
    primaryCta: { label: '快速开始', href: '#docs' },
    secondaryCta: { label: 'GitHub 加星', href: 'https://github.com/PNGTRID/AnvilWiki' },
    tertiaryCta: { label: '查看 Demo', href: '/' },
    installCommand: `git clone https://github.com/PNGTRID/AnvilWiki.git
cd anvilwiki
pnpm install && pnpm dev`,
    screenshotCaption: '在线 Demo —— 虚构游戏「Anvil Quest」的完整 wiki',
  },
  socialProof: {
    lighthouse: [
      { label: '性能', score: 100 },
      { label: '无障碍', score: 100 },
      { label: '最佳实践', score: 100 },
      { label: 'SEO', score: 100 },
    ],
    poweredBy: '基于 Astro + Cloudflare Pages —— 免费无限带宽',
  },
  features: [
    {
      icon: 'lucide:bot',
      title: 'AI 原生内容工作流',
      description:
        'Agent 技能随仓库分发(.agent/skills/,Agent Skills 开放标准)。对 ZCode / Claude Code / Codex 说「根据这些笔记写一篇 Boss 攻略」,直接产出通过构建校验的 MDX 页面——schema + lint 自动质检,不用学任何脚本。',
    },
    {
      icon: 'lucide:crosshair',
      title: '选品方法论',
      description:
        '多数模板忽略的第一步:四层选品漏斗(Trends 需求验证 + SERP 空位检查)+ 首日 10 页计划——新游爆发的 2-8 周黄金窗口,流量全在这里。',
    },
    {
      icon: 'lucide:ticket',
      title: 'codes 页自动化',
      description:
        '结构化 codes 数据(状态/到期/来源)自动渲染 Active 一键复制区 + Expired 长尾表格(承接「XX 还能用吗」搜索);每周定时审计自动开 issue 提醒保鲜——不用你记得去更新。',
    },
    {
      icon: 'lucide:dollar-sign',
      title: '广告收入 100% 归你',
      description:
        '内置 AdSense 广告位、赞助卡片、联盟链接组件——全部 env 门控默认关闭。无平台抽成,和托管 wiki 农场完全不同。',
    },
    {
      icon: 'lucide:zap',
      title: 'SEO 工程化 + 极致性能',
      description:
        'sitemap(含 lastmod)、JSON-LD 全套、hreflang、面向 AI 搜索的 Quick Answer、llms.txt——建立在 Astro 零 JS 和开箱 Lighthouse 4×100 之上。',
    },
    {
      icon: 'lucide:cloud',
      title: '永久免费',
      description:
        '零配置部署到 Cloudflare Pages:免费无限带宽 + 全球 CDN + SSL;多语言开箱即用(英文根路径,回退机制保证直链永不 404)。永远没有服务器账单。',
    },
  ],
  compare: {
    title: '为什么选择 AnvilWiki?',
    subtitle: '与其他游戏内容站方案的对比。',
    columns: ['AnvilWiki', 'Fandom', 'Starlight', 'Next.js 自建'],
    rows: [
      {
        label: '适用场景',
        values: ['游戏 SEO 内容站', '社区协作 wiki', '产品文档', '定制应用'],
      },
      {
        label: 'AI 内容管道',
        values: ['技能随仓库分发', '无', '无', '自建'],
      },
      {
        label: '选品指导',
        values: ['漏斗 + 首日计划', '无', '无', '无'],
      },
      {
        label: '广告收入',
        values: ['100% 归你', '平台分成', '无广告', '自己接'],
      },
      {
        label: '托管成本',
        values: ['免费无限带宽', '免费(平台托管)', '自付', '自付'],
      },
      {
        label: 'SEO 内置',
        values: ['全套', '平台控制', '文档向', '自建'],
      },
      {
        label: '性能',
        values: ['Lighthouse 4×100', '中等', '高', '取决于实现'],
      },
      {
        label: '完全拥有',
        values: ['是(MIT)', '否', '是', '是'],
      },
    ],
  },
  showcase: {
    title: '看看实际效果',
    subtitle: '用 AnvilWiki 构建的在线 Demo——虚构游戏「Anvil Quest」的完整 wiki 站。',
    points: [
      '真实的游戏 wiki 布局(Hero → 快速入口 → 内容模块 → CTA)',
      '完整内容站实测 Lighthouse 性能 100',
      '真实多语言:英文根路径 + 日文带前缀 + 自动回退',
      '广告位 / 搜索 / 评论全部可用(env 驱动,默认关闭)',
    ],
    cta: { label: '查看在线 Demo →', href: '/' },
    browserUrl: 'anvilwiki.pages.dev/bosses/emberfang',
    mobileCaption: '移动优先:首屏干净、表格横滑、兑换码点击即复制。',
  },
  docsEntry: {
    title: '几分钟即可上手',
    cards: [
      {
        icon: 'lucide:crosshair',
        title: '选对游戏',
        description: '哪个游戏值得建 wiki?四层选品漏斗 + 首日 10 页计划。',
        href: '/zh/landing/docs/pick-your-game',
      },
      {
        icon: 'lucide:rocket',
        title: '快速开始',
        description: 'Fork、配置、5 分钟内部署到 Cloudflare Pages。',
        href: '/zh/landing/docs/launch-your-site',
      },
      {
        icon: 'lucide:palette',
        title: '套用模板',
        description: '把 demo 游戏换成你的——配置、主题、内容、多语言。',
        href: '/zh/landing/docs/customize',
      },
      {
        icon: 'lucide:search',
        title: 'SEO 指南',
        description: 'AnvilWiki 如何处理 sitemap、JSON-LD、hreflang 等。',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/seo.md',
      },
    ],
    readLabel: '阅读',
  },
  devGuide: {
    title: '怎么用:5 步走',
    subtitle: '从 fork 到上线约 30 分钟,每一步背后都有完整文档。',
    steps: [
      {
        title: 'Fork 并本地跑起来',
        description: '克隆你的 fork、启动开发服务器——demo wiki(虚构游戏「Anvil Quest」)开箱即用。',
        command: 'pnpm install && pnpm dev',
        linkLabel: 'README',
        href: 'https://github.com/PNGTRID/AnvilWiki#readme',
      },
      {
        title: '换成你的游戏',
        description:
          '一条交互式 CLI 替换游戏信息、主题色、多语言与导航,并重置 demo 配置(含 wrangler.toml)。',
        command: 'pnpm apply-template',
        linkLabel: '套用模板文档',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md',
      },
      {
        title: '和 AI 对话产页',
        description:
          '用 ZCode / Claude Code / Codex 打开仓库直接说——agent 技能随仓库分发,Zod schema 把住每一页的质量关。',
        command: '"帮我写一篇 Boss 攻略,要点如下:…"',
        linkLabel: '内容格式文档',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/content-format.md',
      },
      {
        title: '免费部署上线',
        description:
          '推到 GitHub、连接 Cloudflare Pages——自动识别 Astro 构建,免费无限带宽 + 全球 CDN。',
        command: 'pnpm build && git push',
        linkLabel: '部署文档',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/deployment.md',
      },
      {
        title: '保持新鲜',
        description:
          '每周审计工作流自动标记过期页面,兑换码技能守住长尾流量,上游更新随时可同步。',
        command: 'pnpm refresh-audit',
        linkLabel: '同步更新文档',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/staying-up-to-date.md',
      },
    ],
    allDocs: {
      label: '打开文档中心 —— 两本实操手册,含可复制的 AI 提示词',
      href: '/zh/landing/docs',
    },
  },
  handbook: {
    hubTitle: 'AnvilWiki 文档中心',
    hubSubtitle:
      '两本实操手册,每一步都是 SOP + 可复制的 AI 提示词。学习手册带你从选游戏到上线、收录、变现;开发手册覆盖架构、定制、集成与上游同步。',
    manuals: {
      learn: {
        label: '学习手册',
        description:
          '从零到一个能赚钱的游戏 wiki:选对游戏、30 分钟建站、首日用 AI 产出 10 页、免费部署上线,然后每周 30 分钟的运营节奏。',
      },
      dev: {
        label: '开发手册',
        description:
          '面向深度定制者与贡献者:三层架构与改动地图、定制 SOP、env 门控集成、CI 门禁,以及同步上游与贡献回流。',
      },
    },
    chapterLabel: '第',
    chapterSuffix: '章',
    backToHub: '全部文档',
    prevLabel: '上一章',
    nextLabel: '下一章',
    editLabel: '在 GitHub 上编辑',
    updatedLabel: '更新于',
    readLabel: '阅读本章',
    tldrLabel: '太长不看',
  },
  finalCta: {
    title: '准备好上线你的游戏 wiki 了吗?',
    subtitle: 'Fork、配置、部署——30 分钟搞定,完全免费。',
    primaryCta: { label: '快速开始', href: '#docs' },
    secondaryCta: { label: '阅读文档', href: 'https://github.com/PNGTRID/AnvilWiki#readme' },
  },
  community: {
    badge: '社区交流',
    title: '扫码进群,一起讨论',
    subtitle:
      '部署自己的 wiki 站有问题?想聊功能建议或游戏内容站怎么做?微信扫码添加主理人好友,拉你进交流群。',
    qrAlt: '微信二维码——扫码添加主理人好友,进群交流讨论',
    qrCaption: '微信扫码',
    qrNote: '交流群 · 中文/English 均可',
  },
  footer: {
    tagline: '开源游戏 wiki 站点模板。免费、快速、新手友好。',
    license: 'MIT 协议',
    madeWith: '基于 Astro 构建 · 部署于 Cloudflare Pages',
    author: '由 PNG 部落团队主理人 袁锐钦 开源',
  },
};

export const landingContent: Record<LandingLocale, LandingContent> = { en, zh };

/** Landing-page routes per locale (for language switching + hreflang). */
export const landingPath = (locale: LandingLocale) => (locale === 'en' ? '/landing' : `/zh/landing`);
