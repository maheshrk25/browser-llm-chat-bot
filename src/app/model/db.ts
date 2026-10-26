import Dexie, { type EntityTable } from 'dexie';

export interface Chat {
    id: number,
    title: string,
    isActive: boolean
}

export interface Message {
    id: number,
    chatId: number,
    datetime: Date,
    role: "user" | "system" | "assistant",
    content: string
}

export interface MessageDTO {
    datetime: Date,
    role: "user" | "system" | "assistant",
    content: string
}

const db = new Dexie('LocalLLMChatbot') as Dexie & {
    chats: EntityTable<Chat, 'id'>;
    messages: EntityTable<Message, 'id'>;
};

db.version(1).stores({
    chats: '++id',
    messages: '++id, chatId',
});

// Populate with sample data on first run
db.on('populate', async () => {
    const chatId = await db.chats.add({
        title: 'First test chat', isActive: true
    });
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
});

export { db };

