import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  CRUDMode,
  MetricType,
  Question,
  SurveyQuestion,
} from '../../../../store/models';
import { EntityCollectionServiceBase, QueryParams } from '@ngrx/data';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { selectChoices } from '../../../../store/selectors';
import { SurveyQuestionService } from '../../../../store/data.service';
import { SurveyQuestionDialogComponent } from '../survey-question-dialog/survey-question-dialog.component';
import { TklabMqsService } from '../../../../../../../../../fe-common/src/lib/services/tklab.mqs.service';
import { MetricDialogComponent } from '../../tkl-metrics/metric-dialog/metric-dialog.component';
import { FitIndexCalcDialogComponent } from '../fit-index-calc-dialog/fit-index-calc-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatOption } from '@angular/material/core';

class Config {
  currentElement: any;
  mode: CRUDMode;
  // service: EntityCollectionServiceBase<any>;
  service: any;
}
export interface MatricsElement {
  matrics: string;
  operator: string;
  value: number;
  textresult: string;
  scalarresult: number;
  addmatrics: any;
}

@Component({
  selector: 'app-survey-dialog',
  templateUrl: './survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.scss'],
})
export class SurveyDialogComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public DELETE_MODE = CRUDMode.DELETE;
  public _form: FormGroup;
  public readonly = false;
  public currentElement;
  // public privacy_option$: Observable<any>;
  public displayedColumns = ['order', 'code', 'question', 'actions'];
  //public questions$: Observable<SurveyQuestion[]>;
  public questions: any = [];
  // public matricsDataSource: any = [];
  public loading$: Observable<boolean>;
  public privacyOptions: any = [
    { id: 'only_manager', label: 'Only_Manager' },
    { id: 'only_coach', label: 'Only_Coach' },
    { id: 'only_user', label: 'Only_User' },
    { id: 'inherit', label: 'Inherit' },
  ];

  public scopeOptions: any = [
    { id: 'procurement', label: 'Procurement' },
    { id: 'recruitmentquiz', label: 'Recruitment - Quiz' },
    { id: 'recruitmentcustomfields', label: 'Recruitment - Custom Fields' },
  ];
  @ViewChild('allSelected') private allSelected: MatOption;

  displayedMatricsColumns: string[] = [
    'matrics',
    'operator',
    'value',
    'textresult',
    'scalarresult',
    'addmatrics',
  ];
  matricsDataSource = [];

  constructor(
    public dialogRef: MatDialogRef<SurveyDialogComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private tklabMqsService: TklabMqsService,
    @Inject(MAT_DIALOG_DATA) public config: Config
  ) {
    this._form = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      subTitle: [null, []],
      disclaimer: [null, []],
      scope: [null, []],
      onCompletion: [null, []],
      question_limit: [null],
      random_sequence: [null],
      start: [null, []],
      end: [null, []],
      privacy: [null],
    });
  }

  async ngOnInit() {
    switch (this.config.mode) {
      case CRUDMode.ADD:
      case CRUDMode.EDIT:
        this.readonly = false;
        this._form.enable();
        break;
      case CRUDMode.VIEW:
        this.readonly = true;
        this._form.disable();
        break;
    }
    this.currentElement = this.config.currentElement;
    this._form.patchValue(this.config.currentElement);
    //this.privacy_option$ = this.store.pipe(select(selectChoices, {choice: 'privacy_option'}));
    await this.getSurveyQuestion();
    await this.getSurveyMatric();
  }

  async getSurveyQuestion($event?) {
    if (this.currentElement.id) {
      const params: QueryParams = {
        survey_id: this.currentElement.id,
      };
      let res: any = await this.tklabMqsService.loadAppQuizQuestion({
        id: this.currentElement.id,
      });
      this.questions = res.result;
    }
  }

  async getSurveyMatric($event?) {
    if (this.currentElement.id) {
      const params: QueryParams = {
        survey_id: this.currentElement.id,
      };
      let res: any = await this.tklabMqsService.loadAppQuizMetricList({
        survey_id: this.currentElement.id,
      });
      this.matricsDataSource = res.result;
    }
  }

  submit($event): void {
    $event.preventDefault();
    if (!this._form.valid) {
      return;
    }
    const rec = this._form.getRawValue();
    this.tklabMqsService.saveAppSurvey(this._form.value);
    this.dialogRef.close(true);
  }

  async delete(do_delete: boolean): Promise<void> {
    if (do_delete) {
      let res: any = await this.tklabMqsService.deleteAppSurvey({
        id: this.currentElement.id,
      });
      if (res.result) {
        this.dialogRef.close(true);
      } else {
        this.dialogRef.close(false);
        this.snackBar.open(
          this.translate.instant('TKLAB.' + res.reason),
          this.translate.instant('GENERAL.OK'),
          { duration: 3000 }
        );
      }
    } else {
      this.dialogRef.close(false);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  addSurveyQuestion(): void {
    const element = new SurveyQuestion();
    element.survey = this.currentElement.id;
    this.setCurrentElement(element, CRUDMode.ADD);
  }

  editSurveyQuestion(element): void {
    this.setCurrentElement(element, CRUDMode.EDIT);
  }

  viewSurveyQuestion(element): void {
    this.setCurrentElement(element, CRUDMode.VIEW);
  }

  deleteSurveyQuestion(element): void {
    this.setCurrentElement(element, CRUDMode.DELETE, { height: '20%' });
  }

  setCurrentElement(element, mode: string, config_ovveride?) {
    const dialogRef = this.dialog.open(SurveyQuestionDialogComponent, {
      width: '50%',
      height: '50%',
      data: {
        currentElement: element,
        mode,
        service: {},
      },
      ...config_ovveride,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getSurveyQuestion();
      }
    });
    return dialogRef;
  }

  addFitIndex(
    data,
    mode,
    config_ovveride
  ): MatDialogRef<FitIndexCalcDialogComponent, any> {
    const dialogRef = this.dialog.open(FitIndexCalcDialogComponent, {
      width: '80%',
      height: '70%',
      data: {
        survey_id: this.currentElement.id,
        mode,
        metric_data: data,
      },
      ...config_ovveride,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getSurveyMatric();
      }
    });

    return dialogRef;
  }

  // select all options code
  tosslePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this._form.controls.privacy.value.length == this.privacyOptions.length)
      this.allSelected.select();
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this._form.controls.privacy.patchValue([
        ...this.privacyOptions.map((item) => item.id),
        'all',
      ]);
    } else {
      this._form.controls.privacy.patchValue([]);
    }
  }
}
