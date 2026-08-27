/**
 * Pure content utilities — no `astro:content` import, so vitest can load
 * this module directly (the loaders in src/i18n/content.ts can't be unit
 * tested; these can). Re-exported through src/lib/content.ts for callers.
 */

import { isLocale, type Locale } from '~/i18n/routing';
import { CATEGORY_REFRESH_DAYS, refreshDaysFor } from '~/config/seo';

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

/** Categories with a configured review window. */
export const STALE_CATEGORIES = Object.keys(CATEGORY_REFRESH_DAYS);
/** Legacy default retained for API compatibility; policies now live in config/seo.ts. */
export const STALE_AFTER_DAYS = 90;

/**
 * True when the article's evidence check / last edit exceeds its configured
 * category review window (or a per-article `refreshAfterDays` override).
 * Pure function (testable without a build).
 */
export function isPossiblyOutdated(
  category: string,
  lastModified: Date | undefined,
  date: Date,
  now = new Date(),
  refreshAfterDays?: number,
): boolean {
  const maxAgeDays = refreshDaysFor(category, refreshAfterDays);
  if (!maxAgeDays) return false;
  const ref = lastModified ?? date;
  const ageMs = now.getTime() - ref.getTime();
  return ageMs >= maxAgeDays * 24 * 60 * 60 * 1000;
}
