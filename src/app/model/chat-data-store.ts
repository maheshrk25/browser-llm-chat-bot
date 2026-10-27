import { Service, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';
import { db, Chat } from './db';

@Service()
export class ChatDataStore {

    chatsSignal = toSignal(
        from(
            liveQuery(() =>
                db.chats
                    .orderBy('creationDate')
                    .reverse()
                    .toArray()
            )
        ),
        { initialValue: [] as Chat[] }
    );

    activeChatSignal = computed(() => this.chatsSignal().find((chat) => chat.isActive));

    async addNewChat(): Promise<number> {
        return await db.transaction('rw', db.chats, async () => {

            const chatId = await db.chats.add({
                title: 'New chat',
                creationDate: new Date(),
                isActive: false
            });

            await db.chats.toCollection().modify({
                isActive: false
            });

            await db.chats.update(chatId, {
                isActive: true
            });

            return chatId;
        });
    }

    async setActiveChat(chatId: number): Promise<void> {
        await db.transaction('rw', db.chats, async () => {

            const chat = await db.chats.get(chatId);

            if (!chat) {
                throw new Error(`Chat with ID ${chatId} not found`);
            }

            await db.chats.toCollection().modify({
                isActive: false
            });

            await db.chats.update(chatId, {
                isActive: true
            });
        });
    }

    async deleteChat(chatId: number): Promise<void> {
        await db.transaction('rw', db.chats, db.messages, async () => {
            const chats = await db.chats.toArray();
            const chatToDelete = chats.find(chat => chat.id === chatId);

            if (!chatToDelete) {
                return;
            }

            const wasActive = chatToDelete.isActive;

            // Delete all messages belonging to this chat
            await db.messages
                .where('chatId')
                .equals(chatId)
                .delete();

            // Delete the chat
            await db.chats.delete(chatId);

            // If the deleted chat wasn't active, no selection change is needed
            if (!wasActive) {
                return;
            }

            // Find the remaining chats in ID order
            const remainingChats = chats
                .filter(chat => chat.id !== chatId)
                .sort((a, b) => a.id - b.id);

            // If no chats remain, create a new active chat
            if (remainingChats.length === 0) {
                const newChaId = await db.chats.add({
                    title: 'New chat',
                    creationDate: new Date(),
                    isActive: true
                });

                await db.messages.bulkAdd([
                    {
                        chatId: newChaId,
                        datetime: new Date(),
                        role: "system",
                        content: "You are a helpful AI assistant."
                    },
                    {
                        chatId: newChaId,
                        datetime: new Date(),
                        role: "assistant",
                        content: "<p>Hi. How can I help you today?</p>"
                    }
                ]);
                return;
            }

            // Select the next chat, or the previous one if there is no next chat
            const nextChat =
                remainingChats.find(chat => chat.id > chatId) ??
                remainingChats[remainingChats.length - 1];

            // Ensure only the selected chat is active
            await db.chats.toCollection().modify({
                isActive: false
            });

            await db.chats.update(nextChat.id, {
                isActive: true
            });
        });
    }

    async renameChat(chatId: number, newTitle: string): Promise<void> {
        const title = newTitle.trim();

        if (!title) {
            throw new Error('Chat title cannot be empty');
        }

        const chat = await db.chats.get(chatId);

        if (!chat) {
            throw new Error(`Chat with ID ${chatId} not found`);
        }

        await db.chats.update(chatId, { title });
    }
}
