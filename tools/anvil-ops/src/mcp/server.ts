import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { runDoctor, formatDoctor } from '../core/doctor.js';
import { collectMetrics, formatMetrics } from '../core/metrics.js';
import { runAudit, formatAudit } from '../core/audit.js';
import { buildInsights, formatInsights, parseStaleCodes } from '../core/insights.js';
import { submit } from '../core/gitops.js';
import { defaultRun, type RunFn } from '../core/content.js';
import { OpsError } from '../core/errors.js';
import { loadSiteConfig } from '../core/site.js';
import type { GscClient } from '../core/providers/gsc.js';
import type { queryCloudflare } from '../core/providers/cloudflare.js';

export interface BuildServerOpts {
  cwd: string;
  gscClientFactory?: (o: { credential: { clientEmail: string; privateKey: string }; siteUrl: string }) => GscClient;
  cfQuery?: typeof queryCloudflare;
  run?: RunFn;
}

function errText(e: unknown): string {
  return e instanceof OpsError ? `Error: ${e.message}\nFix: ${e.fix}` : `Error: ${String(e)}`;
}

// Read version from package.json at startup so it can never drift from the
// published package (works from both src/ via vitest and dist/ via node).
const pkgVersion = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
).version as string;

export function buildServer(opts: BuildServerOpts): McpServer {
  const server = new McpServer({ name: 'anvilwiki-ops', version: pkgVersion });

  server.registerTool(
    'doctor',
    {
      title: 'anvil-ops doctor',
      description:
        'Health check for AnvilWiki site ops: wrangler.toml site config, gh CLI, GSC service account, CF Web Analytics token. Run this FIRST in any ops session before other anvil-ops tools.',
      inputSchema: {},
    },
    async () => {
      try {
        const report = await runDoctor({ cwd: opts.cwd });
        return { content: [{ type: 'text', text: formatDoctor(report) }] };
      } catch (e) {
        return { isError: true, content: [{ type: 'text', text: errText(e) }] };
      }
    },
  );

  server.registerTool(
    'metrics',
    {
      title: 'anvil-ops metrics',
      description:
        'Pull site traffic metrics: Google Search Console (clicks/impressions/CTR/position by page and query) + Cloudflare Web Analytics (visits by page). Requires .env credentials; run doctor first if unset.',
      inputSchema: {
        days: z.number().int().min(1).max(365).default(28).describe('lookback window in days'),
        source: z.enum(['gsc', 'cf', 'all']).default('all').describe('limit to one source'),
      },
    },
    async ({ days, source }) => {
      try {
        const report = await collectMetrics({
          cwd: opts.cwd,
          days: days ?? 28,
          source: source ?? 'all',
          gscClientFactory: opts.gscClientFactory,
          cfQuery: opts.cfQuery,
        });
        return { content: [{ type: 'text', text: formatMetrics(report, 'md') }] };
      } catch (e) {
        return { isError: true, content: [{ type: 'text', text: errText(e) }] };
      }
    },
  );

  server.registerTool(
    'audit',
    {
      title: 'anvil-ops audit',
      description:
        'Run the template maintenance checks (refresh-audit, check-i18n, check-content, check-links) and return one markdown report. check-links audits dist/ — run a build first for full link coverage.',
      inputSchema: {},
    },
    async () => {
      try {
        const report = runAudit({ cwd: opts.cwd, run: opts.run });
        return { content: [{ type: 'text', text: formatAudit(report) }] };
      } catch (e) {
        return { isError: true, content: [{ type: 'text', text: errText(e) }] };
      }
    },
  );

  server.registerTool(
    'insights',
    {
      title: 'anvil-ops insights',
      description:
        'Data-driven SEO action list from GSC + Cloudflare metrics plus stale-codes detection: low-CTR rewrites, rank 5-15 deepening, zero-impression checks, traffic-mix analysis, stale codes pages. Metrics degrade gracefully if credentials are unset (run doctor first).',
      inputSchema: {
        days: z.number().int().min(1).max(365).default(28).describe('metrics lookback window in days'),
      },
    },
    async ({ days }) => {
      try {
        let gsc: Awaited<ReturnType<typeof collectMetrics>>['gsc'];
        let cf: Awaited<ReturnType<typeof collectMetrics>>['cf'];
        let degraded: ('gsc' | 'cf')[] = [];
        try {
          const metrics = await collectMetrics({
            cwd: opts.cwd,
            days: days ?? 28,
            gscClientFactory: opts.gscClientFactory,
            cfQuery: opts.cfQuery,
          });
          gsc = metrics.gsc;
          cf = metrics.cf;
          degraded = metrics.degraded;
        } catch (e) {
          if (e instanceof OpsError && /No analytics source/.test(e.message)) {
            degraded = ['gsc', 'cf'];
          } else {
            throw e;
          }
        }
        const site = loadSiteConfig(opts.cwd);
        const run = opts.run ?? defaultRun;
        const staleRun = run('pnpm', ['refresh-audit'], { cwd: site.root });
        const stale = staleRun.status === 0 ? parseStaleCodes(staleRun.stdout) : [];
        const list = buildInsights({ gsc, cf, staleCodesPages: stale });
        return { content: [{ type: 'text', text: formatInsights(list, degraded) }] };
      } catch (e) {
        return { isError: true, content: [{ type: 'text', text: errText(e) }] };
      }
    },
  );

  server.registerTool(
    'submit_pr',
    {
      title: 'anvil-ops submit_pr',
      description:
        'Publish workflow changes: validates (check-content + check-i18n + build), then creates branch ops/submit-*, commits, pushes, and opens a PR via gh. REQUIRES uncommitted changes in the worktree, gh CLI, and an origin remote. Never pushes main. Validation failure = nothing committed.',
      inputSchema: {
        title: z.string().optional().describe('PR / commit title'),
        base: z.string().optional().describe('PR base branch (default main)'),
      },
    },
    async ({ title, base }) => {
      try {
        const result = await submit({ cwd: opts.cwd, title, base, run: opts.run });
        return {
          content: [{ type: 'text', text: `# PR opened\n\n- Branch: ${result.branch}\n- Pull request: ${result.prUrl}\n\nMerge after review; Cloudflare Pages deploys automatically.` }],
        };
      } catch (e) {
        return { isError: true, content: [{ type: 'text', text: errText(e) }] };
      }
    },
  );

  return server;
}
