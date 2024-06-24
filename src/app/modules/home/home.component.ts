import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'app/core/auth/auth.service';
import { catchError, first, of } from 'rxjs';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        RouterLink,
        ReactiveFormsModule,
        CommonModule
    ],
})
export class LandingHomeComponent {

    form!: FormGroup;
    loading = false;
    submitted = false;
    boolShowErrorMessage = false;

    /**
     * Constructor
     */
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.boolShowErrorMessage = false
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        this.authService.signIn({ email: this.f['email'].value, password: this.f['password'].value })
            .pipe(first())
            .pipe(catchError(() => {
                // already authenticated
                setTimeout(() => {

                    this.boolShowErrorMessage = false
                    this.loading = false;
                    this.router.navigateByUrl("/dashboard");

                }, 500)

                return of([
                    200,
                    {}
                ]);

            }))
            .subscribe((result: [number, object]) => {

                if (result[1]) {

                    this.router.navigateByUrl("/dashboard");
                    this.boolShowErrorMessage = false

                } else {

                    // show error message
                    setTimeout(() => {

                        this.boolShowErrorMessage = true
                        this.loading = false;
                        this.router.navigateByUrl("/home");

                    }, 500)

                }
            });
    }

    dimissErrorMessage() {
        this.boolShowErrorMessage = false
    }
}
