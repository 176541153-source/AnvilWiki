import { collectMetrics, formatMetrics } from '../../core/metrics.js';

export interface MetricsFlags {
  days: number;
  format: 'table' | 'json' | 'md';
  source?: 'gsc' | 'cf' | 'all';
}

export async function metricsCommand(flags: MetricsFlags): Promise<number> {
  const report = await collectMetrics({
    cwd: process.cwd(),
    days: flags.days,
    source: flags.source,
  });
  process.stdout.write(formatMetrics(report, flags.format));
  return 0;
}
