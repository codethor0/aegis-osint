import { describe, it, expect } from 'vitest';
import {
  getAllCategorySlugs,
  getAllResourceIds,
  getCategoryBySlug,
  getResourceById,
  getResourcesByCategory,
} from '@/lib/data';

describe('Integration Tests', () => {
  describe('Static Route Generation', () => {
    it('should generate valid category slugs for static params', async () => {
      const slugs = getAllCategorySlugs();
      expect(slugs.length).toBeGreaterThan(0);

      for (const slug of slugs) {
        const category = getCategoryBySlug(slug);
        expect(category).toBeDefined();
        expect(category?.slug).toBe(slug);
      }
    });

    it('should generate valid resource IDs for static params', async () => {
      const ids = getAllResourceIds();
      expect(ids.length).toBeGreaterThan(0);

      for (const id of ids) {
        const resource = getResourceById(id);
        expect(resource).toBeDefined();
        expect(resource?.id).toBe(id);
      }
    });

    it('should have no duplicate slugs', () => {
      const slugs = getAllCategorySlugs();
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have no duplicate resource IDs', () => {
      const ids = getAllResourceIds();
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Page Data Loading', () => {
    it('should load homepage data correctly', () => {
      const categories = getAllCategorySlugs();
      expect(categories.length).toBeGreaterThan(0);
      expect(Array.isArray(categories)).toBe(true);
    });

    it('should load categories page data correctly', () => {
      const slugs = getAllCategorySlugs();
      expect(slugs.length).toBeGreaterThan(0);

      slugs.forEach((slug) => {
        const category = getCategoryBySlug(slug);
        expect(category).toBeDefined();
        expect(category?.slug).toBe(slug);
      });
    });

    it('should load category detail page data correctly', () => {
      const slugs = getAllCategorySlugs();
      if (slugs.length > 0) {
        const category = getCategoryBySlug(slugs[0]);
        expect(category).toBeDefined();

        if (category) {
          const resources = getResourcesByCategory(category.id);
          expect(Array.isArray(resources)).toBe(true);
          resources.forEach((resource) => {
            expect(resource.category).toBe(category.id);
          });
        }
      }
    });

    it('should load resource detail page data correctly', () => {
      const ids = getAllResourceIds();
      if (ids.length > 0) {
        const resource = getResourceById(ids[0]);
        expect(resource).toBeDefined();

        if (resource) {
          expect(resource.id).toBe(ids[0]);
          expect(resource.name).toBeDefined();
          expect(resource.url).toBeDefined();
          expect(resource.description).toBeDefined();
        }
      }
    });

    it('should load search page data correctly', () => {
      const categories = getAllCategorySlugs();
      const resources = getAllResourceIds();
      expect(categories.length).toBeGreaterThan(0);
      expect(resources.length).toBeGreaterThan(0);
    });
  });

  describe('Data Consistency', () => {
    it('should have resources for all categories', () => {
      const slugs = getAllCategorySlugs();
      const categoriesWithResources: string[] = [];

      slugs.forEach((slug) => {
        const category = getCategoryBySlug(slug);
        if (category) {
          const resources = getResourcesByCategory(category.id);
          if (resources.length > 0) {
            categoriesWithResources.push(slug);
          }
        }
      });

      expect(categoriesWithResources.length).toBeGreaterThan(0);
    });

    it('should have valid category references in resources', () => {
      const ids = getAllResourceIds();
      const slugs = getAllCategorySlugs();
      const categoryIds = slugs
        .map((slug) => {
          const category = getCategoryBySlug(slug);
          return category?.id;
        })
        .filter(Boolean) as string[];

      ids.forEach((id) => {
        const resource = getResourceById(id);
        if (resource) {
          expect(categoryIds).toContain(resource.category);
        }
      });
    });
  });
});
