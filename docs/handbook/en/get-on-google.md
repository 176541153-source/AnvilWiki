---
title: "Chapter 6 · Get Google to Know You: Three Indexing Tasks"
description: "Register Google Search Console (GSC), submit the sitemap, and request indexing for key pages — 20 minutes on launch day, and Google starts shelving your pages."
manual: learn
order: 6
icon: lucide:search
tldr: "Indexing is where traffic begins: only after Google shelves your pages in its library can you rank, and only rankings bring traffic. Do three things today: register Search Console (GSC — one environment variable proves ownership), submit the auto-generated sitemap, and click Request indexing for your 5 to 10 most important URLs. Bing and the AI engines take care of themselves — no work needed."
updated: 2026-08-17
---

## Where you are, and what this chapter solves

Last chapter your site went live and the whole world can reach it. But Google doesn't know you exist — nobody can find you in search. This chapter gets Google to start indexing your pages, the starting line between "a site exists" and "a site has traffic".

## What you'll have when this chapter is done

- Google Search Console (GSC) set up — all your traffic data lives here from now on
- The sitemap submitted, and key pages requested for indexing

## A few words to know

- **Indexing**: Google taking your pages into its "library". Indexed pages can rank; ranked pages get traffic. Google might take weeks to crawl a new site's pages on its own, which is why the third task below actively nudges it.
- **sitemap**: an auto-generated "site table of contents" handed to Google, telling it which pages you have and which were updated recently. You do nothing — the template generates it.
- **GSC (Google Search Console)**: the backstage where Google hands out report cards — who searched what, whether they clicked your site; it's all here from now on.

### Step 1: Register with Google Search Console (GSC)

**What to do**: get the "business registration" Google issues you.
**How to do it**: open [search.google.com/search-console](https://search.google.com/search-console) → log into your Google account → **Add property**. Choose the **URL prefix** type, enter your `https://project-name.pages.dev` (or your domain), pick the **HTML tag** verification method, and Google hands you a snippet of code — you don't paste it yourself; take the string of letters inside the tag's `content="..."` and put it into a Cloudflare variable: name `PUBLIC_GSC_VERIFICATION`, value that string of letters. Save and redeploy, then go back to GSC and click "Verify".
**You'll see**: GSC shows "Ownership verified".
**Confirm it worked**: the left sidebar of GSC opens pages like "Performance".

### Step 2: Submit the sitemap

**What to do**: hand Google the table-of-contents page the template generated.
**How to do it**: GSC left menu → **Sitemaps** → type `sitemap-index.xml` in the input box → click **Submit**.
**You'll see**: the status column shows "Success".
**Confirm it worked**: come back in a day or two and "Discovered URLs" has started climbing above 0.

### Step 3: Click Request indexing for key pages

**What to do**: Google might take weeks to crawl a new site's pages on its own — actively nudge the most important ones.
**How to do it**: in the inspection box at the top of GSC, paste your codes page's full URL and press Enter → click **Request indexing**. Run the most important 5 to 10 URLs through one by one (codes page first).
**You'll see**: each URL shows "Indexing requested".

Two more things happen automatically — no action from you: every Cloudflare deploy notifies Bing and other search engines (called IndexNow — an automatic nudge to Bing), and your `/llms.txt` page tells AI engines like ChatGPT what content you have.

### Post-launch self-check (optional, 5 minutes)

```bash
pnpm build
BASE_URL=https://your-url pnpm check-sitemap
pnpm check-links
```

All three run clean — every URL returns 200 (opens fine) and no internal link is dead — and the site is healthy.

## If you get stuck

- **"GSC verification fails"**: confirm the `PUBLIC_GSC_VERIFICATION` value is the string inside the tag's content quotes (no quotes), and that you really redeployed after saving.
- **"Sitemap submission says couldn't fetch"**: wait a few hours and retry (Google's crawling lags); also confirm `https://your-domain/sitemap-index.xml` opens.
- **"Discovered URLs still 0 after days"**: wait a few more days and click Request indexing a few more rounds; indexing has its own pace, and Chapter 8's weekly routine keeps nudging it.

## ✅ Acceptance criteria (all must hold)

- GSC verified, sitemap submitted
- ☐ At least 5 URLs have had indexing requested (codes page first)
- ☐ You know where in GSC to check "Discovered URLs"

## Next step

Google has started crawling you — but turning traffic into money still takes two steps: ads, and weekly freshness. The next chapter turns the ad slots on. [Go to Chapter 7 · Turn On Ads, Start Earning](/landing/docs/enable-ads)
