'use client';

import React from 'react';
import { Sparkles, Code, Zap } from 'lucide-react';

interface LLMProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (value: string) => void;
}

export default function LLMProviderSelector({
  selectedProvider,
  onProviderChange,
}: LLMProviderSelectorProps) {
  const providers = [
    { value: 'claude', label: 'Claude (Anthropic)', icon: Sparkles },
    { value: 'gpt', label: 'ChatGPT (OpenAI)', icon: Code },
    { value: 'gemini', label: 'Gemini (Google)', icon: Zap },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        LLM Provider (for prompt generation)
      </label>
      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <button
              key={provider.value}
              onClick={() => onProviderChange(provider.value)}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                selectedProvider === provider.value
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {provider.label.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
