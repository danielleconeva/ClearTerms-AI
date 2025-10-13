import { useMemo } from "react";
import type { Chunk } from "../types";
import { computeReadingStats, secondsToNice } from "../lib/reading";
import { assembleFullText } from "../lib/assemble";

type Props = {
    rawText?: string;
    chunks?: Chunk[];
    bullets: string[];
    wpm?: number;
};

export default function SummaryStats({
    rawText,
    chunks = [],
    bullets,
    wpm = 200,
}: Props) {
    const effectiveText = useMemo(() => {
        const t = (rawText || "").trim();
        if (t.length > 0) return t;
        if (chunks.length > 0) return assembleFullText(chunks);
        return "";
    }, [rawText, chunks]);

    const { fullWords, fullMins, summaryMins, timeSaved } = computeReadingStats(
        effectiveText,
        bullets,
        wpm
    );

    return (
        <div className="mt-4 sm:mt-5 xl:mt-6 2xl:mt-7 grid gap-3 sm:gap-4 2xl:gap-5 sm:grid-cols-3 text-center">
            <StatCard
                label="Total Words"
                value={fullWords.toLocaleString()}
                sub={`${secondsToNice(fullMins)} to read`}
                valueClass="text-[#f95387]"
            />
            <StatCard
                label="Summary Read Time"
                value={secondsToNice(summaryMins)}
                sub={`${bullets.length} key point${
                    bullets.length === 1 ? "" : "s"
                }`}
                valueClass="text-[#fb4ec4]"
            />
            <StatCard
                label="Time Saved"
                value={secondsToNice(timeSaved)}
                sub="compared to reading the entire document"
                highlight
                valueClass="text-[#44dcf3]"
            />
        </div>
    );
}

function StatCard({
    label,
    value,
    sub,
    highlight = false,
    valueClass = "text-white",
}: {
    label: string;
    value: string | number;
    sub?: string;
    highlight?: boolean;
    valueClass?: string;
}) {
    return (
        <div
            className={`rounded-xl sm:rounded-2xl border backdrop-blur-sm p-3 sm:p-4 2xl:p-5 shadow-sm transition-all duration-300 border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] ${
                highlight ? "ring-1 ring-cyan-400/40" : ""
            }`}
        >
            <div className="text-xs sm:text-sm 2xl:text-base text-white/60">
                {label}
            </div>
            <div
                className={`mt-0.5 sm:mt-1 2xl:mt-1.5 text-2xl sm:text-3xl 2xl:text-4xl font-semibold ${valueClass}`}
            >
                {value}
            </div>
            {sub ? (
                <div className="mt-0.5 sm:mt-1 2xl:mt-1.5 text-xs xl:text-xs 2xl:text-sm text-white/50">
                    {sub}
                </div>
            ) : null}
        </div>
    );
}
