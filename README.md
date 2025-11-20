# Quiz Validator & Generator - Next.js 15

A comprehensive Next.js application for generating AI-powered quiz prompts and validating quiz JSON for bootcamp Discord bots.

## Features

- **Module Selection**: Choose from predefined modules or create custom modules
- **LLM Provider Support**: Generate prompts for Claude, ChatGPT, or Gemini
- **JSON Validation**: Comprehensive validation with detailed error reporting
- **Answer Distribution Analysis**: Prevent student pattern exploitation
- **Quiz Shuffling**: Randomize answer positions for security
- **Excel Export**: Copy quiz data directly to Excel spreadsheets
- **Refinement Prompts**: Generate prompts to fix validation errors

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Architecture**: Component-based with modular design

## Project Structure

```
quiz-validator-nextjs/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   └── quiz/
│       ├── ModuleSelector.tsx           # Module selection component
│       ├── LLMProviderSelector.tsx      # LLM provider selection
│       ├── PromptDisplay.tsx            # Prompt display component
│       ├── ValidationResults.tsx        # Validation results display
│       ├── AnswerDistribution.tsx       # Answer distribution analysis
│       └── QuizExporter.tsx             # Quiz export functionality
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── constants.ts        # Application constants
│   ├── utils.ts            # Utility functions
│   └── prompts.ts          # Prompt generation logic
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Usage

1. **Select Module**: Choose a predefined module or create a custom one
2. **Choose LLM Provider**: Select Claude, ChatGPT, or Gemini
3. **Generate Prompt**: Click to generate a system prompt
4. **Copy Prompt**: Use the generated prompt with your LLM
5. **Paste JSON**: Paste the LLM's JSON output
6. **Validate**: Click validate to check for errors
7. **Fix Errors**: Use refinement prompts if validation fails
8. **Export**: Copy validated quiz to Excel

## Components

### ModuleSelector
Allows selection from predefined modules or custom module input.

### LLMProviderSelector
Choose between Claude, ChatGPT, and Gemini for prompt generation.

### PromptDisplay
Displays the generated system prompt with copy functionality.

### ValidationResults
Shows validation status, errors, and warnings with improvement tracking.

### AnswerDistribution
Analyzes correct answer distribution to prevent pattern exploitation.

### QuizExporter
Provides quiz shuffling and Excel export functionality.

## Validation Rules

- **Question Length**: 30-200 characters
- **Option Length**: 15-70 characters
- **Option Balance**: ±5 character difference
- **Explanation**: 12-18 words
- **Time Limit**: 15-60 seconds
- **Answer Distribution**: Each position 1-4 times

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/quiz-validator)

#### Quick Deploy Steps:

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy with CLI**:
```bash
cd quiz-validator
vercel
```

3. **Or Deploy via Git**:
   - Push your code to GitHub
   - Import project in [Vercel Dashboard](https://vercel.com/dashboard)
   - Vercel auto-detects Next.js configuration
   - Deploy automatically on every push

#### Configuration:

The project includes `vercel.json` with optimized settings:
- **Region**: US East (iad1) - change in vercel.json if needed
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js**: 18.x
- **Security Headers**: Enabled (XSS, Frame Options, Content Type)

#### Environment Variables:

No environment variables required for MVP deployment. The app runs entirely client-side.

#### Custom Domain:

Add custom domain in Vercel Dashboard → Project Settings → Domains

### Alternative Deployment Options

- **Netlify**: Use `netlify.toml` (Next.js support)
- **AWS Amplify**: Connect GitHub repo
- **Docker**: Build with `node:18-alpine`

## License

MIT
