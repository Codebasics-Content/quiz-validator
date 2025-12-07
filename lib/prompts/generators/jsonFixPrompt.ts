/**
 * JSON SYNTAX FIX PROMPT
 * For fixing malformed JSON (syntax errors only)
 */
export const getJSONSyntaxFixPrompt = (
  moduleName: string,
  malformedJSON: string,
  parseError: string,
): string => {
  return `<output_constraints>
No Preamble | No Fluff | No Fence | No Hallucination | No Assumptions
</output_constraints>

<task>Fix JSON syntax errors in ${moduleName} quiz</task>

<error>${parseError}</error>

<malformed_json>
${malformedJSON}
</malformed_json>

<fix_rules>
- Fix ONLY syntax errors (missing commas, quotes, brackets)
- Do NOT change content or question text
- Ensure valid JSON that passes JSON.parse()
- Use straight quotes " not curly quotes
- No trailing commas
- Escape special characters in strings
</fix_rules>

<output>
Single-line JSON only. No markdown fences. Starts { ends }
</output>`;
};
