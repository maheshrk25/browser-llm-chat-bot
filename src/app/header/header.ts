import { Component, inject } from '@angular/core';
import { SidebarState } from '../services/sidebar-state';

@Component({
    imports: [],
    selector: 'app-header',
    styleUrl: './header.css',
    templateUrl: './header.html',
})
export class Header {
    sidebarState = inject(SidebarState);
}
