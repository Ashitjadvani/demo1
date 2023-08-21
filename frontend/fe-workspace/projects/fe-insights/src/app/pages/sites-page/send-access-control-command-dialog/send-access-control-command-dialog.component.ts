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
    selector: 'app-send-access-control-command-dialog',
    templateUrl: './send-access-control-command-dialog.component.html',
    styleUrls: ['./send-access-control-command-dialog.component.scss']
})

export class SendAccessControlCommandDialogComponent implements OnInit {

    command: string = "";
    site: Site;

    constructor(public dialogRef: MatDialogRef<SendAccessControlCommandDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.site = data.site;
    }
    
    async ngOnInit() {

    }

    async onSendCommand() {
        if(this.command!="") {
            await this.adminSiteManagementService.sendAccessControlPostCommand(this.site.id,this.command);
        }
        this.site.lastAccessControlAnswer
    }

    async onGetResponse() {
        let res = await this.adminSiteManagementService.getSites(this.site.companyId);
        if (res.result) {
            let sites = res.sites;
            this.site = sites.filter(site => site.id == this.site.id)[0];
        }
    }

    onClose() {
        this.dialogRef.close(null);
    }

}