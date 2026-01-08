'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { getCategories } from '@/lib/data';
import { encodeFilterParam, type MultiSelectFilters } from '@/lib/filtering';
import SavedFiltersPanel from './SavedFiltersPanel';

interface SearchFiltersProps {
  currentCategory?: string;
  currentRegion?: string;
  currentRiskLevel?: string;
  currentCost?: string;
  currentCategories?: string[];
  currentRegions?: string[];
  currentRiskLevels?: string[];
  currentCosts?: string[];
  currentSort?: string;
  currentOrder?: 'asc' | 'desc';
}

export default function SearchFilters({
  currentCategory,
  currentRegion,
  currentRiskLevel,
  currentCost,
  currentCategories,
  currentRegions,
  currentRiskLevels,
  currentCosts,
  currentSort,
  currentOrder,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categories = getCategories();

  const [localCategories, setLocalCategories] = useState<string[]>(currentCategories || []);
  const [localRegions, setLocalRegions] = useState<string[]>(currentRegions || []);
  const [localRiskLevels, setLocalRiskLevels] = useState<string[]>(currentRiskLevels || []);
  const [localCosts, setLocalCosts] = useState<string[]>(currentCosts || []);

  const handleMultiSelectChange = (
    filterName: 'categories' | 'regions' | 'riskLevels' | 'costs',
    value: string,
    checked: boolean
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    let updated: string[];
    switch (filterName) {
      case 'categories':
        updated = checked
          ? [...localCategories, value]
          : localCategories.filter((v) => v !== value);
        setLocalCategories(updated);
        break;
      case 'regions':
        updated = checked ? [...localRegions, value] : localRegions.filter((v) => v !== value);
        setLocalRegions(updated);
        break;
      case 'riskLevels':
        updated = checked
          ? [...localRiskLevels, value]
          : localRiskLevels.filter((v) => v !== value);
        setLocalRiskLevels(updated);
        break;
      case 'costs':
        updated = checked ? [...localCosts, value] : localCosts.filter((v) => v !== value);
        setLocalCosts(updated);
        break;
    }

    if (updated.length > 0) {
      params.set(filterName, encodeFilterParam(updated));
    } else {
      params.delete(filterName);
    }

    params.delete('category');
    params.delete('region');
    params.delete('riskLevel');
    params.delete('cost');

    const basePath = pathname || '/search';
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    params.delete('regions');
    params.delete('riskLevels');
    params.delete('costs');
    params.delete('category');
    params.delete('region');
    params.delete('riskLevel');
    params.delete('cost');
    setLocalCategories([]);
    setLocalRegions([]);
    setLocalRiskLevels([]);
    setLocalCosts([]);
    const basePath = pathname || '/search';
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleLoadPreset = (filters: MultiSelectFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.categories && filters.categories.length > 0) {
      params.set('categories', encodeFilterParam(filters.categories));
      setLocalCategories(filters.categories);
    } else {
      params.delete('categories');
      setLocalCategories([]);
    }

    if (filters.regions && filters.regions.length > 0) {
      params.set('regions', encodeFilterParam(filters.regions));
      setLocalRegions(filters.regions);
    } else {
      params.delete('regions');
      setLocalRegions([]);
    }

    if (filters.riskLevels && filters.riskLevels.length > 0) {
      params.set('riskLevels', encodeFilterParam(filters.riskLevels));
      setLocalRiskLevels(filters.riskLevels);
    } else {
      params.delete('riskLevels');
      setLocalRiskLevels([]);
    }

    if (filters.costs && filters.costs.length > 0) {
      params.set('costs', encodeFilterParam(filters.costs));
      setLocalCosts(filters.costs);
    } else {
      params.delete('costs');
      setLocalCosts([]);
    }

    params.delete('category');
    params.delete('region');
    params.delete('riskLevel');
    params.delete('cost');

    const basePath = pathname || '/search';
    router.push(`${basePath}?${params.toString()}`);
  };


  const handleSortChange = (field: string, order: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (field === '') {
      params.delete('sort');
      params.delete('order');
    } else {
      params.set('sort', field);
      params.set('order', order);
    }
    const basePath = pathname || '/search';
    router.push(`${basePath}?${params.toString()}`);
  };

  const hasActiveFilters =
    localCategories.length > 0 ||
    localRegions.length > 0 ||
    localRiskLevels.length > 0 ||
    localCosts.length > 0 ||
    currentCategory ||
    currentRegion ||
    currentRiskLevel ||
    currentCost;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8" data-testid="filter-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            data-testid="filter-clear"
          >
            Clear All
          </button>
        )}
      </div>

      <SavedFiltersPanel
        currentFilters={{
          categories: localCategories,
          regions: localRegions,
          riskLevels: localRiskLevels,
          costs: localCosts,
        }}
        onLoadPreset={handleLoadPreset}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Categories
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 py-1 text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localCategories.includes(category.id)}
                  onChange={(e) =>
                    handleMultiSelectChange('categories', category.id, e.target.checked)
                  }
                  className="rounded border-gray-300 dark:border-gray-700"
                  data-testid="filter-option"
                  data-filter-id={`categories-${category.id}`}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="region-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Regions
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-2">
            {[
              { value: 'US', label: 'United States' },
              { value: 'US-Federal', label: 'US Federal' },
              { value: 'US-State', label: 'US State' },
              { value: 'Global', label: 'Global' },
              { value: 'International', label: 'International' },
            ].map((region) => (
              <label
                key={region.value}
                className="flex items-center gap-2 py-1 text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localRegions.includes(region.value)}
                  onChange={(e) => handleMultiSelectChange('regions', region.value, e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-700"
                  data-testid="filter-option"
                  data-filter-id={`regions-${region.value}`}
                />
                <span>{region.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="risk-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Risk Levels
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-2">
            {[
              { value: 'none', label: 'None' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ].map((risk) => (
              <label
                key={risk.value}
                className="flex items-center gap-2 py-1 text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localRiskLevels.includes(risk.value)}
                  onChange={(e) =>
                    handleMultiSelectChange('riskLevels', risk.value, e.target.checked)
                  }
                  className="rounded border-gray-300 dark:border-gray-700"
                  data-testid="filter-option"
                  data-filter-id={`riskLevels-${risk.value}`}
                />
                <span>{risk.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="cost-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Costs
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-2">
            {[
              { value: 'free', label: 'Free' },
              { value: 'freemium', label: 'Freemium' },
              { value: 'paid', label: 'Paid' },
            ].map((cost) => (
              <label
                key={cost.value}
                className="flex items-center gap-2 py-1 text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localCosts.includes(cost.value)}
                  onChange={(e) => handleMultiSelectChange('costs', cost.value, e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-700"
                  data-testid="filter-option"
                  data-filter-id={`costs-${cost.value}`}
                />
                <span>{cost.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="sort-controls">
        <div>
          <label
            htmlFor="sort-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Sort By
          </label>
          <select
            id="sort-filter"
            value={currentSort || ''}
            onChange={(e) => {
              const field = e.target.value;
              if (field === '') {
                handleSortChange('', 'asc');
              } else {
                handleSortChange(field, currentOrder || 'asc');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="sort-select"
          >
            <option value="">No Sorting</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="risk">Risk Level</option>
            <option value="date">Date Added</option>
          </select>
        </div>
        {currentSort && (
          <div>
            <label
              htmlFor="order-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Order
            </label>
            <select
              id="order-filter"
              value={currentOrder || 'asc'}
              onChange={(e) => {
                if (currentSort) {
                  handleSortChange(currentSort, e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="sort-order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

