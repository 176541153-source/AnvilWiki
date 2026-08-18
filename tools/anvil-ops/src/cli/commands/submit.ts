import { submit } from '../../core/gitops.js';

export async function submitCommand(flags: { title?: string; base?: string }): Promise<number> {
  const result = await submit({ cwd: process.cwd(), title: flags.title, base: flags.base });
  process.stdout.write(`Branch: ${result.branch}\nPull request: ${result.prUrl}\n`);
  return 0;
}
