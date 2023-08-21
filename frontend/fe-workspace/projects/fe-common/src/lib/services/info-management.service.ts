import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { InformationDocument} from '../models/admin/information-document';
import { CategoryDocument} from '../models/admin/information-category-document';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';

@Injectable({
  providedIn: 'root'
})
export class InfoManagementService {
    constructor(private http: HttpClient,
        private apiService: ApiService) { }

    
    async getInformationsList(): Promise<InformationDocument[]> {
        return this.apiService.get<InformationDocument[]>(this.apiService.API.BE.INFO_LISTALL).toPromise();
    }

    async getPublicInformationsList(): Promise<InformationDocument[]> {
        return this.apiService.get<InformationDocument[]>(this.apiService.API.BE.INFO_LISTPUBLIC).toPromise();
    }

    async getCategoriesList(): Promise<CategoryDocument[]> {
        return this.apiService.get<CategoryDocument[]>(this.apiService.API.BE.INFO_CATEGORY_LISTALL).toPromise();
    }

    uploadDocument(files: File[], info: InformationDocument): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("document", JSON.stringify(info))

        for (let i = 0; i < files.length; i++) {
            formData.append("file"+i, files[i])
        }

        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.INFO_UPLOAD);
        let req = new HttpRequest("PUT", url, formData, {
            reportProgress: true
        });

        let progress = new Subject<number>();
        return this.http.request(req);
    }

    async deleteDocument(id: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.INFO_DOC,
            {
                ':id': id
            });
        return await this.apiService.delete<any>(url).toPromise();
    }

    async deleteCategory(id: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.INFO_CATEGORY_DOC,
            {
                ':id': id
            });
        return await this.apiService.delete<any>(url).toPromise();
    }
    async createCategory(category: CategoryDocument): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.CREATE_CATEGORY, category).toPromise();
    }

    async updateCategory(category: CategoryDocument): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.UPDATE_CATEGORY, category).toPromise();
    }

    async createOrUpdateCategory(category: CategoryDocument): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.CREATE_OR_UPDATE_CATEGORY, category).toPromise();
    }

    downloadDocument(filename: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.INFO_DOWNLOAD,
            {
                ':filename': filename
            });
        return this.apiService.get(url, { responseType: "arraybuffer" });
    }

    downloadPublicDocument(lang: string, id: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.INFO_PUBLIC_DOWNLOAD,
            {
                ':lang': lang,
                ':id': id
            });
        return this.apiService.get(url, { responseType: "arraybuffer" });
    }

}
