"use client";

import React from "react";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { QuizData } from "@/lib/types";
import { calculateCorrectAnswerDistribution } from "@/lib/utils";

interface AnswerDistributionProps {
  quiz: QuizData;
  shuffledQuiz?: QuizData | null;
}

export default function AnswerDistribution({
  quiz,
  shuffledQuiz,
}: AnswerDistributionProps) {
  const originalDist = calculateCorrectAnswerDistribution(quiz);
  const shuffledDist = shuffledQuiz
    ? calculateCorrectAnswerDistribution(shuffledQuiz)
    : null;

  const activeDist = shuffledDist || originalDist;
  const isBalanced = activeDist.counts.every((c) => c >= 1 && c <= 4);

  // Calculate pattern similarity (for showing how much changed)
  const calculateSimilarity = (): number => {
    if (!shuffledDist) return 100;
    let matches = 0;
    for (let i = 0; i < originalDist.pattern.length; i++) {
      if (originalDist.pattern[i] === shuffledDist.pattern[i]) matches++;
    }
    return Math.round((matches / originalDist.pattern.length) * 100);
  };

  const similarity = calculateSimilarity();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        Answer Distribution Analysis
        {shuffledQuiz && (
          <span className="text-sm font-normal text-green-600 ml-auto">
            🔀 Showing Shuffled Distribution
          </span>
        )}
      </h2>

      {/* Before/After Comparison (if shuffled) */}
      {shuffledQuiz && shuffledDist && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            📊 Shuffle Impact Analysis
          </h3>

          {/* Distribution Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-white rounded border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Original Distribution
              </p>
              <div className="flex gap-2 text-sm font-mono">
                {originalDist.counts.map((count, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded ${
                      count > 4
                        ? "bg-red-100 text-red-700"
                        : count < 1
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded border border-green-200">
              <p className="text-xs font-semibold text-green-700 mb-2">
                Shuffled Distribution
              </p>
              <div className="flex gap-2 text-sm font-mono">
                {shuffledDist.counts.map((count, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-green-100 text-green-700"
                  >
                    {count}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pattern Changes */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">
                Original Pattern:
              </p>
              <div className="font-mono text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                [{originalDist.pattern.join(", ")}]
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700 mb-1">
                Shuffled Pattern:
              </p>
              <div className="font-mono text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                [{shuffledDist.pattern.join(", ")}]
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded border border-slate-200">
            <div className="text-center">
              <p className="text-xs text-slate-600 mb-1">Pattern Similarity</p>
              <p className="text-lg font-bold text-slate-800">{similarity}%</p>
              <p className="text-xs text-green-600">
                {100 - similarity}% changed ✅
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-600 mb-1">Position Bias</p>
              <div className="flex items-center justify-center gap-1">
                {originalDist.counts.some((c) => c > 4) ? (
                  <span className="text-lg font-bold text-red-600">Fixed</span>
                ) : (
                  <span className="text-lg font-bold text-green-600">None</span>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-600 mb-1">Balance Status</p>
              <p className="text-lg font-bold text-green-600">Balanced ✓</p>
            </div>
          </div>

          {/* Position Changes */}
          <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Position Distribution Changes:
            </p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {originalDist.counts.map((origCount, idx) => {
                const newCount = shuffledDist.counts[idx];
                const diff = newCount - origCount;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-white rounded"
                  >
                    <span className="font-medium">Pos {idx + 1}:</span>
                    <span className="flex items-center gap-1">
                      {origCount} → {newCount}
                      {diff > 0 && (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      )}
                      {diff < 0 && (
                        <TrendingDown className="w-3 h-3 text-blue-600" />
                      )}
                      {diff === 0 && <span className="text-slate-400">-</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Current Distribution Visualization */}
        <div className="grid grid-cols-4 gap-4">
          {activeDist.counts.map((count, idx) => (
            <div key={idx} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-800">{count}×</div>
              <div className="text-sm text-slate-600">
                Position {idx + 1} ({activeDist.labels[idx]})
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {Math.round((count / 10) * 100)}%
              </div>
            </div>
          ))}
        </div>

        {/* Answer Pattern */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm font-medium text-slate-700 mb-2">
            {shuffledQuiz ? "Current" : "Answer"} Pattern:
          </p>
          <div className="font-mono text-xs text-slate-600 break-all">
            [{activeDist.pattern.join(", ")}]
          </div>
        </div>

        {/* Balance Status */}
        <div
          className={`p-4 rounded-lg border-2 ${
            isBalanced
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isBalanced ? "text-green-800" : "text-red-800"
            }`}
          >
            {isBalanced
              ? "✓ Distribution is balanced - no exploitable patterns"
              : "✗ Distribution is unbalanced - students can exploit this!"}
          </p>
        </div>
      </div>
    </div>
  );
}
