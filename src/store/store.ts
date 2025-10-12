import { configureStore } from "@reduxjs/toolkit";
import docReducer, { clearDocument } from "./docSlice";


type DocPersist = {
    rawText: string;
    analysis: any | null;
};

const STORAGE_KEY = "clearterms_doc_v1";

function loadDocState(): DocPersist | undefined {
    try {
        if (typeof localStorage === "undefined") return undefined;
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return undefined;
        const parsed = JSON.parse(s);
        if (!parsed || typeof parsed !== "object") return undefined;
        return parsed as DocPersist;
    } catch {
        return undefined;
    }
}

function saveDocState(state: DocPersist) {
    try {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
    }
}

function clearDocState() {
    try {
        if (typeof localStorage === "undefined") return;
        localStorage.removeItem(STORAGE_KEY);
    } catch { }
}


const persisted = loadDocState();

const preloadedState = persisted
    ? {
        doc: {
            rawText: persisted.rawText ?? "",
            analysis: persisted.analysis ?? null,
            highlight: null,
            qa: {
                lastQuestion: null,
                lastAnswer: null,
                status: "idle" as const,
                error: null as string | null,
            },
            analyzeStatus: (persisted.analysis ? "succeeded" : "idle") as
                | "idle"
                | "loading"
                | "succeeded"
                | "failed",
            analyzeError: null as string | null,
        },
    }
    : undefined;


export const store = configureStore({
    reducer: {
        doc: docReducer,
    },
    preloadedState,
});


let prevSnapshot = "";
store.subscribe(() => {
    const s = store.getState() as any;
    const snapshotObj: DocPersist = {
        rawText: s.doc?.rawText ?? "",
        analysis: s.doc?.analysis ?? null,
    };
    const snapshot = JSON.stringify(snapshotObj);
    if (snapshot !== prevSnapshot) {
        prevSnapshot = snapshot;
        saveDocState(snapshotObj);
    }
});


const originalDispatch = store.dispatch;
store.dispatch = (action: any) => {
    const result = originalDispatch(action);
    if (action?.type === clearDocument.type) {
        clearDocState();
    }
    return result;
};


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
