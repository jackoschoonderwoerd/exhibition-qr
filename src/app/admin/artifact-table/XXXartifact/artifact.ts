import { Component, inject, input, InputSignal } from '@angular/core';
import { Artifact } from '../../../../models/artifact.model';
import { MatIconModule } from '@angular/material/icon';
import { ArtifactEditorState } from '../../artifact-state/artifact-editor.state';
import { FirestoreService } from '../../../services/firestore.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmService } from '../../../services/confirm.service';
import { FirebaseError } from 'firebase/app';
import { MatButtonModule } from '@angular/material/button';

import { downloadArtifactQrPdf } from '../../../utils/qr-pdf.util';

@Component({
    selector: 'app-artifact-component',
    imports: [
        MatIconModule,
        MatButtonModule,
        // VisibilityEyesComponent
    ],
    templateUrl: './artifact.html',
    styleUrl: './artifact.scss',
})
export class ArtifactComponent {
    // artifact: InputSignal<Artifact> = input<Artifact>()
    // editorState = inject(ArtifactEditorState);
    // fs = inject(FirestoreService);
    // sb = inject(SnackbarService);
    // cs = inject(ConfirmService);

    // downloadQr() {
    //     downloadArtifactQrPdf(this.artifact());
    // }

    // onEdit() {
    //     this.editorState.startEdit(this.artifact());
    // }

    // onCreateNew() {
    //     this.editorState.startCreate();
    // }

    // onDelete() {
    //     this.cs.getConfirmation().subscribe((res: boolean) => {
    //         if (res) {
    //             const path = `artifacts/${this.artifact().id}`
    //             this.fs.deleteDoc(path)
    //                 .then((res: any) => {
    //                     this.sb.openSnackbar('artifact deleted', 3000)
    //                 })
    //                 .catch((err: FirebaseError) => {
    //                     this.sb.openSnackbar(`operation failed due to: ${err.message}`, 3000)
    //                 })

    //         } else {
    //             this.sb.openSnackbar(`operation aborted by user`, 3000);
    //         }
    //     })
    // }
}
