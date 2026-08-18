import { spawnSync } from 'node:child_process';

export type RunFn = (
  cmd: string,
  args: string[],
  opts: { cwd: string },
) => { status: number | null; stdout: string; stderr: string };

export const defaultRun: RunFn = (cmd, args, opts) => {
  const res = spawnSync(cmd, args, { cwd: opts.cwd, encoding: 'utf8' });
  if (res.error) {
    return { status: null, stdout: '', stderr: `${cmd} not found on PATH: ${res.error.message}` };
  }
  return { status: res.status, stdout: res.stdout ?? '', stderr: res.stderr ?? '' };
};

export interface CheckResult {
  name: string;
  ok: boolean;
  summary: string;
}

function lastLines(text: string, n = 5): string {
  const lines = text.trimEnd().split('\n');
  return lines.slice(Math.max(0, lines.length - n)).join('\n');
}

function runCheck(name: string, args: string[], opts: { cwd: string; run?: RunFn }): CheckResult {
  const res = (opts.run ?? defaultRun)('pnpm', args, { cwd: opts.cwd });
  return {
    name,
    ok: res.status === 0,
    summary: lastLines(`${res.stdout}\n${res.stderr}`.trim()),
  };
}

// Runs to completion without short-circuiting: audit reports want the full
// picture, and submit decides on all().ok afterwards.
export function runValidation(opts: { cwd: string; run?: RunFn }): CheckResult[] {
  const run = opts.run ?? defaultRun;
  return [
    runCheck('check-content', ['check-content'], opts),
    runCheck('check-i18n', ['check-i18n', '--strict'], opts),
    runCheck('build', ['build'], opts),
  ];
}
