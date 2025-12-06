# Quiz Validator & Generator

### AI-Powered Quiz Generation for Codebasics GenAI & Data Science Bootcamp

A research-backed quiz generation system that applies **10 psychological principles** to create quizzes that test understanding, not memorization. Built with Next.js 15 and designed to work with Claude, GPT, and Gemini.

---

## Why This Exists

Traditional quizzes fail learners in predictable ways:

| Problem | Impact | Our Solution |
|---------|--------|--------------|
| Longest answer is correct | Students exploit length patterns | Equal word count per question |
| Position patterns | "When in doubt, pick C" | Shuffled, balanced distribution |
| Surface-level recall | Memorization over understanding | WHY/HOW questions > WHAT |
| Weak distractors | Elimination by obviousness | "80% correct with 1 critical flaw" |
| Generic explanations | No revision value | "PRINCIPLE:" format for recall |

---

## Psychological Framework

This system implements **10 research-backed principles** for effective learning assessment:

### Core Principles

| # | Principle | Research | Implementation |
|---|-----------|----------|----------------|
| 1 | **Dual-Process Theory** | Kahneman | Force Type 2 analytical thinking |
| 2 | **Desirable Difficulties** | Bjork | Productive struggle enhances retention |
| 3 | **Plausible Distractors** | Haladyna | Target specific misconceptions |
| 4 | **Elaborative Interrogation** | Pressley et al. | Explanations answer "WHY" |
| 5 | **Testing Effect** | Roediger & Karpicke | Retrieval practice over recognition |

### Advanced Principles

| # | Principle | Research | Implementation |
|---|-----------|----------|----------------|
| 6 | **Hypercorrection Effect** | Butterfield & Metcalfe | Target confident errors |
| 7 | **Prediction Error Framework** | Rescorla-Wagner | Surprising corrections stick |
| 8 | **Cognitive Load Theory** | Sweller | Positive framing, short options |
| 9 | **Deeper Processing** | Craik & Lockhart | Application > factual recall |
| 10 | **Generation Effect** | Slamecka & Graf | Force reasoning, not matching |

---

## Anti-Exploit Measures

### Equal Word Count Per Question
```
Q1 Options (4 words each):
  "Predicts tokens not computes"     [4 words]
  "Larger models have bugs"          [4 words]
  "Training lacked basic math"       [4 words]
  "GPU limits simple calculations"   [4 words]
```

### Balanced Position Distribution
```
Good:  [2, 1, 4, 3, 1, 4, 2, 3, 4, 2]  Each position: 2-3 times
Bad:   [1, 1, 1, 2, 2, 2, 3, 3, 4, 4]  Clustered - exploitable
Bad:   [1, 2, 3, 4, 1, 2, 3, 4, 1, 2]  Sequential - predictable
```

### Diverse Word Counts Across Quiz
```
Q1: 4-word options  |  Q2: 3-word options  |  Q3: 5-word options
Q4: 2-word options  |  Q5: 4-word options  |  ...varies throughout
```

---

## Supported Modules

| Module | Topics | Example Question Type |
|--------|--------|----------------------|
| **Python** | FastAPI, Pandas, async/await, decorators | "Why does async not make this non-blocking?" |
| **SQL** | CTEs, window functions, aggregates | "Why does CTE NOT guarantee better performance?" |
| **Math/Stats** | p-values, confidence intervals, A/B testing | "Why is this p-value interpretation WRONG?" |
| **Machine Learning** | Bias-variance, regularization, metrics | "Why is accuracy MISLEADING here?" |
| **Deep Learning** | PyTorch, dropout, ResNet, loss functions | "Why does dropout IMPROVE generalization?" |
| **NLP** | BERT, tokenization, fine-tuning | "Why the '##' prefix in WordPiece?" |
| **Gen AI** | RAG, chunking, temperature, hallucination | "Why does RAG still hallucinate?" |
| **General AI** | LLM limitations, RLHF, scaling laws | "Why isn't alignment permanent?" |

---

## Project Structure

```
quiz-validator/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main application
│   └── globals.css             # Global styles
│
├── components/quiz/
│   ├── ModuleSelector.tsx      # Module selection
│   ├── LLMProviderSelector.tsx # Claude/GPT/Gemini selector
│   ├── PromptDisplay.tsx       # Generated prompt display
│   ├── ValidationResults.tsx   # Error/warning display
│   ├── AnswerDistribution.tsx  # Position balance analysis
│   └── QuizExporter.tsx        # Excel export functionality
│
├── lib/
│   ├── prompts.ts              # Core prompt engineering (1500+ lines)
│   │   ├── MODULE_EXAMPLES     # 28 research-backed examples
│   │   ├── getSystemPrompt()   # Main quiz generation prompt
│   │   ├── getRefinementPrompt() # Error fixing prompt
│   │   └── getModuleInstructions() # Per-module guidance
│   ├── types.ts                # TypeScript interfaces
│   ├── constants.ts            # Application constants
│   └── utils.ts                # Utility functions
│
├── public/                     # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vercel.json                 # Deployment config
```

---

## Core File: `lib/prompts.ts`

The heart of the system. Contains:

### Psychological Principles Header
```typescript
/*
 * PSYCHOLOGICAL PRINCIPLES APPLIED (Codebasics Standards):
 * 1. DUAL-PROCESS THEORY (Kahneman): Force Type 2 thinking
 * 2. DESIRABLE DIFFICULTIES (Bjork): Productive struggle
 * 3. PLAUSIBLE DISTRACTORS (Haladyna): Target misconceptions
 * ...10 total principles
 */
```

### Module Examples (28 Total)
Each example includes:
- **Cognitive trap annotation** - What misconception it targets
- **Word count verification** - Equal words per question
- **Position variation** - Shuffled correct answers
- **Research citation** - Where applicable

### Anti-Exploit Rules
```typescript
// ANTI-EXPLOIT: OPTION WORD COUNT RULES (CRITICAL!)
// - Per question: ALL 4 options MUST have SAME word count
// - Across questions: Vary 2/3/4/5 word options
// - Correct answer length RANDOMIZED
```

### Final Verification Checklist
```typescript
// FINAL VERIFICATION (BEFORE OUTPUT)
// □ STEM DIVERSITY: 2-3 WHY, 2-3 HOW, 2-3 WHAT, 1-2 DEBUG
// □ EQUAL WORDS: Per question ALL 4 options same count
// □ RANDOM POSITION: Each (1-4) appears 2-3 times
// □ GRAMMAR: Grammatically correct and meaningful
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/codebasics/quiz-validator.git
cd quiz-validator

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Usage Workflow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  1. Select      │────▶│  2. Generate     │────▶│  3. Copy to     │
│     Module      │     │     Prompt       │     │     LLM         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  6. Export to   │◀────│  5. Fix Errors   │◀────│  4. Paste &     │
│     Excel       │     │  (if needed)     │     │     Validate    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Step-by-Step

1. **Select Module** - Choose from 8 predefined modules or create custom
2. **Choose LLM** - Claude Sonnet 4.5, Gemini 2.5 Pro/Flash, or ChatGPT 5
3. **Generate Prompt** - Copy the psychology-enhanced system prompt
4. **Run LLM** - Paste prompt into your LLM, get JSON output
5. **Validate** - Paste JSON, check for errors/warnings
6. **Refine** - If errors exist, use refinement prompt to fix
7. **Export** - Copy validated quiz to Excel for Discord bot

---

## Validation Rules

| Field | Rule | Rationale |
|-------|------|-----------|
| Question | 30-200 characters | Enough context without overwhelming |
| Options | 5-25 chars (text), up to 50 (code) | Prevents length exploitation |
| Word Balance | ±0 variance per question | Equal cognitive load |
| Explanation | 12-18 words, starts with "PRINCIPLE:" | Revision-focused format |
| Time Limit | 20/25/30/35 seconds only | Standardized intervals |
| Positions | Each 1-4 appears 2-3 times | Prevents position patterns |

---

## LLM Compatibility

Tested and optimized for:

| Provider | Model | Status |
|----------|-------|--------|
| Anthropic | Claude Sonnet 4.5 | Recommended |
| Anthropic | Claude Opus 4.5 | Recommended |
| Google | Gemini 2.5 Pro | Supported |
| Google | Gemini 2.5 Flash | Supported |
| OpenAI | GPT-4o | Supported |
| OpenAI | ChatGPT 5 | Supported |

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/codebasics/quiz-validator)

```bash
# Or deploy via CLI
npm install -g vercel
vercel
```

### Configuration (`vercel.json`)

```json
{
  "regions": ["iad1"],
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

No environment variables required - runs entirely client-side.

---

## Research Citations

The psychological principles are based on peer-reviewed research:

1. **Kahneman, D.** (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
2. **Bjork, R. A.** (1994). Memory and metamemory considerations in the training of human beings.
3. **Haladyna, T. M.** (2004). *Developing and Validating Multiple-Choice Test Items*.
4. **Butterfield, B., & Metcalfe, J.** (2001). Errors committed with high confidence are hypercorrected.
5. **Roediger, H. L., & Karpicke, J. D.** (2006). The power of testing memory.
6. **Sweller, J.** (1988). Cognitive load during problem solving.
7. **Wei, J., et al.** (2022). Chain-of-thought prompting elicits reasoning in large language models.
8. **Hoffmann, J., et al.** (2022). Training compute-optimal large language models (Chinchilla).

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Lucide React | Latest | Icons |
| pnpm | 8.x | Package manager |

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open Pull Request

### Areas for Contribution

- [ ] Additional module examples
- [ ] New psychological principle implementations
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)
- [ ] Dark mode support

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **Codebasics** - For the GenAI & Data Science Bootcamp curriculum
- **Research Community** - For the psychological principles that power this system
- **Contributors** - For continuous improvements

---

<div align="center">

**Built for learners who deserve better quizzes.**

[Report Bug](https://github.com/codebasics/quiz-validator/issues) · [Request Feature](https://github.com/codebasics/quiz-validator/issues)

</div>
