import { Question, QuizData, ValidationResults } from "./types";

// Complexity metrics for advanced time calculation
interface ComplexityMetrics {
  questionLength: number;
  avgOptionLength: number;
  maxOptionLength: number;
  totalTextLength: number;
  hasCode: boolean;
  codeBlockCount: number;
  hasMath: boolean;
  hasComparison: boolean;
  hasDebugging: boolean;
  complexityKeywordCount: number;
  optionLengthVariance: number;
  sentenceCount: number;
}

// Module difficulty multipliers for time adjustment
const MODULE_TIME_MULTIPLIERS: Record<string, number> = {
  Python: 1.0,
  SQL: 1.05,
  "Math/Stats": 1.1,
  "Machine Learning": 1.05,
  "Deep Learning": 1.1,
  NLP: 1.0,
  "Gen AI": 1.0,
  "General AI": 0.95,
};

export const VALIDATION_RULES = {
  question: { min: 30, max: 200 },
  option: { min: 15, max: 70 },
  optionBalance: 5,
  explanation: { minWords: 12, maxWords: 18 },
  timeLimit: { min: 15, max: 60 },
  requiredFields: [
    "id",
    "question",
    "answer1",
    "answer2",
    "answer3",
    "answer4",
    "answer5",
    "answer6",
    "answer7",
    "answer8",
    "answer9",
    "correctAnswer",
    "minPoints",
    "maxPoints",
    "explanation",
    "timeLimit",
    "imageUrl",
  ],
  hypeWords: [
    "revolutionary",
    "game-changing",
    "ultimate",
    "best ever",
    "groundbreaking",
    "paradigm shift",
    "disruptive",
  ],
  productionModels: {
    claude: [
      "claude-sonnet-4-5",
      "claude-sonnet-4-5-20250929",
      "claude-opus-4-1",
      "claude-opus-4-1-20250805",
      "claude-opus-4",
      "claude-opus-4-20250514",
      "claude-sonnet-4",
      "claude-sonnet-4-20250514",
      "claude-haiku-4-5",
      "claude-haiku-4-5-20251001",
      "claude-3-5-haiku",
      "claude-3-haiku",
    ],
    openai: [
      "gpt-5",
      "gpt-5-2025-08-07",
      "gpt-5-mini",
      "gpt-5-mini-2025-08-07",
      "gpt-5-nano",
      "gpt-5-nano-2025-08-07",
      "gpt-4.1",
      "gpt-4.1-2025-04-14",
      "gpt-4.1-mini",
      "gpt-4.1-mini-2025-04-14",
      "o3",
      "o3-2025-04-16",
      "o3-pro",
      "o4-mini",
      "o4-mini-2025-04-16",
      "gpt-4o",
      "gpt-4o-mini",
    ],
    google: [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash-image",
      "gemini-2.0-flash",
      "gemini-2.0-flash-001",
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash-lite-001",
      "gemini-3-pro-preview",
      "gemini-3-pro",
    ],
    deprecated: [
      "claude-3-5-sonnet",
      "claude-3-opus",
      "claude-3-sonnet",
      "gpt-3.5-turbo",
      "gpt-4.5-preview",
      "o1-preview",
      "o1-mini",
      "o3-mini",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.0-pro",
    ],
  },
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

/**
 * Detects question type based on content patterns
 */
const detectQuestionType = (question: Question): string => {
  const q = (question.question || "").toLowerCase();

  // Fundamental Concept
  if (/what is|definition|example of|true or false|which of these is/.test(q)) {
    return "fundamental";
  }

  // Code Debugging
  if (
    (q.includes("`") || q.includes("error") || q.includes("bug")) &&
    /debug|fix|wrong|incorrect|issue/.test(q)
  ) {
    return "code-debug";
  }

  // Problem Solving / Calculations
  if (
    /calculate|compute|how many|result|output|what will be/.test(q) ||
    /\d+[×\*\/\+\-]\d+/.test(q)
  ) {
    return "problem-solving";
  }

  // Comparative Analysis
  if (
    /compare|difference|advantage|disadvantage|vs|versus|trade-off|better/.test(
      q,
    )
  ) {
    return "comparative";
  }

  // Edge Cases / Consequences
  if (/edge case|consequence|what happens if|problem with|issue with/.test(q)) {
    return "edge-case";
  }

  // Situational/Scenario (default for best practice, when to use, etc.)
  if (
    /scenario|best practice|when to|should you|recommended|approach/.test(q)
  ) {
    return "situational";
  }

  return "general";
};

/**
 * Analyzes content complexity with multiple metrics
 */
const analyzeContentComplexity = (question: Question): ComplexityMetrics => {
  const q = question.question || "";
  const options = [
    question.answer1 || "",
    question.answer2 || "",
    question.answer3 || "",
    question.answer4 || "",
  ];

  // Character analysis
  const questionLength = q.length;
  const optionLengths = options.map((opt) => opt.length);
  const avgOptionLength = optionLengths.reduce((sum, len) => sum + len, 0) / 4;
  const maxOptionLength = Math.max(...optionLengths);
  const totalTextLength =
    questionLength + optionLengths.reduce((sum, len) => sum + len, 0);

  // Code detection
  const codeMatches = (q + options.join("")).match(/`/g);
  const codeBlockCount = codeMatches ? Math.floor(codeMatches.length / 2) : 0;
  const hasCode = codeBlockCount > 0;

  // Pattern detection
  const hasMath =
    /\d+[×\*\/\+\-]\d+|\d+\s*(tokens?|chars?|%|GB|MB|KB|ms|seconds?)/.test(q);
  const hasComparison =
    /compare|vs|versus|difference|advantage|disadvantage/.test(q.toLowerCase());
  const hasDebugging =
    /error|bug|debug|fix|wrong|incorrect|issue|exception|stack trace/.test(
      q.toLowerCase(),
    );

  // Complexity keywords
  const complexityKeywords = [
    "calculate",
    "compute",
    "debug",
    "compare",
    "analyze",
    "evaluate",
    "implement",
    "design",
    "which of the following",
    "best practice",
    "trade-off",
  ];
  const complexityKeywordCount = complexityKeywords.filter((keyword) =>
    q.toLowerCase().includes(keyword),
  ).length;

  // Option variance
  const meanLength = avgOptionLength;
  const variance =
    optionLengths.reduce((sum, len) => sum + Math.pow(len - meanLength, 2), 0) /
    4;
  const optionLengthVariance = Math.sqrt(variance);

  // Sentence count (complexity indicator)
  const sentenceCount = (q.match(/[.!?]+/g) || []).length || 1;

  return {
    questionLength,
    avgOptionLength,
    maxOptionLength,
    totalTextLength,
    hasCode,
    codeBlockCount,
    hasMath,
    hasComparison,
    hasDebugging,
    complexityKeywordCount,
    optionLengthVariance,
    sentenceCount,
  };
};

/**
 * Applies module-specific time multiplier
 */
const calculateModuleAdjustedTime = (
  baseTime: number,
  module: string,
): number => {
  const multiplier = MODULE_TIME_MULTIPLIERS[module] || 1.0;
  return Math.round(baseTime * multiplier);
};

/**
 * Normalizes time to standard intervals [20, 25, 30, 35]
 */
const normalizeTimeToInterval = (
  rawTime: number,
  complexity: ComplexityMetrics,
  questionType: string,
): number => {
  const intervals = [20, 25, 30, 35];

  // Apply boosters based on complexity
  let adjustedTime = rawTime;

  // Code presence requires minimum 25s
  if (complexity.hasCode && adjustedTime < 25) {
    adjustedTime = 25;
  }

  // Debugging requires minimum 30s
  if (complexity.hasDebugging && adjustedTime < 30) {
    adjustedTime = 30;
  }

  // Math/calculations require minimum 25s
  if (complexity.hasMath && adjustedTime < 25) {
    adjustedTime = 25;
  }

  // Long complex questions boost up
  if (complexity.questionLength > 150 && complexity.avgOptionLength > 50) {
    adjustedTime += 5;
  }

  // Find nearest interval
  const nearest = intervals.reduce((prev, curr) => {
    return Math.abs(curr - adjustedTime) < Math.abs(prev - adjustedTime)
      ? curr
      : prev;
  });

  return nearest;
};

export const calculateRecommendedTimeLimit = (
  question: Question,
  module?: string,
): number => {
  // Step 1: Analyze content complexity
  const complexity = analyzeContentComplexity(question);

  // Step 2: Detect question type
  const questionType = detectQuestionType(question);

  // Step 3: Calculate base score using original algorithm
  let timeScore = 20;

  timeScore += Math.min(5, Math.floor(complexity.questionLength / 50));
  timeScore += Math.min(4, Math.floor(complexity.avgOptionLength / 30));

  if (complexity.hasCode) timeScore += 3;
  if (complexity.hasMath) timeScore += 2;
  if (complexity.complexityKeywordCount > 0) timeScore += 2;
  if (complexity.maxOptionLength > 60) timeScore += 2;

  // Step 4: Normalize to round interval [20, 25, 30, 35]
  let normalized = normalizeTimeToInterval(timeScore, complexity, questionType);

  // Step 5: Apply module adjustment if provided
  if (module) {
    normalized = calculateModuleAdjustedTime(normalized, module);
    // Re-normalize after module adjustment to ensure round interval
    const tempComplexity = { ...complexity };
    normalized = normalizeTimeToInterval(
      normalized,
      tempComplexity,
      questionType,
    );
  }

  // Step 6: Final clamp to valid range
  return Math.min(Math.max(normalized, 20), 35);
};

export const validateQuizJSON = (
  jsonInput: string,
  moduleName: string,
): ValidationResults => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let data: QuizData | null = null;

  try {
    data = JSON.parse(jsonInput);
  } catch (e) {
    errors.push(
      "❌ Invalid JSON format. Check for missing commas, brackets, or quotes.",
    );
    return { valid: false, errors, warnings, data: null };
  }

  if (!data || typeof data !== "object") {
    errors.push(
      "❌ JSON must be an object with 'module' and 'questions' fields",
    );
    return { valid: false, errors, warnings, data: null };
  }

  if (!data.module || data.module !== moduleName) {
    errors.push(
      `❌ Module field must be "${moduleName}" (found: "${data.module || "missing"}")`,
    );
  }

  if (!Array.isArray(data.questions)) {
    errors.push("❌ 'questions' must be an array");
    return { valid: false, errors, warnings, data: null };
  }

  if (data.questions.length !== 10) {
    errors.push(
      `❌ Must have exactly 10 questions (found: ${data.questions.length})`,
    );
  }

  const correctAnswerPositions: number[] = [];
  const questionIds = new Set<string>();

  data.questions.forEach((q: Question, idx: number) => {
    const qNum = idx + 1;

    if (!q.id) {
      errors.push(`❌ Q${qNum}: Missing 'id' field`);
    } else {
      if (questionIds.has(q.id)) {
        errors.push(`❌ Q${qNum}: Duplicate ID "${q.id}"`);
      }
      questionIds.add(q.id);
      if (q.id !== `Q${qNum}`) {
        warnings.push(
          `⚠️ Q${qNum}: ID should be "Q${qNum}" (found: "${q.id}")`,
        );
      }
    }

    VALIDATION_RULES.requiredFields.forEach((field) => {
      if (!(field in q)) {
        errors.push(`❌ Q${qNum}: Missing required field "${field}"`);
      }
    });

    const qText = q.question || "";
    if (qText.length < VALIDATION_RULES.question.min) {
      errors.push(
        `❌ Q${qNum}: Question too short (${qText.length} chars, min ${VALIDATION_RULES.question.min})`,
      );
    }
    if (qText.length > VALIDATION_RULES.question.max) {
      errors.push(
        `❌ Q${qNum}: Question too long (${qText.length} chars, max ${VALIDATION_RULES.question.max})`,
      );
    }

    const options = [q.answer1, q.answer2, q.answer3, q.answer4].filter(
      (ans) => ans && ans.trim() !== "",
    );

    if (options.length < 4) {
      errors.push(
        `❌ Q${qNum}: Must have exactly 4 non-empty options (found ${options.length})`,
      );
    }

    options.forEach((opt, optIdx) => {
      const optNum = optIdx + 1;
      if (opt.length < VALIDATION_RULES.option.min) {
        errors.push(
          `❌ Q${qNum} Option ${optNum}: Too short (${opt.length} chars, min ${VALIDATION_RULES.option.min})`,
        );
      }
      if (opt.length > VALIDATION_RULES.option.max) {
        warnings.push(
          `⚠️ Q${qNum} Option ${optNum}: Too long (${opt.length} chars, max ${VALIDATION_RULES.option.max})`,
        );
      }
    });

    if (options.length === 4) {
      const lengths = options.map((opt) => opt.length);
      const minLen = Math.min(...lengths);
      const maxLen = Math.max(...lengths);
      const diff = maxLen - minLen;

      if (diff > VALIDATION_RULES.optionBalance) {
        errors.push(
          `❌ Q${qNum}: Options not balanced (${minLen}-${maxLen} chars, diff ${diff} > ${VALIDATION_RULES.optionBalance})`,
        );
      }

      const correctIdx = q.correctAnswer - 1;
      if (correctIdx >= 0 && correctIdx < lengths.length) {
        const correctLen = lengths[correctIdx];
        const longestLen = Math.max(...lengths);
        if (
          correctLen === longestLen &&
          lengths.filter((l) => l === longestLen).length === 1
        ) {
          warnings.push(
            `⚠️ Q${qNum}: Correct answer is the longest option - students may exploit this pattern`,
          );
        }
      }
    }

    if (q.correctAnswer < 1 || q.correctAnswer > 4) {
      errors.push(
        `❌ Q${qNum}: correctAnswer must be 1-4 (found: ${q.correctAnswer})`,
      );
    } else {
      correctAnswerPositions.push(q.correctAnswer);
    }

    const explanation = q.explanation || "";
    const explWords = countWords(explanation);
    if (explWords < VALIDATION_RULES.explanation.minWords) {
      warnings.push(
        `⚠️ Q${qNum}: Explanation too brief (${explWords} words, min ${VALIDATION_RULES.explanation.minWords})`,
      );
    }
    if (explWords > VALIDATION_RULES.explanation.maxWords) {
      warnings.push(
        `⚠️ Q${qNum}: Explanation too long (${explWords} words, max ${VALIDATION_RULES.explanation.maxWords})`,
      );
    }

    if (
      q.timeLimit < VALIDATION_RULES.timeLimit.min ||
      q.timeLimit > VALIDATION_RULES.timeLimit.max
    ) {
      errors.push(
        `❌ Q${qNum}: Invalid timeLimit (${q.timeLimit}s, must be ${VALIDATION_RULES.timeLimit.min}-${VALIDATION_RULES.timeLimit.max}s)`,
      );
    }

    const recommended = calculateRecommendedTimeLimit(q, moduleName);

    // More lenient tolerance for round intervals [20, 25, 30, 35]
    const isRoundInterval = [20, 25, 30, 35].includes(q.timeLimit);
    const tolerance = isRoundInterval ? 7 : 5;

    if (Math.abs(q.timeLimit - recommended) > tolerance) {
      warnings.push(
        `⚠️ Q${qNum}: Time limit ${q.timeLimit}s seems off (recommended: ${recommended}s based on complexity)`,
      );
    }

    // Skip minPoints/maxPoints warning - bot auto-calculates these
    // These fields are intentionally left empty ("") in the JSON schema
  });

  const distribution = [1, 2, 3, 4].map(
    (pos) => correctAnswerPositions.filter((p) => p === pos).length,
  );
  const hasUnused = distribution.some((count) => count === 0);
  const hasOverused = distribution.some((count) => count > 4);

  if (hasUnused) {
    const unused = distribution
      .map((c, i) => (c === 0 ? i + 1 : null))
      .filter(Boolean);
    warnings.push(
      `⚠️ Pattern exploit: Position(s) ${unused.join(", ")} never used - students can eliminate these`,
    );
  }

  if (hasOverused) {
    const overused = distribution
      .map((c, i) => (c > 4 ? `${i + 1} (${c}×)` : null))
      .filter(Boolean);
    warnings.push(
      `⚠️ Pattern exploit: Position(s) ${overused.join(", ")} overused - students can favor these`,
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // ANTI-HALLUCINATION VALIDATION (Layer 4 - Nov 20, 2025)
  // Only run if no structural errors (Layer 1-3 passed)
  // ═══════════════════════════════════════════════════════════════════
  if (data && errors.length === 0) {
    warnings.push(...validateModelReferences(data));
    warnings.push(...validateHypeWords(data));
    warnings.push(...validateCodeSyntax(data));
  }

  const isValid = errors.length === 0;

  return {
    valid: isValid,
    errors,
    warnings,
    data: isValid ? data : null,
  };
};

/**
 * Fisher-Yates shuffle algorithm - provably unbiased randomization
 * Eliminates position bias that occurs with Array.sort(random)
 */
const fisherYatesShuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const shuffleOptions = (question: Question): Question => {
  const options = [
    question.answer1,
    question.answer2,
    question.answer3,
    question.answer4,
  ];

  const correctAnswer = question.correctAnswer - 1;
  const correctText = options[correctAnswer];

  // Use Fisher-Yates for true randomization (eliminates position bias)
  const shuffled = fisherYatesShuffle(options);
  const newCorrectAnswer = shuffled.indexOf(correctText) + 1;

  return {
    ...question,
    answer1: shuffled[0],
    answer2: shuffled[1],
    answer3: shuffled[2],
    answer4: shuffled[3],
    correctAnswer: newCorrectAnswer,
  };
};

export const generateTableData = (quiz: QuizData): string[][] => {
  return quiz.questions.map((q) => [
    q.question,
    q.answer1,
    q.answer2,
    q.answer3,
    q.answer4,
    q.answer5,
    q.answer6,
    q.answer7,
    q.answer8,
    q.answer9,
    String(q.correctAnswer),
    String(q.minPoints),
    String(q.maxPoints),
    q.explanation,
    String(q.timeLimit),
    q.imageUrl,
    // Module column removed - not in Excel template
  ]);
};

export const copyTableToClipboard = async (
  quiz: QuizData,
): Promise<boolean> => {
  const tableData = generateTableData(quiz);
  const tsvContent = tableData.map((row) => row.join("\t")).join("\n");

  try {
    await navigator.clipboard.writeText(tsvContent);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

export const calculateCorrectAnswerDistribution = (quiz: QuizData) => {
  const pattern = quiz.questions.map((q) => q.correctAnswer);
  const counts = [1, 2, 3, 4].map(
    (pos) => pattern.filter((p) => p === pos).length,
  );
  const labels = ["A", "B", "C", "D"];

  return { pattern, counts, labels };
};

/**
 * Checks if answer distribution is unbalanced (shuffle recommended)
 * Returns true if any position >4 or <1 (creates exploitable patterns)
 */
export const isDistributionUnbalanced = (quiz: QuizData): boolean => {
  const { counts } = calculateCorrectAnswerDistribution(quiz);
  return counts.some((c) => c > 4 || c < 1);
};

// ═══════════════════════════════════════════════════════════════════
// ANTI-HALLUCINATION VALIDATION FUNCTIONS (November 20, 2025)
// ═══════════════════════════════════════════════════════════════════

/**
 * Validates AI model references against known production models
 * Detects hallucinated or deprecated models (as of Nov 2025)
 */
export const validateModelReferences = (quiz: QuizData): string[] => {
  const warnings: string[] = [];
  const validModels = [
    ...VALIDATION_RULES.productionModels.claude,
    ...VALIDATION_RULES.productionModels.openai,
    ...VALIDATION_RULES.productionModels.google,
  ];
  const deprecatedModels = VALIDATION_RULES.productionModels.deprecated;

  quiz.questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const content = `${q.question} ${q.answer1} ${q.answer2} ${q.answer3} ${q.answer4} ${q.explanation}`;

    // Regex for AI model patterns: gpt-4, claude-3, gemini-2.5, o3, etc.
    const modelMatches =
      content.match(/(?:gpt|claude|gemini|o\d+)[-\s]?[\d.]+(?:[-\s]?\w+)?/gi) ||
      [];

    modelMatches.forEach((match) => {
      const normalized = match.toLowerCase().replace(/\s+/g, "-");

      // Check if valid production model
      const isValid = validModels.some(
        (m) =>
          m.toLowerCase().includes(normalized) ||
          normalized.includes(m.toLowerCase()),
      );
      const isDeprecated = deprecatedModels.some(
        (m) =>
          m.toLowerCase().includes(normalized) ||
          normalized.includes(m.toLowerCase()),
      );

      if (!isValid && !isDeprecated) {
        warnings.push(
          `⚠️ Q${qNum}: Potentially hallucinated model "${match}" - verify this exists as of Nov 2025`,
        );
      } else if (isDeprecated) {
        warnings.push(
          `⚠️ Q${qNum}: Deprecated model "${match}" - students shouldn't learn outdated tech`,
        );
      }
    });
  });

  return warnings;
};

/**
 * Detects marketing hype words that mislead students
 * Enforces factual, grounded language
 */
export const validateHypeWords = (quiz: QuizData): string[] => {
  const warnings: string[] = [];

  quiz.questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const content = `${q.question} ${q.explanation}`.toLowerCase();

    VALIDATION_RULES.hypeWords.forEach((word) => {
      if (content.includes(word.toLowerCase())) {
        warnings.push(
          `⚠️ Q${qNum}: Marketing buzzword "${word}" detected - use factual language instead`,
        );
      }
    });
  });

  return warnings;
};

/**
 * Helper: Check if brackets are balanced in code
 */
function areBracketsBalanced(brackets: string[]): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

  for (const b of brackets) {
    if (["(", "[", "{"].includes(b)) {
      stack.push(b);
    } else if (stack.pop() !== pairs[b]) {
      return false;
    }
  }

  return stack.length === 0;
}

/**
 * Validates code syntax in backtick-wrapped snippets
 * Checks for common syntax errors (unmatched brackets, typos)
 */
export const validateCodeSyntax = (quiz: QuizData): string[] => {
  const warnings: string[] = [];

  quiz.questions.forEach((q, idx) => {
    const qNum = idx + 1;

    // Extract code blocks (backtick-wrapped)
    const allText = [
      q.question,
      q.answer1,
      q.answer2,
      q.answer3,
      q.answer4,
    ].join(" ");
    const codeBlocks = allText.match(/`([^`]+)`/g) || [];

    codeBlocks.forEach((code) => {
      const cleaned = code.replace(/`/g, "");
      const issues: string[] = [];

      // Check for unmatched brackets
      const brackets = cleaned.match(/[\[\](){}]/g) || [];
      if (brackets.length > 0 && !areBracketsBalanced(brackets)) {
        issues.push("unmatched brackets");
      }

      // Check for obvious syntax errors
      if (/\(\s*\)/.test(cleaned) && cleaned.length > 5)
        issues.push("empty parentheses");
      if (/=\s*=(?!=)/.test(cleaned))
        issues.push("possible typo: = instead of ==");

      // Check for common Python/SQL errors
      if (/\bpirnt\b/.test(cleaned))
        issues.push('typo: "pirnt" (should be "print")');
      if (/\bselct\b/i.test(cleaned))
        issues.push('typo: "selct" (should be "select")');

      if (issues.length > 0) {
        const truncated =
          cleaned.length > 40 ? cleaned.substring(0, 40) + "..." : cleaned;
        warnings.push(
          `⚠️ Q${qNum}: Code syntax issues: ${issues.join(", ")} in \`${truncated}\``,
        );
      }
    });
  });

  return warnings;
};
