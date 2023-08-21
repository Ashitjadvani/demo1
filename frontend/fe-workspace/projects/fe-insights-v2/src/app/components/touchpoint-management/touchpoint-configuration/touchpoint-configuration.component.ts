import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from "sweetalert2";
import {TouchpointManagementService} from "../../../../../../fe-common-v2/src/lib/services/touchpoint-management.service";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-touchpoint-configuration',
  templateUrl: './touchpoint-configuration.component.html',
  styleUrls: ['./touchpoint-configuration.component.scss']
})
export class TouchpointConfigurationComponent implements OnInit {
  touchpointConfigForm: FormGroup
  touchPointConfig: any = new MatTableDataSource([]);
  documentData: any;
  document: any;
  constructor(private _formBuilder: FormBuilder,
              private ApiService: TouchpointManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
    this.touchpointConfigForm = this._formBuilder.group({
      keepAliveInterval: ['', [Validators.required]],
      alertMailList: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTouchpointsConfig();
  }
  async getTouchpointsConfig(): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getTouchPointSettings();
    if (res.result  === true) {
      this.touchPointConfig = res.settings;
      const documentData = this.touchPointConfig;
      this.touchpointConfigForm.patchValue({
        keepAliveInterval: documentData.keepAliveInterval,
        alertMailList: documentData.alertMailList
      });
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  udateConfig(): any{
    if (this.touchpointConfigForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.touchpointConfigForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any =  this.ApiService.updateTouchPointSettings( this.touchpointConfigForm.value);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/touchpoint-management']);
        swal.fire('',
          this.translate.instant('Swal_Message.Configuration edited successfully')
          , 'success');
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
