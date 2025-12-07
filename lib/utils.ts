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
  option: {
    plainText: { min: 5, max: 25 }, // Plain text options (strict, no fluff)
    code: { min: 5, max: 50 }, // Code with symbols/backticks
  },
  optionBalance: {
    plainText: 15, // Max variance for plain text (5-25 char range = 20 span, allow 15 diff)
    code: 25, // Max variance for code options (5-50 char range = 45 span, allow 25 diff)
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
    q.id,
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
    // 17 columns matching COLUMN_HEADERS: id first, then all question fields
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
  minPoints: number;
  maxPoints: number;
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

      // Parse points (default to 0)
      const parsedMinPoints = parseInt(minPoints) || 0;
      const parsedMaxPoints = parseInt(maxPoints) || 0;

      // Create parsed question
      const parsedQuestion: ParsedTSVQuestion = {
        id: id && id.trim() !== "" ? id.trim() : `Q${questions.length + 1}`,
        question: question.trim(),
        options: options,
        correctAnswer: finalCorrectAnswer,
        explanation: explanation ? explanation.trim() : "",
        timeLimit: finalTimeLimit,
        minPoints: parsedMinPoints,
        maxPoints: parsedMaxPoints,
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
