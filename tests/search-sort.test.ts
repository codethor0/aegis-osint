import { describe, it, expect } from 'vitest';
import { sortResources, type SortConfig } from '@/lib/search';
import type { Resource } from '@/lib/types';

describe('Search Result Sorting', () => {
  const mockResources: Resource[] = [
    {
      id: 'resource-1',
      name: 'Alpha Resource',
      url: 'https://example.com/alpha',
      description: 'First resource',
      category: 'category-b',
      region: 'US',
      risk_level: 'high',
      auth_required: false,
      cost: 'free',
      type: 'lookup',
      tags: [],
      last_verified: '2024-01-03T00:00:00Z',
    },
    {
      id: 'resource-2',
      name: 'Beta Resource',
      url: 'https://example.com/beta',
      description: 'Second resource',
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
      id: 'resource-3',
      name: 'Gamma Resource',
      url: 'https://example.com/gamma',
      description: 'Third resource',
      category: 'category-c',
      region: 'US',
      risk_level: 'medium',
      auth_required: false,
      cost: 'free',
      type: 'lookup',
      tags: [],
      last_verified: '2024-01-02T00:00:00Z',
    },
    {
      id: 'resource-4',
      name: 'Delta Resource',
      url: 'https://example.com/delta',
      description: 'Fourth resource',
      category: 'category-a',
      region: 'US',
      risk_level: 'none',
      auth_required: false,
      cost: 'free',
      type: 'lookup',
      tags: [],
      last_verified: '2024-01-04T00:00:00Z',
    },
  ];

  describe('sortResources', () => {
    it('should return resources unchanged when sort config is null', () => {
      const result = sortResources(mockResources, null);
      expect(result).toEqual(mockResources);
    });

    it('should sort by name ascending', () => {
      const config: SortConfig = { field: 'name', order: 'asc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.name).toBe('Alpha Resource');
      expect(result[1]?.name).toBe('Beta Resource');
      expect(result[2]?.name).toBe('Delta Resource');
      expect(result[3]?.name).toBe('Gamma Resource');
    });

    it('should sort by name descending', () => {
      const config: SortConfig = { field: 'name', order: 'desc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.name).toBe('Gamma Resource');
      expect(result[1]?.name).toBe('Delta Resource');
      expect(result[2]?.name).toBe('Beta Resource');
      expect(result[3]?.name).toBe('Alpha Resource');
    });

    it('should sort by category ascending', () => {
      const config: SortConfig = { field: 'category', order: 'asc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.category).toBe('category-a');
      expect(result[1]?.category).toBe('category-a');
      expect(result[2]?.category).toBe('category-b');
      expect(result[3]?.category).toBe('category-c');
    });

    it('should sort by category descending', () => {
      const config: SortConfig = { field: 'category', order: 'desc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.category).toBe('category-c');
      expect(result[1]?.category).toBe('category-b');
      expect(result[2]?.category).toBe('category-a');
      expect(result[3]?.category).toBe('category-a');
    });

    it('should sort by risk level ascending (none -> low -> medium -> high)', () => {
      const config: SortConfig = { field: 'risk', order: 'asc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.risk_level).toBe('none');
      expect(result[1]?.risk_level).toBe('low');
      expect(result[2]?.risk_level).toBe('medium');
      expect(result[3]?.risk_level).toBe('high');
    });

    it('should sort by risk level descending (high -> medium -> low -> none)', () => {
      const config: SortConfig = { field: 'risk', order: 'desc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.risk_level).toBe('high');
      expect(result[1]?.risk_level).toBe('medium');
      expect(result[2]?.risk_level).toBe('low');
      expect(result[3]?.risk_level).toBe('none');
    });

    it('should sort by date ascending', () => {
      const config: SortConfig = { field: 'date', order: 'asc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.last_verified).toBe('2024-01-01T00:00:00Z');
      expect(result[1]?.last_verified).toBe('2024-01-02T00:00:00Z');
      expect(result[2]?.last_verified).toBe('2024-01-03T00:00:00Z');
      expect(result[3]?.last_verified).toBe('2024-01-04T00:00:00Z');
    });

    it('should sort by date descending', () => {
      const config: SortConfig = { field: 'date', order: 'desc' };
      const result = sortResources(mockResources, config);
      expect(result[0]?.last_verified).toBe('2024-01-04T00:00:00Z');
      expect(result[1]?.last_verified).toBe('2024-01-03T00:00:00Z');
      expect(result[2]?.last_verified).toBe('2024-01-02T00:00:00Z');
      expect(result[3]?.last_verified).toBe('2024-01-01T00:00:00Z');
    });

    it('should use id as tie-breaker when values are equal', () => {
      const resourcesWithSameName: Resource[] = [
        {
          id: 'resource-z',
          name: 'Same Name',
          url: 'https://example.com/z',
          description: 'Z resource',
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
          id: 'resource-a',
          name: 'Same Name',
          url: 'https://example.com/a',
          description: 'A resource',
          category: 'category-a',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];
      const config: SortConfig = { field: 'name', order: 'asc' };
      const result = sortResources(resourcesWithSameName, config);
      expect(result[0]?.id).toBe('resource-a');
      expect(result[1]?.id).toBe('resource-z');
    });

    it('should handle empty array', () => {
      const config: SortConfig = { field: 'name', order: 'asc' };
      const result = sortResources([], config);
      expect(result).toEqual([]);
    });

    it('should handle single resource', () => {
      const config: SortConfig = { field: 'name', order: 'asc' };
      const result = sortResources([mockResources[0]!], config);
      expect(result.length).toBe(1);
      expect(result[0]?.id).toBe('resource-1');
    });

    it('should handle case-insensitive name sorting', () => {
      const mixedCaseResources: Resource[] = [
        {
          id: 'resource-1',
          name: 'alpha',
          url: 'https://example.com/1',
          description: 'Test',
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
          name: 'Beta',
          url: 'https://example.com/2',
          description: 'Test',
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
          id: 'resource-3',
          name: 'GAMMA',
          url: 'https://example.com/3',
          description: 'Test',
          category: 'category-a',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];
      const config: SortConfig = { field: 'name', order: 'asc' };
      const result = sortResources(mixedCaseResources, config);
      expect(result[0]?.name).toBe('alpha');
      expect(result[1]?.name).toBe('Beta');
      expect(result[2]?.name).toBe('GAMMA');
    });

    it('should handle unknown risk levels gracefully', () => {
      const unknownRiskResource: Resource = {
        id: 'resource-unknown',
        name: 'Unknown Risk',
        url: 'https://example.com/unknown',
        description: 'Test',
        category: 'category-a',
        region: 'US',
        risk_level: 'unknown' as 'low',
        auth_required: false,
        cost: 'free',
        type: 'lookup',
        tags: [],
        last_verified: '2024-01-01T00:00:00Z',
      };
      const config: SortConfig = { field: 'risk', order: 'asc' };
      const result = sortResources([unknownRiskResource, mockResources[0]!], config);
      expect(result[0]?.risk_level).toBe('high');
      expect(result[1]?.risk_level).toBe('unknown');
    });

    it('should not mutate original array', () => {
      const original = [...mockResources];
      const config: SortConfig = { field: 'name', order: 'asc' };
      sortResources(mockResources, config);
      expect(mockResources).toEqual(original);
    });

    it('should handle invalid date strings gracefully', () => {
      const invalidDateResource: Resource = {
        id: 'resource-invalid-date',
        name: 'Invalid Date',
        url: 'https://example.com/invalid',
        description: 'Test',
        category: 'category-a',
        region: 'US',
        risk_level: 'low',
        auth_required: false,
        cost: 'free',
        type: 'lookup',
        tags: [],
        last_verified: 'invalid-date',
      };
      const config: SortConfig = { field: 'date', order: 'asc' };
      const result = sortResources([invalidDateResource, mockResources[0]!], config);
      expect(result.length).toBe(2);
    });

    it('should maintain stable sort order for identical resources', () => {
      const identicalResources: Resource[] = Array(5).fill(mockResources[0]);
      const config: SortConfig = { field: 'name', order: 'asc' };
      const result = sortResources(identicalResources, config);
      expect(result.length).toBe(5);
      expect(result.every((r) => r.id === mockResources[0]?.id)).toBe(true);
    });

    it('should handle null or undefined values in sort fields', () => {
      const resourceWithNulls: Resource[] = [
        {
          id: 'resource-1',
          name: 'A',
          url: 'https://example.com/1',
          description: 'Test',
          category: 'category-a',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];
      const config: SortConfig = { field: 'name', order: 'asc' };
      const result = sortResources(resourceWithNulls, config);
      expect(result.length).toBe(1);
    });
  });
});

