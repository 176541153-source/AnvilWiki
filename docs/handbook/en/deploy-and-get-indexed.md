---
title: "Deploy and Get Indexed: Cloudflare + Google in One Go"
description: "Push to GitHub, connect Cloudflare Pages, settle the wrangler.toml env choice, and do launch-day SEO: verify GSC, submit the sitemap, request indexing."
manual: learn
order: 4
icon: lucide:cloud
tldr: "After git push, connect the repo in Cloudflare Pages (Astro is auto-detected; build command pnpm build, output dist) and get unlimited bandwidth free. On launch day do three things: verify the domain in GSC, submit sitemap.xml, and request indexing for new pages; Cloudflare auto-submits IndexNow so Bing discovers you instantly."
updated: 2026-08-16
---

## Deploy: 10 minutes, then every push goes live automatically

### Step 1: Push the code

The fork's remote is already configured; just run:

```bash
git add .
git commit -m "Launch: my game wiki"
git push
```

### Step 2: Connect Cloudflare Pages

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorize GitHub, select your repository → **Begin setup**
3. Confirm the build configuration (Cloudflare auto-detects Astro):

| Field | Value |
|---|---|
| Project name | Your site name |
| Production branch | `main` |
| Framework preset | Astro (automatic) |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| NODE_VERSION (env) | `22` |

4. **Save and Deploy**. The first build takes 2-3 minutes; you then get `https://<project>.pages.dev`.

### Step 3: The wrangler.toml two-way choice (the biggest trap — read this)

**When the repo's `wrangler.toml` exists, it is the single source of truth for Pages env, and the dashboard's Environment variables UI is ignored completely.** You configured variables in the dashboard but the build can't see them (symptoms: ads don't render, `process.env` reads nothing) — 99% of the time this is why.

| Option | Action | Good for |
|---|---|---|
| **A (recommended for beginners)** | `git rm wrangler.toml && git commit`; dashboard env then takes effect (including the `NODE_VERSION` from the table above) | People who don't want to touch config files |
| **B** | Keep the file and edit the `[vars]` values (`SITE_URL`, ad/comment variables all live here; add `NODE_VERSION = "22"` to `[vars]` too — otherwise the dashboard value is ignored under option B) | People who want env in version control |

Diagnostic: temporarily add `console.log('ENV:', Object.keys(process.env).filter(k => k.startsWith('PUBLIC_')))` at the top of `astro.config.ts`, push, and check the Cloudflare build log to see exactly which variables exist.

### Step 4: Point SITE_URL at the real domain (when you have one)

`SITE_URL` drives every absolute URL on the site (sitemap/og:image/robots.txt/canonical):

- The value must include the `https://` protocol; a bare domain fails the build outright
- Start with `https://<project>.pages.dev`, then switch it after binding a custom domain and redeploy
- Domain binding: Cloudflare Pages → Custom domains → Add, then add the CNAME as instructed; if your DNS is hosted on Cloudflare it's zero-config

After changing it, run `pnpm check-sitemap` (with BASE_URL pointing at your domain) to confirm every URL in the sitemap returns 200.

## The three launch-day SEO tasks

### 1. Verify Google Search Console

[GSC](https://search.google.com/search-console) → Add property → the **Domain** type (covers all subdomains, recommended) → add the TXT record to DNS as instructed → Verify. Without a custom domain, use the URL prefix type + the HTML tag method (the template supports the `PUBLIC_GSC_VERIFICATION` env; fill in the verification code and the meta tag is emitted automatically).

### 2. Submit the sitemap

GSC → Sitemaps → enter `sitemap-index.xml` → Submit. The template's sitemap carries `lastmod` (taken from article frontmatter dates), which Google uses to schedule re-crawls.

### 3. Request indexing (to speed up the cold start)

Paste your 5-10 most important URLs (codes pages first) one by one into the GSC top search bar → **Request Indexing**. Reinforce with:

- Cloudflare Pages auto-submits **IndexNow** on every new deploy (Bing et al. pick it up instantly)
- The homepage/category "latest articles" modules naturally give new pages internal links
- Natural mentions in communities like Reddit/Discord (external link signals)

## Post-launch self-check

```bash
# Works locally or in CI
pnpm build && pnpm check-links          # audit all internal links
BASE_URL=https://your-domain.com pnpm check-sitemap   # every sitemap URL returns 200
curl -s https://your-domain.com/robots.txt     # should reference the sitemap
curl -s https://your-domain.com/llms.txt       # the AI-crawler discovery entry
```

Browser checks: `view-source:` to confirm og:image/og:title absolute paths are correct and `<link rel="alternate">` hreflang tags come in pairs.

> **✅ Acceptance criteria (all must hold)**
> - Commands: `BASE_URL=https://your-domain.com pnpm check-sitemap` → all 200
> - Pages: open any article on the live site; the share card (og:image) renders correctly
> - ☐ GSC verified, sitemap submitted, ≥5 URLs have requested indexing
> - ☐ The wrangler.toml two-way choice is decided (the dashboard env path is clear)
> - ☐ SITE_URL matches the actual live domain

## Next steps

The site is live and Google has started crawling — but monetization and long-term growth run on cadence. Final chapter: hook up AdSense, configure comments, and the 30-minute weekly ops SOP (freshness prompts included).
