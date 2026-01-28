import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    snackbar = inject(MatSnackBar)
    constructor() { }

    openSnackbar(message: string) {
        this.snackbar.open(message, 'close')
    }

}
