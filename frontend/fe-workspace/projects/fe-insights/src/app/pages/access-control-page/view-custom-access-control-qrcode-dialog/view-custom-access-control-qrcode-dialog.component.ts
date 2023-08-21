import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { ACCESS_CONTROL_LEVEL } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find, ignoreElements } from 'rxjs/operators';
import { CustomACQrCode, CustomACQrCodeData, ACCESS_CONTROL_LIMIT_TYPE  } from 'projects/fe-common/src/lib/models/custom-access-control-qr-code';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';

@Component({
    selector: 'app-view-custom-access-control-qrcode-dialog',
    templateUrl: './view-custom-access-control-qrcode-dialog.component.html',
    styleUrls: ['./view-custom-access-control-qrcode-dialog.component.scss']
})

export class ViewCustomAccessControlQrCodeDialogComponent implements OnInit {

    sites: Site[];
    ACCESS_CONTROL_LEVEL = ACCESS_CONTROL_LEVEL;
    ACCESS_CONTROL_LIMIT_TYPE = ACCESS_CONTROL_LIMIT_TYPE;
    
    customQrCode : CustomACQrCode;
    qrLevel: string = 'Q';
    @ViewChild('qrcode', { static: false }) qrcode: ElementRef;    
    endDateDDMMYYYY: string = '';
    startDateDDMMYYYY: string = '';

    constructor(public dialogRef: MatDialogRef<ViewCustomAccessControlQrCodeDialogComponent>,
        public translate: TranslateService,
        private dataStorageManagementService: DataStorageManagementService,
        public adminUserManagementService: AdminUserManagementService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.sites = data.sites;
            this.customQrCode = data.qrcode;
            this.endDateDDMMYYYY = common.toDDMMYYYY(this.customQrCode.codeData.endDate);
            this.startDateDDMMYYYY = common.toDDMMYYYY(this.customQrCode.codeData.startDate);
    }
    
    async ngOnInit() {

    }

    validQrCode() {
        if(this.customQrCode) {
            if(this.customQrCode.qrcode) {
                return true;
            }
        }
        return false;
    }

    onDownload(qrcode: any) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this.common.downloadImageBase64(qrImage, 'Qrcode '+this.customQrCode.codeData.name+" "+this.customQrCode.codeData.surname);
    }

    checkPassage(passage: AccessControlPassage) {
        return this.customQrCode.codeData.passageIds.find(id => id == passage.id);
    }
    
    checkGroup(group: AccessControlPassageGroup) {
        return this.customQrCode.codeData.groupsId.find(id => id == group.id);
    }

    async changeAutoRenew(event: any) {
        this.customQrCode.autoRenew = event.checked;
        await this.adminUserManagementService.updateCustomAccessControlQrCode(this.customQrCode);
    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onSendEmail(qrcode: any) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;        
        let blobData = this.common.convertBase64ToBlob(qrImage);
        let imageFile = new File([blobData], 'qrcode-'+this.customQrCode.codeData.name+"-"+this.customQrCode.codeData.surname+".png", { type: 'image/png' });
        let res = await this.dataStorageManagementService.uploadFile(imageFile);
        if(res.body.result) {
            let fileId = res.body.fileId;
            let res2 = await this.dataStorageManagementService.getFileDetails(fileId);
            if(res2) {
                let dest = this.customQrCode.codeData.email;
                let subject = "Legance Personal Badge";
                let body = "<html>Attached to this email you will find your current personal qrcode. <br>Personal badge <b>"+this.customQrCode.codeData.name+" "+
                +this.customQrCode.codeData.surname+"</b><br>"+"Valid from <b>"+this.startDateDDMMYYYY+"</b> to <b>"+this.endDateDDMMYYYY+"</b>.<br>Best regards.</html>";
                
                let res3 = await this.adminUserManagementService.sendHtmlMailWithAttachments(dest, subject, body, res2.data.file);
            }
        }
    }
}