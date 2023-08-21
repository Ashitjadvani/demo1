import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate } from '@angular/service-worker';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { SessionManagementService } from 'projects/fe-common/src/lib/services/session-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit  {
    title = 'fe-app';
    
    constructor(public translate: TranslateService,
        private _swUpdate: SwUpdate,
        private settingManager: SettingsManagementService,
        private notifyManagementService: NotifyManagementService,
        private sessionManagementService: SessionManagementService,
        private router: Router,
        private userManagementService: UserManagementService) {
        translate.addLangs(['en', 'es', 'it', 'fr']);
        translate.setDefaultLang('en');
        let userLanguage: string;
        userLanguage = this.settingManager.getSettingsValue('currentLanguage');
        if (userLanguage != null) {
            translate.use(userLanguage);
        } else {
            const browserLang = translate.getBrowserLang();
            let useLang = browserLang.match(/en|es|it|fr/) ? browserLang : 'en';
            
            translate.use(useLang);
            this.settingManager.setSettingsValue('currentLanguage', useLang);
        }

        sessionManagementService.onSessionExpired.subscribe(async () => {
            await this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('LOGIN PAGE.USER SESSION EXPIRED'));
            this.router.navigate(['']);
        });
    }

    async ngOnInit() {
        console.log('AppComponent initialization');

        if (this._swUpdate.isEnabled) {
            console.log('SwUpdate enabled');
            this._swUpdate.available.subscribe(async () => {
                console.log('SwUpdate new version available !!!');

                await this.notifyManagementService.openMessageDialog('IRINA', 'E\' disponibile una nuova versione della App. Ti verrà chiesto di rifare il login per aggiornare. Grazie.');

                this.userManagementService.logout();
                window.location.reload();
            });

            timer(30000, 30000).subscribe(() => {
                this._swUpdate.checkForUpdate().then(() => {
                    console.log('checked updates done');
                }).catch ((res) => {
                    console.log('checked updates error: ', res);
                })
            });
        }
    }

    ngAfterViewInit(): void {
        // hack: https://stackoverflow.com/questions/57782617/how-to-remove-pwa-service-worker-and-its-cache-from-client-browser-after-remove
        //
    }

}
