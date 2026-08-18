import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectMetrics, formatMetrics } from '../src/core/metrics.js';
import type { GscClient } from '../src/core/providers/gsc.js';
import type { queryCloudflare } from '../src/core/providers/cloudflare.js';

function tmpSite(dotenv: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'ops-metrics-'));
  writeFileSync(join(dir, 'wrangler.toml'), '[vars]\nSITE_URL = "https://wiki.example.com"\nPUBLIC_CF_BEACON_TOKEN = "tag1"\n');
  writeFileSync(join(dir, '.env'), dotenv);
  return dir;
}

const fakeGsc: GscClient = {
  async query() {
    return {
      rows: [{ page: '/b', query: 'q', clicks: 10, impressions: 100, ctr: 0.1, position: 3 }],
      totals: { clicks: 10, impressions: 100, ctr: 0.1, position: 3 },
    };
  },
  async listAccessibleSites() {
    return ['https://wiki.example.com/'];
  },
};

const fakeCf = (async () => ({
  totals: { visits: 42 },
  pages: [{ page: 'https://wiki.example.com/', visits: 42 }],
})) as unknown as typeof queryCloudflare;

describe('collectMetrics', () => {
  it('full config: both sources present', async () => {
    const dir = tmpSite(`CF_API_TOKEN=t\nCF_ACCOUNT_ID=a\nGSC_SERVICE_ACCOUNT_JSON=${JSON.stringify({ client_email: 'e@x', private_key: 'k' })}\n`);
    const r = await collectMetrics({
      cwd: dir,
      days: 7,
      gscClientFactory: () => fakeGsc,
      cfQuery: fakeCf,
    });
    expect(r.gsc?.totals.clicks).toBe(10);
    expect(r.cf?.totals.visits).toBe(42);
    expect(r.degraded).toEqual([]);
  });

  it('no GSC config: CF-only with degraded note', async () => {
    const dir = tmpSite('CF_API_TOKEN=t\nCF_ACCOUNT_ID=a\n');
    const r = await collectMetrics({ cwd: dir, days: 7, cfQuery: fakeCf });
    expect(r.gsc).toBeUndefined();
    expect(r.degraded).toEqual(['gsc']);
  });

  it('nothing configured: OpsError pointing at doctor', async () => {
    const dir = tmpSite('');
    await expect(collectMetrics({ cwd: dir, days: 7 })).rejects.toMatchObject({ fix: expect.stringMatching(/doctor/) });
  });
});

describe('formatMetrics', () => {
  const base = {
    days: 28,
    siteUrl: 'https://wiki.example.com',
    degraded: ['gsc'] as ('gsc' | 'cf')[],
    notes: [] as string[],
    cf: { totals: { visits: 42 }, pages: [{ page: 'https://wiki.example.com/', visits: 42 }] },
  };

  it('json is parseable and lossless', () => {
    const parsed = JSON.parse(formatMetrics(base, 'json'));
    expect(parsed.cf.totals.visits).toBe(42);
  });

  it('md mentions degraded source', () => {
    const md = formatMetrics(base, 'md');
    expect(md).toContain('# Metrics');
    expect(md).toContain('gsc');
  });

  it('table renders a header row', () => {
    expect(formatMetrics(base, 'table')).toContain('visits');
  });
});
