import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import swal from "sweetalert2";
import {AdminUserManagementService} from '../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import {UserManagementService} from '../../../../../fe-common-v2/src/lib/services/user-management.service';
import {CommonService} from '../../../../../fe-common-v2/src/lib/services/common.service';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoginResult} from '../../../../../fe-common-v2/src/lib/models/api/login-result';
import {MCPHelperService} from '../../service/MCPHelper.service';
import {any} from 'codelyzer/util/function';
import {EnvironmentService} from "../../../../../fe-touchpoint/src/app/services/environment.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    hide = true;
    loginForm: FormGroup;
    private destroy$ = new Subject();
    primaryColor: any;
    version: string;
    groupCountNum: any;
    registerAdmin: boolean;
    resetPasswordScreen: boolean = true;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private _env: EnvironmentService,
        private snackBar: MatSnackBar,
        private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private commonService: CommonService,
        public translate: TranslateService,
        private helper: MCPHelperService,
    ) {
        this.version = this._env.getVersion();
        let RememberMe: any = localStorage.getItem('RememberMe');
        let isRemberMeChecked = false;
        let username = null;
        let password = null;

        if (RememberMe) {
            RememberMe = JSON.parse(RememberMe);
            if (RememberMe && RememberMe.isRemberMeChecked) {
                isRemberMeChecked = true;
                username = RememberMe.username;
                password = RememberMe.password;
            }
        }
        this.loginForm = this.formBuilder.group({
            username: [username, Validators.required],
            password: [password, Validators.required],
            isRemberMeChecked: [isRemberMeChecked]
        });
    }

    async ngOnInit(): Promise<void> {
        const loginData = localStorage.getItem('authToken');
        const res = await this.adminUserManagementService.getAdminConfigured();
        if (!this.commonService.isValidResponse(res)) {
            this.registerAdmin = true;
        }
        this.changeTheme("#4B6BA2");
    }

    async onSubmit(isLogin): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        try {
            if (this.loginForm.valid) {
                const res: LoginResult = await this.userManagementService.login(this.loginForm.value.username, this.loginForm.value.password, true, isLogin);
                if (res.result === true && res.resetPassword === true) {
                    this.helper.toggleLoaderVisibility(false);
                    if (this.loginForm.value.isRemberMeChecked) {
                        localStorage.setItem('RememberMe', JSON.stringify(this.loginForm.value));
                    } else {
                        localStorage.removeItem('RememberMe');
                    }
                    let arcadiaLoggedUser = this.userManagementService.getAccount();
                    this.groupCountNum = this.userManagementService.groupCount();
                    if (this.groupCountNum !== 0) {
                        this.router.navigate(['dashboard']);
                    } else {
                        swal.fire(
                            '',
                            this.translate.instant('LOGIN PAGE.USER NOT AUTHORIZED ACCESS SYSTEM'),
                            'info'
                        );
                    }
                    MCPHelperService.getLocalStorage();
                } else if (res.result === true && res.resetPassword === false) {
                    this.helper.toggleLoaderVisibility(false);
                    // localStorage.setItem('reset-otp', JSON.stringify(res.user.otp));
                    this.router.navigate(['reset-password']);
                    this.resetPasswordScreen = false;
                    this.loginForm.value.username = null;
                    this.loginForm.value.password = null;
                } else {
                    swal.fire(
                        '',
                        this.translate.instant(res.reason),
                        'info'
                    );
                    this.helper.toggleLoaderVisibility(false);
                }
            } else {
                this.helper.toggleLoaderVisibility(false);
            }
        } catch (ex) {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'),
                'info'
            );
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();  // trigger the unsubscribe
        this.destroy$.complete(); // finalize & clean up the subject stream
    }

    changeTheme(primaryColor: string) {
        document.documentElement.style.setProperty("--primary-color", primaryColor)
    }

}
