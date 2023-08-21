import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { ACCESS_CONTROL_LEVEL } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find } from 'rxjs/operators';
import { CustomACQrCode, CustomACQrCodeData, ACCESS_CONTROL_LIMIT_TYPE  } from 'projects/fe-common/src/lib/models/custom-access-control-qr-code';
import { I } from '@angular/cdk/keycodes';
import { UserACQrCode } from 'projects/fe-common/src/lib/models/user-access-control-qr-code';

@Component({
    selector: 'app-view-access-control-qrcode-dialog',
    templateUrl: './view-access-control-qrcode-dialog.component.html',
    styleUrls: ['./view-access-control-qrcode-dialog.component.scss']
})

export class ViewAccessControlQrCodeDialogComponent implements OnInit {
    
    sites: Site[];
    ACCESS_CONTROL_LEVEL = ACCESS_CONTROL_LEVEL;
    ACCESS_CONTROL_LIMIT_TYPE = ACCESS_CONTROL_LIMIT_TYPE;

    userQrCode: UserACQrCode;
    qrLevel: string = 'Q';
    
    @ViewChild('qrcode', { static: false }) qrcode: ElementRef;

    constructor(public dialogRef: MatDialogRef<ViewAccessControlQrCodeDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.sites = data.sites;
            this.userQrCode = data.qrcode;
    }
    
    async ngOnInit() {

    }

    onCancel() {
        this.dialogRef.close(null);
    }
    

    async getQrCode() {

    }

    validQrCode() {
        if(this.userQrCode) {
            if(this.userQrCode.qrcode) {
                return true;
            }
        }
        return false;
    }

    checkPassage(passage: AccessControlPassage) {
        return this.userQrCode.codeData.passageIds.find(id => id == passage.id);
    }
    
    checkGroup(group: AccessControlPassageGroup) {
        return this.userQrCode.codeData.groupsId.find(id => id == group.id);
    }

    onDownload(qrcode: any) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this.common.downloadImageBase64(qrImage, 'Qrcode '+this.userQrCode.codeData.name+" "+this.userQrCode.codeData.surname);
    }



}