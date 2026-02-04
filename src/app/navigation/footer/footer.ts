import { Component, inject } from '@angular/core';
import { AuthStore } from '../../auth/auth.store';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-footer',
    imports: [MatButtonModule, RouterModule, MatIconModule],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {
    auth = inject(AuthStore)


}
