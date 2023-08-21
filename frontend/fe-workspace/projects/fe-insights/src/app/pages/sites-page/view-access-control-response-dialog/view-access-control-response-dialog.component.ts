import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, AvailableAccessControlCentralUnit, GeneratedAccessControlCentralUnit, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find } from 'rxjs/operators';
import html2canvas from "html2canvas";

@Component({
    selector: 'app-view-access-control-response-dialog',
    templateUrl: './view-access-control-response-dialog.component.html',
    styleUrls: ['./view-access-control-response-dialog.component.scss']
})

export class ViewAccessControlResponseDialogComponent implements OnInit {

    response: string;

    constructor(public dialogRef: MatDialogRef<ViewAccessControlResponseDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.response = data.response;
    }
    
    async ngOnInit() {

    }

    onClose() {
        this.dialogRef.close(null);
    }

}