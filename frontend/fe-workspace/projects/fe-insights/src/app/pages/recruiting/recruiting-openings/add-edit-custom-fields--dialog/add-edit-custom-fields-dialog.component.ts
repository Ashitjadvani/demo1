import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {RecruitingManagementService} from 'fe-common/services/recruiting-management.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'add-edit-custom-fields-dialog',
  templateUrl: './add-edit-custom-fields-dialog.component.html',
  styleUrls: ['./add-edit-custom-fields-dialog.component.scss']
})
export class AddEditCustomFieldsDialogComponent implements OnInit {
  mode = 'Add';
  module = 'Add';
  customField: any;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<AddEditCustomFieldsDialogComponent>,
    private recruitingManagementService: RecruitingManagementService,
    private translate: TranslateService,
  ) {
    this.mode = data.mode;
    this.module = data.module;
    this.title = (data.module === 'custom') ?  'COMPANYTXT.CustomFiled' : 'COMPANYTXT.VideoQuestion';
    this.customField = JSON.parse(JSON.stringify(data.customField));
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close({reason: false});
  }

  onSave(): void {
    if (this.module === 'custom') {
      this.recruitingManagementService.customFiledSave(this.customField).then((data: any) => {
        this.dialogRef.close({reason: true, result: data.data});
      });
    } else {
      this.recruitingManagementService.videoQuestionSave(this.customField).then((data: any) => {
        this.dialogRef.close({reason: true, result: data.data});
      });
    }
  }
}
