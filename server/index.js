import "dotenv/config";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

if (!GOOGLE_API_KEY) {
    console.error("Missing GOOGLE_API_KEY in environment.");
    process.exit(1);
}

const app = express();
app.use(express.json({ limit: "10mb" }));
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const SUMMARIZE_MODEL = "gemini-2.5-flash";
const QA_MODEL = "gemini-2.5-flash";

function fallbackFromText(text, want = 5) {

    const sentences = String(text).replace(/\s+/g, " ").match(/[^.!?]+[.!?]/g) || [];
    return sentences
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, want)
        .map((s) => (/[.?!]$/.test(s) ? s : s + "."));
}

function stitchContinuations(lines) {
    const out = [];
    for (let raw of lines) {
        let l = raw.trim();

        l = l.replace(/^\(?[A-G]\)\s*/i, "");


        l = l.replace(/\(defined in Section[^)]+\)/gi, "");
        l = l.replace(/\s*\(?(https?:\/\/[^\s)]+)\)?/gi, "");

        const prev = out[out.length - 1];
        const prevEnds = prev ? /[.?!]"?$/.test(prev) : true;

        const looksContinuation =
            /^([a-z].{0,120}|and\b|or\b|but\b|including\b|such as\b|subject to\b|provided that\b)/i.test(l);

        if (prev && !prevEnds && looksContinuation) {
            out[out.length - 1] = (prev + " " + l).replace(/\s{2,}/g, " ").trim();
        } else {
            out.push(l);
        }
    }
    return out;
}

function preForModel(text) {
    return String(text || "")
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => {

            let s = line.replace(
                /^[\s\u00A0]*(?:\d+(?:\.\d+)*\s*\([A-Za-z]\)|\d+(?:\.\d+)*|\([A-Za-z]\)|\d+\))\s*[.)-]?\s+/,
                ""
            );

            const letters = s.replace(/[^A-Za-z]+/g, "");
            const caps = (letters.match(/[A-Z]/g) || []).length;
            const isAllCapsShort =
                letters && caps / letters.length > 0.9 && s.split(/\s+/).length <= 8;
            if (isAllCapsShort) return "";


            if (/^\s*(?:\d+|[A-Za-z])\.?\s*$/.test(s)) return "";
            return s.trim();
        })
        .filter(Boolean)
        .join("\n");
}

function cleanBullets(raw, want = 7) {
    let lines = (Array.isArray(raw) ? raw : String(raw).split(/\n+/))
        .map((l) => l.trim())
        .filter(Boolean);

    lines = lines
        .map((l) => l.replace(/^[\s\t\u00A0]*(?:[-*•\u2022])+[\s]+/g, ""))
        .map((l) => l.replace(/^[\s\t\u00A0]*\([A-Za-z]\)[,.)\s-]*/, ""))
        .map((l) =>
            l.replace(/^[\s\t\u00A0]*(?:\(?[a-z]\)|[a-z]\)|\(?[ivxlcdm]+\)|[ivxlcdm]+\.)[\s-]+/i, "")
        )
        .map((l) => l.replace(/^[\s\t\u00A0]*(?:\(?\d+(?:\.\d+)*\)?[.)]?)[\s-]+/i, ""))
        .map((l) => l.replace(/^[\s\t\u00A0]*\d+(?:\.\d+)*\s*\([A-Za-z]\)[,.)\s-]*/, ""))
        .map((l) =>
            l.replace(/\bunder\s+this\s+clause\s*\d+(?:\.\d+)*\s*\([A-Za-z]\)\s*[,.)-]*/i, "")
        )
        .map((l) => l.replace(/^(?:section|clause)\s*\d+(?:\.\d+)*\s*\([A-Za-z]\)\s*[:,\s-]*/i, ""))
        .map((l) => l.replace(/\s*\(\s*(?:see|section)\s*[\d.]+\s*\)/gi, ""))
        .map((l) => l.replace(/\s{2,}/g, " ").trim());

    lines = stitchContinuations ? stitchContinuations(lines) : lines;
    lines = lines.map((l) => l.replace(/\s*\(\s*[A-G]\s*\)\s*/g, " "));
    lines = lines.map((l) => l.replace(/^[\s\u00A0]*\d+(?:\.\d+)*[.)-]?\s+/, ""));
    lines = lines.map((l) => l.replace(/^[“"']+|[”"']+$/g, ""));

    const ADMIN =
        /\b(about\s+us|contact(?:ing)?\s+us|registered\s+office|company\s*(?:number|no\.?)|vat(?:\s*number)?|general\s+counsel|address|street|road|avenue|campus|suite|postcode|zip|email|phone|tel\.?|fax)\b/i;
    lines = lines.filter((l) => !ADMIN.test(l));

    lines = lines.filter((l) => !/^\s*(?:\d+|[A-Za-z])\.?\s*$/.test(l));

    const VERB =
        /\b(shall|must|may|will|agree|grant|assign|license|collect|use|scan|review|process|store|share|disclose|pay|charge|provide|notify|restrict|prohibit|limit|retain|own|display|perform|distribute|reproduce|comply|terminate|suspend|warrant|disclaim|indemnif|governed|jurisdiction)\b/i;
    const ALLOW_SHORT = /^(No|Not|Never)\b/i;
    function isHeadingLike(l) {
        const words = l.split(/\s+/);
        const caps = words.filter((w) => /^[A-Z][A-Za-z'-]+$/.test(w)).length;
        if (/:$/.test(l)) return true;
        if (words.length <= 6 && caps >= Math.ceil(words.length * 0.7)) return true;
        if (!VERB.test(l) && !ALLOW_SHORT.test(l)) return true;
        return false;
    }
    lines = lines.filter((l) => !isHeadingLike(l));

    lines = lines
        .map((l) => l.replace(/[;,]\s*$/g, ""))
        .map((l) => (/[.?!"]$/.test(l) ? l : l + "."))
        .map((l) => l.replace(/\s+\./g, "."))
        .map((l) => l.replace(/\.{2,}$/g, "."))
        .filter((l) => l.length >= 20 && l.length <= 400);


    const seen = new Set();
    lines = lines.filter((l) => {
        const k = l.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });

    return lines.slice(0, want);
}

app.post("/api/gemini/summarize", async (req, res) => {
    try {
        const raw = String(req.body?.text || "").trim();
        if (!raw) return res.status(400).json({ bullets: [] });

        const input = preForModel(raw);

        const model = genAI.getGenerativeModel({ model: SUMMARIZE_MODEL });

        const prompt = [
            "You are a legal summarizer.",
            "Task: produce 6–7 short, plain-English bullets as JSON.",
            "",
            "HARD RULES:",
            "- Each bullet MUST be exactly ONE self-contained sentence (no line breaks).",
            "- Each bullet MUST start with an UPPERCASE letter (A–Z) or a numeral; NEVER start with a lowercase letter.",
            "- DO NOT include headings, titles, or fragments like 'Disclaimers of Warranties' or 'Using the Site'.",
            "- DO NOT include any section numbers, letters, or citations (e.g., '3(A)', 'Section 4.1', '(see 4.3)').",
            "- Source text may start with numbering like '9.', '9.1', '(A)', or '3(A)': ignore all such numbering.",
            "- Fold lettered/numbered sub-items ((A)–(G), 1.2.3) into the sentence in natural language.",
            "- Remove parentheticals that are just references (e.g., '(defined in Section 4.1)') and remove URLs/emails/addresses/VAT/company registry info.",
            "- No quotes, no leading list markers, no trailing punctuation artifacts; output plain sentences.",
            "- Avoid duplicates or near-duplicates; combine closely related points rather than repeating them.",
            "- Each bullet should be between 40–200 characters.",
            "- Paraphrase faithfully; do NOT invent rules or expand beyond what is stated.",
            "- If the passage is purely administrative (about-us, contact blocks, addresses, VAT, company numbers) and contains no obligations/rights, return an empty array.",
            "",
            "WHAT TO PRIORITIZE (only if present in the text):",
            "- obligations, restrictions, and permitted uses;",
            "- rights/licenses (scope, exclusivity, revocability, sublicensing);",
            "- privacy/scanning distinctions (local vs. cloud), analytics/opt-out, human review conditions;",
            "- AI/model-training prohibitions/allowances;",
            "- IP ownership/assignments; fees/payment/indemnities/disclaimers/liability limits;",
            "- termination/suspension; governing law/jurisdiction; notices/consents; cross-border transfers; DPAs; sensitive-data limits.",
            "",
            "OUTPUT FORMAT:",
            'Return ONLY valid JSON with this exact schema and nothing else: {"bullets":["..."]}',
            "",
            "Example Input:",
            "1 About us",
            "We are ACME Ltd, VAT 123...",
            "3 Using the Site",
            "(A) You may view content for private use.",
            "(B) Do not reverse engineer.",
            "Governing law: England.",
            "",
            "Example Output (JSON):",
            '{\"bullets\":[',
            '\"You may view site content for private, non-commercial use.\",',
            '\"You must not reverse engineer the services or software.\",',
            '\"This agreement is governed by the law of England.\"',
            "]}",
            "",
            "Now summarize this text:",
            "'''",
            input,
            "'''"
        ].join("\\n");

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 512,
                responseMimeType: "application/json",
            },
        });

        const out = (result.response.text() || "").trim();

        let bullets = [];
        try {
            const parsed = JSON.parse(out);
            if (parsed && Array.isArray(parsed.bullets)) bullets = parsed.bullets;
        } catch {

        }

        if (!bullets.length) {
            bullets = cleanBullets(out.split(/\n+/), 6);
            if (!bullets.length) {
                const fb1 = fallbackFromText(out, 8);
                bullets = cleanBullets(fb1, 6);
                if (!bullets.length) {
                    const fb2 = fallbackFromText(input, 8);
                    bullets = cleanBullets(fb2, 6);
                }
            }
        }

        return res.json({ bullets });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ bullets: [], error: "summarize_failed" });
    }
});

app.post("/api/gemini/ask", async (req, res) => {
    try {
        const q = String((req.body && req.body.question) || "").trim();
        const ctx = String((req.body && req.body.context) || "").trim();
        if (!q || !ctx) return res.json({ answer: "Not found in the provided text." });

        const model = genAI.getGenerativeModel({ model: QA_MODEL });
        const sys =
            "Answer ONLY from the provided context. If the answer is not present, reply exactly: 'Not found in the provided text.' Be concise (1–3 short sentences).";
        const prompt = `${sys}\n\nQuestion: ${q}\n\nContext:\n"""${ctx}"""`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 220 },
        });

        const answer = result.response.text().trim() || "Not found in the provided text.";
        res.json({ answer });
    } catch (e) {
        console.error(e);
        res.status(500).json({ answer: "Not found in the provided text.", error: "qa_failed" });
    }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log(`Gemini proxy listening on http://localhost:${PORT}`);
});
