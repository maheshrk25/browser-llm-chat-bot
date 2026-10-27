import { Service, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { from, switchMap } from 'rxjs';
import { liveQuery } from 'dexie';
import { db, Message, MessageDTO } from './db';
import { ChatDataStore } from './chat-data-store';

@Service()
export class MessageDataStore {

    chatsDataStore = inject(ChatDataStore)
    activeChatIdSignal = computed(() => this.chatsDataStore.activeChatSignal()?.id);

    activeChatMessagesSignal = toSignal(
        toObservable(this.activeChatIdSignal).pipe(
            switchMap(chatId => {
                if (!chatId) {
                    return liveQuery(() => Promise.resolve([] as Message[]));
                }

                return liveQuery(() =>
                    db.messages
                        .where('chatId')
                        .equals(chatId)
                        .toArray()
                );
            })
        ),
        { initialValue: [] as Message[] }
    );

    async addMessage(message: MessageDTO) {
        await db.messages.add({
            chatId: this.activeChatIdSignal()!,
            datetime: message.datetime,
            role: message.role,
            content: message.content
        });
    }

    async addInitialMessages(chatId: number) {
        await db.messages.bulkAdd([
            {
                chatId: chatId,
                datetime: new Date(),
                role: "system",
                content: "You are a helpful AI assistant."
            },
            {
                chatId: chatId,
                datetime: new Date(),
                role: "assistant",
                content: "<p>Hi. How can I help you today?</p>"
            }
        ]);
    }

    async deleteMessagesInChat(chatId: number): Promise<void> {
        
    }

}
