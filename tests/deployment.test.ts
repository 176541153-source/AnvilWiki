import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Cloudflare Pages URL contract', () => {
  it('pairs file output with extensionless no-slash routes', () => {
    const config = readFileSync(join(root, 'astro.config.ts'), 'utf8');
    expect(config).toMatch(/format:\s*'file'/);
    expect(config).toMatch(/trailingSlash:\s*'never'/);
  });

  it('keeps the generated canonical on the public URL, not the .html artifact', () => {
    const layout = readFileSync(join(root, 'src/components/layout/BaseLayout.astro'), 'utf8');
    expect(layout).toContain("replace(/\\.html$/, '')");
    expect(layout).toContain('canonical === undefined ? publicUrl : canonical');
  });

  it('normalizes Pagefind file-output and sub-result URLs', () => {
    const search = readFileSync(join(root, 'src/components/header/SearchButton.astro'), 'utf8');
    expect(search).toContain("replace(/\\.html(?=([?#]|$))/, '')");
    expect(search).toContain('result?.sub_results?.forEach');
    expect(search).toContain('normalizeResultUrl(href)');
  });

  it('makes the 404 unindexable and omits its canonical', () => {
    const page = readFileSync(join(root, 'src/pages/404.astro'), 'utf8');
    expect(page).toContain('noindex={true}');
    expect(page).toContain('canonical={null}');
  });

  it('keeps host redirects out of the static request path', () => {
    expect(existsSync(join(root, 'functions/_middleware.js'))).toBe(false);
  });

  it('documents the supported pages.dev to canonical-domain redirect path', () => {
    const deployment = readFileSync(join(root, 'docs/deployment.md'), 'utf8');
    expect(deployment).toContain('Bulk Redirect');
    expect(deployment).toContain('Preserve path suffix');
    expect(deployment).toContain('不要用仓库里的全站 middleware');
  });
});
