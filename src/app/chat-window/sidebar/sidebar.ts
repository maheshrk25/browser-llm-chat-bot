import { Component, inject } from '@angular/core';
import { PenToSquare } from '@primeicons/angular/pen-to-square';
import { History } from '@primeicons/angular/history';
import { Cog } from '@primeicons/angular/cog';
import { SidebarState } from '../../services/sidebar-state';
import { ChatDataStore } from '../../model/chat-data-store';

@Component({
    imports: [PenToSquare, History, Cog],
    selector: 'app-sidebar',
    styleUrl: './sidebar.css',
    templateUrl: './sidebar.html',
})
export class Sidebar {
    private chatDataStore = inject(ChatDataStore);
    chatsSignal = this.chatDataStore.chatsSignal;

    sidebarState = inject(SidebarState);

    onNewChatMenuClicked(){

    }

    onRecentChatsMenuClicked(){

    }

    onRecentChatClicked(chatId: number){

    }

    onSettingsMenuClicked(){

    }
}
