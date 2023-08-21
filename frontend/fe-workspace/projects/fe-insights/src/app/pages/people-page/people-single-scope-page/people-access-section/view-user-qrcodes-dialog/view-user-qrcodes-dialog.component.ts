import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { ACCESS_CONTROL_LEVEL, Person } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find } from 'rxjs/operators';
import { CustomACQrCode, CustomACQrCodeData, ACCESS_CONTROL_LIMIT_TYPE  } from 'projects/fe-common/src/lib/models/custom-access-control-qr-code';
import { I } from '@angular/cdk/keycodes';
import { UserACQrCode } from 'projects/fe-common/src/lib/models/user-access-control-qr-code';

@Component({
    selector: 'app-view-user-qrcodes-dialog',
    templateUrl: './view-user-qrcodes-dialog.component.html',
    styleUrls: ['./view-user-qrcodes-dialog.component.scss']
})

export class ViewUserQrCodesDialogComponent implements OnInit {
    
    sites: Site[];
    ACCESS_CONTROL_LEVEL = ACCESS_CONTROL_LEVEL;
    ACCESS_CONTROL_LIMIT_TYPE = ACCESS_CONTROL_LIMIT_TYPE;

    user: Person;
    userQrCodes: UserACQrCode[];

    qrLevel: string = 'Q';

    now: Date = new Date();
    
    @ViewChild('qrcode', { static: false }) qrcode: ElementRef;

    constructor(public dialogRef: MatDialogRef<ViewUserQrCodesDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.sites = data.sites;
            this.user = data.user;
            this.userQrCodes = data.userQrCodes;
            if(this.userQrCodes) {
                this.userQrCodes = this.userQrCodes.filter(badge => badge.qrcode);
                this.userQrCodes = this.userQrCodes.reverse();
            }
            this.now = new Date();
    }
    
    async ngOnInit() {

    }

    onCancel() {
        this.dialogRef.close(null);
    }
    

    async getQrCode() {

    }

    validQrCode(userQrCode: UserACQrCode) {
        try {
            if(userQrCode.qrcode) {
                return true;
            }
            return false;            
        }
        catch(ex) {
            return false; 
        }
    }

    checkPassage(passage: AccessControlPassage, userQrCode: UserACQrCode) {
        try {
            return userQrCode.codeData.passageIds.find(id => id == passage.id);
        }
        catch(ex) {
            return false;
        }
    }
    
    checkGroup(group: AccessControlPassageGroup, userQrCode: UserACQrCode) {
        try {
            return userQrCode.codeData.groupsId.find(id => id == group.id);
        }
        catch(ex) {
            return false;
        }
    }

    onDownload(qrcode: any, userQrCode: UserACQrCode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this.common.downloadImageBase64(qrImage, 'Qrcode '+userQrCode.codeData.name+" "+userQrCode.codeData.surname);
    }

    getLabel(userQrCode: UserACQrCode) {
        let startDate = new Date(userQrCode.codeData.startDate);
        let endDate = new Date(userQrCode.codeData.endDate);
        return this.common.toDDMMYYYY(startDate) + " - " + this.common.toDDMMYYYY(endDate);
    }

    checkExpired(userQrCode: UserACQrCode) {
        let date = new Date(userQrCode.codeData.endDate);
        try {
            if(date.getTime()<this.now.getTime()) return true;
            return false;
        } catch(ex) {
            console.error('checkExpired exception: ', ex);
        }

        return false;
    }



}