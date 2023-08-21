import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class MasterModulesUniversityService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  async getUniverstiy(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_UNIVERSITY_LIST, data).toPromise();
  }
  async deleteUniverstiy(id: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_UNIVERSITY_DELETE, {id: id}).toPromise();
  }
  async addUniverstiy(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_UNIVERSITY_SAVE, data).toPromise();
  }
   async editUniverstiy(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_UNIVERSITY_EDIT, data).toPromise();
  }
  // editUni(data: any): Promise<RecruitingCandidateDocument[]>{
  //   return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE + '/v2/mqs-dashboard/university/edit', data).toPromise();
  // }
}
