# ClearTerms-AI

A focused, production-ready way to turn dense Terms & Conditions into **clear, actionable understanding**. Users can **import** PDFs/DOCX/plain text/URLs, get a tight bullet summary of what matters, see risk indicators, and ask grounded questions — all powered by **serverless AI** that runs on demand with zero long-running infrastructure.

---

**Live:** [https://clearterms-ai.vercel.app](https://clearterms-ai.vercel.app)  
_Deployed on Vercel with on-demand serverless AI._

## What it delivers

-   **Instant, plain-English summary**  
    Compact bullets that surface the essentials: permissions and restrictions, pricing and fees, disclaimers, termination, governing law, privacy/data handling, IP, and AI/model-training language.

-   **Ask anything (grounded)**  
    User questions answered strictly from the provided document; if the fact isn’t present, the response states that it’s not in the text.

-   **Risk indicators**  
    Deterministic tags (low/medium/high) for patterns like arbitration, class-action waiver, indemnification, limitation of liability, auto-renewal, price changes, broad licenses, data sharing/retention, biometrics, and more.

-   **Reading efficiency**  
    Word count, estimated read time, and “time saved” versus reading the entire document.

-   **Flexible import**  
    PDF (pdf.js worker), DOCX (mammoth), raw text, or URL (HTML → text), with robust clean-up to reduce noise before modeling.

---

## How it works (expanded)

1. **Import**

    - Accepts PDF/DOCX/text/URL.
    - URLs: strip HTML/scripts/styles and keep visible text.
    - Files: extract raw text (pdf.js/mammoth).

2. **Normalize & pre-clean**

    - Unicode normalization; de-hyphenation across line breaks.
    - Remove list/heading tokens at line starts (e.g., `3.1`, `(A)`, `iv.`).
    - Drop cross-references and admin noise (URLs, VAT, addresses).
    - Stitch sentence continuations into full sentences.
    - Enforce a size cap for responsive requests.

3. **Chunking for AI**

    - Split into ~8k-character chunks with 300-character overlap.

4. **Serverless AI: Summary**

    - The frontend calls a serverless function that invokes **Gemini 2.5 Flash** with a strict, JSON-only prompt.
    - If the model output is malformed/empty, deterministic fallbacks convert sentences into bullets so users still get a result.
    - UI capitalizes the first character on display/export for polish (source data remains untouched).

5. **Risk pass (deterministic)**

    - Regex rules run against bullets to attach risk labels and a top severity.
    - No LLM involved — fast and predictable.

6. **Serverless AI: Grounded Q&A**

    - Simple retrieval ranks relevant chunks and builds a focused context window.
    - Gemini is invoked in a serverless function to answer **only when supported by that context**; otherwise it clearly notes the information isn’t in the document.
    - Responses are concise and tied to the provided text.

7. **Client-side UX & persistence**
    - Summaries are cached locally for a smoother experience.
    - Export to TXT/Markdown with display-level capitalization.

---

## Serverless AI calls

-   **Each AI action is an isolated function call**

    -   Analyze → function invokes Gemini and returns JSON.
    -   Ask → function performs lightweight retrieval + Gemini and returns a compact answer.

-   **Operational benefits**
    -   Scales automatically with concurrent users.
    -   Usage-based execution (no idle processes).
    -   Secrets (API keys) remain server-side in environment variables.
    -   Same-origin `/api/...` calls — no CORS overhead.

---

## Tech highlights (expanded)

-   **UI/UX**

    -   React + Vite with a clean, responsive interface.
    -   Display-level capitalization for consistent style without mutating data.
    -   Reading stats and time-saved metrics.

-   **Text import**

    -   pdf.js worker via Vite worker URL (stable in dev/prod).
    -   mammoth for robust DOCX → text.
    -   URL fetch with HTML stripping and safe fallbacks.

-   **Pre-processing**

    -   Targeted clean-up: token/heading removal, cross-ref stripping, sentence stitching, whitespace tidy.
    -   Size limits keep LLM calls snappy.

-   **LLM usage**

    -   **Gemini 2.5 Flash** for summary & Q&A (low latency, temperature 0).
    -   Strict prompts; JSON for summaries.
    -   Post-processing and layered fallbacks to avoid empty/invalid outputs.

-   **Retrieval for Q&A**

    -   Fast, dependency-light scoring that blends approximate semantics with lexical overlap.
    -   No external databases; computed on the fly before each call.

-   **Risk tagging**

    -   Pure regex rules with curated patterns and category notes.
    -   Consistent low/med/high signals without model variability.

-   **Security & privacy**
    -   API key lives only in serverless environment variables; never exposed to the client.
    -   No server-side persistence of user content.
    -   Clear in-app notice that results are assistive.

---

## Deployment

Hosted on **Vercel**, with AI calls executed via **serverless functions** at `/api/...`.

-   The AI key is stored as a deployment environment variable and isn’t exposed in the browser.
-   Deployments can be triggered from the Vercel CLI or dashboard; a primary domain serves the current production build.
-   Client-side routing supports direct reloads on routes like `/ask` and `/summary`.

---

## Local development (quick)

```bash
npm i
npm i -g vercel
vercel login
vercel link
vercel env add GOOGLE_API_KEY development
npm run vercel:dev
# open http://localhost:3000 and http://localhost:3000/api/health

```

> In production, a SPA catch-all rewrite enables deep links like `/ask` or `/summary` on reload. In local dev, a dev-specific config omits that rewrite so Vite’s assets load correctly.

---

## User flow

1. Upload / Paste / URL → **Analyze**
2. Review the **AI Summary** and risk labels
3. **Ask** follow-up questions to drill into specifics
4. **Export** the summary (TXT/Markdown) if needed

---

## Note

ClearTerms-AI is designed to help you understand documents; it isn’t a substitute for legal advice.

```

```
