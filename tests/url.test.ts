import { describe, it, expect } from 'vitest';
import {
  localizePath,
  listPath,
  detailPath,
  homeUrl,
  localeFromPath,
  slugifyTag,
  absoluteUrl,
  languageAlternates,
} from '~/lib/url';

describe('url helpers', () => {
  describe('localizePath', () => {
    it('returns the path unchanged for the default locale (en)', () => {
      expect(localizePath('/bosses', 'en')).toBe('/bosses');
      expect(localizePath('/bosses/emberfang', 'en')).toBe('/bosses/emberfang');
    });

    it('prepends the locale prefix for non-default locales', () => {
      expect(localizePath('/bosses', 'ja')).toBe('/ja/bosses');
      expect(localizePath('/bosses/emberfang', 'ja')).toBe('/ja/bosses/emberfang');
    });

    it('ensures leading slash on input without one', () => {
      expect(localizePath('about', 'en')).toBe('/about');
      expect(localizePath('about', 'ja')).toBe('/ja/about');
    });
  });

  describe('homeUrl', () => {
    it('returns / for default locale', () => {
      expect(homeUrl('en')).toBe('/');
    });
    it('returns /ja for non-default locale', () => {
      expect(homeUrl('ja')).toBe('/ja');
    });
  });

  describe('listPath', () => {
    it('builds the correct list URL for each locale', () => {
      expect(listPath('bosses', 'en')).toBe('/bosses');
      expect(listPath('bosses', 'ja')).toBe('/ja/bosses');
      expect(listPath('codes', 'en')).toBe('/codes');
    });
  });

  describe('detailPath', () => {
    it('builds the correct article URL for each locale', () => {
      expect(detailPath('bosses', 'emberfang', 'en')).toBe('/bosses/emberfang');
      expect(detailPath('bosses', 'emberfang', 'ja')).toBe('/ja/bosses/emberfang');
    });

    it('handles nested slugs', () => {
      expect(detailPath('guides', 'early-game/beginner', 'en')).toBe(
        '/guides/early-game/beginner',
      );
      expect(detailPath('guides', 'early-game/beginner', 'ja')).toBe(
        '/ja/guides/early-game/beginner',
      );
    });
  });

  describe('localeFromPath', () => {
    it('extracts the locale from a prefixed path', () => {
      expect(localeFromPath('/ja/bosses/emberfang')).toBe('ja');
      expect(localeFromPath('/ja')).toBe('ja');
    });

    it('returns the default locale when no prefix is present', () => {
      expect(localeFromPath('/bosses/emberfang')).toBe('en');
      expect(localeFromPath('/')).toBe('en');
      expect(localeFromPath('')).toBe('en');
    });
  });
});

describe('slugifyTag (CJK / non-ASCII fallback)', () => {
  it('slugifies ASCII tags to lowercase kebab-case', () => {
    expect(slugifyTag('Boss Guide')).toBe('boss-guide');
    expect(slugifyTag('Fire_Warden')).toBe('fire-warden');
  });

  it('percent-encodes CJK tags instead of collapsing to empty', () => {
    // The ASCII branch strips every CJK char → '' → all such tags would
    // collide on /tags/. The fallback keeps them unique and buildable.
    const zh = slugifyTag('焰牙');
    expect(zh).toBe(encodeURIComponent('焰牙'));
    expect(zh).not.toBe('');
    expect(zh.startsWith('%')).toBe(true);
  });

  it('keeps two different CJK tags distinguishable', () => {
    expect(slugifyTag('焰牙')).not.toBe(slugifyTag('风暴召唤者'));
  });

  it('keeps pure-symbol tags non-empty (unreserved marks stay, others encode)', () => {
    // encodeURIComponent leaves unreserved marks like '!' as-is…
    expect(slugifyTag('!!!')).toBe('!!!');
    // …and escapes others ('?' → %3F). Either way the slug is stable and
    // distinct from '' — the property the fallback exists to guarantee.
    expect(slugifyTag('  ???  ')).toBe('%3F%3F%3F');
  });
});

describe('absoluteUrl', () => {
  it('prefixes siteUrl and applies the locale prefix rules', () => {
    expect(absoluteUrl('/bosses', 'en')).toMatch(/^https:\/\/[^/]+\/bosses$/);
    expect(absoluteUrl('/bosses', 'ja')).toMatch(/^https:\/\/[^/]+\/ja\/bosses$/);
    expect(absoluteUrl('/', 'ja')).toMatch(/^https:\/\/[^/]+\/ja$/);
  });
});

describe('languageAlternates', () => {
  it('builds absolute hreflang entries for exactly the given locales', () => {
    const alts = languageAlternates((loc) => detailPath('bosses', 'x', loc), ['en', 'ja']);
    expect(alts).toHaveLength(2);
    expect(alts[0]).toEqual({ hreflang: 'en', href: expect.stringMatching(/\/bosses\/x$/) });
    expect(alts[1]).toEqual({ hreflang: 'ja', href: expect.stringMatching(/\/ja\/bosses\/x$/) });
  });

  it('never emits x-default (BaseLayout derives it separately)', () => {
    const alts = languageAlternates((loc) => listPath('guides', loc), ['en', 'ja']);
    expect(alts.some((a) => a.hreflang === 'x-default')).toBe(false);
  });

  it('honors a reduced locale list (single-language article)', () => {
    const alts = languageAlternates((loc) => detailPath('bosses', 'x', loc), ['ja']);
    expect(alts).toHaveLength(1);
    expect(alts[0].hreflang).toBe('ja');
  });
});
