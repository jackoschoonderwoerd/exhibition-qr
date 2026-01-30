import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { environment } from '../environments/environment.prod';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideServiceWorker } from '@angular/service-worker';

import { MatIconRegistry } from '@angular/material/icon';
import { inject } from '@angular/core';





export const appConfig: ApplicationConfig = {



    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideFirebaseApp(() =>
            initializeApp(environment.firebase)
        ),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
    ]
};
