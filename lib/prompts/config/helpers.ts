import { QuizConfig, DateContext, ErrorCategories } from "./types";

/**
 * Dynamic difficulty string from config
 */
export const getDifficultyString = (config: QuizConfig): string => {
  const { easy, medium, hard, veryHard } = config.difficultyDistribution;
  const easyEnd = easy.count;
  const mediumEnd = easyEnd + medium.count;
  const hardEnd = mediumEnd + hard.count;

  return `Q1-Q${easyEnd}: EASY (${easy.timeRange}) → Q${easyEnd + 1}-Q${mediumEnd}: MEDIUM (${medium.timeRange}) → Q${mediumEnd + 1}-Q${hardEnd}: HARD (${hard.timeRange}) → Q${hardEnd + 1}: VERY HARD (${veryHard.timeRange})`;
};

/**
 * Dynamic time rules from config
 */
export const getTimeRulesFromConfig = (config: QuizConfig): string => {
  const { easy, medium, hard, veryHard } = config.difficultyDistribution;
  const easyEnd = easy.count;
  const mediumEnd = easyEnd + medium.count;
  const hardEnd = mediumEnd + hard.count;

  return `Q1-Q${easyEnd}:${easy.timeRange}(EASY) | Q${easyEnd + 1}-Q${mediumEnd}:${medium.timeRange}(MEDIUM) | Q${mediumEnd + 1}-Q${hardEnd}:${hard.timeRange}(HARD) | Q${hardEnd + 1}:${veryHard.timeRange}(VHARD)`;
};

/**
 * Dynamic date context generator
 */
export const getDateContext = (): DateContext => {
  const now = new Date();
  const weekOfMonth = Math.ceil(now.getDate() / 7);
  const weekDescriptor = `Week ${weekOfMonth}`;
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  return {
    year,
    month,
    day: now.getDate(),
    week: weekOfMonth,
    weekDescriptor,
    quarter: `Q${Math.floor(now.getMonth() / 3) + 1}`,
    isoDate: now.toISOString().split("T")[0],
    fullDate: `${weekDescriptor} of ${month} ${year}`,
    searchDate: `${month} ${year}`,
  };
};

/**
 * Categorize errors for targeted fix instructions
 */
export const categorizeErrors = (
  errors: string[],
  warnings: string[],
): ErrorCategories => {
  const categories: ErrorCategories = {
    structural: [],
    content: [],
    pattern: [],
    hallucination: [],
    timing: [],
  };

  [...errors, ...warnings].forEach((issue) => {
    const lower = issue.toLowerCase();
    if (
      lower.includes("model") ||
      lower.includes("gpt") ||
      lower.includes("claude") ||
      lower.includes("hallucinated") ||
      lower.includes("hype") ||
      lower.includes("buzzword")
    ) {
      categories.hallucination.push(issue);
    } else if (
      lower.includes("schema") ||
      lower.includes("missing") ||
      lower.includes("field") ||
      lower.includes("json") ||
      lower.includes("format")
    ) {
      categories.structural.push(issue);
    } else if (
      lower.includes("distribution") ||
      lower.includes("position") ||
      lower.includes("pattern") ||
      lower.includes("consecutive")
    ) {
      categories.pattern.push(issue);
    } else if (lower.includes("time") || lower.includes("second")) {
      categories.timing.push(issue);
    } else {
      categories.content.push(issue);
    }
  });

  return categories;
};
