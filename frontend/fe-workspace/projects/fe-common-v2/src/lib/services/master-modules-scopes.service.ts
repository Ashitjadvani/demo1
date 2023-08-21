import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class MasterModulesScopesService {
  token: any;
  companyId: any;

  constructor(private http: HttpClient,
              private apiService: ApiService) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
      // console.log('tokennnnnnnnnnnnnnnn', this.token);
      // console.log('iddddd', this.companyId);
    }
  }

  async getScopes(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_SCOPES_LIST , data).toPromise();
  }
  async getAreaScope(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.get<RecruitingCandidateDocument[]>(this.apiService.API.BE.ADD_AREA_SCOPE_LIST , data).toPromise();
  }
  async deleteScope(name: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.COMPANY_SCOPE,
      {

        ':id': this.companyId,
        ':scopeName': name
      });
    return await this.apiService.delete<any>(url).toPromise();
  }

}






