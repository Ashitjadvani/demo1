import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {PeopleManagementService} from '../../../../../../../fe-common-v2/src/lib/services/people-management.service';
import {MCPHelperService} from '../../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {QuizSurveyService} from '../../../../../../../fe-common-v2/src/lib/services/quiz-survey.service';
import { MatOption } from '@angular/material/core';
import {DeletePopupComponent} from '../../../../popup/delete-popup/delete-popup.component';
import {TklabMqsService} from '../../../../../../../fe-common-v2/src/lib/services/tklab.mqs.service';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from "rxjs";
import {MatStepper} from "@angular/material/stepper";
import {AddEditSurveyQuestionsPopupComponent} from "../../../../popup/add-edit-survey-questions-popup/add-edit-survey-questions-popup.component";
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {AddEditFitIndexPopupComponent} from "../../../../popup/add-edit-fit-index-popup/add-edit-fit-index-popup.component";
import {CRUDMode} from "../../../../../../../fe-insights/src/app/features/tklab-mqs/store/models";
import {QueryParams} from "@ngrx/data";
import {promise} from "protractor";
import {debounceTime} from "rxjs/operators";


export const PICK_FORMATS = {
  parse: {
    parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'D MMM YYYY',
  }
};
@Component({
  selector: 'app-add-edited-survey',
  templateUrl: './add-edited-survey.component.html',
  styleUrls: ['./add-edited-survey.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'it'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
  ],
})
export class AddEditedSurveyComponent implements OnInit {
  @ViewChild('surveyDetailsStep') mySurveyDetailsStep: MatStepper;
  private subject: Subject<string> = new Subject();
  addSurveyForm: FormGroup;
  title = 'Add';
  document: any;
  documentData: any;
  documentName: any;
  editMode = 'Add';
  button = 'Save';
  documentInput: any;
  fileToUpload: any;
  fileCoverImage: any;
  id: any;
  surveyDetails: any;
  metricsData: any[] = [];
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '-1';
  sortBy = null;
  sortClass: any = 'down';
  tabStepValue: any = "";
  noClickClass: any = 'event-none';

  public questions: any = [];
  questionsColumns: string[] = ['wheelAction','order', 'code', 'question'];

  survey_id = this.activitedRoute.snapshot.paramMap.get('id');
  public requestPara = {survey_id: this.activitedRoute.snapshot.paramMap.get('id'), search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  fitIndexDisplayedColumns: string[] = ['wheelAction','metric', 'operator', 'value', 'textResult', 'scalarResult'];

  peopleScopeList = [
    {id: 'procurement', label: 'Quiz/Survey.Procurement'},
    {id: 'recruitmentquiz', label: 'Quiz/Survey.RecruitmentQuiz'},
    {id: 'recruitmentcustomfields', label: 'Quiz/Survey.RecruitmentCustomFields'},
  ];
  privacyList = [
    {value: 'only_manager', viewValue: 'Only Manager'},
    {value: 'only_coach', viewValue: 'Only Coach'},
    {value: 'only_user', viewValue: 'Only User'},
    {value: 'inherit', viewValue: 'Inherit'},
  ];
  @ViewChild('allSelected') private allSelected: MatOption;

  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;

  constructor(
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private ApiService: QuizSurveyService,
    private activitedRoute: ActivatedRoute,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private _adapter: DateAdapter<any>,
    private tklabMqsService: TklabMqsService,
    ) {
    // this.router.events.subscribe((val) => {
    //   this.survey_id = this.activitedRoute.snapshot.paramMap.get('id');
    // });
    this._setSearchSubscription()
    this.addSurveyForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      // titleItalian: ['', Validators.required],
      subTitle: [''],
      // subtitleItalian: [''],
      // category: [''],
      scope: [''],
      disclaimer: [''],
      onCompletion: [''],
      question_limit: [''],
      random_sequence: [false],
      start: [''],
      end: [''],
      privacy: [''],
      instruction: [''],
    });
  }

  onFileChanged(input: HTMLInputElement): void {
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;
      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }
      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    // @ts-ignore
    const file = input.files[0];
    this.fileToUpload = input.files[0];
    this.documentInput = file;
    this.documentName = `${file.name} (${formatBytes(file.size)})`;
  }

  resetCoverValue(): void {
    this.documentInput = null;
    this.documentName = null;
    // this.addSurveyForm.patchValue({
    //   logoID: null
    // });
  }

  async ngOnInit(): Promise<void> {
    this.getdetails();
    this.getFitIndexList(this.requestPara);
  }

  async getFitIndexList(request): Promise<void>{
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    
    if (this.activitedRoute.snapshot.paramMap.get('id') != '0'){
      this.requestPara.survey_id = this.activitedRoute.snapshot.paramMap.get('id');
    }
    const metricList: any = await this.tklabMqsService.loadAppQuizMetricList(this.requestPara);
    //const metricList: any = await this.tklabMqsService.loadlistBySurvey({survey_id: this.activitedRoute.snapshot.paramMap.get('id'), search: '', page: 1, limit: 10, sortBy: '', sortKey: ''});
    const metricListData: any = await this.tklabMqsService.loadlistBySurvey(this.requestPara);
    // console.log('metricList',metricList);
    this.totalItems = metricListData.meta.totalCount;
    this.metricsData = metricListData.result;
    this.helper.toggleLoaderVisibility(false);
  }
  async getdetails(): Promise<void> {
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.id = id;
    if (this.id !== '0'){
      this.title = 'Edit';
      this.noClickClass = '';
      this.helper.toggleLoaderVisibility(true);
      const res: any = await this.ApiService.viewSurvey({surveyId: id});
      if (res.result === true) {
        this.surveyDetails = res.data[0];
        this.addSurveyForm.patchValue({
          id: this.id,
          title: this.surveyDetails.title,
          subTitle: this.surveyDetails.subTitle,
          scope: this.surveyDetails.scope,
          disclaimer: this.surveyDetails.disclaimer,
          onCompletion: this.surveyDetails.onCompletion,
          question_limit: this.surveyDetails.question_limit,
          random_sequence: this.surveyDetails.random_sequence,
          start:  this.surveyDetails.start,
          end:  this.surveyDetails.end,
          privacy:  this.surveyDetails.privacy,
          instruction:  this.surveyDetails.instruction
        });
        this.helper.toggleLoaderVisibility(false);
      }else {
        this.helper.toggleLoaderVisibility(false);
        // const e = err.error;
        swal.fire(
          '',
          // err.error.message,
          this.translate.instant(res.reason),
          'info'
        );
      }
    }
    this.helper.toggleLoaderVisibility(false);
  }
  tosslePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.addSurveyForm.controls.privacy.value.length == this.privacyList.length) {
      this.allSelected.select();
    }
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.addSurveyForm.controls.privacy.patchValue([
        ...this.privacyList.map((item) => item.value),
        'all',
      ]);
    } else {
      this.addSurveyForm.controls.privacy.patchValue([]);
    }
  }
  onStepChange(event: any): void {

  }
  async addEditSurveyDetails(): Promise<void>{
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    if (this.addSurveyForm.valid && this.id == '0') {
      this.saveSurvey();
    }else if (this.addSurveyForm.valid && this.id != '0' && this.id != undefined) {
      this.addSurveyForm.value.id = this.activitedRoute.snapshot.paramMap.get('id');
      this.saveSurvey();
    }
  }

  tabChangeFunc(event){
    this.tabStepValue = "tabNext";
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    if (this.addSurveyForm.valid && this.id == '0') {
      this.addEditSurveyDetails();
    }
    this.getQuestionList();
  }
  noTabChangeFunc(){
    this.tabStepValue = "";
  }

  async fullSurveySave(): Promise<void>{
    await this.addEditSurveyDetails();
    this.router.navigate(['/quiz-survey/survey']);
  }

  async saveSurvey(): Promise<void>{
    this.helper.toggleLoaderVisibility(true);
    this.documentData = new FormData();
    const getInputsValues = this.addSurveyForm.value;
    for (const key in getInputsValues) {
      this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
    }
    this.documentData.append('document', this.document);
    const res: any = await this.ApiService.addSurvey(this.addSurveyForm.value);
    if (res){
      this.helper.toggleLoaderVisibility(false);
      if (this.addSurveyForm.valid && this.id == '0') {
        this.router.navigate(['/quiz-survey/survey/add-edit-survey/' + res.data.id]);
        this.noClickClass = '';
        swal.fire(
          '',
          this.translate.instant('Swal_Message.Survey added successfully'),
          'success'
        );
      }
      if (this.addSurveyForm.valid && this.id != '0' && this.id != undefined) {
        swal.fire(
          '',
          this.translate.instant('Swal_Message.Survey edited successfully'),
          'success'
        );
      }
      if (this.title == 'Add'){
        swal.fire(
          '',
          this.translate.instant('Swal_Message.Survey added successfully'),
          'success'
        );
      }
      if (this.tabStepValue != "tabNext" ){
        this.mySurveyDetailsStep.next();
      }
      this.getQuestionList();
    }else {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(res.reason),
        'info'
      );
    }
  }



  async getQuestionList(): Promise<void>{
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    const questionList: any = await this.tklabMqsService.loadAppQuizQuestion({id : id});
    this.questions = questionList.result;
    this.helper.toggleLoaderVisibility(false);
  }

  editFitIndex(data){
    //this.router.navigate(['/quiz-survey/survey/view-survey/' + this.id  + '/add-edit-fit-index/' + fitIndexId]);
    const dialogRef = this.dialog.open(AddEditFitIndexPopupComponent, {
      data: {
        heading: 'Quiz/Survey.EditFit-Index',
        surveyId : this.survey_id,
        mode : 'Edit',
        metric_data: data,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.helper.toggleLoaderVisibility(true);
        this.getFitIndexList(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant('Fit-Index has been edited successfully'),
          'success'
        );
      }
    });
  }
  onKeyUp(searchTextValue: any): void {
    this.subject.next(searchTextValue);
  }

  resetSearch(){
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.getFitIndexList(this.requestPara = {
      survey_id: this.activitedRoute.snapshot.paramMap.get('id'),
      page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortKey,
      sortKey: this.sortBy});
  }
  private _setSearchSubscription(): void {
    this.subject.pipe(debounceTime(500)).subscribe((searchValue: string) => {
      this.page = 1;
      this.getFitIndexList(this.requestPara = {
        survey_id: this.activitedRoute.snapshot.paramMap.get('id'),
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortKey,
        sortKey: this.sortBy
      });
    });
  }

  // Pagination
  changeItemsPerPage(): void {
    this.search = '';
    this.getFitIndexList(this.requestPara = {
      survey_id: this.activitedRoute.snapshot.paramMap.get('id'),
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortKey,
      sortKey: this.sortBy
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page: number): void {
    this.search = '';
    this.page = page;
    this.getFitIndexList(this.requestPara = {
      survey_id: this.activitedRoute.snapshot.paramMap.get('id'),
      page: this.page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortKey,
      sortKey: this.sortBy,
    });
    this.page = page;
  }

  // Sorting
  changeSorting(sortBy, sortKey): void {
    this.sortBy = sortBy;
    this.sortKey = (sortKey === '-1') ? '1' : '-1';
    this.getFitIndexList(this.requestPara = {
      survey_id: this.activitedRoute.snapshot.paramMap.get('id'),
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortKey,
      sortKey: this.sortBy
    });
  }
  async fitIndexDeleteDialog(metricId): Promise<void>{
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this Fit-Index?', heading: 'Delete Fit-Index'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result){
          this.helper.toggleLoaderVisibility(true);
          this.tklabMqsService.deleteAppSurveyMetric({id: metricId});
          this.getFitIndexList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant('Fit index has been deleted successfully'),
            'success'
          );
          this.helper.toggleLoaderVisibility(false);
        }
      }
    );
  }

  addQuestionPopup():void{
    this.survey_id = this.activitedRoute.snapshot.paramMap.get('id');
    const dialogRef = this.dialog.open(AddEditSurveyQuestionsPopupComponent, {
      data: {
        heading: 'Quiz/Survey.Add Question',
        surveyId : this.survey_id
      }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result){
          this.helper.toggleLoaderVisibility(true);
          this.getQuestionList();
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant('Question has been added successfully'),
            'success'
          );
        }
      }
    );
  }

  viewSurveyQuestion(element): void {
  }

  async editSurveyQuestion(data, index : any, mode): Promise<void>{
    const dialogRef = this.dialog.open(AddEditSurveyQuestionsPopupComponent, {
      data: {
        heading: 'Quiz/Survey.Edit Question',
        surveyId : this.survey_id,
        id : data.id,
        surveyQuizData : this.questions[index],
        currentElement: data,
        mode : mode
      }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result){
          this.helper.toggleLoaderVisibility(true);
          this.getQuestionList();
          this.getSurveyQuestion();
          this.helper.toggleLoaderVisibility(false);
          if (mode == 'Edit'){
            swal.fire(
              '',
              this.translate.instant('Question has been edited successfully'),
              'success'
            );
          }else {
            swal.fire(
              '',
              this.translate.instant('Question has been added successfully'),
              'success'
            );
          }
        }
      }
    );
  }

  async getSurveyQuestion($event?) {
    if (this.id) {
      const params: QueryParams = {
        survey_id: this.activitedRoute.snapshot.paramMap.get('id'),
      };
      let res: any = await this.tklabMqsService.loadAppQuizQuestion({
        id: this.activitedRoute.snapshot.paramMap.get('id'),
      });
      this.questions = res.result;
    }
  }
  deleteSurveyQuestion(id: any): void {
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this Question', heading: 'Delete Question'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.helper.toggleLoaderVisibility(true);
        that.tklabMqsService.deleteAppQuizQuestion({id : id}).then((data: any) => {
          swal.fire(
            '',
            this.translate.instant("Swal_Message.Question deleted successfully"),
            'success'
          );
          this.getQuestionList();
          this.helper.toggleLoaderVisibility(false);
        }, (err) => {
          this.helper.toggleLoaderVisibility(false);
          const e = err.error;
          swal.fire(
            '',
            this.translate.instant(err.error.message),
            'info'
          );
        });
      }
    });
  }

  addFitIndexPopup():void{
    const that = this;
    const dialogRef = this.dialog.open(AddEditFitIndexPopupComponent, {
      data: {
        heading: 'Quiz/Survey.AddFit-Index',
        surveyId : this.survey_id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result == true){
        this.helper.toggleLoaderVisibility(true);
        this.getFitIndexList(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant('Fit-Index has been added successfully'),
          'success'
        );
      }
    });
  }

  streamOpened(){
    if (localStorage.getItem('currentLanguage') == 'it'){
      this._adapter.setLocale('it-IT');
    }else {
      this._adapter.setLocale('eg-EG');
    }
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}
