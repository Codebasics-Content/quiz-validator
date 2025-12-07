import { VALIDATION_RULES } from "../../utils";
import { getModuleConfig, getModuleInstructions } from "../config/modules";
import {
  getDateContext,
  getDifficultyString,
  getTimeRulesFromConfig,
} from "../config/helpers";
import { getSharedRules } from "../rules";
import { getCompactCategoryList, getCompactFormatList } from "../topics";

/**
 * MANUAL QUESTION ASSIST PROMPT
 * For converting Excel/text input to quiz JSON
 */
export const getManualQuestionAssistPrompt = (
  moduleName: string,
  userQuestions: string,
  humanFeedback?: string,
): string => {
  const moduleInstructions = getModuleInstructions(moduleName);
  const config = getModuleConfig(moduleName);
  const dateContext = getDateContext();
  const difficultyRule = getDifficultyString(config);
  const timeRules = getTimeRulesFromConfig(config);
  const isGeneralAI = moduleName === "General AI";
  const hasHumanFeedback = humanFeedback && humanFeedback.trim().length > 0;

  const compactCategories = getCompactCategoryList(moduleName);
  const compactFormats = getCompactFormatList(moduleName);

  const moduleSpecificInstructions = isGeneralAI
    ? `
<general_ai_requirements>
⚠️ MODULE: "General AI" = AI AWARENESS (UPSC Style) - NOT technical Gen AI!
STYLE: UPSC Current Affairs - analytical, awareness-based
WEB SEARCH: MANDATORY - LAST 1 MONTH ONLY (${dateContext.searchDate})

${compactFormats}
${compactCategories}

FORMAT PATTERNS (for converting user questions):
- Statement-based: "Consider statements: 1)... 2)... Which is/are correct?"
- Assertion-Reason (Q10): "Assertion (A):... Reason (R):... Select correct answer"
- Match: "Match pairs: 1-A, 2-B... How many correct?"

FORBIDDEN: Code|RAG|Fine-tuning how-tos
</general_ai_requirements>
`
    : `
<module_requirements>
${compactCategories}
${compactFormats}
DIFFICULTY: ${difficultyRule}
STYLE: Test REASONING not recall | WHY not WHAT | Debugging scenarios
</module_requirements>
`;

  return `<output_constraints>
No Preamble | No Fluff | No Fence | No Hallucination | No Assumptions
</output_constraints>

<critical_rules>
⚠️ RULE 1: WEB_SEARCH MANDATORY - Verify ALL facts before conversion
⚠️ RULE 2: CURRENT DATE: ${dateContext.fullDate} (${dateContext.isoDate}) - STRICTLY LAST 1 MONTH ONLY
⚠️ RULE 3: REORDER questions by difficulty - user order may be WRONG
⚠️ RULE 4: Statement-based/Assertion-Reason → ALWAYS 30-35s (needs reading time)
⚠️ RULE 5: Simple direct questions → 20s (EASY) position
</critical_rules>

<mandatory_reordering>
⚠️ USER'S QUESTION ORDER MAY BE INCORRECT - YOU MUST FIX IT!

ANALYZE each question and assign correct position:
- EASY questions (direct, single-concept) → Q1-Q2 (20s)
- MEDIUM questions (multi-step reasoning) → Q3-Q7 (25s)
- HARD questions (complex analysis, multi-statement) → Q8-Q9 (30s)
- VERY HARD questions (Assertion-Reason, 4+ statements) → Q10 (35s)

QUESTION TYPE → TIME MAPPING:
- Direct factual question → 20s (EASY)
- Cause-consequence → 25s (MEDIUM)
- 2-3 statement question → 25-30s (MEDIUM-HARD)
- 4+ statement question → 30-35s (HARD)
- Assertion-Reason format → 35s (VERY HARD - always Q10)
- Match-the-following → 30s (HARD)

⚠️ IF user puts Assertion-Reason at Q1 → MOVE IT TO Q10
⚠️ IF user puts simple question at Q10 → MOVE IT TO Q1-Q2
</mandatory_reordering>

<task>Convert user questions to ${moduleName} quiz JSON format</task>

<user_input>
${userQuestions}
</user_input>
${
  hasHumanFeedback
    ? `
⚠️⚠️⚠️ PRIORITY 1: HUMAN FEEDBACK (MUST ADDRESS FIRST) ⚠️⚠️⚠️
<human_feedback>
${humanFeedback}
</human_feedback>

The human feedback above takes HIGHEST PRIORITY. Address these concerns while converting.
If human feedback specifies changes, APPLY THEM during conversion.
`
    : ""
}
<conversion_rules>
1. PRESERVE question content/topic - do not rewrite the actual question text
2. REORDER questions by complexity (user order may be wrong!)
3. ASSIGN correct timeLimit based on question type (see mapping above)
4. If user provided <10 questions, generate remaining to reach 10
5. Ensure DIVERSITY in topics and formats
</conversion_rules>

<strict_time_rules>
TIME ASSIGNMENT (NON-NEGOTIABLE):
${timeRules}

DIFFICULTY DESCRIPTIONS:
- EASY: direct single-concept questions
- MEDIUM: multi-step reasoning
- HARD: complex multi-statement
- VERY HARD: Assertion-Reason or 4+ statements

STATEMENT-BASED DETECTION:
If question contains ANY of these → minimum 30s:
- "Consider the following statements"
- "How many statements are correct"
- "Assertion (A):" / "Reason (R):"
- "Match the following"
- "Statement-I" / "Statement-II"
- Multiple numbered points (1), (2), (3)...

⚠️ Assertion-Reason format → ALWAYS 35s and position Q10
</strict_time_rules>

${moduleInstructions}
${moduleSpecificInstructions}

<shared_rules>
${getSharedRules()}
</shared_rules>

<schema>
{"module":"${moduleName}","questions":[...]}
Fields: id, question(${VALIDATION_RULES.question.min}-${VALIDATION_RULES.question.max} chars, ${VALIDATION_RULES.question.statementBased.max} for statement-based), answer1-4(${config.optionConstraints.minWords}-${config.optionConstraints.maxWords} words EQUAL), answer5-9(""), correctAnswer(1-4 INTEGER), minPoints(""), maxPoints(""), explanation(${config.optionConstraints.explanationMinWords}-${config.optionConstraints.explanationMaxWords} words), timeLimit(${config.timeLimits.intervals.join("|")}), imageUrl("")

⚠️ LEARNER PSYCHOLOGY - DISCORD COMPACT RULES:
- GIF spam + mobile + 20-35s = MUST be readable at a glance
- Cognitive load: MAX 2 short statements, not 3-4 long ones
- Statement stem: MAX 20 chars | Each statement: MAX 50 chars
- Total question: MAX 250 chars (statement-based) | Options: MAX 12 chars
- Direct questions PREFERRED over statement-based
</schema>

<verification_checklist>
BEFORE OUTPUT, CONFIRM:
[ ] Q1-Q2 are EASY direct questions at 20s?
[ ] Q3-Q7 are MEDIUM reasoning questions at 25s?
[ ] Q8-Q9 are HARD multi-statement questions at 30s?
[ ] Q10 is VERY HARD (Assertion-Reason preferred) at 35s?
[ ] Statement-based questions have 30-35s?
[ ] All facts verified via web search?
[ ] Questions reordered by actual complexity (not user order)?
</verification_checklist>

<output>
Single-line JSON only. No markdown. Starts { ends }
</output>`;
};
