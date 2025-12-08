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
        const firstCategory = categories[0];
        if (firstCategory) {
          const query = firstCategory.name.toLowerCase().substring(0, 3);
          const results = searchCategories(categories, query);
          expect(results.length).toBeGreaterThan(0);
          expect(results.some((cat) => cat.id === firstCategory.id)).toBe(true);
        }
      }
    });

    it('should filter categories by description', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const firstCategory = categories[0];
        if (firstCategory && firstCategory.description.length > 5) {
          const query = firstCategory.description.toLowerCase().substring(0, 5);
          const results = searchCategories(categories, query);
          expect(results.length).toBeGreaterThan(0);
        }
      }
    });

    it('should filter categories by tags', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const firstCategory = categories[0];
        if (firstCategory && firstCategory.tags.length > 0) {
          const firstTag = firstCategory.tags[0];
          if (firstTag) {
            const query = firstTag.toLowerCase();
            const results = searchCategories(categories, query);
            expect(results.length).toBeGreaterThan(0);
          }
        }
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
        const firstCategory = categories[0];
        if (firstCategory) {
          const query = firstCategory.name.toUpperCase();
          const results = searchCategories(categories, query);
          expect(results.length).toBeGreaterThan(0);
        }
      }
    });

    it('should support AND operator', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const firstCategory = categories[0];
        if (firstCategory && firstCategory.name.length > 5) {
          const words = firstCategory.name.split(' ').filter((w) => w.length > 2);
          if (words.length >= 2 && words[0] && words[1]) {
            const query = `${words[0]} AND ${words[1]}`;
            const results = searchCategories(categories, query);
            expect(results.length).toBeGreaterThan(0);
            results.forEach((cat) => {
              const lowerName = cat.name.toLowerCase();
              expect(lowerName.includes(words[0]!.toLowerCase())).toBe(true);
              expect(lowerName.includes(words[1]!.toLowerCase())).toBe(true);
            });
          }
        }
      }
    });

    it('should support OR operator', () => {
      const categories = getCategories();
      if (categories.length >= 2) {
        const firstCategory = categories[0];
        const secondCategory = categories[1];
        if (firstCategory && secondCategory) {
          const query = `${firstCategory.name.substring(0, 3)} OR ${secondCategory.name.substring(0, 3)}`;
          const results = searchCategories(categories, query);
          expect(results.length).toBeGreaterThan(0);
        }
      }
    });

    it('should support quoted phrases', () => {
      const categories = getCategories();
      if (categories.length > 0) {
        const firstCategory = categories[0];
        if (firstCategory && firstCategory.name.length > 5) {
          const phrase = firstCategory.name.substring(0, 5);
          const query = `"${phrase}"`;
          const results = searchCategories(categories, query);
          expect(results.length).toBeGreaterThan(0);
        }
      }
    });

    it('should handle queries exceeding MAX_QUERY_LENGTH', () => {
      const categories = getCategories();
      const longQuery = 'a'.repeat(2000);
      const results = searchCategories(categories, longQuery);
      expect(results.length).toBe(0);
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
        const firstResource = resources[0];
        if (firstResource) {
          const query = firstResource.name.toLowerCase().substring(0, 3);
          const results = searchResources(resources, query);
          expect(results.length).toBeGreaterThan(0);
          expect(results.some((res) => res.id === firstResource.id)).toBe(true);
        }
      }
    });

    it('should filter resources by description', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const firstResource = resources[0];
        if (firstResource && firstResource.description.length > 5) {
          const query = firstResource.description.toLowerCase().substring(0, 5);
          const results = searchResources(resources, query);
          expect(results.length).toBeGreaterThan(0);
        }
      }
    });

    it('should filter resources by tags', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const firstResource = resources[0];
        if (firstResource && firstResource.tags.length > 0) {
          const firstTag = firstResource.tags[0];
          if (firstTag) {
            const query = firstTag.toLowerCase();
            const results = searchResources(resources, query);
            expect(results.length).toBeGreaterThan(0);
          }
        }
      }
    });

    it('should filter resources by type', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const firstResource = resources[0];
        if (firstResource) {
          const query = firstResource.type.toLowerCase();
          const results = searchResources(resources, query);
          expect(results.length).toBeGreaterThan(0);
        }
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

    it('should support AND operator', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const firstResource = resources[0];
        if (firstResource && firstResource.name.length > 5) {
          const words = firstResource.name.split(' ').filter((w) => w.length > 2);
          if (words.length >= 2 && words[0] && words[1]) {
            const query = `${words[0]} AND ${words[1]}`;
            const results = searchResources(resources, query);
            expect(results.length).toBeGreaterThan(0);
            results.forEach((res) => {
              const lowerName = res.name.toLowerCase();
              expect(lowerName.includes(words[0]!.toLowerCase())).toBe(true);
              expect(lowerName.includes(words[1]!.toLowerCase())).toBe(true);
            });
          }
        }
      }
    });

    it('should support OR operator', () => {
      const resources = getResources();
      if (resources.length >= 2) {
        const firstResource = resources[0];
        const secondResource = resources[1];
        if (firstResource && secondResource) {
          const query = `${firstResource.name.substring(0, 3)} OR ${secondResource.name.substring(0, 3)}`;
          const results = searchResources(resources, query);
          expect(results.length).toBeGreaterThan(0);
        }
      }
    });

    it('should support quoted phrases', () => {
      const resources = getResources();
      if (resources.length > 0) {
        const firstResource = resources[0];
        if (firstResource && firstResource.name.length > 5) {
          const phrase = firstResource.name.substring(0, 5);
          const query = `"${phrase}"`;
          const results = searchResources(resources, query);
          expect(results.length).toBeGreaterThan(0);
        }
      }
    });

    it('should handle queries exceeding MAX_QUERY_LENGTH', () => {
      const resources = getResources();
      const longQuery = 'a'.repeat(2000);
      const results = searchResources(resources, longQuery);
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
        const firstCategory = categories[0];
        if (firstCategory) {
          const categoryResources = resources.filter((r) => r.category === firstCategory.id);
          if (categoryResources.length > 0) {
            const filters: ResourceFilters = { category: firstCategory.id };
            const results = filterResources(resources, filters);
            expect(results.length).toBe(categoryResources.length);
            results.forEach((resource) => {
              expect(resource.category).toBe(firstCategory.id);
            });
          }
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
        const firstResource = resources[0];
        if (firstResource) {
          const type = firstResource.type;
          const typeResources = resources.filter((r) => r.type === type);
          const filters: ResourceFilters = { type };
          const results = filterResources(resources, filters);
          expect(results.length).toBe(typeResources.length);
          results.forEach((resource) => {
            expect(resource.type).toBe(type);
          });
        }
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

    it('should filter by region', () => {
      const resources = getResources();
      const usResources = resources.filter((r) => r.region === 'US');
      if (usResources.length > 0) {
        const filters: ResourceFilters = { region: 'US' };
        const results = filterResources(resources, filters);
        expect(results.length).toBe(usResources.length);
        results.forEach((resource) => {
          expect(resource.region).toBe('US');
        });
      }
    });

    it('should combine region with other filters', () => {
      const resources = getResources();
      const filters: ResourceFilters = {
        region: 'US',
        cost: 'free',
        riskLevel: 'low',
      };
      const results = filterResources(resources, filters);
      results.forEach((resource) => {
        expect(resource.region).toBe('US');
        expect(resource.cost).toBe('free');
        expect(resource.risk_level).toBe('low');
      });
    });
  });
});
