import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class MasterModuleDisputeTypeService {
  token: any;
  companyId: any;

  constructor(private http: HttpClient,
              private apiService: ApiService) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
    }
  }

  async getDispute(data: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.RECRUITING_DASHBOARD_DISPUTE_TYPE_LIST,
      {
        ':id': this.companyId
      });
    return await this.apiService.post<any>(url, data).toPromise();
  }
  async deleteDispute(id: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.RECRUITING_DASHBOARD_DELETE_DISPUTE,
      {
        ':id': this.companyId,
        ':disputeName': id
      });
    return await this.apiService.delete<any>(url).toPromise();
  }

  async addDispute(data: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.RECRUITING_DASHBOARD_ADD_DISPUTE_TYPE_LIST,
      {
        ':id': this.companyId
      });
    return await this.apiService.post<any>(url, data).toPromise();
  }
  async editDispute(name: any, newname: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.RECRUITING_DASHBOARD_EDIT_DISPUTE,
      {
        ':id': this.companyId,
        ':disputeName': name,
      });
    return await this.apiService.post<any>(url,{peopleDispute: newname} ).toPromise();
  }
}
