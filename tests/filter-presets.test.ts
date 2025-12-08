import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFilterPresets,
  saveFilterPreset,
  loadFilterPreset,
  deleteFilterPreset,
  generateUniquePresetName,
  type FilterPreset,
} from '@/lib/filter-presets';

describe('Filter Presets Management', () => {
  const STORAGE_KEY = 'aegis-osint-filter-presets';
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
  });

  describe('getFilterPresets', () => {
    it('should return empty array when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;
      const result = getFilterPresets();
      expect(result).toEqual([]);
      global.window = originalWindow;
    });

    it('should return empty array when localStorage is empty', () => {
      expect(getFilterPresets()).toEqual([]);
    });

    it('should return presets from localStorage', () => {
      const presets: FilterPreset[] = [
        {
          id: 'preset-1',
          name: 'Test Preset',
          filters: { categories: ['category-a'] },
          createdAt: 1000,
          updatedAt: 1000,
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
      const result = getFilterPresets();
      expect(result.length).toBe(1);
      expect(result[0]?.name).toBe('Test Preset');
    });

    it('should filter out invalid presets', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          { id: 'valid', name: 'Valid', filters: {}, createdAt: 1000, updatedAt: 1000 },
          { id: 'invalid', name: '', filters: {}, createdAt: 1000, updatedAt: 1000 },
          { invalid: 'preset' },
          null,
        ])
      );
      const result = getFilterPresets();
      expect(result.length).toBe(1);
      expect(result[0]?.id).toBe('valid');
    });
  });

  describe('saveFilterPreset', () => {
    it('should return error when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;
      const result = saveFilterPreset('Test', { categories: ['category-a'] });
      expect(result.success).toBe(false);
      expect(result.error).toContain('browser');
      global.window = originalWindow;
    });

    it('should save a new preset', () => {
      const result = saveFilterPreset('Test Preset', { categories: ['category-a'] });
      expect(result.success).toBe(true);
      expect(result.preset?.name).toBe('Test Preset');
      const presets = getFilterPresets();
      expect(presets.length).toBe(1);
    });

    it('should overwrite existing preset with same name', () => {
      saveFilterPreset('Test Preset', { categories: ['category-a'] });
      const result = saveFilterPreset('Test Preset', { categories: ['category-b'] });
      expect(result.success).toBe(true);
      const presets = getFilterPresets();
      expect(presets.length).toBe(1);
      expect(presets[0]?.filters.categories).toEqual(['category-b']);
    });

    it('should return error for empty name', () => {
      const result = saveFilterPreset('', { categories: ['category-a'] });
      expect(result.success).toBe(false);
      expect(result.error).toContain('1 and 100');
    });

    it('should return error for name too long', () => {
      const longName = 'a'.repeat(101);
      const result = saveFilterPreset(longName, { categories: ['category-a'] });
      expect(result.success).toBe(false);
      expect(result.error).toContain('1 and 100');
    });

    it('should enforce maximum preset limit', () => {
      for (let i = 0; i < 10; i++) {
        saveFilterPreset(`Preset ${i}`, { categories: [`category-${i}`] });
      }
      const result = saveFilterPreset('Preset 11', { categories: ['category-11'] });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Maximum');
    });

    it('should dispatch filter-presets-changed event', () => {
      saveFilterPreset('Test', { categories: ['category-a'] });
      expect(global.window.dispatchEvent).toHaveBeenCalledWith(
        new CustomEvent('filter-presets-changed')
      );
    });
  });

  describe('loadFilterPreset', () => {
    it('should return null when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;
      const result = loadFilterPreset('preset-1');
      expect(result).toBeNull();
      global.window = originalWindow;
    });

    it('should return null for non-existent preset', () => {
      expect(loadFilterPreset('non-existent')).toBeNull();
    });

    it('should return preset by ID', () => {
      const saveResult = saveFilterPreset('Test Preset', { categories: ['category-a'] });
      if (saveResult.preset) {
        const loaded = loadFilterPreset(saveResult.preset.id);
        expect(loaded?.name).toBe('Test Preset');
        expect(loaded?.filters.categories).toEqual(['category-a']);
      }
    });
  });

  describe('deleteFilterPreset', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;
      const result = deleteFilterPreset('preset-1');
      expect(result).toBe(false);
      global.window = originalWindow;
    });

    it('should return false for non-existent preset', () => {
      expect(deleteFilterPreset('non-existent')).toBe(false);
    });

    it('should delete existing preset', () => {
      const saveResult = saveFilterPreset('Test Preset', { categories: ['category-a'] });
      if (saveResult.preset) {
        const deleted = deleteFilterPreset(saveResult.preset.id);
        expect(deleted).toBe(true);
        expect(getFilterPresets().length).toBe(0);
      }
    });

    it('should dispatch filter-presets-changed event', () => {
      const saveResult = saveFilterPreset('Test', { categories: ['category-a'] });
      if (saveResult.preset) {
        vi.clearAllMocks();
        deleteFilterPreset(saveResult.preset.id);
        expect(global.window.dispatchEvent).toHaveBeenCalledWith(
          new CustomEvent('filter-presets-changed')
        );
      }
    });
  });

  describe('generateUniquePresetName', () => {
    it('should return base name if not exists', () => {
      expect(generateUniquePresetName('Test Preset')).toBe('Test Preset');
    });

    it('should append number if name exists', () => {
      saveFilterPreset('Test Preset', { categories: ['category-a'] });
      expect(generateUniquePresetName('Test Preset')).toBe('Test Preset (1)');
    });

    it('should increment number if multiple exist', () => {
      saveFilterPreset('Test Preset', { categories: ['category-a'] });
      saveFilterPreset('Test Preset (1)', { categories: ['category-b'] });
      expect(generateUniquePresetName('Test Preset')).toBe('Test Preset (2)');
    });

    it('should be case-insensitive', () => {
      saveFilterPreset('Test Preset', { categories: ['category-a'] });
      expect(generateUniquePresetName('test preset')).toBe('test preset (1)');
    });
  });
});

