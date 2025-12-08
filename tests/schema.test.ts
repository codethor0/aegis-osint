import { describe, it, expect } from 'vitest';
import { getCategories, getResources, validateDataIntegrity } from '@/lib/data';
import type { Category, Resource } from '@/lib/types';

describe('Schema Validation', () => {
  describe('Category Schema', () => {
    it('should have all required fields', () => {
      const categories = getCategories();
      categories.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('tags');
        expect(category).toHaveProperty('region');
        expect(category).toHaveProperty('updated_at');
      });
    });

    it('should have valid field types', () => {
      const categories = getCategories();
      categories.forEach((category) => {
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.description).toBe('string');
        expect(typeof category.slug).toBe('string');
        expect(Array.isArray(category.tags)).toBe(true);
        expect(typeof category.region).toBe('string');
        expect(typeof category.updated_at).toBe('string');
      });
    });

    it('should have valid region values', () => {
      const validRegions = ['US', 'US-Federal', 'US-State', 'Global', 'International'];
      const categories = getCategories();
      categories.forEach((category) => {
        expect(validRegions).toContain(category.region);
      });
    });

    it('should have unique IDs', () => {
      const categories = getCategories();
      const ids = categories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique slugs', () => {
      const categories = getCategories();
      const slugs = categories.map((c) => c.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have non-empty required fields', () => {
      const categories = getCategories();
      categories.forEach((category) => {
        expect(category.id.length).toBeGreaterThan(0);
        expect(category.name.length).toBeGreaterThan(0);
        expect(category.description.length).toBeGreaterThan(0);
        expect(category.slug.length).toBeGreaterThan(0);
        expect(category.tags.length).toBeGreaterThan(0);
      });
    });

    it('should have valid ISO 8601 dates', () => {
      const categories = getCategories();
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      categories.forEach((category) => {
        expect(iso8601Regex.test(category.updated_at)).toBe(true);
      });
    });
  });

  describe('Resource Schema', () => {
    it('should have all required fields', () => {
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
      });
    });

    it('should have valid field types', () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(typeof resource.id).toBe('string');
        expect(typeof resource.name).toBe('string');
        expect(typeof resource.url).toBe('string');
        expect(typeof resource.description).toBe('string');
        expect(typeof resource.category).toBe('string');
        expect(typeof resource.region).toBe('string');
        expect(typeof resource.risk_level).toBe('string');
        expect(typeof resource.auth_required).toBe('boolean');
        expect(typeof resource.cost).toBe('string');
        expect(typeof resource.type).toBe('string');
        expect(Array.isArray(resource.tags)).toBe(true);
        expect(typeof resource.last_verified).toBe('string');
      });
    });

    it('should have valid enum values', () => {
      const validRegions = ['US', 'US-Federal', 'US-State', 'Global', 'International'];
      const validRiskLevels = ['none', 'low', 'medium', 'high'];
      const validCosts = ['free', 'freemium', 'paid'];
      const validTypes = [
        'lookup',
        'search_engine',
        'government_data',
        'api',
        'database',
        'tool',
        'browser_extension',
        'mobile_app',
        'desktop_app',
        'script',
        'framework',
        'aggregator',
        'social_media',
        'court_records',
        'property_records',
        'corporate_records',
      ];

      const resources = getResources();
      resources.forEach((resource) => {
        expect(validRegions).toContain(resource.region);
        expect(validRiskLevels).toContain(resource.risk_level);
        expect(validCosts).toContain(resource.cost);
        expect(validTypes).toContain(resource.type);
      });
    });

    it('should have unique IDs', () => {
      const resources = getResources();
      const ids = resources.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid URLs', () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(resource.url).toMatch(/^https?:\/\//);
      });
    });

    it('should have valid ISO 8601 dates', () => {
      const resources = getResources();
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      resources.forEach((resource) => {
        expect(iso8601Regex.test(resource.last_verified)).toBe(true);
      });
    });

    it('should have non-empty required fields', () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(resource.id.length).toBeGreaterThan(0);
        expect(resource.name.length).toBeGreaterThan(0);
        expect(resource.url.length).toBeGreaterThan(0);
        expect(resource.description.length).toBeGreaterThan(0);
        expect(resource.category.length).toBeGreaterThan(0);
        expect(resource.tags.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have valid category-resource relationships', () => {
      const result = validateDataIntegrity();
      expect(result.valid).toBe(true);
      const relationshipErrors = result.errors.filter((error) =>
        error.includes('references invalid category')
      );
      expect(relationshipErrors.length).toBe(0);
    });

    it('should have no duplicate resource IDs', () => {
      const result = validateDataIntegrity();
      const duplicateErrors = result.errors.filter((error) =>
        error.includes('Duplicate resource IDs')
      );
      expect(duplicateErrors.length).toBe(0);
    });

    it('should have no duplicate category slugs', () => {
      const result = validateDataIntegrity();
      const duplicateErrors = result.errors.filter((error) =>
        error.includes('Duplicate category slugs')
      );
      expect(duplicateErrors.length).toBe(0);
    });
  });
});
