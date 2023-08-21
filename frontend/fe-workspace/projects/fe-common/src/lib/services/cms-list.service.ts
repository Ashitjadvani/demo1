import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request, REQUEST_STATE } from '../models/requests';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';

@Injectable({
    providedIn: 'root'
})

export class CMSManagementService {

  constructor(private apiService: ApiService) { }

  async getCMSList(): Promise<Request[]> {
      return this.apiService.post<Request[]>(this.apiService.API.BE.CMS_LIST, null).toPromise();
  }

  async saveCMSList(data): Promise<Request[]> {
    return this.apiService.post<Request[]>(this.apiService.API.BE.CMS_SAVE_LIST, data).toPromise();
  }

  async saveImage(data): Promise<Request[]> {
    return this.apiService.post<Request[]>(this.apiService.API.BE.RECRUITING_DATA_STORAGE_UPLOAD, data).toPromise();
  }

  async getImage(data): Promise<Request[]> {
    return this.apiService.post<Request[]>(this.apiService.API.BE.RECRUITING_DATA_STORAGE_IMAGE, data).toPromise();
  }

  async getDefaultImage(data): Promise<Request[]> {
    return this.apiService.post<Request[]>(this.apiService.API.BE.RECRUITING_GET_DEFAULT_IMAGE, data).toPromise();
  } 

  async saveDefaultImage(data): Promise<Request[]> {
    return this.apiService.post<Request[]>(this.apiService.API.BE.RECRUITING_SAVE_DEFAULT_IMAGE, data).toPromise();
  }

}
