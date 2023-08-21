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
  selector: 'app-add-access-control-log-popup',
  templateUrl: './add-access-control-log-popup.component.html',
  styleUrls: ['./add-access-control-log-popup.component.scss']
})
export class AddAccessControlLogPopupComponent implements OnInit {

  infoForm: FormGroup;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  now = new Date();
  peopleList: Person[] = new Array();
  peopleListTransformed: Person[] = new Array();
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
    public dialogRef: MatDialogRef<AddAccessControlLogPopupComponent>,
    public acService: AccessControlService,
    public peopleService: AdminUserManagementService,
    public siteService: AdminSiteManagementService,
    private router: Router,
    private commonService: CommonService,
    private _adapter: DateAdapter<any> ) 
  { 
    this.infoForm = this._formBuilder.group({
      personId: ['', [Validators.required]],
      gateId: ['', [Validators.required]],
      date: [new Date()],
      time: [new Date()]
    });

    this.personFilterControl.valueChanges
    .pipe(takeUntil(this.destroyed$))
    .subscribe(() => {
      this.filterPeople();
    });
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

    // People
    let res = await this.peopleService.getPeopleList(
      this.companyId
    );
    if(res.result) this.peopleList = res.people;
    this.getTransformedPeopleList();

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

  getTransformedPeopleList() {
    this.peopleListTransformed = new Array();
    for(let person of this.peopleList) {
      if(person.surname && person.name) {
        this.peopleListTransformed.push(person);
      }
    }
    this.sortTransformedPeople();
  }

  onSave(): void{/*
    if(this.person != null && this.gate != null)
    this.dialogRef.close({
      siteId: this.gate.siteId,
      isRing: false,
      isBeacon: false,
      logType: "Manual",
      centralUnitName: this.gate.centralUnitName,
      centralUnitId: this.gate.centralUnitId,
      gateName: this.gate.name,
      groupName: this.gate.groupName,
      surname: this.person.surname,
      name: this.person.name,
      email: this.person.email,
      number: "",
      valid: true,
      idutente: this.person.id,
      userScope: this.person.scope,
      timestamp: this.now,
      addedByUserName: this.currentPerson.surname + " " + this.currentPerson.name,
      addedByUserId: this.currentPerson.id
    });*/
  }

  onClose(): void{
    this.dialogRef.close(null);
  }

  onSelectSite(event: any) {
    this.getTransformedGatesList();
    if(event.value != "null") {
      this.gatesListTransformed = this.gatesListTransformed.filter(gate => gate.siteId == event.value);
    }
    this.gatesListTransformed.sort((a,b) => a.name.localeCompare(b.name));
    this.infoForm.value.gateId = "";
  }

  async onSubmit() {
    if(this.infoForm.valid) {
      let person = null;
      let res = await this.peopleService.getUserInfo(this.infoForm.value.personId);
      if(res.result) {
        person = res.person;
      }
      let timestamp = new Date(this.infoForm.value.date);
      let time = new Date(this.selectedTime);
      timestamp.setHours(time.getHours());
      timestamp.setMinutes(time.getMinutes());
      timestamp.setSeconds(time.getSeconds());
      this.acService.getGate(this.infoForm.value.gateId).subscribe((res) => {
        let gate = res.data;
        if(gate) {
          this.dialogRef.close({
            siteId: gate.siteId,
            isRing: false,
            isBeacon: false,
            logType: "Manual",
            centralUnitName: gate.centralUnitName,
            centralUnitId: gate.centralUnitId,
            gateName: gate.name,
            groupName: gate.groupName,
            surname: person.surname,
            name: person.name,
            email: person.email,
            number: person.number,
            valid: true,
            idutente: person.id,
            userScope: person.scope,
            timestamp: timestamp,
            addedByUserName: this.currentPerson.surname + " " + this.currentPerson.name,
            addedByUserId: this.currentPerson.id
          });
        }
        else {
          this.dialogRef.close(null);
        }
      })
    }
  }

  setTime(event: string) {
    this.selectedTime.setHours(+event.substring(0,2));
    this.selectedTime.setMinutes(+event.substring(3,5));
  }

  getTime() {
    return this.datePipe.transform(this.selectedTime, "HH:mm");
  }

  sortTransformedPeople() {
    this.peopleListTransformed.sort((a,b) => a.surname.localeCompare(b.surname));
  }

  filterPeople() {
    let search = this.personFilterControl.value;
    this.getTransformedPeopleList();
    if (search) {
      search = search.toLowerCase();
      this.peopleListTransformed = this.peopleListTransformed.filter(person => {
        let completeName = person.name + " " + person.surname;
        return completeName.toLowerCase().includes(search);
      })
    }   
    this.sortTransformedPeople();
  }

  
}
