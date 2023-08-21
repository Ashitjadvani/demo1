import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl: string = environment.api_host;
  token: any;
  companyId: any;
  private httpOptions: any;


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

  public getHeader(): any {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
      this.httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json'
        }),
      };

    }
    return this.httpOptions;
  }

  getAccounts(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/accounts/' + this.companyId, data);
  }

  deleteAcc(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/v2/user-manager/account/' + id);
  }

  // async addAccount(data: any): Promise<RecruitingCandidateDocument[]> {
  //   return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.ADD_USER_ACCOUNT, data).toPromise();
  // }
  addAccount(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/account/add', data);
  }
  editAccount(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/view/account', data);
  }
  updateAccount(data: any): Observable<any>{
    return this.http.put<any>(this.baseUrl + '/v2/user-manager/account/update', data);
  }
}
