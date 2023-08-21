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
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';

@Component({
    selector: 'app-send-access-control-qrcode-dialog',
    templateUrl: './send-access-control-qrcode-dialog.component.html',
    styleUrls: ['./send-access-control-qrcode-dialog.component.scss']
})

export class SendAccessControlQrCodeDialogComponent implements OnInit {

    customQrCode: any;
    qrLevel: string = 'Q';
    endDateDDMMYYYY: string = '';
    startDateDDMMYYYY: string = '';

    @ViewChild('qrcode', { static: false }) qrcode: ElementRef;

    constructor(public dialogRef: MatDialogRef<SendAccessControlQrCodeDialogComponent>,
        private dataStorageManagementService: DataStorageManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) {
            this.customQrCode = data.qrcode;
            this.endDateDDMMYYYY = common.toDDMMYYYY(this.customQrCode.codeData.endDate);
            this.startDateDDMMYYYY = common.toDDMMYYYY(this.customQrCode.codeData.startDate);
    }

    async ngOnInit() {

    }

    onCancel() {
        this.dialogRef.close(null);
    }

    validQrCode() {
        if(this.customQrCode) {
            if(this.customQrCode.qrcode) {
                return true;
            }
        }
        return false;
    }



    async getQrCode() {

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
        //this.common.downloadImageBase64(qrImage, 'qrcode-'+this.customQrCode.codeData.name+"-"+this.customQrCode.codeData.surname);


    }




}
