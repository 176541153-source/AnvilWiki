import { JWT } from 'google-auth-library';
import { OpsError } from '../errors.js';
import type { GscCredential } from '../env.js';

export interface GscRow {
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscQueryResult {
  rows: GscRow[];
  totals: { clicks: number; impressions: number; ctr: number; position: number };
}

interface GscApiRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

function windowDays(days: number): { startDate: string; endDate: string } {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1); // GSC data lags ~2 days; end at yesterday
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: iso(start), endDate: iso(end) };
}

export function gscQueryUrl(siteUrl: string): string {
  const property = siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
  return `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
}

export function parseGscResponse(json: unknown): GscQueryResult {
  const maybeError = json as { error?: { code?: number; message?: string } };
  if (maybeError?.error) {
    const code = maybeError.error.code ?? 0;
    const fix =
      code === 403
        ? 'Share the Search Console property with your service account email (Search Console > Settings > Users and permissions > Add user).'
        : 'Check the service account key with `anvil-ops doctor`.';
    throw new OpsError(`Google Search Console API error ${code}: ${maybeError.error.message ?? 'unknown'}`, fix);
  }
  const rows = ((json as { rows?: GscApiRow[] }).rows ?? []).map((r) => ({
    page: r.keys?.[0] ?? '',
    query: r.keys?.[1] ?? '',
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const n = rows.length || 1;
  const totals = {
    clicks: rows.reduce((s, r) => s + r.clicks, 0),
    impressions,
    ctr: rows.reduce((s, r) => s + r.ctr * r.impressions, 0) / (impressions || 1),
    position: rows.reduce((s, r) => s + r.position, 0) / n,
  };
  return { rows, totals };
}

export interface GscClient {
  query(params: { days: number }): Promise<GscQueryResult>;
  listAccessibleSites(): Promise<string[]>;
}

export function createGscClient(opts: { credential: GscCredential; siteUrl: string }): GscClient {
  const auth = new JWT({
    email: opts.credential.clientEmail,
    key: opts.credential.privateKey,
    scopes: [GSC_SCOPE],
  });
  return {
    async query({ days }) {
      const res = await auth.request({
        url: gscQueryUrl(opts.siteUrl),
        method: 'POST',
        data: { ...windowDays(days), dimensions: ['page', 'query'], rowLimit: 1000 },
      });
      return parseGscResponse(res.data);
    },
    async listAccessibleSites() {
      const res = await auth.request({
        url: 'https://searchconsole.googleapis.com/webmasters/v3/sites',
      });
      const data = res.data as { siteEntry?: { siteUrl?: string }[] };
      return (data.siteEntry ?? []).map((s) => s.siteUrl ?? '').filter(Boolean);
    },
  };
}
