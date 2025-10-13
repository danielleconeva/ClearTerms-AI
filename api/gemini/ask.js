import { GoogleGenerativeAI } from "@google/generative-ai";
export const config = { maxDuration: 30 };

const NOT_FOUND = "Not found in the provided text.";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const key = process.env.GOOGLE_API_KEY || "";
    if (!key) return res.status(500).json({ answer: NOT_FOUND, error: "missing_key" });

    try {
        const { question, context } = req.body || {};
        const q = String(question || "").trim();
        const ctx = String(context || "").trim();
        if (!q || !ctx) return res.json({ answer: NOT_FOUND });

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const sys =
            "Answer ONLY from the provided context. If the answer is not present, reply exactly: 'Not found in the provided text.' Be concise (1–3 short sentences).";
        const prompt = `${sys}\n\nQuestion: ${q}\n\nContext:\n"""${ctx}"""`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 220 },
        });

        const answer = (result.response.text() || "").trim() || NOT_FOUND;
        return res.json({ answer });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ answer: NOT_FOUND, error: "qa_failed" });
    }
}
