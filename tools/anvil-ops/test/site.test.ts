import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadSiteConfig } from '../src/core/site.js';

function tmpDir(): string {
  return mkdtempSync(join(tmpdir(), 'ops-site-'));
}

describe('loadSiteConfig', () => {
  it('reads [vars] from wrangler.toml in the given dir and strips trailing slash', () => {
    const dir = tmpDir();
    copyFileSync('test/fixtures/wrangler-full.toml', join(dir, 'wrangler.toml'));
    const cfg = loadSiteConfig(dir);
    expect(cfg.root).toBe(dir);
    expect(cfg.siteUrl).toBe('https://wiki.example.com');
    expect(cfg.cfBeaconToken).toBe('beacon123');
  });

  it('walks up parent dirs to find wrangler.toml', () => {
    const dir = tmpDir();
    copyFileSync('test/fixtures/wrangler-minimal.toml', join(dir, 'wrangler.toml'));
    const nested = join(dir, 'a', 'b');
    mkdirSync(nested, { recursive: true });
    const cfg = loadSiteConfig(nested);
    expect(cfg.root).toBe(dir);
    expect(cfg.siteUrl).toBeUndefined();
    expect(cfg.cfBeaconToken).toBeUndefined();
  });

  it('empty beacon token string = undefined (env-gated)', () => {
    const dir = tmpDir();
    writeFileSync(
      join(dir, 'wrangler.toml'),
      '[vars]\nSITE_URL = "https://x.com"\nPUBLIC_CF_BEACON_TOKEN = ""\n',
    );
    const cfg = loadSiteConfig(dir);
    expect(cfg.cfBeaconToken).toBeUndefined();
  });

  it('no wrangler.toml anywhere = OpsError with fix guidance', () => {
    const dir = tmpDir();
    expect(() => loadSiteConfig(dir)).toThrow(/wrangler\.toml/);
  });
});
