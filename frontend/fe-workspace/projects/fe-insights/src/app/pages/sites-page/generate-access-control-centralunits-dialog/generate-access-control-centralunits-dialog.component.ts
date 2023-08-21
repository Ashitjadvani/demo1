import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, GeneratedAccessControlCentralUnit, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find } from 'rxjs/operators';
import html2canvas from "html2canvas";

@Component({
    selector: 'app-generate-access-control-centralunits-dialog',
    templateUrl: './generate-access-control-centralunits-dialog.component.html',
    styleUrls: ['./generate-access-control-centralunits-dialog.component.scss']
})

export class GenerateAccessControlCentralUnitsDialogComponent implements OnInit {
    @ViewChild("tabgroup", { static: false }) tabgroup: MatTabGroup;
    @ViewChild('div') div: ElementRef;

    site: Site;
    centralUnitsNumber: number = 1;
    centralUnitsName: string = "";
    wifiSSID: string = "";
    wifiPassword: string = "";
    waiting: boolean = false;
    generatedCentralUnits: GeneratedAccessControlCentralUnit[] = new Array();
    qrLevel: string = 'Q';
    currentQrCode: string = "";

    constructor(public dialogRef: MatDialogRef<GenerateAccessControlCentralUnitsDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) {
            this.site = data.site;
    }

    async ngOnInit() {

    }

    disablePreviousButton() {
        if(!this.tabgroup) return true;
        if(this.tabgroup.selectedIndex!=0 && this.tabgroup.selectedIndex!=3)  return false;
        return true;
    }

    disableNextButton() {
        if(!this.tabgroup) return true;
        if(this.tabgroup.selectedIndex==0)
            if(this.centralUnitsNumber) return false;
        if(this.tabgroup.selectedIndex==1)
            if(this.centralUnitsName!="") return false;
        return true;
    }

    disableGenerateButton() {
        return false;
    }

    onPrevious() {
        this.tabgroup.selectedIndex = this.tabgroup.selectedIndex-1;
    }

    onNext() {
        this.tabgroup.selectedIndex = this.tabgroup.selectedIndex+1;
    }

    async onGenerate() {
        this.waiting = true;
        let res = await this.adminSiteManagementService.generateAccessControlCentralUnits(this.site.id,this.centralUnitsNumber,this.centralUnitsName,this.wifiSSID,this.wifiPassword);

        setTimeout(() => {
            this.waiting = false;
        }, 3000*this.centralUnitsNumber+2000);

        for(let i=0; i<this.centralUnitsNumber; i++) {
            setTimeout(async () => {
                let res2 = await this.adminSiteManagementService.getSites(this.site.companyId);
                this.site = res2.sites.find(site => site.id == this.site.id);
                if(this.site.generatedAccessControlCentralUnits) {
                    this.generatedCentralUnits.push(this.site.generatedAccessControlCentralUnits.filter(unit => unit.centralUnitId == res.centralUnitIds[i])[0])
                }
            }, 3000*i+3000);
        }

        this.onNext();
    }

    onDownload() {
        let elem = document.getElementById("div");
        html2canvas(elem, {scrollY: -window.scrollY}).then(function (canvas) {
          let generatedImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          let a = document.createElement('a');
          a.href = generatedImage;
          a.download = `qrcodes.png`;
          a.click();
        });
    }
}
