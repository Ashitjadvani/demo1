import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CareerHelperService} from '../../../service/careerHelper.service';
import {Router} from '@angular/router';
import {CareerApiService} from '../../../service/careerApi.service';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import { WhiteSpaceValidator } from 'projects/fe-insights/src/app/store/whitespace.validator';
import { formatDate } from '@angular/common';
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


// export const PICK_FORMATS = {
//   parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
//   display: {
//     dateInput: 'input',
//     monthYearLabel: {year: 'numeric', month: 'numeric'},
//     // dateA11yLabel: {year: 'numeric', month: 'numeric', day: 'numeric'},
//     // monthYearA11yLabel: {year: 'numeric', month: 'numeric'}
//   }
// };

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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
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
export class EditProfileComponent implements OnInit {

  logintype = '';
  authUser: any = {};
  myProfileForm: FormGroup;
  userId: any;
  degrees: any = [];
  levelEducation = [
    {id: 'not-graduated', name: 'Not-Graduated'},
    {id: 'graduated', name: 'Graduation'}
  ];
  universities: any = [];
  fileToUpload: any;
  fileCoverImage: any;
  resumeDetailsData: any;
  filePDF: any;
  disabled = true;
  readonly = true;
  readonly minAge = 20;
  maxDob: Date;
  userDetails:any;
  currentYear : number = new Date().getFullYear();


  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private apiService: CareerApiService,
    private helper: CareerHelperService,
    private translate: TranslateService,
    private _adapter: DateAdapter<any>
  ) {
    const authUser: any = localStorage.getItem('loggedInUser');
    if (authUser) {
      this.authUser = JSON.parse(authUser);
      this.logintype = this.authUser.user.user.type;
    }
    // this.userId  = localStorage.getItem('loginId');
    this.myProfileForm = this._formBuilder.group({
      // userId: [this.userId],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
      data_nascita: [''], // date of birth
      sesso: [''], // sex
      nationality: [''],
      telefono: [''],
      indirizzo: [''],
      cityName: [''],
      stateName: [''],
      countryName: [''],
      azienda: [''],
      titolo: [''],
      livello_studi: [''],
      univ_id: [''],
      degreeOther: [''],
      universityOther: [''],
      scoreAverage: ['',[Validators.min(18),Validators.max(30)]],
      voto_laurea: ['',[Validators.min(66),Validators.max(110)]],
      //scoreAverage: [''],
      //voto_laurea: [''],
      lode: [false],
      lodeMaster: [''],
      lodeDoctorate: [''],
      materDescription: [''],
      doctorateDescription: [''],
      isReadMaster: [false],
      isReadDoctorate: [false],
      isReadState: [false],
      stateExamination: [false],
      laurea_id: [''],
      resumeId: [''],
      //degreeYear: ['']
      degreeYear: ['',[Validators.min(1900), Validators.max(this.currentYear)]],
    });
    if (this.myProfileForm.value.laurea_id === 'other') {
      this.myProfileForm.get('degreeOther').setValidators([
        Validators.required,WhiteSpaceValidator.noWhiteSpace
      ]);
    }

  }

  ngOnInit(): void {
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - this.minAge,
      today.getMonth(),
      today.getDate()
    );
    this.apiService.getUniversity().subscribe((data: any) => {
      this.universities = data.data;
      this.universities.push({description: "Other", id: "other"});
    });
    this.apiService.getDegree().subscribe((data: any) => {
      this.degrees = data.data;
      this.degrees.push({description: "Other", id: "other"});
    });
    this.getUserDetails({page: 1});
  }
  streamOpened(){
    if (localStorage.getItem('currentLanguage') == 'it'){
      this._adapter.setLocale('it-IT');
    }else {
      this._adapter.setLocale('eg-EG');
    }
  }


  // patch user data
  getUserDetails(req: any) {
    this.apiService.getUserdetail().subscribe((data: any) => {
      const userData = data.user;
      this.userDetails = data.user.type;
      this.myProfileForm.patchValue({
        nome: userData.nome,
        cognome: userData.cognome,
        email: userData.email,
        data_nascita: userData.data_nascita,
        sesso: userData.sesso, // sex
        nationality: userData.nationality,
        telefono: userData.telefono,
        indirizzo: userData.indirizzo,
        cityName: userData.cityName,
        stateName: userData.stateName,
        countryName: userData.countryName,
        azienda: userData.azienda,
        titolo: userData.titolo,
        livello_studi: userData.livello_studi,
        univ_id: userData.univ_id,
        scoreAverage: userData.scoreAverage,
        universityOther: userData.universityOther,
        degreeOther: userData.degreeOther,
        voto_laurea: userData.voto_laurea,
        lode: userData.lode,
        lodeMaster: (userData.materDescription >= 110),
        lodeDoctorate: (userData.doctorateDescription >= 110),
        materDescription: userData.materDescription,
        stateExamination: userData.stateExamination,
        doctorateDescription: userData.doctorateDescription,
        isReadMaster: userData.isReadMaster,
        isReadDoctorate: userData.isReadDoctorate,
        isReadState: userData.isReadState,
        laurea_id: userData.laurea_id,
        resumeId: userData.resumeId,
        degreeYear: userData.degreeYear
      });
      if (userData && userData.resumeId) {
        this.apiService.getUploadedfileDetails({id: userData.resumeId}).subscribe((dataImage: any) => {
          const imageDetails = dataImage.data;
          this.resumeDetailsData = imageDetails.file;
        });
      }
    });
  }

  // edit-profile Api calling
  onEditProfile(): void {
    if (this.myProfileForm.valid) {

      this.helper.toggleSidebarVisibility(true);
      this.uplodeFile(this.fileToUpload).then((fileId) => {
        this.myProfileForm.patchValue({
          resumeId: (fileId) ? fileId : (this.myProfileForm.value.resumeId) ? this.myProfileForm.value.resumeId : null,
          lode: ((this.myProfileForm.value.voto_laurea >= 110) ? this.myProfileForm.value.lode : false)
        });
        this.apiService.editUserProfile(this.myProfileForm.value).subscribe((data: any) => {
          this.helper.toggleSidebarVisibility(false);
          if (data.result === true) {
            swal.fire(
              this.translate.instant('GENERAL.success'),
              this.translate.instant(data.reason),
              'success');
            // this.router.navigate(['/position']);
          } else {
            swal.fire(
              this.translate.instant('GENERAL.Sorry'),
              this.translate.instant(data.reason),
              'info');
          }
        });
      });
    }
  }

  logout(): void {
    CareerHelperService.onLogOut();
    this.router.navigate(['/login']);
  }

  changeIsRead(e, type): void {
    if (!e) {
      this.myProfileForm.patchValue({
        [type]: null
      });
    }
  }

  changeEducationLevel(): void {
    this.myProfileForm.patchValue({
      scoreAverage: null,
      materDescription: null,
      doctorateDescription: null,
      voto_laurea: null,
      DegreeYear: null,
      isReadMaster: false,
      isReadDoctorate: false,
      isReadState: false,
      lode: false,
    });
  }

  changeDegree(): void {
    const laureaName = this.myProfileForm.value.laurea_id;
    const livelloStudi = this.myProfileForm.value.livello_studi;
    if (livelloStudi === 'graduated' && laureaName === 'other') {
      this.myProfileForm.get('degreeOther').setValidators(Validators.required);
    } else {
      this.myProfileForm.get('degreeOther').clearValidators();
    }
    this.myProfileForm.get('degreeOther').updateValueAndValidity();

    this.myProfileForm.patchValue({
      degreeOther: null
    });
  }

  // changeDegree(): void {
  //   this.myProfileForm.patchValue({
  //     degreeOther: null
  //   });
  // }

  changeUniversity(): void {
    this.myProfileForm.patchValue({
      universityOther: null
    });
  }

  onCoverImage(input: HTMLInputElement): void {
    if (input.files[0].type === 'application/pdf') {
      this.fileToUpload = input.files[0];
      this.fileCoverImage = this.fileToUpload;
      this.resumeDetailsData = `${this.fileToUpload.name} (${this.formatBytes(this.fileToUpload.size)})`;
    } else {
      swal.fire(
        'Info!',
        'Please upload the CV as a PDF file!',
        'info'
      );
    }
  }

  resetCoverValue(): void {
    this.filePDF = null;
    this.resumeDetailsData = null;
    this.myProfileForm.patchValue({
      resumeId: null
    });
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

  resetValidation(type): void {
    const univName = this.myProfileForm.value.univ_id;
    if (univName === 'other') {
      this.myProfileForm.get('universityOther').setValidators(Validators.required);
    } else {
      this.myProfileForm.get('universityOther').clearValidators();
    }
    this.myProfileForm.get('universityOther').updateValueAndValidity();

    if (type === 'not-graduated') {
      this.myProfileForm.get('scoreAverage').setValidators([Validators.required, Validators.min(18),Validators.max(30)]);
    } else {
      this.myProfileForm.get('scoreAverage').clearValidators();
    }
    this.myProfileForm.get('scoreAverage').updateValueAndValidity();

    const laureaName = this.myProfileForm.value.laurea_id;
    if (type === 'graduated' && laureaName === 'other') {
      this.myProfileForm.get('degreeOther').setValidators(Validators.required);
    } else {
      this.myProfileForm.get('degreeOther').clearValidators();
    }
    this.myProfileForm.get('degreeOther').updateValueAndValidity();

    if (type === 'graduated') {
      this.myProfileForm.get('laurea_id').setValidators(Validators.required);
    } else {
      this.myProfileForm.get('laurea_id').clearValidators();
    }
    this.myProfileForm.get('laurea_id').updateValueAndValidity();

    if (type === 'graduated') {
      this.myProfileForm.get('voto_laurea').setValidators([Validators.required, Validators.min(66),Validators.max(110)]);
    } else {
      this.myProfileForm.get('voto_laurea').clearValidators();
    }
    this.myProfileForm.get('voto_laurea').updateValueAndValidity();

    if (type === 'graduated') {
      this.myProfileForm.get('degreeYear').setValidators(Validators.required);
    } else {
      this.myProfileForm.get('degreeYear').clearValidators();
    }
    this.myProfileForm.get('degreeYear').updateValueAndValidity();
  }

  uplodeFile(fileToUpload): any {
    return new Promise((resolve, reject) => {
      if (fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload);
        this.apiService.uploadPdf(formData).subscribe((data: any) => {
          resolve(data.fileId);
        }, (error) => {
          resolve(null);
        });
      } else {
        resolve(null);
      }
    });
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
