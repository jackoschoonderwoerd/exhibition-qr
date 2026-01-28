import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Confirm } from '../shared/confirm/confirm';

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {

    dialog = inject(MatDialog)
    constructor() { }

    getConfirmation() {
        const dialogRef = this.dialog.open(Confirm)
        return dialogRef.afterClosed()
    }
}
