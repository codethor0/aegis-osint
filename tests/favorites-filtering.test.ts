import { describe, it, expect, beforeEach, vi } from 'vitest';
import { filterResources, type ResourceFilters } from '@/lib/search';
import { getResources } from '@/lib/data';
import type { Resource } from '@/lib/types';

describe('Favorites Page Filtering', () => {
  let allResources: Resource[] = [];
  let bookmarkedResources: Resource[] = [];

  beforeEach(() => {
    allResources = getResources();
    if (allResources.length > 0) {
      bookmarkedResources = allResources.slice(0, 5);
    }
  });

  describe('Category Filtering', () => {
    it('should filter bookmarked resources by category', () => {
      if (bookmarkedResources.length > 0) {
        const firstResource = bookmarkedResources[0];
        if (firstResource) {
          const filters: ResourceFilters = { category: firstResource.category };
          const filtered = filterResources(bookmarkedResources, filters);
          expect(filtered.length).toBeGreaterThan(0);
          filtered.forEach((resource) => {
            expect(resource.category).toBe(firstResource.category);
          });
        }
      }
    });

    it('should return empty array when no bookmarks match category', () => {
      const filters: ResourceFilters = { category: 'non-existent-category' };
      const filtered = filterResources(bookmarkedResources, filters);
      expect(filtered.length).toBe(0);
    });
  });

  describe('Region Filtering', () => {
    it('should filter bookmarked resources by region', () => {
      const usResources = bookmarkedResources.filter((r) => r.region === 'US');
      if (usResources.length > 0) {
        const filters: ResourceFilters = { region: 'US' };
        const filtered = filterResources(bookmarkedResources, filters);
        expect(filtered.length).toBe(usResources.length);
        filtered.forEach((resource) => {
          expect(resource.region).toBe('US');
        });
      }
    });
  });

  describe('Risk Level Filtering', () => {
    it('should filter bookmarked resources by risk level', () => {
      const lowRiskResources = bookmarkedResources.filter((r) => r.risk_level === 'low');
      if (lowRiskResources.length > 0) {
        const filters: ResourceFilters = { riskLevel: 'low' };
        const filtered = filterResources(bookmarkedResources, filters);
        expect(filtered.length).toBe(lowRiskResources.length);
        filtered.forEach((resource) => {
          expect(resource.risk_level).toBe('low');
        });
      }
    });
  });

  describe('Cost Filtering', () => {
    it('should filter bookmarked resources by cost', () => {
      const freeResources = bookmarkedResources.filter((r) => r.cost === 'free');
      if (freeResources.length > 0) {
        const filters: ResourceFilters = { cost: 'free' };
        const filtered = filterResources(bookmarkedResources, filters);
        expect(filtered.length).toBe(freeResources.length);
        filtered.forEach((resource) => {
          expect(resource.cost).toBe('free');
        });
      }
    });
  });

  describe('Combined Filtering', () => {
    it('should apply multiple filters simultaneously', () => {
      const filters: ResourceFilters = {
        region: 'US',
        cost: 'free',
        riskLevel: 'low',
      };
      const filtered = filterResources(bookmarkedResources, filters);
      filtered.forEach((resource) => {
        expect(resource.region).toBe('US');
        expect(resource.cost).toBe('free');
        expect(resource.risk_level).toBe('low');
      });
    });

    it('should return empty array when combined filters match nothing', () => {
      const filters: ResourceFilters = {
        category: 'non-existent',
        region: 'US',
      };
      const filtered = filterResources(bookmarkedResources, filters);
      expect(filtered.length).toBe(0);
    });
  });

  describe('Empty Bookmarks', () => {
    it('should handle empty bookmarked resources', () => {
      const emptyBookmarks: Resource[] = [];
      const filters: ResourceFilters = { category: 'people-search-identity' };
      const filtered = filterResources(emptyBookmarks, filters);
      expect(filtered.length).toBe(0);
    });
  });
});

