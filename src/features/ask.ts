import type { Chunk, QAResult } from "../types";
import { embedText, answerInContextAI } from "../ai/gemini";

function cosineSimilarity(a: number[], b: number[]): number {
    const n = Math.min(a.length, b.length);
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < n; i++) {
        const va = a[i], vb = b[i];
        dot += va * vb; na += va * va; nb += vb * vb;
    }
    const denom = Math.sqrt(na) * Math.sqrt(nb);
    return denom ? dot / denom : 0;
}

function lexicalOverlapScore(q: string, t: string): number {
    const tok = (s: string) => (s.toLowerCase().match(/[a-z0-9]+/g) || []);
    const qset = new Set(tok(q));
    let hit = 0;
    for (const w of tok(t)) if (qset.has(w)) hit++;
    return hit;
}

export async function pickBestChunksAI(
    question: string,
    chunks: Chunk[],
    topK = 2
): Promise<Chunk[]> {
    const qVec = await embedText(question);
    const scored = await Promise.all(
        chunks.map(async (chunk) => {
            const text = chunk.text.slice(0, 1200);
            const cVec = await embedText(text);
            const emb = cosineSimilarity(qVec, cVec);
            const lex = lexicalOverlapScore(question, text) / 20;
            return { chunk, score: emb + lex };
        })
    );
    return scored.sort((a, b) => b.score - a.score).slice(0, topK).map(s => s.chunk);
}


export async function answerQuestionAI(
    question: string,
    chunks: Chunk[]
): Promise<QAResult> {
    const contextChunks = await pickBestChunksAI(question, chunks, 2);
    const contextText = contextChunks.map((c) => c.text).join("\n\n");
    const qaOutput = await answerInContextAI({ question, context: contextText });

    return {
        answer: qaOutput.answer || "Not found in the provided text.",
        citations: [],
    };
}
