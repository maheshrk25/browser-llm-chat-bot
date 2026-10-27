import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { PenToSquare } from '@primeicons/angular/pen-to-square';
import { History } from '@primeicons/angular/history';
import { Cog } from '@primeicons/angular/cog';
import { PenLine } from '@primeicons/angular/pen-line';
import { Trash } from '@primeicons/angular/trash';
import { SidebarState } from '../../services/sidebar-state';
import { ChatDataStore } from '../../model/chat-data-store';
import { MessageDataStore } from '../../model/message-data-store';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [PenToSquare, History, Cog, PenLine, Trash, FormsModule],
    selector: 'app-sidebar',
    styleUrl: './sidebar.css',
    templateUrl: './sidebar.html',
})
export class Sidebar {
    private chatDataStore = inject(ChatDataStore);
    chatsSignal = this.chatDataStore.chatsSignal;

    private messageDataStore = inject(MessageDataStore);

    sidebarState = inject(SidebarState);

    async onNewChatMenuClicked(): Promise<void> {
        try {
            const chatId = await this.chatDataStore.addNewChat();
            console.log('Added chat with id:', chatId);
            await this.messageDataStore.addInitialMessages(chatId);
            console.log('Added initial messages');
        } catch (error) {
            console.error('Failed to create a new chat:', error);
        }
    }

    onRecentChatsMenuClicked() {

    }

    async onRecentChatClicked(chatId: number): Promise<void> {
        await this.chatDataStore.setActiveChat(chatId);
    }

    @ViewChild('deleteDialog')
    deleteDialog?: ElementRef<HTMLElement>;
    showDeleteDialog = signal(false);
    chatIdToDelete: number | null = null;
    isDeleting = false;
    async onDeleteChatClicked(chatId: number, event: MouseEvent): Promise<void> {
        event.stopPropagation();
        this.chatIdToDelete = chatId;
        this.showDeleteDialog.set(true);
        setTimeout(() => this.deleteDialog?.nativeElement.focus());
    }

    async confirmDelete(): Promise<void> {
        if (this.chatIdToDelete === null || this.isDeleting) {
            return;
        }

        const chatId = this.chatIdToDelete;
        this.isDeleting = true;

        try {
            await this.chatDataStore.deleteChat(chatId);
            this.cancelDelete();
        } catch (error) {
            console.error('Failed to delete chat:', error);
        } finally {
            this.isDeleting = false;
        }
    }

    cancelDelete() {
        this.showDeleteDialog.set(false);
        this.chatIdToDelete = null;
    }

    @ViewChild('renameInput')
    renameInput?: ElementRef<HTMLInputElement>;
    showRenameDialog = signal(false);
    chatIdToRename: number | null = null;
    newChatTitle = '';
    isRenaming = false;

    onRenameChatClicked(chatId: number, event: MouseEvent): void {
        event.stopPropagation();

        const chat = this.chatsSignal().find(c => c.id === chatId);
        if (!chat) return;

        this.chatIdToRename = chatId;
        this.newChatTitle = chat.title;
        this.showRenameDialog.set(true);
        setTimeout(() => this.renameInput?.nativeElement.focus());
    }

    async confirmRename(): Promise<void> {
        if (this.chatIdToRename === null || this.isRenaming) return;

        const title = this.newChatTitle.trim();
        if (!title) return;

        this.isRenaming = true;

        try {
            await this.chatDataStore.renameChat(this.chatIdToRename, title);
            this.cancelRename();
        } catch (error) {
            console.error('Failed to rename chat:', error);
        } finally {
            this.isRenaming = false;
        }
    }

    cancelRename(): void {
        this.showRenameDialog.set(false);
        this.chatIdToRename = null;
        this.newChatTitle = '';
    }

    onSettingsMenuClicked() {

    }
}
