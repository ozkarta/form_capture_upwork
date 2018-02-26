import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {AppService} from '../../shared/service/app.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.style.css']
})

export class RegisterComponent implements OnInit, AfterViewChecked {
    public user: any = {
        role: 'buyer',
        address: {}
    };
    private registrationForm: NgForm;
    @ViewChild('registrationForm') viewRegistrationForm: NgForm;

    constructor(private userService: UserService,
                public appService: AppService,
                private router: Router) {

    }

    ngOnInit() {
        this.appService.user.subscribe(
            user => {
                if (user) {
                    this.router.navigate(['/']);
                }
            }
        )
    }

    ngAfterViewChecked():void {
        if (this.viewRegistrationForm === this.registrationForm) {
            return;
        }

        this.registrationForm = this.viewRegistrationForm;
        if (this.registrationForm) {
            this.registrationForm.valueChanges
                .subscribe(data => {
                    const form = this.registrationForm.form;

                    for (const field in this.registrationFormErrors) {
                        // clear previous error message (if any)
                        this.registrationFormErrors[field] = '';
                        const control = form.get(field);
                        if (control && control.dirty &&  !control.valid) {
                            const messages = this.registrationValidationMessages[field];
                            for (const key in control.errors) {
                                this.registrationFormErrors[field] += messages[key] ? messages[key] + ' ' : '';
                            }
                        }
                    }
                });
        }
    }

    register() {
        console.log('registration');
        this.userService.registerUser(this.user)
            .subscribe(
                success => {
                    this.router.navigate(['/']);
                },
                error => {
                    console.dir(error);
                }
            )
    }

    public registrationFormErrors = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        province: '',
        city: '',
        street: '',
        zip: ''
    };

    private registrationValidationMessages = {
        firstName: {
            required: 'First name is required.'
        },
        lastName: {
            required: 'Last name is required.'
        },
        email: {
            required: 'Email is required.',
            pattern:  'Please enter valid email.',
            maxlength: 'Maximum length must be 128'
        },
        password: {
            required: 'Password is required.',
            minlength: 'Minimum length is 6'
        },
        confirmPassword: {
            required: 'Password Confirmation is required.',
            validateEqual: 'Passwords don\'t match.',
            minlength: 'Minimum length is 6'
        },
        country: {
            required: 'Country is required.'
        },
        province: {
            required: 'Province is required.'
        },
        city: {
            required: 'City is required.'
        },
        street: {
            required: 'Street is required.'
        },
        zip: {
            required: 'ZIP code is required.'
        },
    };
}