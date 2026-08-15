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
export const PROJECT_VERSION = '1.8.0';

export type LandingLocale = 'en' | 'zh';

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
    'An open-source Astro + Cloudflare Pages template for building SEO-driven game content sites. Free to deploy, Lighthouse 4×100, 100% ad revenue yours.',
  announcement: {
    text: `v${PROJECT_VERSION} shipped — AI-native content skills, structured codes frontmatter, weekly freshness audit & game-selection guide.`,
    href: RELEASES,
  },
  hero: {
    badge: 'Open Source · MIT · Cloudflare Pages',
    title: 'The game wiki template that keeps 100% of your ad revenue',
    subtitle:
      'An open-source Astro + Cloudflare Pages template for building SEO-driven game content sites. Fork it, drop in your game guides, deploy free with unlimited bandwidth — every ad dollar is yours.',
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
      icon: 'lucide:dollar-sign',
      title: '100% Your Revenue',
      description:
        'Built-in ad slots (AdSense, env-driven). No platform cut, no revenue sharing — unlike hosted wiki farms that eat your earnings.',
    },
    {
      icon: 'lucide:search',
      title: 'SEO Engineering',
      description:
        'Sitemap with lastmod, JSON-LD (incl. VideoGame), hreflang, robots, article TOC, Quick Answer blocks, llms.txt — all auto-generated from MDX frontmatter.',
    },
    {
      icon: 'lucide:zap',
      title: 'Blazing Fast',
      description:
        'Astro zero-JS by default. Lighthouse 4×100 — Performance, Accessibility, Best Practices, and SEO, all perfect.',
    },
    {
      icon: 'lucide:globe',
      title: 'i18n Out of the Box',
      description:
        'English at root (SEO-optimal, no prefix), other locales prefixed. Missing content falls back to English — direct URLs never 404.',
    },
    {
      icon: 'lucide:cloud',
      title: 'Free Forever',
      description:
        'Deploy to Cloudflare Pages with zero config. Free unlimited bandwidth + global CDN + SSL. No hosting bills, ever.',
    },
    {
      icon: 'lucide:wand-2',
      title: '30-Minute Setup',
      description:
        'JSON-driven config with an interactive CLI: homepage presets, theme color, locales — framework code stays untouched.',
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
        label: 'Setup time',
        values: ['30 min', 'Instant', '1 hour', 'Days+'],
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
        icon: 'lucide:rocket',
        title: 'Quick Start',
        description: 'Fork, configure, and deploy to Cloudflare Pages in 5 minutes.',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/deployment.md',
      },
      {
        icon: 'lucide:palette',
        title: 'Apply Template',
        description: 'Swap the demo game for yours — config, theme, content, locales.',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md',
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
  title: 'AnvilWiki — 开源游戏 Wiki 模板(Cloudflare 原生)',
  description:
    '基于 Astro + Cloudflare Pages 的开源游戏内容站模板。免费部署、Lighthouse 4×100、广告收入 100% 归你。',
  announcement: {
    text: `v${PROJECT_VERSION} 发布 —— AI 原生内容技能、结构化 codes 数据、每周新鲜度审计与选品指南。`,
    href: RELEASES,
  },
  hero: {
    badge: '开源 · MIT 协议 · Cloudflare Pages',
    title: '广告收入 100% 归你的游戏 wiki 模板',
    subtitle:
      '基于 Astro + Cloudflare Pages 的开源模板,专为游戏 SEO 内容站打造。Fork、放入你的游戏攻略、免费部署(无限带宽)——每一分广告收入都归你。',
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
      icon: 'lucide:dollar-sign',
      title: '广告收入 100% 归你',
      description:
        '内置 AdSense 广告位(env 驱动)。无平台抽成、无收入分成——和托管 wiki 农场完全不同。',
    },
    {
      icon: 'lucide:search',
      title: 'SEO 工程化',
      description:
        'sitemap(含 lastmod)、JSON-LD(含 VideoGame)、hreflang、robots、文章 TOC、Quick Answer、llms.txt——全部从 MDX frontmatter 自动生成。',
    },
    {
      icon: 'lucide:zap',
      title: '极致性能',
      description:
        'Astro 零 JS 优先,Lighthouse 四项全 100(性能/无障碍/最佳实践/SEO)。',
    },
    {
      icon: 'lucide:globe',
      title: '多语言开箱即用',
      description:
        '英文在根路径(SEO 最优无前缀),其他语言带前缀。缺失内容自动回退英文——直链永不 404。',
    },
    {
      icon: 'lucide:cloud',
      title: '永久免费',
      description:
        '零配置部署到 Cloudflare Pages:免费无限带宽 + 全球 CDN + SSL。永远没有服务器账单。',
    },
    {
      icon: 'lucide:wand-2',
      title: '30 分钟套用',
      description:
        'JSON 驱动配置 + 交互式 CLI:首页预设、主题色、多语言一步到位——框架代码零改动。',
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
        label: '上手时间',
        values: ['30 分钟', '注册即用', '1 小时', '数天起'],
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
        icon: 'lucide:rocket',
        title: '快速开始',
        description: 'Fork、配置、5 分钟内部署到 Cloudflare Pages。',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/deployment.md',
      },
      {
        icon: 'lucide:palette',
        title: '套用模板',
        description: '把 demo 游戏换成你的——配置、主题、内容、多语言。',
        href: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md',
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
