import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CRUDMode, MetricType, Question, SurveyQuestion} from '../../../../store/models';
import {EntityCollectionServiceBase, QueryParams} from '@ngrx/data';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {selectChoices} from '../../../../store/selectors';
import {SurveyQuestionService} from '../../../../store/data.service';
import {SurveyQuestionDialogComponent} from '../survey-question-dialog/survey-question-dialog.component';

class Config {
  currentElement: any;
  mode: CRUDMode;
  // service: EntityCollectionServiceBase<any>;
  service: any;
}

@Component({
  selector: 'app-survey-dialog',
  templateUrl: './survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.scss']
})
export class SurveyDialogComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public DELETE_MODE = CRUDMode.DELETE;
  public _form: FormGroup;
  public readonly = false;
  public currentElement;
  public privacy_option$: Observable<any>;
  public displayedColumns = ['order', 'question', 'actions'];
  public questions$: Observable<SurveyQuestion[]>;
  public loading$: Observable<boolean>;

  constructor(public dialogRef: MatDialogRef<SurveyDialogComponent>,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private store: Store,
              private survey_question_service: SurveyQuestionService,
              @Inject(MAT_DIALOG_DATA) public config: Config) {
    this._form = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      subtitle: [null, []],
      disclaimer: [null, []],
      on_complete: [null, []],
      startDate: [null, []],
      endDate: [null, []],
      privacy: [null, [Validators.required]],
    });

  }

  ngOnInit(): void {
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
    this.questions$ = this.survey_question_service.entities$;
    this.loading$ = this.survey_question_service.loading$;
    this._form.patchValue(this.config.currentElement);
    this.privacy_option$ = this.store.pipe(select(selectChoices, {choice: 'privacy_option'}));
    this.getSurveyQuestion();
  }

  public getSurveyQuestion($event?) {
    if (this.currentElement.id) {
      const params: QueryParams = {
        survey_id: this.currentElement.id
      };
      this.survey_question_service.clearCache();
      this.survey_question_service.getWithQuery(params);
      /*const res = this.survey_question_service.getWithQuery(params);
      res.subscribe( data => {
        this.setCurrentElement(data[1],'EDIT')
      })*/
    }
  }


  submit($event): void {
    $event.preventDefault();
    if (!this._form.valid) {
      return;
    }
    const rec = this._form.getRawValue();
    if (rec.id) {
      this.config.service.update(rec);
    } else {
      this.config.service.add(rec);
    }
    this.dialogRef.close();
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


  addSurveyQuestion(): void {
    const element = new SurveyQuestion();
    element.survey = this.currentElement.id
    this.setCurrentElement(element, CRUDMode.ADD);
  }

  editSurveyQuestion(element): void {
    this.setCurrentElement(element, CRUDMode.EDIT);
  }

  viewSurveyQuestion(element): void {
    this.setCurrentElement(element, CRUDMode.VIEW);
  }

  deleteSurveyQuestion(element): void {
    this.setCurrentElement(element, CRUDMode.DELETE, {height: '20%'});
  }

  setCurrentElement(element, mode: string, config_ovveride?) {
    const dialogRef = this.dialog.open(SurveyQuestionDialogComponent, {
      width: '95%',
      height: '90%',
      data: {
        currentElement: element,
        mode,
        service: this.survey_question_service,
      },
      ...config_ovveride
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.getSurveyQuestion();
      });
    return dialogRef;
  }
}
