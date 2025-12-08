import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
} from '@/lib/search-history';

describe('Search History Utilities', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    // Mock window and localStorage
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          Object.keys(store).forEach((key) => delete store[key]);
        }),
        length: 0,
        key: vi.fn(() => null),
      },
      writable: true,
      configurable: true,
    });
  });

  describe('getSearchHistory', () => {
    it('should return empty array when localStorage is empty', () => {
      const history = getSearchHistory();
      expect(history).toEqual([]);
    });

    it('should return history from localStorage', () => {
      const testHistory = [
        { query: 'test query', timestamp: Date.now() },
        { query: 'another query', timestamp: Date.now() - 1000 },
      ];
      localStorage.setItem('aegis-osint-search-history', JSON.stringify(testHistory));
      const history = getSearchHistory();
      expect(history.length).toBe(2);
      expect(history[0]?.query).toBe('test query');
    });

    it('should filter out invalid history items', () => {
      const invalidHistory = [
        { query: 'valid', timestamp: Date.now() },
        { query: '', timestamp: Date.now() },
        { query: 'a'.repeat(2000), timestamp: Date.now() },
        null,
        { query: 'valid2' },
      ];
      localStorage.setItem('aegis-osint-search-history', JSON.stringify(invalidHistory));
      const history = getSearchHistory();
      expect(history.length).toBe(1);
      expect(history[0]?.query).toBe('valid');
    });
  });

  describe('addToSearchHistory', () => {
    it('should add query to history', () => {
      addToSearchHistory('test query');
      const history = getSearchHistory();
      expect(history.length).toBe(1);
      expect(history[0]?.query).toBe('test query');
    });

    it('should not add empty queries', () => {
      addToSearchHistory('');
      addToSearchHistory('   ');
      const history = getSearchHistory();
      expect(history.length).toBe(0);
    });

    it('should not add queries exceeding MAX_QUERY_LENGTH', () => {
      const longQuery = 'a'.repeat(2000);
      addToSearchHistory(longQuery);
      const history = getSearchHistory();
      expect(history.length).toBe(0);
    });

    it('should move duplicate queries to top', () => {
      addToSearchHistory('first query');
      addToSearchHistory('second query');
      addToSearchHistory('first query');
      const history = getSearchHistory();
      expect(history.length).toBe(2);
      expect(history[0]?.query).toBe('first query');
      expect(history[1]?.query).toBe('second query');
    });

    it('should limit history to MAX_HISTORY_ITEMS', () => {
      for (let i = 0; i < 15; i++) {
        addToSearchHistory(`query ${i}`);
      }
      const history = getSearchHistory();
      expect(history.length).toBe(10);
    });

    it('should be case-insensitive for duplicates', () => {
      addToSearchHistory('Test Query');
      addToSearchHistory('test query');
      const history = getSearchHistory();
      expect(history.length).toBe(1);
      expect(history[0]?.query).toBe('test query');
    });
  });

  describe('clearSearchHistory', () => {
    it('should clear all history', () => {
      addToSearchHistory('test query 1');
      addToSearchHistory('test query 2');
      clearSearchHistory();
      const history = getSearchHistory();
      expect(history.length).toBe(0);
    });
  });

  describe('removeFromSearchHistory', () => {
    it('should remove specific query from history', () => {
      addToSearchHistory('query 1');
      addToSearchHistory('query 2');
      addToSearchHistory('query 3');
      removeFromSearchHistory('query 2');
      const history = getSearchHistory();
      expect(history.length).toBe(2);
      expect(history.some((item) => item.query === 'query 2')).toBe(false);
    });

    it('should be case-insensitive when removing', () => {
      addToSearchHistory('Test Query');
      removeFromSearchHistory('test query');
      const history = getSearchHistory();
      expect(history.length).toBe(0);
    });
  });
});

