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
    async getCategoriesList(): Promise<CategoryDocument[]> {
        var params = null;
        return this.apiService.post<CategoryDocument[]>(this.apiService.API.BE.INFO_CATEGORY_LISTALL, params).toPromise();
    }

    uploadDocument(file: File, info: InformationDocument): Observable<any> {
        let formData: FormData = new FormData();
        formData.append('document', JSON.stringify(info));
        formData.append('file', file, file.name);
        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.INFO_UPLOAD);
        let req = new HttpRequest('PUT', url, formData, {
            reportProgress: true
        });

        let progress = new Subject<number>();
        return this.http.request(req);
    }
    async getInformationById(id: string): Promise<InformationDocument[]> {
        let url = buildRequest(this.apiService.API.BE.INFO_DOC,
            {
                ':id': id
            });
        return await this.apiService.get<any>(url).toPromise();
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

  async createOrUpdateInformation(category: InformationDocument): Promise<BaseResponse> {
    return await this.apiService.post<BaseResponse>(this.apiService.API.BE.CREATE_OR_UPDATE_CATEGORY, category).toPromise();
  }


    async getCategoryById(id: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_CATEGORY_BY_ID,
            {
                ':id': id
            });
        return await this.apiService.get<any>(url).toPromise();
    }

    downloadDocument(filename: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.INFO_DOWNLOAD,
            {
                ':filename': filename
            });
        return this.apiService.get(url, { responseType: "arraybuffer" });
    }

}
