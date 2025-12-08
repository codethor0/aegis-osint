/**
 * TypeScript type definitions for Aegis-OSINT Framework
 *
 * These types define the structure of categories and resources
 * used throughout the framework.
 */

/**
 * Risk level for OSINT resources
 */
export type RiskLevel = 'none' | 'low' | 'medium' | 'high';

/**
 * Cost tier for OSINT resources
 */
export type CostTier = 'free' | 'freemium' | 'paid';

/**
 * Resource type classification
 */
export type ResourceType =
  | 'lookup'
  | 'search_engine'
  | 'government_data'
  | 'api'
  | 'database'
  | 'tool'
  | 'browser_extension'
  | 'mobile_app'
  | 'desktop_app'
  | 'script'
  | 'framework'
  | 'aggregator'
  | 'social_media'
  | 'court_records'
  | 'property_records'
  | 'corporate_records';

/**
 * Geographic region
 */
export type Region = 'US' | 'US-Federal' | 'US-State' | 'Global' | 'International';

/**
 * OSINT Category Schema
 *
 * Represents a category of OSINT resources (e.g., "People Search", "Court Records")
 */
export interface Category {
  /** Unique identifier for the category (kebab-case) */
  id: string;

  /** Human-readable category name */
  name: string;

  /** Brief description of the category */
  description: string;

  /** URL-friendly slug */
  slug: string;

  /** Optional array of subcategory IDs */
  subcategories?: string[];

  /** Array of tags for search and filtering */
  tags: string[];

  /** Primary geographic region */
  region: Region;

  /** ISO 8601 timestamp of last update */
  updated_at: string;

  /** Optional longer description */
  long_description?: string;

  /** Optional icon identifier */
  icon?: string;

  /** Optional color theme */
  color?: string;
}

/**
 * OSINT Resource Schema
 *
 * Represents an individual OSINT resource (tool, database, service, etc.)
 */
export interface Resource {
  /** Unique identifier for the resource (kebab-case) */
  id: string;

  /** Official name of the resource */
  name: string;

  /** Primary URL of the resource (must be valid) */
  url: string;

  /** Brief description of the resource */
  description: string;

  /** Category ID this resource belongs to */
  category: string;

  /** Optional subcategory ID */
  subcategory?: string;

  /** Primary geographic region */
  region: Region;

  /** Risk level associated with using this resource */
  risk_level: RiskLevel;

  /** Whether authentication/registration is required */
  auth_required: boolean;

  /** Cost tier of the resource */
  cost: CostTier;

  /** Type classification of the resource */
  type: ResourceType;

  /** Array of tags for search and filtering */
  tags: string[];

  /** ISO 8601 timestamp of last verification */
  last_verified: string;

  /** Optional alternative URLs */
  alternative_urls?: string[];

  /** Optional API documentation URL */
  api_docs?: string;

  /** Whether the resource provides an API */
  api_available?: boolean;

  /** Optional detailed description */
  long_description?: string;

  /** Optional use cases */
  use_cases?: string[];

  /** Optional limitations or restrictions */
  limitations?: string;

  /** Optional legal notes */
  legal_notes?: string;

  /** Optional supported languages */
  languages?: string[];
}

/**
 * Framework metadata
 */
export interface FrameworkMetadata {
  /** Framework version */
  version: string;

  /** Last update timestamp */
  last_updated: string;

  /** Total number of categories */
  total_categories: number;

  /** Total number of resources */
  total_resources: number;
}
