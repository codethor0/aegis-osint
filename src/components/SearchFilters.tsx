'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getCategories } from '@/lib/data';

interface SearchFiltersProps {
  currentCategory?: string;
  currentRegion?: string;
  currentRiskLevel?: string;
  currentCost?: string;
  currentSort?: string;
  currentOrder?: 'asc' | 'desc';
}

export default function SearchFilters({
  currentCategory,
  currentRegion,
  currentRiskLevel,
  currentCost,
  currentSort,
  currentOrder,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categories = getCategories();

  const handleFilterChange = (filterName: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === '') {
      params.delete(filterName);
    } else {
      params.set(filterName, value);
    }
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

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={currentCategory || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="region-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Region
          </label>
          <select
            id="region-filter"
            value={currentRegion || ''}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Regions</option>
            <option value="US">United States</option>
            <option value="US-Federal">US Federal</option>
            <option value="US-State">US State</option>
            <option value="Global">Global</option>
            <option value="International">International</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="risk-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Risk Level
          </label>
          <select
            id="risk-filter"
            value={currentRiskLevel || ''}
            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Risk Levels</option>
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="cost-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Cost
          </label>
          <select
            id="cost-filter"
            value={currentCost || ''}
            onChange={(e) => handleFilterChange('cost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Costs</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

