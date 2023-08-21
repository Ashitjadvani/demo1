import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NSHelperService} from '../../service/NSHelper.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import swal from 'sweetalert2';
import {NSApiService} from '../../service/NSApi.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginIMG = './assets/images/login-img.svg';
    logoIMG = './assets/images/logo-login.svg';
    hide = true;
    loginForm: FormGroup;
    private destroy$ = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private Api: NSApiService,
        private helper: NSHelperService
    ) {
        this.loginForm = this.formBuilder.group({
            email: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
            password: [null, Validators.required]
        });
    }

    onSubmit(): void {
        this.helper.toggleLoaderVisibility(true);
        if (this.loginForm.valid) {
            this.Api.login(this.loginForm.value)
                .pipe(takeUntil(this.destroy$))
                .subscribe((data: any) => {
                    if (data.statusCode == '200'){
                        this.helper.toggleLoaderVisibility(false);
                        const user = data.data;
                        NSHelperService.saveLocalStorage(user);
                        this.router.navigate(['dashboard']);
                    }
                }, (error) => {
                    this.helper.toggleLoaderVisibility(false);
                    const e = error.error;
                    swal.fire(
                        'Info!',
                        e.message,
                        'error'
                    );
                });
        }
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.destroy$.next();  // trigger the unsubscribe
        this.destroy$.complete(); // finalize & clean up the subject stream
    }

}
