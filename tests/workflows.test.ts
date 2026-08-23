/**
 * Workflow smoke tests — keep the PR-gated content pipeline honest.
 *
 * The safety contract of the v2.0 pipeline lives in YAML, which no compiler
 * checks. These tests pin the load-bearing parts:
 *   1. ci.yml and auto-content.yml share ONE gates definition (composite
 *      action) and it contains all eight gate commands.
 *   2. auto-content.yml never triggers on push/PR/comment (workflow_dispatch
 *      only — collaborator gate), opens DRAFT PRs only, and has no
 *      write-permission surface beyond contents + pull-requests.
 *   3. The freshness audit stays upstream-only and issue-only (never a PR).
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, describe } from 'vitest';
import { parse } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readWorkflow = (rel: string): unknown =>
  parse(readFileSync(join(root, rel), 'utf8')) as unknown;

const GATES = '.github/actions/gates/action.yml';
const CI = '.github/workflows/ci.yml';
const AUTO = '.github/workflows/auto-content.yml';
const AUDIT = '.github/workflows/content-pipeline.yml';

const EIGHT_GATES = [
  'pnpm lint',
  'pnpm typecheck',
  'pnpm test',
  'pnpm check-config',
  'pnpm build',
  'pnpm check-content',
  'pnpm check-links',
  'pnpm check-i18n',
];

describe('shared gates composite action', () => {
  test('contains all eight gate commands', () => {
    const raw = readFileSync(join(root, GATES), 'utf8');
    for (const cmd of EIGHT_GATES) {
      expect(raw, `gates action should run "${cmd}"`).toContain(cmd);
    }
  });

  test('build step forwards the site-url input', () => {
    const action = readWorkflow(GATES) as {
      runs?: { steps?: { env?: Record<string, string> }[] };
    };
    const build = action.runs?.steps?.find((s) => s.env?.SITE_URL !== undefined);
    expect(build?.env?.SITE_URL).toBe('${{ inputs.site-url }}');
  });
});

describe('ci.yml uses the shared gates', () => {
  test('job runs ./.github/actions/gates', () => {
    const ci = readWorkflow(CI) as { jobs?: Record<string, { steps?: { uses?: string }[] }> };
    const uses = ci.jobs?.check?.steps?.map((s) => s.uses) ?? [];
    expect(uses).toContain('./.github/actions/gates');
  });
});

describe('auto-content pipeline safety contract', () => {
  const wf = readWorkflow(AUTO) as {
    on?: Record<string, unknown>;
    permissions?: Record<string, string>;
    jobs?: Record<string, { steps?: { uses?: string; with?: Record<string, unknown> }[] }>;
  };
  const steps = wf.jobs?.['generate-and-pr']?.steps ?? [];

  test('triggers on workflow_dispatch only (collaborator gate)', () => {
    expect(Object.keys(wf.on ?? {})).toEqual(['workflow_dispatch']);
  });

  test('permissions are exactly contents + pull-requests write', () => {
    expect(wf.permissions).toEqual({ contents: 'write', 'pull-requests': 'write' });
  });

  test('runs the shared gates before creating any PR', () => {
    const gateIdx = steps.findIndex((s) => s.uses === './.github/actions/gates');
    const prIdx = steps.findIndex((s) => (s.uses ?? '').includes('create-pull-request'));
    expect(gateIdx).toBeGreaterThan(-1);
    expect(prIdx).toBeGreaterThan(gateIdx);
  });

  test('PRs are drafts on a fixed branch (idempotent reruns)', () => {
    const pr = steps.find((s) => (s.uses ?? '').includes('create-pull-request'));
    expect(pr?.with?.draft).toBe(true);
    expect(pr?.with?.branch).toBe('chore/auto-content');
  });

  test('never references LLM/AI secrets', () => {
    const raw = readFileSync(join(root, AUTO), 'utf8');
    expect(raw).not.toMatch(/OPENAI|ANTHROPIC|API_KEY/);
    // The pipeline uses no secrets at all — GITHUB_TOKEN is implicit.
    expect(raw.match(/secrets\.[A-Z_]+/g) ?? []).toEqual([]);
  });
});

describe('action pinning consistency', () => {
  test('checkout/setup-node/pnpm SHAs are identical across all workflows', () => {
    // A one-character transcription typo in a pinned SHA fails at run time
    // with a confusing "unable to find version" — so pin the invariant here.
    const byAction = new Map<string, Set<string>>();
    for (const rel of [CI, AUTO, AUDIT]) {
      const raw = readFileSync(join(root, rel), 'utf8');
      for (const m of raw.matchAll(/uses: ((?:actions|pnpm)\/[a-z-]+)@([0-9a-f]{40})/g)) {
        const pins = byAction.get(m[1]) ?? new Set<string>();
        pins.add(m[2]);
        byAction.set(m[1], pins);
      }
    }
    expect(byAction.size).toBeGreaterThan(0);
    for (const [name, pins] of byAction) {
      expect([...pins], `${name} should be pinned to exactly one SHA everywhere`).toHaveLength(1);
    }
  });
});

describe('freshness audit stays read-only', () => {
  test('upstream-only guard and issues-only permissions unchanged', () => {
    const wf = readWorkflow(AUDIT) as {
      jobs?: Record<string, { if?: string }>;
      permissions?: Record<string, string>;
    };
    expect(wf.jobs?.audit?.if).toContain('github.repository');
    expect(wf.permissions).toEqual({ contents: 'read', issues: 'write' });
  });
});
