import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class MasterModulesDegreeService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  async getDegree(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_DEGREE_LIST, data).toPromise();
  }
  async deleteDegree(id: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_DEGREE_DELETE, {id: id}).toPromise();
  }
  async addDegree(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_DEGREE_SAVE, data).toPromise();
  }
  async editDegree(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_DEGREE_SAVE, data).toPromise();
  }

}


