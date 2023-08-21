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
    selector: 'app-view-access-control-centralunits-qrcode-dialog',
    templateUrl: './view-access-control-centralunits-qrcode-dialog.component.html',
    styleUrls: ['./view-access-control-centralunits-qrcode-dialog.component.scss']
})

export class ViewAccessControlCentralUnitsQrCodeDialogComponent implements OnInit {
    @ViewChild('div') div: ElementRef;

    unit: GeneratedAccessControlCentralUnit;
    qrLevel: string = 'Q';

    constructor(public dialogRef: MatDialogRef<ViewAccessControlCentralUnitsQrCodeDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.unit = data.unit;
    }
    
    async ngOnInit() {

    }

    onDownload() {
        let elem = document.getElementById("div");
        let that = this;
        html2canvas(elem, {scrollY: -window.scrollY}).then(function (canvas) {
          let generatedImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          let a = document.createElement('a');
          a.href = generatedImage;
          a.download = that.unit.name+`-qrcodes.png`;
          a.click();
        });
    }
}