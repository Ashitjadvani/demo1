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
import { AccessControlGate, AccessControlSystem, AC_SYSTEM_STATE, AC_SYSTEM_TYPE } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';

@Component({
  selector: 'app-add-edit-gate',
  templateUrl: './add-edit-gate.component.html',
  styleUrls: ['./add-edit-gate.component.scss'],
})
export class AddEditAccessControlGateComponent implements OnInit {
  addGeneralInfoForm: FormGroup;
  gateId: string;
  gate: AccessControlGate = null;
  companyId: any;
  siteList: Site[];
  isNew: boolean = false;
  selectedSystem: String;
  selectedSite: String;
  selectedType: String;
  systemList: AccessControlSystem[];
  disableModify = true;

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
      system: ['', [Validators.required]],
      site: ['', [Validators.required]],
      type: ['', [Validators.required]],
      centralUnitId: [{value:0, disabled: this.disableModify}],
      centralUnitName: [{value:'', disabled: this.disableModify}],
      wifiSSID: ['', [Validators.required]],
      wifiPassword: ['', [Validators.required]],
      tokenWifi: [{value:'', disabled:true}]
    });
  }


  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.getSiteList();
    this.getSystemList();
    this.gateId = this.route.snapshot.paramMap.get('id');
    this.gate = AccessControlGate.Empty(this.companyId);
    if(this.gateId == "new") {
      this.isNew = true;
    }
    else {
      this.getGate();
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
        if(!this.addGeneralInfoForm.value.system || this.addGeneralInfoForm.value.system == "") {
          this.addGeneralInfoForm.value.system = this.systemList[0].id;
        }
      }
      catch(e) {}
    });
  }
  
  getGate() {
    try {
      this.helper.toggleLoaderVisibility(true);
      this.apiServices.getGate(this.gateId).subscribe((res: any) => {
        this.gate = res.data;
        this.addGeneralInfoForm.patchValue({
          name: this.gate.name,
          system: this.gate.systemId,
          site: this.gate.siteId,
          type: this.gate.type,
          centralUnitId: this.gate.centralUnitId,
          centralUnitName: this.gate.centralUnitName,
          wifiSSID: this.gate.wifiSSID,
          wifiPassword: this.gate.wifiPassword,
          tokenWifi: this.gate.tokenWifi
        });
        this.helper.toggleLoaderVisibility(false);
      }, (err: any) => {
        this.helper.toggleLoaderVisibility(false);
        console.log(err);
        const e = err.error;
        swal.fire(
          '',
          this.tr.instant('ACCESS_CONTROL.GateNotFound'),
          'info'
        );
      });
    }
    catch(e) {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.tr.instant('ACCESS_CONTROL.GateNotFound'),
        'info'
      );
    }
  }

  onGateSubmit() {
    if (this.addGeneralInfoForm.valid) {
      if (!this.isNew) {
        this.addGeneralInfoForm.enable();
        const data = Object.assign({}, this.addGeneralInfoForm.value, {id: this.gateId});
        this.submitDataMod(data);
      } else {
        const data = Object.assign({}, this.addGeneralInfoForm.value, {companyId: this.companyId});
        this.submitDataNew(data);
      }
    }
  }

  submitDataNew(data: any) {
    this.apiServices.generateGate(data).subscribe((data: any) => {
      this.router.navigate(['/access-control/gates/gates']);
      swal.fire(
        '',
        this.tr.instant('ACCESS_CONTROL.GateModified'),
        'success'
      );
    }, (err : any) => {
      swal.fire(
        '',
        this.tr.instant(err.reason),
        'info'
      );
    });
  }

  submitDataMod(data: any) {
    this.apiServices.modifyGate(data).subscribe((result: any) => {
      this.helper.toggleLoaderVisibility(true);
      if(result.data.mod) {
        let reqId = result.data.reqId;
        setTimeout(async () => {
          this.apiServices.getRequest(reqId).subscribe((res: any) => {
            this.helper.toggleLoaderVisibility(false);
            let request = res.data;
            if(request.responseAccepted) {
              this.router.navigate(['/access-control/gates/gates']);
              swal.fire(
                '',
                this.tr.instant('ACCESS_CONTROL.GateModified')+ ", "+this.tr.instant('ACCESS_CONTROL.GateModifiedWifi') ,
                'success'
              );
            }
            else {
              this.router.navigate(['/access-control/gates/gates']);
              swal.fire(
                this.tr.instant('ACCESS_CONTROL.ConnectionError'),
                this.tr.instant('ACCESS_CONTROL.LomniaOffline'),
                'error'
              );
            }
          }, (err: any) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
              this.tr.instant('ACCESS_CONTROL.ConnectionError'),
              this.tr.instant('ACCESS_CONTROL.LomniaOffline'),
              'error'
            );
          });
        }, 2000);
      }
      else {
        //this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/access-control/gates/gates']);
        swal.fire(
          '',
          this.tr.instant('ACCESS_CONTROL.GateModified'),
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
