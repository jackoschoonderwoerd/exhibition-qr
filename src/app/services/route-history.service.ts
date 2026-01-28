import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouteHistoryService {
    private history: string[] = [];

    constructor(private router: Router) {
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.history.push(e.urlAfterRedirects);
            });
    }

    getHistory(): string[] {
        return [...this.history];
    }

    getPrevious(): string | undefined {
        return this.history[this.history.length - 2];
    }
}
