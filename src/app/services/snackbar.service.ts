import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    snackbar = inject(MatSnackBar)
    constructor() { }

    openSnackbar(message: string, duration = 3000) {
        this.snackbar.open(message, undefined, { duration })
    }
}
