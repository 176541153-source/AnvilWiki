/**
 * Pure helpers for `pnpm gen-covers` (og:image cover generation, v2.0).
 *
 * Framework-free on purpose: the script (scripts/gen-covers.ts) and the unit
 * tests (tests/covers.test.ts) both import from here; nothing in src/ renders
 * at runtime — covers are build-time assets.
 */

export interface BrandHsl {
  h: number;
  s: number;
  l: number;
}

/**
 * Parse the light-mode `--brand: H S% L%;` declaration out of globals.css.
 * The brand color is the single source of truth for theming — covers must
 * read it from there instead of hardcoding hex values.
 */
export function parseBrandHsl(css: string): BrandHsl | null {
  const m = css.match(/--brand:\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  return m ? { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) } : null;
}

export function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const v = ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const CJK_RE = /[\u{3040}-\u{30ff}\u{31f0}-\u{31ff}\u{3400}-\u{4dbf}\u{4e00}-\u{9fff}\u{f900}-\u{faff}]/u;
const KANA_RE = /[\u{3040}-\u{30ff}]/u;

export function hasCjk(text: string): boolean {
  return CJK_RE.test(text);
}

/**
 * Which Noto CJK variant the glyphs need: Japanese locale or kana in the
 * text → JP glyph shapes; otherwise Han → SC. Returns null when no CJK.
 */
export function pickCjkScript(locale: string, text: string): 'ja' | 'zh' | null {
  if (!hasCjk(text)) return null;
  if (locale.toLowerCase().startsWith('ja') || KANA_RE.test(text)) return 'ja';
  return 'zh';
}

/**
 * satori ships no emoji font (emoji render as images there, not glyphs) —
 * strip pictographs from cover text. The caller warns when this changes it.
 */
export function stripEmoji(text: string): string {
  return text.replace(/[\p{Extended_Pictographic}\u{FE0F}]/gu, '').trim();
}

/** Cover filename from a content id: "en/bosses/emberfang" → "en-bosses-emberfang.png". */
export function coverFilename(entryId: string): string {
  return (
    entryId
      .split('/')
      .filter(Boolean)
      .join('-') + '.png'
  );
}

/** Estimated rendered width in em units (CJK ≈ 1em, most Latin ≈ 0.55em). */
export function titleWidthUnits(title: string): number {
  let units = 0;
  for (const ch of title) units += CJK_RE.test(ch) ? 1 : 0.55;
  return units;
}

/**
 * Title font size that keeps the title within ~2 lines of the 1008px text
 * column (1200px canvas − 2×72 padding − 48 for the brand bar). Long titles
 * shrink instead of overflowing — satori has no auto-fit.
 */
export function pickFontSize(title: string): number {
  const units = Math.max(titleWidthUnits(title), 1);
  return Math.max(36, Math.min(84, Math.round((2 * 1008) / units)));
}

/** FNV-1a 32-bit hash, hex-encoded — manifest key, stable across runs. */
export function stableHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * The exact glyph set to keep when subsetting a CJK font: every unique
 * character across all strings that will appear on the cover. Full CJK
 * fonts are ~16MB; a per-title subset is typically 60–200KB.
 */
export function subsetText(...parts: string[]): string {
  return [...new Set(parts.join(''))].sort().join('');
}
