/**
 * Search history management utilities
 * Stores recent searches in localStorage for quick access
 */

const STORAGE_KEY = 'aegis-osint-search-history';
const MAX_HISTORY_ITEMS = 10;
const MAX_QUERY_LENGTH = 1000;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const history: SearchHistoryItem[] = JSON.parse(stored);
    if (!Array.isArray(history)) {
      return [];
    }

    return history.filter((item) => {
      return (
        item &&
        typeof item.query === 'string' &&
        typeof item.timestamp === 'number' &&
        item.query.length > 0 &&
        item.query.length <= MAX_QUERY_LENGTH
      );
    });
  } catch {
    return [];
  }
}

/**
 * Add a search query to history
 */
export function addToSearchHistory(query: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const trimmed = query.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_QUERY_LENGTH) {
    return;
  }

  try {
    const history = getSearchHistory();
    const newItem: SearchHistoryItem = {
      query: trimmed,
      timestamp: Date.now(),
    };

    const filtered = history.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Remove a specific item from search history
 */
export function removeFromSearchHistory(query: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const history = getSearchHistory();
    const filtered = history.filter(
      (item) => item.query.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

