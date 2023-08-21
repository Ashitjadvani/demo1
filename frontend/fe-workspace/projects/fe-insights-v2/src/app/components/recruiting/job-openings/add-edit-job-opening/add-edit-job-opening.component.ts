import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { Console } from 'console';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { Company } from 'projects/fe-common-v2/src/lib/models/company';
import { MandatoryField } from 'projects/fe-common-v2/src/lib/models/recruiting/models';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { ApiService } from 'projects/fe-common-v2/src/lib/services/api';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { RecruitingManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';
import { RecrutingJobOpeningManagementService } from 'projects/fe-common-v2/src/lib/services/recruting-job-opening-management.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { AddEditVideoAssessmentComponent } from 'projects/fe-insights-v2/src/app/popup/add-edit-video-assessment/add-edit-video-assessment.component';
import { DeletePopupComponent } from 'projects/fe-insights-v2/src/app/popup/delete-popup/delete-popup.component';
import { environment } from 'projects/fe-insights-v2/src/environments/environment';
import { Observable } from 'rxjs';
import { CRUDMode, JobOpening } from '../../../../../../../fe-common-v2/src/lib/models/recruiting/models';
import { WhiteSpaceValidator } from '../../../../../../../fe-insights/src/app/store/whitespace.validator';
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { IfStmt } from '@angular/compiler/src/output/output_ast';

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
  selector: 'app-add-edit-job-opening',
  templateUrl: './add-edit-job-opening.component.html',
  styleUrls: ['./add-edit-job-opening.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
    {provide: MAT_DATE_LOCALE, useValue: 'it'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
  ],
})
export class AddEditJobOpeningComponent implements OnInit {
  JOB_URL: any;
  id: any;
  @ViewChild('dataTable') table: MatTable<string[]>
  @ViewChild('stepper') stepper: MatStepper;
  public showDetail = false;
  viewMode = false;
  allSelected=false;
  jobOpeningdata: any;
  submited = false


  // @ViewChild('stepper') private matStepper: MatStepper;
  jobOeningId: any = '';
  documentInput: any;
  documentName: any;
  fileToUpload: any;
  fileCoverImage: any;
  stepperCount = 1;
  stepperClickCount: any = [1];

  userAccount: any;
  currentCompany: Company = new Company();

  url: any;
  msg: any;
  // selectJobFile: any;
  selected: any = [];
  customFieldsData: any = [];
  customFieldsQuestion: any = [];
  customFieldsAnswer: any = [];
  videoAssessment: any = [];
  videoAssessmentAnswer: any = [];
  sites: Site[];
  scopeList: any = [];
  selectedCustomFields: any = [];

  siteList: any = [];
  isLinear: true;
  quizTableData: any = [];
  quizSequence: any = [];

  generalInformationForm: FormGroup;
  mandatoryFieldsForm: FormGroup;
  customefieldForm: FormGroup;
  videoForm: FormGroup;
  quizForm: FormGroup;
  finishForm: FormGroup;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '13rem',
    minHeight: '4rem',
    // placeholder: 'Enter text here...',
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
  jobOpeningMandatory: Array<any> = [
    { id: 'nome', name: 'Name', checked: false },
    { id: 'cognome', name: 'Surname', checked: false }, // surname
    { id: 'email', name: 'Email', checked: false },
    { id: 'telefono', name: 'Phone', checked: false }, // telephone number
    { id: 'data_nascita', name: 'Birthdate', checked: false }, // date of birth
    { id: 'sesso', name: 'Gender', checked: false }, // sex
    { id: 'nationality', name: 'Nationality', checked: false }, // sex
    { id: 'indirizzo', name: 'Address', checked: false }, // address
    { id: 'cityName', name: 'City', checked: false },
    { id: 'stateName', name: 'State', checked: false },
    { id: 'countryName', name: 'Country', checked: false },
    { id: 'livello_studi', name: 'LevelOfEducation', checked: false }, // study_leve
    { id: 'univ_id', name: 'University', checked: false }, // univ_id
    { id: 'laurea_id', name: 'Degree', checked: false }, // degree_id
    { id: 'voto_laurea', name: 'DegreeMark', checked: false },
    { id: 'degreeYear', name: 'DegreeYear', checked: false },
    { id: 'resumeId', name: 'CV', checked: false },
  ];

  areaList: any = [];
  statusList: any = [
    { id: 1, name: 'EXTRA_WORD.DRAFT' },
    { id: 2, name: 'EXTRA_WORD.ACTIVE' },
    { id: 3, name: 'EXTRA_WORD.INACTIVE' },
    { id: 4, name: 'EXTRA_WORD.ARCHIVED' },
  ];

  jobOpeningSites: any = [];

  typeList = [
    { id: 1, viewValue: 'Open Positions' },
    {
      id: 2,
      viewValue: 'Spontaneous Applications',
    },
  ];

  qrCodeURL : any = '';
  copyURL : any = '';

  constructor(
    private snackBar: MatSnackBar,
    private recruitingManagementService: RecruitingManagementService,
    private activitedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,

    public dialog: MatDialog,
    private apiservice: RecrutingJobOpeningManagementService,
    private adminUserManagementService: AdminUserManagementService,
    private userManagementService: UserManagementService,
    private commonService: CommonService,
    private adminSiteManagementService: AdminSiteManagementService,
    private translate: TranslateService,
    private apiService: ApiService,
    private _adapter: DateAdapter<any>
  ) {
    this.generalInformationForm = this._formBuilder.group({
      id: [null],
      scope: [null, Validators.required],
      area: [null, Validators.required],
      //title: ['', Validators.required],
      longDescription: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, WhiteSpaceValidator.noWhiteSpace],
      ],
      successMessage: [null, [Validators.required]],
      start: [null, Validators.required],
      end: [null],
      status: [null, Validators.required],
      site: [null],
      type: [null],
      address: [null],
      city: [null],
      noOfOpening: [null],
      totalExperience: [null],
      jobImageId: [null],
      step: [1],
      //mandatoryFields: this._formBuilder.array([]),
      quizFields: this._formBuilder.array([]),
      //quizFieldId: [null],
      //quizSequence: [null],
      isCandidateRead: [null],
      //customFields: this._formBuilder.array([])
    });
    this.quizForm = this._formBuilder.group({
      quizFields: this._formBuilder.array([]),
      quizSequence: [null],
    });

    this.mandatoryFieldsForm = this._formBuilder.group({
      id: [null],
      mandatoryFields: this._formBuilder.array([]),
      step: [2],
    });

    this.jobOpeningMandatory.forEach((b: any) => {
      this.mandatoryFields.push(this._formBuilder.group(b));
    });

    this.videoForm = this._formBuilder.group({
      videoAssessment: [''],
    });
    this.customefieldForm = this._formBuilder.group({
      customFields: [null],
    });
    this.allSelected = false;
  }


  peopleGroupsList = [
    // { quiz: 'Survey', totalQuestions: '04', timeRequired: '10 Min' },
    // { quiz: 'Survey', totalQuestions: '06', timeRequired: '08 min' },
    // { quiz: 'Survey', totalQuestions: '03', timeRequired: '05 min' },
    // { quiz: 'Survey', totalQuestions: '02', timeRequired: '03 min' },
  ];

  RFQDisplayedColumns: string[] = ['quiz', 'totalQuestions', 'timeRequired'];
  RFQDisplayedColumns1: string[] = ['custome_Fields'];

  async ngOnInit() {
    this.userAccount = this.userManagementService.getAccount();
    await this.loadSiteList();
    await this.loadCompany();
    await this.getCustomFiled();
    await this.loadQuiz();
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.jobOeningId = this.id;
      await this.getjobOpening();
    }
    await this.getvideoAssessment();
  }
  get mandatoryFields(): FormArray {
    return this.mandatoryFieldsForm.get('mandatoryFields') as FormArray;
  }

  get quizFields(): FormArray {
    return this.quizForm.get('quizFields') as FormArray;
  }
  get customFields(): FormArray {
    return this.customefieldForm.get('customFields') as FormArray;
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
    //this.fileToUpload = input.files[0];
    this.documentInput = file;
    this.documentName = `${file.name} (${formatBytes(file.size)})`;

    if (!input.files[0] || input.files[0].size == 0) {
      this.msg = this.translate.instant('You must select an image');
      this.fileToUpload = input.files[0];
      this.documentInput = file;
      this.documentName = `${file.name} (${formatBytes(file.size)})`;
      return;
    }

    const mimeType = input.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = this.translate.instant('Only images are supported');
      this.resetCoverValue();
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    this.fileToUpload = input.files[0];
    reader.onload = (_event) => {
      this.msg = '';
      this.url = reader.result;
    };
  }

  resetCoverValue(): void {
    this.documentInput = null;
    this.documentName = null;
    this.url = null;
    this.generalInformationForm.patchValue({
      jobImageId: null,
    });
  }

  jobOpeningsDeleteDialog(id: any, index: number) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message: this.translate.instant('ADMIN DIALOGS.VIDEO_ASS_DELETE'),
        heading: this.translate.instant('ADMIN DIALOGS.VIDEO_ASS_DELETE_HEAD'),
      },
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

  addVideoAssesment(data, mode, module, index) {
    data = data ? data : { question: null };
    let videoData = data;
    const dialogRef = this.dialog.open(AddEditVideoAssessmentComponent, {
      data: {
        isNew: true,
        mode,
        module,
        customField: videoData,
      },
    });
    const that = this;
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
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
      }
    });
  }



  async loadSiteList() {
    const allSite: Site = Site.Empty();
    allSite.key = '-1';
    allSite.name = this.translate.instant('ADMIN DIALOGS.ALL SITES');
    const res = await this.adminSiteManagementService.getFullSites(
      this.userAccount.companyId
    );
    this.jobOpeningSites = [allSite].concat(res.data);
    const siteArray = [];
    this.jobOpeningSites.forEach((b: any, index: any) => {
      if (b && b.name && index !== 0) {
        siteArray.push(b.name);
      }
    });

    this.siteList = siteArray.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });

    // const allSite: Site = Site.Empty();
    // const res: any = await this.adminSiteManagementService.getSites(
    //   this.userAccount.companyId
    // );
    // // this.apiservice.getScopeforJobOpening();
    // if (this.commonService.isValidResponse(res)) {
    //   this.siteList = [allSite].concat(res.sites);
    // } else {
    //   this.siteList = [allSite];
    // }
  }

  async loadCompany() {
    const res = await this.adminUserManagementService.getCompany(
      this.userAccount.companyId
    );
    if (this.commonService.isValidResponse(res)) {
      this.currentCompany = res.company;
    }
    this.scopeList = this.currentCompany.scopes
      ? this.currentCompany.scopes
      : [];
  }

  onChangeScope(value) {
    this.areaList = this.currentCompany.areas.filter((b) => {
      return b.scopes.includes(value);
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

  async onSubmit(currentStep: any, $event) {
    //var currentStep = this.matStepper.selectedIndex;
    $event.preventDefault();
    this.submited = true

    let departmentDescription = null;
    if (this.generalInformationForm.value.area) {
      const departmentFilter = this.areaList.filter((b) => {
        return b.name === this.generalInformationForm.value.area;
      });
      departmentDescription =
        departmentFilter && departmentFilter.length > 0
          ? departmentFilter[0].description
          : null;
    }

    let selectedCustomFields = this.customFieldsData.find(
      (a) => a.checked == true
    );
    if (currentStep === 1) {
        this.uploadImage(this.fileToUpload).then((imageUpload: any) => {
          if (!this.generalInformationForm.valid) {
            return;
          }
          if(this.id && this.jobOpeningdata.jobImageId){
            this.generalInformationForm.patchValue({
              jobOeningId: this.jobOpeningdata.jobImageId
            })
          }
          else{

            this.generalInformationForm.patchValue({
              jobImageId: imageUpload
              ? imageUpload
              : this.generalInformationForm.value.jobImageId,
            });
          }
        if(this.id){
          this.generalInformationForm.patchValue({
            id: this.id
          })
        }
        this.recruitingManagementService
          .insertDocument(this.generalInformationForm.value)
          .subscribe(
            (event) => {
              if (event instanceof HttpResponse) {
                // if(this.id){
                //   this.snackBar.open(this.translate.instant('JOB_OPENING.Details_Edited'), null, {
                //     duration: 3000,
                //   });
                // }
                // else{
                //   this.snackBar.open(this.translate.instant('JOB_OPENING.Details_Created'), null, {
                //     duration: 3000,
                //   });
                // }
                this.generalInformationForm.patchValue({
                  id: event.body.data.id,
                });
                this.jobOeningId = event.body.data.id;
              }
            },
            (error) => {
              this.snackBar.open('Error');
            }
          );
      });
      this.stepperClickCount.push(currentStep);
      this.stepperClickCount = [...new Set(this.stepperClickCount)];
    } else if (this.generalInformationForm.valid && currentStep === 2) {
      this.generalInformationForm.value.id = this.jobOeningId;
      this.generalInformationForm.value.mandatoryFields =
        this.mandatoryFieldsForm.value.mandatoryFields;
      this.recruitingManagementService
        .insertDocument(this.generalInformationForm.value)
        .subscribe(
          (event) => {
            if (event instanceof HttpResponse) {
              // if(this.id){
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Mandatory_Fields_Edited'), null, {
              //     duration: 3000,
              //   });
              // }
              // else{
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Mandatory_Fields_Create'), null, {
              //     duration: 3000,
              //   });
              // }
            }
          },
          (error) => {
            this.snackBar.open('Error');
          }
        );
    } else if (currentStep === 3) {
      this.generalInformationForm.value.id = this.jobOeningId;
      this.generalInformationForm.value.customFields = selectedCustomFields
        ? selectedCustomFields.id
        : '';
      this.recruitingManagementService
        .insertDocument(this.generalInformationForm.value)
        .subscribe(
          (event) => {
            if (event instanceof HttpResponse) {
              // if(this.id){
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Custom_fields_Edited'), null, {
              //     duration: 3000,
              //   });
              // }
              // else{
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Custom_fields_Created'), null, {
              //     duration: 3000,
              //   });
              // }
            }
          },
          (error) => {
            this.snackBar.open('Error');
          }
        );
    } else if (currentStep === 4) {
      this.generalInformationForm.value.id = this.jobOeningId;
      this.generalInformationForm.value.videoAssessment = this.videoAssessment;
      this.recruitingManagementService
        .insertDocument(this.generalInformationForm.value)
        .subscribe(
          (event) => {
            if (event instanceof HttpResponse) {
              // if(this.id){
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Video_Assessment_Edited'), null, {
              //     duration: 3000,
              //   });
              // }
              // else{
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Video_Assessment_Created'), null, {
              //     duration: 3000,
              //   });

              // }
            }
          },
          (error) => {
            this.snackBar.open('Error');
          }
        );
    } else if (currentStep === 5) {
      //this.generalInformationForm.value.quizFields = this.quizForm.value.quizFields
      this.selected = []
      if(this.quizSequence.length > 0){
        this.quizSequence.forEach(element => {
          if(element.checked){
            this.selected.push(element.id)
          }
        });
      }
      else{
        this.quizTableData.forEach(element => {
          if(element.checked){
            this.selected.push(element.id)
          }
        });
      }
      this.generalInformationForm.value.quizFieldId = this.selected;
      this.generalInformationForm.value.quizSequence = this.quizSequence;
      this.generalInformationForm.value.id = this.jobOeningId;
      this.recruitingManagementService
        .insertDocument(this.generalInformationForm.value)
        .subscribe(
          (event) => {
            if (event instanceof HttpResponse) {
              // if(this.id){
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Quiz_Assessment_Edited'), null, {
              //     duration: 3000,
              //   });
              //   this.createQRCode(this.jobOeningId);
              // }
              // else{
              //   this.snackBar.open(this.translate.instant('JOB_OPENING.Quiz_Assessment_Created'), null, {
              //     duration: 3000,
              //   });
              // }
              this.createQRCode(this.jobOeningId);
            }

          },
          (error) => {
            this.snackBar.open('Error');
          }
        );
    }
  }

  changeSiteName(event) {
    if (event) {
      const sitesName = event && event.length > 0 ? event[0] : null;
      let siteData = this.jobOpeningSites.filter((b) => {
        return b && b.name === sitesName;
      });

      const siteCityArray = [];
      event.forEach((c) => {
        const siteCityFilter = this.jobOpeningSites.filter((b) => {
          return b && b.name === c;
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

      this.generalInformationForm.controls.address.setValue(siteAddress);
      this.generalInformationForm.controls.city.setValue(siteCityName);
    }
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

  mergeArrayFunction(customFieldsQuestion, customFieldsAnswer): any {
    customFieldsQuestion.map((b) => {
      const dataFilter = customFieldsAnswer.filter((c) => c.id === b.id)[0];
      b.question = dataFilter ? dataFilter.question : b.question;
      b.checked = dataFilter ? dataFilter.checked : b.checked;
      return b;
    });
    return customFieldsQuestion;
  }

  async loadQuiz() {
    const quizTableData: any =
      await this.recruitingManagementService.getQuizJobList('recruitmentquiz');
    this.quizTableData = quizTableData.data;
    console.log('this.quizTableData',this.quizTableData);

    var that = this;
    this.quizTableData.forEach(function(e){
      if(that.selected.indexOf(e.id) > -1){
        e.checked = true;
      }else{
        e.checked = false;
      }
    })

    setTimeout(() => {
      if(this.jobOpeningdata && this.jobOpeningdata.length > 0){
        const filterArray = (arr1,arr2) => {
          const filtered = arr1.filter(el => {
             return arr2.indexOf(el) === -1;
          });
          return filtered;
       };

       var sequenceArr :any = [];
       var quizArrayArr :any = [];
       this.jobOpeningdata.forEach(element => {
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

        this.jobOpeningdata.forEach(element => {
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
      this.quizFields.push(
        this._formBuilder.group({ id: c.id, title: c.title })
      );
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    var that = this;
    if (this.quizSequence.length > 0) {
      moveItemInArray(
        this.quizSequence,
        event.previousIndex,
        event.currentIndex
      );
      this.table.renderRows();
      this.quizSequence = this.quizSequence;
      this.quizSequence.forEach(function(e){
        if(that.selected.indexOf(e.id) > -1){
          e.checked = true;
        }else{
          e.checked = false;
        }
      })
    } else {
      moveItemInArray(
        this.quizTableData,
        event.previousIndex,
        event.currentIndex
      );
      this.table.renderRows();
      this.quizSequence = this.quizTableData;
      this.quizSequence.forEach(function(e){
        if(that.selected.indexOf(e.id) > -1){
          e.checked = true;
        }else{
          e.checked = false;
        }
      })
    }

    this.selected = [];
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

    //this.selected = [];
    // var that = this;
    // this.quizTableData.forEach(function (e) {
    //   if (e.checked) {
    //     if(that.selected.includes(e.id)){
    //       var index = that.selected.indexOf(e.id);
    //       if(index == -1){
    //         // this.selected.splice(index,1);
    //         that.selected.push(e.id);
    //       }
    //     }
    //   }
    // });
  }

  quizChange(event, id, index): void {
    if (event.checked) {
      if(this.quizSequence){
        this.quizSequence[index].checked = true;
        this.selected.push(id);
      }
      else{
        this.quizTableData[index].checked = true;
        this.selected.push(id);
      }
    } else {
      if(this.quizSequence){
        this.quizSequence[index].checked = false;
        this.selected = this.selected.filter((b) => b !== id);
      }
      else{
        this.quizTableData[index].checked = false;
        this.selected = this.selected.filter((b) => b !== id);
      }
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
        this._formBuilder.group({
          id: c.id,
          title: c.title,
        })
      );
    });
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

  toggleAllSelection(){
    this.selected = []
    if(this.allSelected){
      //this.selected = [];
      if(this.quizSequence.length > 0){
        for (var i = 0; i < this.quizSequence.length; i++) {
          this.quizSequence[i].checked = true
          this.selected.push(this.quizSequence[i].id);
        }
      }
      else{
        for (var i = 0; i < this.quizTableData.length; i++) {
          this.quizTableData[i].checked = true
          this.selected.push(this.quizTableData[i].id);
        }
      }
    } else{
      this.selected = [];
      if(this.quizSequence.length > 0){
        for (var i = 0; i < this.quizSequence.length; i++) {
          this.quizSequence[i].checked = false
        }
      }
      else{
        for (var i = 0; i < this.quizTableData.length; i++) {
          this.quizTableData[i].checked = false
        }
      }
    }
  }

  filterMandatoryFields(jobOpeningMandatory, mandatoryFieldsData): any {
    jobOpeningMandatory = jobOpeningMandatory ? jobOpeningMandatory : [];
    mandatoryFieldsData = mandatoryFieldsData ? mandatoryFieldsData : [];
    return jobOpeningMandatory.map((t1) => ({
      ...t1,
      ...mandatoryFieldsData.find((t2) => t2.id === t1.id),
    }));
  }

  async getjobOpening(){
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    this.url = null;
     this.jobOpeningdata =
      await this.recruitingManagementService.getJobOpeningById(this.id);
      console.log('this.jobOpeningdata>>>>>>', this.jobOpeningdata);

      this.generalInformationForm.patchValue({
      id: this.jobOpeningdata.data.id,
      scope: this.jobOpeningdata.data.scope,
      //area: this.jobOpeningdata.data.area,
      longDescription: this.jobOpeningdata.data.longDescription ? this.jobOpeningdata.data.longDescription : null,
      description: this.jobOpeningdata.data.description,
      successMessage: this.jobOpeningdata.data.successMessage,
      start: this.jobOpeningdata.data.start,
      end: this.jobOpeningdata.data.end,
      status: this.jobOpeningdata.data.status,
      site: this.jobOpeningdata.data.site,
      city: this.jobOpeningdata.data.city,
      type: this.jobOpeningdata.data.type,
      address: this.jobOpeningdata.data.address,
      jobType: this.jobOpeningdata.data.jobType,
      jobImageId: this.jobOpeningdata.data.jobImageId,
      noOfOpening: this.jobOpeningdata.data.noOfOpening,
      totalExperience: this.jobOpeningdata.data.totalExperience,
      isCandidateRead: this.jobOpeningdata.data.isCandidateRead
      })
      if (this.jobOpeningdata.data.jobImageId) {
        this.recruitingManagementService
          .getUploadDocument({ id: this.jobOpeningdata.data.jobImageId })
          .then((data) => {
            this.url = data.data;
          });
      }
      if (this.jobOpeningdata.data.scope) {
        this.onChangeScope(this.jobOpeningdata.data.scope);
        var areaForEditForm = this.areaList.find((x) => x.name == this.jobOpeningdata.data.area)
        this.generalInformationForm.patchValue({
          area: areaForEditForm ? areaForEditForm.id : "",
        })
      }
      if (Array.isArray(this.jobOpeningdata.data.quizFieldId)) {
        this.selected = this.jobOpeningdata.data.quizFieldId;
        var that = this;

        if (this.jobOpeningdata.data.quizSequence.length > 0){
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

      if (Array.isArray(this.jobOpeningdata.data.customFields)) {
        this.selectedCustomFields = this.jobOpeningdata.data.customFields[0];
        this.customFieldsData.forEach((element) => {
          element.checked = element.id == this.selectedCustomFields;
        });
      }
      if (this.jobOpeningdata.data.mandatoryFields) {
        const arr = this.mandatoryFieldsForm.controls.mandatoryFields as FormArray;
        arr.controls = [];
        const filterData: any = this.filterMandatoryFields(
          this.jobOpeningMandatory,
          this.jobOpeningdata.data.mandatoryFields
        );
        filterData.forEach((b: any) => {
          this.mandatoryFields.push(this._formBuilder.group(b));
        });
        // this.mandatoryFields$ = this.fb.array([]);
        this.jobOpeningdata.data.mandatoryFields.forEach((b, i) => {
          // this.mandatoryFields.at(i).patchValue(b);
        });
      }

      if (
        this.jobOpeningdata.data.customFields &&
        Array.isArray(this.jobOpeningdata.data.customFields) &&
        this.jobOpeningdata.data.customFields.length > 0
      ) {
        this.customFieldsAnswer = this.jobOpeningdata.data.customFields;
        this.customFieldsQuestion = this.mergeArrayFunction(
          this.customFieldsQuestion,
          this.customFieldsAnswer
        );
      }

      if (
        this.jobOpeningdata.data.videoAssessment &&
        Array.isArray(this.jobOpeningdata.data.videoAssessment) &&
        this.jobOpeningdata.data.videoAssessment.length > 0
      ) {
        this.videoAssessmentAnswer = this.jobOpeningdata.data.videoAssessment;
        this.videoAssessment = this.mergeArrayFunction(
          this.videoAssessment,
          this.videoAssessmentAnswer
        );
      }
      if(this.jobOpeningdata.data.quizSequence != null) {
        this.quizSequence = this.jobOpeningdata.data.quizSequence;
        console.log('this.quizSequence>>>>', this.quizSequence);
        if(this.quizSequence.length != this.quizTableData.length){
          let array: any  = this.quizTableData.filter(x => !this.quizSequence.includes(x.title))
          this.quizSequence = array
        }
    }
  }

  async createQRCode(jobDetailsId: any){
    // this.copyURL = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_QRCODE_PARAM_URL).replace("##ID##",jobDetailsId).replace('api/','');
    this.copyURL = `${environment.home_page}${jobDetailsId}`;
    var that = this;
    this.recruitingManagementService
        .createQRCode(jobDetailsId)
        .subscribe(
          (event) => {
            if (event instanceof HttpResponse) {
              that.qrCodeURL = event.body.data.qrcode;
            }
          },
          (error) => {
            this.snackBar.open('Error');
          }
        );
        }

  copyBoardURL(): void {
    this.snackBar.open(
      this.translate.instant('GENERAL.COPY_JOB_OPENING_SUCCESSFULLY'),
      this.translate.instant('GENERAL.OK'),
      { duration: 3000 }
    );
  }

  streamOpened(){
    if (localStorage.getItem('currentLanguage') == 'it'){
      this._adapter.setLocale('it-IT');
    }else {
      this._adapter.setLocale('eg-EG');
    }
  }

  move(index: number) {
    this.stepper.selectedIndex = index;
  }
/*  validate(){
    if(this.generalInformationForm.valid){
      this.generalInformationForm.valid;
    }else{
      this.generalInformationForm.invalid;
    }
  }*/
}
