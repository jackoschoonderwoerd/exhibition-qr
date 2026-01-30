import { Injectable, inject, signal, computed } from '@angular/core';
import {
    Auth,
    AuthError,
    UserCredential,
    signInWithEmailAndPassword
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { FirestoreService } from '../services/firestore.service';
import { WrongEmailPasswordComponent } from './wrong-email-password/wrong-email-password.component';
import { onAuthStateChanged } from 'firebase/auth';

// import { WrongEmailPasswordComponent } from './login/wrong-email-password/wrong-email-password.component';


@Injectable({ providedIn: 'root' })
export class AuthStore {

    // ---------- STATE ----------
    private _state = signal({
        isLoggedIn: false,
        initialized: false
    });

    // ---------- COMPUTED ----------
    isLoggedIn = computed(() => this._state().isLoggedIn);
    initialized = computed(() => this._state().initialized);

    // ---------- INJECTIONS ----------
    private auth = inject(Auth);
    private router = inject(Router);
    private dialog = inject(MatDialog);
    private snackbar = inject(SnackbarService);
    private fs = inject(FirestoreService);

    constructor() {
        this.persistLogin(); // ✅ ensures auth state syncs on app start
    }

    // ---------- METHODS ----------
    async login(user: { email: string; password: string }): Promise<void> {
        console.log('login()')
        if (!user) return;

        try {
            const userCredential: UserCredential =
                await signInWithEmailAndPassword(this.auth, user.email, user.password);

            this._state.update(s => ({ ...s, isLoggedIn: true }));

            this.snackbar.openSnackbar(`you are logged in : ${userCredential.user.email}`, 3000);
            this.router.navigateByUrl('/artifact-table');

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
        console.log('logout()')
        try {
            await this.auth.signOut();
            this.snackbar.openSnackbar('you are successfully logged out', 3000);
        } catch (err) {
            this.snackbar.openSnackbar('failed to log out', 3000);
        }

        this._state.update(s => ({ ...s, isLoggedIn: false }));
    }

    /** If Firebase already has a session */
    persistLogin() {
        onAuthStateChanged(this.auth, user => {
            this._state.update(s => ({
                ...s,
                isLoggedIn: !!user,
                initialized: true
            }));
        });
    }
}
