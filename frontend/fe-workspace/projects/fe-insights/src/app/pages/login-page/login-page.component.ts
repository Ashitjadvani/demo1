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
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    registerAdmin: boolean;
    username: string;
    password: string;

    version: string;

    showLoader: boolean = false;
    showPassword: boolean = false;
    confPassword: string;
    resetPasswordScreen: boolean = true;

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

  async onLogin(isLogin) {
    try {
      // let ret = await this.adminUserManagementService.login(this.email, this.password);
      let res: LoginResult = await this.userManagementService.login(this.username, this.password, true, isLogin);
      if (res.result == true && res.resetPassword == true) {
        let arcadiaLoggedUser = this.userManagementService.getAccount();
        this.router.navigate(['insights/main']);

      } else if (res.result == true && res.resetPassword == false) {
        this.resetPasswordScreen =  false;
        this.username = null;
        this.password = null;
      } else {
        this.snackBar.open(res.reason, this.translate.instant('GENERAL.OK'), {duration: 3000});
      }
    } catch (ex) {
      this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    }
  }

    onToggleShowPassword() {
        this.showPassword = !this.showPassword;
    }
}
