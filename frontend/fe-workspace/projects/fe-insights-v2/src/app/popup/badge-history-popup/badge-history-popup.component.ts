import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { AccessControlGate } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { TouchPointSettings } from 'projects/fe-common/src/lib/models/touchpoint';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-badge-history-popup',
  templateUrl: './badge-history-popup.component.html',
  styleUrls: ['./badge-history-popup.component.scss']
})
export class BadgeHistoryPopupComponent implements OnInit {

  gatesList: AccessControlGate[] = new Array();
  gatesListTransformed: AccessControlGate[] = new Array();
  sitesList: Site[] = new Array();
  sitesListTransformed: any[] = new Array();
  companyId: "";
  currentPerson: Person = null;

  datePipe: DatePipe = new DatePipe('it-IT');

  selectedTime = new Date();
  personFilterControl: FormControl = new FormControl();

  favouriteGates = new Array();

  constructor(
    public _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BadgeHistoryPopupComponent>,
    public acService: AccessControlService,
    public peopleService: AdminUserManagementService,
    public siteService: AdminSiteManagementService,
    private router: Router,
    private commonService: CommonService,
    private _adapter: DateAdapter<any> ) 
  { 

  }

  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
      let res = await this.peopleService.getUserInfo(authUser.person.id);
      if(res.result) this.currentPerson = res.person;
    }
    this._adapter.setLocale('it-IT');

    // Gates
    this.acService.getFullCompanyGatesList(this.companyId).subscribe(async (res) => {
      this.gatesList = res.data;
      this.getFavoritesGates();
      this.getTransformedGatesList();
      this.getTransformedSitesList();  
    })

    // Sites
    let res2 = await this.siteService.getFullSites(this.companyId);
    if(res2) {
      this.sitesList = res2.data;
    }
    this.getTransformedSitesList();

  }

  getFavoritesGates() {
    this.favouriteGates = new Array();
    let gatesId = this.currentPerson.favoritesLogGates;
    if(gatesId) {
      for(let gateId of gatesId) {
        let gate = this.gatesList.find(gate => gate.id == gateId);
        if(gate) this.favouriteGates.push(gate);
      }
    }
  }

  async addToFavourites(gateId: string) {
    if(!this.currentPerson.favoritesLogGates) this.currentPerson.favoritesLogGates = new Array();
    if(!this.currentPerson.favoritesLogGates.find(favGateId => favGateId == gateId)) {
      this.currentPerson.favoritesLogGates.push(gateId);
      await this.peopleService.addOrUpdatePerson(this.currentPerson);
    }
    this.getFavoritesGates();
    this.getTransformedGatesList();
  }

  async removeFromFavourites(gateId: string) {
    if(this.currentPerson.favoritesLogGates.find(favGateId => favGateId == gateId)) {
      this.currentPerson.favoritesLogGates = this.currentPerson.favoritesLogGates.filter(favGateId => favGateId != gateId);
      await this.peopleService.addOrUpdatePerson(this.currentPerson);
    }
    this.getFavoritesGates();
    this.getTransformedGatesList();
  }

  getTransformedGatesList() {
    this.gatesList.sort((a,b) => a.name.localeCompare(b.name));
    this.gatesListTransformed = new Array();
    for(let gate of this.gatesList) {
      this.gatesListTransformed.push(gate);
    }
    for(let favGate of this.favouriteGates) {
      this.gatesListTransformed = this.gatesListTransformed.filter(gate => gate.id != favGate.id);
    }
    this.gatesListTransformed.sort((a,b) => a.name.localeCompare(b.name));
  }

  getTransformedSitesList() {
    for(let gate of this.gatesList) {
      if(this.sitesList.find(site => site.id == gate.siteId)) {
        if(!this.sitesListTransformed.find(site => site.id == gate.siteId)) {
          let site = this.sitesList.find(site => site.id == gate.siteId);
          this.sitesListTransformed.push(site);
        }
      }
    }
    this.sitesListTransformed.sort((a,b) => a.name.localeCompare(b.name));
  }

  onSave(): void{ }

  onClose(): void{
    this.dialogRef.close(null);
  }

  onSelectSite(event: any) {
    this.getTransformedGatesList();
    if(event.value != "null") {
      this.gatesListTransformed = this.gatesListTransformed.filter(gate => gate.siteId == event.value);
    }
    this.gatesListTransformed.sort((a,b) => a.name.localeCompare(b.name));
    //this.infoForm.value.gateId = "";
  }



  
}
