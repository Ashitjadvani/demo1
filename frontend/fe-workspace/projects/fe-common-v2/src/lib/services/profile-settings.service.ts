import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';
import {BaseResponse} from "./base-response";
import {CompanyResponse} from "./admin-user-management.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsService {
  baseUrl: string = environment.api_host;
  token: any;
  companyId: any;
  constructor(private http: HttpClient,
              private apiService: ApiService) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
      // console.log('token', this.token);
      // console.log('id', this.companyId);
    }
  }


  async set(data: any): Promise<BaseResponse> {
    return this.apiService.put<BaseResponse>(this.apiService.API.BE.EMAIL_CONFIGURATION, data).toPromise();
  }
  async setGreenpass(id: any, greenpassSettings: any): Promise<BaseResponse> {
    return this.apiService.put<BaseResponse>(this.apiService.API.BE.EMAIL_CONFIGURATION, {id, greenpassSettings}).toPromise();
  }

  async setDashboard(data): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(this.apiService.API.BE.EMAIL_CONFIGURATION, data).toPromise();
  }
  // async getCompany(): Promise<CompanyResponse> {
  //   let url = buildRequest(this.apiService.API.BE.GET_COMPANY,
  //     {
  //       ':id': this.companyId
  //     });
  //   return await this.apiService.get<CompanyResponse>(url).toPromise();
  // }
  getCompany(data: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/v2/user-manager/company/' + this.companyId, data);
  }
  async setNative( nativeLanguages: any): Promise<BaseResponse> {
    return this.apiService.put<BaseResponse>(this.apiService.API.BE.EMAIL_CONFIGURATION, nativeLanguages).toPromise();
  }
}
