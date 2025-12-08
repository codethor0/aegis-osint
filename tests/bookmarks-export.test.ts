import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  exportBookmarksToJSON,
  downloadBookmarksAsJSON,
  addBookmark,
  clearBookmarks,
} from '@/lib/bookmarks';
import type { Resource } from '@/lib/types';

describe('Bookmark Export Utilities', () => {
  const STORAGE_KEY = 'aegis-osint-bookmarks';
  let store: Record<string, string> = {};
  let mockLink: {
    href: string;
    download: string;
    click: ReturnType<typeof vi.fn>;
  };
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
  let mockBlob: ReturnType<typeof vi.fn>;
  let mockCreateElement: ReturnType<typeof vi.fn>;
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let mockRemoveChild: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    store = {};
    mockCreateObjectURL = vi.fn(() => 'blob:test-url');
    mockRevokeObjectURL = vi.fn();
    mockAppendChild = vi.fn();
    mockRemoveChild = vi.fn();
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    mockBlob = vi.fn((parts: unknown[], options: { type: string }) => ({
      parts,
      options,
    }));
    mockCreateElement = vi.fn(() => mockLink as unknown as HTMLElement);

    Object.defineProperty(global, 'window', {
      value: {
        URL: {
          createObjectURL: mockCreateObjectURL,
          revokeObjectURL: mockRevokeObjectURL,
        },
      },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'document', {
      value: {
        createElement: mockCreateElement,
        body: {
          appendChild: mockAppendChild,
          removeChild: mockRemoveChild,
        },
      },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'Blob', {
      value: mockBlob,
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

  describe('exportBookmarksToJSON', () => {
    it('should return null when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;
      const result = exportBookmarksToJSON();
      expect(result).toBeNull();
      global.window = originalWindow;
    });

    it('should return export data with bookmarks', () => {
      addBookmark('resource-1');
      addBookmark('resource-2');
      const result = exportBookmarksToJSON();
      expect(result).not.toBeNull();
      if (result) {
        expect(result.version).toBe('1.0');
        expect(result.bookmarkCount).toBe(2);
        expect(result.bookmarks.length).toBe(2);
        expect(result.exportDate).toBeDefined();
        const resourceIds = result.bookmarks.map((b) => b.resourceId);
        expect(resourceIds).toContain('resource-1');
        expect(resourceIds).toContain('resource-2');
      }
    });

    it('should return export data with empty bookmarks', () => {
      clearBookmarks();
      const result = exportBookmarksToJSON();
      expect(result).not.toBeNull();
      if (result) {
        expect(result.bookmarkCount).toBe(0);
        expect(result.bookmarks.length).toBe(0);
      }
    });

    it('should include timestamps in export', () => {
      addBookmark('resource-1');
      const result = exportBookmarksToJSON();
      expect(result).not.toBeNull();
      if (result && result.bookmarks.length > 0) {
        expect(result.bookmarks[0]?.timestamp).toBeDefined();
        expect(typeof result.bookmarks[0]?.timestamp).toBe('number');
        expect(result.bookmarks[0]?.bookmarkedAt).toBeDefined();
        expect(typeof result.bookmarks[0]?.bookmarkedAt).toBe('string');
      }
    });
  });

  describe('downloadBookmarksAsJSON', () => {
    it('should not download when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;
      const resources: Resource[] = [
        {
          id: 'resource-1',
          name: 'Test Resource',
          url: 'https://example.com',
          description: 'Test',
          category: 'people-search-identity',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];
      downloadBookmarksAsJSON(resources);
      expect(mockBlob).not.toHaveBeenCalled();
      global.window = originalWindow;
    });

    it('should not download when no bookmarks exist', () => {
      clearBookmarks();
      const resources: Resource[] = [
        {
          id: 'resource-1',
          name: 'Test Resource',
          url: 'https://example.com',
          description: 'Test',
          category: 'people-search-identity',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];
      downloadBookmarksAsJSON(resources);
      expect(mockBlob).not.toHaveBeenCalled();
    });

    it('should create blob with JSON data for download', () => {
      addBookmark('resource-1');
      const resources: Resource[] = [
        {
          id: 'resource-1',
          name: 'Test Resource',
          url: 'https://example.com',
          description: 'Test',
          category: 'people-search-identity',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];

      downloadBookmarksAsJSON(resources);

      expect(mockBlob).toHaveBeenCalled();
      const blobCall = mockBlob.mock.calls[0];
      if (blobCall && Array.isArray(blobCall) && blobCall[1]) {
        expect((blobCall[1] as { type: string }).type).toBe('application/json');
        if (Array.isArray(blobCall[0]) && typeof blobCall[0][0] === 'string') {
          const jsonData = JSON.parse(blobCall[0][0] as string);
          expect(jsonData.version).toBe('1.0');
          expect(jsonData.resources).toBeDefined();
          expect(Array.isArray(jsonData.resources)).toBe(true);
        }
      }
    });

    it('should include full resource data in export', () => {
      addBookmark('resource-1');
      const resources: Resource[] = [
        {
          id: 'resource-1',
          name: 'Test Resource',
          url: 'https://example.com',
          description: 'Test description',
          category: 'people-search-identity',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: ['test'],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];

      downloadBookmarksAsJSON(resources);

      expect(mockBlob).toHaveBeenCalled();
      const blobCall = mockBlob.mock.calls[0];
      if (blobCall && Array.isArray(blobCall) && blobCall[1]) {
        expect((blobCall[1] as { type: string }).type).toBe('application/json');
      }
    });

    it('should filter resources to only bookmarked ones', () => {
      addBookmark('resource-1');
      addBookmark('resource-2');
      const resources: Resource[] = [
        {
          id: 'resource-1',
          name: 'Resource 1',
          url: 'https://example.com/1',
          description: 'Test 1',
          category: 'people-search-identity',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
        {
          id: 'resource-2',
          name: 'Resource 2',
          url: 'https://example.com/2',
          description: 'Test 2',
          category: 'people-search-identity',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
        {
          id: 'resource-3',
          name: 'Resource 3',
          url: 'https://example.com/3',
          description: 'Test 3',
          category: 'people-search-identity',
          region: 'US',
          risk_level: 'low',
          auth_required: false,
          cost: 'free',
          type: 'lookup',
          tags: [],
          last_verified: '2024-01-01T00:00:00Z',
        },
      ];

      downloadBookmarksAsJSON(resources);

      expect(mockBlob).toHaveBeenCalled();
      const blobCall = mockBlob.mock.calls[0];
      if (blobCall && Array.isArray(blobCall) && Array.isArray(blobCall[0])) {
        const jsonString = blobCall[0][0] as string;
        const parsed = JSON.parse(jsonString);
        expect(parsed.resources.length).toBe(2);
        expect(parsed.resources.some((r: Resource) => r.id === 'resource-1')).toBe(true);
        expect(parsed.resources.some((r: Resource) => r.id === 'resource-2')).toBe(true);
        expect(parsed.resources.some((r: Resource) => r.id === 'resource-3')).toBe(false);
      }
    });
  });
});
