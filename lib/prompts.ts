export const getModuleInstructions = (moduleName: string): string => {
  const instructions: Record<string, string> = {
    Python: `
**PYTHON FOUNDATIONS - BOOTCAMP REQUIREMENTS:**
- Focus: FastAPI, Streamlit, Pandas, decorators, generators, exception handling
- Context: Bootcamp students building real-world data science projects
- Code syntax: Use backticks - \`variable = value\` for inline, triple backticks for blocks
- Realistic scenarios: API endpoints, data pipelines, automation scripts
- Error messages: Actual Python errors (TypeError, KeyError, AttributeError)
- Libraries: Only use pandas, numpy, streamlit, fastapi (no obscure packages)
- Difficulty: Entry-level to intermediate data science applications`,

    SQL: `
**SQL & DATABASES - BOOTCAMP REQUIREMENTS:**
- Focus: CTEs, window functions, stored procedures, triggers, normalization
- Context: Analytics queries for business intelligence and data engineering
- Syntax: PostgreSQL/MySQL standard (no Oracle-specific features)
- Realistic scenarios: Customer analytics, sales reports, data warehouse queries
- Table names: Use realistic business contexts (customers, orders, products, transactions)
- Difficulty: Practical queries bootcamp grads will write on day 1 of job`,

    "Math/Stats": `
**MATH & STATISTICS - BOOTCAMP REQUIREMENTS:**
- Focus: Distributions, hypothesis testing, A/B testing, correlation, probability
- Context: Applied statistics for data science, not theoretical math
- Formulas: Use clear notation, explain in context of data analysis
- Realistic scenarios: A/B test analysis, feature engineering, model evaluation
- Avoid: Pure mathematical proofs or abstract theory
- Difficulty: Conceptual understanding needed for ML work`,

    "Machine Learning": `
**MACHINE LEARNING - BOOTCAMP REQUIREMENTS:**
- Focus: Regularization, ensemble methods, hyperparameters, ROC curves, cross-validation
- Context: Supervised learning projects (classification, regression)
- Libraries: scikit-learn, XGBoost, pandas (bootcamp standard stack)
- Realistic scenarios: Customer churn, fraud detection, price prediction
- Hyperparameters: Realistic values (learning_rate=0.001-0.1, not 100)
- Projects: Tie to bootcamp capstone projects (healthcare, e-commerce, finance)
- Difficulty: Job-ready ML practitioner level`,

    "Deep Learning": `
**DEEP LEARNING - BOOTCAMP REQUIREMENTS:**
- Focus: PyTorch, CNNs, RNNs, transfer learning, optimizers, batch norm
- Context: Computer vision and sequence modeling projects
- Code: Correct PyTorch syntax (torch.nn, torch.optim)
- Architectures: ResNet, LSTM, Transformer (real models bootcamp teaches)
- Realistic scenarios: Image classification, sentiment analysis, time series
- Projects: Align with bootcamp CV/NLP projects
- Difficulty: Intermediate DL practitioner implementing standard architectures`,

    NLP: `
**NLP & TRANSFORMERS - BOOTCAMP REQUIREMENTS:**
- Focus: BERT, Hugging Face transformers, embeddings, tokenization, fine-tuning
- Context: Modern NLP for text classification, QA, sentiment analysis
- Real models: bert-base-uncased, roberta-large, distilbert (from Hugging Face)
- Code: Correct transformers library syntax (AutoModel, AutoTokenizer)
- Realistic scenarios: Chatbots, document classification, entity extraction
- Projects: RAG systems, fine-tuning for domain-specific tasks
- Difficulty: Production NLP engineer using pre-trained models`,

    "Gen AI": `
**GENERATIVE AI (COURSE) - BOOTCAMP REQUIREMENTS:**
- Focus: RAG, LangChain, ChromaDB, vector databases, prompts, LLM parameters
- Context: Building production RAG applications and AI agents
- Tools: LangChain, ChromaDB, Pinecone, OpenAI API (bootcamp teaches these)
- Code: LangChain v0.1+ syntax (verify in docs)
- Realistic scenarios: Document QA, customer support bots, knowledge bases
- Parameters: temperature (0-1), top_p (0-1), context windows (realistic sizes)
- Projects: RAG chatbots for bootcamp final projects
- Difficulty: Junior Gen AI engineer building LLM applications
- NO invented LangChain methods - verify all APIs in documentation`,

    "General AI": `
**GEN AI NEWS & TRENDS - BOOTCAMP REQUIREMENTS:**
⚠️ CRITICAL: Use web_search tool for latest 2025 developments BEFORE writing
- Search queries: "AI models 2025", "generative AI breakthroughs 2025", "AI safety 2025"
- Context: Keep bootcamp students updated on industry trends for job market
- Real models ONLY: Claude Sonnet 4.5, GPT-5, o3, Gemini 2.5/3 (from search results)
- Focus areas: Reasoning models, AI agents, multimodal, RAG advancements, AI safety
- Sources: Always cite - "According to [source], in [month] 2025..."
- Career relevance: How trends affect Gen AI job roles bootcamp grads pursue
- NO hallucinated features/models - everything must be verified from search
- Difficulty: Industry awareness for bootcamp graduates entering job market`,
  };

  return instructions[moduleName] || "";
};

export const getLLMSpecificInstructions = (provider: string): string => {
  const instructions: Record<string, string> = {
    claude: `
**INSTRUCTIONS FOR CLAUDE (Anthropic):**
- You can use <thinking> tags for complex reasoning before outputting JSON
- After thinking, output ONLY the JSON, no other text
- Claude handles long context well - detailed questions are fine
- For General AI: Use web_search tool to find latest 2025 trends`,

    gpt: `
**INSTRUCTIONS FOR ChatGPT (OpenAI):**
- System message: Instructions below
- User message: "Generate 10 quiz questions for: [MODULE]"
- Assistant response: ONLY JSON, no markdown code fences
- GPT-5 recommended for educational content quality
- For General AI: Use web search or browsing if available`,

    gemini: `
**INSTRUCTIONS FOR GEMINI (Google):**
- Gemini 2.5/3 recommended for educational content
- Use "thinking mode" for complex quiz generation
- Output ONLY JSON, no explanations before/after
- For General AI: Leverage Google Search integration for 2025 trends`,

    other: `
**INSTRUCTIONS FOR YOUR LLM:**
- Ensure JSON output without markdown formatting
- If it adds explanations, extract just the JSON
- Test with simple example before full 10-question quiz
- For General AI: Web search capability required for latest trends`,
  };

  return instructions[provider] || instructions.other;
};

export const getSystemPrompt = (
  moduleName: string,
  llmProvider: string,
): string => {
  const moduleInstructions = getModuleInstructions(moduleName);
  const llmInstructions = getLLMSpecificInstructions(llmProvider);
  const isGeneralAI = moduleName === "General AI";

  return `You are generating 10 quiz questions for a bootcamp Discord bot quiz system.
${isGeneralAI ? "\n⚠️ CRITICAL: Use web_search tool to find latest 2025 developments BEFORE generating questions!\n" : ""}
**MODULE:** ${moduleName}

${moduleInstructions}

${llmInstructions}

**JSON FORMAT (EXACT - Discord bot database schema):**
{
  "module": "${moduleName}",
  "questions": [
    {
      "id": "Q1",
      "question": "Question text here (30-200 chars)",
      "answer1": "Option 1 text (15-70 chars)",
      "answer2": "Option 2 text (15-70 chars)",
      "answer3": "Option 3 text (15-70 chars)",
      "answer4": "Option 4 text (15-70 chars)",
      "answer5": "",
      "answer6": "",
      "answer7": "",
      "answer8": "",
      "answer9": "",
      "correctAnswer": 1,
      "minPoints": "",
      "maxPoints": "",
      "explanation": "12-18 word explanation why this answer is correct",
      "timeLimit": 30,
      "imageUrl": ""
    }
    // ... 9 more questions (Q2-Q10)
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 CRITICAL: OPTION LENGTH BALANCING (PREVENTS STUDENT EXPLOITS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Students will exploit length patterns if you're not careful. Follow these rules EXACTLY:

**RULE 1: ±5 CHARACTER BALANCE (MANDATORY)**
- All 4 options MUST be within 5 characters of each other
- Formula: max_length - min_length ≤ 5
- Count every character including spaces and punctuation

**RULE 2: CORRECT ANSWER MUST NOT BE LONGEST (CRITICAL)**
- Students learn "pick the longest option" if correct is always longest
- ALWAYS make a WRONG answer the longest option
- This breaks the length heuristic students try to use

**RULE 3: MINIMUM 15 CHARACTERS PER OPTION**
- Every option must be ≥ 15 characters
- Add qualifying context to short options

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ANTI-PATTERN REQUIREMENTS FOR ANSWER POSITIONS (CRITICAL!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Students WILL try to game your quiz by detecting patterns. You MUST prevent this:

**MANDATORY BALANCED DISTRIBUTION:**
- Each position (1, 2, 3, 4) MUST appear **2-3 times** across 10 questions
- Total must equal 10: [3,3,2,2] ✅ or [2,3,3,2] ✅ or [3,2,2,3] ✅
- FORBIDDEN: [5,2,1,2] ❌ or [4,4,1,1] ❌ or [1,1,1,7] ❌

**STRICT RULES:**
✅ ALLOWED distributions:
   - [3,3,2,2] - Perfect balance
   - [2,3,3,2] - Slight middle bias
   - [3,2,2,3] - Slight edge bias
   - [2,2,3,3] - Sequential balance

❌ FORBIDDEN (creates exploits):
   - Any position appearing >4 times (position favoritism)
   - Any position appearing <1 time (position exclusion)
   - Perfectly alternating patterns: [1,2,3,4,1,2,3,4,1,2] (too predictable)

**HOW TO VERIFY BEFORE SUBMITTING:**
1. Count correctAnswer values: position 1 appears ___ times
2. Count correctAnswer values: position 2 appears ___ times
3. Count correctAnswer values: position 3 appears ___ times
4. Count correctAnswer values: position 4 appears ___ times
5. Ensure all counts are 2-3 (occasionally 1-4 acceptable if balanced)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ NORMALIZED TIME LIMIT ALLOCATION (USE ONLY [20, 25, 30, 35])
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CRITICAL: Use ONLY these 4 standard intervals: 20, 25, 30, 35 seconds**

DO NOT use: 21s, 22s, 23s, 24s, 26s, 27s, 28s, 29s, 31s, 32s, 33s, 34s ❌

**DECISION MATRIX:**

| Question Type | Complexity | timeLimit | Examples |
|---------------|------------|-----------|----------|
| **Simple Recall** | What is X? Which of these? True/False | **20s** | "What is supervised learning?" |
| **Medium** | Scenarios, comparisons, best practices | **25s** | "When should you use cross-validation?" |
| **Complex** | Calculations, code analysis, debugging | **30s** | "Calculate accuracy: 85/100 samples" |
| **Very Hard** | Multi-step debugging, edge cases | **35s** | "Debug code with model.fit error" |

**COMPLEXITY DETECTION GUIDE:**
- Has code blocks (backticks)? → minimum 25s, usually 30s
- Has debugging/errors? → 30-35s
- Has calculations/math? → 25-30s
- Has "compare" or "vs"? → 25-30s
- Simple "what is" or "which"? → 20-25s

**MANDATORY DISTRIBUTION ACROSS 10 QUESTIONS:**
- 2-3 questions at **20s** (simple concepts)
- 3-4 questions at **25s** (medium difficulty)
- 3-4 questions at **30s** (complex/code/math)
- 1-2 questions at **35s** (debugging/edge cases)

**FORBIDDEN:**
❌ All questions at same time (e.g., all 30s)
❌ Using non-standard times (21s, 28s, 31s, etc.)
❌ Simple "What is..." question with 35s
❌ Complex debugging question with 20s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 TRUE/FALSE ANTI-EXPLOIT TACTICS (CRITICAL FOR LEARNER INTEGRITY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Students will exploit True/False patterns. You MUST use these tricks:

**TRICK 1: ABSOLUTE LANGUAGE TRAPS**
❌ BAD: "Machine learning always requires labeled data" (obviously false - "always")
✅ GOOD: "Supervised learning typically requires labeled training data" (nuanced, harder to guess)

**TRICK 2: PARTIAL TRUTHS**
- Make FALSE options 80% correct with one critical flaw
- Example: "Cross-validation splits data into training and testing sets" (FALSE - it's train/validation, not train/test for CV)

**TRICK 3: DOUBLE NEGATIVES**
- "It's incorrect to say that unsupervised learning never uses labels" (TRUE - tricky!)
- Forces reading comprehension, not keyword matching

**TRICK 4: CONTEXT-DEPENDENT ANSWERS**
- "In scikit-learn's RandomForestClassifier, n_estimators=100 is the default" (TRUE in v0.22+, FALSE in earlier)
- Add "in X version" or "as of Y" to avoid pure memorization

**TRICK 5: MIX TRUE/FALSE POSITIONS**
- Don't make all TRUE answers position 1 and FALSE answers position 2/3/4
- Distribute True/False answers across all 4 positions
- Include non-binary options when possible ("Both A and B", "None of these")

**FORBIDDEN TRUE/FALSE PATTERNS:**
❌ "Always", "Never", "All", "None" (students know these are usually false)
❌ Binary True/False questions (too easy - use 4 options with nuance)
❌ Obvious keyword matching ("ML" in question → pick option with "ML")

**RECOMMENDED APPROACH:**
Instead of True/False, use:
- "Which statement is most accurate?"
- "Which approach is recommended for X scenario?"
- "What happens when Y occurs?"
This forces comprehension over binary guessing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ENHANCED QUESTION TYPE DISTRIBUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**REQUIRED MIX for 10 questions:**

1. **Situational/Scenario** (2-3 questions) - Time: 25-30s
2. **Fundamental Concepts** (2-3 questions) - Time: 20-25s
3. **Problem Solving / Calculations** (2 questions) - Time: 30s
4. **Code Debugging** (1-2 questions) - Time: 30-35s
5. **Comparative Analysis** (1 question) - Time: 25-30s
6. **Edge Cases / Consequences** (1 question) - Time: 25-30s

**FINAL VERIFICATION CHECKLIST (MANDATORY - REVIEW BEFORE OUTPUT):**

✅ **Answer Distribution (Count correctAnswer values):**
   □ Position 1 appears 2-3 times (not 0, not >4)
   □ Position 2 appears 2-3 times (not 0, not >4)
   □ Position 3 appears 2-3 times (not 0, not >4)
   □ Position 4 appears 2-3 times (not 0, not >4)
   □ Total = 10 questions

✅ **Time Limits (Only [20, 25, 30, 35] allowed):**
   □ 2-3 questions at 20s (simple)
   □ 3-4 questions at 25s (medium)
   □ 3-4 questions at 30s (complex)
   □ 1-2 questions at 35s (very hard)
   □ NO non-standard times (21s, 28s, 31s, etc.)

✅ **Option Balancing:**
   □ All options within ±5 characters per question
   □ Correct answer is NOT the longest option (make a wrong answer longest)
   □ All options ≥15 characters

✅ **Question Variety:**
   □ At most 4 questions use "Your/You're"
   □ All 6 question types represented (situational, fundamental, problem-solving, code-debug, comparative, edge-case)
   □ No repetitive sentence starters
   □ Technical terms varied across questions
   □ Mix of personal and impersonal tones

✅ **True/False Tricks:**
   □ No absolute language ("always", "never", "all", "none")
   □ No simple binary True/False questions
   □ Partial truths and context-dependent answers used

✅ **JSON Format:**
   □ minPoints = "" (empty string)
   □ maxPoints = "" (empty string)
   □ answer5 through answer9 = "" (empty strings)
   □ imageUrl = "" (empty string)

OUTPUT ONLY THE JSON. NO OTHER TEXT. NO MARKDOWN FENCES.`;
};

// Categorize errors by type for targeted refinement
const categorizeErrors = (errors: string[], warnings: string[]) => {
  const categories = {
    structural: [] as string[],
    content: [] as string[],
    pattern: [] as string[],
    hallucination: [] as string[],
    timing: [] as string[],
  };

  [...errors, ...warnings].forEach((issue) => {
    const lower = issue.toLowerCase();

    // Hallucination errors (highest priority)
    if (
      lower.includes("model") ||
      lower.includes("gpt") ||
      lower.includes("claude") ||
      lower.includes("gemini") ||
      lower.includes("hallucinated") ||
      lower.includes("deprecated") ||
      lower.includes("hype") ||
      lower.includes("buzzword") ||
      lower.includes("marketing")
    ) {
      categories.hallucination.push(issue);
    }
    // Structural errors
    else if (
      lower.includes("schema") ||
      lower.includes("missing") ||
      lower.includes("field") ||
      lower.includes("json") ||
      lower.includes("format") ||
      lower.includes("type")
    ) {
      categories.structural.push(issue);
    }
    // Pattern/distribution errors
    else if (
      lower.includes("distribution") ||
      lower.includes("position") ||
      lower.includes("pattern") ||
      lower.includes("consecutive") ||
      lower.includes("balanced")
    ) {
      categories.pattern.push(issue);
    }
    // Timing errors
    else if (lower.includes("time") || lower.includes("second")) {
      categories.timing.push(issue);
    }
    // Content errors (option length, correctness, etc.)
    else {
      categories.content.push(issue);
    }
  });

  return categories;
};

export const getRefinementPrompt = (
  moduleName: string,
  existingQuiz: any,
  errors: string[],
  warnings: string[],
): string => {
  const categories = categorizeErrors(errors, warnings);
  const hasHallucination = categories.hallucination.length > 0;
  const hasPattern = categories.pattern.length > 0;
  const hasStructural = categories.structural.length > 0;
  const hasContent = categories.content.length > 0;
  const hasTiming = categories.timing.length > 0;

  let specificGuidance = "";

  // Hallucination-specific guidance (CRITICAL)
  if (hasHallucination) {
    specificGuidance += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 CRITICAL: HALLUCINATION FIXES REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**HALLUCINATION ISSUES DETECTED:**
${categories.hallucination.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Model References**: Replace hallucinated models with verified production models
   - Valid: GPT-4, GPT-4o, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro/Flash
   - Invalid: GPT-5, GPT-7, Claude-10, O4, O5
   - Use web search if uncertain about current models

2. **Hype Words**: Remove ALL marketing buzzwords
   - Forbidden: revolutionary, game-changing, groundbreaking, cutting-edge, paradigm shift
   - Replace with factual, technical language

3. **Code Syntax**: Fix all syntax errors in code snippets
   - Match brackets: \`[1, 2, 3]\` ✓
   - Fix typos: \`print()\` not \`pirnt()\`
   - Correct operators: \`==\` for equality, not \`=\`
`;
  }

  // Pattern-specific guidance
  if (hasPattern) {
    specificGuidance += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PATTERN & DISTRIBUTION FIXES REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**DISTRIBUTION ISSUES DETECTED:**
${categories.pattern.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Balanced Distribution**: Each position (1, 2, 3, 4) must appear 2-3 times
   - Target: [3,3,2,2] ✅ or [2,3,3,2] ✅
   - Forbidden: [5,2,1,2] ❌ or [4,4,1,1] ❌

2. **No Consecutive Patterns**: Avoid 4+ consecutive same position answers
   - Example: Position 1 appearing in Q1, Q2, Q3, Q4 ❌

3. **Redistribution Strategy**:
   - Identify over-represented positions (count >3)
   - Change ONLY the correctAnswer field to balance
   - Update options if needed to make new answer factually correct
`;
  }

  // Timing-specific guidance
  if (hasTiming) {
    specificGuidance += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ TIME LIMIT FIXES REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**TIMING ISSUES DETECTED:**
${categories.timing.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Only Use Standard Intervals**: 20s, 25s, 30s, 35s
   - DO NOT use: 21s, 22s, 23s, 31s, 33s, etc.

2. **Time Allocation Guide**:
   - 20s: Short factual recall, simple definitions
   - 25s: Standard conceptual questions, code reading (5-10 lines)
   - 30s: Complex comparisons, debugging scenarios
   - 35s: Advanced edge cases, architectural decisions

3. **Normalization**: Round existing times to nearest standard interval
   - 21s → 20s, 27s → 25s, 31s → 30s, 34s → 35s
`;
  }

  // Content-specific guidance
  if (hasContent) {
    specificGuidance += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CONTENT QUALITY FIXES REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CONTENT ISSUES DETECTED:**
${categories.content.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Option Length Balance**:
   - All options ≥15 characters (prevents "None" exploit)
   - Length variance ≤40 characters (longest - shortest)
   - Correct answer should NOT always be longest

2. **Option Quality**:
   - All options must be plausible distractors
   - Avoid obviously wrong options like "None" or "All of the above"
   - Vary option lengths naturally across questions
`;
  }

  // Structural-specific guidance
  if (hasStructural) {
    specificGuidance += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ STRUCTURAL FIXES REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**STRUCTURAL ISSUES DETECTED:**
${categories.structural.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Schema Compliance**:
   - answer5-answer9 = "" (empty strings)
   - minPoints = 0, maxPoints = 0
   - correctAnswer is 1, 2, 3, or 4 (not 0 or 5+)
   - imageUrl = "" (empty string unless provided)

2. **Field Types**:
   - All text fields must be strings
   - Numeric fields (correctAnswer, timeLimit, minPoints, maxPoints) must be numbers
   - No missing required fields
`;
  }

  return `You are refining an existing bootcamp quiz that has validation errors. Your task is to fix ONLY the identified issues while preserving the original questions and content intent.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 EXISTING QUIZ (DO NOT REGENERATE - ONLY FIX ERRORS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(existingQuiz, null, 2)}
${specificGuidance}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 GENERAL REFINEMENT INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CRITICAL: PRESERVE THE ORIGINAL INTENT**
- DO NOT change question topics or learning objectives
- DO NOT change correct answers' factual content (only position if needed for distribution)
- DO NOT rewrite questions from scratch
- ONLY fix the specific validation errors listed above

**PRIORITY ORDER (Fix in this sequence):**
1. ❗ Hallucination issues (HIGHEST PRIORITY - factual accuracy)
2. 🏗️ Structural issues (schema compliance)
3. 📊 Pattern/distribution issues (balance correct answers)
4. ⏱️ Timing issues (normalize to standard intervals)
5. 📝 Content quality issues (option lengths, clarity)

**VERIFICATION BEFORE OUTPUT:**
${hasHallucination ? "□ All hallucinated models replaced with verified production models\n□ All hype words removed\n□ All code syntax errors fixed\n" : ""}${hasPattern ? "□ Answer distribution balanced: [2-3, 2-3, 2-3, 2-3]\n□ No position appears >3 times\n□ No 4+ consecutive same position\n" : ""}${hasTiming ? "□ All time limits use only: 20s, 25s, 30s, 35s\n□ Times match question complexity\n" : ""}${hasContent ? "□ All options ≥15 characters\n□ Length variance ≤40 characters\n□ Correct answer NOT always longest\n" : ""}${hasStructural ? '□ Schema compliance: answer5-9="", minPoints=0, maxPoints=0\n□ correctAnswer is 1-4 only\n' : ""}□ Original question topics/content preserved
□ No new errors introduced

OUTPUT ONLY THE CORRECTED JSON. NO MARKDOWN FENCES. NO EXPLANATIONS.`;
};

export const getManualQuestionAssistPrompt = (
  moduleName: string,
  userQuestions: string,
  llmProvider: string = "claude",
): string => {
  const moduleInstructions = getModuleInstructions(moduleName);
  const llmSpecificInstructions = getLLMSpecificInstructions(llmProvider);

  return `You are converting manually collected questions into a properly formatted bootcamp quiz JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 USER-PROVIDED QUESTIONS (PRESERVE THESE EXACTLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${userQuestions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 YOUR TASK: CONVERT TO QUIZ JSON FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CRITICAL RULES:**
1. **PRESERVE USER CONTENT**: Use the exact questions provided above - DO NOT rewrite or change topics
2. **ONLY ADD WHAT'S MISSING**: If user provided 5 questions, generate 5 more to reach 10 total
3. **MATCH USER'S STYLE**: New questions should match difficulty/style of user's questions
4. **NO ASSUMPTIONS**: If a question is unclear, keep it as-is (user will refine later)

${moduleInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 TECHNICAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ANTI-HALLUCINATION VALIDATION:**
1. **Model Names**: Only use production models (GPT-4, GPT-4o, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro/Flash)
   - NEVER hallucinate: "GPT-5", "GPT-7", "Claude-10", "O4", "O5"
   - Mark deprecated with context: "GPT-3.5 (deprecated 2024)" ✓
   - If uncertain about a model, use web search to verify

2. **Hype Words - FORBIDDEN**: Revolutionary, game-changing, groundbreaking, cutting-edge, state-of-the-art, paradigm shift, disruptive, next-generation, industry-leading, world-class, best-in-class, mission-critical, enterprise-grade, military-grade, unprecedented

3. **Code Syntax Validation**:
   - Match brackets: \`[1, 2, 3]\` ✓, \`[1, 2, 3\` ❌
   - No typos: \`print()\` ✓, \`pirnt()\` ❌
   - Comparison operators: \`==\` for equality ✓, \`=\` ❌
   - No empty calls: \`function()\` ❌ (must have purpose)

**MANDATORY BALANCED DISTRIBUTION:**
- Each position (1, 2, 3, 4) MUST appear **2-3 times** across 10 questions
- Total must equal 10: [3,3,2,2] ✅ or [2,3,3,2] ✅
- FORBIDDEN: [5,2,1,2] ❌ or [4,4,1,1] ❌
- Never place correct answer in same position for 4+ consecutive questions

**CRITICAL: Use ONLY these 4 standard intervals: 20, 25, 30, 35 seconds**
DO NOT use: 21s, 22s, 23s, 24s, 26s, 27s, 28s, 29s, 31s, 32s, 33s, 34s ❌

Time allocation guide:
- 20s: Short factual recall, simple definitions, basic syntax
- 25s: Standard conceptual questions, code reading (5-10 lines)
- 30s: Complex comparisons, debugging scenarios, multi-step reasoning
- 35s: Advanced edge cases, performance analysis, architectural decisions

**MODULE-SPECIFIC TIME ADJUSTMENTS:**
- Python: Standard (no adjustment)
- SQL: +5% (complex query analysis)
- Math/Stats: +10% (formula interpretation)
- Machine Learning: +5% (hyperparameter reasoning)
- Deep Learning: +10% (architecture understanding)

**OPTION BALANCE:**
- All options ≥15 characters (prevents "None" exploit)
- Length variance ≤40 characters (longest - shortest)
- Correct answer should NOT always be longest option
- Vary option lengths naturally across questions

**TRUE/FALSE ANTI-EXPLOIT TACTICS:**

**TRICK 1: ABSOLUTE LANGUAGE TRAPS**
❌ BAD: "Machine learning always requires labeled data"
✅ GOOD: "Supervised learning typically requires labeled data"

Absolute words to avoid in TRUE statements: always, never, all, none, every, must, impossible, guaranteed

**TRICK 2: REVERSED DEFINITIONS**
❌ BAD: "Overfitting occurs when model performs well on training data" (too obvious)
✅ GOOD: "A model with high training accuracy but low test accuracy shows signs of underfitting" (FALSE - tests understanding)

**TRICK 3: SUBTLE TECHNICAL ERRORS**
✅ GOOD: "In Python, \`is\` and \`==\` can be used interchangeably for comparing integers" (FALSE - tricky!)
✅ GOOD: "ReLU activation function outputs values between 0 and 1" (FALSE - it's unbounded above)

**TRICK 4: COMMON MISCONCEPTIONS**
✅ GOOD: "Increasing the number of trees in Random Forest always improves accuracy" (FALSE - diminishing returns)
✅ GOOD: "Correlation equals causation when r > 0.9" (FALSE - classic trap)

**TRICK 5: CONTEXT-DEPENDENT STATEMENTS**
✅ GOOD: "Batch normalization should always be applied before activation functions" (FALSE - debatable/context-dependent)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 JSON SCHEMA (EXACT FORMAT REQUIRED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "module": "${moduleName}",
  "questions": [
    {
      "id": "1",
      "question": "User's first question text (PRESERVE EXACTLY)",
      "answer1": "Option A text (≥15 chars)",
      "answer2": "Option B text (≥15 chars)",
      "answer3": "Option C text (≥15 chars)",
      "answer4": "Option D text (≥15 chars)",
      "answer5": "",
      "answer6": "",
      "answer7": "",
      "answer8": "",
      "answer9": "",
      "correctAnswer": 1,
      "minPoints": 0,
      "maxPoints": 0,
      "explanation": "Why this answer is correct (2-3 sentences)",
      "timeLimit": 25,
      "imageUrl": ""
    }
  ]
}

${llmSpecificInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VERIFICATION CHECKLIST (BEFORE SUBMITTING)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CONTENT PRESERVATION:**
□ User's questions copied EXACTLY (no rewording)
□ Only generated additional questions if user provided <10
□ New questions match user's difficulty level

**ANTI-HALLUCINATION:**
□ All model names verified (no GPT-5, Claude-10, O4)
□ Zero hype words used (revolutionary, game-changing, etc.)
□ All code syntax validated (brackets matched, no typos)
□ Web search used for any uncertain facts

**DISTRIBUTION & PATTERNS:**
□ Answer distribution balanced: [2-3, 2-3, 2-3, 2-3]
□ No position appears >3 times or <2 times
□ No 4+ consecutive same position answers

**TIME LIMITS:**
□ Only used: 20s, 25s, 30s, or 35s (no 21s, 23s, 31s, etc.)
□ Module adjustment applied correctly
□ Time matches question complexity

**OPTIONS:**
□ All options ≥15 characters
□ Length variance ≤40 characters
□ Correct answer NOT always longest
□ Plausible distractors (not obviously wrong)

**SCHEMA COMPLIANCE:**
□ answer5-answer9 = "" (empty strings)
□ minPoints = 0, maxPoints = 0
□ correctAnswer is 1, 2, 3, or 4 (not 0 or 5+)
□ imageUrl = "" (empty string)

OUTPUT ONLY THE JSON. NO OTHER TEXT. NO MARKDOWN FENCES.`;
};
