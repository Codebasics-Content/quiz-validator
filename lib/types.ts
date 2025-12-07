export interface Question {
  id: string;
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answer5: string;
  answer6: string;
  answer7: string;
  answer8: string;
  answer9: string;
  correctAnswer: number;
  minPoints: string;
  maxPoints: string;
  explanation: string;
  timeLimit: number;
  imageUrl: string;
  imageAltText?: string; // Accessibility: alt text for images (WCAG 2.1)
  bloomLevel?: string; // Cognitive level: remember, understand, apply, analyze, evaluate, create
  [key: string]: any;
}

export interface QuizData {
  module: string;
  questions: Question[];
}

export interface ValidationResults {
  valid: boolean;
  errors: string[];
  warnings: string[];
  data: QuizData | null;
}

export interface ModuleOption {
  value: string;
  label: string;
  icon: string;
  category: string;
}

// ============================================================================
// TSV PARSING TYPES (November 22, 2025)
// Support for Excel paste import functionality
// ============================================================================

export interface ParsedTSVQuestion {
  id: string;
  question: string;
  options: string[]; // [answer1, answer2, answer3, answer4]
  correctAnswer: number; // 1-4
  explanation: string;
  timeLimit: number;
  minPoints: string; // Empty string "" - Discord bot auto-calculates
  maxPoints: string; // Empty string "" - Discord bot auto-calculates
  imageUrl: string;
}

export interface TSVParseResult {
  success: boolean;
  questions: ParsedTSVQuestion[];
  errors: string[];
}

// ============================================================================
// MULTI-STEP ARCHITECTURE TYPES (Phase 1 Implementation)
// ============================================================================

// Relaxed format from LLM content generator (Step 1)
export interface RelaxedQuizData {
  module: string;
  questions: RelaxedQuestion[];
}

export interface RelaxedQuestion {
  question: string;
  options: string[]; // Array of 4 options (simpler than answer1-9)
  correct: number; // 1-4 (which option is correct)
  explanation: string;
  cognitive_level?: string; // remember/understand/apply/analyze/evaluate/create
  estimated_seconds?: number; // Rough estimate (validator will normalize)
}

// Auto-fix tracking (Step 2)
export interface ValidationFix {
  type: "auto" | "suggestion";
  questionNumber: number;
  field: string;
  before: any;
  after: any;
  reason: string;
}

export interface AutoValidationResult {
  fixed: QuizData; // Converted to strict schema
  fixes: ValidationFix[]; // List of auto-fixes applied
  warnings: string[]; // Issues that couldn't be auto-fixed
}

// Historical quiz data (Step 4)
export interface QuizHistory {
  quizId: string;
  module: string;
  createdAt: string;
  createdBy: string;
  questions: QuestionWithMetrics[];
  approvedBy?: string;
  approvedAt?: string;
}

export interface QuestionWithMetrics extends Question {
  metrics?: QuestionMetrics;
  tags?: string[]; // ["scenario-based", "debugging", "high-quality"]
  reviewNotes?: string;
}

export interface QuestionMetrics {
  timesAsked: number;
  avgCompletionTime: number; // In seconds
  correctRate: number; // 0.0 - 1.0
  skipRate: number; // 0.0 - 1.0
  avgStudentRating: number; // 1-5 stars
  studentFeedback: string[];
}
