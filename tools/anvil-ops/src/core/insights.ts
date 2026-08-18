import type { GscQueryResult } from './providers/gsc.js';
import type { CfQueryResult } from './providers/cloudflare.js';

// v1 thresholds (spec §6) — tune here, rules read only these.
export const THRESHOLDS = {
  lowCtrImpr: 200,
  lowCtr: 0.03,
  rankImpr: 100,
  rankMin: 5,
  rankMax: 15,
  cfTopVisits: 50,
  cfClickRatio: 20, // clicks < visits / ratio = "low clicks despite traffic"
};

export interface Insight {
  rule: string;
  severity: 'high' | 'medium' | 'low';
  finding: string;
  evidence: string;
  action: string;
  docs: string;
}

export interface InsightsInput {
  gsc?: GscQueryResult;
  cf?: CfQueryResult;
  staleCodesPages?: string[];
}

interface PageAgg {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
}

function aggregateByPage(rows: GscQueryResult['rows']): Map<string, PageAgg> {
  const map = new Map<string, PageAgg>();
  for (const r of rows) {
    const cur = map.get(r.page) ?? { page: r.page, clicks: 0, impressions: 0, ctr: 0 };
    cur.clicks += r.clicks;
    cur.impressions += r.impressions;
    map.set(r.page, cur);
  }
  for (const agg of map.values()) {
    agg.ctr = agg.impressions > 0 ? agg.clicks / agg.impressions : 0;
  }
  return map;
}

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

export function buildInsights(input: InsightsInput): Insight[] {
  const out: Insight[] = [];
  const byPage = input.gsc ? aggregateByPage(input.gsc.rows) : new Map<string, PageAgg>();

  // Rule 1: low CTR despite impressions -> rewrite title/description
  for (const agg of byPage.values()) {
    if (agg.impressions >= THRESHOLDS.lowCtrImpr && agg.ctr < THRESHOLDS.lowCtr) {
      out.push({
        rule: 'low-ctr',
        severity: 'high',
        finding: `${agg.page} shows ${agg.impressions} impressions but CTR ${(agg.ctr * 100).toFixed(1)}% (< ${(THRESHOLDS.lowCtr * 100).toFixed(0)}%)`,
        evidence: `clicks=${agg.clicks} impressions=${agg.impressions}`,
        action: 'Rewrite title/description to better match the queries shown in metrics; keep the direct-answer summary aligned.',
        docs: '.agent/skills/anvil-new-article (frontmatter title/description rules)',
      });
    }
  }

  // Rule 2: ranking 5-15 with real impressions -> internal links + deepen content
  if (input.gsc) {
    const seen = new Set<string>();
    for (const r of input.gsc.rows) {
      if (r.impressions >= THRESHOLDS.rankImpr && r.position >= THRESHOLDS.rankMin && r.position <= THRESHOLDS.rankMax) {
        if (seen.has(r.query)) continue;
        seen.add(r.query);
        out.push({
          rule: 'rank-5-15',
          severity: 'medium',
          finding: `Query "${r.query}" ranks #${r.position.toFixed(1)} (page 1-2 boundary) with ${r.impressions} impressions`,
          evidence: `page=${r.page} clicks=${r.clicks} position=${r.position.toFixed(1)}`,
          action: 'Add internal links from related high-traffic pages and deepen the section that answers this query.',
          docs: 'docs/content-format.md',
        });
      }
    }
  }

  // Rule 3: zero impressions -> indexing/internal-link check
  if (input.gsc) {
    for (const agg of byPage.values()) {
      if (agg.impressions === 0) {
        out.push({
          rule: 'zero-impression',
          severity: 'low',
          finding: `${agg.page} appears in GSC data with zero impressions`,
          evidence: 'impressions=0',
          action: 'Check the page is in sitemap.xml, linked from category/list pages, and not accidentally draft:true. Full coverage: compare against sitemap.',
          docs: 'docs/seo.md',
        });
      }
    }
  }

  // Rule 4: traffic mix — CF visits high, GSC clicks low
  if (input.cf && input.gsc) {
    for (const p of input.cf.pages) {
      if (p.visits < THRESHOLDS.cfTopVisits) continue;
      const gscAgg = byPage.get(p.page) ?? byPage.get(p.page.replace(/\/$/, '')) ?? byPage.get(p.page + '/');
      const clicks = gscAgg?.clicks ?? 0;
      if (clicks < p.visits / THRESHOLDS.cfClickRatio) {
        out.push({
          rule: 'traffic-mix',
          severity: 'medium',
          finding: `${p.page} gets ${p.visits} visits but only ${clicks} search clicks — traffic is mostly social/direct`,
          evidence: `cf_visits=${p.visits} gsc_clicks=${clicks}`,
          action: 'Either lean into the winning channel for this page, or improve its search alignment to capture the demand it proves.',
          docs: 'docs/seo.md',
        });
      }
    }
  }

  // Rule 5: stale codes pages
  for (const file of input.staleCodesPages ?? []) {
    out.push({
      rule: 'stale-codes',
      severity: 'high',
      finding: `Codes page not verified recently: ${file}`,
      evidence: 'refresh-audit flagged this page',
      action: 'Get the latest code list (official Discord/Trello), then run the anvil-update-codes skill.',
      docs: '.agent/skills/anvil-update-codes',
    });
  }

  return out.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

export function formatInsights(list: Insight[], degraded: ('gsc' | 'cf')[]): string {
  const lines = ['# Insights'];
  if (list.length === 0) {
    lines.push('', 'No actionable insights found for the current window.');
  }
  for (const i of list) {
    lines.push('', `## [${i.severity}] ${i.rule}`, `- Finding: ${i.finding}`, `- Evidence: ${i.evidence}`, `- Action: ${i.action}`, `- Docs: ${i.docs}`);
  }
  if (degraded.length) {
    lines.push('', `Degraded (not configured, rules limited): ${degraded.join(', ')}. Run \`anvil-ops doctor\` to enable.`);
  }
  return lines.join('\n') + '\n';
}
