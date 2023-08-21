import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from "sweetalert2";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ServerSettingsManagementService} from "../../../../../../../fe-common-v2/src/lib/services/server-settings-management.service";

@Component({
  selector: 'app-server-settings',
  templateUrl: './server-settings.component.html',
  styleUrls: ['./server-settings.component.scss']
})
export class ServerSettingsComponent implements OnInit {
  documentData: any;
  document: any;
  ServerSettingsKey = 'server-settings';


  public EncryptionOption: any[] = ['None', 'SSL', 'TLS'];
  serverSetting: FormGroup;

   constructor(private _formBuilder: FormBuilder,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private ApiServices: ServerSettingsManagementService) {
    this.serverSetting = this._formBuilder.group({
      fullSmartWorkingFlow: [null],
      deskCheckOutMandatory: [null]
    });

  }

  ngOnInit(): void {
    this.ApiServices.getServer({key: this.ServerSettingsKey}).subscribe((res: any) => {
      this.documentData = res.reason;
      this.serverSetting.patchValue({
        fullSmartWorkingFlow: this.documentData.fullSmartWorkingFlow,
        deskCheckOutMandatory: this.documentData.deskCheckOutMandatory
      });
    });

  }
  async setServer(): Promise<void> {
    if (this.serverSetting.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.serverSetting.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      // const fullSmartWorkingFlow = this.serverSetting.fullSmartWorkingFlow.value
       const res: any = await this.ApiServices.setServer({key: this.ServerSettingsKey , value : this.serverSetting.value });
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        swal.fire('',
          this.translate.instant('Swal_Message.Server setting has been updated successfully'),
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
  changeEmailConfig(){}
}
