import { Component, inject } from '@angular/core';
import { AuthStore } from '../../auth/auth.store';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [MatButtonModule, RouterModule],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {
    auth = inject(AuthStore)


}
