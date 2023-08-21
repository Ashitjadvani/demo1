import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { Area, Company, Scope} from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-new-role-dialog',
    templateUrl: './new-role-dialog.component.html',
    styleUrls: ['./new-role-dialog.component.scss']
})
export class NewRoleDialogComponent implements OnInit {
    role: string;
    isNew: boolean;

    constructor(public dialogRef: MatDialogRef<NewRoleDialogComponent>,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.role = data.role;
            this.isNew = data.isNew;
    }

    async ngOnInit() {

    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onSave() {
        this.dialogRef.close(this.role);
    }


}
