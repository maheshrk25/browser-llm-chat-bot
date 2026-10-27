import { Service, signal } from '@angular/core';

@Service()
export class SidebarState {
    isMenuExpanded = signal(true);

    toggleMenu(){
        this.isMenuExpanded.update(expanded => !expanded);
    }
}
