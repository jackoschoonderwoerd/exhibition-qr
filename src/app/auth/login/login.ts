import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AuthStore } from '../auth.store';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        ReactiveFormsModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    form: FormGroup;
    fb = inject(FormBuilder);
    authStore = inject(AuthStore);
    email: string = 'jackoboes@gmail.com';
    password: string = '123456'
    router = inject(Router)

    constructor() {
        this.initForm()
    }

    initForm() {
        this.form = this.fb.group({
            email: new FormControl('jackoboes@gmail.com', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })
    }

    onCancel() {
        this.router.navigateByUrl('agenda')
    }
}
