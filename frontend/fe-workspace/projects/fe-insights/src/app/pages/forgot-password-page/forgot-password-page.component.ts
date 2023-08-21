import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginResult } from 'projects/fe-common/src/lib/models/api/login-result';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { VERSION } from 'projects/fe-insights/src/environments/version';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent implements OnInit {

    registerAdmin: boolean;
    username: string;
    otp: string;
    email: string;
    password: string;
    confPassword: string;

    version: string;

    showLoader: boolean = false;
    showPassword: boolean = false;
    forgotPasswordPage: boolean = true;

    constructor(private router: Router,
        private snackBar: MatSnackBar,
        private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private commonService: CommonService,
        public translate: TranslateService
    ) {
        this.version = VERSION;
    }

    async ngOnInit() {
        let res = await this.adminUserManagementService.getAdminConfigured();
        if (!this.commonService.isValidResponse(res)) {
            this.registerAdmin = true;
        }
    }

    async onLogin() {
        try {
            // let ret = await this.adminUserManagementService.login(this.email, this.password);
            let res: LoginResult = await this.userManagementService.login(this.username, this.password, true);
            if (res.result == true) {
                let arcadiaLoggedUser = this.userManagementService.getAccount();
                this.router.navigate(['insights/main']);

            } else {
                this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.LOGIN FAILED') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
            }
        } catch (ex) {
            this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onForgotPassword() {
      try {
          this.showLoader = true;
          let res: LoginResult = await this.userManagementService.forgotPassword(this.email);
          if (res.result == true) {
            this.showLoader = false;
            this.forgotPasswordPage = !this.forgotPasswordPage;
            this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.FORGOT SEND OTP SUCCESS'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
          } else {
            this.showLoader = false;
              this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.LOGIN FAILED') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
          }
      } catch (ex) {
        this.showLoader = false;
        this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
      }
    }

  async onResetPassword() {
      try {
          let res: LoginResult = await this.userManagementService.resetPassword(this.otp, this.password, this.confPassword);
          if (res.result == true) {
              this.router.navigate(['/']);
          } else {
              this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.LOGIN FAILED') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
          }
      } catch (ex) {
          this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
      }
  }

    onToggleShowPassword() {
        this.showPassword = !this.showPassword;
    }
}
