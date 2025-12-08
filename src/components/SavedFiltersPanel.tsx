'use client';

import { useState, useEffect } from 'react';
import {
  getFilterPresets,
  saveFilterPreset,
  deleteFilterPreset,
  generateUniquePresetName,
  type FilterPreset,
} from '@/lib/filter-presets';
import type { MultiSelectFilters } from '@/lib/filtering';

interface SavedFiltersPanelProps {
  currentFilters: MultiSelectFilters;
  onLoadPreset: (filters: MultiSelectFilters) => void;
}

export default function SavedFiltersPanel({ currentFilters, onLoadPreset }: SavedFiltersPanelProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updatePresets = () => {
      setPresets(getFilterPresets());
    };

    updatePresets();
    window.addEventListener('filter-presets-changed', updatePresets);
    return () => window.removeEventListener('filter-presets-changed', updatePresets);
  }, []);

  const handleSave = () => {
    if (!presetName.trim()) {
      return;
    }

    const uniqueName = generateUniquePresetName(presetName.trim());
    const result = saveFilterPreset(uniqueName, currentFilters);

    if (result.success) {
      setShowSaveModal(false);
      setPresetName('');
    }
  };

  const handleLoad = (preset: FilterPreset) => {
    onLoadPreset(preset.filters);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      deleteFilterPreset(id);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Saved Filters</h4>
        <button
          onClick={() => setShowSaveModal(true)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Save Current
        </button>
      </div>

      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
            >
              <button
                onClick={() => handleLoad(preset)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {preset.name}
              </button>
              <button
                onClick={() => handleDelete(preset.id)}
                className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                aria-label={`Delete preset ${preset.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Save Filter Preset
            </h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                } else if (e.key === 'Escape') {
                  setShowSaveModal(false);
                  setPresetName('');
                }
              }}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setPresetName('');
                }}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

