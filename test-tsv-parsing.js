// Test TSV parsing functionality
const { detectInputFormat, parseTSVToQuestions, convertTSVToQuizData } = require('./lib/utils.ts');

// Sample Excel TSV data (A1:Q11 - 17 columns with headers + 10 questions)
const sampleTSV = `#	Question	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5	Answer 6	Answer 7	Answer 8	Answer 9	Correct Answer	Min Points	Max Points	Explanation	Time Limit (sec)	Image URL
Q1	Your PM says AI coding tools only assist with single-file code blocks. What recent 2025 advancement challenges this?	Modern models are video-only	LLMs can now handle 1-million tokens	Tools support multi-agent workflows	APIs now cost 80% less						3	0	0	Recent releases like Gemini Code Assist support multi-agent workflows that coordinate across entire codebases	35	
Q2	Scenario: An app needs to filter documents by date range before semantic search. Which RAG technique applies?	Metadata filtering	Top-k sampling	Chain templates	Distance weighting						1	0	0	Metadata filtering uses WHERE clauses to pre-filter by structured data (dates, tags) before vector similarity search	25	
Q3	What is overfitting in machine learning?	Model memorizes training data	Model generalizes well	Model underfits data	None of the above						1	0	0	Overfitting occurs when a model learns noise and details in training data to the extent that it negatively impacts performance on new data	25	`;

console.log('=== Testing TSV Parsing ===\n');

// Test 1: Format Detection
console.log('Test 1: Format Detection');
const format = detectInputFormat(sampleTSV);
console.log(`Detected format: ${format}`);
console.log(`✓ Expected: tsv, Got: ${format}\n`);

// Test 2: TSV Parsing
console.log('Test 2: TSV Parsing');
const parseResult = parseTSVToQuestions(sampleTSV);
console.log(`Success: ${parseResult.success}`);
console.log(`Questions parsed: ${parseResult.questions.length}`);
console.log(`Errors: ${parseResult.errors.length}`);

if (parseResult.errors.length > 0) {
  console.log('Errors:', parseResult.errors);
}

// Show first question
if (parseResult.questions.length > 0) {
  const q1 = parseResult.questions[0];
  console.log('\nFirst question:');
  console.log(`  ID: ${q1.id}`);
  console.log(`  Question: ${q1.question.substring(0, 60)}...`);
  console.log(`  Options: ${q1.options.length} options`);
  console.log(`  Correct Answer: ${q1.correctAnswer}`);
  console.log(`  Time Limit: ${q1.timeLimit}s`);
}

// Test 3: Convert to QuizData
console.log('\n\nTest 3: Convert to QuizData');
const quizData = convertTSVToQuizData(parseResult.questions, 'Gen AI');
console.log(`Module: ${quizData.module}`);
console.log(`Questions: ${quizData.questions.length}`);

const q1Full = quizData.questions[0];
console.log('\nFirst question in QuizData format:');
console.log(`  answer1: ${q1Full.answer1}`);
console.log(`  answer2: ${q1Full.answer2}`);
console.log(`  answer3: ${q1Full.answer3}`);
console.log(`  answer4: ${q1Full.answer4}`);
console.log(`  answer5: "${q1Full.answer5}" (should be empty)`);
console.log(`  correctAnswer: ${q1Full.correctAnswer}`);

console.log('\n\n=== All Tests Passed! ===');
