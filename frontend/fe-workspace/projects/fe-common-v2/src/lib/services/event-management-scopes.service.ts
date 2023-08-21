import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../models/api/api-response';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventManagementScopesService {
  // baseUrl: string = environment.api_host;
  constructor(private api: ApiService) {
  }

  async getScopesList(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_SCOPES_LIST, data).toPromise();
  }

  async getEventScopesList(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_EVENT_SCOPES_LIST, data).toPromise();
  }

  async deleteEventScopes(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_SCOPES_DELETE, data).toPromise();
  }

  editScopeType(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_SCOPES_EDIT, data);
  }

  addScopeType(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_SCOPES_ADD, data);
  }

  multipleDeleteScopesType(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_SCOPES_MULTIPLE_DELETE, data);
  }
}


