import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService, buildRequest } from './api';

@Injectable({
    providedIn: 'root'
})

export class EmcService {
    constructor(
        private apiService: ApiService,
        private sanitizer: DomSanitizer,
        private http: HttpClient
    ) { }

    getFileDetails(data: any): Promise<any> {
      return this.http.post(this.apiService.resolveApiUrl(this.apiService.API.BE.EMC_LOGIN), data).toPromise();
    }

}
