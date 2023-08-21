import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Site, SiteDailyStatus } from '../models/admin/site';
import { SiteCapacity } from '../models/admin/site-capacity';
import { SiteSafetyUsers } from '../models/site-safety-users';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import {PeopleGroupResponse} from "./admin-user-management.service";

export class GetSiteResult {
  // TODO refactor
  result: boolean;
  site: Site;
  reason: string;
}

export class GetSiteSafetyUsersResult {
  // TODO refactor
  result: boolean;
  reason: string;
  data: SiteSafetyUsers;
}

export class SiteResponse extends BaseResponse {
  data: Site[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminSiteManagementService {
  constructor(private apiService: ApiService, private _http: HttpClient) {}

  // SITE API
  async getSites(companyId: string): Promise<SiteResponse> {
    var bodyRequest = {
      companyId: companyId,
    };
    return await this.apiService
      .post<any>(this.apiService.API.BE.GET_SITES, bodyRequest)
      .toPromise();
  }

  // SITE API
  async getFullSites(companyId: string): Promise<SiteResponse> {
    var bodyRequest = {
      companyId: companyId,
    };
    return await this.apiService
      .post<any>(this.apiService.API.BE.GET_FULL_SITE_LIST, bodyRequest)
      .toPromise();
  }
  async getGroups(companyId: string): Promise<SiteResponse> {
    var bodyRequest = {
      companyId: companyId,
    };
    return await this.apiService
      .get<any>(this.apiService.API.BE.GET_GROUPS_LIST_BY_COMPANY_, bodyRequest)
      .toPromise();
  }

  async getGroupList(companyId: string): Promise<SiteResponse> {
    let url = buildRequest(this.apiService.API.BE.GET_GROUPS_LIST_BY_COMPANY_, {
      ':companyId': companyId,
    });
    return await this.apiService.get<any>(url, companyId).toPromise();
  }

  async addOrUpdateSite(site: Site): Promise<BaseResponse> {
    return await this.apiService
      .post<BaseResponse>(this.apiService.API.BE.ADD_UPDATE_SITE, site)
      .toPromise();
  }

  async editSite(siteId: string): Promise<BaseResponse> {
    var parameter = {
      id: siteId
    }
    return await this.apiService.post<BaseResponse>(this.apiService.API.BE.VIEW_UPDATE_SITE, parameter).toPromise();
  }



  async deleteSite(siteId: string): Promise<BaseResponse> {
    let url = buildRequest(this.apiService.API.BE.DELETE_SITE, {
      ':id': siteId,
    });

    return await this.apiService.delete<BaseResponse>(url).toPromise();
  }

  // LEGACY
  async siteList(): Promise<Site[]> {
    return await this.apiService
      .get<Site[]>(this.apiService.API.BE.SITE_LIST)
      .toPromise();
  }

  async createSite(site: Site): Promise<any> {
    console.log('create site call server: ' + site.key);
    let bodyRequest = site;
    let ret = await this.apiService
      .post<any>(this.apiService.API.BE.SITE, bodyRequest)
      .toPromise();
    return ret;
  }

  async deleteSiteLegacy(siteKey: string): Promise<any> {
    let url = buildRequest(this.apiService.API.BE.SITE_KEY, {
      ':key': siteKey,
    });
    return await this.apiService.delete<any>(url).toPromise();
  }

  async updateSite(siteUpdated: Site): Promise<any> {
    console.log('call server: ' + siteUpdated.key);
    let bodyRequest = siteUpdated;
    let ret = await this.apiService
      .put<any>(this.apiService.API.BE.SITE, bodyRequest)
      .toPromise();
    return ret;
  }

  async getSite(siteKey: string): Promise<GetSiteResult> {
    let url = buildRequest(this.apiService.API.BE.SITE_KEY, {
      ':key': siteKey,
    });
    return await this.apiService.get<GetSiteResult>(url).toPromise();
  }

  async uploadSites(file: File): Promise<any> {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);

    let url = this.apiService.API.BE.UPLOAD_SITES;
    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });

    return this._http.request(req).toPromise();
  }

  async updateSiteDailyStatus(siteStatuses: SiteDailyStatus[]): Promise<any> {
    return await this.apiService
      .post<any>(this.apiService.API.BE.SITE_DAILY_STATUS, siteStatuses)
      .toPromise();
  }

  async getSiteDailyStatus(siteKey: string): Promise<any> {
    let url = buildRequest(this.apiService.API.BE.GET_SITE_DAILY_STATUS, {
      ':siteKey': siteKey,
    });
    let ret = await this.apiService.get<any>(url).toPromise();
    return ret;
  }

  async updateSiteDailyStatusCapacity(
    siteKey: string,
    date: string,
    operation: number
  ) {
    let url = buildRequest(
      this.apiService.API.BE.UPDATE_SITE_DAILY_STATUS_CAP,
      {
        ':siteKey': siteKey,
        ':date': date,
      }
    );
    let body = {
      operation: operation,
    };
    return await this.apiService.post<any>(url, body).toPromise();
  }

  async getSiteCapacityDateRange(siteKey: string): Promise<any> {
    let url = buildRequest(this.apiService.API.BE.SITE_CAPACITY_TIMEFRAME, {
      ':siteKey': siteKey,
    });
    return await this.apiService.get<any>(url).toPromise();
  }

  async updateSiteCapacityDateRange(siteCapacity: SiteCapacity): Promise<any> {
    let url = buildRequest(this.apiService.API.BE.SITE_CAPACITY_TIMEFRAME, {
      ':siteKey': siteCapacity.siteKey,
    });
    return await this.apiService.put<any>(url, siteCapacity).toPromise();
  }

  async getSiteDailyStatistics(siteKey: string, date: string) {
    let url = buildRequest(this.apiService.API.BE.SITE_DAILY_STATISTICS, {
      ':siteKey': siteKey,
      ':date': date,
    });
    return await this.apiService.get<any>(url).toPromise();
  }

  async getUsersDailyActivities(date: string) {
    let url = buildRequest(this.apiService.API.BE.USER_DAILY_ACTIVITIES, {
      ':date': date,
    });
    return await this.apiService.get<any>(url).toPromise();
  }

  async getSitePresenceStatistics(
    siteKey: string,
    dateStart: string,
    dateEnd: string
  ) {
    let url = buildRequest(this.apiService.API.BE.SITE_PRESENCE_STATS, {
      ':siteKey': siteKey,
      ':startDate': dateStart,
      ':endDate': dateEnd,
    });
    return await this.apiService.get<any>(url).toPromise();
  }

  async getSiteSafetyUsers(siteKey: string) {
    let url = buildRequest(this.apiService.API.BE.GET_SAFETY, {
      ':siteKey': siteKey,
    });
    return await this.apiService.get<any>(url).toPromise();
  }
}
