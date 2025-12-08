'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBookmarks, clearBookmarks } from '@/lib/bookmarks';
import { getResources } from '@/lib/data';
import { filterResources, type ResourceFilters } from '@/lib/search';
import type { Resource } from '@/lib/types';
import ResourceList from '@/components/ResourceList';
import SearchFilters from '@/components/SearchFilters';

export default function FavoritesPage() {
  const searchParams = useSearchParams();
  const [bookmarkedResources, setBookmarkedResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [mounted, setMounted] = useState(false);

  const category = searchParams.get('category') || undefined;
  const region = searchParams.get('region') || undefined;
  const riskLevel = searchParams.get('riskLevel') || undefined;
  const cost = searchParams.get('cost') || undefined;

  useEffect(() => {
    setMounted(true);
    const updateBookmarks = () => {
      const ids = getBookmarks();
      const allResources = getResources();
      const bookmarked = allResources.filter((resource) => ids.includes(resource.id));
      setBookmarkedResources(bookmarked);
    };

    updateBookmarks();
    window.addEventListener('bookmarks-changed', updateBookmarks);
    return () => window.removeEventListener('bookmarks-changed', updateBookmarks);
  }, []);

  useEffect(() => {
    const filters: ResourceFilters = {};
    if (category) filters.category = category;
    if (region) filters.region = region;
    if (riskLevel) filters.riskLevel = riskLevel;
    if (cost) filters.cost = cost;

    if (Object.keys(filters).length > 0) {
      const filtered = filterResources(bookmarkedResources, filters);
      setFilteredResources(filtered);
    } else {
      setFilteredResources(bookmarkedResources);
    }
  }, [bookmarkedResources, category, region, riskLevel, cost]);

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
      clearBookmarks();
      setBookmarkedResources([]);
      window.dispatchEvent(new CustomEvent('bookmarks-changed'));
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Favorites
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredResources.length} of {bookmarkedResources.length} bookmarked resource
              {bookmarkedResources.length !== 1 ? 's' : ''}
              {filteredResources.length !== bookmarkedResources.length ? ' (filtered)' : ''}
            </p>
          </div>
          {bookmarkedResources.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {bookmarkedResources.length > 0 && (
        <div className="mb-8">
          <SearchFilters
            currentCategory={category}
            currentRegion={region}
            currentRiskLevel={riskLevel}
            currentCost={cost}
          />
        </div>
      )}

      {bookmarkedResources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No bookmarked resources yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Click the star icon on any resource to add it to your favorites.
          </p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No bookmarked resources match the selected filters.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try adjusting your filter criteria.
          </p>
        </div>
      ) : (
        <ResourceList resources={filteredResources} />
      )}
    </div>
  );
}

