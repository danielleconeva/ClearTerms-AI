export type Chunk = {
    id: string;
    text: string;
    start: number; // char index in full doc
    end: number;   // char index in full doc
};

export type RiskHit = {
    id: string;
    chunkId: string;
    label: string;             // e.g., "Auto-renewal"
    severity: "low" | "med" | "high";
    start: number;             // char index in full doc
    end: number;
    note?: string;
};

export type Analysis = {
    chunks: Chunk[];
    bullets: string[];         // TL;DR lines
    risks: RiskHit[];
};

export type Highlight = { start: number; end: number } | null;

export type QAResult = {
    answer: string;
    citations: Array<{ chunkId: string; start: number; end: number }>;
};
