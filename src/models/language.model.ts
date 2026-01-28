// export type LanguageCode = 'en' | 'nl' | 'es' | 'de';
export type LanguageCode = 'en' | 'nl';

export interface Language {
    code: LanguageCode;
    flag: string; // Emoji, or CSS class, or image URL
    label?: string; // optional: human-readable
}

// List of supported languages
export const LANGUAGES: Language[] = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
    // { code: 'es', flag: '🇪🇸', label: 'Español' },
    // { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
];
