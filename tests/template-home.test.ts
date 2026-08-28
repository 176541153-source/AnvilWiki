import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import {
  buildHomePreset,
  buildCanonicalWorker,
  replaceWranglerVars,
  rewriteLocaleJson,
  type SkinInput,
} from '../scripts/apply-template';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath: string) => readFileSync(join(root, relativePath), 'utf8');

const baseInput: SkinInput = {
  gameName: 'Signal Harbor',
  siteName: 'Harbor Signal Lab',
  shortName: 'SH Lab',
  brandIcon: 'lucide:radar',
  brandLogo: '/logo.png',
  domain: 'signal-harbor.wiki',
  pagesHost: 'signal-harbor.pages.dev',
  tagline: 'Find the next route',
  description: 'Signal Harbor guides, codes, routes, and dated update references for players.',
  legalNotice: 'Signal Harbor Wiki is an independent fan site.',
  themeHex: '#0ea5e9',
  platform: 'Steam',
  developer: 'Example Studio',
  genre: 'Adventure',
  releaseDate: '',
  officialUrl: 'https://example.com/signal-harbor',
  locales: ['en'],
  categories: [
    { key: 'guides', icon: 'lucide:book-open' },
    { key: 'codes', icon: 'lucide:gift' },
    { key: 'bosses', icon: 'lucide:swords' },
    { key: 'items', icon: 'lucide:package' },
  ],
  clearContent: false,
  clearLanding: false,
  homePreset: 'guides',
};

describe('task-first homepage preset', () => {
  test('guide preset emits configurable string CTAs, quick actions, and diagnose routes', () => {
    const home = buildHomePreset(baseInput) as Record<string, any>;

    expect(home.hero.ctaPrimary).toBeTypeOf('string');
    expect(home.hero.ctaPrimaryHref).toBe('/guides');
    expect(home.hero.ctaPrimaryIcon).toBe('lucide:route');
    expect(home.hero.quickActions).toHaveLength(3);
    expect(home.hero.panel.imageAlt).toContain(baseInput.gameName);
    expect(home.diagnose.cards).toHaveLength(4);
    expect(home.diagnose.cards.map((card: { href: string }) => card.href)).toContain('/recent');
    expect(home.closingCta.primaryHref).toBe('/guides');
  });

  test('codes preset keeps the primary route on the configured codes category', () => {
    const home = buildHomePreset({ ...baseInput, homePreset: 'codes' }) as Record<string, any>;

    expect(home.hero.ctaPrimaryHref).toBe('/codes');
    expect(home.hero.ctaPrimaryIcon).toBe('lucide:gift');
    expect(home.diagnose.cards[0].href).toBe('/codes');
  });

  test('preset copy is generated from input rather than the demo game', () => {
    const home = buildHomePreset(baseInput);
    const serialized = JSON.stringify(home);

    expect(serialized).toContain(baseInput.gameName);
    expect(serialized).not.toContain('Anvil Quest');
  });
});

describe('reusable homepage contract', () => {
  test('canonical worker redirects pages.dev previews and www without redirecting apex', () => {
    const generated = buildCanonicalWorker(baseInput);

    expect(generated).toContain(`const CANONICAL_HOST = "${baseInput.domain}"`);
    expect(generated).toContain(`const PAGES_HOST = "${baseInput.pagesHost}"`);
    expect(generated).toContain('hostname.endsWith(`.${PAGES_HOST}`)');
    expect(generated).toContain('return env.ASSETS.fetch(request)');
  });

  test('locale generator keeps utility labels and creates every selected category', () => {
    const generated = JSON.parse(
      rewriteLocaleJson(
        baseInput,
        'en',
        JSON.stringify({
          site: { name: 'Anvil Quest Wiki' },
          nav: { home: 'Home', search: 'Search', guides: 'Guides' },
          overview: {
            guides: {
              overviewTitle: 'All Guides',
              overviewDescription: 'Anvil Quest progression guides.',
            },
          },
        }),
      ),
    );

    expect(generated.nav.home).toBe('Home');
    expect(generated.nav.search).toBe('Search');
    expect(generated.site.name).toBe(baseInput.siteName);
    expect(Object.keys(generated.overview)).toEqual(['guides', 'codes', 'bosses', 'items']);
    expect(generated.overview.guides.overviewDescription).toContain(baseInput.gameName);
    expect(generated.overview.codes.overviewTitle).toBe('All Codes');
  });

  test('wrangler generator ignores [vars] text inside comments', () => {
    const generated = replaceWranglerVars(
      `# Replace the [vars] values below.\nname = "anvilwiki"\n\n[vars]\nSITE_URL = "https://anvilwiki.pages.dev"\nPUBLIC_GISCUS_REPO = "PNGTRID/AnvilWiki"\n`,
      baseInput,
    );

    expect(generated).toContain('# Replace the [vars] values below.');
    expect(generated.match(/^\[vars\]$/gm)).toHaveLength(1);
    expect(generated).toContain(`SITE_URL = "https://${baseInput.domain}"`);
    expect(generated).not.toContain('PNGTRID/AnvilWiki');
  });

  test('schema matches the string CTA shape used by locale JSON', () => {
    const schema = JSON.parse(read('docs/home.schema.json'));
    const hero = schema.properties.home.properties.hero.properties;
    const closing = schema.properties.home.properties.closingCta.properties;

    expect(hero.ctaPrimary.type).toBe('string');
    expect(hero.ctaPrimaryHref.type).toBe('string');
    expect(schema.properties.home.properties.diagnose).toBeDefined();
    expect(closing.primary.type).toBe('string');
    expect(closing.primaryHref.type).toBe('string');
  });

  test('header/footer branding and public corrections are configuration driven', () => {
    expect(read('src/components/header/SiteHeader.astro')).toContain('site.brandLogo');
    expect(read('src/components/header/SiteHeader.astro')).toContain(
      "site.brandIcon ?? 'lucide:hammer'",
    );
    expect(read('src/components/footer/SiteFooter.astro')).toContain('site.social.github');
    expect(read('src/components/layout/LegalContent.astro')).toContain('site.about?.methodology');
  });

  test('demo video cards use a local placeholder instead of fake YouTube IDs', () => {
    const demo = `${read('src/locales/en.json')}\n${read('src/locales/ja.json')}`;

    expect(demo).toContain('/images/video-placeholder.svg');
    expect(demo).not.toMatch(/"youtubeId": "(?:a{11}|b{11}|c{11})"/);
  });
});
