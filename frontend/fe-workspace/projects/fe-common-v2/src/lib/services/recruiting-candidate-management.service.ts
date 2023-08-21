import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService, buildRequest } from './api';
import { RecruitingCandidateDocument, NEWS_ACTION_TYPE } from '../models/admin/recruiting-candidate-document';
import { BaseResponse } from 'projects/fe-common/src/lib/services/base-response';

@Injectable({
    providedIn: 'root'
})
export class RecruitingCandidateManagementService {
    constructor(private http: HttpClient,
        private apiService: ApiService) {
    }

    async getUserAlertList(userId: string): Promise<RecruitingCandidateDocument[]> {
        let url = buildRequest(this.apiService.API.BE.TICKET_DOCLIST,
            {
                ':userId': userId
            });
        return await this.apiService.get<RecruitingCandidateDocument[]>(url).toPromise();
    }

    async getCandidateList(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_CANDIDATE_LISTING, data).toPromise();
    }
    async deleteCandidate(id: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RECRUITING_CANDIDATE_DELETE, { id: id }).toPromise();
    }

    uploadDocument(file: File, news: RecruitingCandidateDocument): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("document", JSON.stringify(news))
        if (file)
            formData.append("file", file, file.name);

        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_CREATE);
        let req = new HttpRequest("PUT", url, formData, {
            reportProgress: true
        });

        let progress = new Subject<number>();
        return this.http.request(req);
    }

    insertDocument(job: RecruitingCandidateDocument): Observable<any> {
        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_CREATE);
        let req = new HttpRequest("POST", url, job, {
            reportProgress: true
        });
        return this.http.request(req);
    }

    async deleteDocument(obj: any): Promise<any> {
        let url = this.apiService.API.BE.RECRUITING_CANDIDATE_DELETE;
        return await this.apiService.post<any>(url, obj).toPromise();
    }

    downloadDocument(id: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.RECRUITING_DATA_STORAGE_DOWNLOAD,
            {
                ':id': id
            });
        return this.apiService.get(url, { responseType: 'arraybuffer' });
    }

    async actionOnDocument(id: string, userId: string, action: NEWS_ACTION_TYPE): Promise<RecruitingCandidateDocument> {
        let url = buildRequest(this.apiService.API.BE.TICKET_ACTION,
            {
                ':id': id
            });
        let body = {
            userId: userId,
            action: action
        }
        return await this.apiService.put<RecruitingCandidateDocument>(url, body).toPromise();
    }

    async readCandidate(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_STATUS_READ_CANDIDATE, data).toPromise();
    }
    
    async viewCandidate(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_CANDIDATE_APPLICATION_VIEW, data).toPromise();
    }

    async viewCandidate1(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_CANDIDATE_APPLICATION_LISTING, data).toPromise();
    }

    sendCandidatesRemainder(): Promise<BaseResponse> {
        return this.apiService.get<any>(this.apiService.API.BE.RECRUITING_CANDIDATE_SEND_REMAINDER).toPromise();
    }

    /*public downloadCv(id: number): Observable<any> {
      return this.apiService.get<any>(this.apiService.API.BE.RECRUITING_PERSON + '/' + id + '/cv', {responseType: 'arraybuffer'});
    }*/
}
