const KEY = "clearterms_doc_v1";

export type DocPersist = {
    rawText: string;
    analysis: any | null;
};

export function loadDocState(): DocPersist | undefined {
    try {
        const s = localStorage.getItem(KEY);
        if (!s) return undefined;
        const parsed = JSON.parse(s);
        if (!parsed || typeof parsed !== "object") return undefined;
        return parsed;
    } catch {
        return undefined;
    }
}

export function saveDocState(state: DocPersist) {
    try {
        localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
    }
}

export function clearDocState() {
    try {
        localStorage.removeItem(KEY);
    } catch { }
}
