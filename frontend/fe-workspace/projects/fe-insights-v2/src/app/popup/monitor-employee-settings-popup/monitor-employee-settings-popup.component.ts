import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { WhiteRectangleDetector } from '@zxing/library';
import { AccessControlGate } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';

@Component({
  selector: 'app-monitor-employee-settings-popup',
  templateUrl: './monitor-employee-settings-popup.component.html',
  styleUrls: ['./monitor-employee-settings-popup.component.scss']
})
export class MonitorEmployeeSettingsPopupComponent implements OnInit {

  periodType: string = "Daily";
  selectedDate: Date = new Date();
  selectedMonth: number = 0;
  selectedCity: string = "";
  selectedSiteId: string = "";
  selectedSiteName: string = "";
  selectedDateYYYYMMDD: string = "";

  currentMonth: number = 0;
  currentYear: number = 0;
  months = new Array();

  maxDate = new Date();
  enableSite = false;
  enableGate = false;

  sitesFiltered: Site[] = new Array();
  gatesFiltered: AccessControlGate[] = new Array();

  userAccount: any;

  constructor(
    public dialogRef: MatDialogRef<MonitorEmployeeSettingsPopupComponent>,
    private router: Router,
    private common: CommonService,
    private _adapter: DateAdapter<any>,
    private smService: AdminSiteManagementService,
    private acService: AccessControlService,
    private umService: UserManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    data.periodType ? this.periodType = data.periodType : null;
    data.selectedDate ? this.selectedDate = data.selectedDate : null;
    data.selectedMonth ? this.selectedMonth = data.selectedMonth : null;
    data.selectedCity ? this.selectedCity = data.selectedCity : null;
    data.selectedSiteId ? this.selectedSiteId = data.selectedSiteId : null;
    data.selectedSiteName ? this.selectedSiteName = data.selectedSiteName : null;
    data.selectedDateYYYYMMDD ? this.selectedDateYYYYMMDD = data.selectedDateYYYYMMDD : null;
  }

  ngOnInit(): void {
    this.userAccount = this.umService.getAccount();
    this._adapter.setLocale('it-IT');
    this.getSites();
    this.getGates();
    let today = new Date();
    let currentMonth = today.getMonth();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.months.push(currentMonth);
    while(currentMonth>0) {
      currentMonth = currentMonth - 1;
      this.months.push(currentMonth);
    }
    currentMonth = 11;
    while(currentMonth > this.currentMonth) {
      this.months.push(currentMonth);
      currentMonth = currentMonth - 1;
    }
  }

  getSites() {
    this.sitesFiltered = new Array();
    if(this.selectedCity) {
      this.smService.getSites(this.userAccount.companyId).then((res) => {
        let sites = res.data;
        this.sitesFiltered = sites.filter(site => site.city == this.selectedCity);
        this.sitesFiltered.sort((a, b) => a.name.localeCompare(b.name));
      });
    }
  }

  getGates() {
    this.gatesFiltered = new Array();
    if(this.selectedSiteId) {
      this.acService.getFullSiteGatesList(this.selectedSiteId).subscribe((res) => {
        let gates = res.data;
        this.gatesFiltered = gates.filter(gate => gate.siteId == this.selectedSiteId);
        this.gatesFiltered.sort((a, b) => a.name.localeCompare(b.name));
      })

    }
  }

  selectedDateChange($event: any) {
    this.selectedDate = new Date($event);
    this.selectedDateYYYYMMDD = this.common.formatDateTime(this.selectedDate,"YYYYMMdd");
  }

  onSave(): void{
    this.dialogRef.close({
      periodType: this.periodType,
      selectedDate: this.selectedDate,
      selectedMonth: this.selectedMonth,
      selectedCity: this.selectedCity,
      selectedSiteId: this.selectedSiteId,
      selectedSiteName: this.selectedSiteName,
      selectedDateYYYYMMDD: this.selectedDateYYYYMMDD
    });
  }

  onClose(): void{
    this.dialogRef.close(null);
  }

  onCityChange(city: string) {
    this.selectedCity = city;
    this.selectedSiteId = "";
    this.selectedSiteName = "";
    this.getSites();
  }
  
  onSiteChange(siteId: string) {
    if(siteId == "") {
      this.selectedSiteId = "";
      this.selectedSiteName = "";
    }
    else {
      let selectedSite = this.sitesFiltered.find(site => site.id == siteId);
      this.selectedSiteId = selectedSite.id;
      this.selectedSiteName = selectedSite.name;
    }
    this.getGates();
  }
  
  resetFilters() {
    this.selectedSiteId = "";
    this.selectedSiteName = "";
    this.selectedCity = "";
    this.periodType = "Daily";
  }


}
