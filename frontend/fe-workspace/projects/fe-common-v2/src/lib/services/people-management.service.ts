import {Injectable} from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {catchError} from "rxjs/operators";
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';
import {ApiService, buildRequest} from './api';

// import {MCPHelperService} from './MCPHelper.service';

// import {ApiService} from './api';
// import {ApiResponse} from '../models/api/api-response';


@Injectable({
  providedIn: 'root'
})
export class PeopleManagementService {
  baseUrl: string = environment.api_host;
  token: any;
  companyId: any;
  private httpOptions: any;

  constructor(private http: HttpClient,
              private apiService: ApiService
  ) {

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
      // console.log('tokennnnnnnnnnnnnnnn', this.token);
      // console.log('iddddd', this.companyId);
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

  getAllArea(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/areaList', data, this.getHeader());
  }

  getEventAreaList(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/listOfArea', data, this.getHeader());
  }


  async deleteArea(name: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.COMPANY_AREA,
      {
        ':id': this.companyId,
        ':areaName': name
      });
    return await this.apiService.delete<any>(url).toPromise();
  }
  async addArea(data: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_AREA,
      {
        ':id': this.companyId,
      });
    return await this.apiService.post<any>(url, data).toPromise();
  }
  editArea(name: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/edit/area/' + name, this.getHeader());
  }

  async viewArea(name: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.VIEW_AREA_DETAILS,
      {
        ':id': this.companyId,
        ':areaName': name
      });
    return await this.apiService.get<any>(url, name).toPromise();
  }
  //  async editArea(name: any): Promise<RecruitingCandidateDocument[]> {
  //   let url = buildRequest(this.apiService.API.BE.EDIT_COMPANY_AREA,
  //     {
  //       ':id': this.companyId,
  //       ':areaName': name
  //     });
  //    console.log('data', this.apiService.get<any>(url, name).toPromise());
  //   return await this.apiService.get<any>(url, name).toPromise();
  // }

  getAllRoll(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/roleList', data, this.getHeader());
  }
  async deleteRole(name: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.DELETE_COMPANY_ROLE,
      {
        ':id': this.companyId,
        ':roleName': name
      });
    return await this.apiService.delete<any>(url).toPromise();
  }
  async addRole(name: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_ROLE,
      {
        ':id': this.companyId,
        ':role': name
      });
    return await this.apiService.post<any>(url, name).toPromise();
  }
  async editRole(roleName: any, role: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.UPDATE_COMPANY_ROLE,
      {
        ':id': this.companyId,
        ':roleName': roleName,
        ':role': role
      });
    return await this.apiService.put<any>(url, roleName).toPromise();
  }


  getJobTitle(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/jobTitleList', data, this.getHeader());
  }
  async deletejob(name: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.DELETE_COMPANY_JOBTITLE,
      {
        ':id': this.companyId,
        ':jobTitleName': name
      });
    return await this.apiService.delete<any>(url).toPromise();
  }
  async addJob(name: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_JOBTITLE,
      {
        ':id': this.companyId,
        ':jobTitle': name
      });
    return await this.apiService.post<any>(url, name).toPromise();
  }
  async editJob(jobTitleName: any, jobTitle: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.UPDATE_COMPANY_JOBTITLE,
      {
        ':id': this.companyId,
        ':jobTitleName': jobTitleName,
        ':jobTitle': jobTitle
      });
    return await this.apiService.put<any>(url, jobTitleName).toPromise();
  }
  async getAreaScope(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.get<RecruitingCandidateDocument[]>(this.apiService.API.BE.ADD_AREA_SCOPE_LIST , data).toPromise();
  }
}
