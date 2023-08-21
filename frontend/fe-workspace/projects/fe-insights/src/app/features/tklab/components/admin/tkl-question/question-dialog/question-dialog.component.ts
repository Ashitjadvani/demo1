import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EntityCollectionServiceBase} from '@ngrx/data';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {selectChoices} from '../../../../store/selectors';
import {Answer, AnswerSideEffect, CRUDMode, QuestionType} from '../../../../store/models';
import {takeUntil} from 'rxjs/operators';
import {DialogconfirmComponent} from '../../../dialogconfirm/dialogconfirm.component';
import {SideEffectsDialogComponent} from '../side-effects-dialog/side-effects-dialog.component';
import {AnswerSideEffectService} from '../../../../store/data.service';
import {SelectionChange} from '@angular/cdk/collections';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


class Config {
  currentElement: any;
  mode: CRUDMode;
  // service: EntityCollectionServiceBase<any>;
  service: any;
}

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public DELETE_MODE = CRUDMode.DELETE;
  public QUESTION_TYPE = QuestionType;
  public _form: FormGroup;
  public _form_answers: FormGroup;
  public readonly = false;
  public currentElement;
  public question_types$: Observable<any>;
  public question_widgets$: Observable<any>;
  public privacy_options$: Observable<any>;

  /*surveyPrivacy: any = [
    { value: 1, valueName: 'ALL' },
    { value: 2, valueName: 'Only_Manager'},
    { value: 3, valueName: 'Only_Coach'},
    { value: 4, valueName: 'Only_User'},
    { value: 5, valueName: 'Inherit'}
  ]
  questionTypes:any=[
    { value: 1, valueName: 'singleList' },
    { value: 2, valueName: 'multipleList'},
    { value: 3, valueName: 'singleRadio'},
  ]*/
  public privacyOptions: any = [
        {id: '1', label : 'ALL' } ,
        {id: '2', label : 'Only_Manager' } ,
        {id: '3', label : 'Only_Coach' } ,
        {id: '3', label : 'Only_User' } ,
        {id: '3', label : 'Inherit' } ,
  ];

  public questionTypes: any = [
    {id: '1', label : 'singleRadio' } ,
    {id: '2', label : 'singleCheck' } ,
    {id: '3', label : 'FreeText' } ,
  ];
  public answersDataSource = new BehaviorSubject<AbstractControl[]>([]);
  public answersDisplayedColumns = ['order', 'value', 'side_effects', 'actions'];
  public last_question_type: any = null;
  public Editor = ClassicEditor;

  constructor(public dialogRef: MatDialogRef<QuestionDialogComponent>,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private store: Store,
              private effectService: AnswerSideEffectService,
              @Inject(MAT_DIALOG_DATA) public config: Config) {
    this._form = this.fb.group({
      id: [null],
      question: [null, [Validators.required]],
      subtitle: [null, []],
      mandatory: [null, []],
      content: [null, []],
      privacy: [null, [Validators.required]],
      type: [null, [Validators.required]],
      widget: [null, []],
      numeric_range_min: [null, []],
      numeric_range_max: [null, []],
      numeric_step: [null, []],
      answers: this.fb.array([])
    });

    this.question_types$ = this.store.pipe(select(selectChoices, {choice: 'question_type'}));
    this.question_widgets$ = this.store.pipe(select(selectChoices, {choice: 'question_widget'}));
    this.privacy_options$ = this.store.pipe(select(selectChoices, {choice: 'privacy_option'}));

    this._form_answers = this.fb.group({
      value: [null, [Validators.required]],
      order: [null, []]
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
        this._form_answers.disable();
        break;
    }
    this.currentElement = this.config.currentElement;
    this.last_question_type = this.currentElement?.type;
    const answers = this._form.get('answers') as FormArray;
    while (answers.controls.length > 0) {
      answers.removeAt(0);
    }
    for (const answer of this.currentElement.answers) {
      const config = {};
      for (const key of Object.keys(answer)) {
        config[key] = [answer[key], []];
      }
      const group = this.fb.group(config);
      answers.push(group);
    }
    this.refreshAnswersList(answers);
    this._form.patchValue(this.config.currentElement);
  }

  refreshAnswersList(answers: FormArray = null) {
    if (answers === null) {
      answers = this._form.get('answers') as FormArray;
    }
    answers.controls.sort((a, b) => a['controls']['order'].value - b['controls']['order'].value);
    this.answersDataSource.next(answers.controls);
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
    this.dialogRef.close()
  }


  // Answers
  addAnswer($event) {
    $event.preventDefault();
    const answers = this._form.get('answers') as FormArray;
    const answer = new Answer();
    answer.value = null;
    answer.order = answers.length + 1;
    const config = {};
    for (const key of Object.keys(answer)) {
      config[key] = [answer[key], []];
    }
    const group = this.fb.group(config);
    answers.push(group);
    this.refreshAnswersList(answers);
  }

  deleteAnswer($event, element, index): void {
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
          // const index = this.currentElement.answers.indexOf(element);
          const comps = this._form.get('answers') as FormArray;
          comps.removeAt(index);
          this.refreshAnswersList();
        }
      });

  }

  moveAnswer(element: FormGroup, step: number = 1) {
    const answers = this._form.get('answers') as FormArray;
    const index = answers.controls.indexOf(element);
    const swap = answers.controls[index + step];
    const tmp = swap['controls']['order'].value;
    swap['controls']['order'].setValue(element.controls['order'].value);
    element.controls['order'].setValue(tmp);
    this.refreshAnswersList(answers);
    return false;
  }

  openEffects($event, element, mode: string = CRUDMode.EDIT, config_ovveride?) {
    $event.preventDefault()
    const dialogRef = this.dialog.open(SideEffectsDialogComponent, {
      width: '80%',
      height: '70%',
      data: {
        currentElement: element.value,
        mode,
        service: this.effectService,
      },
      ...config_ovveride
    });
    return dialogRef;
  }

  openConditions($event, element, mode: string = CRUDMode.EDIT, config_ovveride?) {
    $event.preventDefault()
    const dialogRef = this.dialog.open(SideEffectsDialogComponent, {
      width: '80%',
      height: '70%',
      data: {
        currentElement: element.value,
        mode,
        service: this.effectService,
      },
      ...config_ovveride
    });
    return dialogRef;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private isFreeQuestion(type: string): boolean {
    const free_question = ['FreeText', 'FreeNumber'];
    return free_question.indexOf(type) > -1;
  }

  public isQuestionType(type: string): boolean {
    const ctrl = this._form.get('type');
    if (ctrl) {
      return ctrl.value === type;
    }
    return true;
  }


  onQuestionTypeChange($event): void {
    // Issue an alert if i change the type from a multi answer to a freetext
    if (this.last_question_type !== undefined && this.isFreeQuestion($event.value) && !this.isFreeQuestion(this.last_question_type)) {

      const message = 'TKLAB.QUESTION_TYPE_ALERT';
      const manualRef = this.dialog.open(DialogconfirmComponent, {
        width: '30%',
        data: message
      });
      manualRef
        .afterClosed()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(result => {
          if (result) {
            this.last_question_type = $event.value;
            const answer = new Answer();
            answer.question_id = this.currentElement.id;
            answer.value = null;
            answer.order = 0;
            this._form.patchValue({answers: [answer]});
            const config = {};
            for (const key of Object.keys(answer)) {
              config[key] = [answer[key], []];
            }
            const group = this.fb.group(config);
            this.refreshAnswersList(new FormArray([group]));

          } else {
            this._form.patchValue({type: this.last_question_type});
          }
        });
    } else {
      this.last_question_type = $event.value;
    }
  }
}
