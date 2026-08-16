---
title: "Sync Upstream and Contribute Back: Merge Strategy and Release Process"
description: "How to keep absorbing upstream after a fork, the SemVer policy and compatibility promises, and the full process for contributing improvements back to AnvilWiki."
manual: dev
order: 4
icon: lucide:git-merge
tldr: "Add the upstream remote and merge upstream/main regularly: Code-layer conflicts are rare, and in Config/Content conflicts you always keep your own values. Upstream follows SemVer compatibility promises (fields are only added, never renamed; optional features stay off by default). To contribute back: open an issue to discuss, develop on a branch, get CI green, then send a PR."
updated: 2026-08-16
---

## Sync upstream (10 minutes each time)

```bash
# 1. Add the upstream remote (one-time)
git remote add upstream https://github.com/PNGTRID/AnvilWiki.git

# 2. Fetch and merge
git fetch upstream
git merge upstream/main

# 3. On conflicts: always keep your own values in the Config/Content layers
#    (game name, theme colors, copy, articles); take only the upstream Code-layer changes

# 4. The three checks
pnpm check-config && pnpm typecheck && pnpm test
pnpm build && pnpm check-links
```

Why merges are usually clean: new upstream features (components/pages/scripts) land almost entirely in the Code layer — exactly the layer you barely touch. The conflict hotspots (Config/Content) are precisely the areas where you should keep your own values anyway.

**Not syncing is also perfectly fine**: this is a static template, not a runtime dependency — a fork frozen at any version runs forever. We recommend merging at least PATCH releases (security/bug fixes); `git cherry-pick` to select individual commits works too.

## Version policy (SemVer) and compatibility promises

| Version digit | Meaning | Your action |
|---|---|---|
| MAJOR (v2.0) | Breaking change | Follow the migration notes in CHANGELOG |
| MINOR (v1.10 → v1.11) | New feature, off by default / backward compatible | Merge — out-of-the-box behavior is unchanged; opt in when you want it |
| PATCH | Bug fix | Merge directly |

Upstream promises (details in [docs/staying-up-to-date.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/staying-up-to-date.md)):

- frontmatter fields are **added only, never renamed** — old articles always build
- optional features (ads/comments/sponsor/analytics) are all env-gated + off by default; a new version never turns them on for you
- missing keys in a locale JSON fall back to English at runtime; `pnpm check-i18n` lists the upstream-added keys awaiting translation

## Post-sync checklist

```bash
pnpm check-config    # config three-place consistency
pnpm check-i18n      # upstream-added UI keys → translation to-do list
pnpm typecheck && pnpm test && pnpm build
pnpm check-links     # full internal link audit of dist/
```

## Contribute back (turn your improvements into upstream features)

1. **Open an issue to discuss first**: describe the scenario and your approach (avoid colliding with the roadmap; for major designs, check whether [docs/PRD.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/PRD.md) already has an ADR)
2. Develop on a fork branch, following the engineering constraints (copy in JSON / theme colors via var / zero JS runtime)
3. Self-verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
4. Attach verification output to the PR description; after CI is green, wait for review
5. Component/script contributions should come with matching docs (docs/) and tests (pure functions sink into `src/lib/` + vitest)

**Launched a site with AnvilWiki?** Send a PR to add it to the official Showcase (edit the showcase data in `src/config/landing.ts`) — real sites are this template's strongest proof.

## Release process (template maintainer's view)

The full process for cutting a new version of the template itself (good for contributors to know; details in [docs/development.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/development.md)):

```
1. Merge everything into main; the verification checklist is all green
2. Bump the version in three places: package.json / landing.ts PROJECT_VERSION / the EN+CN release announcement copy
3. CHANGELOG.md: turn the Unreleased section into a dated heading + compare link
4. Mark docs/PRD.md §14.2 roadmap items ✅
5. Commits: one feat/fix commit + one git commit --allow-empty -m "chore(release): vX.Y.Z"
6. git push (CI green + Cloudflare Pages auto-deploys)
7. gh release create vX.Y.Z --latest --notes "<EN/CN summary>"
```

> **✅ Acceptance criteria (all must hold)**
> - Command: after merging upstream, the three checks are all green
> - ☐ Every Config-layer conflict kept your own values (confirmed with a diff of each)
> - ☐ New keys listed by check-i18n are translated, or you explicitly accept the English fallback

## Dev manual complete

Three-layer architecture → customization → integrations → syncing: your command of this template is now maintainer-level. Head back to the [learning manual](/landing/docs/monetize-and-grow) weekly rhythm to run your site well, or start scouting the next game for a new site.
