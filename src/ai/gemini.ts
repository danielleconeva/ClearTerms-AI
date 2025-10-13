const VERB = /\b(shall|must|may|will|agree|grant|assign|license|collect|use|scan|review|process|store|share|disclose|pay|charge|provide|notify|restrict|prohibit|limit|retain|own|display|perform|distribute|reproduce|comply|terminate|suspend|warrant|disclaim|indemnif|governed|jurisdiction)\b/i;

function stripFrontTokens(line: string): string {

    return line
        .replace(/^\s+/, "")
        .replace(
            /^(?:\d+(?:\.\d+)*\s*\([A-Za-z]\)|\d+(?:\.\d+)*|\([A-Za-z]\)|[A-Za-z]\)|\d+\))\s*[-.)–—: ]?\s+/,
            ""
        )
        .replace(/^\s+/, "");
}

function looksLikeHeading(line: string): boolean {
    const s = line.trim();
    if (!s) return true;
    if (/:$/.test(s)) return true;
    const words = s.split(/\s+/);
    const caps = words.filter((w) => /^[A-Z][A-Za-z'-]+$/.test(w)).length;

    if (words.length <= 6 && caps >= Math.ceil(words.length * 0.7)) return true;
    if (!VERB.test(s) && s.length <= 80) return true;
    return false;
}

function preclean(text: string): string {
    const normalized = (text || "")

        .replace(/(\w)-\s*\n\s*(\w)/g, "$1$2")
        .replace(/\r/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\u00A0/g, " ")
        .replace(/\n{2,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();

    const kept: string[] = [];
    for (const raw of normalized.split("\n")) {
        let l = stripFrontTokens(raw);

        l = l.replace(/\s*\(\s*(?:see|section|clause)\s*[\d.]+\s*\)/gi, "");
        l = l.replace(/\(defined in Section[^)]+\)/gi, "");
        l = l.replace(/\s*\(?(https?:\/\/[^\s)]+)\)?/gi, "");

        if (looksLikeHeading(l)) continue;

        kept.push(l.trim());
    }

    const stitched: string[] = [];
    for (const line of kept) {
        const prev = stitched[stitched.length - 1];
        const prevEnds = prev ? /[.?!]"?$/.test(prev) : true;
        const cont = /^([a-z].{0,120}|and\b|or\b|but\b|including\b|such as\b|subject to\b|provided that\b)/i.test(line);
        if (prev && !prevEnds && cont) {
            stitched[stitched.length - 1] = (prev + " " + line).replace(/\s{2,}/g, " ").trim();
        } else {
            stitched.push(line);
        }
    }

    return stitched.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}


export async function summarizeChunkAI(text: string): Promise<string[]> {
    const input = preclean(text);
    if (!input) return [];

    const res = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
    });

    let bullets: string[] = [];
    if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bullets)) bullets = data.bullets;
    }

    if (!bullets.length) {
        const sentences = input.match(/[^.!?]+[.!?]/g) || [];
        bullets = sentences.map((s) => s.trim()).filter(Boolean).slice(0, 5);
    }
    return bullets;
}

export async function answerInContextAI(args: {
    question: string;
    context: string;
}): Promise<{ answer: string }> {
    // DO NOT preclean the question — it strips normal user questions.
    const q = String(args.question || "").trim();
    const ctx = preclean(args.context); // keep aggressive clean for context

    const res = await fetch("/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context: ctx }),
    });
    if (!res.ok) return { answer: "Not found in the provided text." };
    const data = await res.json();
    return { answer: data.answer || "Not found in the provided text." };
}



function hashEmbed(text: string, dim = 256): number[] {
    const v = new Float32Array(dim);
    const toks = (text || "").toLowerCase().match(/[a-z0-9]+/g) || [];
    for (const t of toks) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < t.length; i++) {
            h ^= t.charCodeAt(i);
            h = Math.imul(h, 16777619) >>> 0;
        }
        v[h % dim] += 1;
    }
    let sum = 0;
    for (let i = 0; i < dim; i++) sum += v[i] * v[i];
    const norm = Math.sqrt(sum || 1);
    for (let i = 0; i < dim; i++) v[i] = v[i] / norm;
    return Array.from(v);
}

export async function embedText(text: string): Promise<number[]> {
    return hashEmbed(text, 256);
}
