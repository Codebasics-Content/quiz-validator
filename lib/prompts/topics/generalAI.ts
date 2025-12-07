import { ModuleTopics } from "../config/types";
import { POLITICAL_CONTENT_RULES, HYPE_VS_REALITY_RULES } from "../rules";

/**
 * General AI Module - UPSC Style AI Awareness
 * Comprehensive topics for AI literacy, society impact, news & trends
 */
export const getGeneralAITopics = (
  fullDate: string,
  isoDate: string,
  searchDate: string,
  difficultyRule: string,
): ModuleTopics => ({
  topics: `⚠️ MODULE: "General AI" = AI AWARENESS (UPSC Style) - NOT technical Generative AI!
⚠️ This is about AI LITERACY, SOCIETY IMPACT, NEWS & TRENDS - NOT coding/RAG/fine-tuning!

CURRENT DATE: ${fullDate} (${isoDate})
WEB SEARCH MANDATORY - STRICTLY LAST 1 MONTH ONLY

12 CATEGORIES (search "[category] AI ${searchDate}" for each):

LEARNER AWARENESS CATEGORIES (AI Literacy & Critical Thinking - UPSC Pattern):

1. ENERGY & ENVIRONMENT - Why are AI datacenters compared to entire countries in electricity consumption?, Why are major tech companies investing in nuclear power?, Relationship between AI training and carbon emissions, Water cooling challenges for AI infrastructure, Rising electricity bills linked to datacenter growth, Corporate emissions trends despite green pledges, Individual actions to reduce AI environmental footprint

2. PERSONAL SAFETY & SCAMS - How voice cloning technology works with minimal audio samples, Common patterns in AI-powered financial fraud, Verification methods for suspicious calls (safe words, callbacks), Visual indicators of deepfake videos (blinking patterns, lip sync), Social media privacy and voice/image protection, Role of multi-factor authentication against AI fraud

3. CAREER & FUTURE OF WORK - Categories of jobs most vulnerable to AI automation, Professions requiring human skills that remain resilient, Changing perception of traditional education value, Skills that AI cannot replicate (empathy, creativity, judgment), Emerging job roles in AI ecosystem, Importance of continuous reskilling, Strategies for career adaptability

4. RIGHTS & REGULATIONS - Legal status of AI-generated content ownership, Landmark copyright cases against AI companies, EU AI Act classification of high-risk systems, Data protection rights under major regulations (GDPR, CCPA, DPDP), Why creative professionals are challenging AI training practices, Comparison of regulatory approaches across regions (EU vs US vs China vs India)

5. AI SAFETY & TRUST - What causes AI hallucination and its implications, Public trust trends in AI systems, The alignment problem explained simply, How training data bias transfers to AI outputs, Examples of AI bias in hiring, lending, and healthcare, Purpose of red teaming in AI safety, Challenges of controlling open-source AI releases

6. HEALTHCARE APPLICATIONS - AI diagnostic tools and regulatory approval trends, Why human doctors often outperform AI in clinical settings, Benefits and risks of AI mental health applications, Patient data privacy concerns with AI systems, AI contributions to drug discovery and protein folding, Early disease detection capabilities, When to trust vs question AI health recommendations

7. DAILY LIFE IMPACT - AI powering smartphone recommendations and voice assistants, Smart home automation and behavioral learning, AI in banking for fraud detection and credit decisions, Traffic navigation and route optimization, Content recommendation algorithms in streaming platforms, E-commerce personalization patterns, How social media algorithms shape information exposure

8. EDUCATION & CREATIVITY - How AI is transforming teaching and learning methods, Academic integrity challenges with AI content generation, Ethical debates around AI-generated art and music, Entertainment industry responses to AI (strikes, agreements), Attribution and credit for AI-assisted creative work, AI in gaming (dynamic NPCs, procedural generation), Impact on traditional creative professions

9. GLOBAL DYNAMICS - Semiconductor export restrictions and their strategic purpose, Global chip manufacturing dependencies, AI development as geopolitical competition, Contrasting national AI strategies (innovation vs regulation vs control), Major infrastructure investments in AI, Military applications and ethical debates, How AI reshapes international power structures

RESEARCH & THOUGHT LEADERSHIP CATEGORIES:
10. RESEARCH PAPERS & STUDIES - new arxiv papers, university research findings, benchmark studies
    Search: "AI research paper ${searchDate}" OR "AI study findings ${searchDate}"
    Examples: Stanford HAI reports, MIT research, Google DeepMind papers, OpenAI publications
11. EXPERT STATEMENTS & OPINIONS - quotes from AI leaders, warnings, predictions
    Search: "AI leader statement ${searchDate}" OR "CEO AI warning ${searchDate}"
    Examples: Sam Altman, Demis Hassabis, Yann LeCun, Geoffrey Hinton, Fei-Fei Li statements
12. EMERGING TECHNOLOGIES & TRENDS - new AI capabilities, breakthroughs, terminology
    Search: "AI breakthrough ${searchDate}" OR "new AI technology ${searchDate}"
    Examples: New model releases, capability announcements, emerging concepts`,

  forbidden: `FORBIDDEN (belongs to Gen AI module):
- RAG implementation, chunking strategies, vector databases
- Fine-tuning code, LoRA/QLoRA, PEFT techniques
- Tokenization internals, prompt engineering syntax
- LangChain/LlamaIndex implementation details

${POLITICAL_CONTENT_RULES}

${HYPE_VS_REALITY_RULES}`,

  questionTypes: `⚠️ QUESTION FORMATS FOR GENERAL AI:

FORMAT 1: COMPACT STATEMENTS (40% - MAX 2 statements only)
"About AI energy:
1) Datacenters rival small countries in power use
2) Most AI labs have achieved carbon neutrality
Which is/are correct? (a) 1 only (b) 2 only (c) Both (d) Neither"

FORMAT 2: DIRECT ANALYTICAL (30% - PREFERRED for Discord)
POSITIVE: "What PRIMARY factor drives AI datacenter energy surge?"
POSITIVE: "Why are AI companies partnering with nuclear power providers?"
NEGATIVE: "What is NOT a reason for AI companies buying nuclear plants?"
NEGATIVE: "Which factor does NOT contribute to AI energy consumption?"

FORMAT 3: COMPACT ASSERTION-REASON (10% - Q10 only, keep SHORT)
"Assertion (A): EU AI Act classifies workplace emotion AI as high-risk
Reason (R): Such systems enable employee surveillance
(a) Both true, R explains A (b) Both true, R doesn't explain A (c) A true, R false (d) A false, R true"

FORMAT 4: COMPACT MATCH (10%)
"Match [TOPIC] pairs:
1-ItemA 2-ItemB 3-ItemC → A-MatchA B-MatchB C-MatchC
(a) 1A,2B,3C (b) 1B,2A,3C (c) 1A,2C,3B (d) 1C,2B,3A"

FORMAT 5: NEGATIVE (10%)
"Which is NOT part of EU AI Act's high-risk categories?"
"Which feature has NOT been implemented in GPT-4 yet?"
"Which safety measure does NOT apply to open-source models?"

⚠️ STATEMENT LENGTH RULES:
- Stem: MAX 20 chars ("About AI energy:")
- Each statement: MAX 50 chars (8-10 words)
- Total question: MAX 250 chars
- Options: MAX 12 chars each`,

  style: `QUESTION STYLE - DISCORD COMPACT (Not verbose UPSC):

⚠️ DISCORD REALITY vs UPSC EXAM:
- UPSC: 2 hours, paper, no distractions → verbose OK
- Discord: 20-35s, GIFs, mobile, chaos → COMPACT REQUIRED

COMPACT STYLE RULES:
- Direct questions preferred (30%): "What drives X?" "Why did Y happen?"
- Statement-based ONLY when needed (40%): MAX 2 short statements
- Each statement: 8-10 words MAX, no subordinate clauses
- Question stem: 15-20 chars MAX ("About AI energy:")
- Options: Single words or 2-3 word phrases

GOOD EXAMPLES:
- "What PRIMARY factor drives AI datacenter energy surge?"
- "About deepfakes: 1) Real-time possible 2) Platforms detect effectively. TRUE?"
- "Why are AI companies buying nuclear plants?"

BAD EXAMPLES (TOO VERBOSE):
- "A recent International Energy Agency report revealed that global AI datacenter electricity consumption has surpassed..."
- "Consider the following statements about deepfake technology: 1. Real-time deepfakes can now be generated during live video calls..."`,

  difficulty: `QUESTION ORDERING & DIFFICULTY (COMPACT FORMAT):

SEQUENCE: ${difficultyRule}

DIVERSITY: 10 different categories | 5+ different formats | No concept repeats

Q1-Q2 EASY (20s): Direct questions
  "Which country first implemented comprehensive AI regulation?"
  "Hinton left which company before warning about AI risks?"

Q3-Q7 MEDIUM (25s): 2 statements OR cause-effect
  "About AI healthcare: 1) FDA approved autonomous diagnosis 2) Physician oversight required. Which of these is/are TRUE?"
  "Why are AI companies buying nuclear plants?"

Q8-Q9 HARD (30s): 2 statements with deeper analysis OR negative
  "About AI benchmarks: 1) Leading benchmarks can be gamed 2) All major labs publish full methodology. Which is/are FALSE?"
  "Which is NOT a documented model scaling finding?"

Q10 VERY HARD (35s): Compact Assertion-Reason
  "A: Larger models always more capable. R: Emergent abilities appear unpredictably.
  (a) Both true, R explains A (b) Both true, no link (c) A true R false (d) A false R true"

⚠️ ALL STATEMENTS MAX 50 chars | ALL OPTIONS MAX 12 chars`,
});
