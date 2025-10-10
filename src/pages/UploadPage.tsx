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
            if (!rawText.trim()) {
                throw new Error("No text content found.");
            }
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
            className="flex-1 container mx-auto px-6 pt-14 pb-20 flex items-center justify-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-full max-w-2xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                        <span className="text-center text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                            Upload Your Document
                        </span>
                    </h1>
                    <div className="mb-12 mt-4 h-[3px] w-70 mx-auto rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] " />
                    <p className="mx-auto mt-4 mb-8 max-w-2xl text-center text-lg text-slate-300 ">
                        Choose how you'd like to provide your Terms & Conditions
                    </p>
                </div>
                <div className="relative">
                    <div
                        className="absolute -inset-4 opacity-20 blur-3xl rounded-full"
                        style={{
                            background:
                                "linear-gradient(to right, hsl(190 100% 50%), hsl(320 80% 60%))",
                        }}
                    />
                    <UploadForm onSubmit={handleSubmit} />
                    {busy && (
                        <p
                            className="mt-3 text-sm text-center"
                            style={{ color: "hsl(0 0% 70%)" }}
                        >
                            Analyzing…
                        </p>
                    )}
                    {error && (
                        <p
                            className="mt-3 text-sm text-center"
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
