import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
  Answer,
  AnswerSideEffect,
  Condition,
  CRUDMode,
  Metric,
  MetricType,
  Question,
  SurveyQuestion
} from '../../../../store/models';
import {EntityCollectionServiceBase, QueryParams} from '@ngrx/data';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {selectChoices} from '../../../../store/selectors';
import {ConditionService, MetricService, QuestionService, SurveyQuestionService} from '../../../../store/data.service';
import {takeUntil} from 'rxjs/operators';
import {DialogconfirmComponent} from '../../../dialogconfirm/dialogconfirm.component';

class Config {
  currentElement: any;
  mode: CRUDMode;
  // service: EntityCollectionServiceBase<any>;
  service: any;
}

@Component({
  selector: 'app-survey-question-dialog',
  templateUrl: './survey-question-dialog.component.html',
  styleUrls: ['./survey-question-dialog.component.scss']
})
export class SurveyQuestionDialogComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public DELETE_MODE = CRUDMode.DELETE;
  public _form_survey_question: FormGroup;
  public _form_conditions: FormGroup;
  public readonly = false;
  public currentElement;
  public displayedColumns = ['actions', 'order', 'question'];
  public questions$: Observable<Question[]>;
  public questions: Question[];
  public loading$: Observable<boolean>;
  public conditionDataSource$ = new BehaviorSubject<AbstractControl[]>([]);
  public conditionDisplayedColumns = ['answer', 'action', 'metric', 'operator', 'value', 'actions'];


  public metrics$: Observable<Metric[]>;
  public condition_action$: Observable<any[]>;
  public condition_operator$: Observable<any[]>;

  constructor(public dialogRef: MatDialogRef<SurveyQuestionDialogComponent>,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private store: Store,
              private question_service: QuestionService,
              private metricService: MetricService,
              @Inject(MAT_DIALOG_DATA) public config: Config) {
    this._form_survey_question = this.fb.group({
      id: [null, []],
      survey: [null, []],
      order: [null, []],
      question: [null, [Validators.required]],
      conditions: this.fb.array([])
    });


    this._form_conditions = this.fb.group({
      survey_question_id: [],
      survey_answer: [null, []],
      code: [],
      descripition: [],
      metric: [null, [Validators.required]],
      action: [null, [Validators.required]],
      operator: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.metrics$ = this.metricService.entities$;
    this.metricService.getAll();
    this.condition_action$ = this.store.pipe(select(selectChoices, {choice: 'condition_action'}));
    this.condition_operator$ = this.store.pipe(select(selectChoices, {choice: 'condition_operator'}));
    switch (this.config.mode) {
      case CRUDMode.ADD:
      case CRUDMode.EDIT:
        this.readonly = false;
        this._form_survey_question.enable();
        break;
      case CRUDMode.VIEW:
        this.readonly = true;
        this._form_survey_question.disable();
        break;
    }
    this.setCurrentElement(this.config.currentElement);


    this.questions$ = this.question_service.entities$;
    this.question_service.getAll();
    this.questions$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(questions => this.questions = questions)
  }

  setCurrentElement(element) {
    this.currentElement = element;
    this._form_survey_question.patchValue(this.currentElement);
    const conditions = this._form_survey_question.get('conditions') as FormArray;
    while (conditions.controls.length > 0) {
      conditions.removeAt(0);
    }
    if (this.currentElement.conditions) {
      for (const cond of this.currentElement.conditions) {
        const config = {};
        for (const key of Object.keys(cond)) {
          config[key] = [cond[key], []];
        }
        const group = this.fb.group(config);
        conditions.push(group);
      }
      this.refreshConditionList(conditions);
    }
    // this.tbComponenti.renderRows()
  }


  submitSurveyQuestion($event): void {
    $event.preventDefault();
    if (!this._form_survey_question.valid) {
      return;
    }
    const rec = this._form_survey_question.getRawValue();
    let call;
    if (rec.id) {
      call = this.config.service.update(rec);
    } else {
      call = this.config.service.add(rec);
    }
    call
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.dialogRef.close();
      });
  }

  delete(do_delete: boolean) {
    if (do_delete) {
      this.config.service.delete(this.currentElement.id);
    }
    this.dialogRef.close();
  }


  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


  refreshConditionList(conditions: FormArray = null) {
    if (conditions === null) {
      conditions = this._form_survey_question.get('conditions') as FormArray;
    }
    this.conditionDataSource$.next(conditions.controls);
  }

  rec_to_form(rec: any, master_config: any): any {
    const config = {};
    for (const key of Object.keys(rec)) {
      if (master_config[key]) {
        config[key] = [rec[key], master_config[key][1]];
      }
    }
    return config;
  }

  addCondition($event) {
    $event.preventDefault();
    const conditions = this._form_survey_question.get('conditions') as FormArray;
    const condition = new Condition();
    const config = {};
    for (const key of Object.keys(condition)) {
      config[key] = [condition[key], []];
    }
    const group = this.fb.group(config);
    conditions.push(group);
    this.refreshConditionList(conditions);
  }

  deleteCondition($event, element, index): void {
    $event.preventDefault();
    const message = 'TKLAB.CONFIRM_DELETE';
    const manualRef = this.dialog.open(DialogconfirmComponent, {
      width: '30%',
      data: message
    });
    manualRef
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        if (result) {
          const conditions = this._form_survey_question.get('conditions') as FormArray;
          conditions.removeAt(index);
          this.refreshConditionList();
        }
      });

  }

  getSelectQuestionAnswer(): Answer[] {
    const question_id = this._form_survey_question.getRawValue().question;
    if (question_id) {
      const question = this.questions.filter(q => q.id === question_id)[0];
      if (question) {
        return question.answers;
      }
    }
    return [];
  }


}
