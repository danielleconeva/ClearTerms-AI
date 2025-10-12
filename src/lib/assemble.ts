// src/lib/assemble.ts
import type { Chunk } from "../types";

export function assembleFullText(chunks: Chunk[]): string {
    if (!chunks?.length) return "";
    const sorted = [...chunks].sort((a, b) => a.start - b.start);
    let out = "";
    let cursor = sorted[0].start;

    for (const c of sorted) {
        if (c.start > cursor) out += " ".repeat(c.start - cursor);
        const sliceStart = Math.max(0, cursor - c.start);
        out += c.text.slice(sliceStart);
        cursor = Math.max(cursor, c.end);
    }
    return out.trim();
}
