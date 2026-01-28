import { Injectable, inject, signal, computed } from '@angular/core';
import {
    Auth,
    AuthError,
    UserCredential,
    signInWithEmailAndPassword
} from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { FirestoreService } from '../services/firestore.service';
import { WrongEmailPasswordComponent } from './wrong-email-password/wrong-email-password.component';

// import { WrongEmailPasswordComponent } from './login/wrong-email-password/wrong-email-password.component';


@Injectable({ providedIn: 'root' })
export class AuthStore {

    // ---------- STATE ----------
    private _state = signal({
        isLoggedIn: false
    });

    // ---------- COMPUTED ----------
    isLoggedIn = computed(() => this._state().isLoggedIn);

    // ---------- INJECTIONS ----------
    private auth = inject(Auth);
    private router = inject(Router);
    private dialog = inject(MatDialog);
    private snackbar = inject(SnackbarService);
    private fs = inject(FirestoreService);

    // ---------- METHODS ----------
    async login(user: { email: string; password: string }): Promise<void> {
        if (!user) return;

        try {
            const userCredential: UserCredential =
                await signInWithEmailAndPassword(this.auth, user.email, user.password);

            this._state.update(s => ({ ...s, isLoggedIn: true }));

            this.snackbar.openSnackbar(`you are logged in : ${userCredential.user.email}`);
            this.router.navigateByUrl('/upcoming-shows');

        } catch (err: any) {
            const error = err as AuthError;

            console.error(error.message);

            this.dialog.open(WrongEmailPasswordComponent, {
                data: { message: error }
            });

            this._state.update(s => ({ ...s, isLoggedIn: false }));
        }
    }

    async logout(): Promise<void> {
        try {
            await this.auth.signOut();
            this.snackbar.openSnackbar('you are successfully logged out');
        } catch (err) {
            this.snackbar.openSnackbar('failed to log out');
        }

        this._state.update(s => ({ ...s, isLoggedIn: false }));
    }

    /** If Firebase already has a session */
    persistLogin() {
        this._state.update(s => (
            { ...s, isLoggedIn: true }
        ));
    }
}
