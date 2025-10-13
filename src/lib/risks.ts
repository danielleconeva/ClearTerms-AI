import type { BulletRisk, Chunk, RiskHit, Severity } from "../types";

type RiskRule = {
    label: string;
    severity: Severity;
    note?: string;
    pattern: RegExp;
};


const RISK_RULES: RiskRule[] = [
    {
        label: "Auto-renewal",
        severity: "med",
        note: "Subscription may renew automatically unless cancelled.",
        pattern: /\b(auto|automatic|renew|renewal|renews)\b/i,
    },
    {
        label: "Fees & charges",
        severity: "med",
        note: "Potential fees, charges, or penalties may apply.",
        pattern: /\b(fee|fees|charge|charges|penalty|penalties|surcharge)\b/i,
    },
    {
        label: "Price changes",
        severity: "med",
        note: "Provider may change prices or fees.",
        pattern: /\b(price|prices|increase|change|adjustment)\b/i,
    },
    {
        label: "No refunds",
        severity: "med",
        note: "Payments may be non-refundable.",
        pattern: /\b(refund|refunds|nonrefundable|non\-refundable)\b/i,
    },
    {
        label: "Early termination fee",
        severity: "med",
        note: "Fees may apply if you cancel early.",
        pattern: /\b(cancellation fee|early termination)\b/i,
    },

    {
        label: "Arbitration clause",
        severity: "high",
        note: "Disputes may require binding arbitration.",
        pattern: /\b(arbitration|arbitrator|arbitral)\b/i,
    },
    {
        label: "Class-action waiver",
        severity: "high",
        note: "You may waive participation in class actions.",
        pattern: /\b(class action|class\-action|waiver|waive)\b/i,
    },
    {
        label: "Limitation of liability",
        severity: "high",
        note: "Provider limits liability for damages or losses.",
        pattern: /\b(liability|limit|limitation|exclude|exclusion)\b/i,
    },
    {
        label: "No indirect damages",
        severity: "high",
        note: "Excludes consequential/special/incidental damages.",
        pattern: /\b(consequential|incidental|special|punitive)\b/i,
    },
    {
        label: "Indemnification",
        severity: "high",
        note: "You agree to indemnify/hold harmless the provider.",
        pattern: /\b(indemnify|indemnification|hold harmless)\b/i,
    },
    {
        label: "Warranty disclaimer",
        severity: "high",
        note: "Service provided “as is” without warranties.",
        pattern: /\b(as is|no warranties|without warranty)\b/i,
    },

    {
        label: "Termination / suspension",
        severity: "med",
        note: "Account or service may be terminated or suspended.",
        pattern: /\b(terminate|termination|suspend|suspension)\b/i,
    },
    {
        label: "Unilateral changes",
        severity: "low",
        note: "Terms may change at provider’s discretion.",
        pattern: /\b(modify|change|update|amend|discretion)\b/i,
    },
    {
        label: "Right to monitor/remove",
        severity: "low",
        note: "Provider may monitor or remove content.",
        pattern: /\b(monitor|moderate|remove)\b/i,
    },

    {
        label: "Data collection/processing",
        severity: "med",
        note: "Personal data may be collected or processed.",
        pattern: /\b(personal data|collect|collection|process|processing)\b/i,
    },
    {
        label: "Data sharing",
        severity: "med",
        note: "Data may be shared with others.",
        pattern: /\b(share|sharing|disclose|disclosure)\b/i,
    },
    {
        label: "Data retention",
        severity: "med",
        note: "Data may be retained for extended periods.",
        pattern: /\b(retain|retention)\b/i,
    },
    {
        label: "Third-party processors",
        severity: "med",
        note: "Data may be handled by vendors/sub-processors.",
        pattern: /\b(third[\- ]?party|vendor|subprocessor|service provider)\b/i,
    },
    {
        label: "Cookies / tracking",
        severity: "low",
        note: "Tracking technologies may be used.",
        pattern: /\b(cookie|cookies|tracking|pixel|beacon)\b/i,
    },
    {
        label: "Location tracking",
        severity: "med",
        note: "GPS or precise location may be collected.",
        pattern: /\b(location|gps|geolocation|track)\b/i,
    },
    {
        label: "Biometric data",
        severity: "high",
        note: "Biometric identifiers may be processed.",
        pattern: /\b(biometric|fingerprint|face|iris|voiceprint)\b/i,
    },

    {
        label: "Broad license",
        severity: "high",
        note: "Perpetual/irrevocable/royalty-free/worldwide license.",
        pattern: /\b(perpetual|irrevocable|royalty[\- ]?free|worldwide|license)\b/i,
    },
    {
        label: "User content license",
        severity: "med",
        note: "You grant a license to your content.",
        pattern: /\b(content|license|reproduce|distribute|display|perform)\b/i,
    },
    {
        label: "IP assignment / ownership",
        severity: "high",
        note: "Assignment or ownership of results/IP.",
        pattern: /\b(assign|assignment|ownership|intellectual property|IP)\b/i,
    },
    {
        label: "Trademark use requires consent",
        severity: "low",
        note: "No trademark/trade-name rights without consent.",
        pattern: /\b(trademark|trade mark|trade[\- ]name|prior|consent|written)\b/i,
    },

    {
        label: "Governing law / jurisdiction",
        severity: "low",
        note: "Disputes governed by specified law or venue.",
        pattern: /\b(governing law|jurisdiction|venue)\b/i,
    },
    {
        label: "Age restrictions",
        severity: "med",
        note: "Minimum age or parental consent required.",
        pattern: /\b(under 13|under 16|under 18|parental consent)\b/i,
    },
    {
        label: "Force majeure",
        severity: "low",
        note: "No liability for events beyond control.",
        pattern: /\b(force majeure|act of god)\b/i,
    },

    {
        label: "API limits / quotas",
        severity: "low",
        note: "Use may be limited by rate limits or quotas.",
        pattern: /\b(rate limit|quota|throttling)\b/i,
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
            const chunkId = findChunkIdByAbsoluteIndex(chunks, startIndex) ?? chunks[0]?.id ?? "c_0";

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

function topSeverity(sevs: Severity[]): Severity {
    let level = 0;
    for (const s of sevs) {
        if (s === "low") level = Math.max(level, 1);
        else if (s === "med") level = Math.max(level, 2);
        else if (s === "high") level = 3;
    }
    return (["low", "med", "high"] as Severity[])[Math.max(0, level - 1)] ?? "low";
}


export function detectBulletRisks(bullets: string[]): BulletRisk[] {
    const out: BulletRisk[] = [];
    let idCounter = 0;

    bullets.forEach((text, idx) => {
        const labels: string[] = [];
        const severities: Severity[] = [];
        const notes: string[] = [];

        for (const rule of RISK_RULES) {
            rule.pattern.lastIndex = 0;
            if (rule.pattern.test(text)) {
                labels.push(rule.label);
                severities.push(rule.severity);
                notes.push(rule.note ?? "");
            }
        }

        if (labels.length > 0) {
            out.push({
                id: `br_${idCounter++}`,
                bulletIndex: idx,
                labels,
                severities,
                topSeverity: topSeverity(severities),
                notes,
            });
        }
    });

    return out;
}


export function getBulletTopSeverity(bulletIndex: number, bulletRisks: BulletRisk[]): Severity | null {
    const hit = bulletRisks.find(r => r.bulletIndex === bulletIndex);
    return hit ? hit.topSeverity : null;
}

export { RISK_RULES };
