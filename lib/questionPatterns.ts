/**
 * QUESTION PATTERNS & EXAMPLES
 *
 * Dynamic Context Engineering:
 * - Each module has specific question patterns
 * - Examples are randomly selected during prompt generation
 * - Creates diversity instead of repetitive styles
 *
 * PSYCHOLOGICAL PRINCIPLES (Research-Backed):
 *
 * 1. MISCONCEPTION-BASED DISTRACTORS (Haladyna & Rodriguez, 2013)
 *    - Wrong options target REAL student errors, not random wrong answers
 *    - Each distractor = common misconception with "80% correct, 1 critical flaw"
 *    - Good distractors attract >5% of learners (plausibility threshold)
 *
 * 2. ANTI-PATTERN EXPLOITS (Avoid Predictable Cues)
 *    - NO "longest answer is correct" - all options SAME word count
 *    - NO hedging giveaways - "maybe/sometimes" on wrong, "definitely" on correct
 *    - NO absolute qualifiers pattern - "always/never" shouldn't signal wrong
 *    - NO position patterns - correct answer position randomized
 *
 * 3. ENGAGEMENT BALANCE (Bjork's Desirable Difficulties)
 *    - NOT too easy: Obvious wrong options = no learning, false confidence
 *    - NOT too hard: Trick questions = demotivation, tests reading not knowledge
 *    - JUST RIGHT: Productive struggle, tests real understanding
 *
 * 4. DISTRACTOR QUALITY RULES
 *    - Same tone/confidence across all options
 *    - Same grammatical structure (all start with verb OR all start with noun)
 *    - Same level of technical detail
 *    - No "none of the above" or joke answers
 *
 * 5. THE "ALMOST RIGHT" PRINCIPLE
 *    - Wrong options should make learner THINK before rejecting
 *    - Target the gap between surface understanding and deep knowledge
 *    - Example: "Compression reduces memory" sounds right but generators don't compress
 *
 * Sources:
 * - Haladyna, T.M. & Rodriguez, M.C. (2013). Developing and Validating Test Items
 * - Bjork, R.A. (1994). Memory and Metamemory Considerations
 * - https://pmc.ncbi.nlm.nih.gov/articles/PMC6524712/
 *
 * Usage: getRandomExamples(moduleName, count) returns random examples
 */

// ============================================================================
// DISTRACTOR PSYCHOLOGY GUIDELINES (Injected into prompts)
// ============================================================================

export const DISTRACTOR_GUIDELINES = `
**DISTRACTOR PSYCHOLOGY (Research-Backed Rules):**

1. **MISCONCEPTION-BASED** - Each wrong option = real student error
   - Target common mistakes, not random wrong answers
   - "Almost right with 1 critical flaw" principle
   - Ask: "What would a student who half-understands this pick?"

2. **EQUAL PLAUSIBILITY** - All 4 options must sound equally correct
   - Same word count (prevents "longest = correct" exploit)
   - Same confidence tone (no hedging on wrong answers)
   - Same grammatical structure (all verbs OR all nouns)
   - Same technical depth

3. **NO GIVEAWAY PATTERNS**
   - WRONG: "Always/never" only on wrong options
   - WRONG: Technical jargon only on correct answer
   - WRONG: Hedging ("maybe", "sometimes") only on wrong
   - RIGHT: All options use same qualifiers and tone

4. **ENGAGEMENT BALANCE**
   - NOT too easy: No obviously wrong options (no learning)
   - NOT too hard: No trick questions (demotivates)
   - JUST RIGHT: Requires thinking, rewards understanding

5. **THE 5% RULE** (Haladyna)
   - Good distractors attract >5% of learners
   - If no one picks it, it's not doing its job
   - Test: "Would a smart student who didn't study pick this?"

**DISTRACTOR FORMULA:**
Wrong Option = Correct Concept + Common Misconception
Example: "Generators compress data" (sounds right, but they yield lazily, not compress)
`;

// ============================================================================
// TYPES
// ============================================================================

export interface QuestionExample {
  pattern: string;
  question: string;
  options: [string, string, string, string];
  correct: 1 | 2 | 3 | 4;
  explanation: string;
  timeLimit: 20 | 25 | 30 | 35; // Max 35 seconds
  note: string;
  // Misconception annotations: What error does each wrong option target?
  distractorLogic?: {
    option1?: string; // Why a learner might pick option 1 (if wrong)
    option2?: string; // Why a learner might pick option 2 (if wrong)
    option3?: string; // Why a learner might pick option 3 (if wrong)
    option4?: string; // Why a learner might pick option 4 (if wrong)
  };
}

export interface ModulePatterns {
  description: string;
  patterns: {
    name: string;
    description: string;
    format: string;
    timeRange: string;
  }[];
  examples: QuestionExample[];
}

// ============================================================================
// GENERAL AI - UPSC-Style Analytical (Natural Language)
// ============================================================================

/*
 * DIFFICULTY & TIME DISTRIBUTION (Learner-Centric):
 *
 * Per 10 questions:
 * - HARD (30-35s): 1 question - Complex multi-step reasoning (Assertion-Reason, Statement-Analysis)
 * - MEDIUM (25-30s): 7 questions - Standard analytical (Hype-vs-Reality, Cause-Consequence, Critical-Evaluation, most theme questions)
 * - EASY (20-25s): 2 questions - Quick factual/recognition (Tool-Recognition, Algorithm-Basics)
 *
 * THEME DISTRIBUTION (Diversity for General AI - 10 questions):
 * 1. Ethics & Fairness (1-2 Q) - Bias, responsible AI, fairness metrics
 * 2. Laws & Regulation (1 Q) - EU AI Act, GDPR, copyright, IP
 * 3. Research Literacy (1 Q) - Landmark papers, benchmarks, methodology
 * 4. Hype vs Reality (1-2 Q) - Claims vs evidence, vendor marketing
 * 5. Tool Ecosystem (1 Q) - Vector DBs, orchestration, new frameworks
 * 6. SLM vs LLM (1 Q) - Trade-offs, deployment, efficiency
 * 7. AGI & Safety (1 Q) - Alignment, existential risk, safety research
 * 8. New Algorithms (1 Q) - MoE, state space, efficient attention
 * 9. Industry Trends (1 Q) - Adoption, market, hiring signals
 */

export const GENERAL_AI_PATTERNS: ModulePatterns = {
  description: `AI industry awareness as of {current_date} for Codebasics Bootcamp learners.
Tests analytical reasoning about AI concepts relevant to projects and career.
Difficulty: Intermediate (assumes Python/ML/DL bootcamp knowledge)`,

  patterns: [
    // HARD PATTERNS (30-35s) - 1 per quiz
    {
      name: "ASSERTION-REASON",
      description:
        "Tests if learner understands WHY something is true and connects cause to effect",
      format:
        "Assertion: [Statement]. Reason: [Explanation]. Is the assertion correct, and does the reason explain it?",
      timeRange: "30-35s",
    },
    {
      name: "STATEMENT-ANALYSIS",
      description:
        "Tests analytical evaluation of claims using diverse question styles",
      format:
        "Natural flow with (1)/(2)/(3) + varied endings: 'Which of these statements hold up?', 'Which of these statements is/are misleading?', 'Which of these statements is/are [correct OR incorrect]?'",
      timeRange: "30-35s",
    },
    // MEDIUM PATTERNS (25-30s) - 7 per quiz
    {
      name: "HYPE-VS-REALITY",
      description: "Tests critical evaluation of marketing vs evidence",
      format: "Which [topic] claim is supported by evidence?",
      timeRange: "25-30s",
    },
    {
      name: "CAUSE-CONSEQUENCE",
      description: "Tests reasoning about why something happens",
      format: "Why does [X] happen/lead to [Y]?",
      timeRange: "25-30s",
    },
    {
      name: "CRITICAL-EVALUATION",
      description:
        "Tests judgment about claims using natural workplace conversation framing",
      format:
        "Your colleague/manager/influencer says [claim]. What is missing here? / How would you respond? / What is the risk?",
      timeRange: "25-30s",
    },
    // NEW THEME-SPECIFIC PATTERNS
    {
      name: "ETHICS-FAIRNESS",
      description: "Tests understanding of AI ethics, bias, and responsible AI principles",
      format: "Why does [bias/fairness issue] occur? OR What's the ethical concern with [practice]?",
      timeRange: "25-30s",
    },
    {
      name: "LEGAL-COMPLIANCE",
      description: "Tests awareness of AI regulations, laws, and compliance requirements",
      format: "Under [regulation], what applies to [AI system]? OR What legal risk does [practice] create?",
      timeRange: "25-30s",
    },
    {
      name: "RESEARCH-ANALYSIS",
      description: "Tests understanding of landmark papers, benchmarks, and research methodology",
      format: "What limitation did [paper/benchmark] address? OR Why is [metric] insufficient for [task]?",
      timeRange: "25-30s",
    },
    {
      name: "CLAIM-VERIFICATION",
      description: "Tests ability to evaluate vendor claims against evidence",
      format: "A vendor claims [X]. What critical information is missing?",
      timeRange: "25-30s",
    },
    {
      name: "ALGORITHM-INSIGHT",
      description: "Tests understanding of new algorithmic approaches (MoE, SSM, etc.)",
      format: "What problem does [algorithm] solve that [previous approach] cannot?",
      timeRange: "25-30s",
    },
    {
      name: "AGI-SAFETY",
      description: "Tests understanding of alignment, safety research, and long-term AI risks",
      format: "Why is [safety concern] important? OR What's the risk of [approach]?",
      timeRange: "25-30s",
    },
    // EASY PATTERNS (20-25s) - 2 per quiz
    {
      name: "TOOL-RECOGNITION",
      description: "Quick identification of tool/framework capabilities (industry awareness)",
      format: "Which tool/framework is best suited for [specific task]?",
      timeRange: "20-25s",
    },
    {
      name: "TREND-AWARENESS",
      description: "Tests awareness of current AI industry trends and developments",
      format: "What trend does [observation] indicate? OR Why is [development] significant?",
      timeRange: "20-25s",
    },
  ],

  examples: [
    // ASSERTION-REASON Examples - VARIED correct answers: "both true+explains", "assertion true+reason false", "assertion false+reason true", "both true+unrelated"
    {
      pattern: "ASSERTION-REASON",
      question:
        "Assertion: DeepSeek V3.2 costs 10x less than GPT-5 per token. Reason: It uses Mixture-of-Experts activating only 37B of 671B parameters. Is the assertion correct, and does the reason explain it?",
      options: [
        "Assertion false but reason true",
        "Both true and reason explains",
        "Assertion true but reason false",
        "Both true but reason unrelated",
      ],
      correct: 2,
      explanation:
        "MoE activates only a fraction of parameters per token, directly reducing compute costs while maintaining performance.",
      timeLimit: 35,
      note: "DeepSeek MoE architecture - CORRECT: Both true + explains (5-word options)",
      distractorLogic: {
        option1: "Learner thinks SLMs aren't actually preferred for edge",
        option3: "Learner doubts SLMs need less compute than LLMs",
        option4: "Learner knows both facts but doesn't see causal link",
      },
    },
    {
      pattern: "ASSERTION-REASON",
      question:
        "Assertion: Leading models now score above 90% on MMLU. Reason: MMLU questions were leaked into training data. Is the assertion correct, and does the reason explain it?",
      options: [
        "Both true but reason unrelated",
        "Both assertion and reason false",
        "Both true and reason explains",
        "Assertion true but reason false",
      ],
      correct: 4,
      explanation:
        "GPT-5 achieves 91.4% on MMLU legitimately through capability gains—not data leakage. The benchmark is genuinely saturating.",
      timeLimit: 35,
      note: "MMLU saturation - CORRECT: Assertion true + reason FALSE (5-word options)",
      distractorLogic: {
        option1: "Learner knows both but doesn't see the flaw in the reason",
        option2: "Learner rejects both RLHF claims entirely as false",
        option3:
          "Learner takes 'human feedback' literally as manual weight editing",
      },
    },
    {
      pattern: "ASSERTION-REASON",
      question:
        "Assertion: All major AI companies have strong existential safety plans. Reason: Companies are racing to build AGI within this decade. Is the assertion correct, and does the reason explain it?",
      options: [
        "Both true and reason explains",
        "Assertion false but reason true",
        "Assertion true but reason false",
        "Both assertion and reason false",
      ],
      correct: 2,
      explanation:
        "The 2025 AI Safety Index shows no company scored above D in existential safety—despite all racing toward AGI.",
      timeLimit: 35,
      note: "AI Safety Index - CORRECT: Assertion FALSE + reason true (5-word options)",
      distractorLogic: {
        option1: "Learner thinks fine-tuning always improves everything",
        option3: "Learner doubts fine-tuning actually changes weights",
        option4: "Learner rejects both claims without nuance",
      },
    },
    {
      pattern: "ASSERTION-REASON",
      question:
        "Assertion: GPT-5.1 is a multimodal model. Reason: It was trained on internet-scale data. Is the assertion correct, and does the reason explain it?",
      options: [
        "Assertion true but reason false",
        "Both true and reason explains",
        "Both true but reason unrelated",
        "Assertion false but reason true",
      ],
      correct: 3,
      explanation:
        "GPT-5.1 is multimodal and was trained on massive data—but internet-scale training doesn't explain multimodality. Native multimodal architecture and unified system design do.",
      timeLimit: 35,
      note: "GPT-5.1 architecture - CORRECT: Both true + reason UNRELATED (5-word options)",
      distractorLogic: {
        option1: "Learner thinks internet training isn't true",
        option2: "Learner wrongly connects data scale to multimodality",
        option4: "Learner doesn't know GPT-5.1 is multimodal",
      },
    },
    {
      pattern: "ASSERTION-REASON",
      question:
        "Assertion: Reasoning models like o3 hallucinate less than standard models. Reason: Chain-of-thought always produces factually correct outputs. Is the assertion correct, and does the reason explain it?",
      options: [
        "Both true and reason explains",
        "Assertion true but reason false",
        "Assertion false but reason true",
        "Both assertion and reason false",
      ],
      correct: 4,
      explanation:
        "OpenAI's o3 showed 33% hallucination on PersonQA—reasoning models can hallucinate MORE on certain tasks. CoT doesn't guarantee accuracy.",
      timeLimit: 35,
      note: "Reasoning model hallucination - CORRECT: Both FALSE (5-word options)",
      distractorLogic: {
        option1: "Learner believes both marketing claims",
        option2: "Learner thinks context does eliminate hallucinations",
        option4: "Learner doesn't know about lost-in-middle effect",
      },
    },

    // STATEMENT-ANALYSIS Examples - Positions: 2, 3, 4, 1
    {
      pattern: "STATEMENT-ANALYSIS",
      question:
        "December 2025 benchmarks show: (1) Claude Opus 4.5 leads coding at 80.9% SWE-bench, (2) Gemini 3 Pro leads math at 95% AIME, (3) One model dominates all tasks. Which hold up?",
      options: [
        "All three claims valid",
        "Only first and second",
        "Only second and third",
        "Only the first claim",
      ],
      correct: 2,
      explanation:
        "Different models excel at different tasks—Claude leads coding, Gemini leads math. No single model dominates everything.",
      timeLimit: 35,
      note: "Model specialization Dec 2025 (4-word options)",
      distractorLogic: {
        option1: "Learner accepts all marketing claims at face value",
        option3: "Learner believes benchmarks predict real-world performance",
        option4: "Learner unsure if HumanEval actually tests coding ability",
      },
    },
    {
      pattern: "STATEMENT-ANALYSIS",
      question:
        "About AI hallucination rates: (1) Best models now under 1%, (2) This represents 96% reduction since 2021, (3) Hallucination is completely solved. Which are accurate?",
      options: [
        "The first claim misleads",
        "The second claim misleads",
        "The third claim misleads",
        "None of them mislead",
      ],
      correct: 3,
      explanation:
        "Gemini 2.0 Flash achieves 0.7% hallucination—a 96% drop from 21.8% in 2021. But 'solved' overstates progress significantly.",
      timeLimit: 35,
      note: "Hallucination progress (4-word options)",
      distractorLogic: {
        option1: "Learner thinks adapter training sounds too good to be true",
        option2: "Learner unsure if base model is truly frozen in LoRA",
        option4: "Learner conflates LoRA memory needs with full fine-tuning",
      },
    },
    {
      pattern: "STATEMENT-ANALYSIS",
      question:
        "About small language models in 2025: (1) SmolLM2 1.7B matches older 70B models, (2) SLMs can run without internet, (3) SLMs always outperform LLMs. Which is misleading?",
      options: [
        "RAG eliminates all model hallucinations",
        "RAG works without any vector databases",
        "RAG always retrieves the relevant context",
        "RAG requires careful prompt engineering",
      ],
      correct: 4,
      explanation:
        "SLMs match older large models and enable offline use, but they trade breadth for efficiency—they don't outperform LLMs on complex tasks.",
      timeLimit: 35,
      note: "SLM efficiency claims (5-word options)",
      distractorLogic: {
        option1:
          "Learner believes RAG marketing claims about eliminating hallucinations",
        option2: "Learner thinks RAG can work with keyword search alone",
        option3:
          "Learner overestimates retrieval reliability with 'always' qualifier",
      },
    },
    {
      pattern: "STATEMENT-ANALYSIS",
      question:
        "People often get fine-tuning vs RAG wrong. Which belief here is actually a misconception?",
      options: [
        "Fine-tuning always beats RAG accuracy",
        "Fine-tuning bakes knowledge into weights",
        "RAG retrieves fresh data at runtime",
        "RAG suits frequently changing data",
      ],
      correct: 1,
      explanation:
        "Neither approach universally wins—RAG excels when data changes frequently, while fine-tuning shines for stable domain knowledge.",
      timeLimit: 35,
      note: "Architecture trade-offs (5-word options)",
      distractorLogic: {
        option2:
          "Learner might doubt this simplified description of fine-tuning",
        option3: "Learner might think RAG caches rather than retrieves fresh",
        option4: "Learner might think frequent changes actually hurt RAG",
      },
    },

    // HYPE-VS-REALITY Examples - Positions: 4, 1, 3
    {
      pattern: "HYPE-VS-REALITY",
      question:
        "DeepSeek V3.2 is called 'open source GPT-5 killer.' What actually holds up in benchmarks?",
      options: [
        "Eliminates all model hallucinations completely",
        "Always outperforms fine-tuned model approaches",
        "Requires no prompt optimization whatsoever",
        "Consistently grounds responses in documents",
      ],
      correct: 4,
      explanation:
        "DeepSeek charges $0.028 per million tokens versus GPT-5's higher rates—real cost advantage. Performance is competitive but not universally better.",
      timeLimit: 25,
      note: "Open source claims (5-word options)",
      distractorLogic: {
        option1:
          "Learner heard 'grounded in documents' and assumes zero hallucinations",
        option2:
          "Learner thinks retrieval automatically beats learned knowledge",
        option3: "Learner assumes RAG is plug-and-play without prompt work",
      },
    },
    {
      pattern: "HYPE-VS-REALITY",
      question:
        "Models now advertise 200K+ token contexts. What's the reality about long context performance?",
      options: [
        "Performance degrades with longer context",
        "Models process all tokens equally well",
        "Longer context always improves answers",
        "Context length has no cost impact",
      ],
      correct: 1,
      explanation:
        "The 'lost in the middle' effect persists—models struggle with information buried in long contexts even when it fits.",
      timeLimit: 25,
      note: "Context window reality (5-word options)",
      distractorLogic: {
        option2:
          "Learner doesn't know about attention degradation over sequences",
        option3:
          "Learner assumes more information automatically means better results",
        option4: "Learner unfamiliar with token-based pricing models",
      },
    },
    {
      pattern: "HYPE-VS-REALITY",
      question:
        "A model claims '95% on MMLU.' What should you actually infer from this score?",
      options: [
        "One universal prompt works everywhere",
        "Longer prompts always perform better",
        "Prompt results vary across models",
        "System prompts guarantee full compliance",
      ],
      correct: 3,
      explanation:
        "MMLU tests academic multiple-choice across 57 subjects—high scores show test-taking ability, not guaranteed real-world performance.",
      timeLimit: 25,
      note: "Benchmark interpretation (5-word options)",
      distractorLogic: {
        option1: "Learner believes in universal 'magic prompts' from tutorials",
        option2: "Learner thinks more instructions equals more accuracy",
        option4:
          "Learner overestimates system prompt enforcement against jailbreaks",
      },
    },

    // CAUSE-CONSEQUENCE Examples - Positions: 2, 1, 4
    {
      pattern: "CAUSE-CONSEQUENCE",
      question:
        "Why do Mixture-of-Experts models like DeepSeek V3.2 achieve lower inference costs than dense models?",
      options: [
        "Neural networks are inherently biased",
        "Training data reflects historical bias",
        "Python libraries introduce data bias",
        "More training reduces the bias",
      ],
      correct: 2,
      explanation:
        "MoE routes each token through only relevant expert subnetworks—671B total parameters but only 37B compute per token.",
      timeLimit: 25,
      note: "MoE efficiency (5-word options)",
      distractorLogic: {
        option1:
          "Learner blames algorithm architecture rather than data quality",
        option3: "Learner thinks tools introduce bias rather than data itself",
        option4:
          "Learner assumes more training fixes bias when it amplifies it",
      },
    },
    {
      pattern: "CAUSE-CONSEQUENCE",
      question: "Why is 'alignment faking' a concern identified in 2025 AI safety research?",
      options: [
        "They predict probable token sequences",
        "They possess perfect world knowledge",
        "Training data contains no errors",
        "Temperature setting runs too low",
      ],
      correct: 1,
      explanation:
        "Research shows models could learn to appear aligned during evaluation while pursuing different goals during deployment.",
      timeLimit: 25,
      note: "Alignment faking risk (5-word options)",
      distractorLogic: {
        option2: "Learner anthropomorphizes LLMs as actually 'knowing' things",
        option3: "Learner thinks clean training data prevents hallucination",
        option4:
          "Learner confuses temperature direction—low means deterministic",
      },
    },
    {
      pattern: "CAUSE-CONSEQUENCE",
      question:
        "Why does DeepSeek Sparse Attention reduce computational cost for long contexts?",
      options: [
        "Model accesses more training data",
        "GPU hardware runs hotter faster",
        "Context window expands with heat",
        "Higher randomness in token selection",
      ],
      correct: 4,
      explanation:
        "Sparse attention identifies and focuses on significant portions of long contexts, skipping unnecessary computation on less relevant parts.",
      timeLimit: 25,
      note: "Sparse attention benefits (5-word options)",
      distractorLogic: {
        option1:
          "Learner thinks temperature affects which knowledge is accessed",
        option2: "Learner takes 'temperature' literally as hardware heat",
        option3: "Learner confuses temperature with context length settings",
      },
    },

    // CRITICAL-EVALUATION Examples - VARIED correct positions: 1, 4, 2, 3
    {
      pattern: "CRITICAL-EVALUATION",
      question:
        "Your team lead says 'always use the biggest model for best results.' What nuance are they missing?",
      options: [
        "Ignores data freshness requirements",
        "Correct for every possible case",
        "Wrong because RAG always wins",
        "Only wrong for larger models",
      ],
      correct: 1,
      explanation:
        "SmolLM2 at 1.7B matches older 70B models on many tasks. Size matters less than fit—plus cost and latency constraints are real.",
      timeLimit: 30,
      note: "Model size assumption (5-word options)",
      distractorLogic: {
        option2:
          "Learner believes fine-tuning equals deep learning equals best",
        option3: "Learner overcorrects in favor of RAG after learning benefits",
        option4: "Learner thinks model size is the primary deciding factor",
      },
    },
    {
      pattern: "CRITICAL-EVALUATION",
      question:
        "A startup claims their AI is 'fully aligned and safe.' Based on 2025 safety research, what's your response?",
      options: [
        "They're right per scaling laws",
        "Small models are always better",
        "Only matters for text tasks",
        "Depends on task and constraints",
      ],
      correct: 4,
      explanation:
        "Even leading labs scored poorly on existential safety planning. Verifying true alignment remains an open research problem.",
      timeLimit: 30,
      note: "Safety claim skepticism (5-word options)",
      distractorLogic: {
        option1:
          "Learner generalizes scaling laws without considering practical constraints",
        option2:
          "Learner overcorrects after learning about efficient small models",
        option3:
          "Learner thinks scaling law benefits only apply to text modality",
      },
    },
    {
      pattern: "CRITICAL-EVALUATION",
      question:
        "A colleague says 'DeepSeek proves open source has caught up to closed models.' What's the full picture?",
      options: [
        "Likely happening within two years",
        "AI augments rather than replaces",
        "No significant impact on jobs",
        "Only junior roles get replaced",
      ],
      correct: 2,
      explanation:
        "DeepSeek V3.2 matches GPT-5 on many benchmarks, but closed providers offer better APIs, support, and safety guardrails.",
      timeLimit: 30,
      note: "Open source vs closed (5-word options)",
      distractorLogic: {
        option1:
          "Learner influenced by sensational AI job replacement headlines",
        option3: "Learner in denial about AI's real impact on workflows",
        option4: "Learner assumes AI only handles 'simple' junior tasks",
      },
    },
    {
      pattern: "CRITICAL-EVALUATION",
      question:
        "Your manager wants to skip testing because 'the model worked in the demo.' What's the risk they're missing?",
      options: [
        "Demos always match production exactly",
        "Testing slows down deployment speed",
        "Edge cases break production systems",
        "No risk if demo was successful",
      ],
      correct: 3,
      explanation:
        "Demo conditions rarely match production reality—edge cases, adversarial inputs, and scale issues only surface with proper testing.",
      timeLimit: 30,
      note: "Production readiness (5-word options)",
      distractorLogic: {
        option1: "Learner trusts demo performance without skepticism",
        option2: "Learner prioritizes speed over reliability",
        option4: "Learner doesn't understand demo vs production gap",
      },
    },

    // ============================================================================
    // ETHICS & FAIRNESS EXAMPLES (Theme: Responsible AI)
    // ============================================================================
    {
      pattern: "ETHICS-FAIRNESS",
      question:
        "A hiring AI rejects more resumes from certain zip codes. What's the likely root cause of this bias?",
      options: [
        "Algorithm intentionally discriminates applicants",
        "Training data reflects historical patterns",
        "More compute reduces all biases",
        "Zip codes are truly predictive",
      ],
      correct: 2,
      explanation:
        "AI learns from historical data—if past hiring favored certain demographics, the model reproduces those patterns unintentionally.",
      timeLimit: 25,
      note: "ETHICS-FAIRNESS | Bias source | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks bias is explicit code rather than data-driven",
        option3: "Learner believes more compute solves fairness issues",
        option4: "Learner confuses correlation with justified discrimination",
      },
    },
    {
      pattern: "ETHICS-FAIRNESS",
      question:
        "Your model achieves 'demographic parity' but fails 'equalized odds.' What does this mean?",
      options: [
        "Model is completely fair now",
        "Equal outcomes different error rates",
        "Different outcomes equal error rates",
        "Both fairness metrics are satisfied",
      ],
      correct: 2,
      explanation:
        "Demographic parity means equal selection rates, but equalized odds requires equal error rates per group—they can conflict.",
      timeLimit: 30,
      note: "ETHICS-FAIRNESS | Fairness metrics | Position 2 | 30s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks one metric equals full fairness",
        option3: "Learner reverses the definitions of the metrics",
        option4: "Learner doesn't understand metrics can conflict",
      },
    },

    // ============================================================================
    // LEGAL & COMPLIANCE EXAMPLES (Theme: AI Regulation)
    // ============================================================================
    {
      pattern: "LEGAL-COMPLIANCE",
      question:
        "Under EU AI Act, which AI system would be classified as 'high-risk' requiring strict compliance?",
      options: [
        "Content recommendation on social media",
        "Resume screening for job applications",
        "Weather prediction for farming",
        "Music playlist generation service",
      ],
      correct: 2,
      explanation:
        "EU AI Act classifies employment-related AI as high-risk because it significantly impacts people's lives and opportunities.",
      timeLimit: 25,
      note: "LEGAL-COMPLIANCE | EU AI Act | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks recommendations are high-risk (limited risk)",
        option3: "Learner thinks critical-sounding tasks are always high-risk",
        option4: "Learner doesn't understand impact-based classification",
      },
    },
    {
      pattern: "LEGAL-COMPLIANCE",
      question:
        "A user requests explanation of why AI denied their loan. Under GDPR, what right does this invoke?",
      options: [
        "Right to be forgotten completely",
        "Right to explanation of decision",
        "Right to stop all processing",
        "Right to data portability only",
      ],
      correct: 2,
      explanation:
        "GDPR Article 22 grants right to explanation for automated decisions with significant effects—users can demand meaningful information about the logic.",
      timeLimit: 25,
      note: "LEGAL-COMPLIANCE | GDPR rights | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner confuses erasure with explanation rights",
        option3: "Learner thinks objection right applies to explanations",
        option4: "Learner confuses portability with accountability rights",
      },
    },

    // ============================================================================
    // RESEARCH ANALYSIS EXAMPLES (Theme: Research Literacy)
    // ============================================================================
    {
      pattern: "RESEARCH-ANALYSIS",
      question:
        "The 'Attention Is All You Need' paper replaced RNNs with self-attention. What limitation did this solve?",
      options: [
        "RNNs used too little memory",
        "RNNs could not process images",
        "RNNs processed tokens sequentially",
        "RNNs had too few parameters",
      ],
      correct: 3,
      explanation:
        "Self-attention processes all tokens in parallel, eliminating the sequential bottleneck that prevented RNNs from utilizing modern GPUs effectively.",
      timeLimit: 30,
      note: "RESEARCH-ANALYSIS | Transformer paper | Position 3 | 30s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks memory was the main RNN limitation",
        option2: "Learner confuses text vs image processing capabilities",
        option4: "Learner thinks parameter count was the bottleneck",
      },
    },
    {
      pattern: "RESEARCH-ANALYSIS",
      question:
        "MMLU tests 57 academic subjects while HumanEval tests code generation. Why might high MMLU not predict high HumanEval?",
      options: [
        "Different skills being measured here",
        "MMLU is strictly harder benchmark",
        "HumanEval has only easy problems",
        "Both measure exactly same ability",
      ],
      correct: 1,
      explanation:
        "MMLU tests knowledge recall across subjects while HumanEval tests code synthesis—different cognitive skills that don't transfer automatically.",
      timeLimit: 25,
      note: "RESEARCH-ANALYSIS | Benchmark interpretation | Position 1 | 25s MEDIUM",
      distractorLogic: {
        option2: "Learner assumes one benchmark hierarchy exists",
        option3: "Learner underestimates code generation difficulty",
        option4: "Learner doesn't understand benchmark specificity",
      },
    },

    // ============================================================================
    // CLAIM VERIFICATION EXAMPLES (Theme: Hype vs Reality)
    // ============================================================================
    {
      pattern: "CLAIM-VERIFICATION",
      question:
        "A vendor claims their AI achieves '99% accuracy.' What critical information is missing from this claim?",
      options: [
        "The accuracy is probably fake",
        "Dataset and task specificity details",
        "Vendor reputation in the market",
        "Price of the solution offered",
      ],
      correct: 2,
      explanation:
        "Without knowing the test dataset and exact task, 99% accuracy is meaningless—easy datasets yield high scores that don't transfer.",
      timeLimit: 25,
      note: "CLAIM-VERIFICATION | Vendor claims | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner assumes all vendor claims are lies",
        option3: "Learner focuses on reputation over methodology",
        option4: "Learner confuses business factors with technical validity",
      },
    },
    {
      pattern: "CLAIM-VERIFICATION",
      question:
        "A startup claims 'our AI understands context better than humans.' What's the flaw in evaluating this claim?",
      options: [
        "Humans are always better at context",
        "No standardized context understanding benchmark",
        "Startups never have good AI technology",
        "Context understanding cannot be measured",
      ],
      correct: 2,
      explanation:
        "Without standardized benchmarks for 'context understanding,' such claims are unfalsifiable—we can't objectively compare AI to humans.",
      timeLimit: 25,
      note: "CLAIM-VERIFICATION | Unfalsifiable claims | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner assumes human superiority without evidence",
        option3: "Learner dismisses startups based on bias",
        option4: "Learner thinks measurement is impossible (it's difficult, not impossible)",
      },
    },

    // ============================================================================
    // ALGORITHM INSIGHT EXAMPLES (Theme: New Algorithms)
    // ============================================================================
    {
      pattern: "ALGORITHM-INSIGHT",
      question:
        "Mixture-of-Experts (MoE) activates only a subset of parameters per token. What problem does this solve?",
      options: [
        "Reduces model training time significantly",
        "Eliminates need for any GPU entirely",
        "Scales capacity without proportional compute",
        "Makes models completely deterministic always",
      ],
      correct: 3,
      explanation:
        "MoE allows massive parameter counts (capacity) while only using a fraction per inference—scaling knowledge without scaling cost linearly.",
      timeLimit: 25,
      note: "ALGORITHM-INSIGHT | MoE architecture | Position 3 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner confuses inference efficiency with training time",
        option2: "Learner thinks efficiency means no hardware needed",
        option4: "Learner confuses sparsity with determinism",
      },
    },
    {
      pattern: "ALGORITHM-INSIGHT",
      question:
        "State Space Models like Mamba handle long sequences differently than Transformers. What's their key advantage?",
      options: [
        "Higher accuracy on all tasks",
        "Linear scaling with sequence length",
        "No training data requirements needed",
        "Works only for image inputs",
      ],
      correct: 2,
      explanation:
        "SSMs process sequences in O(n) vs Transformer's O(n²) attention—enabling efficient handling of very long contexts.",
      timeLimit: 25,
      note: "ALGORITHM-INSIGHT | State Space Models | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner assumes new = better on everything",
        option3: "Learner confuses architecture with training requirements",
        option4: "Learner doesn't understand SSMs work on sequences",
      },
    },

    // ============================================================================
    // AGI & SAFETY EXAMPLES (Theme: Long-term AI Safety)
    // ============================================================================
    {
      pattern: "AGI-SAFETY",
      question:
        "Why is 'alignment faking' a concern in AI safety research?",
      options: [
        "Models might pretend alignment during testing",
        "Alignment is impossible to achieve",
        "Researchers fake alignment results often",
        "Only open source models are aligned",
      ],
      correct: 1,
      explanation:
        "Research shows models could learn to appear aligned during evaluation while pursuing different objectives during deployment—a deceptive pattern.",
      timeLimit: 30,
      note: "AGI-SAFETY | Alignment faking | Position 1 | 30s MEDIUM",
      distractorLogic: {
        option2: "Learner takes pessimistic view that alignment is impossible",
        option3: "Learner thinks 'faking' refers to human researchers",
        option4: "Learner confuses licensing with alignment properties",
      },
    },
    {
      pattern: "AGI-SAFETY",
      question:
        "The 2025 AI Safety Index rated no major AI lab above 'D' on existential safety planning. What does this indicate?",
      options: [
        "AI labs prioritize capabilities over safety",
        "Existential safety is fully solved now",
        "Only small labs focus on safety",
        "Safety ratings are not meaningful",
      ],
      correct: 1,
      explanation:
        "Low safety scores despite rapid capability advances suggest labs prioritize performance improvements over long-term safety preparations.",
      timeLimit: 30,
      note: "AGI-SAFETY | Industry safety gaps | Position 1 | 30s MEDIUM",
      distractorLogic: {
        option2: "Learner misreads low grade as problem solved",
        option3: "Learner assumes lab size correlates with safety focus",
        option4: "Learner dismisses safety metrics as invalid",
      },
    },

    // ============================================================================
    // TOOL RECOGNITION EXAMPLES (Theme: Industry Tools - EASY)
    // ============================================================================
    {
      pattern: "TOOL-RECOGNITION",
      question:
        "For building a RAG pipeline, which type of database stores vector embeddings?",
      options: [
        "Relational databases like PostgreSQL",
        "Vector databases like Pinecone",
        "Graph databases like Neo4j",
        "Document stores like MongoDB",
      ],
      correct: 2,
      explanation:
        "Vector databases are purpose-built for storing and searching embeddings using similarity metrics like cosine distance.",
      timeLimit: 20,
      note: "TOOL-RECOGNITION | Vector DBs | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner thinks traditional DBs handle vectors well",
        option3: "Learner confuses graph structure with vector similarity",
        option4: "Learner thinks document DBs are for all AI use cases",
      },
    },
    {
      pattern: "TOOL-RECOGNITION",
      question:
        "Which framework is specifically designed for building LLM-powered applications with chains and agents?",
      options: [
        "TensorFlow for deep learning",
        "LangChain for LLM orchestration",
        "Pandas for data manipulation",
        "Flask for web applications",
      ],
      correct: 2,
      explanation:
        "LangChain provides abstractions for chaining LLM calls, managing prompts, and building agent workflows specifically for LLM apps.",
      timeLimit: 20,
      note: "TOOL-RECOGNITION | LLM frameworks | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner confuses training frameworks with inference orchestration",
        option3: "Learner thinks data tools are for LLM apps",
        option4: "Learner confuses web frameworks with LLM orchestration",
      },
    },

    // ============================================================================
    // TREND AWARENESS EXAMPLES (Theme: Industry Trends - EASY)
    // ============================================================================
    {
      pattern: "TREND-AWARENESS",
      question:
        "Small Language Models (1-3B parameters) are gaining adoption. What trend does this indicate?",
      options: [
        "Large models are becoming obsolete",
        "Edge deployment and efficiency focus",
        "AI research is slowing down",
        "Only large companies use AI",
      ],
      correct: 2,
      explanation:
        "SLM adoption signals industry focus on efficiency, lower costs, and running AI on edge devices without cloud dependency.",
      timeLimit: 20,
      note: "TREND-AWARENESS | SLM adoption | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner thinks SLMs will fully replace LLMs",
        option3: "Learner interprets efficiency focus as slowdown",
        option4: "Learner doesn't see SLMs enabling smaller players",
      },
    },
    {
      pattern: "TREND-AWARENESS",
      question:
        "Open-weight models like Llama and Mistral are approaching closed-model performance. What does this trend enable?",
      options: [
        "Closed models will disappear entirely",
        "More customization and local deployment",
        "All AI will become completely free",
        "Research will stop entirely now",
      ],
      correct: 2,
      explanation:
        "Competitive open models enable fine-tuning, on-premise deployment, and customization that closed APIs cannot offer.",
      timeLimit: 20,
      note: "TREND-AWARENESS | Open models | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner thinks open = closed models disappearing",
        option3: "Learner confuses open-weight with no-cost operations",
        option4: "Learner doesn't understand open models drive more research",
      },
    },
  ],
};

// ============================================================================
// PYTHON - Technical Debugging & Reasoning
// ============================================================================

export const PYTHON_PATTERNS: ModulePatterns = {
  description: `Python fundamentals for data science and backend development.
Tests understanding of WHY Python mechanisms work, not just syntax recall.
Focus: FastAPI, Pandas, decorators, generators, async/await, exceptions`,

  patterns: [
    {
      name: "DEBUG-DIAGNOSE",
      description: "Given code/output, identify the issue",
      format: "This code raises [Error]. Why?",
      timeRange: "25-30s",
    },
    {
      name: "PREDICT-OUTPUT",
      description: "What will this code produce",
      format: "What does this code output?",
      timeRange: "25s",
    },
    {
      name: "MECHANISM-WHY",
      description: "Explain why a Python feature works a certain way",
      format: "Why does [feature] behave this way?",
      timeRange: "25s",
    },
    {
      name: "BEST-PRACTICE",
      description: "Which approach is recommended and why",
      format: "Which approach is better for [scenario]?",
      timeRange: "25s",
    },
    {
      name: "COMPARE-CONTRAST",
      description: "Understand differences between similar concepts",
      format: "What's the key difference between X and Y?",
      timeRange: "25s",
    },
  ],

  examples: [
    // DEBUG-DIAGNOSE - Positions: 2, 4
    {
      pattern: "DEBUG-DIAGNOSE",
      question:
        "Code: `df['col'].apply(lambda x: x.split(','))` raises AttributeError. Why?",
      options: [
        "Lambda function has wrong syntax",
        "Column contains NaN float values",
        "The apply method does not exist",
        "The split needs two arguments",
      ],
      correct: 2,
      explanation:
        "NaN is actually a float—floats don't have split(), so you get AttributeError. Always handle missing values first.",
      timeLimit: 25,
      note: "Pandas NaN handling (5-word options)",
      distractorLogic: {
        option1: "Learner blames lambda syntax when it's actually correct",
        option3: "Learner doubts apply() exists on Series",
        option4: "Learner thinks split() requires explicit delimiter",
      },
    },
    {
      pattern: "DEBUG-DIAGNOSE",
      question: "FastAPI endpoint returns 422 error. Most likely cause?",
      options: [
        "Server crashed and stopped working",
        "Database connection was lost entirely",
        "Import statement is missing somewhere",
        "Request body failed Pydantic validation",
      ],
      correct: 4,
      explanation:
        "422 Unprocessable Entity specifically means Pydantic validation failed—the request structure didn't match your model.",
      timeLimit: 25,
      note: "FastAPI validation (5-word options)",
      distractorLogic: {
        option1: "Learner conflates 4xx client errors with 5xx server crashes",
        option2: "Learner thinks DB issues cause 422 (actually 500/503)",
        option3:
          "Learner thinks import errors cause HTTP codes (causes startup failure)",
      },
    },

    // PREDICT-OUTPUT - Positions: 1, 3
    {
      pattern: "PREDICT-OUTPUT",
      question: "What does `list(range(5))[::2]` return?",
      options: ["[0, 2, 4]", "[0, 1, 2]", "[1, 3, 5]", "[4, 2, 0]"],
      correct: 1,
      explanation:
        "range(5) gives [0,1,2,3,4], then [::2] takes every 2nd element starting from index 0—so you get 0, 2, 4.",
      timeLimit: 25,
      note: "Slice notation (3-word options)",
      distractorLogic: {
        option2: "Learner thinks ::2 means first two elements",
        option3: "Learner confuses step=2 with starting at index 1",
        option4: "Learner thinks step without start/end reverses",
      },
    },
    {
      pattern: "PREDICT-OUTPUT",
      question: "Code: `x = [1]; y = x; y.append(2)`. What is x?",
      options: [
        "Just [1] alone",
        "Raises an error",
        "[1, 2] together",
        "Just [2] alone",
      ],
      correct: 3,
      explanation:
        "y = x doesn't copy the list—both variables point to the same object in memory, so x sees the append too.",
      timeLimit: 25,
      note: "Reference vs copy (3-word options)",
      distractorLogic: {
        option1:
          "Learner thinks assignment creates a copy (common from other languages)",
        option2: "Learner thinks aliasing causes errors somehow",
        option4: "Learner thinks append replaces rather than adds",
      },
    },

    // MECHANISM-WHY - Positions: 4, 2
    {
      pattern: "MECHANISM-WHY",
      question:
        "Why can't you modify a list while iterating over it with a for loop?",
      options: [
        "Memory gets locked by GIL",
        "Python syntax completely forbids it",
        "Lists become immutable during loops",
        "Iterator index gets shifted around",
      ],
      correct: 4,
      explanation:
        "Modifying the list shifts indices during iteration—the iterator loses track of position and skips or repeats elements.",
      timeLimit: 25,
      note: "Iteration internals (5-word options)",
      distractorLogic: {
        option1: "Learner misapplies GIL to iteration problems",
        option2:
          "Learner thinks Python prevents it at syntax level (it doesn't)",
        option3: "Learner confuses this with tuple immutability concept",
      },
    },
    {
      pattern: "MECHANISM-WHY",
      question:
        "Why do generators use less memory than lists for large datasets?",
      options: [
        "They compress data automatically somehow",
        "They yield values lazily on-demand",
        "They store data on disk instead",
        "They use smaller internal data types",
      ],
      correct: 2,
      explanation:
        "Generators are lazy—they compute one value at a time instead of storing the entire sequence in memory upfront.",
      timeLimit: 25,
      note: "Generator memory (5-word options)",
      distractorLogic: {
        option1: "Learner thinks generators compress data like zip files",
        option3: "Learner confuses generators with memory-mapped files or DBs",
        option4: "Learner thinks generators optimize data types automatically",
      },
    },

    // BEST-PRACTICE - Positions: 1, 3
    {
      pattern: "BEST-PRACTICE",
      question: "Processing 10GB CSV file in Pandas. Best approach?",
      options: [
        "Use the chunksize parameter",
        "Increase your RAM allocation",
        "Convert file to Excel first",
        "Use regular Python file reading",
      ],
      correct: 1,
      explanation:
        "chunksize reads data in batches—you process chunks sequentially without loading the entire 10GB into memory at once.",
      timeLimit: 25,
      note: "Large file handling (5-word options)",
      distractorLogic: {
        option2: "Learner thinks hardware upgrade solves scaling problems",
        option3: "Learner thinks Excel handles large data better (opposite)",
        option4:
          "Learner thinks native Python beats Pandas for memory (opposite)",
      },
    },
    {
      pattern: "BEST-PRACTICE",
      question: "Multiple except blocks needed. Which order is correct?",
      options: [
        "Generic Exception should come first",
        "Order makes no difference here",
        "Specific exceptions should come first",
        "Alphabetical order works best here",
      ],
      correct: 3,
      explanation:
        "Python matches the first applicable except block—put specific exceptions first or generic ones catch everything prematurely.",
      timeLimit: 25,
      note: "Exception handling (5-word options)",
      distractorLogic: {
        option1:
          "Learner thinks generic catches all then specific handles rest",
        option2: "Learner doesn't know about exception matching order",
        option4: "Learner thinks Python sorts exceptions automatically",
      },
    },

    // COMPARE-CONTRAST - Positions: 4, 1
    {
      pattern: "COMPARE-CONTRAST",
      question: "Key difference between `@staticmethod` and `@classmethod`?",
      options: [
        "staticmethod runs faster in practice",
        "classmethod cannot access the class",
        "There is no practical difference",
        "classmethod receives cls as argument",
      ],
      correct: 4,
      explanation:
        "@classmethod gets cls (class reference) as its first argument, while @staticmethod gets no implicit argument at all.",
      timeLimit: 25,
      note: "Decorator types (5-word options)",
      distractorLogic: {
        option1: "Learner assumes static means optimized performance",
        option2: "Learner reverses which method type has class access",
        option3: "Learner hasn't seen use cases where the difference matters",
      },
    },
    {
      pattern: "COMPARE-CONTRAST",
      question: "When to use `async def` over regular `def` in FastAPI?",
      options: [
        "For I/O bound operations only",
        "For CPU heavy calculations instead",
        "Always use async for everything",
        "Never use async in FastAPI",
      ],
      correct: 1,
      explanation:
        "async shines during I/O waits like DB queries or API calls—CPU-bound work just blocks the event loop anyway.",
      timeLimit: 25,
      note: "Async use cases (5-word options)",
      distractorLogic: {
        option2: "Learner thinks async equals parallel for all tasks",
        option3: "Learner thinks async is universally better (has overhead)",
        option4: "Learner avoids async due to complexity fears",
      },
    },
  ],
};

// ============================================================================
// SQL - Query Optimization & Reasoning
// ============================================================================

export const SQL_PATTERNS: ModulePatterns = {
  description: `SQL for data analysis and backend development.
Tests query optimization reasoning, not just syntax.
Focus: CTEs, window functions, JOINs, indexing, aggregates`,

  patterns: [
    {
      name: "DEBUG-QUERY",
      description: "Identify why a query returns unexpected results",
      format: "This query returns wrong results. Why?",
      timeRange: "25-30s",
    },
    {
      name: "OPTIMIZATION",
      description: "Choose the more efficient approach",
      format: "Which query is more efficient for [scenario]?",
      timeRange: "25s",
    },
    {
      name: "MECHANISM-WHY",
      description: "Explain why SQL behaves a certain way",
      format: "Why does [feature] work this way?",
      timeRange: "25s",
    },
    {
      name: "COMPARE-FUNCTIONS",
      description: "Understand differences between similar functions",
      format: "What's the difference between X and Y?",
      timeRange: "25s",
    },
    {
      name: "PREDICT-RESULT",
      description: "What will this query return",
      format: "What does this query return?",
      timeRange: "25s",
    },
  ],

  examples: [
    // DEBUG-QUERY - Positions: 3, 1
    {
      pattern: "DEBUG-QUERY",
      question: "Query with LEFT JOIN returns fewer rows than left table. Why?",
      options: [
        "LEFT JOIN always reduces row count",
        "Table contains too many duplicates",
        "WHERE clause filters after join",
        "Database has internal data corruption",
      ],
      correct: 3,
      explanation:
        "WHERE runs after the join and filters out rows with NULLs from unmatched records—move the condition to ON to keep them.",
      timeLimit: 25,
      note: "JOIN + WHERE (5-word options)",
      distractorLogic: {
        option1: "Learner confuses LEFT JOIN with INNER JOIN behavior",
        option2: "Learner thinks duplicates reduce rows (they multiply)",
        option4: "Learner jumps to catastrophic explanation for subtle bug",
      },
    },
    {
      pattern: "DEBUG-QUERY",
      question: "GROUP BY query returns error with non-aggregated column. Fix?",
      options: [
        "Add column to GROUP BY",
        "Remove GROUP BY clause entirely",
        "Use DISTINCT instead of grouping",
        "Add an ORDER BY clause",
      ],
      correct: 1,
      explanation:
        "SQL requires every non-aggregated column in GROUP BY—otherwise it can't determine how to collapse rows into groups.",
      timeLimit: 25,
      note: "GROUP BY rules (5-word options)",
      distractorLogic: {
        option2:
          "Learner thinks removing GROUP BY is simpler (loses aggregation)",
        option3: "Learner confuses DISTINCT with GROUP BY functionality",
        option4: "Learner thinks ORDER BY relates to grouping errors",
      },
    },

    // OPTIMIZATION - Positions: 4, 2
    {
      pattern: "OPTIMIZATION",
      question: "Filter 1M rows to 100. Apply filter before or after JOIN?",
      options: [
        "Doesn't affect query performance at all",
        "After JOIN in WHERE clause",
        "Use HAVING instead of WHERE",
        "Before JOIN in subquery or CTE",
      ],
      correct: 4,
      explanation:
        "Filtering early means fewer rows to join—joining 100 rows is dramatically faster than joining 1M then filtering.",
      timeLimit: 25,
      note: "Query optimization (5-word options)",
      distractorLogic: {
        option1: "Learner thinks optimizer handles it regardless of structure",
        option2: "Learner unaware row count affects join performance",
        option3:
          "Learner confuses HAVING (post-aggregation) with WHERE filtering",
      },
    },
    {
      pattern: "OPTIMIZATION",
      question: "Frequent queries filter by date column. Best optimization?",
      options: [
        "Convert all dates to strings",
        "Create index on date column",
        "Use SELECT star for everything",
        "Remove the date filter entirely",
      ],
      correct: 2,
      explanation:
        "An index on filtered columns enables fast lookups instead of full table scans—essential for frequently queried columns.",
      timeLimit: 25,
      note: "Indexing strategy (5-word options)",
      distractorLogic: {
        option1: "Learner thinks strings are faster (actually slower)",
        option3: "Learner doesn't know SELECT * hurts performance",
        option4: "Learner thinks removing features is 'optimization'",
      },
    },

    // MECHANISM-WHY - Positions: 1, 3
    {
      pattern: "MECHANISM-WHY",
      question: "Why does NULL = NULL return false (not true)?",
      options: [
        "NULL represents an unknown value",
        "Database has a comparison bug",
        "NULL equals the empty string",
        "Depends on database vendor used",
      ],
      correct: 1,
      explanation:
        "NULL means 'unknown'—comparing unknown to unknown gives unknown (NULL), not true. Use IS NULL instead.",
      timeLimit: 25,
      note: "NULL semantics (5-word options)",
      distractorLogic: {
        option2: "Learner thinks counterintuitive behavior must be bug",
        option3: "Learner confuses NULL with empty string value",
        option4: "Learner thinks NULL semantics vary by database",
      },
    },
    {
      pattern: "MECHANISM-WHY",
      question: "Why use CTEs over nested subqueries?",
      options: [
        "Always gives faster query execution",
        "Required for GROUP BY clauses",
        "Better readability and code reuse",
        "Reduces physical table storage size",
      ],
      correct: 3,
      explanation:
        "CTEs make complex queries readable and allow reusing results within the query—though performance depends on the database optimizer.",
      timeLimit: 25,
      note: "CTE benefits (5-word options)",
      distractorLogic: {
        option1: "Learner assumes cleaner syntax equals better performance",
        option2: "Learner confuses CTEs with GROUP BY requirements",
        option4: "Learner thinks CTEs affect physical storage somehow",
      },
    },

    // COMPARE-FUNCTIONS - Positions: 4, 2
    {
      pattern: "COMPARE-FUNCTIONS",
      question: "RANK() vs DENSE_RANK(): Key difference?",
      options: [
        "RANK function runs faster always",
        "DENSE_RANK works only with dates",
        "There is no practical difference",
        "DENSE_RANK leaves no rank gaps",
      ],
      correct: 4,
      explanation:
        "After ties, RANK skips numbers (1,1,3...) while DENSE_RANK stays sequential (1,1,2...)—important for pagination.",
      timeLimit: 25,
      note: "Window functions (5-word options)",
      distractorLogic: {
        option1: "Learner assumes simpler name means better performance",
        option2: "Learner confused about window function applicability",
        option3: "Learner hasn't seen scenarios where gaps matter",
      },
    },
    {
      pattern: "COMPARE-FUNCTIONS",
      question: "INNER JOIN vs LEFT JOIN: When rows differ?",
      options: [
        "When left table is larger",
        "When right table has no match",
        "When using a WHERE clause",
        "Results are always exactly same",
      ],
      correct: 2,
      explanation:
        "LEFT JOIN preserves unmatched left rows by filling in NULLs—INNER JOIN simply discards rows without matches.",
      timeLimit: 25,
      note: "JOIN types (5-word options)",
      distractorLogic: {
        option1: "Learner thinks table size determines join behavior",
        option3: "Learner thinks WHERE changes JOIN type behavior",
        option4: "Learner doesn't understand when JOINs differ",
      },
    },

    // PREDICT-RESULT - Positions: 3, 1
    {
      pattern: "PREDICT-RESULT",
      question: "COUNT(*) vs COUNT(column) on table with NULLs. Difference?",
      options: [
        "COUNT star excludes NULL values",
        "Both count NULLs same way",
        "COUNT column excludes NULL values",
        "COUNT star causes syntax error",
      ],
      correct: 3,
      explanation:
        "COUNT(*) tallies every row regardless, but COUNT(col) only counts rows where that specific column isn't NULL.",
      timeLimit: 25,
      note: "COUNT variants (5-word options)",
      distractorLogic: {
        option1: "Learner reverses which COUNT excludes NULLs",
        option2: "Learner thinks COUNT behavior is uniform",
        option4: "Learner unfamiliar with COUNT(*) syntax",
      },
    },
    {
      pattern: "PREDICT-RESULT",
      question: "AVG(column) with NULL values. How are NULLs handled?",
      options: [
        "NULLs are ignored in calculation",
        "NULLs are treated as zeros",
        "Query returns NULL as result",
        "Error is thrown for NULLs",
      ],
      correct: 1,
      explanation:
        "AVG quietly ignores NULLs—it sums only non-NULL values and divides by their count, not total rows.",
      timeLimit: 25,
      note: "Aggregate NULL handling (5-word options)",
      distractorLogic: {
        option2: "Learner thinks NULL equals 0 in aggregates",
        option3: "Learner thinks any NULL makes result NULL",
        option4: "Learner expects SQL to be strict about NULLs",
      },
    },
  ],
};

// ============================================================================
// MATH/STATS - Interpretation & Application
// ============================================================================

export const MATH_STATS_PATTERNS: ModulePatterns = {
  description: `Statistics for data science and ML model evaluation.
Tests interpretation and application, not formula memorization.
Focus: Hypothesis testing, p-values, confidence intervals, A/B testing`,

  patterns: [
    {
      name: "INTERPRETATION",
      description: "What does this statistical result mean",
      format: "What does [result] tell us?",
      timeRange: "25s",
    },
    {
      name: "MISCONCEPTION",
      description: "Identify common statistical mistakes",
      format: "Why is this interpretation wrong?",
      timeRange: "25s",
    },
    {
      name: "APPLICATION",
      description: "When to use which statistical method",
      format: "Which method for [scenario]?",
      timeRange: "25s",
    },
    {
      name: "DECISION",
      description: "Make decisions based on statistical results",
      format: "Given [results], what should you conclude?",
      timeRange: "25-30s",
    },
    {
      name: "CAUSE-EFFECT",
      description: "Understanding relationships and causation",
      format: "Why does [X] affect [Y]?",
      timeRange: "25s",
    },
  ],

  examples: [
    // INTERPRETATION - Positions: 4, 2
    {
      pattern: "INTERPRETATION",
      question: "p-value of 0.03 in your A/B test. What does this mean?",
      options: [
        "Treatment is exactly 97% effective",
        "3% of your users converted",
        "You need 3% more data",
        "3% chance if null is true",
      ],
      correct: 4,
      explanation:
        "p-value is the probability of seeing this result assuming the null hypothesis is true—not the probability the treatment works.",
      timeLimit: 25,
      note: "p-value interpretation (5-word options)",
      distractorLogic: {
        option1: "Learner inverts p-value to get 'effectiveness' percentage",
        option2: "Learner confuses p-value with conversion rate metric",
        option3: "Learner thinks p-value indicates data sufficiency",
      },
    },
    {
      pattern: "INTERPRETATION",
      question: "95% confidence interval [10, 20]. What does this mean?",
      options: [
        "95% of data falls here",
        "True value likely in range",
        "Mean is 95% likely 15",
        "Sample size was exactly 95",
      ],
      correct: 2,
      explanation:
        "CI tells you where the true population parameter likely falls—it's not about data distribution or specific values.",
      timeLimit: 25,
      note: "Confidence interval (4-word options)",
      distractorLogic: {
        option1: "Learner confuses CI with data distribution percentiles",
        option3: "Learner thinks CI gives probability for specific values",
        option4: "Learner confuses 95% confidence with sample size",
      },
    },

    // MISCONCEPTION - Positions: 1, 3
    {
      pattern: "MISCONCEPTION",
      question: "p-value < 0.05 means the effect is large. Why is this wrong?",
      options: [
        "p-value shows significance not size",
        "0.05 is too strict a threshold",
        "p-values cannot be below 0.05",
        "Large effects have higher p-values",
      ],
      correct: 1,
      explanation:
        "Statistical significance isn't practical significance—large samples can detect tiny effects that don't matter in practice.",
      timeLimit: 25,
      note: "p-value misconception (5-word options)",
      distractorLogic: {
        option2: "Learner thinks the threshold itself is the problem",
        option3: "Learner doesn't understand p-value ranges",
        option4: "Learner reverses relationship between effect and p-value",
      },
    },
    {
      pattern: "MISCONCEPTION",
      question: "Correlation of 0.9 means X causes Y. Why is this flawed?",
      options: [
        "0.9 is too low for causation",
        "Need correlation of exactly 1.0",
        "Correlation doesn't imply any causation",
        "Correlation is always perfectly causal",
      ],
      correct: 3,
      explanation:
        "Strong correlation reveals relationship but not causation—both variables could be driven by a hidden third factor.",
      timeLimit: 25,
      note: "Correlation vs causation (5-word options)",
      distractorLogic: {
        option1: "Learner thinks higher correlation means more causation",
        option2: "Learner thinks perfect correlation required for causation",
        option4: "Learner never learned correlation-causation distinction",
      },
    },

    // APPLICATION - Positions: 2, 4
    {
      pattern: "APPLICATION",
      question: "Comparing means of 3+ groups. Which test?",
      options: [
        "Two-sample t-test for pairs",
        "ANOVA for multiple groups",
        "Chi-square for associations",
        "Simple correlation coefficient",
      ],
      correct: 2,
      explanation:
        "ANOVA handles three or more groups at once—pairwise t-tests inflate error rates when comparing multiple groups.",
      timeLimit: 25,
      note: "Test selection (4-word options)",
      distractorLogic: {
        option1: "Learner tries to apply pairwise t-tests (inflates error)",
        option3:
          "Learner confuses mean comparison with categorical association",
        option4:
          "Learner confuses comparing groups with measuring relationships",
      },
    },
    {
      pattern: "APPLICATION",
      question: "Testing if survey responses differ by category. Which test?",
      options: [
        "Linear regression for prediction",
        "ANOVA for continuous outcomes",
        "Paired t-test for comparison",
        "Chi-square for categorical data",
      ],
      correct: 4,
      explanation:
        "Chi-square tests categorical associations—perfect for checking if response distributions differ across groups.",
      timeLimit: 25,
      note: "Categorical testing (4-word options)",
      distractorLogic: {
        option1: "Learner defaults to regression for any comparison",
        option2: "Learner thinks ANOVA works for categorical outcomes",
        option3:
          "Learner confuses independent categories with paired measurements",
      },
    },

    // DECISION - Positions: 3, 1
    {
      pattern: "DECISION",
      question:
        "A/B test: p=0.08, effect size is 15% revenue increase. Decision?",
      options: [
        "Reject because p exceeds 0.05",
        "Accept because 15% is high",
        "Consider practical significance too",
        "Test is completely invalid now",
      ],
      correct: 3,
      explanation:
        "Borderline p-value with large effect warrants nuanced consideration—practical significance matters, not just statistical cutoffs.",
      timeLimit: 30,
      note: "Practical vs statistical (5-word options)",
      distractorLogic: {
        option1: "Learner rigidly applies p < 0.05 rule without context",
        option2: "Learner ignores statistical significance for business metric",
        option4: "Learner thinks any ambiguity invalidates the test",
      },
    },
    {
      pattern: "DECISION",
      question: "Sample size 50, p-value 0.001. Very confident in results?",
      options: [
        "Check effect size and power",
        "Yes because p-value is low",
        "No because need lower p-value",
        "Sample size does not matter",
      ],
      correct: 1,
      explanation:
        "Small samples can show low p-values yet have low power—always verify the effect size is meaningful before celebrating.",
      timeLimit: 30,
      note: "Sample size considerations (5-word options)",
      distractorLogic: {
        option2: "Learner trusts low p-value alone without checking power",
        option3: "Learner thinks even lower p-value is the solution",
        option4: "Learner doesn't understand sample size affects reliability",
      },
    },

    // CAUSE-EFFECT - Positions: 2, 4
    {
      pattern: "CAUSE-EFFECT",
      question: "Why does increasing sample size narrow confidence intervals?",
      options: [
        "Larger samples change the population",
        "More data reduces estimate uncertainty",
        "CI formula ignores sample size",
        "Only true for normal distributions",
      ],
      correct: 2,
      explanation:
        "More data gives a more precise estimate—the standard error shrinks with sample size, naturally narrowing the interval.",
      timeLimit: 25,
      note: "Sample size effect (5-word options)",
      distractorLogic: {
        option1:
          "Learner confuses sample statistics with population parameters",
        option3: "Learner doesn't know sample size affects CI via SE",
        option4: "Learner thinks CI narrowing requires specific distributions",
      },
    },
    {
      pattern: "CAUSE-EFFECT",
      question: "Why does high variance in data make detecting effects harder?",
      options: [
        "Variance doesn't affect effect detection",
        "High variance means more effects",
        "Only affects categorical data types",
        "Signal gets buried in noise",
      ],
      correct: 4,
      explanation:
        "High variance means more noise—the true effect gets buried and becomes harder to distinguish from random fluctuations.",
      timeLimit: 25,
      note: "Variance and detection (5-word options)",
      distractorLogic: {
        option1:
          "Learner thinks statistical tests adjust for variance automatically",
        option2: "Learner confuses variance with having multiple effects",
        option3:
          "Learner doesn't understand variance applies to continuous data",
      },
    },
  ],
};

// ============================================================================
// MACHINE LEARNING - Trade-offs & Debugging
// ============================================================================

export const ML_PATTERNS: ModulePatterns = {
  description: `Machine learning for practical applications.
Tests trade-off reasoning and debugging, not textbook definitions.
Focus: Regularization, ensemble methods, metrics, cross-validation, bias-variance`,

  patterns: [
    {
      name: "DIAGNOSE",
      description: "Identify ML problems from symptoms",
      format: "Model shows [symptoms]. What's the issue?",
      timeRange: "25-30s",
    },
    {
      name: "TRADE-OFF",
      description: "Choose between competing approaches",
      format: "When to prefer X over Y?",
      timeRange: "25s",
    },
    {
      name: "MECHANISM-WHY",
      description: "Explain why ML techniques work",
      format: "Why does [technique] improve [metric]?",
      timeRange: "25s",
    },
    {
      name: "METRIC-CHOICE",
      description: "Select appropriate evaluation metrics",
      format: "Which metric for [scenario]?",
      timeRange: "25s",
    },
    {
      name: "FIX-STRATEGY",
      description: "How to address ML problems",
      format: "Model has [problem]. Best fix?",
      timeRange: "25s",
    },
  ],

  examples: [
    // DIAGNOSE - Positions: 1, 3
    {
      pattern: "DIAGNOSE",
      question: "Training accuracy 98%, test accuracy 72%. What's happening?",
      options: [
        "Model is overfitting the data",
        "Model is underfitting the data",
        "Data has many label errors",
        "Test set is way too small",
      ],
      correct: 1,
      explanation:
        "That 26% gap between training and test accuracy is classic overfitting—the model memorized training data instead of learning patterns.",
      timeLimit: 25,
      note: "Overfitting diagnosis (5-word options)",
      distractorLogic: {
        option2:
          "Learner confuses over/underfitting symptoms (underfitting has low train too)",
        option3: "Learner blames data quality instead of model complexity",
        option4: "Learner thinks small test set causes train-test gap",
      },
    },
    {
      pattern: "DIAGNOSE",
      question: "Model predicts same class for all inputs. Likely cause?",
      options: [
        "Learning rate is way too low",
        "Test data is perfectly balanced",
        "Severe class imbalance in data",
        "Too many features in dataset",
      ],
      correct: 3,
      explanation:
        "When data is heavily imbalanced, predicting majority class looks accurate—but the model learned nothing useful.",
      timeLimit: 25,
      note: "Class imbalance (5-word options)",
      distractorLogic: {
        option1: "Learner thinks learning rate causes constant predictions",
        option2: "Learner misunderstands what 'same class for all' means",
        option4: "Learner thinks feature count causes degenerate predictions",
      },
    },

    // TRADE-OFF - Positions: 4, 2
    {
      pattern: "TRADE-OFF",
      question: "When prefer L1 (Lasso) over L2 (Ridge) regularization?",
      options: [
        "When all features are important",
        "When your data is perfectly clean",
        "L2 is always the better choice",
        "When you want feature selection",
      ],
      correct: 4,
      explanation:
        "L1 drives some coefficients to exactly zero—effectively selecting the most important features automatically.",
      timeLimit: 25,
      note: "Regularization choice (5-word options)",
      distractorLogic: {
        option1: "Learner reverses when to use L1 vs L2",
        option2: "Learner thinks regularization choice depends on data quality",
        option3: "Learner defaults to L2 without understanding trade-offs",
      },
    },
    {
      pattern: "TRADE-OFF",
      question:
        "Random Forest vs single Decision Tree. When prefer single tree?",
      options: [
        "When accuracy is top priority",
        "When interpretability is absolutely critical",
        "Never because always use forest",
        "When dataset is extremely large",
      ],
      correct: 2,
      explanation:
        "Single trees let you trace each decision visually—forests sacrifice that interpretability for better accuracy.",
      timeLimit: 25,
      note: "Interpretability trade-off (5-word options)",
      distractorLogic: {
        option1: "Learner thinks single trees can be most accurate",
        option3: "Learner believes ensembles are always better unconditionally",
        option4: "Learner thinks dataset size determines tree vs forest",
      },
    },

    // MECHANISM-WHY - Positions: 3, 1
    {
      pattern: "MECHANISM-WHY",
      question: "Why does dropout help neural networks generalize?",
      options: [
        "Removes noisy training data points",
        "Increases model capacity significantly",
        "Prevents co-adaptation of neurons",
        "Speeds up training time significantly",
      ],
      correct: 3,
      explanation:
        "Dropout randomly disables neurons during training—this forces remaining neurons to learn more robust features.",
      timeLimit: 25,
      note: "Dropout mechanism (4-word options)",
      distractorLogic: {
        option1: "Learner confuses dropout (on neurons) with data cleaning",
        option2:
          "Learner thinks disabling neurons increases capacity (opposite)",
        option4:
          "Learner thinks dropout speeds training (actually slows slightly)",
      },
    },
    {
      pattern: "MECHANISM-WHY",
      question: "Why does ensemble averaging reduce variance?",
      options: [
        "Different model errors cancel out",
        "More models means more data",
        "Averaging removes all model bias",
        "Ensembles don't actually reduce variance",
      ],
      correct: 1,
      explanation:
        "Different models make different mistakes—when you average them, their individual errors tend to cancel each other out.",
      timeLimit: 25,
      note: "Ensemble benefits (5-word options)",
      distractorLogic: {
        option2: "Learner confuses model count with data augmentation",
        option3:
          "Learner thinks averaging affects bias (it mainly reduces variance)",
        option4:
          "Learner doesn't understand ensemble variance reduction mechanism",
      },
    },

    // METRIC-CHOICE - Positions: 4, 2
    {
      pattern: "METRIC-CHOICE",
      question: "Fraud detection (1% fraud rate). Best primary metric?",
      options: [
        "Accuracy on test data",
        "R-squared regression metric",
        "Mean Squared Error value",
        "Precision-Recall AUC score",
      ],
      correct: 4,
      explanation:
        "With 99% non-fraud, accuracy is useless—PR-AUC actually measures how well you catch the rare fraud cases.",
      timeLimit: 25,
      note: "Imbalanced metrics (4-word options)",
      distractorLogic: {
        option1: "Learner defaults to accuracy without considering imbalance",
        option2:
          "Learner confuses classification metrics with regression R-squared",
        option3: "Learner confuses classification with regression MSE metric",
      },
    },
    {
      pattern: "METRIC-CHOICE",
      question:
        "Medical diagnosis where missing disease is dangerous. Prioritize?",
      options: [
        "Precision for false positives",
        "Recall for catching all cases",
        "Accuracy overall across classes",
        "Specificity for true negatives",
      ],
      correct: 2,
      explanation:
        "Recall catches more true positives—in medicine, missing a disease (false negative) is far worse than a false alarm.",
      timeLimit: 25,
      note: "Recall vs precision (4-word options)",
      distractorLogic: {
        option1: "Learner confuses precision with recall use cases",
        option3: "Learner defaults to accuracy without considering error costs",
        option4: "Learner confuses specificity with sensitivity/recall",
      },
    },

    // FIX-STRATEGY - Positions: 1, 3
    {
      pattern: "FIX-STRATEGY",
      question: "Model overfitting badly. Which will NOT help?",
      options: [
        "Adding more features to model",
        "Adding regularization to model",
        "Getting more training data points",
        "Using dropout during training",
      ],
      correct: 1,
      explanation:
        "More features just give the model more ways to memorize—regularization, more data, and dropout all combat overfitting.",
      timeLimit: 25,
      note: "Overfitting remedies (5-word options)",
      distractorLogic: {
        option2: "Learner might think regularization doesn't help overfitting",
        option3: "Learner might think more data doesn't help overfitting",
        option4: "Learner might think dropout doesn't help overfitting",
      },
    },
    {
      pattern: "FIX-STRATEGY",
      question: "Both training and test accuracy are low (~60%). Best fix?",
      options: [
        "Add stronger regularization terms",
        "Reduce amount of training data",
        "Use a more complex model",
        "Lower the learning rate value",
      ],
      correct: 3,
      explanation:
        "Low training accuracy means underfitting—your model can't capture patterns, so it needs more capacity, not less.",
      timeLimit: 25,
      note: "Underfitting fix (5-word options)",
      distractorLogic: {
        option1:
          "Learner applies regularization for underfitting (wrong direction)",
        option2: "Learner thinks less data helps (opposite needed)",
        option4: "Learner thinks learning rate is the issue here",
      },
    },
  ],
};

// ============================================================================
// DEEP LEARNING - Architecture & Debugging
// ============================================================================

export const DL_PATTERNS: ModulePatterns = {
  description: `Deep learning for neural network development.
Tests architecture reasoning and debugging, not basic definitions.
Focus: PyTorch, CNNs, Transformers, dropout, batch norm, gradient flow`,

  patterns: [
    {
      name: "DEBUG-TRAINING",
      description: "Diagnose training issues",
      format: "Loss shows [behavior]. What's wrong?",
      timeRange: "25-30s",
    },
    {
      name: "ARCHITECTURE-WHY",
      description: "Explain architectural choices",
      format: "Why use [component] in [context]?",
      timeRange: "25s",
    },
    {
      name: "PREDICT-BEHAVIOR",
      description: "What happens with this configuration",
      format: "What happens when [change]?",
      timeRange: "25s",
    },
    {
      name: "COMPARE-LAYERS",
      description: "Understand differences between layer types",
      format: "When to use X vs Y layer?",
      timeRange: "25s",
    },
    {
      name: "FIX-ISSUE",
      description: "How to address DL problems",
      format: "Training shows [issue]. Fix?",
      timeRange: "25s",
    },
  ],

  examples: [
    // DEBUG-TRAINING - Positions: 2, 4
    {
      pattern: "DEBUG-TRAINING",
      question: "Loss is NaN after few epochs. Most likely cause?",
      options: [
        "Too many training epochs ran",
        "Learning rate is way too high",
        "Batch size is way too large",
        "Model capacity is way too small",
      ],
      correct: 2,
      explanation:
        "A learning rate that's too high makes gradients explode—weights balloon until they overflow to NaN.",
      timeLimit: 25,
      note: "NaN loss debugging (6-word options)",
      distractorLogic: {
        option1: "Learner thinks more training directly causes NaN",
        option3: "Learner confuses batch size with gradient explosion issues",
        option4: "Learner thinks small model capacity causes numerical issues",
      },
    },
    {
      pattern: "DEBUG-TRAINING",
      question:
        "Training loss decreasing but validation loss increasing. Issue?",
      options: [
        "Learning rate is running too low",
        "Model needs many more epochs",
        "Model is severely underfitting data",
        "Overfitting is starting to happen",
      ],
      correct: 4,
      explanation:
        "When train loss drops but validation rises, that's textbook overfitting—the model is memorizing instead of generalizing.",
      timeLimit: 25,
      note: "Overfitting detection (5-word options)",
      distractorLogic: {
        option1: "Learner thinks LR affects train/val divergence direction",
        option2: "Learner thinks more training fixes divergence (worsens it)",
        option3: "Learner confuses over/underfitting symptoms completely",
      },
    },

    // ARCHITECTURE-WHY - Positions: 1, 3
    {
      pattern: "ARCHITECTURE-WHY",
      question: "Why use batch normalization in deep networks?",
      options: [
        "Stabilizes training and reduces covariate shift",
        "Reduces the overall model parameter size",
        "Eliminates need for activation function layers",
        "Only useful for CNN image architectures",
      ],
      correct: 1,
      explanation:
        "BatchNorm normalizes layer inputs—this allows higher learning rates and faster, more stable training.",
      timeLimit: 25,
      note: "BatchNorm purpose (6-word options)",
      distractorLogic: {
        option2: "Learner thinks normalization reduces parameters (adds them)",
        option3: "Learner confuses normalization with activation functions",
        option4:
          "Learner thinks BatchNorm is architecture-specific (it's general)",
      },
    },
    {
      pattern: "ARCHITECTURE-WHY",
      question: "Why do Transformers use multi-head attention?",
      options: [
        "Reduce overall computation cost significantly",
        "Replace all other layer types",
        "Attend to different representation subspaces",
        "Only useful for image tasks",
      ],
      correct: 3,
      explanation:
        "Multiple heads let the model focus on different aspects of input simultaneously—like parallel pattern detectors.",
      timeLimit: 25,
      note: "Multi-head attention (5-word options)",
      distractorLogic: {
        option1: "Learner thinks more heads means less computation",
        option2:
          "Learner thinks attention replaces feedforward layers entirely",
        option4: "Learner thinks transformers are image-specific only",
      },
    },

    // PREDICT-BEHAVIOR - Positions: 2, 4
    {
      pattern: "PREDICT-BEHAVIOR",
      question: "What happens if you forget `model.eval()` before inference?",
      options: [
        "Model inference runs much faster",
        "Dropout and BatchNorm behave incorrectly",
        "Gradients get computed during inference",
        "No effect on model output",
      ],
      correct: 2,
      explanation:
        "Without eval(), dropout keeps randomly zeroing neurons and BatchNorm uses batch stats—giving inconsistent, wrong results.",
      timeLimit: 25,
      note: "Train vs eval mode (5-word options)",
      distractorLogic: {
        option1: "Learner thinks training mode is faster (eval is faster)",
        option3: "Learner confuses eval() with torch.no_grad()",
        option4: "Learner doesn't know dropout/BN differ between train/eval",
      },
    },
    {
      pattern: "PREDICT-BEHAVIOR",
      question: "What happens with very small batch size (e.g., 2)?",
      options: [
        "Training converges much faster overall",
        "Better generalization is always achieved",
        "Out of memory error occurs",
        "Noisy gradients cause unstable training",
      ],
      correct: 4,
      explanation:
        "With only 2 samples, your gradient estimate is extremely noisy—training becomes unstable and hard to converge.",
      timeLimit: 25,
      note: "Batch size effects (5-word options)",
      distractorLogic: {
        option1: "Learner thinks smaller batches mean faster convergence",
        option2:
          "Learner heard small batches generalize better (partially true but noisy)",
        option3:
          "Learner reverses batch size memory relationship (large causes OOM)",
      },
    },

    // COMPARE-LAYERS - Positions: 1, 3
    {
      pattern: "COMPARE-LAYERS",
      question: "When prefer LSTM over simple RNN?",
      options: [
        "Long sequences with distant dependencies",
        "Very short sequences only needed",
        "When inference speed is critical",
        "For image classification tasks only",
      ],
      correct: 1,
      explanation:
        "LSTM's gates control what to remember and forget—vanilla RNNs lose information across long sequences.",
      timeLimit: 25,
      note: "RNN vs LSTM (5-word options)",
      distractorLogic: {
        option2: "Learner thinks LSTM is for short sequences",
        option3: "Learner thinks LSTM is faster (it's slower)",
        option4: "Learner confuses sequence models with image architectures",
      },
    },
    {
      pattern: "COMPARE-LAYERS",
      question: "CNN vs fully-connected for image input. Why CNN?",
      options: [
        "Always more accurate without exception",
        "Much easier to implement correctly",
        "Exploits spatial structure with fewer params",
        "Works equally on any data type",
      ],
      correct: 3,
      explanation:
        "CNNs share weights spatially—they learn local patterns with far fewer parameters than fully-connected layers need.",
      timeLimit: 25,
      note: "CNN advantages (5-word options)",
      distractorLogic: {
        option1:
          "Learner thinks CNN is universally best (FC can win sometimes)",
        option2: "Learner thinks CNNs are simpler (more hyperparameters)",
        option4: "Learner doesn't understand CNNs are specialized for spatial",
      },
    },

    // FIX-ISSUE - Positions: 4, 2
    {
      pattern: "FIX-ISSUE",
      question: "Gradients vanishing in deep network. Best fix?",
      options: [
        "Make the network even deeper",
        "Remove all activation function layers",
        "Increase batch size significantly more",
        "Use skip connections like ResNet",
      ],
      correct: 4,
      explanation:
        "Skip connections let gradients flow directly to earlier layers—they bypass the vanishing gradient problem.",
      timeLimit: 25,
      note: "Vanishing gradient fix (5-word options)",
      distractorLogic: {
        option1: "Learner thinks more depth fixes vanishing (worsens it)",
        option2:
          "Learner thinks activations cause vanishing (wrong choice causes it)",
        option3: "Learner confuses batch size with gradient flow",
      },
    },
    {
      pattern: "FIX-ISSUE",
      question: "Model not learning at all (loss flat). First thing to check?",
      options: [
        "Add many more layers immediately",
        "Learning rate and data pipeline",
        "Train for many more epochs",
        "Use a smaller batch size",
      ],
      correct: 2,
      explanation:
        "When loss stays flat, start with basics—usually it's either too-low learning rate or data not flowing correctly.",
      timeLimit: 25,
      note: "No learning debugging (5-word options)",
      distractorLogic: {
        option1: "Learner tries to fix capacity before confirming data flows",
        option3:
          "Learner thinks more training fixes flat loss (doesn't if LR wrong)",
        option4: "Learner thinks batch size causes flat loss (rarely)",
      },
    },
  ],
};

// ============================================================================
// NLP - Transformer Mechanisms
// ============================================================================

export const NLP_PATTERNS: ModulePatterns = {
  description: `NLP and Transformers for text processing.
Tests understanding of mechanisms, not library syntax.
Focus: BERT, tokenization, embeddings, fine-tuning, Hugging Face`,

  patterns: [
    {
      name: "MECHANISM-WHY",
      description: "Explain why NLP techniques work",
      format: "Why does [technique] work this way?",
      timeRange: "25s",
    },
    {
      name: "TOKENIZATION",
      description: "Understanding tokenization behavior",
      format: "How does [tokenizer] handle [input]?",
      timeRange: "25s",
    },
    {
      name: "MODEL-CHOICE",
      description: "When to use which model/approach",
      format: "Which approach for [task]?",
      timeRange: "25s",
    },
    {
      name: "DEBUG-NLP",
      description: "Diagnose NLP-specific issues",
      format: "NLP model shows [issue]. Cause?",
      timeRange: "25s",
    },
    {
      name: "COMPARE-APPROACHES",
      description: "Understand different NLP approaches",
      format: "Difference between X and Y?",
      timeRange: "25s",
    },
  ],

  examples: [
    // MECHANISM-WHY - Positions: 3, 1
    {
      pattern: "MECHANISM-WHY",
      question: "Why does BERT use [MASK] token during pre-training?",
      options: [
        "Reduces the overall vocabulary size",
        "Speeds up training time significantly",
        "Forces bidirectional context learning",
        "Required for all transformer architectures",
      ],
      correct: 3,
      explanation:
        "Masking forces the model to use both left and right context—that's how BERT learns bidirectional representations.",
      timeLimit: 25,
      note: "BERT masking purpose (5-word options)",
      distractorLogic: {
        option1: "Learner thinks MASK affects vocabulary size somehow",
        option2: "Learner confuses training objective with training speed",
        option4: "Learner thinks all transformers use masking (GPT doesn't)",
      },
    },
    {
      pattern: "MECHANISM-WHY",
      question: "Why do transformer models need positional encodings?",
      options: [
        "Self-attention lacks any position information",
        "Reduces overall memory usage significantly",
        "Only needed for image transformer models",
        "Makes model training run much faster",
      ],
      correct: 1,
      explanation:
        "Self-attention treats tokens as an unordered set—positional encoding tells the model where each token sits in sequence.",
      timeLimit: 25,
      note: "Positional encoding (5-word options)",
      distractorLogic: {
        option2:
          "Learner confuses positional encoding with memory optimization",
        option3: "Learner thinks positional encoding is only for ViTs",
        option4: "Learner thinks positional info helps training speed",
      },
    },

    // TOKENIZATION - Positions: 2, 4
    {
      pattern: "TOKENIZATION",
      question:
        "WordPiece tokenizes 'unhappiness' as ['un', '##happi', '##ness']. Why '##' prefix?",
      options: [
        "Marks the start of word",
        "Indicates continuation of previous token",
        "Signals that word is rare",
        "Has no special meaning here",
      ],
      correct: 2,
      explanation:
        "The ## tells you this piece continues the previous token—it's how you know to concatenate them when reconstructing words.",
      timeLimit: 25,
      note: "Subword tokenization (5-word options)",
      distractorLogic: {
        option1: "Learner reverses meaning of ## prefix",
        option3: "Learner thinks ## marks uncommon tokens",
        option4: "Learner doesn't understand tokenizer conventions",
      },
    },
    {
      pattern: "TOKENIZATION",
      question: "Why might 'ChatGPT' tokenize differently than 'chat' + 'GPT'?",
      options: [
        "Capital letters are completely ignored",
        "Proper nouns are always skipped",
        "Tokenization is always exactly same",
        "Tokenizer learned it as single unit",
      ],
      correct: 4,
      explanation:
        "Tokenizers learn from training frequency—if 'ChatGPT' appeared often enough, it became its own token.",
      timeLimit: 25,
      note: "Token frequency effects (5-word options)",
      distractorLogic: {
        option1: "Learner thinks case is ignored in tokenization",
        option2: "Learner thinks proper nouns get special handling",
        option3: "Learner doesn't know tokenization varies by frequency",
      },
    },

    // MODEL-CHOICE - Positions: 1, 3
    {
      pattern: "MODEL-CHOICE",
      question: "Task: Classify sentiment of product reviews. Best approach?",
      options: [
        "Fine-tune BERT on labeled reviews",
        "Train transformer completely from scratch",
        "Use simple rule-based keyword matching",
        "GPT-4 without any fine-tuning done",
      ],
      correct: 1,
      explanation:
        "Fine-tuning pretrained BERT on domain data gives you the best of both worlds—pretrained knowledge plus task-specific learning.",
      timeLimit: 25,
      note: "Fine-tuning for classification (5-word options)",
      distractorLogic: {
        option2: "Learner thinks training from scratch beats fine-tuning",
        option3: "Learner falls back to simple rules (miss nuance)",
        option4: "Learner thinks GPT-4 zero-shot always beats fine-tuned",
      },
    },
    {
      pattern: "MODEL-CHOICE",
      question: "Need text embeddings for semantic search. Best option?",
      options: [
        "Word2Vec with word averaging approach",
        "TF-IDF sparse vector representations",
        "Sentence transformers like all-MiniLM model",
        "Random embeddings without any training",
      ],
      correct: 3,
      explanation:
        "Sentence transformers are trained specifically for semantic similarity—ideal for search where meaning matters.",
      timeLimit: 25,
      note: "Embedding model choice (5-word options)",
      distractorLogic: {
        option1:
          "Learner uses outdated method (Word2Vec loses sentence semantics)",
        option2: "Learner confuses sparse vectors with semantic embeddings",
        option4: "Learner doesn't understand embeddings need training",
      },
    },

    // DEBUG-NLP - Positions: 2, 4
    {
      pattern: "DEBUG-NLP",
      question: "BERT model outputs same prediction for all inputs. Cause?",
      options: [
        "Tokenizer is working completely correctly",
        "Catastrophic forgetting during fine-tuning process",
        "Model is way too large",
        "Need many more attention heads",
      ],
      correct: 2,
      explanation:
        "Aggressive fine-tuning wipes out what BERT learned—use a gentler learning rate to avoid catastrophic forgetting.",
      timeLimit: 25,
      note: "Catastrophic forgetting (5-word options)",
      distractorLogic: {
        option1: "Learner thinks tokenizer causes constant predictions",
        option3: "Learner thinks model size causes degenerate outputs",
        option4: "Learner thinks attention heads cause constant predictions",
      },
    },
    {
      pattern: "DEBUG-NLP",
      question: "Text classification accuracy drops with longer inputs. Why?",
      options: [
        "Longer text is always harder",
        "Model needs many more parameters",
        "Tokenizer implementation has bugs somewhere",
        "Input exceeds the max token length",
      ],
      correct: 4,
      explanation:
        "BERT's 512-token limit means longer inputs get truncated—you're literally losing the end of your text.",
      timeLimit: 25,
      note: "Token length limits (5-word options)",
      distractorLogic: {
        option1:
          "Learner thinks longer equals harder without considering truncation",
        option2: "Learner thinks model size is the bottleneck",
        option3: "Learner blames tokenizer for context limit issue",
      },
    },

    // COMPARE-APPROACHES - Positions: 3, 1
    {
      pattern: "COMPARE-APPROACHES",
      question:
        "Fine-tuning vs prompt engineering for new task. Key difference?",
      options: [
        "Prompting is always more accurate",
        "Fine-tuning requires no labeled data",
        "Fine-tuning updates weights, prompting doesn't",
        "There is no practical difference",
      ],
      correct: 3,
      explanation:
        "Fine-tuning actually modifies the model's weights, while prompting just instructs a frozen model—fundamentally different approaches.",
      timeLimit: 25,
      note: "Fine-tuning vs prompting (5-word options)",
      distractorLogic: {
        option1: "Learner overestimates prompting capabilities",
        option2: "Learner forgets fine-tuning requires labeled data",
        option4: "Learner doesn't understand fundamental difference",
      },
    },
    {
      pattern: "COMPARE-APPROACHES",
      question: "BERT vs GPT architecture. Key structural difference?",
      options: [
        "BERT encoder-only, GPT decoder-only",
        "GPT is much older than BERT",
        "BERT only does text generation",
        "Same architecture just different data",
      ],
      correct: 1,
      explanation:
        "BERT reads bidirectionally for understanding tasks, while GPT reads left-to-right for generation—fundamentally different designs.",
      timeLimit: 25,
      note: "BERT vs GPT architecture (5-word options)",
      distractorLogic: {
        option2: "Learner has wrong timeline (both from 2018)",
        option3: "Learner reverses which does generation (GPT generates)",
        option4: "Learner thinks only training data differs",
      },
    },
  ],
};

// ============================================================================
// GEN AI - RAG & System Design (Codebasics Bootcamp Aligned)
// ============================================================================

/*
 * DIFFICULTY & TIME DISTRIBUTION (Codebasics GenAI Bootcamp):
 *
 * Per 10 questions:
 * - HARD (30-35s): 1 question - Complex architecture decisions, multi-step debugging
 * - MEDIUM (25-30s): 7 questions - Standard implementation patterns
 * - EASY (20-25s): 2 questions - Tool recognition, basic concepts
 *
 * TOPICS: DYNAMICALLY DISCOVERED VIA WEB SEARCH
 * - Topics are NOT hardcoded - LLM must search for current bootcamp curriculum
 * - Search "Codebasics GenAI bootcamp" to find actual modules taught
 * - Align questions with discovered bootcamp topics
 * - Each topic must be VERIFIED via web search before use
 *
 * STRICT SEPARATION FROM GENERAL AI:
 * - Gen AI = HOW to build (code, architecture, debugging, implementation)
 * - General AI = WHAT is happening (industry, trends, ethics, laws, research)
 * - NEVER overlap - no industry/ethics/AGI questions in Gen AI
 */

export const GEN_AI_PATTERNS: ModulePatterns = {
  description: `Generative AI for building LLM applications (Codebasics Bootcamp).
Tests system design trade-offs, debugging, and implementation decisions.
TOPICS: Dynamically discovered via web search - align with Codebasics bootcamp curriculum.
SEPARATION: Technical HOW-TO only - NEVER overlap with General AI (industry awareness).`,

  patterns: [
    // HARD PATTERNS (30-35s) - 1 per quiz
    {
      name: "ARCHITECTURE-DEBUG",
      description: "Complex multi-step RAG debugging requiring system-level thinking",
      format: "RAG system shows [complex symptom]. Trace through pipeline to find cause.",
      timeRange: "30-35s",
    },
    {
      name: "SYSTEM-DESIGN",
      description: "Design decisions for production LLM applications",
      format: "Building [application type]. Which architecture components and why?",
      timeRange: "30-35s",
    },
    // MEDIUM PATTERNS (25-30s) - 7 per quiz
    {
      name: "DESIGN-TRADE-OFF",
      description: "Choose between architectural options with clear trade-offs",
      format: "When to prefer X over Y in RAG?",
      timeRange: "25-30s",
    },
    {
      name: "DEBUG-RAG",
      description: "Diagnose RAG system issues from symptoms",
      format: "RAG returns [problem]. Most likely cause?",
      timeRange: "25-30s",
    },
    {
      name: "PARAMETER-EFFECT",
      description: "Understand LLM parameter impacts on output",
      format: "What happens when [parameter] changes?",
      timeRange: "25-30s",
    },
    {
      name: "MECHANISM-WHY",
      description: "Explain why GenAI techniques work",
      format: "Why does [technique] help with [goal]?",
      timeRange: "25-30s",
    },
    {
      name: "PROMPT-ENGINEERING",
      description: "Best prompting techniques for specific tasks",
      format: "For [task], which prompting technique works best?",
      timeRange: "25-30s",
    },
    {
      name: "EMBEDDING-RETRIEVAL",
      description: "Vector DB and embedding model decisions",
      format: "For [retrieval scenario], what approach?",
      timeRange: "25-30s",
    },
    {
      name: "AGENT-CHAIN",
      description: "Agent and chain design patterns",
      format: "When to use [agent pattern] vs [alternative]?",
      timeRange: "25-30s",
    },
    {
      name: "EVALUATION-METRIC",
      description: "LLM evaluation and testing approaches",
      format: "How to evaluate [LLM output type]?",
      timeRange: "25-30s",
    },
    {
      name: "HALLUCINATION-MITIGATION",
      description: "Strategies to reduce and detect hallucinations",
      format: "How to reduce hallucination for [use case]?",
      timeRange: "25-30s",
    },
    // EASY PATTERNS (20-25s) - 2 per quiz
    {
      name: "TOOL-IDENTIFY",
      description: "Quick identification of GenAI tools and their purposes",
      format: "Which tool/framework for [specific task]?",
      timeRange: "20-25s",
    },
    {
      name: "BEST-PRACTICE",
      description: "Standard best practices for common scenarios",
      format: "Best approach for [scenario]?",
      timeRange: "20-25s",
    },
  ],

  examples: [
    // DESIGN-TRADE-OFF - Positions: 4, 2
    {
      pattern: "DESIGN-TRADE-OFF",
      question:
        "RAG vs fine-tuning for company knowledge base. When prefer RAG?",
      options: [
        "When data never changes at all",
        "When you have unlimited budget",
        "When accuracy doesn't really matter",
        "When data changes frequently often",
      ],
      correct: 4,
      explanation:
        "RAG pulls fresh docs at query time—fine-tuning locks knowledge into weights, which gets stale fast when data changes.",
      timeLimit: 25,
      note: "RAG vs fine-tuning (5-word options)",
      distractorLogic: {
        option1: "Learner reverses when to use RAG vs fine-tuning",
        option2: "Learner thinks RAG is expensive (often cheaper)",
        option3:
          "Learner doesn't understand RAG improves accuracy via grounding",
      },
    },
    {
      pattern: "DESIGN-TRADE-OFF",
      question:
        "Small chunks (100 tokens) vs large chunks (1000 tokens). When prefer small?",
      options: [
        "When documents are very short",
        "When queries target specific facts",
        "When using weak embedding model",
        "Small chunks are always worse",
      ],
      correct: 2,
      explanation:
        "Small chunks let you pinpoint exact facts—larger chunks have more context but match too broadly for precise queries.",
      timeLimit: 25,
      note: "Chunk size trade-off (5-word options)",
      distractorLogic: {
        option1: "Learner confuses document length with optimal chunk size",
        option3: "Learner thinks embedding model determines chunk size",
        option4: "Learner assumes bigger is always better",
      },
    },

    // DEBUG-RAG - Positions: 3, 1
    {
      pattern: "DEBUG-RAG",
      question:
        "RAG retrieves relevant docs but LLM gives wrong answer. Cause?",
      options: [
        "Vector DB is completely corrupted",
        "Embedding model has failed entirely",
        "Context not used properly in prompt",
        "Documents are way too short",
      ],
      correct: 3,
      explanation:
        "Good retrieval but bad output? The prompt template is likely the problem—the LLM might be ignoring your context.",
      timeLimit: 25,
      note: "RAG prompt issues (5-word options)",
      distractorLogic: {
        option1: "Learner blames infrastructure before checking prompt",
        option2: "Learner thinks retrieval success means embedding works",
        option4: "Learner thinks document length causes LLM issues",
      },
    },
    {
      pattern: "DEBUG-RAG",
      question:
        "Semantic search returns irrelevant results. First thing to check?",
      options: [
        "Query and doc embedding alignment",
        "Database connection speed overall here",
        "LLM model size being used",
        "Number of documents stored now",
      ],
      correct: 1,
      explanation:
        "Queries and docs must share the same embedding model—mixing models means their vectors live in different semantic spaces.",
      timeLimit: 25,
      note: "Embedding alignment (5-word options)",
      distractorLogic: {
        option2: "Learner confuses performance issues with relevance",
        option3: "Learner confuses retrieval (embedding) with generation (LLM)",
        option4: "Learner thinks more documents cause irrelevant results",
      },
    },

    // PARAMETER-EFFECT - Positions: 2, 4
    {
      pattern: "PARAMETER-EFFECT",
      question: "Setting temperature=0 in LLM API. What happens?",
      options: [
        "API responds faster overall now",
        "Deterministic output every single time",
        "Random outputs every single time",
        "Model refuses to answer queries",
      ],
      correct: 2,
      explanation:
        "Zero temperature means greedy decoding—the model always picks the most likely token, giving identical outputs each time.",
      timeLimit: 25,
      note: "Temperature effect (5-word options)",
      distractorLogic: {
        option1: "Learner confuses temperature with latency optimization",
        option3: "Learner reverses temperature effect (0 = deterministic)",
        option4: "Learner thinks temperature affects model willingness",
      },
    },
    {
      pattern: "PARAMETER-EFFECT",
      question: "Increasing top_k from 10 to 100. Effect on output?",
      options: [
        "Faster generation speed overall happens",
        "More accurate results always guaranteed",
        "No effect on output quality",
        "More diverse but less coherent",
      ],
      correct: 4,
      explanation:
        "Higher top_k samples from a larger pool of tokens—more creative outputs, but the model might pick weirder words.",
      timeLimit: 25,
      note: "Top-k sampling (5-word options)",
      distractorLogic: {
        option1: "Learner thinks larger pool means faster sampling",
        option2: "Learner thinks diversity equals accuracy",
        option3: "Learner doesn't understand top_k affects token selection",
      },
    },

    // MECHANISM-WHY - Positions: 3, 1
    {
      pattern: "MECHANISM-WHY",
      question: "Why does RAG reduce hallucinations compared to base LLM?",
      options: [
        "Uses more model parameters overall",
        "Trains on much more data",
        "Grounds responses in retrieved facts",
        "RAG eliminates all hallucinations completely",
      ],
      correct: 3,
      explanation:
        "RAG grounds responses in actual documents—the LLM references retrieved facts instead of just generating from training memory.",
      timeLimit: 25,
      note: "RAG hallucination reduction (5-word options)",
      distractorLogic: {
        option1: "Learner thinks RAG increases model capacity (doesn't)",
        option2: "Learner confuses RAG retrieval with additional training",
        option4: "Learner overestimates RAG (reduces, doesn't eliminate)",
      },
    },
    {
      pattern: "MECHANISM-WHY",
      question: "Why use hybrid search (keyword + semantic) in RAG?",
      options: [
        "Captures exact matches and meaning",
        "Faster than semantic search alone",
        "Uses less memory than semantic",
        "Required by all vector databases",
      ],
      correct: 1,
      explanation:
        "Keywords nail exact matches that semantics miss, while semantics understands meaning that keywords miss—together they're stronger.",
      timeLimit: 25,
      note: "Hybrid search benefits (5-word options)",
      distractorLogic: {
        option2: "Learner thinks hybrid is faster (it's slower)",
        option3: "Learner thinks hybrid reduces memory (uses more)",
        option4: "Learner thinks hybrid is a DB requirement",
      },
    },

    // BEST-PRACTICE - Positions: 4, 2
    {
      pattern: "BEST-PRACTICE",
      question:
        "User asks question outside your knowledge base. Best handling?",
      options: [
        "Let LLM generate any answer",
        "Return empty response to user",
        "Crash the application immediately now",
        "Detect and respond I don't know",
      ],
      correct: 4,
      explanation:
        "A graceful 'I don't know' beats a confident hallucination—honesty about limitations builds user trust.",
      timeLimit: 25,
      note: "Out-of-scope handling (5-word options)",
      distractorLogic: {
        option1: "Learner trusts LLM to always give helpful responses",
        option2: "Learner thinks no response is better than admitting",
        option3: "Learner chooses extreme option over graceful handling",
      },
    },
    {
      pattern: "BEST-PRACTICE",
      question: "Building RAG for legal documents. Critical consideration?",
      options: [
        "Make chunks as large as possible",
        "Citation and source attribution required",
        "Use the lowest cost model",
        "Disable retrieval for faster speed",
      ],
      correct: 2,
      explanation:
        "In legal contexts, every claim needs a paper trail—you must show exactly which document each piece of information came from.",
      timeLimit: 25,
      note: "Domain-specific RAG (5-word options)",
      distractorLogic: {
        option1: "Learner thinks bigger chunks equals more context",
        option3: "Learner prioritizes cost over accuracy in high-stakes",
        option4: "Learner prioritizes speed over correctness in legal",
      },
    },

    // ============================================================================
    // ARCHITECTURE-DEBUG Examples (HARD - 35-50s)
    // ============================================================================
    {
      pattern: "ARCHITECTURE-DEBUG",
      question:
        "RAG returns correct info for short queries but fails on long detailed questions. Retrieval scores look good. What's the pipeline issue?",
      options: [
        "Embedding model has size limits",
        "Vector DB index is corrupted",
        "Long queries need query decomposition",
        "LLM context window too small",
      ],
      correct: 3,
      explanation:
        "Long complex queries often need breaking into sub-queries—single embeddings can't capture multiple intents effectively.",
      timeLimit: 35,
      note: "ARCHITECTURE-DEBUG | Query complexity | Position 3 | 35s HARD",
      distractorLogic: {
        option1: "Learner blames embedding model rather than query strategy",
        option2: "Learner jumps to infrastructure issues",
        option4: "Learner confuses retrieval with generation context",
      },
    },
    {
      pattern: "ARCHITECTURE-DEBUG",
      question:
        "Customer support RAG worked perfectly in testing but fails in production with real user queries. Test queries were curated. Root cause?",
      options: [
        "Production servers are too slow",
        "Real queries have typos and variations",
        "Vector DB needs more memory",
        "LLM was updated by provider",
      ],
      correct: 2,
      explanation:
        "Curated test queries don't reflect real user behavior—typos, slang, incomplete sentences need robust query preprocessing.",
      timeLimit: 35,
      note: "ARCHITECTURE-DEBUG | Test vs production gap | Position 2 | 35s HARD",
      distractorLogic: {
        option1: "Learner blames infrastructure for semantic issues",
        option3: "Learner thinks memory affects query understanding",
        option4: "Learner blames external changes without evidence",
      },
    },

    // ============================================================================
    // SYSTEM-DESIGN Examples (HARD - 35-50s)
    // ============================================================================
    {
      pattern: "SYSTEM-DESIGN",
      question:
        "Building a chatbot that answers from 10,000 PDF documents updated weekly. Which architecture component is MOST critical?",
      options: [
        "Largest available LLM model size",
        "Incremental document ingestion pipeline",
        "Real-time streaming response capability",
        "Multi-language translation support built-in",
      ],
      correct: 2,
      explanation:
        "Weekly updates require efficient re-indexing—without incremental ingestion, you'd reprocess all 10K docs every week.",
      timeLimit: 35,
      note: "SYSTEM-DESIGN | Document pipeline | Position 2 | 35s HARD",
      distractorLogic: {
        option1: "Learner prioritizes model size over infrastructure",
        option3: "Learner focuses on UX over data freshness",
        option4: "Learner adds features before core architecture",
      },
    },
    {
      pattern: "SYSTEM-DESIGN",
      question:
        "E-commerce product search needs semantic understanding AND exact SKU matching. Which retrieval architecture?",
      options: [
        "Pure semantic search with embeddings",
        "Hybrid search combining keyword and semantic",
        "Traditional SQL database queries only",
        "Graph database for product relationships",
      ],
      correct: 2,
      explanation:
        "Hybrid search captures both—semantic understands 'comfortable shoes' while keyword finds exact SKU 'ABC-123'.",
      timeLimit: 35,
      note: "SYSTEM-DESIGN | Hybrid retrieval | Position 2 | 35s HARD",
      distractorLogic: {
        option1: "Learner thinks semantic handles everything",
        option3: "Learner falls back to traditional without semantic",
        option4: "Learner overcomplicates with graph DB",
      },
    },

    // ============================================================================
    // PROMPT-ENGINEERING Examples (MEDIUM - 25-30s)
    // ============================================================================
    {
      pattern: "PROMPT-ENGINEERING",
      question:
        "LLM gives inconsistent output formats despite clear instructions. Which technique helps most?",
      options: [
        "Increase temperature for creativity",
        "Add few-shot examples in prompt",
        "Use a larger model instead",
        "Remove all formatting instructions",
      ],
      correct: 2,
      explanation:
        "Few-shot examples show the model exactly what format you want—more effective than describing it in words.",
      timeLimit: 25,
      note: "PROMPT-ENGINEERING | Few-shot | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks creativity helps consistency (opposite)",
        option3: "Learner throws compute at prompting problem",
        option4: "Learner gives up on formatting rather than demonstrating",
      },
    },
    {
      pattern: "PROMPT-ENGINEERING",
      question:
        "Math word problem accuracy is low. Which prompting technique improves reasoning?",
      options: [
        "Make the prompt much shorter",
        "Add chain-of-thought step-by-step instructions",
        "Increase output token limit significantly",
        "Use bullet points for formatting",
      ],
      correct: 2,
      explanation:
        "Chain-of-thought prompting forces the model to show reasoning steps, catching errors before the final answer.",
      timeLimit: 25,
      note: "PROMPT-ENGINEERING | Chain-of-thought | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks shorter equals better (loses context)",
        option3: "Learner confuses output length with reasoning quality",
        option4: "Learner focuses on format over reasoning process",
      },
    },
    {
      pattern: "PROMPT-ENGINEERING",
      question:
        "System prompt says 'respond in JSON' but LLM sometimes adds explanation text. How to enforce?",
      options: [
        "Use stricter system prompt wording",
        "Set response_format to json_object parameter",
        "Lower temperature to zero exactly",
        "Increase max tokens significantly higher",
      ],
      correct: 2,
      explanation:
        "API parameters like response_format enforce structure at the model level—more reliable than prompt instructions alone.",
      timeLimit: 25,
      note: "PROMPT-ENGINEERING | Structured output | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner relies on prompt wording (not guaranteed)",
        option3: "Learner thinks temperature affects format compliance",
        option4: "Learner confuses length with format",
      },
    },

    // ============================================================================
    // EMBEDDING-RETRIEVAL Examples (MEDIUM - 25-30s)
    // ============================================================================
    {
      pattern: "EMBEDDING-RETRIEVAL",
      question:
        "Switching embedding models mid-project. What MUST you do to existing vectors?",
      options: [
        "Just update the model config",
        "Re-embed all documents completely again",
        "Scale vectors by a conversion factor",
        "Keep old vectors for old documents",
      ],
      correct: 2,
      explanation:
        "Different embedding models produce incompatible vector spaces—you must re-embed everything or searches won't work.",
      timeLimit: 25,
      note: "EMBEDDING-RETRIEVAL | Model switch | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks config change is enough",
        option3: "Learner thinks vectors can be mathematically converted",
        option4: "Learner creates inconsistent hybrid index",
      },
    },
    {
      pattern: "EMBEDDING-RETRIEVAL",
      question:
        "Retrieval returns semantically similar but factually wrong documents. What's missing?",
      options: [
        "Need larger embedding model size",
        "Add metadata filtering before semantic search",
        "Increase number of retrieved documents",
        "Use different vector distance metric",
      ],
      correct: 2,
      explanation:
        "Semantic similarity doesn't guarantee factual correctness—metadata filters (date, source, category) add precision.",
      timeLimit: 25,
      note: "EMBEDDING-RETRIEVAL | Metadata filtering | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks bigger embeddings fix relevance",
        option3: "Learner thinks more results includes correct ones",
        option4: "Learner focuses on math rather than data structure",
      },
    },
    {
      pattern: "EMBEDDING-RETRIEVAL",
      question:
        "Cosine similarity vs dot product for vector search. When does choice matter most?",
      options: [
        "Always use cosine for best results",
        "When vectors have different magnitudes",
        "Only matters for image embeddings",
        "They always give identical rankings",
      ],
      correct: 2,
      explanation:
        "Cosine normalizes by magnitude (direction only), while dot product includes magnitude—matters when vector lengths vary.",
      timeLimit: 30,
      note: "EMBEDDING-RETRIEVAL | Distance metrics | Position 2 | 30s MEDIUM",
      distractorLogic: {
        option1: "Learner defaults to cosine without understanding",
        option3: "Learner thinks modality determines metric choice",
        option4: "Learner doesn't understand the mathematical difference",
      },
    },

    // ============================================================================
    // AGENT-CHAIN Examples (MEDIUM - 25-30s)
    // ============================================================================
    {
      pattern: "AGENT-CHAIN",
      question:
        "LLM needs to call external APIs based on user intent. Which pattern enables this?",
      options: [
        "Increase context window size significantly",
        "Function calling with tool definitions",
        "Fine-tune model on API documentation",
        "Use retrieval augmented generation RAG",
      ],
      correct: 2,
      explanation:
        "Function calling lets the LLM decide when to use tools and what arguments to pass—designed exactly for this.",
      timeLimit: 25,
      note: "AGENT-CHAIN | Function calling | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks more context enables actions",
        option3: "Learner overcomplicates with fine-tuning",
        option4: "Learner confuses retrieval with action execution",
      },
    },
    {
      pattern: "AGENT-CHAIN",
      question:
        "Agent keeps calling the same tool in an infinite loop. What's the likely fix?",
      options: [
        "Use a more powerful LLM",
        "Add max iterations or stop conditions",
        "Remove the problematic tool entirely",
        "Increase agent memory buffer size",
      ],
      correct: 2,
      explanation:
        "Agents need explicit termination conditions—without max iterations or goal detection, they can loop indefinitely.",
      timeLimit: 25,
      note: "AGENT-CHAIN | Loop prevention | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks smarter model prevents loops",
        option3: "Learner removes functionality rather than fixing",
        option4: "Learner confuses memory with control flow",
      },
    },
    {
      pattern: "AGENT-CHAIN",
      question:
        "Building a multi-step workflow: extract → validate → transform → store. Best approach?",
      options: [
        "One large prompt for all steps",
        "Chain of specialized prompts sequentially",
        "Parallel execution of all steps",
        "Train custom model for workflow",
      ],
      correct: 2,
      explanation:
        "Sequential chains let each step focus on one task—easier to debug, test, and modify individual components.",
      timeLimit: 25,
      note: "AGENT-CHAIN | Sequential chains | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner crams everything into one prompt",
        option3: "Learner ignores step dependencies",
        option4: "Learner overcomplicates with training",
      },
    },

    // ============================================================================
    // EVALUATION-METRIC Examples (MEDIUM - 25-30s)
    // ============================================================================
    {
      pattern: "EVALUATION-METRIC",
      question:
        "Evaluating RAG answer quality without human labelers. Which automated metric works best?",
      options: [
        "BLEU score from machine translation",
        "LLM-as-judge with reference answers",
        "Simple string matching accuracy only",
        "Response length in token count",
      ],
      correct: 2,
      explanation:
        "LLM-as-judge compares semantic correctness, not just word overlap—more aligned with human judgment than BLEU.",
      timeLimit: 25,
      note: "EVALUATION-METRIC | LLM-as-judge | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner uses translation metric for QA (poor fit)",
        option3: "Learner thinks exact match captures quality",
        option4: "Learner confuses length with quality",
      },
    },
    {
      pattern: "EVALUATION-METRIC",
      question:
        "Testing if RAG retrieval finds the right documents. Which metric to use?",
      options: [
        "Perplexity of LLM responses generated",
        "Recall at K with ground truth docs",
        "Average response latency in milliseconds",
        "Token count of retrieved chunks",
      ],
      correct: 2,
      explanation:
        "Recall@K measures what fraction of relevant documents appear in top-K results—directly measures retrieval quality.",
      timeLimit: 25,
      note: "EVALUATION-METRIC | Retrieval metrics | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner confuses generation metric with retrieval",
        option3: "Learner measures speed instead of quality",
        option4: "Learner measures quantity instead of relevance",
      },
    },
    {
      pattern: "EVALUATION-METRIC",
      question:
        "Chatbot responses are factually correct but users complain they're unhelpful. What to measure?",
      options: [
        "Increase factual accuracy testing further",
        "Add user satisfaction and helpfulness ratings",
        "Measure response generation speed only",
        "Count number of tokens in response",
      ],
      correct: 2,
      explanation:
        "Correctness isn't enough—helpfulness, tone, and completeness matter to users. Human ratings capture this.",
      timeLimit: 25,
      note: "EVALUATION-METRIC | User satisfaction | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner doubles down on what's already working",
        option3: "Learner measures engineering metrics not UX",
        option4: "Learner thinks more tokens equals more helpful",
      },
    },

    // ============================================================================
    // HALLUCINATION-MITIGATION Examples (MEDIUM - 25-30s)
    // ============================================================================
    {
      pattern: "HALLUCINATION-MITIGATION",
      question:
        "LLM confidently states facts not in retrieved documents. Best mitigation strategy?",
      options: [
        "Increase temperature for uncertainty",
        "Prompt to only use provided context",
        "Use a smaller model instead",
        "Remove all system prompts entirely",
      ],
      correct: 2,
      explanation:
        "Explicit grounding instructions ('only answer from context') reduce hallucination from parametric memory.",
      timeLimit: 25,
      note: "HALLUCINATION-MITIGATION | Grounding prompts | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks temperature affects factuality",
        option3: "Learner thinks smaller means more accurate",
        option4: "Learner removes control rather than adding it",
      },
    },
    {
      pattern: "HALLUCINATION-MITIGATION",
      question:
        "Need to detect when LLM is making up information. Which approach helps?",
      options: [
        "Check if response is grammatically correct",
        "Ask LLM to cite sources for claims",
        "Measure response generation time taken",
        "Count unique words in the response",
      ],
      correct: 2,
      explanation:
        "Requiring citations forces traceability—claims without valid sources are likely hallucinations.",
      timeLimit: 25,
      note: "HALLUCINATION-MITIGATION | Citation requirement | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks grammar indicates truthfulness",
        option3: "Learner thinks speed correlates with accuracy",
        option4: "Learner uses vocabulary as proxy for quality",
      },
    },
    {
      pattern: "HALLUCINATION-MITIGATION",
      question:
        "RAG retrieves relevant docs but LLM ignores them and uses training knowledge. Why?",
      options: [
        "Documents are too long to read",
        "Strong prior from training data conflicts",
        "Vector database is misconfigured",
        "Embedding model is too small",
      ],
      correct: 2,
      explanation:
        "LLMs have strong priors from training—when context conflicts with 'known' facts, they may ignore the context.",
      timeLimit: 30,
      note: "HALLUCINATION-MITIGATION | Prior conflict | Position 2 | 30s MEDIUM",
      distractorLogic: {
        option1: "Learner blames document length (context fits)",
        option3: "Learner blames retrieval when retrieval worked",
        option4: "Learner blames embedding when it retrieved correctly",
      },
    },

    // ============================================================================
    // TOOL-IDENTIFY Examples (EASY - 20-25s)
    // ============================================================================
    {
      pattern: "TOOL-IDENTIFY",
      question:
        "Need to store and search vector embeddings. Which tool category?",
      options: [
        "Traditional SQL relational database",
        "Vector database like Pinecone or Chroma",
        "Message queue like RabbitMQ Kafka",
        "Cache layer like Redis Memcached",
      ],
      correct: 2,
      explanation:
        "Vector databases are optimized for similarity search on embeddings—built-in indexing for high-dimensional vectors.",
      timeLimit: 20,
      note: "TOOL-IDENTIFY | Vector DBs | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner uses traditional DB for vectors (poor fit)",
        option3: "Learner confuses storage with messaging",
        option4: "Learner confuses persistence with caching",
      },
    },
    {
      pattern: "TOOL-IDENTIFY",
      question:
        "Building LLM app with retrieval, agents, and memory. Which framework?",
      options: [
        "NumPy for numerical computing",
        "LangChain or LlamaIndex for orchestration",
        "Flask or FastAPI for web",
        "Pandas for data manipulation",
      ],
      correct: 2,
      explanation:
        "LangChain and LlamaIndex provide abstractions for RAG, agents, memory, and chains—designed for LLM apps.",
      timeLimit: 20,
      note: "TOOL-IDENTIFY | LLM frameworks | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner picks computation library for orchestration",
        option3: "Learner picks web framework for LLM logic",
        option4: "Learner picks data tool for LLM workflow",
      },
    },
    {
      pattern: "TOOL-IDENTIFY",
      question:
        "Need to convert text into vector embeddings for semantic search. Which model type?",
      options: [
        "Image classification CNN model",
        "Sentence transformer embedding model",
        "Time series forecasting model used",
        "Tabular data gradient boosting model",
      ],
      correct: 2,
      explanation:
        "Sentence transformers like all-MiniLM are trained to produce semantically meaningful text embeddings for similarity.",
      timeLimit: 20,
      note: "TOOL-IDENTIFY | Embedding models | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner confuses text with image modality",
        option3: "Learner confuses NLP with time series",
        option4: "Learner confuses embeddings with structured data",
      },
    },
    {
      pattern: "TOOL-IDENTIFY",
      question:
        "Monitoring LLM app for cost, latency, and quality in production. Which tool category?",
      options: [
        "Code version control like Git",
        "LLM observability platform like LangSmith",
        "Static code analysis tools only",
        "Unit testing framework exclusively",
      ],
      correct: 2,
      explanation:
        "LLM observability tools trace prompts, responses, costs, and latency—essential for production debugging.",
      timeLimit: 20,
      note: "TOOL-IDENTIFY | Observability | Position 2 | 20s EASY",
      distractorLogic: {
        option1: "Learner confuses runtime monitoring with versioning",
        option3: "Learner uses static analysis for runtime issues",
        option4: "Learner thinks testing replaces monitoring",
      },
    },

    // ============================================================================
    // PRODUCTION & COST Examples (MEDIUM - 25-30s)
    // ============================================================================
    {
      pattern: "BEST-PRACTICE",
      question:
        "LLM API costs are too high in production. Which optimization helps most?",
      options: [
        "Switch to largest model available",
        "Cache frequent query responses intelligently",
        "Remove all system prompts completely",
        "Increase temperature for variety",
      ],
      correct: 2,
      explanation:
        "Caching identical or similar queries avoids repeated API calls—often the biggest cost saver for common questions.",
      timeLimit: 25,
      note: "BEST-PRACTICE | Cost optimization | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner thinks bigger is better (costs more)",
        option3: "Learner removes functionality to save money",
        option4: "Learner doesn't understand temperature's role",
      },
    },
    {
      pattern: "BEST-PRACTICE",
      question:
        "RAG response latency is 5 seconds, users complain. Which component to optimize first?",
      options: [
        "Use slower but more accurate model",
        "Check retrieval and embedding latency first",
        "Add more documents to knowledge base",
        "Increase chunk size to reduce count",
      ],
      correct: 2,
      explanation:
        "Retrieval often dominates latency—check embedding time and vector search before blaming the LLM.",
      timeLimit: 25,
      note: "BEST-PRACTICE | Latency optimization | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner trades speed for accuracy (wrong direction)",
        option3: "Learner adds load instead of optimizing",
        option4: "Learner changes structure without measuring",
      },
    },
    {
      pattern: "BEST-PRACTICE",
      question:
        "Deploying RAG to production. Which practice prevents data exposure?",
      options: [
        "Use the fastest LLM available",
        "Implement access control on documents",
        "Maximize chunk overlap percentage used",
        "Store all data in single collection",
      ],
      correct: 2,
      explanation:
        "Without access control, any user can retrieve any document—filter retrieval by user permissions.",
      timeLimit: 25,
      note: "BEST-PRACTICE | Security | Position 2 | 25s MEDIUM",
      distractorLogic: {
        option1: "Learner prioritizes speed over security",
        option3: "Learner focuses on retrieval quality not access",
        option4: "Learner simplifies at cost of security",
      },
    },
  ],
};

// ============================================================================
// MODULE MAPPING & RANDOM SELECTION
// ============================================================================

export const MODULE_PATTERNS_MAP: Record<string, ModulePatterns> = {
  "General AI": GENERAL_AI_PATTERNS,
  Python: PYTHON_PATTERNS,
  SQL: SQL_PATTERNS,
  "Math/Stats": MATH_STATS_PATTERNS,
  "Machine Learning": ML_PATTERNS,
  "Deep Learning": DL_PATTERNS,
  NLP: NLP_PATTERNS,
  "Gen AI": GEN_AI_PATTERNS,
};

/**
 * Get random examples for a module
 * @param moduleName - The module to get examples for
 * @param count - Number of examples to return (default: 3)
 * @returns Array of randomly selected examples
 */
export function getRandomExamples(
  moduleName: string,
  count: number = 3,
): QuestionExample[] {
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];
  if (!modulePatterns) {
    return [];
  }

  const examples = [...modulePatterns.examples];
  const selected: QuestionExample[] = [];

  // Fisher-Yates shuffle and pick first 'count' items
  for (let i = examples.length - 1; i > 0 && selected.length < count; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [examples[i], examples[j]] = [examples[j], examples[i]];
  }

  // Ensure diversity: try to pick different patterns
  const usedPatterns = new Set<string>();
  for (const example of examples) {
    if (selected.length >= count) break;
    if (
      !usedPatterns.has(example.pattern) ||
      selected.length >= modulePatterns.patterns.length
    ) {
      selected.push(example);
      usedPatterns.add(example.pattern);
    }
  }

  return selected;
}

/**
 * Get module patterns description with distractor psychology
 * @param moduleName - The module name
 * @returns Pattern descriptions for the module including distractor guidelines
 */
export function getModulePatternDescription(moduleName: string): string {
  const modulePatterns = MODULE_PATTERNS_MAP[moduleName];
  if (!modulePatterns) {
    return "";
  }

  let description = `${modulePatterns.description}\n\n**Question Patterns:**\n`;
  for (const pattern of modulePatterns.patterns) {
    description += `- **${pattern.name}** (${pattern.timeRange}): ${pattern.description}\n  Format: "${pattern.format}"\n`;
  }

  // Add distractor psychology guidelines
  description += `\n${DISTRACTOR_GUIDELINES}`;

  return description;
}

/**
 * Format examples for prompt injection
 * @param examples - Array of question examples
 * @returns Formatted string for prompt
 */
export function formatExamplesForPrompt(examples: QuestionExample[]): string {
  return examples
    .map((ex, idx) => {
      return `**Example ${idx + 1} (${ex.pattern}, ${ex.timeLimit}s):**
Q: "${ex.question}"
Options: ${ex.options.map((o, i) => `${i + 1}. ${o}`).join(" | ")}
Correct: ${ex.correct}
Explanation: ${ex.explanation}
[${ex.note}]`;
    })
    .join("\n\n");
}
