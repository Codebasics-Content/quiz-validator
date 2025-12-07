/**
 * SHARED RULES - Single Source of Truth
 * Import individual rules or getSharedRules() for all
 */

export { POLITICAL_CONTENT_RULES } from "./political";
export { HYPE_VS_REALITY_RULES } from "./hypeReality";
export { QUESTION_TYPE_DIVERSITY_RULES } from "./questionTypes";
export { DISCORD_COMPACT_RULES, QUESTION_STYLE_RULES } from "./discordCompact";
export {
  STATEMENT_OPTIONS_RULES,
  NEGATIVE_PATTERN_RULES,
  NO_QUANTIFICATION_RULES,
} from "./statementPatterns";

// Re-import for getSharedRules
import { POLITICAL_CONTENT_RULES } from "./political";
import { HYPE_VS_REALITY_RULES } from "./hypeReality";
import { QUESTION_TYPE_DIVERSITY_RULES } from "./questionTypes";
import { DISCORD_COMPACT_RULES, QUESTION_STYLE_RULES } from "./discordCompact";
import {
  STATEMENT_OPTIONS_RULES,
  NEGATIVE_PATTERN_RULES,
  NO_QUANTIFICATION_RULES,
} from "./statementPatterns";

/**
 * Get all shared rules as a single block for injection
 * Use this when you need ALL rules in one prompt section
 */
export const getSharedRules = (): string => {
  return `${POLITICAL_CONTENT_RULES}

${HYPE_VS_REALITY_RULES}

${QUESTION_TYPE_DIVERSITY_RULES}

${DISCORD_COMPACT_RULES}

${STATEMENT_OPTIONS_RULES}

${NEGATIVE_PATTERN_RULES}

${NO_QUANTIFICATION_RULES}

${QUESTION_STYLE_RULES}`;
};
