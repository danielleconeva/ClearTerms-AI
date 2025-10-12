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

export function precleanForLLM(input: string): string {
    const lines = String(input || "")
        .replace(/\u00A0/g, " ")
        .replace(/\r/g, "")
        .split("\n");

    const out: string[] = [];
    for (let raw of lines) {
        let l = stripFrontTokens(raw);

        l = l.replace(/\s*\(\s*(?:see|section|clause)\s*[\d.]+\s*\)/gi, "");
        l = l.replace(/\(defined in Section[^)]+\)/gi, "");
        l = l.replace(/\s*\(?(https?:\/\/[^\s)]+)\)?/gi, "");

        if (looksLikeHeading(l)) continue;
        out.push(l);
    }

    const stitched: string[] = [];
    for (const l of out) {
        const prev = stitched[stitched.length - 1];
        const prevEnds = prev ? /[.?!]"?$/.test(prev) : true;
        const cont = /^([a-z].{0,120}|and\b|or\b|but\b|including\b|such as\b|subject to\b|provided that\b)/i.test(l);
        if (prev && !prevEnds && cont) {
            stitched[stitched.length - 1] = (prev + " " + l).replace(/\s{2,}/g, " ").trim();
        } else {
            stitched.push(l);
        }
    }

    return stitched.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
