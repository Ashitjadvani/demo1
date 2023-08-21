import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/dashboard/dashboard.component';
import {RecruitingManagementService} from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';
import { MCPHelperService } from '../../service/MCPHelper.service';


@Component({
  selector: 'app-add-edit-video-assessment',
  templateUrl: './add-edit-video-assessment.component.html',
  styleUrls: ['./add-edit-video-assessment.component.scss']
})
export class AddEditVideoAssessmentComponent implements OnInit {
  mode = 'Add';
  module = 'Add';
  customField: any;
  // title: string;

  addVideoAssesmentForm:FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<AddEditVideoAssessmentComponent>,
    private recruitingManagementService: RecruitingManagementService,
      private _formBuilder:FormBuilder,
    ) { 
      this.mode = data.mode;
      this.module = data.module;
      this.customField = JSON.parse(JSON.stringify(data.customField));
      this.addVideoAssesmentForm = this._formBuilder.group({
        id: [null],
        question:[null, [Validators.required,MCPHelperService.noWhitespaceValidator]],

        // videoQuestionItalian:['',[Validators.required]]
      })
  }

  ngOnInit(): void {
    if(this.customField && this.customField.question){
      this.addVideoAssesmentForm.patchValue({id:this.customField.id, question: this.customField.question});
    }
  }

  onClick(result): void{
    this.dialogRef.close(result);
  }
  submit(){
    this.recruitingManagementService.videoQuestionSave(this.addVideoAssesmentForm.value).then((data: any) => {
      this.dialogRef.close({reason: true, result: data.data});
  });
  }

}
