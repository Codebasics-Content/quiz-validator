'use client';

import React from 'react';
import { BookOpen, Copy, Check, X } from 'lucide-react';

interface PromptDisplayProps {
  module: string;
  customModule: string;
  showCustomInput: boolean;
  llmProvider: string;
  isVisible: boolean;
  isCopied: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
  getSystemPrompt: () => string;
}

export default function PromptDisplay({
  module,
  customModule,
  showCustomInput,
  llmProvider,
  isVisible,
  isCopied,
  onClose,
  onCopy,
  getSystemPrompt,
}: PromptDisplayProps) {
  if (!isVisible) return null;

  const selectedModule = showCustomInput ? customModule : module;
  const prompt = getSystemPrompt();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          System Prompt for {selectedModule}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
          {prompt}
        </pre>
      </div>

      <button
        onClick={() => onCopy(prompt)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isCopied
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Prompt
          </>
        )}
      </button>
    </div>
  );
}
