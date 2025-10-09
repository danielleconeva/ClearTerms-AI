import mammoth from "mammoth";

export async function docxToText(file: File | ArrayBuffer): Promise<string> {
    const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value || "";

}