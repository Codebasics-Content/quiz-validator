/**
 * QUESTION TYPE DIVERSITY - Applies to all quiz generation
 * Single Source of Truth - Import wherever needed
 */
export const QUESTION_TYPE_DIVERSITY_RULES = `⚠️ QUESTION TYPE DIVERSITY (MANDATORY - MIN 5 DIFFERENT TYPES):
Each question MUST use a different cognitive type. Pick from:
1. ANALYZE - "What factors contribute to X?" "Why does X happen?"
2. EVALUATE - "Which approach is most effective for X?" "What is the PRIMARY reason?"
3. COMPARE - "How does X differ from Y?" "What distinguishes X from Y?"
4. PREDICT - "What would happen if X?" "What is the likely outcome of X?"
5. CAUSE-EFFECT - "What causes X?" "What is the consequence of X?"
6. IDENTIFY - "Which is an example of X?" "What characterizes X?"
7. CRITIQUE - "What is the main limitation of X?" "Which is NOT a valid argument?"
8. APPLY - "In scenario X, which approach works?" "How would X be applied to Y?"

❌ FAILS VALIDATION: Using same type >2 times (e.g., 5 ANALYZE questions)
✓ REQUIRED: At least 5 different types across 10 questions
✓ MAX: 2 questions of same type`;
