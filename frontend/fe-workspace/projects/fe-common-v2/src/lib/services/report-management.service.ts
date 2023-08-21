import { Injectable } from '@angular/core';
import { ApiService, buildRequest } from './api';



@Injectable({
    providedIn: 'root'
})
export class ReportManagementService {

    constructor(private apiService: ApiService) {

    }

    getReportUsersPresence(year: string, month: string): Promise<string> {
        let url = buildRequest(this.apiService.API.BE.GET_REPORT_USERS_PRESENCE,
            {
                ':year': year,
                ':month': month
            });
        return this.apiService.get<string>(url, { responseType: 'text' }).toPromise();
    }

    getUserActivitiesCSV(scope: string, userId: string, dateFrom: string, dateTo: string): Promise<string> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_ACTIVITIES_CSV,
            {
                ':scope': scope,
                ':userId': userId == null ? 'all' : userId,
                ':dateFrom': dateFrom,
                ':dateTo': dateTo
            });
        return this.apiService.get<string>(url).toPromise();
    } 
}
