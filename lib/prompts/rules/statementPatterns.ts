/**
 * STATEMENT OPTIONS PATTERN - Trick-proof options
 * Single Source of Truth - Import wherever needed
 */
export const STATEMENT_OPTIONS_RULES = `⚠️ STATEMENT OPTIONS PATTERN (Trick-proof):

FOR STATEMENT-BASED (2 statements):
- Options: "1 only", "2 only", "Both", "Neither"
- Mix correct answers across questions

FOR ASSERTION-REASON (Q10 - UPSC STANDARD):
⚠️ MANDATORY 4 OPTIONS (EXACT WORDING):
1. "Both true, R explains A"
2. "Both true, R doesn't explain A"
3. "A true, R false"
4. "A false, R true"

❌ WRONG: "A false, R true", "Both A and R true", "Both completely false"
✓ RIGHT: Uses relationship between A and R, not just true/false`;

/**
 * NEGATIVE QUESTION PATTERNS - Applies to all question types
 */
export const NEGATIVE_PATTERN_RULES = `⚠️ NEGATIVE QUESTION PATTERNS (ALL question types, not just statements):
MIX positive/negative stems across ALL formats to prevent pattern exploitation:

FOR STATEMENT-BASED:
- "Which is/are CORRECT?" (positive)
- "Which is/are INCORRECT?" (negative)
⚠️ NEVER use same stem for consecutive questions (Q8 incorrect + Q9 incorrect = BAD)

FOR DIRECT QUESTIONS:
- "What is the PRIMARY benefit of X?" (positive)
- "What is NOT a benefit of X?" (negative)
- "Which factor contributes to X?" (positive)
- "Which factor does NOT contribute to X?" (negative)

FOR ALL TYPES:
- "Which is NOT part of [X]?" (exclusion)
- "Which has NOT been implemented yet?" (status)
- "Which does NOT apply to [X]?" (exception)
- "Which is EXCLUDED from [X]?" (exclusion)

DISTRIBUTION: 70% positive, 30% negative - BUT NEVER 2 consecutive negative stems
RULE: If Q8 uses "INCORRECT", Q9 MUST use "CORRECT" or different format`;

/**
 * NO QUANTIFICATION RULE - UPSC Pattern
 */
export const NO_QUANTIFICATION_RULES = `⚠️ NO QUANTIFICATION IN STATEMENTS (UPSC PATTERN):
- BANNED: Specific percentages (24.5%, 45-50%), exact numbers (3 seconds, 5 years)
- USE: Relative terms ("about/approximately", "most/some", "significant/minimal")
- REASON: Exact numbers are NOT recallable by learners under time pressure
- GOOD: "Detection accuracy drops significantly in real-world conditions"
- BAD: "Detection accuracy drops 45-50% in real-world conditions"
- GOOD: "Voice cloning requires minimal audio samples"
- BAD: "Voice cloning requires only 3 seconds of audio"`;
