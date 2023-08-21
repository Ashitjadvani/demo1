import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';

@Injectable({
    providedIn: 'root'
})
export class DataStorageManagementService {

    constructor(private apiService: ApiService,
        private sanitizer: DomSanitizer,
        private http: HttpClient) { }

    async uploadFile(file: File): Promise<any> {
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);

        let req = new HttpRequest("POST", this.apiService.resolveApiUrl(this.apiService.API.BE.DATA_STORAGE_UPLOAD), formData, {
            reportProgress: true
        });

        return this.http.request(req).toPromise();
    }

    downloadFile(fileId: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.DATA_STORAGE_DOWNLOAD,
            {
                ':id': fileId
            });
        return this.http.get(this.apiService.resolveApiUrl(url), { responseType: "arraybuffer" });
    }

    getFileDetails(fileId: string): Promise<any> {
      return this.http.post(this.apiService.resolveApiUrl(this.apiService.API.BE.DATA_STORAGE_FILE_DETAILS), {id: fileId}).toPromise();
    }


    getFileBase64(fileId: string): Promise<any> {
      return this.http.post(this.apiService.resolveApiUrl(this.apiService.API.BE.DATA_STORAGE_GET_BASE64), {id: fileId}).toPromise();
    }

    removeFile(fileId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DATA_STORAGE_REMOVE,
            {
                ':id': fileId
            });
        return this.http.get<BaseResponse>(this.apiService.resolveApiUrl(url)).toPromise();
    }

    async downloadImageFile(imageId: string) {
        try {
            let res = await this.downloadFile(imageId).toPromise();

            let blob = new Blob([res]);
            return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
        } catch (ex) {
            return null;
        }
    }

}
