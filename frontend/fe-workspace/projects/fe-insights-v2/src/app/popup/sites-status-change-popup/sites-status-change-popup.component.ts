import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SITE_STATE} from '../../../../../fe-common-v2/src/lib/models/admin/site';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sites-status-change-popup',
  templateUrl: './sites-status-change-popup.component.html',
  styleUrls: ['./sites-status-change-popup.component.scss']
})
export class SitesStatusChangePopupComponent implements OnInit {
  siteStatus = SITE_STATE;
  availableSiteStatus: any;
  addSettingInfoForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<SitesStatusChangePopupComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.addSettingInfoForm = this.formBuilder.group({
      statusResult: [true],
      globalStatus: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.availableSiteStatus = Object.values(this.siteStatus);
  }

  async onSiteSubmit(){
    if (this.addSettingInfoForm.value.globalStatus !== '' && this.addSettingInfoForm.value.globalStatus !== null){
      this.dialogRef.close(this.addSettingInfoForm.value);
    }
  }

  onClose(): void{
    this.dialogRef.close(false);
  }

}
