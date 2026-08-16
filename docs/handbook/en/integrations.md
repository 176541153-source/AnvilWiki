---
title: "Integrations and Engineering: Env Gating, CI Gates, and Security Baseline"
description: "The full env variable table, the empty-value-renders-nothing gating pattern, what each CI workflow guards, and the built-in security baseline."
manual: dev
order: 3
icon: lucide:plug
tldr: "Every optional feature follows one pattern: the component reads a PUBLIC_* env and returns null when it is empty — an empty value renders nothing, which is why a fork ships Lighthouse 4×100. Three CI workflows (CI, Content freshness audit, Initialize AnvilWiki) automate verification; the security baseline (JSON-LD escaping, sponsored rel, consent gating) is built into the framework layer."
updated: 2026-08-16
---

## The env gating pattern (shared by every optional feature)

Every optional component follows the exact same pattern:

```astro
---
const client = import.meta.env.PUBLIC_ADSENSE_CLIENT;
if (!client) return null;   // empty value = renders nothing = zero JS, zero requests
---
```

This yields two contracts: **off by default** (a fresh fork ships Lighthouse 4×100) and **progressive opt-in** (fill in env values one at a time and run a build after each to watch the score). Giving ad/comment envs default values or hard-coding demo configuration violates the contract.

## Full environment variable table

Injected at build time. Where to declare them: if you keep `wrangler.toml`, write them under `[vars]`; if you delete it, use the Cloudflare dashboard (pick one — see the [deployment chapter](/landing/docs/deploy-and-get-indexed)):

| Variable | Purpose | Behavior when empty |
|---|---|---|
| `SITE_URL` | Absolute site URL (**required**, include `https://`) | Build output URLs are wrong |
| `PUBLIC_ADSENSE_CLIENT` | AdSense loader | Ad script not loaded |
| `PUBLIC_ADSENSE_SLOT_STICKY` / `_SIDEBAR` / `_INCONTENT` | The three ad slots | The matching ad slot renders nothing |
| `PUBLIC_GISCUS_REPO` / `_REPO_ID` / `_CATEGORY` / `_CATEGORY_ID` | Giscus comments | Comment section not rendered |
| `PUBLIC_GA_ID` | Google Analytics 4 | GA not loaded |
| `PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics | Beacon not loaded |
| `PUBLIC_GSC_VERIFICATION` | GSC verification meta | Verification tag not emitted |
| `PUBLIC_SPONSOR_URL` / `PUBLIC_SPONSOR_IMAGE_URL` | Sponsor card | Sponsor card not rendered |

A local `.env` file works too (read via `import.meta.env`; `.env` is already in `.gitignore` — secrets never enter the repo).

## The three CI workflows (.github/workflows/)

| Workflow | Trigger | What it guards |
|---|---|---|
| **CI** (ci.yml) | Every push/PR | lint + typecheck + test + build — all gates; a red run blocks the merge |
| **Content freshness audit** (content-pipeline.yml) | Weekly cron (Mondays) | Runs `refresh-audit`; P0/P1 automatically open issues; **it only opens issues and never edits content** (the supply-chain risk of an LLM editing content is uncontrollable — human gating must stay) |
| **Initialize AnvilWiki** (setup.yml) | Manual trigger | One-click initialization after forking (the workflow version of the apply-template CLI) |

Local equivalents: the gate commands live in `package.json` scripts (`check-config`/`check-content`/`check-i18n`/`check-links`/`check-sitemap`/`refresh-audit`); running `pnpm build` before a push is CI in miniature.

## Security baseline (built into the framework layer — don't break it while customizing)

- **JSON-LD escaping**: serialization uniformly escapes as `\u003c`, so a `</script>` in frontmatter cannot escape the script tag (the stored-XSS surface is closed); any new structured-data component must reuse `JsonLd.astro`
- **External/sponsored links**: `AffiliateLink` automatically adds `rel="sponsored nofollow"`; external links uniformly use `rel="noopener"`
- **Cookie consent is real gating**: GA/AdSense load only after the user consents (not a decorative banner)
- **No secrets in the repo**: every sensitive value goes through env; `.env` never enters git

## Performance budget (hold this line when editing the Code layer)

- Zero JS runtime (ADR-002): no React/Vue/Svelte islands; interactivity uses `<details>`/`<dialog>` plus minimal vanilla JS
- Images go through Astro Image (automatic WebP/srcset + explicit dimensions to prevent CLS)
- Run Lighthouse after every change (CI doesn't check this — it's manual): after `pnpm build && npx wrangler pages dev dist`, point Lighthouse CLI at localhost

> **✅ Acceptance criteria (all must hold)**
> - Command: after filling in a new env, `pnpm build` is all green and `curl` on the matching page confirms the component renders (or doesn't) as expected
> - ☐ The "empty value renders nothing" pattern is respected in any new component you added (if you added one)
> - ☐ CI is green on your fork (Actions tab)

## Next steps

Upstream keeps evolving — the [sync-and-contribute chapter](/landing/docs/sync-and-contribute) covers how to merge upstream without losing your configuration, and how to contribute your improvements back to the community.
