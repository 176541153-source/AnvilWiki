# anvilwiki-ops

Ops toolkit for [AnvilWiki](https://github.com/PNGTRID/AnvilWiki) fork sites. Run from your fork's repo root.

> Status: 0.1.2 on npm. Commands: `doctor`, `metrics`, `audit`, `insights`, `submit`, `mcp` (stdio MCP server). Works with or without wrangler.toml (falls back to `.env` SITE_URL / PUBLIC_CF_BEACON_TOKEN).

## Usage

```bash
npx anvilwiki-ops doctor
npx anvilwiki-ops metrics --days 28 --format md
npx anvilwiki-ops audit
npx anvilwiki-ops insights
npx anvilwiki-ops submit --title "add emberfang guide"   # validate -> branch -> push -> PR
```

## MCP (for Claude / ZCode / any MCP client)

Add to your MCP client config:

```json
{
  "mcpServers": {
    "anvil-ops": {
      "command": "npx",
      "args": ["-y", "anvilwiki-ops", "mcp"]
    }
  }
}
```

Tools: `doctor`, `metrics`, `audit`, `insights`, `submit_pr` (markdown output, agent-friendly). Run `doctor` first in any ops session; `submit_pr` requires uncommitted changes + gh and never pushes main.

## Configuration (.env in repo root, gitignored)

| Variable | Required for | Notes |
|---|---|---|
| `GSC_SERVICE_ACCOUNT_JSON` | GSC metrics | `{`-prefixed inline JSON or a file path |
| `CF_API_TOKEN` | CF metrics | token with Account > Analytics > Read |
| `CF_ACCOUNT_ID` | CF metrics | Cloudflare account ID |

`SITE_URL` and `PUBLIC_CF_BEACON_TOKEN` are read from `wrangler.toml [vars]` — no extra setup if your fork already deploys.

Empty values disable the feature (no error). Run `anvil-ops doctor` for guided setup checks.

## GSC setup (5 minutes)

1. Google Cloud Console → new project → enable **Search Console API**.
2. IAM → Service Accounts → create → Keys → add JSON key. Keep this file: it is the robot's credential. The `...gserviceaccount.com` address is **not** a real mailbox (no password, no login) — just Google's robot ID format.
3. GSC's "Add user" rejects robot IDs ("invalid email"). Relay through a Google Group instead: groups.google.com → create a group → allow external members → add the service-account address (`client_email` in the key JSON) as a **direct** member (not an invite) → then in Search Console add the **group email** as a Restricted user. Fresh groups may take minutes–hours to be accepted; retry later on "unspecified error".
4. Put the JSON path (or contents) in `.env` as `GSC_SERVICE_ACCOUNT_JSON`.

## CF Web Analytics setup

1. Cloudflare dashboard → your account → Web Analytics (already sending data via the template's beacon).
2. Create API token with **Account > Analytics > Read**.
3. Set `CF_API_TOKEN` and `CF_ACCOUNT_ID` in `.env`.

## Development

This package lives in `tools/anvil-ops/` inside the template repo but is fully self-contained (own lockfile, own tsconfig; the repo root excludes `tools/` from its lint/typecheck).

```bash
cd tools/anvil-ops
pnpm install   # self workspace root (pnpm-workspace.yaml with allowBuilds)
pnpm test
pnpm build
```
