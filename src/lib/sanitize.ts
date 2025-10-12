function normalizeUnicode(t: string): string {
    return t
        .replace(/\u00A0/g, " ")
        .replace(/\u00AD/g, "")
        .replace(/[“”„‟]/g, '"')
        .replace(/[‘’‚‛]/g, "'")
        .replace(/[–—]/g, "-")
        .replace(/\uFB00/g, "ff")
        .replace(/\uFB01/g, "fi")
        .replace(/\uFB02/g, "fl")
        .replace(/\uFB03/g, "ffi")
        .replace(/\uFB04/g, "ffl")
        .replace(/\uFB05/g, "ft")
        .replace(/\uFB06/g, "st");
}

function fixLinebreakHyphenation(t: string): string {
    return t.replace(/(\w)-\n(\w)/g, "$1$2");
}

function fixCommonSplits(t: string): string {
    const pairs: Array<[RegExp, string]> = [
        [/\bMa\s+ilroom\b/gi, "Mailroom"],
        [/\bmail\s*room\b/gi, "mailroom"],
        [/\bo f f i c e\b/gi, "office"],
        [/\boff\s*ice\b/gi, "office"],
        [/\be[-\s]?mail\b/gi, "email"],
        [/\bdata[-\s]?box\b/gi, "databox"],
        [/\bbenefi\s*ciary\b/gi, "beneficiary"],
        [/\bpartici\s*pant\b/gi, "participant"],
        [/\bsub\s*mission\b/gi, "submission"],
    ];
    for (const [re, repl] of pairs) t = t.replace(re, repl);
    t = t.replace(/\b([a-z]{2,})\s+([a-z]{2,})\b/g, (m, a, b) => {
        if (/[a-z]{3,}/.test(a) && /^(ing|ment|tion|sion|tive|able|ance|ance|ship|room|fold|ward|ness|ally|ance|ency|ence|ply|sign|room|hold)$/i.test(b)) {
            return a + b;
        }
        return m;
    });
    return t;
}

function tidyWhitespaceAndPunct(t: string): string {
    return t
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/ ?([,;:]) ?/g, "$1 ")
        .replace(/ ?\.(?!\d)/g, ".")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export function cleanText(input: string): string {
    let t = String(input ?? "");
    t = normalizeUnicode(t);
    t = fixLinebreakHyphenation(t);
    t = fixCommonSplits(t);
    t = tidyWhitespaceAndPunct(t);
    t = t.split("\n").map((l) => l.trimEnd()).join("\n");
    return t.trim();
}

export function enforceSize(text: string, maxChars = 300_000): string {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
}
