import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class QuizSurveyService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  async getSurvey(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_OPENING_QUIZ_LISTING, data).toPromise();
  }
  async deleteSurvey(id: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_OPENING_QUIZ_DELETE, {id: id}).toPromise();
  }
  async addSurvey(data): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.ADD_SURVEY, data).toPromise();
  }
  async viewSurvey(data): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.VIEW_SURVEY, data).toPromise();
  }
}
