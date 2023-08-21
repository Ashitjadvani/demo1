import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class RecruitingDashboardManagementService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  async getDashboard(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_DASHBOARD_MANAGEMEN, data).toPromise();
  }
}
