import { ModuleOption } from "./types";

export const MODULES: ModuleOption[] = [
  {
    value: "Python",
    label: "Python Foundations",
    icon: "🐍",
    category: "Programming",
  },
  { value: "SQL", label: "SQL & Databases", icon: "🗄️", category: "Data" },
  {
    value: "Math/Stats",
    label: "Math & Statistics",
    icon: "📊",
    category: "Fundamentals",
  },
  {
    value: "Machine Learning",
    label: "Machine Learning",
    icon: "🤖",
    category: "AI/ML",
  },
  {
    value: "Deep Learning",
    label: "Deep Learning",
    icon: "🧠",
    category: "AI/ML",
  },
  {
    value: "NLP",
    label: "NLP & Transformers",
    icon: "💬",
    category: "AI/ML",
  },
  {
    value: "Gen AI",
    label: "Generative AI (Course)",
    icon: "✨",
    category: "Gen AI",
  },
  {
    value: "General AI",
    label: "Gen AI News & Trends",
    icon: "⚡",
    category: "Gen AI",
  },
];

export const COLUMN_HEADERS = [
  "question",
  "answer1",
  "answer2",
  "answer3",
  "answer4",
  "answer5",
  "answer6",
  "answer7",
  "answer8",
  "answer9",
  "correctAnswer",
  "minPoints",
  "maxPoints",
  "explanation",
  "timeLimit",
  "imageUrl",
  // Module column removed - not in Excel template (16 columns A-P)
];
