import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { ACCESS_CONTROL_LEVEL } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find } from 'rxjs/operators';
import { CustomACQrCode, CustomACQrCodeData, ACCESS_CONTROL_LIMIT_TYPE  } from 'projects/fe-common/src/lib/models/custom-access-control-qr-code';
import { GeneratedAccessControlQrCodeDialogComponent } from '../generated-access-control-qrcode-dialog/generated-access-control-qrcode-dialog.component';
import { I } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-generate-access-control-qrcode-dialog',
    templateUrl: './generate-access-control-qrcode-dialog.component.html',
    styleUrls: ['./generate-access-control-qrcode-dialog.component.scss']
})

export class GenerateAccessControlQrCodeDialogComponent implements OnInit {

    sites: Site[];
    ACCESS_CONTROL_LEVEL = ACCESS_CONTROL_LEVEL;
    ACCESS_CONTROL_LIMIT_TYPE = ACCESS_CONTROL_LIMIT_TYPE;

    type: String = ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES;
    groupsId: String[] = new Array();
    passageIds: String[] = new Array();
    startDate: Date = new Date();
    endDate: Date = new Date();

    name: String = "";
    surname: String = "";
    email: String = "";
    number: String = "";
    notes: String = "";
    autoRenew: Boolean = false;

    limitType: String = "Infinite";
    limitNumber: Number = 1;

    //newQrCode: CustomACQrCode = new CustomACQrCode();
    codeData :CustomACQrCodeData = CustomACQrCodeData.Empty();

    constructor(public dialogRef: MatDialogRef<GenerateAccessControlQrCodeDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) data: any) {
            this.sites = data.sites;
            if(data.codeData) this.codeData = data.codeData;
            if(data.autoRenew) this.autoRenew = data.autoRenew;
    }

    async ngOnInit() {

    }

    changeAutoRenew(event: any) {
        this.autoRenew = event.checked;
    }

    checkChanged(event: any, passageToCheck: AccessControlPassage) {
        if(event.checked) {
            this.codeData.passageIds.push(passageToCheck.id);
            return;
        }
        this.codeData.passageIds = this.codeData.passageIds.filter(id => id != passageToCheck.id);
    }

    checkGroupChanged(event: any, groupToCheck: AccessControlPassageGroup) {
        if(event.checked) {
            this.codeData.groupsId.push(groupToCheck.id);
            return;
        }
        this.codeData.groupsId = this.codeData.groupsId.filter(id => id != groupToCheck.id);
    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onCreate() {
        /*let codeData = {
            type: this.type,
            groupId: this.groupId,
            passageIds: this.passageIds,
            startDate: this.startDate,
            endDate: this.endDate,
            name: this.name,
            surname: this.surname,
            email: this.email,
            number: this.number,
            notes: this.notes,
            limitType: this.limitType,
            limitNumber: this.limitNumber
        }*/
        let site = this.sites.find(site => site.accessControlEnable);
        let res = await this.adminUserManagementService.generateCustomAccessControlQrCode(this.codeData, site.id, this.autoRenew);
        if(res.result) {
            let result = await this.dialog.open(GeneratedAccessControlQrCodeDialogComponent, {
                width: '350px',
                panelClass: 'custom-dialog-container',
                data: {
                    id: res.id
                }
            }).afterClosed().toPromise();
        }
    }


    async delayQrCodeRead(millisec, codeId) {
        setTimeout(()=>{ this.getQrCode(codeId); }, millisec)
    }

    async getQrCode(codeId: string) {
        let res = await this.adminUserManagementService.getCustomAccessControlQrCode(codeId);
        if(res && res.customQrCode) {

        }
    }

    generateButtonDisable() {
        if(this.codeData.type == ACCESS_CONTROL_LEVEL.GROUP) {
            if(this.codeData.groupsId.length == 0 || this.codeData.name=="" || this.codeData.surname=="" || this.codeData.email=="") return true;
        }
        if(this.codeData.type == ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES) {
            if(this.codeData.passageIds.length == 0 || this.codeData.name=="" || this.codeData.surname=="" || this.codeData.email=="") return true;
        }
        return false;
    }

    checkPassage(passage: AccessControlPassage) {
        return this.codeData.passageIds.find(id => id == passage.id);
    }

    checkGroup(group: AccessControlPassageGroup) {
        return this.codeData.groupsId.find(id => id == group.id);
    }
}
