/**
 * Core type definitions for Quiz Prompt System
 */

export interface QuizConfig {
  questionsPerQuiz: number;
  timeLimits: {
    min: number;
    max: number;
    intervals: number[];
  };
  difficultyDistribution: {
    easy: { count: number; timeRange: string };
    medium: { count: number; timeRange: string };
    hard: { count: number; timeRange: string };
    veryHard: { count: number; timeRange: string };
  };
  optionConstraints: {
    minWords: number;
    maxWords: number;
    explanationMinWords: number;
    explanationMaxWords: number;
  };
}

export interface DateContext {
  year: number;
  month: string;
  day: number;
  week: number;
  weekDescriptor: string;
  quarter: string;
  isoDate: string;
  fullDate: string;
  searchDate: string;
}

export interface ModuleTopics {
  topics: string;
  forbidden: string;
  questionTypes: string;
  style?: string;
  difficulty?: string;
}

export interface ErrorCategories {
  structural: string[];
  content: string[];
  pattern: string[];
  hallucination: string[];
  timing: string[];
}
