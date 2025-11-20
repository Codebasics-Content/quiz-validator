"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Info,
  Shuffle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { QuizData } from "@/lib/types";
import {
  generateTableData,
  copyTableToClipboard,
  shuffleOptions,
  isDistributionUnbalanced,
} from "@/lib/utils";
import { COLUMN_HEADERS } from "@/lib/constants";

interface QuizExporterProps {
  quiz: QuizData;
  shuffledQuiz: QuizData | null;
  onShuffleQuiz: (quiz: QuizData) => void;
}

export default function QuizExporter({
  quiz,
  shuffledQuiz,
  onShuffleQuiz,
}: QuizExporterProps) {
  const [copiedTable, setCopiedTable] = useState(false);

  const needsShuffle = isDistributionUnbalanced(quiz);

  const handleCopyTable = async () => {
    const activeQuiz = shuffledQuiz || quiz;
    const success = await copyTableToClipboard(activeQuiz);
    if (success) {
      setCopiedTable(true);
      setTimeout(() => setCopiedTable(false), 2000);
    }
  };

  const handleShuffleOptions = () => {
    const shuffled: QuizData = {
      module: quiz.module,
      questions: quiz.questions.map((q) => shuffleOptions(q)),
    };
    onShuffleQuiz(shuffled);
  };

  const activeQuiz = shuffledQuiz || quiz;
  const tableData = generateTableData(activeQuiz);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Step 3:{" "}
        {shuffledQuiz ? "Shuffled Quiz (Pattern-Proof)" : "Copy to Excel"}
      </h2>

      {/* Conditional Shuffle Recommendation */}
      {needsShuffle && !shuffledQuiz && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">
                ⚠️ CRITICAL: Unbalanced Distribution Detected
              </h3>
              <p className="text-sm text-red-700 mb-2">
                Your quiz has position bias (some answers appear more than 4 or
                less than 1 times). Students can exploit this pattern by
                favoring certain positions.
                <strong> Shuffling is REQUIRED</strong> to eliminate this
                exploit.
              </p>
            </div>
          </div>
          <button
            onClick={handleShuffleOptions}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle All Options (Required)
          </button>
        </div>
      )}

      {/* Optional Shuffle for Already Balanced */}
      {!needsShuffle && !shuffledQuiz && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <Shuffle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                🔒 Optional: Extra Pattern Protection
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Your distribution is balanced, but shuffling adds an extra layer
                of randomization to eliminate ANY subtle patterns. Recommended
                for maximum security.
              </p>
            </div>
          </div>
          <button
            onClick={handleShuffleOptions}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle All Options (Optional)
          </button>
        </div>
      )}

      {/* Shuffle Success Message */}
      {shuffledQuiz && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 mb-2">
                ✅ Quiz Shuffled Successfully!
              </p>
              <p className="text-sm text-green-700 mb-3">
                All options have been randomized using the Fisher-Yates
                algorithm (proven unbiased). Students must know the content -
                position strategies won't work.
              </p>
            </div>
          </div>

          <button
            onClick={handleShuffleOptions}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
          >
            <Shuffle className="w-4 h-4" />
            Re-shuffle Options
          </button>
        </div>
      )}

      {/* Excel Copy Instructions */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-700">
          <p className="font-semibold mb-1">Excel Copy Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Copy Table Range (A2:P11)" below</li>
            <li>Open OneDrive Excel sheet for Discord bot</li>
            <li>
              Click cell <strong>A2</strong> (below header row)
            </li>
            <li>Paste (Ctrl+V / Cmd+V)</li>
            <li>
              Data fills <strong>A2:P11</strong> → 10 questions × 16 columns
            </li>
          </ol>
          <p className="mt-2 text-xs text-slate-500">
            ℹ️ Module column removed - now 16 columns (A-P) to match Excel
            template
          </p>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopyTable}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all mb-4 w-full justify-center ${
          copiedTable
            ? "bg-green-600 text-white"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {copiedTable ? (
          <>
            <Check className="w-5 h-5" />
            Copied Range A2:P11!
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            Copy Table Range (A2:P11)
          </>
        )}
      </button>

      {/* Table Preview */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              {COLUMN_HEADERS.map((header, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 text-left font-semibold text-slate-700 border-r border-slate-200 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-3 py-2 border-r border-slate-200 text-slate-800"
                  >
                    {cell === "" ? (
                      <span className="text-slate-400 italic">empty</span>
                    ) : cellIdx === 10 ? (
                      <span className="font-bold text-green-600">{cell}</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quiz Summary */}
      <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200">
        <h3 className="font-semibold text-slate-700 mb-2">Quiz Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Module:</span>
            <span className="ml-2 font-medium">{activeQuiz.module}</span>
          </div>
          <div>
            <span className="text-slate-600">Status:</span>
            <span
              className={`ml-2 font-medium ${
                shuffledQuiz
                  ? "text-green-600"
                  : needsShuffle
                    ? "text-red-600"
                    : "text-blue-600"
              }`}
            >
              {shuffledQuiz
                ? "🔒 Pattern-Proof (Shuffled)"
                : needsShuffle
                  ? "⚠️ Needs Shuffle"
                  : "✓ Validated"}
            </span>
          </div>
          <div>
            <span className="text-slate-600">Excel Range:</span>
            <span className="ml-2 font-medium text-green-600">A2:P11 ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
