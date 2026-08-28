/**
 * Site configuration — the single source of truth for game-specific metadata.
 *
 * 👉 APPLY TEMPLATE: Change every field here when building a new game wiki.
 * This is part of the CONFIG LAYER — framework code reads from here, never the reverse.
 */

export interface SiteConfig {
  /** Full site name, used in <title> suffix and Organization JSON-LD. e.g. "Anvil Quest Wiki" */
  name: string;
  /** Short name for PWA manifest and mobile logo. e.g. "AQ Wiki" */
  shortName: string;
  /** Iconify/Lucide icon used in the site header and footer. */
  brandIcon?: string;
  /** Optional custom logo image in public/. Preferred over brandIcon when provided. */
  brandLogo?: string;
  /** Site description for Organization JSON-LD and og:site_name. */
  description: string;
  /** Domain without protocol or trailing slash. e.g. "anvilquestwiki.wiki" */
  domain: string;
  /** Hero tagline shown under the site title. */
  tagline: string;
  /** Copyright / legal disclaimer line shown in footer. */
  legalNotice: string;
  social: {
    /** Official game website URL (the game itself, not the wiki). */
    official: string;
    discord?: string;
    youtube?: string;
    twitter?: string;
    reddit?: string;
    /** Source repository or public corrections tracker for this wiki. */
    github?: string;
  };
  /** Optional editorial profile rendered on the About page (E-E-A-T / GEO trust signal). */
  about?: {
    mission: string;
    coverage: string[];
    methodology: string[];
  };
  /** Canonical URLs about the GAME (official store page, Wikidata, etc.). */
  sameAs?: string[];
  /** Canonical profiles for the WIKI publisher itself, not the game entity. */
  organizationSameAs?: string[];
  game: {
    /** Full game name. */
    name: string;
    /** Platform: "Roblox" | "Steam" | "Epic Games" | "Mobile" | ... */
    platform: string;
    /** Developer / studio name. */
    developer: string;
    /** Whether `developer` is a studio/group or an individual creator. */
    developerType?: 'Organization' | 'Person';
    /** Canonical creator/developer profile URL. */
    developerUrl?: string;
    /** Other profiles that identify the same creator/developer entity. */
    developerSameAs?: string[];
    /** Genre description. */
    genre: string;
    /** ISO release date (optional). */
    releaseDate?: string;
    /** ISO date when the experience/project record was first created, if distinct from release. */
    creationDate?: string;
  };
  /**
   * Dimensions of the default OG/Twitter share image (public/images/hero.webp).
   * Emitted as og:image:width / og:image:height so social crawlers can render
   * the share card without downloading the image first.
   */
  ogImageWidth: number;
  ogImageHeight: number;
  /** Default author name for articles without an explicit `author` in frontmatter (E-E-A-T signal). */
  defaultAuthor?: string;
}

export const site: SiteConfig = {
  name: 'Anvil Quest Wiki',
  shortName: 'AQ Wiki',
  brandIcon: 'lucide:hammer',
  description:
    'Complete Anvil Quest wiki with boss guides, tier lists, codes, item locations, and beginner tips. Updated daily by the community.',
  domain: 'anvilwiki.pages.dev',
  tagline: 'Your forge for everything Anvil Quest',
  legalNotice:
    'Anvil Quest Wiki is a fan-made community site. Not affiliated with or endorsed by the game developer.',
  social: {
    official: 'https://example.com/anvil-quest',
    discord: 'https://discord.gg/example',
    youtube: 'https://youtube.com/@example',
    twitter: 'https://twitter.com/example',
    reddit: 'https://reddit.com/r/anvilquest',
    github: 'https://github.com/PNGTRID/AnvilWiki',
  },
  about: {
    mission:
      'Help Anvil Quest players find the shortest reliable path from a question to the next useful in-game action.',
    coverage: [
      'Beginner routes and progression guides',
      'Boss mechanics, item references, codes, and tier lists',
      'Dated update notes for information that can change after a patch',
    ],
    methodology: [
      'Official game pages and developer announcements are treated as primary sources.',
      'Community observations are labeled and dated instead of presented as permanent facts.',
      'Corrections are accepted through the public source repository.',
    ],
  },
  // 👉 APPLY TEMPLATE: point these at the game's real canonical pages.
  sameAs: ['https://example.com/anvil-quest', 'https://en.wikipedia.org/wiki/Anvil_Quest'],
  game: {
    name: 'Anvil Quest',
    platform: 'Roblox',
    developer: 'Forge Studios',
    developerType: 'Organization',
    genre: 'Fantasy RPG',
    releaseDate: '2026-01-15',
  },
  // hero.webp is 1200×630 (the recommended OG share aspect ratio).
  ogImageWidth: 1200,
  ogImageHeight: 630,
};

/** Absolute site URL (no trailing slash). Falls back to the Astro `site` config. */
export const siteUrl: string = (process.env.SITE_URL || `https://${site.domain}`).replace(
  /\/$/,
  '',
);
