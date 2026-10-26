import { Component, inject } from '@angular/core';
import { MessageDataStore } from '../../model/message-data-store';
import { LocalLlmService } from '../../services/local-llm-service';
import { MessageInput } from './message-input/message-input';

@Component({
  imports: [MessageInput],
  selector: 'app-conversation-view',
  styleUrl: './conversation-view.css',
  templateUrl: './conversation-view.html',
})
export class ConversationView {

  private messageDataStore = inject(MessageDataStore)
  activeChatMessagesSignal = this.messageDataStore.activeChatMessagesSignal;

  private localLlmService = inject(LocalLlmService);
  modelGeneratingSignal = this.localLlmService.modelGeneratingSignalReadonly;
  modelReplySignal = this.localLlmService.modelReplySignalReadonly;

}
