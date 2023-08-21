import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { BaseResponse } from './base-response';

export class GetSettingsValueResult extends BaseResponse {
    value: any;
}

@Injectable({
    providedIn: 'root'
})
export class ServerSettingsManagementService {

    constructor(
        private apiService: ApiService
    ) { }

    async getValue(key: string): Promise<GetSettingsValueResult> {
        return this.apiService.post<GetSettingsValueResult>(this.apiService.API.BE.SETTINGS, { key: key }).toPromise();
    }

    async setValue(key: string, value: any) : Promise<BaseResponse> {
        return this.apiService.put<BaseResponse>(this.apiService.API.BE.SETTINGS, { key: key, value: value }).toPromise();
    }

}
