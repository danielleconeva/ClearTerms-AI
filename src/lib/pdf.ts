import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

export async function pdfToText(file: File | ArrayBuffer): Promise<string> {
    const data = file instanceof File ? await file.arrayBuffer() : file;
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((it: any) => ("str" in it ? (it as any).str : ""))
            .join(" ");
        pages.push(text);
    }
    return pages.join("\n\n")
}
