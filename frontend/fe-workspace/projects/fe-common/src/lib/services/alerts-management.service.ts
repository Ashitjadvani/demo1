import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NewsDocument, NEWS_ACTION_TYPE } from '../models/admin/news-document';
import { ApiService, buildRequest } from './api';

@Injectable({
  providedIn: 'root'
})
export class AlertsManagementService {
    constructor(private http: HttpClient,
        private apiService: ApiService) { }

    async getUserAlertList(userId: string): Promise<NewsDocument[]> {
        let url = buildRequest(this.apiService.API.BE.ALERT_DOCLIST,
            {
                ':userId': userId
            });
        return await this.apiService.get<NewsDocument[]>(url).toPromise();
    }

    async getAlertsList(): Promise<NewsDocument[]> {
        return this.apiService.get<NewsDocument[]>(this.apiService.API.BE.ALERT_LISTALL).toPromise();
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
}
