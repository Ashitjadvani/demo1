import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TklabMqsService} from "../../../../../fe-common-v2/src/lib/services/tklab.mqs.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CRUDMode} from "../../../../../fe-insights/src/app/features/tklab-mqs/store/models";
class Config {
  currentElement: {
    id: null,
    survey: null,
    order: null,
    question: null,
    conditions: []
  };
  mode: CRUDMode;
  // service: EntityCollectionServiceBase<any>;
  service: any;
}
@Component({
  selector: 'app-add-edit-survey-questions-popup',
  templateUrl: './add-edit-survey-questions-popup.component.html',
  styleUrls: ['./add-edit-survey-questions-popup.component.scss']
})
export class AddEditSurveyQuestionsPopupComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public surveyQuestionForm: FormGroup;
  surveyId : any;
  orderList : [];
  metricsData = [];
  surveyQuizData: any = [];
  questionsData: any = [];
  id : any;
  editMode : boolean = false;
  noEditMode : boolean = true;
  editable : boolean = false;
  public currentElement;
  public bankFilterCtrl: FormControl = new FormControl();
  public codeFilterCtrl: FormControl = new FormControl();
  public conditionDataSource$ = new BehaviorSubject<AbstractControl[]>([]);

  constructor(
    public dialogRef: MatDialogRef<AddEditSurveyQuestionsPopupComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tklabMqsService: TklabMqsService,
    private activitedRoute : ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public config: Config
  ) {
    this.surveyId =  data.surveyId;
    this.id = data.id;
    this.surveyQuizData = data.surveyQuizData;
    if (data.mode == 'View'){
      this.editable =  true
    }
    if (data.mode == 'Edit' || data.mode == 'View'){
      this.editMode = true;
      this.noEditMode = false;
      this.surveyQuestionForm = this.formBuilder.group({
        id: [this.id, []],
        survey: [this.surveyId, []],
        order: [null, [Validators.required]],
        code: [null, [Validators.required]],
        question: [null, [Validators.required]],
        conditions: this.formBuilder.array([])
      });
    }else {
      this.editMode = false;
      this.noEditMode = true;
      this.surveyQuestionForm = this.formBuilder.group({
        id: [null, []],
        survey: [null, []],
        order: [null, [Validators.required]],
        code: [null, [Validators.required]],
        question: [null, [Validators.required]],
        conditions: this.formBuilder.array([])
      });
    }

    // listen for search field value changes
    this.bankFilterCtrl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
        this.filterBanks();
    });

    // listen for search field value changes
    this.codeFilterCtrl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.filterCodes();
    });
  }

  async ngOnInit() {
    await this.tklabMqsService.loadAppMetric().then( (data: any) => {
      this.metricsData = data.result;
    });
    await this.tklabMqsService.loadOrderNumber({survey: this.surveyId}).then((data: any) => {
      this.orderList = data.result;
    });
    const res: any = await this.tklabMqsService.loadAppQuestion();
    this.questionsData = res.result;
    this.filteredBanks.next(this.questionsData.slice());
    if (this.id != '' && this.id != undefined){
      this.setCurrentElement(this.config.currentElement);
      this.filterBanks();
    }

  }

  public filteredBanks: ReplaySubject<any> = new ReplaySubject<any>(1);

  protected filterBanks(): void {
    if (!this.questionsData) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.questionsData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.questionsData.filter(bank => bank.question && bank.question.toLowerCase().indexOf(search) > -1)
    );
  }

  setCurrentElement(element) {
    this.currentElement = element;
    //this.surveyQuestionForm.patchValue(this.currentElement);
    this.surveyQuestionForm.patchValue({
      order : this.currentElement.order,
      code : this.currentElement.code,
      question : this.currentElement.question,
    });
    if (!this.currentElement.id) {
      this.tklabMqsService.loadOrderNumber({survey: this.currentElement.survey}).then((data: any) => {
        this.orderList = data.result;
      });
    }
    const conditions = this.surveyQuestionForm.get('conditions') as FormArray;
    while (conditions.controls.length > 0) {
      conditions.removeAt(0);
    }
    if (this.currentElement.conditions) {
      for (const cond of this.currentElement.conditions) {
        const config = {};
        for (const key of Object.keys(cond)) {
          config[key] = [cond[key], []];
        }
        const group = this.formBuilder.group(config);
        conditions.push(group);
      }
      this.refreshConditionList(conditions);
    }
    // this.tbComponenti.renderRows()
  }

  refreshConditionList(conditions: FormArray = null) {
    if (conditions === null) {
      conditions = this.surveyQuestionForm.get('conditions') as FormArray;
    }
    this.conditionDataSource$.next(conditions.controls);
  }
  changeCodeQuestion(event): void {
      this.surveyQuestionForm.patchValue({
        code: event.value,
        question: event.value,
        survey : this.surveyId
      });
  }

  protected filterCodes(): void {
    if (!this.questionsData) {
      return;
    }
    // get the search keyword
    let search = this.codeFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.questionsData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.questionsData.filter(bank => bank.code && bank.code.toLowerCase().indexOf(search) > -1)
    );
  }

  onSubmit(): void {

  }

  onClick(result):void{
    this.dialogRef.close(result);
  }

  async submitSurveyQuestion() {
    if (this.surveyQuestionForm.status == "VALID"){
      this.tklabMqsService.saveAppQuizQuestion(this.surveyQuestionForm.value).then((data: any) => {
        this.metricsData = data.result;
      });
    }
  }

}
