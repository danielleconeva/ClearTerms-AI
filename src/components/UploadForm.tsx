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
        relative rounded-xl sm:rounded-2xl
        bg-gradient-to-br from-[hsl(230_60%_14%/0.75)] to-[hsl(230_60%_9%/0.75)]
        backdrop-blur-lg
        border-2 border-[hsl(190_100%_50%/0.25)]
        p-5 sm:p-6 xl:p-8 2xl:p-10
        shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)]
        text-[hsl(0_0%_100%)]
      "
        >
            <div
                className="
          mb-5 sm:mb-5 xl:mb-6 2xl:mb-7
          flex flex-wrap gap-2 sm:gap-2
          p-1 sm:p-1 rounded-lg
          bg-[hsl(230_40%_18%/0.55)]
        "
            >
                <button
                    onClick={() => setActiveTab("file")}
                    className={`flex-1 min-w-[31%]
            py-2.5 sm:py-2.5 xl:py-3 2xl:py-3.5
            px-3 sm:px-3 xl:px-4 2xl:px-5
            rounded-md flex items-center justify-center
            gap-2 sm:gap-2 transition
            ${
                activeTab === "file"
                    ? "bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)]"
                    : "text-[hsl(0_0%_80%)] hover:text-[hsl(0_0%_100%)]"
            }`}
                >
                    <Upload className="w-4 h-4 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
                    <span className="text-sm sm:text-sm xl:text-sm 2xl:text-base font-medium">
                        UPLOAD FILE
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("url")}
                    className={`flex-1 min-w-[31%]
            py-2.5 sm:py-2.5 xl:py-3 2xl:py-3.5
            px-3 sm:px-3 xl:px-4 2xl:px-5
            rounded-md flex items-center justify-center
            gap-2 sm:gap-2 transition
            ${
                activeTab === "url"
                    ? "bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)]"
                    : "text-[hsl(0_0%_80%)] hover:text-[hsl(0_0%_100%)]"
            }`}
                >
                    <LinkIcon className="w-4 h-4 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
                    <span className="text-sm sm:text-sm xl:text-sm 2xl:text-base font-medium">
                        PASTE URL
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("text")}
                    className={`flex-1 min-w-[31%]
            py-2.5 sm:py-2.5 xl:py-3 2xl:py-3.5
            px-3 sm:px-3 xl:px-4 2xl:px-5
            rounded-md flex items-center justify-center
            gap-2 sm:gap-2 transition
            ${
                activeTab === "text"
                    ? "bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)]"
                    : "text-[hsl(0_0%_80%)] hover:text-[hsl(0_0%_100%)]"
            }`}
                >
                    <FileText className="w-4 h-4 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
                    <span className="text-sm sm:text-sm xl:text-sm 2xl:text-base font-medium">
                        PASTE TEXT
                    </span>
                </button>
            </div>

            <div className="min-h-[250px] sm:min-h-[280px] xl:min-h-[300px] 2xl:min-h-[340px]">
                {activeTab === "file" && (
                    <div className="space-y-4 sm:space-y-4">
                        <label
                            htmlFor="file-upload"
                            className="
                block border-2 border-dashed
                border-[hsl(190_100%_50%/0.35)]
                rounded-lg sm:rounded-xl p-8 sm:p-10 xl:p-12 2xl:p-14 text-center transition cursor-pointer
                hover:border-[hsl(190_100%_50%/0.6)]
                bg-[hsl(230_60%_12%/0.55)]
              "
                        >
                            <Upload className="w-10 h-10 sm:w-11 sm:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 mx-auto mb-4 sm:mb-4 2xl:mb-5 text-[hsl(190_100%_50%)]" />
                            <p className="text-base sm:text-lg xl:text-lg 2xl:text-xl font-medium mb-2">
                                Drop your T&Cs file here
                            </p>
                            <p className="text-xs sm:text-sm xl:text-sm 2xl:text-base text-[hsl(0_0%_75%)] mb-4">
                                or click to browse
                            </p>

                            <span
                                className="
                  inline-flex items-center justify-center gap-2 h-10 sm:h-11 xl:h-11 2xl:h-12 px-5 sm:px-5 2xl:px-6 text-sm sm:text-sm xl:text-sm 2xl:text-base rounded-lg font-medium
                  bg-[hsl(230_60%_12%/0.8)]
                  backdrop-blur
                  border border-[hsl(190_100%_50%/0.45)]
                  hover:border-[hsl(190_100%_50%/0.6)]
                  hover:bg-[hsl(230_60%_12%/0.92)]
                  transition cursor-pointer
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
                            <p className="text-sm sm:text-sm xl:text-sm 2xl:text-base text-[hsl(190_100%_50%)] flex items-center gap-2">
                                <FileText className="w-4 h-4 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
                                {file.name}
                            </p>
                        )}
                    </div>
                )}

                {activeTab === "url" && (
                    <div className="space-y-3 sm:space-y-4">
                        <label className="block text-sm sm:text-sm xl:text-sm 2xl:text-base font-medium mb-2 sm:mb-3 2xl:mb-5">
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
                px-4 sm:px-4 2xl:px-5 py-4 sm:py-4 2xl:py-5
                text-base sm:text-base 2xl:text-lg text-[hsl(0_0%_100%)]
                placeholder:text-[hsl(0_0%_78%)]
                focus:border-[hsl(190_100%_50%/0.65)]
                focus:ring-2 focus:ring-[hsl(190_100%_50%/0.4)]
                outline-none
              "
                        />
                        <p className="mt-2 sm:mt-2 text-xs xl:text-xs 2xl:text-sm text-[hsl(0_0%_78%)]">
                            We'll fetch and analyze the terms directly from the
                            webpage.
                        </p>
                    </div>
                )}

                {activeTab === "text" && (
                    <div className="space-y-3 sm:space-y-4">
                        <label className="block text-sm sm:text-sm xl:text-sm 2xl:text-base font-medium mb-2 sm:mb-3 2xl:mb-5">
                            Paste Terms &amp; Conditions Text
                        </label>
                        <textarea
                            placeholder="Paste the full terms and conditions text here..."
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="
                w-full min-h-[240px] sm:min-h-[230px] xl:min-h-[250px] 2xl:min-h-[280px] rounded-lg
                bg-[hsl(230_40%_22%/0.55)]
                border border-[hsl(190_100%_50%/0.35)]
                px-4 sm:px-4 2xl:px-5 py-4 sm:py-4 2xl:py-5
                text-base sm:text-base 2xl:text-lg text-[hsl(0_0%_100%)]
                placeholder:text-[hsl(0_0%_78%)]
                focus:border-[hsl(190_100%_50%/0.65)]
                focus:ring-2 focus:ring-[hsl(190_100%_50%/0.4)]
                outline-none resize-none
              "
                        />
                    </div>
                )}
            </div>

            <div className="mt-4 sm:mt-4 2xl:mt-5 mb-6 sm:mb-8 xl:mb-10 2xl:mb-12 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={analyzeDisabled}
                    className={`
            inline-flex items-center justify-center gap-2 my-2
            h-11 sm:h-11 xl:h-11 2xl:h-12 px-6 sm:px-6 2xl:px-7 rounded-lg font-medium
            text-base sm:text-base 2xl:text-lg
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
                    <Sparkles className="w-5 h-5 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6" />
                    Analyze with AI
                </button>
            </div>

            <p className="mt-3 sm:mt-4 text-xs xl:text-xs 2xl:text-sm text-center text-[hsl(0_0%_78%)]">
                This is not legal advice. For legal guidance, consult a
                qualified attorney.
            </p>
        </div>
    );
}
