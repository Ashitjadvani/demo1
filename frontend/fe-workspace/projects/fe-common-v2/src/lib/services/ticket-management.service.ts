import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService, buildRequest } from './api';
import {TicketGenerateDocument, NEWS_ACTION_TYPE} from '../models/admin/ticket-generate-document';

@Injectable({
  providedIn: 'root'
})
export class TicketManagementService {
    constructor(private http: HttpClient,
        private apiService: ApiService) { }

    async getUserAlertList(userId: string): Promise<TicketGenerateDocument[]> {
        let url = buildRequest(this.apiService.API.BE.TICKET_DOCLIST,
            {
                ':userId': userId
            });
        return await this.apiService.get<TicketGenerateDocument[]>(url).toPromise();
    }

    async getAlertsList(): Promise<TicketGenerateDocument[]> {
        return this.apiService.get<TicketGenerateDocument[]>(this.apiService.API.BE.TICKET_LISTALL).toPromise();
    }

    uploadDocument(file: File, news: TicketGenerateDocument): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("document", JSON.stringify(news))
        if (file)
            formData.append("file", file, file.name);

        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.TICKET_UPLOAD);
        let req = new HttpRequest("PUT", url, formData, {
            reportProgress: true
        });

        let progress = new Subject<number>();
        return this.http.request(req);
    }

    async deleteDocument(id: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.TICKET_DOC,
            {
                ':id': id
            });
        return await this.apiService.delete<any>(url).toPromise();
    }

    downloadDocument(id: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.TICKET_DOWNLOAD,
            {
                ':id': id
            });
        return this.apiService.get(url, { responseType: 'arraybuffer' });
    }

    async actionOnDocument(id: string, userId: string, action: NEWS_ACTION_TYPE): Promise<TicketGenerateDocument> {
        let url = buildRequest(this.apiService.API.BE.TICKET_ACTION,
            {
                ':id': id
            });
        let body = {
            userId: userId,
            action: action
        }
        return await this.apiService.put<TicketGenerateDocument>(url, body).toPromise();
    }
}
