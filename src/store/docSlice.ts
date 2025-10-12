import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Analysis, Highlight, QAResult } from "../types";
import { splitIntoChunks } from "../lib/chunk";
import { summarizeAllAI } from "../features/analyze";
import { answerQuestionAI } from "../features/ask";

export const analyzeDocument = createAsyncThunk<Analysis, { rawText: string }>(
    "doc/analyzeDocument",
    async ({ rawText }) => {
        const chunks = splitIntoChunks(rawText);
        const { bullets } = await summarizeAllAI(chunks);
        const risks = [] as Analysis["risks"];

        return { chunks, bullets, risks };
    }
);

export const askQuestion = createAsyncThunk<
    QAResult,
    { question: string; fullText: string },
    { state: { doc: { analysis: Analysis | null } } }
>("doc/askQuestion", async ({ question }, thunkApi) => {
    const analysis = thunkApi.getState().doc.analysis;
    const chunks = analysis?.chunks ?? [];
    return answerQuestionAI(question, chunks);
});

type Status = "idle" | "loading" | "succeeded" | "failed";

type DocState = {
    rawText: string;
    analysis: Analysis | null;
    highlight: Highlight | null;
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
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(analyzeDocument.pending, (s) => {
                s.analyzeStatus = "loading";
                s.analyzeError = null;
            })
            .addCase(analyzeDocument.fulfilled, (s, a) => {
                s.analyzeStatus = "succeeded";
                s.analysis = a.payload;
            })
            .addCase(analyzeDocument.rejected, (s, a) => {
                s.analyzeStatus = "failed";
                s.analyzeError = a.error.message || "Analysis failed.";
            })
            .addCase(askQuestion.pending, (s, a) => {
                s.qa.status = "loading";
                s.qa.error = null;
                s.qa.lastQuestion = a.meta.arg.question;
            })
            .addCase(askQuestion.fulfilled, (s, a) => {
                s.qa.status = "succeeded";
                s.qa.lastAnswer = a.payload;
            })
            .addCase(askQuestion.rejected, (s, a) => {
                s.qa.status = "failed";
                s.qa.error = a.error.message || "Q&A failed.";
            });
    },
});

export const { setRawText, setHighlight, clearDocument } = docSlice.actions;
export default docSlice.reducer;
