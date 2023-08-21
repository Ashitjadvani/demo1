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
import { ACCESS_CONTROL_LEVEL, Person } from '../../../../../../../fe-common-v2/src/lib/models/person';
import { Observable } from 'rxjs';
import { UserManagementService } from '../../../../../../../fe-common-v2/src/lib/services/user-management.service';
import { CommonService } from '../../../../../../../fe-common-v2/src/lib/services/common.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { map, startWith } from 'rxjs/operators';
import { UserAccount } from '../../../../../../../fe-common-v2/src/lib/models/user-account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlGate, AccessControlGatesGroup, AccessControlSystem, CustomACQrCode, UserACQrCode } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-view-ext-badge',
  templateUrl: './view-ext-badge.component.html',
  styleUrls: ['./view-ext-badge.component.scss'],
})
export class ViewExtBadgeComponent implements OnInit {
  badgeId: string;
  badge: CustomACQrCode = new CustomACQrCode();
  companyId: any;
  sites: Site[] = new Array();
  systems: AccessControlSystem[] = new Array();
  gates: AccessControlGate[] = new Array();
  groups: AccessControlGatesGroup[] = new Array();
  test = true;
  levels: ACCESS_CONTROL_LEVEL;

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
  ) {}


  async ngOnInit() {
    this.badgeId = this.route.snapshot.paramMap.get('id');
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.getSitesList();
    this.getBadge();
  }
  
  getBadge(): void {
    this.helper.toggleLoaderVisibility(true);
    this.apiServices.getAllSystems(null).subscribe((res) => {
      if(res.data) this.systems = res.data;
    });
    this.apiServices.getFullCompanyGatesListBySite(this.companyId).subscribe((res) => {
      if(res.data) this.gates = res.data;
    });
    this.apiServices.getFullCompanyGatesGroupsList(this.companyId).subscribe((res) => {
      if(res.data) this.groups = res.data;
    });
    this.apiServices.getExtBadge(this.badgeId).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(false);
      if(res.data) this.badge = res.data;
    }, (err: any) => {
      console.log(err);
      this.helper.toggleLoaderVisibility(false);
      const e = err.error;
      swal.fire(
        '',
        this.tr.instant('ACCESS_CONTROL.BadgeNotFound'),
        'info'
      );
    });
    //this.helper.toggleLoaderVisibility(false);
  }
  
  async getSitesList() {
    let res = await this.siteApiServices.getSites(this.companyId);
    if(res) {
      this.sites = res.data;
    }
  }

  gateIsChecked(gateToCheckId: string) {
    return this.badge.codeData.passageIds.find(gateId => gateId == gateToCheckId);
  }

  groupIsChecked(groupToCheckId: string) {
    return this.badge.codeData.groupsId.find(groupId => groupId == groupToCheckId);
  }

  getStartDate() {
    if(this.badge.codeData.startDate) {
      return(this.commonService.toDDMMYYYY(this.badge.codeData.startDate));
    }
    return "-";
  }

  getEndDate() {
    if(this.badge.codeData.startDate) {
      return(this.commonService.toDDMMYYYY(this.badge.codeData.endDate));
    }
    return "-";
  }

  downloadBadge() {
    let data = document.getElementById('badge'); 
    html2canvas(data).then(canvas => {
      var a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = this.badge.codeData.surname + ' ' + this.badge.codeData.name + ' - ' + this.badge.codeData.notes + ' - ' + this.badge.codeData.email +  '.jpg';
        a.click();
    }); 
  }
  
}
