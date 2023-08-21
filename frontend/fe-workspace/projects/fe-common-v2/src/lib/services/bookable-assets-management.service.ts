import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Site } from '../models/admin/site';
import { User } from '../models/admin/user';
import { BookableResource, IrinaResource, IrinaResourceBook, IrinaResourceBookTimeslot, IrinaResourceType, ResourceAvailabilityTimeslot, RESOURCE_TYPE } from '../models/bookable-assets';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import {promise} from "protractor";

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

export class ActionBookableResourceTypesResponse extends BaseResponse {
    data: IrinaResourceType;
}

export class BookableResourcesResponse extends BaseResponse {
    result: boolean;
    data: BookableResource[];
    totalCount: any;
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

@Injectable({
    providedIn: 'root'
})
export class BookableAssetsManagementService {

    constructor(private apiService: ApiService,
                private _http: HttpClient
    ) {

    }

    getBookableResourceTypes(): Promise<BookableResourceTypesResponse> {
        return this.apiService.get<BookableResourceTypesResponse>(this.apiService.API.BE.GET_BOOKABLE_RESOURCE_TYPES).toPromise();
    }

    addOrUpdateBookableResourceTypes(data: IrinaResourceType): Promise<ActionBookableResourceTypesResponse> {
        return this.apiService.post<ActionBookableResourceTypesResponse>(this.apiService.API.BE.ACTION_BOOKABLE_RESOURCE_TYPE, data).toPromise();
    }

    deleteBookableResourceTypes(id: string): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.DELETE_BOOKABLE_RESOURCE_TYPE,
            {
                ':id': id
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    getBookableResources(resType: RESOURCE_TYPE): Promise<BookableResourcesResponse> {
        const url = buildRequest(this.apiService.API.BE.GET_BOOKABLE_RESOURCES,
            {
                ':type': resType
            });
        return this.apiService.get<BookableResourcesResponse>(url).toPromise();
    }
    getBookableResourcesParam(resType: RESOURCE_TYPE, data: any): Promise<BookableResourcesResponse> {
        const url = buildRequest(this.apiService.API.BE.GET_BOOKABLE_RESOURCES,
            {
                ':type': resType
            });
        // return this.apiService.get<BookableResourcesResponse>(url).toPromise();
        return this.apiService.post<BookableResourcesResponse>(url, data).toPromise();
    }

    addOrUpdateBookableResource(data: BookableResource): Promise<ActionBookableResourceResponse> {
        return this.apiService.post<ActionBookableResourceResponse>(this.apiService.API.BE.ACTION_BOOKABLE_RESOURCE, data).toPromise();
    }

    deleteBookableResource(id: string): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.DELETE_BOOKABLE_RESOURCE,
            {
                ':id': id
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }
    // multipleBookableResource(data): Promise<any>{
    //     return this.apiService.post<BaseResponse>(this.apiService.API.BE.DELETE_BOOKABLE_MULTIPLE_RESOURCE, data).toPromise();
    // }
    multipleBookableResource(id: any) {
        return this.apiService.post(this.apiService.API.BE.DELETE_BOOKABLE_MULTIPLE_RESOURCE, id);
    }

    async uploadResourceCSV(file: File, resourceType: RESOURCE_TYPE): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        const url = buildRequest(this.apiService.API.BE.BOOKABLE_RESOURCE_UPLOAD_CSV,
            {
                ':type': resourceType
            });

        const req = new HttpRequest('POST', url, formData, {
            reportProgress: true
        });

        return this._http.request(req).toPromise();
    }

    getResourceStatus(date: string, resourceType: RESOURCE_TYPE): Promise<ResourceStatusResponse> {
        const url = buildRequest(this.apiService.API.BE.GET_RESOURCE_STATUS,
            {
                ':date': date,
                ':resourceType': resourceType
            });
        return this.apiService.get<ResourceStatusResponse>(url).toPromise();
    }

    reserveResourceSlot(resourceType: RESOURCE_TYPE, resourceId: string, slotId: string, date: string): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.RESERVE_RESOURCE_SLOT,
            {
                ':resourceType': resourceType,
                ':id': resourceId,
                ':slot': slotId,
                ':date': date
            });
        return this.apiService.get<BaseResponse>(url).toPromise();
    }

    reserveUserResourceSlot(userId: string, resourceType: RESOURCE_TYPE, resourceId: string, slotId: string, date: string): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.RESERVE_USER_RESOURCE_SLOT,
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
        const url = buildRequest(this.apiService.API.BE.RESERVE_RESOURCE_SLOT,
            {
                ':resourceType': resourceType,
                ':id': resourceId,
                ':slot': slotId,
                ':date': date
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    deleteUserReservedResourceSlot(userId: string, resourceType: RESOURCE_TYPE, resourceId: string, slotId: string, date: string): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.RESERVE_USER_RESOURCE_SLOT,
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
        const url = buildRequest(this.apiService.API.BE.RESOURCE_RESERVATION_STATUS,
            {
                ':date': date,
                ':resourceType': resourceType,
                ':resourceId': resourceId
            });
        return this.apiService.get<ResourceReservationStatusResponse>(url).toPromise();
    }

    resourceTypeAvailable(resourceType: RESOURCE_TYPE): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.RESOURCE_AVAILABLE,
            {
                ':resourceType': resourceType
            });
        return this.apiService.get<BaseResponse>(url).toPromise();
    }

    resourceSearchAvailability(date: string, resourceType: RESOURCE_TYPE, location: string, area: string, layout: string, startTime: Date, endTime: Date, capacity: number): Promise<ResourceSearchAvailabilityResponse> {
        const data = {
            date,
            resourceType,
            location,
            area,
            layout,
            startTime,
            endTime,
            capacity
        };
        return this.apiService.post<ResourceSearchAvailabilityResponse>(this.apiService.API.BE.RESOURCE_SEARCH_AVAILABILITY, data).toPromise();
    }

    resourceReserveTimeframe(resourceType: RESOURCE_TYPE, resourceId: string, date: string, startTime: Date, endTime: Date, title: string, note: string, attendees: AttendeeSelected[]): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.RESERVE_RESOURCE_TIMEFRAME,
            {
                ':resourceType': resourceType,
                ':resourceId': resourceId
            });
        const data = {
            date,
            startTime,
            endTime,
            title,
            note,
            attendees
        };
        return this.apiService.post<BaseResponse>(url, data).toPromise();
    }

    getUserResourceReservations(startDate: string, endDate: string): Promise<UserResourceReservationsResponse> {
        const url = buildRequest(this.apiService.API.BE.GET_USER_RESOURCE_RESERVATIONS,
            {
                ':startDate': startDate,
                ':endDate': endDate
            });
        return this.apiService.get<UserResourceReservationsResponse>(url).toPromise();
    }

    resourceRemoveTimeframe(reservationId: string, timeframeId: string): Promise<BaseResponse> {
        const url = buildRequest(this.apiService.API.BE.RESOURCE_RESERVATION_TIMEFRAME,
            {
                ':reservationId': reservationId,
                ':timeframeId': timeframeId
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    userResourceInteraction(resourceId: string): Promise<UserResourceInteractionResponse> {
        const url = buildRequest(this.apiService.API.BE.USER_RESOURCE_INTERACTION,
            {
                ':resourceId': resourceId
            });
        const data = {
        };
        return this.apiService.post<UserResourceInteractionResponse>(url, data).toPromise();
    }

    userResourceAction(resourceId: string, reservationId: string, reservationSlotId: string, action: ResourceAction): Promise<UserResourceActionResponse> {
        const url = buildRequest(this.apiService.API.BE.USER_RESOURCE_ACTION,
            {
                ':resourceId': resourceId
            });
        const data = {
            reservationId,
            reservationSlotId,
            action
        };
        return this.apiService.post<UserResourceActionResponse>(url, data).toPromise();
    }

    getCurrentResourceStatus(resourceId: string, date: string): Promise<CurrentResourceStatusResponse> {
        const url = buildRequest(this.apiService.API.BE.CURRENT_RESOURCE_STATUS,
            {
                ':resourceId': resourceId,
                ':date': date
            });
        return this.apiService.get<CurrentResourceStatusResponse>(url).toPromise();
    }
}
