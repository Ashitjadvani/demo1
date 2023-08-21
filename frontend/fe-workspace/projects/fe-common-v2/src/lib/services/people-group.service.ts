import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleGroupService {
  baseUrl: string = environment.api_host;
  token: any;
  companyId: any;
  private httpOptions: any;

  constructor(private http: HttpClient) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
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
  getPeopleGroup(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/group/' + this.companyId, data);
  }
  deletePeople(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/v2/user-manager/group/' + id);
  }
}
