import { Component } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { ConversationView } from './conversation-view/conversation-view';

@Component({
  imports: [Sidebar, ConversationView],
  selector: 'app-chat-window',
  styleUrl: './chat-window.css',
  templateUrl: './chat-window.html',
})
export class ChatWindow {}
