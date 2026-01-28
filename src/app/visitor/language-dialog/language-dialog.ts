import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LanguageState } from '../../services/language.service';
import { MatButtonModule } from '@angular/material/button';
import { LANGUAGES } from '../../../models/language.model';

@Component({
    selector: 'app-language-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './language-dialog.html',
    styleUrl: './language-dialog.scss',
})
export class LanguageDialog {

    readonly LANGUAGES = LANGUAGES
    languageState = inject(LanguageState)
}
