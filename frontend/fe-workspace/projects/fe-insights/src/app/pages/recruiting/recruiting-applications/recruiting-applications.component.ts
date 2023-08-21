import { Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import {CRUDMode, JobApplication, JobOpening} from '../../../../../../fe-common/src/lib/models/recruiting/models';
import {MatTabGroup} from '@angular/material/tabs';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Action} from '../../../components/table-data-view/table-data-view.component';
import {TranslateService} from '@ngx-translate/core';
import {QueryParams} from '@ngrx/data';
import {Store} from '@ngrx/store';
import {IState} from '../../../store/irina.reducer';
import {skipWhile, takeUntil} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../../../../fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnTemplate} from '../../../features/shared/components/models';
import {loadJobApplicationDetailSuccess} from '../../../features/recruiting/store/actions';
import {RecruitingApplicationManagementService} from 'fe-common/services/recruiting-application-management.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FiltersDialogMqsComponent} from '../components/filtering/filters-dialog/filters-dialog.component';
import {UserCapabilityService} from '../../../services/user-capability.service';
import {Configurations} from 'fe-common/configurations';
import {CommonService} from 'fe-common/services/common.service';
import * as FileSaver from 'file-saver';
import {RecruitingManagementService} from 'fe-common/services/recruiting-management.service';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import {UserManagementService} from "fe-common/services/user-management.service";
import { CareerHelperService } from 'projects/fe-career/src/app/service/careerHelper.service';
import {TklabMqsService} from "fe-common/services/tklab.mqs.service";
import {ActivityLogPopupComponent} from "../recruiting-openings/activity-log-popup/activity-log-popup.component";
import {DownloadPreviewDialogComponent} from "./download-preview-dialog/download-preview-dialog.component";



@Component({
  selector: 'app-recruiting-applications',
  templateUrl: './recruiting-applications.component.html',
  styleUrls: ['./recruiting-applications.component.scss']
})

export class RecruitingApplicationsComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public choices$: Observable<any>;
  public choices: any = {};
  public showDetail = false;
  public titleCard: string;
  public filterUnread:string;
  showUnreadApp = false;

  public currentOpening$: Observable<JobOpening>;
  public currentOpening: JobOpening;
  applicationTableData: any = [];
  applicationStatusTableData: any = [];
  current_element: any = {};
  jobId: any = null;
  applicationStatus: any = null;
  currentElement: any = {
    history : []
  };
  currentElementHistory: any = [];
  currentElementMetric: any = [];
  queryParams: QueryParams = {};
  filteredValueTxt: any;
  currentPerson: any = {};
  baseImageUrl: any;
  config: Configurations;
  momentTime: any = new Date().getTime();
  public frmCandidate: FormGroup;
  levelEducation = [
    {id: 'not-graduated', name: 'Not Graduated'},
    {id: 'graduated', name: 'Graduation'},
    // {id: 'master', name: 'Master'},
    // {id: 'doctorate', name: 'Doctorate'},
  ];
  conditionQuestionList: any = [];
  surveyQuestion: any = [];
  matricsDataSource = [];
  public questions: any = [];
  matricSurveyId : any;
  additionalData : any;
  url: string = '';


  completionDate = [
    {id: '1-week', name: '1 Week'},
    {id: '2-weeks', name: '2 Weeks'},
    {id: '1-month', name: '1 Month'},
    {id: '2-months', name: '2 Months'},
  ];

  @ViewChild(MatTabGroup, {static: false}) tabgroup: MatTabGroup;
  public frmChangeStatus: FormGroup;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  universityListData: any = [];
  genderData: any = [
    { id: 'Male', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Male')},
    { id: 'Female', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Female')},
    { id: 'Other', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Other')},
    { id: 'Not Specified', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.NotSpecified')}
  ];

  ageFilter: any = [
    { id: 'min', value: this.translate.instant('GENERAL.MIN_AGE')},
    { id: 'max', value: this.translate.instant('GENERAL.MAX_AGE')}
  ];
  jobTypeFilter: any = [
    { id: 'Open Positions', value: this.translate.instant('EXTRA_WORD.Open_Positions')},
    { id: 'Spontaneous Applications', value: this.translate.instant('EXTRA_WORD.Spontaneous_Applications')}
  ];
  isAdminUser = false;
  jobApplicationId: any;

    constructor(
      @Inject(DOCUMENT) private document: Document,
      @Inject(Configurations) config: Configurations,
      private fb: FormBuilder,
      private store: Store<IState>,
      private translate: TranslateService,
      private dialog: MatDialog,
      private route: ActivatedRoute,
      private router: Router,
      public activatedRoute: ActivatedRoute,
      private snackBar: MatSnackBar,
      private userCapabilityService: UserCapabilityService,
      private commonService: CommonService,
      private recruitingManagementApplicationService: RecruitingApplicationManagementService,
      private userManagementService: UserManagementService,
      private recruitingManagementService: RecruitingManagementService,
      private tklabMqsService: TklabMqsService,
    ) {
      const navigation = router.getCurrentNavigation();
      //this.getIDCandidateApp = this.router.getCurrentNavigation().extras.state.id;
      if(this.router.getCurrentNavigation().extras?.state) {
        this.jobApplicationId = this.router.getCurrentNavigation().extras.state.id;
      }
      this.jobId = this.route.snapshot.paramMap.get('id');
      this.config = this.commonService.cloneObject(config);
      this.baseImageUrl = this.config.env.api_host + '/v1/data-storage/download/';
      this.completionDate.map( (b: any) => {
          const [ q, f ] = b.id.split('-');
          b.id = moment().format('YYYY-MM-DD') + ' to ' + moment().subtract(q, f).format('YYYY-MM-DD') ;
          return b;
      });

      this.frmCandidate = this.fb.group({
        id: [null],
        nome: [null],
        cognome: [null],
        email: [null],
        telefono: [null],
        data_nascita: [null],
        azienda: [null],
        titolo: [null],
        sesso: [null],
        indirizzo: [null],
        livello_studi: [null],
        univ: [null],
        laurea: [null],
        voto_laurea: [null],
        cityName: [null],
        countryName: [null],
        stateName: [null],
        nationality: [null],
        age: [null],
        area: [null],
        doctorateDescription: [null],
        materDescription: [null],
        scoreAverage: [null],
        data_completamento: [null],
        stateExamination: [null],
        fitindex: [null],
        isReadMaster: [false],
        isReadState: [false],
        isReadDoctorate: [false],
        degreeYear:[''],
        showUnread:[false]
      });

      const arcadiaLoggedUser = this.userManagementService.getAccount();
      const isRecruitingAll = this.userCapabilityService.isFunctionAvailable('Recruiting/all');
      this.isAdminUser = this.arrayEquals(arcadiaLoggedUser.profile, [ 'System', 'Admin']);

      if (this.isAdminUser || isRecruitingAll) {
        this.tableRowActions.push({
          tooltip: this.translate.instant('GENERAL.Delete'),
          image: null,
          icon: 'delete',
          color: '#FF0000',
          action: 'onDeleteElement', // TODO how to make it conditional?
          context: this
        });
      }
  }

  datePipe: DatePipe = new DatePipe('it-IT');
  tableColumnTemplatesFilter: any = [];
  tableColumnTemplates: ColumnTemplate[] = [
    {
      columnCaption: this.translate.instant('GENERAL.JOBOPENING'),
      columnName: 'Job Opening',
      columnDataField: 'opening.description' ,
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.JOBTYPE'),
      columnName: 'Job Type',
      columnDataField: 'opening.jobOpeningType',
      columnFormatter: null,
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'id',
        label_field: 'value',
        options: () => of(this.jobTypeFilter)
      }
    },
    {
      columnCaption: this.translate.instant('GENERAL.SURNAME'),
      columnName: 'Surname',
      columnDataField: 'person.cognome',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('GENERAL.NAME'),
      columnName: 'Name',
      columnDataField: 'person.nome',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('GENERAL.SESSO'),
      columnName: 'Gender',
      columnDataField: 'person.sesso',
      columnFormatter: null,
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'id',
        label_field: 'value',
        options: () => of(this.genderData)
      }
    },
    {
      columnCaption: this.translate.instant('GENERAL.AGE'),
      columnName: 'Age',
      columnDataField: 'person.age_round',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('GENERAL.MIN_AGE'),
      columnName: 'GENERAL.MIN_AGE',
      columnDataField: 'person.min_age',
      columnFormatter: null,
      context: this,
      isColumnShow: true,
      filterWidget: {
        widget: 'select_age',
        inputField: 'min'
      }
    },
    {
      columnCaption: this.translate.instant('GENERAL.MAX_AGE'),
      columnName: 'GENERAL.MAX_AGE',
      columnDataField: 'person.max_age',
      columnFormatter: null,
      context: this,
      isColumnShow: true,
      filterWidget: {
        widget: 'select_age',
        inputField: 'max'
      }
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.univ'),
      columnName: 'University',
      columnDataField: 'univ.description',
      columnFormatter: null,
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'description',
        label_field: 'description',
        options: () => of(this.universityListData)
      }
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.degree_year'),
      columnName: 'Degree year',
      columnDataField: 'person.degreeYear',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.voto_laurea'),
      columnName: 'Degree mark',
      columnDataField: 'person.voto_laurea',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('GENERAL.MIN_VOTO_LAUREA'),
      columnName: 'Degree mark min',
      columnDataField: 'person.min_voto_laurea',
      columnFormatter: null,
      context: this,
      isColumnShow: true,
      filterWidget: {
        widget: 'select_voto_laurea',
        inputField: 'min'
      }
    },
    {
      columnCaption: this.translate.instant('GENERAL.MAX_VOTO_LAUREA'),
      columnName: 'Degree mark max',
      columnDataField: 'person.max_voto_laurea',
      columnFormatter: null,
      context: this,
      isColumnShow: true,
      filterWidget: {
        widget: 'select_voto_laurea',
        inputField: 'max'
      }
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.scoreAverage'),
      columnName: 'Score Average',
      columnDataField: 'person.scoreAverage',
      columnFormatter: null,
      context: this
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.livello_studi'),
      columnName: 'Study level',
      columnDataField: 'person.livello_studi',
      columnFormatter: null,
      // columnFormatter: 'study_level_formatter',
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'name',
        label_field: 'name',
        options: () => of(this.levelEducation)
      }
    },
    {
      columnCaption: this.translate.instant('JOB_APPLICATION.COMPLETION_DATE'),
      columnName: 'Completion Date',
      columnDataField: 'data_completamento',
      columnFormatter: 'dateColumnFormatter',
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'id',
        label_field: 'name',
        options: () => of(this.completionDate)
      }
    },

    {
      columnCaption: this.translate.instant('JOB_APPLICATION.FIT_INDEX'),
      columnName: 'Fit Index',
      columnDataField: 'fitindex',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('JOB_APPLICATION.STATUS'),
      columnName: 'Status',
      columnDataField: 'status.description',
      columnFormatter: null,
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'description',
        label_field: 'description',
        options: () => of(this.applicationStatusTableData)
      }
    },
    {columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, context: this}
  ];

  tableRowActions: Action[] = [
    {
      tooltip: this.translate.instant('GENERAL.View'),
      image: null,
      icon: 'remove_red_eye',
      color: '#000000',
      dots: true,
      action: 'onViewElement',
      context: this
    },
    {
      tooltip: this.translate.instant('GENERAL.Edit'),
      image: './assets/images/account-edit.svg',
      icon: null,
      color: '#000000',
      action: 'onEditElement',
      context: this
    },
  ];
  tableMainActions: Action[] = [
    {
      tooltip: this.translate.instant('JOB_OPENING.ADD'),
      image: null,
      icon: 'filter_alt',
      color: '#ffffff',
      action: 'onFilterOpening',
      context: this
    },
    {
      tooltip: this.translate.instant('GENERAL.BACK'),
      image: null,
      icon: 'arrow_back',
      color: '#ffffff',
      action: 'onNavBackToChallenges',
      context: this
    },
  ];

  public historyDisplayedColumns = ['updated_at', 'to_state', 'notes', 'by'];
  public displayedMatricsColumns = ['rules', 'textresult', 'scalarresult'];

  public forcedFilters = {};

  QUIZ_DATA_1 = [
    {quiz: "SCORE", result: 15, fitIndex: "Good", fitIndexValue: 6},
    {quiz: "GENERIC", result: 1, fitIndex: "Great", fitIndexValue: 100}
  ];

  public FitIndexDisplayedColumns = ['quiz', 'result', 'fitIndex', 'fitIndexValue'];
  dataSource = this.QUIZ_DATA_1;
  async ngOnInit(): Promise<void> {
    this.document.body.classList.add('application-table');
    await this.loadRecruitingApplication();
    await this.loadRecruitingApplicationStatus();
    await this.getUniversityList();
    if (this.jobApplicationId) {
      this.frmChangeStatus.disable();
      this.loadElementByJobApplicationId();
    }else {
      this.frmChangeStatus = this.fb.group({
        id: [null],
        application_id: [this.current_element.id],
        from_state_id: [null, Validators.required],
        notes: [null, Validators.required]
      });
    }

    /*this.choices$ = this.store.select(selectChoices());
    this.choices$.pipe(takeUntil(this.destroyed$)).subscribe(choices => this.choices = choices);
    this.currentElement$ = this.store.select(selectCurrentJobApplication());
    this.currentElement$.pipe(takeUntil(this.destroyed$), skipWhile(val => !val)).subscribe((element: JobApplication) => {
      this.frmChangeStatus.patchValue(element);
      this.currentElement = element;
    });*/
  }


  // async showUnread(event) {
  //   if (event.checked){
  //     const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId, applicationStatus : 'unread'});
  //     this.applicationTableData = jobsTableData.data;
  //   }else {
  //     const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId, applicationStatus : 'all'});
  //     this.applicationTableData = jobsTableData.data;
  //   }
  // }

  arrayEquals(a, b): any {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  async loadRecruitingApplication() {
    const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId});
    this.applicationTableData = jobsTableData.data;
    if (this.jobApplicationId) {
      let jobAppData = this.applicationTableData.filter( i => this.jobApplicationId == i.id );
      if (jobAppData && jobAppData.length > 0) {
        this.titleCard = this.translate.instant('JOB_APPLICATION.VIEW_DETAIL');
        this.current_element = jobAppData[0];
        this.frmChangeStatus = this.fb.group({
          id: [null],
          application_id: [this.current_element.id],
          from_state_id: [null, Validators.required],
          notes: [null, Validators.required]
        });
      }
    }

    const filterLocal = localStorage.getItem('filterApplication');
    if (filterLocal) {
      this.filterFunction(JSON.parse(filterLocal));
      localStorage.removeItem('filterApplication');
    }
  }

  async loadRecruitingApplicationApplicationStatus(status: string) {
    const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ applicationStatus: status});
    this.applicationTableData = jobsTableData.data.filter( (b) => b.id !== '1' );
    setTimeout(() => {
        this.filteredValueTxt = {...this.queryParams};
      }, 100);
  }

  async loadRecruitingApplicationStatus() {
    const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationStatusList();
    this.applicationStatusTableData = jobsTableData.data.filter( (b) => b.id !== '1' );
  }

  async getUniversityList(){
    this.recruitingManagementService.universityList().then((data: any) => {
      this.universityListData = data.data;
    });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('application-table');
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


  async onViewElement(element: JobApplication) {
    this.loadElement(element, CRUDMode.VIEW);
    let appRead: any = await this.recruitingManagementApplicationService.readApplicationStatus({id: element.id});
    this.userCapabilityService.dashboardRecruitingCount(appRead.data);

    //let getQuizData: any = await this.recruitingManagementApplicationService.getQuestionByJobApplication({id: element.id});
  }

  async onEditElement(element: JobApplication) {
    this.loadElement(element, CRUDMode.EDIT);
  }

  loadElement(element: JobApplication, mode: CRUDMode): void {
    this.showDetail = true;
    this.titleCard = this.translate.instant('JOB_APPLICATION.VIEW_DETAIL');
    this.current_element = element;

    this.currentPerson = this.current_element.person;
    this.current_element.isReadJob = false;
    this.frmCandidate.patchValue({
      id: this.currentPerson.id,
      nome: this.currentPerson.nome,
      cognome: this.currentPerson.cognome,
      email: this.currentPerson.email,
      area: this.current_element.opening.area,
      telefono: this.currentPerson.telefono,
      data_nascita: this.currentPerson.data_nascita,
      azienda: this.currentPerson.azienda,
      titolo: this.currentPerson.titolo,
      sesso: this.currentPerson.sesso,
      indirizzo: this.currentPerson.indirizzo,
      data_completamento: this.dateColumnFormatter(this.current_element.data_completamento),
      fitindex: this.current_element.fitindex,
      livello_studi: this.currentPerson.livello_studi,
      univ: (this.current_element.univ) ? this.current_element.univ.description : null,
      laurea: (this.current_element.laurea) ? this.current_element.laurea.description : null,
      voto_laurea: this.currentPerson.voto_laurea,
      cityName: this.currentPerson.cityName,
      countryName: this.currentPerson.countryName,
      stateName: this.currentPerson.stateName,
      nationality: this.currentPerson.nationality,
      age: this.currentPerson.age_round,
      doctorateDescription: this.currentPerson.doctorateDescription,
      materDescription: this.currentPerson.materDescription,
      stateExamination: this.currentPerson.stateExamination,
      scoreAverage: this.currentPerson.scoreAverage,
      isReadDoctorate: this.currentPerson.isReadDoctorate,
      isReadState: this.currentPerson.isReadState,
      isReadMaster: this.currentPerson.isReadMaster,
      degreeYear:this.currentPerson.degreeYear
    });

    this.frmCandidate.disable();
    if ([CRUDMode.EDIT, CRUDMode.ADD].indexOf(mode) > -1) {
      this.frmChangeStatus.patchValue({
        application_id: this.current_element.id,
        from_state_id: (this.current_element?.status?.id) ? this.current_element.status.id : null,
        notes: null,
      });
      this.frmChangeStatus.enable();
    } else {
      this.frmChangeStatus.disable();
    }
    this.onLoadHistory();
    this.getQuizData();
    this.onLoadSurveyMetric();
    this.getAdditionalDetailsData();
    this.tabgroup.selectedIndex = 1;
  }

  loadElementByJobApplicationId(): void {
    this.showDetail = true;

    this.currentPerson = this.current_element.person;
    this.current_element.isReadJob = false;
    this.frmCandidate.patchValue({
      id: this.currentPerson.id,
      nome: this.currentPerson.nome,
      cognome: this.currentPerson.cognome,
      email: this.currentPerson.email,
      area: this.current_element.opening.area,
      telefono: this.currentPerson.telefono,
      data_nascita: this.currentPerson.data_nascita,
      azienda: this.currentPerson.azienda,
      titolo: this.currentPerson.titolo,
      sesso: this.currentPerson.sesso,
      indirizzo: this.currentPerson.indirizzo,
      data_completamento: this.dateColumnFormatter(this.current_element.data_completamento),
      fitindex: this.current_element.fitindex,
      livello_studi: this.currentPerson.livello_studi,
      univ: (this.current_element.univ) ? this.current_element.univ.description : null,
      laurea: (this.current_element.laurea) ? this.current_element.laurea.description : null,
      voto_laurea: this.currentPerson.voto_laurea,
      cityName: this.currentPerson.cityName,
      countryName: this.currentPerson.countryName,
      stateName: this.currentPerson.stateName,
      nationality: this.currentPerson.nationality,
      age: this.currentPerson.age_round,
      doctorateDescription: this.currentPerson.doctorateDescription,
      materDescription: this.currentPerson.materDescription,
      stateExamination: this.currentPerson.stateExamination,
      scoreAverage: this.currentPerson.scoreAverage,
      isReadDoctorate: this.currentPerson.isReadDoctorate,
      isReadState: this.currentPerson.isReadState,
      isReadMaster: this.currentPerson.isReadMaster,
      degreeYear:this.currentPerson.degreeYear
    });

    this.frmCandidate.disable();


    this.onLoadHistory();
    this.getQuizData();
    this.onLoadSurveyMetric();
    this.getAdditionalDetailsData();
    this.tabgroup.selectedIndex = 1;
  }

  onCancelClick(): void {
    this.tabgroup.selectedIndex = 0;
    this.showDetail = false;
    this.store.dispatch(loadJobApplicationDetailSuccess({payload: {detail: null}}));
  }

  onSubmit($event, formDirective: any): void {
    $event.preventDefault();
    if (!this.frmChangeStatus.valid) {
      return;
    }
    const rec = this.frmChangeStatus.getRawValue();

    this.recruitingManagementApplicationService.saveApplicationHistory(rec).then( (data: any) => {
      if (data.result) {
        this.current_element.status.id = rec.from_state_id;
        const indexNumber = this.findIndexApplication(this.current_element.id);
        this.applicationTableData[indexNumber].status = this.findArrayStatus(rec.from_state_id);
        this.onLoadHistory();
        this.getQuizData();
        this.getAdditionalDetailsData();
        formDirective.resetForm();
        this.frmChangeStatus.reset({
          application_id: this.current_element.id,
          from_state_id: rec.from_state_id,
          notes: null,
        });
      } else {
        this.snackBar.open(data.reason, this.translate.instant('GENERAL.OK'), {duration: 3000});
      }
    });
  }

  findIndexApplication(id): any {
    let indexNumber = null;
    this.applicationTableData.forEach( (a, index) => {
      if (a.id === id) {
        indexNumber = index;
      }
    });
    return indexNumber;
  }

  findArrayStatus(id): any {
    let indexArray = null;
    this.applicationStatusTableData.forEach( (a, index) => {
      if (a.id === id) {
        indexArray = a;
      }
    });
    return indexArray;
  }

  async onLoadHistory() {
    this.recruitingManagementApplicationService.getApplicationHistory({application_id : this.current_element.id}).then( (data: any) => {
      this.currentElementHistory = data.data;
    });
  }

  async getQuizData(){
    this.recruitingManagementApplicationService.getQuestionByJobApplication({applicationId: this.current_element.id, person_id : this.current_element.person_id}).then( (data: any) => {
      this.surveyQuestion = data.data;
      this.conditionQuestionList = [];
      for (let i = 0; i < this.surveyQuestion.length; i++) {
        //if (this.surveyQuestion[i].surveyPrivacy.indexOf('only_user') >= 0) {
          this.conditionQuestionList.push(this.surveyQuestion[i])
        //}
      }
    });
  }

  async getAdditionalDetailsData(){
    this.recruitingManagementApplicationService.getAdditionalDetails({applicationId : this.current_element.id}).then( (data: any) => {
      this.additionalData = data.data;
    });
  }

  findOnlyManager(surveyPrivacy): boolean {
    if (surveyPrivacy && surveyPrivacy.length === 1) {
      return !surveyPrivacy.includes('only_manager');
    } else {
      return true;
    }
  }

  async onLoadSurveyMetric() {
    this.recruitingManagementApplicationService.getApplicationMetric({application_id : this.current_element.id}).then( (data: any) => {
      this.currentElementMetric = data.data;
      const matricData = this.currentElementMetric;
      for (let i = 0; i < matricData.length; i++){
          this.matricSurveyId = matricData[i].survey_id
          this.tklabMqsService.loadAppQuizMetricList({survey_id: matricData[i].survey_id}).then(data => {
            this.matricsDataSource[i] = data.result;
          });
          this.matricsDataSource.push(this.matricsDataSource[i]);
      }
    });
  }

  async onDeleteElement(opening: any) {
    const res = await this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: new ConfirmDialogData(this.translate.instant('JOB_APPLICATION.applicationDelete'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
    }).afterClosed().toPromise();
    if (res) {
      if (res) {
        const resDelete: any = await this.recruitingManagementApplicationService.deleteDocument({id: opening.id});
        if (resDelete.result) {
          this.snackBar.open(this.translate.instant('GENERAL.APPLICATION_DELETED_SUCESSFULLY'), this.translate.instant('GENERAL.OK'), {duration: 3000});
          await this.loadRecruitingApplication();
        } else {
          this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + resDelete.message, this.translate.instant('GENERAL.OK'), {duration: 3000});
        }
      }
    }
  }

  dateColumnFormatter(fieldValue: any): string {
    try {
      if (fieldValue) {
        return this.datePipe.transform(new Date(fieldValue), 'dd/MM/yyyy');
      } else {
        return '';
      }
    } catch (ex) {
    }

    return '#NA';
  }

  study_level_formatter(fieldValue: any): string {
    /*const decoded = this.choices.livello_studi?.filter(item => item.id == fieldValue);
    if (decoded.length > 0) {
      return decoded[0].label;
    }*/
    return '';
  }

  downloadCv(): void {
    this.userCapabilityService.toggleLoaderVisibility(true);
    this.recruitingManagementApplicationService.downloadDocument(this.currentPerson.resumeId).subscribe((res: any) => {
      this.userCapabilityService.toggleLoaderVisibility(false);
      const blob = new Blob([res], { type: 'application/pdf' });
      this.url = window.URL.createObjectURL(blob);
      this.dialog.open(DownloadPreviewDialogComponent, {
        width: "100%",
        data: {
          url: this.url,
          resumeId: this.currentPerson.resumeId,
          fileName: this.currentPerson.nome
        },
      });
    }, error => {
      this.userCapabilityService.toggleLoaderVisibility(false);
      this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.NOT FOUND'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    });

    // Download pdf code
    // this.userCapabilityService.toggleLoaderVisibility(true);
    // this.recruitingManagementApplicationService.downloadDocument(this.currentPerson.resumeId).subscribe((res: any) => {
    //   this.userCapabilityService.toggleLoaderVisibility(false);
    //   const blob = new Blob([res], { type: 'application/pdf' });
    //   FileSaver.saveAs(blob, this.currentPerson.nome + '-cv-' + this.momentTime + '.pdf');
    // }, error => {
    //   this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.NOT FOUND'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    //   this.userCapabilityService.toggleLoaderVisibility(false);
    // });
  }

  onNavBackToChallenges() {
    this.router.navigate(['insights', 'main', 'recruiting-mqs']);
  }

  parseApplicant(app: JobApplication): string {
    if (app.person !== undefined) {
      return `${app.person?.nome} ${app.person?.cognome}`;
    } else {
      return '-';
    }
  }

  isStatusEnabled(status: any): boolean {
    const matrix = this.historyStatus(this.current_element.status.id);
    if (matrix) {
      return matrix.indexOf(status.id) > -1;
    }
    return false;
  }

  historyStatus(status): any {
    let matrix = [];
    switch (status) {
      case '1':
        matrix = [];
        break;
      case '2':
        matrix = ['2', '3', '8'];
        break;
      case '3':
        matrix = ['3', '4'];
        break;
      case '4':
        matrix = ['5', '6', '7', '8'];
        break;
      case '5':
        matrix = ['6', '7', '8'];
        break;
      case '6':
        matrix = ['7'];
        break;
      case '7':
        matrix = ['7'];
        break;
      case '8':
        matrix = ['8'];
        break;
    }
    return matrix;
  }

  onFilterOpening(element: JobOpening){
    const config = new MatDialogConfig();
    config.width = '30%';
    config.data = {
      filters: this.filters
    };
    const dialogRef = this.dialog.open(FiltersDialogMqsComponent, config);
    dialogRef.afterClosed()
      .pipe(skipWhile(res => !res), takeUntil(this.destroyed$))
      .subscribe(filters => {
        if (CareerHelperService?.filterApplicationStatus &&  this.filterUnread != CareerHelperService.filterApplicationStatus && CareerHelperService.filterApplicationStatus === 'unread') {
          this.filterUnread = CareerHelperService.filterApplicationStatus;
          this.loadRecruitingApplicationApplicationStatus(CareerHelperService.filterApplicationStatus);
          //this.filterFunction(filters);
        }
        this.filterFunction(filters);
      });
  }



  // unReadApp(){
  //   if(CareerHelperService.filterApplicationStatus ===  'unread'){
  //     this.showUnreadApp = true;
  //   }else{
  //     this.showUnreadApp = false;
  //   }
  // }
  // async showUnread(showUnreadApp) {
  //   if (showUnreadApp.checked){
  //     CareerHelperService.filterApplicationStatus =  'unread'
  //     const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId, applicationStatus : 'unread'});
  //     this.applicationTableData = jobsTableData.data;

  //     this.showUnreadApp = true
  //   }else {
  //     CareerHelperService.filterApplicationStatus =  'all'
  //    const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId, applicationStatus : 'all'});
  //     this.applicationTableData = jobsTableData.data;
  //     this.showUnreadApp = false
  //   }
  // }



  filterFunction(filters): void {
    if (CareerHelperService?.filterApplicationStatus &&  this.filterUnread != CareerHelperService.filterApplicationStatus) {
      this.filterUnread = CareerHelperService.filterApplicationStatus;
      this.loadRecruitingApplicationApplicationStatus(CareerHelperService.filterApplicationStatus)
    }
    this.tableColumnTemplates = this.tableColumnTemplates.map(col => {
      if (Object.keys(filters).indexOf(col.columnDataField) > -1) {
        return {
          ...col,
          filterValue: filters[col.columnDataField]
        };
      }
      else {
        return col;
      }
    });
    this.queryParams = {
      ...filters

    };

    if (CareerHelperService?.filterApplicationStatus && CareerHelperService.filterApplicationStatus === 'unread') {
      this.loadRecruitingApplicationApplicationStatus(CareerHelperService.filterApplicationStatus);
    }
    else{
      this.filteredValueTxt = this.queryParams;
    }
  }

  public get filters(): any {
    return this.tableColumnTemplates.filter(col => col.filterWidget && col.columnDataField !== 'person.age_round' && col.columnDataField !== 'person.voto_laurea');
  }

  public get activeFilters(): any {
    return this.filters.filter(col => col.filterValue);
  }
}
