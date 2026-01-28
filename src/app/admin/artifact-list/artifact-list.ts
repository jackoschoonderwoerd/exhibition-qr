import { Component, computed, EventEmitter, inject, Output, Signal } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';

import { toSignal } from '@angular/core/rxjs-interop';
import { Artifact } from '../../../models/artifact.model';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';
import { ConfirmService } from '../../services/confirm.service';
import { FirebaseError } from 'firebase/app';

import { ArtifactEditorState } from '../artifact-state/artifact-editor.state';

import { MatTableDataSource } from '@angular/material/table';
import { ArtifactComponent } from '../artifact-table/artifact/artifact';


@Component({
    selector: 'app-artifact-list',
    imports: [MatIconModule, MatButtonModule, ArtifactComponent],
    templateUrl: './artifact-list.html',
    styleUrl: './artifact-list.scss',
})
export class ArtifactList {
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    cs = inject(ConfirmService);

    private editorState = inject(ArtifactEditorState)



    artifacts: Signal<Artifact[]> = toSignal(
        this.fs.collection('artifacts'),
        { initialValue: [] }
    );

    dataSource = computed(() => new MatTableDataSource(this.artifacts()));
    // onEdit(artifact: Artifact) {
    //     this.editorState.startEdit(artifact);
    // }

    // onCreateNew() {
    //     this.editorState.startCreate();
    // }

    // onDelete(id: string) {
    //     this.cs.getConfirmation().subscribe((res: boolean) => {
    //         if (res) {
    //             const path = `artifacts/${id}`
    //             this.fs.deleteDoc(path)
    //                 .then((res: any) => {
    //                     this.sb.openSnackbar('artifact deleted')
    //                 })
    //                 .catch((err: FirebaseError) => {
    //                     this.sb.openSnackbar(`operation failed due to: ${err.message}`)
    //                 })

    //         } else {
    //             this.sb.openSnackbar(`operation aborted by user`);
    //         }
    //     })
    // }
}
