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
  minPoints: number;
  maxPoints: number;
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
