
export type Severity = "low" | "med" | "high";

export type Chunk = {
    id: string;
    text: string;
    start: number;
    end: number;
};

export type RiskHit = {
    id: string;
    chunkId: string;
    label: string;
    severity: Severity;
    start: number;
    end: number;
    note?: string;
};

export type BulletRisk = {
    id: string;
    bulletIndex: number;
    labels: string[];
    severities: Severity[];
    topSeverity: Severity;
    notes: string[];
};

export type Analysis = {
    chunks: Chunk[];
    bullets: string[];
    risks: RiskHit[];
};

export type Highlight = { start: number; end: number } | null;

export type QAResult = {
    answer: string;
    citations: Array<{ chunkId: string; start: number; end: number }>;
};
