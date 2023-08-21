import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class RecrutingJobApplicationManagementService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  async getJobApplication(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_APPLICATION_LISTING, data).toPromise();
  }

  async deleteJobApp(id: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_APPLICATION_DELETE, { id: id}).toPromise();
  }
  async getUnreadCount(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_STATUS_READ_JOB_APPLICATION, data).toPromise();
  }
  async viewApplication(data): Promise<any> {
    return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_APPLICATION_VIEW_Details, data).toPromise();
  }
  async getApplicationHistory(data): Promise<any> {
    return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_GET_HISTORY, data).toPromise();
  }
  async getApplicationHistoryStatus(data): Promise<any> {
    return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_STATUS_APPLICATION_LISTING, data).toPromise();
  }
  async editStatusNotes(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_SAVE_HISTORY, data).toPromise();
  }
}
