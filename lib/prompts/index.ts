/**
 * QUIZ PROMPT SYSTEM - Modular Architecture
 *
 * Structure:
 * - config/   → Types, module configs, helpers
 * - rules/    → Shared rules (single source of truth)
 * - topics/   → Module-specific topics
 * - generators/ → Prompt generators
 *
 * Usage:
 * import { getSystemPrompt, getRefinementPrompt } from "@/lib/prompts";
 */

// Config exports
export type {
  QuizConfig,
  DateContext,
  ModuleTopics,
  ErrorCategories,
} from "./config/types";
export {
  DEFAULT_CONFIG,
  getModuleConfig,
  getModuleInstructions,
  MODULE_CONTEXT,
} from "./config/modules";
export {
  getDifficultyString,
  getTimeRulesFromConfig,
  getDateContext,
  categorizeErrors,
} from "./config/helpers";

// Rules exports
export {
  POLITICAL_CONTENT_RULES,
  HYPE_VS_REALITY_RULES,
  QUESTION_TYPE_DIVERSITY_RULES,
  DISCORD_COMPACT_RULES,
  QUESTION_STYLE_RULES,
  STATEMENT_OPTIONS_RULES,
  NEGATIVE_PATTERN_RULES,
  NO_QUANTIFICATION_RULES,
  getSharedRules,
} from "./rules";

// Topics exports
export {
  getModuleTopics,
  getCompactCategoryList,
  getCompactFormatList,
} from "./topics";

// Generator exports (main API)
export { getSystemPrompt } from "./generators/systemPrompt";
export { getRefinementPrompt } from "./generators/refinementPrompt";
export { getManualQuestionAssistPrompt } from "./generators/manualPrompt";
export { getJSONSyntaxFixPrompt } from "./generators/jsonFixPrompt";

// Legacy export for backwards compatibility
export const getLLMSpecificInstructions = (): string => "";
