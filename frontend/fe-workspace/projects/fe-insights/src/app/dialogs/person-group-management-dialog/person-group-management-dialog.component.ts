import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

export class PersonGroupDialogData {
    isModify: boolean;
    group: PersonProfileGroup;
}

@Component({
    selector: 'app-person-group-management-dialog',
    templateUrl: './person-group-management-dialog.component.html',
    styleUrls: ['./person-group-management-dialog.component.scss']
})
export class PersonGroupManagementDialogComponent implements OnInit {

    currentData: PersonGroupDialogData = new PersonGroupDialogData();

    userAccount: Person;

    constructor(public dialogRef: MatDialogRef<PersonGroupManagementDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        public commonService: CommonService,
        public translate: TranslateService,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data: PersonGroupDialogData) {

        this.currentData.isModify = data.isModify;
        this.currentData.group = data.isModify ? Object.assign({}, data.group) : PersonProfileGroup.Empty();
    }


    ngOnInit(): void {
        this.userAccount = this.userManagementService.getAccount();
    }

    isConfirmEnabled() {
        return this.currentData.group.name && (this.currentData.group.name.length > 0);
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }

    async onConfirmClick() {
        this.currentData.group.companyId = this.userAccount.companyId;

        if (this.currentData.isModify)
            await this.adminUserManagementService.updatePeopleGroup(this.currentData.group);
        else
            await this.adminUserManagementService.addPeopleGroup(this.currentData.group);

        this.dialogRef.close(true);
    }
}
