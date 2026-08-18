import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { runDoctor, formatDoctor } from '../core/doctor.js';
import { collectMetrics, formatMetrics } from '../core/metrics.js';
import { OpsError } from '../core/errors.js';
import type { GscClient } from '../core/providers/gsc.js';
import type { queryCloudflare } from '../core/providers/cloudflare.js';

export interface BuildServerOpts {
  cwd: string;
  gscClientFactory?: (o: { credential: { clientEmail: string; privateKey: string }; siteUrl: string }) => GscClient;
  cfQuery?: typeof queryCloudflare;
}

function errText(e: unknown): string {
  return e instanceof OpsError ? `Error: ${e.message}\nFix: ${e.fix}` : `Error: ${String(e)}`;
}

export function buildServer(opts: BuildServerOpts): McpServer {
  const server = new McpServer({ name: 'anvilwiki-ops', version: '0.1.0' });

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

  return server;
}
