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
  // Discord quiz reality: GIF spam chaos, mobile users, time pressure
  // Limits optimized for: readable at a glance, no scrolling, fast comprehension
  question: {
    min: 20,
    max: 400, // Standard questions - one-screen readable on mobile amid GIF spam
    statementBased: { max: 450 }, // Compact statement format (MAX 2 short statements)
    // Note: Discord allows 4096 but quiz UX needs instant readability
  },
  option: {
    plainText: { min: 3, max: 60 }, // Must fit one line on mobile
    code: { min: 3, max: 80 }, // Code slightly longer but still single-line
  },
  optionBalance: {
    plainText: 25, // Max variance for plain text (flexible)
    code: 30, // Max variance for code options
  },
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
  // Pattern-based model validation (replaces hardcoded lists)
  // Matches model family patterns rather than specific versions
  modelPatterns: {
    claude: /^claude-(?:sonnet|opus|haiku)-?[\d.-]*$/i,
    openai: /^(?:gpt-[\d.]+|o[1-4](?:-\w+)?)(?:-[\w-]+)?$/i,
    google: /^gemini-[\d.]+-?(?:pro|flash|lite)?(?:-\w+)?$/i,
  },
  // Known deprecated model patterns (warn users)
  deprecatedPatterns: [
    /^claude-3-(?!5)/i, // claude-3-* but not claude-3-5-*
    /^gpt-3\.5/i, // gpt-3.5-*
    /^gpt-4\.5/i, // gpt-4.5-* (preview)
    /^o1-/i, // o1-* models
    /^gemini-1\.[05]/i, // gemini-1.0-* and gemini-1.5-*
  ],
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
  // ═══════════════════════════════════════════════════════════════════════════
  // PSYCHOLOGICALLY-INFORMED TIME CALCULATION (Dec 2025 Rewrite)
  // Formula: GIF Overhead + Reading Time + Thinking Time
  // ═══════════════════════════════════════════════════════════════════════════

  const qText = question.question || "";
  const chars = qText.length;
  const options = [
    question.answer1 || "",
    question.answer2 || "",
    question.answer3 || "",
    question.answer4 || "",
  ];
  const totalOptionChars = options.reduce((sum, opt) => sum + opt.length, 0);
  const totalChars = chars + totalOptionChars;

  // ─────────────────────────────────────────────────────────────────────────
  // 1. GIF CHAOS OVERHEAD (constant) - time to find question amid spam
  // ─────────────────────────────────────────────────────────────────────────
  const overheadSeconds = 5;

  // ─────────────────────────────────────────────────────────────────────────
  // 2. READING TIME - direct scaling with character count
  // ~35-40 chars/second for fast scanning under time pressure
  // ─────────────────────────────────────────────────────────────────────────
  const readingSeconds = Math.ceil(totalChars / 38);

  // ─────────────────────────────────────────────────────────────────────────
  // 3. COMPLEXITY SCORE - determines thinking time
  // ─────────────────────────────────────────────────────────────────────────
  let complexityScore = 0;

  // Length contributes to complexity (0-10 points based on question length)
  complexityScore += Math.floor(chars / 50);

  // Content complexity indicators
  const hasCode = /[`{}()\[\]]/.test(qText);
  const hasDebugging =
    /debug|error|fix|bug|issue|exception|wrong|incorrect/i.test(qText);
  const hasMath = /\d+[×\*\/\+\-]\d+|\d+\s*(tokens?|%|GB|MB|parameters?)/i.test(
    qText,
  );
  const hasComparison =
    /compare|vs\.?|versus|difference|advantage|disadvantage|trade-?off/i.test(
      qText,
    );
  const isStatementBased =
    /consider the following|how many.*statements?|which.*statements?|assertion.*reason|statement.*(i|1|one)/i.test(
      qText,
    );
  const isNegativeFormat =
    /which.*(not|incorrect|false|invalid)|not.*correct|cannot|never/i.test(
      qText,
    );
  const hasAnalysis =
    /analyze|evaluate|assess|why does|what causes|consequence/i.test(qText);

  if (hasCode) complexityScore += 3;
  if (hasDebugging) complexityScore += 4;
  if (hasMath) complexityScore += 2;
  if (hasComparison) complexityScore += 3;
  if (isStatementBased) complexityScore += 5;
  if (isNegativeFormat) complexityScore += 2;
  if (hasAnalysis) complexityScore += 2;

  // ─────────────────────────────────────────────────────────────────────────
  // 4. THINKING TIME - based on inferred difficulty from complexity score
  // ─────────────────────────────────────────────────────────────────────────
  let thinkingSeconds: number;
  let inferredDifficulty: string;

  if (complexityScore <= 4) {
    thinkingSeconds = 7; // EASY - quick recall
    inferredDifficulty = "easy";
  } else if (complexityScore <= 8) {
    thinkingSeconds = 11; // MEDIUM - some reasoning
    inferredDifficulty = "medium";
  } else if (complexityScore <= 13) {
    thinkingSeconds = 16; // HARD - connect concepts
    inferredDifficulty = "hard";
  } else {
    thinkingSeconds = 22; // VERY HARD - complex analysis
    inferredDifficulty = "veryHard";
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. TOTAL RAW TIME
  // ─────────────────────────────────────────────────────────────────────────
  let rawTime = overheadSeconds + readingSeconds + thinkingSeconds;

  // ─────────────────────────────────────────────────────────────────────────
  // 6. STATEMENT-BASED MINIMUM (always needs full reading + reasoning time)
  // ─────────────────────────────────────────────────────────────────────────
  if (isStatementBased && rawTime < 30) {
    rawTime = 30;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. MODULE ADJUSTMENT (some modules are inherently harder)
  // ─────────────────────────────────────────────────────────────────────────
  if (module) {
    const multiplier = MODULE_TIME_MULTIPLIERS[module] || 1.0;
    rawTime = Math.round(rawTime * multiplier);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. NORMALIZE TO INTERVALS [20, 25, 30, 35] - round UP to next interval
  // ─────────────────────────────────────────────────────────────────────────
  const intervals = [20, 25, 30, 35];
  const finalTime = intervals.find((interval) => interval >= rawTime) || 35;

  return finalTime;
};

// ============================================================================
// ENHANCED VALIDATION FUNCTIONS (Added Nov 2025 - Phase 1 Improvements)
// ============================================================================

/**
 * Sanitize JSON by removing newlines/whitespace from inside strings (keys AND values)
 * This fixes word-wrapped JSON from copy-paste where field names get broken like "explanat\nion" → "explanat ion"
 *
 * KEY FIX (Dec 2025): Remove newlines entirely inside strings, don't replace with spaces.
 * This fixes field names like "m axPoints" becoming valid "maxPoints" again.
 */
const sanitizeJSONString = (jsonStr: string): string => {
  let result = "";
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      // Inside a string (key or value): REMOVE newlines/carriage returns entirely
      // This fixes word-wrapped keys like "explanat\nion" → "explanation" (not "explanat ion")
      if (char === "\n" || char === "\r") {
        // Skip newlines entirely - they're word-wrap artifacts, not content
        continue;
      }
      // Keep tabs as single space (rare but possible in values)
      if (char === "\t") {
        if (result.length > 0 && result[result.length - 1] !== " ") {
          result += " ";
        }
        continue;
      }
      result += char;
    } else {
      // Outside strings: skip all whitespace characters
      if (char === "\n" || char === "\r" || char === "\t") {
        continue;
      }
      result += char;
    }
  }

  return result;
};

// Extract JSON from LLM output (handles markdown fences, preambles, word-wrapping)
export const extractJSONFromLLMOutput = (rawOutput: string): string => {
  // Strategy 1: Try parsing as-is
  try {
    JSON.parse(rawOutput);
    return rawOutput; // Already valid JSON
  } catch {}

  // Strategy 2: Try sanitizing first (removes newlines from strings)
  try {
    const sanitized = sanitizeJSONString(rawOutput);
    JSON.parse(sanitized);
    return sanitized;
  } catch {}

  // Strategy 3: Extract from markdown json code fences
  const markdownMatch = rawOutput.match(/```json\s*\n?([\s\S]*?)\n?```/);
  if (markdownMatch) {
    try {
      const sanitized = sanitizeJSONString(markdownMatch[1]);
      JSON.parse(sanitized);
      return sanitized;
    } catch {}
  }

  // Strategy 4: Extract from generic code fences
  const codeMatch = rawOutput.match(/```\s*\n?([\s\S]*?)\n?```/);
  if (codeMatch) {
    try {
      const sanitized = sanitizeJSONString(codeMatch[1]);
      JSON.parse(sanitized);
      return sanitized;
    } catch {}
  }

  // Strategy 5: Find first { to last } and sanitize
  const firstBrace = rawOutput.indexOf("{");
  const lastBrace = rawOutput.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const extracted = rawOutput.substring(firstBrace, lastBrace + 1);
    try {
      const sanitized = sanitizeJSONString(extracted);
      JSON.parse(sanitized);
      return sanitized;
    } catch {}
  }

  // Strategy 6: Last resort - return sanitized version even if it doesn't parse
  // This helps the syntax fix prompt show cleaner JSON
  return sanitizeJSONString(rawOutput);
};

// Bloom's Taxonomy keyword-based classification
const BLOOM_KEYWORDS = {
  remember: [
    "define",
    "list",
    "name",
    "identify",
    "what is",
    "who",
    "when",
    "where",
    "recall",
    "state",
  ],
  understand: [
    "explain",
    "describe",
    "summarize",
    "interpret",
    "compare",
    "contrast",
    "classify",
    "discuss",
  ],
  apply: [
    "calculate",
    "implement",
    "use",
    "demonstrate",
    "apply",
    "solve",
    "show",
    "execute",
  ],
  analyze: [
    "analyze",
    "debug",
    "diagnose",
    "investigate",
    "examine",
    "why",
    "distinguish",
    "differentiate",
  ],
  evaluate: [
    "evaluate",
    "assess",
    "justify",
    "critique",
    "which is best",
    "recommend",
    "judge",
    "prioritize",
  ],
  create: [
    "design",
    "construct",
    "develop",
    "create",
    "formulate",
    "propose",
    "generate",
    "build",
  ],
};

export const classifyBloomLevel = (question: Question): string => {
  const q = question.question.toLowerCase();

  for (const [level, keywords] of Object.entries(BLOOM_KEYWORDS)) {
    if (keywords.some((keyword) => q.includes(keyword))) {
      return level;
    }
  }

  return "understand"; // Default to mid-level
};

// Validate Bloom's Taxonomy distribution across quiz
export const validateBloomDistribution = (questions: Question[]): string[] => {
  const warnings: string[] = [];
  const distribution: Record<string, number> = {
    remember: 0,
    understand: 0,
    apply: 0,
    analyze: 0,
    evaluate: 0,
    create: 0,
  };

  questions.forEach((q) => {
    const level = q.bloomLevel || classifyBloomLevel(q);
    distribution[level]++;
  });

  // Check if too many low-level questions (rote memorization)
  if (distribution.remember > 3) {
    warnings.push(
      `⚠️ Too many low-level questions (${distribution.remember} Remember-level) - add higher-order thinking`,
    );
  }

  // Check if missing higher levels (critical thinking)
  if (distribution.analyze === 0 && distribution.evaluate === 0) {
    warnings.push(
      "⚠️ No higher-order thinking questions (Analyze/Evaluate) - add critical thinking questions",
    );
  }

  // Check if only one cognitive level (no diversity)
  const nonZeroLevels = Object.values(distribution).filter(
    (count) => count > 0,
  ).length;
  if (nonZeroLevels <= 2) {
    warnings.push(
      "⚠️ Limited cognitive diversity - vary question difficulty levels",
    );
  }

  return warnings;
};

// Validate accessibility (WCAG 2.1 Level AA compliance)
export const validateAccessibility = (
  question: Question,
  qNum: number,
): string[] => {
  const warnings: string[] = [];

  // Rule: Code should be text, not image (for better accessibility)
  if (
    question.imageUrl &&
    question.imageUrl.trim() !== "" &&
    (question.imageUrl.toLowerCase().includes("code") ||
      question.question.toLowerCase().includes("this code") ||
      question.question.toLowerCase().includes("debug this"))
  ) {
    warnings.push(
      `⚠️ Q${qNum}: Code should be text with backticks, not image (better for accessibility)`,
    );
  }

  return warnings;
};

// Validate semantic question quality
export const validateSemanticQuality = (
  question: Question,
  qNum: number,
): string[] => {
  const warnings: string[] = [];

  // Check 1: Question should be specific, not vague (ENHANCED)
  const vaguePatterns = [
    // Original patterns
    /what('s| is) (better|best|good)\b/i,
    /which (one|option)\??$/i,
    /^(how|why)\??$/i,

    // NEW: Generic "What is X?" with no context
    /^what is \w+\??$/i,

    // NEW: "How does X work?" without specific feature
    /^how (do|does) \w+ work\??$/i,

    // NEW: "Explain X?" without specific aspect
    /^explain \w+\??$/i,

    // NEW: "Describe X?" without specific details
    /^describe (the )?\w+\??$/i,

    // NEW: Open-ended advantages/disadvantages without context
    /what (are|is) the (advantages?|disadvantages?|benefits?|drawbacks?)\b/i,
  ];

  const q = question.question.trim();
  vaguePatterns.forEach((pattern) => {
    if (pattern.test(q)) {
      warnings.push(
        `⚠️ Q${qNum}: Question may be too vague - add specific context, tool names, or scenarios`,
      );
    }
  });

  // NEW Check: Question should mention specific tools/syntax
  const hasSpecifics = /[@`\(\)\[\]{}]|[A-Z][a-z]+[A-Z]/.test(q); // backticks, symbols, camelCase
  const wordCount = q.split(/\s+/).length;

  if (wordCount < 8 && !hasSpecifics) {
    warnings.push(
      `⚠️ Q${qNum}: Question seems too simple/generic (${wordCount} words) - add specific tool names, syntax, or scenarios`,
    );
  }

  // Check 2: Options should not be nonsense (plausibility check)
  const options = [
    question.answer1,
    question.answer2,
    question.answer3,
    question.answer4,
  ];
  const hasNonsense = options.some((opt) => {
    const words = opt.split(/\s+/);
    // Single word AND very short = likely nonsense
    return words.length === 1 && opt.length < 6;
  });

  if (hasNonsense) {
    warnings.push(
      `⚠️ Q${qNum}: Some options may be nonsense distractors (too short/vague)`,
    );
  }

  // Check 3: Explanation should provide reasoning
  if (
    !question.explanation
      .toLowerCase()
      .match(/\b(because|since|as|due to|reason)\b/)
  ) {
    warnings.push(
      `⚠️ Q${qNum}: Explanation should include reasoning (use 'because', 'since', etc.)`,
    );
  }

  // Check 4: Check for inconsistent grammatical structure
  const startsWithVerb = (text: string) =>
    /^(uses?|is|are|was|were|has|have|does|do|will|can|should)\b/i.test(text);
  const startsWithNoun = (text: string) => /^(the|a|an|[A-Z])/i.test(text);

  const verbCount = options.filter(startsWithVerb).length;
  const nounCount = options.filter(startsWithNoun).length;

  if (verbCount > 0 && verbCount < 4 && nounCount > 0 && nounCount < 4) {
    warnings.push(
      `⚠️ Q${qNum}: Options have inconsistent grammatical structure (mix of forms)`,
    );
  }

  return warnings;
};

/**
 * Calculate specificity score for a question (0-100)
 * Higher score = more specific/technical question
 */
export const calculateSpecificityScore = (question: Question): number => {
  let score = 0;
  const q = question.question;

  // +20: Has code/syntax (backticks, parentheses, brackets, @decorators)
  if (/[`\(\)\[\]{}@]/.test(q)) score += 20;

  // +15: Names specific libraries/tools (common tech stack)
  if (
    /\b(Pandas|NumPy|PyTorch|TensorFlow|FastAPI|Streamlit|sklearn|scikit-learn|SQL|PostgreSQL|MySQL|MongoDB|Redis|Docker|Kubernetes|AWS|Azure|GCP|Claude|GPT|Gemini|BERT|Transformer|RAG|LangChain|ChromaDB)\b/i.test(
      q,
    )
  )
    score += 15;

  // +15: Has specific parameters, methods, or version numbers
  if (
    /\b(max_depth|learning_rate|batch_size|n_estimators|temperature|top_p|alpha|lambda|dropout|epochs|layers)\b/.test(
      q,
    ) ||
    /\d+\.\d+|v\d+/.test(q)
  )
    score += 15;

  // +10: Question length > 80 chars (more context usually = more specific)
  if (q.length > 80) score += 10;

  // +10: Has concrete metrics or numbers
  if (/\d+%|\d+ (samples?|rows?|features?|layers?|epochs?|parameters?)/.test(q))
    score += 10;

  // +10: Scenario-based (starts with context-setting words)
  if (/^(A |Given |Debug |Consider |Analyze |In |When |For )/i.test(q))
    score += 10;

  // +10: Comparison with specific named entities
  if (
    /\b(vs\.?|versus|difference between|compare)\b/i.test(q) &&
    /\b[A-Z]\w+\b.*\b[A-Z]\w+\b/.test(q)
  )
    score += 10;

  // +10: Has proper function/method syntax (dot notation or decorators)
  if (/\w+\.\w+\(|\.\w+\[|@\w+/.test(q)) score += 10;

  // -20: Starts with extremely vague patterns
  if (/^(What is |How does |Explain |Describe )\w+\??$/i.test(q)) score -= 20;

  // -10: Very short question (<40 chars) usually means vague
  if (q.length < 40) score -= 10;

  return Math.max(0, Math.min(100, score));
};

/**
 * Validate minimum specificity across entire quiz
 */
export const validateQuizSpecificity = (questions: Question[]): string[] => {
  const warnings: string[] = [];
  const scores = questions.map((q) => calculateSpecificityScore(q));
  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  // Warn about individual low-specificity questions
  scores.forEach((score, idx) => {
    if (score < 30) {
      warnings.push(
        `⚠️ Q${idx + 1}: Low specificity score (${score}/100) - question needs specific tools, syntax, parameters, or concrete scenarios`,
      );
    }
  });

  // Warn if overall average is too low
  if (avgScore < 50) {
    warnings.push(
      `⚠️ Overall quiz specificity too low (${Math.round(avgScore)}/100 average) - questions need more technical detail and specific context`,
    );
  }

  // Flag if too many questions are below threshold
  const lowSpecCount = scores.filter((s) => s < 40).length;
  if (lowSpecCount > 3) {
    warnings.push(
      `⚠️ Too many vague questions (${lowSpecCount}/10 below threshold) - add specific tool names, code syntax, or numbered scenarios`,
    );
  }

  return warnings;
};

/**
 * STRICT Theme/Topic/Type Diversity Validation
 * Returns ERRORS (not warnings) for duplicate themes, topics, or question types
 */
export const validateThemeDiversity = (questions: Question[]): string[] => {
  const errors: string[] = [];

  // Extract key themes/topics from each question
  const extractThemes = (q: Question): string[] => {
    const text = q.question.toLowerCase();
    const themes: string[] = [];

    // Question type detection - aligned with prompt types
    // ANALYZE - "What factors contribute to X?" "Why does X happen?"
    if (
      /what factors|factors contribute|why does|why do|why is|why are|what causes|what drives/i.test(
        text,
      )
    )
      themes.push("ANALYZE");
    // EVALUATE - "Which approach is most effective?" "What is the PRIMARY reason?"
    else if (
      /most effective|primary reason|best approach|which.*best|main benefit|key advantage|most appropriate/i.test(
        text,
      )
    )
      themes.push("EVALUATE");
    // COMPARE - "How does X differ from Y?" "What distinguishes X from Y?"
    else if (
      /compare|vs|versus|difference|differ|distinguish|how does.*differ|unlike/i.test(
        text,
      )
    )
      themes.push("COMPARE");
    // PREDICT - "What would happen if X?" "What is the likely outcome?"
    else if (
      /what happens|what would|predict|output|result|likely outcome|consequence of|if.*then/i.test(
        text,
      )
    )
      themes.push("PREDICT");
    // CAUSE-EFFECT - "What causes X?" "What is the consequence of X?"
    else if (
      /cause|because|lead to|result in|consequence|due to|effect of|impact of/i.test(
        text,
      )
    )
      themes.push("CAUSE-EFFECT");
    // IDENTIFY - "Which is an example of X?" "What characterizes X?"
    else if (
      /which is an example|example of|characterizes|characteristic|identify|which.*represents/i.test(
        text,
      )
    )
      themes.push("IDENTIFY");
    // CRITIQUE - "What is the main limitation?" "Which is NOT a valid argument?"
    else if (
      /limitation|drawback|weakness|not.*valid|criticism|flaw|shortcoming|challenge/i.test(
        text,
      )
    )
      themes.push("CRITIQUE");
    // APPLY - "In scenario X, which approach?" "How would X be applied?"
    else if (
      /in.*scenario|applied to|how would|in practice|implement|use case|when.*should/i.test(
        text,
      )
    )
      themes.push("APPLY");
    // ASSERTION-REASON format
    else if (/assertion.*reason|reason.*assertion/i.test(text))
      themes.push("ASSERTION-REASON");
    // STATEMENT-ANALYSIS - statement-based questions
    else if (
      /which.*statement|statement.*correct|statement.*incorrect|consider.*statements|which is\/are/i.test(
        text,
      )
    )
      themes.push("STATEMENT-ANALYSIS");
    // NEGATIVE - NOT questions
    else if (
      /which is not|what is not|not part of|not implemented|does not|not a benefit|not a reason/i.test(
        text,
      )
    )
      themes.push("NEGATIVE");
    // Fallback patterns
    else if (/hype|marketing|claim.*evidence|evidence.*claim/i.test(text))
      themes.push("HYPE-VS-REALITY");
    else if (/colleague|coworker|manager|team|someone says/i.test(text))
      themes.push("CRITICAL-EVALUATION");
    else if (/ethic|bias|fair|discriminat/i.test(text))
      themes.push("ETHICS-FAIRNESS");
    else if (/legal|law|regulation|compliance|gdpr|eu ai act/i.test(text))
      themes.push("LEGAL-COMPLIANCE");
    else if (/research|paper|study|benchmark|published/i.test(text))
      themes.push("RESEARCH-ANALYSIS");
    else if (/vendor|provider|company claims/i.test(text))
      themes.push("CLAIM-VERIFICATION");
    else if (/algorithm|moe|mixture|ssm|mamba|architecture/i.test(text))
      themes.push("ALGORITHM-INSIGHT");
    else if (/agi|safety|alignment|existential|risk/i.test(text))
      themes.push("AGI-SAFETY");
    else if (/tool|framework|library|suited for/i.test(text))
      themes.push("TOOL-RECOGNITION");
    else if (/trend|industry|market|growing|emerging/i.test(text))
      themes.push("TREND-AWARENESS");
    else if (/debug|error|fix|issue|problem/i.test(text)) themes.push("DEBUG");

    // Topic/subject detection - extract key technical terms
    const topicPatterns = [
      /\b(rag|retrieval.augmented)\b/i,
      /\b(fine.?tun|finetuning)\b/i,
      /\b(prompt|prompting)\b/i,
      /\b(hallucination|hallucinate)\b/i,
      /\b(token|tokeniz)\b/i,
      /\b(embedding|vector)\b/i,
      /\b(transformer|attention)\b/i,
      /\b(llm|large language model)\b/i,
      /\b(gpt|claude|gemini|llama|mistral)\b/i,
      /\b(training|train data)\b/i,
      /\b(inference|deploy)\b/i,
      /\b(context window|context length)\b/i,
      /\b(temperature|top.?p|sampling)\b/i,
      /\b(agent|agentic)\b/i,
      /\b(multimodal|vision|image)\b/i,
      /\b(chain.of.thought|cot|reasoning)\b/i,
      /\b(benchmark|eval|mmlu|humaneval)\b/i,
      /\b(open.?source|closed.?source)\b/i,
      /\b(api|endpoint)\b/i,
      /\b(cost|pricing|token cost)\b/i,
      /\b(latency|speed|performance)\b/i,
      /\b(safety|alignment|rlhf)\b/i,
      /\b(bias|fairness)\b/i,
      /\b(regulation|gdpr|eu ai act)\b/i,
      /\b(chunking|chunk size)\b/i,
      /\b(memory|context)\b/i,
    ];

    topicPatterns.forEach((pattern) => {
      const match = text.match(pattern);
      if (match) {
        themes.push(`TOPIC:${match[0].toUpperCase()}`);
      }
    });

    return themes;
  };

  // Check for duplicates
  const allThemes: Map<string, number[]> = new Map();

  questions.forEach((q, idx) => {
    const themes = extractThemes(q);
    themes.forEach((theme) => {
      if (!allThemes.has(theme)) {
        allThemes.set(theme, []);
      }
      allThemes.get(theme)!.push(idx + 1);
    });
  });

  // Report duplicates as ERRORS
  allThemes.forEach((questionNums, theme) => {
    if (questionNums.length > 1) {
      // Question types should not repeat more than twice
      if (!theme.startsWith("TOPIC:") && questionNums.length > 2) {
        errors.push(
          `❌ Question type "${theme}" used ${questionNums.length} times (Q${questionNums.join(", Q")}) - max 2 allowed per quiz`,
        );
      }
      // Topics should NOT repeat at all
      if (theme.startsWith("TOPIC:") && questionNums.length > 1) {
        const topicName = theme.replace("TOPIC:", "");
        errors.push(
          `❌ Topic "${topicName}" repeated in Q${questionNums.join(", Q")} - each question must cover a DIFFERENT topic`,
        );
      }
    }
  });

  // Check if we have enough diversity (at least 5 different question types)
  const questionTypes = Array.from(allThemes.keys()).filter(
    (k) => !k.startsWith("TOPIC:"),
  );
  if (questionTypes.length < 5 && questions.length >= 10) {
    errors.push(
      `❌ Only ${questionTypes.length} question types used - need at least 5 different types (ANALYZE, EVALUATE, COMPARE, PREDICT, CAUSE-EFFECT, IDENTIFY, CRITIQUE, APPLY, NEGATIVE, etc.)`,
    );
  }

  return errors;
};

export const validateQuizJSON = (
  jsonInput: string,
  moduleName: string,
): ValidationResults => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let data: QuizData | null = null;

  // ENHANCEMENT 1: Auto-extract JSON from LLM output (handles markdown fences)
  const cleanedInput = extractJSONFromLLMOutput(jsonInput);

  try {
    data = JSON.parse(cleanedInput);
  } catch (e) {
    // Provide detailed error message with actual parse error
    const parseError =
      e instanceof SyntaxError ? e.message : "Unknown parse error";
    errors.push(`❌ Invalid JSON format: ${parseError}`);
    errors.push(
      "💡 Common fixes: Check for missing commas, unescaped quotes, trailing commas, or special characters (use straight quotes, not curly quotes).",
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

    // Type validation for numeric fields (must be numbers, not strings)
    if (typeof q.correctAnswer !== "number") {
      errors.push(
        `❌ Q${qNum}: correctAnswer must be a number, not "${typeof q.correctAnswer}" (found: ${JSON.stringify(q.correctAnswer)})`,
      );
    }
    if (typeof q.timeLimit !== "number") {
      errors.push(
        `❌ Q${qNum}: timeLimit must be a number, not "${typeof q.timeLimit}" (found: ${JSON.stringify(q.timeLimit)})`,
      );
    }
    // minPoints and maxPoints: Allow empty strings ("") since Discord bot auto-calculates these
    // Only error if non-empty string or non-number type (excluding empty string)
    if (typeof q.minPoints !== "number" && q.minPoints !== "") {
      errors.push(
        `❌ Q${qNum}: minPoints must be a number or empty string (found: ${JSON.stringify(q.minPoints)})`,
      );
    }
    if (typeof q.maxPoints !== "number" && q.maxPoints !== "") {
      errors.push(
        `❌ Q${qNum}: maxPoints must be a number or empty string (found: ${JSON.stringify(q.maxPoints)})`,
      );
    }

    const qText = q.question || "";
    if (qText.length < VALIDATION_RULES.question.min) {
      errors.push(
        `❌ Q${qNum}: Question too short (${qText.length} chars, min ${VALIDATION_RULES.question.min})`,
      );
    }
    // Detect statement-based questions (UPSC style) - allow higher character limit
    const isStatementBased =
      /consider the following|how many.*statements?|which.*statements?|assertion.*reason|statement.*(i|1|one)/i.test(
        qText,
      );
    const maxQuestionLength = isStatementBased
      ? VALIDATION_RULES.question.statementBased.max
      : VALIDATION_RULES.question.max;

    if (qText.length > maxQuestionLength) {
      errors.push(
        `❌ Q${qNum}: Question too long (${qText.length} chars, max ${maxQuestionLength}${isStatementBased ? " for statement-based" : ""})`,
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
      // Detect if option contains code (backticks, brackets, symbols)
      const hasCode = /[`{}()\[\]<>]/.test(opt);
      const rules = hasCode
        ? VALIDATION_RULES.option.code
        : VALIDATION_RULES.option.plainText;

      if (opt.length < rules.min) {
        errors.push(
          `❌ Q${qNum} Option ${optNum}: Too short (${opt.length} chars, min ${rules.min} for ${hasCode ? "code" : "plain text"})`,
        );
      }
      if (opt.length > rules.max) {
        warnings.push(
          `⚠️ Q${qNum} Option ${optNum}: Too long (${opt.length} chars, max ${rules.max} for ${hasCode ? "code" : "plain text"})`,
        );
      }
    });

    if (options.length === 4) {
      const lengths = options.map((opt) => opt.length);
      const minLen = Math.min(...lengths);
      const maxLen = Math.max(...lengths);
      const diff = maxLen - minLen;

      // Detect if any option has code - use appropriate balance rule
      const hasAnyCode = options.some((opt) => /[`{}()\[\]<>]/.test(opt));
      const balanceThreshold = hasAnyCode
        ? VALIDATION_RULES.optionBalance.code
        : VALIDATION_RULES.optionBalance.plainText;

      if (diff > balanceThreshold) {
        errors.push(
          `❌ Q${qNum}: Options not balanced (${minLen}-${maxLen} chars, diff ${diff} > ${balanceThreshold} for ${hasAnyCode ? "code" : "plain text"})`,
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
    // More lenient time limit checking - only warn for extreme differences
    const isRoundInterval = [20, 25, 30, 35].includes(q.timeLimit);
    const tolerance = isRoundInterval ? 15 : 10; // Increased tolerance

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
  const hasOverused = distribution.some((count) => count > 3); // Tightened: max 3 per position
  const hasUnderused = distribution.some((count) => count < 2 && count > 0); // Min 2 per position

  if (hasUnused) {
    const unused = distribution
      .map((c, i) => (c === 0 ? i + 1 : null))
      .filter(Boolean);
    errors.push(
      `❌ Pattern exploit: Position(s) ${unused.join(", ")} never used - each position must appear 2-3 times`,
    );
  }

  if (hasOverused) {
    const overused = distribution
      .map((c, i) => (c > 3 ? `${i + 1} (${c}×)` : null))
      .filter(Boolean);
    errors.push(
      `❌ Pattern exploit: Position(s) ${overused.join(", ")} overused - each position must appear 2-3 times max`,
    );
  }

  if (hasUnderused) {
    const underused = distribution
      .map((c, i) => (c === 1 ? `${i + 1} (${c}×)` : null))
      .filter(Boolean);
    warnings.push(
      `⚠️ Pattern exploit: Position(s) ${underused.join(", ")} underused - should appear at least 2 times`,
    );
  }

  // Check for consecutive repeats (same position 3+ times in a row)
  let maxConsecutive = 1;
  let currentConsecutive = 1;
  let consecutivePosition = correctAnswerPositions[0];
  for (let i = 1; i < correctAnswerPositions.length; i++) {
    if (correctAnswerPositions[i] === correctAnswerPositions[i - 1]) {
      currentConsecutive++;
      if (currentConsecutive > maxConsecutive) {
        maxConsecutive = currentConsecutive;
        consecutivePosition = correctAnswerPositions[i];
      }
    } else {
      currentConsecutive = 1;
    }
  }

  if (maxConsecutive >= 3) {
    errors.push(
      `❌ Pattern exploit: Position ${consecutivePosition} appears ${maxConsecutive} times consecutively - max 2 consecutive allowed`,
    );
  } else if (maxConsecutive === 2) {
    // Find all consecutive pairs for warning
    const consecutivePairs: string[] = [];
    for (let i = 1; i < correctAnswerPositions.length; i++) {
      if (correctAnswerPositions[i] === correctAnswerPositions[i - 1]) {
        consecutivePairs.push(
          `Q${i}-Q${i + 1}(pos ${correctAnswerPositions[i]})`,
        );
      }
    }
    if (consecutivePairs.length > 2) {
      warnings.push(
        `⚠️ Multiple consecutive repeats detected: ${consecutivePairs.join(", ")} - try to vary positions more`,
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // ANTI-HALLUCINATION VALIDATION (Layer 4 - Nov 20, 2025)
  // Only run if no structural errors (Layer 1-3 passed)
  // ═══════════════════════════════════════════════════════════════════
  if (data && errors.length === 0) {
    warnings.push(...validateModelReferences(data));
    warnings.push(...validateHypeWords(data));
    warnings.push(...validateQuantification(data));
    warnings.push(...validateNaturalTone(data)); // Detect robotic/fragmented options
    warnings.push(...validateCodeSyntax(data));
    warnings.push(...validateCorrectAnswerLength(data));
  }

  // ═══════════════════════════════════════════════════════════════════
  // ENHANCED VALIDATION (Layer 5 - Nov 20, 2025 Phase 1 Improvements)
  // Accessibility, Semantic Quality, Bloom's Taxonomy
  // ═══════════════════════════════════════════════════════════════════
  if (data && errors.length === 0) {
    // Run per-question validations
    data.questions.forEach((q: Question, idx: number) => {
      const qNum = idx + 1;

      // Accessibility best practices (warnings only)
      warnings.push(...validateAccessibility(q, qNum));

      // Semantic quality validation
      warnings.push(...validateSemanticQuality(q, qNum));
    });

    // Run quiz-level validations
    warnings.push(...validateBloomDistribution(data.questions));

    // NEW: Validate overall quiz specificity
    warnings.push(...validateQuizSpecificity(data.questions));

    // STRICT: Validate theme/topic/type diversity (returns ERRORS, not warnings)
    errors.push(...validateThemeDiversity(data.questions));
  }

  const isValid = errors.length === 0;

  return {
    valid: isValid,
    errors,
    warnings,
    // Always return data if JSON structure is valid (even with pattern errors)
    // This allows showing Shuffle button to fix pattern issues
    data: data,
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

/**
 * SMART SHUFFLE - Guarantees balanced distribution
 * - Each position (1-4) appears 2-3 times across 10 questions
 * - No position appears 3+ times consecutively
 * - Shuffles options within each question to achieve target positions
 */
export const smartShuffleQuiz = (quiz: QuizData): QuizData => {
  const questions = [...quiz.questions];
  const numQuestions = questions.length;

  // Generate balanced target positions [2,3,2,3] or [3,2,3,2] distribution
  // For 10 questions: each position should appear 2-3 times
  const targetPositions: number[] = [];
  const positionCounts = [0, 0, 0, 0]; // counts for positions 1,2,3,4

  // First pass: assign positions ensuring balance and no 3+ consecutive
  for (let i = 0; i < numQuestions; i++) {
    // Get available positions (count < 3 and not causing 3 consecutive)
    const available: number[] = [];
    for (let pos = 1; pos <= 4; pos++) {
      if (positionCounts[pos - 1] >= 3) continue; // Already at max

      // Check for consecutive repeats
      if (i >= 2) {
        if (targetPositions[i - 1] === pos && targetPositions[i - 2] === pos) {
          continue; // Would cause 3 consecutive
        }
      }
      available.push(pos);
    }

    // Prefer underused positions
    const minCount = Math.min(
      ...positionCounts.filter((_, idx) => available.includes(idx + 1)),
    );
    const preferred = available.filter(
      (pos) => positionCounts[pos - 1] === minCount,
    );

    // Random pick from preferred (or available if no preferred)
    const choices = preferred.length > 0 ? preferred : available;
    const chosen = choices[Math.floor(Math.random() * choices.length)] || 1;

    targetPositions.push(chosen);
    positionCounts[chosen - 1]++;
  }

  // Second pass: shuffle each question's options to achieve target position
  const shuffledQuestions = questions.map((q, idx) => {
    const targetPos = targetPositions[idx];
    return shuffleToTargetPosition(q, targetPos);
  });

  return {
    ...quiz,
    questions: shuffledQuestions,
  };
};

/**
 * Shuffle a question's options so correct answer lands at target position
 */
const shuffleToTargetPosition = (
  question: Question,
  targetPosition: number,
): Question => {
  const options = [
    question.answer1,
    question.answer2,
    question.answer3,
    question.answer4,
  ];

  const correctIdx = question.correctAnswer - 1;
  const correctText = options[correctIdx];

  // Remove correct answer from options
  const otherOptions = options.filter((_, i) => i !== correctIdx);

  // Shuffle other options
  const shuffledOthers = fisherYatesShuffle(otherOptions);

  // Insert correct answer at target position
  const targetIdx = targetPosition - 1;
  const result = [...shuffledOthers];
  result.splice(targetIdx, 0, correctText);

  return {
    ...question,
    answer1: result[0],
    answer2: result[1],
    answer3: result[2],
    answer4: result[3],
    correctAnswer: targetPosition,
  };
};

export const generateTableData = (quiz: QuizData): string[][] => {
  // Sanitize text for TSV: remove newlines, tabs that break Excel cells
  const sanitize = (text: string): string => {
    return (text || "")
      .replace(/[\r\n]+/g, " ") // Replace newlines with space
      .replace(/\t/g, " ") // Replace tabs with space
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();
  };

  return quiz.questions.map((q) => [
    sanitize(q.id),
    sanitize(q.question),
    sanitize(q.answer1),
    sanitize(q.answer2),
    sanitize(q.answer3),
    sanitize(q.answer4),
    sanitize(q.answer5),
    sanitize(q.answer6),
    sanitize(q.answer7),
    sanitize(q.answer8),
    sanitize(q.answer9),
    String(q.correctAnswer),
    String(q.minPoints),
    String(q.maxPoints),
    sanitize(q.explanation),
    String(q.timeLimit),
    sanitize(q.imageUrl),
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

// ═══════════════════════════════════════════════════════════════════
// TSV PARSING UTILITIES (November 22, 2025)
// Support for pasting Excel data directly into "Your Collected Questions"
// ═══════════════════════════════════════════════════════════════════

export interface ParsedTSVQuestion {
  id: string;
  question: string;
  options: string[]; // [answer1, answer2, answer3, answer4]
  correctAnswer: number; // 1-4
  explanation: string;
  timeLimit: number;
  minPoints: string;
  maxPoints: string;
  imageUrl: string;
}

/**
 * Detects input format (TSV from Excel vs plain text)
 * Returns 'tsv' if input contains tab-separated data with expected column count
 */
export const detectInputFormat = (input: string): "tsv" | "plaintext" => {
  const trimmed = input.trim();
  if (!trimmed) return "plaintext";

  const lines = trimmed.split("\n");
  if (lines.length < 2) return "plaintext"; // Need at least header + 1 data row

  // Check first line for tab-separated columns
  const firstLine = lines[0];
  const tabs = (firstLine.match(/\t/g) || []).length;

  // Excel A1:Q11 has 17 columns = 16 tabs
  // Be flexible: 10+ tabs likely TSV (covers partial pastes)
  if (tabs >= 10) {
    return "tsv";
  }

  return "plaintext";
};

/**
 * Parses TSV data (from Excel copy A1:Q11) into structured question format
 * Handles both with-header and without-header cases
 */
export const parseTSVToQuestions = (
  tsvInput: string,
): {
  success: boolean;
  questions: ParsedTSVQuestion[];
  errors: string[];
} => {
  const errors: string[] = [];
  const questions: ParsedTSVQuestion[] = [];

  try {
    const lines = tsvInput
      .trim()
      .split("\n")
      .filter((line) => line.trim());

    if (lines.length === 0) {
      errors.push("TSV input is empty");
      return { success: false, questions: [], errors };
    }

    // Detect if first line is header by checking for "question" or "id" keywords
    let startIndex = 0;
    const firstLine = lines[0].toLowerCase();
    const hasHeader =
      firstLine.includes("question") ||
      firstLine.includes("answer") ||
      (firstLine.startsWith("#") && firstLine.includes("\t"));

    if (hasHeader) {
      startIndex = 1; // Skip header row
    }

    // Parse data rows
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      const cells = line.split("\t");

      // Validate column count (should be 17: A-Q)
      if (cells.length < 12) {
        errors.push(
          `Row ${i + 1}: Insufficient columns (${cells.length} found, expected 17). Ensure you copied A1:Q11 range.`,
        );
        continue;
      }

      // Map columns to expected structure
      // Expected: id, question, answer1-9, correctAnswer, minPoints, maxPoints, explanation, timeLimit, imageUrl
      const [
        id,
        question,
        answer1,
        answer2,
        answer3,
        answer4,
        answer5,
        answer6,
        answer7,
        answer8,
        answer9,
        correctAnswer,
        minPoints,
        maxPoints,
        explanation,
        timeLimit,
        imageUrl,
      ] = cells;

      // Validate required fields
      if (!question || question.trim() === "") {
        errors.push(`Row ${i + 1}: Question text is empty`);
        continue;
      }

      // Validate we have at least 4 options
      const options = [answer1, answer2, answer3, answer4].map((opt) =>
        opt ? opt.trim() : "",
      );
      const validOptions = options.filter((opt) => opt !== "");

      if (validOptions.length < 4) {
        errors.push(
          `Row ${i + 1}: Must have at least 4 non-empty answer options (found ${validOptions.length})`,
        );
        continue;
      }

      // Parse correctAnswer (default to 1 if invalid)
      const parsedCorrectAnswer = parseInt(correctAnswer);
      const finalCorrectAnswer =
        !isNaN(parsedCorrectAnswer) &&
        parsedCorrectAnswer >= 1 &&
        parsedCorrectAnswer <= 4
          ? parsedCorrectAnswer
          : 1;

      if (
        isNaN(parsedCorrectAnswer) ||
        parsedCorrectAnswer < 1 ||
        parsedCorrectAnswer > 4
      ) {
        errors.push(
          `Row ${i + 1}: Invalid correctAnswer "${correctAnswer}" - must be 1-4 (defaulting to 1)`,
        );
      }

      // Parse timeLimit (default to 25s if invalid)
      const parsedTimeLimit = parseInt(timeLimit);
      const finalTimeLimit =
        !isNaN(parsedTimeLimit) &&
        parsedTimeLimit >= 20 &&
        parsedTimeLimit <= 35
          ? parsedTimeLimit
          : 25;

      // Points: Keep as empty string (Discord bot auto-calculates)
      const finalMinPoints = minPoints?.trim() || "";
      const finalMaxPoints = maxPoints?.trim() || "";

      // Create parsed question
      const parsedQuestion: ParsedTSVQuestion = {
        id: id && id.trim() !== "" ? id.trim() : `Q${questions.length + 1}`,
        question: question.trim(),
        options: options,
        correctAnswer: finalCorrectAnswer,
        explanation: explanation ? explanation.trim() : "",
        timeLimit: finalTimeLimit,
        minPoints: finalMinPoints,
        maxPoints: finalMaxPoints,
        imageUrl: imageUrl ? imageUrl.trim() : "",
      };

      questions.push(parsedQuestion);
    }

    // Final validation
    if (questions.length === 0) {
      errors.push("No valid questions found in TSV data");
      return { success: false, questions: [], errors };
    }

    return {
      success: errors.length === 0,
      questions,
      errors,
    };
  } catch (error) {
    errors.push(
      `Parse error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return { success: false, questions: [], errors };
  }
};

/**
 * Converts parsed TSV questions to QuizData format
 * Maps ParsedTSVQuestion[] → QuizData (strict schema)
 */
export const convertTSVToQuizData = (
  parsedQuestions: ParsedTSVQuestion[],
  moduleName: string,
): QuizData => {
  return {
    module: moduleName,
    questions: parsedQuestions.map((pq) => ({
      id: pq.id,
      question: pq.question,
      answer1: pq.options[0] || "",
      answer2: pq.options[1] || "",
      answer3: pq.options[2] || "",
      answer4: pq.options[3] || "",
      answer5: "", // Excel format doesn't use answer5-9
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: pq.correctAnswer,
      minPoints: pq.minPoints,
      maxPoints: pq.maxPoints,
      explanation: pq.explanation,
      timeLimit: pq.timeLimit,
      imageUrl: pq.imageUrl,
    })),
  };
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
 * Returns true if:
 * - Any position >3 times (max 3 per position for 10 questions)
 * - Any position <1 times (all positions must be used)
 * - Same position appears 3+ times consecutively
 */
export const isDistributionUnbalanced = (quiz: QuizData): boolean => {
  const { counts, pattern } = calculateCorrectAnswerDistribution(quiz);

  // Check distribution counts (each position should appear 2-3 times)
  const hasUnbalancedCounts = counts.some((c) => c > 3 || c < 1);

  // Check for consecutive repeats (3+ in a row)
  let maxConsecutive = 1;
  let currentConsecutive = 1;
  for (let i = 1; i < pattern.length; i++) {
    if (pattern[i] === pattern[i - 1]) {
      currentConsecutive++;
      if (currentConsecutive > maxConsecutive) {
        maxConsecutive = currentConsecutive;
      }
    } else {
      currentConsecutive = 1;
    }
  }
  const hasConsecutiveRepeats = maxConsecutive >= 3;

  return hasUnbalancedCounts || hasConsecutiveRepeats;
};

// ═══════════════════════════════════════════════════════════════════
// ANTI-HALLUCINATION VALIDATION FUNCTIONS (November 20, 2025)
// ═══════════════════════════════════════════════════════════════════

/**
 * Validates AI model references using pattern matching
 * More flexible than hardcoded lists - adapts to new model versions
 */
export const validateModelReferences = (quiz: QuizData): string[] => {
  const warnings: string[] = [];
  const { modelPatterns, deprecatedPatterns } = VALIDATION_RULES;

  quiz.questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const content = `${q.question} ${q.answer1} ${q.answer2} ${q.answer3} ${q.answer4} ${q.explanation}`;

    // Regex for AI model patterns: gpt-4, claude-3, gemini-2.5, o3, etc.
    const modelMatches =
      content.match(
        /\b(?:gpt-[\d.]+[-\w]*|claude-[\w.-]+|gemini-[\d.]+-?\w*|o[1-4](?:-\w+)?)\b/gi,
      ) || [];

    modelMatches.forEach((match) => {
      const normalized = match.toLowerCase().trim();

      // Check if matches any valid production pattern
      const isValidPattern = Object.values(modelPatterns).some((pattern) =>
        pattern.test(normalized),
      );

      // Check if matches deprecated pattern
      const isDeprecated = deprecatedPatterns.some((pattern) =>
        pattern.test(normalized),
      );

      if (isDeprecated) {
        warnings.push(
          `⚠️ Q${qNum}: Deprecated model "${match}" - students shouldn't learn outdated tech`,
        );
      } else if (!isValidPattern) {
        warnings.push(
          `⚠️ Q${qNum}: Unrecognized model "${match}" - verify this exists`,
        );
      }
    });
  });

  return warnings;
};

/**
 * Validates correct answer length distribution
 * Prevents exploit where correct answer is always longest
 * Rule: Correct answer should be longest in max 4/10 questions
 */
export const validateCorrectAnswerLength = (quiz: QuizData): string[] => {
  const warnings: string[] = [];
  let longestCorrectCount = 0;
  let shortestCorrectCount = 0;
  const lengthPositions: string[] = [];

  quiz.questions.forEach((q, idx) => {
    const options = [q.answer1, q.answer2, q.answer3, q.answer4];
    const lengths = options.map((o) => o.length);
    const correctIdx = q.correctAnswer - 1;
    const correctLength = lengths[correctIdx];
    const maxLength = Math.max(...lengths);
    const minLength = Math.min(...lengths);

    if (
      correctLength === maxLength &&
      lengths.filter((l) => l === maxLength).length === 1
    ) {
      longestCorrectCount++;
      lengthPositions.push(`Q${idx + 1}`);
    }
    if (
      correctLength === minLength &&
      lengths.filter((l) => l === minLength).length === 1
    ) {
      shortestCorrectCount++;
    }
  });

  // Warn if correct answer is longest too often (exploitable pattern)
  if (longestCorrectCount > 4) {
    warnings.push(
      `⚠️ Anti-exploit: Correct answer is longest in ${longestCorrectCount}/10 questions (${lengthPositions.join(", ")}) - students can exploit "pick longest" strategy`,
    );
  }

  // Warn if never shortest (should vary for unpredictability)
  if (shortestCorrectCount === 0 && quiz.questions.length >= 10) {
    warnings.push(
      `⚠️ Anti-exploit: Correct answer is never the shortest option - vary length position for unpredictability`,
    );
  }

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
 * Validates that options are natural (not robotic/fragmented)
 * Detects AI-generated patterns that break grammatical flow
 */
export const validateNaturalTone = (quiz: QuizData): string[] => {
  const warnings: string[] = [];

  // Patterns that indicate robotic/fragmented options
  const roboticPatterns = [
    // Noun-phrase fragments without verbs
    /^[A-Z][a-z]+(-[a-z]+)?\s+(priority|focus|approach|obsolete|gone|declining)$/i,
    // Single adjective + noun without article/verb
    /^[A-Z][a-z]+\s+[a-z]+$/,
    // "X gone" or "X obsolete" patterns
    /^[A-Z][a-z]+(\s+[a-z]+)?\s+(gone|obsolete|dead|finished|over)$/i,
    // Noun + verb-ing without subject (unless it's a gerund phrase)
    /^[A-Z][a-z]+\s+[a-z]+ing$/,
  ];

  // Allowed short options (statement-based, etc.)
  const allowedShortPatterns = [
    /^[1-4]\s*(only|and\s+[1-4])?$/i, // "1 only", "1 and 2"
    /^both$/i,
    /^neither$/i,
    /^all$/i,
    /^none$/i,
    /^(true|false)$/i,
    /^[A-D]$/i, // Single letter options
  ];

  quiz.questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const question = q.question || "";
    const options = [q.answer1, q.answer2, q.answer3, q.answer4].filter(
      Boolean,
    );

    // Skip statement-based questions (they have special option formats)
    const isStatementBased = /statement|assertion|reason|1\)|2\)/i.test(
      question,
    );
    if (isStatementBased) return;

    // Check each option
    options.forEach((opt, optIdx) => {
      if (!opt) return;
      const trimmed = opt.trim();

      // Skip allowed patterns
      if (allowedShortPatterns.some((p) => p.test(trimmed))) return;

      // Check for robotic patterns
      const isRobotic = roboticPatterns.some((p) => p.test(trimmed));

      // Check for fragmented options (< 4 words, no verb, ends in noun)
      const words = trimmed.split(/\s+/);
      const hasVerb =
        /\b(is|are|was|were|has|have|does|do|will|can|should|may|might|enables?|allows?|provides?|requires?|causes?|leads?|makes?|helps?)\b/i.test(
          trimmed,
        );
      const endsInFragmentedNoun =
        words.length <= 3 && !hasVerb && /[a-z]$/.test(trimmed);

      if (isRobotic || (endsInFragmentedNoun && words.length >= 2)) {
        // Test: Can "Question? Option" form a natural sentence?
        const combined = `${question.replace(/\?$/, "")}... ${trimmed}`;
        warnings.push(
          `⚠️ Q${qNum} Option ${optIdx + 1}: Fragmented/robotic "${trimmed}" - should complete question naturally`,
        );
      }
    });
  });

  return warnings;
};

/**
 * Validates that statements/options don't contain specific quantification
 * UPSC Pattern: No exact percentages, specific numbers that aren't recallable
 */
export const validateQuantification = (quiz: QuizData): string[] => {
  const warnings: string[] = [];

  // Patterns that indicate problematic quantification
  const quantificationPatterns = [
    // Specific percentages
    { pattern: /\d+(\.\d+)?%/, description: "specific percentage" },
    // Exact time durations (3 seconds, 5 years, etc.) - but allow "20s", "25s" for time limits
    {
      pattern:
        /\b\d+\s*(seconds?|minutes?|hours?|days?|weeks?|months?|years?)\b/i,
      description: "exact time duration",
    },
    // Exact counts in context (but allow statement references like "1 only")
    {
      pattern:
        /\b(only\s+)?\d+\s+(times?|instances?|cases?|examples?|factors?|reasons?|steps?)\b/i,
      description: "exact count",
    },
    // Specific dollar amounts
    {
      pattern: /\$\d+(\.\d+)?(\s*(million|billion|trillion))?/i,
      description: "specific dollar amount",
    },
    // Ranges with specific numbers
    { pattern: /\d+-\d+%/, description: "percentage range" },
    {
      pattern: /\b\d+(\.\d+)?\s*-\s*\d+(\.\d+)?%/,
      description: "percentage range",
    },
  ];

  // Allowed patterns (don't flag these)
  const allowedPatterns = [
    /^[1-4]\s*only$/i, // "1 only", "2 only" - statement options
    /^both$/i, // "Both" - statement option
    /^neither$/i, // "Neither" - statement option
    /\b(Q\d+|answer\d+)\b/i, // Question/answer references
    /\b(option\s*)?[1-4]\b/i, // Option references
    /\b(20|25|30|35)s?\b/, // Time limit values
  ];

  quiz.questions.forEach((q, idx) => {
    const qNum = idx + 1;

    // Check question text
    const questionText = q.question || "";
    quantificationPatterns.forEach(({ pattern, description }) => {
      const matches = questionText.match(pattern);
      if (matches) {
        // Check if it's an allowed pattern
        const isAllowed = allowedPatterns.some((ap) => ap.test(matches[0]));
        if (!isAllowed) {
          warnings.push(
            `⚠️ Q${qNum}: Contains ${description} "${matches[0]}" - use relative terms (approximately, significant, minimal)`,
          );
        }
      }
    });

    // Check options (but skip statement reference options like "1 only")
    const options = [q.answer1, q.answer2, q.answer3, q.answer4].filter(
      Boolean,
    );
    options.forEach((opt, optIdx) => {
      if (!opt) return;

      // Skip if it's a statement reference option
      const isStatementOption = allowedPatterns.some((ap) =>
        ap.test(opt.trim()),
      );
      if (isStatementOption) return;

      quantificationPatterns.forEach(({ pattern, description }) => {
        const matches = opt.match(pattern);
        if (matches) {
          const isAllowed = allowedPatterns.some((ap) => ap.test(matches[0]));
          if (!isAllowed) {
            warnings.push(
              `⚠️ Q${qNum} Option ${optIdx + 1}: Contains ${description} "${matches[0]}" - use relative terms`,
            );
          }
        }
      });
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
