import {ChangeDetectorRef, Inject, OnInit} from '@angular/core';
import { Component, Injectable } from '@angular/core';
import { inject } from '@angular/core/testing';
import { NativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { SessionManagementService } from 'projects/fe-common/src/lib/services/session-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { timer } from 'rxjs';
import {UserCapabilityService} from "./services/user-capability.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'fe-insights';
    loaderVisible: boolean;


    constructor(public translate: TranslateService,
        private _swUpdate: SwUpdate,
        private settingManager: SettingsManagementService,
        private notifyManagementService: NotifyManagementService,
        private sessionManagementService: SessionManagementService,
        private router: Router,
        private userCapabilityService: UserCapabilityService,
        private cdRef: ChangeDetectorRef,
        private userManagementService: UserManagementService,) {
        translate.addLangs(['en', 'es', 'it', 'fr']);
        translate.setDefaultLang('en');
        let userLanguage: string;
        userLanguage = this.settingManager.getSettingsValue('currentLanguage');
        if (userLanguage != null) {
            translate.use(userLanguage);
        } else {
            const browserLang = translate.getBrowserLang();
            translate.use(browserLang.match(/en|es|it|fr/) ? browserLang : 'en');
        }

        sessionManagementService.onSessionExpired.subscribe(async () => {
            this.userManagementService.invalidateToken();
            await this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('LOGIN PAGE.USER SESSION EXPIRED'));
            this.router.navigate(['']);
        });

        this.userCapabilityService.loaderVisibilityChange.subscribe((value) => {
          this.loaderVisible = value;
          this.cdRef.detectChanges();
        });
    }



    async ngOnInit() {
        // await this._userManagementService.refreshToken();

        let showing = false;
        if (this._swUpdate.isEnabled) {
            this._swUpdate.available.subscribe(async () => {
                if (!showing) {
                    showing = false;

                    await this.notifyManagementService.openMessageDialog('IRINA', 'E\' disponibile una nuova versione della App. Ti verrà chiesto di rifare il login per aggiornare. Grazie.');

                    this.userManagementService.logout();
                    this.router.navigate(['insights']);
                    window.location.reload();
                }
            });
        }

        timer(3000, 3000).subscribe(() => this._swUpdate.checkForUpdate());
    }
}
