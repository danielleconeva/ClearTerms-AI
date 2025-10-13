// src/pages/AskPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AskForm from "../components/AskForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { askQuestion } from "../store/docSlice";

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

    // --- Scroll handling (scroll only inside the chat container) ---
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const didMount = useRef(false);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true; // skip initial load to avoid jumping to bottom on refresh
            return;
        }
        const el = chatContainerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, qaStatus]);
    // ---------------------------------------------------------------

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

        // Show the user's question
        setMessages((prev) => [...prev, { type: "user", content: q }]);

        // Dispatch the QA thunk; answer is handled via effect below
        dispatch(askQuestion({ question: q, fullText: "" }));
        setQuestion("");
    };

    // When thunk updates lastQuestion/lastAnswer/status, reflect in chat
    const prevAnswerRef = useRef<string | null>(null);
    useEffect(() => {
        if (qaStatus === "loading" && lastQ) {
            // show a lightweight typing bubble
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
            // remove trailing "Thinking…" if present
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
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="container mx-auto px-6 flex items-center"></div>

            {/* Main */}
            <div className="flex-1 container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                    {/* Title */}
                    <div className="text-center mb-7">
                        <h1 className="text-center text-4xl font-extrabold tracking-tight text-white md:text-5xl animate-fadeUpText">
                            Ask Questions
                        </h1>
                        <div className="mb-4 mt-4 h-[3px] w-70 mx-auto rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-fadeUpText" />
                        <p
                            className="mx-auto mt-10 max-w-3xl text-center text-lg text-slate-300 animate-fadeUpText"
                            style={{ animationDelay: "0.4s" }}
                        >
                            Get instant answers about the Terms &amp; Conditions
                            and make sense of the fine print
                        </p>
                        {!hasContext && (
                            <div
                                className="mt-6 text-sm text-amber-300/90 animate-fadeUpText"
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

                    {/* Chat Area */}
                    <div
                        className="flex-1 rounded-2xl p-6 flex flex-col
              bg-slate-800/55 backdrop-blur-lg
              border-2 border-cyan-400/30 animate-fadeUpText"
                        style={{ animationDelay: "0.6s" }}
                    >
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto space-y-4 mb-6"
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
                                        className={`max-w-[80%] rounded-lg p-4 ${
                                            m.type === "user"
                                                ? "bg-cyan-500/20 border border-cyan-400/50"
                                                : m.type === "system"
                                                ? "bg-yellow-900/30 border border-yellow-400/30"
                                                : "bg-slate-800/60 border border-white/8"
                                        }`}
                                    >
                                        <p className="leading-relaxed text-sm text-white">
                                            {m.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <AskForm
                            value={question}
                            onChange={setQuestion}
                            onSubmit={handleSend}
                            disabled={qaStatus === "loading"}
                        />
                    </div>

                    {/* Suggested Questions */}
                    <div
                        className="mt-10 mb-6 space-y-3 animate-fadeUpText"
                        style={{ animationDelay: "0.75s" }}
                    >
                        <p className="text-s text-slate-400">
                            Suggested questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggested.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setQuestion(q)}
                                    className="px-3 py-1.5 rounded-full border border-white/12
                             hover:bg-white/6 hover:border-cyan-400/30 transition text-sm text-slate-300"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div
                        className="mt-8 mb-8 bg-slate-800/55 border border-white/8 rounded-xl p-4 animate-fadeUpText"
                        style={{ animationDelay: "0.9s" }}
                    >
                        <p className="text-sm leading-relaxed text-center text-slate-400">
                            ⚠️ These answers are generated by AI and are not
                            legal advice. For legal guidance, consult an
                            attorney.
                        </p>
                    </div>
                </div>

                <div
                    className="w-fit mx-auto animate-fadeUpText"
                    style={{ animationDelay: "1.05s" }}
                >
                    <button
                        onClick={() => navigate("/summary")}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/80 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(56,189,248,.5)] active:translate-y-0"
                    >
                        <span className="inline-block rotate-180">➜</span>
                        <span>Back to Summary</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
