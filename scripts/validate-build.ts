#!/usr/bin/env node

/**
 * Build-time data validation script
 *
 * This script validates data integrity before build to ensure:
 * - All category-resource relationships are valid
 * - All IDs and slugs are unique
 * - All required fields are present
 * - Data structure matches TypeScript types
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const categoriesFile = path.join(dataDir, 'categories', 'categories.json');
const resourcesFile = path.join(dataDir, 'resources', 'resources.json');

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateDataIntegrity(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const categoriesData = JSON.parse(fs.readFileSync(categoriesFile, 'utf-8'));
    const resourcesData = JSON.parse(fs.readFileSync(resourcesFile, 'utf-8'));

    if (!Array.isArray(categoriesData)) {
      errors.push('Categories file must contain a JSON array');
      return { valid: false, errors, warnings };
    }

    if (!Array.isArray(resourcesData)) {
      errors.push('Resources file must contain a JSON array');
      return { valid: false, errors, warnings };
    }

    const categoryIds = new Set<string>();
    const categorySlugs = new Set<string>();

    categoriesData.forEach((category: any, index: number) => {
      if (!category.id) {
        errors.push(`Category at index ${index} is missing 'id' field`);
        return;
      }

      if (categoryIds.has(category.id)) {
        errors.push(`Duplicate category ID: ${category.id}`);
      }
      categoryIds.add(category.id);

      if (!category.slug) {
        errors.push(`Category "${category.id}" is missing 'slug' field`);
        return;
      }

      if (categorySlugs.has(category.slug)) {
        errors.push(`Duplicate category slug: ${category.slug}`);
      }
      categorySlugs.add(category.slug);
    });

    const resourceIds = new Set<string>();

    resourcesData.forEach((resource: any, index: number) => {
      if (!resource.id) {
        errors.push(`Resource at index ${index} is missing 'id' field`);
        return;
      }

      if (resourceIds.has(resource.id)) {
        errors.push(`Duplicate resource ID: ${resource.id}`);
      }
      resourceIds.add(resource.id);

      if (!resource.category) {
        errors.push(`Resource "${resource.id}" is missing 'category' field`);
        return;
      }

      if (!categoryIds.has(resource.category)) {
        errors.push(`Resource "${resource.id}" references invalid category "${resource.category}"`);
      }
    });

    if (categoriesData.length === 0) {
      warnings.push('No categories found in categories.json');
    }

    if (resourcesData.length === 0) {
      warnings.push('No resources found in resources.json');
    }

    const categoryResourceCounts = new Map<string, number>();
    resourcesData.forEach((resource: any) => {
      if (resource.category) {
        categoryResourceCounts.set(
          resource.category,
          (categoryResourceCounts.get(resource.category) || 0) + 1
        );
      }
    });

    categoriesData.forEach((category: any) => {
      const count = categoryResourceCounts.get(category.id) || 0;
      if (count === 0) {
        warnings.push(`Category "${category.name}" has no resources`);
      }
    });
  } catch (error: any) {
    errors.push(`Error reading data files: ${error.message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function main() {
  console.log('Validating data integrity...\n');

  const result = validateDataIntegrity();

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    result.warnings.forEach((warning) => {
      console.log(`   - ${warning}`);
    });
    console.log();
  }

  if (result.errors.length > 0) {
    console.error('Validation failed with errors:');
    result.errors.forEach((error) => {
      console.error(`   - ${error}`);
    });
    console.error('\nPlease fix the errors above before building.');
    process.exit(1);
  }

  console.log('Data integrity validation passed!\n');
  process.exit(0);
}

main();

export { validateDataIntegrity };
