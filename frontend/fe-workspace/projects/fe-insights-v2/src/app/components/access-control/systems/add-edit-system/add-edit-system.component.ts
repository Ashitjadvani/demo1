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
import { AccessControlSystem, AC_SYSTEM_STATE, AC_SYSTEM_TYPE } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';

@Component({
  selector: 'app-add-edit-system',
  templateUrl: './add-edit-system.component.html',
  styleUrls: ['./add-edit-system.component.scss'],
})
export class AddEditAccessControlSystemComponent implements OnInit {
  addGeneralInfoForm: FormGroup;
  systemId: string;
  system: AccessControlSystem = null;
  companyId: any;
  sites: Site[];
  isNew: boolean = false;
  systemTypeList = Object.values(AC_SYSTEM_TYPE);
  selectedSystem = AC_SYSTEM_TYPE.LOMNIA;
  checking: boolean = false;
  acState = AC_SYSTEM_STATE;

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
      type: ['', [Validators.required]],
      url: ['', [Validators.required]],
      token: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
      groupName: ['', [Validators.required]]
    });
  }


  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }

    this.systemId = this.route.snapshot.paramMap.get('id');
    if(this.systemId == "new") {
      this.isNew = true;
      this.system = AccessControlSystem.Empty(this.companyId);
    }
    else {
      this.getSystem();
    }
  }
  
  getSystem(): void {
    this.apiServices.getSystem(this.systemId).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      this.system = res.data;
      this.addGeneralInfoForm.patchValue({
        name: this.system.name,
        url: this.system.url,
        token: this.system.token,
        groupId: this.system.groupId,
        groupName: this.system.groupName,
        type: this.system.type
      });
      this.helper.toggleLoaderVisibility(false);
    }, (err: any) => {
      console.log(err);
      this.helper.toggleLoaderVisibility(false);
      const e = err.error;
      swal.fire(
        '',
        this.tr.instant('ACCESS_CONTROL.SystemNotFound'),
        'info'
      );
    });
    this.helper.toggleLoaderVisibility(false);
  }

  checkSystem() {
    if(this.addGeneralInfoForm.valid) {
      this.checking = true;
      const data = Object.assign(this.addGeneralInfoForm.value);
      this.apiServices.checkSystemTemp(data).subscribe((res: any) => {
        let reqId = res.data;
        setTimeout(async () => {
          this.apiServices.getRequest(reqId).subscribe((res: any) => {
            let request = res.data;
            if(request.responseAccepted) {
              this.system.state = AC_SYSTEM_STATE.ONLINE_VALID;
            }
            else {
              this.system.state = AC_SYSTEM_STATE.OFFLINE;
            }
            this.checking = false;
          }, (err: any) => { this.checking = false; });
        }, 2000);
      }, (err : any) => { this.checking = false; });
    }
  }

  onSystemSubmit() {
    if (this.addGeneralInfoForm.valid) {
      if (!this.isNew) {
        const data = Object.assign({}, this.addGeneralInfoForm.value, {id: this.systemId});
        this.submitData(data);
      } else {
        const data = Object.assign({}, this.addGeneralInfoForm.value, {companyId: this.companyId});
        this.submitData(data);
      }
    }
  }

  submitData(data: any) {
    this.apiServices.addEditSystem(data).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/access-control/systems']);
    }, (err : any) => {
      swal.fire(
        '',
        this.tr.instant(err.reason),
        'info'
      );
    });
  }
}
