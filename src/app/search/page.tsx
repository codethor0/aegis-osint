import { getResources, getCategories } from '@/lib/data';
import {
  searchResources,
  searchCategories,
  filterResources,
  sortResources,
  type ResourceFilters,
  type SortConfig,
} from '@/lib/search';
import {
  filterResourcesMultiSelect,
  parseFilterParam,
  type MultiSelectFilters,
} from '@/lib/filtering';
import ResourceList from '@/components/ResourceList';
import CategoryList from '@/components/CategoryList';
import SearchFilters from '@/components/SearchFilters';
import SearchHistoryClient from '@/components/SearchHistoryClient';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: 'resources' | 'categories' | 'all';
    region?: string;
    riskLevel?: string;
    cost?: string;
    categories?: string;
    regions?: string;
    riskLevels?: string;
    costs?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }>;
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const searchType = params.type || 'all';
  const region = params.region;
  const riskLevel = params.riskLevel;
  const cost = params.cost;
  const sortField = params.sort;
  const sortOrder = params.order || 'asc';

  const categoriesParam = params.categories;
  const regionsParam = params.regions;
  const riskLevelsParam = params.riskLevels;
  const costsParam = params.costs;

  const allResources = getResources();
  const allCategories = getCategories();

  let resources =
    searchType === 'all' || searchType === 'resources' ? searchResources(allResources, query) : [];
  const categories =
    searchType === 'all' || searchType === 'categories'
      ? searchCategories(allCategories, query)
      : [];

  const multiSelectFilters: MultiSelectFilters = {};
  if (categoriesParam) {
    multiSelectFilters.categories = parseFilterParam(categoriesParam);
  }
  if (regionsParam) {
    multiSelectFilters.regions = parseFilterParam(regionsParam);
  }
  if (riskLevelsParam) {
    multiSelectFilters.riskLevels = parseFilterParam(riskLevelsParam);
  }
  if (costsParam) {
    multiSelectFilters.costs = parseFilterParam(costsParam);
  }

  const hasMultiSelect = Object.keys(multiSelectFilters).length > 0;

  if (hasMultiSelect) {
    resources = filterResourcesMultiSelect(resources, multiSelectFilters);
  } else {
    const legacyFilters: ResourceFilters = {};
    if (region) legacyFilters.region = region;
    if (riskLevel) legacyFilters.riskLevel = riskLevel;
    if (cost) legacyFilters.cost = cost;

    if (Object.keys(legacyFilters).length > 0) {
      resources = filterResources(resources, legacyFilters);
    }
  }

  const sortConfig: SortConfig | null =
    sortField && ['name', 'category', 'risk', 'date'].includes(sortField)
      ? { field: sortField as SortConfig['field'], order: sortOrder }
      : null;

  if (sortConfig) {
    resources = sortResources(resources, sortConfig);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Search</h1>
        {query && (
          <p className="text-gray-600 dark:text-gray-400">Results for &quot;{query}&quot;</p>
        )}
      </div>

      {searchType === 'all' || searchType === 'resources' ? (
        <div className="mb-8">
          <SearchFilters
            currentCategory={undefined}
            currentRegion={region}
            currentRiskLevel={riskLevel}
            currentCost={cost}
            currentCategories={multiSelectFilters.categories}
            currentRegions={multiSelectFilters.regions}
            currentRiskLevels={multiSelectFilters.riskLevels}
            currentCosts={multiSelectFilters.costs}
            currentSort={sortField}
            currentOrder={sortOrder}
          />
        </div>
      ) : null}

      {!query && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search query to find resources and categories.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Use AND/OR operators for advanced search. Use quotes for exact phrases.
          </p>
          <div className="mt-8">
            <SearchHistoryClient />
          </div>
        </div>
      )}

      {query && searchType !== 'categories' && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Resources ({resources.length})
          </h2>
          <ResourceList resources={resources} />
        </div>
      )}

      {query && searchType !== 'resources' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Categories ({categories.length})
          </h2>
          <CategoryList categories={categories} />
        </div>
      )}
    </div>
  );
}
