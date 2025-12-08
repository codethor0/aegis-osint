#!/usr/bin/env node

/**
 * Data Validation Script for Aegis-OSINT Framework
 *
 * Validates all JSON data files to ensure:
 * - Valid JSON syntax
 * - Required fields are present
 * - Field types are correct
 * - URLs are properly formatted
 * - IDs are unique
 * - Region values are valid
 * - No duplicate entries
 */

import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationStats {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  totalErrors: number;
  totalWarnings: number;
}

// Valid region values
const VALID_REGIONS = ['US', 'US-Federal', 'US-State', 'Global', 'International'];

// Valid risk levels
const VALID_RISK_LEVELS = ['none', 'low', 'medium', 'high'];

// Valid cost tiers
const VALID_COST_TIERS = ['free', 'freemium', 'paid'];

// Valid resource types
const VALID_RESOURCE_TYPES = [
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

/**
 * Validate URL format
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate ISO 8601 date format
 */
function isValidISO8601(dateString: string): boolean {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return iso8601Regex.test(dateString);
}

/**
 * Validate kebab-case ID format
 */
function isValidKebabCase(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id);
}

/**
 * Validate category object
 */
function validateCategory(category: any, index: number): string[] {
  const errors: string[] = [];

  // Required fields
  const requiredFields = ['id', 'name', 'description', 'slug', 'tags', 'region', 'updated_at'];
  for (const field of requiredFields) {
    if (!(field in category)) {
      errors.push(`Category ${index}: Missing required field '${field}'`);
    }
  }

  if (errors.length > 0) return errors; // Skip further validation if required fields are missing

  // Validate ID format
  if (category.id && !isValidKebabCase(category.id)) {
    errors.push(`Category ${index} (${category.id}): ID must be in kebab-case format`);
  }

  // Validate slug format
  if (category.slug && !isValidKebabCase(category.slug)) {
    errors.push(`Category ${index} (${category.id}): Slug must be in kebab-case format`);
  }

  // Validate region
  if (category.region && !VALID_REGIONS.includes(category.region)) {
    errors.push(
      `Category ${index} (${category.id}): Invalid region '${category.region}'. Must be one of: ${VALID_REGIONS.join(', ')}`
    );
  }

  // Validate updated_at format
  if (category.updated_at && !isValidISO8601(category.updated_at)) {
    errors.push(
      `Category ${index} (${category.id}): Invalid date format for 'updated_at'. Must be ISO 8601 format`
    );
  }

  // Validate tags array
  if (category.tags && (!Array.isArray(category.tags) || category.tags.length === 0)) {
    errors.push(`Category ${index} (${category.id}): 'tags' must be a non-empty array`);
  }

  // Validate subcategories if present
  if (category.subcategories && !Array.isArray(category.subcategories)) {
    errors.push(`Category ${index} (${category.id}): 'subcategories' must be an array`);
  }

  // Validate color format if present
  if (category.color && !/^#[0-9A-Fa-f]{6}$/.test(category.color)) {
    errors.push(
      `Category ${index} (${category.id}): 'color' must be a valid hex color code (e.g., #3B82F6)`
    );
  }

  // Validate string lengths
  if (category.name && category.name.length > 100) {
    errors.push(
      `Category ${index} (${category.id}): 'name' exceeds maximum length of 100 characters`
    );
  }

  if (
    category.description &&
    (category.description.length < 10 || category.description.length > 500)
  ) {
    errors.push(
      `Category ${index} (${category.id}): 'description' must be between 10 and 500 characters`
    );
  }

  return errors;
}

/**
 * Validate resource object
 */
function validateResource(resource: any, index: number): string[] {
  const errors: string[] = [];

  // Required fields
  const requiredFields = [
    'id',
    'name',
    'url',
    'description',
    'category',
    'region',
    'risk_level',
    'auth_required',
    'cost',
    'type',
    'tags',
    'last_verified',
  ];

  for (const field of requiredFields) {
    if (!(field in resource)) {
      errors.push(`Resource ${index}: Missing required field '${field}'`);
    }
  }

  if (errors.length > 0) return errors; // Skip further validation if required fields are missing

  // Validate ID format
  if (resource.id && !isValidKebabCase(resource.id)) {
    errors.push(`Resource ${index} (${resource.id}): ID must be in kebab-case format`);
  }

  // Validate URL format
  if (resource.url && !isValidUrl(resource.url)) {
    errors.push(`Resource ${index} (${resource.id}): Invalid URL format for 'url'`);
  }

  // Validate alternative URLs if present
  if (resource.alternative_urls) {
    if (!Array.isArray(resource.alternative_urls)) {
      errors.push(`Resource ${index} (${resource.id}): 'alternative_urls' must be an array`);
    } else {
      resource.alternative_urls.forEach((altUrl: string, altIndex: number) => {
        if (!isValidUrl(altUrl)) {
          errors.push(
            `Resource ${index} (${resource.id}): Invalid URL format for alternative_urls[${altIndex}]`
          );
        }
      });
    }
  }

  // Validate API docs URL if present
  if (resource.api_docs && !isValidUrl(resource.api_docs)) {
    errors.push(`Resource ${index} (${resource.id}): Invalid URL format for 'api_docs'`);
  }

  // Validate region
  if (resource.region && !VALID_REGIONS.includes(resource.region)) {
    errors.push(
      `Resource ${index} (${resource.id}): Invalid region '${resource.region}'. Must be one of: ${VALID_REGIONS.join(', ')}`
    );
  }

  // Validate risk level
  if (resource.risk_level && !VALID_RISK_LEVELS.includes(resource.risk_level)) {
    errors.push(
      `Resource ${index} (${resource.id}): Invalid risk_level '${resource.risk_level}'. Must be one of: ${VALID_RISK_LEVELS.join(', ')}`
    );
  }

  // Validate cost
  if (resource.cost && !VALID_COST_TIERS.includes(resource.cost)) {
    errors.push(
      `Resource ${index} (${resource.id}): Invalid cost '${resource.cost}'. Must be one of: ${VALID_COST_TIERS.join(', ')}`
    );
  }

  // Validate type
  if (resource.type && !VALID_RESOURCE_TYPES.includes(resource.type)) {
    errors.push(
      `Resource ${index} (${resource.id}): Invalid type '${resource.type}'. Must be one of: ${VALID_RESOURCE_TYPES.join(', ')}`
    );
  }

  // Validate auth_required is boolean
  if (resource.auth_required !== undefined && typeof resource.auth_required !== 'boolean') {
    errors.push(`Resource ${index} (${resource.id}): 'auth_required' must be a boolean`);
  }

  // Validate api_available is boolean if present
  if (resource.api_available !== undefined && typeof resource.api_available !== 'boolean') {
    errors.push(`Resource ${index} (${resource.id}): 'api_available' must be a boolean`);
  }

  // Validate last_verified format
  if (resource.last_verified && !isValidISO8601(resource.last_verified)) {
    errors.push(
      `Resource ${index} (${resource.id}): Invalid date format for 'last_verified'. Must be ISO 8601 format`
    );
  }

  // Validate tags array
  if (resource.tags && (!Array.isArray(resource.tags) || resource.tags.length === 0)) {
    errors.push(`Resource ${index} (${resource.id}): 'tags' must be a non-empty array`);
  }

  // Validate string lengths
  if (resource.name && resource.name.length > 100) {
    errors.push(
      `Resource ${index} (${resource.id}): 'name' exceeds maximum length of 100 characters`
    );
  }

  if (
    resource.description &&
    (resource.description.length < 10 || resource.description.length > 500)
  ) {
    errors.push(
      `Resource ${index} (${resource.id}): 'description' must be between 10 and 500 characters`
    );
  }

  return errors;
}

/**
 * Validate JSON file
 */
function validateJsonFile(filePath: string): ValidationResult {
  const result: ValidationResult = {
    file: filePath,
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Read and parse JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Determine file type based on path
    const isCategoryFile = filePath.includes('categories');
    const isResourceFile = filePath.includes('resources');

    if (isCategoryFile) {
      // Validate categories array
      if (!Array.isArray(data)) {
        result.valid = false;
        result.errors.push('File must contain a JSON array of categories');
        return result;
      }

      // Check for duplicate IDs
      const ids = new Set<string>();
      data.forEach((category: any, index: number) => {
        if (category.id) {
          if (ids.has(category.id)) {
            result.errors.push(`Duplicate category ID: ${category.id}`);
            result.valid = false;
          }
          ids.add(category.id);
        }

        // Validate each category
        const categoryErrors = validateCategory(category, index, filePath);
        result.errors.push(...categoryErrors);
        if (categoryErrors.length > 0) {
          result.valid = false;
        }
      });
    } else if (isResourceFile) {
      // Validate resources array
      if (!Array.isArray(data)) {
        result.valid = false;
        result.errors.push('File must contain a JSON array of resources');
        return result;
      }

      // Check for duplicate IDs
      const ids = new Set<string>();
      data.forEach((resource: any, index: number) => {
        if (resource.id) {
          if (ids.has(resource.id)) {
            result.errors.push(`Duplicate resource ID: ${resource.id}`);
            result.valid = false;
          }
          ids.add(resource.id);
        }

        // Validate each resource
        const resourceErrors = validateResource(resource, index, filePath);
        result.errors.push(...resourceErrors);
        if (resourceErrors.length > 0) {
          result.valid = false;
        }
      });
    } else {
      result.valid = false;
      result.errors.push('Unknown file type. Expected categories or resources file.');
    }
  } catch (error: any) {
    result.valid = false;
    if (error instanceof SyntaxError) {
      result.errors.push(`Invalid JSON syntax: ${error.message}`);
    } else {
      result.errors.push(`Error reading file: ${error.message}`);
    }
  }

  return result;
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Aegis-OSINT Framework - Data Validation\n');

  const dataDir = path.join(__dirname, '..', 'data');
  const categoriesFile = path.join(dataDir, 'categories', 'categories.json');
  const resourcesFile = path.join(dataDir, 'resources', 'resources.json');

  const filesToValidate = [categoriesFile, resourcesFile];
  const results: ValidationResult[] = [];
  const stats: ValidationStats = {
    totalFiles: filesToValidate.length,
    validFiles: 0,
    invalidFiles: 0,
    totalErrors: 0,
    totalWarnings: 0,
  };

  // Validate each file
  for (const filePath of filesToValidate) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      stats.invalidFiles++;
      continue;
    }

    console.log(`Validating: ${path.relative(process.cwd(), filePath)}`);
    const result = validateJsonFile(filePath);
    results.push(result);

    if (result.valid) {
      stats.validFiles++;
      console.log(`  ✅ Valid\n`);
    } else {
      stats.invalidFiles++;
      stats.totalErrors += result.errors.length;
      stats.totalWarnings += result.warnings.length;
      console.log(`  ❌ Invalid (${result.errors.length} error(s))\n`);
      result.errors.forEach((error) => {
        console.log(`    - ${error}`);
      });
      console.log();
    }
  }

  // Print summary
  console.log('📊 Validation Summary');
  console.log('─'.repeat(50));
  console.log(`Total files:     ${stats.totalFiles}`);
  console.log(`Valid files:     ${stats.validFiles}`);
  console.log(`Invalid files:   ${stats.invalidFiles}`);
  console.log(`Total errors:    ${stats.totalErrors}`);
  console.log(`Total warnings:  ${stats.totalWarnings}`);
  console.log('─'.repeat(50));

  // Exit with error code if validation failed
  if (stats.invalidFiles > 0 || stats.totalErrors > 0) {
    console.log('\n❌ Validation failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All files validated successfully!');
    process.exit(0);
  }
}

// Run validation
if (require.main === module) {
  main();
}

export { validateJsonFile, validateCategory, validateResource };
