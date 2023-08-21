import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ZXingStringBuilder } from '@zxing/library';
import { Site } from '../models/admin/site';
import { User } from '../models/admin/user';
import { BookableResource, IrinaResource, IrinaResourceBook, IrinaResourceBookTimeslot, IrinaResourceType, ResourceAvailabilityTimeslot, RESOURCE_TYPE } from '../models/bookable-assets';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import {Observable} from "rxjs";
import {environment} from "../../../../fe-insights-v2/src/environments/environment";
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";
import {CompanyResponse} from "./admin-user-management.service";
import {ApiResponse} from "../models/api/api-response";

export enum ResourceAction {
    None = 'None',
    InstantBook = 'InstantBook',
    CheckIn = 'CheckIn',
    CheckOut = 'CheckOut',
    ExtendBook = 'ExtendBook'
}

export class AttendeeSelected {
    public name: string;
    public email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}

export class BookableResourceTypesResponse extends BaseResponse {
    data: IrinaResourceType[];
}

export class BookableResourceTypeResponse extends BaseResponse {
    data: IrinaResourceType;
}

export class ActionBookableResourceTypesResponse extends BaseResponse {
    data: IrinaResourceType;
}

export class BookableResourcesResponse extends BaseResponse {
    result: boolean;
    data: BookableResource[];
}

export class ActionBookableResourceResponse extends BaseResponse {
    result: boolean;
    data: BookableResource;
}

export class ResourceStatusResponse extends BaseResponse {
    user: User;
    availableResources: IrinaResource[];
    availableResourceCount: number;
    availableTimeslots: ResourceAvailabilityTimeslot[];
    availableTimeslotsCount: number;
    reservedResource: IrinaResourceBook;
    reservationDate: string;
    reservedTimeslot: IrinaResourceBookTimeslot;
}

export class ResourceReservation {
    id: string;
    resourceId: string;
    resourceType: IrinaResourceType;
    date: Date;
    site: Site;
    timeslotReservations: IrinaResourceBookTimeslot[];
}

export class ResourceReservationStatusResponse extends BaseResponse {
    resourceReservation: ResourceReservation;
}

export class ResourceSearchAvailabilityResponse extends BaseResponse {
    data: IrinaResource[];
}

export class UserResourceReservationsResponse extends BaseResponse {
    reservations: IrinaResourceBook[];
}

export class UserResourceInteractionResponse extends BaseResponse {
    resource: IrinaResource;
    resourceBook: IrinaResourceBook;
    availableActions: ResourceAction[];
    reservationTimeframeId: string;
}

export class UserResourceActionResponse extends BaseResponse {
    resourceBook: IrinaResourceBook;
}

export class CurrentResourceStatusResponse extends BaseResponse {
    resource: IrinaResource;
    reservation: IrinaResourceBook;
}

export class ResourceByCodeResponse extends BaseResponse {
    data: IrinaResource;
}


@Injectable({
    providedIn: 'root'
})
export class ResourceManagementService {
    baseUrl: string = environment.api_host;
    constructor(private apiService: ApiService,
        private _http: HttpClient) {

    }

    getBookableResourceTypes(data): Promise<BookableResourceTypesResponse> {
        return this.apiService.post<BookableResourceTypesResponse>(this.apiService.API.BE.GET_BOOKABLE_RESOURCE_TYPES, data).toPromise();
    }

    getBookableResourceType(id: string): Promise<BookableResourceTypeResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_BOOKABLE_RESOURCE_TYPE,
            {
                ':id': id
            });
        return this.apiService.get<BookableResourceTypeResponse>(url).toPromise();
    }

    addOrUpdateBookableResourceTypes(data: IrinaResourceType): Promise<ActionBookableResourceTypesResponse> {
        return this.apiService.post<ActionBookableResourceTypesResponse>(this.apiService.API.BE.ACTION_BOOKABLE_RESOURCE_TYPE, data).toPromise();
    }

    deleteBookableResourceTypes(id: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_BOOKABLE_RESOURCE_TYPE,
            {
                ':id': id
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    getBookableResources(resType: RESOURCE_TYPE): Promise<BookableResourcesResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_BOOKABLE_RESOURCES,
            {
                ':type': resType
            });
        return this.apiService.get<BookableResourcesResponse>(url).toPromise();
    }

    addOrUpdateBookableResource(data: BookableResource): Promise<ActionBookableResourceResponse> {
        return this.apiService.post<ActionBookableResourceResponse>(this.apiService.API.BE.ACTION_BOOKABLE_RESOURCE, data).toPromise();
    }

    deleteBookableResource(id: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_BOOKABLE_RESOURCE,
            {
                ':id': id
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async uploadResourceCSV(file: File, resourceType: RESOURCE_TYPE): Promise<any> {
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);

        let url = buildRequest(this.apiService.API.BE.BOOKABLE_RESOURCE_UPLOAD_CSV,
            {
                ':type': resourceType
            });

        let req = new HttpRequest("POST", url, formData, {
            reportProgress: true
        });

        return this._http.request(req).toPromise();
    }

    getResourceStatus(date: string, resourceType: RESOURCE_TYPE): Promise<ResourceStatusResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_RESOURCE_STATUS,
            {
                ':date': date,
                ':resourceType': resourceType
            });
        return this.apiService.get<ResourceStatusResponse>(url).toPromise();
    }

    reserveResourceSlot(resourceType: RESOURCE_TYPE, resourceId: string, slotId: string, date: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.RESERVE_RESOURCE_SLOT,
            {
                ':resourceType': resourceType,
                ':id': resourceId,
                ':slot': slotId,
                ':date': date
            });
        return this.apiService.get<BaseResponse>(url).toPromise();
    }

    reserveUserResourceSlot(userId: string, resourceType: RESOURCE_TYPE, resourceId: string, slotId: string, date: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.RESERVE_USER_RESOURCE_SLOT,
            {
                ':userId': userId,
                ':resourceType': resourceType,
                ':id': resourceId,
                ':slot': slotId,
                ':date': date
            });
        return this.apiService.get<BaseResponse>(url).toPromise();
    }

    deleteReservedResourceSlot(resourceType: RESOURCE_TYPE, resourceId: string, slotId: string, date: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.RESERVE_RESOURCE_SLOT,
            {
                ':resourceType': resourceType,
                ':id': resourceId,
                ':slot': slotId,
                ':date': date
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    deleteUserReservedResourceSlot(userId: string, resourceType: RESOURCE_TYPE, resourceId: string, slotId: string, date: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.RESERVE_USER_RESOURCE_SLOT,
            {
                ':userId': userId,
                ':resourceType': resourceType,
                ':id': resourceId,
                ':slot': slotId,
                ':date': date
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    resourceReservationStatus(date: string, resourceType: RESOURCE_TYPE, resourceId: string): Promise<ResourceReservationStatusResponse> {
        let url = buildRequest(this.apiService.API.BE.RESOURCE_RESERVATION_STATUS,
            {
                ':date': date,
                ':resourceType': resourceType,
                ':resourceId': resourceId
            });
        return this.apiService.get<ResourceReservationStatusResponse>(url).toPromise();
    }

    resourceTypeAvailable(resourceType: RESOURCE_TYPE): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.RESOURCE_AVAILABLE,
            {
                ':resourceType': resourceType
            });
        return this.apiService.get<BaseResponse>(url).toPromise();
    }

    resourceSearchAvailability(data): Promise<ResourceSearchAvailabilityResponse> {

        return this.apiService.post<ResourceSearchAvailabilityResponse>(this.apiService.API.BE.RESOURCE_SEARCH_AVAILABILITY, data).toPromise();
    }

    resourceReserveTimeframe(resourceType: RESOURCE_TYPE, resourceId: string, date: string, startTime: Date, endTime: Date, title: string, note: string, attendees: AttendeeSelected[]): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.RESERVE_RESOURCE_TIMEFRAME,
            {
                ':resourceType': resourceType,
                ':resourceId': resourceId
            });
        let data = {
            date: date,
            startTime: startTime,
            endTime: endTime,
            title: title,
            note: note,
            attendees: attendees
        }
        return this.apiService.post<BaseResponse>(url, data).toPromise();
    }

    getUserResourceReservations(startDate: string, endDate: string): Promise<UserResourceReservationsResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_RESOURCE_RESERVATIONS,
            {
                ':startDate': startDate,
                ':endDate': endDate
            });
        return this.apiService.get<UserResourceReservationsResponse>(url).toPromise();
    }

    resourceRemoveTimeframe(reservationId: string, timeframeId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.RESOURCE_RESERVATION_TIMEFRAME,
            {
                ':reservationId': reservationId,
                ':timeframeId': timeframeId
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    userResourceInteraction(resourceId: string): Promise<UserResourceInteractionResponse> {
        let url = buildRequest(this.apiService.API.BE.USER_RESOURCE_INTERACTION,
            {
                ':resourceId': resourceId
            });
        let data = {
        }
        return this.apiService.post<UserResourceInteractionResponse>(url, data).toPromise();
    }

    userResourceAction(resourceId: string, reservationId: string, reservationSlotId: string, action: ResourceAction): Promise<UserResourceActionResponse> {
        let url = buildRequest(this.apiService.API.BE.USER_RESOURCE_ACTION,
            {
                ':resourceId': resourceId
            });
        let data = {
            reservationId: reservationId,
            reservationSlotId: reservationSlotId,
            action: action
        }
        return this.apiService.post<UserResourceActionResponse>(url, data).toPromise();
    }

    getCurrentResourceStatus(resourceId: string, date: string): Promise<CurrentResourceStatusResponse> {
        let url = buildRequest(this.apiService.API.BE.CURRENT_RESOURCE_STATUS,
            {
                ':resourceId': resourceId,
                ':date': date
            });
        return this.apiService.get<CurrentResourceStatusResponse>(url).toPromise();
    }

    getCurrentResourcesInGroup(resType: RESOURCE_TYPE, groupId: string): Promise<BookableResourcesResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_GROUP_BOOKABLE_RESOURCES,
            {
                ':type': resType,
                ':groupId': groupId
            });
        return this.apiService.get<BookableResourcesResponse>(url).toPromise();
    }

    getResourceByCode(code: string): Promise<ResourceByCodeResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_RESOURCE_BY_CODE,
            {
                ':code': code
            });
        return this.apiService.get<ResourceByCodeResponse>(url).toPromise();
    }

   async deleteResourceGroup(id: string): Promise<ResourceByCodeResponse> {
        let url = buildRequest(this.apiService.API.BE.ASSETS_MANAGEMENT_RESOURCE_GROUP_DELETE,
            {
                ':id': id
            });
        return await this.apiService.delete<ResourceByCodeResponse>(url).toPromise();
    }
    async getResourceType(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.RESOURCE_TYPE_LIST , data).toPromise();
    }
    async deleteResourceType(data: any): Promise<ApiResponse<any>> {
        return this.apiService.post<ApiResponse<any>>(this.apiService.API.BE.RESOURCE_TYPE_DELETE, data).toPromise();
    }
     addResourceTypeNamePermission(data: any): Promise<ApiResponse<any>> {
        return this.apiService.post<ApiResponse<any>>(this.apiService.API.BE.RESOURCE_TYPE_ADD_EDIT, data).toPromise();
    }
    getResourceTypeById(data: any): Promise<ApiResponse<any>> {
        return this.apiService.post<ApiResponse<any>>(this.apiService.API.BE.RESOURCE_TYPE_GET_BY_ID, data).toPromise();
    }
}
