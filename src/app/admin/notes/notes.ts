import { Component, inject } from '@angular/core';
import { LanguageState } from '../../services/language.service';

@Component({
    selector: 'app-notes',
    imports: [],
    templateUrl: './notes.html',
    styleUrl: './notes.scss',
})
export class Notes {
    languageState = inject(LanguageState)
}
