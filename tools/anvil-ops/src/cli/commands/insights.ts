import { collectMetrics } from '../../core/metrics.js';
import { buildInsights, formatInsights, parseStaleCodes } from '../../core/insights.js';
import { defaultRun, type RunFn } from '../../core/content.js';
import { loadSiteConfig } from '../../core/site.js';
import { OpsError } from '../../core/errors.js';

export async function insightsCommand(flags: { days: number; run?: RunFn }): Promise<number> {
  const site = loadSiteConfig(process.cwd());
  const run = flags.run ?? defaultRun;

  // metrics are optional here: with no source at all we still surface rule 5
  let gsc: Awaited<ReturnType<typeof collectMetrics>>['gsc'];
  let cf: Awaited<ReturnType<typeof collectMetrics>>['cf'];
  let degraded: ('gsc' | 'cf')[] = [];
  try {
    const metrics = await collectMetrics({ cwd: site.root, days: flags.days });
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

  const staleRun = run('pnpm', ['refresh-audit'], { cwd: site.root });
  const stale = staleRun.status === 0 ? parseStaleCodes(staleRun.stdout) : [];

  const list = buildInsights({ gsc, cf, staleCodesPages: stale });
  process.stdout.write(formatInsights(list, degraded));
  return 0;
}
