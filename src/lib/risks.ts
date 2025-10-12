import type { Chunk, RiskHit } from "../types";

type RiskRule = {
    label: string;
    severity: "low" | "med" | "high";
    note?: string;
    pattern: RegExp;
};

const RISK_RULES: RiskRule[] = [
    {
        label: "Auto-renewal",
        severity: "med",
        note: "Subscription may renew automatically unless cancelled.",
        pattern: /\b(auto[-\s]?renew(al|s)?|renews automatically|automatic renewal)\b/gi,
    },
    {
        label: "Arbitration clause",
        severity: "high",
        note: "Disputes may require binding arbitration instead of court.",
        pattern: /\b(arbitration|arbitral tribunal|binding arbitr(ation|ator))\b/gi,
    },
    {
        label: "Class-action waiver",
        severity: "high",
        note: "You may waive participation in class or collective actions.",
        pattern: /\b(class[-\s]?action (waiver|waived)|waive (any|the) class[-\s]?action)\b/gi,
    },
    {
        label: "Fees & charges",
        severity: "med",
        note: "Potential fees, charges, or penalties may apply.",
        pattern: /\b(fee|fees|charge|charges|penalty|penalties|surcharge|processing fee)\b/gi,
    },
    {
        label: "Data sharing/processing",
        severity: "med",
        note: "Personal data may be collected, shared, or processed with partners.",
        pattern: /\b(personal data|data (sharing|processing|collect(ion|ed))|share (your|user) data)\b/gi,
    },
    {
        label: "Unilateral changes",
        severity: "low",
        note: "Terms may change at any time at provider's discretion.",
        pattern: /\b(we may (modify|change|update) (these )?terms (at any time|from time to time))\b/gi,
    },
    {
        label: "Limitation of liability",
        severity: "high",
        note: "Provider limits liability for damages or losses.",
        pattern: /\b(limit(ation)? of liability|liability is (limited|excluded))\b/gi,
    },

    {
        label: "Trademark use requires consent",
        severity: "low",
        note: "No trademark/trade-name rights are granted without prior written consent.",
        pattern: /\b(prior written consent).*(trade ?marks?|trade names?)\b|\bnothing in this agreement grants\b.*(trade ?marks?|trade names?)/gi,
    },
];

function findChunkIdByAbsoluteIndex(chunks: Chunk[], absoluteIndex: number): string | null {
    let lo = 0, hi = chunks.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const c = chunks[mid];
        if (absoluteIndex < c.start) hi = mid - 1;
        else if (absoluteIndex >= c.end) lo = mid + 1;
        else return c.id;
    }
    return null;
}

export function detectRisks(fullText: string, chunks: Chunk[]): RiskHit[] {
    const riskHits: RiskHit[] = [];
    let rid = 0;

    for (const rule of RISK_RULES) {
        rule.pattern.lastIndex = 0;
        let m: RegExpExecArray | null;

        while ((m = rule.pattern.exec(fullText)) !== null) {
            const startIndex = m.index;
            const endIndex = startIndex + m[0].length;
            const chunkId =
                findChunkIdByAbsoluteIndex(chunks, startIndex) ?? chunks[0]?.id ?? "c_0";

            riskHits.push({
                id: `r_${rid++}`,
                chunkId,
                label: rule.label,
                severity: rule.severity,
                start: startIndex,
                end: endIndex,
                note: rule.note,
            });

            if (rule.pattern.lastIndex === m.index) rule.pattern.lastIndex++;
        }
    }
    return riskHits;
}
