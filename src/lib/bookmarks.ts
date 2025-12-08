/**
 * Bookmark management utilities
 * Stores bookmarked resource IDs in localStorage
 */

const STORAGE_KEY = 'aegis-osint-bookmarks';
const MAX_BOOKMARKS = 500;

export interface BookmarkItem {
  resourceId: string;
  timestamp: number;
}

/**
 * Get all bookmarked resource IDs
 */
export function getBookmarks(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const bookmarks: BookmarkItem[] = JSON.parse(stored);
    if (!Array.isArray(bookmarks)) {
      return [];
    }

    return bookmarks
      .filter((item) => {
        return (
          item &&
          typeof item.resourceId === 'string' &&
          typeof item.timestamp === 'number' &&
          item.resourceId.length > 0
        );
      })
      .map((item) => item.resourceId);
  } catch {
    return [];
  }
}

/**
 * Get all bookmark items with timestamps
 */
export function getBookmarkItems(): BookmarkItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const bookmarks: BookmarkItem[] = JSON.parse(stored);
    if (!Array.isArray(bookmarks)) {
      return [];
    }

    return bookmarks.filter((item) => {
      return (
        item &&
        typeof item.resourceId === 'string' &&
        typeof item.timestamp === 'number' &&
        item.resourceId.length > 0
      );
    });
  } catch {
    return [];
  }
}

/**
 * Check if a resource is bookmarked
 */
export function isBookmarked(resourceId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const bookmarks = getBookmarks();
  return bookmarks.includes(resourceId);
}

/**
 * Add a resource to bookmarks
 */
export function addBookmark(resourceId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!resourceId || resourceId.trim().length === 0) {
    return;
  }

  try {
    const bookmarks = getBookmarkItems();
    const exists = bookmarks.some((item) => item.resourceId === resourceId);

    if (exists) {
      return;
    }

    const newBookmark: BookmarkItem = {
      resourceId: resourceId.trim(),
      timestamp: Date.now(),
    };

    const updated = [newBookmark, ...bookmarks].slice(0, MAX_BOOKMARKS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Remove a resource from bookmarks
 */
export function removeBookmark(resourceId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const bookmarks = getBookmarkItems();
    const filtered = bookmarks.filter((item) => item.resourceId !== resourceId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Toggle bookmark status
 */
export function toggleBookmark(resourceId: string): boolean {
  if (isBookmarked(resourceId)) {
    removeBookmark(resourceId);
    return false;
  } else {
    addBookmark(resourceId);
    return true;
  }
}

/**
 * Clear all bookmarks
 */
export function clearBookmarks(): void {
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
 * Get bookmark count
 */
export function getBookmarkCount(): number {
  return getBookmarks().length;
}

/**
 * Export bookmarks to JSON file
 */
export interface BookmarkExport {
  version: string;
  exportDate: string;
  bookmarkCount: number;
  bookmarks: Array<{
    resourceId: string;
    timestamp: number;
    bookmarkedAt: string;
  }>;
}

export function exportBookmarksToJSON(): BookmarkExport | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const bookmarkItems = getBookmarkItems();
    const exportData: BookmarkExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      bookmarkCount: bookmarkItems.length,
      bookmarks: bookmarkItems.map((item) => ({
        resourceId: item.resourceId,
        timestamp: item.timestamp,
        bookmarkedAt: new Date(item.timestamp).toISOString(),
      })),
    };

    return exportData;
  } catch {
    return null;
  }
}

/**
 * Download bookmarks as JSON file
 */
export function downloadBookmarksAsJSON(resources: Array<{ id: string; name: string }>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const exportData = exportBookmarksToJSON();
    if (!exportData || exportData.bookmarkCount === 0) {
      return;
    }

    const bookmarkIds = new Set(exportData.bookmarks.map((b) => b.resourceId));
    const bookmarkedResources = resources.filter((r) => bookmarkIds.has(r.id));

    const fullExport = {
      ...exportData,
      resources: bookmarkedResources,
    };

    const jsonString = JSON.stringify(fullExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split('T')[0];
    const filename = `aegis-osint-favorites-${date}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // Silently fail if download is not possible
  }
}

