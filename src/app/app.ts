import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './navigation/header/header';
import { MatDialog } from '@angular/material/dialog';
import { LanguageDialog } from './visitor/language-dialog/language-dialog';
import { AuthStore } from './auth/auth.store';
import { Footer } from './navigation/footer/footer';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    protected readonly title = signal('exhibition-qr');
    dialog = inject(MatDialog);
    auth = inject(AuthStore)

    constructor() {
        effect(() => {
            const initialized = this.auth.initialized();
            const loggedIn = this.auth.isLoggedIn();
            if (!initialized) return;
            console.log(loggedIn)
            if (!loggedIn) {
                this.dialog.open(LanguageDialog)
            }
        })
    }
}
