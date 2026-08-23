/**
 * Pure-helper tests for `pnpm gen-covers` (src/lib/covers.ts).
 * Rendering itself (satori/resvg/CJK download) is exercised by running the
 * script — these pin the deterministic logic only.
 */
import { describe, expect, test } from 'vitest';
import {
  coverFilename,
  hasCjk,
  hslToHex,
  parseBrandHsl,
  pickCjkScript,
  pickFontSize,
  stableHash,
  stripEmoji,
  subsetText,
  titleWidthUnits,
} from '~/lib/covers';

describe('parseBrandHsl / hslToHex', () => {
  test('parses the light-mode --brand declaration', () => {
    const css = ':root {\n  --brand: 22 90% 52%;\n  --brand-light: 22 90% 62%;\n}';
    expect(parseBrandHsl(css)).toEqual({ h: 22, s: 90, l: 52 });
  });

  test('returns null when --brand is missing', () => {
    expect(parseBrandHsl(':root { --brand-light: 22 90% 62%; }')).toBeNull();
  });

  test('hslToHex matches known values', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
    expect(hslToHex(0, 0, 100)).toBe('#ffffff');
    expect(hslToHex(0, 0, 0)).toBe('#000000');
  });
});

describe('CJK detection', () => {
  test('hasCjk flags Han and kana, not Latin', () => {
    expect(hasCjk('Emberfang ボス攻略')).toBe(true);
    expect(hasCjk('完全ガイド')).toBe(true);
    expect(hasCjk('Plain English title')).toBe(false);
  });

  test('ja locale or kana picks JP glyph shapes; other Han picks SC', () => {
    expect(pickCjkScript('ja', '完全ガイド')).toBe('ja');
    expect(pickCjkScript('en', '火の玉')).toBe('ja'); // の is kana → JP glyphs
    expect(pickCjkScript('en', 'Anvil Quest')).toBeNull();
  });

  test('kana in text forces ja even on non-ja locale', () => {
    expect(pickCjkScript('en', 'ボス攻略')).toBe('ja');
    expect(pickCjkScript('en', '武器强度排行')).toBe('zh');
  });
});

describe('stripEmoji', () => {
  test('strips pictographs but keeps text', () => {
    expect(stripEmoji('Fire Titan ⚔️🔥')).toBe('Fire Titan');
    expect(stripEmoji('No emoji here')).toBe('No emoji here');
  });
});

describe('naming / hashing / subsetting', () => {
  test('coverFilename flattens the content id', () => {
    expect(coverFilename('en/bosses/emberfang')).toBe('en-bosses-emberfang.png');
    expect(coverFilename('ja/guides/beginner-guide')).toBe('ja-guides-beginner-guide.png');
  });

  test('stableHash is deterministic and hash-like', () => {
    expect(stableHash('abc')).toBe(stableHash('abc'));
    expect(stableHash('abc')).not.toBe(stableHash('abd'));
    expect(stableHash('abc')).toMatch(/^[0-9a-f]{8}$/);
  });

  test('subsetText dedupes and sorts glyphs', () => {
    expect(subsetText('abc', 'cbd')).toBe('abcd');
  });
});

describe('font sizing heuristics', () => {
  test('CJK chars count as full width, Latin as narrow', () => {
    expect(titleWidthUnits('ああ')).toBeGreaterThan(titleWidthUnits('aa'));
  });

  test('short titles get the max size, very long titles clamp to the floor', () => {
    expect(pickFontSize('Fire Titan')).toBe(84);
    const veryLong = 'x'.repeat(200);
    expect(pickFontSize(veryLong)).toBe(36);
  });
});
