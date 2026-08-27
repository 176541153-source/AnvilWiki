/**
 * refresh-audit.ts
 *
 * Deterministic content-freshness audit (v1.8) — the engine behind the
 * `content-pipeline` GitHub Actions workflow. No LLM, no network, no file
 * mutations: it only reports. The workflow turns the report into an issue
 * for the maintainer; fixing content stays a human/AI-session decision.
 *
 * Rules come from src/config/seo.ts (or per-article refreshAfterDays):
 *   - short windows (≤7 days) and codes → P0
 *   - other configured review windows → P1
 *   - evidence.checkedAt is the freshness clock when evidence is present
 *   - gameVersion behind the live game version is NOT auto-detectable —
 *     the report reminds the maintainer to check manually.
 *
 * Output: markdown report to stdout (+ $GITHUB_STEP_SUMMARY when set).
 * Always exits 0 — this is a report, not a gate.
 *
 * Usage: pnpm refresh-audit
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { refreshDaysFor } from '../src/config/seo';

const ROOT = process.cwd();
const BASE = path.resolve(ROOT, 'src/content/wiki');

interface Item {
  priority: 'P0' | 'P1';
  file: string;
  category: string;
  days: number;
  reason: string;
}

const files: string[] = [];
(function walk(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.mdx')) files.push(p);
  }
})(BASE);

const items: Item[] = [];
const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const fm = src.split('---')[1] ?? '';
  if (/^draft:\s*true\s*$/m.test(fm)) continue; // drafts never published
  const category = fm.match(/^category:\s*['"]?([\w-]+)/m)?.[1] ?? '';
  const dateStr = fm
    .match(/^date:\s*(.+)$/m)?.[1]
    ?.trim()
    .replace(/['"]/g, '');
  const lmStr = fm
    .match(/^lastModified:\s*(.+)$/m)?.[1]
    ?.trim()
    .replace(/['"]/g, '');
  const checkedAt = fm
    .match(/^\s*checkedAt:\s*(.+)$/m)?.[1]
    ?.trim()
    .replace(/['"]/g, '');
  const refStr = checkedAt || lmStr || dateStr;
  if (!refStr) continue;
  const ref = new Date(refStr);
  if (Number.isNaN(ref.getTime())) continue;
  const days = Math.floor((now - ref.getTime()) / DAY);
  const rel = path.relative(ROOT, file);

  const override = Number(fm.match(/^refreshAfterDays:\s*(\d+)$/m)?.[1] ?? '') || undefined;
  const maxAgeDays = refreshDaysFor(category, override);
  if (maxAgeDays && days >= maxAgeDays) {
    items.push({
      priority: category === 'codes' || maxAgeDays <= 7 ? 'P0' : 'P1',
      file: rel,
      category,
      days,
      reason: `stale ${days}d (review every ${maxAgeDays}d) — banner shown on page`,
    });
  }
}

items.sort((a, b) => a.days - b.days);

const today = new Date().toISOString().slice(0, 10);
const lines: string[] = [];
lines.push(`## Content freshness audit (${today})`);
lines.push('');
if (items.length === 0) {
  lines.push(`✅ Nothing stale. ${files.length} articles scanned.`);
} else {
  lines.push(`${items.length} item(s) need attention (${files.length} articles scanned):`);
  lines.push('');
  lines.push('| Priority | Article | Category | Age | Why |');
  lines.push('|---|---|---|---|---|');
  for (const it of items) {
    lines.push(`| ${it.priority} | \`${it.file}\` | ${it.category} | ${it.days}d | ${it.reason} |`);
  }
  lines.push('');
  lines.push('**Suggested actions**');
  lines.push(
    '- Codes pages: get the latest code list (official Discord/Trello), then run the `anvil-update-codes` skill.',
  );
  lines.push(
    '- Stale boss/tier-list pages: re-verify mechanics against the current game version, bump `lastModified`.',
  );
  lines.push('- Also spot-check `gameVersion` frontmatter against the live game version.');
}

const report = lines.join('\n');
console.log('\n' + report + '\n');

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  fs.appendFileSync(summaryPath, report + '\n', 'utf8');
}
