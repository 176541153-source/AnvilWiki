---
title: "Chapter 1 · Pick Your Game: Pick Wrong and All the Work After Is Wasted"
description: "Four hard gates filter English-market game keywords worth building for: source candidates, verify real search demand, audit competition result by result, and validate content depth. Build-or-drop in two days, AI prompt included."
manual: learn
order: 1
icon: lucide:crosshair
tldr: "This chapter does exactly one thing: choose an English-market game keyword. List 10 to 20 candidates, use scores only for queueing, then apply hard elimination with two Trends windows, an independent second demand source, result-by-result SERP auditing, and content depth. Build only after all four gates pass; finish selection within two days."
updated: 2026-08-29
---

## Where you are, and what this chapter solves

You want to earn traffic money from a game guide site. The whole thing is like opening a snack shop: **first decide what snack you sell, then decorate the store**.

Most beginners build the site right away — that's like opening the shop only to discover nobody on this street eats what you sell. Game guide traffic follows a rule: after a new game takes off, the **2 to 8 weeks** are the golden window. That month-plus of searches can be 60% to 80% of the game's lifetime search volume. Pick the right window and even ordinary content ranks; pick the wrong one and nobody reads you no matter how well you write.

So lesson one is not building a site. It's picking the product. Judge two things:

1. Will this game take off? (does anyone search for it)
2. When it does, are there still open seats on page one of Google's results? (is the competition crowded)

**Two iron rules so you don't pick forever**: a score of 60 or above only advances a candidate to demand and competition validation; it does not authorize a build. A crowded SERP is a hard veto. From starting to deciding, spend at most 2 days. Picking a game is racing the clock, not finding excuses for a high-scoring candidate.

## What you'll have when this chapter is done

- One clear decision: this game — **build** or **drop**
- A "first 8–12 pages" list containing only pages that really exist for this game and have evidence, in priority order

## A few words to know (just for this chapter)

- **Search volume**: how many people search a term on Google each day. More people = more potential customers.
- **SEO**: the whole toolkit for getting Google to rank your pages higher. You'll be using it throughout this book.
- **SERP**: the Google search results page itself. The top 10 spots on page one are the golden storefronts — most clicks land there.

## Gate 1: List your candidates (30 minutes)

Find new games from the places below; gather 10 to 20 candidates before moving on. Pick 3 to 5 from each:

| Where to look | What to watch |
|---|---|
| [The newest page on itch.io](https://itch.io/games/newest) (pick Play in browser) | New games every day, the least competition |
| [Steam's new-release and wishlist charts](https://store.steampowered.com/explore/new/) | High game quality, but more people watching too |
| [Roblox's Discover page](https://www.roblox.com/discover) (switch to the Rising / Up-and-Coming sort) | The densest crowd of players searching "codes" |
| Recent breakouts on YouTube gaming channels | Over 50K views in 7 days means people really watch |

Candidate pool too small? The repo doc [`docs/sourcing.md`](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/sourcing.md) is the full playbook: **9 sourcing channels** (how to read SteamDB's trending charts, spotting outlier videos from small creators on social media, sweeping game-aggregator sitemaps…), plus a **decision log table** — game name | build / skip / maybe | launch date | site link. Anything you can't call goes down as "maybe", and gets a second look the next day. Twenty minutes of channel-surfing a day yields a steady 3 to 5 new candidates: sourcing becomes a pipeline, not luck.

## Gate 2: Score every candidate (5 minutes each)

Four scoring items, 100 points max, **60 or above advances to the next gate**:

1. **Is there enough to write** (hard gate): does the game have enough mechanics, items, and bosses to write guides for? Pure match-three mini-games have no guide demand — eliminate outright.
2. **Is there popularity evidence**: comment counts, subscriber counts, concurrent players; is the author still updating (still updating = a longer window)?
3. **Will players search**: when players want a guide, will they search "game name + wiki / guide / codes"?
4. **Is English content missing**: few English guides is both popularity evidence and your opportunity.

## Gate 3: Confirm people really search (the most important gate)

Open [Google Trends](https://trends.google.com), click "Compare", and enter two terms: `your game name codes` and a baseline term whose heat you roughly know (don't know one? Use `roblox codes` — it's a perennial big term).

Read the curve: **your game's line must be going up to be worth building.** The best move is to copy the curve data and feed it to your AI for judgment (prompt at the end of this chapter).

Do not treat a single `100` as proof. Google says Trends is sampled and normalized relative interest: low-volume terms may show 0, and isolated spikes may be statistical noise. Check both **past 7 days and past 30 days** in the target market against a like-for-like benchmark. Insufficient data, a single spike, or mostly-zero observations means **drop/watch for now**, not a test site. Compare search terms with search terms and topics with topics. See Google's [Trends data FAQ](https://support.google.com/trends/answer/4365533?hl=en) and [term/topic comparison guide](https://support.google.com/trends/answer/17309543).

A common trap: huge YouTube views but no Trends searches — viewers watch on YouTube and leave; they never come searching for guides.

**Two-source rule**: popularity evidence must come from at least two unrelated places (e.g. Trends + YouTube). If only one source is hot, watch it for a week before deciding.

## Gate 4: Check how crowded Google's results page is (5–10 minutes, hard veto)

Google `game name wiki` and `game name codes`, and read page one:

| What you see | Verdict |
|---|---|
| Fewer than 10 results, or mostly PDFs, forum threads, YouTube videos | Open seats — **build now** |
| A [Fandom](https://www.fandom.com) (an old wiki site) exists, but the content is thin and updates are slow | Winnable — take its spot with fuller content |
| [Fandom](https://www.fandom.com) or [Game8](https://game8.co) (a pro gaming site), thick content and daily updates | **Drop it, next candidate** |

Do not merely count domains. Audit at least two intents (`wiki` plus `codes` or `guide`) and record at least five page-one results one by one: result type, content depth, update cadence, and intent fit. Any one of these means “too crowded”:

- Five or more dedicated sites on page one;
- Three or more major guide publishers on page one;
- Four or more audited results with thick content and a correct intent match;
- Any thick, correctly matched strong competitor that updates daily or frequently.

One more signal that's easy to miss: **a full page one ≠ no room**. But an intent gap cannot be asserted by feel. It overrides the competition veto only when at least five results were audited and at least three results, representing 60% or more of the audit, clearly answer the wrong intent. Writing only `intent gap: true` without result URLs and judgments counts as no gap. How to check, plus a real-world case, is in the "intent fit" section of [`docs/sourcing.md`](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/sourcing.md).

One common trap: Google Keyword Planner's Competition measures advertiser competition, not organic ranking difficulty; generic third-party KD is also an estimate. Neither can override a result-by-result SERP audit. See Google's [official metric definition](https://support.google.com/google-ads/answer/3022575?hl=en-GB).

## Operational hard gates (eliminate first, score second)

All four must pass. A high raw score cannot override a failure:

1. **Search demand**: both 7-day and 30-day Trends windows were checked; data is sufficient and not a one-off spike; the recent segment is at least 15% above the preceding segment; at least half of 7-day observations are non-zero.
2. **Independent two-source proof**: one source is Trends and the other is platform, sustained YouTube creator, or community behavior. Google Suggest, related queries, and Google Search are not independent of each other.
3. **Competitive opening**: at least two query intents and five page-one results were audited. Too much competition without a reproducible intent gap is an immediate drop.
4. **Content depth**: at least eight independent useful pages, with at least four backed by autocomplete, related-query, SERP-gap, or community-question evidence. Inferred pages cannot pad the gate.

Only after all four pass may the score distinguish BUILD from a 30% TEST. `TEST` is not a consolation prize for a failed hard gate.

## Let AI run the four gates for you (recommended)

Organize the materials below and feed them to an AI (ZCode / Claude Code / Codex — any one; the ChatGPT web app works too). **Replace everything inside `<>` with yours, then copy and send the whole block**:

```text
You are a game wiki selection analyst. Evaluate through the four-layer funnel: discovery → scoring → demand validation → competition validation.
**Input:**
Game name: <game name>
Google Trends data: <paste the comparison of "{game name} codes/wiki" vs your baseline term>
Top 10 Google results: <paste the result lists for "{game name} wiki" and "{game name} codes">
Other signals: <YouTube views / Roblox concurrent players / community discussion>
**Task:**
1. Scoring table (0-100, ≥60 passes): wiki content depth (hard gate, eliminate outright if insufficient) / social proof / title searchability / English content
2. Demand hard gate: audit US 7-day and 30-day windows; exclude insufficient data, low-volume zeros, and one-off spikes; verify Trends plus a non-Google independent source
3. SERP hard gate: cover at least two query intents and audit at least five results one by one; list URL/type/depth/update cadence/intent fit. 5+ dedicated sites, 3+ major publishers, 4+ thick matching results, or one thick frequently updated strong site = too crowded
4. Intent-gap exception: valid only when at least five results were audited and at least three, representing 60% or more, clearly mismatch intent
5. Content hard gate: at least eight independent pages and at least four with search or community evidence
6. Verdict: list PASS/FAIL for every hard gate first; any FAIL must be drop/watch and cannot be overridden by total score
Analysis only — do not write any files.
```

Note the last line, "Analysis only — do not write any files" — at the selection stage the AI only gives advice; it never touches your repo.

## Produce your "first 8–12 pages" list

Once you decide "build", immediately have the AI turn the verdict into a day-one writing plan:

```text
Based on the selection verdict, plan the first-day 8-12 pages. Game name: <game name>; verified search terms: <list>; systems that actually exist in the game: <list>; unanswered community questions: <list>.
Choose only from verified, real intent clusters: wiki/guide, beginner/progression, how-to/quest, item/weapon/build, boss/map/location, codes, tier/value/trade, calculator/tool.
Create codes only when the game has a redemption system and codes can be verified. Create tier/value/drop-rate pages only when versioned data and ongoing maintenance are available. Never invent bosses, trading, or tool demand to pad the launch.
Output a table: priority / page / slug / category / suggested title / target keyword / evidence type / fact source / update cadence / materials I need to provide.
Mark pages lacking data as "waiting on my input" and ask me with a clear list. Plan only — do not produce pages.
```

Do not force a fixed ten-page recipe onto every game. A first batch usually includes one overview/navigation page, real beginner blockers, and specific how-to questions already visible in search or the community, followed by item, quest, map, or tool pages only when the game supports them. A new game's weapons, characters, and mission names may have no third-party volume yet, so publishing first can create a window; bigger publishers may later displace it. Each page therefore still needs reproducible facts, screenshots/testing, or tool value rather than relying on being early.

## If you get stuck

- **"I don't know which game has potential"**: go back to Gate 1 and spend 10 minutes on each of the four sources — quantity first, quality later.
- **"Two games both score above 60 — which one?"**: pick the one with the emptier Google results page. An open SERP is worth more than heat.
- **"I can't read Trends"**: look at one thing only — is your game's line above or below the baseline, and is it rising or falling. Rising = people search.
- **"I still can't decide"**: the default move is to drop it and look at the next candidate. Remember the two-day limit.

## ✅ Acceptance criteria (all must hold)

- You can say it off the top of your head: which game, why (which two pieces of popularity evidence), what the competition looks like (the shape of the results page)
- The 7-day and 30-day Trends evidence is complete and is neither insufficient data nor a one-off spike
- At least two search intents and five page-one results were audited; any claimed intent gap meets the three-result and 60% evidence threshold
- You hold an 8–12-row writing list, each row with a title, target query, evidence type, and fact source
- ☐ From starting selection to making the decision took no more than 2 days

## Next step

The game is chosen and you still have nothing — the next chapter spends 30 minutes installing 6 tools (a one-time install, yours forever), and the chapter after that gets a working site onto your computer. [Go to Chapter 2 · Before You Set Off: Install the 6 Tools](/landing/docs/install-tools)
