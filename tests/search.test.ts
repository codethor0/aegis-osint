import { describe, it, expect } from 'vitest';
import {
  searchCategories,
  searchResources,
  filterResources,
  type ResourceFilters,
} from '@/lib/search';
import { getCategories, getResources } from '@/lib/data';

describe('Search Utilities', () => {
  describe('searchCategories', () => {
    it('should return all categories when query is empty', () => {
      const categories = getCategories();
      const results = searchCategories(categories, '');
      expect(results.length).toBe(categories.length);
    });

    it('should return all categories when query is whitespace', () => {
      const categories = getCategories();
      const results = searchCategories(categories, '   ');
      expect(results.length).toBe(categories.length);
    });

    it('should filter categories by name', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const query = categories[0].name.toLowerCase().substring(0, 3);
        const results = searchCategories(categories, query);
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((cat) => cat.id === categories[0].id)).toBe(true);
      }
    });

    it('should filter categories by description', () => {
      const categories = getCategories();
      if (categories.length > 0 && categories[0].description.length > 5) {
        const query = categories[0].description.toLowerCase().substring(0, 5);
        const results = searchCategories(categories, query);
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('should filter categories by tags', () => {
      const categories = getCategories();
      if (categories.length > 0 && categories[0].tags.length > 0) {
        const query = categories[0].tags[0].toLowerCase();
        const results = searchCategories(categories, query);
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('should return empty array for no matches', () => {
      const categories = getCategories();
      const results = searchCategories(
        categories,
        'nonexistent-query-that-will-never-match-anything-12345'
      );
      expect(results.length).toBe(0);
    });

    it('should be case-insensitive', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const query = categories[0].name.toUpperCase();
        const results = searchCategories(categories, query);
        expect(results.length).toBeGreaterThan(0);
      }
    });
  });

  describe('searchResources', () => {
    it('should return all resources when query is empty', () => {
      const resources = getResources();
      const results = searchResources(resources, '');
      expect(results.length).toBe(resources.length);
    });

    it('should filter resources by name', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const query = resources[0].name.toLowerCase().substring(0, 3);
        const results = searchResources(resources, query);
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((res) => res.id === resources[0].id)).toBe(true);
      }
    });

    it('should filter resources by description', () => {
      const resources = getResources();
      if (resources.length > 0 && resources[0].description.length > 5) {
        const query = resources[0].description.toLowerCase().substring(0, 5);
        const results = searchResources(resources, query);
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('should filter resources by tags', () => {
      const resources = getResources();
      if (resources.length > 0 && resources[0].tags.length > 0) {
        const query = resources[0].tags[0].toLowerCase();
        const results = searchResources(resources, query);
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('should filter resources by type', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const query = resources[0].type.toLowerCase();
        const results = searchResources(resources, query);
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('should return empty array for no matches', () => {
      const resources = getResources();
      const results = searchResources(
        resources,
        'nonexistent-query-that-will-never-match-anything-12345'
      );
      expect(results.length).toBe(0);
    });
  });

  describe('filterResources', () => {
    it('should return all resources when no filters applied', () => {
      const resources = getResources();
      const filters: ResourceFilters = {};
      const results = filterResources(resources, filters);
      expect(results.length).toBe(resources.length);
    });

    it('should filter by category', () => {
      const resources = getResources();
      const categories = getCategories();
      if (categories.length > 0) {
        const categoryResources = resources.filter((r) => r.category === categories[0].id);
        if (categoryResources.length > 0) {
          const filters: ResourceFilters = { category: categories[0].id };
          const results = filterResources(resources, filters);
          expect(results.length).toBe(categoryResources.length);
          results.forEach((resource) => {
            expect(resource.category).toBe(categories[0].id);
          });
        }
      }
    });

    it('should filter by cost', () => {
      const resources = getResources();
      const freeResources = resources.filter((r) => r.cost === 'free');
      if (freeResources.length > 0) {
        const filters: ResourceFilters = { cost: 'free' };
        const results = filterResources(resources, filters);
        expect(results.length).toBe(freeResources.length);
        results.forEach((resource) => {
          expect(resource.cost).toBe('free');
        });
      }
    });

    it('should filter by type', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const type = resources[0].type;
        const typeResources = resources.filter((r) => r.type === type);
        const filters: ResourceFilters = { type };
        const results = filterResources(resources, filters);
        expect(results.length).toBe(typeResources.length);
        results.forEach((resource) => {
          expect(resource.type).toBe(type);
        });
      }
    });

    it('should filter by risk level', () => {
      const resources = getResources();
      const lowRiskResources = resources.filter((r) => r.risk_level === 'low');
      if (lowRiskResources.length > 0) {
        const filters: ResourceFilters = { riskLevel: 'low' };
        const results = filterResources(resources, filters);
        expect(results.length).toBe(lowRiskResources.length);
        results.forEach((resource) => {
          expect(resource.risk_level).toBe('low');
        });
      }
    });

    it('should filter by auth required', () => {
      const resources = getResources();
      const authRequiredResources = resources.filter((r) => r.auth_required);
      if (authRequiredResources.length > 0) {
        const filters: ResourceFilters = { authRequired: true };
        const results = filterResources(resources, filters);
        expect(results.length).toBe(authRequiredResources.length);
        results.forEach((resource) => {
          expect(resource.auth_required).toBe(true);
        });
      }
    });

    it('should filter by API available', () => {
      const resources = getResources();
      const apiResources = resources.filter((r) => r.api_available === true);
      if (apiResources.length > 0) {
        const filters: ResourceFilters = { apiAvailable: true };
        const results = filterResources(resources, filters);
        expect(results.length).toBe(apiResources.length);
        results.forEach((resource) => {
          expect(resource.api_available).toBe(true);
        });
      }
    });

    it('should combine multiple filters', () => {
      const resources = getResources();
      const filters: ResourceFilters = {
        cost: 'free',
        riskLevel: 'low',
      };
      const results = filterResources(resources, filters);
      results.forEach((resource) => {
        expect(resource.cost).toBe('free');
        expect(resource.risk_level).toBe('low');
      });
    });
  });
});
