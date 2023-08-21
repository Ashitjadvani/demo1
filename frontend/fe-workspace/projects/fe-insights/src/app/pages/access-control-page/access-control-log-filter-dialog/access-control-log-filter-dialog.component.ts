import { ArrayType } from '@angular/compiler';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-access-control-log-filter-dialog',
    templateUrl: './access-control-log-filter-dialog.component.html',
    styleUrls: ['./access-control-log-filter-dialog.component.scss']
})

export class AccessControlLogFilterDialogComponent implements OnInit {
    
    gates: any[] = new Array();
    sites: Site[] = new Array();

    data: any;

    filterByGate: boolean = false;
    filterByDate: boolean = false;
    filterBySite: boolean = false;

    selectedGatesId: number[] = new Array();
    selectedDateStart: Date = new Date();
    selectedDateEnd: Date = new Date();
    selectedSiteId: string = '';
    selectedSite: Site;

    constructor(public dialogRef: MatDialogRef<AccessControlLogFilterDialogComponent>,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) {
            this.data = data;
            this.gates = data.gates;
            this.sites = data.sites;

            this.filterByGate = data.filterByGate;
            this.filterByDate = data.filterByDate;
            this.filterBySite = data.filterBySite;
            this.selectedGatesId = data.selectedGatesId;
            this.selectedDateStart = data.selectedDateStart;
            this.selectedDateEnd = data.selectedDateEnd;
            this.selectedSiteId = data.selectedSiteId;

            this.sortGates();
        }
    
    async ngOnInit() {

    }

    onCancel() {
        this.dialogRef.close(null);
    }

    onApply() {
        this.dialogRef.close({
            filterByGate: this.filterByGate,
            filterByDate: this.filterByDate,
            filterBySite: this.filterBySite,
            selectedGatesId: this.selectedGatesId,
            selectedDateStart: this.selectedDateStart,
            selectedDateEnd: this.selectedDateEnd,
            selectedSiteId: this.selectedSiteId
        });
    }

    enableConfirmButton() {
        if(!this.filterBySite && !this.filterByDate && !this.filterByGate) return false;
        if(this.filterBySite && this.selectedSiteId == '') return false;
        if(this.filterByDate && this.selectedDateStart.getTime() > this.selectedDateEnd.getTime()) return false;
        if(this.filterByGate && this.selectedGatesId.length == 0) return false;
        return true;
    }

    checkGate(event: any) {
        /*if(event.checked) {
            this.filterBySite = false;
        }*/
    }

    checkSite(event: any) {
        /*if(event.checked) {
            this.filterByGate = false;
        }*/

    }

    sortGates() {
        this.gates.sort((a, b) => a.name.localeCompare(b.name));
    }

    siteSelected(event: any) {
        this.gates = this.data.gates;
        if(event.value != undefined) {
            this.selectedGatesId = new Array();
            this.selectedSite = this.sites.find(site => site.id == event.value);
            this.gates = this.data.gates;
            this.gates = this.gates.filter(gate => gate.site == this.selectedSite.name);
        }
        this.sortGates();
    }

}