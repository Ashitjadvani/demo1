import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import swal from "sweetalert2";
import {BookableAssetsManagementService} from "../../../../../fe-common-v2/src/lib/services/bookable-assets-management.service";
import {CommonService} from "../../../../../fe-common-v2/src/lib/services/common.service";
import {MCPHelperService} from "../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {IrinaResourceType} from "../../../../../fe-common-v2/src/lib/models/bookable-assets";
import {AdminSiteManagementService} from "../../../../../fe-common-v2/src/lib/services/admin-site-management.service";
import {UserManagementService} from "../../../../../fe-common-v2/src/lib/services/user-management.service";
import {Site} from "../../../../../fe-common-v2/src/lib/models/admin/site";
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import {DateAdapter} from "@angular/material/core";
@Component({
  selector: 'app-book-resource-popup',
  templateUrl: './book-resource-popup.component.html',
  styleUrls: ['./book-resource-popup.component.scss']
})
export class BookResourcePopupComponent implements OnInit {
    resourceBookingForm: FormGroup;
    resourceTypes: IrinaResourceType[];
    filterResourceTypes: any;
    resourceTypeAdd: any;
    resourceType: any
    userAccount: any;
    allSites: Site[];
    meetingDate:any =new Date()
    startTimeValue: any;
  constructor(
      public dialogRef: MatDialogRef<BookResourcePopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _formBuilder: FormBuilder,
      private bookableAssetsManagementService: BookableAssetsManagementService,
      private commonService: CommonService,
      private helper: MCPHelperService,
      public translate: TranslateService,
      private adminSiteManagementService: AdminSiteManagementService,
      private userManagementService: UserManagementService,
      private resourceManagementService:ResourceManagementService,
      private _adapter: DateAdapter<any>,
  ) {
      this.resourceBookingForm=this._formBuilder.group({
          location:[''],
          area:[''],
          layout:[''],
          meetingDate:[''],
          capacity:[''],
          meetingStartTime:[''],
          meetingEndTime:['']
      })
  }

  ngOnInit(): void {
     this.resourceType= this.data.type
      this.userAccount = this.userManagementService.getAccount();
      this.loadReourceTypeList()
      this.loadSites()
  }
    streamOpened() {
        if (localStorage.getItem('currentLanguage') == 'it') {
            this._adapter.setLocale('it-IT');
        } else {
            this._adapter.setLocale('eg-EG');
        }
    }

    async loadReourceTypeList() {
        let res = await this.bookableAssetsManagementService.getBookableResourceTypes()
        if (this.commonService.isValidResponse(res)) {
            this.resourceTypes = res.data;
            this.filterResourceTypes = this.resourceTypes.find(res => res.type === this.resourceType)
        } else {
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant("Data not found"),
                'info'
            );
        }
    }
    async loadSites() {

        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);

        if (res) {
            this.allSites = res.data;
        }
    }
    siteFormatter(element: any) {
        if(element){
            let site = this.allSites.filter(s=>s.key === element)
            return site ? site[0].name : element.site;
        }

    }

    onTimeChange(event: any) {
        this.startTimeValue = event;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
   async submit(){
       let now = new Date();
      if (this.resourceBookingForm.valid){
          let data = {
              date: this.commonService.toYYYYMMDD(this.resourceBookingForm.value.meetingDate),
              resourceType: this.resourceType,
              location: this.resourceBookingForm.value.location,
              area: this.resourceBookingForm.value.area,
              layout: this.resourceBookingForm.value.layout,
              startTime: this.commonService.buildDateTimeFromHHMM(now,this.resourceBookingForm.value.meetingStartTime),
              endTime: this.commonService.buildDateTimeFromHHMM(now,this.resourceBookingForm.value.meetingEndTime),
              capacity: this.resourceBookingForm.value.capacity
          }
          let res = await this.resourceManagementService.resourceSearchAvailability(data)
      }
    }
    back(){

    }
}
