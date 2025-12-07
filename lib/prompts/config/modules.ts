import { QuizConfig } from "./types";

/**
 * Default configuration - Single Source of Truth
 * All modules inherit from this unless explicitly overridden
 */
export const DEFAULT_CONFIG: QuizConfig = {
  questionsPerQuiz: 10,
  timeLimits: { min: 20, max: 35, intervals: [20, 25, 30, 35] },
  difficultyDistribution: {
    easy: { count: 2, timeRange: "20s" },
    medium: { count: 5, timeRange: "25s" },
    hard: { count: 2, timeRange: "30s" },
    veryHard: { count: 1, timeRange: "35s" },
  },
  optionConstraints: {
    minWords: 1,
    maxWords: 6,
    explanationMinWords: 12,
    explanationMaxWords: 18,
  },
};

/**
 * Module-specific overrides (only define what differs from default)
 */
const MODULE_OVERRIDES: Record<string, Partial<QuizConfig>> = {
  // Add module-specific overrides here if needed
  // "General AI": { questionsPerQuiz: 12 },
};

/**
 * Get module configuration with defaults
 */
export const getModuleConfig = (moduleName: string): QuizConfig => {
  const overrides = MODULE_OVERRIDES[moduleName];
  if (!overrides) return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG, ...overrides };
};

/**
 * Module context descriptions - concise module identity
 */
export const MODULE_CONTEXT: Record<string, string> = {
  "General AI": `<module_context>
STYLE: UPSC Current Affairs - analytical, awareness-based
FOCUS: AI developments, regulations, societal impact
DISTINCTION: WHAT is happening - NOT HOW to implement
FORBIDDEN: Code|RAG|Fine-tuning how-tos
REQUIRED: Current events|Critical evaluation|Policy implications
</module_context>`,

  "Gen AI": `<module_context>
FOCUS: Technical implementation (code/architecture/debugging)
DISTINCTION: HOW to build - NOT industry awareness
FORBIDDEN: Industry trends|Ethics/Laws|AGI topics
REQUIRED: Implementation HOWs|Debugging|Architecture trade-offs
</module_context>`,

  Python: `<module_context>
FOCUS: WHY mechanisms work, not syntax recall
FORBIDDEN: What is X?|Pure syntax|No reasoning
</module_context>`,

  SQL: `<module_context>
FOCUS: Query optimization reasoning
FORBIDDEN: Basic syntax|No optimization reasoning
</module_context>`,

  "Math/Stats": `<module_context>
FOCUS: Interpretation and application
FORBIDDEN: Pure formulas|No interpretation
</module_context>`,

  "Machine Learning": `<module_context>
FOCUS: Trade-off reasoning and debugging
FORBIDDEN: Definitions|No trade-offs
</module_context>`,

  "Deep Learning": `<module_context>
FOCUS: Architecture reasoning and debugging
FORBIDDEN: Basic definitions|No mechanism reasoning
</module_context>`,

  NLP: `<module_context>
FOCUS: Transformer mechanisms
FORBIDDEN: Basic definitions|No mechanism reasoning
</module_context>`,
};

export const getModuleInstructions = (moduleName: string): string =>
  MODULE_CONTEXT[moduleName] || "";
