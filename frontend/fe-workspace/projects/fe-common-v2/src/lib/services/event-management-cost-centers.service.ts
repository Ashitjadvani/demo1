import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../models/api/api-response';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";


@Injectable({
  providedIn: 'root'
})
export class EventManagementCostCenterService {

  constructor(private api: ApiService) {
  }

  async getCostCenterList(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_COST_CENTER_LIST, data).toPromise();
  }

  async getEventCostCenterList(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_EVENT_COST_CENTER_LIST, data).toPromise();
  }

  async deleteEventCostCenter(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_COST_CENTER_DELETE, data).toPromise();
  }

  editCostCenter(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_COST_CENTER_EDIT, data);
  }

  addCostCenter(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_COST_CENTER_ADD, data);
  }

  getCostCenterTypeList(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_COST_CENTER_TYPE_LIST, data);
  }

  multipleDeleteCostCentersType(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_COST_CENTER_MULTIPLE_DELETE, data);
  }
}


