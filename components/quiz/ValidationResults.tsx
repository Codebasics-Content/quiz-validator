'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { ValidationResults as ValidationResultsType } from '@/lib/types';

interface ValidationResultsProps {
  results: ValidationResultsType;
  previousErrorCount: number | null;
  showSuccessAnimation: boolean;
}

export default function ValidationResults({
  results,
  previousErrorCount,
  showSuccessAnimation,
}: ValidationResultsProps) {
  const { valid, errors, warnings } = results;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Step 2: Validation Results
      </h2>

      {/* Status Badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold mb-4 ${
          valid
            ? 'bg-green-100 text-green-800 border-2 border-green-300'
            : 'bg-red-100 text-red-800 border-2 border-red-300'
        }`}
      >
        {valid ? (
          <>
            <CheckCircle className="w-5 h-5" />
            ✓ Quiz Valid - Ready for Export
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5" />
            ✗ Validation Failed - Fix Errors Below
          </>
        )}
      </div>

      {/* Improvement Indicator */}
      {previousErrorCount !== null && !valid && (
        <div
          className={`mb-4 p-3 rounded-lg border-2 ${
            errors.length < previousErrorCount
              ? 'bg-blue-50 border-blue-300'
              : errors.length > previousErrorCount
                ? 'bg-orange-50 border-orange-300'
                : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp
              className={`w-4 h-4 ${
                errors.length < previousErrorCount
                  ? 'text-blue-600'
                  : 'text-orange-600'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                errors.length < previousErrorCount
                  ? 'text-blue-800'
                  : errors.length > previousErrorCount
                    ? 'text-orange-800'
                    : 'text-slate-700'
              }`}
            >
              {errors.length < previousErrorCount
                ? `✓ Progress! ${previousErrorCount - errors.length} fewer errors (${previousErrorCount} → ${errors.length})`
                : errors.length > previousErrorCount
                  ? `⚠️ ${errors.length - previousErrorCount} more errors introduced (${previousErrorCount} → ${errors.length})`
                  : `No change (${errors.length} errors remain)`}
            </span>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccessAnimation && valid && (
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg animate-pulse">
          <p className="text-green-800 font-semibold text-center">
            🎉 Excellent! Quiz passed all validation checks!
          </p>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Errors ({errors.length})
          </h3>
          <ul className="space-y-2">
            {errors.map((error, idx) => (
              <li
                key={idx}
                className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800"
              >
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <h3 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Warnings ({warnings.length})
          </h3>
          <ul className="space-y-2">
            {warnings.map((warning, idx) => (
              <li
                key={idx}
                className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800"
              >
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
