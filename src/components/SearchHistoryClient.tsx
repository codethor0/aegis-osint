'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
  type SearchHistoryItem,
} from '@/lib/search-history';

export default function SearchHistoryClient() {
  const router = useRouter();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  if (history.length === 0) {
    return null;
  }

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    clearSearchHistory();
    setHistory([]);
  };

  const handleRemove = (query: string) => {
    removeFromSearchHistory(query);
    setHistory(getSearchHistory());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Searches
        </h3>
        <button
          onClick={handleClear}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {history.map((item) => (
          <div
            key={`${item.query}-${item.timestamp}`}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <button
              onClick={() => handleSearch(item.query)}
              className="flex-1 text-left text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.query}
            </button>
            <button
              onClick={() => handleRemove(item.query)}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={`Remove ${item.query} from history`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

