## Day 1 — 2026-05-07
- **Hours worked:** 0
- **What I did:** Had university exams, could not begin the assignment
- **What I learned:** —
- **Blockers / what I'm stuck on:** Exams
- **Plan for tomorrow:** Begin immediately — project setup, planning, research

## Day 2 — 2026-05-08
- **Hours worked:** 3
- **What I did:** Finalized tech stack decision — React (Vite) + Node/Express + Supabase + Resend. Chose plain JavaScript over TypeScript given the time constraint and will justify in ARCHITECTURE.md. Decided against Next.js despite it being the "obvious" choice because my existing React + Express familiarity allows faster iteration. Did full system design — mapped out data flow from form input → audit engine → results page → lead capture → shareable URL. Sketched the folder structure for both client and server. Initialized the project, set up Express with a health check route, created all required documentation stub files at repo root, pushed to GitHub.
- **What I learned:** The shareable URL feature requires OG tag injection server-side — Express will need to serve a meta-tag shell for share URLs rather than relying purely on client-side React. 
Planned accordingly.
- **Blockers / what I'm stuck on:** Need to nail down exact audit engine logic on paper before touching the form — building form inputs without knowing exactly what the engine needs risks a refactor later.
- **Plan for tomorrow:** Research and lock current pricing for all 8 tools, write PRICING_DATA.md, design audit rules on paper, begin auditEngine.js and spend input form simultaneously.

## Day 3 — 2026-05-09
- **Hours worked:** 0
- **What I did:** Had university exams, could not work on the assignment 
- **What I learned:** —
- **Blockers / what I'm stuck on:** Exams
- **Plan for tomorrow:** Same as yesteday

## Day 4 — 2026-05-10
- **Hours worked:** 1
- **What I did:** Still had university exams running this week which limited available time. However managed to squeeze in time late tonight — initialized the Vite React app in the client folder, installed dependencies (react-router-dom, axios, tailwindcss), set up basic routing structure with placeholder pages for Home and Results. Committed to GitHub to maintain build momentum.
- **What I learned:** Even small progress daily matters more than large bursts — the git history tells its own story.
- **Blockers / what I'm stuck on:** Exams end tomorrow. Full focus from Day 5 onwards.
- **Plan for tomorrow:** Exams finish. Full day session — spend input form complete with localStorage, audit engine first draft, pricing research for all 8 tools.

## Day 5 — 2026-05-11

**Hours worked:** 8

**What I did:**
- Built the entire backend audit pipeline today. Started with the audit engine data layer — researched and verified pricing for all 10 tools (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, v0, Lovable, Anthropic API, OpenAI API) and wrote PRICING_DATA.md with verified vendor URLs. Built TOOLS_DATA structure in utils/toolsData.js with plans, seat limits, capability levels and alternatives for each tool.
- Built the three-component audit pipeline:
  - Component 1 (classifier.service.js): Classifies user's use case and required capability level from free-text description using 
  Groq API (llama-3.1-8b-instant). Keyword fallback if API fails.
  - Component 2 (auditEngine.service.js): Runs three rules against each tool — seat waste detection, plan downgrade opportunities, and wrong tool for use case. Returns per-tool recommendations with savings amounts and reasoning.
  - Component 3 (summarizer.service.js): Takes audit result object and generates a ~100 word personalized summary via Groq API. Templated fallback if API fails.
- Wired everything together in audit.controller.js and audit.router.js. Tested via Postman — pipeline correctly caught Claude Team seat waste (3 ghost seats, $60/mo wasted) and Cursor Business wrong-tool recommendation. AI summary generating accurately with specific numbers.

**What I learned:**
- Groq is significantly more reliable than OpenRouter for free tier 
inference in India. Also learned that the audit engine rules need 
to be carefully ordered — wrong_tool rule should only fire when 
there's actual cost savings, not just a "better fit" tool that 
costs the same or more.

**Blockers / what I'm stuck on:**
- Hit API issues along the way — Anthropic API needed credits, Gemini blocked in India, OpenRouter free models returning empty responses. Settled on Groq which is free, fast, and reliable.
- Keyword classifier is a fallback when Groq fails — it works but isn't as nuanced as the AI version. For now acceptable since Groq is reliable.

**Plan for tomorrow:**
- Spend input form on frontend with localStorage persistence
- Results page with savings hero and per-tool breakdown
- Supabase setup for saving audits
- Shareable URLs
- Deploy on Render + Vercel
- CI/CD with GitHub Actions
- All documentation