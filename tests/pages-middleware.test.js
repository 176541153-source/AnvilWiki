import { describe, expect, it, vi } from 'vitest';

import { onRequest } from '../functions/_middleware.js';

function context(url, siteUrl = 'https://example.wiki') {
  return {
    request: new Request(url),
    env: { SITE_URL: siteUrl },
    next: vi.fn(async () => new Response('next')),
  };
}

describe('Cloudflare Pages hostname middleware', () => {
  it('redirects the stable pages.dev hostname to the canonical origin', async () => {
    const response = await onRequest(
      context('https://example-project.pages.dev/guides/start?from=legacy'),
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://example.wiki/guides/start?from=legacy');
  });

  it('keeps deployment previews available', async () => {
    const ctx = context('https://abc123.example-project.pages.dev/guides/start');
    const response = await onRequest(ctx);

    expect(response.status).toBe(200);
    expect(ctx.next).toHaveBeenCalledOnce();
  });

  it('does not redirect when pages.dev is already canonical', async () => {
    const ctx = context('https://anvilwiki.pages.dev/', 'https://anvilwiki.pages.dev');
    const response = await onRequest(ctx);

    expect(response.status).toBe(200);
    expect(ctx.next).toHaveBeenCalledOnce();
  });
});
