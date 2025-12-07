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
    label: "Generative AI (Technical)",
    icon: "✨",
    category: "Gen AI",
  },
  {
    value: "General AI",
    label: "AI Awareness (UPSC Style)",
    icon: "⚡",
    category: "AI Awareness",
  },
];

export const COLUMN_HEADERS = [
  "id",
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
  // 17 columns (A-Q): id, question, 9 answers, correctAnswer, points, explanation, time, image
];
