import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import { AccessControlLog } from '../models/access-control-log';
import { BaseResponse } from './base-response';

@Injectable({
  providedIn: 'root'
})

export class AccessControlService {
    baseUrl: string = environment.api_host;
    token: any;
    companyId: any;
    private httpOptions: any;

    constructor(private http: HttpClient, private apiService: ApiService) { 
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.token = authUser.token;
        }
    }

    public getHeader(): any {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.token = authUser.token;
            this.companyId = authUser.person.companyId;
            this.httpOptions = {
            headers: new HttpHeaders({
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }),
            };

        }
        return this.httpOptions;
    }

    async readAccessControlLogs(): Promise<any> {
        return await this.apiService.get<any>(this.apiService.API.BE.READ_ACLOGS).toPromise();
    }

    async listAccessControlLogsBySite(siteId: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_SITE,
            {
                ':id': siteId
            });
        return await this.apiService.get<any>(url).toPromise();
    }  

    async listAccessControlLogsByUnit(unitsId: string[]): Promise<any> {
        let body = {
            unitsId: unitsId
        }
        return await this.apiService.post<any>(this.apiService.API.BE.LIST_ACLOGS_BY_UNIT, body).toPromise();
    }    

    async listAccessControlLogsByDate(startYYYYMMDD: string, endYYYYMMDD: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_DATE,
            {
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return await this.apiService.get<any>(url).toPromise();
    }   

    async listAccessControlLogsBySiteAndDate(siteId: string, startYYYYMMDD: string, endYYYYMMDD: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_SITE_AND_DATE,
            {
                ':id': siteId,
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return await this.apiService.get<any>(url).toPromise();
    }   

    async listAccessControlLogsByUnitAndDate(unitsId: string[], startYYYYMMDD: string, endYYYYMMDD: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_UNIT_AND_DATE,
            {
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        let body = {
            unitsId: unitsId
        }
        return await this.apiService.post<any>(url, body).toPromise();
    }


    // USER BADGE

    getUserBadges(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-user-qrcodes", data);
    }
    
    getUserBadgesByUserId(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-user-qrcodes-byuser", data);
    }
    getUserBadge(id: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/get-user-qrcode/" + id);
    }

    blockUserBadge(id: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + '/v2/access-control-manager/block-user-qrcode/' + id);
    }

 
    // EXT BADGE
    
    getExtBadges(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-ext-qrcodes", data);
    }

    getExtBadge(id: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/get-ext-qrcode/" + id);
    }
    
    getExtBadgeByName(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/get-ext-qrcode-byname",data);
    }

    blockExtBadge(id: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + '/v2/access-control-manager/block-ext-qrcode/' + id);
    }
    
    renewExtBadge(id: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + '/v2/access-control-manager/renew-ext-qrcode/' + id);
    }

    generateCustomAccessControlQrCode(codeData: any, siteId: string): Observable<any> {
        let data = {
            codeData: codeData,
            siteId: siteId
        }
        return this.apiService.post<any>(this.apiService.API.BE.GENERATE_CUSTOM_ACCESS_CONTROL_QR_CODE,data);
    }
    
 
    // LOGS

    getLogs(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-logs", data);
    }

    getLogsReportCsv(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/get-logs-report-csv", data);
    }
    
    getLogsReport(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/get-logs-report", data);
    }

    addManualLog(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/add-log", data);
    }
        
 
    // REQUESTS

    getRequest(id: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + '/v2/access-control-manager/get-request/' + id);
    }

     
    // SYSTEMS
    
    getSystems(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-systems", data);
    }    

    getAllSystems(data: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-systems");
    }
        
    checkSystemTemp(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/check-system-temp", data);
    }
        
    checkSystem(data: any, id: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/check-system/" + id, data);
    }
        
    getCompanySystems(data: any, companyId: string): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-company-systems/" + companyId, data);
    }
   
    addEditSystem(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/system", data);
    }
       
    deleteSystem(systemId: any): Observable<any> {
        return this.http.delete<any>(this.baseUrl + "/v2/access-control-manager/delete-system/" + systemId);
    }
        
    getSystem(systemId: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/get-system/" + systemId);
    }


    // GATES

    getGates(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-gates", data);
    }
            
    getGate(gateId: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/get-gate/" + gateId);
    }
           
    deleteGate(gateId: any): Observable<any> {
        return this.http.delete<any>(this.baseUrl + "/v2/access-control-manager/delete-gate/" + gateId);
    }
            
    getFullCompanyGatesList(companyId: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-company-gates/" + companyId);
    }

    getFullCompanyGatesListBySite(companyId: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-company-gates-by-site/" + companyId);
    }
            
    getFullSiteGatesList(siteId: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-site-gates/" + siteId);
    }
                
    getFullSystemGatesList(systemId: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-system-gates/" + systemId);
    }        

    getFullSystemGatesListBySite(systemId: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-system-gates-by-site/" + systemId);
    }

    generateGate(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/generate-gate", data);
    }
    
    modifyGate(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/modify-gate", data);
    }
    

    // GATES GROUPS

    getGatesGroups(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/list-gates-groups", data);
    }
            
    getGatesGroup(groupId: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/get-gates-group/" + groupId);
    }

    getGatesGroupUserList(groupId: any): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/get-gates-group-user-list/" + groupId);
    }
           
    deleteGatesGroup(groupId: any): Observable<any> {
        return this.http.delete<any>(this.baseUrl + "/v2/access-control-manager/delete-gates-group/" + groupId);
    }
            
    getFullCompanyGatesGroupsList(companyId: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-company-gates-groups/" + companyId);
    }
                
    getFullSystemGatesGroupsList(systemId: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/list-all-system-gates-groups/" + systemId);
    }        

    addUpdateGatesGroup(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/gates-group", data);
    }

    // USER PRESENCE

    getTodayUserPresence(): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/people-presence/get-today-presence");
    }    

    getDayUserPresence(dateYYYYMMDD: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + "/v2/access-control-manager/people-presence/get-day-presence/"+ dateYYYYMMDD);
    }  

    getUserPresences(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/people-presence/get-presences", data);
    }  

    getEmployeePresences(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/v2/access-control-manager/employee-presence/get-presences", data);
    } 
}
