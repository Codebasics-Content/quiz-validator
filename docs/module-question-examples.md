# Module Question Examples

All examples follow anti-pattern rules:
- Equal word count per question
- Randomized correct answer positions
- Explanations with "because/since"
- Diverse question types per module
- Misconception-based distractors

---

## 1. General AI (20 Questions) - Updated December 2025

**Research Sources**: Claude Opus 4.5, GPT-5.1, Gemini 3 Pro benchmarks; DeepSeek V3.2 release; AI Safety Index Winter 2025; MMLU-Pro benchmark introduction; Hallucination rate improvements.

**ASSERTION-REASON Answer Variety**: Each question has a DIFFERENT correct answer type to prevent pattern exploitation.

**CRITICAL-EVALUATION Natural Phrasing**: Questions framed as real workplace conversations, not robotic templates.

---

### Q1: DeepSeek Cost Efficiency (ASSERTION-REASON: Both true + explains) - 5-word options
```json
{
  "question": "Assertion: DeepSeek V3.2 costs 10x less than GPT-5 per token. Reason: It uses Mixture-of-Experts activating only 37B of 671B parameters. Is the assertion correct, and does the reason explain it?",
  "options": ["Assertion false but reason true", "Both true and reason explains", "Both true but reason unrelated", "Assertion true but reason false"],
  "correct": 2,
  "explanation": "MoE activates only a fraction of parameters per token, directly reducing compute costs while maintaining performance.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner doubts the 10x cost claim despite benchmark evidence",
    "option3": "Learner doesn't understand MoE architecture reduces compute",
    "option4": "Learner thinks MoE is unrelated to cost savings"
  }
}
```

### Q2: MMLU Benchmark Saturation (ASSERTION-REASON: Assertion true + reason FALSE) - 5-word options
```json
{
  "question": "Assertion: Leading models now score above 90% on MMLU. Reason: MMLU questions were leaked into training data. Is the assertion correct, and does the reason explain it?",
  "options": ["Both assertion and reason false", "Both true and reason explains", "Assertion true but reason false", "Both true but reason unrelated"],
  "correct": 3,
  "explanation": "GPT-5 achieves 91.4% on MMLU legitimately through capability gains—not data leakage. The benchmark is genuinely saturating.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner doubts 90%+ scores are real",
    "option2": "Learner assumes high scores must mean contamination",
    "option4": "Learner thinks leakage happened but doesn't explain scores"
  }
}
```

### Q3: AI Safety Company Ratings (ASSERTION-REASON: Assertion FALSE + reason true) - 5-word options
```json
{
  "question": "Assertion: All major AI companies have strong existential safety plans. Reason: Companies are racing to build AGI within this decade. Is the assertion correct, and does the reason explain it?",
  "options": ["Both true and reason explains", "Assertion false but reason true", "Assertion true but reason false", "Both assertion and reason false"],
  "correct": 2,
  "explanation": "The 2025 AI Safety Index shows no company scored above D in existential safety—despite all racing toward AGI.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner assumes AGI race implies good safety planning",
    "option3": "Learner doubts companies are actually racing toward AGI",
    "option4": "Learner rejects both claims without checking evidence"
  }
}
```

### Q4: SLM On-Device Capability (ASSERTION-REASON: Both true + reason UNRELATED) - 5-word options
```json
{
  "question": "Assertion: Phi-3 can run on smartphones. Reason: Microsoft trained it on high-quality curated data. Is the assertion correct, and does the reason explain it?",
  "options": ["Assertion true but reason false", "Assertion false but reason true", "Both true but reason unrelated", "Both true and reason explains"],
  "correct": 3,
  "explanation": "Phi-3 runs on phones due to its small 3.8B parameter size—data quality improves output but doesn't enable on-device deployment.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner doubts Microsoft used curated data",
    "option2": "Learner thinks Phi-3 can't actually run on phones",
    "option4": "Learner wrongly connects data quality to deployment capability"
  }
}
```

### Q5: Reasoning Model Hallucination (ASSERTION-REASON: Both FALSE) - 5-word options
```json
{
  "question": "Assertion: Reasoning models like o3 hallucinate less than standard models. Reason: Chain-of-thought always produces factually correct outputs. Is the assertion correct, and does the reason explain it?",
  "options": ["Both true and reason explains", "Assertion true but reason false", "Assertion false but reason true", "Both assertion and reason false"],
  "correct": 4,
  "explanation": "OpenAI's o3 showed 33% hallucination on PersonQA—reasoning models can hallucinate MORE on certain tasks. CoT doesn't guarantee accuracy.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner assumes reasoning always means more accurate",
    "option2": "Learner thinks o3 hallucinates less but CoT isn't why",
    "option3": "Learner believes CoT is accurate but o3 still hallucinates"
  }
}
```

### Q6: Model Specialization Claims (STATEMENT-ANALYSIS) - 4-word options
```json
{
  "question": "December 2025 benchmarks show: (1) Claude Opus 4.5 leads coding at 80.9% SWE-bench, (2) Gemini 3 Pro leads math at 95% AIME, (3) One model dominates all tasks. Which hold up?",
  "options": ["All three claims valid", "Only first and second", "Only second and third", "Only the first claim"],
  "correct": 2,
  "explanation": "Different models excel at different tasks—Claude leads coding, Gemini leads math. No single model dominates everything.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner believes one model can dominate all benchmarks",
    "option3": "Learner thinks model dominance is possible with enough scale",
    "option4": "Learner doubts Gemini's math performance claims"
  }
}
```

### Q7: Hallucination Progress Claims (STATEMENT-ANALYSIS) - 4-word options
```json
{
  "question": "About AI hallucination rates: (1) Best models now under 1%, (2) This represents 96% reduction since 2021, (3) Hallucination is completely solved. Which are accurate?",
  "options": ["All three claims accurate", "Only first and second", "Only the third claim", "None of these claims"],
  "correct": 2,
  "explanation": "Gemini 2.0 Flash achieves 0.7% hallucination—a 96% drop from 21.8% in 2021. But 'solved' overstates progress significantly.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner believes low rates mean problem is solved",
    "option3": "Learner thinks hallucination is completely fixed now",
    "option4": "Learner doubts the improvement statistics"
  }
}
```

### Q8: SLM Efficiency Claims (STATEMENT-ANALYSIS) - 4-word options
```json
{
  "question": "About small language models in 2025: (1) SmolLM2 1.7B matches older 70B models, (2) SLMs can run without internet, (3) SLMs always outperform LLMs. Which is misleading?",
  "options": ["The first claim misleads", "The second claim misleads", "The third claim misleads", "None of them mislead"],
  "correct": 3,
  "explanation": "SLMs match older large models and enable offline use, but they trade breadth for efficiency—they don't outperform LLMs on complex tasks.",
  "timeLimit": 35,
  "distractorLogic": {
    "option1": "Learner doubts small models can match large ones",
    "option2": "Learner thinks SLMs still need internet connection",
    "option4": "Learner accepts all SLM marketing claims"
  }
}
```

### Q9: Open Source AI Claims (HYPE-VS-REALITY) - 5-word options
```json
{
  "question": "DeepSeek V3.2 is called 'open source GPT-5 killer.' What actually holds up in benchmarks?",
  "options": ["Matches GPT-5 on all tasks", "Costs 10x less per token", "Beats GPT-5 on every benchmark", "No advantages over GPT-5 exist"],
  "correct": 2,
  "explanation": "DeepSeek charges $0.028 per million tokens versus GPT-5's higher rates—real cost advantage. Performance is competitive but not universally better.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner believes 'killer' means equal on everything",
    "option3": "Learner takes marketing claims literally",
    "option4": "Learner dismisses open source capabilities entirely"
  }
}
```

### Q10: Extended Context Marketing (HYPE-VS-REALITY) - 5-word options
```json
{
  "question": "Models now advertise 200K+ token contexts. What's the reality about long context performance?",
  "options": ["All tokens processed equally well", "Middle content often gets lost", "Longer always means more accurate", "Context length has zero cost"],
  "correct": 2,
  "explanation": "The 'lost in the middle' effect persists—models struggle with information buried in long contexts even when it fits.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner assumes attention is uniform across positions",
    "option3": "Learner thinks more context automatically helps",
    "option4": "Learner unaware of token-based pricing models"
  }
}
```

### Q11: Benchmark Score Marketing (HYPE-VS-REALITY) - 5-word options
```json
{
  "question": "A model claims '95% on MMLU.' What should you actually infer from this score?",
  "options": ["Model understands all subjects deeply", "Model will ace your specific task", "Model handles academic-style questions well", "Model never makes factual errors"],
  "correct": 3,
  "explanation": "MMLU tests academic multiple-choice across 57 subjects—high scores show test-taking ability, not guaranteed real-world performance.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner conflates benchmark scores with deep understanding",
    "option2": "Learner assumes MMLU predicts task-specific performance",
    "option4": "Learner thinks high MMLU means no hallucination"
  }
}
```

### Q12: MoE Efficiency (CAUSE-CONSEQUENCE) - 5-word options
```json
{
  "question": "Why do Mixture-of-Experts models like DeepSeek V3.2 achieve lower inference costs than dense models?",
  "options": ["They use smaller training datasets", "They activate only parameter subsets", "They skip the attention mechanism", "They compress weights during inference"],
  "correct": 2,
  "explanation": "MoE routes each token through only relevant expert subnetworks—671B total parameters but only 37B compute per token.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses training data size with inference cost",
    "option3": "Learner thinks MoE removes attention entirely",
    "option4": "Learner confuses MoE with weight compression techniques"
  }
}
```

### Q13: Alignment Faking Risk (CAUSE-CONSEQUENCE) - 5-word options
```json
{
  "question": "Why is 'alignment faking' a concern identified in 2025 AI safety research?",
  "options": ["Models might behave well during tests only", "Training data contains fake alignments", "Alignment requires too much compute", "Faking is impossible for models"],
  "correct": 1,
  "explanation": "Research shows models could learn to appear aligned during evaluation while pursuing different goals during deployment.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks faking refers to training data quality",
    "option3": "Learner confuses alignment cost with deception risk",
    "option4": "Learner underestimates model strategic capabilities"
  }
}
```

### Q14: Benchmark Evolution (CAUSE-CONSEQUENCE) - 5-word options
```json
{
  "question": "Why did researchers create MMLU-Pro with 10 options instead of MMLU's original 4?",
  "options": ["Random guessing gives 10% not 25%", "More options make questions easier", "Original MMLU had too few questions", "Ten is the standard exam format"],
  "correct": 1,
  "explanation": "With 4 options, random guessing scores 25%. Ten options drops this to 10%, making it harder to inflate scores through luck.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks more options means easier tests",
    "option3": "Learner thinks question count was the problem",
    "option4": "Learner thinks 10 options is just a convention"
  }
}
```

### Q15: Sparse Attention Benefits (CAUSE-CONSEQUENCE) - 5-word options
```json
{
  "question": "Why does DeepSeek Sparse Attention reduce computational cost for long contexts?",
  "options": ["It skips unimportant context portions", "It uses smaller embedding dimensions", "It removes all attention mechanisms", "It truncates context to fixed length"],
  "correct": 1,
  "explanation": "Sparse attention identifies and focuses on significant portions of long contexts, skipping unnecessary computation on less relevant parts.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner confuses sparse attention with dimensionality reduction",
    "option3": "Learner thinks sparse means removing attention entirely",
    "option4": "Learner confuses sparse attention with truncation"
  }
}
```

### Q16: Model Size Assumption (CRITICAL-EVALUATION: Natural phrasing) - 5-word options
```json
{
  "question": "Your team lead says 'always use the biggest model for best results.' What nuance are they missing?",
  "options": ["Bigger models do guarantee better results", "Task fit and cost constraints matter", "Model size has no effect whatsoever", "Only matters for image tasks"],
  "correct": 2,
  "explanation": "SmolLM2 at 1.7B matches older 70B models on many tasks. Size matters less than fit—plus cost and latency constraints are real.",
  "timeLimit": 30,
  "distractorLogic": {
    "option1": "Learner accepts scaling law absolutism",
    "option3": "Learner overcorrects to dismiss size entirely",
    "option4": "Learner thinks size only matters for vision models"
  }
}
```

### Q17: Safety Plan Skepticism (CRITICAL-EVALUATION: Natural phrasing) - 5-word options
```json
{
  "question": "A startup claims their AI is 'fully aligned and safe.' Based on 2025 safety research, what's your response?",
  "options": ["Accept the claim at face value", "Alignment verification remains unsolved", "Safety claims are always marketing", "Small startups can't achieve alignment"],
  "correct": 2,
  "explanation": "Even leading labs scored poorly on existential safety planning. Verifying true alignment remains an open research problem.",
  "timeLimit": 30,
  "distractorLogic": {
    "option1": "Learner trusts safety claims without verification",
    "option3": "Learner becomes cynical about all safety efforts",
    "option4": "Learner thinks only size determines safety capability"
  }
}
```

### Q18: Open Source Hype (CRITICAL-EVALUATION: Natural phrasing) - 5-word options
```json
{
  "question": "A colleague says 'DeepSeek proves open source has caught up to closed models.' What's the full picture?",
  "options": ["They're completely right about this", "Open source still lags significantly behind", "Performance is close but ecosystem differs", "Closed models are actually now worse"],
  "correct": 3,
  "explanation": "DeepSeek V3.2 matches GPT-5 on many benchmarks, but closed providers offer better APIs, support, and safety guardrails.",
  "timeLimit": 30,
  "distractorLogic": {
    "option1": "Learner ignores ecosystem and support differences",
    "option2": "Learner dismisses open source progress entirely",
    "option4": "Learner overcorrects in favor of open source"
  }
}
```

### Q19: Hallucination Solved Claims (CRITICAL-EVALUATION: Natural phrasing) - 5-word options
```json
{
  "question": "Marketing says 'our model has 0.7% hallucination rate—practically zero.' What should you consider?",
  "options": ["0.7% means hallucination is solved", "Task-specific rates may differ significantly", "All models now have similar rates", "Lower rates mean slower responses"],
  "correct": 2,
  "explanation": "Aggregate rates hide task variation—reasoning models showed 33-48% hallucination on specific benchmarks. Always test on YOUR use case.",
  "timeLimit": 30,
  "distractorLogic": {
    "option1": "Learner takes aggregate rate as universal guarantee",
    "option3": "Learner assumes all models converged on same rate",
    "option4": "Learner confuses accuracy with latency tradeoff"
  }
}
```

### Q20: Benchmark as Selection Criteria (CRITICAL-EVALUATION: Natural phrasing) - 5-word options
```json
{
  "question": "Your manager wants to pick models purely by MMLU scores. What's the risk in this approach?",
  "options": ["MMLU scores perfectly predict performance", "Benchmarks may not match production needs", "Higher MMLU always means better outputs", "MMLU is the only reliable benchmark"],
  "correct": 2,
  "explanation": "MMLU tests academic knowledge in controlled settings. Your production workload may have different requirements that benchmarks don't capture.",
  "timeLimit": 30,
  "distractorLogic": {
    "option1": "Learner assumes benchmarks predict all performance",
    "option3": "Learner thinks MMLU correlates perfectly with quality",
    "option4": "Learner doesn't know about benchmark limitations"
  }
}
```

---

## 2. Python (10 Questions)

### Q1: Pandas NaN Error (DEBUG-DIAGNOSE) - 5-word options
```json
{
  "question": "Code: `df['col'].apply(lambda x: x.split(','))` raises AttributeError. Why?",
  "options": ["Lambda function has wrong syntax", "Column contains NaN float values", "The apply method does not exist", "The split needs two arguments"],
  "correct": 2,
  "explanation": "NaN is actually a float—floats don't have split(), so you get AttributeError. Always handle missing values first.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner blames lambda syntax when it's actually correct",
    "option3": "Learner doubts apply() exists on Series",
    "option4": "Learner thinks split() requires explicit delimiter"
  }
}
```

### Q2: FastAPI 422 Error (DEBUG-DIAGNOSE) - 5-word options
```json
{
  "question": "FastAPI endpoint returns 422 error. Most likely cause?",
  "options": ["Server crashed and stopped working", "Database connection was lost entirely", "Import statement is missing somewhere", "Request body failed Pydantic validation"],
  "correct": 4,
  "explanation": "422 Unprocessable Entity specifically means Pydantic validation failed—the request structure didn't match your model.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner conflates 4xx client errors with 5xx server crashes",
    "option2": "Learner thinks DB issues cause 422 (actually 500/503)",
    "option3": "Learner thinks import errors cause HTTP codes (causes startup failure)"
  }
}
```

### Q3: Slice Notation (PREDICT-OUTPUT) - 3-word options
```json
{
  "question": "What does `list(range(5))[::2]` return?",
  "options": ["[0, 2, 4]", "[0, 1, 2]", "[1, 3, 5]", "[4, 2, 0]"],
  "correct": 1,
  "explanation": "range(5) gives [0,1,2,3,4], then [::2] takes every 2nd element starting from index 0—so you get 0, 2, 4.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks ::2 means first two elements",
    "option3": "Learner confuses step=2 with starting at index 1",
    "option4": "Learner thinks step without start/end reverses"
  }
}
```

### Q4: Reference vs Copy (PREDICT-OUTPUT) - 3-word options
```json
{
  "question": "Code: `x = [1]; y = x; y.append(2)`. What is x?",
  "options": ["Just [1] alone", "Raises an error", "[1, 2] together", "Just [2] alone"],
  "correct": 3,
  "explanation": "y = x doesn't copy the list—both variables point to the same object in memory, so x sees the append too.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks assignment creates a copy (common from other languages)",
    "option2": "Learner thinks aliasing causes errors somehow",
    "option4": "Learner thinks append replaces rather than adds"
  }
}
```

### Q5: List Iteration Modification (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why can't you modify a list while iterating over it with a for loop?",
  "options": ["Memory gets locked by GIL", "Python syntax completely forbids it", "Lists become immutable during loops", "Iterator index gets shifted around"],
  "correct": 4,
  "explanation": "Modifying the list shifts indices during iteration—the iterator loses track of position and skips or repeats elements.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner misapplies GIL to iteration problems",
    "option2": "Learner thinks Python prevents it at syntax level (it doesn't)",
    "option3": "Learner confuses this with tuple immutability concept"
  }
}
```

### Q6: Generator Memory (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why do generators use less memory than lists for large datasets?",
  "options": ["They compress data automatically somehow", "They yield values lazily on-demand", "They store data on disk instead", "They use smaller internal data types"],
  "correct": 2,
  "explanation": "Generators are lazy—they compute one value at a time instead of storing the entire sequence in memory upfront.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks generators compress data like zip files",
    "option3": "Learner confuses generators with memory-mapped files or DBs",
    "option4": "Learner thinks generators optimize data types automatically"
  }
}
```

### Q7: Large CSV Handling (BEST-PRACTICE) - 5-word options
```json
{
  "question": "Processing 10GB CSV file in Pandas. Best approach?",
  "options": ["Use the chunksize parameter", "Increase your RAM allocation", "Convert file to Excel first", "Use regular Python file reading"],
  "correct": 1,
  "explanation": "chunksize reads data in batches—you process chunks sequentially without loading the entire 10GB into memory at once.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks hardware upgrade solves scaling problems",
    "option3": "Learner thinks Excel handles large data better (opposite)",
    "option4": "Learner thinks native Python beats Pandas for memory (opposite)"
  }
}
```

### Q8: Exception Order (BEST-PRACTICE) - 5-word options
```json
{
  "question": "Multiple except blocks needed. Which order is correct?",
  "options": ["Generic Exception should come first", "Order makes no difference here", "Specific exceptions should come first", "Alphabetical order works best here"],
  "correct": 3,
  "explanation": "Python matches the first applicable except block—put specific exceptions first or generic ones catch everything prematurely.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks generic catches all then specific handles rest",
    "option2": "Learner doesn't know about exception matching order",
    "option4": "Learner thinks Python sorts exceptions automatically"
  }
}
```

### Q9: staticmethod vs classmethod (COMPARE-CONTRAST) - 5-word options
```json
{
  "question": "Key difference between `@staticmethod` and `@classmethod`?",
  "options": ["staticmethod runs faster in practice", "classmethod cannot access the class", "There is no practical difference", "classmethod receives cls as argument"],
  "correct": 4,
  "explanation": "@classmethod gets cls (class reference) as its first argument, while @staticmethod gets no implicit argument at all.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner assumes static means optimized performance",
    "option2": "Learner reverses which method type has class access",
    "option3": "Learner hasn't seen use cases where the difference matters"
  }
}
```

### Q10: Async Use Cases (COMPARE-CONTRAST) - 5-word options
```json
{
  "question": "When to use `async def` over regular `def` in FastAPI?",
  "options": ["For I/O bound operations only", "For CPU heavy calculations instead", "Always use async for everything", "Never use async in FastAPI"],
  "correct": 1,
  "explanation": "async shines during I/O waits like DB queries or API calls—CPU-bound work just blocks the event loop anyway.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks async equals parallel for all tasks",
    "option3": "Learner thinks async is universally better (has overhead)",
    "option4": "Learner avoids async due to complexity fears"
  }
}
```

---

## 3. SQL (10 Questions)

### Q1: LEFT JOIN Row Count (DEBUG-QUERY) - 5-word options
```json
{
  "question": "Query with LEFT JOIN returns fewer rows than left table. Why?",
  "options": ["LEFT JOIN always reduces row count", "Table contains too many duplicates", "WHERE clause filters after join", "Database has internal data corruption"],
  "correct": 3,
  "explanation": "WHERE runs after the join and filters out rows with NULLs from unmatched records—move the condition to ON to keep them.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses LEFT JOIN with INNER JOIN behavior",
    "option2": "Learner thinks duplicates reduce rows (they multiply)",
    "option4": "Learner jumps to catastrophic explanation for subtle bug"
  }
}
```

### Q2: GROUP BY Error (DEBUG-QUERY) - 5-word options
```json
{
  "question": "GROUP BY query returns error with non-aggregated column. Fix?",
  "options": ["Add column to GROUP BY", "Remove GROUP BY clause entirely", "Use DISTINCT instead of grouping", "Add an ORDER BY clause"],
  "correct": 1,
  "explanation": "SQL requires every non-aggregated column in GROUP BY—otherwise it can't determine how to collapse rows into groups.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks removing GROUP BY is simpler (loses aggregation)",
    "option3": "Learner confuses DISTINCT with GROUP BY functionality",
    "option4": "Learner thinks ORDER BY relates to grouping errors"
  }
}
```

### Q3: Filter Before JOIN (OPTIMIZATION) - 5-word options
```json
{
  "question": "Filter 1M rows to 100. Apply filter before or after JOIN?",
  "options": ["Doesn't affect query performance at all", "After JOIN in WHERE clause", "Use HAVING instead of WHERE", "Before JOIN in subquery or CTE"],
  "correct": 4,
  "explanation": "Filtering early means fewer rows to join—joining 100 rows is dramatically faster than joining 1M then filtering.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks optimizer handles it regardless of structure",
    "option2": "Learner unaware row count affects join performance",
    "option3": "Learner confuses HAVING (post-aggregation) with WHERE filtering"
  }
}
```

### Q4: Date Column Indexing (OPTIMIZATION) - 5-word options
```json
{
  "question": "Frequent queries filter by date column. Best optimization?",
  "options": ["Convert all dates to strings", "Create index on date column", "Use SELECT star for everything", "Remove the date filter entirely"],
  "correct": 2,
  "explanation": "An index on filtered columns enables fast lookups instead of full table scans—essential for frequently queried columns.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks strings are faster (actually slower)",
    "option3": "Learner doesn't know SELECT * hurts performance",
    "option4": "Learner thinks removing features is 'optimization'"
  }
}
```

### Q5: NULL Comparison (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why does NULL = NULL return false (not true)?",
  "options": ["NULL represents an unknown value", "Database has a comparison bug", "NULL equals the empty string", "Depends on database vendor used"],
  "correct": 1,
  "explanation": "NULL means 'unknown'—comparing unknown to unknown gives unknown (NULL), not true. Use IS NULL instead.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks counterintuitive behavior must be bug",
    "option3": "Learner confuses NULL with empty string value",
    "option4": "Learner thinks NULL semantics vary by database"
  }
}
```

### Q6: CTE Benefits (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why use CTEs over nested subqueries?",
  "options": ["Always gives faster query execution", "Required for GROUP BY clauses", "Better readability and code reuse", "Reduces physical table storage size"],
  "correct": 3,
  "explanation": "CTEs make complex queries readable and allow reusing results within the query—though performance depends on the database optimizer.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner assumes cleaner syntax equals better performance",
    "option2": "Learner confuses CTEs with GROUP BY requirements",
    "option4": "Learner thinks CTEs affect physical storage somehow"
  }
}
```

### Q7: RANK vs DENSE_RANK (COMPARE-FUNCTIONS) - 5-word options
```json
{
  "question": "RANK() vs DENSE_RANK(): Key difference?",
  "options": ["RANK function runs faster always", "DENSE_RANK works only with dates", "There is no practical difference", "DENSE_RANK leaves no rank gaps"],
  "correct": 4,
  "explanation": "After ties, RANK skips numbers (1,1,3...) while DENSE_RANK stays sequential (1,1,2...)—important for pagination.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner assumes simpler name means better performance",
    "option2": "Learner confused about window function applicability",
    "option3": "Learner hasn't seen scenarios where gaps matter"
  }
}
```

### Q8: INNER vs LEFT JOIN (COMPARE-FUNCTIONS) - 5-word options
```json
{
  "question": "INNER JOIN vs LEFT JOIN: When rows differ?",
  "options": ["When left table is larger", "When right table has no match", "When using a WHERE clause", "Results are always exactly same"],
  "correct": 2,
  "explanation": "LEFT JOIN preserves unmatched left rows by filling in NULLs—INNER JOIN simply discards rows without matches.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks table size determines join behavior",
    "option3": "Learner thinks WHERE changes JOIN type behavior",
    "option4": "Learner doesn't understand when JOINs differ"
  }
}
```

### Q9: COUNT Variants (PREDICT-RESULT) - 5-word options
```json
{
  "question": "COUNT(*) vs COUNT(column) on table with NULLs. Difference?",
  "options": ["COUNT star excludes NULL values", "Both count NULLs same way", "COUNT column excludes NULL values", "COUNT star causes syntax error"],
  "correct": 3,
  "explanation": "COUNT(*) tallies every row regardless, but COUNT(col) only counts rows where that specific column isn't NULL.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner reverses which COUNT excludes NULLs",
    "option2": "Learner thinks COUNT behavior is uniform",
    "option4": "Learner unfamiliar with COUNT(*) syntax"
  }
}
```

### Q10: AVG and NULL (PREDICT-RESULT) - 5-word options
```json
{
  "question": "AVG(column) with NULL values. How are NULLs handled?",
  "options": ["NULLs are ignored in calculation", "NULLs are treated as zeros", "Query returns NULL as result", "Error is thrown for NULLs"],
  "correct": 1,
  "explanation": "AVG quietly ignores NULLs—it sums only non-NULL values and divides by their count, not total rows.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks NULL equals 0 in aggregates",
    "option3": "Learner thinks any NULL makes result NULL",
    "option4": "Learner expects SQL to be strict about NULLs"
  }
}
```

---

## 4. Math/Stats (10 Questions)

### Q1: p-value Interpretation (INTERPRETATION) - 5-word options
```json
{
  "question": "p-value of 0.03 in your A/B test. What does this mean?",
  "options": ["Treatment is exactly 97% effective", "3% of your users converted", "You need 3% more data", "3% chance if null is true"],
  "correct": 4,
  "explanation": "p-value is the probability of seeing this result assuming the null hypothesis is true—not the probability the treatment works.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner inverts p-value to get 'effectiveness' percentage",
    "option2": "Learner confuses p-value with conversion rate metric",
    "option3": "Learner thinks p-value indicates data sufficiency"
  }
}
```

### Q2: Confidence Interval Meaning (INTERPRETATION) - 4-word options
```json
{
  "question": "95% confidence interval [10, 20]. What does this mean?",
  "options": ["95% of data falls here", "True value likely in range", "Mean is 95% likely 15", "Sample size was exactly 95"],
  "correct": 2,
  "explanation": "CI tells you where the true population parameter likely falls—it's not about data distribution or specific values.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses CI with data distribution percentiles",
    "option3": "Learner thinks CI gives probability for specific values",
    "option4": "Learner confuses 95% confidence with sample size"
  }
}
```

### Q3: p-value and Effect Size (MISCONCEPTION) - 5-word options
```json
{
  "question": "p-value < 0.05 means the effect is large. Why is this wrong?",
  "options": ["p-value shows significance not size", "0.05 is too strict a threshold", "p-values cannot be below 0.05", "Large effects have higher p-values"],
  "correct": 1,
  "explanation": "Statistical significance isn't practical significance—large samples can detect tiny effects that don't matter in practice.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks the threshold itself is the problem",
    "option3": "Learner doesn't understand p-value ranges",
    "option4": "Learner reverses relationship between effect and p-value"
  }
}
```

### Q4: Correlation vs Causation (MISCONCEPTION) - 5-word options
```json
{
  "question": "Correlation of 0.9 means X causes Y. Why is this flawed?",
  "options": ["0.9 is too low for causation", "Need correlation of exactly 1.0", "Correlation doesn't imply any causation", "Correlation is always perfectly causal"],
  "correct": 3,
  "explanation": "Strong correlation reveals relationship but not causation—both variables could be driven by a hidden third factor.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks higher correlation means more causation",
    "option2": "Learner thinks perfect correlation required for causation",
    "option4": "Learner never learned correlation-causation distinction"
  }
}
```

### Q5: Comparing 3+ Groups (APPLICATION) - 4-word options
```json
{
  "question": "Comparing means of 3+ groups. Which test?",
  "options": ["Two-sample t-test for pairs", "ANOVA for multiple groups", "Chi-square for associations", "Simple correlation coefficient"],
  "correct": 2,
  "explanation": "ANOVA handles three or more groups at once—pairwise t-tests inflate error rates when comparing multiple groups.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner tries to apply pairwise t-tests (inflates error)",
    "option3": "Learner confuses mean comparison with categorical association",
    "option4": "Learner confuses comparing groups with measuring relationships"
  }
}
```

### Q6: Categorical Data Test (APPLICATION) - 4-word options
```json
{
  "question": "Testing if survey responses differ by category. Which test?",
  "options": ["Linear regression for prediction", "ANOVA for continuous outcomes", "Paired t-test for comparison", "Chi-square for categorical data"],
  "correct": 4,
  "explanation": "Chi-square tests categorical associations—perfect for checking if response distributions differ across groups.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner defaults to regression for any comparison",
    "option2": "Learner thinks ANOVA works for categorical outcomes",
    "option3": "Learner confuses independent categories with paired measurements"
  }
}
```

### Q7: Borderline p-value Decision (DECISION) - 5-word options
```json
{
  "question": "A/B test: p=0.08, effect size is 15% revenue increase. Decision?",
  "options": ["Reject because p exceeds 0.05", "Accept because 15% is high", "Consider practical significance too", "Test is completely invalid now"],
  "correct": 3,
  "explanation": "Borderline p-value with large effect warrants nuanced consideration—practical significance matters, not just statistical cutoffs.",
  "timeLimit": 30,
  "distractorLogic": {
    "option1": "Learner rigidly applies p < 0.05 rule without context",
    "option2": "Learner ignores statistical significance for business metric",
    "option4": "Learner thinks any ambiguity invalidates the test"
  }
}
```

### Q8: Small Sample Low p-value (DECISION) - 5-word options
```json
{
  "question": "Sample size 50, p-value 0.001. Very confident in results?",
  "options": ["Check effect size and power", "Yes because p-value is low", "No because need lower p-value", "Sample size does not matter"],
  "correct": 1,
  "explanation": "Small samples can show low p-values yet have low power—always verify the effect size is meaningful before celebrating.",
  "timeLimit": 30,
  "distractorLogic": {
    "option2": "Learner trusts low p-value alone without checking power",
    "option3": "Learner thinks even lower p-value is the solution",
    "option4": "Learner doesn't understand sample size affects reliability"
  }
}
```

### Q9: Sample Size and CI (CAUSE-EFFECT) - 5-word options
```json
{
  "question": "Why does increasing sample size narrow confidence intervals?",
  "options": ["Larger samples change the population", "More data reduces estimate uncertainty", "CI formula ignores sample size", "Only true for normal distributions"],
  "correct": 2,
  "explanation": "More data gives a more precise estimate—the standard error shrinks with sample size, naturally narrowing the interval.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses sample statistics with population parameters",
    "option3": "Learner doesn't know sample size affects CI via SE",
    "option4": "Learner thinks CI narrowing requires specific distributions"
  }
}
```

### Q10: Variance and Effect Detection (CAUSE-EFFECT) - 5-word options
```json
{
  "question": "Why does high variance in data make detecting effects harder?",
  "options": ["Variance doesn't affect effect detection", "High variance means more effects", "Only affects categorical data types", "Signal gets buried in noise"],
  "correct": 4,
  "explanation": "High variance means more noise—the true effect gets buried and becomes harder to distinguish from random fluctuations.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks statistical tests adjust for variance automatically",
    "option2": "Learner confuses variance with having multiple effects",
    "option3": "Learner doesn't understand variance applies to continuous data"
  }
}
```

---

## 5. Machine Learning (10 Questions)

### Q1: Overfitting Diagnosis (DIAGNOSE) - 5-word options
```json
{
  "question": "Training accuracy 98%, test accuracy 72%. What's happening?",
  "options": ["Model is overfitting the data", "Model is underfitting the data", "Data has many label errors", "Test set is way too small"],
  "correct": 1,
  "explanation": "That 26% gap between training and test accuracy is classic overfitting—the model memorized training data instead of learning patterns.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner confuses over/underfitting symptoms (underfitting has low train too)",
    "option3": "Learner blames data quality instead of model complexity",
    "option4": "Learner thinks small test set causes train-test gap"
  }
}
```

### Q2: Class Imbalance (DIAGNOSE) - 5-word options
```json
{
  "question": "Model predicts same class for all inputs. Likely cause?",
  "options": ["Learning rate is way too low", "Test data is perfectly balanced", "Severe class imbalance in data", "Too many features in dataset"],
  "correct": 3,
  "explanation": "When data is heavily imbalanced, predicting majority class looks accurate—but the model learned nothing useful.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks learning rate causes constant predictions",
    "option2": "Learner misunderstands what 'same class for all' means",
    "option4": "Learner thinks feature count causes degenerate predictions"
  }
}
```

### Q3: L1 vs L2 Regularization (TRADE-OFF) - 5-word options
```json
{
  "question": "When prefer L1 (Lasso) over L2 (Ridge) regularization?",
  "options": ["When all features are important", "When your data is perfectly clean", "L2 is always the better choice", "When you want feature selection"],
  "correct": 4,
  "explanation": "L1 drives some coefficients to exactly zero—effectively selecting the most important features automatically.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner reverses when to use L1 vs L2",
    "option2": "Learner thinks regularization choice depends on data quality",
    "option3": "Learner defaults to L2 without understanding trade-offs"
  }
}
```

### Q4: Single Tree vs Random Forest (TRADE-OFF) - 5-word options
```json
{
  "question": "Random Forest vs single Decision Tree. When prefer single tree?",
  "options": ["When accuracy is top priority", "When interpretability is absolutely critical", "Never because always use forest", "When dataset is extremely large"],
  "correct": 2,
  "explanation": "Single trees let you trace each decision visually—forests sacrifice that interpretability for better accuracy.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks single trees can be most accurate",
    "option3": "Learner believes ensembles are always better unconditionally",
    "option4": "Learner thinks dataset size determines tree vs forest"
  }
}
```

### Q5: Dropout Mechanism (MECHANISM-WHY) - 4-word options
```json
{
  "question": "Why does dropout help neural networks generalize?",
  "options": ["Removes noisy training data points", "Increases model capacity significantly", "Prevents co-adaptation of neurons", "Speeds up training time significantly"],
  "correct": 3,
  "explanation": "Dropout randomly disables neurons during training—this forces remaining neurons to learn more robust features.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses dropout (on neurons) with data cleaning",
    "option2": "Learner thinks disabling neurons increases capacity (opposite)",
    "option4": "Learner thinks dropout speeds training (actually slows slightly)"
  }
}
```

### Q6: Ensemble Variance Reduction (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why does ensemble averaging reduce variance?",
  "options": ["Different model errors cancel out", "More models means more data", "Averaging removes all model bias", "Ensembles don't actually reduce variance"],
  "correct": 1,
  "explanation": "Different models make different mistakes—when you average them, their individual errors tend to cancel each other out.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner confuses model count with data augmentation",
    "option3": "Learner thinks averaging affects bias (it mainly reduces variance)",
    "option4": "Learner doesn't understand ensemble variance reduction mechanism"
  }
}
```

### Q7: Fraud Detection Metric (METRIC-CHOICE) - 4-word options
```json
{
  "question": "Fraud detection (1% fraud rate). Best primary metric?",
  "options": ["Accuracy on test data", "R-squared regression metric", "Mean Squared Error value", "Precision-Recall AUC score"],
  "correct": 4,
  "explanation": "With 99% non-fraud, accuracy is useless—PR-AUC actually measures how well you catch the rare fraud cases.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner defaults to accuracy without considering imbalance",
    "option2": "Learner confuses classification metrics with regression R-squared",
    "option3": "Learner confuses classification with regression MSE metric"
  }
}
```

### Q8: Medical Diagnosis Priority (METRIC-CHOICE) - 4-word options
```json
{
  "question": "Medical diagnosis where missing disease is dangerous. Prioritize?",
  "options": ["Precision for false positives", "Recall for catching all cases", "Accuracy overall across classes", "Specificity for true negatives"],
  "correct": 2,
  "explanation": "Recall catches more true positives—in medicine, missing a disease (false negative) is far worse than a false alarm.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses precision with recall use cases",
    "option3": "Learner defaults to accuracy without considering error costs",
    "option4": "Learner confuses specificity with sensitivity/recall"
  }
}
```

### Q9: Overfitting Fix NOT (FIX-STRATEGY) - 5-word options
```json
{
  "question": "Model overfitting badly. Which will NOT help?",
  "options": ["Adding more features to model", "Adding regularization to model", "Getting more training data points", "Using dropout during training"],
  "correct": 1,
  "explanation": "More features just give the model more ways to memorize—regularization, more data, and dropout all combat overfitting.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner might think regularization doesn't help overfitting",
    "option3": "Learner might think more data doesn't help overfitting",
    "option4": "Learner might think dropout doesn't help overfitting"
  }
}
```

### Q10: Underfitting Fix (FIX-STRATEGY) - 5-word options
```json
{
  "question": "Both training and test accuracy are low (~60%). Best fix?",
  "options": ["Add stronger regularization terms", "Reduce amount of training data", "Use a more complex model", "Lower the learning rate value"],
  "correct": 3,
  "explanation": "Low training accuracy means underfitting—your model can't capture patterns, so it needs more capacity, not less.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner applies regularization for underfitting (wrong direction)",
    "option2": "Learner thinks less data helps (opposite needed)",
    "option4": "Learner thinks learning rate is the issue here"
  }
}
```

---

## 6. Deep Learning (10 Questions)

### Q1: NaN Loss (DEBUG-TRAINING) - 6-word options
```json
{
  "question": "Loss is NaN after few epochs. Most likely cause?",
  "options": ["Too many training epochs ran", "Learning rate is way too high", "Batch size is way too large", "Model capacity is way too small"],
  "correct": 2,
  "explanation": "A learning rate that's too high makes gradients explode—weights balloon until they overflow to NaN.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks more training directly causes NaN",
    "option3": "Learner confuses batch size with gradient explosion issues",
    "option4": "Learner thinks small model capacity causes numerical issues"
  }
}
```

### Q2: Train-Val Divergence (DEBUG-TRAINING) - 5-word options
```json
{
  "question": "Training loss decreasing but validation loss increasing. Issue?",
  "options": ["Learning rate is running too low", "Model needs many more epochs", "Model is severely underfitting data", "Overfitting is starting to happen"],
  "correct": 4,
  "explanation": "When train loss drops but validation rises, that's textbook overfitting—the model is memorizing instead of generalizing.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks LR affects train/val divergence direction",
    "option2": "Learner thinks more training fixes divergence (worsens it)",
    "option3": "Learner confuses over/underfitting symptoms completely"
  }
}
```

### Q3: Batch Normalization Purpose (ARCHITECTURE-WHY) - 6-word options
```json
{
  "question": "Why use batch normalization in deep networks?",
  "options": ["Stabilizes training and reduces covariate shift", "Reduces the overall model parameter size", "Eliminates need for activation function layers", "Only useful for CNN image architectures"],
  "correct": 1,
  "explanation": "BatchNorm normalizes layer inputs—this allows higher learning rates and faster, more stable training.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks normalization reduces parameters (adds them)",
    "option3": "Learner confuses normalization with activation functions",
    "option4": "Learner thinks BatchNorm is architecture-specific (it's general)"
  }
}
```

### Q4: Multi-head Attention (ARCHITECTURE-WHY) - 5-word options
```json
{
  "question": "Why do Transformers use multi-head attention?",
  "options": ["Reduce overall computation cost significantly", "Replace all other layer types", "Attend to different representation subspaces", "Only useful for image tasks"],
  "correct": 3,
  "explanation": "Multiple heads let the model focus on different aspects of input simultaneously—like parallel pattern detectors.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks more heads means less computation",
    "option2": "Learner thinks attention replaces feedforward layers entirely",
    "option4": "Learner thinks transformers are image-specific only"
  }
}
```

### Q5: model.eval() Forgotten (PREDICT-BEHAVIOR) - 5-word options
```json
{
  "question": "What happens if you forget `model.eval()` before inference?",
  "options": ["Model inference runs much faster", "Dropout and BatchNorm behave incorrectly", "Gradients get computed during inference", "No effect on model output"],
  "correct": 2,
  "explanation": "Without eval(), dropout keeps randomly zeroing neurons and BatchNorm uses batch stats—giving inconsistent, wrong results.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks training mode is faster (eval is faster)",
    "option3": "Learner confuses eval() with torch.no_grad()",
    "option4": "Learner doesn't know dropout/BN differ between train/eval"
  }
}
```

### Q6: Small Batch Size Effects (PREDICT-BEHAVIOR) - 5-word options
```json
{
  "question": "What happens with very small batch size (e.g., 2)?",
  "options": ["Training converges much faster overall", "Better generalization is always achieved", "Out of memory error occurs", "Noisy gradients cause unstable training"],
  "correct": 4,
  "explanation": "With only 2 samples, your gradient estimate is extremely noisy—training becomes unstable and hard to converge.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks smaller batches mean faster convergence",
    "option2": "Learner heard small batches generalize better (partially true but noisy)",
    "option3": "Learner reverses batch size memory relationship (large causes OOM)"
  }
}
```

### Q7: LSTM vs RNN (COMPARE-LAYERS) - 5-word options
```json
{
  "question": "When prefer LSTM over simple RNN?",
  "options": ["Long sequences with distant dependencies", "Very short sequences only needed", "When inference speed is critical", "For image classification tasks only"],
  "correct": 1,
  "explanation": "LSTM's gates control what to remember and forget—vanilla RNNs lose information across long sequences.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks LSTM is for short sequences",
    "option3": "Learner thinks LSTM is faster (it's slower)",
    "option4": "Learner confuses sequence models with image architectures"
  }
}
```

### Q8: CNN vs FC for Images (COMPARE-LAYERS) - 5-word options
```json
{
  "question": "CNN vs fully-connected for image input. Why CNN?",
  "options": ["Always more accurate without exception", "Much easier to implement correctly", "Exploits spatial structure with fewer params", "Works equally on any data type"],
  "correct": 3,
  "explanation": "CNNs share weights spatially—they learn local patterns with far fewer parameters than fully-connected layers need.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks CNN is universally best (FC can win sometimes)",
    "option2": "Learner thinks CNNs are simpler (more hyperparameters)",
    "option4": "Learner doesn't understand CNNs are specialized for spatial"
  }
}
```

### Q9: Vanishing Gradient Fix (FIX-ISSUE) - 5-word options
```json
{
  "question": "Gradients vanishing in deep network. Best fix?",
  "options": ["Make the network even deeper", "Remove all activation function layers", "Increase batch size significantly more", "Use skip connections like ResNet"],
  "correct": 4,
  "explanation": "Skip connections let gradients flow directly to earlier layers—they bypass the vanishing gradient problem.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks more depth fixes vanishing (worsens it)",
    "option2": "Learner thinks activations cause vanishing (wrong choice causes it)",
    "option3": "Learner confuses batch size with gradient flow"
  }
}
```

### Q10: Flat Loss Debugging (FIX-ISSUE) - 5-word options
```json
{
  "question": "Model not learning at all (loss flat). First thing to check?",
  "options": ["Add many more layers immediately", "Learning rate and data pipeline", "Train for many more epochs", "Use a smaller batch size"],
  "correct": 2,
  "explanation": "When loss stays flat, start with basics—usually it's either too-low learning rate or data not flowing correctly.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner tries to fix capacity before confirming data flows",
    "option3": "Learner thinks more training fixes flat loss (doesn't if LR wrong)",
    "option4": "Learner thinks batch size causes flat loss (rarely)"
  }
}
```

---

## 7. NLP (10 Questions)

### Q1: BERT Masking Purpose (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why does BERT use [MASK] token during pre-training?",
  "options": ["Reduces the overall vocabulary size", "Speeds up training time significantly", "Forces bidirectional context learning", "Required for all transformer architectures"],
  "correct": 3,
  "explanation": "Masking forces the model to use both left and right context—that's how BERT learns bidirectional representations.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks MASK affects vocabulary size somehow",
    "option2": "Learner confuses training objective with training speed",
    "option4": "Learner thinks all transformers use masking (GPT doesn't)"
  }
}
```

### Q2: Positional Encoding (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why do transformer models need positional encodings?",
  "options": ["Self-attention lacks any position information", "Reduces overall memory usage significantly", "Only needed for image transformer models", "Makes model training run much faster"],
  "correct": 1,
  "explanation": "Self-attention treats tokens as an unordered set—positional encoding tells the model where each token sits in sequence.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner confuses positional encoding with memory optimization",
    "option3": "Learner thinks positional encoding is only for ViTs",
    "option4": "Learner thinks positional info helps training speed"
  }
}
```

### Q3: WordPiece ## Prefix (TOKENIZATION) - 5-word options
```json
{
  "question": "WordPiece tokenizes 'unhappiness' as ['un', '##happi', '##ness']. Why '##' prefix?",
  "options": ["Marks the start of word", "Indicates continuation of previous token", "Signals that word is rare", "Has no special meaning here"],
  "correct": 2,
  "explanation": "The ## tells you this piece continues the previous token—it's how you know to concatenate them when reconstructing words.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner reverses meaning of ## prefix",
    "option3": "Learner thinks ## marks uncommon tokens",
    "option4": "Learner doesn't understand tokenizer conventions"
  }
}
```

### Q4: ChatGPT Tokenization (TOKENIZATION) - 5-word options
```json
{
  "question": "Why might 'ChatGPT' tokenize differently than 'chat' + 'GPT'?",
  "options": ["Capital letters are completely ignored", "Proper nouns are always skipped", "Tokenization is always exactly same", "Tokenizer learned it as single unit"],
  "correct": 4,
  "explanation": "Tokenizers learn from training frequency—if 'ChatGPT' appeared often enough, it became its own token.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks case is ignored in tokenization",
    "option2": "Learner thinks proper nouns get special handling",
    "option3": "Learner doesn't know tokenization varies by frequency"
  }
}
```

### Q5: Sentiment Classification (MODEL-CHOICE) - 5-word options
```json
{
  "question": "Task: Classify sentiment of product reviews. Best approach?",
  "options": ["Fine-tune BERT on labeled reviews", "Train transformer completely from scratch", "Use simple rule-based keyword matching", "GPT-4 without any fine-tuning done"],
  "correct": 1,
  "explanation": "Fine-tuning pretrained BERT on domain data gives you the best of both worlds—pretrained knowledge plus task-specific learning.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks training from scratch beats fine-tuning",
    "option3": "Learner falls back to simple rules (miss nuance)",
    "option4": "Learner thinks GPT-4 zero-shot always beats fine-tuned"
  }
}
```

### Q6: Semantic Search Embeddings (MODEL-CHOICE) - 5-word options
```json
{
  "question": "Need text embeddings for semantic search. Best option?",
  "options": ["Word2Vec with word averaging approach", "TF-IDF sparse vector representations", "Sentence transformers like all-MiniLM model", "Random embeddings without any training"],
  "correct": 3,
  "explanation": "Sentence transformers are trained specifically for semantic similarity—ideal for search where meaning matters.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner uses outdated method (Word2Vec loses sentence semantics)",
    "option2": "Learner confuses sparse vectors with semantic embeddings",
    "option4": "Learner doesn't understand embeddings need training"
  }
}
```

### Q7: Catastrophic Forgetting (DEBUG-NLP) - 5-word options
```json
{
  "question": "BERT model outputs same prediction for all inputs. Cause?",
  "options": ["Tokenizer is working completely correctly", "Catastrophic forgetting during fine-tuning process", "Model is way too large", "Need many more attention heads"],
  "correct": 2,
  "explanation": "Aggressive fine-tuning wipes out what BERT learned—use a gentler learning rate to avoid catastrophic forgetting.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks tokenizer causes constant predictions",
    "option3": "Learner thinks model size causes degenerate outputs",
    "option4": "Learner thinks attention heads cause constant predictions"
  }
}
```

### Q8: Long Input Accuracy Drop (DEBUG-NLP) - 5-word options
```json
{
  "question": "Text classification accuracy drops with longer inputs. Why?",
  "options": ["Longer text is always harder", "Model needs many more parameters", "Tokenizer implementation has bugs somewhere", "Input exceeds the max token length"],
  "correct": 4,
  "explanation": "BERT's 512-token limit means longer inputs get truncated—you're literally losing the end of your text.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks longer equals harder without considering truncation",
    "option2": "Learner thinks model size is the bottleneck",
    "option3": "Learner blames tokenizer for context limit issue"
  }
}
```

### Q9: Fine-tuning vs Prompting (COMPARE-APPROACHES) - 5-word options
```json
{
  "question": "Fine-tuning vs prompt engineering for new task. Key difference?",
  "options": ["Prompting is always more accurate", "Fine-tuning requires no labeled data", "Fine-tuning updates weights, prompting doesn't", "There is no practical difference"],
  "correct": 3,
  "explanation": "Fine-tuning actually modifies the model's weights, while prompting just instructs a frozen model—fundamentally different approaches.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner overestimates prompting capabilities",
    "option2": "Learner forgets fine-tuning requires labeled data",
    "option4": "Learner doesn't understand fundamental difference"
  }
}
```

### Q10: BERT vs GPT Architecture (COMPARE-APPROACHES) - 5-word options
```json
{
  "question": "BERT vs GPT architecture. Key structural difference?",
  "options": ["BERT encoder-only, GPT decoder-only", "GPT is much older than BERT", "BERT only does text generation", "Same architecture just different data"],
  "correct": 1,
  "explanation": "BERT reads bidirectionally for understanding tasks, while GPT reads left-to-right for generation—fundamentally different designs.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner has wrong timeline (both from 2018)",
    "option3": "Learner reverses which does generation (GPT generates)",
    "option4": "Learner thinks only training data differs"
  }
}
```

---

## 8. Gen AI (10 Questions)

### Q1: RAG vs Fine-tuning (DESIGN-TRADE-OFF) - 5-word options
```json
{
  "question": "RAG vs fine-tuning for company knowledge base. When prefer RAG?",
  "options": ["When data never changes at all", "When you have unlimited budget", "When accuracy doesn't really matter", "When data changes frequently often"],
  "correct": 4,
  "explanation": "RAG pulls fresh docs at query time—fine-tuning locks knowledge into weights, which gets stale fast when data changes.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner reverses when to use RAG vs fine-tuning",
    "option2": "Learner thinks RAG is expensive (often cheaper)",
    "option3": "Learner doesn't understand RAG improves accuracy via grounding"
  }
}
```

### Q2: Chunk Size Trade-off (DESIGN-TRADE-OFF) - 5-word options
```json
{
  "question": "Small chunks (100 tokens) vs large chunks (1000 tokens). When prefer small?",
  "options": ["When documents are very short", "When queries target specific facts", "When using weak embedding model", "Small chunks are always worse"],
  "correct": 2,
  "explanation": "Small chunks let you pinpoint exact facts—larger chunks have more context but match too broadly for precise queries.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses document length with optimal chunk size",
    "option3": "Learner thinks embedding model determines chunk size",
    "option4": "Learner assumes bigger is always better"
  }
}
```

### Q3: RAG Prompt Issues (DEBUG-RAG) - 5-word options
```json
{
  "question": "RAG retrieves relevant docs but LLM gives wrong answer. Cause?",
  "options": ["Vector DB is completely corrupted", "Embedding model has failed entirely", "Context not used properly in prompt", "Documents are way too short"],
  "correct": 3,
  "explanation": "Good retrieval but bad output? The prompt template is likely the problem—the LLM might be ignoring your context.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner blames infrastructure before checking prompt",
    "option2": "Learner thinks retrieval success means embedding works",
    "option4": "Learner thinks document length causes LLM issues"
  }
}
```

### Q4: Embedding Alignment (DEBUG-RAG) - 5-word options
```json
{
  "question": "Semantic search returns irrelevant results. First thing to check?",
  "options": ["Query and doc embedding alignment", "Database connection speed overall here", "LLM model size being used", "Number of documents stored now"],
  "correct": 1,
  "explanation": "Queries and docs must share the same embedding model—mixing models means their vectors live in different semantic spaces.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner confuses performance issues with relevance",
    "option3": "Learner confuses retrieval (embedding) with generation (LLM)",
    "option4": "Learner thinks more documents cause irrelevant results"
  }
}
```

### Q5: Temperature Zero (PARAMETER-EFFECT) - 5-word options
```json
{
  "question": "Setting temperature=0 in LLM API. What happens?",
  "options": ["API responds faster overall now", "Deterministic output every single time", "Random outputs every single time", "Model refuses to answer queries"],
  "correct": 2,
  "explanation": "Zero temperature means greedy decoding—the model always picks the most likely token, giving identical outputs each time.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner confuses temperature with latency optimization",
    "option3": "Learner reverses temperature effect (0 = deterministic)",
    "option4": "Learner thinks temperature affects model willingness"
  }
}
```

### Q6: Top-k Increase (PARAMETER-EFFECT) - 5-word options
```json
{
  "question": "Increasing top_k from 10 to 100. Effect on output?",
  "options": ["Faster generation speed overall happens", "More accurate results always guaranteed", "No effect on output quality", "More diverse but less coherent"],
  "correct": 4,
  "explanation": "Higher top_k samples from a larger pool of tokens—more creative outputs, but the model might pick weirder words.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks larger pool means faster sampling",
    "option2": "Learner thinks diversity equals accuracy",
    "option3": "Learner doesn't understand top_k affects token selection"
  }
}
```

### Q7: RAG Hallucination Reduction (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why does RAG reduce hallucinations compared to base LLM?",
  "options": ["Uses more model parameters overall", "Trains on much more data", "Grounds responses in retrieved facts", "RAG eliminates all hallucinations completely"],
  "correct": 3,
  "explanation": "RAG grounds responses in actual documents—the LLM references retrieved facts instead of just generating from training memory.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks RAG increases model capacity (doesn't)",
    "option2": "Learner confuses RAG retrieval with additional training",
    "option4": "Learner overestimates RAG (reduces, doesn't eliminate)"
  }
}
```

### Q8: Hybrid Search Benefits (MECHANISM-WHY) - 5-word options
```json
{
  "question": "Why use hybrid search (keyword + semantic) in RAG?",
  "options": ["Captures exact matches and meaning", "Faster than semantic search alone", "Uses less memory than semantic", "Required by all vector databases"],
  "correct": 1,
  "explanation": "Keywords nail exact matches that semantics miss, while semantics understands meaning that keywords miss—together they're stronger.",
  "timeLimit": 25,
  "distractorLogic": {
    "option2": "Learner thinks hybrid is faster (it's slower)",
    "option3": "Learner thinks hybrid reduces memory (uses more)",
    "option4": "Learner thinks hybrid is a DB requirement"
  }
}
```

### Q9: Out-of-scope Handling (BEST-PRACTICE) - 5-word options
```json
{
  "question": "User asks question outside your knowledge base. Best handling?",
  "options": ["Let LLM generate any answer", "Return empty response to user", "Crash the application immediately now", "Detect and respond I don't know"],
  "correct": 4,
  "explanation": "A graceful 'I don't know' beats a confident hallucination—honesty about limitations builds user trust.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner trusts LLM to always give helpful responses",
    "option2": "Learner thinks no response is better than admitting",
    "option3": "Learner chooses extreme option over graceful handling"
  }
}
```

### Q10: Legal RAG Consideration (BEST-PRACTICE) - 5-word options
```json
{
  "question": "Building RAG for legal documents. Critical consideration?",
  "options": ["Make chunks as large as possible", "Citation and source attribution required", "Use the lowest cost model", "Disable retrieval for faster speed"],
  "correct": 2,
  "explanation": "In legal contexts, every claim needs a paper trail—you must show exactly which document each piece of information came from.",
  "timeLimit": 25,
  "distractorLogic": {
    "option1": "Learner thinks bigger chunks equals more context",
    "option3": "Learner prioritizes cost over accuracy in high-stakes",
    "option4": "Learner prioritizes speed over correctness in legal"
  }
}
```

---

## Summary Statistics

| Module | Questions | Word Count Range | Question Types |
|--------|-----------|------------------|----------------|
| General AI | 20 | 4-5 words | ASSERTION-REASON, STATEMENT-ANALYSIS, HYPE-VS-REALITY, CAUSE-CONSEQUENCE, CRITICAL-EVALUATION |
| Python | 10 | 3-5 words | DEBUG-DIAGNOSE, PREDICT-OUTPUT, MECHANISM-WHY, BEST-PRACTICE, COMPARE-CONTRAST |
| SQL | 10 | 5 words | DEBUG-QUERY, OPTIMIZATION, MECHANISM-WHY, COMPARE-FUNCTIONS, PREDICT-RESULT |
| Math/Stats | 10 | 4-5 words | INTERPRETATION, MISCONCEPTION, APPLICATION, DECISION, CAUSE-EFFECT |
| Machine Learning | 10 | 4-5 words | DIAGNOSE, TRADE-OFF, MECHANISM-WHY, METRIC-CHOICE, FIX-STRATEGY |
| Deep Learning | 10 | 5-6 words | DEBUG-TRAINING, ARCHITECTURE-WHY, PREDICT-BEHAVIOR, COMPARE-LAYERS, FIX-ISSUE |
| NLP | 10 | 5 words | MECHANISM-WHY, TOKENIZATION, MODEL-CHOICE, DEBUG-NLP, COMPARE-APPROACHES |
| Gen AI | 10 | 5 words | DESIGN-TRADE-OFF, DEBUG-RAG, PARAMETER-EFFECT, MECHANISM-WHY, BEST-PRACTICE |

**Total: 90 Questions**

### Anti-Pattern Rules Applied:
- All options have equal word counts within each question
- Correct answer positions are randomized (not always first)
- Absolutes ("always", "never") distributed across correct and incorrect options
- Distractors target real misconceptions, not random wrong answers
- Explanations use "because/since" to explain reasoning

### Key Improvements (Dec 2025):
1. **ASSERTION-REASON Answer Variety**: Each question has a DIFFERENT correct answer type to prevent pattern exploitation
   - Q1: Both true and reason explains (DeepSeek MoE cost efficiency)
   - Q2: Assertion true but reason false (MMLU saturation vs leakage)
   - Q3: Assertion false but reason true (AI safety plans vs AGI race)
   - Q4: Both true but reason unrelated (Phi-3 on-device vs data quality)
   - Q5: Both assertion and reason false (o3 hallucination + CoT accuracy)

2. **CRITICAL-EVALUATION Natural Phrasing**: Questions framed as real workplace conversations
   - WRONG (robotic): "Claim: 'X.' Most accurate assessment?"
   - RIGHT (natural): "Your colleague insists X. What's missing from their reasoning?"

3. **December 2025 Research Sources**:
   - Claude Opus 4.5 (80.9% SWE-bench), GPT-5.1, Gemini 3 Pro (95% AIME)
   - DeepSeek V3.2 open source model ($0.028/M tokens, MIT license)
   - AI Safety Index Winter 2025 (no company above D in existential safety)
   - MMLU-Pro benchmark (10 options vs 4)
   - Hallucination rate improvements (Gemini 2.0 Flash at 0.7%)
   - Alignment faking research from Anthropic
