import { Injectable, signal } from '@angular/core';
import { LanguageCode, LANGUAGES } from '../../models/language.model';

// export const LANGUAGES = ['en', 'nl'] as const;
export type Language = typeof LANGUAGES[number];

@Injectable({ providedIn: 'root' })


export class LanguageState {
    private readonly _language = signal<Language>(LANGUAGES[0]);

    // read-only signal for templates
    readonly language = this._language.asReadonly();

    setLanguage(lang: Language) {
        this._language.set(lang);
    }

    setLanguageByCode(code: LanguageCode) {
        const lang = LANGUAGES.find(l => l.code === code);
        if (lang) this._language.set(lang);
    }

    selectLangage(language: Language) {
        this._language.set(language);
    }
}
