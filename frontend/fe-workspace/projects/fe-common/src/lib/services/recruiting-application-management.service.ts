import {HttpClient, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingOpeningDocument, NEWS_ACTION_TYPE} from '../models/admin/recruiting-opening-document';

@Injectable({
  providedIn: 'root'
})
export class RecruitingApplicationManagementService {
  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  async getUserAlertList(userId: string): Promise<RecruitingOpeningDocument[]> {
    let url = buildRequest(this.apiService.API.BE.TICKET_DOCLIST,
      {
        ':userId': userId
      });
    return await this.apiService.get<RecruitingOpeningDocument[]>(url).toPromise();
  }

  async getApplicationList(data): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_APPLICATION_LISTING, data).toPromise();
  }

  async getApplicationBudgeCount(): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_APPLICATION_BUDGE_COUNT, null).toPromise();
  }

  async getApplicationCandidateList(data): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_CANDIDATE_APPLICATION_LISTING, data).toPromise();
  }

  async getApplicationStatusList(): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_STATUS_APPLICATION_LISTING, null).toPromise();
  }

  async readApplicationStatus(data): Promise<any> {
    return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_STATUS_READ_JOB_APPLICATION, data).toPromise();
  }

  async saveApplicationHistory(data): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_SAVE_HISTORY, data).toPromise();
  }

  async getApplicationHistory(data): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_GET_HISTORY, data).toPromise();
  }
  async getQuestionByJobApplication(data): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.GET_QUESTION_BY_JOB_APPLICATION, data).toPromise();
  }
  async getApplicationMetric(data): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_GET_SURVEY_METRIC, data).toPromise();
  }

  async getAdditionalDetails(data): Promise<RecruitingOpeningDocument[]> {
    return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.GET_ADDITIONAL_DETAILS_BY_JOB_APPLICATION, data).toPromise();
  }

  uploadDocument(file: File, news: RecruitingOpeningDocument): Observable<any> {
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

  insertDocument(job: RecruitingOpeningDocument): Observable<any> {
    let url = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_CREATE);
    let req = new HttpRequest("POST", url, job, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  async deleteDocument(obj: any): Promise<any> {
    let url = this.apiService.API.BE.RECRUITING_APPLICATION_DELETE;
    return await this.apiService.post<any>(url, obj).toPromise();
  }

  downloadDocument(id: string): Observable<any> {
    let url = buildRequest(this.apiService.API.BE.RECRUITING_DATA_STORAGE_DOWNLOAD,
      {
        ':id': id
      });
    return this.apiService.get(url, {responseType: 'arraybuffer'});
  }

  async actionOnDocument(id: string, userId: string, action: NEWS_ACTION_TYPE): Promise<RecruitingOpeningDocument> {
    let url = buildRequest(this.apiService.API.BE.TICKET_ACTION,
      {
        ':id': id
      });
    let body = {
      userId: userId,
      action: action
    }
    return await this.apiService.put<RecruitingOpeningDocument>(url, body).toPromise();
  }
}
