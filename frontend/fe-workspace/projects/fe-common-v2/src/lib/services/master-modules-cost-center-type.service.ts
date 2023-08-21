import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MasterModulesCostCenterTypeService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  async getCostCenterType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_LIST, data).toPromise();
  }

  async deleteCostCenterType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_DELETE, data).toPromise();
  }

  async addCostCenterType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_ADD, data).toPromise();
  }

  async editCostCenterType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_ADD, data).toPromise();
  }

  // multipleDeleteCostCenterType(data: any):<Observable<any> {
  //   return this.apiService.post<any>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_MULTIPLE_DELETE, data);
  // }

  multipleDeleteCostCenterType(data: any): Observable<any>{
    return this.apiService.post<any>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_MULTIPLE_DELETE, data);
  }

  getSingleRecord(data: any): Observable<any>{
    return this.apiService.post<any>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_EDIT, data);
  }
}
