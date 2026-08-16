---
title: "Chapter 5 · Turn On Ads and Keep the Site Earning"
description: "Apply for Google AdSense, fill the ad switch panel, and build a 30-minute weekly freshness routine: codes updates, data checks, monthly reviews."
manual: learn
order: 5
icon: lucide:dollar-sign
tldr: "Stack 15 to 20 content pages and buy a domain, then pass Google AdSense review and fill 4 ad IDs into Cloudflare; ads appear automatically without slowing the site. Then it's cadence: every Monday, 30 minutes to update codes and run a freshness check; once a month, review the data. Zero revenue in the first 1 to 2 weeks is normal; the golden window is 2 to 8 weeks."
updated: 2026-08-17
---

## Where you are, and what this chapter solves

The site is live and Google is indexing. But visitors arrive and you have nothing to sell — this chapter switches on the **ad slots**. Visitors see ads, and Google splits the money with you.

At the same time you'll build a **freshness routine**: game guides fear nothing more than going stale. Codes expired and nobody cares, the boss got reworked but your guide still teaches the old fight — a player who finds waste paper once never comes back for a second visit, and Google hands your ranking to someone else too.

## What you'll have when this chapter is done

- Ad slots live, revenue accruing
- A fixed 30-minute-every-Monday routine that keeps the site from ever going stale

## A few words to know

- **AdSense**: Google's ad middleman. It puts ads into your pages; when the ads get seen or clicked, Google pays you monthly.
- **RPM**: how much you earn per thousand views. Tier list pages and codes pages usually carry the highest RPM.
- **Lighthouse 4×100**: Google's health check for websites — four scores of 100 each, for speed/accessibility/best practices/SEO. This template scores full marks out of the box — the ad slots lazy-load, so turning them on costs no points.

## Step one: apply for AdSense (self-check first, don't rush the form)

**Pre-application checklist** (missing any one item invites rejection):

- ☐ Your own domain (bought in Chapter 4; pages.dev free domains basically never pass review)
- ☐ 15 to 20 pages of real content (not empty shells)
- ☐ Privacy policy and terms of service pages (**the template ships them built in** at `/privacy-policy` and `/terms-of-service` — nothing for you to do)
- ☐ The site opens with no dead links (`pnpm check-links` passes)

**How to do it**: open [adsense.google.com](https://adsense.google.com) → add your site → wait for review (a few days to two weeks).
**If rejected**: read the reason they give — nine times out of ten it's "not enough content value". Go back to the Chapter 3 routine and write 5 to 10 more pages, then apply again in two weeks; a rejection costs you nothing later.

## Step two: fill the ad IDs into the site

**What to do**: once approved, AdSense gives you 1 publisher ID and several ad slot IDs. The site has 4 switches reserved on the switch panel — fill them in and the lights come on.
**How to do it**:

1. AdSense console → **Ads** → by ad unit, grab your publisher ID (looks like `ca-pub-digits`) and each slot ID.
2. Cloudflare → your project → **Settings** → **Variables and Secrets**, add 4 variables:

| Variable name (copy exactly, case-sensitive) | What to fill in |
|---|---|
| `PUBLIC_ADSENSE_CLIENT` | Your publisher ID (starts with ca-pub-) |
| `PUBLIC_ADSENSE_SLOT_STICKY` | The bottom banner slot ID |
| `PUBLIC_ADSENSE_SLOT_SIDEBAR` | The sidebar slot ID |
| `PUBLIC_ADSENSE_SLOT_INCONTENT` | The in-article slot ID |

3. Save and redeploy.

**What you'll see**: ads appear at the bottom/sidebar/middle of articles (a new slot may take a few hours to a few days to fill with real ads — blank at first is normal).
**Confirm you got it right**: all four variables are in Cloudflare (leave one empty and that spot shows nothing — that's by design; want only one spot on? Fill only that one). All revenue is yours — no platform cut.

> Comments and traffic analytics work the same switch-panel way (comments are called Giscus, powered by your GitHub repo's Discussions; analytics: Google Analytics or Cloudflare's built-in). When you need them, the developer manual's "integrations" chapter has the full steps.

## Step three: build the Monday 30-minute routine

Fixed time, fixed actions — the only secret to a site that never goes stale.

### Move 1: run the freshness check and turn the report into a to-do list (15 minutes)

**What to do**: let the site tell you which pages have gone stale.
**How to do it**: in the terminal:

```bash
pnpm refresh-audit
```

**What you'll see**: a list with two levels — **P0, most urgent: a codes page not updated for more than 7 days (past 30 days, the problem escalates); P1, next most urgent: boss guides and tier lists — those two categories only — not updated for more than 90 days** (only these two can produce a P1, because stale ones mislead players; other pages never do). Then paste the list to your AI assistant and have it organized into a to-do:

```text
Here is my pnpm refresh-audit report:
<paste the report>
Turn P0/P1 into an actionable list:
1. Pages where I need to supply new data → list per page exactly what's needed (the latest codes list / mechanic changes in the new version)
2. Pages I've confirmed are still accurate and only need a refresh → update lastModified to today
3. List pages whose gameVersion lags behind separately
Do not change any content facts on your own. Output as a checkbox list.
```

> Note: that "weekly auto-check that opens issues" in the repo **runs only on the official AnvilWiki repository by default — your fork never receives the automatic reminders** — so run this command yourself every week. If you want GitHub to open issue reminders for you, that works too: delete the `if: github.repository ==` condition line in `.github/workflows/content-pipeline.yml` (let your AI assistant delete it — a one-sentence job).

### Move 2: update the codes (10 minutes)

Collect new codes and confirmed-expired old ones from official Twitter/Discord, then:

On skill-capable AI assistants, just say it (slash command):

```text
/anvil-update-codes new codes: <code list>; confirmed expired: <code list>
```

Plain prompt version:

```text
Update the codes article under src/content/wiki/en/codes/: prepend new codes to the frontmatter active list;
change expired codes to status expired (keep them, don't delete); set lastModified to today; sync the code count and year/month in title/summary;
if other language versions exist, sync their data (don't translate the code field; translate reward and other copy).
When done, run pnpm check-content && pnpm build; only all-green counts as complete.
```

**Confirm you got it right**: the codes page shows the new codes, and the expired ones move into the "Expired" table (not deleted — people still search "do old codes still work", and keeping them catches that long-tail traffic).

### Move 3: wrap up (5 minutes)

`git push` (Cloudflare re-shelves automatically) → open GSC's "Performance" page and see which terms brought clicks over the last two days → pick 1 to 2 rising terms and write matching new pages next week with the Chapter 3 routine.

## Once a month (10 minutes each)

```bash
# 1. Multilingual sites only: see how much translation is missing
pnpm check-i18n --strict

# 2. Pull in the template author's updates (first time: run all three lines)
git remote add upstream https://github.com/PNGTRID/AnvilWiki.git
git fetch upstream
git merge upstream/main
```

What the second block means: register the official repo (called upstream) as the one you follow, fetch its latest version, and merge it into your site. **If the terminal shows the word CONFLICT, don't panic**: tell your AI assistant which files conflict and say "keep mine for config and content, take the official version for code" — this step is exactly what AI is good at. Conflicts-wise: always keep **your own** files (game name, colors, articles) and take only the official code improvements. The full walkthrough is in the developer manual's "sync" chapter.

Spend 10 more minutes on the AdSense report: which page types have the highest RPM (usually tier lists and codes) → write more of those next month.

## Quarterly action: the SEO health check (send this block to your AI assistant)

```text
Run an SEO health check on this site — read-only, change nothing:
1. SITE_URL (wrangler.toml [vars] or .env) includes https:// and is the production domain
2. Every article: title ≤80, description 40–165, summary a direct answer (list the violations)
3. og:image/twitter:image are absolute paths
4. Any misuse of noindex
5. Run pnpm check-sitemap; after a build, run pnpm check-links and report non-200/dead links
6. Is multilingual hreflang coverage complete
Output an issue table: file / problem / suggested fix; change only after I confirm.
```

## Reasonable expectations for revenue

- The golden window is the **2 to 8 weeks** after a game explodes. Inside the window, Google grants you rankings gradually — **zero revenue in the first 1 to 2 weeks is normal**, not failure.
- The revenue formula ≈ page count × ranking × per-thousand-views earnings. The first 30 days fight for page count; after that, for rankings (freshness + internal links).
- Once the first site works, a second site costs marginal effort — selection, site setup, page production, deploy, operations: you've now walked this manual end to end once.

## If you get stuck

- **"The ad slots stay blank"**: new site, new slots — filling takes a few hours to a few days; also confirm the 4 variable names are spelled exactly right (case-sensitive).
- **"AdSense rejected me"**: it's almost always not enough content; add 5 to 10 real guides and apply again.
- **"I forget the weekly check"**: create a recurring Monday reminder in your phone calendar, titled "30-minute freshness".

## ✅ Acceptance criteria (all must hold)

- Ads really display on the live site (if AdSense has approved you)
- This week you ran `pnpm refresh-audit` once and P0 is zero (the codes page updated within 7 days)
- ☐ Three weeks in a row, same time slot, all three moves done
- ☐ You can read GSC's "Performance" page: which terms brought the clicks

## After you finish

Three-way fork in the road: **keep operating on the weekly routine**; **go deep with the [developer manual](/landing/docs/architecture) to customize your site** (add categories, add languages, reskin, enable comments and analytics); or **submit a PR adding your site to the AnvilWiki official showcase wall** (edit the showcase data in `src/config/landing.ts`) — your real case is the best ad this template can get.
