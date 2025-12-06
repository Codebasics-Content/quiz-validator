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

type QuizMode = "ai" | "manual";

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

    if (results.valid && results.data) {
      setValidatedQuiz(results.data);
      setShuffledQuiz(null);
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
    } else {
      setValidatedQuiz(null);
      setShuffledQuiz(null);
    }

    setTimeout(() => setIsValidating(false), 300);
  };

  const handleGenerateRefinementPrompt = () => {
    setRefinementMode(true);
    setShowPrompt(true);
  };

  const handleGenerateManualPrompt = () => {
    setShowPrompt(true);
    setRefinementMode(false);
  };

  const getPromptContent = (): string => {
    const selectedModule = showCustomInput ? customModule : module;

    // Manual mode with user-collected questions
    if (quizMode === "manual" && manualQuestions.trim()) {
      return getManualQuestionAssistPrompt(selectedModule, manualQuestions);
    }

    // Refinement mode for AI-generated quiz with errors
    if (refinementMode && validationResults && jsonInput) {
      try {
        // Use same extraction logic as main validation to handle markdown fences
        const cleanedJSON = extractJSONFromLLMOutput(jsonInput);
        const existingQuiz = JSON.parse(cleanedJSON);
        return getRefinementPrompt(
          selectedModule,
          existingQuiz,
          validationResults.errors,
          validationResults.warnings,
        );
      } catch (e) {
        // JSON is completely broken - generate syntax fix prompt instead
        const errorMsg = e instanceof Error ? e.message : "Unknown parse error";
        const cleanedJSON = extractJSONFromLLMOutput(jsonInput);
        return getJSONSyntaxFixPrompt(selectedModule, cleanedJSON, errorMsg);
      }
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
            Quiz Creation Mode
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
              AI-Generated Quiz
            </button>
            <button
              onClick={() => setQuizMode("manual")}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                quizMode === "manual"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Manual Entry
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {quizMode === "ai"
              ? "Generate quiz using AI with system prompts"
              : "Manually enter questions one by one with guided assistance"}
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
          </div>
        )}

        {/* Manual Mode: User-Collected Questions */}
        {quizMode === "manual" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Step 1: Paste Your Collected Questions
            </h2>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-700">
                <p className="font-semibold mb-1">Manual Mode Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Select the module for your questions</li>
                  <li>Paste your collected questions below (any format)</li>
                  <li>Click "Generate Assist Prompt" to format them</li>
                  <li>
                    AI will preserve your questions and add missing ones if
                    needed
                  </li>
                </ol>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ModuleSelector
                selectedModule={module}
                showCustomInput={showCustomInput}
                customModule={customModule}
                onModuleChange={handleModuleChange}
                onCustomModuleChange={handleCustomModuleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Collected Questions
              </label>
              <textarea
                value={manualQuestions}
                onChange={(e) => setManualQuestions(e.target.value)}
                placeholder={`Paste your questions here in any format, for example:

1. What is overfitting in machine learning?
2. Explain the difference between supervised and unsupervised learning
3. How does cross-validation work?

Or:

- Question: What is regularization?
  Answer: L1/L2 penalty to prevent overfitting
- Question: What is batch normalization?
  ...

The AI will format them properly and generate missing questions to reach 10 total.`}
                className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono"
              />
              <p className="text-xs text-slate-500 mt-2">
                {manualQuestions.trim().length} characters • AI will preserve
                your exact questions
              </p>
            </div>

            <button
              onClick={handleGenerateManualPrompt}
              disabled={!manualQuestions.trim() || (!module && !customModule)}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                manualQuestions.trim() && (module || customModule)
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              Generate Assist Prompt for Your Questions
            </button>
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
            onShuffleQuiz={setShuffledQuiz}
          />
        )}
      </div>
    </div>
  );
}
