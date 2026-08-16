---
title: "Chapter 4 · Let the Whole World See Your Site"
description: "Push to GitHub, connect Cloudflare's free shelf for a live URL, then verify Search Console, submit the sitemap, and request indexing. Free throughout."
manual: learn
order: 4
icon: lucide:cloud
tldr: "Push the site files to GitHub, then click through Cloudflare to connect — in two or three minutes you own a free URL the whole world can open. Same day, do three things: register Google Search Console, submit the sitemap, and click request indexing for your most important URLs. Google then starts shelving your pages in its library."
updated: 2026-08-17
---

## Where you are, and what this chapter solves

Your 10 pages sit inside your computer — players can't reach them, and Google doesn't know you exist. It's like you've printed a book at the print shop but haven't put it on any bookstore shelf.

This chapter does two things: first, **put the book on a shelf** (Cloudflare's free shelf — unlimited traffic, zero cost); then **have Google's librarian register your book** (indexing begins — that's where traffic starts).

## What you'll have when this chapter is done

- A URL anyone in the world can open (a free domain first, your own later)
- Google Search Console (GSC) set up, and the sitemap submitted

## A few words to know

- **Deploy**: putting your website files on a server everyone can reach. Here that means Cloudflare Pages; the free tier is nearly unlimited for beginners.
- **sitemap**: an auto-generated "table of contents page" handed to Google, telling it which pages you have and which were updated recently. You don't make it — the template generates it.
- **GSC (Google Search Console)**: the backstage where Google hands out report cards — who searched what, and whether they clicked your site; from now on you read it all here.
- **Indexing**: Google shelving your pages into its "library". Indexed first, then ranked; ranked first, then traffic.

## Act one: shelving (about 15 minutes)

### Step 1: Push the files to GitHub

**What to do**: your local site files have to reach Cloudflare, and they travel via GitHub first.
**How to do it**: in the terminal (inside the AnvilWiki folder), enter in order:

```bash
git add .
git commit -m "First version of my game wiki"
git push
```

**What you'll see**: the first push pops up a GitHub login window; log into your account, and the terminal shows the upload progress.
**Confirm you got it right**: refresh your GitHub repo page — you can see `docs`, `src`, and the other folders.

### Step 2: Connect Cloudflare's shelf

**What to do**: tell Cloudflare "my repo is here; every time I update, re-shelve automatically".
**How to do it**:

1. Register/log in at [dash.cloudflare.com](https://dash.cloudflare.com) (free).
2. Left sidebar: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorize GitHub, pick your AnvilWiki repo, click **Begin setup**.
4. Copy the build settings as-is:

| What it asks | What you enter |
|---|---|
| Project name | Anything you like, e.g. your game's name (it becomes part of the URL) |
| Production branch | `main` |
| Framework preset | Astro (usually auto-detected) |
| Build command | `pnpm build` |
| Build output directory | `dist` |

5. In the **Environment variables** section, add one variable: name `NODE_VERSION`, value `22`.
6. Click **Save and Deploy**.

**What you'll see**: the build runs 2 to 3 minutes and ends with a `https://project-name.pages.dev` URL.
**Confirm you got it right**: open that URL — your game site is there. From this moment on, the whole world can visit it.

### Step 3: Handle the biggest beginner trap (which settings count)

**What to do**: delete a file called `wrangler.toml`. The reason in one sentence: the site's settings have two registries — this file inside the repo, and the settings page on Cloudflare's website. **While the file exists, the web settings are all ignored.** Beginners just delete the file and use the web page only from then on — clean and trap-free.
**How to do it**: in the terminal:

```bash
git rm wrangler.toml
git commit -m "remove wrangler.toml"
git push
```

**What you'll see**: `wrangler.toml` disappears from the GitHub file list; Cloudflare redeploys automatically once.
**Confirm you got it right**: Cloudflare → your project → **Settings** → **Variables and Secrets** shows `NODE_VERSION = 22` (added in Step 2 — it only truly takes effect after the file is gone). Ads and analytics later all get their variables added on this page.

> A note for the advanced: keeping the file and recording settings in the repo works too, but every variable — `NODE_VERSION = "22"` included — must then be written into the file's `[vars]` section, and the web settings still don't count — details in the developer manual's "integrations" chapter. Beginners, don't touch this; just delete the file.

### Step 4: Buy your own domain (skippable for now, required before earning)

**What to do**: swap `project-name.pages.dev` for your own address, e.g. `yourgame-wiki.com`. **AdSense review basically requires your own domain**, so you must buy one before monetizing (just a small yearly fee).
**How to do it**: at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (sells at cost, no markup) or a registrar like Porkbun, search and buy a `.com` / `.wiki` domain; then Cloudflare Pages → your project → **Custom domains** → Set up, and point the domain over as prompted (if your DNS lives on Cloudflare, it's all just Next, Next, Finish).
**What you'll see**: within minutes (up to a few hours), your domain opens your site.
**Confirm you got it right**: once the site opens on your own domain, change both the Domain from Chapter 2's config and Cloudflare's `SITE_URL` variable to this domain (starting with `https://` — the protocol can't be missing), and redeploy.

## Act two: get Google to know you (20 minutes, same day)

### Step 1: Register Google Search Console (GSC)

**What to do**: receive your "store operating license" from Google.
**How to do it**: open [search.google.com/search-console](https://search.google.com/search-console) → log in with a Google account → **Add property**. Beginners pick the **URL prefix** type and enter your `https://project-name.pages.dev` (or your domain); for verification choose the **HTML tag** method, and Google hands you a string of code — you don't paste it yourself: take the letters inside the tag's `content="..."` and put them into a Cloudflare variable: name `PUBLIC_GSC_VERIFICATION`, value exactly that string of letters. Save and redeploy, then go back to GSC and click Verify.
**What you'll see**: GSC shows "Ownership verified".
**Confirm you got it right**: the left side of GSC opens pages like "Performance".

### Step 2: Submit the table of contents page (sitemap)

**What to do**: hand Google the table-of-contents page the template auto-generated.
**How to do it**: GSC left menu → **Sitemaps** → type `sitemap-index.xml` in the input box → click **Submit**.
**What you'll see**: the status shows "Success".
**Confirm you got it right**: come back to this page in a day or two — "Discovered URLs" starts growing past 0.

### Step 3: Click "Request indexing" for the key pages

**What to do**: Google might take weeks to crawl a new site's pages on its own — nudge it for the most important few.
**How to do it**: in GSC's top inspection box, paste the full URL of your codes page, press Enter → click **Request Indexing**. Repeat for your 5 to 10 most important URLs, one by one (codes page first).
**What you'll see**: each URL shows "Indexing requested".

Two more things happen automatically, no work needed from you: every Cloudflare deploy auto-notifies Bing and other search engines (it's called IndexNow — the automatic Bing nudge); and your `/llms.txt` page tells AI engines like ChatGPT what content you have.

### Post-launch self-check (optional, 5 minutes)

```bash
pnpm build
BASE_URL=https://your-site-url pnpm check-sitemap
pnpm check-links
```

All three run clean — every URL returns 200 (opens fine) and no internal link is dead — and the site is healthy.

## If you get stuck

- **"Cloudflare build failed"**: open that deploy and read the last line of the log. Nine times out of ten it's one of two things: an env variable not configured right (back to Step 2, check NODE_VERSION), or `SITE_URL` missing `https://`.
- **"I changed settings on Cloudflare's website but nothing took effect"**: recall Step 3 — did you delete `wrangler.toml`? While it exists, web settings don't count.
- **"The domain opens but the styling is broken / images are gone"**: nine times out of ten `SITE_URL` still isn't set to the new domain. Change it to `https://your-domain` and redeploy.
- **"GSC verification fails"**: confirm the `PUBLIC_GSC_VERIFICATION` value is exactly the letters inside the content quotes of the tag (without the quotes), and that you really redeployed after saving.

## ✅ Acceptance criteria (all must hold)

- Your URL opens on phone data (no WiFi needed) and the page renders normally
- GSC verified, sitemap submitted, and at least 5 URLs have Request Indexing clicked
- ☐ `wrangler.toml` is deleted — from now on, all settings get added on Cloudflare's web page
- ☐ If you have a domain: `SITE_URL` changed to `https://your-domain`

## Next step

The site is live and Google is crawling — but turning traffic into money takes two more steps: ads, and weekly freshness. In the final chapter, the store opens for real. [Go to Chapter 5 · Turn on ads and keep the site earning](/landing/docs/monetize-and-grow)
