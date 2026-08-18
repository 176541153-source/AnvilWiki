import { runAudit, formatAudit } from '../../core/audit.js';

export async function auditCommand(): Promise<number> {
  const report = runAudit({ cwd: process.cwd() });
  process.stdout.write(formatAudit(report));
  return report.checks.some((c) => !c.ok) ? 1 : 0;
}
