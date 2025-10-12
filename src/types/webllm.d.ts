declare module "@mlc-ai/web-llm" {
    export interface ChatMessage {
        role: "system" | "user" | "assistant";
        content: string;
    }

    export interface ChatCompletionChoice {
        message: ChatMessage;
    }

    export interface ChatCompletionResult {
        choices: ChatCompletionChoice[];
    }

    export interface ChatAPI {
        completions: {
            create(input: { messages: ChatMessage[] }): Promise<ChatCompletionResult>;
        };
    }

    export interface MLCEngine {
        chat: ChatAPI;
    }

    export function createMLCEngine(
        model: string,
        options?: { device?: string }
    ): Promise<MLCEngine>;
}
