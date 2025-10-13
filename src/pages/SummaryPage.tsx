import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
    FileDown,
    MessageSquare,
    AlertTriangle,
    XCircle,
    CheckCircle2,
} from "lucide-react";
import { analysisToPlainText, downloadText } from "../lib/export";
import SummaryStats from "../components/SummaryStats";
import { assembleFullText } from "../lib/assemble";
import type { Severity } from "../types";
import { detectBulletRisks } from "../lib/risks";

export default function SummaryPage() {
    const navigate = useNavigate();
    const analysis = useAppSelector((state) => state.doc.analysis);
    const rawText = useAppSelector((state) => state.doc.rawText);
    const analyzeStatus = useAppSelector((state) => state.doc.analyzeStatus);

    const bullets = analysis?.bullets ?? [];
    const chunks = analysis?.chunks ?? [];

    const handleExportText = () => {
        if (!analysis) return;
        const text = analysisToPlainText(analysis);
        downloadText("summary.txt", text);
    };

    if (analyzeStatus === "loading") {
        return (
            <main className="container mx-auto max-w-3xl sm:max-w-4xl xl:max-w-4xl 2xl:max-w-5xl px-4 sm:px-6 py-8 sm:py-10 xl:py-10 2xl:py-12">
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 sm:space-y-4">
                    <div className="rounded-full border-2 border-cyan-400/30 border-t-cyan-400 h-10 w-10 sm:h-12 sm:w-12 2xl:h-14 2xl:w-14 animate-spin"></div>
                    <p className="text-xs sm:text-sm 2xl:text-base text-slate-300">
                        Analyzing your document…
                    </p>
                </div>
            </main>
        );
    }

    const hasSomeSource = !!(rawText?.trim() || chunks.length);
    if (!analysis || !hasSomeSource) {
        return (
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                    No analysis available.
                </p>
                <button
                    className="rounded-lg border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-muted/50"
                    onClick={() => navigate("/get-started")}
                >
                    Go to Upload
                </button>
            </div>
        );
    }

    const effectiveRawText =
        rawText && rawText.trim().length > 0
            ? rawText
            : assembleFullText(chunks);

    const computedBulletRisks = detectBulletRisks(bullets);

    const pillFor = (sev: Severity) =>
        sev === "high"
            ? "bg-rose-500/10 text-rose-300 border border-rose-400/40"
            : sev === "med"
            ? "bg-fuchsia-500/10 text-fuchsia-200 border border-fuchsia-400/40"
            : "bg-cyan-500/10 text-cyan-200 border border-cyan-400/40";

    const iconWrapFor = (sev: Severity) =>
        sev === "high"
            ? "text-rose-400"
            : sev === "med"
            ? "text-fuchsia-400"
            : "text-cyan-400";

    const IconFor: React.FC<{ sev: Severity; className?: string }> = ({
        sev,
        className,
    }) =>
        sev === "high" ? (
            <XCircle
                className={`h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6 ${
                    className || ""
                }`}
            />
        ) : sev === "med" ? (
            <AlertTriangle
                className={`h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6 ${
                    className || ""
                }`}
            />
        ) : (
            <CheckCircle2
                className={`h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6 ${
                    className || ""
                }`}
            />
        );

    return (
        <div className="container mx-auto max-w-3xl sm:max-w-4xl xl:max-w-4xl 2xl:max-w-5xl px-4 sm:px-6 py-8 sm:py-10 xl:py-10 2xl:py-12">
            <div className="mb-6 sm:mb-8 xl:mb-8 2xl:mb-10 text-center sm:text-left">
                <h1 className="text-4xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight animate-fadeUpText">
                    AI Summary
                </h1>
                <div
                    className="mb-6 sm:mb-8 xl:mb-8 2xl:mb-10 mt-3 sm:mt-4 2xl:mt-5 h-[3px] w-40 sm:w-50 xl:w-50 2xl:w-60 mx-auto sm:mx-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-fadeUpText"
                    style={{ animationDelay: "0.2s" }}
                />
                <p
                    className="mt-4 sm:mt-5 2xl:mt-6 mb-6 sm:mb-8 2xl:mb-10 text-lg sm:text-lg xl:text-lg 2xl:text-xl text-slate-300 animate-fadeUpText"
                    style={{ animationDelay: "0.4s" }}
                >
                    Here's a plain-English breakdown of the key points in the
                    Terms &amp; Conditions.
                </p>
            </div>

            <div
                className="animate-fadeUpText"
                style={{ animationDelay: "0.5s" }}
            >
                <SummaryStats rawText={effectiveRawText} bullets={bullets} />
            </div>

            <section className="mt-10 sm:mt-12 xl:mt-12 2xl:mt-14">
                <h2
                    className="mb-6 sm:mb-8 xl:mb-8 2xl:mb-10 mt-10 sm:mt-12 xl:mt-12 2xl:mt-14 text-2xl sm:text-3xl xl:text-3xl 2xl:text-4xl font-semibold animate-fadeUpText"
                    style={{ animationDelay: "0.65s" }}
                >
                    Key Points
                </h2>

                {bullets.length === 0 ? (
                    <div
                        className="rounded-lg border border-cyan-500/30 backdrop-blur-sm p-6 sm:p-8 2xl:p-10 text-center animate-fadeUpText"
                        style={{ animationDelay: "0.8s" }}
                    >
                        <p className="text-xs sm:text-sm 2xl:text-base text-slate-400">
                            No key points extracted.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5 sm:space-y-3 2xl:space-y-4">
                        {bullets.map((bullet, index) => {
                            const risk = computedBulletRisks.find(
                                (r) => r.bulletIndex === index
                            );
                            const sev = risk?.topSeverity as
                                | Severity
                                | undefined;

                            return (
                                <div
                                    key={`${index}-${bullet.slice(0, 24)}`}
                                    className="mb-4 sm:mb-6 2xl:mb-7 rounded-xl sm:rounded-2xl border border-cyan-500/30 backdrop-blur-sm p-4 sm:p-5 2xl:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] active:translate-y-0 animate-fadeUpText"
                                    style={{
                                        animationDelay: `${0.8 + index * 0.1}s`,
                                    }}
                                >
                                    <div className="flex items-start gap-2.5 sm:gap-3 2xl:gap-4">
                                        {sev ? (
                                            <span className={iconWrapFor(sev)}>
                                                <IconFor sev={sev} />
                                            </span>
                                        ) : (
                                            <span className="text-slate-500">
                                                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6 opacity-60" />
                                            </span>
                                        )}

                                        <p className="flex-1 text-sm sm:text-[0.95rem] 2xl:text-lg leading-relaxed font-medium text-white">
                                            {bullet}
                                        </p>
                                    </div>

                                    {sev && (
                                        <div className="mt-3 sm:mt-4 2xl:mt-5 ml-6 sm:ml-7 2xl:ml-9">
                                            <span
                                                className={[
                                                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 2xl:px-4 2xl:py-1.5 text-xs xl:text-xs 2xl:text-sm font-semibold tracking-wide",
                                                    pillFor(sev),
                                                ].join(" ")}
                                                title={risk?.labels.join(", ")}
                                            >
                                                {sev === "high"
                                                    ? "HIGH RISK"
                                                    : sev === "med"
                                                    ? "MEDIUM RISK"
                                                    : "LOW RISK"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <div
                className="mt-10 sm:mt-12 xl:mt-12 2xl:mt-14 mb-6 sm:mb-8 2xl:mb-10 rounded-lg border mx-auto max-w-full sm:max-w-170 xl:max-w-170 2xl:max-w-200 bg-slate-800/55 border-white/8 backdrop-blur-sm p-3.5 sm:p-4 2xl:p-5 animate-fadeUpText"
                style={{ animationDelay: `${0.8 + bullets.length * 0.1}s` }}
            >
                <p className="text-sm sm:text-[0.95rem] 2xl:text-lg text-gray-300 leading-relaxed text-center flex items-start gap-2">
                    <AlertTriangle
                        className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6 text-yellow-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                    />
                    <span>
                        This summary is generated by AI and is not legal advice.
                        For legal guidance, please consult a qualified attorney.
                    </span>
                </p>
            </div>

            <div
                className="mt-12 sm:mt-14 xl:mt-14 2xl:mt-16 flex flex-wrap justify-center gap-3 sm:gap-3.5 2xl:gap-4 animate-fadeUpText"
                style={{ animationDelay: `${0.9 + bullets.length * 0.1}s` }}
            >
                <button
                    onClick={() => navigate("/ask")}
                    className="inline-flex items-center gap-2 sm:gap-2.5 2xl:gap-3 rounded-lg sm:rounded-xl border border-cyan-500/30 backdrop-blur-sm px-5 sm:px-6 2xl:px-7 py-2.5 sm:py-3 2xl:py-4 text-sm sm:text-base 2xl:text-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] active:translate-y-0"
                >
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6" />
                    Ask Questions
                </button>

                <button
                    onClick={handleExportText}
                    className="inline-flex items-center gap-2 sm:gap-2.5 2xl:gap-3 rounded-lg sm:rounded-xl border border-cyan-400/50 bg-cyan-500/10 backdrop-blur-sm px-5 sm:px-6 2xl:px-7 py-2.5 sm:py-4 2xl:py-5 text-sm sm:text-base 2xl:text-lg text-cyan-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:translate-y-0"
                >
                    <FileDown className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6" />
                    Export as a File
                </button>
            </div>
        </div>
    );
}
