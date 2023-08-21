import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CareerApiService } from '../../service/careerApi.service';
import { CareerHelperService } from '../../service/careerHelper.service';
import { Subject, Subscription } from 'rxjs';
import swal from 'sweetalert2';
import {
    AuthService,
    GoogleLoginProvider,
    LinkedinLoginProvider,
} from 'ng-social-login-module';
import { SocialUser } from 'ng-social-login-module';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    logoImage = './assets/image/lagacy-logo.svg';
    loginImg = './assets/image/login-signup.svg';
    linkdinIcon = './assets/image/linkdin.svg';
    googleIcon = './assets/image/google-icon.svg';
    eyeIcon = './assets/image/eye-icon.svg';
    loginForm: FormGroup;
    signup: FormGroup;
    hide = true;
    checkBoxVerify = false;
    private user: SocialUser;
    private loggedIn: boolean;
    linkedIndata = '';
    baseUrlLink: any;
    linkedInCredentials = {
        clientId: '77hilwop9t433d',
        client_secret: 'XwKW7Y7lfJfC5JVH',
        redirectUrl: this.document.location.origin + '/linkedinLoginResponse',
        scope: 'r_liteprofile%20r_emailaddress%20w_member_social' // To read basic user profile data and email
    };
    constructor(
        private route: ActivatedRoute,
        private loginFormData: FormBuilder,
        private signupFormData: FormBuilder,
        private apiService: CareerApiService,
        private router: Router,
        private helper: CareerHelperService,
        private translate: TranslateService,
        private authService: AuthService,
        private http: HttpClient,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.linkedIndata = this.route.snapshot.queryParams.data;
        const password = null;
        const email = null;
        this.baseUrlLink = this.document.location + '/linkedinLoginResponse';
        this.loginForm = this.loginFormData.group({
            email: [
                email,
                Validators.compose([
                    Validators.required,
                    // Validators.email,
                    Validators.maxLength(50),
                    // Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$')
                ]),
            ],
            password: [password, Validators.required],
        });

        // for signup
        this.signup = this.signupFormData.group(
            {
                nome: ['', Validators.required],
                cognome: ['', Validators.required],
                email: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.maxLength(50),
                        //Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
                        Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$')
                    ]),
                ],
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
            },
            { validator: this.ConfirmedValidator('password', 'confirmPassword') },
        );
    }

    ngOnInit(): void {
        if (CareerHelperService.loginUserToken) {
            this.router.navigate(['/']);
        }

        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = user != null;
        });
    }

    onSubmit(): void {
        // {{'GENERAL.TermsCondition' | translate}}
        if (this.loginForm.valid) {
            this.helper.toggleSidebarVisibility(true);
            this.apiService.login(this.loginForm.value).subscribe(
                (data: any) => {
                    this.helper.toggleSidebarVisibility(false);
                    const loginUser: any = data;
                    if (loginUser.result) {
                        this.helper.toggleLoginVisibility(false);
                        this.helper.saveLocalStorage(loginUser);
                        this.router.navigate(['/']);
                    } else {
                        swal.fire(
                            this.translate.instant('GENERAL.Sorry'),
                            this.translate.instant(loginUser.reason),
                            'info'
                        );
                    }
                },
                (err) => {
                    this.helper.toggleSidebarVisibility(false);
                    // const e = this.translate.instant(err.result.reson);
                    const e = this.translate.instant('SERVER_ERROR_MSG');
                    swal.fire(this.translate.instant('GENERAL.Sorry'), e, 'info');
                }
            );
        }
    }

    agreeWithCondition() {
        swal.fire(
            this.translate.instant('GENERAL.Sorry'),
            this.translate.instant('Please accept terms and condition and privacy policy'),
            'info'
        );
    }

    // login with google
    signInWithGoogle(): void {
        // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res: any) => {
            const data = {
                tokenId: res.id,
                email: res.email,
                nome: res.name.split(' ')[0],
                cognome: res.name.split(' ')[1],
                type: 'google',
            };
            this.helper.toggleSidebarVisibility(true);
            this.apiService.signup(data).subscribe(
                (data: any) => {
                    this.helper.toggleSidebarVisibility(false);
                    const loginUser: any = data;
                    if (loginUser.result) {
                        this.helper.saveLocalStorage(loginUser);
                        this.router.navigate(['/']);
                    } else {
                        swal.fire(
                            this.translate.instant('GENERAL.Sorry'),
                            this.translate.instant(loginUser.reason),
                            'info'
                        );
                    }
                },
                (err) => {
                    this.helper.toggleSidebarVisibility(false);
                    // const e = this.translate.instant(err.result.reson);
                    const e = this.translate.instant('SERVER_ERROR_MSG');
                    swal.fire(
                        this.translate.instant('GENERAL.Sorry'),
                        e,
                        'info'
                    );
                }
            );
        });
    }
    // login with linkedin


    signInWithLinkedIN(): void {
        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}&state=123&response_type=code&client_id=${this.linkedInCredentials.clientId}`;
    }

    onSignupSubmit(): void {
        if (this.signup.valid) {
            if (this.checkBoxVerify) {
                this.helper.toggleSidebarVisibility(true);
                this.apiService.signup(this.signup.value).subscribe(
                    (data: any) => {
                        this.helper.toggleSidebarVisibility(false);
                        const loginUser: any = data;
                        if (loginUser.result) {
                            // this.helper.saveLocalStorage(loginUser);
                            CareerHelperService.signUPEmailID = this.signup.value.email;
                            // this.helper.saveLocalStorage(loginUser);
                            this.router.navigate(['/verify-code']);
                            /*swal.fire(
                              '',
                              this.translate.instant('VERIFYSIGNUPFORM.VerificationCodeSendMailID'),
                              'success');*/
                        } else {
                            swal.fire(
                                this.translate.instant('GENERAL.Sorry'),
                                this.translate.instant(loginUser.reason),
                                'info'
                            );
                        }
                    },
                    (err) => {
                        this.helper.toggleSidebarVisibility(false);
                        // const e = this.translate.instant(err.result.reson);
                        const e = this.translate.instant('SERVER_ERROR_MSG');
                        swal.fire(this.translate.instant('GENERAL.Sorry'), e, 'info');
                    }
                );
            } else {
                swal.fire(this.translate.instant('GENERAL.Attenzione'),
                    this.translate.instant('Please accept terms and condition and privacy policy'),
                    'info');
            }
        }
    }

    ConfirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }
}
