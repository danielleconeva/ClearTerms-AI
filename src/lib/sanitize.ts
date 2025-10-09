export function cleanText(input: string): string {
    return (
        input
            // unify newlines
            .replace(/\r\n/g, "\n")
            // collapse 3+ newlines to 2
            .replace(/\n{3,}/g, "\n\n")
            // trim trailing spaces per line
            .split("\n")
            .map(l => l.trimEnd())
            .join("\n")
            .trim()
    );
}

export function enforceSize(text: string, maxChars = 300_000): string {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
}
