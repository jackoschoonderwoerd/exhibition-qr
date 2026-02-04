import { Component, computed, inject, signal } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Artifact } from '../../../models/artifact.model';
import { downloadArtifactQrPdf, downloadBatchQrPdf } from '../../utils/qr-pdf.util';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ArtifactEditorState } from '../artifact-state/artifact-editor.state';
import { A11yModule } from "@angular/cdk/a11y";
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmService } from '../../services/confirm.service';
import { SnackbarService } from '../../services/snackbar.service';
import { FirebaseError } from 'firebase/app';
import { MatDialog } from '@angular/material/dialog';
import { Preview } from './preview/preview';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-artifact-table',
    imports: [
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        A11yModule,
        RouterModule,
        MatInputModule,
        FormsModule,
        MatIconModule, MatCheckboxModule
    ],
    templateUrl: './artifact-table.html',
    styleUrl: './artifact-table.scss',
})
export class ArtifactTable {
    private fs = inject(FirestoreService);
    private router = inject(Router)
    private cs = inject(ConfirmService);
    private sb = inject(SnackbarService)
    private dialog = inject(MatDialog)

    // Signal of artifacts from Firestore
    artifacts = toSignal(this.fs.collection('artifacts'), {
        initialValue: [],
    });

    editorState = inject(ArtifactEditorState)
    displayedColumns = ['titleNL', 'preview', 'edit', 'delete', 'download', 'print'];

    // Pagination signals
    pageIndex = signal(0);
    pageSize = signal(10);
    filter = signal('');

    // Sorting signals
    sortField = signal<keyof Artifact>('titleNL');
    sortDirection = signal<'asc' | 'desc'>('asc');

    filteredCount = computed(() =>
        this.artifacts().filter(a =>
            a.titleNL.toLowerCase().includes(this.filter().toLowerCase())
        ).length
    );


    // Computed sorted and paginated data
    pagedArtifacts = computed(() => {
        const filterValue = this.filter().toLowerCase().trim();

        // 1️⃣ Filter
        let data = this.artifacts().filter(artifact =>
            artifact.titleNL.toLowerCase().includes(filterValue) ||
            artifact.titleEN.toLowerCase().includes(filterValue) ||
            (artifact.year?.toString() ?? '').includes(filterValue)
        );

        // 2️⃣ Sort
        data = [...data].sort((a, b) => {
            const field = this.sortField();
            const dir = this.sortDirection();

            const aVal = (a[field] ?? '').toString().toLowerCase();
            const bVal = (b[field] ?? '').toString().toLowerCase();

            if (aVal < bVal) return dir === 'asc' ? -1 : 1;
            if (aVal > bVal) return dir === 'asc' ? 1 : -1;
            return 0;
        });

        // 3️⃣ Paginate
        const start = this.pageIndex() * this.pageSize();
        return data.slice(start, start + this.pageSize());
    });
    // -------------------------------------------- PRINT PDF BATCH -------------
    // holds selected artifact IDs
    selectedForPrint = signal<Set<string>>(new Set());

    toggleSelection(artifact: Artifact, checked: boolean) {
        if (!artifact.id) return;

        const next = new Set(this.selectedForPrint());

        checked ? next.add(artifact.id) : next.delete(artifact.id);

        this.selectedForPrint.set(next);
    }

    isSelected(artifact: Artifact): boolean {
        return !!artifact.id && this.selectedForPrint().has(artifact.id);
    }

    selectedCount = computed(() => this.selectedForPrint().size);

    toggleAll(checked: boolean) {
        if (!checked) {
            this.selectedForPrint.set(new Set());
            return;
        }

        const all = new Set(
            this.artifacts()
                .map(a => a.id)
                .filter(Boolean) as string[]
        );

        this.selectedForPrint.set(all);
    }

    printSelected() {
        const selectedIds = this.selectedForPrint();

        const artifactsToPrint = this.artifacts().filter(
            a => a.id && selectedIds.has(a.id)
        );

        if (!artifactsToPrint.length) return;

        downloadBatchQrPdf(artifactsToPrint);
    }



    // ---------------------------------------------

    onFilterChange(value: string) {
        this.filter.set(value);
        this.pageIndex.set(0);
    }


    // Table event handlers
    onPage(event: PageEvent) {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
    }

    onSort(sort: Sort) {
        if (!sort.active || sort.direction === '') return;
        this.sortField.set(sort.active as keyof Artifact);
        this.sortDirection.set(sort.direction as 'asc' | 'desc');
    }

    // Actions
    downloadQr(artifact: Artifact) {
        downloadArtifactQrPdf(artifact);
    }

    artifactSelected = signal<Artifact | null>(null);

    onPreview(artifact: Artifact) {
        console.log(artifact)
        this.dialog.open(Preview, {
            data: {
                artifact
            },
            maxWidth: '100vw',
            panelClass: 'phone-dialog',
        })
    }

    onEdit(artifact: Artifact) {
        this.editorState.startEdit(artifact)
        // this.artifactSelected.set(artifact);
        this.router.navigateByUrl('artifact-editor')
    }
    onDelete(id: string) {
        this.cs.getConfirmation().subscribe((res: boolean) => {
            if (res) {
                this.fs.deleteDoc(`artifacts/${id}`)
                    .then((res: any) => {
                        this.sb.openSnackbar(`artifact deleted`)
                    })
                    .catch((err: FirebaseError) => {
                        this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar('operation aborted by user');
            }
        })

    }
    onAdd() {
        this.editorState.clear();
        this.router.navigateByUrl('artifact-editor')
    }
}
