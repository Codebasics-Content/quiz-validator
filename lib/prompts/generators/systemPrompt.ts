import { VALIDATION_RULES } from "../../utils";
import { getModuleConfig, getModuleInstructions } from "../config/modules";
import { getDateContext } from "../config/helpers";
import { getModuleTopics } from "../topics";

/**
 * SYSTEM PROMPT GENERATOR
 * Context-Engineered for optimal LLM performance
 *
 * Based on 2025 research:
 * - Anthropic: "smallest set of high-signal tokens"
 * - Karpathy: "delicate art of filling context window with just the right information"
 * - XML tags for structural organization
 * - Primacy effect: Critical rules at START
 * - Recency effect: Verification at END
 */
export const getSystemPrompt = (moduleName: string): string => {
  const moduleInstructions = getModuleInstructions(moduleName);
  const dateContext = getDateContext();
  const config = getModuleConfig(moduleName);
  const { questionsPerQuiz, timeLimits, optionConstraints } = config;
  const timeIntervalsStr = timeLimits.intervals.join("|");
  const moduleTopics = getModuleTopics(moduleName, dateContext);

  return `<task>Generate ${questionsPerQuiz} quiz questions for ${moduleName}</task>

<output_constraints>
No Preamble | No Fluff | No Fence | No Hallucination | No Assumptions
</output_constraints>

<context>
DATE: ${dateContext.isoDate}
AUDIENCE: Codebasics Bootcamp (DS/AI students)
OUTPUT: Single-line JSON, no markdown fences
</context>

<critical_rules>
1. WEB_SEARCH MANDATORY - STRICTLY LAST 1 MONTH ONLY
2. CURRENT DATE: ${dateContext.fullDate} (${dateContext.isoDate})
3. NEVER use older data - AI changes too fast, only current month is relevant
4. NEVER hallucinate - only use verified data from search results
5. TEST reasoning, not recall - "Why X causes Y" not "What is X"
</critical_rules>

<strict_diversity>
⚠️ MANDATORY: NO REPETITION + RANDOM SHUFFLE ORDER

${moduleTopics.questionTypes}

${moduleTopics.topics}

${moduleTopics.forbidden ? `\n${moduleTopics.forbidden}\n` : ""}
⚠️ SHUFFLE RULE: Do NOT follow any fixed pattern!
❌ BAD: Q1-Q10 following sequential topic order from list above
✓ GOOD: Randomize both TYPE and TOPIC assignment across Q1-Q10

❌ FAILS VALIDATION:
- Same topic in multiple questions
- Same question type >2 times
- Less than 6 different question types
- Sequential/predictable ordering pattern
</strict_diversity>
${moduleTopics.style ? `\n<question_style>\n${moduleTopics.style}\n</question_style>` : ""}
${moduleTopics.difficulty ? `\n<difficulty_distribution>\n${moduleTopics.difficulty}\n</difficulty_distribution>` : ""}

<schema>
{"module":"${moduleName}","questions":[{"id":"Q1","question":"${VALIDATION_RULES.question.min}-${VALIDATION_RULES.question.max} chars (${VALIDATION_RULES.question.statementBased.max} for statement-based)","answer1":"opt","answer2":"opt","answer3":"opt","answer4":"opt","answer5":"","answer6":"","answer7":"","answer8":"","answer9":"","correctAnswer":1,"minPoints":"","maxPoints":"","explanation":"${optionConstraints.explanationMinWords}-${optionConstraints.explanationMaxWords} words WHY","timeLimit":25,"imageUrl":""}]}

TYPES: id=string | correctAnswer,timeLimit=INTEGER | minPoints,maxPoints=""
TIME: ${timeIntervalsStr} seconds only
⚠️ LEARNER PSYCHOLOGY - DISCORD COMPACT RULES:
- GIF spam + mobile + 20-35s = MUST be readable at a glance
- Cognitive load: MAX 2 short statements, not 3-4 long ones
- Statement stem: MAX 20 chars ("About AI energy:")
- Each statement: MAX 50 chars (8-10 words)
- Total question: MAX 250 chars (statement-based)
- Options: MAX 12 chars each ("1,2" not "1 and 2 only")
- Direct questions PREFERRED over statement-based (30% vs 40%)
</schema>

<anti_exploit>
OPTIONS: ${optionConstraints.minWords}-${optionConstraints.maxWords} words, ALL SAME count per question
POSITIONS: Each 1-4 appears 2-3x, NO consecutive repeats → [1,3,2,4,1,3,4,2,3,4]✓
LENGTH: Correct answer NOT always longest - randomize
TONE: All options equally confident - no hedging giveaways
</anti_exploit>

<forbidden>
STEMS: "What is X?" | "Define X" | "How does X work?"
BUSINESS: "How would a company..." | "For production deployment..."
VAGUE: "It depends" | "Better performance" | "More efficient"
STATS: Unverified percentages or claims without research backing
</forbidden>

${moduleInstructions}

<verification>
[ ] IDs: Q1-Q${questionsPerQuiz} (plain numbers)
[ ] Options: ${optionConstraints.minWords}-${optionConstraints.maxWords} words, EQUAL per question
[ ] Positions: Each 1-4 used 2-3x, no consecutive repeats
[ ] ⚠️ TOPICS: ${questionsPerQuiz} UNIQUE topics - NO REPEATS
[ ] ⚠️ TYPES: At least 6 different question types, max 2 of same
[ ] Explanations: ${optionConstraints.explanationMinWords}-${optionConstraints.explanationMaxWords} words with WHY
[ ] Time: Only ${timeIntervalsStr}s
[ ] JSON: Single line, starts { ends }
</verification>`;
};
