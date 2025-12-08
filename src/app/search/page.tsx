import { getResources, getCategories } from '@/lib/data';
import { searchResources, searchCategories, filterResources, type ResourceFilters } from '@/lib/search';
import ResourceList from '@/components/ResourceList';
import CategoryList from '@/components/CategoryList';
import SearchFilters from '@/components/SearchFilters';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: 'resources' | 'categories' | 'all';
    region?: string;
    riskLevel?: string;
    cost?: string;
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

  const allResources = getResources();
  const allCategories = getCategories();

  let resources =
    searchType === 'all' || searchType === 'resources' ? searchResources(allResources, query) : [];
  const categories =
    searchType === 'all' || searchType === 'categories'
      ? searchCategories(allCategories, query)
      : [];

  const filters: ResourceFilters = {};
  if (region) filters.region = region;
  if (riskLevel) filters.riskLevel = riskLevel;
  if (cost) filters.cost = cost;

  if (Object.keys(filters).length > 0) {
    resources = filterResources(resources, filters);
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
            currentRegion={region}
            currentRiskLevel={riskLevel}
            currentCost={cost}
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
