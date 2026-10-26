import { Routes } from '@angular/router';
import { ChatWindow } from './chat-window/chat-window';

export const routes: Routes = [
    {path: "home", component: ChatWindow},
    {path: "", redirectTo: "/home", pathMatch: "full"}
];
