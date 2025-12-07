import { getModuleConfig } from "../config/modules";
import { getDifficultyString, categorizeErrors } from "../config/helpers";

/**
 * LIGHTWEIGHT REFINEMENT PROMPT
 *
 * Key Design Decision: Does NOT re-send the full quiz JSON
 * - LLM chat already has the JSON in history
 * - Only sends errors/warnings + fix instructions
 * - Saves ~3000+ tokens per refinement
 */
export const getRefinementPrompt = (
  moduleName: string,
  _existingQuiz: unknown, // Kept for API compatibility, but not used in prompt
  errors: string[],
  warnings: string[],
  humanFeedback?: string,
): string => {
  const config = getModuleConfig(moduleName);
  const difficultyRule = getDifficultyString(config);
  const categories = categorizeErrors(errors, warnings);
  const hasHumanFeedback = humanFeedback && humanFeedback.trim().length > 0;

  // Build priority list (human feedback first, then categorized issues)
  const priorityFixes: string[] = [];

  if (hasHumanFeedback) {
    priorityFixes.push(
      `🔴 HUMAN FEEDBACK (HIGHEST PRIORITY):\n${humanFeedback}`,
    );
  }

  // Add categorized errors/warnings (SINGLE SOURCE - no flat list duplication)
  if (categories.hallucination.length > 0) {
    priorityFixes.push(
      `🔴 HALLUCINATION (verify facts):\n${categories.hallucination.map((e) => `  • ${e}`).join("\n")}`,
    );
  }
  if (categories.pattern.length > 0) {
    priorityFixes.push(
      `🟠 PATTERN VIOLATIONS:\n${categories.pattern.map((e) => `  • ${e}`).join("\n")}`,
    );
  }
  if (categories.timing.length > 0) {
    priorityFixes.push(
      `🟡 TIME (use ${config.timeLimits.intervals.join("|")}s only):\n${categories.timing.map((e) => `  • ${e}`).join("\n")}`,
    );
  }
  if (categories.structural.length > 0) {
    priorityFixes.push(
      `🟡 SCHEMA:\n${categories.structural.map((e) => `  • ${e}`).join("\n")}`,
    );
  }
  if (categories.content.length > 0) {
    priorityFixes.push(
      `⚪ CONTENT:\n${categories.content.map((e) => `  • ${e}`).join("\n")}`,
    );
  }

  // Count total issues for summary
  const totalErrors = errors.length;
  const totalWarnings = warnings.length;

  return `<task>Fix the quiz JSON in chat history. DO NOT regenerate - only apply fixes below.</task>

<output_constraints>
No Preamble | No Fluff | No Fence | No Hallucination | No Assumptions
</output_constraints>

<issues_summary>❌ ${totalErrors} errors | ⚠️ ${totalWarnings} warnings</issues_summary>

<fixes_required>
${priorityFixes.length > 0 ? priorityFixes.join("\n\n") : "No specific issues detected."}
</fixes_required>

<constraints>
DIFFICULTY: ${difficultyRule}
TIME: ${config.timeLimits.intervals.join("|")} seconds ONLY
SCHEMA: answer5-9="", minPoints="", maxPoints=""
OPTIONS: ${config.optionConstraints.minWords}-${config.optionConstraints.maxWords} words, equal count per question
POSITIONS: Each 1-4 appears 2-3x, no consecutive repeats
</constraints>

<auto_scan_and_fix>
Even if not in issues above, DETECT and FIX:
• QUANTIFICATION: Replace specific numbers/percentages with relative terms (significant, minimal, most)
• VERBOSE: Compact statements to 8-10 words max
• ROBOTIC OPTIONS: Fix fragmented phrases that don't complete the question naturally
  - "Edge-first priority" ❌ → "Industry prioritizes edge AI" ✓
  - "Cloud obsolete" ❌ → "Cloud is becoming outdated" ✓
  - TEST: Read "Question? + Option" as one sentence - must sound natural
• STATEMENT OPTIONS: Only "1 only", "2 only", "Both", "Neither" - no percentages
</auto_scan_and_fix>

<output>Return ONLY corrected JSON. Single line. No markdown. Starts { ends }</output>`;
};
