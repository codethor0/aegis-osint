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
 * Import result interface
 */
export interface ImportResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  error?: string;
}

/**
 * Validation result interface
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: BookmarkImport;
}

/**
 * Bookmark import data structure
 */
interface BookmarkImport {
  version: string;
  exportDate: string;
  bookmarkCount: number;
  bookmarks: Array<{
    resourceId: string;
    timestamp: number;
    bookmarkedAt: string;
  }>;
  resources?: Array<{
    id: string;
    name: string;
    [key: string]: unknown;
  }>;
}

/**
 * Validate bookmark import data structure
 */
function validateBookmarkImport(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid file format. Data must be a JSON object.' };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== 'string' || obj.version !== '1.0') {
    return { valid: false, error: 'Unsupported file version. Please export a new file.' };
  }

  if (typeof obj.exportDate !== 'string') {
    return { valid: false, error: 'Invalid file format. Missing export date.' };
  }

  if (typeof obj.bookmarkCount !== 'number') {
    return { valid: false, error: 'Invalid file format. Missing bookmark count.' };
  }

  if (!Array.isArray(obj.bookmarks)) {
    return { valid: false, error: 'Invalid file format. Bookmarks must be an array.' };
  }

  const bookmarks = obj.bookmarks;
  for (let i = 0; i < bookmarks.length; i++) {
    const bookmark = bookmarks[i];
    if (!bookmark || typeof bookmark !== 'object') {
      return { valid: false, error: `Invalid bookmark at index ${i}.` };
    }
    const bm = bookmark as Record<string, unknown>;
    if (typeof bm.resourceId !== 'string' || bm.resourceId.length === 0) {
      return { valid: false, error: `Invalid bookmark at index ${i}. Missing resourceId.` };
    }
    if (typeof bm.timestamp !== 'number' || bm.timestamp <= 0) {
      return { valid: false, error: `Invalid bookmark at index ${i}. Invalid timestamp.` };
    }
  }

  return {
    valid: true,
    data: obj as unknown as BookmarkImport,
  };
}

/**
 * Merge imported bookmarks with existing bookmarks
 */
function mergeBookmarks(
  imported: Array<{ resourceId: string; timestamp: number }>,
  existing: BookmarkItem[]
): BookmarkItem[] {
  const existingMap = new Map<string, number>();
  existing.forEach((item) => {
    existingMap.set(item.resourceId, item.timestamp);
  });

  const merged: BookmarkItem[] = [];
  const seen = new Set<string>();

  imported.forEach((item) => {
    if (!seen.has(item.resourceId)) {
      const existingTimestamp = existingMap.get(item.resourceId);
      const timestamp = existingTimestamp && existingTimestamp > item.timestamp ? existingTimestamp : item.timestamp;
      merged.push({
        resourceId: item.resourceId,
        timestamp,
      });
      seen.add(item.resourceId);
    }
  });

  existing.forEach((item) => {
    if (!seen.has(item.resourceId)) {
      merged.push(item);
      seen.add(item.resourceId);
    }
  });

  return merged.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Import bookmarks from JSON string
 */
export function importBookmarksFromJSON(jsonString: string): ImportResult {
  if (typeof window === 'undefined') {
    return { success: false, importedCount: 0, skippedCount: 0, error: 'Import is only available in the browser.' };
  }

  if (!jsonString || typeof jsonString !== 'string' || jsonString.trim().length === 0) {
    return { success: false, importedCount: 0, skippedCount: 0, error: 'Invalid file format. File is empty.' };
  }

  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateBookmarkImport(parsed);

    if (!validation.valid || !validation.data) {
      return {
        success: false,
        importedCount: 0,
        skippedCount: 0,
        error: validation.error || 'Invalid file format.',
      };
    }

    const importData = validation.data;

    if (importData.bookmarks.length === 0) {
      return { success: false, importedCount: 0, skippedCount: 0, error: 'No valid bookmarks found in file.' };
    }

    const existingBookmarks = getBookmarkItems();
    const importedBookmarks = importData.bookmarks.map((bm) => ({
      resourceId: bm.resourceId,
      timestamp: bm.timestamp,
    }));

    const merged = mergeBookmarks(importedBookmarks, existingBookmarks);
    const importedCount = importedBookmarks.filter((ib) => {
      return !existingBookmarks.some((eb) => eb.resourceId === ib.resourceId);
    }).length;
    const skippedCount = importedBookmarks.length - importedCount;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('bookmarks-changed'));
      return {
        success: true,
        importedCount,
        skippedCount,
      };
    } catch {
      return {
        success: false,
        importedCount: 0,
        skippedCount: 0,
        error: 'Failed to save bookmarks. localStorage may be unavailable.',
      };
    }
  } catch {
    return { success: false, importedCount: 0, skippedCount: 0, error: 'Invalid file format. Not valid JSON.' };
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

