import { Component, effect, EventEmitter, inject, output, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { Artifact } from '../../../models/artifact.model';
import { FirestoreService } from '../../services/firestore.service';
import { SnackbarService } from '../../services/snackbar.service';
import { QuillModule } from 'ngx-quill';
import { ArtifactEditorState } from '../artifact-state/artifact-editor.state';
import { FirebaseError } from 'firebase/app';
import { Router } from '@angular/router';
import { QuillTextEditorComponent } from '../../shared/quill-text-editor/quill-text-editor.component';




@Component({
    selector: 'app-artifact-editor',
    imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInput,
        MatFormFieldModule,
        QuillModule,
        QuillTextEditorComponent

    ],
    templateUrl: './artifact-editor.html',
    styleUrl: './artifact-editor.scss',
})
export class ArtifactEditor {


    fb = inject(FormBuilder)
    // form: FormGroup;
    editmode: boolean = false;
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    router = inject(Router)
    artifactEditorState = inject(ArtifactEditorState);

    changedNlValue = signal('');
    changedEnValue = signal('');   // Local signal

    form = this.fb.nonNullable.group({
        titleNL: ['', Validators.required],
        titleEN: [''],
        visible: true,
    });

    activeNlHtmlContentFromQuill: string = ''
    activeEnHtmlContentFromQuill: string = ''

    descriptionNLSignal = signal<string>('');
    descriptionENSignal = signal<string>('');




    quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
        ],
    };

    editMode = this.artifactEditorState.editMode;

    constructor() {

        effect(() => {
            const artifact = this.artifactEditorState.artifact();

            if (artifact) {
                this.form.reset({
                    titleNL: artifact.titleNL,
                    titleEN: artifact.titleEN,
                    visible: artifact.visible
                })
                this.changedNlValue.set(artifact.descriptionNL)
                this.changedEnValue.set(artifact.descriptionEN)
            } else {
                this.form.reset({
                    titleNL: '',
                    titleEN: '',
                    visible: null
                })
            }
        })

    }

    onNlValueChange(html: string) {
        this.activeNlHtmlContentFromQuill = html;
    }

    onEnValueChange(html: string) {
        this.activeEnHtmlContentFromQuill = html;
    }

    onSubmit() {
        console.log(this.form.value)
        const formValue = this.form.value
        const artifact: Artifact = {
            titleNL: formValue.titleNL,
            titleEN: formValue.titleEN,
            descriptionNL: this.activeNlHtmlContentFromQuill,
            descriptionEN: this.activeEnHtmlContentFromQuill,
            visible: formValue.visible
        }
        if (!this.artifactEditorState.editMode()) {

            this.addArtifact(artifact);
        } else {
            this.updateArtifact(artifact);
        }
    }
    onCancel() {
        this.form.reset();
        this.router.navigateByUrl('artifact-table')
    }

    addArtifact(artifact: Artifact) {
        this.fs.addDoc(`artifacts`, artifact)
            .then((res: any) => {
                this.sb.openSnackbar(`artifact ${artifact.titleNL} added`);
                this.form.reset();
                this.router.navigateByUrl('artifact-table')
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    }
    updateArtifact(artifact: Artifact) {
        const path = `artifacts/${this.artifactEditorState.artifact().id}`
        this.fs.updateDoc(path, artifact)
            .then((res: any) => {
                this.sb.openSnackbar(`artifact ${artifact.titleNL} updated`)
                this.form.reset();
                this.artifactEditorState.clear();
                this.router.navigateByUrl('artifact-table')
            })
            .catch((err: FirebaseError) => {
                console.log(err.message)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

}
