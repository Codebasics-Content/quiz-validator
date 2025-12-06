/**
 * STEP 4: HISTORICAL QUIZ DATA STORAGE & RETRIEVAL
 *
 * Purpose: Store approved quizzes and track performance metrics
 * MVP: JSON file storage (later: PostgreSQL/Supabase)
 * Usage: Feed high-rated questions back into generator prompts
 */

import { QuizData, QuizHistory, QuestionWithMetrics, QuestionMetrics } from "../types";

// MVP: In-memory storage (later: replace with database)
// In production, this would be stored in localStorage or a JSON file
let quizHistoryStore: QuizHistory[] = [];

/**
 * Save approved quiz to history
 */
export const saveQuizToHistory = async (
  quiz: QuizData,
  approvedBy: string,
  reviewNotes?: string,
): Promise<string> => {
  const quizId = generateQuizId(quiz.module);

  const historyEntry: QuizHistory = {
    quizId,
    module: quiz.module,
    createdAt: new Date().toISOString(),
    createdBy: "system", // Could be LLM provider name
    approvedBy,
    approvedAt: new Date().toISOString(),
    questions: quiz.questions.map((q) => ({
      ...q,
      tags: inferQuestionTags(q),
      reviewNotes,
    })),
  };

  quizHistoryStore.push(historyEntry);

  // In production: save to file or database
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const existing = localStorage.getItem("quizHistory");
      const history: QuizHistory[] = existing ? JSON.parse(existing) : [];
      history.push(historyEntry);
      localStorage.setItem("quizHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save quiz history:", error);
    }
  }

  return quizId;
};

/**
 * Load quiz history (optionally filter by module)
 */
export const loadQuizHistory = async (
  moduleName?: string,
): Promise<QuizHistory[]> => {
  // In production: load from file or database
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = localStorage.getItem("quizHistory");
      if (stored) {
        quizHistoryStore = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load quiz history:", error);
    }
  }

  if (moduleName) {
    return quizHistoryStore.filter((quiz) => quiz.module === moduleName);
  }

  return quizHistoryStore;
};

/**
 * Get top-rated questions for a module
 */
export const getTopRatedQuestions = async (
  moduleName: string,
  limit: number = 10,
): Promise<QuestionWithMetrics[]> => {
  const moduleHistory = await loadQuizHistory(moduleName);

  // Flatten all questions
  const allQuestions = moduleHistory.flatMap((quiz) => quiz.questions);

  // Filter for questions with metrics
  const questionsWithMetrics = allQuestions.filter((q) => q.metrics);

  // Sort by rating, then by optimal difficulty (30-80% correct rate)
  const sorted = questionsWithMetrics.sort((a, b) => {
    const ratingDiff = (b.metrics?.avgStudentRating ?? 0) - (a.metrics?.avgStudentRating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;

    // Secondary: prefer questions with optimal difficulty
    const aOptimality = calculateDifficultyOptimality(a.metrics?.correctRate ?? 0.5);
    const bOptimality = calculateDifficultyOptimality(b.metrics?.correctRate ?? 0.5);
    return bOptimality - aOptimality;
  });

  return sorted.slice(0, limit);
};

/**
 * Update question metrics (called from Discord bot after quiz)
 */
export const updateQuestionMetrics = async (
  questionId: string,
  metrics: Partial<QuestionMetrics>,
): Promise<void> => {
  const allHistory = await loadQuizHistory();

  let found = false;
  allHistory.forEach((quiz) => {
    quiz.questions.forEach((q) => {
      if (q.id === questionId) {
        // Merge metrics (averaging if multiple entries)
        if (q.metrics) {
          q.metrics = {
            timesAsked: (q.metrics.timesAsked ?? 0) + (metrics.timesAsked ?? 1),
            avgCompletionTime: averageMetric(
              q.metrics.avgCompletionTime,
              metrics.avgCompletionTime,
              q.metrics.timesAsked,
            ),
            correctRate: averageMetric(
              q.metrics.correctRate,
              metrics.correctRate,
              q.metrics.timesAsked,
            ),
            skipRate: averageMetric(
              q.metrics.skipRate,
              metrics.skipRate,
              q.metrics.timesAsked,
            ),
            avgStudentRating: averageMetric(
              q.metrics.avgStudentRating,
              metrics.avgStudentRating,
              q.metrics.timesAsked,
            ),
            studentFeedback: [
              ...(q.metrics.studentFeedback ?? []),
              ...(metrics.studentFeedback ?? []),
            ],
          };
        } else {
          q.metrics = {
            timesAsked: metrics.timesAsked ?? 1,
            avgCompletionTime: metrics.avgCompletionTime ?? 0,
            correctRate: metrics.correctRate ?? 0,
            skipRate: metrics.skipRate ?? 0,
            avgStudentRating: metrics.avgStudentRating ?? 0,
            studentFeedback: metrics.studentFeedback ?? [],
          };
        }
        found = true;
      }
    });
  });

  if (found && typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem("quizHistory", JSON.stringify(allHistory));
      quizHistoryStore = allHistory;
    } catch (error) {
      console.error("Failed to update question metrics:", error);
    }
  }
};

/**
 * Get questions similar to a given question
 * (For HITL review: show past questions for comparison)
 */
export const getSimilarQuestions = async (
  currentQuestion: string,
  moduleName: string,
  limit: number = 3,
): Promise<QuestionWithMetrics[]> => {
  const moduleHistory = await loadQuizHistory(moduleName);
  const allQuestions = moduleHistory.flatMap((quiz) => quiz.questions);

  // Simple similarity: keyword overlap (in production: use embeddings)
  const currentKeywords = extractKeywords(currentQuestion);

  const scored = allQuestions.map((q) => {
    const qKeywords = extractKeywords(q.question);
    const overlap = currentKeywords.filter((kw) =>
      qKeywords.includes(kw),
    ).length;
    const similarity = overlap / Math.max(currentKeywords.length, qKeywords.length);

    return { question: q, similarity };
  });

  // Sort by similarity, then by rating
  const sorted = scored
    .filter((item) => item.similarity > 0.2) // At least 20% keyword overlap
    .sort((a, b) => {
      const simDiff = b.similarity - a.similarity;
      if (simDiff !== 0) return simDiff;

      return (
        (b.question.metrics?.avgStudentRating ?? 0) -
        (a.question.metrics?.avgStudentRating ?? 0)
      );
    });

  return sorted.slice(0, limit).map((item) => item.question);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateQuizId(moduleName: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const moduleCode = moduleName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
  return `${moduleCode}-${timestamp}-${random}`;
}

function inferQuestionTags(question: any): string[] {
  const tags: string[] = [];
  const q = question.question.toLowerCase();

  // Infer tags from content
  if (q.includes("scenario") || q.includes("real-world")) tags.push("scenario-based");
  if (q.includes("debug") || q.includes("error") || q.includes("fix")) tags.push("debugging");
  if (q.includes("code") || q.includes("`")) tags.push("code-based");
  if (q.includes("compare") || q.includes("vs") || q.includes("difference")) tags.push("comparative");
  if (q.includes("calculate") || q.includes("formula")) tags.push("calculation");
  if (question.bloomLevel) tags.push(`bloom-${question.bloomLevel}`);

  return tags;
}

function calculateDifficultyOptimality(correctRate: number): number {
  // Optimal difficulty: 30-80% correct rate
  // Return score 0-1 where 1 is perfect (50% correct)
  if (correctRate < 0.3) return 1 - (0.3 - correctRate) * 2; // Too hard
  if (correctRate > 0.8) return 1 - (correctRate - 0.8) * 2; // Too easy
  return 1 - Math.abs(correctRate - 0.55) * 2; // Optimal range
}

function averageMetric(
  existing: number | undefined,
  newValue: number | undefined,
  existingCount: number,
): number {
  if (existing === undefined) return newValue ?? 0;
  if (newValue === undefined) return existing;

  // Weighted average
  return (existing * existingCount + newValue) / (existingCount + 1);
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction (in production: use NLP/stemming)
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "should",
    "could", "may", "might", "can", "what", "which", "who", "when", "where",
    "why", "how", "this", "that", "these", "those",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .slice(0, 10); // Top 10 keywords
}
