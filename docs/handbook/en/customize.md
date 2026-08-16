---
title: "Customization SOP: Categories, Languages, Theme, and Homepage"
description: "Add categories, languages, theme colors, and homepage copy: commands, three-place consistency checks, and AI prompt templates for every step."
manual: dev
order: 2
icon: lucide:palette
tldr: "Adding a category means three-place consistency (navigation.ts + locale JSON + content directory). Adding a language: run pnpm new-locale first, then let AI translate the JSON and articles. Theme colors are just 4 lines in globals.css. All homepage copy lives in the home.* section of the locale JSON. Every step has a companion prompt to delegate to AI."
updated: 2026-08-16
---

## Add a navigation category (10 minutes)

Taking `weapons` as the example — all three places must line up:

```bash
# 1. Content directory (create a skeleton article, otherwise the list page is empty)
mkdir -p src/content/wiki/en/weapons
# Create the first article (or use /anvil-new-article)

# 2. navigation.ts: add { key: 'weapons', icon: 'lucide:sword' } to NAVIGATION_CONFIG

# 3. src/locales/en.json: nav.weapons + overview.weapons (list page title/description)
```

Then run `pnpm check-config` to verify three-place consistency and `pnpm build` to validate against the schema. Add the key to the other languages' JSON as well (a missing key falls back to English at runtime, but `pnpm check-i18n` will list it).

Delegate to AI:

```text
Add a new category "weapons" to the site. Change all three places consistently:
1. Add { key: 'weapons', icon: 'lucide:sword' } to src/config/navigation.ts, matching the style of existing entries
2. Add nav.weapons and overview.weapons to src/locales/en.json, matching the copy style of existing categories
3. Create a skeleton article in src/content/wiki/en/weapons/ with schema-valid frontmatter and draft: true
Also add the new key to the JSON of every other existing language. When finished, run pnpm check-config && pnpm build — only all-green counts as done.
```

## Add a language (30 minutes)

Three-place consistency: `locales` in `src/i18n/routing.ts` = `src/locales/*.json` = `src/content/<locale>/`.

```bash
# 1. Scaffold (generates the JSON skeleton + content directory)
pnpm new-locale
# Enter the language code when prompted, e.g. ja

# 2. Have AI translate the UI JSON
```

UI translation prompt:

```text
I just added <language-code> with pnpm new-locale. Translate that language file:
translate src/locales/<language-code>.json key by key against src/locales/en.json.
Do not add or remove keys; keep category keys consistent with navigation.ts.
Run pnpm check-config && pnpm check-i18n to verify — only all-green counts as done.
```

Article translation prompt (per article):

```text
Translate src/content/wiki/en/<category>/<slug>.mdx into <target-language> and
write it to the same path under src/content/wiki/<target-language>/. Rules: translate
only title/description/summary and the body; leave slug, dates, internal link paths,
and the code field of codes entries untouched; keep tags in English when no equivalent
exists; draft a glossary first to keep terminology consistent throughout. When done, run
pnpm check-content && pnpm build && pnpm check-i18n — only all-green counts as done.
```

**The language switcher only lists languages that already have content** — a new language with no articles won't appear in the switcher (prevents 404s).

## Change the theme colors (2 minutes)

Edit only the 4 lines at the top of `src/styles/globals.css`:

```css
:root { --brand: hsl(...); --brand-light: hsl(...); }
.dark { --brand: hsl(...); --brand-light: hsl(...); }
```

Components across the site reference `var(--brand)`; hard-coded hex is not allowed. Hex to HSL: the theme-color step of `pnpm apply-template` converts automatically, or use any online tool. At fork time the CLI does it in one step (see the site launch chapter).

## Edit homepage copy and modules

The homepage is driven entirely by the `home.*` section of `src/locales/<locale>.json` (hero/start/explore/faq/updates) — change copy, not components. Have AI draft it:

```text
Rewrite the homepage copy. Game: <game name>; selling point: <one-liner>; target players: <description>.
Only edit the site/homepage copy fields in src/locales/ (site.ts and home.*); do not touch component code.
Give me 3 versions of each string to choose from, each close to the current field length (to avoid breaking layout).
After I pick, apply the replacements and run pnpm build to verify — only all-green counts as done.
```

Reordering or adding/removing modules is a Config-layer structural change; see the homepage presets in [docs/apply-template.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md) (codes-style / guides-style).

## Extend frontmatter fields (advanced)

To add structured data to articles (a new data card, for example): add a Zod field in `src/content.config.ts` → consume it in a component → validate with `pnpm build`. Fields are **added only, never renamed** (a backward-compatibility promise: old articles always build). Once added, have AI produce pages with the new field, and put the field documentation in the Requirements section of your prompt.

> **✅ Acceptance criteria (all must hold)**
> - Command: `pnpm check-config && pnpm check-i18n && pnpm build` → all green
> - Page: the new category/language is visible in the navigation and language switcher, and its list page is non-empty
> - ☐ Translations are filled in for every new key (check-i18n reports nothing missing)
> - ☐ Contrast checked in both light and dark modes after changing theme colors

## Next steps

Ads, comments, analytics, CI — the [integrations and engineering chapter](/landing/docs/integrations) covers the env-gated mechanism behind them all, plus the full configuration table.
