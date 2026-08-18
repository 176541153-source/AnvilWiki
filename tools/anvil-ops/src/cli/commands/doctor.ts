import { runDoctor, formatDoctor } from '../../core/doctor.js';

export async function doctorCommand(): Promise<number> {
  const report = await runDoctor({ cwd: process.cwd() });
  process.stdout.write(formatDoctor(report));
  return report.checks.some((c) => !c.ok) ? 1 : 0;
}
