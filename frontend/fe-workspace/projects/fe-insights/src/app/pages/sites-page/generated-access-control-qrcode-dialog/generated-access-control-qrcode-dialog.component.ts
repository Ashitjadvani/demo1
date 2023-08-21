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

@Component({
    selector: 'app-generated-access-control-qrcode-dialog',
    templateUrl: './generated-access-control-qrcode-dialog.component.html',
    styleUrls: ['./generated-access-control-qrcode-dialog.component.scss']
})

export class GeneratedAccessControlQrCodeDialogComponent implements OnInit {

    id: string;
    customQrCode: CustomACQrCode;
    qrLevel: string = 'Q';
    
    @ViewChild('qrcode', { static: false }) qrcode: ElementRef;

    constructor(public dialogRef: MatDialogRef<GeneratedAccessControlQrCodeDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.id = data.id;
    }
    
    async ngOnInit() {
        this.delayQrCodeRead(1000);
        this.delayQrCodeRead(2000);
        this.delayQrCodeRead(3000);
        this.delayQrCodeRead(4000);
        this.delayQrCodeRead(5000);
        this.delayQrCodeRead(10000);
    }

    onCancel() {
        this.dialogRef.close(null);
    }
    
    async delayQrCodeRead(millisec: any) {
        setTimeout(()=>{ this.getQrCode(); }, millisec)
    }

    async getQrCode() {
        if(this.id) {
            let res = await this.adminUserManagementService.getCustomAccessControlQrCode(this.id);
            if(res.result) {
                this.customQrCode = res.customQrCode;
            }
        }
    }

    validQrCode() {
        if(this.customQrCode) {
            if(this.customQrCode.qrcode) {
                return true;
            }
        }
        return false;
    }

    onDownload(qrcode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this.common.downloadImageBase64(qrImage, 'qr-code-'+this.customQrCode.codeData.name+"-"+this.customQrCode.codeData.surname);
    }


}