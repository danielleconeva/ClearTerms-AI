import { pdfToText } from "./pdf";
import { docxToText } from "./docx";
import { cleanText, enforceSize } from "./sanitize";
import {
    guessKindFromFile,
    isProbablyUrl,
    type SourceKind,
} from "./detect";
import { fetchUrlAsText } from "./url";

export type IngestInput =
    | { type: "file", file: File }
    | { type: "paste", text: string }
    | { type: "url", url: string };

export async function ingestToRawText(input: IngestInput): Promise<string> {
    let raw = "";
    if (input.type === "file") {
        const kind: SourceKind = guessKindFromFile(input.file);

        if (kind === "pdf") {
            raw = await pdfToText(input.file);
        } else if (kind === "docx") {
            raw = await docxToText(input.file);
        } else {
            raw = await input.file.text();
        }
    } else if (input.type === "url") {
        if (!isProbablyUrl(input.url)) {
            throw new Error("Provided URL is invalid.");
        }
        raw = await fetchUrlAsText(input.url);
    } else {
        raw = input.text || "";
    }

    return enforceSize(cleanText(raw));

}
