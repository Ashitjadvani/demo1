import { Injectable } from '@angular/core';
import {ApiResponse} from "../models/api/api-response";
import {Observable} from "rxjs";
import {ApiService} from "./api";

@Injectable({
  providedIn: 'root'
})
export class EventManagementExternalVenuesService {

  constructor(private api: ApiService) { }

  async getEventExternalVenuesList(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_EXTERNAL_VENUES_LIST, data).toPromise();
  }

  async deleteEventExternalVenues(data: any): Promise<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(this.api.API.BE.EVENT_MANAGEMENT_EXTERNAL_VENUES_DELETE, data).toPromise();
  }

  editExternalVenuesType(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_EXTERNAL_VENUES_EDIT, data);
  }

  addExternalVenuesType(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_EXTERNAL_VENUES_ADD, data);
  }

  multipleDeleteExternalVenuesType(data: any): Observable<any>{
    return this.api.post<any>(this.api.API.BE.EVENT_MANAGEMENT_EXTERNAL_VENUES_MULTIPLE_DELETE, data);
  }
}
