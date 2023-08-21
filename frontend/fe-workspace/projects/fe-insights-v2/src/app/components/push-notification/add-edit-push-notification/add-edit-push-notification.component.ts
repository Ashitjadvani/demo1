import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {AdminSiteManagementService} from "../../../../../../fe-common-v2/src/lib/services/admin-site-management.service";
import swal from "sweetalert2";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {UserManagementService} from "../../../../../../fe-common-v2/src/lib/services/user-management.service";
import {Router} from "@angular/router";
import { MatOption } from '@angular/material/core';

export interface tagsName {
  name: string;
}


@Component({
  selector: 'app-add-edit-push-notification',
  templateUrl: './add-edit-push-notification.component.html',
  styleUrls: ['./add-edit-push-notification.component.scss']
})
export class AddEditPushNotificationComponent implements OnInit {
  addPushNotificationForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public Tags: tagsName[] = [];
  companyId: any;
  sitelist: any;
  documentData: any;
  document: any;
  tags: any;

  siteList = [
    "All Sites",
    "Milano_B20",
    "Milano_ST5",
    "Roma",
    "Irina Core Test"
  ];

  pushNotificationList = [
    {value:"Assets Management",viewValue:"INSIGHTS_MENU.ASSETS_MANAGEMENT"},
    {value:"Quiz/Survey",viewValue:"Quiz/Survey"},
    {value:"Recruiting",viewValue:"INSIGHTS_MENU.RECRUITING"},
  ];

  sourceList = [
    {value:"Job Opening",viewValue:"INSIGHTS_MENU.RECRUITING_JOB_OPENING"},
    {value:"Candidates",viewValue:"INSIGHTS_MENU.RECRUITING_CANDIDATES"},
    {value:"Job Application",viewValue:"INSIGHTS_MENU.RECRUITING_JOB_APPLICATIONS"},
  ];

  constructor(private _formBuilder: FormBuilder,
              private sitelists: AdminSiteManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private userManagementService: UserManagementService,
              private router: Router) {

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }

    this.addPushNotificationForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      //tag: this._formBuilder.array([]),
      site: ['', [Validators.required]],
      // moduleName: ['', [Validators.required]],
      // source: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // descriptionItalian:['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCompany();
  }
  async loadCompany() {
    const res = await this.sitelists.getFullSites(this.companyId);
    this.sitelist = res.data;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.Tags.push({name: value.trim()});
      this.addPushNotificationForm.value.tag.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';

    }
  }
  remove(Tags: tagsName): void {
    const index = this.Tags.indexOf(Tags);

    if (index >= 0) {
      this.Tags.splice(index, 1);
    }
  }

  async changeRole(){
    if (this.addPushNotificationForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.addPushNotificationForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any = await this.userManagementService.pushNotification(this.addPushNotificationForm.value);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/push-notification']);
        swal.fire('',
          this.translate.instant('Swal_Message.Notification pushed successfully'),
          'success');
      } else {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.reason),
          'info'
        );
      }
    }
  }
  @ViewChild('allSelected') private allSelected: MatOption;
  
  tosslePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.addPushNotificationForm.controls.site.value.length == this.sitelist.length) {
      this.allSelected.select();
    }
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.addPushNotificationForm.controls.site.patchValue([
        ...this.sitelist.map((item) => item.id),
        'all',
      ]);
    } else {
      this.addPushNotificationForm.controls.site.patchValue([]);
    }
  }

  
public space(event:any) {
  if (event.target.selectionStart === 0 && event.code === 'Space'){
    event.preventDefault();
  }
}

}
