import UploadForm, { type UploadFormResult } from "../components/UploadForm";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setRawText, analyzeDocument } from "../store/docSlice";
import { ingestToRawText } from "../lib/ingest";
import { useState } from "react";

export default function UploadPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (result: UploadFormResult) => {
        setError(null);
        setBusy(true);
        try {
            const rawText = await ingestToRawText(
                result.kind === "file"
                    ? { type: "file", file: result.file }
                    : result.kind === "url"
                    ? { type: "url", url: result.url }
                    : { type: "paste", text: result.text }
            );
            if (!rawText.trim()) throw new Error("No text content found.");
            dispatch(setRawText(rawText));
            await dispatch(analyzeDocument({ rawText })).unwrap();
            navigate("/summary");
        } catch (e: any) {
            setError(e?.message || "Failed to analyze document.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className="
                flex-1 container mx-auto
                px-4 sm:px-6 xl:px-6 2xl:px-8
                pt-8 sm:pt-10 xl:pt-14 2xl:pt-16
                pb-10 sm:pb-16 xl:pb-20 2xl:pb-24
                flex items-start md:items-center justify-start md:justify-center
                min-h-0 md:min-h-screen
            "
        >
            <div className="w-full max-w-xl sm:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl">
                <div className="text-center mb-8 sm:mb-10 xl:mb-12 2xl:mb-14">
                    <h1 className="text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-white animate-fadeUpText">
                        Upload Your Document
                    </h1>
                    <div className="mb-8 sm:mb-10 xl:mb-12 2xl:mb-14 mt-3 sm:mt-4 2xl:mt-5 h-[3px] w-56 sm:w-64 xl:w-72 2xl:w-80 mx-auto rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-fadeUpText" />
                    <p
                        className="mx-auto mt-3 sm:mt-4 2xl:mt-5 mb-6 sm:mb-8 2xl:mb-10 max-w-xl sm:max-w-2xl 2xl:max-w-3xl text-center text-lg sm:text-lg xl:text-lg 2xl:text-xl text-slate-300 animate-fadeUpText"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Choose how you'd like to provide your Terms &amp;
                        Conditions
                    </p>
                </div>
                <div
                    className="relative animate-fadeUpText"
                    style={{ animationDelay: "0.4s" }}
                >
                    <div
                        className="absolute -inset-3 sm:-inset-4 2xl:-inset-5 opacity-20 blur-3xl rounded-full"
                        style={{
                            background:
                                "linear-gradient(to right, hsl(190 100% 50%), hsl(320 80% 60%))",
                        }}
                    />
                    <UploadForm onSubmit={handleSubmit} />
                    {busy && (
                        <p
                            className="mt-2 sm:mt-3 2xl:mt-4 text-sm xl:text-sm 2xl:text-base text-center"
                            style={{ color: "hsl(0 0% 70%)" }}
                        >
                            Analyzing…
                        </p>
                    )}
                    {error && (
                        <p
                            className="mt-2 sm:mt-3 2xl:mt-4 text-sm xl:text-sm 2xl:text-base text-center"
                            style={{ color: "hsl(0 84.2% 60.2%)" }}
                            role="alert"
                        >
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
