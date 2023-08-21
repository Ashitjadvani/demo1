import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from "sweetalert2";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileSettingsService} from "../../../../../../../fe-common-v2/src/lib/services/profile-settings.service";

@Component({
  selector: 'app-work-settings',
  templateUrl: './work-settings.component.html',
  styleUrls: ['./work-settings.component.scss']
})
export class WorkSettingsComponent implements OnInit {

  workSettingsForm: FormGroup;
  documentData: any;
  document: any;
  token: any;
  companyId: any;

  constructor(private _formBuilder: FormBuilder,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: ProfileSettingsService) {


    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
    }

    this.workSettingsForm = this._formBuilder.group({
      id: [this.companyId],
      lunchQuestEnabledForOffice: ['', [Validators.required]],
      lunchQuestEnabledForSmartworking: ['', [Validators.required]],
      lunchCronDays: ['', [Validators.required]],
      enableLunchUpdaterCron: ['', [Validators.required]],
      lunchUpdaterCronDueTime: ['', [Validators.required]],
    });


  }

  ngOnInit(): void {
    this.ApiService.getCompany({}).subscribe((res: any ) => {
      this.documentData = res.company;
      this.workSettingsForm.patchValue({
        id: this.companyId,
        lunchQuestEnabledForOffice: this.documentData.lunchQuestEnabledForOffice,
        lunchQuestEnabledForSmartworking: this.documentData.lunchQuestEnabledForSmartworking,
        lunchCronDays: this.documentData.lunchCronDays,
        enableLunchUpdaterCron: this.documentData.enableLunchUpdaterCron,
        lunchUpdaterCronDueTime: this.documentData.lunchUpdaterCronDueTime,
      });
    });
  }
  async changeWorkSettings(): Promise<void>{
    if (this.workSettingsForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.workSettingsForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any = await this.ApiService.set(this.workSettingsForm.value);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        swal.fire('',
          this.translate.instant('Swal_Message.Work setting has been updated successfully'),
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

}
