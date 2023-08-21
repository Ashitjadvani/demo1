import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { Company, Scope} from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-scope-dialog',
    templateUrl: './scope-dialog.component.html',
    styleUrls: ['./scope-dialog.component.scss']
})
export class ScopeDialogComponent implements OnInit {
    scope: Scope;
    isNew: boolean;
    companyId: string;

    constructor(public dialogRef: MatDialogRef<ScopeDialogComponent>,
        private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.scope = data.scope;
            this.isNew = data.isNew;
            this.companyId = data.companyId;
    }

    async ngOnInit() {

    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onSave() {
        this.dialogRef.close(this.scope);
    }

    async checkPlanCheckboxChange(event) {
        let peopleResult = await this.adminUserManagementService.getPeople(this.companyId);
        for(let person of peopleResult.people) {
            if(person.scope == this.scope.name) {
                person.enablePlan = event.checked;
                await this.adminUserManagementService.addOrUpdatePerson(person);
            }
        }
    } 

    async checkGreenpassCheckboxChange(event) {
        let peopleResult = await this.adminUserManagementService.getPeople(this.companyId);
        for(let person of peopleResult.people) {
            if(person.scope == this.scope.name) {
                person.enableGreenpass = event.checked;
                await this.adminUserManagementService.addOrUpdatePerson(person);
            }
        }
    }

}
