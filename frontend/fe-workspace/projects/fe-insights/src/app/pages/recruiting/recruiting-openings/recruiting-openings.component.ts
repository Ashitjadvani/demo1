import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import {
  CRUDMode,
  JobOpening,
  MandatoryField,
  Person,
} from '../../../../../../fe-common/src/lib/models/recruiting/models';
import { MatTabGroup } from '@angular/material/tabs';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Action,
  ColumnTemplate,
} from '../../../components/table-data-view/table-data-view.component';
import { TranslateService } from '@ngx-translate/core';
import { QueryParams } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { IState } from '../../../store/irina.reducer';
import {
  debounceTime,
  filter,
  skipWhile,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../../../fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import {
  loadJobOpeningDetail,
  loadJobOpeningDetailSuccess,
} from '../../../features/recruiting/store/actions';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FiltersDialogComponent } from '../../../features/shared/components/filtering/filters-dialog/filters-dialog.component';
import { FiltersDialogMqsComponent } from '../components/filtering/filters-dialog/filters-dialog.component';
import { AddEditCustomFieldsDialogComponent } from './add-edit-custom-fields--dialog/add-edit-custom-fields-dialog.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { RecruitingManagementService } from 'projects/fe-common/src/lib/services/recruiting-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { environment } from '../../../../environments/environment';
import { ActivityLogPopupComponent } from './activity-log-popup/activity-log-popup.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { WhiteSpaceValidator } from '../../../store/whitespace.validator';
import { UserCapabilityService } from '../../../services/user-capability.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-recruiting-openings',
  templateUrl: './recruiting-openings.component.html',
  styleUrls: ['./recruiting-openings.component.scss'],
})
export class RecruitingOpeningsComponent implements OnInit, OnDestroy {
  JOB_URL: any;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public elements$: Observable<JobOpening[]>;
  public elementFilter = '';
  public loading$: Observable<boolean>;
  public choices$: Observable<any>;
  public showDetail = false;
  public titleCard: string;
  public currentElement$: Observable<JobOpening>;
  public currentElement: JobOpening;
  @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

  public frmDetail: FormGroup;
  public mandatoryFields$: Observable<MandatoryField[]>;
  private mandatoryFieldsConf: any = {};
  jobsTableData: any = [];
  quizTableData: any = [];
  quizSequence: any = [];
  filteredValueTxt: any = [];
  sites: Site[];
  // public Editor = ClassicEditor;
  private jobOpening: any = {};
  userAccount: any;
  selected: any = [];
  selectedCustomFields: any;
  // private JOB_OPENING_
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['insertImage'], ['insertVideo']],
    customClasses: [
      {
        name: 'LineHeight-15px',
        class: 'LineHeight-15px',
      },
      {
        name: 'LineHeight-20px',
        class: 'LineHeight-20px',
      },
      {
        name: 'LineHeight-25px',
        class: 'LineHeight-25px',
      },
      {
        name: 'LineHeight-30px',
        class: 'LineHeight-30px',
      },
    ],
  };

  jobOpeningStatus: any = [
    { id: '1', name: 'DRAFT' },
    { id: '2', name: 'ACTIVE' },
    { id: '3', name: 'INACTIVE' },
    { id: '4', name: 'ARCHIVED' },
  ];
  jobOpeningSites: any = [];
  jobOpeningType: any = [
    { id: '1', name: 'Open_Positions' },
    { id: '2', name: 'Spontaneous_Applications' },
  ];

  jobOpeningFilter: any = [
    { id: 'Open Positions', name: 'Open Positions' },
    { id: 'Spontaneous Applications', name: 'Spontaneous Applications' },
  ];

  jobOpeningMandatory: any = [
    { id: 'nome', name: 'Name', checked: false },
    { id: 'cognome', name: 'Surname', checked: false }, // surname
    { id: 'email', name: 'Email', checked: false },
    { id: 'telefono', name: 'Phone', checked: false }, // telephone number
    { id: 'data_nascita', name: 'Birthdate', checked: false }, // date of birth
    { id: 'sesso', name: 'Gender', checked: false }, // sex
    // { id: 'azienda', name: 'Company', checked: false }, //agency
    /// { id: 'titolo', name: 'Job Title', checked: false }, //title
    { id: 'nationality', name: 'Nationality', checked: false }, // sex
    { id: 'indirizzo', name: 'Address', checked: false }, // address
    { id: 'cityName', name: 'City', checked: false },
    { id: 'stateName', name: 'State', checked: false },
    { id: 'countryName', name: 'Country', checked: false },
    { id: 'livello_studi', name: 'LevelOfEducation', checked: false }, // study_leve
    // { id: 'scoreAverage', name: 'Score Average', checked: false }, //study_level
    // { id: 'materDescription', name: 'Master Description', checked: false }, //study_level
    // { id: 'doctorateDescription', name: 'Doctorate Description', checked: false }, //study_level
    { id: 'univ_id', name: 'University', checked: false }, // univ_id
    { id: 'laurea_id', name: 'Degree', checked: false }, // degree_id
    { id: 'voto_laurea', name: 'DegreeMark', checked: false },
    { id: 'degreeYear', name: 'DegreeYear', checked: false },
    { id: 'resumeId', name: 'CV', checked: false },
  ];
  currentCompany: Company = new Company();
  peopleAreas: any = [];
  peopleFilterAreas: any = [];
  peopleScopes: any = [];
  viewMode = false;
  url: any;
  msg: any;
  selectJobFile: any;
  customFieldsData: any = [];
  customFieldsQuestion: any = [];
  videoAssessment: any = [];
  videoAssessmentAnswer: any = [];
  customFieldsAnswer: any = [];
  isAdminUser = false;

  constructor(
    private recruitingManagementService: RecruitingManagementService,
    private fb: FormBuilder,
    private store: Store<IState>,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private userManagementService: UserManagementService,
    private userCapabilityService: UserCapabilityService,
    private adminSiteManagementService: AdminSiteManagementService,
    private commonService: CommonService,
    private adminUserManagementService: AdminUserManagementService
  ) {
    // this.loading$ = this.service.loading$;
    // this.elements$ = this.service.entities$;
    const arcadiaLoggedUser = this.userManagementService.getAccount();
    const isRecruitingAll =
      this.userCapabilityService.isFunctionAvailable('Recruiting/all');
    this.isAdminUser = this.arrayEquals(arcadiaLoggedUser.profile, [
      'System',
      'Admin',
    ]);

    if (this.isAdminUser || isRecruitingAll) {
      this.tableMainActions.unshift({
        tooltip: this.translate.instant('JOB_OPENING.ADD'),
        image: null,
        icon: 'add_circle',
        color: '#ffffff',
        action: 'onAddOpening',
        context: this,
      });

      this.tableRowActions.push(
        {
          tooltip: this.translate.instant('GENERAL.Edit'),
          image: './assets/images/account-edit.svg',
          icon: null,
          color: '#000000',
          action: 'onEditElement',
          context: this,
        },
        {
          tooltip: this.translate.instant('GENERAL.Delete'),
          image: null,
          icon: 'delete',
          color: '#FF0000',
          action: 'onDeleteElement', // TODO how to make it conditional?
          context: this,
        }
      );
    }
    this.queryParams$
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe((qp) => {
        // this.loadData();
      });
  }

  datePipe: DatePipe = new DatePipe('it-IT');
  queryParams: QueryParams = {};
  queryParams$: ReplaySubject<QueryParams> = new ReplaySubject<QueryParams>();

  tableColumnTemplates: ColumnTemplate[] = [
    {
      columnCaption: this.translate.instant('JOB_OPENING.SCOPE'),
      columnName: 'Scope',
      columnDataField: 'scope',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      isColumnShow: true,
      filterWidget: {
        widget: 'select',
        value_field: 'name',
        label_field: 'name',
        options: () => of(this.peopleScopes),
      },
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.AREA'),
      columnName: 'Area',
      columnDataField: 'areaName',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      filterWidget: {
        widget: 'filter_select',
        value_field: 'name',
        label_field: 'name',
        options: this.peopleFilterAreas,
      },
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.SITE'),
      columnName: 'Site',
      columnDataField: 'site',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      isColumnShow: true,
      filterWidget: {
        widget: 'select_single',
        options: () => of(this.sites),
      },
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.JOBTYPE'),
      columnName: 'Type',
      columnDataField: 'jobType',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'id',
        label_field: 'name',
        options: () => of(this.jobOpeningFilter),
      },
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.JOBTITLE'),
      columnName: 'Title',
      columnDataField: 'description',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      filterWidget: {},
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.APPLICATION_COUNT'),
      columnName: 'Application Count',
      columnDataField: 'applicationCount',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      isCenter: true,
      filterWidget: null,
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.WAITING_COUNT'),
      columnName: 'Waiting Count',
      columnDataField: 'waitingCount',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      isCenter: true,
      filterWidget: null,
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.UNDER_REVIEW'),
      columnName: 'Under Review',
      columnDataField: 'underReview',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      isCenter: true,
      filterWidget: null,
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.HIRE_COUNT'),
      columnName: 'Hired',
      columnDataField: 'hireCount',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      isCenter: true,
      filterWidget: null,
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.REFUSED_COUNT'),
      columnName: 'Refused',
      columnDataField: 'refusedCount',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
      isCenter: true,
      filterWidget: null,
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.STATUS'),
      columnName: 'Status',
      columnDataField: 'statusText',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      isCenter: true,
      context: this,
    },
    {
      columnCaption: '',
      columnName: 'Action',
      columnDataField: '',
      columnFormatter: null,
      columnRenderer: null,
      columnTooltip: null,
      context: this,
    },
  ];

  tableRowActions: Action[] = [
    {
      tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.See Log'),
      image: null,
      icon: 'checklist_rtl',
      color: '#000000',
      action: 'onShowChangeLog',
      context: this,
    },

    {
      tooltip: this.translate.instant('GENERAL.View'),
      image: null,
      icon: 'remove_red_eye',
      color: '#000000',
      action: 'onViewElement',
      context: this,
    },
    {
      tooltip: this.translate.instant('JOB_OPENING.Inspect'),
      image: null,
      icon: 'manage_search',
      color: '#0000FF',
      action: 'onInpsectOpening',
      context: this,
    },
  ];
  tableMainActions: Action[] = [
    {
      tooltip: this.translate.instant('JOB_OPENING.Filter'),
      image: null,
      icon: 'filter_alt',
      color: '#ffffff',
      action: 'onFilterOpening',
      context: this,
    },
    {
      tooltip: this.translate.instant('GENERAL.BACK'),
      image: null,
      icon: 'arrow_back',
      color: '#ffffff',
      action: 'onNavBackToChallenges',
      context: this,
    },
  ];

  public forcedFilters = {};

  onNavBackToChallenges() {
    this.router.navigate(['insights', 'main', 'recruiting-mqs']);
  }

  async ngOnInit() {
    this.userAccount = this.userManagementService.getAccount();
    await this.loadSites();
    await this.loadCompany();
    await this.loadRecruitingOpening();

    this.frmDetail = this.fb.group({
      id: [null],
      area: [null],
      scope: [null],
      longDescription: [null, [Validators.required]],

      description: [
        null,
        [Validators.required, WhiteSpaceValidator.noWhiteSpace],
      ],
      successMessage: [null, [Validators.required]],
      start: [null],
      end: [null],
      status: [null],
      site: [null],
      type: [null],
      address: [null],
      city: [null],
      noOfOpening: [null],
      totalExperience: [null],
      mandatoryFields: this.fb.array([]),
      //   customFields: this.fb.array([]),
      quizFields: this.fb.array([]),
      quizFieldId: [null],
      quizSequence: [null],
      jobImageId: [null],
      selectQuiz: [null],
      isCandidateRead: [null],
    });
    /*this.customFieldsQuestion.forEach((b: any) => {
          this.customFields.push(this.fb.group(b));
        });*/
    this.jobOpeningMandatory.forEach((b: any) => {
      this.mandatoryFields.push(this.fb.group(b));
    });
    await this.loadQuiz();
    await this.getCustomFiled();
    await this.getvideoAssessment();
  }

  arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }

  copyBoardURL(): void {
    this.snackBar.open(
      this.translate.instant('GENERAL.COPY_JOB_OPENING_SUCCESSFULLY'),
      this.translate.instant('GENERAL.OK'),
      { duration: 3000 }
    );
  }

  async loadRecruitingOpening() {
    const jobsTableData: any = await this.recruitingManagementService.getOpeningList();
    this.jobsTableData = jobsTableData.data;
  }

  async loadQuiz() {
    const quizTableData: any = await this.recruitingManagementService.getQuizJobList('recruitmentquiz');
    this.quizTableData = quizTableData.data;
    setTimeout(() => {
      if(this.jobsTableData && this.jobsTableData.length > 0){
        const filterArray = (arr1,arr2) => {
          const filtered = arr1.filter(el => {
             return arr2.indexOf(el) === -1;
          });
          return filtered;
       };

       var sequenceArr :any = [];
       var quizArrayArr :any = [];
       this.jobsTableData.forEach(element => {
         element.sequenceArr = [];
         if(element.quizSequence){
          element.quizSequence.forEach(seElement => {
            if(!element.sequenceArr.find(a=>a == seElement.title)){
              element.sequenceArr.push(seElement.title);
            }
          });
        }
       });

       this.quizTableData.forEach(element => {
        quizArrayArr.push(element.title);
       });

        this.jobsTableData.forEach(element => {
          var finalArry = filterArray(quizArrayArr, element.sequenceArr);
          if(finalArry && finalArry.length > 0){
            finalArry.forEach(fnObject => {
              var oibj = this.quizTableData.find(a=>a.title == fnObject);
              if(oibj && element.quizSequence){
                element.quizSequence.push(oibj);
              }
            });

          }
        });
      }
    }, 100);
    this.quizTableData.forEach((c) => {
      this.quizFields.push(this.fb.group({ id: c.id, title: c.title }));
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.quizSequence.length > 0){
      moveItemInArray(
        this.quizSequence,
        event.previousIndex,
        event.currentIndex
      );
      this.quizSequence = this.quizSequence;
    }else {
      moveItemInArray(
        this.quizTableData,
        event.previousIndex,
        event.currentIndex
      );
      this.quizSequence = this.quizTableData;
    }

    this.selected = [];
    var that = this;
    if (this.quizSequence.length > 0){
      this.quizSequence.forEach(function(e){
        if(e.checked){
          that.selected.push(e.id);
        }
      })
    }else {
      this.quizTableData.forEach(function(e){
        if(e.checked){
          that.selected.push(e.id);
        }
      })
    }
  }

  async getCustomFiled() {
    const getCustomFiledData: any =
      await this.recruitingManagementService.getCustomFieldJobList(
        'recruitmentcustomfields'
      );
    this.customFieldsData = getCustomFiledData.data;
    this.customFieldsData.forEach((c) => {
      this.customFieldsQuestion.push(
        this.fb.group({
          id: c.id,
          title: c.title,
        })
      );
    });
    // this.customFieldsQuestion = this.mergeArrayFunction(
    //   this.customFieldsQuestion,
    //   this.customFieldsAnswer
    // );
  }

  async getvideoAssessment() {
    const getvideoAssessmentData: any =
      await this.recruitingManagementService.videoQuestionList();
    this.videoAssessment = getvideoAssessmentData.data;
    this.videoAssessment = this.mergeArrayFunction(
      this.videoAssessment,
      this.videoAssessmentAnswer
    );
  }

  async loadSites() {
    const allSite: Site = Site.Empty();
    allSite.key = '-1';
    allSite.name = this.translate.instant('ADMIN DIALOGS.ALL SITES');

    const res = await this.adminSiteManagementService.getSites(
      this.userAccount.companyId
    );
    if (this.commonService.isValidResponse(res)) {
      this.jobOpeningSites = [allSite].concat(res.sites);
    } else {
      this.jobOpeningSites = [allSite];
    }

    const siteArray = [];
    this.jobOpeningSites.forEach((b: any, index: any) => {
      if (b.name && index !== 0) {
        siteArray.push(b.name);
      }
    });

    this.sites = siteArray.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });
  }

  changeSiteName(event) {
    if (event) {
      const sitesName = event && event.length > 0 ? event[0] : null;
      let siteData = this.jobOpeningSites.filter((b) => {
        return b.name === sitesName;
      });

      const siteCityArray = [];
      event.forEach((c) => {
        const siteCityFilter = this.jobOpeningSites.filter((b) => {
          return b.name === c;
        });
        const siteCity =
          siteCityFilter && siteCityFilter.length > 0
            ? siteCityFilter[0].city
            : null;
        if (siteCity) {
          siteCityArray.push(siteCity);
        }
      });
      const siteCityName =
        siteCityArray.length > 0 ? siteCityArray.join(',') : null;
      siteData = siteData && siteData.length > 0 ? siteData[0] : null;
      const siteAddress =
        siteData && siteData.address ? siteData.address : null;

      this.frmDetail.controls.address.setValue(siteAddress);
      this.frmDetail.controls.city.setValue(siteCityName);
    }
  }

  get mandatoryFields(): FormArray {
    return this.frmDetail.get('mandatoryFields') as FormArray;
  }

  get customFields(): FormArray {
    return this.frmDetail.get('customFields') as FormArray;
  }

  get quizFields(): FormArray {
    return this.frmDetail.get('quizFields') as FormArray;
  }

  async loadCompany() {
    const res = await this.adminUserManagementService.getCompany(
      this.userAccount.companyId
    );
    if (this.commonService.isValidResponse(res)) {
      this.currentCompany = res.company;
    }
    this.peopleScopes = this.currentCompany.scopes
      ? this.currentCompany.scopes
      : [];

    // sort by name
    this.peopleFilterAreas = this.currentCompany.areas.sort(
      (a: any, b: any) => {
        const nameA = a.name ? a.name.toUpperCase() : null;
        const nameB = b.name ? b.name.toUpperCase() : null;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
    );

    this.tableColumnTemplates.map((a) => {
      if (a.columnDataField === 'areaName') {
        a.filterWidget.options = this.peopleFilterAreas;
      }
      return a;
    });
  }

  onChangeScope(value) {
    this.peopleAreas = this.currentCompany.areas.filter((b) => {
      return b.scopes.includes(value);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  getFilteredElements(filter?: string, data?: any): boolean {
    if (filter !== undefined) {
      const params: QueryParams = {
        filter,
      };
      //  this.service.clearCache();
      //   this.service.getWithQuery(params);
    }
    return true;
  }

  public get filters(): any {
    return this.tableColumnTemplates.filter((col) => col.filterWidget);
  }

  public get activeFilters(): any {
    return this.filters.filter((col) => col.filterValue);
  }

  onFilterOpening(element: JobOpening) {
    const config = new MatDialogConfig();
    config.width = '30%';
    config.data = {
      filters: this.filters,
    };
    const dialogRef = this.dialog.open(FiltersDialogMqsComponent, config);
    dialogRef
      .afterClosed()
      .pipe(
        skipWhile((res) => !res),
        takeUntil(this.destroyed$)
      )
      .subscribe((filters) => {
        this.tableColumnTemplates = this.tableColumnTemplates.map((col) => {
          if (Object.keys(filters).indexOf(col.columnDataField) > -1) {
            return {
              ...col,
              filterValue: filters[col.columnDataField],
            };
          } else {
            return col;
          }
        });
        this.queryParams = {
          ...filters,
        };
        this.filteredValueTxt = this.queryParams;
      });
  }

  async onAddOpening() {
    this.titleCard = this.translate.instant('RECRUITING.JOB_OPENING_DETAIL');
    this.tabgroup.selectedIndex = 1;
    this.showDetail = true;
    this.viewMode = false;
    this.url = null;
    this.JOB_URL = null;
    this.config.editable = true;
    this.frmDetail.patchValue({
      id: null,
      area: null,
      scope: null,
      longDescription: null,
      description: null,
      successMessage: null,
      start: null,
      end: null,
      status: null,
      site: null,
      city: null,
      type: null,
      address: null,
      noOfOpening: null,
      totalExperience: null,
      isCandidateRead: null,
    });
    this.selected = [];
    this.jobOpeningMandatory.forEach((b, i) => {
      b.checked = false;
      this.mandatoryFields.at(i).patchValue(b);
    });
    /*this.customFieldsQuestion.forEach((b, i) => {
          b.checked = false;
          this.customFields.at(i).patchValue(b);
        });*/
  }

  selectFile(event: any) {
    // Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    const mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.selectJobFile = event.target.files[0];
    reader.onload = (_event) => {
      this.msg = '';
      this.url = reader.result;
    };
  }

  async onViewElement(element: JobOpening) {
    this.titleCard = this.translate.instant('RECRUITING.JOB_OPENING_DETAIL');
    this.tabgroup.selectedIndex = 1;
    this.viewMode = true;
    this.config.editable = false;
    this.loadElement(element, CRUDMode.VIEW);
    this.showDetail = true;
  }

  async onEditElement(element: JobOpening) {
    this.titleCard = this.translate.instant('RECRUITING.JOB_OPENING_DETAIL');
    this.tabgroup.selectedIndex = 1;
    this.config.editable = true;
    this.loadElement(element, CRUDMode.EDIT);
    this.showDetail = true;
    this.viewMode = false;
  }

  loadElement(element: JobOpening, mode: CRUDMode) {
    this.url = null;
    this.showDetail = true;
    this.JOB_URL = `${environment.home_page}${element.id}`;
    this.frmDetail.patchValue({
      id: element.id,
      area: element.area,
      scope: element.scope,
      longDescription: element.longDescription ? element.longDescription : null,
      description: element.description,
      successMessage: element.successMessage,
      start: element.start,
      end: element.end,
      status: element.status,
      site: element.site,
      city: element.city,
      type: element.type,
      address: element.address,
      jobType: element.jobType,
      jobImageId: element.jobImageId,
      noOfOpening: element.noOfOpening,
      totalExperience: element.totalExperience,
      isCandidateRead: element.isCandidateRead,
    });
    if (element.jobImageId) {
      this.recruitingManagementService
        .getUploadDocument({ id: element.jobImageId })
        .then((data) => {
          this.url = data.data;
        });
    }

    if (element.scope) {
      this.onChangeScope(element.scope);
    }

    if (Array.isArray(element.quizFieldId)) {
      this.selected = element.quizFieldId;
      var that = this;

      if (this.quizSequence.length > 0){
        that.quizSequence.forEach(function(e){
          if(that.selected.indexOf(e.id) > -1){
            e.checked = true;
          }else{
            e.checked = false;
          }
        })
      }else {
        that.quizTableData.forEach(function(e){
          if(that.selected.indexOf(e.id) > -1){
            e.checked = true;
          }else{
            e.checked = false;
          }
        })
      }
    }
    if (Array.isArray(element.customFields)) {
      this.selectedCustomFields = element.customFields[0];
      this.customFieldsData.forEach((element) => {
        element.checked = element.id == this.selectedCustomFields;
      });
    }

    if (element.mandatoryFields) {
      const arr = this.frmDetail.controls.mandatoryFields as FormArray;
      arr.controls = [];
      const filterData: any = this.filterMandatoryFields(
        this.jobOpeningMandatory,
        element.mandatoryFields
      );
      filterData.forEach((b: any) => {
        this.mandatoryFields.push(this.fb.group(b));
      });
      // this.mandatoryFields$ = this.fb.array([]);
      element.mandatoryFields.forEach((b, i) => {
        // this.mandatoryFields.at(i).patchValue(b);
      });
    }

    if (
      element.customFields &&
      Array.isArray(element.customFields) &&
      element.customFields.length > 0
    ) {
      this.customFieldsAnswer = element.customFields;
      this.customFieldsQuestion = this.mergeArrayFunction(
        this.customFieldsQuestion,
        this.customFieldsAnswer
      );
    }

    if (
      element.videoAssessment &&
      Array.isArray(element.videoAssessment) &&
      element.videoAssessment.length > 0
    ) {
      this.videoAssessmentAnswer = element.videoAssessment;
      this.videoAssessment = this.mergeArrayFunction(
        this.videoAssessment,
        this.videoAssessmentAnswer
      );
    }
    /*if(element.customFields) {
          const arrCustomFields = this.frmDetail.controls.customFields as FormArray;
          arrCustomFields.controls = [];
          let filterDataCustom: any = this.filterMandatoryFields(this.customFieldsQuestion, element.customFields);
          filterDataCustom.forEach((b: any) => {
            this.customFields.push(this.fb.group(b));
          });
          /!*element.customFields.forEach((b, i) => {
            this.customFields.at(i).patchValue(b);
          });*!/
        }*/


    if(element.quizSequence != null) {
        this.quizSequence = element.quizSequence;
    }

    if ([CRUDMode.EDIT, CRUDMode.ADD].indexOf(mode) > -1) {
      this.frmDetail.enable();
    } else {
      this.frmDetail.disable();
    }
    this.tabgroup.selectedIndex = 1;
  }

  mergeArrayFunction(customFieldsQuestion, customFieldsAnswer): any {
    customFieldsQuestion.map((b) => {
      const dataFilter = customFieldsAnswer.filter((c) => c.id === b.id)[0];
      b.question = dataFilter ? dataFilter.question : b.question;
      b.checked = dataFilter ? dataFilter.checked : b.checked;
      return b;
    });
    return customFieldsQuestion;
  }

  filterMandatoryFields(jobOpeningMandatory, mandatoryFieldsData): any {
    jobOpeningMandatory = jobOpeningMandatory ? jobOpeningMandatory : [];
    mandatoryFieldsData = mandatoryFieldsData ? mandatoryFieldsData : [];
    return jobOpeningMandatory.map((t1) => ({
      ...t1,
      ...mandatoryFieldsData.find((t2) => t2.id === t1.id),
    }));
  }

  onCancelClick(): void {
    this.tabgroup.selectedIndex = 0;
    this.showDetail = false;
  }

  onShowChangeLog(element: JobOpening): void {
    this.dialog.open(ActivityLogPopupComponent, {
      data: {
        id: element.id,
      },
    });
  }

  uploadImage(selectJobFile): Promise<void> {
    return new Promise((resolve, reject) => {
      if (selectJobFile) {
        this.recruitingManagementService.uploadDocumentFile(selectJobFile).then(
          (data) => {
            const imageUpload: any = data ? data.fileId : null;
            resolve(imageUpload);
          },
          (err) => {
            resolve(null);
          }
        );
      } else {
        resolve(null);
      }
    });
  }

  quizChange(event, id,index): void {
    if (this.quizSequence.length > 0){
      if (event.checked) {
        this.quizSequence[index].checked = true;
        this.selected.push(id);
      } else {
        this.quizSequence[index].checked = false;
        this.selected = this.selected.filter((b) => b !== id);
      }
    }else {
      if (event.checked) {
        this.quizTableData[index].checked = true;
        this.selected.push(id);
      } else {
        this.quizTableData[index].checked = false;
        this.selected = this.selected.filter((b) => b !== id);
      }
    }
  }

  async onSubmit($event) {
    $event.preventDefault();
    if (!this.frmDetail.valid) {
      return;
    }
    let departmentDescription = null;
    if (this.frmDetail.value.area) {
      const departmentFilter = this.peopleAreas.filter((b) => {
        return b.name === this.frmDetail.value.area;
      });
      departmentDescription =
        departmentFilter && departmentFilter.length > 0
          ? departmentFilter[0].description
          : null;
    }

    let selectedCustomFields = this.customFieldsData.find(
      (a) => a.checked == true
    );
    this.uploadImage(this.selectJobFile).then((imageUpload: any) => {
      this.frmDetail.patchValue({
        jobImageId: imageUpload ? imageUpload : this.frmDetail.value.jobImageId,
      });
      this.frmDetail.value.quizFieldId = this.selected;
      this.frmDetail.value.quizSequence = this.quizSequence;
      this.frmDetail.value.departmentDescription = departmentDescription;
      this.frmDetail.value.customFields = selectedCustomFields
        ? selectedCustomFields.id
        : '';
      this.frmDetail.value.videoAssessment = this.videoAssessment;
      this.recruitingManagementService
        .insertDocument(this.frmDetail.value)
        .subscribe(
          (event) => {
            if (event instanceof HttpResponse) {
              this.snackBar.open(
                this.translate.instant('GENERAL.JOB_CREATED_SUCCESSFULLY'),
                this.translate.instant('GENERAL.OK'),
                { duration: 3000 }
              );
              this.loadRecruitingOpening();
              this.tabgroup.selectedIndex = 0;
            }
          },
          (error) => {
            this.snackBar.open(
              this.translate.instant('ADMIN DIALOGS.ERROR UPLOADING FILE'),
              this.translate.instant('GENERAL.OK'),
              { duration: 3000 }
            );
          }
        );
    });
  }

  addCustomFields(data, mode, module, index) {
    data = data ? data : { question: null };
    const dialogRef = this.dialog.open(AddEditCustomFieldsDialogComponent, {
      maxWidth: '600px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        isNew: true,
        mode,
        module,
        customField: data,
      },
    });
    const that = this;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.reason) {
        if (module === 'custom') {
          if (index === -1) {
            that.customFieldsQuestion.unshift(result.result);
          } else {
            that.customFieldsQuestion[index].question = result.result.question;
          }
        } else {
          if (index === -1) {
            that.videoAssessment.unshift(result.result);
          } else {
            that.videoAssessment[index].question = result.result.question;
          }
        }
      }
    });
  }

  async deleteCustomFields(id: any, index: number) {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: new ConfirmDialogData(
        this.translate.instant('Delete') + ' "' + 'Custom Field popup' + '"',
        this.translate.instant('ADMIN COMPONENTS.SURE'),
        this.translate.instant('GENERAL.YES'),
        this.translate.instant('GENERAL.NO')
      ),
    });
    const that = this;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        that.recruitingManagementService
          .customFiledDelete({ id })
          .then((data: any) => {
            that.customFieldsAnswer = that.customFieldsAnswer.filter((obj) => {
              return obj.id !== id;
            });
            that.customFieldsQuestion.splice(index, 1);
          });
      }
    });
  }

  async deleteVideoAssessment(id: any, index: number): Promise<void> {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: new ConfirmDialogData(
        this.translate.instant('Delete') + ' "' + 'Video Question popup' + '"',
        this.translate.instant('ADMIN COMPONENTS.SURE'),
        this.translate.instant('GENERAL.YES'),
        this.translate.instant('GENERAL.NO')
      ),
    });
    const that = this;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        that.recruitingManagementService
          .videoQuestionDelete({ id })
          .then((data: any) => {
            that.videoAssessmentAnswer = that.customFieldsAnswer.filter(
              (obj) => {
                return obj.id !== id;
              }
            );
            that.videoAssessment.splice(index, 1);
          });
      }
    });
  }

  async onDeleteElement(opening: any) {
    const res = await this.dialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        panelClass: 'custom-dialog-container',
        data: new ConfirmDialogData(
          this.translate.instant('JOB_OPENING.ToolTipDelete'),
          this.translate.instant('ADMIN COMPONENTS.SURE'),
          this.translate.instant('GENERAL.YES'),
          this.translate.instant('GENERAL.NO')
        ),
      })
      .afterClosed()
      .toPromise();
    if (res) {
      const resDelete: any =
        await this.recruitingManagementService.deletePostDocument({
          id: opening.id,
        });
      if (resDelete.result) {
        this.snackBar.open(
          this.translate.instant(resDelete.reason),
          this.translate.instant('GENERAL.OK'),
          { duration: 3000 }
        );
        await this.loadRecruitingOpening();
      } else {
        this.snackBar.open(
          this.translate.instant('ADMIN COMPONENTS.ERROR') + resDelete.message,
          this.translate.instant('GENERAL.OK'),
          { duration: 3000 }
        );
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
      console.error('dateColumnFormatter exception: ', ex);
    }

    return '#NA';
  }

  onInpsectOpening(opening: JobOpening) {
    this.router.navigate([
      'insights',
      'main',
      'recruiting-mqs',
      'applications',
      opening.id,
    ]);
  }

  onChipRemove(col: ColumnTemplate): any {
    col.filterValue = null;
    // this.loadData();
  }

  customFieldCheckChange($event: any, index: number) {
    if (this.customFieldsData.length > 0) {
      this.customFieldsData.forEach((x) => {
        x.checked = false;
      });
    }
    if ($event.checked) {
      this.customFieldsData[index].checked = true;
    } else {
      this.customFieldsData[index].checked = false;
    }
  }
}
