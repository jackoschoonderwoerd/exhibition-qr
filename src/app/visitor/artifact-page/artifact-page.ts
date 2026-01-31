import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { FirestoreService } from '../../services/firestore.service';

import { HtmlSanitizerService } from '../../services/html-sanitizer.service'
import { LanguageState } from '../../services/language.service';

@Component({
    selector: 'app-artifact-page',
    standalone: true,
    templateUrl: './artifact-page.html',
    styleUrls: ['./artifact-page.scss'],
})
export class ArtifactPage {
    private route = inject(ActivatedRoute);
    private fs = inject(FirestoreService);
    private id = this.route.snapshot.paramMap.get('id')!;
    languageState = inject(LanguageState)


    artifact = toSignal(
        this.fs.getDoc(`artifacts/${this.id}`),
        { initialValue: null }
    );

    constructor(private htmlSanitizerService: HtmlSanitizerService) { }

    description = computed(() => {
        const artifact = this.artifact();
        if (!artifact) return '';

        const langCode = this.languageState.language()?.code ?? 'en';
        const value = (artifact as any)[`description${langCode.toUpperCase()}`] ?? artifact.descriptionEn ?? '';

        return this.htmlSanitizerService.sanitize(value);
    });

    title = computed(() => {
        const artifact = this.artifact();
        if (!artifact) return '';

        const langCode = this.languageState.language()?.code ?? 'en';
        const value = (artifact as any)[`title${langCode.toUpperCase()}`] ?? artifact.descriptionEn ?? '';

        return this.htmlSanitizerService.sanitize(value);
    });
}
