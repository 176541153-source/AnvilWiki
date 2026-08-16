---
title: "Game Selection Makes or Breaks the Site: The Four-Layer Funnel"
description: "Run the four-layer game selection funnel — discovery, scoring, demand validation, competition validation — to lock in a game worth building within two days."
manual: learn
order: 1
icon: lucide:crosshair
tldr: "List candidates from broad sources, score each with the signal model (≥60 passes), verify real search demand in Google Trends, then spend two minutes checking the SERP for an opening. Four hard exit rules prevent you from burning weeks on the wrong game. Score ≥60 plus a passing competition check: start building immediately. Game selection takes at most two days."
updated: 2026-08-16
---

## Why game selection comes before building the site

The traffic structure of a game wiki: after a new game explodes, **the first 2-8 weeks are the golden window**, capturing 60-80% of the game's lifetime search volume, after which it decays exponentially. Pick the right window and even ordinary content ranks; pick the wrong one and even flawless writing gets no traffic.

Game selection is fundamentally the product of two probabilities:

1. Will this game blow up? (demand validation)
2. When it does, is there still room on Google's results page? (competition validation)

**Hard exit rules (against selection paralysis)**: score ≥60 means act now, the competition check is a hard veto, and the whole selection process takes at most 2 days. Game selection is not a research project — it is a race against a closing window.

## Step 1: Cast a wide net for candidates (30 minutes)

Pick 3-5 candidates from each of these sources; gather 10-20 before moving on to scoring:

| Source | What to look for |
|---|---|
| itch.io `/newest` (Play in browser) | Daily new games; the zero-competition window is widest |
| Steam new & trending / popular wishlists | Strong quality signal, but strong competition too |
| Roblox rising new games | The ecosystem with the densest codes/wiki demand |
| Recent breakout hits on YouTube gaming channels | 50K+ views / 7 days = the gold standard for demand |

## Step 2: Score with the signal model (5 minutes per candidate)

Score each candidate on four dimensions (0-100, **≥60 advances to the next layer**):

- **Wiki content depth** (hard gate — fail this and the candidate is out): does the game have enough mechanics/items/guides/bosses to write about? Pure casual mini-games have no wiki demand.
- **Social proof**: comments/subscribers/concurrent players; devlog activity (an author still updating = a longer content window).
- **Title searchability**: will players search "game name + wiki/guide/codes"?
- **English content**: targets international search volume (missing English content is both a demand signal and your opportunity).

## Step 3: Demand validation (the most important step — do not skip it)

Compare anchor terms in Google Trends: `{game name} codes` / `{game name} wiki`, using a baseline term whose traffic you already know.

**Only build if search volume genuinely exists and is rising.** The most common trap: huge YouTube views but no Trends searches — viewers watch on YouTube and leave; they never search for a wiki.

**Two-source rule**: a demand signal must be cross-confirmed by at least two independent sources (e.g. Trends + YouTube). Single-source signals (e.g. Reddit chatter only) get a one-week observation period before you decide.

## Step 4: Competition check (2 minutes, hard veto)

Google `{game name} wiki` and `{game name} codes`, then read the top 10 results:

| SERP shape | Verdict |
|---|---|
| Fewer than 10 results, or mostly PDFs/forum threads/YouTube | **An opening — build now** |
| Fandom exists but content is thin and updates are slow | Winnable (compete with fuller, structured content) |
| Fandom/Game8 with thick content and daily updates | **Drop it, move to the next candidate** |

## Speed it up with AI: the game selection analysis prompt

Feed the raw data to an AI agent (ZCode / Claude Code / Codex — any of them; the ChatGPT web app works too) and let it run the funnel. **Replace every `<>` placeholder, then send the whole block**:

```text
You are a game wiki selection analyst. Evaluate the candidate through the four-layer funnel: discovery → scoring → demand validation → competition validation.
**Input:**
Game name: <game name>
Google Trends data: <paste the comparison of "{game name} codes/wiki" against your baseline term>
Top 10 Google results: <paste the result lists for "{game name} wiki" and "{game name} codes">
Other signals: <YouTube views / Roblox concurrent players / community discussion>
**Task:**
1. Scoring table (0-100, ≥60 passes): wiki content depth (hard gate, eliminate outright if insufficient) / social proof / title searchability / English content
2. Demand validation: is the Trends curve genuinely rising; is the two-source rule met (two independent sources, e.g. Trends + YouTube)
3. SERP opening: fewer than 10 results or mostly PDFs/forums/YouTube = opening, build immediately; thick daily-updated Fandom = drop it
4. Verdict: build / winnable / drop / watch for a week, with a short paragraph of reasoning
Analysis only — do not write any files.
```

This is an **analysis prompt**: it writes no files, so instead of embedding a build-verification clause it constrains the output format (scoring table + an explicit verdict).

## Produce the first-day 10 pages plan

Once a game passes selection, immediately have the AI turn the verdict into a first-day 10 pages plan:

```text
Based on the selection verdict, plan the first-day 10 pages. Game name: <game name>; verified search terms: <list>.
Priority: codes → beginner guide → 3 boss guides → tier list → how-to-redeem FAQ → pages for the Top 3 window terms.
Output a table: priority / page / slug / category / suggested title / target keyword / materials I must provide.
Mark pages that lack data as "waiting on my input" and ask me with a clear list. Plan only — do not produce pages.
```

The logic behind the page order (why codes comes first):

| Order | Page | Why |
|---|---|---|
| 1 | `{game} codes` (codes frontmatter, automatic Active/Expired split) | The highest-traffic page type; players expect daily updates |
| 2 | Beginner guide (`guides`) | "How to start X" is a beginner's first search |
| 3-5 | The 3 most important boss/level guides (`bosses`, with stat cards) | Clear long-tail intent, highly citable |
| 6 | Tier list / best gear ranking | Commercial intent, high RPM |
| 7 | How to redeem / core-mechanics FAQ | Question-shaped H2 → featured snippet candidate |
| 8-10 | Pages for the Top 3 search terms verified during selection | Window terms come first |

## Intent → page type decision table (classify before creating any page)

| Search intent | Signature words | Page type | Never do this |
|---|---|---|---|
| Transactional | codes / redeem / free | Codes page (table + one-click copy) | Turn it into a 3,000-word guide |
| Informational | how to / how do I | Guide page (question-shaped H2s) | Pile up tables with no explanation |
| Commercial | best / tier / vs / ranking | Ranking/comparison page (table-first) | Refuse to give a verdict |
| Navigational | wiki / guide / map | Aggregation/category page | Only links with no content |

> **✅ Acceptance criteria (all must hold)**
> - Decision: you have an explicit "build / drop" verdict, not a "let's keep watching"
> - Plan: you hold a 10-row page plan table with slug/category/target keyword per row
> - ☐ Time: from starting selection to making the decision took ≤ 2 days
> - ☐ For every selected game you can state: the demand evidence (which two sources) + the competition evidence (SERP shape)

## Next steps

No site yet, but the game is chosen — the next chapter turns it into a full wiki site running in your local browser in 30 minutes. For a field-level reference on the game selection methodology, see [docs/game-selection.md](https://github.com/PNGTRID/AnvilWiki/blob/main/docs/game-selection.md).
