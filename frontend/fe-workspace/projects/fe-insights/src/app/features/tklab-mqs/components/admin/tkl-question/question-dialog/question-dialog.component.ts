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
import {TklabMqsService} from "../../../../../../../../../fe-common/src/lib/services/tklab.mqs.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";


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
  public privacyOptions: any = [
    {id: 'all', label : 'ALL' } ,
    {id: 'only_manager', label : 'Only_Manager' } ,
    {id: 'only_coach', label : 'Only_Coach' } ,
    {id: 'only_user', label : 'Only_User' } ,
    {id: 'inherit', label : 'Inherit' } ,
  ];

  public questionTypes: any = [
    {id: 'singleRadio', label : 'singleRadio' } ,
    {id: 'singleCheck', label : 'singleCheck' } ,
    {id: 'FreeText', label : 'FreeText' } ,
  ];
  public answersDataSource = new BehaviorSubject<AbstractControl[]>([]);
  public answersDisplayedColumns = ['order', 'value', 'side_effects', 'actions'];
  public last_question_type: any = null;
  public Editor = ClassicEditor;

  minutesSelect = [];
  secondsSelect = [];
  visibleTimeOption: boolean =  false;


  constructor(public dialogRef: MatDialogRef<QuestionDialogComponent>,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private store: Store,
              public translate: TranslateService,
              private snackBar: MatSnackBar,
              private effectService: AnswerSideEffectService,
              private tklabMqsService: TklabMqsService,
              @Inject(MAT_DIALOG_DATA) public config: Config) {

                for (let i = 0; i <= 59; i++){
                  this.minutesSelect.push(i);
                  this.secondsSelect.push(i) ;
                }
                this._form = this.fb.group({
                  id: [null],
                  question: [null, [Validators.required]],
                  subtitle: [null, []],
                  category: [null],
                  code: [null, [Validators.required]],
                  mandatory: [null, []],
                  question_timer_status: [null, []],
                  content: [null, []],
                  minutes: [null, []],
                  seconds: ['', []],
                  privacy: [null, ],
                  type: [null],
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
    // this.currentElement = this.config.currentElement;
    if (this.config?.currentElement?.id) {
      this.loadQuestion(this.config.currentElement);
    } else {
      this.currentElement = this.config.currentElement;
    }
  }

  loadQuestion(result): void {
    //this.tklabMqsService.loadQuestionByID({id: this.config.currentElement.id}).then((data: any) => {
      this.currentElement = result;
      // this.currentElement = this.config.currentElement
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
      this._form.patchValue(this.currentElement);
    //});
  }

  refreshAnswersList(answers: FormArray = null): void {
    if (answers === null) {
      answers = this._form.get('answers') as FormArray;
    }
    answers.controls.sort((a, b) => a['controls']['order'].value - b['controls']['order'].value);
    this.answersDataSource.next(answers.controls);
  }

  async submit($event): Promise<void> {

    $event.preventDefault();
    if (!this._form.valid) {
      return;
    }
    const rec = this._form.getRawValue();
    let res: any = await this.tklabMqsService.saveAppQuestion(this._form.value);
    if(res.result) {
      this.dialogRef.close(true);
    } else {
      this.snackBar.open(this.translate.instant('TKLAB.' + res.reason), this.translate.instant('GENERAL.OK'), {duration: 3000});
    }
    //this.dialogRef.close(true);
  }

  async delete(do_delete: boolean): Promise<void> {
    if (do_delete) {
      let res: any = await this.tklabMqsService.deleteAppQuestion(this._form.value);
      if(res.result) {
         this.dialogRef.close(true);
      } else {
        this.dialogRef.close(false);
        this.snackBar.open(this.translate.instant('TKLAB.' + res.reason), this.translate.instant('GENERAL.OK'), {duration: 3000});
      }
    } else {
      this.dialogRef.close(false);
    }
  }


  // Answers
  async addAnswer($event): Promise<void> {
    if (!this._form.value.question) {
      this.snackBar.open(this.translate.instant('Please insert question'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    } else {
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
      const resData: any = await this.tklabMqsService.saveAppQuestion(this._form.value);
      if(!resData.result) {
        this.snackBar.open(this.translate.instant('TKLAB.' + resData.reason), this.translate.instant('GENERAL.OK'), {duration: 3000});
      }
      this.loadQuestion(resData.result);
    }
  }

  questionTimerChange(event){
    // this._form.patchValue({
    //   minutes: null,
    //   seconds: null,
    // });
    if (event.checked){
      this.visibleTimeOption = true;
      this._form.patchValue({minutes:1})
      this._form.patchValue({seconds:0})
    }else {
      this.visibleTimeOption = false;
      this._form.patchValue({minutes:null})
      this._form.patchValue({seconds:null})
    }
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
    $event.preventDefault();
    const dialogRef = this.dialog.open(SideEffectsDialogComponent, {
      width: '80%',
      height: '70%',
      data: {
        currentElement: element.value,
        question: this.currentElement.id,
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
