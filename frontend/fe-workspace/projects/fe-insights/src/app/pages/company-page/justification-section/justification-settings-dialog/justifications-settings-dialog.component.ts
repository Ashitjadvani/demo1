import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { Company, CompanyJustification, JustificationsSettings } from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-justifications-settings-dialog',
    templateUrl: './justifications-settings-dialog.component.html',
    styleUrls: ['./justifications-settings-dialog.component.scss']
})
export class JustificationsSettingsDialogComponent implements OnInit { 
    justificationsSettings: JustificationsSettings;
    company: Company;

    constructor(public dialogRef: MatDialogRef<JustificationsSettingsDialogComponent>,
        private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: Company) { 
            this.company = data;
    }

    async ngOnInit() {
        if(this.company.peopleJustificationsSettings) {
            this.justificationsSettings = this.company.peopleJustificationsSettings;
        }
        else {
            this.justificationsSettings = new JustificationsSettings();
        }
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    async onSave() {
        this.company.peopleJustificationsSettings = this.justificationsSettings;
        this.adminUserManagementService.updateCompany(this.company);
        this.dialogRef.close(true);
    }

    setJustificationMailTime(time) {
        this.justificationsSettings.sendAllMailEverydayAt = this.common.buildDateTimeFromHHMM(new Date(), time);
    }

    getJustificationMailTime() {
        if (this.justificationsSettings.sendAllMailEverydayAt) {
            return this.common.timeFormat(this.justificationsSettings.sendAllMailEverydayAt);
        }
        return '';
    }

}
