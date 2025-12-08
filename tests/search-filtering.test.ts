import { describe, it, expect } from 'vitest';
import {
  filterResourcesMultiSelect,
  parseFilterParam,
  encodeFilterParam,
  isEmptyFilters,
  clearAllFilters,
  type MultiSelectFilters,
} from '@/lib/filtering';
import type { Resource } from '@/lib/types';

describe('Advanced Filtering System', () => {
  const mockResources: Resource[] = [
    {
      id: 'resource-1',
      name: 'Resource 1',
      url: 'https://example.com/1',
      description: 'Test resource 1',
      category: 'category-a',
      region: 'US',
      risk_level: 'low',
      auth_required: false,
      cost: 'free',
      type: 'lookup',
      tags: [],
      last_verified: '2024-01-01T00:00:00Z',
    },
    {
      id: 'resource-2',
      name: 'Resource 2',
      url: 'https://example.com/2',
      description: 'Test resource 2',
      category: 'category-b',
      region: 'US-Federal',
      risk_level: 'medium',
      auth_required: false,
      cost: 'freemium',
      type: 'lookup',
      tags: [],
      last_verified: '2024-01-01T00:00:00Z',
    },
    {
      id: 'resource-3',
      name: 'Resource 3',
      url: 'https://example.com/3',
      description: 'Test resource 3',
      category: 'category-a',
      region: 'Global',
      risk_level: 'high',
      auth_required: false,
      cost: 'paid',
      type: 'lookup',
      tags: [],
      last_verified: '2024-01-01T00:00:00Z',
    },
    {
      id: 'resource-4',
      name: 'Resource 4',
      url: 'https://example.com/4',
      description: 'Test resource 4',
      category: 'category-c',
      region: 'US-State',
      risk_level: 'none',
      auth_required: false,
      cost: 'free',
      type: 'lookup',
      tags: [],
      last_verified: '2024-01-01T00:00:00Z',
    },
  ];

  describe('parseFilterParam', () => {
    it('should parse comma-separated values', () => {
      expect(parseFilterParam('value1,value2,value3')).toEqual(['value1', 'value2', 'value3']);
    });

    it('should handle single value', () => {
      expect(parseFilterParam('value1')).toEqual(['value1']);
    });

    it('should handle empty string', () => {
      expect(parseFilterParam('')).toEqual([]);
    });

    it('should handle null or undefined', () => {
      expect(parseFilterParam(null)).toEqual([]);
      expect(parseFilterParam(undefined)).toEqual([]);
    });

    it('should trim whitespace', () => {
      expect(parseFilterParam(' value1 , value2 , value3 ')).toEqual(['value1', 'value2', 'value3']);
    });

    it('should filter out empty values', () => {
      expect(parseFilterParam('value1,,value2, ,value3')).toEqual(['value1', 'value2', 'value3']);
    });
  });

  describe('encodeFilterParam', () => {
    it('should encode array to comma-separated string', () => {
      expect(encodeFilterParam(['value1', 'value2', 'value3'])).toBe('value1,value2,value3');
    });

    it('should handle empty array', () => {
      expect(encodeFilterParam([])).toBe('');
    });

    it('should handle single value', () => {
      expect(encodeFilterParam(['value1'])).toBe('value1');
    });
  });

  describe('filterResourcesMultiSelect', () => {
    it('should return all resources when filters are empty', () => {
      const filters: MultiSelectFilters = {};
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(4);
    });

    it('should filter by single category', () => {
      const filters: MultiSelectFilters = { categories: ['category-a'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(2);
      expect(result.every((r) => r.category === 'category-a')).toBe(true);
    });

    it('should filter by multiple categories', () => {
      const filters: MultiSelectFilters = { categories: ['category-a', 'category-b'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(3);
      expect(result.every((r) => ['category-a', 'category-b'].includes(r.category))).toBe(true);
    });

    it('should filter by single region', () => {
      const filters: MultiSelectFilters = { regions: ['US'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(1);
      expect(result[0]?.region).toBe('US');
    });

    it('should filter by multiple regions', () => {
      const filters: MultiSelectFilters = { regions: ['US', 'US-Federal'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(2);
      expect(result.every((r) => ['US', 'US-Federal'].includes(r.region))).toBe(true);
    });

    it('should filter by single risk level', () => {
      const filters: MultiSelectFilters = { riskLevels: ['low'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(1);
      expect(result[0]?.risk_level).toBe('low');
    });

    it('should filter by multiple risk levels', () => {
      const filters: MultiSelectFilters = { riskLevels: ['low', 'medium'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(2);
      expect(result.every((r) => ['low', 'medium'].includes(r.risk_level))).toBe(true);
    });

    it('should filter by single cost', () => {
      const filters: MultiSelectFilters = { costs: ['free'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(2);
      expect(result.every((r) => r.cost === 'free')).toBe(true);
    });

    it('should filter by multiple costs', () => {
      const filters: MultiSelectFilters = { costs: ['free', 'freemium'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(3);
      expect(result.every((r) => ['free', 'freemium'].includes(r.cost))).toBe(true);
    });

    it('should filter by multiple criteria simultaneously', () => {
      const filters: MultiSelectFilters = {
        categories: ['category-a'],
        regions: ['US'],
        riskLevels: ['low'],
        costs: ['free'],
      };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(1);
      expect(result[0]?.id).toBe('resource-1');
    });

    it('should return empty array when no resources match', () => {
      const filters: MultiSelectFilters = { categories: ['non-existent'] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(0);
    });

    it('should handle empty filter arrays', () => {
      const filters: MultiSelectFilters = { categories: [] };
      const result = filterResourcesMultiSelect(mockResources, filters);
      expect(result.length).toBe(4);
    });

    it('should not mutate original array', () => {
      const original = [...mockResources];
      const filters: MultiSelectFilters = { categories: ['category-a'] };
      filterResourcesMultiSelect(mockResources, filters);
      expect(mockResources).toEqual(original);
    });
  });

  describe('isEmptyFilters', () => {
    it('should return true for empty filters', () => {
      expect(isEmptyFilters({})).toBe(true);
    });

    it('should return true for filters with empty arrays', () => {
      expect(isEmptyFilters({ categories: [], regions: [] })).toBe(true);
    });

    it('should return false when any filter has values', () => {
      expect(isEmptyFilters({ categories: ['category-a'] })).toBe(false);
      expect(isEmptyFilters({ regions: ['US'] })).toBe(false);
      expect(isEmptyFilters({ riskLevels: ['low'] })).toBe(false);
      expect(isEmptyFilters({ costs: ['free'] })).toBe(false);
    });
  });

  describe('clearAllFilters', () => {
    it('should return empty filters object', () => {
      const result = clearAllFilters();
      expect(result).toEqual({});
      expect(isEmptyFilters(result)).toBe(true);
    });
  });
});

