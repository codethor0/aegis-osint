import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  importBookmarksFromJSON,
  addBookmark,
  clearBookmarks,
  getBookmarks,
  type ImportResult,
} from '@/lib/bookmarks';

describe('Bookmark Import Utilities', () => {
  const STORAGE_KEY = 'aegis-osint-bookmarks';
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    Object.defineProperty(global, 'window', {
      value: {
        dispatchEvent: vi.fn(),
      },
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
    vi.clearAllMocks();
    clearBookmarks();
  });

  describe('importBookmarksFromJSON', () => {
    it('should return error when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;
      const result = importBookmarksFromJSON('{}');
      expect(result.success).toBe(false);
      expect(result.error).toContain('browser');
      global.window = originalWindow;
    });

    it('should return error for empty string', () => {
      const result = importBookmarksFromJSON('');
      expect(result.success).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should return error for invalid JSON', () => {
      const result = importBookmarksFromJSON('invalid json');
      expect(result.success).toBe(false);
      expect(result.error).toContain('JSON');
    });

    it('should return error for non-object JSON', () => {
      const result = importBookmarksFromJSON('"string"');
      expect(result.success).toBe(false);
      expect(result.error).toContain('format');
    });

    it('should return error for missing version', () => {
      const json = JSON.stringify({
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 0,
        bookmarks: [],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('version');
    });

    it('should return error for unsupported version', () => {
      const json = JSON.stringify({
        version: '2.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 0,
        bookmarks: [],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('version');
    });

    it('should return error for missing exportDate', () => {
      const json = JSON.stringify({
        version: '1.0',
        bookmarkCount: 0,
        bookmarks: [],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('export date');
    });

    it('should return error for missing bookmarkCount', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarks: [],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('bookmark count');
    });

    it('should return error for non-array bookmarks', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 1,
        bookmarks: 'not an array',
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('array');
    });

    it('should return error for invalid bookmark structure', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 1,
        bookmarks: [{ invalid: 'bookmark' }],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('resourceId');
    });

    it('should return error for bookmark with empty resourceId', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 1,
        bookmarks: [{ resourceId: '', timestamp: 1000 }],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('resourceId');
    });

    it('should return error for bookmark with invalid timestamp', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 1,
        bookmarks: [{ resourceId: 'resource-1', timestamp: -1 }],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('timestamp');
    });

    it('should return error for empty bookmarks array', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 0,
        bookmarks: [],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('No valid bookmarks');
    });

    it('should successfully import valid bookmarks', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 2,
        bookmarks: [
          { resourceId: 'resource-1', timestamp: 1000, bookmarkedAt: '2024-01-01T00:00:00Z' },
          { resourceId: 'resource-2', timestamp: 2000, bookmarkedAt: '2024-01-01T00:00:00Z' },
        ],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(2);
      expect(result.skippedCount).toBe(0);
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(2);
      expect(bookmarks).toContain('resource-1');
      expect(bookmarks).toContain('resource-2');
    });

    it('should skip duplicate bookmarks', () => {
      addBookmark('resource-1');
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 2,
        bookmarks: [
          { resourceId: 'resource-1', timestamp: 1000, bookmarkedAt: '2024-01-01T00:00:00Z' },
          { resourceId: 'resource-2', timestamp: 2000, bookmarkedAt: '2024-01-01T00:00:00Z' },
        ],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(1);
      expect(result.skippedCount).toBe(1);
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(2);
    });

    it('should keep latest timestamp when merging duplicates', () => {
      addBookmark('resource-1');
      const existingBookmarks = getBookmarks();
      const existingTimestamp = Date.now() - 10000;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([{ resourceId: 'resource-1', timestamp: existingTimestamp }])
      );
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 1,
        bookmarks: [{ resourceId: 'resource-1', timestamp: Date.now(), bookmarkedAt: new Date().toISOString() }],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(true);
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(1);
    });

    it('should merge imported and existing bookmarks', () => {
      addBookmark('existing-1');
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 2,
        bookmarks: [
          { resourceId: 'imported-1', timestamp: 1000, bookmarkedAt: '2024-01-01T00:00:00Z' },
          { resourceId: 'imported-2', timestamp: 2000, bookmarkedAt: '2024-01-01T00:00:00Z' },
        ],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(2);
      const bookmarks = getBookmarks();
      expect(bookmarks.length).toBe(3);
      expect(bookmarks).toContain('existing-1');
      expect(bookmarks).toContain('imported-1');
      expect(bookmarks).toContain('imported-2');
    });

    it('should handle localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 1,
        bookmarks: [{ resourceId: 'resource-1', timestamp: 1000, bookmarkedAt: '2024-01-01T00:00:00Z' }],
      });
      const result = importBookmarksFromJSON(json);
      expect(result.success).toBe(false);
      expect(result.error).toContain('localStorage');
      localStorage.setItem = originalSetItem;
    });

    it('should dispatch bookmarks-changed event on success', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: '2024-01-01T00:00:00Z',
        bookmarkCount: 1,
        bookmarks: [{ resourceId: 'resource-1', timestamp: 1000, bookmarkedAt: '2024-01-01T00:00:00Z' }],
      });
      importBookmarksFromJSON(json);
      expect(global.window.dispatchEvent).toHaveBeenCalledWith(new CustomEvent('bookmarks-changed'));
    });
  });
});

