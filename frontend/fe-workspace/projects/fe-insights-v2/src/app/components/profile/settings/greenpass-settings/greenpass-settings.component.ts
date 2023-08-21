import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from "sweetalert2";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileSettingsService} from "../../../../../../../fe-common-v2/src/lib/services/profile-settings.service";
import {promise} from "protractor";

@Component({
  selector: 'app-greenpass-settings',
  templateUrl: './greenpass-settings.component.html',
  styleUrls: ['./greenpass-settings.component.scss']
})
export class GreenpassSettingsComponent implements OnInit {
  public requestedLevel: any[] = ['Base','Super','Booster'];
  greenPassForm: FormGroup;
  documentData: any;
  document: any;
  values: any;
  token: any;
  companyId: any;
  _id: any;
  greenpassSettings = {};

  constructor(private _formBuilder: FormBuilder,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: ProfileSettingsService) {
    this.greenPassForm = this._formBuilder.group({
      _id: [''],
      ageRangeLevel: [],
      abilitation: ['', [Validators.required]],
      requestedForCheckIn: ['', [Validators.required]],
      checkName: ['', [Validators.required]],
      checkDate: ['', [Validators.required]],
      // storeGreenpass: [false, [Validators.required]],
    });


    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this._id = authUser.person._id;
      this.companyId = authUser.person.companyId;
    }
  }

  ngOnInit(): void {
    this.ApiService.getCompany({}).subscribe((res: any ) => {
      this.documentData = res.company.greenpassSettings;
      this.greenPassForm.patchValue({
        _id: this._id,
        ageRangeLevel: this.documentData.ageRangeLevel,
        abilitation: this.documentData.abilitation,
        requestedForCheckIn: this.documentData.requestedForCheckIn,
        checkName: this.documentData.checkName,
        checkDate: this.documentData.checkDate,
        // storeGreenpass: this.documentData.storeGreenpass,
      });
    });
  }
  async changeGreenPass(): Promise<any>{
    if (this.greenPassForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.greenPassForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any = await this.ApiService.setGreenpass(this.companyId, this.greenPassForm.value);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        swal.fire('',
          this.translate.instant('Swal_Message.Greenpass setting has been updated successfully'),
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
