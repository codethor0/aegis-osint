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
