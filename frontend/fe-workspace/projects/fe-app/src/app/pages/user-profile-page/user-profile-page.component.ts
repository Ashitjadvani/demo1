import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { ACCESS_CONTROL_LEVEL, Person } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { EnvironmentService } from 'projects/fe-touchpoint/src/app/services/environment.service';

export interface Language {
    value: string;
    viewValue: string;
}

class TableField {
    Field: string;
    Value: string;
}

@Component({
    selector: 'app-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent implements OnInit {

    userQR: string;
    qrLevel: string = 'Q';
    appVersion: string;
    userLanguageSelect: string;

    currentAccount: Person;
    userFields = new MatTableDataSource<TableField>();
    activitiesFields = new MatTableDataSource<TableField>();
    currSite: Site;

    displayedColumns = [
        'Field',
        'Value',
    ];

    constructor(private _common: CommonService,
        private _userManagementService: UserManagementService,
        private _adminSiteManagementService: AdminSiteManagementService,
        private _env: EnvironmentService,
        private _router: Router,
        private _adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        private _settingManager: SettingsManagementService
    ) {

    }

    formatDate(date: Date): string {
        return date == null ? '-' : this._common.formatDateTime(date, 'HH:mm:ss');
    }

    async ngOnInit() {
        this.currentAccount = this._userManagementService.getAccount();
        let result = await this._adminUserManagementService.getPeople(this.currentAccount.companyId);
        for(let person of result.people) {
            if(person.id == this.currentAccount.id) {
                this.currentAccount = person;
                break;
            } 
        }
        let res2 = await this._adminSiteManagementService.getSites(this.currentAccount.companyId);
        this.currSite = res2.sites.filter(site => site.id == this.currentAccount.site)[0];

        let values: TableField[] = [
            { Field: this.translate.instant('GENERAL.ID'), Value: this.currentAccount.badgeId },
            { Field: this.translate.instant('GENERAL.NAME'), Value: this.currentAccount.name + ' ' + this.currentAccount.surname },
            { Field: this.translate.instant('GENERAL.AREA'), Value: this.currentAccount.area },
            { Field: this.translate.instant('GENERAL.EMAIL'), Value: this.currentAccount.email }
        ];

        this.userFields.data = values;

        // TODO let res = await this._agosApiService.getUserActivity(this.arcadiaUser.id);

        let activityValues: TableField[] = [
            { Field: this.translate.instant('USER PROFILE.OFFICE IN'), Value: '-' },
            { Field: this.translate.instant('USER PROFILE.DESK CHECKIN'), Value: '-' },
            { Field: this.translate.instant('USER PROFILE.DESK CHECKOUT'), Value: '-' },
            { Field: this.translate.instant('USER PROFILE.OFFICE OUT'), Value: '-' }
        ];

        // console.log('User actvity: ', res);
        // if (res.result && res.userActivity) {
        //     activityValues = [
        //         { Field: this.translate.instant('USER PROFILE.OFFICE IN'), Value: this.formatDate(res.userActivity.officeInAt) },
        //         { Field: this.translate.instant('USER PROFILE.DESK CHECKIN'), Value: this.formatDate(res.userActivity.deskCheckInAt) },
        //         { Field: this.translate.instant('USER PROFILE.DESK CHECKOUT'), Value: this.formatDate(res.userActivity.deskCheckOutAt) },
        //         { Field: this.translate.instant('USER PROFILE.OFFICE OUT'), Value: this.formatDate(res.userActivity.officeOutAt) }
        //     ];
        // }
        this.activitiesFields.data = activityValues;

        this.userQR = this._common.getUserQrString(this.currentAccount.id);
        this.appVersion = this._env.getVersion();

        this.userLanguageSelect = this._settingManager.getSettingsValue('currentLanguage');
        await this.getUserAccessQrCode();
    }

    async getUserAccessQrCode() {
        if(this.currSite.accessControlEnable && this.currSite.useAccessControlQrCodeForCheckIn && this.currentAccount.accessControlLevel && this.currentAccount.accessControlLevel!=ACCESS_CONTROL_LEVEL.NONE) {
            let res = await this._adminUserManagementService.getAccessControlQrCode(this.currentAccount.id);
            if(res && res.qrcode) {
                this.userQR = res.qrcode;
            }
            else {
                this.userQR = this._common.getUserQrString(this.currentAccount.id);
            }
        }
        else {
            this.userQR = this._common.getUserQrString(this.currentAccount.id);
        }
    }

    onPrintQR() {
        window.print();
    }

    onSaveQR(qrcode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        console.log(qrImage);

        this._common.downloadImageBase64(qrImage, 'qr-code');
    }

    onBack() {
        this._router.navigate(['home']);
    }

    onLanguageChange(valueLanguage: MatSelectChange) {
        console.log('onLanguageChange', valueLanguage)
        this.translate.use(valueLanguage.value);

        this._settingManager.setSettingsValue('currentLanguage', valueLanguage.value);
    }
}
