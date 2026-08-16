---
title: "The First-Day 10 Pages: Content Production via AI Conversation"
description: "Prompts that have AI produce guide, codes, and tier list pages that pass build validation — how to feed materials, per-page checks, and what never to let AI do."
manual: learn
order: 3
icon: lucide:bot
tldr: "Open the repo with your AI agent and say \"write a guide from these notes\" — it auto-loads the repo's content rules and produces MDX pages that pass pnpm check-content && pnpm build. Disciplines: materials first in prompts, verify each page independently, mark missing data [to be added] rather than inventing it, unverified content gets draft: true."
updated: 2026-08-16
---

## Prerequisites for this workflow

Open **the repository root** with ZCode / Claude Code / Codex / Cursor and chat from there. The AI automatically loads:

- `AGENTS.md` — the hard content rules (frontmatter field constraints, component vocabulary, verification commands)
- `.agent/skills/` — 3 skills (Agent Skills open standard; supporting tools discover them automatically)
- `src/content.config.ts` — the Zod schema; invalid frontmatter fails the build outright

On skill-capable tools, prefer the slash commands (rules and verification are baked in): `/anvil-new-article` (any material → page), `/anvil-update-codes` (codes update), `/anvil-refresh` (freshness audit). The raw prompts below are the equivalent for environments without skills.

**Core discipline: source material is the first-class citizen of the prompt.** Vague instructions ("write a good guide") force the AI to fabricate. Write only as much content as your materials support, and for anything missing, have the AI put together a list and ask you.

## Prompt 1: a single guide (spoken notes → article)

How it works: play the game yourself for an hour, jotting down points as you go (mechanics, numbers, positioning) — even fragmentary notes count. Then:

```text
Turn the notes below into a guide page (on skill-capable tools, /anvil-new-article works directly).
**Input:**
Game/Boss: <name>
Notes: <spoken notes, mechanic observations, numbers — as much as you captured>
**Task:**
Follow the AGENTS.md content rules; read docs/content-format.md and src/content.config.ts first.
Frontmatter: title ≤80 characters and includes the game name; description 40–165 characters; summary a 40–60 word direct answer;
category uses an existing key from navigation.ts; reuse existing tags; unverified content gets draft: true.
Body: no H1; question-shaped H2s with the answer in the first paragraph; numbers go into tables; use the Callout/Accordion/StatBar components.
Never fabricate numbers — write [to be added] for missing data and give me a separate list of what you need.
When done, run pnpm check-content && pnpm build; only all-green counts as complete. Fix failures and rerun.
```

The **verification clause** at the end is part of the template: any prompt that writes files must embed it, so the AI runs the gates itself after producing output — only all-green counts as delivered.

## Prompt 2: first build of the codes page (redemption-code list → structured page)

The codes page is the highest-traffic page type. Redemption-code data **may only come from a list you provide**:

```text
Create a codes page for <game name> (category: codes, slug: all-codes).
Codes may come only from the list below — not a single one may be invented or "inferred":
<code | reward | expiry | source>
Write all data into the frontmatter codes array (code/reward/status/expiryDate/source);
the body covers how-to-redeem steps + FAQ (question-shaped H2s); the title includes year and month.
When done, run pnpm check-content && pnpm build; only all-green counts as complete.
```

Where the list comes from: official social media/Discord/developer streams. **A single fabricated code can destroy your site's trust** — this is the hardest red line in the entire manual.

## Prompt 3: tier list (your ratings → ranking page)

```text
Write a tier list page from my ratings.
**Input:** <character/gear list + my ranking rationale>
Requirements: table-first, one conclusive reason per row; flag contested placements with a Callout warn noting version sensitivity;
add gameVersion to frontmatter; mark untested entries [to be added] or make the whole page draft: true — no fabrication.
When done, run pnpm check-content && pnpm build; only all-green counts as complete.
```

## Per-page acceptance (the three checks)

**Verify each page on its own — do not produce 10 and check them in one batch. Batching = errors accumulating in batches.**

> **✅ Acceptance criteria (all must hold)**
> - Commands: `pnpm check-content && pnpm build` → 0 errors
> - Page: open it via `pnpm dev` — the H1 matches the frontmatter title, the Quick Answer card renders, tables swipe horizontally on mobile
> - ☐ The five frontmatter fields (title/description/category/tags/summary) checked line by line against the field table in [docs/content-format.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/content-format.md)
> - ☐ If the AI produced a "to be added" list, you supply the data and rerun verification

## Anti-patterns (do not do these)

1. **Letting AI fabricate codes/numbers/drop rates.** The correct move: the AI maintains a "to be added" list and asks you for data.
2. **Producing 10 pages at once without verifying each one.**
3. **Bypassing the draft flow.** Unverified content must carry `draft: true` (visible in dev, excluded from build) and go live only after confirmation.
4. **Inventing new categories/tags.** It breaks three-place consistency; reuse the existing tag vocabulary first.
5. **Having AI edit component code to fulfill copy needs.** Copy belongs in config/locales; the code layer should not change after forking.
6. **Hand-editing dist/ or skipping git.** Build output never enters version control; every change goes through source files + commits.

## Multiple languages (optional — not on day one)

Get the English site working first; when you want another language, use the translation prompt in the developer manual's [customization chapter](/landing/docs/customize) for articles.

> **✅ Acceptance criteria (the chapter as a whole)**
> - The site holds 8-10 build-passing articles and the demo content is gone (rerun `pnpm apply-template` and choose to clear, or manually delete the demo files under `src/content/wiki/en/`)
> - `pnpm build` all green, and `git log` shows one commit per article (easy rollback)

## Next steps

Content is ready — time to let Google see it. Next chapter: deploy to Cloudflare Pages (free unlimited bandwidth) + the day-one SEO actions (GSC verification, sitemap submission, requesting indexing).
