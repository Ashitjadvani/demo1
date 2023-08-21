import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from "@ngx-translate/core";
import {TklabMqsService} from "../../../../../fe-common/src/lib/services/tklab.mqs.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-add-edit-fit-index-popup',
  templateUrl: './add-edit-fit-index-popup.component.html',
  styleUrls: ['./add-edit-fit-index-popup.component.scss']
})
export class AddEditFitIndexPopupComponent implements OnInit {
  public fitIndexForm: FormGroup;
  matricData: any = [];
  surveyId : any;
  mode: any;
  constructor(
    private dialogRef: MatDialogRef<AddEditFitIndexPopupComponent>,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    private tklabMqsService: TklabMqsService,
    @Inject(MAT_DIALOG_DATA) public config: any,
  ) {
    this.surveyId =  config.surveyId;
    this.mode = config.mode;
    this.fitIndexForm = this.formBuilder.group({
      id: [null],
      metric_id: [null, [Validators.required]],
      operator: [null, [Validators.required]],
      value: [null, [Validators.required]],
      result: [null, [Validators.required]],
      scalarResult: [null, [Validators.required]],
      survey_id : this.surveyId
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.config.metric_data) {
      this.fitIndexForm.patchValue({
        id: this.config.metric_data.id,
        survey_id: this.config.metric_data.survey_id,
        metric_id: this.config.metric_data.metric_id,
        operator: this.config.metric_data.operator,
        value: this.config.metric_data.value,
        result: this.config.metric_data.result,
        scalarResult: this.config.metric_data.scalarResult
      });
    }
    await this.getSurveyMetric();
  }

  async getSurveyMetric($event?): Promise<void> {
    if (this.config.surveyId) {
      let res: any = await this.tklabMqsService.loadAppQuizMetric({survey: this.surveyId});
      this.matricData = res.result;
    }
  }

  async submitFitIndex(): Promise<void> {
    if (this.fitIndexForm.status == "VALID"){
      let res: any = await this.tklabMqsService.saveAppSurveyMetric(this.fitIndexForm.value);
      if(res.result) {
        this.dialogRef.close(true);
      } else {
        swal.fire(
          'Info',
          this.translate.instant('TKLAB.' + res.reason),
          'info'
        );
      }
    }
  }

  onClick(result): void{
    this.dialogRef.close(result);
  }

  public space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}
