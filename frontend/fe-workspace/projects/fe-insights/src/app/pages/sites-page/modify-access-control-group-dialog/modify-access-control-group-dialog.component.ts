import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find } from 'rxjs/operators';

@Component({
    selector: 'app-modify-access-control-group-dialog',
    templateUrl: './modify-access-control-group-dialog.component.html',
    styleUrls: ['./modify-access-control-group-dialog.component.scss']
})

export class ModifyAccessControlGroupDialogComponent implements OnInit {

    group: AccessControlPassageGroup;
    site: Site;
    isNew: boolean;

    constructor(public dialogRef: MatDialogRef<ModifyAccessControlGroupDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.group = data.group;
            this.site = data.site;
            this.isNew = data.isNew;
    }
    
    async ngOnInit() {

    }

    checkChanged(event: any, passageToCheck: AccessControlPassage) {
        if(event.checked) {
            this.group.passageIds.push(passageToCheck.id);
        }
        else {
            this.group.passageIds = this.group.passageIds.filter(id => id != passageToCheck.id);
        }
    }

    checkPassage(passage: AccessControlPassage) {
        return this.group.passageIds.find(id => id == passage.id);
    }

    onCancel() {
        this.dialogRef.close(null);
    }

    onSave() {
        this.dialogRef.close(this.group);
    }
}