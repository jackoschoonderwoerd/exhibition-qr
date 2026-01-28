import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ScrollService {
    scrollY = signal(0);

    updateScroll(y: number) {
        this.scrollY.set(y);
    }
}
