import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AppService} from '../../shared/service/app.service';
@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.style.css']
})

export class LoginComponent implements OnInit, AfterViewChecked {
    public userLike = {};
    private signInForm: NgForm;
    @ViewChild('signInForm') viewSignInForm: NgForm;
    public globalErrorMessage: string = '';

    constructor(private userService: UserService,
                private router: Router,
                private appService: AppService) {

    }

    ngOnInit() {
        this.appService.user.subscribe(
            user => {
                if (user && user.type === 'temporary') {
                    this.router.navigate(['/']);
                }
            }
        )
    }

    ngAfterViewChecked():void {
        if (this.viewSignInForm === this.signInForm) {
            return;
        }

        this.signInForm = this.viewSignInForm;
        if (this.signInForm) {
            this.signInForm.valueChanges
                .subscribe(data => {
                    const form = this.signInForm.form;

                    for (const field in this.signInFormErrors) {
                        // clear previous error message (if any)
                        this.signInFormErrors[field] = '';
                        const control = form.get(field);
                        if (control && control.dirty &&  !control.valid) {
                            const messages = this.signInValidationMessages[field];
                            for (const key in control.errors) {
                                this.signInFormErrors[field] += messages[key] ? messages[key] + ' ' : '';
                            }
                        }
                    }
                });
        }
    }

    logIn() {
        this.userService.signInUser(this.userLike)
            .subscribe(
                success => {
                    this.router.navigate(['/']);
                },
                errorResponse => {
                    console.dir(errorResponse);
                    this.globalErrorMessage = errorResponse.error.msg;
                }
            )
    }

    public signInFormErrors = {
        email: '',
        password: ''
    };

    private signInValidationMessages = {
        email: {
            required: 'Email is required.',
            pattern:  'Please enter valid email.',
            maxlength: 'Maximum length must be 128'
        },
        password: {
            required: 'Password is required.',
            minlength: 'Minimum length is 6'
        }
    };
}