import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { TouchPoint } from 'projects/fe-common/src/lib/models/touchpoint';
import { AUTH_PROVIDER, UserAccount } from 'projects/fe-common/src/lib/models/user-account';
import { TouchpointManagementService } from 'projects/fe-common/src/lib/services/touchpoint-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-touchpoint-config-dialog',
    templateUrl: './touchpoint-config-dialog.component.html',
    styleUrls: ['./touchpoint-config-dialog.component.scss']
})
export class TouchpointConfigDialogComponent implements OnInit {
    touchPoint: TouchPoint = new TouchPoint();
    userAccount: Person;

    constructor(public dialogRef: MatDialogRef<TouchpointConfigDialogComponent>,
        public translate: TranslateService,
        private touchPointManagementService: TouchpointManagementService,
        private userManagementService: UserManagementService) { }

    ngOnInit(): void {
        this.touchPoint.id = uuidv4();
        this.userAccount = this.userManagementService.getAccount();
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    async onSave() {
        let res = await this.touchPointManagementService.touchPointRegister(this.touchPoint.id, this.touchPoint.name, this.touchPoint.description, this.userAccount.companyId);
        if (res && res.result) {
            this.dialogRef.close(true);
        } else {
            // TODO show error
        }
    }
}
