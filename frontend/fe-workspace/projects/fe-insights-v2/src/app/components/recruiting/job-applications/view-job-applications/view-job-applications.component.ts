import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'projects/fe-insights-v2/src/app/popup/delete-popup/delete-popup.component';
import swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {MCPHelperService} from '../../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {RecrutingJobApplicationManagementService} from '../../../../../../../fe-common-v2/src/lib/services/recruting-job-application-management.service';
import {MatTableDataSource} from '@angular/material/table';
import { RecruitingApplicationManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-application-management.service';
import { TklabMqsService } from 'projects/fe-common-v2/src/lib/services/tklab.mqs.service';
import { RecruitingCandidateManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-candidate-management.service';
import * as FileSaver from 'file-saver';
import { RecruitingManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';
import { environment } from 'projects/fe-insights-v2/src/environments/environment';
import { Location } from '@angular/common';

export interface DialogData{
  message: string;
  heading: string;

}
@Component({
  selector: 'app-view-job-applications',
  templateUrl: './view-job-applications.component.html',
  styleUrls: ['./view-job-applications.component.scss']
})
export class ViewJobApplicationsComponent implements OnInit {
  id: any;
  JobapplicationsDetails: any = [];
  applicationStatus: any = [];
  opening: any = [];
  userInfo: any = [];
  laurea: any = [];
  univ: any = [];
  videoAssessment: any = [];
  noRecordFound = false;
  currentElementMetric: any = [];
  matricSurveyId: any;
  matricsDataSource = [];
  resumeId:any;
  fileName:'';
  url: string = '';
  videoURL:string = '';
  videoId:any;
  momentTime: string;
  baseURL = environment.api_host;
  baseImageUrl: string = this.baseURL+'/v2/data-storage/download/';
  additionalDetailsList:any[] = [];
  conditionQuestionList: any = [];
  surveyQuestion: any = [];

  constructor(public dialog: MatDialog,
              private router: Router,
              private activitedRoute: ActivatedRoute,
              private helper: MCPHelperService,
              private ApiServices: RecrutingJobApplicationManagementService,
              private recruitingManagementApplicationService: RecruitingApplicationManagementService,
              private documentDownload: RecruitingCandidateManagementService,
              private DocDetailsAPI:RecruitingManagementService,
              private tklabMqsService: TklabMqsService,
              public translate: TranslateService,
              private location: Location) { }
  displayedMatricsColumns: string[] = ['rules', 'textresult', 'scalarresult'];
  displayedColumns: string[] = ['DateTime', 'appStatus', 'appNote', 'appBy'];
  dataSource = this.JobapplicationsDetails;
  resultsLength = 0;

  ngOnInit(): void {
    this.activitedRoute.params.subscribe( res => {
      this.getJobDetails();
      this.onLoadSurveyMetric();
    });
    this.getJobDetails();
    this.onLoadSurveyMetric();
    // this.getQuizData();
  }
  async getJobDetails(): Promise<void> {
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    //const res: any = await this.ApiServices.viewApplication({id: this.id});
    const result: any = await this.ApiServices.getApplicationHistory({application_id: this.id});
    this.ApiServices.viewApplication({id: this.id}).then((res :any) => {
      if (res.statusCode == 200) {
        this.helper.toggleLoaderVisibility(false);
        this.JobapplicationsDetails = res.data ;
        this.opening = res.data.opening ;
        this.userInfo = res.data.userInfo ;
        this.univ = res.data.univ ;
        this.laurea = res.data.laurea ;
        this.additionalDetailsList = res.data.customFields;
        this.videoAssessment = res.data.opening.videoAssessment ;
        this.applicationStatus = result.data;
        this.noRecordFound = this.applicationStatus.length > 0;
        this.helper.toggleLoaderVisibility(false);
        // this.onLoadSurveyMetric();
        this.getQuizData();
        this.documentUploadInfo();
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
    },error =>{
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(error.error.message),
        'info'
      );
      this.router.navigate(['/recruiting/job-applications/']);
    });
  }

  async documentUploadInfo():Promise<void>{
    if (this.userInfo.resumeId !== '' && this.userInfo.resumeId !== null){
      this.documentDownload.downloadDocument(this.userInfo.resumeId).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      this.url = window.URL.createObjectURL(blob);
      this.resumeId = this.userInfo.resumeId;
    });
    }
    if (this.userInfo.videoId !== '' && this.userInfo.videoId != null) {
      this.documentDownload.downloadDocument(this.userInfo.videoId).subscribe((res:any) =>{
        this.videoId = this.userInfo.videoId;
      });
      const response = await this.DocDetailsAPI.getOpeningImage(this.userInfo.videoId)
      this.videoURL = this.baseImageUrl + response.data.id;
    }
  }
  editDetail(id: string): void {
    this.router.navigate([`/recruiting/job-applications/edit-job-applications/` + this.id]);
  }

  async getQuizData(){
    this.recruitingManagementApplicationService.getQuestionByJobApplication({applicationId: this.id, person_id : this.JobapplicationsDetails.person_id}).then( (data: any) => {
      this.surveyQuestion = data.data;
      this.conditionQuestionList = [];
      for (let i = 0; i < this.surveyQuestion.length; i++) {
        //if (this.surveyQuestion[i].surveyPrivacy.indexOf('only_user') >= 0) {
          this.conditionQuestionList.push(this.surveyQuestion[i])
        //}
      }
    });
  }

  async onLoadSurveyMetric() {
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    this.recruitingManagementApplicationService.getApplicationMetric({application_id : this.id}).then( (data: any) => {
      if (data.result == true){
        this.currentElementMetric = data.data;
      }
      const matricData = this.currentElementMetric;
      for (let i = 0; i < matricData.length; i++){
        this.matricSurveyId = matricData[i].survey_id;
        this.tklabMqsService.loadAppQuizMetricList({survey_id: matricData[i].survey_id}).then(data => {
          this.matricsDataSource[i] = data.result;
        });
        this.matricsDataSource.push(this.matricsDataSource[i]);
      }
    });
  }

  downloadCv(): void {
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    this.documentDownload.downloadDocument(this.userInfo.resumeId).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      this.url = window.URL.createObjectURL(blob);
          this.resumeId = this.userInfo.resumeId;
          this.fileName = this.userInfo.nome;
          FileSaver.saveAs(blob, this.userInfo.nome + '-cv-' + this.momentTime + '.pdf');
          this.helper.toggleLoaderVisibility(false);
    }, error => {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant('TABLE.No_record_found'),
        'info'
      );
    });
  }

  downloadVideo(){
    this.helper.toggleLoaderVisibility(true);
    this.documentDownload.downloadDocument(this.userInfo.videoId).subscribe((res:any) =>{
      const blob = new Blob([res], { type: 'mp4' });
      this.videoURL = window.URL.createObjectURL(blob);
      this.videoId = this.userInfo.videoId,
      FileSaver.saveAs(blob, this.userInfo.nome + '-video-' + this.momentTime + '.mp4');
      this.helper.toggleLoaderVisibility(false);
    },error =>{
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant('TABLE.No_record_found'),
        'info'
      );
    });
  }

  openDialog(id:any) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'RECRUITING.Are you sure you want to delete this job Applications?', heading: 'RECRUITING.Delete Job Application'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          this.ApiServices.deleteJobApp(this.id).then((data: any) => {
            const metaData: any = data.reason;
            // this.getJobList(this.requestPara);
            this.router.navigate([`/recruiting/job-applications/`]);
            swal.fire(
              '',
              this.translate.instant(metaData),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            // that.getJobList(this.requestPara);
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


  back(): void {
    this.location.back()
  }
}
