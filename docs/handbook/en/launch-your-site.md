---
title: "Launch a Site in Half an Hour: From Fork to Running Locally"
description: "Fork the repo, install dependencies, and run apply-template to swap the demo site for your game — every CLI prompt explained, plus the top three beginner errors."
manual: learn
order: 2
icon: lucide:rocket
tldr: "Fork, clone, run pnpm install and pnpm dev to see the demo site, then run pnpm apply-template to replace the game name, theme color, locales, and categories in one pass. Run pnpm check-config to verify three-place consistency. The whole process takes about 30 minutes and requires writing zero code."
updated: 2026-08-16
---

## What you will accomplish in this chapter

A complete wiki site for the game you selected, running at `http://localhost:4321` — with your theme color, navigation, multilingual skeleton, and search. The next two chapters (page production, deployment) build on this foundation.

## Step 1: Fork and clone (5 minutes)

```bash
# 1. Fork https://github.com/PNGTRID/AnvilWiki on GitHub to your account

# 2. Clone locally (replace <your-username> with your GitHub username)
git clone https://github.com/<your-username>/AnvilWiki.git
cd AnvilWiki

# 3. Install dependencies (requires Node 22+ and pnpm 11)
pnpm install

# 4. Start the dev server
pnpm dev
# Open http://localhost:4321 — you are looking at the demo site for the fictional game "Anvil Quest"
```

No pnpm? Install it first: `npm install -g pnpm` (or `corepack enable`). Check your Node version with `node -v`; it must be ≥ 22.13.

**Beginner error 1: build script warnings during install.** pnpm 11 requires approval for the esbuild/sharp build scripts; the repo's `pnpm-workspace.yaml` already configures `allowBuilds`, so this normally passes as-is. If you touched that file, restore it.

## Step 2: Run the apply-template CLI to switch to your game (10 minutes)

```bash
pnpm apply-template
```

The interactive CLI asks for each item; here is how to fill everything in:

| Prompt | What to enter | Notes |
|---|---|---|
| Full game name | The full game name (e.g. `Blade Ball`) | Used in titles, SEO, and legal notices |
| Short name | Defaults to an initialism; pressing Enter is fine | PWA/mobile display name |
| Domain | Your domain, e.g. `mygame-wiki.com`; if you don't have one yet, enter `<you>.pages.dev` | Feeds canonical/og:image absolute URLs; **must be the real domain before deploy** |
| Hero tagline | The sub-line under the homepage headline | A one-sentence value proposition |
| Site description | A 40-165 character site description (SEO) | Include the game name and content-type keywords |
| Legal notice | The default template is fine | Disclaimer (unofficial, not affiliated) |
| Official game URL | The game's official site/store page | Used in metadata |
| Theme color | `#rrggbb` hex | The CLI converts to HSL and writes it into `globals.css`; the whole site's palette follows |
| Platform / Developer / Genre | Fill in as appropriate | Used in structured data |
| Release date | Release date (ISO format); can be left empty | Used in structured data |
| Locales | Comma-separated, e.g. `en,zh`; **the first is the default language, en must be included** | English gets no path prefix; other languages are prefixed |
| Categories | Comma-separated lowercase keys, e.g. `codes,guides,bosses` | Common ones: bosses/guides/items/codes/tier-list/characters |
| Clear demo content? | Press Enter (default N) to keep the demo for reference; clear it before deploy | Deletes demo MDX, keeps the directory structure |
| Homepage preset | 1 for a codes-style site (default), 2 for a guides-style site, 3 to keep the demo | Decides the homepage module mix |
| Remove landing page? | Enter (default Y) | /landing is the AnvilWiki project's own site page; your game site doesn't need it |

What the CLI does: rewrites `site.ts`/`navigation.ts`/`routing.ts`/`ui.ts`/`globals.css` (only the 8 theme-color variable lines)/`locales/*.json`/`manifest.json`/`wrangler.toml [vars]`, clears demo authors, and optionally clears demo content and generates one skeleton article per category.

**Don't want to answer item by item?** Preview every change first with `pnpm apply-template --dry-run`. There is also an **Initialize AnvilWiki** workflow (Actions tab, manual trigger), but it only does cleanup (resets wrangler.toml vars, removes the project landing page, optionally clears demo content and opens a PR) — **it does not replace the game name, theme color, or locales**; full initialization still means running the CLI locally.

**Beginner error 2: build fails after editing config, complaining about category key mismatch.** Category keys must stay consistent in three places (the CLI guarantees this for you): the `NAVIGATION_CONFIG[].key` in `navigation.ts` = `nav.<key>` in `en.json` = the directory name under `src/content/wiki/en/<key>/`. Editing config by hand is an advanced move; see [docs/apply-template.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/apply-template.md).

## Step 3: Self-check + preview (5 minutes)

```bash
pnpm check-config   # category/locale three-place consistency
pnpm build          # full validation (schema + types + build)
pnpm dev            # visual acceptance check
```

**Beginner error 3: `astro build` fails with a SITE_URL format error.** `SITE_URL` must include the `https://` protocol; a bare domain fails the build. The CLI writes it correctly — don't strip the protocol if you edit `wrangler.toml` by hand.

Local checklist:

- ☐ The homepage shows your game's name and theme color (not Anvil Quest/orange)
- ☐ Navigation shows only the categories you chose
- ☐ The browser tab title is correct
- ☐ The layout holds up at mobile widths (switch device emulation in DevTools)

## A wrangler.toml heads-up (know it now, skip the trap in the deploy chapter)

When the repo's `wrangler.toml` exists, it is the **single source of truth** for Cloudflare Pages env, and the dashboard's Environment variables UI is ignored entirely. The CLI has already reset its `[vars]` to your configuration; before configuring ad/analytics variables in the dashboard later, read the two-way strategy in the [deployment chapter](/landing/docs/deploy-and-get-indexed).

> **✅ Acceptance criteria (all must hold)**
> - Commands: `pnpm check-config && pnpm build` → all green
> - Pages: `pnpm dev`, open localhost:4321 — game name/theme color/categories are all yours
> - ☐ Git shows the files the CLI changed (config layer), and `git diff` touched nothing unexpected in src/pages, src/components
> - ☐ The Domain field is confirmed (a pages.dev placeholder is fine until you have a real domain)

## Next steps

The site shell exists, but the content is still demo (or empty). The next chapter is the heart of the whole methodology: have AI produce 10 build-passing, search-intent-shaped pages in a single day — complete prompts included.
