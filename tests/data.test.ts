import { describe, it, expect } from 'vitest';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getResources,
  getResourceById,
  getResourcesByCategory,
  getAllCategorySlugs,
  getAllResourceIds,
  validateDataIntegrity,
} from '@/lib/data';

describe('Data Utilities', () => {
  describe('getCategories', () => {
    it('should return an array of categories', () => {
      const categories = getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should return categories with required fields', () => {
      const categories = getCategories();
      categories.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('tags');
        expect(category).toHaveProperty('region');
        expect(category).toHaveProperty('updated_at');
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.slug).toBe('string');
        expect(Array.isArray(category.tags)).toBe(true);
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return a category when given a valid ID', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const category = getCategoryById(categories[0].id);
        expect(category).toBeDefined();
        expect(category?.id).toBe(categories[0].id);
      }
    });

    it('should return undefined for invalid ID', () => {
      const category = getCategoryById('invalid-id-that-does-not-exist');
      expect(category).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const category = getCategoryById('');
      expect(category).toBeUndefined();
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return a category when given a valid slug', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const category = getCategoryBySlug(categories[0].slug);
        expect(category).toBeDefined();
        expect(category?.slug).toBe(categories[0].slug);
      }
    });

    it('should return undefined for invalid slug', () => {
      const category = getCategoryBySlug('invalid-slug-that-does-not-exist');
      expect(category).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const category = getCategoryBySlug('');
      expect(category).toBeUndefined();
    });
  });

  describe('getResources', () => {
    it('should return an array of resources', () => {
      const resources = getResources();
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
    });

    it('should return resources with required fields', () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(resource).toHaveProperty('id');
        expect(resource).toHaveProperty('name');
        expect(resource).toHaveProperty('url');
        expect(resource).toHaveProperty('description');
        expect(resource).toHaveProperty('category');
        expect(resource).toHaveProperty('region');
        expect(resource).toHaveProperty('risk_level');
        expect(resource).toHaveProperty('auth_required');
        expect(resource).toHaveProperty('cost');
        expect(resource).toHaveProperty('type');
        expect(resource).toHaveProperty('tags');
        expect(resource).toHaveProperty('last_verified');
        expect(typeof resource.id).toBe('string');
        expect(typeof resource.name).toBe('string');
        expect(typeof resource.url).toBe('string');
        expect(typeof resource.auth_required).toBe('boolean');
        expect(Array.isArray(resource.tags)).toBe(true);
      });
    });
  });

  describe('getResourceById', () => {
    it('should return a resource when given a valid ID', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const resource = getResourceById(resources[0].id);
        expect(resource).toBeDefined();
        expect(resource?.id).toBe(resources[0].id);
      }
    });

    it('should return undefined for invalid ID', () => {
      const resource = getResourceById('invalid-id-that-does-not-exist');
      expect(resource).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const resource = getResourceById('');
      expect(resource).toBeUndefined();
    });
  });

  describe('getResourcesByCategory', () => {
    it('should return resources for a valid category', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const resources = getResourcesByCategory(categories[0].id);
        expect(Array.isArray(resources)).toBe(true);
        resources.forEach((resource) => {
          expect(resource.category).toBe(categories[0].id);
        });
      }
    });

    it('should return empty array for invalid category', () => {
      const resources = getResourcesByCategory('invalid-category-id');
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBe(0);
    });

    it('should return empty array for empty string', () => {
      const resources = getResourcesByCategory('');
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBe(0);
    });
  });

  describe('getAllCategorySlugs', () => {
    it('should return an array of slugs', () => {
      const slugs = getAllCategorySlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
    });

    it('should return unique slugs', () => {
      const slugs = getAllCategorySlugs();
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should return only non-empty strings', () => {
      const slugs = getAllCategorySlugs();
      slugs.forEach((slug) => {
        expect(typeof slug).toBe('string');
        expect(slug.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getAllResourceIds', () => {
    it('should return an array of IDs', () => {
      const ids = getAllResourceIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
    });

    it('should return unique IDs', () => {
      const ids = getAllResourceIds();
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should return only non-empty strings', () => {
      const ids = getAllResourceIds();
      ids.forEach((id) => {
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateDataIntegrity', () => {
    it('should return valid: true when data is valid', () => {
      const result = validateDataIntegrity();
      expect(result.valid).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should return no errors for valid data', () => {
      const result = validateDataIntegrity();
      expect(result.errors.length).toBe(0);
    });

    it('should validate category-resource relationships', () => {
      const result = validateDataIntegrity();
      const categoryErrors = result.errors.filter((error) =>
        error.includes('references invalid category')
      );
      expect(categoryErrors.length).toBe(0);
    });
  });
});
