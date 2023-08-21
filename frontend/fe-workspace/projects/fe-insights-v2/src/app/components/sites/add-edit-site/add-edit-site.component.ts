import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService} from "../../../../../../fe-common-v2/src/lib/services/api";
import {AdminSiteManagementService} from "../../../../../../fe-common-v2/src/lib/services/admin-site-management.service";
import {SITE_TYPE} from "../../../../../../fe-common-v2/src/lib/models/admin/site";
import {Site, SITE_STATE} from "../../../../../../fe-common-v2/src/lib/models/admin/site";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import { MCPHelperService } from '../../../service/MCPHelper.service';

@Component({
  selector: 'app-add-edit-site',
  templateUrl: './add-edit-site.component.html',
  styleUrls: ['./add-edit-site.component.scss']
})
export class AddEditSiteComponent implements OnInit {
  addGeneralInfoForm:FormGroup
  addSettingInfoForm: FormGroup;
  isLinear = false;
  serviceId = '';
  title = 'Add';
  siteTypeList = Object.values(SITE_TYPE);
  siteStatus = SITE_STATE;
  availableSiteStatus: any;
  companyId: any;
  currentSite: Site = Site.Empty();
  selected = 'Site';

  constructor(
    private _formBuilder: FormBuilder,
    private apiService : ApiService,
    private adminSiteManagementService : AdminSiteManagementService,
    private translate : TranslateService,
    private router : Router,
    private route: ActivatedRoute,
  ) {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.addGeneralInfoForm = this._formBuilder.group({
      key: ['', [Validators.required,MCPHelperService.noWhitespaceValidator]],
      siteType: ['', [Validators.required]],
      name: ['',[Validators.required]],
      address:[''],
      cap:[''],
      city:[''],
    });
    this.addSettingInfoForm = this._formBuilder.group({
      facilityManagerId: [''],
      officeManagerId: [''],
      globalStatus: ['', [Validators.required]],
      maxCapacity:[''],
      meetingRoomAvalabilityFlag:[''],
      deskAvalabilityFlag:[''],
      managerRestriction:[''],
      useAreaCapacities :[''],
      enableWeekend:[''],
    });
  }

  ngOnInit(): void {
    this.availableSiteStatus = Object.values(this.siteStatus);
    if (this.serviceId){
      this.title = 'Edit';
      this.adminSiteManagementService.editSite(this.serviceId).then(async (data: any) => {
        const siteData = data.data;
        this.addGeneralInfoForm.patchValue({
          key: siteData.key,
          siteType: siteData.siteType,
          name: siteData.name,
          address:siteData.address,
          cap:siteData.cap,
          city:siteData.city,
        });
        this.addSettingInfoForm.patchValue({
          facilityManagerId: siteData.facilityManagerId,
          officeManagerId: siteData.officeManagerId,
          globalStatus: siteData.globalStatus,
          maxCapacity: siteData.maxCapacity,
          meetingRoomAvalabilityFlag: siteData.meetingRoomAvalabilityFlag,
          deskAvalabilityFlag: siteData.deskAvalabilityFlag,
          managerRestriction: siteData.managerRestriction,
          useAreaCapacities : siteData.useAreaCapacities,
          enableWeekend: siteData.enableWeekend,
        });
      })
    }
  }
  async onSiteSubmit(){
    if (this.addGeneralInfoForm.valid && this.addSettingInfoForm.valid){
      if (this.serviceId) {
        const data = Object.assign({}, this.addGeneralInfoForm.value, this.addSettingInfoForm.value, {id: this.serviceId});
        this.submitData(data);
      }else {
        const data = Object.assign({}, this.addGeneralInfoForm.value, this.addSettingInfoForm.value, {companyId: this.companyId});
        this.submitData(data);
      }
    }
  }

  submitData(data): void{
    this.adminSiteManagementService.addOrUpdateSite(data).then(async (data: any) => {
      if (data.result) {
        if (this.serviceId) {
          swal.fire(
            '',
            this.translate.instant('SITE_EDITED_SUCCESSFULLY'),
            'success'
          );
          this.router.navigate(['/sites']);
        }else {
          swal.fire(
            '',
            this.translate.instant('SITE_ADDED_SUCCESSFULLY'),
            'success'
          );
          this.router.navigate(['/sites']);
        }
      }else {
        swal.fire(
          '',
          this.translate.instant(data.reason),
          'info'
        );
      };
    }, (err : any) => {
      swal.fire(
        '',
        this.translate.instant(err.reason),
        'info'
      );
    });
  }

  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
