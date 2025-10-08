import { Link } from "react-router-dom";
import heroImg from "../assets/neon-blue-swirl.png";

export default function HomePage() {
    return (
        <main className="relative">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "4s" }}
                />
                <div
                    className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "5s", animationDelay: "1s" }}
                />
            </div>

            <section className="relative mx-auto w-full max-w-8xl px-6 py-12 md:py-12">
                <div className="flex flex-col items-center gap-16 md:flex-row md:items-center md:gap-16 xl:gap-20 2xl:gap-24">
                    <div className="relative flex-1 md:basis-[46%] xl:basis-[42%] 2xl:basis-[40%] flex justify-center animate-imageEnterFloat">
                        <img
                            src={heroImg}
                            alt="Neon abstract"
                            className="h-auto w-[420px] md:w-[540px] lg:w-[640px] xl:w-[720px] 2xl:w-[760px] max-w-full img-soft-left"
                        />
                    </div>

                    <div className="flex-1 px-14 md:basis-[54%] xl:basis-[58%] 2xl:basis-[60%] max-w-none animate-fadeUpText">
                        <h1 className="mt-1 mb-4 text-4xl md:text-6xl font-extrabold leading-tight text-white">
                            ClearTerms AI
                        </h1>

                        <div className="mb-8 h-[3px] w-28 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)]" />

                        <h5 className="mt-4 text-xl md:text-3xl font-light leading-tight text-white">
                            Read the fine print instantly.
                        </h5>

                        <p className="mt-4 text-lg font-light leading-relaxed text-slate-200 max-w-[68ch]">
                            Upload a Terms & Conditions file and get a clear,
                            plain-English summary with the key points
                            highlighted. Ask follow-up questions and see exact
                            citations from the document.
                        </p>

                        <div className="mt-10 flex flex-wrap items-center gap-5">
                            <Link
                                to="/upload"
                                className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/80 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_40px_0_rgba(56,189,248,0.5)] hover:-translate-y-1 active:translate-y-0"
                            >
                                GET STARTED
                            </Link>
                            <Link
                                to="/how-it-works"
                                className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/60 px-8 py-4 text-base font-semibold text-white/90 transition-all duration-300 hover:text-white hover:border-cyan-300 hover:bg-white/10 hover:shadow-[0_0_25px_0_rgba(56,189,248,0.3)] hover:-translate-y-1 active:translate-y-0"
                            >
                                LEARN MORE
                            </Link>
                        </div>

                        <ul className="mt-6 space-y-2 text-slate-300 max-w-[70ch]">
                            <li className="flex items-start gap-3">
                                <span className="mt-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                                <span>
                                    <span className="font-normal text-white">
                                        Your privacy is protected.
                                    </span>{" "}
                                    Everything stays on your device.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                                <span>
                                    <span className="font-normal text-white">
                                        No signup. No paywall.
                                    </span>{" "}
                                    Just clarity.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                                <span className="font-normal text-white">
                                    Not legal advice.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
