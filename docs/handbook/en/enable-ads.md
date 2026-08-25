---
title: "Chapter 7 · Turn On Ads, Start Earning"
description: "After 15 to 20 articles, apply for Google AdSense, pass review, fill 4 Cloudflare switches with ad IDs — ads appear without slowing the site; revenue is 100% yours."
manual: learn
order: 7
icon: lucide:dollar-sign
tldr: "Earning takes two steps. First self-check the application conditions (your own domain, 15 to 20 articles, privacy pages already built into the template); after passing AdSense review, fill 1 publisher ID and 3 ad-slot IDs into the 4 Cloudflare variables, save, deploy — the ads go live. Zero revenue in the first 1 to 2 weeks is normal. Rejected? Add content and reapply."
updated: 2026-08-26
---

## Where you are, and what this chapter solves

The site is live and Google is indexing it. But visitors arrive and you have nothing to sell — this chapter turns the **ad slots** on. Visitors see ads, and Google pays you a share.

## First, timing: don't switch ads on at launch

The switches in this chapter can be flipped anytime, but **when** you flip them matters:

- Let the site run **1 to 2 days** after launch first — so Google's first crawl and the first visitors see a clean, fast page.
- **The peers rule**: while none of the sites on Google's page one run ads, hold off too. Before your rankings settle, don't trade user experience for ad money — one webmaster watched the #1 spot slide continuously after adding a banner, and only recovered after removing it.

Ads are how you monetize, not how you grow — don't reverse the order. The full pre-flight checklist, plus Adsterra payout routes beyond AdSense (USDT / Payoneer), live in the repo doc [docs/ads.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/ads.md).

## What you'll have when this chapter is done

- Ad slots live and revenue accumulating
- The switch locations for comments and traffic analytics (optional — flip them on whenever you want)

## A few words to know

- **AdSense**: Google's ad middleman. It places ads into your pages; when ads get seen or clicked, Google pays you monthly.
- **RPM**: how much you earn per thousand page views. Tier list and codes pages usually have the highest RPM.
- **Lighthouse 4×100**: Google's health check for websites — four scores of 100 for speed / accessibility / best practices / SEO. This template ships with a perfect score out of the box — the ad slots lazy-load, so turning them on doesn't drop the score.

## Step 1: Apply for AdSense (self-check first, don't rush to submit)

**Pre-application checklist** (missing any one makes rejection likely):

- ☐ A domain you own (bought in Chapter 5; the free pages.dev domain basically fails review)
- ☐ 15 to 20 real content pages (not an empty shell)
- ☐ Privacy policy and terms of service pages (**the template already ships them built in** at `/privacy-policy` and `/terms-of-service` — nothing for you to do)
- ☐ No dead links on the site (`pnpm check-links` passes)

**How to do it**: open [adsense.google.com](https://adsense.google.com) → add your site → wait for review (a few days to two weeks).
**If you get rejected**: read the reason it gives — nine times out of ten it's "insufficient content". Go back with the Chapter 4 routine, write 5 to 10 more pages, reapply in two weeks. It doesn't count against you later.

## Step 2: Fill the ad IDs into the site

**What to do**: after review passes, AdSense gives you 1 publisher ID and several ad-slot IDs. The site reserves 4 switches on its switch panel — fill them in and they light up.
**How to do it**:

1. AdSense dashboard → **Ads** → by ad unit, grab your publisher ID (looks like `ca-pub-followed-by-digits`) and each ad slot's ID.
2. Cloudflare → your project → **Settings** → **Variables and Secrets**, add 4 variables:

| Variable name (copy exactly, case-sensitive) | What you enter |
|---|---|
| `PUBLIC_ADSENSE_CLIENT` | Your publisher ID (starts with ca-pub-) |
| `PUBLIC_ADSENSE_SLOT_STICKY` | The bottom banner slot ID |
| `PUBLIC_ADSENSE_SLOT_SIDEBAR` | The sidebar slot ID |
| `PUBLIC_ADSENSE_SLOT_INCONTENT` | The in-article slot ID |

3. Save and redeploy.

**You'll see**: ads appear at the bottom / in the sidebar / mid-article (fresh ad slots can take hours to days to fill with real ads — blank at first is normal).
**Confirm it worked**: all four variables are in Cloudflare (leave any one empty and that spot simply doesn't render — that's by design; want just one slot? Fill just one). The revenue is all yours — no platform cut.

## Optional: comments and analytics (the same switch-panel game)

- **Comments** (Giscus, hosted on your GitHub repo's discussions): the variables are `PUBLIC_GISCUS_REPO` and 3 more; when you want them, the developer manual's feature-toggles chapter has the full steps.
- **Traffic analytics**: Google Analytics 4 (variable `PUBLIC_GA_ID`) or Cloudflare's built-in analytics (variable `PUBLIC_CF_BEACON_TOKEN`) — pick one or run both.

## Realistic revenue expectations

- The golden window is the **2 to 8 weeks** after a game explodes. Inside the window, Google hands you rankings step by step — **zero revenue in the first 1 to 2 weeks is normal**, not failure.
- The revenue formula ≈ page count × rankings × revenue per thousand views. In the first 30 days, push page count; after that, push rankings (freshness + internal links).

## If you get stuck

- **"An ad slot stays blank"**: new site, new slot — filling can take hours to days; also confirm all 4 variable names are spelled exactly right (case-sensitive).
- **"AdSense rejected me"**: it's almost always content volume — add 5 to 10 real guides and reapply.

## ✅ Acceptance criteria (all must hold)

- Ads genuinely display on the live site (if you've passed AdSense review)
- ☐ All four variables are filled (or you deliberately enabled only some slots)
- ☐ Your expectations are set: zero revenue the first two weeks is normal

## Next step

The ads are on, but game guides fear one thing above all — going stale. Stale content loses rankings and visitors. The last chapter: a 30-minute weekly freshness rhythm that keeps the site earning. [Go to Chapter 8 · Weekly Freshness and Growth](/landing/docs/weekly-ops)
