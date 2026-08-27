import { describe, it, expect } from 'vitest';
import {
  organizationJsonLd,
  websiteJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  itemListJsonLd,
  faqPageJsonLd,
  pageTitle,
  videoGameJsonLd,
} from '~/lib/seo';

describe('SEO helpers', () => {
  describe('organizationJsonLd', () => {
    it('returns a valid Organization schema', () => {
      const json = organizationJsonLd();
      expect(json['@type']).toBe('Organization');
      expect(json['@context']).toBe('https://schema.org');
      expect(typeof json.name).toBe('string');
      expect(json.url).toMatch(/^https?:\/\//);
      expect(json.logo).toMatch(/\.png$/);
      expect(json['@id']).toMatch(/#organization$/);
    });
  });

  describe('websiteJsonLd', () => {
    it('returns a valid WebSite schema with locale', () => {
      const json = websiteJsonLd('en');
      expect(json['@type']).toBe('WebSite');
      expect(json.inLanguage).toBe('en');
      expect(json['@id']).toMatch(/#website$/);
      expect(json.publisher['@id']).toMatch(/#organization$/);
    });
  });

  describe('videoGameJsonLd', () => {
    it('keeps game and creator identities separate', () => {
      const json = videoGameJsonLd();
      expect(json['@id']).toMatch(/#game$/);
      expect(json.url).toBeTruthy();
      expect(json.creator.name).toBeTruthy();
      expect(json.creator['@type']).toBe('Organization');
    });
  });

  describe('articleJsonLd', () => {
    it('includes all required Article fields', () => {
      const json = articleJsonLd({
        title: 'Test Article',
        description: 'A test article description.',
        datePublished: new Date('2026-01-01'),
        category: 'bosses',
        slug: 'test-slug',
        locale: 'en',
      });
      expect(json['@type']).toBe('Article');
      expect(json.headline).toBe('Test Article');
      expect(json.datePublished).toContain('2026-01-01');
      expect(json.image).toMatch(/^https?:\/\//);
      expect(json.mainEntityOfPage['@id']).toMatch(/\/bosses\/test-slug$/);
      expect(json.publisher['@id']).toMatch(/#organization$/);
      expect(json.isPartOf['@id']).toMatch(/#website$/);
      expect(json.about['@id']).toMatch(/#game$/);
    });

    it('emits only visible evidence URLs as citations', () => {
      const citations = [
        'https://example.com/official-record',
        'https://example.com/independent-check',
      ];
      const json = articleJsonLd({
        title: 'Evidence-backed article',
        description: 'A source-backed article description for the schema test.',
        datePublished: new Date('2026-01-01'),
        category: 'bosses',
        slug: 'evidence-backed',
        locale: 'en',
        citations,
      });
      expect(json.citation).toEqual(citations);
      expect(json['@id']).toMatch(/\/bosses\/evidence-backed#article$/);
    });

    it('uses dateModified when provided, otherwise falls back to datePublished', () => {
      const published = new Date('2026-01-01');
      const modified = new Date('2026-06-01');
      const withModified = articleJsonLd({
        title: 'T',
        description: 'Desc that is long enough for validation here.',
        datePublished: published,
        dateModified: modified,
        category: 'bosses',
        slug: 's',
        locale: 'en',
      });
      expect(withModified.dateModified).toContain('2026-06-01');

      const noModified = articleJsonLd({
        title: 'T',
        description: 'Desc that is long enough for validation here.',
        datePublished: published,
        category: 'bosses',
        slug: 's',
        locale: 'en',
      });
      expect(noModified.dateModified).toContain('2026-01-01');
    });
  });

  describe('breadcrumbJsonLd', () => {
    it('produces a 3-level breadcrumb (Home → Category → Article)', () => {
      const json = breadcrumbJsonLd({
        category: 'bosses',
        categoryLabel: 'All Bosses',
        title: 'Emberfang Guide',
        slug: 'emberfang',
        locale: 'en',
      });
      expect(json['@type']).toBe('BreadcrumbList');
      expect(json.itemListElement).toHaveLength(3);
      expect(json.itemListElement[0].name).toBe('Home');
      expect(json.itemListElement[1].name).toBe('All Bosses');
      expect(json.itemListElement[2].name).toBe('Emberfang Guide');
    });
  });

  describe('itemListJsonLd', () => {
    it('numbers items starting from 1', () => {
      const json = itemListJsonLd({
        category: 'bosses',
        categoryLabel: 'All Bosses',
        locale: 'en',
        items: [
          { title: 'A', slug: 'a' },
          { title: 'B', slug: 'b' },
        ],
      });
      expect(json['@type']).toBe('ItemList');
      expect(json.itemListElement[0].position).toBe(1);
      expect(json.itemListElement[1].position).toBe(2);
    });
  });

  describe('faqPageJsonLd', () => {
    it('maps Q&A pairs to Question/Answer schema', () => {
      const json = faqPageJsonLd([{ question: 'What is X?', answer: 'X is Y.' }]);
      expect(json['@type']).toBe('FAQPage');
      expect(json.mainEntity[0]['@type']).toBe('Question');
      expect(json.mainEntity[0].acceptedAnswer.text).toBe('X is Y.');
    });
  });

  describe('pageTitle', () => {
    it('appends the site name with an em dash', () => {
      const t = pageTitle('Hello');
      expect(t).toContain('Hello');
      expect(t).toContain('—');
    });

    it('keeps the complete search title within 65 characters', () => {
      const t = pageTitle(
        'An extremely detailed long-tail boss strategy and rewards guide for beginners',
      );
      expect(t.length).toBeLessThanOrEqual(65);
      expect(t).toContain('—');
      expect(t).toContain('Anvil Quest Wiki');
    });
  });
});
