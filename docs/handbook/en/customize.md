---
title: "Dev 2 · The Customization Handbook: Categories, Languages, Theme, Homepage Copy"
description: "Add a category, add a language, change the theme, edit homepage copy: step-by-step recipes with three-place consistency checks and a copyable AI prompt for each."
manual: dev
order: 2
icon: lucide:palette
tldr: "Four requests, four recipes. Add a category: config, locale JSON, and content directory agree in three places. Add a language: scaffold with pnpm new-locale, then AI translates against the English file. Change the theme: 8 lines at the top of globals.css, light and dark together — skip half and text keeps the old hue. Homepage copy lives only in the JSON's home section. Verify with pnpm check-config && pnpm build."
updated: 2026-08-17
---

## Where you are now and what this chapter solves

Sooner or later after launch you'll want to add a weapons category, ship a Japanese version, switch the color scheme, or rework the homepage pitch. This chapter turns each of those four tasks into a fixed recipe — follow it and you can't go wrong.

**This chapter is a lookup manual: jump to the section you need; no need to read in order.**

## Task 1: Add a navigation category (e.g. "weapons")

You met the category rule in the architecture chapter: **three-place consistency, no place optional**. Adding `weapons`:

```bash
# 1. Content directory (create the directory first, then add the first article)
mkdir -p src/content/wiki/en/weapons

# 2. Config: add to src/config/navigation.ts following the existing entries' style
#    { key: 'weapons', icon: 'lucide:sword' }

# 3. Locale: add nav.weapons (navigation label) to src/locales/en.json
#    and overview.weapons (list page title and description)
```

Then run `pnpm check-config` (three-place consistency) + `pnpm build` (format check). The other languages' JSONs need the same key too (missing it won't break anything — the UI falls back to English — but `pnpm check-i18n` will list it to remind you).

Delegate to AI (copy the whole block, replace `weapons` with your category name):

```text
Add a new category "weapons" to the site. Change all three places consistently:
1. Add { key: 'weapons', icon: 'lucide:sword' } to src/config/navigation.ts, following the style of existing entries
2. Add nav.weapons and overview.weapons to src/locales/en.json, matching the copy style of existing categories
3. Create a skeleton article under src/content/wiki/en/weapons/ (schema-valid frontmatter, draft: true)
Also add the key to every other existing language's JSON. When finished, run pnpm check-config && pnpm build — only all-green counts as done.
```

## Task 2: Add a language (Japanese as the example)

Language three-place consistency: the language list config = the locale JSON files = the content directories.

```bash
# Step 1: run the scaffold (it asks for the language code, e.g. ja) — it generates the JSON skeleton and the content directory
pnpm new-locale
```

Step 2 — have AI translate the interface text (copy the whole block):

```text
I just added <language-code> with pnpm new-locale. Translate that language file:
translate src/locales/<language-code>.json key by key against src/locales/en.json;
do not add or remove keys; keep category keys consistent with navigation.ts.
Run pnpm check-config && pnpm check-i18n to verify — only all-green counts as done.
```

Step 3 — translate the articles (one at a time):

```text
Translate src/content/wiki/en/<category>/<slug>.mdx into <target-language> and
write it to the same path under src/content/wiki/<target-language>/. Rules: translate only
title/description/summary and the body; leave slug, dates, internal link paths, and the
code field of codes entries untouched; keep tags in English when no equivalent exists;
draft a glossary first so terminology stays consistent throughout. When done, run
pnpm check-content && pnpm build && pnpm check-i18n — only all-green counts as done.
```

Note: the codes themselves (the `code` field) are never translated — they are alphanumeric strings shared worldwide.

**The language switcher only lists languages that really have content** — while Japanese has zero articles, Japanese won't appear in the switcher. This prevents tap-into-a-blank-page moments.

## Task 3: Change the theme color (5 minutes)

Edit only the top **8 lines** of `src/styles/globals.css` (4 variables × light/dark):

```css
:root { --brand: hsl(...); --brand-light: hsl(...); --brand-h: ...; --brand-s: ...%; }
.dark { --brand: hsl(...); --brand-light: hsl(...); --brand-h: ...; --brand-s: ...%; }
```

Why all 8 lines go together: the text-safe color `--brand-text` is computed automatically from `--brand-h` (hue) and `--brand-s` (saturation) — replace only the first two variables and text colors keep the old hue; the whole site looks "dirty". Can't convert a hex code to HSL? Have AI do it, or run the recolor step of `pnpm apply-template` (it handles all 8 lines automatically). After changing, check contrast once in light mode and once in dark mode.

## Task 4: Edit homepage copy

Every block of homepage text (hero headline, quick links, featured, FAQ, changelog) lives in the `home.*` section of the locale JSON — **editing copy touches zero component code**. Have AI draft it (copy the whole block):

```text
Rewrite the homepage copy. Game: <game name>; selling point: <one-liner>; target players: <description>.
Only edit the site/homepage copy fields in src/locales/ (site.ts and home.*); do not touch component code.
Give me 3 versions of each string to choose from, each close to the current field length (to avoid breaking layout).
After I pick, apply the replacements and run pnpm build to verify — only all-green counts as done.
```

The "close to current length" rule is deliberate: the homepage layout is designed around the current text lengths — copy that suddenly doubles will blow the layout apart.

## Advanced: add a new field to the article registration card

Want to hang new data on articles (a new stat card, say)? The flow: add a Zod field in `src/content.config.ts` → consume it in a component → verify with `pnpm build`. Iron rule: **fields are only added, never renamed** — renaming retires every old article on the site. Once the field exists, write its rules into the Requirements section of your page-production prompt, and AI will carry it from then on.

## If you get stuck

- **"check-config reports a category mismatch"**: its output names exactly which of the three places doesn't line up — fill in what's missing.
- **"The build broke after translating articles into the new language"**: nine times out of ten a registration-card field got mangled during translation (a stray period in a date, that kind of thing); look at the exact file and line in the build error.
- **"Some spots kept the old color after recoloring"**: odds are you changed 4 lines instead of 8, or missed the `.dark` set.

## ✅ Acceptance criteria (check the tasks you did)

- ☐ Added a category: `pnpm check-config && pnpm build` all green, the new category shows in navigation with a non-empty list
- ☐ Added a language: `pnpm check-i18n` reports nothing missing, the new language appears in the switcher
- ☐ Changed the theme: checked both light and dark modes, no old hue left in text colors
- ☐ Edited copy: `pnpm build` all green, homepage layout not blown apart

## Next steps

Ads, comments, analytics, CI gates, security — [Dev 3 · integrations and engineering](/landing/docs/integrations): the full table of toggle variables and the mechanics behind them.
