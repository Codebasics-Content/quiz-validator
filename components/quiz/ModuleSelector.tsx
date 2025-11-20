'use client';

import React from 'react';
import { MODULES } from '@/lib/constants';
import { ModuleOption } from '@/lib/types';

interface ModuleSelectorProps {
  selectedModule: string;
  showCustomInput: boolean;
  customModule: string;
  onModuleChange: (value: string) => void;
  onCustomModuleChange: (value: string) => void;
}

export default function ModuleSelector({
  selectedModule,
  showCustomInput,
  customModule,
  onModuleChange,
  onCustomModuleChange,
}: ModuleSelectorProps) {
  const groupedModules = MODULES.reduce((acc, mod) => {
    if (!acc[mod.category]) {
      acc[mod.category] = [];
    }
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<string, ModuleOption[]>);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Select Module
      </label>
      <select
        value={showCustomInput ? 'custom' : selectedModule}
        onChange={(e) => onModuleChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">-- Choose a module --</option>
        {Object.entries(groupedModules).map(([category, mods]) => (
          <optgroup key={category} label={category}>
            {mods.map((mod) => (
              <option key={mod.value} value={mod.value}>
                {mod.icon} {mod.label}
              </option>
            ))}
          </optgroup>
        ))}
        <option value="custom">➕ Custom Module...</option>
      </select>

      {showCustomInput && (
        <div className="mt-3">
          <input
            type="text"
            value={customModule}
            onChange={(e) => onCustomModuleChange(e.target.value)}
            placeholder="Enter custom module name"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
}
