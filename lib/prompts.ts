import {
  getRandomExamples,
  getModulePatternDescription,
  formatExamplesForPrompt,
  MODULE_PATTERNS_MAP,
  type ModulePatterns,
} from "./questionPatterns";

// ============================================================================
// DYNAMIC CONTEXT ENGINEERING - Configuration Objects
// ============================================================================

/**
 * Dynamic configuration - NO HARDCODED VALUES
 * All values injected at runtime
 */
export interface QuizConfig {
  questionsPerQuiz: number;
  timeLimits: {
    min: number;
    max: number;
    intervals: number[];
  };
  difficultyDistribution: {
    hard: { count: number; timeRange: string };
    medium: { count: number; timeRange: string };
    easy: { count: number; timeRange: string };
  };
  optionConstraints: {
    minWords: number;
    maxWords: number;
    explanationMinWords: number;
    explanationMaxWords: number;
  };
}

// Default configuration - can be overridden per module
const DEFAULT_CONFIG: QuizConfig = {
  questionsPerQuiz: 10,
  timeLimits: {
    min: 20,
    max: 35,
    intervals: [20, 25, 30, 35],
  },
  difficultyDistribution: {
    hard: { count: 1, timeRange: "30-35s" },
    medium: { count: 7, timeRange: "25-30s" },
    easy: { count: 2, timeRange: "20-25s" },
  },
  optionConstraints: {
    minWords: 1,
    maxWords: 6,
    explanationMinWords: 12,
    explanationMaxWords: 18,
  },
};

/**
 * Get module-specific configuration
 * Extracts from MODULE_PATTERNS_MAP dynamically
 */
const getModuleConfig = (moduleName: string): QuizConfig => {
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];
  if (!modulePatterns) return DEFAULT_CONFIG;

  // Parse time ranges from patterns to determine distribution
  const patterns = modulePatterns.patterns;
  const hardPatterns = patterns.filter((p) => p.timeRange.includes("35") || p.timeRange.includes("30-35"));
  const easyPatterns = patterns.filter((p) => p.timeRange.includes("20") || p.timeRange.includes("20-25"));

  return {
    ...DEFAULT_CONFIG,
    difficultyDistribution: {
      hard: { count: 1, timeRange: hardPatterns[0]?.timeRange || "30-35s" },
      medium: { count: 7, timeRange: "25-30s" },
      easy: { count: 2, timeRange: easyPatterns[0]?.timeRange || "20-25s" },
    },
  };
};

/**
 * Extract themes from module patterns dynamically
 */
const extractThemesFromPatterns = (moduleName: string): string[] => {
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];
  if (!modulePatterns) return [];

  return modulePatterns.patterns.map((p) => p.name);
};

/**
 * Generate difficulty distribution string dynamically
 */
const generateDifficultyDistribution = (config: QuizConfig): string => {
  const { hard, medium, easy } = config.difficultyDistribution;
  return `- HARD (${hard.timeRange}): ${hard.count} question
- MEDIUM (${medium.timeRange}): ${medium.count} questions
- EASY (${easy.timeRange}): ${easy.count} questions`;
};

/**
 * Generate pattern list from module patterns dynamically
 */
const generatePatternList = (moduleName: string): string => {
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];
  if (!modulePatterns) return "";

  return modulePatterns.patterns
    .map((p) => `- ${p.name} (${p.timeRange}): ${p.description}`)
    .join("\n");
};

/**
 * Generate theme distribution from examples dynamically
 */
const generateThemeDistribution = (moduleName: string): string => {
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];
  if (!modulePatterns) return "";

  // Group examples by pattern to count themes
  const patternCounts: Record<string, number> = {};
  modulePatterns.examples.forEach((ex) => {
    patternCounts[ex.pattern] = (patternCounts[ex.pattern] || 0) + 1;
  });

  // Generate distribution based on pattern variety
  const themes = Object.keys(patternCounts);
  if (themes.length === 0) return "";

  return themes.slice(0, 9).map((theme, i) => `${i + 1}. ${theme}: 1-2 questions`).join("\n");
};

/**
 * Generate verification checklist dynamically based on module
 */
const generateVerificationChecklist = (moduleName: string, config: QuizConfig): string => {
  const baseChecklist = `[ ] IDs: Q1, Q2, Q3... Q${config.questionsPerQuiz} (plain numbers only)
[ ] **EQUAL WORDS**: All 4 options in EACH question have SAME word count (${config.optionConstraints.minWords}-${config.optionConstraints.maxWords} words)
[ ] **SAME TONE**: All options equally confident (no hedging giveaways)
[ ] **LENGTH RANDOMIZED**: Correct answer NOT always longest
[ ] Position distribution: Each 1-4 appears 2-3 times, NO consecutive repeats
[ ] Topic diversity: All ${config.questionsPerQuiz} questions cover DIFFERENT topics/themes
[ ] **COHERENCE**: Each question is ONE flowing thought (no orphan statements)
[ ] Explanations: ${config.optionConstraints.explanationMinWords}-${config.optionConstraints.explanationMaxWords} words MAX
[ ] **LEARNER-CENTRIC**: NO business/stakeholder language
[ ] Time limits: ONLY ${config.timeLimits.intervals.join(", ")} seconds
[ ] Numbers: correctAnswer, timeLimit are INTEGERS; minPoints, maxPoints are ""
[ ] JSON: Single line, no breaks, no markdown fences`;

  // Add module-specific checklist items
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];
  if (modulePatterns && (moduleName === "General AI" || moduleName === "Gen AI")) {
    const themes = extractThemesFromPatterns(moduleName);
    return `${baseChecklist}

## ${moduleName.toUpperCase()} SPECIFIC:
[ ] **DIFFICULTY DISTRIBUTION**: ${generateDifficultyDistribution(config)}
[ ] **THEME COVERAGE**: ${themes.slice(0, 9).join(", ")}
[ ] **NO DUPLICATE THEMES**: Each question covers a DIFFERENT theme`;
  }

  return baseChecklist;
};

/*
 * PSYCHOLOGICAL PRINCIPLES APPLIED (Codebasics Standards):
 *
 * CORE PRINCIPLES:
 * 1. DUAL-PROCESS THEORY (Kahneman): Force Type 2 analytical thinking, not Type 1 guessing
 * 2. DESIRABLE DIFFICULTIES (Bjork): Productive struggle enhances long-term retention
 * 3. PLAUSIBLE DISTRACTORS (Haladyna): Target specific misconceptions with "almost right" answers
 * 4. ELABORATIVE INTERROGATION: Explanations answer "WHY" to strengthen memory encoding
 * 5. TESTING EFFECT: Questions designed for retrieval practice, not recognition
 *
 * ADVANCED PRINCIPLES (Research-Backed):
 * 6. HYPERCORRECTION EFFECT: High-confidence errors are MORE likely corrected after feedback
 *    → Target confident misconceptions; surprising corrections stick better
 * 7. PREDICTION ERROR FRAMEWORK: Discrepancy between expectation and outcome triggers deeper learning
 *    → Make wrong options "feel right" then correct with clear principle
 * 8. COGNITIVE LOAD THEORY: Reduce extraneous load, maximize germane load
 *    → Keep stems positive (avoid NOT/EXCEPT), short options, one concept per question
 * 9. DEEPER PROCESSING: Application questions > factual recall for transfer
 *    → WHY/HOW questions beat WHAT questions for learning
 * 10. GENERATION EFFECT: Actively generating answers > passive recognition
 *    → Force reasoning, not pattern matching
 *
 * ANTI-PATTERN PRINCIPLES:
 * - EQUAL WORD COUNT per question prevents length-based guessing
 * - SHUFFLED POSITIONS prevent position-based patterns
 * - POSITIVE FRAMING reduces cognitive load vs "NOT/EXCEPT" questions
 *
 * EXPLANATION FORMAT (Revision-Focused):
 * - State the PRINCIPLE (not just the fact)
 * - Connect to BROADER CONCEPT (aids transfer)
 * - Include CONTRAST (what it's NOT and why)
 */

const MODULE_EXAMPLES: Record<string, any[]> = {
  Python: [
    {
      id: "PY-EX1",
      // COGNITIVE TRAP: All options sound technical, but only one addresses the mechanism
      // WORD COUNT: 3 words each | CORRECT ANSWER: Position 2
      question: "A 10GB CSV causes MemoryError with list comprehension. Why would a generator expression fix this?",
      answer1: "Compresses data automatically", // 3 words
      answer2: "Yields items lazily", // 3 words - CORRECT
      answer3: "Uses disk storage", // 3 words
      answer4: "Enables parallel processing", // 3 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 2,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Generators yield items lazily because they compute on-demand, unlike lists storing all values upfront.",
      timeLimit: 25,
      imageUrl: "",
      note: "EQUAL WORDS: 3 words each | CORRECT: Position 2",
    },
    {
      id: "PY-EX2",
      // MISCONCEPTION TARGET: Beginners confuse decorators with inheritance
      // WORD COUNT: 4 words each | CORRECT ANSWER: Position 4
      question: "Why does `@staticmethod` NOT receive `self` or `cls` as first parameter?",
      answer1: "Python removes unused parameters", // 4 words
      answer2: "Inherits from different class", // 4 words
      answer3: "Decorator strips first argument", // 4 words
      answer4: "No instance context needed", // 4 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Static methods need no instance context because they are utility functions, unlike methods requiring self or cls.",
      timeLimit: 25,
      imageUrl: "",
      note: "EQUAL WORDS: 4 words each | CORRECT: Position 4",
    },
    {
      id: "PY-EX3",
      // FORCES REASONING: Must understand async event loop, not just syntax
      // WORD COUNT: 5 words each | CORRECT ANSWER: Position 1
      question: "FastAPI: `async def fetch(): return requests.get(url)`. Why does this BLOCK despite async keyword?",
      answer1: "Sync library blocks event loop", // 5 words - CORRECT
      answer2: "Missing await before return statement", // 5 words
      answer3: "Async only for FastAPI routes", // 5 words
      answer4: "HTTP GET always blocks execution", // 5 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 1,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Sync libraries block the event loop because async requires library support. Use httpx or aiohttp instead.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 5 words each | CORRECT: Position 1",
    },
  ],

  SQL: [
    {
      id: "SQL-EX1",
      // MISCONCEPTION: Beginners think CTE = performance optimization
      // WORD COUNT: 4 words each | CORRECT ANSWER: Position 3
      question: "Your recursive CTE is slower than expected. Why does CTE NOT guarantee better performance than subquery?",
      answer1: "CTEs disable query optimizer", // 4 words
      answer2: "Recursive CTEs need indexes", // 4 words
      answer3: "Same execution plan generated", // 4 words - CORRECT
      answer4: "CTEs materialize to disk", // 4 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 3,
      minPoints: "",
      maxPoints: "",
      explanation:
        "CTEs improve readability, not speed, because most databases inline them like subqueries.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 4 words each | CORRECT: Position 3",
    },
    {
      id: "SQL-EX2",
      // FORCES REASONING: Must understand window function mechanics, not just syntax
      // WORD COUNT: 5 words each | CORRECT ANSWER: Position 4
      question: "DENSE_RANK() returns 1,1,2 for values 100,100,90. Why NOT 1,1,3 like RANK()?",
      answer1: "Counts only distinct value entries", // 5 words
      answer2: "RANK function is now deprecated", // 5 words
      answer3: "Ignores NULL values during ranking", // 5 words
      answer4: "No gaps after tie values", // 5 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "DENSE_RANK continues sequence without gaps because it counts distinct values, unlike RANK which skips.",
      timeLimit: 25,
      imageUrl: "",
      note: "EQUAL WORDS: 5 words each | CORRECT: Position 4",
    },
    {
      id: "SQL-EX3",
      // COGNITIVE TRAP: All options are real SQL issues, but only one fits the symptom
      // WORD COUNT: 3 words each | CORRECT ANSWER: Position 1
      question: "Query returns NULL for `AVG(score)` even with valid data. Which scenario causes this?",
      answer1: "WHERE filters everything", // 3 words - CORRECT
      answer2: "Missing explicit CAST", // 3 words
      answer3: "Wrong column type", // 3 words
      answer4: "Missing GROUP BY", // 3 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 1,
      minPoints: "",
      maxPoints: "",
      explanation:
        "AVG returns NULL on empty sets because aggregates on zero rows produce NULL, not zero.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 3 words each | CORRECT: Position 1",
    },
  ],

  "Math/Stats": [
    {
      id: "STAT-EX1",
      // MISCONCEPTION: p-value is THE probability the hypothesis is true
      // WORD COUNT: 4 words each | CORRECT ANSWER: Position 2
      question: "p-value = 0.03. A colleague says there is 3% chance the null is true. Why is this interpretation WRONG?",
      answer1: "Divide by sample size", // 4 words
      answer2: "Assumes null already true", // 4 words - CORRECT
      answer3: "Means 97% confidence level", // 4 words
      answer4: "Only works one-tailed", // 4 words (fixed from 5)
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 2,
      minPoints: "",
      maxPoints: "",
      explanation:
        "P-value assumes null is true because it measures P(data|H0), not P(H0|data).",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 4 words each | CORRECT: Position 2",
    },
    {
      id: "STAT-EX2",
      // FORCES REASONING: Must understand relationship, not just formula
      // WORD COUNT: 3 words each | CORRECT ANSWER: Position 4
      question: "95% CI is [45, 55]. If you increase sample size 4x, the new CI width is approximately?",
      answer1: "Quarter original width", // 3 words
      answer2: "Same width unchanged", // 3 words
      answer3: "Double original width", // 3 words
      answer4: "Half original width", // 3 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "CI width is proportional to 1/sqrt(n), so quadrupling samples only halves the width.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 3 words each | CORRECT: Position 4",
    },
    {
      id: "STAT-EX3",
      // COGNITIVE TRAP: All options are real statistical concerns
      // WORD COUNT: 5 words each | CORRECT ANSWER: Position 3
      question: "A/B test shows p=0.001 but lift=0.1%. Why is statistical significance misleading here?",
      answer1: "Low p-value indicates overfitting", // 5 words
      answer2: "Requires minimum five percent lift", // 5 words (fixed from 6)
      answer3: "Effect too small for impact", // 5 words - CORRECT
      answer4: "Low p-values mean bad data", // 5 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 3,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Statistical significance differs from practical significance because large samples detect tiny, meaningless effects.",
      timeLimit: 25,
      imageUrl: "",
      note: "EQUAL WORDS: 5 words each | CORRECT: Position 3",
    },
  ],

  "Machine Learning": [
    {
      id: "ML-EX1",
      // MISCONCEPTION: Accuracy is always the right metric
      // WORD COUNT: 4 words each | CORRECT ANSWER: Position 1
      question: "Fraud detection: 99.9% accuracy, but catches 0 frauds. Why is accuracy MISLEADING here?",
      answer1: "Imbalanced classes skew metric", // 4 words - CORRECT
      answer2: "Accuracy needs balanced classes", // 4 words
      answer3: "Fraud requires higher threshold", // 4 words
      answer4: "Test set shuffled incorrectly", // 4 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 1,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Accuracy misleads on imbalanced data because predicting all-majority achieves high accuracy without learning.",
      timeLimit: 25,
      imageUrl: "",
      note: "EQUAL WORDS: 4 words each | CORRECT: Position 1",
    },
    {
      id: "ML-EX2",
      // FORCES REASONING: Must understand bias-variance tradeoff
      // WORD COUNT: 5 words each | CORRECT ANSWER: Position 2
      question: "Train error: 2%, Test error: 25%, Validation error: 24%. Adding more training data will likely?",
      answer1: "Significantly reduce all three errors", // 5 words
      answer2: "Not help, needs regularization instead", // 5 words - CORRECT
      answer3: "Only increase training error value", // 5 words
      answer4: "Make validation match test exactly", // 5 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 2,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Large train-test gap indicates high variance because the model memorizes training data instead of generalizing.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 5 words each | CORRECT: Position 2",
    },
    {
      id: "ML-EX3",
      // COGNITIVE TRAP: All options are real ML concepts
      // WORD COUNT: 3 words each | CORRECT ANSWER: Position 3
      question: "Why does standardizing features AFTER train-test split cause poor generalization?",
      answer1: "Signal was removed", // 3 words
      answer2: "Wrong split order", // 3 words
      answer3: "Test data leaked", // 3 words - CORRECT
      answer4: "Needs model retraining", // 3 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 3,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Scaling on all data leaks test statistics into training because it uses future information during fitting.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 3 words each | CORRECT: Position 3",
    },
  ],

  "Deep Learning": [
    {
      id: "DL-EX1",
      // MISCONCEPTION: Dropout is "random" so seems unreliable
      // WORD COUNT: 4 words each | CORRECT ANSWER: Position 4
      question: "Dropout randomly zeros neurons during training. Why does this IMPROVE generalization rather than hurt it?",
      answer1: "Reduces model size significantly", // 4 words
      answer2: "Acts as data augmentation", // 4 words
      answer3: "Learns optimal neuron selection", // 4 words
      answer4: "Prevents neuron co-adaptation dependency", // 4 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Dropout improves generalization because neurons cannot co-adapt, forcing redundant feature learning.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 4 words each | CORRECT: Position 4",
    },
    {
      id: "DL-EX2",
      // FORCES REASONING: Must understand gradient flow, not just layer names
      // WORD COUNT: 5 words each | CORRECT ANSWER: Position 1
      question: "ResNet's skip connections solve vanishing gradients. WHY do direct additions help gradients flow?",
      answer1: "Identity path preserves gradient magnitude", // 5 words - CORRECT
      answer2: "Skip connections increase learning rate", // 5 words
      answer3: "Addition amplifies small gradient values", // 5 words
      answer4: "Residual blocks use special activations", // 5 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 1,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Skip connections preserve gradients because identity mapping provides direct gradient path, bypassing vanishing layers.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 5 words each | CORRECT: Position 1",
    },
    {
      id: "DL-EX3",
      // COGNITIVE TRAP: All are real PyTorch issues
      // WORD COUNT: 3 words each | CORRECT ANSWER: Position 3
      question: "PyTorch: Loss decreases but validation accuracy stuck at 50% (binary classification). Most likely cause?",
      answer1: "Learning rate high", // 3 words
      answer2: "Batch size small", // 3 words
      answer3: "Wrong loss function", // 3 words - CORRECT
      answer4: "Need more epochs", // 3 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 3,
      minPoints: "",
      maxPoints: "",
      explanation:
        "BCEWithLogitsLoss expects logits because it applies sigmoid internally. Double sigmoid causes meaningless predictions.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 3 words each | CORRECT: Position 3",
    },
  ],

  NLP: [
    {
      id: "NLP-EX1",
      // MISCONCEPTION: More parameters = better model
      // WORD COUNT: 4 words each | CORRECT ANSWER: Position 2
      question: "DistilBERT has 40% fewer parameters than BERT but retains 97% performance. How is this possible?",
      answer1: "Smaller models more efficient", // 4 words
      answer2: "Distillation transfers learned knowledge", // 4 words - CORRECT
      answer3: "Uses better training data", // 4 words
      answer4: "Fewer parameters reduce overfitting", // 4 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 2,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Distillation trains students on soft probabilities because teacher's confidence distribution contains more information than hard labels.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 4 words each | CORRECT: Position 2",
    },
    {
      id: "NLP-EX2",
      // FORCES REASONING: Must understand tokenization deeply
      // WORD COUNT: 5 words each | CORRECT ANSWER: Position 4
      question: "BERT tokenizer splits unhappiness into [un, ##happiness]. Why the ## prefix?",
      answer1: "Indicates suffix for grammar parsing", // 5 words
      answer2: "Signals tokenizer to merge next", // 5 words
      answer3: "Denotes rare low-frequency vocabulary items", // 5 words (fixed from 4)
      answer4: "Marks continuation of previous token", // 5 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "The ## prefix marks word continuation because it distinguishes word-start tokens from mid-word subwords.",
      timeLimit: 25,
      imageUrl: "",
      note: "EQUAL WORDS: 5 words each | CORRECT: Position 4",
    },
    {
      id: "NLP-EX3",
      // COGNITIVE TRAP: All are real fine-tuning considerations
      // WORD COUNT: 3 words each | CORRECT ANSWER: Position 1
      question: "Fine-tuning a smaller model on 500 samples gives worse results than zero-shot with a larger model. Most likely reason?",
      answer1: "Overfits small dataset", // 3 words - CORRECT
      answer2: "Model is outdated", // 3 words
      answer3: "Needs GPU clusters", // 3 words
      answer4: "Zero-shot always better", // 3 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 1,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Few-shot wins with limited data because fine-tuning on small datasets causes memorization instead of generalization.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 3 words each | CORRECT: Position 1",
    },
  ],

  "Gen AI": [
    {
      id: "GEN-EX1",
      // MISCONCEPTION: RAG = no hallucinations
      // WORD COUNT: 5 words each | CORRECT ANSWER: Position 3
      question: "Your RAG system still hallucinates despite retrieving correct documents. Why might this happen?",
      answer1: "Larger models eliminate all hallucinations", // 5 words (improved distractor)
      answer2: "Hallucinations are random and unpredictable", // 5 words
      answer3: "Context ignored if contradicts training", // 5 words - CORRECT
      answer4: "Retrieved documents were factually wrong", // 5 words (improved distractor)
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 3,
      minPoints: "",
      maxPoints: "",
      explanation:
        "RAG still hallucinates because LLMs may ignore retrieved context when it conflicts with parametric knowledge.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 5 words each | CORRECT: Position 3",
    },
    {
      id: "GEN-EX2",
      // FORCES REASONING: Must understand chunking tradeoffs
      // WORD COUNT: 4 words each | CORRECT ANSWER: Position 2
      question: "RAG retrieves relevant chunks but answers miss key context. Chunk size is 512 tokens. What's likely wrong?",
      answer1: "Exceeds model context window", // 4 words
      answer2: "Context split across chunks", // 4 words - CORRECT
      answer3: "Smaller chunks always better", // 4 words (improved - targets opposite misconception)
      answer4: "Returns too many chunks", // 4 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 2,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Small chunks improve precision but lose context because semantic meaning often spans multiple sentences.",
      timeLimit: 30,
      imageUrl: "",
      note: "EQUAL WORDS: 4 words each | CORRECT: Position 2",
    },
    {
      id: "GEN-EX3",
      // COGNITIVE TRAP: All are real considerations
      // WORD COUNT: 3 words each | CORRECT ANSWER: Position 4
      question: "LLM outputs vary wildly between runs at temperature=0.9. To get consistent outputs, which parameter change helps MOST?",
      answer1: "Increase max_tokens parameter", // 3 words
      answer2: "Add more examples", // 3 words
      answer3: "Use larger model", // 3 words
      answer4: "Lower temperature significantly", // 3 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Low temperature produces consistent outputs because it reduces randomness in token selection.",
      timeLimit: 25,
      imageUrl: "",
      note: "EQUAL WORDS: 3 words each | CORRECT: Position 4",
    },
  ],

  "General AI": [
    {
      id: "AI-EX1",
      // BOOTCAMP CONTEXT: Model selection for capstone projects
      // UPSC PATTERN: ASSERTION-REASON | Tests WHY reasoning | CORRECT: Both true + explains
      question: "Assertion: SLMs are preferred for edge deployment. Reason: They require less compute than LLMs. Is the assertion correct, and does the reason explain it?",
      answer1: "Assertion false but reason true", // 5 words
      answer2: "Both true and reason explains", // 5 words - CORRECT
      answer3: "Assertion true but reason false", // 5 words
      answer4: "Both true but reason unrelated", // 5 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 2,
      minPoints: "",
      maxPoints: "",
      explanation:
        "SLMs suit edge deployment precisely because fewer parameters means lower compute—the reason directly explains the assertion.",
      timeLimit: 35,
      imageUrl: "",
      bloomLevel: "analyze",
      note: "ASSERTION-REASON | CORRECT: Both true + explains | Position 2 | 35s",
    },
    {
      id: "AI-EX2",
      // BOOTCAMP CONTEXT: RLHF understanding
      // UPSC PATTERN: ASSERTION-REASON | CORRECT: Assertion true + reason FALSE
      question: "Assertion: RLHF aligns models to human preferences. Reason: Humans directly edit the model weights. Is the assertion correct, and does the reason explain it?",
      answer1: "Both true but reason unrelated", // 5 words
      answer2: "Both assertion and reason false", // 5 words
      answer3: "Both true and reason explains", // 5 words
      answer4: "Assertion true but reason false", // 5 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "RLHF does align models, but humans provide preference rankings—they never touch the weights directly. The reward model handles that.",
      timeLimit: 35,
      imageUrl: "",
      bloomLevel: "analyze",
      note: "ASSERTION-REASON | CORRECT: Assertion true + reason FALSE | Position 4 | 35s",
    },
    {
      id: "AI-EX3",
      // BOOTCAMP CONTEXT: RAG vs Fine-tuning decision for projects
      // UPSC PATTERN: HYPE VS REALITY | Tests critical evaluation
      question: "RAG gets a lot of hype. Which of these claims actually holds up in benchmarks?",
      answer1: "Eliminates all model hallucinations completely", // 5 words
      answer2: "Always outperforms fine-tuned model approaches", // 5 words
      answer3: "Requires no prompt optimization whatsoever", // 5 words
      answer4: "Consistently grounds responses in documents", // 5 words - CORRECT
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 4,
      minPoints: "",
      maxPoints: "",
      explanation:
        "RAG does consistently ground responses by retrieving relevant docs first—but it doesn't eliminate hallucinations or beat fine-tuning in every case.",
      timeLimit: 25,
      imageUrl: "",
      bloomLevel: "evaluate",
      note: "HYPE VS REALITY | 5-word options | Position 4 | 25s",
    },
    {
      id: "AI-EX4",
      // BOOTCAMP CONTEXT: Career readiness - interview awareness
      // UPSC PATTERN: CRITICAL EVALUATION | NATURAL CONVERSATIONAL PHRASING
      question: "Your colleague insists fine-tuning always beats RAG for accuracy. What's missing from their reasoning?",
      answer1: "Ignores data freshness requirements", // 4 words - CORRECT
      answer2: "Correct for every possible case", // 5 words
      answer3: "Wrong because RAG always wins", // 5 words
      answer4: "Only wrong for larger models", // 5 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 1,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Neither universally wins—RAG handles dynamic data better while fine-tuning excels for stable domains. Context matters.",
      timeLimit: 30,
      imageUrl: "",
      bloomLevel: "evaluate",
      note: "CRITICAL EVALUATION | Natural phrasing | Position 1 | 30s",
    },
    {
      id: "AI-EX5",
      // BOOTCAMP CONTEXT: Context window understanding
      // UPSC PATTERN: ASSERTION-REASON | CORRECT: Both FALSE
      question: "Assertion: Larger context windows eliminate hallucinations. Reason: More context means the model never forgets information. Is the assertion correct, and does the reason explain it?",
      answer1: "Both true and reason explains", // 5 words
      answer2: "Assertion true but reason false", // 5 words
      answer3: "Both assertion and reason false", // 5 words - CORRECT
      answer4: "Assertion false but reason true", // 5 words
      answer5: "",
      answer6: "",
      answer7: "",
      answer8: "",
      answer9: "",
      correctAnswer: 3,
      minPoints: "",
      maxPoints: "",
      explanation:
        "Larger context doesn't eliminate hallucinations (assertion false), and models DO lose info in long contexts—the 'lost in the middle' effect (reason also false).",
      timeLimit: 35,
      imageUrl: "",
      bloomLevel: "analyze",
      note: "ASSERTION-REASON | CORRECT: Both FALSE | Position 3 | 35s",
    },
  ],
};

// CONTEXT ENGINEERING: Dynamic random examples for diversity
// Based on Karpathy/Anthropic principles: "smallest possible set of high-signal tokens"
// Examples are RANDOMLY selected each time to create pattern diversity
export const getModuleExamples = (moduleName: string): string => {
  // Use new dynamic pattern system
  if (MODULE_PATTERNS_MAP[moduleName]) {
    const randomExamples = getRandomExamples(moduleName, 3); // Get 3 random diverse examples

    if (randomExamples.length === 0) {
      return "Follow the guidelines above.";
    }

    // Get pattern descriptions for the module
    const patternDesc = getModulePatternDescription(moduleName);

    // Format examples for prompt
    const formattedExamples = formatExamplesForPrompt(randomExamples);

    return `${patternDesc}\n\n**Randomly Selected Examples (for pattern diversity):**\n\n${formattedExamples}`;
  }

  // Fallback to old static examples if module not in new system
  const examples = MODULE_EXAMPLES[moduleName] || [];

  if (examples.length === 0) {
    return "Follow the guidelines above.";
  }

  // Take only first 2 examples (pattern learning, not memorization)
  const selectedExamples = examples.slice(0, 2);

  let output = "";
  selectedExamples.forEach((example, index) => {
    // Compact inline JSON format - no verbose verification sections
    output += `
**Example ${index + 1}** (${example.answer1.split(/\s+/).length}-word options, position ${example.correctAnswer}):
{"id":"${example.id}","question":"${example.question}","answer1":"${example.answer1}","answer2":"${example.answer2}","answer3":"${example.answer3}","answer4":"${example.answer4}","answer5":"","answer6":"","answer7":"","answer8":"","answer9":"","correctAnswer":${example.correctAnswer},"minPoints":"","maxPoints":"","explanation":"${example.explanation}","timeLimit":${example.timeLimit},"imageUrl":""}
`;
  });

  return output;
};

// Dynamic date context
const getDateContext = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.toLocaleString("default", { month: "long" }),
    day: now.getDate(),
    quarter: `Q${Math.floor(now.getMonth() / 3) + 1}`,
    weekAgo: new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    today: now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
};

const date = getDateContext();

/**
 * DYNAMIC MODULE INSTRUCTIONS GENERATOR
 * Generates instructions from MODULE_PATTERNS_MAP dynamically
 * NO HARDCODED VALUES - everything comes from pattern definitions
 */
export const getModuleInstructions = (moduleName: string): string => {
  const config = getModuleConfig(moduleName);
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];

  // Base instructions for non-pattern modules
  const baseInstructions: Record<string, { topics: string; focus: string; forbidden: string; required: string }> = {
    Python: {
      topics: "FastAPI, Pandas, decorators, generators, async/await, exceptions",
      focus: "WHY mechanisms work, not syntax recall",
      forbidden: '"What is a decorator?" | Pure syntax | No reasoning',
      required: "WHY GIL exists, HOW generators save memory, DEBUG TypeError scenarios",
    },
    SQL: {
      topics: "CTEs, window functions (RANK/DENSE_RANK), JOINs, indexing, aggregates",
      focus: "Query optimization reasoning, not syntax",
      forbidden: '"What is SELECT?" | Basic syntax | No optimization reasoning',
      required: "WHY CTE vs subquery, HOW window functions differ, DEBUG NULL scenarios",
    },
    "Math/Stats": {
      topics: "Hypothesis testing, p-values, confidence intervals, A/B testing, distributions",
      focus: "Interpretation and application, not formula recall",
      forbidden: '"What is mean?" | Pure formulas | No interpretation',
      required: "WHY p-value misinterpreted, HOW sample size affects CI, WHEN to reject null",
    },
    "Machine Learning": {
      topics: "Regularization (L1/L2), ensemble methods, metrics (F1/ROC), cross-validation, bias-variance",
      focus: "Trade-off reasoning and debugging",
      forbidden: '"What is supervised learning?" | Definitions | No trade-offs',
      required: "WHY L1 sparse, HOW ensemble reduces variance, DEBUG overfitting scenarios",
    },
    "Deep Learning": {
      topics: "PyTorch, CNNs, RNNs/Transformers, dropout, batch norm, gradient flow",
      focus: "Architecture reasoning and debugging",
      forbidden: '"What is a neural network?" | Basic definitions | No mechanism reasoning',
      required: "WHY vanishing gradients, HOW attention works, DEBUG loss not decreasing",
    },
    NLP: {
      topics: "BERT, tokenization (WordPiece), embeddings, fine-tuning, Hugging Face",
      focus: "Transformer mechanisms, not library syntax",
      forbidden: '"What is NLP?" | Basic definitions | No mechanism reasoning',
      required: "WHY subword tokenization, HOW BERT context, WHEN fine-tune vs zero-shot",
    },
  };

  // For modules with pattern definitions, generate dynamically
  if (modulePatterns && (moduleName === "Gen AI" || moduleName === "General AI")) {
    const patternList = generatePatternList(moduleName);
    const difficultyDist = generateDifficultyDistribution(config);

    // Gen AI - RESEARCH-DRIVEN DYNAMIC TOPICS (NO HARDCODING)
    if (moduleName === "Gen AI") {
      return `**CONTEXT:** Codebasics GenAI Bootcamp - students building LLM applications
**FOCUS:** Technical implementation, system design trade-offs, debugging, production decisions
**DISTINCTION:** Technical implementation (code/architecture) - NEVER overlap with General AI (industry awareness)

**⚠️ MANDATORY RESEARCH STEP - DISCOVER TOPICS DYNAMICALLY:**
1. **SEARCH** "Codebasics GenAI bootcamp curriculum" to find actual bootcamp modules
2. **SEARCH** "RAG implementation best practices ${new Date().getFullYear()}"
3. **SEARCH** "LLM application development topics ${new Date().getFullYear()}"
4. **ALIGN** questions with bootcamp brochure topics - DO NOT invent topics
5. **VERIFY** each topic is taught in the bootcamp before creating questions

**⚠️ TOPIC DISCOVERY RULES (NEVER HARDCODE):**
- Topics MUST come from web search results, NOT from this prompt
- Search for current GenAI implementation practices
- Search for bootcamp-specific curriculum alignment
- Each question topic must be VERIFIED via web search
- If a topic cannot be verified, DO NOT use it

**⚠️ DIFFICULTY DISTRIBUTION (MANDATORY - per ${config.questionsPerQuiz} questions):**
${difficultyDist}

**⚠️ PATTERN TYPES (from module definition):**
${patternList}

**STRICT SEPARATION FROM GENERAL AI:**
- Gen AI = HOW to build (code, architecture, debugging)
- General AI = WHAT is happening (industry, trends, ethics)
- NEVER ask about industry trends, ethics, laws, AGI in Gen AI
- NEVER ask about code implementation in General AI

**FORBIDDEN:** "What is an LLM?" | Basic definitions | Industry awareness questions | Ethics/Laws/AGI topics
**REQUIRED:** Implementation HOW-TOs, debugging scenarios, architecture trade-offs, production considerations`;
    }

    // General AI - Industry awareness (analytical understanding)
    if (moduleName === "General AI") {
      return `**CONTEXT:** Codebasics GenAI & Data Science Bootcamp - students know Python, ML, DL basics
**FOCUS:** AI industry awareness to complement technical skills learned in bootcamp
**DISTINCTION:** NOT Gen AI (RAG/prompting code) - this is ANALYTICAL UNDERSTANDING

**⚠️ DIFFICULTY DISTRIBUTION (MANDATORY - per ${config.questionsPerQuiz} questions):**
${difficultyDist}

**⚠️ PATTERN TYPES (from module definition):**
${patternList}

**STRICT SEPARATION FROM GEN AI:**
- General AI = WHAT is happening (industry, trends, ethics, laws, research)
- Gen AI = HOW to build (code, architecture, debugging)
- NEVER ask about code implementation, RAG debugging, chunking strategies
- NEVER overlap with Gen AI technical topics

**FORBIDDEN:** Code snippets | Deep math | RAG implementation | Chunking | Vector DB code
**REQUIRED:** WHY concepts matter, HOW trends affect careers, EVALUATE claims critically

**⚠️ RESEARCH VERIFICATION RULE:**
- SEARCH THE INTERNET for current information
- Use ONLY TIMELESS PRINCIPLES if cannot verify
- FORBIDDEN: Specific model names from training data, benchmark scores, "latest" claims
- Use relative terms: "current generation models", "recent research suggests"`;
    }
  }

  // For base modules, use simple template
  const base = baseInstructions[moduleName];
  if (base) {
    return `**TOPICS:** ${base.topics}
**FOCUS:** ${base.focus}
**FORBIDDEN:** ${base.forbidden}
**REQUIRED:** ${base.required}`;
  }

  return "";
};

export const getLLMSpecificInstructions = (provider: string): string => {
  return ""; // No provider-specific instructions needed
};

export const getSystemPrompt = (
  moduleName: string,
): string => {
  const moduleInstructions = getModuleInstructions(moduleName);
  const dateContext = getDateContext();
  const config = getModuleConfig(moduleName);

  // Dynamic values from config
  const { questionsPerQuiz, timeLimits, optionConstraints } = config;
  const timeIntervalsStr = timeLimits.intervals.join(", ");

  /*
   * CONTEXT ENGINEERING OPTIMIZED PROMPT
   * Based on Karpathy/Anthropic 2025 principles:
   * - Primacy effect: Critical rules at START
   * - Recency effect: Verification at END
   * - Minimum tokens: ~1800 vs ~5500 (67% reduction)
   * - High signal density: Each concept stated ONCE
   * - ALL VALUES INJECTED DYNAMICALLY - NO HARDCODING
   */
  return `# Generate ${questionsPerQuiz} Quiz Questions: ${moduleName}

## ⚠️ MANDATORY FIRST STEP - WEB SEARCH REQUIRED ⚠️
**TODAY'S DATE: ${dateContext.day} ${dateContext.month} ${dateContext.year}**
**AUDIENCE: Codebasics Bootcamp Learners (Data Science/AI students)**

### 🔴 CRITICAL: SEARCH FOR LATEST MODELS RELEASED AS OF TODAY 🔴
- Do NOT use older model names from your training data
- SEARCH: "latest LLM models released ${dateContext.month} ${dateContext.year}"
- SEARCH: "newest AI models ${dateContext.year}"
- USE ONLY models that web search confirms are CURRENT and RELEASED
- Models evolve rapidly - what was latest 6 months ago is outdated now

BEFORE writing ANY question, you MUST:
1. **WEB SEARCH** for 10+ DIFFERENT current ${moduleName} topics (${dateContext.month} ${dateContext.year})
2. **SEARCH FOR LATEST MODEL NAMES** - Your training data has OLD model names
   - Search "latest [company] model ${dateContext.month} ${dateContext.year}" for each provider
   - Use ONLY model names found in TODAY's web search results
   - Do NOT assume any model name from your training data is still current
3. **ONE TOPIC PER QUESTION** - Never repeat same theme/tool across multiple questions
4. **LEARNER-CENTRIC ONLY** - Questions must help STUDENTS understand concepts
   - NOT business/stakeholder/deployment focused
   - NOT "how would a company use this" or "for production systems"
   - YES "why does this work", "what happens when", "how does this concept apply"
5. **TEST UNDERSTANDING, NOT MEMORIZATION** - Every question must require REASONING
   - NOT "what is X" or "define X" (pure recall)
   - YES "why does X cause Y" or "what happens if X" (requires thinking)
6. **NEVER HALLUCINATE** - Only reference tools/models/features you found in web search
7. **NEVER CREATE VAGUE QUESTIONS** - Every question must reference specific verified tools
8. **AVOID UNPROVEN QUANTIFICATION** - Don't claim statistics unless research-backed
   - WRONG: "Why did safety practices decline by 40%?" (unproven claim)
   - WRONG: "Studies show 70% accuracy improvement" (without citation)
   - RIGHT: "Why might visible safety warnings decrease?" (observable trend)
   - RIGHT: "What could explain reduced disclaimer frequency?" (factual observation)
   - If not proven by researchers, don't state it as fact - it misleads learners
9. **NEVER COPY** example questions below - create 100% NEW content based on web search

## CRITICAL CONSTRAINTS (MUST FOLLOW)
1. **OPTIONS: ${optionConstraints.minWords}-${optionConstraints.maxWords} WORDS, EQUAL LENGTH PER QUESTION** - Anti-exploit rule!
   - ALL 4 options in ONE question MUST have SAME word count
   - Example Q1: all 3-word options | Q2: all 4-word options | Q3: all 2-word options
   - This prevents learners from guessing based on "longest answer is correct"
2. **SINGLE-LINE JSON** - Output JSON on ONE continuous line, no wrapping
3. **NEVER SPLIT WORDS** - Keep field names intact (explanation, maxPoints, timeLimit)
4. **CORRECT ANSWER: NOT ALWAYS LONGEST** - Vary which option is longest

## OPTION EXAMPLES (EQUAL WORDS PER QUESTION, 1-6 WORDS)

GOOD - All 4 options SAME word count (anti-exploit):
**Q1 (all 3 words):**
- "Reduces model variance" (3 words) ✓
- "Prevents data overfitting" (3 words) ✓
- "Increases training speed" (3 words) ✓
- "Causes gradient explosion" (3 words) ✓

**Q2 (all 4 words):**
- "Gradient vanishes in layers" (4 words) ✓
- "Memory overflow occurs frequently" (4 words) ✓
- "Caching improves query speed" (4 words) ✓
- "Batch size too large" (4 words) ✓

BAD (vague/generic - NEVER DO THIS):
- "It depends" ❌ (too vague)
- "Better performance" ❌ (not specific)
- "More efficient" ❌ (not specific)
- "Not applicable" ❌ (lazy non-answer)

BAD (unequal lengths - EXPLOITABLE):
- Q1: "Yes" (1), "No" (1), "Maybe sometimes" (2), "It depends on context" (4) ❌
- Learners will pick longest/shortest as pattern!

## ANTI-EXPLOIT RULES (CRITICAL - VIOLATIONS WILL FAIL VALIDATION)
1. **EQUAL WORD COUNT PER QUESTION** (MOST IMPORTANT ANTI-EXPLOIT RULE):
   - ALL 4 options in each question MUST have EXACTLY same word count
   - Q1: all 3-word options | Q2: all 4-word options | Q3: all 2-word options (vary across questions)
   - This PREVENTS learners from using "longest = correct" pattern
   - Range: ${optionConstraints.minWords}-${optionConstraints.maxWords} words per option, but ALL SAME within one question

2. **SAME TONE + RANDOMIZE ABSOLUTES** (NO GIVEAWAY PATTERNS):
   - All options must sound EQUALLY confident and plausible
   - WRONG: "Definitely causes errors" vs "Might sometimes cause issues" (hedging reveals wrong)
   - WRONG: One option with jargon, others plain language
   - RIGHT: All options use same confidence level, same technical depth
   - **CRITICAL**: Randomize absolutes ("always", "all", "never", "completely") between TRUE and FALSE options
   - 50% of questions: Use absolute in CORRECT answer (e.g., "Consistently retrieves context")
   - 50% of questions: Use absolute in WRONG answers (e.g., "Always beats fine-tuning")
   - This prevents "neutral = correct" exploitation

3. **CORRECT ANSWER LENGTH RANDOMIZATION** (ANTI-EXPLOIT):
   - Correct answer must NOT always be longest
   - Distribution: Shortest 2-3x, Middle 4-5x, Longest 2-3x across 10 questions
   - Make some WRONG answers longer than correct answer

4. **POSITION DISTRIBUTION - SHUFFLE LOGIC** (CRITICAL ANTI-EXPLOIT):
   - MUST use ALL 4 positions (1,2,3,4) - NEVER skip any position
   - Each position appears 2-3 times across ${questionsPerQuiz} questions
   - **NEVER REPEAT** same position in consecutive questions
   RIGHT: [1,3,2,4,1,3,4,2,3,4] ✓ | WRONG: [2,2,3,3,4,4,1,1,2,2] ❌

5. **EXPLANATION LENGTH**: ${optionConstraints.explanationMinWords}-${optionConstraints.explanationMaxWords} words MAXIMUM (count before writing!)

6. **NO UNPROVEN CLAIMS** (FACTUAL ACCURACY):
   - WRONG: "increased by 50%", "declined 3x" (unverified statistics)
   - RIGHT: "What might explain X?" (observable trend, not fake numbers)
   - Reference benchmarks by name: MMLU, HumanEval, GPQA
   - Use qualitative terms: "growing", "increasingly" instead of fake percentages

7. **TOPIC DIVERSITY** (${questionsPerQuiz} DIFFERENT TOPICS - NO REPETITION):
   - Each question MUST cover a DIFFERENT topic/theme
   - WRONG: Q1-Q3 all about same LLM (repetitive!)
   - RIGHT: Q1 RAG, Q2 fine-tuning, Q3 tokenization (diverse)

## QUESTION COHERENCE (CRITICAL FOR READABILITY)
1. **ONE FLOWING THOUGHT** - Question must read as single coherent sentence
2. **LOGICAL LINK** - Setup must directly connect to what you're asking
3. **NO ORPHAN STATEMENTS** - Never disconnected facts before question

BAD: "[Fact A]. [Unrelated Fact B]. [Question about C]?" ❌
GOOD: "When X happens, why does Y occur?" ✓
GOOD: "Given that X, which of the following about Y is correct?" ✓

## DISCORD DISPLAY CONSTRAINTS (Questions appear on mobile!)
- **Question:** 30-150 chars recommended (readable in 5-10 seconds)
- **Options:** ${optionConstraints.minWords}-${optionConstraints.maxWords} words each (fits on button, quick to scan)
- **Time:** ${timeLimits.min}-${timeLimits.max} seconds total (read + think + answer)

## JSON FORMAT (SINGLE LINE - NO BREAKS IN STRINGS)
{"module":"${moduleName}","questions":[{"id":"Q1","question":"Question text here","answer1":"Short option","answer2":"Short option","answer3":"Short option","answer4":"Short option","answer5":"","answer6":"","answer7":"","answer8":"","answer9":"","correctAnswer":1,"minPoints":"","maxPoints":"","explanation":"Reason X occurs because Y affects Z.","timeLimit":25,"imageUrl":""}]}

## FIELD REQUIREMENTS
- id: "Q1" through "Q${questionsPerQuiz}" (NOT "GAI-Q1", "AI-Q1" - use plain Q1, Q2, etc.)
- question: 30-200 chars, MUST include specific tool/syntax (see SPECIFICITY below)
- answer1-4: ${optionConstraints.minWords}-${optionConstraints.maxWords} words, ALL SAME word count per question, MEANINGFUL (not vague)
- answer5-9: "" (empty string)
- correctAnswer: INTEGER 1-4 (not string)
- timeLimit: INTEGER ${timeIntervalsStr} only
- minPoints/maxPoints: "" (empty string, NOT 0)
- explanation: ${optionConstraints.explanationMinWords}-${optionConstraints.explanationMaxWords} words MAX, MUST explain WHY using NATURAL causal language (because, since, so, thus, which means, that's why, the reason is, as, hence, this happens when, leading to). NO robotic repetition—vary your connectors!
- imageUrl: "" (empty string)

## SPECIFICITY REQUIREMENTS (LOW SCORES = VAGUE QUESTIONS)
Every question MUST include at least ONE of: tool name, API parameter, code syntax, version number, specific metric

VAGUE (FAILS - score 0-20):
- "Why do AI models hallucinate?" (no specific tool/parameter)
- "How does machine learning work?" (too generic)
- "What causes overfitting?" (no concrete scenario)

SPECIFIC (PASSES - score 50+):
- "Why does [current LLM from web search] with temperature=0.9 produce varied outputs?" (tool + parameter)
- "What causes a PyTorch model to show loss=NaN after epoch 5?" (tool + symptom)
- "For sentiment classification, why might [model A from web search] outperform [model B]?" (specific models + task)

## QUESTION DIVERSITY (Psychology-Based - Bloom's Taxonomy + Socratic Method)
MUST USE AT LEAST 6 DIFFERENT QUESTION TYPES from this list:

### Bloom's Taxonomy Stems (Higher-Order Thinking):
1. **ANALYZE**: "Compare X and Y...", "What patterns emerge when...", "How does X differ from Y..."
2. **EVALUATE**: "Which approach is more effective for...", "What criteria would you use to assess...", "Is X or Y better suited when..."
3. **APPLY**: "Given this scenario, what would...", "How would you implement X to solve...", "Apply X principle to debug..."

### Socratic Question Types (Critical Thinking):
4. **CHALLENGE ASSUMPTIONS**: "Why does X NOT work when...", "What's wrong with assuming...", "Is it always true that..."
5. **PROBE IMPLICATIONS**: "What happens if X fails...", "What are the consequences of...", "If X then what follows..."
6. **EXAMINE EVIDENCE**: "What evidence shows that...", "How do you know X causes Y...", "What supports the claim that..."

### Learner-Centric Stems (REQUIRED - NOT business/stakeholder focused):
7. **SCENARIO-DEBUG**: "What causes code X to produce error Y?", "Why would running X with config Y fail?"
8. **PREDICT-OUTPUT**: "What output does X produce when Y?", "What happens when X runs with parameter Y?"
9. **MISCONCEPTION-TRAP**: "Why does assuming X often lead to problems?", "Why is the belief that X usually incorrect?"
10. **COUNTER-INTUITIVE**: "Why does Y occur despite X?", "Why does Z happen instead of Y when X?"

**⚠️ CONNECTED QUESTIONS (Critical - No orphan sentences):**
- WRONG: "A student writes code X. What causes the error?" (Two disconnected parts)
- RIGHT: "What causes code X to produce error Y?" (One unified thought)
- WRONG: "Many assume X. Why is this wrong?" (Orphan question at end)
- RIGHT: "Why is assuming X usually incorrect?" (Integrated thought)
- WRONG: "Despite X, Y occurs. Why?" (Orphan "Why?")
- RIGHT: "Why does Y occur despite X?" (Complete question)

### FORBIDDEN Business-Oriented Stems (NEVER USE):
- "How would a company implement..." ❌
- "For production deployment..." ❌
- "A business stakeholder asks..." ❌
- "To meet enterprise requirements..." ❌
- "For customer-facing applications..." ❌

### REQUIRED MIX (${questionsPerQuiz} questions):
- 2 ANALYZE/COMPARE questions
- 2 EVALUATE/ASSESS questions
- 2 DEBUG/SCENARIO questions
- 2 PREDICT/CONSEQUENCE questions
- 2 MISCONCEPTION/ASSUMPTION questions

### FORBIDDEN (Never use these vague stems):
- "What is X?" (too basic)
- "How does X work?" (too generic)
- "Explain X" (not specific)
- "Define X" (pure memorization)

## RESEARCH REQUIREMENT (REMINDER)
You MUST have already performed WEB SEARCH before reaching this point.
- All questions must be based on ${dateContext.month} ${dateContext.year} research
- Use current tools, versions, and parameters from your web search
- Questions about outdated tools/practices will FAIL validation

${moduleInstructions ? `## MODULE CONTEXT\n${moduleInstructions}\n` : ""}
## EXAMPLES (FORMAT ONLY - DO NOT COPY CONTENT)
${getModuleExamples(moduleName)}

## FINAL VERIFICATION (COUNT BEFORE SUBMITTING)
${generateVerificationChecklist(moduleName, config)}

## JSON OUTPUT (ABSOLUTE REQUIREMENTS)
1. START with { END with } - nothing else
2. NO markdown fences (\`\`\`json)
3. NO line breaks ANYWHERE - entire JSON must be ONE continuous line
4. NO text before or after JSON
5. Straight quotes " only (no curly quotes)
6. Numbers as integers: correctAnswer:1 not "1"
7. Must pass JSON.parse()
8. NEVER wrap/split words - field names must stay intact:
   CORRECT: "explanation":"..." | WRONG: "explan ation":"..."
   CORRECT: "maxPoints":"" | WRONG: "max Points":""

OUTPUT ENTIRE JSON ON A SINGLE LINE (NO WRAPPING):`;
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
================================================================
[!] CRITICAL: HALLUCINATION FIXES REQUIRED
================================================================

**HALLUCINATION ISSUES DETECTED:**
${categories.hallucination.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Model References**: Verify ALL model names via web search before using
   - Do NOT assume any model exists - search to confirm
   - Only use models you can verify exist via current web search results
   - If uncertain, search "[model name] release date" to confirm

2. **Hype Words**: Remove ALL marketing buzzwords
   - Forbidden: revolutionary, game-changing, groundbreaking, cutting-edge, paradigm shift
   - Replace with factual, technical language

3. **Code Syntax**: Fix all syntax errors in code snippets
   - Match brackets: [1, 2, 3] [OK]
   - Fix typos: print() not pirnt()
   - Correct operators: == for equality, not =
`;
  }

  // Pattern-specific guidance
  if (hasPattern) {
    specificGuidance += `
================================================================
[PATTERN] PATTERN & DISTRIBUTION FIXES REQUIRED
================================================================

**DISTRIBUTION ISSUES DETECTED:**
${categories.pattern.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Balanced Distribution**: Each position (1, 2, 3, 4) must appear 2-3 times
   - Target counts: [3,3,2,2] ✓ or [2,3,3,2] ✓
   - Forbidden: [5,2,1,2] ❌ or [4,4,1,1] ❌

2. **NO Consecutive Repeats**: NEVER repeat same position in adjacent questions
   - WRONG: Q1=2, Q2=2 ❌ (position 2 repeats)
   - RIGHT: Q1=2, Q2=4, Q3=1, Q4=3 ✓ (all different consecutively)

3. **Shuffle Pattern Examples**:
   - [1,3,2,4,1,3,4,2,3,4] ✓ No consecutive repeats
   - [2,1,4,3,1,4,2,3,1,4] ✓ Shuffled, balanced
   - [2,2,3,3,4,4,1,1,2,2] ❌ Consecutive repeats

4. **Redistribution Strategy**:
   - Identify consecutive repeats and over-represented positions
   - Swap option positions to break consecutive patterns
   - Ensure all 4 positions used, each 2-3 times
`;
  }

  // Timing-specific guidance
  if (hasTiming) {
    specificGuidance += `
================================================================
[TIME] TIME LIMIT FIXES REQUIRED
================================================================

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
   - 21s -> 20s, 27s -> 25s, 31s -> 30s, 34s -> 35s
`;
  }

  // Content-specific guidance
  if (hasContent) {
    specificGuidance += `
================================================================
[CONTENT] CONTENT QUALITY FIXES REQUIRED
================================================================

**CONTENT ISSUES DETECTED:**
${categories.content.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **EQUAL WORD COUNT PER QUESTION** (Anti-exploit):
   - ALL 4 options in EACH question MUST have EXACTLY same word count
   - Range: 1-6 words, vary across questions (Q1: all 3-word, Q2: all 4-word)
   - NEVER vague: "Better performance", "More efficient", "It depends" ❌

2. **Option Quality**:
   - All options must be plausible distractors with specific meanings
   - Avoid obviously wrong options like "None" or "All of the above"
   - Each option must clearly explain a concept or reason
`;
  }

  // Structural-specific guidance
  if (hasStructural) {
    specificGuidance += `
================================================================
[STRUCTURE] STRUCTURAL FIXES REQUIRED
================================================================

**STRUCTURAL ISSUES DETECTED:**
${categories.structural.map((issue, idx) => `${idx + 1}. ${issue}`).join("\n")}

**FIX INSTRUCTIONS:**
1. **Schema Compliance**:
   - answer5-answer9 = "" (empty strings)
   - minPoints = "", maxPoints = "" (empty strings)
   - correctAnswer is 1, 2, 3, or 4 (not 0 or 5+)
   - imageUrl = "" (empty string unless provided)

2. **Field Types**:
   - All text fields must be strings
   - Numeric fields: correctAnswer, timeLimit must be numbers
   - minPoints, maxPoints must be "" (empty strings, NOT numbers)
   - No missing required fields
`;
  }

  return `You are refining an existing bootcamp quiz that has validation errors. Your task is to fix ONLY the identified issues while preserving the original questions and content intent.

================================================================
[QUIZ] EXISTING QUIZ (DO NOT REGENERATE - ONLY FIX ERRORS)
================================================================

${JSON.stringify(existingQuiz, null, 2)}
${specificGuidance}
================================================================
[TARGET] GENERAL REFINEMENT INSTRUCTIONS
================================================================

**CRITICAL: PRESERVE THE ORIGINAL INTENT**
- DO NOT change question topics or learning objectives
- DO NOT change correct answers factual content (only position if needed for distribution)
- DO NOT rewrite questions from scratch
- ONLY fix the specific validation errors listed above

**PRIORITY ORDER (Fix in this sequence):**
1. [!] Hallucination issues (HIGHEST PRIORITY - factual accuracy)
2. [STRUCTURE] Structural issues (schema compliance)
3. [PATTERN] Pattern/distribution issues (balance correct answers)
4. [TIME] Timing issues (normalize to standard intervals)
5. [CONTENT] Content quality issues (option lengths, clarity)

**VERIFICATION BEFORE OUTPUT:**
${hasHallucination ? "[ ] All hallucinated models replaced with verified production models\n[ ] All hype words removed\n[ ] All code syntax errors fixed\n" : ""}${hasPattern ? "[ ] Answer distribution balanced: each position 2-3 times\n[ ] NO consecutive repeats (Q1≠Q2, Q2≠Q3, etc.)\n[ ] All 4 positions used, shuffled pattern\n" : ""}${hasTiming ? "[ ] All time limits use only: 20s, 25s, 30s, 35s\n[ ] Times match question complexity\n" : ""}${hasContent ? "[ ] SIMPLE: 5-10 chars variance <=5 | CODING: 5-50 chars variance <=20\n[ ] Correct answer length RANDOMIZED (longest 2-3x, shortest 2-3x, middle 4-6x)\n" : ""}${hasStructural ? '[ ] Schema compliance: answer5-9="", minPoints="", maxPoints=""\n[ ] correctAnswer is 1-4 only\n' : ""}[ ] Original question topics/content preserved
[ ] No new errors introduced

================================================================
JSON OUTPUT RULES (CRITICAL - FOLLOW EXACTLY)
================================================================

1. **RAW JSON ONLY**: Output starts with { and ends with } - nothing else
2. **NO MARKDOWN**: Do NOT wrap in \`\`\`json or \`\`\` fences
3. **NO EXPLANATIONS**: No text before or after the JSON object
4. **STRAIGHT QUOTES ONLY**: Use " not curly quotes like " or "
5. **NO SPECIAL CHARACTERS**: Forbidden in all text fields:
   - NO: em-dash (--), curly quotes (""), ellipsis (...)
   - NO: unicode symbols, emojis, special math symbols
   - USE: hyphen (-), straight quotes ("), three periods (...)
6. **ESCAPE PROPERLY**: Use \\" for quotes inside strings, \\\\ for backslashes
7. **VALID JSON**: Must pass JSON.parse() - no trailing commas, proper brackets

OUTPUT RAW JSON ONLY. START WITH { END WITH }`;
};

export const getManualQuestionAssistPrompt = (
  moduleName: string,
  userQuestions: string,
  llmProvider: string = "claude",
): string => {
  const moduleInstructions = getModuleInstructions(moduleName);
  const llmSpecificInstructions = getLLMSpecificInstructions(llmProvider);

  return `You are converting manually collected questions into a properly formatted bootcamp quiz JSON.

================================================================
[INPUT] USER-PROVIDED QUESTIONS (PRESERVE THESE EXACTLY)
================================================================

${userQuestions}

================================================================
[TASK] CONVERT TO QUIZ JSON FORMAT
================================================================

**CRITICAL RULES:**
1. **PRESERVE USER CONTENT**: Use the exact questions provided above - DO NOT rewrite or change topics
2. **ONLY ADD WHATS MISSING**: If user provided 5 questions, generate 5 more to reach 10 total
3. **MATCH USERS STYLE**: New questions should match difficulty/style of users questions
4. **NO ASSUMPTIONS**: If a question is unclear, keep it as-is (user will refine later)

${moduleInstructions}

================================================================
[REQUIREMENTS] TECHNICAL REQUIREMENTS
================================================================

**ANTI-HALLUCINATION VALIDATION:**
1. **Model Names**: Verify ALL model names via web search before using
   - Do NOT assume any model exists or doesn't exist
   - Search for each model/tool name to confirm it's real and released
   - If web search doesn't confirm existence, DO NOT use it

2. **NO UNPROVEN QUANTIFICATION**: Don't claim statistics unless research-backed
   - WRONG: "Why did X decline by 40%?" (unproven claim)
   - RIGHT: "What might explain reduced X?" (observable trend)
   - If not proven by researchers, don't state as fact - misleads learners

3. **Hype Words - FORBIDDEN**: Revolutionary, game-changing, groundbreaking, cutting-edge, state-of-the-art, paradigm shift, disruptive, next-generation, industry-leading, world-class, best-in-class, mission-critical, enterprise-grade, military-grade, unprecedented

4. **Code Syntax Validation**:
   - Match brackets: [1, 2, 3] [OK], [1, 2, 3 [X]
   - No typos: print() [OK], pirnt() [X]
   - Comparison operators: == for equality [OK], = [X]
   - No empty calls: function() [X] (must have purpose)

================================================================
[WARNING] COMMON MISTAKES: GOOD vs BAD EXAMPLES
================================================================

**MISTAKE 1: Unverified AI Models**
[X] BAD: Using model names without verifying they exist via web search
[OK] GOOD: Web search confirms model exists, then use it in question
-> Always verify model names via web search before using them

**MISTAKE 2: Marketing Hype Words**
[X] BAD: "This revolutionary AI framework is a game-changing paradigm shift"
[OK] GOOD: "This AI framework introduces significant improvements to performance"
-> Use factual, technical language without superlatives

**MISTAKE 3: Unbalanced Option Lengths**
[X] BAD:
- answer1: "Yes" (3 chars)
- answer2: "This is a very detailed explanation of the concept..." (52 chars)
[OK] GOOD:
- answer1: "Supervised learning with labeled training data" (47 chars)
- answer2: "Unsupervised clustering without label requirements" (52 chars)
-> All options must be within +-5 characters of each other

**MISTAKE 4: Correct Answer Always Longest**
[X] BAD: correctAnswer is always the longest option (students will exploit this!)
[OK] GOOD: Vary which option is longest - sometimes make WRONG answer longest
-> Breaks student length heuristic patterns

**MISTAKE 5: Pattern-Exploitable Answer Distribution**
[X] BAD: correctAnswer sequence = [1,1,1,1,1,2,2,3,3,4] (position 1 dominates!)
[OK] GOOD: correctAnswer sequence = [1,3,2,4,1,2,3,4,2,3] (balanced 2-3 per position)
-> Each position must appear 2-3 times across 10 questions

**MISTAKE 6: Non-Standard Time Limits**
[X] BAD: timeLimit = 21, 23, 27, 31, 33 seconds (creates inconsistency)
[OK] GOOD: timeLimit = 20, 25, 30, or 35 seconds ONLY
-> Use normalized intervals for consistency

================================================================

**SHUFFLE LOGIC - POSITION DISTRIBUTION:**
- Each position (1, 2, 3, 4) MUST appear **2-3 times** across 10 questions
- **NEVER REPEAT** same position in consecutive questions
- Total must equal 10: [3,3,2,2] ✓ or [2,3,3,2] ✓

WRONG patterns:
- [2,2,3,3,4,4,1,1,2,2] ❌ Consecutive repeats
- [1,2,3,4,1,2,3,4,1,2] ❌ Too predictable

RIGHT patterns (shuffled, no consecutive repeats):
- [1,3,2,4,1,3,4,2,3,4] ✓
- [2,1,4,3,1,4,2,3,1,4] ✓
- [4,2,1,3,2,4,1,3,4,2] ✓

**CRITICAL: Use ONLY these 4 standard intervals: 20, 25, 30, 35 seconds**
DO NOT use: 21s, 22s, 23s, 24s, 26s, 27s, 28s, 29s, 31s, 32s, 33s, 34s [X]

Time allocation guide:
- 20s: Short factual recall, simple definitions, basic syntax
- 25s: Standard conceptual questions, code reading (5-10 lines)
- 30s: Complex comparisons, debugging scenarios, multi-step reasoning
- 35s: Advanced edge cases, performance analysis, architectural decisions

**MODULE-SPECIFIC TIME ADJUSTMENTS:**
- Python: Standard (no adjustment)
- SQL: +5 percent (complex query analysis)
- Math/Stats: +10 percent (formula interpretation)
- Machine Learning: +5 percent (hyperparameter reasoning)
- Deep Learning: +10 percent (architecture understanding)

**OPTION REQUIREMENTS (ANTI-EXPLOIT):**
- **EQUAL WORD COUNT**: All 4 options in EACH question MUST have SAME word count
- Range: 1-6 words per option, vary across questions (Q1: all 3-word, Q2: all 4-word, etc.)
- NEVER vague: "Better performance", "More efficient", "It depends" ❌
- Each option must clearly explain a specific concept or reason
- This prevents learners from exploiting "longest answer = correct" pattern

**TRUE/FALSE ANTI-EXPLOIT:** Avoid "always/never/all/none" keywords; use nuanced wording

================================================================
[SCHEMA] JSON SCHEMA (EXACT FORMAT REQUIRED)
================================================================

{
  "module": "${moduleName}",
  "questions": [
    {
      "id": "1",
      "question": "Users first question text (PRESERVE EXACTLY)",
      "answer1": "Option A text (>=15 chars)",
      "answer2": "Option B text (>=15 chars)",
      "answer3": "Option C text (>=15 chars)",
      "answer4": "Option D text (>=15 chars)",
      "answer5": "",
      "answer6": "",
      "answer7": "",
      "answer8": "",
      "answer9": "",
      "correctAnswer": 1,
      "minPoints": "",
      "maxPoints": "",
      "explanation": "Why this answer is correct (2-3 sentences)",
      "timeLimit": 25,
      "imageUrl": ""
    }
  ]
}

================================================================
[ACCESSIBILITY] ACCESSIBILITY BEST PRACTICES
================================================================

**Avoid images for code:**
- Prefer code in backticks over code in images
- Only use images for diagrams or visual concepts

**Default:** imageUrl = ""

================================================================
[BLOOMS] COGNITIVE DIVERSITY
================================================================

**RECOMMENDED DISTRIBUTION (if generating additional questions to reach 10):**
- 1 "Remember" (recall, define) - 20s
- 2 "Understand" (explain, describe) - 20-25s
- 3 "Apply" (calculate, implement) - 25-30s
- 2 "Analyze" (debug, investigate) - 30s
- 1-2 "Evaluate" (assess, recommend) - 30-35s
- 0-1 "Create" (design) - 35s - optional

**Match users cognitive level if they provide questions first**

================================================================
[EXAMPLES] REFERENCE EXAMPLES FOR ${moduleName}
================================================================

**Use these examples as reference for formatting (but preserve users content):**

${getModuleExamples(moduleName)}

${llmSpecificInstructions}

================================================================
[CHECKLIST] VERIFICATION CHECKLIST (BEFORE SUBMITTING)
================================================================

**CONTENT PRESERVATION:**
[ ] Users questions copied EXACTLY (no rewording)
[ ] Only generated additional questions if user provided <10
[ ] New questions match users difficulty level

**ANTI-HALLUCINATION & ACCURACY:**
[ ] All model names verified via web search before using
[ ] **NO unproven statistics** - only observable trends, not unverified claims
[ ] Zero hype words used (revolutionary, game-changing, etc.)
[ ] All code syntax validated (brackets matched, no typos)
[ ] Web search used for any uncertain facts

**SHUFFLE LOGIC & DISTRIBUTION:**
[ ] Each position (1,2,3,4) appears 2-3 times
[ ] **NO consecutive repeats** (Q1≠Q2, Q2≠Q3, Q3≠Q4, etc.)
[ ] All 4 positions used - never skip any

**TIME LIMITS:**
[ ] Only used: 20s, 25s, 30s, or 35s (no 21s, 23s, 31s, etc.)
[ ] Module adjustment applied correctly
[ ] Time matches question complexity

**OPTIONS (ANTI-EXPLOIT):**
[ ] **EQUAL WORD COUNT**: All 4 options in EACH question have SAME word count
[ ] Range: 1-6 words, vary across questions (Q1: all 3-word, Q2: all 4-word)
[ ] NO vague options: "Better performance", "More efficient", "It depends" ❌
[ ] Each option clearly explains a specific concept or reason
[ ] Plausible distractors (not obviously wrong)

**SCHEMA COMPLIANCE:**
[ ] answer5-answer9 = "" (empty strings)
[ ] minPoints = "", maxPoints = "" (empty strings)
[ ] correctAnswer is 1, 2, 3, or 4 (not 0 or 5+)
[ ] imageUrl = "" (empty string)

**ACCESSIBILITY:**
[ ] No code in images (use backticks instead)

**BLOOMS TAXONOMY (if generating additional questions):**
[ ] Cognitive diversity across Remember/Understand/Apply/Analyze/Evaluate levels
[ ] Not all questions are memorization (varies difficulty)

================================================================
JSON OUTPUT RULES (CRITICAL - FOLLOW EXACTLY)
================================================================

1. **RAW JSON ONLY**: Output starts with { and ends with } - nothing else
2. **NO MARKDOWN**: Do NOT wrap in \`\`\`json or \`\`\` fences
3. **NO EXPLANATIONS**: No text before or after the JSON object
4. **STRAIGHT QUOTES ONLY**: Use " not curly quotes like " or "
5. **NO SPECIAL CHARACTERS**: Forbidden in all text fields:
   - NO: em-dash (--), curly quotes (""), ellipsis (...)
   - NO: unicode symbols, emojis, special math symbols
   - USE: hyphen (-), straight quotes ("), three periods (...)
6. **ESCAPE PROPERLY**: Use \\" for quotes inside strings, \\\\ for backslashes
7. **VALID JSON**: Must pass JSON.parse() - no trailing commas, proper brackets

OUTPUT RAW JSON ONLY. START WITH { END WITH }`;
};

/**
 * JSON Syntax Fix Prompt - For when JSON is completely broken and cannot be parsed
 * This helps fix syntax errors like missing commas, quotes, brackets, etc.
 */
export const getJSONSyntaxFixPrompt = (
  moduleName: string,
  brokenJSON: string,
  parseError: string,
): string => {
  return `You are a JSON syntax fixer. The following quiz JSON has syntax errors and cannot be parsed.

================================================================
PARSE ERROR
================================================================
${parseError}

================================================================
BROKEN JSON (FIX THIS)
================================================================
${brokenJSON}

================================================================
REQUIRED VALID STRUCTURE
================================================================
{
  "module": "${moduleName}",
  "questions": [
    {
      "id": "Q1",
      "question": "Question text here",
      "answer1": "Option A",
      "answer2": "Option B",
      "answer3": "Option C",
      "answer4": "Option D",
      "answer5": "",
      "answer6": "",
      "answer7": "",
      "answer8": "",
      "answer9": "",
      "correctAnswer": 1,
      "minPoints": "",
      "maxPoints": "",
      "explanation": "Reason X happens because Y causes Z.",
      "timeLimit": 25,
      "imageUrl": ""
    }
  ]
}

================================================================
COMMON JSON SYNTAX ERRORS TO FIX
================================================================
1. **Missing commas** between properties or array elements
2. **Trailing commas** after last property (remove them)
3. **Unescaped quotes** inside strings (use backslash escape)
4. **Curly quotes** instead of straight quotes
5. **Missing closing brackets** } or ]
6. **Special characters** causing parse errors (em-dash, ellipsis, unicode)
7. **Field types** - correctAnswer, timeLimit must be numbers; minPoints, maxPoints must be empty strings
   - WRONG: "correctAnswer": "1" | RIGHT: "correctAnswer": 1
   - WRONG: "minPoints": 0 | RIGHT: "minPoints": ""
8. **Broken field names** - words split with spaces due to line wrapping
   - WRONG: "explanat ion", "m axPoints", "timeLim it"
   - RIGHT: "explanation", "maxPoints", "timeLimit"
   - FIX: Remove spaces from field names, keep them intact

================================================================
FIX INSTRUCTIONS
================================================================
1. Identify the syntax error from the parse error message
2. Fix broken field names (remove spaces from: explanation, maxPoints, minPoints, timeLimit, correctAnswer, imageUrl)
3. Fix ONLY the syntax issues - do NOT change question content
4. Ensure all 10 questions have correct structure
5. Verify: correctAnswer, timeLimit are numbers; minPoints, maxPoints are "" (empty strings)
6. Ensure answer5-9 are empty strings "", not missing
7. Output corrected JSON on ONE CONTINUOUS LINE (no wrapping)

OUTPUT THE FIXED JSON ON A SINGLE LINE. NO EXPLANATIONS. START WITH { END WITH }`;
};
