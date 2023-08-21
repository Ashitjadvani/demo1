import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../../../../fe-common-v2/src/lib/services/account.service';
import { Person } from '../../../../../../../fe-common-v2/src/lib/models/person';
import { Observable } from 'rxjs';
import { UserManagementService } from '../../../../../../../fe-common-v2/src/lib/services/user-management.service';
import { CommonService } from '../../../../../../../fe-common-v2/src/lib/services/common.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { ignoreElements, map, startWith } from 'rxjs/operators';
import { UserAccount } from '../../../../../../../fe-common-v2/src/lib/models/user-account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlGate, AccessControlGatesGroup, AccessControlSystem, AC_SYSTEM_STATE, AC_SYSTEM_TYPE } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { arraysAreNotAllowedMsg } from '@ngrx/store/src/models';
import { MatDialog } from '@angular/material/dialog';
import { YesNoPopupComponent } from 'projects/fe-insights-v2/src/app/popup/yesno-popup/yesno-popup.component';

@Component({
  selector: 'app-group-user-list',
  templateUrl: './group-user-list.component.html',
  styleUrls: ['./group-user-list.component.scss'],
})
export class GroupUserListComponent implements OnInit {
  peopleList = new Array();
  originalGroupPeopleList = new Array();
  newGroupPeopleList = new Array();
  groupId: string;
  group: AccessControlGatesGroup = AccessControlGatesGroup.Empty("");
  companyId: any;

  sortBy = "name";
  sortKey = "-1";
  displayedColumns: string[] = ['name','scope','state'];


  constructor(
    public _formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private apiServices: AccessControlService,
    private dialog: MatDialog,
    private helper: MCPHelperService,
    private commonService: CommonService,
    private siteApiServices: AdminSiteManagementService,
    private userApiServices: AdminUserManagementService,
    private snackBar: MatSnackBar,
    public translate: TranslateService
  ) {

  }

  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.groupId = this.route.snapshot.paramMap.get('id');
    await this.getGroup();
    await this.getGroupPeopleList();
    await this.getPeopleList();
  }

  getNewGroupPeopleList() {
    for(let person of this.originalGroupPeopleList) {
      this.newGroupPeopleList.push({
        id: person.id,
        name: person.name,
        surname: person.surname,
        scope: person.scope,
        state: "OriginallyInGroup"
      })
    }
    this.sortList();

  }

  changeSorting(sortBy: string) {
    if(this.sortBy == sortBy) {
      if(this.sortKey == '-1') this.sortKey = '1';
      else this.sortKey = '-1';
    }
    else {
      this.sortBy = sortBy;
      this.sortKey = '-1';
    }
    this.sortList();
  }

  sortList() {
    if(this.sortBy == 'name') {
      if(this.sortKey == '-1') {
        this.newGroupPeopleList.sort((a, b) => a.name.localeCompare(b.name));
      }
      else if(this.sortKey == '1') {
        this.newGroupPeopleList.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
    else if(this.sortBy == 'surname') {
      if(this.sortKey == '-1') {
        this.newGroupPeopleList.sort((a, b) => a.surname.localeCompare(b.surname));
      }
      else if(this.sortKey == '1') {
        this.newGroupPeopleList.sort((a, b) => b.surname.localeCompare(a.surname));
      }
    }
    else if(this.sortBy == 'scope') {
      if(this.sortKey == '-1') {
        this.newGroupPeopleList.sort((a, b) => a.scope.localeCompare(b.scope));
      }
      else if(this.sortKey == '1') {
        this.newGroupPeopleList.sort((a, b) => b.scope.localeCompare(a.scope));
      }
    }
    else if(this.sortBy == 'state') {
      if(this.sortKey == '-1') {
        this.newGroupPeopleList.sort((a, b) => a.state.localeCompare(b.state));
      }
      else if(this.sortKey == '1') {
        this.newGroupPeopleList.sort((a, b) => b.state.localeCompare(a.state));
      }
    }
  }

  async getGroupPeopleList() {
    this.apiServices.getGatesGroupUserList(this.groupId).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.originalGroupPeopleList = res.data;
        this.getNewGroupPeopleList();
      } else {
        swal.fire(
          '',
          res.reason,
          'info'
        );
      }
    }, (err: any) => {
      const e = err.error;
      swal.fire(
        '',
        e,
        'info'
      );
    });
  }

  async getPeopleList() {
    this.helper.toggleLoaderVisibility(true);
    try {
      let res = await this.userApiServices.getPeopleList(this.companyId);
      if(res.result) {
        this.helper.toggleLoaderVisibility(false);
        this.peopleList = res.people;
        this.peopleList.filter(person => !this.newGroupPeopleList.find(fPerson => fPerson.id == person.id));
      }
    }
    catch(e) {
      this.helper.toggleLoaderVisibility(false);
      console.log(e);
      swal.fire(
        '',
        e,
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

    
  async getGroup() {
    try {
      this.apiServices.getGatesGroup(this.groupId).subscribe((res: any) => {
        this.group = res.data;
      }, (err: any) => {
        console.log(err);
        const e = err.error;
        swal.fire(
          '',
          this.translate.instant('ACCESS_CONTROL.GroupNotFound'),
          'info'
        );
      });
    }
    catch(e) {
      swal.fire(
        '',
        this.translate.instant('ACCESS_CONTROL.GroupNotFound'),
        'info'
      );
    }
  }

  disableConfirmButton() {
    if(this.newGroupPeopleList.find(person => person.state != "OriginallyInGroup")) return false;
    return true;
  }

  removePerson(id: string) {
    if(this.originalGroupPeopleList.find(person => person.id == id)) {
      this.newGroupPeopleList.find(person => person.id == id).state = "Removed";
    }
    else {
      this.newGroupPeopleList = this.newGroupPeopleList.filter(person => person.id != id);
    }
  }

  cancelRemove(id: string) {
    this.newGroupPeopleList.find(person => person.id == id).state = "OriginallyInGroup";
  }

  async onConfirm() {
    try {
      let confirmList = new Array();
      for(let person of this.newGroupPeopleList) {
        if(person.state == "Removed") confirmList.push(person);
      }
      let message1 = this.translate.instant("ConfirmRemoveFromAcGroupMessage") + " " +this.group.name+": ";
      for(let person of confirmList) {
        message1 = message1 + person.name + " " + person.surname + ", ";
      }
      const dialogRef = this.dialog.open(YesNoPopupComponent,{
        data: {title: this.translate.instant("Confirm"), message1: message1, message2: this.translate.instant("ACCESS_CONTROL.Sure"), icon: "close"}
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if(result) {
          for(let cPerson of confirmList) {
            let person = this.peopleList.find(person => person.id == cPerson.id);
            person.accessControlGroupsId = person.accessControlGroupsId.filter(groupId => groupId != this.groupId);
            await this.userApiServices.addOrUpdatePerson(person);
            await this.userApiServices.generateAccessControlQrCode(person.id);
          }
          swal.fire(
            '',
            this.translate.instant('PeopleRemovedFromGroup'),
            'success'
          );
          this.router.navigate([`/access-control/gates/groups`]);
        }
      });
    }
    catch(e) {
      console.log(e);
      this.router.navigate([`/access-control/gates/groups`]);
    }
    
  }

}
