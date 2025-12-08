import type { Category, Resource } from './types';

/**
 * Maximum allowed query length to prevent DoS attacks
 */
const MAX_QUERY_LENGTH = 1000;

/**
 * Parse search query for AND/OR operators and quoted phrases
 */
function parseSearchQuery(query: string): {
  terms: string[];
  operator: 'AND' | 'OR';
  phrases: string[];
  exceedsLimit: boolean;
} {
  const trimmed = query.trim();
  if (trimmed.length > MAX_QUERY_LENGTH) {
    return { terms: [], operator: 'OR', phrases: [], exceedsLimit: true };
  }

  const phrases: string[] = [];
  const phraseRegex = /"([^"]+)"/g;
  let match: RegExpExecArray | null;
  let processedQuery = trimmed;

  while ((match = phraseRegex.exec(trimmed)) !== null) {
    if (match[1]) {
      phrases.push(match[1].toLowerCase());
      processedQuery = processedQuery.replace(match[0], '');
    }
  }

  const hasAnd = /\bAND\b/i.test(processedQuery);
  const operator = hasAnd ? 'AND' : 'OR';

  const terms = processedQuery
    .split(/\b(?:AND|OR)\b/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => t.toLowerCase());

  return { terms, operator, phrases, exceedsLimit: false };
}

/**
 * Check if a text matches search terms
 */
function matchesSearchTerms(
  text: string,
  terms: string[],
  operator: 'AND' | 'OR',
  phrases: string[]
): boolean {
  const lowerText = text.toLowerCase();

  if (phrases.length > 0) {
    const phraseMatch = phrases.some((phrase) => lowerText.includes(phrase));
    if (!phraseMatch) {
      return false;
    }
  }

  if (terms.length === 0) {
    return phrases.length > 0;
  }

  if (operator === 'AND') {
    return terms.every((term) => lowerText.includes(term));
  } else {
    return terms.some((term) => lowerText.includes(term));
  }
}

/**
 * Search categories by query string with advanced operators
 */
export function searchCategories(categories: Category[], query: string): Category[] {
  if (!query || query.trim() === '') {
    return categories;
  }

  const { terms, operator, phrases, exceedsLimit } = parseSearchQuery(query);

  if (exceedsLimit) {
    return [];
  }

  if (terms.length === 0 && phrases.length === 0) {
    return categories;
  }

  return categories.filter((category) => {
    const nameMatch = matchesSearchTerms(category.name, terms, operator, phrases);
    const descMatch = matchesSearchTerms(category.description, terms, operator, phrases);
    const tagMatch =
      category.tags && category.tags.length > 0
        ? category.tags.some((tag) => matchesSearchTerms(tag, terms, operator, phrases))
        : false;

    return nameMatch || descMatch || tagMatch;
  });
}

/**
 * Search resources by query string with advanced operators
 */
export function searchResources(resources: Resource[], query: string): Resource[] {
  if (!query || query.trim() === '') {
    return resources;
  }

  const { terms, operator, phrases, exceedsLimit } = parseSearchQuery(query);

  if (exceedsLimit) {
    return [];
  }

  if (terms.length === 0 && phrases.length === 0) {
    return resources;
  }

  return resources.filter((resource) => {
    const nameMatch = matchesSearchTerms(resource.name, terms, operator, phrases);
    const descMatch = matchesSearchTerms(resource.description, terms, operator, phrases);
    const tagMatch =
      resource.tags && resource.tags.length > 0
        ? resource.tags.some((tag) => matchesSearchTerms(tag, terms, operator, phrases))
        : false;
    const typeMatch = matchesSearchTerms(resource.type, terms, operator, phrases);

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

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort field options
 */
export type SortField = 'name' | 'category' | 'risk' | 'date';

/**
 * Sort configuration
 */
export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

/**
 * Risk level order for sorting (low to high)
 */
const RISK_LEVEL_ORDER: Record<string, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Compare two values for sorting
 */
function compareValues<T>(a: T, b: T, order: SortOrder): number {
  if (a === b) {
    return 0;
  }
  if (a === null || a === undefined) {
    return order === 'asc' ? -1 : 1;
  }
  if (b === null || b === undefined) {
    return order === 'asc' ? 1 : -1;
  }
  if (a < b) {
    return order === 'asc' ? -1 : 1;
  }
  if (a > b) {
    return order === 'asc' ? 1 : -1;
  }
  return 0;
}

/**
 * Sort resources by specified field and order
 */
export function sortResources(resources: Resource[], config: SortConfig | null): Resource[] {
  if (!config) {
    return resources;
  }

  const sorted = [...resources].sort((a, b) => {
    let comparison = 0;

    switch (config.field) {
      case 'name':
        comparison = compareValues(a.name.toLowerCase(), b.name.toLowerCase(), config.order);
        break;
      case 'category':
        comparison = compareValues(a.category.toLowerCase(), b.category.toLowerCase(), config.order);
        break;
      case 'risk':
        const aRisk = RISK_LEVEL_ORDER[a.risk_level] ?? 999;
        const bRisk = RISK_LEVEL_ORDER[b.risk_level] ?? 999;
        comparison = compareValues(aRisk, bRisk, config.order);
        break;
      case 'date':
        const aDate = new Date(a.last_verified).getTime();
        const bDate = new Date(b.last_verified).getTime();
        comparison = compareValues(aDate, bDate, config.order);
        break;
      default:
        return 0;
    }

    if (comparison === 0) {
      return compareValues(a.id, b.id, 'asc');
    }

    return comparison;
  });

  return sorted;
}
