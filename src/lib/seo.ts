/**
 * SEO utilities — JSON-LD builders and meta tag helpers.
 *
 * All builders return plain objects; the <JsonLd> component stringifies them.
 * Absolute URLs are produced via siteUrl + lib/url helpers.
 */

import { siteUrl } from '~/config/site';
import { site } from '~/config/site';
import { defaultLocale, type Locale } from '~/i18n/routing';
import { detailPath, listPath } from './url';

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const gameId = `${siteUrl}/#game`;

/** Organization JSON-LD — injected globally in BaseLayout. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    image: `${siteUrl}/images/hero.webp`,
    description: site.description,
    // Entity association: link the wiki to the game's canonical pages
    // (Steam / official site / Wikipedia) — knowledge-graph signal.
    ...(site.organizationSameAs && site.organizationSameAs.length > 0
      ? { sameAs: site.organizationSameAs }
      : {}),
  };
}

/** WebSite JSON-LD — injected on the homepage only. */
export function websiteJsonLd(locale: Locale = defaultLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: site.name,
    url: siteUrl,
    description: site.description,
    inLanguage: locale,
    publisher: { '@id': organizationId },
    about: { '@id': gameId },
  };
}

/** Article JSON-LD — injected on article detail pages. */
export function articleJsonLd(opts: {
  title: string;
  description: string;
  image?: string;
  datePublished: Date;
  dateModified?: Date;
  category: string;
  slug: string;
  locale: Locale;
  /** Named author (E-E-A-T) — renders as Person; falls back to the Organization. */
  authorName?: string;
  /** Profile URLs folded into the Person's sameAs (knowledge-graph signal). */
  authorSameAs?: string[];
  /** Visible byline identity; editorial desks should be Organization. */
  authorType?: 'Person' | 'Organization';
  /** Source URLs also shown in the visible evidence panel. */
  citations?: string[];
}) {
  const {
    title,
    description,
    image,
    datePublished,
    dateModified,
    category,
    slug,
    locale,
    authorName,
    authorSameAs,
    authorType = 'Person',
    citations,
  } = opts;
  const coverUrl = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/images/hero.webp`;
  const author = authorName
    ? {
        '@type': authorType,
        name: authorName,
        ...(authorSameAs && authorSameAs.length > 0 ? { sameAs: authorSameAs } : {}),
      }
    : { '@id': organizationId };
  const pageUrl = `${siteUrl}${detailPath(category, slug, locale)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    url: pageUrl,
    headline: title,
    description,
    image: coverUrl,
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified ?? datePublished).toISOString(),
    author,
    publisher: { '@id': organizationId },
    isPartOf: { '@id': websiteId },
    about: { '@id': gameId },
    ...(citations && citations.length > 0 ? { citation: citations } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };
}

/** BreadcrumbList JSON-LD — injected on article detail pages. */
export function breadcrumbJsonLd(opts: {
  category: string;
  categoryLabel: string;
  title: string;
  slug: string;
  locale: Locale;
  /** Localized "Home" label (locale JSON nav.home). */
  homeLabel?: string;
}) {
  const { category, categoryLabel, title, slug, locale, homeLabel = 'Home' } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: `${siteUrl}${locale === defaultLocale ? '' : `/${locale}`}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabel,
        item: `${siteUrl}${listPath(category, locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${siteUrl}${detailPath(category, slug, locale)}`,
      },
    ],
  };
}

/**
 * BreadcrumbList JSON-LD (2-level variant) for non-article pages
 * (list pages, FAQ, etc.). Home → pageLabel.
 *
 * Use breadcrumbJsonLd() for article pages (Home → Category → Article).
 */
export function simpleBreadcrumbJsonLd(opts: {
  /** Display name of the current page (e.g. category label or "FAQ"). */
  pageLabel: string;
  /** Absolute-or-relative path of the current page for a given locale. */
  path: string;
  locale: Locale;
  /** Localized "Home" label (locale JSON nav.home). */
  homeLabel?: string;
}) {
  const { pageLabel, path, locale, homeLabel = 'Home' } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: `${siteUrl}${locale === defaultLocale ? '' : `/${locale}`}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageLabel,
        item: `${siteUrl}${path}`,
      },
    ],
  };
}

/** ItemList JSON-LD — injected on list pages. */
export function itemListJsonLd(opts: {
  category: string;
  categoryLabel: string;
  locale: Locale;
  items: Array<{ title: string; slug: string }>;
}) {
  const { category, categoryLabel, locale, items } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryLabel,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.title,
      url: `${siteUrl}${detailPath(category, item.slug, locale)}`,
    })),
  };
}

/** FAQPage JSON-LD — for homepage FAQ section (eligible for SERP rich results). */
export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}

/**
 * Generic ItemList JSON-LD for cross-category lists (tag pages, recent
 * updates) where itemListJsonLd()'s single-category URL shape doesn't fit.
 * Each item carries its own absolute URL.
 */
export function urlListJsonLd(opts: {
  name: string;
  items: Array<{ title: string; url: string }>;
}) {
  const { name, items } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.title,
      url: item.url,
    })),
  };
}

/** ImageObject JSON-LD — one per gallery image (Google Images eligibility). */
export function imageObjectJsonLd(opts: { url: string; caption?: string; alt?: string }) {
  const { url, caption, alt } = opts;
  // Prefer the author-written alt as the name; caption describes context.
  const name = alt ?? caption;
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: url,
    ...(name ? { name, description: caption ?? name } : {}),
  };
}

/**
 * VideoObject JSON-LD — one per embedded YouTube video on an article page.
 * Eligible for Google Video search results. Authors must provide the video's
 * real upload date; substituting the article date would be false metadata.
 */
export function videoObjectJsonLd(opts: {
  id: string;
  title: string;
  description: string;
  uploadDate: Date;
}) {
  const { id, title, description, uploadDate } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
    uploadDate: uploadDate.toISOString(),
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
  };
}

const MAX_PAGE_TITLE_LENGTH = 65;

function clipPageTitle(title: string): string {
  if (title.length <= MAX_PAGE_TITLE_LENGTH) return title;

  const available = MAX_PAGE_TITLE_LENGTH - 1;
  const clipped = title.slice(0, available + 1);
  const boundary = Math.max(
    clipped.lastIndexOf(' '),
    clipped.lastIndexOf(':'),
    clipped.lastIndexOf('-'),
  );
  const base = (
    boundary >= Math.floor(available * 0.75)
      ? clipped.slice(0, boundary)
      : clipped.slice(0, available)
  )
    .replace(/[\s:—-]+$/, '')
    .trim();

  return `${base}…`;
}

/**
 * Build the <title> string without sacrificing a complete search title just
 * to fit the site-name suffix. Search intent is more useful than branding;
 * the suffix is added only when the complete result still fits.
 */
export function pageTitle(title: string): string {
  const cleanTitle = title.trim();
  const suffix = ` — ${site.name}`;
  if (cleanTitle.includes(site.name)) return clipPageTitle(cleanTitle);
  if ((cleanTitle + suffix).length <= MAX_PAGE_TITLE_LENGTH) return cleanTitle + suffix;
  return clipPageTitle(cleanTitle);
}

/** VideoGame JSON-LD — injected on the homepage for game entity recognition. */
export function videoGameJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    '@id': gameId,
    name: site.game.name,
    description: site.description,
    url: site.social.official,
    genre: site.game.genre,
    gamePlatform: site.game.platform,
    creator: {
      '@type': site.game.developerType ?? 'Organization',
      name: site.game.developer,
      ...(site.game.developerUrl ? { url: site.game.developerUrl } : {}),
      ...(site.game.developerSameAs && site.game.developerSameAs.length > 0
        ? { sameAs: site.game.developerSameAs }
        : {}),
    },
    mainEntityOfPage: site.social.official,
    ...(site.sameAs && site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
    ...(site.game.creationDate ? { dateCreated: site.game.creationDate } : {}),
    ...(site.game.releaseDate ? { datePublished: site.game.releaseDate } : {}),
  };
}
