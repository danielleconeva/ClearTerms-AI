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

            <section className="relative mx-auto w-full max-w-8xl px-3 sm:px-6 py-8 sm:py-12 md:py-12 lg:py-16 xl:py-20 2xl:py-24 2xl:px-8">
                <div className="flex flex-col items-center gap-8 sm:gap-12 md:flex-row md:items-center md:gap-16 xl:gap-20 2xl:gap-32">
                    <div className="relative flex-1 md:basis-[46%] xl:basis-[42%] 2xl:basis-[40%] flex justify-center animate-imageEnterFloat">
                        <img
                            src={heroImg}
                            alt="Neon abstract"
                            className="h-auto w-[420px] md:w-[540px] lg:w-[640px] xl:w-[720px] 2xl:w-[820px] max-w-full img-soft-left"
                        />
                    </div>

                    <div className="flex-1 px-6 md:basis-[54%] xl:basis-[58%] 2xl:basis-[60%] 2xl:px-20 max-w-none animate-fadeUpText text-center md:text-left">
                        <h1 className="mt-1 mb-4 text-4xl md:text-6xl 2xl:text-7xl font-extrabold leading-tight text-white">
                            ClearTerms AI
                        </h1>

                        <div className="mb-8 h-[3px] w-28 2xl:h-1 2xl:w-36 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] mx-auto md:mx-0" />

                        <h5 className="mt-4 text-xl md:text-3xl 2xl:text-4xl font-light leading-tight text-white">
                            Read the fine print instantly.
                        </h5>

                        <p className="mt-4 text-lg 2xl:text-2xl font-light leading-relaxed text-slate-200 max-w-[75ch] 2xl:max-w-[78ch] mx-0 md:mx-0">
                            Upload a Terms &amp; Conditions file and get a
                            clear, plain-English summary presented as bullet
                            points. Ask follow-up questions and get direct
                            answers based on your document.
                        </p>

                        <div className="mt-14 mb-10 sm:mt-10 sm:mb-0 flex flex-wrap items-center justify-center md:justify-start gap-5 2xl:gap-6">
                            <Link
                                to="/upload"
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-cyan-400/80 px-8 py-4 text-base 2xl:px-12 2xl:py-6 2xl:text-xl font-semibold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_40px_0_rgba(56,189,248,0.5)] hover:-translate-y-1 active:translate-y-0"
                            >
                                GET STARTED
                            </Link>
                            <Link
                                to="/how-it-works"
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-cyan-400/60 px-8 py-4 text-base 2xl:px-12 2xl:py-6 2xl:text-xl font-semibold text-white/90 transition-all duration-300 hover:text-white hover:border-cyan-300 hover:bg-white/10 hover:shadow-[0_0_25px_0_rgba(56,189,248,0.3)] hover:-translate-y-1 active:translate-y-0"
                            >
                                LEARN MORE
                            </Link>
                        </div>

                        <ul className="mt-6 space-y-2 text-slate-300 max-w-[71ch] 2xl:max-w-[76ch] mx-auto md:mx-0 2xl:text-xl">
                            <li className="flex items-start gap-3 2xl:gap-4 justify-center md:justify-start">
                                <span className="mt-2 h-2 w-2 2xl:h-3 2xl:w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] shrink-0 min-w-[0.5rem] min-h-[0.5rem]" />
                                <span className="text-center md:text-left">
                                    <span className="font-normal text-white">
                                        Your privacy is protected.
                                    </span>{" "}
                                    Everything stays on your device.
                                </span>
                            </li>

                            <li className="flex items-start gap-3 2xl:gap-4 justify-center md:justify-start">
                                <span className="mt-2 h-2 w-2 2xl:h-3 2xl:w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] shrink-0 min-w-[0.5rem] min-h-[0.5rem]" />
                                <span className="text-center md:text-left">
                                    <span className="font-normal text-white">
                                        No signup. No paywall.
                                    </span>{" "}
                                    Just clarity.
                                </span>
                            </li>

                            <li className="flex items-start gap-3 2xl:gap-4 justify-center md:justify-start">
                                <span className="mt-2 h-2 w-2 2xl:h-3 2xl:w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] shrink-0 min-w-[0.5rem] min-h-[0.5rem]" />
                                <span className="font-normal text-white text-center md:text-left">
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
