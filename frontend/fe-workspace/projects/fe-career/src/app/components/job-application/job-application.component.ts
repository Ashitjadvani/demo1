import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    STEPPER_GLOBAL_OPTIONS,
    StepperSelectionEvent,
} from '@angular/cdk/stepper';
import { CareerApiService } from '../../service/careerApi.service';
import { ActivatedRoute } from '@angular/router';
import { CareerHelperService } from '../../service/careerHelper.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, Location } from '@angular/common';
import {
    CountdownComponent,
    CountdownConfig,
    CountdownEvent,
} from 'ngx-countdown';
import { MatStepper } from '@angular/material/stepper';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HelperService } from 'projects/fe-procurement/src/app/service/helper.service';

export const PICK_FORMATS = {
    parse: {
        parse: { dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' } },
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'D MMM YYYY',
    }
};

@Component({
    selector: 'app-job-application',
    templateUrl: './job-application.component.html',
    styleUrls: ['./job-application.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'it' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    ],
})
export class JobApplicationComponent implements OnInit {
    readonly minAge = 20;
    maxDob: Date;
    currentYear: number = new Date().getFullYear();
    durationTime: any;
    constructor(
        private _formBuilder: FormBuilder,
        private apiService: CareerApiService,
        public activeRoute: ActivatedRoute,
        private helper: CareerHelperService,
        private translate: TranslateService,
        private location: Location,
        private _adapter: DateAdapter<any>
    ) {
        this.jobId = this.activeRoute.snapshot.paramMap.get('id');
        const user: any = CareerHelperService.loginUserData
            ? CareerHelperService.loginUserData.user
            : {};
        this.jobApplicationForm = this._formBuilder.group({
            id: [null],
            opening_id: [this.jobId],
            nome: [user.nome],
            cognome: [user.cognome], // surname
            email: [user.email],
            telefono: [''], // telephone number Validators.pattern(/^-?(0|[1-9]\d*)?$/)
            data_nascita: [''], // date of birth
            azienda: [''], // agency
            titolo: [''], // title
            sesso: [''], // sex
            nationality: [''],
            livello_studi: [''], // study_level
            univ_id: [''], // univ_id
            laurea_id: [''], // degree_id
            indirizzo: [''], // address
            cityName: [''],
            stateName: [''],
            countryName: [''],
            degreeYear: ['', [Validators.min(1900), Validators.max(this.currentYear)]],
            step: [1],
            voto_laurea: [
                '',
                [Validators.required, Validators.min(66), Validators.max(110)],
            ],
            scoreAverage: [
                '',
                [Validators.required, Validators.min(18), Validators.max(30)],
            ],
            universityOther: [''],
            degreeOther: [''],
            materDescription: [''],
            stateExamination: [false],
            doctorateDescription: [''],
            isReadMaster: [false],
            isReadDoctorate: [false],
            isReadState: [false],
            resumeId: [''],
            videoId: [''],
            lode: [false],
            lodeMaster: [''],
            lodeDoctorate: [''],
            applicationStatus: ['']
        });

        this.personalDetailsForm = this._formBuilder.group({
            step: [2],
            customFields: this._formBuilder.array([]),
        });

        this.videoAssessmentForm = this._formBuilder.group({});

        this.quizeFormGroup = this._formBuilder.group({
            step: [4],
            quizFields: this._formBuilder.array([]),
        });

        this.questionGroup = this._formBuilder.group({
            givenAnswer: [null],
        });
    }

    get customFields(): FormArray {
        return this.personalDetailsForm.get('customFields') as FormArray;
    }

    get quizFields(): FormArray {
        return this.quizeFormGroup.get('quizFields') as FormArray;
    }
    @ViewChild('stepper2') private myStepper: MatStepper;

    @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

    isLinear = true;
    valueSelected: string;
    submited = false;
    resumeDetailsData: any;
    videoDetailsData: any;
    videoUploadSize: any;
    jobApplicationForm: FormGroup;
    personalDetailsForm: FormGroup;
    videoAssessmentForm: FormGroup;
    quizeFormGroup: FormGroup;
    customFormGroup: FormGroup;
    questionGroup: FormGroup;
    fileCoverImage2: any;
    fileCoverInfo2: any;
    filePDF2: any;
    fileCovervideo: any;
    fileCoverImage: any;
    fileCoverInfo: any;
    filePDF: any;
    fileToUpload: File | null = null;
    videoToUpload: File | null = null;
    fileId: any;
    universities: any = [];
    degrees: any = [];
    quizes: any = [];
    customFieldsApplication: any = [];
    mandatoryFieldsApplication: any = [];
    videoAssessmentApplication: any = [];
    mandatoryFields: any = [];
    jobId: any;
    application: any = {};
    levelEducation = [
        { id: 'not-graduated', name: 'OTHERS.NotGraduated' },
        { id: 'graduated', name: 'OTHERS.Graduation' },
    ];
    customFieldsBool = false;
    videoAssessmentBool = false;
    quizesBool = false;
    public lode: boolean;
    public lodeMaster: boolean;
    public lodeDoctorate: boolean;
    stepperCount = 1;
    stepperClickCount: any = [1];


    selected: any = null;
    quizSubmitted = false;
    applicationJobData: any = {};
    lodeChecked = false;
    saveDraftBool = false;
    questionView: any = {};

    leftTime = 0;
    notify = '';

    questionNumber = 0;

    surveyIndex = 0;
    questionIndex = 0;
    lastQuestion = false;
    customIndex = 0;

    /*loadSurveyQuestion(i, j): void {
      this.findSurvey();
    }*/

    viewTimer = false;
    progress = 100;
    myInterval: number;

    getContactsFormGroup(index): FormGroup {
        const contactList = this.quizeFormGroup.get('quizFields') as FormArray;
        return contactList.controls[index] as FormGroup;
    }

    async ngOnInit() {

        const today = new Date();
        this.maxDob = new Date(
            today.getFullYear() - this.minAge,
            today.getMonth(),
            today.getDate()
        );

        await this.apiService
            .getJobApplication({ jobId: this.jobId })
            .subscribe((data: any) => {
                this.application = data.data;
                if (this.application.additionDetailSurveyId[0] != '') {
                    this.apiService
                        .getAdditionalDetailBySurveyId({
                            survey_id: this.application.additionDetailSurveyId[0],
                        })
                        .subscribe((data: any) => {
                            this.customFieldsApplication = data.data;
                            this.customFieldsApplication[0].questionData.sort((a, b) => a.order - b.order);
                            this.customFieldsBool = this.customFieldsApplication.length > 0;
                            if (this.customFieldsBool) {
                                this.stepperCount += 1;
                            }
                            this.customFieldsApplication.forEach((b) => {
                                b.questionData.forEach((question) => {
                                    question.givenAnswer = '';
                                    let que: any = {
                                        id: question.id,
                                        checked: question.mandatory ? null : '',
                                        mandatory: question.mandatory,
                                    };
                                    this.customFields.push(this._formBuilder.group(que));
                                });
                            });
                            this.addAnswerValidation();
                        });
                }
                setTimeout(() => {
                    this.getJobDetails();
                }, 200);
                this.mandatoryFieldsApplication = this.application.mandatoryFields
                    ? this.application.mandatoryFields
                    : [];
                this.videoAssessmentApplication = this.application.videoAssessment
                    ? this.application.videoAssessment
                    : [];

                this.videoAssessmentBool = this.videoAssessmentApplication.length > 0;
                if (this.videoAssessmentBool) {
                    this.stepperCount += 1;
                }

                this.mandatoryFields = this.application.mandatoryFields;
                this.apiService
                    .getQuizByID({
                        survey: this.application.quizFieldId,
                        opening_id: this.jobApplicationForm.value.opening_id,
                    })
                    .subscribe((data: any) => {
                        this.quizes = data.data;
                        this.quizesBool = this.quizes.length > 0;
                        if (this.quizesBool) {
                            this.stepperCount += 1;
                        }
                    });

            });
        this.apiService.getUniversity().subscribe((data: any) => {
            this.universities = data.data;
            this.universities.push({ description: 'Other', id: 'other' });
        });

        this.apiService.getDegree().subscribe((data: any) => {
            this.degrees = data.data;
            this.degrees.push({ description: 'Other', id: 'other' });
        });
    }

    async getJobDetails() {
        await this.apiService
            .getApplicationById({ jobId: this.jobId })
            .subscribe((data: any) => {
                const resumeDetails = data.data.resumeId;
                const customFields = data.data.customFields;
                if (resumeDetails) {
                    this.apiService
                        .getUploadedfileDetails({ id: resumeDetails })
                        .subscribe((data: any) => {
                            const imageDetails = data.data;
                            this.resumeDetailsData = imageDetails
                                ? imageDetails.file
                                : null;
                            // this.jobApplicationForm.patchValue({resumeId: imageDetails.id});
                        });
                }

                const videoDetails = data.data.videoId;
                if (videoDetails) {
                    this.apiService
                        .getUploadedfileDetails({ id: videoDetails })
                        .subscribe((data: any) => {
                            const videoDetails = data.data;
                            this.videoDetailsData = videoDetails
                                ? videoDetails.file +
                                ' (' +
                                this.formatBytes(videoDetails.size) +
                                ')'
                                : null;
                        });
                }

                const applicationJob = data.data;
                this.applicationJobData = data.data;
                if (applicationJob) {
                    this.jobApplicationForm.patchValue({
                        opening_id: this.jobId,
                        nome: applicationJob.nome,
                        cognome: applicationJob.cognome,
                        email: applicationJob.email,
                        telefono: applicationJob.telefono,
                        data_nascita: applicationJob.data_nascita,
                        azienda: applicationJob.azienda,
                        titolo: applicationJob.titolo,
                        sesso: applicationJob.sesso,
                        nationality: applicationJob.nationality,
                        livello_studi: applicationJob.livello_studi,
                        univ_id: applicationJob.univ_id,
                        laurea_id: applicationJob.laurea_id,
                        indirizzo: applicationJob.indirizzo,
                        cityName: applicationJob.cityName,
                        stateName: applicationJob.stateName,
                        countryName: applicationJob.countryName,
                        degreeYear: applicationJob.degreeYear,
                        universityOther: applicationJob.universityOther,
                        degreeOther: applicationJob.degreeOther,
                        step: applicationJob.step,
                        voto_laurea: applicationJob.voto_laurea,
                        scoreAverage: applicationJob.scoreAverage,
                        materDescription: applicationJob.materDescription,
                        stateExamination: applicationJob.stateExamination,
                        resumeId: applicationJob.resumeId,
                        videoId: applicationJob.videoId,
                        doctorateDescription: applicationJob.doctorateDescription,
                        isReadMaster: applicationJob.isReadMaster,
                        isReadDoctorate: applicationJob.isReadDoctorate,
                        isReadState: applicationJob.isReadState,
                        lode: applicationJob.lode,
                    });
                    if (
                        applicationJob &&
                        applicationJob.customFields.length > 0 &&
                        this.customFieldsApplication.length > 0
                    ) {
                        this.customFieldsApplication.forEach((b) => {
                            b.questionData.forEach((question, index) => {
                                var isChecked: any;
                                if (
                                    question.type == 'singleRadio' ||
                                    question.type == 'singleCheck'
                                ) {
                                    var answer = question.answers.find(a => a.value == customFields[index].answer);
                                    isChecked = answer ? answer.id : '';
                                    question.givenAnswer = isChecked;
                                } else {
                                    isChecked = customFields[index].answer;
                                    question.givenAnswer = customFields[index].answer;
                                }

                                let que: any = {
                                    id: customFields[index].id,
                                    checked: isChecked,
                                    mandatory: question.mandatory,
                                };

                                this.customFields.at(index).patchValue(que);
                            });
                        });
                    }
                    this.addValidation(this.mandatoryFieldsApplication);
                    this.resetValidation(applicationJob.livello_studi);
                }
            });
    }

    streamOpened() {
        if (localStorage.getItem('currentLanguage') == 'it') {
            this._adapter.setLocale('it-IT');
        } else {
            this._adapter.setLocale('eg-EG');
        }
    }

    findSurvey(isStart = true): void {
        const getSurvey = this.quizes[this.surveyIndex];
        const surveyIndex = this.surveyIndex;
        const lastQuestion = this.quizes[surveyIndex + 1];
        clearInterval(this.myInterval);
        if (this.quizes[this.surveyIndex]?.questionData[this.questionIndex]) {
            const getQuestion =
                this.quizes[this.surveyIndex].questionData[this.questionIndex];
            // this.questionIndex = this.questionIndex + 1;
            this.questionView = getQuestion;

            const totalQuestion = getSurvey.questionData.length;
            const totalQuestionLimit =
                getSurvey.numberOfQuestion >= getSurvey.questionData.length
                    ? getSurvey.numberOfQuestion
                    : getSurvey.questionData.length;

            this.questionView.numberOfQuestion = totalQuestionLimit - totalQuestion;
            this.questionView.numberOfQuestion =
                this.questionView.numberOfQuestion + 1;
            this.questionView.totalQuestion = totalQuestionLimit;

            this.questionView.disclaimer = getSurvey.disclaimer;
            this.questionView.givenAnswer = null;
            this.questionView.survey_id = getSurvey.surveyId;
            this.viewTimer = false;
            if (getQuestion && !this.questionView.isShowDisclaimer) {
                this.serverQuestionCountDown(isStart);
            }
            return getQuestion;
        } else if (lastQuestion) {
            this.myStepper.next();
            this.surveyIndex = this.surveyIndex + 1;
            this.questionIndex = 0;
            this.findSurvey(isStart);
        } else {
            this.myStepper.next();
            this.lastQuestion = true;
            return null;
        }
    }

    serverQuestionCountDown(isStart): void {
        this.progress = 100;
        if (this.questionView?.question_timer_status === false) {
            this.viewTimer = false;
        } else {
            this.viewTimer = true;
        }
        const minutes = this.questionView?.minutes
            ? this.questionView.minutes * 60
            : 0;
        const seconds = this.questionView?.seconds ? this.questionView.seconds : 0;
        this.leftTime = minutes + seconds;
        this.myInterval = setInterval(() => this.ProgressBar(), 2000);
        if (this.countdown) {
            this.countdown.restart();
        }
    }

    ProgressBar(): void {
        this.progress = (this.countdown.left / (this.leftTime * 1000)) * 100;
    }

    surveyButton(): void {
        if (!this.questionView.isShowDisclaimer) {
            const getAnswerData = this.questionView.answers.find((b) => {
                return b.id === this.questionView.givenAnswer;
            });
            const answerData = {
                opening_id: this.jobApplicationForm.value.opening_id,
                survey_id: this.questionView.survey_id,
                question_id: this.questionView.id,
                minutes: this.questionView.minutes,
                type: this.questionView.type,
                /*answer: {
                  //id: this.questionView.givenAnswer,
                  id: this.questionView.survey_id,
                  value: getAnswerData
                    ? getAnswerData.value
                    : this.questionView.givenAnswer,
                },*/
                answer: {
                    id: this.questionView.givenAnswer,
                    value: (getAnswerData) ? getAnswerData.value : this.questionView.givenAnswer
                }

            };

            this.removeSurveyQuestion();

            this.apiService.saveQuestionAnswer(answerData).subscribe((data: any) => {
                this.findSurvey();
            });
        } else {
            this.questionView.isShowDisclaimer = false;
            this.serverQuestionCountDown(true);
        }
    }

    removeSurveyQuestion(): void {
        if (
            this.quizes[this.surveyIndex]?.questionData &&
            this.quizes[this.surveyIndex].questionData.length > 0
        ) {
            this.quizes[this.surveyIndex].questionData.splice(0, 1);
        }
    }

    selectionChange(event: StepperSelectionEvent): void {
        const stepLabel = event.selectedStep.label;
        if (stepLabel === 'Quiz Step') {
            this.findSurvey(false);
            /*const getSurvey = null;
            const nextStepper = false;
            this.quizes.forEach((b, i) => {
                  if(b && Array.isArray(b.questionData) && b.questionData.length > 0 && !getSurvey) {
                    this.viewTimer = true;
                    getSurvey = b;
                    this.questionView = b.questionData[0];
                    this.questionView.givenAnswer = null;
                    this.questionView.survey_id = getSurvey.surveyId;
                    // this.leftTime = 20;
                    this.surveyIndex = i;
                    let minutes = (this.questionView?.minutes) ? this.questionView.minutes * 60 : 0;
                    let seconds = this.questionView?.seconds ? this.questionView.seconds : 0;
                    this.leftTime = minutes + seconds;
                  } else if (b && Array.isArray(b.questionData) && b.questionData.length === 0 && !getSurvey){
                    nextStepper = true;
                    this.myStepper.next();
                  }
            });*/
        }
    }

    getQuizAnswer(qa): any {
        let found = null;
        for (const b of this.quizes) {
            if (b.question === qa.question) {
                for (const c of b.answers) {
                    if (c.id === qa.givenAnswer) {
                        found = c;
                        break;
                    }
                }
            }
        }
        return found;
    }

    getCustomQuizAnswer(qa): any {
        let found = null;
        for (const b of this.customFieldsApplication) {
            if (b.question === qa.question) {
                for (const c of b.answers) {
                    if (c.id === qa.givenAnswer) {
                        found = c;
                        break;
                    }
                }
            }
        }
        return found;
    }

    changeEducationLevel(): void {
        this.jobApplicationForm.patchValue({
            scoreAverage: null,
            materDescription: null,
            doctorateDescription: null,
            stateExamination: null,
            laurea_id: null,
            degreeOther: null,
            degreeYear: null,
            isReadMaster: false,
            isReadDoctorate: false,
            isReadState: false,
            voto_laurea: null,
            lode: false,
        });

        // this.resetValidation(this.jobApplicationForm.value.livello_studi);
        // this.clearAddEducationValidation(this.jobApplicationForm.value.livello_studi);
        // this.addedDegreeValidation();
        this.resetValidation(this.jobApplicationForm.value.livello_studi);
    }

    changeIsRead(e, type): void {
        if (!e) {
            this.jobApplicationForm.patchValue({
                [type]: null,
            });
        }
        this.addedDegreeValidation();
    }

    back() {
        this.location.back();
    }

    previousButton(tag): void {
        //if (tag !== this.stepperCount) {
        this.stepperClickCount.pop();
        // }
    }

    onChange(index: any, event: any) {
        this.selected = event.source.value;
        const interests: any = this.quizFields.at(index).value;
        interests.givenAnswer = event.source.value;
        this.quizFields.at(index).patchValue(interests);
    }

    addValidation(mandatoryFields): any {
        mandatoryFields.forEach((b) => {
            this.jobApplicationForm.get(b.id).setValidators([Validators.required]);
            this.jobApplicationForm.get(b.id).updateValueAndValidity();
        });
    }

    addAnswerValidation(): any {
        const groupItems: any = (this.personalDetailsForm.get('customFields') as FormArray).controls;
        for (const item of groupItems) {
            if (item.get('mandatory').value) {
                item.controls.checked.setValidators([Validators.required, HelperService.noWhitespaceValidator]);
            }
        }
    }

    formatBytes(bytes: number): string {
        const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const factor = 1024;
        let index = 0;
        while (bytes >= factor) {
            bytes /= factor;
            index++;
        }
        return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    async onVideoUpload(input: HTMLInputElement): Promise<void> {
      console.log('Changed');
        await this.fileSelected(input, event);
        /*if (input.files[0].type === 'video/mp4'){
          if (this.durationTime < 180){
            this.videoToUpload = input.files[0];
            this.fileCovervideo = this.videoToUpload;
            this.videoDetailsData = `${this.videoToUpload.name} (${this.formatBytes(
              this.videoToUpload.size
            )})`;
            // this.videoUploadSize = formatBytes(this.videoToUpload.size); //size in MB
            this.videoUploadSize = this.videoToUpload.size / (1024 * 1024);
            var inputBox = document.getElementById("upload_btn_video")
            this.uplodeFile(this.videoToUpload, 'cv').then(
              (fileId) => {
                this.jobApplicationForm.patchValue({
                  videoId: fileId,
                });
              }
            )
          }else {
            swal.fire(
              'Error!',
              this.translate.instant('videoUploadBelow3min'),
              'error'
            )
          }
        }else {
          swal.fire(
            'Error!',
            this.translate.instant('mp4FileUploadRequired'),
            'error'
          )
        }*/

        // @ts-ignore
        // this.fileToUpload=input.files[0];
        // this.fileCoverImage = this.fileToUpload;
        // this.fileCoverInfo = `${this.fileToUpload.name} (${formatBytes(this.fileToUpload.size)})`;
    }


    async fileSelected(input, e: Event): Promise<void> {
      let that = this;
      //var attachedFile = <File>event.target.files[0]
      var attachedFile = (<HTMLInputElement>e.target).files[0];
      //let duration:any;
      //here you can check the file type for attachedFile either video or audio
      if (attachedFile.type === 'video/mp4'){
        var video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          var duration = video.duration;
          that.durationTime = video.duration;
          console.log('that.durationTime>>>>', that.durationTime);
          if (that.durationTime < 180){
            that.videoToUpload = attachedFile;
            that.fileCovervideo = that.videoToUpload;
            that.videoDetailsData = `${that.videoToUpload.name} (${that.formatBytes(
              that.videoToUpload.size
            )})`;
            // that.videoUploadSize = formatBytes(that.videoToUpload.size); //size in MB
            that.videoUploadSize = that.videoToUpload.size / (1024 * 1024);
            that.uplodeFile(that.videoToUpload, 'cv').then(
              (fileId) => {
                that.jobApplicationForm.patchValue({
                  videoId: fileId,
                });
              }
            )
          }else {
            swal.fire(
              'Error!',
              that.translate.instant('videoUploadBelow3minUpdate'),
              'error'
            )
          }
        }
      }else {
        swal.fire(
          'Error!',
          that.translate.instant('mp4FileUploadRequiredUpdate'),
          'error'
        )
      }
      video.src = URL.createObjectURL(attachedFile);
      if (attachedFile.type !== 'video/mp4'){
        swal.fire(
          'Error!',
          that.translate.instant('mp4FileUploadRequired'),
          'error'
        )
      }
    }

    onCoverImage(input: HTMLInputElement): void {
        if (input.files[0].type === 'application/pdf') {
            this.fileToUpload = input.files[0];
            this.fileCoverImage = this.fileToUpload;
            this.resumeDetailsData = `${this.fileToUpload.name} (${this.formatBytes(
                this.fileToUpload.size
            )})`;
            this.uplodeFile(this.fileToUpload, 'video').then(
                (fileId) => {
                    console.log("fileId", fileId)
                    this.jobApplicationForm.patchValue({
                        resumeId: fileId,
                    });
                }
            )
            // this.jobApplicationForm.patchValue({
            //   resumeId: '1111111',
            // });
        } else {
            swal.fire(
                'Info!',
                this.translate.instant('JOBAPPLICATION.PleaseUploadTheCVASAPDFFile'),
                'info'
            );
        }
    }

    resetCoverValue(): void {
        this.filePDF = null;
        this.resumeDetailsData = null;
        this.applicationJobData.resumeId = null;
        this.jobApplicationForm.patchValue({
            resumeId: null
        })
    }

    resetCoverValue2(): void {
        this.filePDF2 = null;
        this.videoDetailsData = null;
        this.applicationJobData.videoId = null;
        this.jobApplicationForm.patchValue({
            videoId: null
        })
    }

    // upload file
    uplodeFile(fileToUpload, type): any {
        return new Promise((resolve, reject) => {
            if (fileToUpload) {
                const formData: FormData = new FormData();
                formData.append('file', fileToUpload);
                this.apiService.uploadPdf(formData).subscribe(
                    (data: any) => {
                        this.fileId = data.fileId;
                        if (type === 'cv') {
                            this.fileToUpload = null;
                        } else if (type === 'video') {
                            this.videoToUpload = null;
                        }
                        resolve(this.fileId);
                    },
                    (error) => {
                        resolve(null);
                    }
                );
            } else {
                resolve(null);
            }
        });
    }

    saveVideo(): void {
        if (this.videoAssessmentForm.valid) {
            this.saveFinalMyApplication('step3');
        }
    }
    saveDraft() {
        this.saveDraftBool = true;
        this.saveStepOne();
    }

    saveStepOne(): void {
        // this.jobApplicationForm.markAllAsTouched();
        if (this.jobApplicationForm.valid) {
            this.saveFinalMyApplication('step1');
        } else {
            if (this.jobApplicationForm.controls.resumeId.errors?.required) {
                swal.fire(
                    'Info!',
                    this.translate.instant('JOBAPPLICATION.PleaseUploadTheCV'),
                    'info'
                );
            }
            return;
        }
    }

    saveStepOneDraft() {
        this.apiService
            .statusDraft({ jobId: this.jobId })
            .subscribe((data: any) => { });
    }

    saveStepSant() {
        this.apiService
            .statusSent({ jobId: this.jobId })
            .subscribe((data: any) => { });
    }

    saveQuizFields(type): void {
        this.quizSubmitted = true;
        const that = this;
        if (this.quizeFormGroup.valid) {
            this.saveFinalMyApplication('step4');
            const answerData = {
                opening_id: this.jobApplicationForm.value.opening_id,
                survey_id: this.questionView.survey_id,
                question_id: this.questionView.id,
                minutes: this.questionView.minutes,
                type: this.questionView.type,
                answer: {
                    id: null,
                    value: null,
                },
            };
            if (!this.questionView.isShowDisclaimer) {
                this.apiService
                    .saveQuestionAnswer(answerData)
                    .subscribe((data: any) => { });
            }
        }
    }

    skipQuestion(): void {
        if (!this.questionView.isShowDisclaimer) {
            const answerData = {
                opening_id: this.jobApplicationForm.value.opening_id,
                survey_id: this.questionView.survey_id,
                question_id: this.questionView.id,
                minutes: this.questionView.minutes,
                type: this.questionView.type,
                answer: {
                    id: null,
                    value: null,
                },
            };
            this.removeSurveyQuestion();
            this.apiService
                .saveQuestionAnswer(answerData)
                .subscribe((data: any) => { });
        }
    }

    saveCustomDrafts(): void {
        this.personalDetailsForm.markAllAsTouched();
        if (this.personalDetailsForm.valid) {
            // this.jobApplicationForm.value.customFields =
            //   this.personalDetailsForm.value.customFields;
            this.saveFinalMyApplication('step2');
        }
    }

    saveMyApplication(count): void {
        if (this.stepperClickCount.length === this.stepperCount) {
            this.quizSubmitted = true;
            if (count === 2) {
                if (this.jobApplicationForm.valid) {
                    this.saveFinalMyApplication('step1', 0);
                }
                else{
                    if (this.jobApplicationForm.controls.resumeId.errors?.required) {
                        swal.fire(
                            'Info!',
                            this.translate.instant(
                                'JOBAPPLICATION.PleaseUploadTheCVASAPDFFile'
                            ),
                            'info'
                        );
                    }
                }
            } else {
                if (this.quizeFormGroup.valid) {
                    this.saveFinalMyApplication('step5', 0);
                }
            }
        } else if (count === 2) {
            if (this.jobApplicationForm.valid) {
                this.stepperClickCount.push(count);
                this.stepperClickCount = [...new Set(this.stepperClickCount)];
            } else {
                if (this.jobApplicationForm.controls.resumeId.errors?.required) {
                    swal.fire(
                        'Info!',
                        this.translate.instant(
                            'JOBAPPLICATION.PleaseUploadTheCVASAPDFFile'
                        ),
                        'info'
                    );
                }
            }
        } else if (count === 3) {
            this.submited = true
            if (this.personalDetailsForm.valid) {
                this.stepperClickCount.push(count);
                this.stepperClickCount = [...new Set(this.stepperClickCount)];
            }
        } else {
            this.stepperClickCount.push(count);
            this.stepperClickCount = [...new Set(this.stepperClickCount)];
        }
    }

    saveFinalMyApplication(step, isDraft = 1): void {
        this.helper.toggleSidebarVisibility(true);

        if(step === 'step1'){
            this.step1()
            this.jobApplicationForm.value.applicationStatus = 'Draft'
            this.saveApplicationApiCall(isDraft);
        }
        if(step === 'step2'){
            let check = this.step2();
            this.jobApplicationForm.value.applicationStatus = 'Draft'
            if(check){
            this.saveApplicationApiCall(isDraft);
            }
        }
        if(step === "step3"){
            this.step3();
            let check = this.step2();
            this.jobApplicationForm.value.applicationStatus = 'Draft';
            if(check){
            this.saveApplicationApiCall(isDraft);
            }
        }
        if(step === "step4"){
            this.step3();
            let check = this.step2();
            this.step4();
            this.jobApplicationForm.value.applicationStatus = 'Draft';
            if(check){
            this.saveApplicationApiCall(isDraft);
            }
        }
        if(step === "step5"){
            this.step1();
            this.step3();
            let check = this.step2();
            this.step4();
            this.jobApplicationForm.value.applicationStatus = '';
            this.helper.toggleSidebarVisibility(false);
            if(check){
            this.saveApplicationApiCall(isDraft);
            }

        }
        // if (step === 'step1' || step === 'step5') {
        //     if(!this.jobApplicationForm.value.resumeId){
        //         this.jobApplicationForm.value.resumeId =
        //          this.applicationJobData && this.applicationJobData.resumeId
        //         ? this.applicationJobData.resumeId
        //         : null;
        //     }
        //     this.applicationJobData.resumeId =
        //         this.jobApplicationForm.value.resumeId;
        // }
        // if (step === 'step4' || step === 'step3' || step === 'step5') {
        //     if(!this.jobApplicationForm.value.videoId){
        //         this.jobApplicationForm.value.videoId =
        //          this.applicationJobData && this.applicationJobData.videoId
        //         ? this.applicationJobData.videoId
        //         : null;
        //     }
        //     this.applicationJobData.videoId =
        //         this.jobApplicationForm.value.videoId;
        //     this.jobApplicationForm.value.videoAssessment =
        //         this.videoAssessmentApplication;
        // }
        // save custom filed information
        // if (
        //     step === 'step2' ||
        //     step === 'step5' ||
        //     step === 'step4' ||
        //     step === 'step3'
        // ) {


            // // this.personalDetailsForm.value.customFields.map((b) => {
            // //   b.answers = this.getCustomQuizAnswer(b);
            // //   return b;
            // // });

            // this.jobApplicationForm.value.customFields =
            //   this.personalDetailsForm.value.customFields;
        // }
        // save quiz information
        // if (step === 'step4' || step === 'step5') {
        //     this.quizeFormGroup.value.quizFields.map((b) => {
        //         b.answers = this.getQuizAnswer(b);
        //         return b;
        //     });
        //     this.jobApplicationForm.value.quizFields =
        //         this.quizeFormGroup.value.quizFields;
        // }
        // if (step === 'step1' || step === 'step2' || step === 'step3' || step === 'step4') {
        //     this.jobApplicationForm.value.applicationStatus = 'Draft'
        // } else {
        //     this.jobApplicationForm.value.applicationStatus = ''
        // }

    }

    saveApplicationApiCall(isDraft){
        this.apiService
            .saveApplication(this.jobApplicationForm.value)
            .subscribe(
                (data: any) => {
                    this.helper.toggleSidebarVisibility(false);
                    if (data.result && isDraft) {
                        this.saveStepOneDraft();
                        swal.fire(
                            this.translate.instant('GENERAL.success'),
                            this.translate.instant(data.reason),
                            'success'
                        );
                    } else if (!isDraft) {
                        this.saveStepSant();
                    }
                    if (!data.result) {
                        swal.fire(
                            this.translate.instant('GENERAL.Sorry'),
                            this.translate.instant(data.reason),
                            'info'
                        );
                    }
                },
                (err) => {
                    this.helper.toggleSidebarVisibility(false);
                    const e = this.translate.instant(err.result.reson);
                    swal.fire(this.translate.instant('GENERAL.Sorry'), e, 'info');
                }
            );
    }
    step1(){
        if(!this.jobApplicationForm.value.resumeId){
            this.jobApplicationForm.value.resumeId =
             this.applicationJobData && this.applicationJobData.resumeId
            ? this.applicationJobData.resumeId
            : null;
        }
        this.applicationJobData.resumeId =
            this.jobApplicationForm.value.resumeId;
    }
    step2(){
        var customFields: any = [];

        let mandatoryQusIds: any[] = []
        let ansMadatoryQusIds: any[] = []
            this.customFieldsApplication.forEach(element => {
                element.questionData.forEach(qus => {
                    var givenAnswer = qus.givenAnswer;
                    let getAnswerData = qus.answers.find((b) => {
                        return b.id === givenAnswer;
                    });

                    if (qus.type == 'FreeText') {
                        getAnswerData = {
                            value: ''
                        };
                        getAnswerData.value = givenAnswer;
                    }

                    if (getAnswerData) {
                        let customField = {
                            answer: getAnswerData.value,
                            checked: true,
                            id: qus.id,
                            question: qus.question
                        }
                        customFields.push(customField);
                        // return true
                    } else {
                        if (qus.mandatory) {
                            swal.fire(
                                'Info!',
                                this.translate.instant(
                                    'JOBAPPLICATION.PleaseUploadTheCVASAPDFFile'
                                ),
                                'info'
                            );
                            // return false
                        }
                    }

                });
            });
            this.jobApplicationForm.value.customFields = customFields;
            if(this.customFieldsApplication[0] && this.customFieldsApplication[0].questionData.length > 0){
                let questiondata = this.customFieldsApplication[0].questionData
                questiondata.forEach(qus => {
                    if(qus.mandatory){
                        mandatoryQusIds.push(qus.id)
                    }
                })
                customFields.forEach(qus => {
                    if(qus.answer){
                        ansMadatoryQusIds.push(qus.id)
                    }
                })

                if(mandatoryQusIds.length == ansMadatoryQusIds.length){
                    return true
                }
                else{
                    return false
                }
            }
            else{
                return true
            }
    }
    step3(){
        if(!this.jobApplicationForm.value.videoId){
            this.jobApplicationForm.value.videoId =
             this.applicationJobData && this.applicationJobData.videoId
            ? this.applicationJobData.videoId
            : null;
        }
        this.applicationJobData.videoId =
            this.jobApplicationForm.value.videoId;
        this.jobApplicationForm.value.videoAssessment =
            this.videoAssessmentApplication;
    }
    step4(){
        this.quizeFormGroup.value.quizFields.map((b) => {
            b.answers = this.getQuizAnswer(b);
            return b;
        });
        this.jobApplicationForm.value.quizFields =
            this.quizeFormGroup.value.quizFields;
    }

    clearAddEducationValidation(type): void {

        /*let parameterValidation = this.mandatoryFieldsApplication.find( (b) => b.id === 'scoreAverage' );
        if (parameterValidation && parameterValidation.checked && type === 'not-graduated'){
          this.jobApplicationForm.get('scoreAverage').setValidators(Validators.required);
        } else {
          this.jobApplicationForm.get('scoreAverage').clearValidators();
        }
        this.jobApplicationForm.get('scoreAverage').updateValueAndValidity();

        parameterValidation = this.mandatoryFieldsApplication.find( (b) => b.id === 'materDescription' );
        if (parameterValidation && parameterValidation.checked && type === 'graduated'){
          this.jobApplicationForm.get('materDescription').setValidators(Validators.required);
        } else {
          this.jobApplicationForm.get('materDescription').clearValidators();
        }
        this.jobApplicationForm.get('materDescription').updateValueAndValidity();


        parameterValidation = this.mandatoryFieldsApplication.find( (b) => b.id === 'doctorateDescription' );
        if (parameterValidation && parameterValidation.checked && type === 'graduated'){
          this.jobApplicationForm.get('doctorateDescription').setValidators(Validators.required);
        } else {
          this.jobApplicationForm.get('doctorateDescription').clearValidators();
        }
        this.jobApplicationForm.get('doctorateDescription').updateValueAndValidity();*/

        const parameterValidation = this.mandatoryFieldsApplication.find(
            (b) => b.id === 'voto_laurea'
        );
        if (
            parameterValidation &&
            parameterValidation.checked &&
            type === 'graduated'
        ) {
            this.jobApplicationForm
                .get('voto_laurea')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('voto_laurea').clearValidators();
        }
        this.jobApplicationForm.get('voto_laurea').updateValueAndValidity();
    }

    addedDegreeValidation(): void {

        let parameterValidation = this.jobApplicationForm.value.isReadMaster;
        if (parameterValidation) {
            this.jobApplicationForm
                .get('materDescription')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('materDescription').clearValidators();
        }
        this.jobApplicationForm.get('materDescription').updateValueAndValidity();


        parameterValidation = this.jobApplicationForm.value.isReadDoctorate;
        if (parameterValidation) {
            this.jobApplicationForm
                .get('doctorateDescription')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('doctorateDescription').clearValidators();
        }
        this.jobApplicationForm
            .get('doctorateDescription')
            .updateValueAndValidity();

        parameterValidation = this.jobApplicationForm.value.isReadState;
        if (parameterValidation) {
            this.jobApplicationForm
                .get('stateExamination')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('stateExamination').clearValidators();
        }
        this.jobApplicationForm.get('stateExamination').updateValueAndValidity();
    }

    resetValidation(type): void {
        const univName = this.jobApplicationForm.value.univ_id;
        if (univName === 'other') {
            this.jobApplicationForm
                .get('universityOther')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('universityOther').clearValidators();
        }
        this.jobApplicationForm.get('universityOther').updateValueAndValidity();

        if (type === 'not-graduated') {
            this.jobApplicationForm
                .get('scoreAverage')
                .setValidators([
                    Validators.required,
                    Validators.min(18),
                    Validators.max(30),
                ]);
        } else {
            this.jobApplicationForm.get('scoreAverage').clearValidators();
        }
        this.jobApplicationForm.get('scoreAverage').updateValueAndValidity();

        const laureaName = this.jobApplicationForm.value.laurea_id;
        if (type === 'graduated' && laureaName === 'other') {
            this.jobApplicationForm
                .get('degreeOther')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('degreeOther').clearValidators();
        }
        this.jobApplicationForm.get('degreeOther').updateValueAndValidity();

        const degree = this.mandatoryFieldsApplication.find(
            (b) => b.id === "laurea_id"
        );

        if (degree && degree.checked && type === 'graduated') {
            this.jobApplicationForm
                .get('laurea_id')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('laurea_id').clearValidators();
        }
        this.jobApplicationForm.get('laurea_id').updateValueAndValidity();

        const deggreMark = this.mandatoryFieldsApplication.find(
            (b) => b.id === "voto_laurea"
        );

        if (deggreMark && deggreMark.checked && type === 'graduated') {
            this.jobApplicationForm
                .get('voto_laurea')
                .setValidators([
                    Validators.required,
                    Validators.min(66),
                    Validators.max(110),
                ]);
        } else {
            this.jobApplicationForm.get('voto_laurea').clearValidators();
            this.jobApplicationForm
                .get('voto_laurea')
                .setValidators([
                    Validators.min(66),
                    Validators.max(110),
                ]);
        }
        this.jobApplicationForm.get('voto_laurea').updateValueAndValidity();

        const deggreYear = this.mandatoryFieldsApplication.find(
            (b) => b.id === "degreeYear"
        );

        if (deggreYear && deggreYear && type === 'graduated') {
            this.jobApplicationForm
                .get('degreeYear')
                .setValidators([Validators.required, Validators.min(1900), Validators.max(this.currentYear)]);
        } else {
            this.jobApplicationForm.get('degreeYear').clearValidators();
            this.jobApplicationForm
                .get('degreeYear')
                .setValidators([Validators.min(1900), Validators.max(this.currentYear)]);
        }
        this.jobApplicationForm.get('degreeYear').updateValueAndValidity();
    }

    changeUniversity(): void {
        const univName = this.jobApplicationForm.value.univ_id;
        if (univName === 'other') {
            this.jobApplicationForm
                .get('universityOther')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('universityOther').clearValidators();
        }
        this.jobApplicationForm.get('universityOther').updateValueAndValidity();

        this.jobApplicationForm.patchValue({
            universityOther: null,
        });
    }

    changeDegree(): void {
        const parameterValidation = this.mandatoryFieldsApplication.find(
            (b) => b.id === "laurea_id"
        );

        // if(parameterValidation &&
        //   parameterValidation.checked){

        const laureaName = this.jobApplicationForm.value.laurea_id;
        const livelloStudi = this.jobApplicationForm.value.livello_studi;
        if (parameterValidation &&
            parameterValidation.checked && livelloStudi === 'graduated' && laureaName === 'other') {
            this.jobApplicationForm
                .get('degreeOther')
                .setValidators(Validators.required);
        } else {
            this.jobApplicationForm.get('degreeOther').clearValidators();
        }
        this.jobApplicationForm.get('degreeOther').updateValueAndValidity();

        this.jobApplicationForm.patchValue({
            degreeOther: null,
        });

    }

    handleEvent(e: CountdownEvent): void {
        this.notify = e.action;
        if (this.notify === 'done') {
            const answerData = {
                opening_id: this.jobApplicationForm.value.opening_id,
                survey_id: this.questionView.survey_id,
                question_id: this.questionView.id,
                minutes: this.questionView.minutes,
                type: this.questionView.type,
                answer: {
                    id: null,
                    value: null,
                },
            };

            this.removeSurveyQuestion();

            this.apiService.saveQuestionAnswer(answerData).subscribe((data: any) => {
                this.findSurvey();
            });
        }

        /*this.notify = e.action.toUpperCase();
        if (e.action === 'notify') {
          this.notify += ` - ${e.left} ms`;
        }*/
    }

    resetTimer(): void {
        // this.leftTime += 120;
        // this.countdown.restart();
    }

    newQuestion(): void {
        if (this.questionView.mandatory && !this.questionView.givenAnswer) {
            swal.fire(
                this.translate.instant('GENERAL.Sorry'),
                'question answer is required!',
                'info'
            );
        } else {
            this.questionNumber += 1;
            if (this.quizes[this.questionNumber]) {
                this.questionView = this.quizes[this.questionNumber];
                // this.leftTime = this.questionView.minutes * 60;
            }
        }
    }

    customTextAnswer(question: any, $event: any, index: any) {
        question.givenAnswer = $event.target.value;
        if ($event.target.value) {
            this.customFields.at(index).patchValue({ checked: question.givenAnswer });
        }
        else {
            this.customFields.at(index).patchValue({ checked: '' });
        }
    }

    changeRadio(index: any, $event: any) {
        // this.customFields.at(index).patchValue({radioAnswer:$event.value});
    }

    changeCheck(index: any, $event: any, answerid: any, item: any) {
        item.questionData[index].givenAnswer = '';
        if ($event.checked) {
            item.questionData[index].givenAnswer = answerid;
            // this.customFields.at(index).patchValue({checked:true});
        } else {
            this.customFields.at(index).patchValue({ checked: '' });
        }
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }
}
