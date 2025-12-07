import { ModuleTopics, DateContext } from "../config/types";
import { getDifficultyString } from "../config/helpers";
import { getModuleConfig } from "../config/modules";
import { getGeneralAITopics } from "./generalAI";
import { getTechnicalModuleTopics } from "./technical";

export { getGeneralAITopics } from "./generalAI";
export { getTechnicalModuleTopics } from "./technical";

/**
 * Get module-specific topics - Main entry point
 * Routes to appropriate topic generator based on module
 */
export const getModuleTopics = (
  moduleName: string,
  dateContext?: DateContext,
): ModuleTopics => {
  const config = getModuleConfig(moduleName);
  const difficultyRule = getDifficultyString(config);

  // Dynamic date - use passed context or generate fresh
  const year = dateContext?.year || new Date().getFullYear();
  const month =
    dateContext?.month ||
    new Date().toLocaleString("default", { month: "long" });
  const fullDate = dateContext?.fullDate || `${month} ${year}`;
  const searchDate = dateContext?.searchDate || `${month} ${year}`;
  const isoDate =
    dateContext?.isoDate || new Date().toISOString().split("T")[0];

  // General AI - UPSC Style
  if (moduleName === "General AI") {
    return getGeneralAITopics(fullDate, isoDate, searchDate, difficultyRule);
  }

  // Technical modules
  const technicalTopics = getTechnicalModuleTopics(moduleName, difficultyRule);
  if (technicalTopics) {
    return technicalTopics;
  }

  // Fallback for custom modules
  return {
    topics: `TOPICS (10 UNIQUE, SHUFFLE order):
Generate 10 diverse topics relevant to ${moduleName}
Each question should cover a DIFFERENT concept`,
    forbidden: "",
    questionTypes: `QUESTION TYPES (pick 6+ different, max 2 of same):
DEBUG | PREDICT-OUTPUT | COMPARE | CAUSE-CONSEQUENCE
TRADEOFF-ANALYSIS | BEST-PRACTICE | ERROR-IDENTIFICATION | OPTIMIZATION`,
    style: `QUESTION STYLE:
- Test REASONING, not just recall
- Include specific examples and scenarios
- Ask WHY, not just WHAT`,
    difficulty: `QUESTION ORDERING:
${difficultyRule}`,
  };
};

/**
 * COMPACT CATEGORY LIST - For refinement prompts (saves tokens)
 */
export const getCompactCategoryList = (moduleName: string): string => {
  if (moduleName === "General AI") {
    return "12 CATEGORIES: 1.Energy 2.Safety/Scams 3.Career 4.Regulations 5.AI-Safety 6.Healthcare 7.Daily-Life 8.Education 9.Global 10.Research-Papers 11.Expert-Statements 12.Emerging-Tech";
  }
  const topicMap: Record<string, string> = {
    "Gen AI":
      "TOPICS: RAG|Fine-tuning|Prompting|Tokenization|Embeddings|Inference|Architecture|Evaluation|Context|Tools",
    Python:
      "TOPICS: Decorators|Generators|Async|Exceptions|DataStructures|FileIO|OOP|Functional|Pandas|FastAPI",
    SQL: "TOPICS: WindowFuncs|CTEs|JOINs|Aggregation|Subqueries|Indexing|DML|Constraints|StringDate|Analytics",
    "Math/Stats":
      "TOPICS: HypothesisTesting|P-values|Distributions|A/B-Testing|Regression|Descriptive|Sampling|Bayesian|Fallacies|ExperimentDesign",
    "Machine Learning":
      "TOPICS: Regularization|Ensembles|Evaluation|CrossValidation|FeatureEng|BiasVariance|DecisionTrees|Clustering|DimReduction|Hyperparams",
    "Deep Learning":
      "TOPICS: NNFundamentals|CNNs|Transformers|Optimization|Regularization|LossFuncs|TransferLearning|RNNs|GANs|PyTorch",
    NLP: "TOPICS: Tokenization|Embeddings|Transformers|BERT|GPT|SequenceTasks|HuggingFace|Preprocessing|Metrics|PromptEng",
  };
  return (
    topicMap[moduleName] ||
    `TOPICS: 10 diverse ${moduleName} concepts (no repeats)`
  );
};

/**
 * COMPACT FORMAT LIST - For refinement prompts (saves tokens)
 */
export const getCompactFormatList = (moduleName: string): string => {
  if (moduleName === "General AI") {
    return "FORMATS: Statement-based(40%)|Direct(30%)|Assertion-Reason(10%)|Match(10%)|Negative(10%)";
  }
  return "TYPES: DEBUG|PREDICT-OUTPUT|COMPARE|CAUSE-CONSEQUENCE|TRADEOFF|BEST-PRACTICE|ERROR-ID|OPTIMIZATION";
};
