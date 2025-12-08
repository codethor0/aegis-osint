/**
 * Filter preset management utilities
 * Stores saved filter configurations in localStorage
 */

const STORAGE_KEY = 'aegis-osint-filter-presets';
const MAX_PRESETS = 10;

export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    categories?: string[];
    regions?: string[];
    riskLevels?: string[];
    costs?: string[];
  };
  createdAt: number;
  updatedAt: number;
}

/**
 * Get all saved filter presets
 */
export function getFilterPresets(): FilterPreset[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const presets: FilterPreset[] = JSON.parse(stored);
    if (!Array.isArray(presets)) {
      return [];
    }

    return presets.filter((preset) => {
      return (
        preset &&
        typeof preset.id === 'string' &&
        typeof preset.name === 'string' &&
        typeof preset.createdAt === 'number' &&
        typeof preset.updatedAt === 'number' &&
        preset.name.length > 0 &&
        preset.name.length <= 100
      );
    });
  } catch {
    return [];
  }
}

/**
 * Save a filter preset
 */
export function saveFilterPreset(name: string, filters: FilterPreset['filters']): {
  success: boolean;
  error?: string;
  preset?: FilterPreset;
} {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Presets are only available in the browser.' };
  }

  const trimmedName = name.trim();
  if (trimmedName.length === 0 || trimmedName.length > 100) {
    return { success: false, error: 'Preset name must be between 1 and 100 characters.' };
  }

  try {
    const presets = getFilterPresets();
    const existingIndex = presets.findIndex((p) => p.name.toLowerCase() === trimmedName.toLowerCase());

    const preset: FilterPreset = {
      id: existingIndex >= 0 ? presets[existingIndex]!.id : `preset-${Date.now()}`,
      name: trimmedName,
      filters,
      createdAt: existingIndex >= 0 ? presets[existingIndex]!.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      presets[existingIndex] = preset;
    } else {
      if (presets.length >= MAX_PRESETS) {
        return { success: false, error: `Maximum of ${MAX_PRESETS} presets allowed.` };
      }
      presets.push(preset);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    window.dispatchEvent(new CustomEvent('filter-presets-changed'));
    return { success: true, preset };
  } catch {
    return { success: false, error: 'Failed to save preset. localStorage may be unavailable.' };
  }
}

/**
 * Load a filter preset by ID
 */
export function loadFilterPreset(id: string): FilterPreset | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const presets = getFilterPresets();
    return presets.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
}

/**
 * Delete a filter preset
 */
export function deleteFilterPreset(id: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const presets = getFilterPresets();
    const filtered = presets.filter((p) => p.id !== id);
    if (filtered.length === presets.length) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('filter-presets-changed'));
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a unique preset name
 */
export function generateUniquePresetName(baseName: string): string {
  const presets = getFilterPresets();
  const existingNames = new Set(presets.map((p) => p.name.toLowerCase()));

  if (!existingNames.has(baseName.toLowerCase())) {
    return baseName;
  }

  let counter = 1;
  let uniqueName = `${baseName} (${counter})`;
  while (existingNames.has(uniqueName.toLowerCase())) {
    counter++;
    uniqueName = `${baseName} (${counter})`;
  }

  return uniqueName;
}

