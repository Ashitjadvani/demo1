import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TouchPointSettings } from 'projects/fe-common/src/lib/models/touchpoint';
import { TouchpointManagementService } from 'projects/fe-common/src/lib/services/touchpoint-management.service';

@Component({
    selector: 'app-touchpoint-settings-dialog',
    templateUrl: './touchpoint-settings-dialog.component.html',
    styleUrls: ['./touchpoint-settings-dialog.component.scss']
})
export class TouchpointSettingsDialogComponent implements OnInit {
    touchPointSettings: TouchPointSettings;

    constructor(public dialogRef: MatDialogRef<TouchpointSettingsDialogComponent>,
        private touchPointManagementService: TouchpointManagementService,
        public translate: TranslateService) { 

    }

    async ngOnInit() {
        let res = await this.touchPointManagementService.getTouchPointSettings();
        if (res && res.result) {
            this.touchPointSettings = res.settings;
        }
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    async onSave() {
        this.touchPointManagementService.updateTouchPointSettings(this.touchPointSettings);
        this.dialogRef.close(true);
    }
}
