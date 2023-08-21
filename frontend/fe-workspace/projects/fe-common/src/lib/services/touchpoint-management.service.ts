import { Injectable } from '@angular/core';
import { TouchPoint, TouchPointSettings } from '../models/touchpoint';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import { CommonService } from './common.service';
import { UserManagementService } from './user-management.service';

export class TouchPointListResult extends BaseResponse {
    touchPoints: TouchPoint[];
}

export class TouchPointSettinsResult extends BaseResponse {
    settings: TouchPointSettings;
}

export class TouchPointResult extends BaseResponse {
    touchPoint: TouchPoint;
}

@Injectable({
    providedIn: 'root'
})
export class TouchpointManagementService {

    constructor(private apiService: ApiService) {

    }

    keepAlive(id: string, deviceId: string, name: string, startedAt: Date, officeInCount: number, officeOutCount: number, isLegacy: boolean): Promise<BaseResponse> {
        let body = {
            id: id,
            deviceId: deviceId,
            name: name,
            userAgent: window.navigator.userAgent.toLowerCase(),
            startedAt: startedAt,
            officeInCount: officeInCount,
            officeOutCount: officeOutCount
        };
        let url = isLegacy ? this.apiService.API.BE.TOUCHPOINT_KEEP_ALIVE_LEGACY : this.apiService.API.BE.TOUCHPOINT_KEEP_ALIVE;
        return this.apiService.post<BaseResponse>(url, body).toPromise();
    }

    getTouchPointList(): Promise<TouchPointListResult> {
        return this.apiService.get<TouchPointListResult>(this.apiService.API.BE.TOUCHPOINT_LIST).toPromise();
    }

    getTouchPointSettings(): Promise<TouchPointSettinsResult> {
        return this.apiService.get<TouchPointSettinsResult>(this.apiService.API.BE.TOUCHPOINT_SETTINGS).toPromise();
    }

    updateTouchPointSettings(settings: TouchPointSettings): Promise<Response> {
        return this.apiService.put<Response>(this.apiService.API.BE.TOUCHPOINT_SETTINGS, settings).toPromise();
    }

    touchPointPair(id: string, deviceId: string, extra: string): Promise<TouchPointResult> {
        let body = {
            "id": id,
            "deviceId": deviceId,
            "extra": extra
        };
        return this.apiService.post<TouchPointResult>(this.apiService.API.BE.TOUCHPOINT_PAIR, body).toPromise();
    }

    touchPointRegister(id: string, name: string, desctiption: string, companyId: string): Promise<BaseResponse> {
        let body = {
            "id": id,
            "name": name,
            "description": desctiption,
            "companyId": companyId
        };
        return this.apiService.post<BaseResponse>(this.apiService.API.BE.TOUCHPOINT_REGISTER, body).toPromise();
    }

    touchPointCheckPair(id: string, deviceId: string): Promise<TouchPointResult> {
        let body = {
            "id": id,
            "deviceId": deviceId
        };
        return this.apiService.post<TouchPointResult>(this.apiService.API.BE.TOUCHPOINT_CHECK_PAIR, body).toPromise();
    }

    touchPointDelete(id: string): Promise<TouchPointResult> {
        let url = buildRequest(this.apiService.API.BE.TOUCHPOINT_DELETE,
            {
                ':id': id
            });
        return this.apiService.delete<TouchPointResult>(url).toPromise();
    }

    touchPointUnlockPairing(id: string): Promise<TouchPointResult> {
        let url = buildRequest(this.apiService.API.BE.TOUCHPOINT_UNLOCK_PAIR,
            {
                ':id': id
            });
        return this.apiService.get<TouchPointResult>(url).toPromise();
    }

}
