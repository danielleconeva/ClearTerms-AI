export function wordCount(text: string) {
    return (text.match(/\b\w+\b/g) || []).length;
}

export function readingMinutes(words: number, wpm = 200) {
    return Math.max(1, Math.round(words / wpm));
}

export function secondsToNice(mins: number) {
    return `${mins} min${mins === 1 ? "" : "s"}`;
}

export function computeReadingStats(rawText: string, bullets: string[], wpm = 200) {
    const fullWords = wordCount(rawText);
    const fullMins = readingMinutes(fullWords, wpm);

    const summaryText = bullets.join(" ");
    const summaryWords = wordCount(summaryText);
    const summaryMins = Math.max(1, Math.round(Math.max(1, summaryWords) / wpm));

    const timeSaved = Math.max(0, fullMins - summaryMins);
    return {
        fullWords,
        fullMins,
        summaryWords,
        summaryMins,
        timeSaved,
    };
}
