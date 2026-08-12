import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

import { locales, defaultLocale } from './src/i18n/routing';

// TEMP DEBUG: print all process.env keys + PUBLIC_* values to build log.
// This tells us exactly what Cloudflare injected into the build process.
const __envKeys = Object.keys(process.env).sort();
const __publicKeys = __envKeys.filter((k) => k.startsWith('PUBLIC_'));
console.log('[ENV-DEBUG] process.env has', __envKeys.length, 'keys total');
console.log('[ENV-DEBUG] PUBLIC_* keys:', JSON.stringify(__publicKeys));
for (const k of __publicKeys) {
  console.log(`[ENV-DEBUG]   ${k} = ${process.env[k]}`);
}
console.log('[ENV-DEBUG] GISCUS_REPO in process.env?', 'PUBLIC_GISCUS_REPO' in process.env);
console.log('[ENV-DEBUG] SITE_URL =', process.env.SITE_URL);

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://anvilwiki.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  image: {
    // Emit explicit width/height on responsive <Image> output to prevent CLS.
    responsiveStyles: true,
  },
  // Prefetch all internal links on hover — faster page transitions, no
  // View Transitions runtime needed. Adds a small IntersectionObserver script.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  i18n: {
    // Spread to convert readonly tuple to mutable array (Astro's Locales type).
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((l) => [l, l])),
      },
    }),
    tailwind({ applyBaseStyles: false }),
    icon(),
  ],
  vite: {
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
});
