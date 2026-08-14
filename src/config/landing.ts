/**
 * Landing page configuration — text content for the project landing page
 * at /landing (introduces the AnvilWiki template itself, NOT the demo game).
 *
 * This is separate from site.ts (which holds the DEMO GAME config).
 * The landing page represents the PROJECT, so its copy lives here.
 *
 * 👉 This file is NOT part of the "apply template" config layer — fork users
 *    don't need to touch it. It describes the AnvilWiki open-source project.
 */

export const landing = {
  /** Project name (shown in header logo, footer, title suffix). */
  projectName: 'AnvilWiki',

  /** URLs */
  githubUrl: 'https://github.com/PNGTRID/AnvilWiki',
  demoUrl: '/',
  docsBaseUrl: 'https://github.com/PNGTRID/AnvilWiki/blob/main/docs',

  /** Hero section */
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
  },

  /** Social proof bar */
  socialProof: {
    lighthouse: [
      { label: 'Performance', score: 100 },
      { label: 'Accessibility', score: 100 },
      { label: 'Best Practices', score: 100 },
      { label: 'SEO', score: 100 },
    ],
    poweredBy: 'Powered by Astro + Cloudflare Pages — free unlimited bandwidth',
  },

  /** Feature cards (6) — first card must carry the revenue narrative */
  features: [
    {
      icon: 'lucide:dollar-sign',
      title: '100% Your Revenue',
      description:
        'Built-in ad slots (AdSense + isolated iframes). No platform cut, no revenue sharing — unlike hosted wiki farms that eat your earnings.',
    },
    {
      icon: 'lucide:search',
      title: 'SEO Engineering',
      description:
        'Sitemap, JSON-LD (incl. VideoGame), hreflang, robots, article TOC, Quick Answer blocks — all auto-generated from your MDX frontmatter.',
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
        'JSON-driven config. Swap games by editing the config + content layers — framework code stays untouched. Interactive CLI included.',
    },
  ],

  /** Comparison table */
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

  /** Showcase section */
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
  },

  /** Docs entry cards */
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
  },

  /** Final CTA */
  finalCta: {
    title: 'Ready to launch your game wiki?',
    subtitle: 'Fork, configure, deploy — all in 30 minutes, completely free.',
    primaryCta: { label: 'Get Started', href: '#docs' },
    secondaryCta: { label: 'Read the Docs', href: 'https://github.com/PNGTRID/AnvilWiki#readme' },
  },

  /** Footer */
  footer: {
    tagline: 'Open-source game wiki site template. Free, fast, beginner-friendly.',
    license: 'MIT License',
    madeWith: 'Built with Astro · Deployed on Cloudflare Pages',
  },
} as const;

export type LandingConfig = typeof landing;
