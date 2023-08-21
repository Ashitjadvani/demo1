import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CareerApiService } from '../../service/careerApi.service';
import {MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-job-application-details',
  templateUrl: './job-application-details.component.html',
  styleUrls: ['./job-application-details.component.scss']
})
export class JobApplicationDetailsComponent implements OnInit {
  application: any = {};
  jobId: any;
  jobApplicationForm: FormGroup;
  userData : any = {};
  imageDetails : any = {};
  videoDetailsData : any;
  userVideoDetails : any;
  baseImageUrl: any;
  customFields: any = [];
  videoAssessment: any = [];
  surveyQuestion: any = [];
  conditionQuestionList: any = [];
  quizFields: any = [];
  applicationDetails: any = {};
  isCandidateRead : any;
  userRole : any;
  rowNumber : any;

  levelEducation = new Map([
    ["not-graduated", 'OTHERS.NotGraduated'],
    ["graduated", 'OTHERS.Graduation']
  ]);

  constructor(
    public activeRoute: ActivatedRoute,
    private apiService: CareerApiService
  ) {
    this.jobId = this.activeRoute.snapshot.paramMap.get('id');
    this.baseImageUrl = apiService.baseImageUrl;
  }

  ngOnInit(): void {
   this.getUserDetails();
  }

  // patch user data
  getUserDetails(): void {
    this.apiService.getUserdetail().subscribe((data: any) => {
      this.userVideoDetails = data.user;
      this.userData = data.user;
      this.levelEducation.get(this.userData.livello_studi);
    });
    this.apiService.getMyApplicationById({jobId: this.jobId}).subscribe((data: any) => {
      this.applicationDetails = data.data;
      let resumeDetails = this.applicationDetails.resumeId;
      this.customFields = this.applicationDetails.customFields;
      this.videoAssessment = this.applicationDetails.videoAssessment;
      this.quizFields = Array.isArray(this.applicationDetails.quizFields) ? this.applicationDetails.quizFields : [];
      this.isCandidateRead = this.applicationDetails.isCandidateRead;
      if(resumeDetails) {
        this.apiService.getUploadedfileDetails({id: resumeDetails}).subscribe((data: any) => {
          this.imageDetails = data.data;
        });
      }

      if (this.applicationDetails.quizFieldId && Array.isArray(this.applicationDetails.quizFieldId) && this.applicationDetails.quizFieldId.length > 0) {
        this.apiService.getApplicationQuestionBySurvey({survey: this.applicationDetails.quizFieldId, opening_id: this.jobId}).subscribe((survey: any) => {
          this.surveyQuestion = survey.data;
          for (let i = 0; i < this.surveyQuestion.length; i++) {
            if (this.surveyQuestion[i].surveyPrivacy.indexOf('only_user') >= 0) {
              this.userRole = true;
              this.conditionQuestionList.push(this.surveyQuestion[i])
            }
          }
        });
      }

      let videoDetails = data.data.videoId;
      if(videoDetails) {
        this.apiService.getUploadedfileDetails({id: videoDetails}).subscribe((data: any) => {
          this.videoDetailsData = (data?.data?.file) ? data.data.file + ' (' + this.formatBytes(data.data.size) + ')' : null;
        });
      }
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

  findOnlyManager(surveyPrivacy): boolean {
      if (surveyPrivacy && surveyPrivacy.length === 1) {
        return !surveyPrivacy.includes('only_manager');
      } else {
        return true;
      }
  }
}
