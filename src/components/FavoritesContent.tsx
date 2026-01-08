'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBookmarks, clearBookmarks, downloadBookmarksAsJSON, importBookmarksFromJSON } from '@/lib/bookmarks';
import { getResources } from '@/lib/data';
import { filterResources, type ResourceFilters } from '@/lib/search';
import type { Resource } from '@/lib/types';
import ResourceList from '@/components/ResourceList';
import SearchFilters from '@/components/SearchFilters';

export default function FavoritesContent() {
  const searchParams = useSearchParams();
  const [bookmarkedResources, setBookmarkedResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [mounted, setMounted] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    if (bookmarkedResources.length === 0) {
      return;
    }
    downloadBookmarksAsJSON(bookmarkedResources);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImportMessage({ type: 'error', text: 'File is too large. Maximum size is 5MB.' });
      return;
    }

    if (!file.name.endsWith('.json')) {
      setImportMessage({ type: 'error', text: 'Invalid file type. Please select a JSON file.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') {
        setImportMessage({ type: 'error', text: 'Failed to read file.' });
        return;
      }

      const result = importBookmarksFromJSON(text);
      if (result.success) {
        if (result.importedCount > 0) {
          setImportMessage({
            type: 'success',
            text: `Import successful. ${result.importedCount} bookmark${result.importedCount !== 1 ? 's' : ''} added.${result.skippedCount > 0 ? ` ${result.skippedCount} duplicate${result.skippedCount !== 1 ? 's' : ''} skipped.` : ''}`,
          });
        } else {
          setImportMessage({ type: 'error', text: 'No new bookmarks found. All bookmarks already exist.' });
        }
      } else {
        setImportMessage({ type: 'error', text: result.error || 'Import failed.' });
      }

      setTimeout(() => {
        setImportMessage(null);
      }, 5000);
    };

    reader.onerror = () => {
      setImportMessage({ type: 'error', text: 'Failed to read file.' });
    };

    reader.readAsText(file);
    e.target.value = '';
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
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={handleImportClick}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Import JSON
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
          {bookmarkedResources.length === 0 && (
            <button
              onClick={handleImportClick}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Import JSON
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Import bookmarks from JSON file"
          />
        </div>
      </div>

      {importMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            importMessage.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}
        >
          {importMessage.text}
        </div>
      )}

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
          <p className="text-gray-600 dark:text-gray-400 mb-4" data-testid="favorites-empty-state">
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
        <section data-testid="favorites-list">
          <ResourceList resources={filteredResources} />
        </section>
      )}
    </div>
  );
}
