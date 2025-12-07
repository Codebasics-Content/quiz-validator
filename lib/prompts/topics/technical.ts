import { ModuleTopics } from "../config/types";

/**
 * Technical Module Topics - Code-focused modules
 * Each module has unique topics to prevent overlap
 */

const TECHNICAL_MODULE_CONFIG: Record<
  string,
  { topics: string; questionTypes: string }
> = {
  "Gen AI": {
    topics: `TOPICS (10 UNIQUE - TECHNICAL IMPLEMENTATION):
🔧 RAG: Retrieval strategies, chunking, re-ranking, hybrid search
🎯 FINE-TUNING: LoRA, QLoRA, PEFT, instruction tuning, DPO
📝 PROMPTING: Chain-of-thought, few-shot, system prompts, jailbreak prevention
🧮 TOKENIZATION: BPE, SentencePiece, vocab size trade-offs
📐 EMBEDDINGS: Vector similarity, dimensionality, semantic search
⚙️ INFERENCE: Quantization, batching, KV-cache, speculative decoding
🏗️ ARCHITECTURE: Transformers, attention mechanisms, MoE routing
🔍 EVALUATION: Benchmarks, MMLU, HumanEval, perplexity metrics
💾 CONTEXT: Window limits, lost-in-middle, context compression
🛠️ TOOLS: LangChain, LlamaIndex, vector DBs, orchestration`,
    questionTypes: `QUESTION TYPES for Gen AI (technical implementation):
DEBUG | PREDICT-OUTPUT | ARCHITECTURE-TRADEOFF | CAUSE-CONSEQUENCE
COMPARE | TOOL-RECOGNITION | ALGORITHM-INSIGHT | HYPE-VS-REALITY`,
  },

  Python: {
    topics: `10 DIVERSE TOPICS (1 question each, no repeats):
1. DECORATORS & METAPROGRAMMING - @property, @staticmethod, custom decorators
2. GENERATORS & ITERATORS - yield, lazy evaluation, memory efficiency
3. ASYNC/AWAIT - asyncio, concurrent execution, event loops
4. EXCEPTION HANDLING - try/except patterns, custom exceptions, context managers
5. DATA STRUCTURES - collections module, defaultdict, Counter, deque
6. FILE I/O & CONTEXT MANAGERS - with statement, pathlib, file handling
7. OOP CONCEPTS - inheritance, composition, dunder methods, ABC
8. FUNCTIONAL PROGRAMMING - map, filter, reduce, lambda, comprehensions
9. PANDAS & DATA MANIPULATION - DataFrame operations, groupby, merge, apply
10. FASTAPI & WEB - endpoints, dependency injection, Pydantic models`,
    questionTypes: `QUESTION TYPES for Python (technical, code-focused):
DEBUG-CODE | PREDICT-OUTPUT | COMPARE-APPROACHES | CAUSE-CONSEQUENCE
BEST-PRACTICE | ERROR-IDENTIFICATION | PERFORMANCE-TRADEOFF | CODE-COMPLETION`,
  },

  SQL: {
    topics: `10 DIVERSE TOPICS (1 question each, no repeats):
1. WINDOW FUNCTIONS - ROW_NUMBER, RANK, LAG, LEAD, partitioning
2. CTEs & RECURSIVE QUERIES - WITH clause, hierarchical data
3. JOIN OPERATIONS - INNER, LEFT, RIGHT, FULL, CROSS, self-joins
4. AGGREGATION & GROUPING - GROUP BY, HAVING, rollup, cube
5. SUBQUERIES - correlated, scalar, EXISTS, IN vs JOIN
6. INDEXING & OPTIMIZATION - B-tree, covering index, query plans
7. DATA MODIFICATION - INSERT, UPDATE, DELETE, MERGE, transactions
8. CONSTRAINTS & INTEGRITY - PRIMARY KEY, FOREIGN KEY, CHECK, UNIQUE
9. STRING & DATE FUNCTIONS - CONCAT, SUBSTRING, DATE_TRUNC, intervals
10. ANALYTICAL QUERIES - pivoting, running totals, percentiles`,
    questionTypes: `QUESTION TYPES for SQL (query-focused):
QUERY-OUTPUT | DEBUG-QUERY | OPTIMIZATION-CHOICE | COMPARE-APPROACHES
BEST-PRACTICE | ERROR-IDENTIFICATION | PERFORMANCE-ANALYSIS | QUERY-COMPLETION`,
  },

  "Math/Stats": {
    topics: `10 DIVERSE TOPICS (1 question each, no repeats):
1. HYPOTHESIS TESTING - null/alternative, Type I/II errors, significance
2. P-VALUES & CONFIDENCE INTERVALS - interpretation, calculation, misuse
3. PROBABILITY DISTRIBUTIONS - normal, binomial, Poisson, exponential
4. A/B TESTING - sample size, power analysis, statistical significance
5. CORRELATION & REGRESSION - Pearson, Spearman, OLS assumptions
6. DESCRIPTIVE STATISTICS - mean, median, mode, variance, skewness
7. SAMPLING METHODS - random, stratified, bootstrap, bias
8. BAYESIAN VS FREQUENTIST - prior, posterior, likelihood
9. STATISTICAL FALLACIES - Simpson's paradox, survivorship bias
10. EXPERIMENTAL DESIGN - randomization, blocking, confounding`,
    questionTypes: `QUESTION TYPES for Math/Stats (interpretation-focused):
INTERPRET-RESULT | CHOOSE-TEST | IDENTIFY-FALLACY | CAUSE-CONSEQUENCE
CALCULATE-OUTCOME | COMPARE-METHODS | ASSUMPTION-CHECK | REAL-WORLD-APPLICATION`,
  },

  "Machine Learning": {
    topics: `10 DIVERSE TOPICS (1 question each, no repeats):
1. REGULARIZATION - L1/L2, dropout, early stopping, ridge vs lasso
2. ENSEMBLE METHODS - bagging, boosting, Random Forest, XGBoost
3. MODEL EVALUATION - precision, recall, F1, ROC-AUC, confusion matrix
4. CROSS-VALIDATION - k-fold, stratified, leave-one-out, time series CV
5. FEATURE ENGINEERING - scaling, encoding, feature selection, PCA
6. BIAS-VARIANCE TRADEOFF - overfitting, underfitting, generalization
7. DECISION TREES - splitting criteria, pruning, feature importance
8. CLUSTERING - k-means, DBSCAN, hierarchical, silhouette score
9. DIMENSIONALITY REDUCTION - PCA, t-SNE, UMAP, autoencoders
10. HYPERPARAMETER TUNING - grid search, random search, Bayesian optimization`,
    questionTypes: `QUESTION TYPES for ML (reasoning-focused):
DEBUG-MODEL | TRADEOFF-ANALYSIS | CHOOSE-ALGORITHM | CAUSE-CONSEQUENCE
INTERPRET-METRICS | COMPARE-APPROACHES | DIAGNOSE-PROBLEM | OPTIMIZATION-CHOICE`,
  },

  "Deep Learning": {
    topics: `10 DIVERSE TOPICS (1 question each, no repeats):
1. NEURAL NETWORK FUNDAMENTALS - activation functions, backpropagation
2. CNNs - convolution, pooling, stride, padding, architectures
3. TRANSFORMERS - attention mechanism, self-attention, positional encoding
4. OPTIMIZATION - SGD, Adam, learning rate schedules, momentum
5. REGULARIZATION - dropout, batch norm, layer norm, weight decay
6. LOSS FUNCTIONS - cross-entropy, MSE, focal loss, contrastive loss
7. TRANSFER LEARNING - fine-tuning, feature extraction, pretrained models
8. RNNs & LSTMs - vanishing gradients, gating mechanisms, sequences
9. GANs & AUTOENCODERS - generator, discriminator, latent space, VAE
10. PYTORCH FUNDAMENTALS - tensors, autograd, DataLoader, nn.Module`,
    questionTypes: `QUESTION TYPES for Deep Learning (architecture-focused):
DEBUG-NETWORK | ARCHITECTURE-CHOICE | TRADEOFF-ANALYSIS | CAUSE-CONSEQUENCE
PREDICT-BEHAVIOR | COMPARE-LAYERS | DIAGNOSE-TRAINING | OPTIMIZATION-DECISION`,
  },

  NLP: {
    topics: `10 DIVERSE TOPICS (1 question each, no repeats):
1. TOKENIZATION - BPE, WordPiece, SentencePiece, subword algorithms
2. EMBEDDINGS - Word2Vec, GloVe, contextual embeddings, similarity
3. TRANSFORMER ARCHITECTURE - encoder, decoder, attention heads
4. BERT & VARIANTS - MLM, NSP, RoBERTa, DistilBERT, fine-tuning
5. GPT & GENERATION - autoregressive, temperature, top-k, top-p
6. SEQUENCE TASKS - NER, POS tagging, sentiment, classification
7. HUGGING FACE - pipeline, tokenizers, model hub, Trainer API
8. TEXT PREPROCESSING - stemming, lemmatization, stopwords, cleaning
9. EVALUATION METRICS - BLEU, ROUGE, perplexity, F1 for NER
10. PROMPT ENGINEERING - few-shot, zero-shot, chain-of-thought`,
    questionTypes: `QUESTION TYPES for NLP (mechanism-focused):
DEBUG-PIPELINE | ARCHITECTURE-CHOICE | COMPARE-MODELS | CAUSE-CONSEQUENCE
TOKENIZATION-OUTPUT | EMBEDDING-BEHAVIOR | FINE-TUNING-DECISION | EVALUATION-CHOICE`,
  },
};

/**
 * Get technical module topics with difficulty rules
 */
export const getTechnicalModuleTopics = (
  moduleName: string,
  difficultyRule: string,
): ModuleTopics | null => {
  const moduleConfig = TECHNICAL_MODULE_CONFIG[moduleName];
  if (!moduleConfig) return null;

  const forbidden =
    moduleName === "Gen AI"
      ? `FORBIDDEN FOR GEN AI (these belong to General AI module):
❌ Energy consumption, carbon footprint debates
❌ Job displacement, workforce impact discussions
❌ EU AI Act compliance, legal liability questions
❌ AGI timelines, existential risk philosophy
❌ Market valuations, funding rounds, business strategy
❌ Election manipulation, social media regulation`
      : "";

  return {
    topics: moduleConfig.topics,
    forbidden,
    questionTypes: moduleConfig.questionTypes,
    style: `QUESTION STYLE for ${moduleName}:
- Questions should test REASONING, not just recall
- Include specific code snippets, function names, or scenarios
- Ask WHY something happens, not just WHAT it is
- Use realistic debugging scenarios and tradeoff analysis`,
    difficulty: `QUESTION ORDERING (STRICT SEQUENCE):
${difficultyRule}

DIFFICULTY DESCRIPTIONS:
- EASY: Direct concept, single-step reasoning
- MEDIUM: Multi-step reasoning, compare approaches
- HARD: Complex scenarios, debugging, tradeoffs
- VERY HARD: Multi-concept synthesis, edge cases

DIVERSITY REQUIREMENTS:
- All 10 questions from DIFFERENT topics (no repeats)
- At least 6 DIFFERENT question types
- Mix of code-based and conceptual questions`,
  };
};
