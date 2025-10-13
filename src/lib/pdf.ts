// src/lib/pdf.ts
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker&url";

GlobalWorkerOptions.workerSrc = pdfWorker;

export async function pdfToText(file: File | ArrayBuffer): Promise<string> {
    const data = file instanceof File ? await file.arrayBuffer() : file;
    const loadingTask = getDocument({ data });
    const pdf = await loadingTask.promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        let line = "";
        let prevX: number | null = null;

        for (const it of content.items as any[]) {
            const s = typeof it.str === "string" ? it.str : "";
            const tr = it.transform || it?.transform || [1, 0, 0, 1, 0, 0];
            const x = tr[4] ?? null;

            if (prevX !== null && x !== null && x - prevX > 2.5) line += " ";
            line += s;
            prevX = x;
            if ((it as any).hasEOL) {
                pages.push(line);
                line = "";
                prevX = null;
            }
        }
        if (line) pages.push(line);
    }
    return pages.join("\n\n");
}
