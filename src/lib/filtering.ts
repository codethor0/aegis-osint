import type { Resource } from './types';

/**
 * Multi-select filter configuration
 */
export interface MultiSelectFilters {
  categories?: string[];
  regions?: string[];
  riskLevels?: string[];
  costs?: string[];
}

/**
 * Parse comma-separated filter values from URL query parameter
 */
export function parseFilterParam(value: string | null | undefined): string[] {
  if (!value || typeof value !== 'string') {
    return [];
  }
  return value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

/**
 * Encode filter array to URL query parameter
 */
export function encodeFilterParam(values: string[]): string {
  return values.join(',');
}

/**
 * Filter resources with multi-select filters
 */
export function filterResourcesMultiSelect(
  resources: Resource[],
  filters: MultiSelectFilters
): Resource[] {
  if (!filters || Object.keys(filters).length === 0) {
    return resources;
  }

  return resources.filter((resource) => {
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(resource.category)) {
        return false;
      }
    }

    if (filters.regions && filters.regions.length > 0) {
      if (!filters.regions.includes(resource.region)) {
        return false;
      }
    }

    if (filters.riskLevels && filters.riskLevels.length > 0) {
      if (!filters.riskLevels.includes(resource.risk_level)) {
        return false;
      }
    }

    if (filters.costs && filters.costs.length > 0) {
      if (!filters.costs.includes(resource.cost)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Check if filters are empty
 */
export function isEmptyFilters(filters: MultiSelectFilters): boolean {
  return (
    (!filters.categories || filters.categories.length === 0) &&
    (!filters.regions || filters.regions.length === 0) &&
    (!filters.riskLevels || filters.riskLevels.length === 0) &&
    (!filters.costs || filters.costs.length === 0)
  );
}

/**
 * Clear all filters
 */
export function clearAllFilters(): MultiSelectFilters {
  return {};
}

