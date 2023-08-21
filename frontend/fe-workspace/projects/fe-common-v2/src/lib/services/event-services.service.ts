import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../models/api/api-response';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventManagementEventServices {
  // baseUrl: string = environment.api_host;
  constructor(private api: ApiService) {
  }

  async getEventServicesList(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_EVENT_SERVICES_LIST, data).toPromise();
  }

  async deleteEventServices(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_EVENT_SERVICES_DELETE, data).toPromise();
  }

  editEventServices(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_EVENT_SERVICES_EDIT, data);
  }

  addEventServices(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_EVENT_SERVICES_ADD, data);
  }

  multipleDeleteEventServices(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_EVENT_SERVICES_MULTIPLE_DELETE, data);
  }
}


