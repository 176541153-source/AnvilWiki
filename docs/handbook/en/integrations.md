---
title: "Dev 3 · Integrations and Engineering: The Full Toggle Table and the Mechanics"
description: "One toggle for every optional feature: empty variable = nothing rendered. Full variable table, wrangler.toml, three CI pipelines, and the built-in security baseline."
manual: dev
order: 3
icon: lucide:plug
tldr: "One mechanism for every optional feature: the component reads its env variable and renders nothing when it's empty — hence the perfect out-of-the-box score; enable features one at a time and verify each. One table lists every variable. Keeping wrangler.toml makes it the single source of truth, NODE_VERSION included. Three CI pipelines run eight gates. The security baseline (escaping, sponsored links, consent gating) is built in — don't break it."
updated: 2026-08-17
---

## Where you are now and what this chapter solves

You want to switch on ads, wire in comments, install analytics — or you just want to understand what those automated checks in the repo actually do. This chapter is the toggle table + the mechanics. **A lookup manual; open it as needed.**

## The toggle mechanism: one pattern everywhere

Every optional feature (ads, comments, analytics, sponsor card) follows the same recipe:

```astro
---
const client = import.meta.env.PUBLIC_ADSENSE_CLIENT;
if (!client) return null;   // empty variable = this component disappears entirely
---
```

That gives you two guarantees:

1. **Fill in nothing**: the site stays clean and scores a perfect four-part Lighthouse run.
2. **Fill in whatever you want**: features don't affect each other; after enabling one, run a build and confirm the score held.

So do **not** give these variables default values or copy someone else's demo values — empty is the correct state. A local `.env` file can hold these variables too (it never enters git; secrets never land in the repo).

## The full variable table

Where to fill them in: pick one — the **Cloudflare dashboard** (Settings → Variables; the route the learning manual teaches, recommended) or **the repo's `wrangler.toml` file** (advanced, next section).

| Variable | What it does | When empty |
|---|---|---|
| `SITE_URL` | The site's official URL (**the only required one**, must start with `https://`) | Site-wide share cards and sitemap URLs come out wrong |
| `PUBLIC_ADSENSE_CLIENT` | AdSense master switch (publisher ID) | No ads load at all |
| `PUBLIC_ADSENSE_SLOT_STICKY` / `_SIDEBAR` / `_INCONTENT` | The three ad slots | The matching slot doesn't show |
| `PUBLIC_GISCUS_REPO` / `_REPO_ID` / `_CATEGORY` / `_CATEGORY_ID` | Giscus comments (backed by GitHub Discussions) | The comment section doesn't show |
| `PUBLIC_GA_ID` | Google Analytics 4 | GA not loaded |
| `PUBLIC_CF_BEACON_TOKEN` | Cloudflare's built-in analytics (no cookies) | Not loaded |
| `PUBLIC_GSC_VERIFICATION` | Google Search Console verification code | No verification tag emitted |
| `PUBLIC_SPONSOR_URL` / `_IMAGE_URL` | Sponsor card | Sponsor card doesn't show |

## Advanced: keep wrangler.toml (settings recorded in the repo)

The learning manual had you delete `wrangler.toml`, so settings come only from the Cloudflare dashboard. If you'd rather do the opposite and **keep it** (the benefit: settings version-track with your code), there is exactly one rule: **while it exists, the dashboard settings are all ignored** — including the Node version used at deploy time. So if you keep it, write every variable into its `[vars]` section, at minimum:

```toml
[vars]
NODE_VERSION = "22"
SITE_URL = "https://your-domain.com"
```

A diagnostic trick (for when a setting seems to have no effect): temporarily add `console.log('ENV:', Object.keys(process.env).filter(k => k.startsWith('PUBLIC_')))` as the first line of `astro.config.ts`, push, and read the Cloudflare build log to see which variables actually arrived; delete the line when done.

## The three automated pipelines (.github/workflows/)

| Pipeline | When it runs | What it guards for you |
|---|---|---|
| **CI** | Every push / PR | Eight gates: lint → typecheck → test → check-config → build → check-content → check-links → check-i18n — one red gate and the merge is blocked |
| **Content freshness audit** | Every Monday (scheduled) | Runs the freshness audit; stale pages automatically open reminder issues. **On by default only in the official AnvilWiki repo** (a fork stays quiet, sparing you a pile of reminders); to enable it on your own site, have AI delete the `if: github.repository ==` line in the file. It **only reminds, never edits content** — the risk of automation touching content is uncontrollable |
| **Initialize AnvilWiki** | Manual trigger | Post-fork cleanup: resets wrangler.toml variables, removes the project landing page, optionally clears demo content. **It does not swap the game name / theme color / languages** — those still require a local `pnpm apply-template` run |

## Security baseline (built in; don't dismantle it while customizing)

- **Structured-data escaping**: the data cards served to Google are uniformly character-escaped; even malicious code smuggled into an article can't break out. Any new data component must reuse the existing `JsonLd.astro` — never hand-concatenate the serialization yourself.
- **Sponsored links**: the affiliate link component automatically carries the `sponsored nofollow` marking (telling Google these are paid links); external links uniformly use `noopener`.
- **No tracking before consent**: until the user accepts cookies, GA and AdSense simply don't load — really don't load, not a decorative banner.
- **No secrets in the repo**: every sensitive value goes through variables; `.env` is already on the ignore list.

## Performance baseline (hold it when you edit the code layer)

- Zero JS framework: no React/Vue-style runtimes; interactivity uses native browser abilities (collapsible blocks, dialogs) plus a tiny amount of vanilla script.
- Images go through the template's image pipeline (auto-compressed to WebP, auto-fitted for phones).
- To verify scores after a change: `pnpm build && npx wrangler pages dev dist`, then run the browser's Lighthouse panel.

## If you get stuck

- **"Filled in a variable, nothing happened"**: first check you filled the right place (dashboard or wrangler.toml — the latter wins); then verify the variable name matches character for character (case-sensitive); finally confirm you redeployed after saving.
- **"CI is red"**: click into the red run — the log's beginning names which of the eight gates failed.

## ✅ Acceptance criteria (all must hold)

- ☐ For every feature you enable, `pnpm build` is all green, and on the live site the component that should appear appears (or disappears) as expected
- ☐ You can say which settings route your site uses (dashboard or wrangler.toml), and you use only one
- ☐ CI is green on your own fork's Actions page

## Next steps

The template author keeps shipping new versions — [Dev 4 · sync and contribute](/landing/docs/sync-and-contribute): how to merge upstream updates safely, and how to contribute your good improvements back to the official project.
