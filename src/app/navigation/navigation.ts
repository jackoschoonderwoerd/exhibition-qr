import { Injectable } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';

@Injectable({
    providedIn: 'root',
})
export class Navigation {
    adminMenuItems: MenuItem[] = [
        {
            link: 'admin',
            appearanceEN: 'admin',
            appearanceNL: 'admin'
        }
    ]
}
