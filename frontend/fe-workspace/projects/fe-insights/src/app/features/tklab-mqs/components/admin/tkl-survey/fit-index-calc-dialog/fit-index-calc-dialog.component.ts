import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CRUDMode} from '../../../../store/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {QueryParams} from "@ngrx/data";
import {TklabMqsService} from '../../../../../../../../../fe-common/src/lib/services/tklab.mqs.service';
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-fit-index-calc-dialog',
  templateUrl: './fit-index-calc-dialog.component.html',
  styleUrls: ['./fit-index-calc-dialog.component.scss']
})
export class FitIndexCalcDialogComponent implements OnInit {

  public form_fit_index: FormGroup;
  matricData: any = [];
  public conditionOperator = [
    {id: '==', label: 'equal (==)'},
    {id: '!=', label: 'not equal (!=)'},
    {id: '>', label: 'greater than (>)'},
    {id: '>=', label: 'greater than equal (>=)'},
    {id: '<', label: 'less than (<)'},
    {id: '<=', label: 'less than equal (<=)'},
  ];

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<any>,
              private tklabMqsService: TklabMqsService,
              public translate: TranslateService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public config: any) {
    this.form_fit_index = this.fb.group({
      id: [null],
      survey_id: [this.config.survey_id, [Validators.required]],
      metric_id: [null, [Validators.required]],
      operator: [null, [Validators.required]],
      value: [null, [Validators.required]],
      result: [null, [Validators.required]],
      scalarResult: [null, [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.config.metric_data) {
      this.form_fit_index.patchValue({
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
    if (this.config.survey_id) {
      let res: any = await this.tklabMqsService.loadAppQuizMetric({survey: this.config.survey_id});
      this.matricData = res.result;
    }
  }

  delete(do_delete): void {
    if (do_delete) {
       this.tklabMqsService.deleteAppSurveyMetric({id: this.config.metric_data.id});
    }
    this.dialogRef.close(true);
  }

  async submitFitIndex($event): Promise<void> {
    $event.preventDefault();
    if (!this.form_fit_index.valid) {
      return;
    }
    const rec = this.form_fit_index.getRawValue();
    let res: any = await this.tklabMqsService.saveAppSurveyMetric(this.form_fit_index.value);
    if(res.result) {
      this.dialogRef.close(true);
    } else {
      this.snackBar.open(this.translate.instant('TKLAB.' + res.reason), this.translate.instant('GENERAL.OK'), {duration: 3000});
    }
  }
}
