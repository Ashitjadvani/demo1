import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {EnvironmentService} from "../../../../../fe-touchpoint/src/app/services/environment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserManagementService} from "../../../../../fe-common-v2/src/lib/services/user-management.service";
import {AdminUserManagementService} from "../../../../../fe-common-v2/src/lib/services/admin-user-management.service";
import {CommonService} from "../../../../../fe-common-v2/src/lib/services/common.service";
import {TranslateService} from "@ngx-translate/core";
import {MCPHelperService} from "../../service/MCPHelper.service";
import {LoginResult} from "../../../../../fe-common-v2/src/lib/models/api/login-result";
import swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class EmcLoginComponent implements OnInit, OnDestroy {
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
        let EMCRememberMe: any = localStorage.getItem('EMCRememberMe');
        let isRemberMeChecked = false;
        let username = null;
        let password = null;
        let secretcode = null;

        if (EMCRememberMe) {
            EMCRememberMe = JSON.parse(EMCRememberMe);
            if (EMCRememberMe && EMCRememberMe.isRemberMeChecked) {
                isRemberMeChecked = true;
                username = EMCRememberMe.username;
                password = EMCRememberMe.password;
                secretcode = EMCRememberMe.secretcode;
            }
        }
        this.loginForm = this.formBuilder.group({
            username: [username, Validators.required],
            password: [password, Validators.required],
            secretcode: [secretcode, Validators.required],
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
                        localStorage.setItem('EMCRememberMe', JSON.stringify(this.loginForm.value));
                    } else {
                        localStorage.removeItem('EMCRememberMe');
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
