# Prompts

BurnRate uses LLMs in two specific places:

1. Workflow classification
2. Natural-language audit summaries

Importantly, the LLM is NOT responsible for:
- pricing calculations
- savings estimation
- recommendations
- deterministic audit logic

Those are fully rule-based.

This separation was intentional to avoid hallucinated financial outputs.

---

# 1. Workflow Classification Prompt

Used in:
```txt
classifier.service.js
```

Model:

```txt
llama-3.1-8b-instant (Groq)
```

---

## Full Prompt

```txt id="jlwm91"
You are an AI tool spend analyst. A user has described how their team uses AI tools.

User description: "${description}"
Tools they currently use: ${tools.join(", ")}

Based on this, classify their situation into EXACTLY this JSON format, nothing else:

{
  "useCase": "coding" | "writing" | "research" | "data" | "mixed",
  "requiredLevel": 1 | 2 | 3 | 4,
  "reasoning": "one sentence explanation"
}

Level guide:
1 = Basic tasks, occasional use, simple outputs
2 = Regular daily use, moderate complexity
3 = Heavy use, complex tasks, high output quality needed
4 = Mission critical, maximum capability required

Respond with valid JSON only. No markdown, no backticks, no explanation outside the JSON.
```

---

# Why This Prompt Was Written This Way

The classification system needed:

* predictable structure
* strict JSON
* low hallucination risk
* low latency

The most important design decision was forcing:

```txt
JSON only
```

Without this, smaller/open models frequently:

* wrapped responses in markdown
* added conversational explanations
* broke JSON parsing
* returned inconsistent labels

The strict schema significantly improved reliability.

I also intentionally limited:

```txt
allowed use cases
```

instead of allowing free-form categories.
This kept downstream audit logic deterministic and easier to reason about.

---

# What Didn't Work

## 1. Open-ended Classification

Early prompts asked:

```txt id="6mpwjlwm"
“What type of AI user is this team?”
```

This produced:

* inconsistent categories
* verbose explanations
* impossible-to-normalize outputs

Examples included:

* “software engineering”
* “technical writing”
* “creative workflows”
* “productivity”

which complicated the audit engine.

---

## 2. OpenRouter Models

Initially tried:

* OpenRouter free models
* Gemini free APIs

Problems:

* empty responses
* formatting inconsistency
* rate limits
* regional restrictions in India

Groq was significantly more stable.

---

# 2. Audit Summary Prompt

Used in:

```txt
summarizer.service.js
```

Purpose:
Generate a short personalized explanation of the audit findings.

---

## Full Prompt

```txt id="jlwm72"
You are a friendly but direct SaaS spend analyst writing a personalized audit summary.

Audit data:
- Primary use case: ${classification.useCase}
- Required capability level: ${classification.requiredLevel}/4
- Total monthly savings opportunity: $${totalMonthlySavings}
- Total annual savings opportunity: $${totalAnnualSavings}

Per tool findings:
${toolBreakdown}

Write a ~100 word personalized summary paragraph that:
1. Acknowledges what they're using AI for
2. Calls out the biggest savings opportunity specifically
3. Gives a clear action recommendation
4. Ends with the total savings number

Tone: direct, helpful, like a smart friend who knows finance. No fluff. No bullet points. One paragraph only.
```

---

# Why This Prompt Was Written This Way

The goal was:

* concise output
* human tone
* financially grounded language
* zero “AI assistant” style phrasing

Most default LLM outputs sounded:

* overly enthusiastic
* vague
* generic
* marketing-heavy

The phrase:

```txt id="jlwm63"
“like a smart friend who knows finance”
```

consistently produced the best tone balance.

I also explicitly prohibited:

* bullet points
* fluff
* multiple paragraphs

because early outputs tended to become:

* long consultant-style reports
* repetitive summaries
* generic productivity advice

---

# What Didn't Work

## 1. Letting the Model Generate Recommendations

Early experiments asked the LLM to:

* suggest savings opportunities
* identify cheaper tools
* calculate waste

This was abandoned quickly because:

* recommendations became inconsistent
* prices hallucinated
* outputs changed run-to-run
* identical inputs produced different savings estimates

That behavior is unacceptable for financial tooling.

The final architecture moved all calculations into deterministic backend logic.

---

## 2. Larger Multi-Step Prompts

Tried:

* chain-of-thought style prompts
* multi-step reasoning prompts
* detailed audit narratives

Problems:

* slower latency
* inconsistent formatting
* unnecessary token usage

For this product, short structured prompts worked significantly better.

---

# Final Prompting Philosophy

The final system intentionally uses LLMs narrowly.

LLMs are used where they are strong:

* summarization
* semantic classification
* natural language generation

LLMs are NOT used where determinism matters:

* pricing logic
* savings calculations
* business rules
* audit recommendations

This separation made the product:

* more reliable
* easier to debug
* cheaper to run
* easier to test
* safer for financial recommendations