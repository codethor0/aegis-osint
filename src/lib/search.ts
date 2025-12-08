import type { Category, Resource } from './types';

/**
 * Search categories by query string
 */
export function searchCategories(categories: Category[], query: string): Category[] {
  if (!query || query.trim() === '') {
    return categories;
  }

  const lowerQuery = query.toLowerCase().trim();

  return categories.filter((category) => {
    const nameMatch = category.name.toLowerCase().includes(lowerQuery);
    const descMatch = category.description.toLowerCase().includes(lowerQuery);
    const tagMatch =
      category.tags && category.tags.length > 0
        ? category.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        : false;

    return nameMatch || descMatch || tagMatch;
  });
}

/**
 * Search resources by query string
 */
export function searchResources(resources: Resource[], query: string): Resource[] {
  if (!query || query.trim() === '') {
    return resources;
  }

  const lowerQuery = query.toLowerCase().trim();

  return resources.filter((resource) => {
    const nameMatch = resource.name.toLowerCase().includes(lowerQuery);
    const descMatch = resource.description.toLowerCase().includes(lowerQuery);
    const tagMatch =
      resource.tags && resource.tags.length > 0
        ? resource.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        : false;
    const typeMatch = resource.type.toLowerCase().includes(lowerQuery);

    return nameMatch || descMatch || tagMatch || typeMatch;
  });
}

/**
 * Filter resources by multiple criteria
 */
export interface ResourceFilters {
  category?: string;
  cost?: string;
  type?: string;
  riskLevel?: string;
  authRequired?: boolean;
  apiAvailable?: boolean;
  region?: string;
}

export function filterResources(resources: Resource[], filters: ResourceFilters): Resource[] {
  return resources.filter((resource) => {
    if (filters.category && resource.category !== filters.category) {
      return false;
    }
    if (filters.cost && resource.cost !== filters.cost) {
      return false;
    }
    if (filters.type && resource.type !== filters.type) {
      return false;
    }
    if (filters.riskLevel && resource.risk_level !== filters.riskLevel) {
      return false;
    }
    if (filters.authRequired !== undefined && resource.auth_required !== filters.authRequired) {
      return false;
    }
    if (filters.apiAvailable !== undefined && resource.api_available !== filters.apiAvailable) {
      return false;
    }
    if (filters.region && resource.region !== filters.region) {
      return false;
    }
    return true;
  });
}
