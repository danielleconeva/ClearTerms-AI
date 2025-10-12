import { URL_FETCH_FALLBACK_MESSAGE } from "./constants";

export async function fetchUrlAsText(url: string): Promise<string> {
    let response: Response;

    try {
        response = await fetch(url, { mode: "cors" });
    } catch {
        throw new Error(URL_FETCH_FALLBACK_MESSAGE);
    }

    if (!response.ok) {
        throw new Error(
            `Fetch failed (${response.status} ${response.statusText}). ${URL_FETCH_FALLBACK_MESSAGE}`
        );
    }

    const contentType = response.headers.get("content-type") || "";
    const body = await response.text();

    if (contentType.includes("html") || /^<!doctype html/i.test(body)) {
        const text = body
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ");
        return text;
    }

    return body;

}