import { Component, inject } from '@angular/core';
import { LanguageState } from '../../services/language.service';

@Component({
    selector: 'app-landing-page',
    imports: [],
    templateUrl: './landing-page.html',
    styleUrl: './landing-page.scss',
})
export class LandingPage {
    languageState = inject(LanguageState)
}
