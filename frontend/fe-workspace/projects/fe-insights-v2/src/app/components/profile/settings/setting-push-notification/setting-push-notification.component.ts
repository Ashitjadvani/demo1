import { Component, OnInit } from '@angular/core';
import swal from "sweetalert2";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-setting-push-notification',
  templateUrl: './setting-push-notification.component.html',
  styleUrls: ['./setting-push-notification.component.scss']
})
export class SettingPushNotificationComponent implements OnInit {
  pushNotificationform: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.pushNotificationform = formBuilder.group({
      token: ['']
    });
  }

  ngOnInit(): void {
  }
  async setServer(): Promise<void> {
/*    if (this.serverSetting.valid) {
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
    }*/
  }
}
