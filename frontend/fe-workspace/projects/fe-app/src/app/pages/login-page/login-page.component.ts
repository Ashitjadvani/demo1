import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginResult } from 'projects/fe-common/src/lib/models/api/login-result';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { EnvironmentService } from 'projects/fe-touchpoint/src/app/services/environment.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
    registerAdmin: boolean;
    username: string;
    password: string;
    showLoader: boolean = false;
    version: string;
    sessionExpired: boolean = false;
    sub: Subscription;
    showPassword: boolean = false;
    confPassword: string;
    resetPasswordScreen: boolean = true;

    constructor(private activatedRoute: ActivatedRoute,
        private userManagementService: UserManagementService,
        private notifyManagementService: NotifyManagementService,
        private router: Router,
        private snackBar: MatSnackBar,
        private _env: EnvironmentService,
        public translate: TranslateService
    ) {
        this.version = this._env.getVersion();
    }

    async ngOnInit() {
        this.sub = this.activatedRoute.queryParams.subscribe(params => {
            this.username = params['u'];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    async onLogin(isLogin) {
        this.showLoader = true;

        try {    
            // let ret = await this.adminUserManagementService.login(this.email, this.password);
            let res: LoginResult = await this.userManagementService.login(this.username, this.password, true, isLogin);
            console.log("res", res);
            if (res.result == true && res.resetPassword == true) {
                this.router.navigate(["home"]);

            } else if (res.result == true && res.resetPassword == false) {
                this.resetPasswordScreen = false;
                this.username = null;
                this.password = null;
            } else {
                this.snackBar.open(res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
            }
        } catch (ex) {
            this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }

        // let res: LoginResult = await this._userManagementService.login(this.username, this.password, false);
        // if (!res.result) {
        //     this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('LOGIN PAGE.LOGIN ERROR') + res.reason);
        // } else {
        //     this._router.navigate(["home"]);
        // }

        this.showLoader = false;
    }

    onToggleShowPassword() {
        this.showPassword = !this.showPassword;
    }
}
