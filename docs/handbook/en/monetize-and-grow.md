---
title: "Monetization and Weekly Ops: AdSense, Freshness, and Growth Cadence"
description: "AdSense setup, Giscus comments, and GA4 with every env var, plus the weekly 30-minute ops SOP: codes updates, freshness audits, and the monthly review."
manual: learn
order: 5
icon: lucide:dollar-sign
tldr: "Monetization in three steps: after accumulating 15-20 content pages, apply for AdSense, fill the four ad env vars into wrangler.toml or the dashboard, and slots render automatically without hurting Lighthouse. Ops run on cadence: 30 minutes every Monday for freshness issues and codes updates, plus a monthly review of RPM and an upstream sync."
updated: 2026-08-16
---

## Monetization step one: AdSense (hold on — build content first)

**Pre-application checklist** (thin content gets rejected):

- ☐ Your own domain (pages.dev subdomains have low approval rates)
- ☐ 15-20 real content pages (not empty shells or demo)
- ☐ Privacy policy / terms of service pages (the template ships `/privacy-policy`, `/terms-of-service` built in)
- ☐ The site is reachable with no dead links (`pnpm check-links` passes)

Apply: [AdSense](https://adsense.google.com) → Add site → wait for review (a few days to two weeks). If rejected, read the reason (usually "valueless content"), add 5-10 high-quality guides, and apply again.

Once approved, fill in the 4 env vars (location follows the two-way choice in the [deployment chapter](/landing/docs/deploy-and-get-indexed)):

| Variable | Value |
|---|---|
| `PUBLIC_ADSENSE_CLIENT` | Publisher ID (`ca-pub-…`) |
| `PUBLIC_ADSENSE_SLOT_STICKY` | Bottom sticky ad slot ID |
| `PUBLIC_ADSENSE_SLOT_SIDEBAR` | Sidebar ad slot ID |
| `PUBLIC_ADSENSE_SLOT_INCONTENT` | In-content ad slot ID |

Template contract: **if any one is empty, the corresponding slot does not render** — so you can enable only the in-content slot first and scale up gradually. Ad components lazy-load and don't hurt Lighthouse scores (out-of-the-box 4×100 is the contract). Revenue is 100% yours; no platform cut.

## Optional integrations: comments and analytics

**Giscus comments** (backed by GitHub Discussions): follow the wizard at giscus.app to configure your repo, then fill the 4 values into env — `PUBLIC_GISCUS_REPO` / `PUBLIC_GISCUS_REPO_ID` / `PUBLIC_GISCUS_CATEGORY` / `PUBLIC_GISCUS_CATEGORY_ID`. If any is empty, comments don't render. See [docs/comments.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/comments.md).

**Analytics — pick one** (or enable both):

| Option | env | Notes |
|---|---|---|
| Cloudflare Web Analytics | `PUBLIC_CF_BEACON_TOKEN` | No cookies, privacy-friendly by default |
| Google Analytics 4 | `PUBLIC_GA_ID` | Strong on search terms/funnel analysis; pairs with cookie consent gating |

**AI search visibility**: the site's `/llms.txt` automatically lists every default-language article; AI engines like ChatGPT/Perplexity rely on it to discover and cite your content. Zero configuration — just verify with `curl https://your-domain.com/llms.txt`.

## Every Monday, 30 minutes: the ops SOP

A fixed cadence is the only secret to freshness — stale content reads as a dead site in Google's eyes.

### 1. Triage the auto-opened freshness issues (5 minutes)

The repo ships a scheduled **Content freshness audit** workflow (runs `refresh-audit` automatically every Monday and opens issues): P0 = a codes page untouched for more than 7 days, P1 = a category with no new article for more than 90 days. Open the repo's Actions → handle the issues by priority.

### 2. Update the codes page (10 minutes)

Collect new/expired codes (official social media/Discord), then:

On skill-capable tools, directly:

```text
/anvil-update-codes new codes: <code list>; confirmed expired: <code list>
```

Raw prompt version:

```text
Update the codes article under src/content/wiki/en/codes/: prepend new codes to the frontmatter active list;
change expired codes to status expired (keep them, don't delete); set lastModified to today; sync the code count and year/month in title/summary;
if other language versions exist, sync their data too (don't translate the code field; translate reward and other copy).
When done, run pnpm check-content && pnpm build; only all-green counts as complete.
```

### 3. Freshness re-audit (10 minutes)

```bash
pnpm refresh-audit
```

Feed the report to an AI and turn it into an action list:

```text
Here is my pnpm refresh-audit report:
<paste the report>
Turn P0/P1 into an actionable list:
1. Pages where I need to supply new data → list per page exactly what's needed (latest codes / mechanic changes in the new version)
2. Pages I've confirmed are still accurate and just need a refresh → update lastModified to today
3. List pages whose gameVersion lags behind separately
Do not change any content facts on your own. Output as a checklist.
```

### 4. Wrap up (5 minutes)

`git push` (the build validates automatically) → check GA/GSC search terms → pick 1-2 rising terms to set next week's page topics.

## Once a month

```bash
pnpm check-i18n --strict   # multilingual coverage (only needed if you run translated locales)
git fetch upstream && git merge upstream/main   # sync upstream (see the developer manual · sync chapter)
```

- AdSense report review: which page types have high RPM (tier list/codes usually highest) → produce more of them next month
- GSC performance report: queries with rising clicks → deepen the matching content

## SEO health-check prompt (quarterly, or when traffic looks wrong)

```text
Run a read-only SEO health check on this site — analyze, don't change anything:
1. SITE_URL in src/config/site.ts includes https:// and is the production domain
2. Every article: title ≤80, description 40–165, summary a direct answer (list the violations)
3. og:image/twitter:image are absolute paths
4. Any misuse of noindex?
5. Run pnpm check-sitemap; after a build, run pnpm check-links and report non-200/dead links
6. Is multilingual hreflang coverage complete?
Output an issue table: file / problem / suggested fix — change anything only after I confirm.
```

## Managing expectations

- The golden window is the 2-8 weeks after a game explodes: Google grants rankings gradually within the window, and zero revenue in weeks 1-2 is normal
- Revenue ≈ page count × ranking × RPM: the first 30 days are about page count, after that about rankings (freshness + internal links)
- Once one site works, the marginal cost of a second site is tiny (you have already walked the full game selection → site launch → page production SOP once)

> **✅ Acceptance criteria (the ops cadence is established)**
> - Commands: `pnpm refresh-audit` reports no P0 (all codes pages within 7 days)
> - Pages: AdSense slots render on the live site (if configured)
> - ☐ The weekly SOP completed at the same time slot for 3 consecutive weeks
> - ☐ GA or CF Analytics (at least one) is wired up and showing search terms

## After you finish

Three paths: **settle into the weekly cadence and keep operating**; **go deep with the [developer manual](/landing/docs/architecture) to customize your site**; or **submit your site via PR to the AnvilWiki official Showcase** (edit the showcase data in `src/config/landing.ts`) and give back to the template community.
