import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './navigation/header/header';
import { MatDialog } from '@angular/material/dialog';
import { LanguageDialog } from './visitor/language-dialog/language-dialog';
import { AuthStore } from './auth/auth.store';
import { Footer } from './navigation/footer/footer';
import { SwUpdate, VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    private updates = inject(SwUpdate);
    private sb = inject(MatSnackBar);
    // updateAvailable = signal(false);

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

        if (this.updates.isEnabled) {
            alert('this.updates.isEnabled')
            // listen for "new version ready" events
            this.updates.versionUpdates
                .pipe(filter((evt: VersionEvent): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
                .subscribe(evt => {
                    alert('New version available')
                    console.log('New version available', evt);
                    this.showUpdatePrompt();
                    // this.updateAvailable.set(true)
                });
        } else {
            alert('!!!!!!!this.updates.isEnabled')
        }
    }
    private showUpdatePrompt() {
        const snack = this.sb.open(
            'A new version is available!',
            'Reload',
            { duration: 10000 }
        );

        snack.onAction().subscribe(() => {
            this.updates.activateUpdate().then(() => location.reload());
        });
    }
    // refreshApp() {
    //     this.updates.activateUpdate().then(() => location.reload());
    // }
}
