import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MCPHelperService } from '../../../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileSettingsService } from '../../../../../../../fe-common-v2/src/lib/services/profile-settings.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-customization',
  templateUrl: './dashboard-customization.component.html',
  styleUrls: ['./dashboard-customization.component.scss'],
})
export class DashboardCustomizationComponent implements OnInit {
  changeModuleForm: FormGroup;
  nativeLanguagesForm: FormGroup;
  documentData: any;
  document: any;
  nativeLanguagesList: any;
  peopleManagementList: any[] = [];
  alertsList: any[] = [];
  masterModulesList: any[] = [];
  recruitingList: any[] = [];
  changeOrderingList: any [] = [];
  companyId: any;
  dashboardCustomization: any;

  constructor(
    private _formBuilder: FormBuilder,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router,
    public route: ActivatedRoute,
    private ApiService: ProfileSettingsService
  ) {
    this.nativeLanguagesForm = this._formBuilder.group({
      requestedFormControl: ['', [Validators.required]],
    });

    this.changeModuleForm = this._formBuilder.group({
      //peopleManagementForm: [],
      // moduleStatus:[false]
      // requestedFormControl: ['',[Validators.required]],
    });
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      // this.token = authUser.token;
      this.companyId = authUser.person.companyId;
    }
  }

  ngOnInit(): void {
    this.ApiService.getCompany({}).subscribe((res: any) => {
      this.documentData = res.company.dashboardCustomization;
      this.nativeLanguagesList = res.company.nativeLanguages;
      this.peopleManagementList = res.company.dashboardCustomization.peopleManagement;
      this.alertsList = res.company.dashboardCustomization.alerts;
      this.masterModulesList = res.company.dashboardCustomization.masterModules;
      this.recruitingList = res.company.dashboardCustomization.recruiting;
      this.changeOrderingList = res.company.dashboardChangeOrder;
    });
  }
  async submitChangeOrdering() {
    const res: any = await this.ApiService.setDashboard({id: this.companyId, dashboardChangeOrder: this.changeOrderingList});
    if (res) {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant('Swal_Message.Change Ordering saved successfully'),
        'success'
      );
    } else {
      this.helper.toggleLoaderVisibility(false);
      swal.fire('', this.translate.instant(res.reason), 'info');
    }
  }

  async submitEnableDisable(): Promise<void> {
    if (this.changeModuleForm.valid) {
      this.dashboardCustomization = {
        peopleManagement: this.peopleManagementList,
        masterModules: this.masterModulesList,
        alerts: this.alertsList,
        recruiting: this.recruitingList,
      };
      this.documentData = new FormData();
      const getInputsValues = this.changeModuleForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, getInputsValues[key] ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any = await this.ApiService.setDashboard({id: this.companyId, dashboardCustomization: this.dashboardCustomization});
      //const res: any = await this.ApiService.setDashboard(this.companyId,this.dashboardCustomization);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant('Swal_Message.Dashboard customization has been updated successfully'),
          'success'
        );
      } else {
        this.helper.toggleLoaderVisibility(false);
        swal.fire('', this.translate.instant(res.reason), 'info');
      }
    }
  }

  async changeOrder(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.changeOrderingList, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.changeOrderingList.length; i++ ){
      this.changeOrderingList[i].order = i;
    }
  }
  Checklist(event, index, step) {
    if (step == 1) {
      if (event.checked) {
        this.peopleManagementList[index].moduleStatus = true;
      } else this.peopleManagementList[index].moduleStatus = false;
    }
    if (step == 2) {
      if (event.checked) {
        this.masterModulesList[index].moduleStatus = true;
      } else this.masterModulesList[index].moduleStatus = false;
    }
    if (step == 3) {
      if (event.checked) {
        this.alertsList[index].moduleStatus = true;
      } else this.alertsList[index].moduleStatus = false;
    }
    if (step == 4) {
      if (event.checked) {
        this.recruitingList[index].moduleStatus = true;
      } else this.recruitingList[index].moduleStatus = false;
    }
  }
}
