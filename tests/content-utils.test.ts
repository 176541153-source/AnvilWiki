import { describe, it, expect } from 'vitest';
import { parseEntryId, isPossiblyOutdated } from '~/lib/content-utils';
import { CATEGORY_REFRESH_DAYS } from '~/config/seo';

describe('parseEntryId', () => {
  it('parses a simple id into locale/category/slug', () => {
    expect(parseEntryId('en/bosses/emberfang')).toEqual({
      locale: 'en',
      category: 'bosses',
      slug: 'emberfang',
    });
  });

  it('strips the .mdx extension the glob loader includes in the id', () => {
    expect(parseEntryId('ja/bosses/emberfang.mdx')).toEqual({
      locale: 'ja',
      category: 'bosses',
      slug: 'emberfang',
    });
  });

  it('keeps nested slug segments joined with /', () => {
    expect(parseEntryId('en/guides/sub/deep/page')).toEqual({
      locale: 'en',
      category: 'guides',
      slug: 'sub/deep/page',
    });
  });

  it('returns null when the locale segment is not a configured locale', () => {
    expect(parseEntryId('fr/bosses/emberfang')).toBeNull();
  });

  it('returns null when there are fewer than 3 segments', () => {
    expect(parseEntryId('en/bosses')).toBeNull();
    expect(parseEntryId('en')).toBeNull();
    expect(parseEntryId('')).toBeNull();
  });
});

describe('isPossiblyOutdated', () => {
  const now = new Date('2026-08-16T00:00:00Z');
  const stale = new Date('2025-08-01T00:00:00Z'); // > 1 year before now
  const configuredCategory = Object.keys(CATEGORY_REFRESH_DAYS)[0];
  const configuredDays = CATEGORY_REFRESH_DAYS[configuredCategory];

  if (!configuredCategory || !configuredDays) {
    throw new Error('CATEGORY_REFRESH_DAYS must contain at least one policy for these tests');
  }

  it('is false for categories without a review policy regardless of age', () => {
    expect(isPossiblyOutdated('__unconfigured__', undefined, stale, now)).toBe(false);
  });

  it('uses the configured category review window at its exact boundary', () => {
    const justUnder = new Date(now.getTime() - (configuredDays - 1) * 86400000);
    const exact = new Date(now.getTime() - configuredDays * 86400000);
    const justOver = new Date(now.getTime() - (configuredDays + 1) * 86400000);
    expect(isPossiblyOutdated(configuredCategory, undefined, justUnder, now)).toBe(false);
    expect(isPossiblyOutdated(configuredCategory, undefined, exact, now)).toBe(true);
    expect(isPossiblyOutdated(configuredCategory, undefined, justOver, now)).toBe(true);
  });

  it('prefers lastModified over the publish date', () => {
    const fresh = new Date(now.getTime() - Math.max(1, configuredDays - 1) * 86400000);
    // Published long ago but touched recently → not outdated.
    expect(isPossiblyOutdated(configuredCategory, fresh, stale, now)).toBe(false);
    // Published recently but lastModified is ancient → outdated (data bug,
    // but the function must honor the explicit field).
    expect(isPossiblyOutdated(configuredCategory, stale, fresh, now)).toBe(true);
  });

  it('allows a per-article review-window override', () => {
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 86400000);
    expect(isPossiblyOutdated('__unconfigured__', undefined, fifteenDaysAgo, now, 10)).toBe(true);
    expect(isPossiblyOutdated(configuredCategory, undefined, fifteenDaysAgo, now, 30)).toBe(false);
  });
});
