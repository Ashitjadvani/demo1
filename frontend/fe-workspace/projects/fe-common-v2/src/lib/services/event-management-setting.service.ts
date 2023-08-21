import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api";
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventManagementSettingService {

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
    }


    getListEmailConfig(data: any): Observable<any> {
        return this.apiService.post<any>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_EMAIL_CONFIG, data);
    }
    getListForGeneralSettings(data: any): Observable<any> {
        return this.apiService.post<any>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_GENERAL_SETTINGS, data);
    }
    async updateEmailConfig(data: any): Promise<any[]> {
        return this.apiService.post<any[]>(this.apiService.API.BE.EVENT_MANAGEMENT_UPDATE_EMAIL_CONFIG, data).toPromise();
    }
    async updateGeneralSetting(data: any): Promise<any[]> {
        return this.apiService.post<any[]>(this.apiService.API.BE.EVENT_MANAGEMENT_UPDATE_GENERAL_SETTINGS, data).toPromise();
    }
    async getTemplateList(data: any): Promise<any[]> {
        return this.apiService.post<any[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_EMAIL_TEMPLATE, data).toPromise();
    }
    async getProcurementTemplateList(data: any): Promise<any[]> {
        return this.apiService.post<any[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_EMAIL_TEMPLATE_PROCURMENT, data).toPromise();
    }
    updateEmailTemplate(data: any): Observable<any>{
        return this.apiService.post<any>(this.apiService.API.BE.EVENT_MANAGEMENT_UPDATE_EMAIL_TEMPLATE, data);
    }
    updateProcurementEmailTemplate(data: any): Observable<any>{
        return this.apiService.post<any>(this.apiService.API.BE.EVENT_MANAGEMENT_UPDATE_EMAIL_TEMPLATE_PROCUREMENT, data);
    }

}
