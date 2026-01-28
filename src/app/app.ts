import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './navigation/header/header';
import { MatDialog } from '@angular/material/dialog';
import { LanguageDialog } from './visitor/language-dialog/language-dialog';
import { AuthStore } from './auth/auth.store';
import { ImportArtifactsComponent } from './utils/import-artifacts';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, ImportArtifactsComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    protected readonly title = signal('exhibition-qr');
    dialog = inject(MatDialog);
    auth = inject(AuthStore)

    constructor() {
        this.dialog.open(LanguageDialog)
    }
    ngOnInit(): void {
        this.auth.persistLogin();
    }

}
