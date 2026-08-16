/**
 * Pure content utilities — no `astro:content` import, so vitest can load
 * this module directly (the loaders in src/i18n/content.ts can't be unit
 * tested; these can). Re-exported through src/lib/content.ts for callers.
 */

import { isLocale, type Locale } from '~/i18n/routing';

/**
 * Parse an entry id like "en/bosses/emberfang" or "ja/bosses/sub/emberfang" into parts.
 * Returns null if the id doesn't match `<locale>/<category>/<...slug>`.
 */
export function parseEntryId(
  id: string,
): { locale: Locale; category: string; slug: string } | null {
  // Strip the .mdx extension that the glob loader includes in the id.
  const cleanId = id.replace(/\.mdx$/, '');
  const parts = cleanId.split('/');
  if (parts.length < 3) return null;
  const [locale, category, ...rest] = parts;
  if (!isLocale(locale)) return null;
  return { locale, category, slug: rest.join('/') };
}

/**
 * Categories whose content goes stale when the game updates (boss mechanics,
 * tier lists). Articles in these categories show a "possibly outdated" banner
 * when the last-modified date is older than STALE_AFTER_DAYS.
 */
export const STALE_CATEGORIES = ['bosses', 'tier-list'];
export const STALE_AFTER_DAYS = 90;

/**
 * True when the article is in a time-sensitive category and its
 * lastModified (or date) is older than STALE_AFTER_DAYS.
 * Pure function (testable without a build).
 */
export function isPossiblyOutdated(
  category: string,
  lastModified: Date | undefined,
  date: Date,
  now = new Date(),
): boolean {
  if (!STALE_CATEGORIES.includes(category)) return false;
  const ref = lastModified ?? date;
  const ageMs = now.getTime() - ref.getTime();
  return ageMs > STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
}
