import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { parse as parseYaml } from 'yaml';

import { locales, defaultLocale } from './src/i18n/routing';
import { CONTENT_TYPES } from './src/config/navigation';
import { MIN_INDEXABLE_TAG_COUNT } from './src/config/seo';

function slugifyTagForBuild(tag: string): string {
  const slug = tag
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return slug || tag.trim();
}

/** Tag pages remain browsable, but singleton/thin tags stay out of search. */
function buildThinTagPaths(): Set<string> {
  const counts = new Map<string, number>();
  const allKeys = new Set<string>();
  const base = path.resolve('./src/content/wiki');
  if (!fs.existsSync(base)) return new Set();

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(file);
        continue;
      }
      if (!entry.name.endsWith('.mdx')) continue;
      const src = fs.readFileSync(file, 'utf8');
      const fm = src.split('---')[1] ?? '';
      let data: { draft?: boolean; noindex?: boolean; tags?: unknown };
      try {
        data = parseYaml(fm) ?? {};
      } catch {
        continue; // Content Collections reports malformed YAML during build.
      }
      if (data.draft || !Array.isArray(data.tags)) continue;
      const rel = path.relative(base, file).split(path.sep);
      const locale = rel[0];
      if (!(locales as readonly string[]).includes(locale)) continue;
      const articleTagSlugs = new Set(
        data.tags
          .filter((rawTag): rawTag is string => typeof rawTag === 'string')
          .map(slugifyTagForBuild)
          .filter(Boolean),
      );
      for (const slug of articleTagSlugs) {
        const key = `${locale}/${slug}`;
        allKeys.add(key);
        if (!data.noindex) counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  };
  walk(base);

  const thin = new Set<string>();
  for (const key of allKeys) {
    const count = counts.get(key) ?? 0;
    if (count >= MIN_INDEXABLE_TAG_COUNT) continue;
    const [locale, ...slug] = key.split('/');
    thin.add(
      locale === defaultLocale ? `/tags/${slug.join('/')}` : `/${locale}/tags/${slug.join('/')}`,
    );
  }
  return thin;
}

/**
 * Build a map of page path → lastmod ISO date, read from MDX frontmatter
 * (`lastModified` falling back to `date`). Used by the sitemap `serialize`
 * hook so Google gets the one sitemap field it actually trusts for crawl
 * scheduling (Google Search Central docs).
 *
 * Also collects `noindex: true` article paths — pages excluded from search
 * must not appear in the sitemap (rss.xml/llms.txt already filter them; this
 * closes the loop for the third generator).
 *
 * Also builds `coverage`: "category/slug" → locales that REALLY have an MDX
 * for it. The sitemap alternates must mirror the page-level hreflang truth:
 * a /ja/… URL that serves the English fallback declares only `en` in its
 * <head>, so the sitemap must not claim a ja version exists either — Google
 * discards conflicting hreflang clusters, which would silently undo the
 * per-page logic on exactly the duplicated-content URLs that need it most.
 *
 * Plain fs scan at config time — `astro:content` is not importable here.
 */
function buildLastmodMap(
  noindexPaths: Set<string>,
  coverage: Map<string, Set<string>>,
  categoryCoverage: Map<string, Set<string>>,
): Map<string, string> {
  const map = new Map<string, string>();
  const base = path.resolve('./src/content/wiki');
  if (!fs.existsSync(base)) return map;

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(p);
        continue;
      }
      if (!entry.name.endsWith('.mdx')) continue;
      const src = fs.readFileSync(p, 'utf8');
      // Drafts never publish — their dates must not leak into list-page
      // lastmod (would tell Google a page updated that didn't).
      if (/^draft:\s*true\s*$/m.test(src.split('---')[1] ?? '')) continue;
      const fm = src.split('---')[1] ?? '';
      const lm = fm.match(/^lastModified:\s*(.+)$/m)?.[1]?.trim();
      const dt = fm.match(/^date:\s*(.+)$/m)?.[1]?.trim();
      const checked = fm.match(/^\s*checkedAt:\s*(.+)$/m)?.[1]?.trim();
      const timestamps = [dt, lm, checked]
        .map((value) => new Date((value ?? '').replace(/['"]/g, '')).getTime())
        .filter((value) => Number.isFinite(value));
      if (timestamps.length === 0) continue;
      const date = new Date(Math.max(...timestamps));

      // Path relative to the content base → locale/category/slug.
      const rel = path.relative(base, p).replace(/\.mdx$/, '');
      const [loc, cat, ...rest] = rel.split(path.sep);
      const slugPath = rest.join('/');
      const articlePath =
        loc === defaultLocale ? `/${cat}/${slugPath}` : `/${loc}/${cat}/${slugPath}`;
      const noindex = /^noindex:\s*true\s*$/m.test(fm);
      if (noindex) {
        noindexPaths.add(articlePath);
        // The non-default-locale routes of a default-locale noindex article
        // still get built (fallback URLs) and inherit the noindex meta —
        // exclude every prefixed variant too. Skip locales that have their
        // own MDX of this article: that entry's own frontmatter governs its
        // page (it may not be noindex).
        if (loc === defaultLocale) {
          for (const l of locales) {
            if (l === defaultLocale) continue;
            const translated = path.join(base, l, cat, ...rest) + '.mdx';
            if (!fs.existsSync(translated)) noindexPaths.add(`/${l}${articlePath}`);
          }
        }
      }
      map.set(articlePath, date.toISOString());

      if (!noindex) {
        // Only indexable translations participate in hreflang coverage.
        const covKey = `${cat}/${slugPath}`;
        const cov = coverage.get(covKey) ?? new Set<string>();
        cov.add(loc);
        coverage.set(covKey, cov);

        const categoryLocales = categoryCoverage.get(cat) ?? new Set<string>();
        categoryLocales.add(loc);
        categoryCoverage.set(cat, categoryLocales);

        // List pages: newest indexable article in the category wins.
        const listPath = loc === defaultLocale ? `/${cat}` : `/${loc}/${cat}`;
        const existing = map.get(listPath);
        if (!existing || existing < date.toISOString()) {
          map.set(listPath, date.toISOString());
        }
      }
    }
  };
  walk(base);

  // Handbook chapters (docs/handbook/<locale>/<slug>.md) → /landing/docs/<slug>
  // (+ /zh/ prefix). Same frontmatter-driven lastmod contract; the `updated`
  // field is optional, so chapters without it simply keep the default.
  const hb = path.resolve('./docs/handbook');
  if (fs.existsSync(hb)) {
    for (const loc of ['en', 'zh']) {
      const dir = path.join(hb, loc);
      if (!fs.existsSync(dir)) continue;
      for (const entry of fs.readdirSync(dir)) {
        if (!entry.endsWith('.md')) continue;
        const src = fs.readFileSync(path.join(dir, entry), 'utf8');
        const fm = src.split('---')[1] ?? '';
        const iso = fm
          .match(/^updated:\s*(.+)$/m)?.[1]
          ?.trim()
          .replace(/['"]/g, '');
        if (!iso) continue;
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) continue;
        const slug = entry.replace(/\.md$/, '');
        const pagePath = loc === 'en' ? `/landing/docs/${slug}` : `/zh/landing/docs/${slug}`;
        map.set(pagePath, date.toISOString());
        // Hub pages: newest chapter wins.
        const hubPath = loc === 'en' ? '/landing/docs' : '/zh/landing/docs';
        const existing = map.get(hubPath);
        if (!existing || existing < date.toISOString()) {
          map.set(hubPath, date.toISOString());
        }
      }
    }
  }

  return map;
}

const siteOrigin = process.env.SITE_URL || 'https://anvilwiki.pages.dev';

const noindexPaths = new Set<string>();
const localeCoverage = new Map<string, Set<string>>();
const categoryCoverage = new Map<string, Set<string>>();
const lastmodMap = buildLastmodMap(noindexPaths, localeCoverage, categoryCoverage);
const thinTagPaths = buildThinTagPaths();

function isRealLocalizedArticle(pagePath: string): boolean {
  const match = pagePath.match(/^\/([a-z]{2,3})\/([a-z0-9-]+)\/(.+)$/);
  if (!match || !(locales as readonly string[]).includes(match[1])) return true;
  const coverage = localeCoverage.get(`${match[2]}/${match[3]}`);
  return !coverage || coverage.has(match[1]);
}

function isNonEmptyCategory(pagePath: string): boolean {
  const match = pagePath.match(/^\/(?:([a-z]{2,3})\/)?([a-z0-9-]+)$/);
  if (!match || !CONTENT_TYPES.includes(match[2])) return true;
  return lastmodMap.has(pagePath);
}

/**
 * Article/list hreflang alternates that match the page-level <head> truth.
 * Returns sitemap `links` items ({ lang, url }); undefined = no alternates.
 * The locale segment is anchored by its trailing slash — a bare optional
 * ([a-z]{2,3})? would greedily eat the first 3 letters of a category
 * ("bosses" → locale "bos" + category "ses") and silently drop alternates.
 */
function alternatesFor(pagePath: string): Array<{ lang: string; url: string }> | undefined {
  // Article: /<cat>/<slug…> or /<locale>/<cat>/<slug…>
  const art = pagePath.match(/^\/(?:([a-z]{2,3})\/)?([a-z0-9-]+)\/(.+)$/);
  if (art && (locales as readonly string[]).includes(art[1] ?? defaultLocale)) {
    const cov = localeCoverage.get(`${art[2]}/${art[3]}`);
    if (cov) {
      return Array.from(cov).map((l) => ({
        lang: l,
        url: new URL(
          l === defaultLocale ? `/${art[2]}/${art[3]}` : `/${l}/${art[2]}/${art[3]}`,
          siteOrigin,
        ).href,
      }));
    }
  }
  // Category list: only locales with indexable content belong in hreflang.
  const list = pagePath.match(/^\/(?:([a-z]{2,3})\/)?([a-z0-9-]+)$/);
  if (
    list &&
    (locales as readonly string[]).includes(list[1] ?? defaultLocale) &&
    CONTENT_TYPES.includes(list[2])
  ) {
    const coveredLocales = categoryCoverage.get(list[2]);
    if (!coveredLocales) return undefined;
    return Array.from(coveredLocales).map((l) => ({
      lang: l,
      url: new URL(l === defaultLocale ? `/${list[2]}` : `/${l}/${list[2]}`, siteOrigin).href,
    }));
  }
  return undefined;
}

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://anvilwiki.pages.dev',
  output: 'static',
  // Cloudflare Pages redirects directory output (`/about/index.html`) to
  // `/about/`. This template intentionally uses extensionless, no-slash URLs,
  // so emit `/about.html` instead; Pages serves it directly at `/about`.
  // Astro recommends pairing file output with trailingSlash:'never'.
  build: {
    format: 'file',
  },
  trailingSlash: 'never',
  image: {
    // Emit explicit width/height on responsive <Image> output to prevent CLS.
    responsiveStyles: true,
  },
  // Prefetch all internal links on hover — faster page transitions, no
  // View Transitions runtime needed. Adds a small IntersectionObserver script.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  i18n: {
    // Spread to convert readonly tuple to mutable array (Astro's Locales type).
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      // No `i18n` option on purpose: it fabricates hreflang alternates for
      // EVERY locale on EVERY URL, which contradicts the page-level <head>
      // on English-fallback URLs (/ja/… serving English declares only `en`).
      // Alternates are built per-URL in `serialize` from real MDX coverage.
      // noindex articles stay out of the sitemap (self-contradictory signal
      // otherwise — the page asks not to be indexed while the sitemap submits it).
      filter: (url) => {
        const pagePath = decodeURIComponent(new URL(url).pathname).replace(/\/$/, '') || '/';
        return (
          !noindexPaths.has(pagePath) &&
          !thinTagPaths.has(pagePath) &&
          isRealLocalizedArticle(pagePath) &&
          isNonEmptyCategory(pagePath)
        );
      },
      // Inject <lastmod> from article frontmatter (see buildLastmodMap) and
      // hreflang alternates that mirror the page-level truth (see alternatesFor).
      serialize(item) {
        try {
          // Decode: non-ASCII slugs (CJK filenames) come percent-encoded in
          // item.url, while lastmodMap keys are raw filesystem names —
          // without decoding the lookup silently misses.
          const pagePath = decodeURIComponent(new URL(item.url).pathname);
          const lm = lastmodMap.get(pagePath);
          if (lm) item.lastmod = lm;
          // sitemap `links` = hreflang alternates (the lib's own i18n option
          // would fabricate them for every locale on every URL).
          const links = alternatesFor(pagePath);
          if (links) item.links = links;
        } catch {
          /* non-URL entries keep default behavior */
        }
        return item;
      },
    }),
    tailwind({ applyBaseStyles: false }),
    icon(),
  ],
  vite: {
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
});
