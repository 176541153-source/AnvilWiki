#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { doctorCommand } from '../cli/commands/doctor.js';
import { metricsCommand } from '../cli/commands/metrics.js';
import { OpsError } from '../core/errors.js';

const pkg = JSON.parse(readFileSync(fileURLToPath(new URL('../../package.json', import.meta.url)), 'utf8')) as {
  version: string;
};

const program = new Command();
program.name('anvil-ops').description('Ops toolkit for AnvilWiki fork sites').version(pkg.version);

program
  .command('doctor')
  .description('Check site config, env credentials, gh, GSC and CF access')
  .action(async () => {
    process.exitCode = await doctorCommand();
  });

program
  .command('metrics')
  .description('Pull GSC + Cloudflare Web Analytics metrics')
  .option('--days <n>', 'lookback window in days', '28')
  .option('--format <fmt>', 'output format: table | json | md', 'table')
  .option('--source <s>', 'limit to gsc | cf | all', 'all')
  .action(async (opts: { days: string; format: string; source: string }) => {
    if (!['table', 'json', 'md'].includes(opts.format)) {
      process.stderr.write(`Invalid --format "${opts.format}". Use table, json or md.\n`);
      process.exitCode = 1;
      return;
    }
    if (!['gsc', 'cf', 'all'].includes(opts.source)) {
      process.stderr.write(`Invalid --source "${opts.source}". Use gsc, cf or all.\n`);
      process.exitCode = 1;
      return;
    }
    const days = Number(opts.days);
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      process.stderr.write('--days must be an integer between 1 and 365.\n');
      process.exitCode = 1;
      return;
    }
    process.exitCode = await metricsCommand({
      days,
      format: opts.format as 'table' | 'json' | 'md',
      source: opts.source as 'gsc' | 'cf' | 'all',
    });
  });

program.parseAsync(process.argv).catch((e: unknown) => {
  if (e instanceof OpsError) {
    process.stderr.write(`Error: ${e.message}\nFix: ${e.fix}\n`);
  } else {
    process.stderr.write(`Error: ${String(e)}\n`);
  }
  process.exitCode = 1;
});
