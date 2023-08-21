import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogItem, LOG_LEVEL } from '../models/log-event';
import { ApiService } from './api';

export class LogEventsResult {
    result: boolean;
    reason: string;
    data: LogItem[];
}

@Injectable({
    providedIn: 'root'
})
export class LogManagementService {

    constructor(private apiService: ApiService) { }

    async logEvent(message: string, level: LOG_LEVEL): Promise<any> {
        let body = {
            message: message,
            level: level
        };
        return this.apiService.post<any>(this.apiService.API.BE.LOG_EVENT, body).toPromise();
    }

    async getLogEvents(pageIndex: number, itemCount: number): Promise<LogEventsResult> {
        const queryParams = new HttpParams()
            .append('pageIndex', pageIndex.toString())
            .append('itemCount', itemCount.toString());

        return this.apiService.get<LogEventsResult>(this.apiService.API.BE.GET_LOG_EVENTS, { params: queryParams }).toPromise();
    }

    GET_LOG_EVENT
}
