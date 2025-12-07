"use client";

import React, { useState } from "react";
import { GraduationCap, Info } from "lucide-react";
import ModuleSelector from "@/components/quiz/ModuleSelector";
import PromptDisplay from "@/components/quiz/PromptDisplay";
import ValidationResults from "@/components/quiz/ValidationResults";
import AnswerDistribution from "@/components/quiz/AnswerDistribution";
import QuizExporter from "@/components/quiz/QuizExporter";
import {
  QuizData,
  ValidationResults as ValidationResultsType,
} from "@/lib/types";
import { validateQuizJSON, extractJSONFromLLMOutput } from "@/lib/utils";
import {
  getSystemPrompt,
  getRefinementPrompt,
  getManualQuestionAssistPrompt,
  getJSONSyntaxFixPrompt,
} from "@/lib/prompts";

type QuizMode = "ai" | "refine";

export default function QuizValidatorPage() {
  const [quizMode, setQuizMode] = useState<QuizMode>("ai");
  const [module, setModule] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [validationResults, setValidationResults] =
    useState<ValidationResultsType | null>(null);
  const [validatedQuiz, setValidatedQuiz] = useState<QuizData | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [shuffledQuiz, setShuffledQuiz] = useState<QuizData | null>(null);
  const [refinementMode, setRefinementMode] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [previousErrorCount, setPreviousErrorCount] = useState<number | null>(
    null,
  );
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [customModule, setCustomModule] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [humanFeedback, setHumanFeedback] = useState("");
  const [manualQuestions, setManualQuestions] = useState("");

  const handleModuleChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInput(true);
      setModule("");
    } else {
      setShowCustomInput(false);
      setModule(value);
      setCustomModule("");
    }
  };

  const handleCustomModuleChange = (value: string) => {
    setCustomModule(value);
    if (value.trim()) {
      setModule(value.trim());
    }
  };

  const handleGeneratePrompt = () => {
    setShowPrompt(true);
    setRefinementMode(false);
  };

  const handleCopyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleValidate = () => {
    setIsValidating(true);

    if (validationResults && !validationResults.valid) {
      setPreviousErrorCount(validationResults.errors.length);
    }

    const selectedModule = showCustomInput ? customModule : module;
    const results = validateQuizJSON(jsonInput, selectedModule);

    setValidationResults(results);

    // Always show QuizExporter (with Shuffle button) if we have valid JSON structure
    // Pattern errors are FIXED by shuffling, not by LLM regeneration
    if (results.data) {
      setValidatedQuiz(results.data);
      setShuffledQuiz(null);

      if (results.valid) {
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 3000);
      }
    } else {
      setValidatedQuiz(null);
      setShuffledQuiz(null);
    }

    setTimeout(() => setIsValidating(false), 300);
  };

  // For Step 2: When validation fails, generate prompt with errors
  const handleGenerateRefinementPrompt = () => {
    setRefinementMode(true);
    setShowPrompt(true);
  };

  // For Step 1: Generate manual/Excel conversion prompt (NOT refinement)
  const handleGenerateManualPrompt = () => {
    setRefinementMode(false); // Explicitly set to false for Step 1
    setShowPrompt(true);
  };

  // Handle shuffle and re-validate to update error display
  const handleShuffleQuiz = (shuffled: QuizData) => {
    setShuffledQuiz(shuffled);

    // Re-validate the shuffled quiz to update errors/warnings
    const selectedModule = showCustomInput ? customModule : module;
    const results = validateQuizJSON(JSON.stringify(shuffled), selectedModule);
    setValidationResults(results);

    // Update validatedQuiz with shuffled data
    if (results.data) {
      setValidatedQuiz(results.data);
    }

    if (results.valid) {
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
    }
  };

  const getPromptContent = (): string => {
    const selectedModule = showCustomInput ? customModule : module;

    // PRIORITY 1: Refinement of validated JSON (when validation failed and user wants to fix)
    // refinementMode is set by handleGenerateRefinementPrompt when user clicks button in Step 2
    if (refinementMode) {
      // Check if we have JSON to refine
      if (jsonInput && jsonInput.trim()) {
        try {
          const cleanedJSON = extractJSONFromLLMOutput(jsonInput);
          const existingQuiz = JSON.parse(cleanedJSON);
          return getRefinementPrompt(
            selectedModule,
            existingQuiz,
            validationResults?.errors || [],
            validationResults?.warnings || [],
            humanFeedback,
          );
        } catch (e) {
          const errorMsg =
            e instanceof Error ? e.message : "Unknown parse error";
          const cleanedJSON = extractJSONFromLLMOutput(jsonInput);
          return getJSONSyntaxFixPrompt(selectedModule, cleanedJSON, errorMsg);
        }
      }
      // If refinementMode but no jsonInput, fall through to other options
    }

    // PRIORITY 2: Refine mode - Excel/text input with human feedback (Step 1)
    // Only if NOT in refinementMode (which is for Step 2)
    if (!refinementMode && quizMode === "refine" && manualQuestions.trim()) {
      return getManualQuestionAssistPrompt(
        selectedModule,
        manualQuestions,
        humanFeedback,
      );
    }

    // AI mode - fresh generation
    return getSystemPrompt(selectedModule);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">
              Quiz Validator & Generator
            </h1>
          </div>
          <p className="text-slate-600">
            Generate AI-powered quiz prompts and validate quiz JSON for bootcamp
            Discord bot
          </p>
        </div>

        {/* Quiz Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Select Mode
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setQuizMode("ai")}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                quizMode === "ai"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🆕 New Quiz Generation
            </button>
            <button
              onClick={() => setQuizMode("refine")}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                quizMode === "refine"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✏️ Existing Quiz Refinement
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {quizMode === "ai"
              ? "Generate a fresh quiz using AI with system prompts"
              : "Refine/fix an existing quiz JSON with human feedback"}
          </p>
        </div>

        {/* AI Mode: Step 1: Configuration */}
        {quizMode === "ai" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Step 1: Select Module
            </h2>

            <div className="mb-6">
              <ModuleSelector
                selectedModule={module}
                showCustomInput={showCustomInput}
                customModule={customModule}
                onModuleChange={handleModuleChange}
                onCustomModuleChange={handleCustomModuleChange}
              />
            </div>

            <button
              onClick={handleGeneratePrompt}
              disabled={!module && !customModule}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                module || customModule
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              Generate System Prompt
            </button>
          </div>
        )}

        {/* Prompt Display (AI & Manual Modes) */}
        {showPrompt && (module || customModule) && (
          <PromptDisplay
            module={module}
            customModule={customModule}
            showCustomInput={showCustomInput}
            isVisible={showPrompt}
            isCopied={copiedPrompt}
            onClose={() => setShowPrompt(false)}
            onCopy={handleCopyPrompt}
            getSystemPrompt={getPromptContent}
          />
        )}

        {/* AI Mode: JSON Input & Validation */}
        {quizMode === "ai" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Paste Quiz JSON
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Copy the system prompt above</li>
                  <li>Paste into your LLM (Claude, ChatGPT, Gemini)</li>
                  <li>Copy the generated JSON output</li>
                  <li>Paste it below and click "Validate"</li>
                </ol>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste quiz JSON here..."
              className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleValidate}
                disabled={!jsonInput.trim() || (!module && !customModule)}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  jsonInput.trim() && (module || customModule)
                    ? isValidating
                      ? "bg-yellow-600 text-white"
                      : "bg-green-600 text-white hover:bg-green-700"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isValidating ? "Validating..." : "Validate Quiz JSON"}
              </button>

              {validationResults && !validationResults.valid && (
                <button
                  onClick={handleGenerateRefinementPrompt}
                  className="px-6 py-3 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all"
                >
                  Generate Refinement Prompt
                </button>
              )}
            </div>

            {/* Human Feedback Input for Refinement */}
            {validationResults && !validationResults.valid && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <label className="block text-sm font-semibold text-amber-800 mb-2">
                  🎯 Human Feedback (Optional but Recommended)
                </label>
                <textarea
                  value={humanFeedback}
                  onChange={(e) => setHumanFeedback(e.target.value)}
                  placeholder={`Add specific feedback for the LLM to focus on during refinement, for example:

• Q3 is too long, make it shorter
• Q8 has quantification (45%), remove specific numbers
• Add more COMPARE type questions
• Q5 and Q7 are on same topic, change Q7
• Make options more balanced in length
• Q10 should be Assertion-Reason format`}
                  className="w-full h-32 px-4 py-3 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-amber-700 mt-2">
                  This feedback will be prioritized over auto-detected errors in
                  the refinement prompt
                </p>
              </div>
            )}
          </div>
        )}

        {/* Existing Quiz Refinement Mode - Step 1: Excel/Text Input */}
        {quizMode === "refine" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-amber-200 border-l-4 border-l-amber-500">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Step 1: Paste Existing Quiz (Excel/Text)
            </h2>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-semibold mb-1">
                  How to Refine an Existing Quiz:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Select the module for your quiz</li>
                  <li>
                    Paste your existing questions (from Excel/spreadsheet)
                  </li>
                  <li>Add your human feedback (what to fix/improve)</li>
                  <li>Click &quot;Generate Refinement Prompt&quot;</li>
                  <li>AI will convert to JSON with your feedback applied</li>
                </ol>
              </div>
            </div>

            {/* Module Selection */}
            <div className="mb-6">
              <ModuleSelector
                selectedModule={module}
                showCustomInput={showCustomInput}
                customModule={customModule}
                onModuleChange={handleModuleChange}
                onCustomModuleChange={handleCustomModuleChange}
              />
            </div>

            {/* Existing Quiz Input - Excel/Text format */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Existing Quiz (Paste from Excel/Spreadsheet)
              </label>
              <textarea
                value={manualQuestions}
                onChange={(e) => setManualQuestions(e.target.value)}
                placeholder={`Paste your existing questions from Excel/spreadsheet:

Q1	What is the main benefit of RAG?	Reduces hallucinations	Faster training	Lower cost	Better UI	1
Q2	Which technique uses adapters?	LoRA	RAG	Prompting	Chunking	1

Or plain text:
1. What is overfitting? (Answer: When model memorizes training data)
2. Explain bias-variance tradeoff...

AI will convert to proper JSON format with your feedback applied.`}
                className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                {manualQuestions.trim().length} characters • Supports Excel TSV,
                CSV, or plain text
              </p>
            </div>

            {/* Human Feedback Input */}
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                🎯 Human Feedback (What to Fix/Improve)
              </label>
              <textarea
                value={humanFeedback}
                onChange={(e) => setHumanFeedback(e.target.value)}
                placeholder={`Describe what you want the AI to fix or improve:

• Q3 is too long, make it shorter
• Q8 has quantification (45%), remove specific numbers
• Add more COMPARE type questions
• Q5 and Q7 are on same topic, change Q7
• Make options more balanced in length
• Q10 should be Assertion-Reason format`}
                className="w-full h-32 px-4 py-3 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-amber-700 mt-2">
                Your feedback will be the TOP PRIORITY during conversion
              </p>
            </div>

            {/* Generate Prompt Button - Step 1 uses Manual Prompt */}
            <button
              onClick={handleGenerateManualPrompt}
              disabled={!manualQuestions.trim() || (!module && !customModule)}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                manualQuestions.trim() && (module || customModule)
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              Generate Conversion Prompt
            </button>
          </div>
        )}

        {/* Existing Quiz Refinement Mode - Step 2: Validate JSON */}
        {quizMode === "refine" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Step 2: Validate Converted JSON
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p>
                  After AI converts your questions to JSON, paste the result
                  here to validate.
                </p>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste the AI-generated JSON here for validation..."
              className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleValidate}
                disabled={!jsonInput.trim() || (!module && !customModule)}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  jsonInput.trim() && (module || customModule)
                    ? isValidating
                      ? "bg-yellow-600 text-white"
                      : "bg-green-600 text-white hover:bg-green-700"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isValidating ? "Validating..." : "Validate Quiz JSON"}
              </button>

              {validationResults && !validationResults.valid && (
                <button
                  onClick={handleGenerateRefinementPrompt}
                  className="px-6 py-3 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all"
                >
                  Generate Refinement Prompt
                </button>
              )}
            </div>

            {/* Human Feedback Input for Refinement when validation fails */}
            {validationResults && !validationResults.valid && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <label className="block text-sm font-semibold text-amber-800 mb-2">
                  🎯 Human Feedback for Re-Refinement (Optional)
                </label>
                <textarea
                  value={humanFeedback}
                  onChange={(e) => setHumanFeedback(e.target.value)}
                  placeholder={`Add specific feedback for the LLM to focus on:

• Q3 and Q5 have same topic - change Q5
• Q8 has quantification (45%), remove numbers
• Add more COMPARE type questions
• Make options more balanced in length`}
                  className="w-full h-32 px-4 py-3 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-amber-700 mt-2">
                  This feedback + validation errors will be included in the
                  refinement prompt
                </p>
              </div>
            )}
          </div>
        )}

        {/* Validation Results */}
        {validationResults && (
          <ValidationResults
            results={validationResults}
            previousErrorCount={previousErrorCount}
            showSuccessAnimation={showSuccessAnimation}
          />
        )}

        {/* Answer Distribution */}
        {validatedQuiz && (
          <AnswerDistribution
            quiz={validatedQuiz}
            shuffledQuiz={shuffledQuiz}
          />
        )}

        {/* Quiz Exporter */}
        {validatedQuiz && (
          <QuizExporter
            quiz={validatedQuiz}
            shuffledQuiz={shuffledQuiz}
            onShuffleQuiz={handleShuffleQuiz}
          />
        )}
      </div>
    </div>
  );
}
