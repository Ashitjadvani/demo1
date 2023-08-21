import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NewsDocument, NEWS_ACTION_TYPE } from '../models/admin/news-document';
import { ApiService, buildRequest } from './api';
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";
import {BaseResponse} from "./base-response";
import {environment} from "../../../../fe-insights-v2/src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AlertsManagementService {
  baseUrl: string = environment.api_host;
    constructor(private http: HttpClient,
        private apiService: ApiService) { }

    async getUserAlertList(userId: string): Promise<NewsDocument[]> {
        let url = buildRequest(this.apiService.API.BE.ALERT_DOCLIST,
            {
                ':userId': userId
            });
        return await this.apiService.get<NewsDocument[]>(url).toPromise();
    }

    async getAlertsList(data: any): Promise<NewsDocument[]> {
        return this.apiService.post<NewsDocument[]>(this.apiService.API.BE.ALERT_LISTALL, data).toPromise();
    }


  async deleteAlert(id: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.ALERT_DOC,
      {
        ':id': id
      });
    return await this.apiService.delete<any>(url).toPromise();
  }

    uploadDocument(file: File, news: NewsDocument): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("document", JSON.stringify(news))
        if (file)
            formData.append("file", file, file.name);

        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.ALERT_UPLOAD);
        let req = new HttpRequest("PUT", url, formData, {
            reportProgress: true
        });

        let progress = new Subject<number>();
        return this.http.request(req);
    }

    async deleteDocument(id: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.ALERT_DOC,
            {
                ':id': id
            });
        return await this.apiService.delete<any>(url).toPromise();
    }

    downloadDocument(id: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.ALERT_DOWNLOAD,
            {
                ':id': id
            });
        return this.apiService.get(url, { responseType: "arraybuffer" });
    }

    async actionOnDocument(id: string, userId: string, action: NEWS_ACTION_TYPE): Promise<NewsDocument> {
        let url = buildRequest(this.apiService.API.BE.ALERT_ACTION,
            {
                ':id': id
            });
        let body = {
            userId: userId,
            action: action
        }
        return await this.apiService.put<NewsDocument>(url, body).toPromise();
    }

  async addAlerts(file: File,document: any): Promise<BaseResponse> {
    const formData: FormData = new FormData();
    formData.append("document", JSON.stringify(document));
    if (file)
            formData.append("file", file, file.name);
    return this.apiService.put<BaseResponse>(this.apiService.API.BE.ALERT_UPLOAD, formData).toPromise();
  }
  /*editAlerts(document: any): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(this.apiService.API.BE.ALERT_EDIT, document).toPromise();
  }*/
  editAlerts(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/v2/alert/edit', data);
  }
}
