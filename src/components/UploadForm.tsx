import { useState } from "react";
import { Upload, Link as LinkIcon, FileText, Sparkles } from "lucide-react";

export type UploadFormResult =
    | { kind: "file"; file: File }
    | { kind: "url"; url: string }
    | { kind: "text"; text: string };

type Props = {
    onSubmit: (result: UploadFormResult) => void;
};

export default function UploadForm({ onSubmit }: Props) {
    const [activeTab, setActiveTab] = useState<"file" | "url" | "text">("file");
    const [textContent, setTextContent] = useState("");
    const [urlContent, setUrlContent] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const analyzeDisabled =
        (activeTab === "text" && !textContent.trim()) ||
        (activeTab === "url" && !urlContent.trim()) ||
        (activeTab === "file" && !file);

    const handleSubmit = () => {
        if (activeTab === "text" && textContent.trim()) {
            onSubmit({ kind: "text", text: textContent });
        } else if (activeTab === "url" && urlContent.trim()) {
            onSubmit({ kind: "url", url: urlContent });
        } else if (activeTab === "file" && file) {
            onSubmit({ kind: "file", file });
        }
    };

    return (
        <div
            className="
        relative rounded-2xl
        bg-gradient-to-br from-[hsl(230_60%_14%/0.75)] to-[hsl(230_60%_9%/0.75)]
        backdrop-blur-lg
        border-2 border-[hsl(190_100%_50%/0.25)]
        p-8
        shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)]
        text-[hsl(0_0%_100%)]
      "
        >
            {/* Tabs */}
            <div className="mb-6 flex gap-2 p-1 rounded-lg bg-[hsl(230_40%_18%/0.55)]">
                <button
                    onClick={() => setActiveTab("file")}
                    className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center gap-2 transition
            ${
                activeTab === "file"
                    ? "bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)]"
                    : "text-[hsl(0_0%_80%)] hover:text-[hsl(0_0%_100%)]"
            }`}
                >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">UPLOAD FILE</span>
                </button>

                <button
                    onClick={() => setActiveTab("url")}
                    className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center gap-2 transition
            ${
                activeTab === "url"
                    ? "bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)]"
                    : "text-[hsl(0_0%_80%)] hover:text-[hsl(0_0%_100%)]"
            }`}
                >
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">PASTE URL</span>
                </button>

                <button
                    onClick={() => setActiveTab("text")}
                    className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center gap-2 transition
            ${
                activeTab === "text"
                    ? "bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)]"
                    : "text-[hsl(0_0%_80%)] hover:text-[hsl(0_0%_100%)]"
            }`}
                >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">PASTE TEXT</span>
                </button>
            </div>

            <div className="min-h-[300px]">
                {activeTab === "file" && (
                    <div className="space-y-4">
                        <label
                            htmlFor="file-upload"
                            className="
                block border-2 border-dashed
                border-[hsl(190_100%_50%/0.35)]
                rounded-xl p-12 text-center transition cursor-pointer
                hover:border-[hsl(190_100%_50%/0.6)]
                bg-[hsl(230_60%_12%/0.55)]
              "
                        >
                            <Upload className="w-12 h-12 mx-auto mb-4 text-[hsl(190_100%_50%)]" />
                            <p className="text-lg font-medium mb-2">
                                Drop your T&Cs file here
                            </p>
                            <p className="text-sm text-[hsl(0_0%_75%)] mb-4">
                                or click to browse
                            </p>

                            <span
                                className="
                  inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-lg font-medium
                  bg-[hsl(230_60%_12%/0.8)]
                  backdrop-blur
                  border border-[hsl(190_100%_50%/0.45)]
                  hover:border-[hsl(190_100%_50%/0.6)]
                  hover:bg-[hsl(230_60%_12%/0.92)]
                  transition
                  cursor-pointer
                "
                            >
                                Browse Files
                            </span>
                        </label>

                        <input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                            }
                        />

                        {file && (
                            <p className="text-sm text-[hsl(190_100%_50%)] flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {file.name}
                            </p>
                        )}
                    </div>
                )}

                {activeTab === "url" && (
                    <div>
                        <label className="block text-sm font-medium mb-4">
                            Enter Terms &amp; Conditions URL
                        </label>
                        <input
                            placeholder="https://example.com/terms-and-conditions"
                            value={urlContent}
                            onChange={(e) => setUrlContent(e.target.value)}
                            className="
        w-full rounded-lg
        bg-[hsl(230_40%_22%/0.55)]
        border border-[hsl(190_100%_50%/0.35)]
        px-4 py-4
        text-[hsl(0_0%_100%)]
        placeholder:text-[hsl(0_0%_78%)]
        focus:border-[hsl(190_100%_50%/0.65)]
        focus:ring-2 focus:ring-[hsl(190_100%_50%/0.4)]
        outline-none
      "
                        />
                        <p className="mt-2 text-xs text-[hsl(0_0%_78%)]">
                            We’ll fetch and analyze the terms directly from the
                            webpage.
                        </p>
                    </div>
                )}

                {activeTab === "text" && (
                    <div>
                        <label className="block text-sm font-medium mb-4">
                            Paste Terms &amp; Conditions Text
                        </label>
                        <textarea
                            placeholder="Paste the full terms and conditions text here..."
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="
      w-full min-h-[250px] rounded-lg
      bg-[hsl(230_40%_22%/0.55)]
      border border-[hsl(190_100%_50%/0.35)]
      px-4 py-4
      text-[hsl(0_0%_100%)]
      placeholder:text-[hsl(0_0%_78%)]
      focus:border-[hsl(190_100%_50%/0.65)]
      focus:ring-2 focus:ring-[hsl(190_100%_50%/0.4)]
      outline-none resize-none
    "
                        />
                    </div>
                )}
            </div>
            <div className="mt-4 mb-10 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={analyzeDisabled}
                    className={`
      inline-flex items-center justify-center gap-2
      h-11 px-6 rounded-lg font-medium text-base
      bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)]
      transition-all duration-200
      hover:bg-[hsl(190_100%_60%)]
      hover:scale-[1.03]
      focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-[hsl(190_100%_50%/0.4)]
      shadow-[0_8px_20px_-10px_rgba(0,0,0,0.35)]
      disabled:opacity-60 disabled:cursor-not-allowed
    `}
                >
                    <Sparkles className="w-5 h-5" />
                    Analyze with AI
                </button>
            </div>

            <p className="mt-4 text-xs text-center text-[hsl(0_0%_78%)]">
                This is not legal advice. For legal guidance, consult a
                qualified attorney.
            </p>
        </div>
    );
}
