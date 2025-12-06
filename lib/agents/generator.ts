/**
 * STEP 1: CONTENT-FOCUSED GENERATOR
 *
 * Purpose: Generate high-quality educational quiz questions
 * Focus: Pedagogical value, NOT syntax constraints
 * Output: Relaxed JSON format (validator will clean up)
 */

import { RelaxedQuizData, QuestionWithMetrics } from "../types";
import { getModuleInstructions, getModuleExamples } from "../prompts";

/**
 * Simplified generator prompt - focuses ONLY on content quality
 * Removes 35+ syntax constraints from original prompt
 */
export const getGeneratorPrompt = (moduleName: string): string => {
  const moduleInstructions = getModuleInstructions(moduleName);
  const isGeneralAI = moduleName === "General AI";

  // UPSC-style patterns for General AI module (Codebasics Bootcamp context)
  const upscPatterns = isGeneralAI ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 CONTEXT: Codebasics GenAI & Data Science Bootcamp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Students already know: Python, Pandas, ML basics, DL fundamentals, NLP concepts
This module: AI INDUSTRY AWARENESS (analytical, not technical implementation)
Difficulty: INTERMEDIATE - builds on bootcamp knowledge, tests reasoning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 BOOTCAMP-RELEVANT THEMES (Use 5+ per quiz)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- **Model Selection** (1-2 Qs) → SLM vs LLM for capstone projects
- **Training Data & Bias** (1-2 Qs) → How bias enters pipelines students build
- **LLM Limitations** (1-2 Qs) → Hallucination causes, context limits
- **Fine-tuning vs RAG** (1-2 Qs) → When each fits project requirements
- **Evaluation Metrics** (1 Q) → MMLU, HumanEval - what they measure
- **Career Readiness** (1 Q) → AI/ML job skills, interview topics
- **Responsible AI** (1 Q) → Data privacy, model documentation
- **Industry Tools** (1 Q) → Recent models relevant to bootcamp stack

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 UPSC QUESTION PATTERNS (Analytical, Discord-adapted)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. ASSERTION-REASON (30-35s):**
"X (A) because Y (R). True?" → Options: Both true R explains | Both true unrelated | A true R false | A false R true

**2. STATEMENT ANALYSIS (30-35s):**
"(1) X (2) Y (3) Z. Correct?" → Options: 1 only | 1 and 2 | 2 and 3 | All three

**3. HYPE VS REALITY (25s):**
"Which [claim] has evidence?" → 1 factual + 3 marketing claims

**4. CAUSE-CONSEQUENCE (25s):**
"Why does X happen?" → 4 different reasoning options

**5. CRITICAL EVALUATION (25-30s):**
"Most accurate assessment?" → Include "experts disagree" option

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ DIFFICULTY BALANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOT too simple: Assumes Python/ML/DL bootcamp knowledge
NOT too complex: No research-level math or architecture details
JUST RIGHT: Analytical reasoning about AI concepts relevant to projects/career
` : "";

  return `You are an expert educational content creator for a ${moduleName} bootcamp.
${isGeneralAI ? "\n⚠️ CRITICAL: Use web_search tool to find latest 2025 developments BEFORE generating questions!\n" : ""}
${upscPatterns}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 YOUR GOAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create 10 quiz questions that test **deep understanding** and **job-ready skills**.

The automated validator will handle formatting (time limits, option lengths, etc.).
Your job: Focus on SPECIFIC, TECHNICAL questions with concrete examples.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WHAT TO FOCUS ON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Real-World Relevance**
- Scenarios students will face on day 1 of their job
- Practical applications over theoretical memorization
- Tools and libraries they'll actually use in projects

**2. Cognitive Diversity (Bloom's Taxonomy)**
- Mix difficulty levels: recall → application → analysis → evaluation
- Recommended distribution:
  * 1 question: "Remember" (recall facts, definitions)
  * 2 questions: "Understand" (explain, describe, compare)
  * 3 questions: "Apply" (use, implement, calculate, solve)
  * 2 questions: "Analyze" (debug, investigate, examine)
  * 1-2 questions: "Evaluate" (assess, justify, recommend)
- Avoid pure memorization quizzes

**3. Educational Distractors**
- All wrong answers should be plausible (not obviously wrong)
- Base distractors on common student mistakes and misconceptions
- Each wrong answer should teach something when explained

**4. Clear Explanations**
- Explain WHY the correct answer is right
- Include reasoning, not just facts
- Help students learn from mistakes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ WHAT TO AVOID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Hallucinated Content (CRITICAL)**
- ❌ NEVER invent AI models: "GPT-5", "GPT-7", "Claude-10", "O4", "O5"
- ✅ Only use production models: GPT-4, GPT-4o, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro/Flash
- ❌ NEVER invent libraries or APIs that don't exist
- ✅ Verify everything is real and currently available (as of 2025)

**2. Marketing Hype Words**
- Forbidden: revolutionary, game-changing, groundbreaking, cutting-edge, paradigm shift
- Forbidden: disruptive, next-generation, world-class, best-in-class, unprecedented
- Use factual, technical language instead

**3. Trick Questions**
- Avoid questions that don't teach anything useful
- Avoid ambiguous questions with no clear answer
- Avoid questions based purely on memorizing obscure details

**4. Code Errors**
- All code must have correct syntax (no typos)
- Match brackets properly: \`[1, 2, 3]\` ✓
- Use correct operators: \`==\` for equality ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MODULE-SPECIFIC CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${moduleInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONCRETE EXAMPLES: Learn from High-Quality Questions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Study these examples from past successful quizzes for ${moduleName}.
Notice the SPECIFICITY pattern - every question names exact tools, functions, or scenarios:

${getModuleExamples(moduleName)}

**Key Takeaway from Examples:**
- Questions name SPECIFIC tools/libraries (Pandas, FastAPI, @property, etc.)
- Questions include CONCRETE parameters, syntax, or code snippets
- Questions reference SPECIFIC scenarios with details (not abstract concepts)
- Avoid generic "What is..." or "How does... work?" - add specific context!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SPECIFICITY REQUIREMENTS (CRITICAL FOR QUALITY!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every question MUST include specific technical context. Follow these rules:

**RULE 1: Name the Specific Tool/Library/Function**
❌ VAGUE: "What is better for data manipulation?"
✅ SPECIFIC: "Which Pandas method is recommended for filtering rows: .query() or boolean indexing?"

**RULE 2: Include Concrete Parameters/Syntax**
❌ VAGUE: "How do you configure a model?"
✅ SPECIFIC: "What does the max_depth parameter control in RandomForestClassifier?"

**RULE 3: Reference Specific Scenarios with Details**
❌ VAGUE: "When should you use regularization?"
✅ SPECIFIC: "A model with 100 features but only 50 samples shows training accuracy 100%. Which regularization prevents overfitting?"

**RULE 4: Use Exact Version/API References When Relevant**
❌ VAGUE: "What's new in AI?"
✅ SPECIFIC: "As of November 2025, which OpenAI model supports vision: GPT-4o or GPT-4-turbo?"

**FORBIDDEN VAGUE PATTERNS (Auto-rejected by validator):**
- "What is better?" → Must specify WHAT you're comparing WITH NAMES
- "Explain [broad topic]" → Must ask about a SPECIFIC aspect or implementation
- "How does [tool] work?" → Must ask about a SPECIFIC feature or function
- "What is [concept]?" → Must ask about a SPECIFIC use case, implementation, or parameter
- "Describe the difference..." → Must name BOTH specific items being compared

**Minimum Requirements:**
- Question must be ≥8 words (short = usually vague)
- Question should include at least ONE of: code syntax, specific tool name, concrete parameter, or numbered scenario
- If asking "what/how/why", must include specific context (not just "What is X?")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GOOD vs ❌ BAD QUESTION EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PYTHON:**
❌ BAD: "What is a decorator in Python?"
✅ GOOD: "What does the @property decorator do in Python classes?"
→ Good version names the SPECIFIC decorator (@property) and context (classes)

**SQL:**
❌ BAD: "How do you join tables?"
✅ GOOD: "Which SQL join type returns all rows from both tables regardless of matches: FULL OUTER JOIN or CROSS JOIN?"
→ Good version asks about SPECIFIC join types with exact names

**MACHINE LEARNING:**
❌ BAD: "What is overfitting?"
✅ GOOD: "A model shows 98% training accuracy but 72% test accuracy. What's the problem?"
→ Good version provides SPECIFIC metrics and asks for diagnosis

**DEEP LEARNING:**
❌ BAD: "How do you train a neural network?"
✅ GOOD: "In PyTorch, what's the purpose of model.eval() before making predictions?"
→ Good version names SPECIFIC library (PyTorch) and method (model.eval())

**GEN AI:**
❌ BAD: "What is RAG?"
✅ GOOD: "What is the primary purpose of vector databases in RAG (Retrieval Augmented Generation) systems?"
→ Good version asks about a SPECIFIC component (vector databases) within RAG

**KEY PATTERN SUMMARY:**
- Vague = abstract concepts without technical details
- Specific = concrete scenarios, named tools, exact parameters, code syntax
- Always ask yourself: "Could a student answer this by Googling one word, or do they need to understand implementation details?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 OUTPUT FORMAT (Relaxed - Validator Will Clean Up)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY this JSON (no markdown fences, no extra text):

{
  "module": "${moduleName}",
  "questions": [
    {
      "question": "Your question text here",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correct": 1,
      "explanation": "Why this answer is correct and why it matters for real-world work",
      "cognitive_level": "apply",
      "estimated_seconds": 25
    }
    // ... 9 more questions (total of 10)
  ]
}

**Field Explanations:**

- **question**: The question text (don't worry about character limits)
- **options**: Array of 4 answer options (don't worry about exact lengths)
- **correct**: 1, 2, 3, or 4 (which option is correct)
- **explanation**: Why the answer is right (2-3 sentences is fine)
- **cognitive_level**: remember/understand/apply/analyze/evaluate/create
- **estimated_seconds**: Rough guess (20-35 range) - validator will normalize

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FINAL CHECKLIST BEFORE OUTPUTTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **You Must Provide (Content Quality):**
- SPECIFIC questions with named tools, functions, or parameters
- Real-world scenarios with concrete details (not abstract concepts)
- Accurate technical content (no hallucinated models/APIs)
- Plausible distractors based on common student mistakes
- Clear explanations with reasoning

✅ **Validator Will Handle (Syntax/Format):**
- Exact character counts and option length balancing
- Time limit normalization to [20, 25, 30, 35]
- Answer position distribution [2-3, 2-3, 2-3, 2-3]
- JSON schema conversion to Discord bot format

**Quality Gate:** Every question should reference at least ONE specific technical detail:
- Code syntax with backticks: \`@property\`, \`df.loc[]\`
- Named library/tool: Pandas, PyTorch, FastAPI, FULL OUTER JOIN
- Concrete parameter: max_depth, learning_rate, temperature
- Numbered scenario: "98% training accuracy vs 72% test accuracy"

OUTPUT ONLY THE JSON. NO OTHER TEXT.`;
};

/**
 * Enhanced generator prompt with historical context
 * Shows examples of high-rated questions from past quizzes
 */
export const getGeneratorPromptWithHistory = (
  moduleName: string,
  historyContext?: QuestionWithMetrics[],
): string => {
  let prompt = getGeneratorPrompt(moduleName);

  if (historyContext && historyContext.length > 0) {
    // Filter for high-quality questions (good ratings, optimal difficulty)
    const topQuestions = historyContext
      .filter(
        (q) =>
          q.metrics &&
          q.metrics.correctRate > 0.3 && // Not too easy
          q.metrics.correctRate < 0.8 && // Not too hard
          q.metrics.avgStudentRating >= 4.0, // High rated
      )
      .sort((a, b) => b.metrics!.avgStudentRating - a.metrics!.avgStudentRating)
      .slice(0, 3);

    if (topQuestions.length > 0) {
      prompt += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 EXAMPLES OF HIGH-QUALITY QUESTIONS FROM PAST QUIZZES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Learn from these successful questions (high student ratings, optimal difficulty):

`;

      topQuestions.forEach((q, idx) => {
        prompt += `**Example ${idx + 1}** (Rating: ${q.metrics!.avgStudentRating.toFixed(1)}/5, Correct Rate: ${Math.round(q.metrics!.correctRate * 100)}%):\n\n`;
        prompt += `Question: ${q.question}\n`;
        prompt += `A) ${q.answer1}\n`;
        prompt += `B) ${q.answer2}\n`;
        prompt += `C) ${q.answer3}\n`;
        prompt += `D) ${q.answer4}\n`;
        prompt += `Correct: ${["A", "B", "C", "D"][q.correctAnswer - 1]}\n`;
        prompt += `Explanation: ${q.explanation}\n`;
        if (q.bloomLevel) prompt += `Cognitive Level: ${q.bloomLevel}\n`;
        prompt += `\n`;
      });

      prompt += `**What makes these questions successful:**\n`;
      prompt += `- Optimal difficulty: 30-80% correct rate (not too easy, not impossible)\n`;
      prompt += `- Real-world relevance drives higher student ratings\n`;
      prompt += `- Clear explanations help students learn from mistakes\n`;
      prompt += `- Plausible distractors based on common misconceptions\n\n`;
    }
  }

  return prompt;
};

/**
 * Parse and validate relaxed JSON from LLM output
 */
export const parseRelaxedQuizJSON = (
  jsonInput: string,
): { valid: boolean; data: RelaxedQuizData | null; errors: string[] } => {
  const errors: string[] = [];

  // Try to extract JSON from markdown fences if present
  let cleanedInput = jsonInput.trim();

  // Remove markdown json code fences
  const markdownMatch = cleanedInput.match(/```json\s*\n?([\s\S]*?)\n?```/);
  if (markdownMatch) {
    cleanedInput = markdownMatch[1].trim();
  } else {
    // Remove generic code fences
    const codeFenceMatch = cleanedInput.match(/```\s*\n?([\s\S]*?)\n?```/);
    if (codeFenceMatch) {
      cleanedInput = codeFenceMatch[1].trim();
    }
  }

  // Parse JSON
  let data: RelaxedQuizData;
  try {
    data = JSON.parse(cleanedInput);
  } catch (e) {
    errors.push(
      `❌ Invalid JSON format. Error: ${e instanceof Error ? e.message : String(e)}`,
    );
    return { valid: false, data: null, errors };
  }

  // Basic validation
  if (!data.module || typeof data.module !== "string") {
    errors.push("❌ Missing or invalid 'module' field");
  }

  if (!Array.isArray(data.questions)) {
    errors.push("❌ 'questions' must be an array");
  } else if (data.questions.length !== 10) {
    errors.push(
      `❌ Must have exactly 10 questions (found ${data.questions.length})`,
    );
  } else {
    // Validate each question
    data.questions.forEach((q, idx) => {
      const qNum = idx + 1;

      if (!q.question || typeof q.question !== "string") {
        errors.push(`❌ Q${qNum}: Missing or invalid 'question' field`);
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(
          `❌ Q${qNum}: 'options' must be an array of exactly 4 strings`,
        );
      }

      if (typeof q.correct !== "number" || q.correct < 1 || q.correct > 4) {
        errors.push(`❌ Q${qNum}: 'correct' must be 1, 2, 3, or 4`);
      }

      if (!q.explanation || typeof q.explanation !== "string") {
        errors.push(`❌ Q${qNum}: Missing or invalid 'explanation' field`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    data: errors.length === 0 ? data : null,
    errors,
  };
};
