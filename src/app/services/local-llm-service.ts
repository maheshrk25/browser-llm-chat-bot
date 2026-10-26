import { Service, Signal, WritableSignal, inject, signal } from '@angular/core';
import { ChatCompletionMessageParam, InitProgressReport, MLCEngine } from '@mlc-ai/web-llm';
import { MessageDataStore } from '../model/message-data-store';

@Service()
export class LocalLlmService {

    private engine: MLCEngine;
    private messageDataStore = inject(MessageDataStore);
    private activeChatMessagesSignal = this.messageDataStore.activeChatMessagesSignal;

    private progressReportSignal: WritableSignal<InitProgressReport> =
        signal<InitProgressReport>({
            progress: 0,
            timeElapsed: 0,
            text: ""
        });
    public readonly progressReportSignalReadonly: Signal<InitProgressReport> =
        this.progressReportSignal.asReadonly();

    private modelLoadingSignal: WritableSignal<boolean> = signal(false);
    public readonly modelLoadingSignalReadonly: Signal<boolean> =
        this.modelLoadingSignal.asReadonly();

    private modelLoadedSignal: WritableSignal<boolean> = signal(false);
    public readonly modelLoadedSignalReadonly: Signal<boolean> =
        this.modelLoadedSignal.asReadonly();

    private modelGeneratingSignal: WritableSignal<boolean> = signal(false);
    public readonly modelGeneratingSignalReadonly: Signal<boolean> =
        this.modelGeneratingSignal.asReadonly();

    private modelReplySignal: WritableSignal<string> = signal("");
    public readonly modelReplySignalReadonly: Signal<string> =
        this.modelReplySignal.asReadonly();

    constructor() {
        this.engine = new MLCEngine({
            initProgressCallback: this.initEngineProgressCallback
        });
    }

    // Callback function for model loading
    private initEngineProgressCallback = (progressReport: InitProgressReport) => {
        console.log("Model loading progress:", progressReport);
        this.progressReportSignal.set(progressReport);
    };

    public async loadToEngineNewModel(modelName: string) {
        this.modelLoadingSignal.set(true);

        await this.engine.reload(modelName);
        this.modelLoadedSignal.set(true);

        this.modelLoadingSignal.set(false);
    }

    public async getLLMResponse(): Promise<string> {
        this.modelGeneratingSignal.set(true);
        const messages: ChatCompletionMessageParam[] =
            (this.activeChatMessagesSignal()).map(
                message => ({
                    role: message.role as 'user' | 'system',
                    content: message.content
                })
            );
        
        //console.log(messages);
        
        // chunks is an AsyncGenerator object
        const chunks = await this.engine.chat.completions.create({
            messages,
            //Add tools here : ChatCompletionTool[], FunctionDefinition, ChatCompletionChunk
            //tools:
            temperature: 1,
            stream: true, // <-- Enable streaming
            stream_options: { include_usage: true },
        });

        for await (const chunk of chunks) {
            this.modelReplySignal.update(reply => reply + chunk.choices[0]?.delta.content || ""); 
            console.log(chunk.choices);
            if (chunk.usage) {
                console.log(chunk.usage); // only last chunk has usage
            }
        }
        this.modelGeneratingSignal.set(false);
        this.modelReplySignal.set("");

        //const fullResponse = await this.engine.getMessage();
        const fullResponse = await this.engine.getMessage()
        console.log(fullResponse);
        return fullResponse;
    }
}
