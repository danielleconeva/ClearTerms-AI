import type { KeyboardEvent } from "react";

type AskFormProps = {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    disabled?: boolean;
};

export default function AskForm({
    value,
    onChange,
    onSubmit,
    placeholder = "Type your question here... (e.g., Can I cancel anytime?)",
    disabled = false,
}: AskFormProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (e.key === "Enter") onSubmit();
    };

    const btnBase =
        "grid place-items-center rounded-lg px-3 sm:px-4 2xl:px-5 min-w-10 sm:min-w-12 2xl:min-w-14 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(190_100%_50%/0.4)] shadow-[0_4px_12px_-6px_rgba(0,0,0,0.35)]";
    const btnEnabled =
        "bg-[hsl(190_100%_50%)] text-[hsl(230_60%_8%)] hover:bg-[hsl(190_100%_60%)] hover:scale-[1.03] cursor-pointer";
    const btnDisabled =
        "bg-[hsl(190_30%_35%/0.7)] text-[hsl(230_20%_85%/0.8)] opacity-60 cursor-not-allowed pointer-events-none";

    return (
        <div className="flex gap-2 sm:gap-3 2xl:gap-4">
            <input
                value={value}
                onChange={(e) => onChange((e.target as HTMLInputElement).value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 rounded-lg px-3 sm:px-4 2xl:px-5 py-2.5 sm:py-3 2xl:py-4
                    bg-[hsl(230_40%_22%/0.55)]
                    border border-[hsl(190_100%_50%/0.35)]
                    text-sm sm:text-base 2xl:text-lg text-white
                    placeholder:text-[hsl(0_0%_78%)]
                    focus:outline-none
                    focus:border-[hsl(190_100%_50%/0.65)]
                    focus:ring-2
                    focus:ring-[hsl(190_100%_50%/0.4)]
                    transition"
            />
            <button
                type="button"
                onClick={onSubmit}
                disabled={disabled}
                aria-busy={disabled ? "true" : "false"}
                className={[btnBase, disabled ? btnDisabled : btnEnabled].join(
                    " "
                )}
                aria-label="Send question"
                title={disabled ? "Answering..." : "Send"}
            >
                {disabled ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="9" opacity="0.25" />
                        <path d="M21 12a9 9 0 0 1-9 9" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14M13 5l7 7-7 7"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}
