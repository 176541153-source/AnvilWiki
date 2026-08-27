/**
 * Per-site SEO freshness and indexability policy.
 *
 * This is CONFIG LAYER data: forks should tune category names and review
 * windows for the game they cover. Code, page banners, sitemap filtering,
 * and the scheduled freshness report all consume these values.
 */

/** Tag pages below this article count stay browsable but are noindex. */
export const MIN_INDEXABLE_TAG_COUNT = 2;

/** Default review windows for fast-changing article categories. */
export const CATEGORY_REFRESH_DAYS: Readonly<Record<string, number>> = {
  codes: 7,
  bosses: 90,
  'tier-list': 90,
};

export function refreshDaysFor(category: string, override?: number): number | undefined {
  return override ?? CATEGORY_REFRESH_DAYS[category];
}
