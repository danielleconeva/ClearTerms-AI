import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Analysis, Highlight, QAResult, RiskHit } from "../types";
import { splitIntoChunks } from "../lib/chunk";


export const analyzeDocument = createAsyncThunk<Analysis, { rawText: string }>("doc/analyzeDocument", async ({ rawText }) => {
    const chunks = splitIntoChunks(rawText);
    const first = chunks[0]?.text ?? "";
    const sentences = first.split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 3);

    const bullets = sentences.length ? sentences : ["Summary will appear here once analysis runs."];

    const risks: RiskHit[] = [];

    return { chunks, bullets, risks }

});

export const askQuestion = createAsyncThunk<QAResult, { question: string, fullText: string }>("doc/askQuestion", async ({ question }) => {
    return {
        answer:
            `Prototype answer for: “${question}”. ` +
            `Retrieval & citations coming in the next step.`,
        citations: [],
    };
});

type Status = "idle" | "loading" | "succeeded" | "failed";

type DocState = {
    rawText: string;
    analysis: Analysis | null;
    highlight: Highlight;
    qa: {
        lastQuestion: string | null;
        lastAnswer: QAResult | null;
        status: Status;
        error: string | null;
    };
    analyzeStatus: Status;
    analyzeError: string | null;
};

const initialState: DocState = {
    rawText: "",
    analysis: null,
    highlight: null,
    qa: {
        lastQuestion: null,
        lastAnswer: null,
        status: "idle",
        error: null,
    },
    analyzeStatus: "idle",
    analyzeError: null,
};

const docSlice = createSlice({
    name: "doc",
    initialState,
    reducers: {
        setRawText(state, action: PayloadAction<string>) {
            state.rawText = action.payload;
        },
        setHighlight(state, action: PayloadAction<Highlight>) {
            state.highlight = action.payload;
        },
        clearDocument(state) {
            state.rawText = "";
            state.analysis = null;
            state.highlight = null;
            state.qa = {
                lastQuestion: null,
                lastAnswer: null,
                status: "idle",
                error: null,
            };
            state.analyzeStatus = "idle";
            state.analyzeError = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(analyzeDocument.pending, state => {
                state.analyzeStatus = "loading";
                state.analyzeError = null;
            })
            .addCase(analyzeDocument.fulfilled, (state, action) => {
                state.analyzeStatus = "succeeded";
                state.analysis = action.payload;
            })
            .addCase(analyzeDocument.rejected, (state, action) => {
                state.analyzeStatus = "failed";
                state.analyzeError = action.error.message || "Analysis failed.";
            })
            .addCase(askQuestion.pending, state => {
                state.qa.status = "loading";
                state.qa.error = null;
            })
            .addCase(askQuestion.fulfilled, (state, action) => {
                state.qa.status = "succeeded";
                state.qa.lastAnswer = action.payload;
            })
            .addCase(askQuestion.rejected, (state, action) => {
                state.qa.status = "failed";
                state.qa.error = action.error.message || "Q&A failed.";
            })
    }
})

export const { setRawText, setHighlight, clearDocument } = docSlice.actions;
export default docSlice.reducer;