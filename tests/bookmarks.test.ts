import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getBookmarks,
  getBookmarkItems,
  isBookmarked,
  addBookmark,
  removeBookmark,
  toggleBookmark,
  clearBookmarks,
  getBookmarkCount,
} from '@/lib/bookmarks';

describe('Bookmark Utilities', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
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

  describe('getBookmarks', () => {
    it('should return empty array when localStorage is empty', () => {
      const bookmarks = getBookmarks();
      expect(bookmarks).toEqual([]);
    });

    it('should return bookmark IDs from localStorage', () => {
      const testBookmarks = [
        { resourceId: 'resource-1', timestamp: Date.now() },
        { resourceId: 'resource-2', timestamp: Date.now() - 1000 },
      ];
      localStorage.setItem('aegis-osint-bookmarks', JSON.stringify(testBookmarks));
      const bookmarks = getBookmarks();
      expect(bookmarks).toEqual(['resource-1', 'resource-2']);
    });

    it('should filter out invalid bookmark items', () => {
      const invalidBookmarks = [
        { resourceId: 'valid-1', timestamp: Date.now() },
        { resourceId: '', timestamp: Date.now() },
        { resourceId: 'valid-2' },
        null,
      ];
      localStorage.setItem('aegis-osint-bookmarks', JSON.stringify(invalidBookmarks));
      const bookmarks = getBookmarks();
      expect(bookmarks).toEqual(['valid-1']);
    });
  });

  describe('getBookmarkItems', () => {
    it('should return bookmark items with timestamps', () => {
      const testBookmarks = [
        { resourceId: 'resource-1', timestamp: 1000 },
        { resourceId: 'resource-2', timestamp: 2000 },
      ];
      localStorage.setItem('aegis-osint-bookmarks', JSON.stringify(testBookmarks));
      const items = getBookmarkItems();
      expect(items.length).toBe(2);
      expect(items[0]?.resourceId).toBe('resource-1');
      expect(items[0]?.timestamp).toBe(1000);
    });
  });

  describe('isBookmarked', () => {
    it('should return false for unbookmarked resource', () => {
      expect(isBookmarked('resource-1')).toBe(false);
    });

    it('should return true for bookmarked resource', () => {
      addBookmark('resource-1');
      expect(isBookmarked('resource-1')).toBe(true);
    });
  });

  describe('addBookmark', () => {
    it('should add resource to bookmarks', () => {
      addBookmark('resource-1');
      expect(isBookmarked('resource-1')).toBe(true);
    });

    it('should not add empty resource ID', () => {
      addBookmark('');
      addBookmark('   ');
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(0);
    });

    it('should not add duplicate bookmarks', () => {
      addBookmark('resource-1');
      addBookmark('resource-1');
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(1);
      expect(bookmarks[0]).toBe('resource-1');
    });

    it('should limit bookmarks to MAX_BOOKMARKS', () => {
      for (let i = 0; i < 600; i++) {
        addBookmark(`resource-${i}`);
      }
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(500);
    });
  });

  describe('removeBookmark', () => {
    it('should remove resource from bookmarks', () => {
      addBookmark('resource-1');
      addBookmark('resource-2');
      removeBookmark('resource-1');
      expect(isBookmarked('resource-1')).toBe(false);
      expect(isBookmarked('resource-2')).toBe(true);
    });

    it('should handle removing non-existent bookmark', () => {
      removeBookmark('non-existent');
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(0);
    });
  });

  describe('toggleBookmark', () => {
    it('should add bookmark when not bookmarked', () => {
      const result = toggleBookmark('resource-1');
      expect(result).toBe(true);
      expect(isBookmarked('resource-1')).toBe(true);
    });

    it('should remove bookmark when already bookmarked', () => {
      addBookmark('resource-1');
      const result = toggleBookmark('resource-1');
      expect(result).toBe(false);
      expect(isBookmarked('resource-1')).toBe(false);
    });
  });

  describe('clearBookmarks', () => {
    it('should clear all bookmarks', () => {
      addBookmark('resource-1');
      addBookmark('resource-2');
      clearBookmarks();
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(0);
    });
  });

  describe('getBookmarkCount', () => {
    it('should return correct bookmark count', () => {
      expect(getBookmarkCount()).toBe(0);
      addBookmark('resource-1');
      expect(getBookmarkCount()).toBe(1);
      addBookmark('resource-2');
      expect(getBookmarkCount()).toBe(2);
      removeBookmark('resource-1');
      expect(getBookmarkCount()).toBe(1);
    });
  });
});

