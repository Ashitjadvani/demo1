import {Injectable} from '@angular/core';
import {ApiService, buildRequest} from './api';
import {BaseResponse} from './base-response';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

export class GetSettingsValueResult extends BaseResponse {
    baseUrl: string = environment.api_host;

    value: any;
}

export class SettingsResult extends BaseResponse {
    value: any;
}

@Injectable({
    providedIn: 'root'
})
export class ServerSettingsManagementService {
    baseUrl: string = environment.api_host;
    token: any;
    companyId: any;

    constructor(
        private apiService: ApiService,
        private http: HttpClient
    ) {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.token = authUser.token;
            this.companyId = authUser.person.companyId;
            // console.log('token', this.token);
            // console.log('id', this.companyId);
        }
    }

    async getValue(key: string): Promise<GetSettingsValueResult> {
        return this.apiService.post<GetSettingsValueResult>(this.apiService.API.BE.SETTINGS, {key: key}).toPromise();
    }

    async setValue(key: string, value: any): Promise<BaseResponse> {
        return this.apiService.put<BaseResponse>(this.apiService.API.BE.SETTINGS, {key: key, value: value}).toPromise();
    }

    async setServer(data: any): Promise<BaseResponse> {
        return this.apiService.put<BaseResponse>(this.apiService.API.BE.SETTINGS, data).toPromise();
    }

    getServer(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + '/v2/settings', data);
    }

    getById(id: string): Promise<SettingsResult> {
        let url = buildRequest(this.apiService.API.BE.SETTINGS_BY_ID,
            {
                ':id': id
            });
        return this.apiService.get<SettingsResult>(url).toPromise();
    }

    setById(id: string, data: any): Promise<SettingsResult> {
        let url = buildRequest(this.apiService.API.BE.SETTINGS_BY_ID,
            {
                ':id': id
            });
        return this.apiService.post<SettingsResult>(url, data).toPromise();
    }
}
