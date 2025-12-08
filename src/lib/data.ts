import type { Category, Resource } from './types';
import categoriesData from '@/../data/categories/categories.json';
import resourcesData from '@/../data/resources/resources.json';

/**
 * Validate category data structure
 */
function validateCategory(category: unknown): category is Category {
  if (!category || typeof category !== 'object') return false;
  const cat = category as Record<string, unknown>;
  return (
    typeof cat.id === 'string' &&
    typeof cat.name === 'string' &&
    typeof cat.description === 'string' &&
    typeof cat.slug === 'string' &&
    Array.isArray(cat.tags) &&
    typeof cat.region === 'string' &&
    typeof cat.updated_at === 'string'
  );
}

/**
 * Validate resource data structure
 */
function validateResource(resource: unknown): resource is Resource {
  if (!resource || typeof resource !== 'object') return false;
  const res = resource as Record<string, unknown>;
  return (
    typeof res.id === 'string' &&
    typeof res.name === 'string' &&
    typeof res.url === 'string' &&
    typeof res.description === 'string' &&
    typeof res.category === 'string' &&
    typeof res.region === 'string' &&
    typeof res.risk_level === 'string' &&
    typeof res.auth_required === 'boolean' &&
    typeof res.cost === 'string' &&
    typeof res.type === 'string' &&
    Array.isArray(res.tags) &&
    typeof res.last_verified === 'string'
  );
}

/**
 * Get all categories with validation
 */
export function getCategories(): Category[] {
  if (!Array.isArray(categoriesData)) {
    return [];
  }
  return categoriesData.filter(validateCategory) as Category[];
}

/**
 * Get a category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  if (!id || typeof id !== 'string') {
    return undefined;
  }
  const categories = getCategories();
  return categories.find((cat) => cat.id === id);
}

/**
 * Get a category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  if (!slug || typeof slug !== 'string') {
    return undefined;
  }
  const categories = getCategories();
  return categories.find((cat) => cat.slug === slug);
}

/**
 * Get all resources with validation
 */
export function getResources(): Resource[] {
  if (!Array.isArray(resourcesData)) {
    return [];
  }
  return resourcesData.filter(validateResource) as Resource[];
}

/**
 * Get a resource by ID
 */
export function getResourceById(id: string): Resource | undefined {
  if (!id || typeof id !== 'string') {
    return undefined;
  }
  const resources = getResources();
  return resources.find((res) => res.id === id);
}

/**
 * Get resources by category ID
 */
export function getResourcesByCategory(categoryId: string): Resource[] {
  if (!categoryId || typeof categoryId !== 'string') {
    return [];
  }
  const resources = getResources();
  return resources.filter((res) => res.category === categoryId);
}

/**
 * Get all category slugs for static generation
 */
export function getAllCategorySlugs(): string[] {
  const categories = getCategories();
  return categories.map((cat) => cat.slug).filter(Boolean);
}

/**
 * Get all resource IDs for static generation
 */
export function getAllResourceIds(): string[] {
  const resources = getResources();
  return resources.map((res) => res.id).filter(Boolean);
}

/**
 * Validate data integrity (category-resource relationships)
 */
export function validateDataIntegrity(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const categories = getCategories();
  const resources = getResources();
  const categoryIds = new Set(categories.map((c) => c.id));

  resources.forEach((resource) => {
    if (!categoryIds.has(resource.category)) {
      errors.push(`Resource "${resource.id}" references invalid category "${resource.category}"`);
    }
  });

  const duplicateIds = resources.filter(
    (r, index) => resources.findIndex((res) => res.id === r.id) !== index
  );
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate resource IDs found: ${duplicateIds.map((r) => r.id).join(', ')}`);
  }

  const categorySlugs = categories.map((c) => c.slug);
  const duplicateSlugs = categorySlugs.filter(
    (slug, index) => categorySlugs.indexOf(slug) !== index
  );
  if (duplicateSlugs.length > 0) {
    errors.push(`Duplicate category slugs found: ${duplicateSlugs.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
