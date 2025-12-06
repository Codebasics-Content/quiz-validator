/**
 * STEP 2: AUTO-VALIDATOR & SYNTAX FIXER
 *
 * Purpose: Convert relaxed JSON → strict Discord schema
 * Auto-fix: Time limits, option lengths, answer distribution
 * Output: Strict schema + list of fixes applied
 */

import {
  RelaxedQuizData,
  RelaxedQuestion,
  QuizData,
  Question,
  ValidationFix,
  AutoValidationResult,
} from "../types";

/**
 * Main auto-fix function: relaxed format → strict schema
 */
export const autoFixQuizStructure = (
  relaxedQuiz: RelaxedQuizData,
): AutoValidationResult => {
  const fixes: ValidationFix[] = [];
  const warnings: string[] = [];

  // Step 1: Normalize time limits to [20, 25, 30, 35]
  const normalizedQuestions = relaxedQuiz.questions.map((q, idx) => {
    const estimated = q.estimated_seconds || 25;
    const normalized = normalizeTimeToInterval(estimated);

    if (estimated !== normalized) {
      fixes.push({
        type: "auto",
        questionNumber: idx + 1,
        field: "timeLimit",
        before: `${estimated}s`,
        after: `${normalized}s`,
        reason: `Normalized to standard interval`,
      });
    }

    return { ...q, timeLimit: normalized };
  });

  // Step 2: Balance option lengths (pad short options, check variance)
  const balancedQuestions = normalizedQuestions.map((q, idx) => {
    const balanceResult = balanceOptionLengths(q.options);

    if (balanceResult.changed) {
      fixes.push({
        type: "auto",
        questionNumber: idx + 1,
        field: "options",
        before: `variance ${balanceResult.beforeVariance} chars`,
        after: `variance ${balanceResult.afterVariance} chars`,
        reason: `Balanced option lengths for anti-exploit`,
      });
    }

    if (balanceResult.afterVariance > 40) {
      warnings.push(
        `⚠️ Q${idx + 1}: Option length variance still high (${balanceResult.afterVariance} chars) - consider manually editing`,
      );
    }

    return { ...q, options: balanceResult.options };
  });

  // Step 3: Redistribute answer positions if unbalanced
  const redistributionResult = redistributeAnswers(
    balancedQuestions.map((q) => q.correct),
  );

  if (redistributionResult.changed) {
    redistributionResult.swaps.forEach((swap) => {
      fixes.push({
        type: "auto",
        questionNumber: swap.questionNumber,
        field: "correctAnswer",
        before: `position ${swap.from}`,
        after: `position ${swap.to}`,
        reason: `Redistributed for balanced pattern [${redistributionResult.after.join(",")}]`,
      });
    });

    // Apply redistributions
    redistributionResult.swaps.forEach((swap) => {
      const q = balancedQuestions[swap.questionNumber - 1];
      // Swap options to maintain correctness
      const temp = q.options[swap.from - 1];
      q.options[swap.from - 1] = q.options[swap.to - 1];
      q.options[swap.to - 1] = temp;
      q.correct = swap.to;
    });
  }

  // Step 4: Convert to strict Discord bot schema
  const strictQuiz: QuizData = {
    module: relaxedQuiz.module,
    questions: balancedQuestions.map((q, idx) =>
      convertToStrictQuestion(q, idx + 1),
    ),
  };

  return {
    fixed: strictQuiz,
    fixes,
    warnings,
  };
};

/**
 * Normalize time estimate to nearest standard interval [20, 25, 30, 35]
 */
function normalizeTimeToInterval(estimate: number): number {
  const intervals = [20, 25, 30, 35];

  // Find closest interval
  let closest = intervals[0];
  let minDiff = Math.abs(estimate - closest);

  for (const interval of intervals) {
    const diff = Math.abs(estimate - interval);
    if (diff < minDiff) {
      minDiff = diff;
      closest = interval;
    }
  }

  return closest;
}

/**
 * Balance option lengths (pad short options, keep consistent)
 */
function balanceOptionLengths(options: string[]): {
  options: string[];
  changed: boolean;
  beforeVariance: number;
  afterVariance: number;
} {
  const lengths = options.map((opt) => opt.length);
  const beforeVariance = Math.max(...lengths) - Math.min(...lengths);

  // Detect if options contain code - use appropriate balance threshold
  const hasCode = options.some((opt) => /[`{}()\[\]<>]/.test(opt));
  const balanceThreshold = hasCode ? 25 : 15; // Code: ±25, Plain text: ±15

  // If already balanced within threshold, keep as-is
  if (beforeVariance <= balanceThreshold) {
    return {
      options,
      changed: false,
      beforeVariance,
      afterVariance: beforeVariance,
    };
  }

  // Strategy: Pad short options to bring them closer to average
  const avgLength = Math.round(
    lengths.reduce((sum, len) => sum + len, 0) / lengths.length,
  );
  const targetMin = avgLength - 15; // Allow some variance

  const balanced = options.map((opt, idx) => {
    const currentLength = opt.length;

    // If too short, pad with qualifying words
    if (currentLength < targetMin) {
      return padOption(opt);
    }

    return opt;
  });

  const balancedLengths = balanced.map((opt) => opt.length);
  const afterVariance =
    Math.max(...balancedLengths) - Math.min(...balancedLengths);

  return {
    options: balanced,
    changed: true,
    beforeVariance,
    afterVariance,
  };
}

/**
 * Pad short option with qualifying words
 */
function padOption(option: string): string {
  const qualifiers = [
    "typically",
    "generally",
    "usually",
    "commonly",
    "often",
    "primarily",
    "mainly",
    "specifically",
  ];

  // Check if option already starts with qualifier
  const startsWithQualifier = qualifiers.some((q) =>
    option.toLowerCase().startsWith(q),
  );

  if (!startsWithQualifier && option.length < 40) {
    // Capitalize first letter if needed
    const firstWord = option.split(" ")[0];
    if (firstWord && firstWord[0] === firstWord[0].toUpperCase()) {
      // Add qualifier at start
      return `Typically ${option.toLowerCase()}`;
    } else {
      // Add qualifier before verb/noun
      const qualifier =
        qualifiers[Math.floor(Math.random() * qualifiers.length)];
      return `${option} ${qualifier}`;
    }
  }

  return option;
}

/**
 * Redistribute answer positions to achieve [2-3, 2-3, 2-3, 2-3]
 */
function redistributeAnswers(correctAnswers: number[]): {
  changed: boolean;
  before: number[];
  after: number[];
  swaps: Array<{ questionNumber: number; from: number; to: number }>;
} {
  // Count distribution
  const distribution = [0, 0, 0, 0]; // Positions 1, 2, 3, 4
  correctAnswers.forEach((ans) => {
    distribution[ans - 1]++;
  });

  const before = [...distribution];

  // Check if balanced (each position 2-3 times)
  const isBalanced = distribution.every((count) => count >= 2 && count <= 3);

  if (isBalanced) {
    return { changed: false, before, after: before, swaps: [] };
  }

  // Find over-represented and under-represented positions
  const overRep: number[] = [];
  const underRep: number[] = [];

  distribution.forEach((count, idx) => {
    if (count > 3) overRep.push(idx + 1);
    if (count < 2) underRep.push(idx + 1);
  });

  // Generate swaps
  const swaps: Array<{ questionNumber: number; from: number; to: number }> = [];
  const newCorrectAnswers = [...correctAnswers];

  while (overRep.length > 0 && underRep.length > 0) {
    const fromPos = overRep[0];
    const toPos = underRep[0];

    // Find first question with overRep position
    const qIdx = newCorrectAnswers.findIndex((ans) => ans === fromPos);

    if (qIdx !== -1) {
      swaps.push({
        questionNumber: qIdx + 1,
        from: fromPos,
        to: toPos,
      });

      newCorrectAnswers[qIdx] = toPos;
      distribution[fromPos - 1]--;
      distribution[toPos - 1]++;

      // Update over/under lists
      if (distribution[fromPos - 1] <= 3) overRep.shift();
      if (distribution[toPos - 1] >= 2) underRep.shift();
    } else {
      break;
    }
  }

  return {
    changed: true,
    before,
    after: distribution,
    swaps,
  };
}

/**
 * Convert relaxed question to strict Discord bot schema
 */
function convertToStrictQuestion(
  relaxed: RelaxedQuestion & { timeLimit: number },
  questionNumber: number,
): Question {
  return {
    id: `Q${questionNumber}`,
    question: relaxed.question,
    answer1: relaxed.options[0] || "",
    answer2: relaxed.options[1] || "",
    answer3: relaxed.options[2] || "",
    answer4: relaxed.options[3] || "",
    answer5: "",
    answer6: "",
    answer7: "",
    answer8: "",
    answer9: "",
    correctAnswer: relaxed.correct,
    minPoints: 0,
    maxPoints: 0,
    explanation: relaxed.explanation,
    timeLimit: relaxed.timeLimit,
    imageUrl: "",
    bloomLevel: relaxed.cognitive_level,
  };
}

/**
 * Calculate recommended time limit based on question complexity
 * (Legacy function - kept for reference, generator now estimates directly)
 */
export const calculateRecommendedTimeLimit = (question: Question): number => {
  let baseTime = 20; // Start with simple

  // Factor 1: Question length
  const questionLength = question.question.length;
  if (questionLength > 100) baseTime += 5;
  if (questionLength > 150) baseTime += 5;

  // Factor 2: Code presence
  if (
    question.question.includes("`") ||
    question.question.toLowerCase().includes("code") ||
    question.question.toLowerCase().includes("debug")
  ) {
    baseTime += 10;
  }

  // Factor 3: Calculation/math
  if (
    question.question.toLowerCase().includes("calculate") ||
    question.question.toLowerCase().includes("formula")
  ) {
    baseTime += 5;
  }

  // Normalize to standard interval
  return normalizeTimeToInterval(baseTime);
};
