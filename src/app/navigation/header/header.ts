import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router';
import { LanguageState } from '../../services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { LanguageDialog } from '../../visitor/language-dialog/language-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../auth/auth.store';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, RouterModule, MatIconModule, MatButtonModule],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    languageState = inject(LanguageState);
    dialog = inject(MatDialog)
    auth = inject(AuthStore)

    onSelectLanguage() {
        this.dialog.open(LanguageDialog);
    }
    onLogin() {

    }
    onLogout() {

    }
}
