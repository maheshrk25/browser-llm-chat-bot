import { Service, signal } from '@angular/core';

@Service()
export class SidebarState {
    isMenuExpanded = signal(false);

    toggleMenu(){
        this.isMenuExpanded.update(expanded => !expanded);
    }
}
