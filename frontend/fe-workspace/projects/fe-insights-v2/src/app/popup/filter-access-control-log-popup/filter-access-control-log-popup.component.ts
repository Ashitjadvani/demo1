import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { AccessControlGate } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';

@Component({
  selector: 'app-filter-access-control-log-popup',
  templateUrl: './filter-access-control-log-popup.component.html',
  styleUrls: ['./filter-access-control-log-popup.component.scss']
})
export class FilterAccessControlLogPopupComponent implements OnInit {

  startDate: Date = new Date();
  endDate: Date = new Date();
  gate: AccessControlGate = null;
  gatesList: AccessControlGate[] = new Array();
  gatesListTransformed: AccessControlGate[] = new Array();
  companyId: "";
  currentPerson: any = null;

  constructor(
    public dialogRef: MatDialogRef<FilterAccessControlLogPopupComponent>,
    private router: Router,
    private commonService: CommonService,
    private _adapter: DateAdapter<any>,
    public acService: AccessControlService,

  ) { }

  async ngOnInit() {   
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate()-1);
    this._adapter.setLocale('it-IT');
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
      this.currentPerson = authUser.person;
    }    
    this.acService.getFullCompanyGatesList(this.companyId).subscribe((res) => {
      this.gatesList = res.data;
      this.gatesList.sort((a,b) => a.name.localeCompare(b.name));
    })
  }

  onSave(): void{
    let centralUnitId = null;
    if(this.gate) centralUnitId = this.gate.centralUnitId;
    this.startDate.setHours(0);
    this.startDate.setMinutes(1);
    this.endDate.setHours(23);
    this.endDate.setMinutes(59);
    this.dialogRef.close({
      startDate: this.startDate,
      endDate: this.endDate,
      centralUnitId: centralUnitId
    });
  }

  onClose(): void{
    this.dialogRef.close(null);
  }

}
