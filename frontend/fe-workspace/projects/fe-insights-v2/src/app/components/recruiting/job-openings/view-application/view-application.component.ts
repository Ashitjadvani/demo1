import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DeletePopupComponent } from 'projects/fe-insights-v2/src/app/popup/delete-popup/delete-popup.component';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import swal from 'sweetalert2';
import {RecrutingJobOpeningManagementService} from '../../../../../../../fe-common-v2/src/lib/services/recruting-job-opening-management.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecruitingManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';
import { data } from 'jquery';
import { environment } from 'projects/fe-insights-v2/src/environments/environment';
import { HttpResponse } from '@angular/common/http';
import { CMSManagementService } from 'projects/fe-common-v2/src/lib/services/cms-list.service';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})
export class ViewApplicationComponent implements OnInit {
  norecordfound: boolean = false;
  copyUrl: any;
  JOB_URL: any;
  imageURL:any;
  qrCodeURL : any = '';
  selected: any = [];
  quizSequence: any = [];
  quizTableData: any = [];
  mandatoryFieldsForm: FormGroup;
  JobOpeningsDetails: any = new MatTableDataSource([]);
  id: any;
  selectedMandatory = [];
  customFields : any[] = [];
  customFieldsArray : any[] = [];
  videoAssessment = [];
  customFieldsName:any[] = [];
  customFieldsID:any;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public translate: TranslateService,
    private _formBuilder: FormBuilder,
    private activitedRoute: ActivatedRoute,
    private helper: MCPHelperService,
    private ApiServices: RecrutingJobOpeningManagementService,
    private cmsManagementService:CMSManagementService,
    private getDetailsAPI: RecruitingManagementService) {

    this.mandatoryFieldsForm = this._formBuilder.group({
      name: [''],
      surname: [''],
      email: [''],
      phone: [''],
      birthdate: [''],
      gender: [''],
      nationality: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      levelOfEducation: [''],
      university: [''],
      degree: [''],
      degreeMark: [''],
      degreeYear: [''],
      cv: [''],
    });



  }

  jobOpeningType: any = [
    { id: '1', name:  'Open_Positions' },
    { id: '2', name: 'Spontaneous_Applications' },
  ];


  public quiz_data = [];

  quizDisplayedColumns: string[] = ['quizName', 'questionNumber', 'timeRequired'];



  ngOnInit(): void {
    this.getJobDetails();
    this.getCustomField();
    //this.getQuizData();
    this.getCmsListData();
  }
  async getJobDetails(): Promise<void> {
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiServices.viewJob({id: this.id});
    // const result: any = await this.ApiServices.v({person_id: this.id});
    this.copyUrl = `${environment.home_page}${this.id}`;
    if (res) {
      this.JobOpeningsDetails = res.data ;
      this.JOB_URL = `${environment.home_page}${this.id}`;
      this.selectedMandatory = (Array.isArray(this.JobOpeningsDetails.mandatoryFields) && this.JobOpeningsDetails.mandatoryFields.length > 0) ? this.JobOpeningsDetails.mandatoryFields : [];
      this.customFields = res.data.customFields[0];
      // console.log('customFields111111111',this.customFields);

      this.videoAssessment = res.data.videoAssessment;
       for (let i = 0; i < this.videoAssessment.length; i++){
       const  check: any = this.videoAssessment[i].checked === true;
       if (check === true ){
         this.norecordfound = true;
       }
      }

      if (Array.isArray(this.JobOpeningsDetails.quizFieldId)) {
        this.selected = this.JobOpeningsDetails.quizFieldId;
      }
      if(this.JobOpeningsDetails.quizSequence != null) {
        this.quizSequence = this.JobOpeningsDetails.quizSequence;
      }
      this.quizTableData  = await this.getDetailsAPI.getQuizJobList('recruitmentquiz');
      if(this.quizSequence.length != this.quizTableData.data.length){
        let array: any  = this.quizTableData.data.filter(x => !this.quizSequence.includes(x.title))
        this.quizSequence = array
      }
      this.quiz_data = this.quizSequence;
      // console.log('this.quiz_data',this.quiz_data);
      
      if(this.quiz_data && this.quiz_data.length == 0){
        this.getQuizData();
      }


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
    this.getDetailsAPI.getUploadDocument({ id: this.JobOpeningsDetails.jobImageId }).then((data) => {
      this.imageURL = data.data;
    });
    this.getDetailsAPI.createQRCode(this.id).subscribe((event) => {
            if (event instanceof HttpResponse) {
              this.qrCodeURL = event.body.data.qrcode;
            }
          },
        );
  }
  toggleMandatory(item, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedMandatory.push(item);
    } else {
      const index = this.selectedMandatory.indexOf(item);
      if (index >= 0) {
        this.selectedMandatory.splice(index, 1);
      }
    }
  }

  existsMandatory(item): any {
    return this.selectedMandatory.indexOf(item) > -1;
  }
  customFieldsTitle:any;

  async getCustomField() :Promise<void>{
    const response: any  = await this.getDetailsAPI.getCustomFieldJobList('recruitmentcustomfields');
    this.customFieldsArray = response.data;
    this.customFieldsID = response.data[0].id
    this.customFieldsTitle = response.data[0].title
    // console.log('cf222222',this.customFieldsID);
  }

  async getQuizData() :Promise<void>{
    
    const response: any  = await this.getDetailsAPI.getQuizJobList('recruitmentquiz');
    this.quiz_data = response.data;
  }

  editJobOpeningRedirect(){
    this.router.navigate([`/recruiting/job-openings/add-edit-job-opening/` + this.id]);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this job opening?', heading: 'Delete Job Opening'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          this.ApiServices.deleteJob(this.id).then((data: any) => {
            this.router.navigate(['/recruiting/job-openings']);
            swal.fire(
              '',
              this.translate.instant("Job deleted successfully"),
              'success'
            );
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
  dataSource:any[] = [];
  documentName:any;
  defultIMG:any;

  async getCmsListData(): Promise<void> {
    const cmsListData: any = await this.cmsManagementService.getCMSList();
    this.dataSource = cmsListData.data;
    const resImage: any = await this.cmsManagementService.getDefaultImage({type: 'job_default'});
    this.documentName = resImage.data;
    if (this.documentName) {
      this.cmsManagementService.getImage({id : this.documentName.fileId}).then( (image: any) => {
          this.defultIMG = image.data;
      });
    }
  }

  copyBoardURL(): void {
    swal.fire(
      '',
      this.translate.instant('GENERAL.COPY_JOB_OPENING_SUCCESSFULLY'),
      'success'
    )
    // this.snackBar.open(
    //   this.translate.instant('GENERAL.COPY_JOB_OPENING_SUCCESSFULLY'),
    //   this.translate.instant('GENERAL.OK'),
    //   { duration: 3000 }
    // );
  }



}
