import { CHUNK_SIZE, OVERLAP } from "./constants";
import type { Chunk } from '../types';


export function splitIntoChunks(text: string): Chunk[] {
    const chunks: Chunk[] = [];
    let cursor = 0;
    let id = 0;

    while (cursor < text.length) {
        const end = Math.min(cursor + CHUNK_SIZE, text.length);
        const slice = text.slice(cursor, end);

        chunks.push({
            id: `c_${id++}`,
            text: slice,
            start: cursor,
            end
        })

        if (end === text.length) break;
        cursor = end - OVERLAP;
    }
    return chunks;
}