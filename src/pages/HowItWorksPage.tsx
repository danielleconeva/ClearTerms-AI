import { Link } from "react-router-dom";

const Icon = {
    Upload: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
            <path
                d="M12 16V4m0 0l-4 4m4-4l4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20 16v3.5A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5V16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    ),
    Sparkles: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
            <path
                d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"
                stroke="currentColor"
                strokeWidth="1.4"
            />
            <path
                d="M19 4l.9 2.1L22 7l-2.1.9L19 10l-.9-2.1L16 7l2.1-.9L19 4zM5 14l.8 1.8L7.5 17l-1.7.7L5 19.5l-.8-1.8L2.5 17l1.7-.7L5 14z"
                stroke="currentColor"
                strokeWidth="1.2"
            />
        </svg>
    ),
    DocQ: (p: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
            <path
                d="M8 3h6l4 4v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M9.5 13a2.5 2.5 0 1 1 3.3 2.36c-.52.2-.8.53-.8 1.14v.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <circle cx="12" cy="19.2" r=".9" fill="currentColor" />
        </svg>
    ),
};

const card =
    "rounded-2xl border border-cyan-400/70 px-6 py-6 transition duration-300 " +
    "hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_0_18px_rgba(56,189,248,.35)] active:translate-y-0 " +
    "2xl:px-8 2xl:py-8";

export default function HowItWorksPage() {
    return (
        <main className="relative w-full">
            <section className="mx-auto w-full max-w-6xl px-5 py-10 md:py-12 2xl:max-w-7xl 2xl:py-16">
                <h1 className="text-center text-4xl font-extrabold tracking-tight text-white md:text-5xl 2xl:text-6xl animate-fadeUpText">
                    How It Works
                </h1>

                <div className="mb-12 mt-4 h-[3px] w-56 mx-auto rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-fadeUpText 2xl:w-64" />

                <p
                    className="mx-auto mt-5 mb-8 max-w-2xl text-center text-lg text-slate-300 animate-fadeUpText 2xl:max-w-3xl 2xl:text-xl"
                    style={{ animationDelay: "0.4s" }}
                >
                    ClearTerms AI makes understanding Terms & Conditions simple
                    and fast. Here's how we turn legal jargon into plain English
                    in three easy steps.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-3 2xl:gap-8">
                    <article
                        className={`${card} animate-fadeUpText`}
                        style={{ animationDelay: "0.5s" }}
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-cyan-300 2xl:h-14 2xl:w-14">
                            <Icon.Upload className="h-7 w-7 2xl:h-9 2xl:w-9" />
                        </div>
                        <h3 className="text-xl font-semibold text-white 2xl:text-2xl">
                            1) Upload
                        </h3>
                        <p className="mt-2 text-slate-300 2xl:text-lg">
                            Add your Terms &amp; Conditions in seconds.
                        </p>
                        <p className="mt-1 text-slate-400 2xl:text-base">
                            Upload a PDF, paste a link, or drop in the text. Any
                            format works.
                        </p>
                    </article>

                    <article
                        className={`${card} animate-fadeUpText`}
                        style={{ animationDelay: "0.65s" }}
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-fuchsia-300 2xl:h-14 2xl:w-14">
                            <Icon.Sparkles className="h-7 w-7 2xl:h-9 2xl:w-9" />
                        </div>
                        <h3 className="text-xl font-semibold text-white 2xl:text-2xl">
                            2) Let AI Decode It
                        </h3>
                        <p className="mt-2 text-slate-300 2xl:text-lg">
                            Our AI scans the full document and delivers a
                            plain-English summary.
                        </p>
                        <p className="mt-1 text-slate-400 2xl:text-base">
                            It spotlights the stuff that matters—auto-renewals,
                            data sharing, fees, cancellation rules and more.
                        </p>
                    </article>

                    <article
                        className={`${card} animate-fadeUpText`}
                        style={{ animationDelay: "0.8s" }}
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-sky-300 2xl:h-14 2xl:w-14">
                            <Icon.DocQ className="h-7 w-7 2xl:h-9 2xl:w-9" />
                        </div>
                        <h3 className="text-xl font-semibold text-white 2xl:text-2xl">
                            3) Understand &amp; Ask
                        </h3>
                        <p className="mt-2 text-slate-300 2xl:text-lg">
                            Use the summary to understand the terms at a glance
                            and the risk flags to focus on what matters most.
                        </p>
                        <p className="mt-1 text-slate-400 2xl:text-base">
                            Ask anything from simple clarifications to
                            scenario-based questions—"If I cancel early, what do
                            I owe?" —and receive immediate answers.
                        </p>
                    </article>
                </div>

                <div
                    className={`mt-14 ${card} text-center md:mt-16 md:p-9 2xl:mt-20 2xl:p-12 animate-fadeUpText`}
                    style={{ animationDelay: "0.95s" }}
                >
                    <h2 className="text-2xl font-extrabold text-white md:text-3xl 2xl:text-4xl">
                        Why ClearTerms AI?
                    </h2>

                    <p className="mx-auto mt-4 max-w-3xl text-slate-300 2xl:max-w-4xl 2xl:text-lg">
                        Most people skip T&amp;Cs because they're long,
                        confusing, and time-consuming. We make it simple.
                        ClearTerms AI surfaces the essentials—hidden fees,
                        auto-renewals, and data use — so you can decide with
                        confidence in minutes.
                    </p>

                    <div className="mx-auto mt-7 flex flex-wrap justify-center gap-4 2xl:gap-6">
                        <Link
                            to="/upload"
                            className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/80 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(56,189,248,.5)] active:translate-y-0 2xl:px-12 2xl:py-6 2xl:text-xl"
                        >
                            TRY IT NOW
                        </Link>
                    </div>

                    <p className="mx-auto mt-6 max-w-3xl text-xs text-slate-400 2xl:max-w-4xl 2xl:text-sm">
                        Disclaimer: ClearTerms AI provides information for
                        general guidance only and is not legal advice. For
                        specific questions, please consult a qualified attorney.
                    </p>
                </div>
            </section>
        </main>
    );
}
