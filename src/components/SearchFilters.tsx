'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFiltersProps {
  currentRegion?: string;
  currentRiskLevel?: string;
  currentCost?: string;
}

export default function SearchFilters({
  currentRegion,
  currentRiskLevel,
  currentCost,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (filterName: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === '') {
      params.delete(filterName);
    } else {
      params.set(filterName, value);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}

