
import { Component, effect, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Artifact } from '../../../../models/artifact.model';
import { LanguageState } from '../../../services/language.service';


import { LANGUAGES } from '../../../../models/language.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-preview',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './preview.html',
    styleUrl: './preview.scss',
})
export class Preview {
    public data: any = inject(MAT_DIALOG_DATA)
    artifact: Artifact;
    languageState = inject(LanguageState);
    description = signal<string>('')
    title = signal<string>('')
    readonly LANGUAGES = LANGUAGES

    constructor() {
        this.artifact = this.data.artifact;
        effect(() => {
            console.log(this.languageState.language().code)
            if (this.languageState.language().code === 'nl') {
                this.description.set(this.artifact.descriptionNL)
                this.title.set(this.artifact.titleNL)
            } else if (this.languageState.language().code === 'en') {
                this.description.set(this.artifact.descriptionEN)
                this.title.set(this.artifact.titleEN)
            }
        })
    }
}
