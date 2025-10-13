import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AskForm from "../components/AskForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { askQuestion } from "../store/docSlice";
import { AlertTriangle } from "lucide-react";

type Message = {
    type: "user" | "assistant" | "system";
    content: string;
};

export default function AskPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const analysis = useAppSelector((s) => s.doc.analysis);
    const qaStatus = useAppSelector((s) => s.doc.qa.status);
    const lastQ = useAppSelector((s) => s.doc.qa.lastQuestion);
    const lastA = useAppSelector((s) => s.doc.qa.lastAnswer);
    const qaError = useAppSelector((s) => s.doc.qa.error);

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState<Message[]>([
        {
            type: "assistant",
            content:
                'Hi! I\'m here to help you understand the Terms & Conditions. Ask me anything like "Can I cancel anytime?" or "Do they share my data?"',
        },
    ]);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const didMount = useRef(false);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        const el = chatContainerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, qaStatus]);

    const hasContext = useMemo(() => !!analysis?.chunks?.length, [analysis]);

    const handleSend = () => {
        const q = question.trim();
        if (!q) return;

        if (!hasContext) {
            setMessages((prev) => [
                ...prev,
                { type: "user", content: q },
                {
                    type: "system",
                    content:
                        "I need a document context to answer. Please go to Summary, paste your Terms text, and run Analyze first.",
                },
            ]);
            setQuestion("");
            return;
        }

        setMessages((prev) => [...prev, { type: "user", content: q }]);

        dispatch(askQuestion({ question: q, fullText: "" }));
        setQuestion("");
    };

    const prevAnswerRef = useRef<string | null>(null);
    useEffect(() => {
        if (qaStatus === "loading" && lastQ) {
            setMessages((prev) => [
                ...prev,
                {
                    type: "assistant",
                    content: "Thinking…",
                },
            ]);
        }
    }, [qaStatus, lastQ]);

    useEffect(() => {
        if (qaStatus === "failed" && qaError) {
            setMessages((prev) => [
                ...prev.filter(
                    (m, i, arr) =>
                        !(
                            m.type === "assistant" &&
                            m.content === "Thinking…" &&
                            i === arr.length - 1
                        )
                ),
                {
                    type: "assistant",
                    content: "Not found in the provided text.",
                },
            ]);
            prevAnswerRef.current = null;
        }
    }, [qaStatus, qaError]);

    useEffect(() => {
        const newAnswer = lastA?.answer?.trim() || null;
        if (
            qaStatus === "succeeded" &&
            newAnswer &&
            newAnswer !== prevAnswerRef.current
        ) {
            setMessages((prev) => {
                const copy = [...prev];
                if (
                    copy.length &&
                    copy[copy.length - 1].type === "assistant" &&
                    copy[copy.length - 1].content === "Thinking…"
                ) {
                    copy.pop();
                }
                copy.push({ type: "assistant", content: newAnswer });
                return copy;
            });
            prevAnswerRef.current = newAnswer;
        }
    }, [qaStatus, lastA]);

    const suggested = [
        "Can I cancel anytime?",
        "Do they share my data?",
        "Can I sue them in court?",
        "What happens if they change the service?",
    ];

    return (
        <div className="flex flex-col">
            <div className="container mx-auto px-4 sm:px-6 flex items-center"></div>

            <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-10 xl:py-12 2xl:py-14">
                <div className="max-w-2xl sm:max-w-3xl xl:max-w-3xl 2xl:max-w-4xl mx-auto h-full flex flex-col">
                    <div className="text-center mb-5 sm:mb-6 xl:mb-7 2xl:mb-8">
                        <h1 className="text-center text-4xl sm:text-4xl xl:text-4xl 2xl:text-5xl md:text-5xl xl:md:text-5xl 2xl:md:text-6xl font-extrabold tracking-tight text-white animate-fadeUpText">
                            Ask Questions
                        </h1>
                        <div className="mb-3 sm:mb-4 xl:mb-4 2xl:mb-5 mt-3 sm:mt-4 2xl:mt-5 h-[3px] w-56 sm:w-64 xl:w-70 2xl:w-80 mx-auto rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-fadeUpText" />
                        <p
                            className="mx-auto mt-6 sm:mt-8 xl:mt-10 2xl:mt-12 max-w-2xl sm:max-w-3xl 2xl:max-w-4xl text-center text-lg sm:text-lg xl:text-lg 2xl:text-xl text-slate-300 animate-fadeUpText"
                            style={{ animationDelay: "0.4s" }}
                        >
                            Get instant answers about the Terms &amp; Conditions
                            and make sense of the fine print
                        </p>
                        {!hasContext && (
                            <div
                                className="mt-4 sm:mt-5 xl:mt-6 2xl:mt-7 text-xs sm:text-sm 2xl:text-base text-amber-300/90 animate-fadeUpText"
                                style={{ animationDelay: "0.5s" }}
                            >
                                No analyzed document found.{" "}
                                <button
                                    onClick={() => navigate("/summary")}
                                    className="underline decoration-dotted underline-offset-4 hover:text-amber-200 transition"
                                >
                                    Go analyze a document first
                                </button>
                                .
                            </div>
                        )}
                    </div>

                    <div
                        className="flex-1 my-4 rounded-xl sm:rounded-2xl p-4 sm:p-5 xl:p-6 2xl:p-7 flex flex-col
              bg-slate-800/55 backdrop-blur-lg
              border-2 border-cyan-400/30 animate-fadeUpText"
                        style={{ animationDelay: "0.6s" }}
                    >
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 2xl:space-y-5 mb-4 sm:mb-5 xl:mb-6 2xl:mb-7"
                        >
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${
                                        m.type === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 2xl:p-5 ${
                                            m.type === "user"
                                                ? "bg-cyan-500/20 border border-cyan-400/50"
                                                : m.type === "system"
                                                ? "bg-yellow-900/30 border border-yellow-400/30"
                                                : "bg-slate-800/60 border border-white/8"
                                        }`}
                                    >
                                        <p className="leading-relaxed text-xs sm:text-sm 2xl:text-base text-white">
                                            {m.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <AskForm
                            value={question}
                            onChange={setQuestion}
                            onSubmit={handleSend}
                            disabled={qaStatus === "loading"}
                        />
                    </div>

                    <div
                        className="mt-6 sm:mt-8 xl:mt-10 2xl:mt-12 mb-4 sm:mb-5 xl:mb-6 2xl:mb-7 space-y-2.5 sm:space-y-3 2xl:space-y-4 animate-fadeUpText"
                        style={{ animationDelay: "0.75s" }}
                    >
                        <p className="text-xs sm:text-sm 2xl:text-base text-slate-400">
                            Suggested questions:
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 2xl:gap-2.5">
                            {suggested.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setQuestion(q)}
                                    className="px-2.5 sm:px-3 2xl:px-4 py-1 sm:py-1.5 2xl:py-2 rounded-full border border-white/12
                             hover:bg-white/6 hover:border-cyan-400/30 transition text-xs sm:text-sm 2xl:text-base text-slate-300"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        className="mt-6 sm:mt-7 xl:mt-8 2xl:mt-10 mb-6 sm:mb-7 xl:mb-8 2xl:mb-10 bg-slate-800/55 border border-white/8 rounded-lg sm:rounded-xl p-3 sm:p-4 2xl:p-5 animate-fadeUpText"
                        style={{ animationDelay: "0.9s" }}
                    >
                        <p className="text-xs sm:text-sm 2xl:text-base leading-relaxed text-center flex items-start justify-center gap-1 text-slate-400">
                            <AlertTriangle
                                className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6 text-yellow-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                            />
                            <span>
                                These answers are generated by AI and are not
                                legal advice. For legal guidance, consult an
                                attorney.
                            </span>
                        </p>
                    </div>
                </div>

                <div
                    className="w-fit mx-auto animate-fadeUpText"
                    style={{ animationDelay: "1.05s" }}
                >
                    <button
                        onClick={() => navigate("/summary")}
                        className="mt-4 sm:mt-5 xl:mt-6 2xl:mt-7 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-cyan-400/80 px-6 sm:px-7 xl:px-8 2xl:px-9 py-3 sm:py-3.5 xl:py-4 2xl:py-5 text-sm sm:text-base 2xl:text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(56,189,248,.5)] active:translate-y-0"
                    >
                        <span className="inline-block rotate-180">➜</span>
                        <span>Back to Summary</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
