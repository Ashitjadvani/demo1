import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AccessControlPassage, AvailableAccessControlCentralUnit, AvailableAccessControlGroup, Site, SiteDailyStatus } from '../models/admin/site';
import { SiteCapacity } from '../models/admin/site-capacity';
import { SiteSafetyUsers } from '../models/site-safety-users';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import { AccessControlLog } from '../models/access-control-log';

export class GetSiteResult { // TODO refactor
    result: boolean;
    site: Site;
    reason: string;
}

export class GetSiteSafetyUsersResult { // TODO refactor
    result: boolean;
    reason: string;
    data: SiteSafetyUsers
}


export class SiteResponse extends BaseResponse {
    sites: Site[];
}

export class CentralUnitsResponse extends BaseResponse {
    centralUnits: AvailableAccessControlCentralUnit[];
}

export class GroupsResponse extends BaseResponse {
    centralUnits: AvailableAccessControlGroup[];
}

export class CentralUnitsCreateResponse extends BaseResponse {
    centralUnitIds: number[];
}
export class AccessControlLogResponse extends BaseResponse {
    logs: AccessControlLog[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminSiteManagementService {

    constructor(private apiService: ApiService,
        private _http: HttpClient) { }

    // SITE API
    async getSites(companyId: string): Promise<SiteResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_SITES,
            {
                ':companyId': companyId
            });
        return await this.apiService.get<SiteResponse>(url).toPromise();
    }

    async addOrUpdateSite(site: Site): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.ADD_UPDATE_SITE, site).toPromise();
    }

    async deleteSite(siteId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_SITE,
            {
                ':id': siteId
            });

        return await this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async getAccessControlCentralUnits(siteId: string): Promise<CentralUnitsResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCESS_CONTROL_CENTRAL_UNITS,
            {
                ':siteId': siteId
            });
        return await this.apiService.get<CentralUnitsResponse>(url).toPromise();
    }

    async getAccessControlGroups(siteId: string): Promise<GroupsResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCESS_CONTROL_GROUPS,
            {
                ':siteId': siteId
            });
        return await this.apiService.get<GroupsResponse>(url).toPromise();
    }

    async generateAccessControlCentralUnits(siteId: string, num: number, name: string, ssid: string, pass: string): Promise<CentralUnitsCreateResponse> {
        let url = buildRequest(this.apiService.API.BE.GENERATE_ACCESS_CONTROL_CENTRAL_UNITS,
            {
                ':siteId': siteId
            });
        let body = {
            num: num,
            name: name,
            ssid: ssid,
            pass: pass
        };
        return await this.apiService.post<CentralUnitsCreateResponse>(url, body).toPromise();
    }

    async createAccessControlGroup(siteId: string, name: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.CREATE_ACCESS_CONTROL_GROUP,
            {
                ':siteId': siteId
            });
        let body = {
            name: name
        };
        return await this.apiService.post<BaseResponse>(url, body).toPromise();
    }

    async sendAccessControlPostCommand(siteId: string, command: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.SEND_ACCESS_CONTROL_POST_COMMAND,
            {
                ':siteId': siteId
            });
        let body = {
            url: command
        };
        return await this.apiService.post<BaseResponse>(url, body).toPromise();
    }

    async activateAccessControlRing(centralUnitId: number): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ACTIVATE_ACCESS_CONTROL_RING_USER,
            {
                ':id': centralUnitId
            });
        return await this.apiService.get<BaseResponse>(url).toPromise();
    }

    async readAccessControlLogs(): Promise<BaseResponse> {
        return await this.apiService.get<BaseResponse>(this.apiService.API.BE.READ_ACLOGS).toPromise();
    }

    async listAccessControlLogsBySite(siteId: string): Promise<AccessControlLogResponse> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_SITE,
            {
                ':id': siteId
            });
        return await this.apiService.get<AccessControlLogResponse>(url).toPromise();
    }

    async listAccessControlLogsByUnit(unitsId: string[]): Promise<AccessControlLogResponse> {
        let body = {
            unitsId: unitsId
        }
        return await this.apiService.post<AccessControlLogResponse>(this.apiService.API.BE.LIST_ACLOGS_BY_UNIT, body).toPromise();
    }

    async listAccessControlLogsByDate(startYYYYMMDD: string, endYYYYMMDD: string): Promise<AccessControlLogResponse> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_DATE,
            {
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return await this.apiService.get<AccessControlLogResponse>(url).toPromise();
    }

    async listAccessControlLogsBySiteAndDate(siteId: string, startYYYYMMDD: string, endYYYYMMDD: string): Promise<AccessControlLogResponse> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_SITE_AND_DATE,
            {
                ':id': siteId,
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return await this.apiService.get<AccessControlLogResponse>(url).toPromise();
    }

    async listAccessControlLogsByUnitAndDate(unitsId: string[], startYYYYMMDD: string, endYYYYMMDD: string): Promise<AccessControlLogResponse> {
        let url = buildRequest(this.apiService.API.BE.LIST_ACLOGS_BY_UNIT_AND_DATE,
            {
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        let body = {
            unitsId: unitsId
        }
        return await this.apiService.post<AccessControlLogResponse>(url, body).toPromise();
    }







    // LEGACY
    async siteList(): Promise<Site []> {
        return await this.apiService.get<Site[]>(this.apiService.API.BE.SITE_LIST).toPromise();
    }

    async createSite(site: Site): Promise<any> {
        console.log('create site call server: ' + site.key);
        let bodyRequest = site;
        let ret = await this.apiService.post<any>(this.apiService.API.BE.SITE, bodyRequest).toPromise();
        return ret;
    }

    async deleteSiteLegacy(siteKey: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.SITE_KEY,
            {
                ':key': siteKey
            });
        return await this.apiService.delete<any>(url).toPromise();
    }

    async updateSite(siteUpdated: Site): Promise<any> {
        console.log('call server: ' + siteUpdated.key);
        let bodyRequest = siteUpdated;
        let ret = await this.apiService.put<any>(this.apiService.API.BE.SITE, bodyRequest).toPromise();
        return ret;
    }

    async getSite(siteKey: string): Promise<GetSiteResult> {
        let url = buildRequest(this.apiService.API.BE.SITE_KEY,
            {
                ':key': siteKey
            });
        return await this.apiService.get<GetSiteResult>(url).toPromise();
    }

    async uploadSites(file: File): Promise<any> {
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);

        let url = this.apiService.API.BE.UPLOAD_SITES;
        let req = new HttpRequest("POST", url, formData, {
            reportProgress: true
        });

        return this._http.request(req).toPromise();
    }

    async updateSiteDailyStatus(siteStatuses: SiteDailyStatus[]): Promise<any> {
        return await this.apiService.post<any>(this.apiService.API.BE.SITE_DAILY_STATUS, siteStatuses).toPromise();
    }

    async getSiteDailyStatus(siteKey: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.GET_SITE_DAILY_STATUS,
            {
                ':siteKey': siteKey
            });
        let ret = await this.apiService.get<any>(url).toPromise();
        return ret;
    }

    async updateSiteDailyStatusCapacity(siteKey: string, date: string, operation: number) {
        let url = buildRequest(this.apiService.API.BE.UPDATE_SITE_DAILY_STATUS_CAP,
            {
                ':siteKey': siteKey,
                ':date': date
            });
        let body = {
            operation: operation
        };
        return await this.apiService.post<any>(url, body).toPromise();

    }

    async getSiteCapacityDateRange(siteKey: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.SITE_CAPACITY_TIMEFRAME,
            {
                ':siteKey': siteKey
            });
        return await this.apiService.get<any>(url).toPromise();

    }

    async updateSiteCapacityDateRange(siteCapacity: SiteCapacity): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.SITE_CAPACITY_TIMEFRAME,
            {
                ':siteKey': siteCapacity.siteKey
            });
        return await this.apiService.put<any>(url, siteCapacity).toPromise();
    }

    async getSiteDailyStatistics(siteKey: string, date: string) {
        let url = buildRequest(this.apiService.API.BE.SITE_DAILY_STATISTICS,
            {
                ':siteKey': siteKey,
                ':date': date
            });
        return await this.apiService.get<any>(url).toPromise();
    }

    async getUsersDailyActivities(date: string) {
        let url = buildRequest(this.apiService.API.BE.USER_DAILY_ACTIVITIES,
            {
                ':date': date
            });
        return await this.apiService.get<any>(url).toPromise();
    }

    async getSitePresenceStatistics(siteKey: string, dateStart: string, dateEnd: string) {
        let url = buildRequest(this.apiService.API.BE.SITE_PRESENCE_STATS,
            {
                ':siteKey': siteKey,
                ':startDate': dateStart,
                ':endDate': dateEnd
            });
        return await this.apiService.get<any>(url).toPromise();
    }

    async getSiteSafetyUsers(siteKey: string) {
        let url = buildRequest(this.apiService.API.BE.GET_SAFETY,
            {
                ':siteKey': siteKey
            });
        return await this.apiService.get<any>(url).toPromise();
    }

}
