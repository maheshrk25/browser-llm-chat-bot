import { Service, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';
import { db, Chat } from './db';

@Service()
export class ChatDataStore {

    chatsSignal = toSignal(
        from(liveQuery(() => db.chats.toArray())),
        { initialValue: [] as Chat[] }
    );

    activeChatSignal = computed(() => this.chatsSignal().find((chat) => chat.isActive));

}
