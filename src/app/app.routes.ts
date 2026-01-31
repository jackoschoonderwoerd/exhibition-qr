import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '', redirectTo: 'landing-page', pathMatch: 'full'
    },
    {
        path: 'landing-page',
        loadComponent: () => import('./visitor/landing-page/landing-page')
            .then(c => c.LandingPage)
    },

    {
        path: 'qr-scanner',
        loadComponent: () => import('./visitor/qr-scanner/qr-scanner')
            .then(c => c.QrScanner)
    },
    {
        path: 'artifact/:id',
        loadComponent: () =>
            import('./visitor/artifact-page/artifact-page')
                .then(m => m.ArtifactPage),
    },
    {
        path: 'artifact-table',
        loadComponent: () => import('./admin/artifact-table/artifact-table')
            .then(c => c.ArtifactTable)
    },
    {
        path: 'artifact-editor',
        loadComponent: () => import('./admin/artifact-editor/artifact-editor')
            .then(c => c.ArtifactEditor)
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login')
            .then(c => c.Login)
    },
    {
        path: 'notes',
        loadComponent: () => import('./admin/notes/notes')
            .then(c => c.Notes)
    },
    {
        path: 'pwa-notes',
        loadComponent: () => import('./admin/pwa-notes/pwa-notes')
            .then(c => c.PwaNotes)
    },
    {
        path: '**',
        loadComponent: () => import('./visitor/landing-page/landing-page')
            .then(c => c.LandingPage)
    }

];
