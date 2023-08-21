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

@Component({
  selector: 'app-add-edit-group',
  templateUrl: './add-edit-group.component.html',
  styleUrls: ['./add-edit-group.component.scss'],
})
export class AddEditAccessControlGroupComponent implements OnInit {
  addGeneralInfoForm: FormGroup;
  groupId: string;
  group: AccessControlGatesGroup = null;
  companyId: any;
  siteList: Site[];
  isNew: boolean = false;
  selectedSystem: String;
  systemList: AccessControlSystem[];
  gatesList = new Array();

  constructor(
    public _formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private apiServices: AccessControlService,
    private helper: MCPHelperService,
    private commonService: CommonService,
    private siteApiServices: AdminSiteManagementService,
    private snackBar: MatSnackBar,
    public tr: TranslateService
  ) {
    this.addGeneralInfoForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      systemId: ['', [Validators.required]],
      gatesId: [new Array()]
    });
  }


  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.group = AccessControlGatesGroup.Empty(this.companyId);
    if(this.groupId == "new") {
      this.isNew = true;
      this.addGeneralInfoForm.value.systemId = "";
      await this.getSiteList();
      await this.getSystemList();
      await this.getSystemGates();
    }
    else {
      this.getGroup();
    }
  }
  

  async getSiteList() {
    let res = await this.siteApiServices.getFullSites(this.companyId);
    if(res) this.siteList = res.data;
  }

  async getSystemList() {
    this.apiServices.getCompanySystems(null,this.companyId).subscribe((res: any) => {
      this.systemList = res.data;
      try {
        if(!this.addGeneralInfoForm.value.systemId || this.addGeneralInfoForm.value.systemId == "") {
          this.addGeneralInfoForm.value.systemId = this.systemList[0].id;
          this.getSystemGates();
        }
      }
      catch(e) {}
    });
  }

  async getSystemGates() {
    try {
      if(this.addGeneralInfoForm.value.systemId) {
        this.apiServices.getFullSystemGatesListBySite(this.addGeneralInfoForm.value.systemId).subscribe((res: any) => {
          this.gatesList = res.data;
        });
      }
    }
    catch(e) {}
  }

  async onSystemChange(event) {
    this.getSystemGates();
  }

  async gateCheckEvent(gateId: string, event) {
    let idx = this.addGeneralInfoForm.value.gatesId.indexOf(gateId);
    if(event.checked && idx < 0) this.addGeneralInfoForm.value.gatesId.push(gateId);
    else if(idx >= 0) this.addGeneralInfoForm.value.gatesId.splice(idx,1);
  }
  
  checkGate(gateId: string) {
    return this.addGeneralInfoForm.value.gatesId.indexOf(gateId) >= 0;
  }
  
  async getGroup() {
    try {
      this.apiServices.getGatesGroup(this.groupId).subscribe((res: any) => {
        this.helper.toggleLoaderVisibility(true);
        this.group = res.data;
        this.addGeneralInfoForm.patchValue({
          name: this.group.name,
          systemId: this.group.systemId,
          gatesId: this.group.gatesId
        });
        this.helper.toggleLoaderVisibility(false);
      }, (err: any) => {
        console.log(err);
        this.helper.toggleLoaderVisibility(false);
        const e = err.error;
        swal.fire(
          '',
          this.tr.instant('ACCESS_CONTROL.GroupNotFound'),
          'info'
        );
      });
      
      await this.getSiteList();
      await this.getSystemList();
      await this.getSystemGates();
      this.helper.toggleLoaderVisibility(false);
    }
    catch(e) {
      swal.fire(
        '',
        this.tr.instant('ACCESS_CONTROL.GroupNotFound'),
        'info'
      );
      this.helper.toggleLoaderVisibility(false);
    }
  }

  onGroupSubmit() {
    if (this.addGeneralInfoForm.valid) {
      this.addGeneralInfoForm.enable();
      const data = Object.assign({}, this.addGeneralInfoForm.value, {id: this.groupId});
      this.submitData(data);
    }
  }

  submitData(data: any) {
    if(this.isNew) {
      data = {
        systemId: data.systemId,
        gatesId: data.gatesId,
        name: data.name
      }
    }
    this.apiServices.addUpdateGatesGroup(data).subscribe((data: any) => {
      this.router.navigate(['/access-control/gates/groups']);
      if(this.isNew) {
        swal.fire(
          '',
          this.tr.instant('ACCESS_CONTROL.GroupAdded'),
          'success'
        );
      }
      else {
        swal.fire(
          '',
          this.tr.instant('ACCESS_CONTROL.GroupModified'),
          'success'
        );
      }
    }, (err : any) => {
      swal.fire(
        '',
        this.tr.instant(err.reason),
        'info'
      );
    });
  }

}
