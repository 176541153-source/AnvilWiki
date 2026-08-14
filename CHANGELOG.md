# Changelog

All notable changes to AnvilWiki are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] — 2026-08-15

**AnvilWiki v1.2 — 专家团审计落地版:项目官网 + 阅读体验 + AI 搜索卡位 + 隐私合规。**

This release lands the findings of a 4-expert audit (SEO/growth · developer experience · reader UX · competitive analysis): a project landing page, wiki-grade reading infrastructure (scrollspy, boss data cards, mobile fixes), AI-search visibility (llms.txt, RSS), and consent-gated analytics.

### Added
- **Project landing page (`/landing`)**: 7-section marketing page introducing the AnvilWiki template itself (Hero with "100% ad revenue" positioning · Lighthouse proof bar · feature grid · comparison table vs Fandom/Starlight/DIY · showcase · docs entry · final CTA). Self-contained in `src/components/landing/` + `src/config/landing.ts`. `apply-template` CLI removes it automatically for fork users (`--keep-landing` to keep).
- **RSS feed (`/rss.xml`)**: default-locale articles, newest first, capped at 50, excludes `noindex`. `<link rel="alternate">` auto-discovery in `BaseLayout`. Uses the already-installed `@astrojs/rss`.
- **llms.txt (`/llms.txt`)**: Markdown site index for AI crawlers (ChatGPT/Perplexity/Claude), generated at build time from the content collection.
- **TOC scrollspy**: the in-view section's TOC link is highlighted while scrolling (pure IntersectionObserver, zero framework runtime).
- **Share button on articles**: native `navigator.share` sheet with clipboard fallback; labels via locale JSON (en/ja).
- **Back-to-top button**: appears after 600px of scroll on article pages.
- **Boss stat card**: optional structured `boss` frontmatter object (hp / weakness / resistant / location / recommendedLevel) rendered as a scannable data card above the article body (`BossStatCard.astro`). Demo boss guides filled in (en + ja).
- **`pnpm check-config`**: cross-validates nav-key / locale / displayType three-place consistency (AGENTS.md rules #4–#5) that `pnpm build` does not enforce.
- **Cookie consent (consent-gated tracking)**: GA / AdSense are no longer injected statically — they load only after the visitor accepts. Choice persists in localStorage; declining means trackers never load. Banner only renders when tracking env vars are set (zero-JS contract unchanged).
- Related-articles cards now show the description (line-clamp-2).

### Changed
- **Ads system rebuilt as Google AdSense-only**. Removed the iframe isolation ad setup (`public/ads/*.html`, `AdBanner.astro`, 7 `PUBLIC_AD_*` env vars) in favor of a streamlined AdSense integration. Ads now use 3 positions (Sticky / Sidebar / InContent), each an `<AdSenseSlot position="...">` component gated on `PUBLIC_ADSENSE_CLIENT` + one slot ID env var. The Sticky banner keeps its dismiss button + localStorage logic. Empty env = no ads rendered (Lighthouse 4×100 contract preserved). See PRD §10 for details.
- **Sticky banner is desktop-only by default** (`hidden md:block`): a 320×50 strip under the header permanently eats ~16% of a phone's first screen — a proven bounce driver. Remove the class to re-enable mobile.
- **sitemap `<lastmod>` injection**: article/list URLs now carry `lastModified ?? date` from frontmatter (the only sitemap field Google trusts for crawl scheduling).
- **Static asset caching**: `/_astro/*` served with `Cache-Control: public, max-age=31536000, immutable`.
- Mobile menu now includes the language switcher (was navigation-only — non-English readers couldn't switch on phones).

### Fixed
- **Third-locale forks fully 404**: five `getStaticPaths` implementations hardcoded `['ja']` while the CLI accepts any locale list — adding a 3rd language killed every route. All now derive from the `locales` array in `routing.ts`.
- **SearchAction pointed at a nonexistent `/search` route** (Pagefind is a client-side modal) — removed from `websiteJsonLd()`.
- **`noindex` frontmatter was never wired up** — now emits `<meta name="robots" content="noindex, nofollow">` via `BaseLayout`.
- **Cover-image docs contradicted the schema**: docs said "path under `/public`", but the Zod `image()` helper expects a path relative to the MDX (Astro Image pipeline). Docs unified.
- **Node version docs said 20** — pnpm 11 requires ≥22.13. CONTRIBUTING.md / deployment.md now say 22.
- **RSS links 404'd**: `@astrojs/rss` appends a trailing slash to relative links, but this site uses `trailingSlash: 'never'` — now passed absolute URLs.
- **GFM tables overflowed on mobile**: `.prose table` is now a scrollable block site-wide.

### Removed
- `public/ads/` directory (6 standalone ad HTML files) and `src/components/ads/AdBanner.astro` (iframe wrapper component).
- 7 `PUBLIC_AD_*` env vars (`PUBLIC_AD_MOBILE_320X50`, `PUBLIC_AD_SIDEBAR_160X300/600`, `PUBLIC_AD_BANNER_300X250/728X90/468X60`, `PUBLIC_AD_NATIVE_BANNER`).

## [1.1.0] — 2026-08-14

**AnvilWiki v1.1 — SEO & E-E-A-T 增强版。**

This release adds AI-Overview-oriented SEO features (TOC, Quick Answer, author byline, VideoGame JSON-LD) and broadens ad support (Google AdSense alongside the iframe ad isolation). Includes a round of naming normalization to keep config/locales schema generic (no demo-game-specific terms).

### Added
- **Article TOC**: Auto-generated table of contents from H2/H3 headings. Sticky on desktop, collapsible `<details>` on mobile (`TableOfContents.astro`).
- **Quick Answer summary block**: Optional `summary` frontmatter field rendered as a callout above the article body — optimized for AI Overviews and featured snippets.
- **Article author byline**: Optional `author` frontmatter field (falls back to `site.defaultAuthor`). E-E-A-T signal.
- **VideoGame JSON-LD**: Injected on the homepage for game entity recognition (`videoGameJsonLd()` in `seo.ts`).
- **Contact page**: New legal page at `/contact` with community links. E-E-A-T trust signal.
- **Google AdSense support**: `AdSenseSlot.astro` component + `PUBLIC_ADSENSE_CLIENT` env var. Coexists with the iframe ad isolation setup.

### Changed
- Homepage `displayType` enum renamed to generic names (`code-cards`→`badge-list`, etc.).
- CSS theme variable renamed: `--nav-theme` → `--brand`.
- Homepage JSON field names renamed (`eyebrow`→`badge`, `primaryCta`→`ctaPrimary`, etc.).
- Demo boss renamed: `gelum`→`emberfang`, `pyra`→`stormcaller`.
- `skinning.md` → `apply-template.md` (restructured as file-organized config reference).
- Ad HTML templates: ad network domain changed to placeholder.
- SEO docs: all knowledge claims cite public authoritative sources.

## [1.0.0] — 2026-08-13

**AnvilWiki v1.0 — 正式发布 / First stable release.**

This release covers everything since v0.2.0: the full PRD roadmap (v1.1–v2.0) is now ✅, the demo site ships Lighthouse 4×100, and optional features (search, ads, comments, image optimization, apply-template CLI) are all production-ready.

### Added
- **Comments system (Giscus, opt-in)**: `Comments.astro` component, env-gated (default off = zero JS, preserves Lighthouse 4×100). Official `<script async data-loading="lazy">` + dual MutationObserver dark-mode sync via postMessage. pathname mapping → different locales get independent threads. `data-lang` follows page locale. See `docs/comments.md`.
- Image `decoding="async"` + explicit `width`/`height` to prevent CLS (ListPage covers, VideoSection thumbnails)
- FAQ accessibility: `aria-expanded` sync on toggle + `data-faq-group` container
- WikiSidebar now visible on tablet (md breakpoint, was lg-only)
- Migration cost breakdown in `docs/migration-from-nextjs.md` (2-hour estimate per site)

### Changed
- PRD status updated: "设计中 · 待 review" → "已实现"
- PRD §14.2: v1.1 (frontmatter migration guide) marked as done
- PRD §14.2: v1.4 (Giscus comments) marked as done — `Comments.astro` env-gated, default off
- AGENTS.md: Hard Rule 9 now requires `SITE_URL` to include `https://` protocol (bare domain fails Astro build with `Invalid url`)
- AGENTS.md: added Hard Rule 11 (comments env-empty = null render contract)
- AGENTS.md: added Hard Rule 12 (`wrangler.toml` 接管 Cloudflare Pages env — dashboard env vars ignored when this file exists)
- Demo `home.hero.videoId` cleared (was placeholder)

### Fixed
- **Cloudflare Pages env injection**: `wrangler.toml` was missing the `[vars]` section, so the build process received ZERO env vars (including `SITE_URL` and all `PUBLIC_GISCUS_*`). Root cause: when `wrangler.toml` exists for a Pages project, it becomes the sole source of truth and the dashboard's "Environment variables" UI is ignored ([Cloudflare docs](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)). Fix: declare all build-time env vars in `[vars]`. This bug was previously masked because `process.env.SITE_URL || 'https://...'` fallback in `astro.config.ts` covered for the missing env.
- **`SITE_URL` protocol requirement**: now enforced — bare domain `anvilwiki.pages.dev` fails Astro build with `Invalid url`. `.env.example` was already correct (`https://...`), but the Cloudflare dashboard config had a bare domain. Documented in AGENTS.md Hard Rule 9 + `docs/deployment.md`.

## [0.2.0] — 2026-08-12

### Added
- `scripts/check-sitemap.ts` — verifies every sitemap URL returns 200
- `scripts/new-post.ts` — interactive MDX article scaffold
- `docs/content-format.md` — frontmatter format spec + migration guide from JS metadata format
- ESLint flat config (`eslint.config.js`) + Prettier config (`.prettierrc` + `.prettierignore`)
- `VideoSection` component — lazy-loaded YouTube embed (zero JS until click)
- `WikiSidebar` component — dynamic article navigation (auto-generated from MDX files)
- `TrendingNow` component — horizontal scroll-snap card row
- `InContentAd` component — page-internal ad slot
- Ad integration: `StickyBanner` in LocaleLayout, `SidebarAd` in WikiSidebar, `InContentAd` in ArticlePage
- Google Analytics + Search Console verification injection (env-var gated)
- CI workflow (`.github/workflows/ci.yml`) — lint + typecheck + build on every PR
- Issue templates (bug report + feature request) and PR template
- `CONTRIBUTING.md`
- `wrangler.toml` for local Cloudflare preview

## [0.1.0] — 2026-08-11

### Added
- Initial public release
- Astro 5 static site (`output: 'static'`, zero adapter, Cloudflare Pages native)
- Content Layer API + Zod schema for type-safe MDX articles
- i18n: as-needed prefix (English no prefix, others prefixed) with single-article English fallback
- Homepage: 8 JSON-driven modules with 4 displayTypes (badge-list / steps / ranked-grid / labeled-cards)
- SEO: Organization / WebSite / Article / BreadcrumbList / ItemList / FAQPage JSON-LD, hreflang, dynamic sitemap, robots.txt
- Theme: CSS variable theming (4 lines to re-theme) + dark mode with no-FOUC
- Ads: 广告 iframe isolation (6 slots), Sticky 320×50 with dismiss button, env-var gated
- Legal pages: about / privacy-policy / terms-of-service / copyright
- Demo content: fictional "Anvil Quest" game (5 MDX articles, en + ja)
- Docs: PRD (1600+ lines), deployment, apply-template (4-step guide), content-format, seo, ads, migration-from-nextjs
- Build: 27 pages, typecheck 0 errors

[Unreleased]: https://github.com/PNGTRID/AnvilWiki/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/PNGTRID/AnvilWiki/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/PNGTRID/AnvilWiki/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/PNGTRID/AnvilWiki/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/PNGTRID/AnvilWiki/releases/tag/v0.1.0
