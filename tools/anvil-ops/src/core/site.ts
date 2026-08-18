import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parse } from 'smol-toml';
import { OpsError } from './errors.js';

export interface SiteConfig {
  root: string;
  siteUrl?: string;
  cfBeaconToken?: string;
}

function clean(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export function loadSiteConfig(startDir: string): SiteConfig {
  let dir = resolve(startDir);
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, 'wrangler.toml'))) {
      const parsed = parse(readFileSync(join(dir, 'wrangler.toml'), 'utf8')) as {
        vars?: Record<string, string>;
      };
      const vars = parsed.vars ?? {};
      return {
        root: dir,
        siteUrl: clean(vars['SITE_URL'])?.replace(/\/+$/, ''),
        cfBeaconToken: clean(vars['PUBLIC_CF_BEACON_TOKEN']),
      };
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new OpsError(
    'No wrangler.toml found (searched up from ' + startDir + ').',
    'Run `anvil-ops` from inside your AnvilWiki fork. If you deleted wrangler.toml (see docs/deployment.md), re-create it with a [vars] SITE_URL, or restore it so anvil-ops can read your site config.',
  );
}
