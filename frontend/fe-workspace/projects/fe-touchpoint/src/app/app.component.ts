import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { timer } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'fe-touchpoint';
    text: string;

    constructor(public translate: TranslateService,
        private _swUpdate: SwUpdate,
        private notifyManagementService: NotifyManagementService,
        private router: Router,
        private settingManager: SettingsManagementService,
        private userManagementService: UserManagementService) {
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
    }
    
    async ngOnInit() {
        console.log('AppComponent initialization.');

        if (this._swUpdate.isEnabled) {
            console.log('SwUpdate enabled');
            this._swUpdate.available.subscribe(async () => {
                console.log('SwUpdate new version available');

                await this.notifyManagementService.openMessageDialog('IRINA', 'E\' disponibile una nuova versione della App.');

                this.router.navigate['/'];
                window.location.reload();

            });
        }

        timer(5000, 5000).subscribe(() => this._swUpdate.checkForUpdate());
    }
}
