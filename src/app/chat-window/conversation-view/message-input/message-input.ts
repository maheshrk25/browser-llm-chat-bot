import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageDataStore } from '../../../model/message-data-store';
import { LocalLlmService } from '../../../services/local-llm-service';
import { LlmResponseHandler } from '../../../services/llm-response-handler';

@Component({
    imports: [FormsModule],
    selector: 'app-message-input',
    styleUrl: './message-input.css',
    templateUrl: './message-input.html',
})
export class MessageInput {
    private messageDataStore: MessageDataStore = inject(MessageDataStore);
    private localLlmService: LocalLlmService = inject(LocalLlmService);
    private llmResponseHandler: LlmResponseHandler = inject(LlmResponseHandler);

    messageContent: string = "";
    modelLoading = this.localLlmService.modelLoadingSignalReadonly;
    modelProgressReport = this.localLlmService.progressReportSignalReadonly;

    public async onSendMessageClicked(): Promise<void> {
        let message: string = this.messageContent.trim();
        if (!message) {
            return;
        }

        await this.addUserMessageToConversation(message);
        this.messageContent = "";

        if (!this.localLlmService.modelLoadedSignalReadonly()) {
            await this.localLlmService.loadToEngineNewModel("gemma-2-2b-it-q4f16_1-MLC");
        }

        message = await this.localLlmService.getLLMResponse()
        message = this.llmResponseHandler.formattedResponse(message);
        await this.addLlmResponseMessageToConversation(message);
    }

    public onEnterClicked(event: Event): void {
        const keyboardEvent = event as KeyboardEvent;

        if (!keyboardEvent.shiftKey) {
            keyboardEvent.preventDefault();
            this.onSendMessageClicked();
        }
    }

    public autoResizeTextArea(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }

    private async addUserMessageToConversation(message: string) {
        await this.messageDataStore.addMessage({
            datetime: new Date(),
            role: 'user',
            content: message
        });
    }

    private async addLlmResponseMessageToConversation(message: string) {
        await this.messageDataStore.addMessage({
            datetime: new Date(),
            role: 'assistant',
            content: message
        });
    }
}
