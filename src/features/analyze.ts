import type { Chunk } from "../types";
import { summarizeChunkAI } from "../ai/gemini";
import { splitIntoChunks } from "../lib/chunk";

function normalizeForCompare(s: string) {
    return s
        .toLowerCase()
        .replace(/\b(the|a|an|to|of|for|in|on|with|within|by|at|and|or)\b/g, " ")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeVerbLists(s: string) {
    return s
        .replace(
            /\b(load|display|run|copy|distribute|transmit|store|save|modify|translate|edit|reproduce)(\s*,\s*(load|display|run|copy|distribute|transmit|store|save|modify|translate|edit|reproduce))+(\s*,?\s*and\s*(load|display|run|copy|distribute|transmit|store|save|modify|translate|edit|reproduce))?/gi,
            "use the software"
        )
        .replace(/\s+/g, " ")
        .trim();
}

function jaccard(a: string, b: string) {
    const A = new Set(normalizeForCompare(normalizeVerbLists(a)).split(" ").filter(Boolean));
    const B = new Set(normalizeForCompare(normalizeVerbLists(b)).split(" ").filter(Boolean));
    let inter = 0;
    for (const w of A) if (B.has(w)) inter++;
    return inter / Math.max(1, A.size + B.size - inter);
}

function computeBulletCap(chunks: Chunk[]) {
    const n = chunks.length;
    const base = Math.max(6, Math.round(n * 0.6) + 4);
    return Math.min(base, 24);
}

export async function summarizeAllAI(
    chunks: Chunk[],
    _maxBulletsPerChunk = 1,
    _maxBulletsTotal = 12
): Promise<{ bullets: string[] }> {
    if (!chunks?.length) return { bullets: [] };

    const maxBulletsTotal = computeBulletCap(chunks);
    const bullets: string[] = [];
    const seen = new Set<string>();

    for (const chunk of chunks) {
        if (bullets.length >= maxBulletsTotal) break;

        const local = await summarizeChunkAI(chunk.text);


        const take =
            chunks.length === 1 ? 5 :
                chunks.length <= 3 ? Math.min(3, Math.ceil(maxBulletsTotal / chunks.length)) :
                    1;

        for (const b of local.slice(0, take)) {
            const key = normalizeForCompare(normalizeVerbLists(b));
            const isDup = bullets.some((x) => jaccard(x, b) >= 0.85) || seen.has(key);
            if (isDup) continue;
            bullets.push(b);
            seen.add(key);
            if (bullets.length >= maxBulletsTotal) break;
        }
    }

    return { bullets };
}

export async function summarizeTextAI(text: string): Promise<{ bullets: string[] }> {
    const chunks = splitIntoChunks(text);
    return summarizeAllAI(chunks);
}
