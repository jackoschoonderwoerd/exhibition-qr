import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-wrong-email-password',
    imports: [MatIconModule, MatButtonModule, MatDialogModule],
    templateUrl: './wrong-email-password.component.html',
    styleUrl: './wrong-email-password.component.scss'
})
export class WrongEmailPasswordComponent {
    data = inject(MAT_DIALOG_DATA, { optional: true });
    constructor(public dialogRef: MatDialogRef<WrongEmailPasswordComponent>) {
    }
}
