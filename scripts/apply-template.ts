/**
 * apply-template.ts
 *
 * Interactive CLI that automates the base config changes described in
 * docs/apply-template.md (site.ts, navigation.ts, globals.css, routing.ts).
 *
 *   pnpm apply-template                   interactive: prompts for game metadata, theme color,
 *                               locales, and categories; rewrites the config files
 *                               (site.ts, navigation.ts, globals.css, routing.ts,
 *                               ui.ts, locales/*.json, manifest.json), clears
 *                               demo content (src/content/wiki/* MDX), and removes
 *                               the project landing page + in-site docs center
 *                               (/landing, /landing/docs) and its assets
 *                               (public/images/showcase/, wechat QR) — not
 *                               needed by fork users; docs/handbook markdown
 *                               is kept as repo docs.
 *   pnpm apply-template --dry-run         print every planned change, write nothing.
 *   pnpm apply-template --no-clear-content  keep demo MDX files in place.
 *   pnpm apply-template --keep-landing      keep the project landing page (/landing).
 *
 * What this does NOT do (left for the user, see docs/apply-template.md):
 *   - Final editorial review of generated homepage copy and routes
 *   - Final article MDX bodies and per-locale category copy refinement
 *   - Translation of non-English locale JSON
 *   - favicon / hero image files (binary assets, user-provided)
 *
 * Conventions match scripts/new-post.ts: only node builtins, readline/prompts
 * for input, regex-read of config files, emoji-prefixed console output.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes('--dry-run') || ARGS.includes('-n');
const KEEP_CONTENT = ARGS.includes('--no-clear-content');
const KEEP_LANDING = ARGS.includes('--keep-landing');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REL = (p: string) => path.relative(ROOT, p);
const read = (p: string) => fs.readFileSync(path.resolve(ROOT, p), 'utf8');
const write = (p: string, content: string) => {
  if (DRY_RUN) {
    console.log(`   ${dim('~')} would write ${REL(p)}`);
    return;
  }
  fs.writeFileSync(path.resolve(ROOT, p), content, 'utf8');
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Convert #rrggbb → "H S% L%" (space-separated, no hsl() wrapper, as globals.css expects). */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) {
    console.error(`❌ Invalid hex color "${hex}". Expected #rgb or #rrggbb.`);
    process.exit(1);
  }
  let h = m[1];
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  let hue = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / d + 2;
        break;
      default:
        hue = (r - g) / d + 4;
    }
    hue *= 60;
  }
  return {
    h: Math.round(hue),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

const hslStr = (c: { h: number; s: number; l: number }, lOffset: number) =>
  `${c.h} ${c.s}% ${Math.max(0, Math.min(100, c.l + lOffset))}%`;

/** HSL → #rrggbb (for manifest theme_color). */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const v = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Dim a string for dry-run output (ANSI escape; no chalk dependency). */
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

// ---------------------------------------------------------------------------
// Prompt helpers
// ---------------------------------------------------------------------------

async function ask(rl: readline.Interface, question: string, fallback?: string): Promise<string> {
  const suffix = fallback !== undefined ? ` [${fallback}]: ` : ': ';
  const answer = (await rl.question(question + suffix)).trim();
  return answer || (fallback ?? '');
}

async function askBool(
  rl: readline.Interface,
  question: string,
  fallback = false,
): Promise<boolean> {
  const answer = (await rl.question(`${question} [${fallback ? 'Y/n' : 'y/N'}]: `))
    .trim()
    .toLowerCase();
  if (!answer) return fallback;
  return answer === 'y' || answer === 'yes';
}

// ---------------------------------------------------------------------------
// Rewriters
// ---------------------------------------------------------------------------

export interface SkinInput {
  gameName: string;
  siteName: string;
  shortName: string;
  brandIcon: string;
  brandLogo: string;
  domain: string;
  pagesHost: string;
  tagline: string;
  description: string;
  legalNotice: string;
  themeHex: string;
  platform: string;
  developer: string;
  genre: string;
  releaseDate: string;
  officialUrl: string;
  sourceUrl: string;
  locales: string[];
  categories: { key: string; icon: string }[];
  clearContent: boolean;
  clearLanding: boolean;
  /** Homepage preset: 'codes' | 'guides' | 'keep' */
  homePreset: 'codes' | 'guides' | 'keep';
}

/**
 * Build a starter `home` namespace skeleton for a preset.
 * All copy uses the game name the user entered — placeholders to refine,
 * not demo-game leftovers. Module hrefs point at the categories they chose.
 */
export function buildHomePreset(input: SkinInput): Record<string, unknown> | null {
  if (input.homePreset === 'keep') return null;
  const cats = input.categories.map((c) => c.key);
  const first = cats[0] ?? 'guides';
  const labelFor = (key: string) =>
    key
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  const pathFor = (preferred: string) => `/${cats.includes(preferred) ? preferred : first}`;
  const categoryActions = (cats.length > 0 ? cats : [first]).slice(0, 3).map((key) => ({
    title: labelFor(key),
    detail: `Open ${labelFor(key).toLowerCase()}`,
    href: `/${key}`,
    icon: input.categories.find((category) => category.key === key)?.icon ?? 'lucide:folder',
  }));

  const common = {
    meta: {
      title: `${input.gameName} Wiki — Guides, Codes and Player Reference`,
      description: input.description,
      watermark: input.gameName,
    },
    updates: { badge: 'Fresh', title: 'Recent updates' },
    popular: {
      badge: 'Popular',
      title: 'Most read',
      quickLinks: cats.slice(0, 3).map((c) => ({ label: c, href: `/${c}` })),
    },
    closingCta: {
      title: `Start your ${input.gameName} journey`,
      description: 'Start with one useful route, then return when the next question appears.',
      primary: 'Browse the wiki',
      primaryHref: `/${first}`,
      secondary: 'Open the official game',
      secondaryHref: input.officialUrl,
    },
  };

  if (input.homePreset === 'codes') {
    return {
      ...common,
      hero: {
        badge: `${input.gameName} player companion`,
        title: `Check ${input.gameName} Codes, Then Plan the Next Run`,
        description: `Verify code status first, then move directly into the guide or reference needed for the next run.`,
        ctaPrimary: 'Check code status',
        ctaPrimaryHref: pathFor('codes'),
        ctaPrimaryIcon: 'lucide:gift',
        ctaSecondary: 'Open beginner guides',
        ctaSecondaryHref: pathFor('guides'),
        ctaSecondaryIcon: 'lucide:book-open',
        ctaTertiary: 'Open the official game',
        ctaTertiaryHref: input.officialUrl,
        signals: [
          { label: 'Primary path', value: 'Codes' },
          { label: 'Source policy', value: 'Dated' },
          { label: 'Access', value: 'Free' },
        ],
        panel: {
          eyebrow: 'Status before redemption',
          title: 'Know what is current before you paste a code',
          description:
            'Use dated status, clear source labels, and direct links to the next useful guide.',
          imageAlt: `${input.gameName} homepage guide panel`,
        },
        quickActions: categoryActions,
      },
      start: {
        badge: 'Quick start',
        title: 'Jump straight in',
        cards: [
          {
            title: 'Codes',
            description: 'Free gold, XP, cosmetics',
            icon: 'lucide:gift',
            href: '/codes',
          },
          {
            title: 'Bosses',
            description: 'Phase-by-phase strategy',
            icon: 'lucide:swords',
            href: '/bosses',
          },
          {
            title: 'Tier list',
            description: 'Best weapons ranked',
            icon: 'lucide:bar-chart-3',
            href: `/${cats.find((c) => c !== 'codes') ?? first}`,
          },
        ],
      },
      diagnose: {
        badge: 'Start from the problem',
        title: 'What do you need before the next run?',
        description: 'Choose the closest task and jump to the shortest useful route.',
        cards: [
          {
            symptom: 'I want to verify a code before redeeming it',
            action: 'Check code status',
            href: pathFor('codes'),
            icon: 'lucide:badge-check',
          },
          {
            symptom: 'I am new and do not know what matters first',
            action: 'Open beginner guides',
            href: pathFor('guides'),
            icon: 'lucide:route',
          },
          {
            symptom: 'A difficult fight or build keeps blocking progress',
            action: 'Open strategy references',
            href: pathFor('bosses'),
            icon: 'lucide:swords',
          },
          {
            symptom: 'A familiar route may have changed after an update',
            action: 'Read recent updates',
            href: '/recent',
            icon: 'lucide:history',
          },
        ],
      },
      explore: {
        title: 'Explore',
        description: 'The essentials',
        modules: [
          {
            order: 1,
            name: 'Active codes',
            description: 'Redeem before they expire',
            href: '/codes',
            displayType: 'badge-list',
            highlights: [
              { label: 'CODE-PLACEHOLDER', detail: 'Tap to copy on the codes page', badge: 'NEW' },
            ],
          },
        ],
      },
      faq: { title: 'FAQ', description: 'Common questions', items: [] },
    };
  }

  // 'guides' preset
  return {
    ...common,
    hero: {
      badge: `${input.gameName} player companion`,
      title: `Find Your Next ${input.gameName} Move`,
      description: `Start from the task in front of you, then open the deeper reference only when you need it.`,
      ctaPrimary: 'Start the beginner route',
      ctaPrimaryHref: pathFor('guides'),
      ctaPrimaryIcon: 'lucide:route',
      ctaSecondary: `Browse ${labelFor(first)}`,
      ctaSecondaryHref: `/${first}`,
      ctaSecondaryIcon: 'lucide:book-open',
      ctaTertiary: 'Open the official game',
      ctaTertiaryHref: input.officialUrl,
      signals: [
        { label: 'First route', value: 'Guided' },
        { label: 'Source policy', value: 'Dated' },
        { label: 'Access', value: 'Free' },
      ],
      panel: {
        eyebrow: 'Question to next action',
        title: 'Use the shortest useful route',
        description: 'Task-first entry points reduce browsing and make the next step obvious.',
        imageAlt: `${input.gameName} homepage guide panel`,
      },
      quickActions: categoryActions,
    },
    diagnose: {
      badge: 'Start from the problem',
      title: 'What is blocking the next run?',
      description: 'Choose the situation you recognize and open the shortest useful next step.',
      cards: [
        {
          symptom: 'I just started and do not know what matters first',
          action: 'Open the beginner route',
          href: pathFor('guides'),
          icon: 'lucide:route',
        },
        {
          symptom: 'A difficult encounter keeps ending the run',
          action: 'Open strategy guides',
          href: pathFor('bosses'),
          icon: 'lucide:swords',
        },
        {
          symptom: 'I cannot find the item or upgrade I need',
          action: 'Browse references',
          href: pathFor('items'),
          icon: 'lucide:package-search',
        },
        {
          symptom: 'A familiar route may be outdated',
          action: 'Read recent updates',
          href: '/recent',
          icon: 'lucide:history',
        },
      ],
    },
    start: {
      badge: 'Quick start',
      title: 'New here?',
      cards: cats.slice(0, 4).map((c) => ({
        title: c[0].toUpperCase() + c.slice(1),
        description: `Browse ${c}`,
        icon: 'lucide:book-open',
        href: `/${c}`,
      })),
    },
    explore: {
      title: 'Explore',
      description: 'Content modules',
      modules: [
        {
          order: 1,
          name: 'Getting started',
          description: 'Step-by-step progression',
          href: '/guides',
          displayType: 'steps',
          highlights: [
            { label: 'Step 1', detail: 'Finish the tutorial', badge: '5 min' },
            { label: 'Step 2', detail: 'Claim starter codes', badge: '1 min' },
            { label: 'Step 3', detail: 'First boss run', badge: '15 min' },
          ],
        },
      ],
    },
    faq: { title: 'FAQ', description: 'Common questions', items: [] },
  };
}

function rewriteSiteTs(input: SkinInput): string {
  // Rewrite the `site` object literal only. Everything else in the file stays.
  const filePath = 'src/config/site.ts';
  const src = read(filePath);
  const newSite = `export const site: SiteConfig = {
  name: '${input.siteName.replace(/'/g, "\\'")}',
  shortName: '${input.shortName}',
  brandIcon: '${input.brandIcon}',
${input.brandLogo ? `  brandLogo: '${input.brandLogo.replace(/'/g, "\\'")}',\n` : ''}  description: '${input.description.replace(/'/g, "\\'")}',
  domain: '${input.domain}',
  tagline: '${input.tagline.replace(/'/g, "\\'")}',
  legalNotice: '${input.legalNotice.replace(/'/g, "\\'")}',
  social: {
    official: '${input.officialUrl}',
${input.sourceUrl ? `    github: '${input.sourceUrl}',\n` : ''}  },
  about: {
    mission: 'Help ${input.gameName.replace(/'/g, "\\'")} players move from a question to the next useful in-game action.',
    coverage: [
${(input.categories.length > 0 ? input.categories : [{ key: 'guides', icon: '' }])
  .slice(0, 4)
  .map((category) => `      '${category.key.replace(/[-_]/g, ' ')} references and guides',`)
  .join('\n')}
    ],
    methodology: [
      'Official game pages and developer announcements are treated as primary sources.',
      'Community observations are labeled and dated instead of presented as permanent facts.',
      'Potentially outdated claims are reviewed after major game updates.',
    ],
  },
  sameAs: ['${input.officialUrl}'],
  game: {
    name: '${input.gameName}',
    platform: '${input.platform}',
    developer: '${input.developer}',
    genre: '${input.genre}',
    releaseDate: '${input.releaseDate}',
  },
  // og:image dims of the SHIPPED hero.webp — if you replace public/images/hero.webp,
  // update these in src/config/site.ts to match (wrong dims mis-crop share cards).
  ogImageWidth: 1200,
  ogImageHeight: 630,
  defaultAuthor: '${input.siteName.replace(/'/g, "\\'")} Editorial Team',
};`;
  const siteRe = /export const site: SiteConfig = \{[\s\S]*?\n\};/;
  if (!siteRe.test(src)) {
    console.error(`❌ Could not find site object in ${filePath}. Aborting (file untouched).`);
    process.exit(1);
  }
  return src.replace(siteRe, newSite);
}

function rewriteNavigationTs(input: SkinInput): string {
  const filePath = 'src/config/navigation.ts';
  const src = read(filePath);
  const items = input.categories
    .map(
      (c, i) =>
        `  { key: '${c.key}', path: '/${c.key}', icon: '${c.icon}', isContentType: true, order: ${i + 1} }`,
    )
    .join(',\n');
  const newArray = `export const NAVIGATION_CONFIG: NavigationItem[] = [\n${items},\n];`;
  const navRe = /export const NAVIGATION_CONFIG: NavigationItem\[\] = \[[\s\S]*?\];/;
  if (!navRe.test(src)) {
    console.error(`❌ Could not find NAVIGATION_CONFIG in ${filePath}. Aborting.`);
    process.exit(1);
  }
  return src.replace(navRe, newArray);
}

function rewriteGlobalsCss(input: SkinInput): string {
  const filePath = 'src/styles/globals.css';
  const src = read(filePath);
  const c = hexToHsl(input.themeHex);
  // Light: full saturation, l=52%. Light variant: +10% lightness.
  // Dark: -5% lightness, -5% saturation. Dark-light: dark + 10%.
  const lightMain = hslStr(c, 0);
  const lightAlt = hslStr(c, 10);
  const darkMain = `${c.h} ${Math.max(0, c.s - 5)}% ${Math.max(0, c.l - 4)}%`;
  const darkAlt = `${c.h} ${Math.max(0, c.s - 5)}% ${Math.max(0, c.l - 4 + 10)}%`;

  // Replace ONLY the 4 --brand / --brand-light value lines, line-wise, so the
  // rewrite still works if the user has added custom variables or changed
  // indentation inside :root / .dark (previous whole-block regex broke then).
  const lines = src.split('\n');
  let block: 'root' | 'dark' | null = null;
  let replaced = 0;
  const out = lines.map((line) => {
    if (/^\s*:root\s*\{/.test(line)) block = 'root';
    else if (/^\s*\.dark\s*\{/.test(line)) block = 'dark';
    else if (block && /^\s*\}/.test(line)) block = null;
    else if (block === 'root' && /^\s*--brand:/.test(line)) {
      replaced++;
      return line.replace(/(--brand:\s*)[^;]+;/, `$1${lightMain};`);
    } else if (block === 'root' && /^\s*--brand-light:/.test(line)) {
      replaced++;
      return line.replace(/(--brand-light:\s*)[^;]+;/, `$1${lightAlt};`);
    } else if (block === 'root' && /^\s*--brand-h:/.test(line)) {
      replaced++;
      return line.replace(/(--brand-h:\s*)[^;]+;/, `$1${c.h};`);
    } else if (block === 'root' && /^\s*--brand-s:/.test(line)) {
      replaced++;
      return line.replace(/(--brand-s:\s*)[^;]+;/, `$1${c.s}%;`);
    } else if (block === 'dark' && /^\s*--brand:/.test(line)) {
      replaced++;
      return line.replace(/(--brand:\s*)[^;]+;/, `$1${darkMain};`);
    } else if (block === 'dark' && /^\s*--brand-light:/.test(line)) {
      replaced++;
      return line.replace(/(--brand-light:\s*)[^;]+;/, `$1${darkAlt};`);
    } else if (block === 'dark' && /^\s*--brand-h:/.test(line)) {
      replaced++;
      return line.replace(/(--brand-h:\s*)[^;]+;/, `$1${c.h};`);
    } else if (block === 'dark' && /^\s*--brand-s:/.test(line)) {
      replaced++;
      return line.replace(/(--brand-s:\s*)[^;]+;/, `$1${Math.max(0, c.s - 5)}%;`);
    }
    return line;
  });
  if (replaced < 6) {
    console.error(
      `❌ Expected 6+ --brand/--brand-light/--brand-h/--brand-s lines in ${filePath}, found ${replaced}. Aborting.`,
    );
    process.exit(1);
  }
  return out.join('\n');
}

function rewriteRoutingTs(input: SkinInput): string {
  const filePath = 'src/i18n/routing.ts';
  const src = read(filePath);
  const locs = input.locales.map((l) => `'${l}'`).join(', ');
  const newArray = `export const locales = [${locs}] as const;`;
  // Build LOCALE_LABELS with English defaults for unknown locales.
  const KNOWN: Record<string, string> = {
    en: 'English',
    ja: '日本語',
    zh: '中文',
    ko: '한국어',
    es: 'Español',
    pt: 'Português',
    ru: 'Русский',
    fr: 'Français',
    de: 'Deutsch',
  };
  const labels = input.locales.map((l) => `  ${l}: '${KNOWN[l] ?? l}'`).join(',\n');
  const newLabels = `export const LOCALE_LABELS: Record<Locale, string> = {\n${labels},\n};`;
  const localesRe = /export const locales = \[[\s\S]*?\] as const;/;
  const labelsRe = /export const LOCALE_LABELS: Record<Locale, string> = \{[\s\S]*?\};/;
  if (!localesRe.test(src) || !labelsRe.test(src)) {
    console.error(`❌ Could not locate locales/LOCALE_LABELS blocks in ${filePath}. Aborting.`);
    process.exit(1);
  }
  let updated = src.replace(localesRe, newArray);
  updated = updated.replace(labelsRe, newLabels);
  return updated;
}

function rewriteUiTs(input: SkinInput): string {
  const filePath = 'src/i18n/ui.ts';
  const src = read(filePath);
  // Two separate edits:
  //   (a) the contiguous block of `import <loc> from '~/locales/<loc>.json';` lines
  //   (b) the `const messages = { ... }` map entries
  // The `import { defaultLocale, ... } from './routing'` line sits between them
  // and must NOT be touched.
  const imports = input.locales.map((l) => `import ${l} from '~/locales/${l}.json';`).join('\n');
  const messagesEntries = input.locales
    .map((l) => `  ${l}: ${l} as Record<string, unknown>,`)
    .join('\n');
  // (a) locale-JSON import block: one or more `import X from '~/locales/X.json';` lines.
  const importBlockRe = /(?:import \w+ from '~\/locales\/\w+\.json';\n)+/;
  // (b) messages map: from `const messages` through the closing `};`.
  const messagesRe = /const messages: Record<Locale, Record<string, unknown>> = \{[\s\S]*?\};/;
  if (!importBlockRe.test(src) || !messagesRe.test(src)) {
    console.error(`❌ Could not rewrite locale imports in ${filePath}. Aborting.`);
    process.exit(1);
  }
  let updated = src.replace(importBlockRe, `${imports}\n`);
  updated = updated.replace(
    messagesRe,
    `const messages: Record<Locale, Record<string, unknown>> = {\n${messagesEntries}\n};`,
  );
  return updated;
}

export function rewriteLocaleJson(input: SkinInput, _locale: string, existing?: string): string {
  // Start from existing (if any) or a minimal skeleton; reset site/footer and
  // rebuild category navigation from the selected taxonomy.
  let obj: Record<string, unknown> = {};
  if (existing) {
    try {
      obj = JSON.parse(existing);
    } catch {
      obj = {};
    }
  }
  const previousSite = (obj.site ?? {}) as Record<string, unknown>;
  const previousGameName =
    typeof previousSite.name === 'string' ? previousSite.name.replace(/\s+Wiki$/i, '').trim() : '';
  const previousNav = (obj.nav ?? {}) as Record<string, unknown>;
  const previousOverview = (obj.overview ?? {}) as Record<string, unknown>;
  const labelFor = (key: string) =>
    key
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  const replacePreviousGame = (value: unknown): unknown => {
    if (!previousGameName || previousGameName === input.gameName) return value;
    if (typeof value === 'string') return value.replaceAll(previousGameName, input.gameName);
    if (Array.isArray(value)) return value.map(replacePreviousGame);
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, child]) => [
          key,
          replacePreviousGame(child),
        ]),
      );
    }
    return value;
  };
  // Always (re)write the site-level strings for this locale.
  obj.site = {
    name: input.siteName,
    shortName: input.shortName,
    description: input.description,
    tagline: input.tagline,
    legalNotice: input.legalNotice,
  };
  obj.footer = obj.footer ?? {};
  (obj.footer as Record<string, unknown>).copyrightText =
    `© ${new Date().getFullYear()} ${input.siteName}. All rights reserved.`;
  const nav: Record<string, unknown> = {};
  for (const key of ['home', 'toggleTheme', 'menu', 'close', 'search', 'language']) {
    if (previousNav[key] !== undefined) nav[key] = previousNav[key];
  }
  const overview: Record<string, unknown> = {};
  for (const category of input.categories) {
    const label = labelFor(category.key);
    nav[category.key] = previousNav[category.key] ?? label;
    overview[category.key] = previousOverview[category.key]
      ? replacePreviousGame(previousOverview[category.key])
      : {
          overviewTitle: `All ${label}`,
          overviewDescription: `${input.gameName} ${label.toLowerCase()} and player reference pages.`,
        };
  }
  obj.nav = nav;
  obj.overview = overview;
  // Homepage preset skeleton (unless 'keep').
  const home = buildHomePreset(input);
  if (home) obj.home = home;
  return JSON.stringify(obj, null, 2) + '\n';
}

/**
 * Reset wrangler.toml [vars] for the forker's own site.
 *
 * Why: when wrangler.toml exists it is the SOLE source of truth for the
 * Cloudflare Pages project env (dashboard UI is ignored). The shipped file
 * carries the DEMO site's Giscus config — an unedited fork would silently
 * point its comment section at the original repo's GitHub Discussions.
 * We rewrite SITE_URL to the forker's domain and blank the Giscus values.
 */
export function replaceWranglerVars(src: string, input: SkinInput): string {
  const headerMatch = /^\[vars\]\s*$/m.exec(src);
  if (!headerMatch || headerMatch.index === undefined) {
    throw new Error('Could not find a line-start [vars] section in wrangler.toml.');
  }
  const sectionStart = headerMatch.index;
  const afterHeader = sectionStart + headerMatch[0].length;
  const tail = src.slice(afterHeader);
  const nextSection = /^\[[^\]\r\n]+\]\s*$/m.exec(tail);
  const sectionEnd =
    nextSection?.index === undefined ? src.length : afterHeader + nextSection.index;
  const suffix = src.slice(sectionEnd);
  const newVars = `[vars]
# Site (must include https:// protocol — Astro validates this as a URL)
SITE_URL = "https://${input.domain}"
# Giscus comments — blank = comments disabled until you fill your own values.
# See docs/comments.md for how to get these from giscus.app.
PUBLIC_GISCUS_REPO = ""
PUBLIC_GISCUS_REPO_ID = ""
PUBLIC_GISCUS_CATEGORY = ""
PUBLIC_GISCUS_CATEGORY_ID = ""
PUBLIC_GISCUS_MAPPING = "pathname"
# Sponsor card — blank = disabled. Fill PUBLIC_SPONSOR_URL to enable.
PUBLIC_SPONSOR_URL = ""
PUBLIC_SPONSOR_IMAGE_URL = ""
# Cloudflare Web Analytics — blank = disabled.
PUBLIC_CF_BEACON_TOKEN = ""
# Optional slots (empty = disabled) — fill HERE, not the dashboard:
#PUBLIC_ADSENSE_CLIENT = ""
#PUBLIC_ADSENSE_SLOT_STICKY = ""
#PUBLIC_ADSENSE_SLOT_SIDEBAR = ""
#PUBLIC_ADSENSE_SLOT_INCONTENT = ""
#PUBLIC_GA_ID = ""
#PUBLIC_GSC_VERIFICATION = ""`;
  return `${src.slice(0, sectionStart)}${newVars}${suffix ? `\n${suffix.replace(/^\s+/, '')}` : '\n'}`;
}

/**
 * Build a host-aware Pages worker that keeps the custom apex as the only
 * indexable origin. It redirects the generated pages.dev hostname, preview
 * deployment subdomains, and www in one hop while serving apex assets directly.
 */
export function buildCanonicalWorker(input: SkinInput): string {
  return `const CANONICAL_HOST = ${JSON.stringify(input.domain)};
const PAGES_HOST = ${JSON.stringify(input.pagesHost)};

function shouldRedirect(hostname) {
  return (
    hostname === \`www.\${CANONICAL_HOST}\` ||
    (PAGES_HOST !== CANONICAL_HOST &&
      (hostname === PAGES_HOST || hostname.endsWith(\`.\${PAGES_HOST}\`)))
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (shouldRedirect(url.hostname)) {
      url.protocol = 'https:';
      url.hostname = CANONICAL_HOST;
      url.port = '';
      return Response.redirect(url, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
`;
}

function rewriteWranglerVars(input: SkinInput): string | null {
  const filePath = 'wrangler.toml';
  if (!fs.existsSync(path.resolve(ROOT, filePath))) return null;
  try {
    return replaceWranglerVars(read(filePath), input);
  } catch (error) {
    console.warn(`⚠️ ${(error as Error).message} Edit ${filePath} manually.`);
    return null;
  }
}

function rewriteManifest(input: SkinInput): string {
  const filePath = 'public/manifest.json';
  const src = read(filePath);
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(src);
  } catch {
    console.error(`❌ Invalid JSON in ${filePath}.`);
    process.exit(1);
  }
  obj.name = input.siteName;
  obj.short_name = input.shortName;
  obj.description = input.description;
  const c = hexToHsl(input.themeHex);
  obj.theme_color = hslToHex(c.h, c.s, c.l);
  return JSON.stringify(obj, null, 2) + '\n';
}

function clearDemoContent() {
  const base = path.resolve(ROOT, 'src/content/wiki');
  if (!fs.existsSync(base)) return 0;
  let removed = 0;
  for (const localeDir of fs.readdirSync(base)) {
    const localePath = path.join(base, localeDir);
    const stat = fs.statSync(localePath);
    if (!stat.isDirectory()) continue;
    for (const catDir of fs.readdirSync(localePath)) {
      const catPath = path.join(localePath, catDir);
      if (!fs.statSync(catPath).isDirectory()) continue;
      for (const file of fs.readdirSync(catPath)) {
        if (file.endsWith('.mdx') || file.endsWith('.md')) {
          if (!DRY_RUN) fs.unlinkSync(path.join(catPath, file));
          removed++;
        }
      }
    }
  }
  removed += clearDemoAssets();
  return removed;
}

/**
 * Demo article artwork — the 5 covers, the whole demo gallery dir, and the
 * inline demo card images. Deleted BY NAME (not a wildcard) so covers a fork
 * user already replaced with their own art are never touched. Keep in sync
 * with the "Clear demo content" step in .github/workflows/setup.yml.
 */
const DEMO_ASSET_DIRS = ['src/assets/gallery', 'public/images/articles'];
const DEMO_COVERS = [
  'beginner-guide-cover.png',
  'emberfang-cover.png',
  'stormcaller-cover.png',
  'weapon-tier-list-cover.png',
  'codes-cover.png',
];

function clearDemoAssets() {
  let removed = 0;
  for (const dir of DEMO_ASSET_DIRS) {
    const dirPath = path.resolve(ROOT, dir);
    if (!fs.existsSync(dirPath)) continue;
    if (!DRY_RUN) fs.rmSync(dirPath, { recursive: true, force: true });
    removed++;
  }
  const covers = path.resolve(ROOT, 'src/assets/covers');
  if (fs.existsSync(covers)) {
    for (const file of fs.readdirSync(covers)) {
      if (DEMO_COVERS.includes(file)) {
        if (!DRY_RUN) fs.unlinkSync(path.join(covers, file));
        removed++;
      }
    }
  }
  return removed;
}

/**
 * After clearing demo content, drop one draft scaffold per chosen category.
 * Drafts keep the tree buildable in dev without sending placeholder copy to
 * production lists, search, sitemap, RSS, or llms.txt.
 */
function scaffoldContent(categories: { key: string }[]): number {
  const enBase = path.resolve(ROOT, 'src/content/wiki/en');
  // "tier-list" → "Tier List", so scaffold titles read naturally.
  const titleCase = (key: string) =>
    key
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  let created = 0;
  for (const { key } of categories) {
    const dir = path.join(enBase, key);
    if (!DRY_RUN) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'getting-started.mdx');
    if (!DRY_RUN && !fs.existsSync(file)) {
      fs.writeFileSync(
        file,
        `---
title: "Getting Started with ${titleCase(key)} Guide"
description: "A starter article for the ${key} category. Replace this scaffold with your real ${key} content — keep the description between 40 and 165 characters for SEO."
category: "${key}"
date: ${new Date().toISOString().slice(0, 10)}
tags: []
draft: true
---

## First section — write question-shaped headings

Replace this scaffold with your article. Remember: no H1 in the body (it is
rendered from the frontmatter title), and start each section with a direct
40-60 word answer for AI search engines.
`,
        'utf8',
      );
      created++;
    }
  }
  return created;
}

/**
 * Files/dirs that make up the project landing page (/landing) and its in-site
 * docs center (/landing/docs + /zh/landing/docs).
 * Fork users don't need these routes — they are about the AnvilWiki project
 * itself, not their game wiki. The CLI removes them automatically.
 *
 * NOTE: docs/handbook/ (the handbook markdown SOURCE) is deliberately NOT in
 * this list — the learning manual's SOPs and AI prompts stay useful to fork
 * users as repo docs; only the landing ROUTES above are removed. The handbook
 * collection in src/content.config.ts becomes an unloaded leftover (its glob
 * base still exists), which builds cleanly.
 *
 * Directory counts in removeLandingPage() are top-level entries (approximate).
 */
const LANDING_PATHS = [
  'src/components/landing', // directory (16 components incl. docs hub/chapter/nav/comparison)
  'src/config/landing.ts',
  'src/pages/landing.astro', // file — coexists with the src/pages/landing/ dir
  'src/pages/landing', // directory (docs hub + chapter routes)
  'src/pages/zh/landing.astro', // file — coexists with the src/pages/zh/landing/ dir
  'src/pages/zh/landing', // directory (zh docs routes)
  'public/images/showcase', // directory (demo screenshots + community site screenshots — landing only)
  'public/images/wechat-qr.jpg', // maintainer's personal QR — not needed by forks
];

function removeLandingPage(): number {
  let removed = 0;
  for (const rel of LANDING_PATHS) {
    const abs = path.resolve(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      const entryCount = fs.readdirSync(abs).length;
      if (!DRY_RUN) fs.rmSync(abs, { recursive: true, force: true });
      removed += entryCount;
    } else {
      if (!DRY_RUN) fs.unlinkSync(abs);
      removed++;
    }
  }
  // Also disable the demo header's "back to landing" link so the removal is
  // complete (the flag lives in project.ts, which survives this CLI).
  const projectPath = path.resolve(ROOT, 'src/config/project.ts');
  if (fs.existsSync(projectPath)) {
    const src = read('src/config/project.ts');
    const flipped = src.replace('landingLinkEnabled = true', 'landingLinkEnabled = false');
    if (flipped !== src) {
      if (!DRY_RUN) fs.writeFileSync(projectPath, flipped, 'utf8');
      removed++;
    }
  }
  return removed;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    `\n🎨 AnvilWiki apply-template CLI — base config (metadata, theme, nav, locales)${DRY_RUN ? ' [DRY RUN]' : ''}\n`,
  );

  const rl = readline.createInterface({ input, output });

  // --- Collect inputs -----------------------------------------------------
  console.log('━'.repeat(60));
  console.log('Game identity');
  console.log('━'.repeat(60));
  const gameName = await ask(rl, 'Full game name', 'Anvil Quest');
  const siteName = await ask(
    rl,
    'Distinct site brand (do not use only "<game> Wiki/Tools/Guide")',
    `${gameName} Field Lab`,
  );
  const shortNameDefault =
    gameName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 4)
      .toUpperCase() + ' Lab';
  const shortName = await ask(rl, 'Short name (PWA / mobile)', shortNameDefault);
  const brandIcon = await ask(rl, 'Brand icon (Iconify name)', 'lucide:book-open');
  const brandLogo = await ask(
    rl,
    'Custom logo path in public/ (recommended; blank uses the icon)',
    '',
  );
  const domain = await ask(rl, 'Domain (no protocol)', 'anvilwiki.pages.dev');
  const defaultPagesHost = domain.endsWith('.pages.dev')
    ? domain
    : `${domain.slice(0, domain.lastIndexOf('.'))}.pages.dev`;
  const pagesHost = await ask(
    rl,
    'Cloudflare Pages hostname (no protocol, used only for canonical redirect)',
    defaultPagesHost,
  );
  const tagline = await ask(rl, 'Hero tagline', `Your home for everything ${gameName}`);
  const description = await ask(
    rl,
    'Site description (SEO, 40-165 chars)',
    `Complete ${gameName} wiki with guides, codes, tier lists, and tips. Updated by the community.`,
  );
  const legalNotice = await ask(
    rl,
    'Legal / copyright notice',
    `${siteName} is a fan-made community site for ${gameName}. Not affiliated with or endorsed by the game developer.`,
  );
  const officialUrl = await ask(rl, 'Official game URL', 'https://example.com');
  const sourceUrl = await ask(rl, 'Wiki source / corrections URL (optional)', '');

  console.log('\n' + '━'.repeat(60));
  console.log('Theme color');
  console.log('━'.repeat(60));
  const themeHex = await ask(rl, 'Theme color (#rrggbb)', '#f97316');
  const preview = hexToHsl(themeHex);
  console.log(`   → ${themeHex} = HSL(${preview.h}, ${preview.s}%, ${preview.l}%)`);

  console.log('\n' + '━'.repeat(60));
  console.log('Game metadata');
  console.log('━'.repeat(60));
  const platform = await ask(rl, 'Platform', 'Roblox');
  const developer = await ask(rl, 'Developer / studio', 'Forge Studios');
  const genre = await ask(rl, 'Genre', 'Fantasy RPG');
  const releaseDate = await ask(rl, 'Release date (ISO, optional)', '');

  console.log('\n' + '━'.repeat(60));
  console.log('Locales (comma-separated, first = default)');
  console.log('━'.repeat(60));
  const localesInput = await ask(rl, 'Locales', 'en');
  const locales = localesInput
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => slugify(l) || l);
  if (locales.length === 0 || !locales.includes('en')) {
    console.warn('⚠️ "en" must be present (default locale). Adding it.');
    locales.unshift('en');
  }
  // Dedupe.
  const uniqueLocales = Array.from(new Set(locales));

  console.log('\n' + '━'.repeat(60));
  console.log('Content categories (comma-separated keys, lowercase)');
  console.log('━'.repeat(60));
  console.log('   Common: bosses, guides, items, codes, tier-list, characters');
  const catsInput = await ask(rl, 'Categories', '');
  const catKeys = catsInput
    .split(',')
    .map((c) => slugify(c.trim()))
    .filter(Boolean);
  // Default icons for known keys; others get a generic icon.
  const ICON_DEFAULTS: Record<string, string> = {
    bosses: 'lucide:swords',
    guides: 'lucide:book-open',
    items: 'lucide:package',
    codes: 'lucide:gift',
    'tier-list': 'lucide:bar-chart-3',
    characters: 'lucide:users',
    weapons: 'lucide:sword',
    maps: 'lucide:map',
    quests: 'lucide:scroll',
  };
  const categories = catKeys.map((key) => ({
    key,
    icon: ICON_DEFAULTS[key] ?? 'lucide:folder',
  }));
  if (categories.length === 0) {
    console.warn('⚠️ No categories provided. navigation.ts will be empty — fill it manually.');
  }

  let clearContent = false;
  if (!KEEP_CONTENT) {
    console.log('\n' + '━'.repeat(60));
    console.log('⚠️  CONTENT LAYER');
    console.log('━'.repeat(60));
    console.log('   This will DELETE all demo MDX files under src/content/wiki/*/.');
    console.log('   Directory structure is preserved for you to drop in new content.');
    clearContent = await askBool(rl, 'Clear demo content?', false);
  }

  console.log('\n' + '━'.repeat(60));
  console.log('🏠  Homepage preset');
  console.log('━'.repeat(60));
  console.log('   1) codes     — hero "All Codes", badge-list codes module (codes-driven sites)');
  console.log('   2) guides    — hero wiki-style, steps module (guide-driven sites)');
  console.log('   3) keep      — keep the demo homepage JSON as a starting point');
  const presetAnswer = (await ask(rl, 'Preset [1/2/3]', '1')).trim();
  const homePreset: 'codes' | 'guides' | 'keep' =
    presetAnswer === '2' ? 'guides' : presetAnswer === '3' ? 'keep' : 'codes';

  let clearLanding = false;
  if (!KEEP_LANDING) {
    console.log('\n' + '━'.repeat(60));
    console.log('🌐  PROJECT LANDING PAGE');
    console.log('━'.repeat(60));
    console.log('   /landing is a marketing page for the AnvilWiki project itself.');
    console.log('   Your game wiki does not need it. Removing it keeps your repo clean.');
    clearLanding = await askBool(rl, 'Remove the project landing page (/landing)?', true);
  }

  rl.close();

  // --- Summarize planned changes -----------------------------------------
  const skinInput: SkinInput = {
    gameName,
    siteName,
    shortName,
    brandIcon,
    brandLogo,
    domain,
    pagesHost,
    tagline,
    description,
    legalNotice,
    themeHex,
    platform,
    developer,
    genre,
    releaseDate,
    officialUrl,
    sourceUrl,
    locales: uniqueLocales,
    categories,
    clearContent,
    clearLanding,
    homePreset,
  };

  console.log('\n' + '━'.repeat(60));
  console.log(`📋 Planned changes${DRY_RUN ? ' (DRY RUN — nothing will be written)' : ''}`);
  console.log('━'.repeat(60));
  console.log(`   Game:        ${gameName}`);
  console.log(`   Site brand:  ${siteName}`);
  console.log(`   Short name:  ${shortName}`);
  console.log(`   Brand icon:  ${brandIcon}`);
  console.log(`   Brand logo:  ${brandLogo || '(not set — replace before production)'}`);
  console.log(`   Domain:      ${domain}`);
  console.log(`   Pages host:  ${pagesHost}`);
  console.log(`   Theme:       ${themeHex} → HSL(${preview.h}, ${preview.s}%, ${preview.l}%)`);
  console.log(`   Locales:     ${uniqueLocales.join(', ')}`);
  console.log(`   Categories:  ${categories.map((c) => c.key).join(', ') || '(none)'}`);
  console.log(`   Clear demo:  ${clearContent ? 'YES' : 'no'}`);
  console.log(`   Remove /landing: ${skinInput.clearLanding ? 'YES' : 'no'}`);
  console.log('   Files to write:');
  console.log('     - src/config/site.ts');
  console.log('     - src/config/navigation.ts');
  console.log('     - src/styles/globals.css (4 theme lines only)');
  console.log('     - src/i18n/routing.ts');
  console.log('     - src/i18n/ui.ts');
  console.log(`     - src/locales/{${uniqueLocales.join(',')}}.json`);
  console.log('     - public/manifest.json');
  console.log('     - public/_worker.js (pages.dev + www → canonical domain)');
  console.log('     - wrangler.toml ([vars] reset to your domain, demo Giscus cleared)');

  if (!DRY_RUN) {
    const proceed = await (async () => {
      const rl2 = readline.createInterface({ input, output });
      const ok = await askBool(rl2, '\nProceed with these changes?', false);
      rl2.close();
      return ok;
    })();
    if (!proceed) {
      console.log('\n🚫 Aborted. No files were changed.');
      process.exit(0);
    }
  }

  // --- Apply -------------------------------------------------------------
  console.log('\n🔧 Applying changes…');

  write('src/config/site.ts', rewriteSiteTs(skinInput));
  console.log('   ✅ src/config/site.ts');

  write('src/config/navigation.ts', rewriteNavigationTs(skinInput));
  console.log('   ✅ src/config/navigation.ts');

  write('src/styles/globals.css', rewriteGlobalsCss(skinInput));
  console.log('   ✅ src/styles/globals.css');

  write('src/i18n/routing.ts', rewriteRoutingTs(skinInput));
  console.log('   ✅ src/i18n/routing.ts');

  write('src/i18n/ui.ts', rewriteUiTs(skinInput));
  console.log('   ✅ src/i18n/ui.ts');

  for (const locale of uniqueLocales) {
    const localePath = `src/locales/${locale}.json`;
    const existing = fs.existsSync(path.resolve(ROOT, localePath)) ? read(localePath) : undefined;
    write(localePath, rewriteLocaleJson(skinInput, locale, existing));
    if (!DRY_RUN) {
      // Ensure content dir exists for this locale.
      fs.mkdirSync(path.resolve(ROOT, 'src/content/wiki', locale), { recursive: true });
    }
    console.log(`   ✅ ${localePath}`);
  }

  write('public/manifest.json', rewriteManifest(skinInput));
  console.log('   ✅ public/manifest.json');

  write('public/_worker.js', buildCanonicalWorker(skinInput));
  console.log('   ✅ public/_worker.js (single-hop canonical host redirects)');

  const wrangler = rewriteWranglerVars(skinInput);
  if (wrangler !== null) {
    write('wrangler.toml', wrangler);
    console.log('   ✅ wrangler.toml ([vars] reset — demo Giscus config cleared)');
  }

  // Reset the demo author registry so fork sites don't inherit demo authors.
  const authorsPath = 'src/config/authors.ts';
  if (fs.existsSync(path.resolve(ROOT, authorsPath))) {
    const src = read(authorsPath).replace(/\n\s*\/\/ DEMO .*?\n\s*'[^']+'.*?\{[^}]*\},\n/, '\n');
    write(authorsPath, src);
    console.log('   ✅ src/config/authors.ts (demo author removed)');
  }

  if (clearContent) {
    const n = clearDemoContent();
    console.log(`   🗑️  Removed ${n} demo MDX file${n === 1 ? '' : 's'} under src/content/wiki/`);
    if (categories.length > 0) {
      const s = scaffoldContent(categories);
      console.log(
        `   📄 Created ${s} scaffold article${s === 1 ? '' : 's'} (one per category, en/)`,
      );
    }
  }

  if (skinInput.clearLanding) {
    const n = removeLandingPage();
    if (n > 0) {
      console.log(
        `   🗑️  Removed ${n} project landing page file${n === 1 ? '' : 's'} (src/components/landing/, src/config/landing.ts, src/pages/landing* incl. the /landing/docs center, public/images/showcase/ + wechat-qr.jpg; docs/handbook markdown stays as repo docs)`,
      );
    }
  }

  // --- Next steps --------------------------------------------------------
  console.log('\n' + '━'.repeat(60));
  console.log('✅ Base config complete.');
  console.log('━'.repeat(60));
  console.log('\n📌 Remaining tasks (see docs/apply-template.md):');
  console.log('   • Replace the icon set — your site still shows the demo anvil icons.');
  console.log(
    '           Generate a full set from one image at https://favicon.io/favicon-converter/,',
  );
  console.log('           then drag the files into public/ overwriting: favicon.ico, favicon.svg,');
  console.log('           favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png,');
  console.log('           android-chrome-192x192.png, android-chrome-512x512.png.');
  console.log('           Same for the homepage hero image: public/images/hero.webp / hero.svg.');
  console.log(
    '           (CLI cannot generate binary assets — see the learning manual, chapter 3, step 5.)',
  );
  console.log('   • Review the generated task-first homepage in src/locales/<locale>.json');
  console.log('           (hero / quick actions / diagnose / start / explore / FAQ).');
  console.log('   • Add article MDX under src/content/wiki/<locale>/<category>/.');
  console.log(
    '           Category nav + overview labels are scaffolded; refine the copy per locale.',
  );
  console.log('   • Translate non-English locale JSONs + copy MDX bodies.');
  console.log('   • After deploy, run `pnpm check-sitemap` to verify all URLs.');
  console.log('\n   Then: pnpm dev    (preview)');
  console.log('         pnpm build  (verify production build)\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('\n❌', err instanceof Error ? err.message : err);
    if (err instanceof Error && err.stack) console.error(err.stack);
    process.exit(1);
  });
}
