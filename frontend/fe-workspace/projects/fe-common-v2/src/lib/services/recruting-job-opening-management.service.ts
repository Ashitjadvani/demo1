import { Injectable } from '@angular/core';
import { environment } from '../../../../fe-insights-v2/src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ApiService, buildRequest } from './api';
import { RecruitingCandidateDocument } from '../models/admin/recruiting-candidate-document';

@Injectable({
    providedIn: 'root',
})
export class RecrutingJobOpeningManagementService {
    constructor(private http: HttpClient, private apiService: ApiService) { }

    async getJobOpening(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService
            .post<RecruitingCandidateDocument[]>(
                this.apiService.API.BE.RECRUITING_OPENING_LISTING,
                data
            )
            .toPromise();
    }
    async deleteJob(id: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService
            .post<RecruitingCandidateDocument[]>(
                this.apiService.API.BE.RECRUITING_OPENING_DELETE,
                { id: id }
            )
            .toPromise();
    }
    async viewJob(data): Promise<any> {
        return this.apiService
            .post<any>(this.apiService.API.BE.RECRUITING_JOB_OPENING_VIEW, data)
            .toPromise();
    }

    async getScopeforJobOpening(): Promise<any> {
        return this.apiService
            .post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_SCOPES_LIST, null)
            .toPromise();
    }

    async getSiteforJobOpening(): Promise<any> {
        return this.apiService
            .post<any>(this.apiService.API.BE.GET_SITES, null)
            .toPromise();
    }

    async getHistoryList(data): Promise<any> {
        return this.apiService
            .post<any>(
                this.apiService.API.BE.RECRUITING_OPENING_HISTORY_LISTING,
                data
            )
            .toPromise();
    }
}
