import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {
  CentralUnitsCreateResponse,
  SiteResponse
} from '../../../../fe-common/src/lib/services/admin-site-management.service';
import { ApiService, buildRequest } from '../services/api';
@Injectable({
  providedIn: 'root'
})
export class SiteService {
  baseUrl: string = environment.api_host;
  token: any;
  companyId: any;
  private httpOptions: any;

  constructor(private http: HttpClient, private apiService: ApiService) {
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

  getSites(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/v2/site-manager/sites', data, this.getHeader());
  }

  changeSites(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/v2/site-manager/sites/change/status', data, this.getHeader());
  }

  deleteSite(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/v2/site-manager/site/' + id);
  }
  // async getSites(companyId: string): Promise<SiteResponse> {
  //   const url = buildRequest(this.apiService.API.BE.GET_SITES, companyId);
  //   const body = {
  //     comapnyId: this.companyId
  //   };
  //   return await this.apiService.post<SiteResponse>(url, body).toPromise();
  //   // return await this.apiService.get<SiteResponse>(url).toPromise();
  // }
}
