---
title: "Dev Manual · Architecture Overview: Three-Layer Separation and the Change Map"
description: "AnvilWiki's code/config/content three-layer separation, the decision tree for every change, the data flow, and the six Astro 5 gotchas to avoid after forking."
manual: dev
order: 1
icon: lucide:layers
tldr: "Three-layer separation is the foundation of every architecture decision: the Code layer (src/pages, components, lib) is almost never touched after forking; the Config layer (src/config, locales, globals.css) changes once per game; the Content layer changes with every article. Locate each change with the decision tree first, then finish with the three checks."
updated: 2026-08-16
---

## Why read this chapter first

Every design decision in AnvilWiki serves one goal: **fork users change content without touching the framework, change configuration without rewriting the framework, and the framework layer carries zero game-specific strings**. Once you understand the code/config/content three-layer separation, you know where each of your changes belongs — and whether it will be wiped out the next time you sync upstream.

## The three-layer map

| Layer | Directories | Will you touch it after forking | Merge conflict likelihood |
|---|---|---|---|
| **Code** | `src/pages` `src/components` `src/lib` `src/i18n` | Almost never | Low |
| **Config** | `src/config` `src/locales` `src/styles/globals.css` `wrangler.toml` `astro.config.ts` `public/` | Definitely | **High (expected)** |
| **Content** | `src/content/wiki`, the home data in `src/locales/<loc>.json` | Fully replaced | High (expected) |

The governing rules: changing content must not touch the framework; changing config must not rewrite the framework; the framework layer must contain no game-specific strings (all UI copy lives in `src/locales/<locale>.json`).

## The change decision tree

```
What do you want to change?
├─ Copy / labels / homepage modules → src/locales/<locale>.json (UI copy)
│                                      src/locales/<locale>.json home.* (homepage modules)
├─ Game name / domain / author       → src/config/site.ts
├─ Navigation categories             → src/config/navigation.ts + en.json nav.<key> + content dirs (three-place consistency!)
├─ Theme colors                      → src/styles/globals.css --brand/--brand-light (4 lines total)
├─ Language list                     → src/i18n/routing.ts + locales JSON + content dirs (three-place consistency!)
├─ Article content                   → src/content/wiki/<locale>/<category>/*.mdx
├─ New components / new pages        → src/components / src/pages (Code layer — weigh the upstream sync cost)
└─ env toggles (ads/comments/analytics) → wrangler.toml [vars] or dashboard (pick one)
```

Two iron rules of three-place consistency (both validated automatically by `pnpm check-config`):

1. Category keys: `NAVIGATION_CONFIG[].key` in `navigation.ts` = `nav.<key>` in `en.json` = the `src/content/<locale>/<key>/` directory name
2. Languages: `locales` in `routing.ts` = the `src/locales/*.json` files = the `src/content/<locale>/` directories

## Data flow of a page request (at static build time)

```
MDX frontmatter → Zod schema validation (src/content.config.ts; invalid data fails the build)
    → getCollection() fetches the collection (i18n fallback: detail pages fall back to English, list pages do not)
    → getStaticPaths() generates the static routes
    → Astro components render → pure HTML in dist/
postbuild → Pagefind indexes the body text → search with zero runtime
```

Multilingual rules (**an intentional asymmetry**): when the requested language version of an article doesn't exist, the detail page falls back to English (direct URLs never 404); list pages never fall back (they never show content that doesn't exist).

## Six Astro 5 gotchas (field-tested; full version in AGENTS.md)

1. `entry.id` includes `.mdx`, but `getEntry()` doesn't want the extension — `parseEntryId` handles this uniformly
2. `entry.render()` doesn't exist in the Content Layer API — use the standalone `render()` function
3. `getStaticPaths` compiles into its own module, and top-level `const` in the file are invisible to it — inline the data into the function body
4. Read rest params from `Astro.params.slug`, not `Astro.props.slug`
5. Content placed directly under `src/content/<locale>/` triggers legacy auto-collection — it must live under `src/content/wiki/<locale>/`
6. `prefixDefaultLocale: false` means the English site lives at the root (`/`) — don't add a `/` → `/en/` redirect

## Engineering constraints quick reference

- All UI copy lives in JSON; components contain zero hard-coded text
- Theme colors are only the 4 lines of `--brand`/`--brand-light`; components reference only `var(--brand)`
- og:image and other social cards use absolute paths (`${SITE_URL}/...`)
- Domains come from the `SITE_URL` env, which must include `https://`
- Empty ad/comment env values render nothing (the out-of-the-box Lighthouse 4×100 contract)
- No emoji in the UI; icons come from lucide (`astro-icon` or inline SVG)

## The three checks (after every change)

```bash
pnpm check-config        # three-place consistency
pnpm typecheck           # astro check, 0 errors
pnpm build && pnpm check-links   # schema + build + internal link reconciliation
```

If you changed pure functions (`src/lib/`), also run `pnpm test`; if you changed content, also run `pnpm check-content`.

## Design rationale in depth

The "why behind every module" lives in [docs/PRD.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/PRD.md) (15 chapters + 3 appendices, the single source of truth); contributor-level detail (release process / SemVer) is in the [sync-and-contribute chapter](/landing/docs/sync-and-contribute).

> **✅ Acceptance criteria (all must hold)**
> - ☐ For any change request, you can name which layer and which files it belongs to within 30 seconds
> - ☐ You understand what each of the two three-place consistency rules covers
> - ☐ The three checks pass locally, all green

## Next steps

Continue to the [customization chapter](/landing/docs/customize): add categories, add languages, change the theme, edit the homepage — the SOP and companion AI prompts for every step.
