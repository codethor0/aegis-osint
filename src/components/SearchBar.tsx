'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getSearchHistory, addToSearchHistory, type SearchHistoryItem } from '@/lib/search-history';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showHistory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      addToSearchHistory(trimmed);
      setHistory(getSearchHistory());
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    addToSearchHistory(historyQuery);
    setHistory(getSearchHistory());
    router.push(`/search?q=${encodeURIComponent(historyQuery)}`);
    setShowHistory(false);
  };

  return (
    <div ref={searchBarRef} className="w-full max-w-md relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              placeholder="Search resources and categories..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1000}
            />
            {showHistory && history.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Recent Searches
                  </p>
                </div>
                {history.map((item) => (
                  <button
                    key={`${item.query}-${item.timestamp}`}
                    type="button"
                    onClick={() => handleHistoryClick(item.query)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-900 dark:text-gray-100"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
        Use AND/OR operators or quotes for exact phrases
      </p>
    </div>
  );
}
