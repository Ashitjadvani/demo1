import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ServerSettingsManagementService } from 'projects/fe-common/src/lib/services/server-settings-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';

const ServerSettingsKey = 'server-settings';

export class ServerSettings {
    fullSmartWorkingFlow: boolean;
    deskCheckOutMandatory: boolean;
    peopleDashboardUrl: string;
}

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    serverSettings: ServerSettings;
    userLanguageSelect: string;

    constructor(private serverSettingsManagementService: ServerSettingsManagementService,
        private settingManager: SettingsManagementService,
        private snackBar: MatSnackBar,
        public translate: TranslateService) { }

    async ngOnInit() {
        let res = await this.serverSettingsManagementService.getValue(ServerSettingsKey);
        if (res && res.result) {
            this.serverSettings = res.value;
        } else {
            this.serverSettings = new ServerSettings();
        }

        this.userLanguageSelect = this.settingManager.getSettingsValue('currentLanguage');
    }

    async onSaveSettings() {
        let res = await this.serverSettingsManagementService.setValue(ServerSettingsKey, this.serverSettings);
        if (res && res.result) {
            this.snackBar.open(this.translate.instant('ADMIN SETTINGS.SaveSettingsSuccess'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }
    onLanguageChange(valueLanguage: MatSelectChange) {
        this.translate.use(valueLanguage.value);
        this.settingManager.setSettingsValue('currentLanguage', valueLanguage.value);
    }


}
