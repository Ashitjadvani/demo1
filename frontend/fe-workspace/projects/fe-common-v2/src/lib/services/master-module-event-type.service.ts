import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';
import {BaseResponse} from "./base-response";

@Injectable({
  providedIn: 'root'
})
export class MasterModuleEventTypeService {
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

  async getEvent(data: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.RECRUITING_DASHBOARD_EVENT_TYPE_LIST,
      {
        ':id': this.companyId
      });
    return await this.apiService.post<any>(url, data).toPromise();
  }
  async deleteEvent(id: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.RECRUITING_DASHBOARD_EVENT_TYPE_DELETE,
      {

        ':id': this.companyId,
        ':justificationId': id
      });
    return await this.apiService.delete<any>(url).toPromise();
  }

  async set(id: any, peopleJustificationsSettings: any): Promise<BaseResponse> {
    return this.apiService.put<BaseResponse>(this.apiService.API.BE.EMAIL_CONFIGURATION, {id, peopleJustificationsSettings}).toPromise();
  }
}
