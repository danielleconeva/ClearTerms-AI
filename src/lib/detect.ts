export type SourceKind = "pdf" | "docx" | "text";
export function guessKindFromFile(file: File): SourceKind {
    const mimeType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (mimeType.includes("pdf") || fileName.endsWith(".pdf")) return "pdf";
    if (mimeType.includes("word") || fileName.endsWith(".docx")) return "docx";
    return "text";
}

export function isProbablyUrl(input: string): boolean {
    try {
        const parsedUrl = new URL(input);
        const hasHttpProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
        const hasHostname = !!parsedUrl.hostname;
        return hasHttpProtocol && hasHostname;
    } catch {
        return false;
    }
}