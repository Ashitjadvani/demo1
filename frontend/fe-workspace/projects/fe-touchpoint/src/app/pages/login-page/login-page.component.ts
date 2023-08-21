import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResult } from 'projects/fe-common/src/lib/models/api/login-result';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Subscription } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { EnvironmentService } from '../../services/environment.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    username: string;
    password: string;
    showLoader: boolean = false;
    version: string;
    sessionExpired: boolean = false;
    sub: Subscription;

    constructor(private activatedRoute: ActivatedRoute,
        private userManagementService: UserManagementService,
        private router: Router,
        private notifyManagementService: NotifyManagementService,
        private environment: EnvironmentService,
        public translate: TranslateService
    ) {
        this.version = this.environment.getVersion();
        this.sessionExpired = false;

        try {
            this.sessionExpired = this.router.getCurrentNavigation().extras.state.sessionExpired;
        } catch (ex) {

        }
        console.log('isSession Expired: ', this.sessionExpired);
    }

    async ngOnInit() {
        if (this.sessionExpired) {
            await this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('LOGIN PAGE.USER SESSION EXPIRED'));
            this.sessionExpired = false;
        } 
        this.sub = this.activatedRoute.queryParams.subscribe(params => {
            this.username = params['u'];
        });
            
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    async onLogin() {
        this.showLoader = true;

        let res: LoginResult = await this.userManagementService.login(this.username, this.password, false);
        if (!res.result) {
            this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('LOGIN PAGE.LOGIN ERROR') + res.reason);
        } else {
            this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), 'Per accedere al touchpoint seguire la procedura di pairing.');
        }

        this.showLoader = false;
    }
}
