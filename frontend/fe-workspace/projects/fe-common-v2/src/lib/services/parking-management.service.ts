import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Site } from '../models/admin/site';
import { User } from '../models/admin/user';
import { BookableResource, IrinaResource, IrinaResourceType, ResourceBookEntry, RESOURCE_TYPE } from '../models/bookable-assets';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import { CommonService } from './common.service';

export enum PARKING_STATUS {
    BOOKED = "BOOKED", // parcheggio prenotato
    FREE = "FREE", // parcheggio libero
    PERSONAL_AVAILABLE = "PERSONAL_AVAILABLE", // personale ma available to all
    EXCLUSIVE = "EXCLUSIVE", // esclusivo
    POOL_PARK = "POOL_PARK" // parcheggio del pool riservato
};

export class ParkingStatusResponse extends BaseResponse {
    user: User;
    personalParking: IrinaResource;
    reservedParking: IrinaResource;
    reservedParkingId: string;
    firstAvailablePark: IrinaResource;
    availableParkingCount: number;
    reservationDate: string;
    parkingType: IrinaResourceType;
    preReservationId: string;
    preReservationRefreshMsg: string;
    preReservationMsgEnabled: boolean;
    preReservationRefreshInterval: number

}

export class BookParkingResponse extends BaseResponse {
    reservedParking: IrinaResource;
    reservedParkingId: string;
    reservationDate: string;
}

export class RemoveBookParkingResponse extends BaseResponse {
}

export class UserPersonalParkingResponse extends BaseResponse {
    personalPark: IrinaResource;
}

export class ParkingResourcesEntry {
    parkingResource: BookableResource;
    currentBook: ResourceBookEntry;
    todayBookedPark: ResourceBookEntry;
    tomorrowBookedPark: ResourceBookEntry;
    site: Site;
    ownerUser: User;
    todayUser: User;
    tomorrowUser: User;
    currStatus: PARKING_STATUS;
}

export class ParkingResourcesResponse extends BaseResponse {
    data: ParkingResourcesEntry[];
}

export class IsParkingBookAvailableResponse extends BaseResponse {
    available: boolean;
}

export class ParkingWeekStatItem {
    date: string;
    dateLabel: string;
    parkBookCount: number;
}

export class SiteParkingStats {
    site: Site;
    parkingCount: number;
    parkingWeekStat: ParkingWeekStatItem[];
}

export class TodayParkingStats {
    emptyPark: number;
    parkAssigned: number;
    parkAssignedToOther: number;
    parkAssignedExclusive: number;
}

export class ParkingStatisticsData {
    siteParkingStats: SiteParkingStats[];
    todayParkingStats: TodayParkingStats[];
}

export class ParkingStatisticsResponse extends BaseResponse {
    data: ParkingStatisticsData;
}

@Injectable({
    providedIn: 'root'
})
export class ParkingManagementService {

    constructor(private apiService: ApiService) {

    }

    getParkingStatus(preReservation: boolean): Promise<ParkingStatusResponse> {
        let url = buildRequest(this.apiService.API.BE.PARKING_STATUS,
            {
                ':action': preReservation ? 'pre-reservation' : 'info'
            });
        return this.apiService.get<ParkingStatusResponse>(url).toPromise();
    }

    bookParking(parking: IrinaResource): Promise<BookParkingResponse> {
        let body = parking;
        return this.apiService.post<BookParkingResponse>(this.apiService.API.BE.PARKING_BOOK, body).toPromise();
    }

    bookUserParking(userId: string, dateYYYYMMDD: string, parking: IrinaResource): Promise<BookParkingResponse> {
        let url = buildRequest(this.apiService.API.BE.PARKING_BOOK_FOR_USER,
            {
                ':date': dateYYYYMMDD,
                ':id': userId
            });
        let body = parking;

        return this.apiService.post<BookParkingResponse>(url, body).toPromise();
    }

    removeBookParking(id: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.PARKING_BOOK_REMOVE,
            {
                ':id': id
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    getParkingResources(): Promise<ParkingResourcesResponse> {
        return this.apiService.get<ParkingResourcesResponse>(this.apiService.API.BE.PARKING_RESOURCES).toPromise();
    }

    getUserPersonalParking(): Promise<UserPersonalParkingResponse> {
        return this.apiService.get<UserPersonalParkingResponse>(this.apiService.API.BE.PARKING_GET_PERSONAL).toPromise();
    }

    updateParkingPool(id: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.PARKING_UPDATE_POOL,
            {
                ':id': id
            });
        return this.apiService.put<BaseResponse>(url, {}).toPromise();
    }

    getParkingCSV(): Promise<string> {
        return this.apiService.get<string>(this.apiService.API.BE.PARKING_GET_CSV, { responseType: 'text' }).toPromise();
    }

    preBookParkingForUserInOffice(): Promise<BaseResponse> {
        return this.apiService.get<BaseResponse>(this.apiService.API.BE.PARKING_PREBOOK).toPromise();
    }

    isParkingBookAvailable(): Promise<IsParkingBookAvailableResponse> {
        return this.apiService.get<IsParkingBookAvailableResponse>(this.apiService.API.BE.PARKING_BOOK_AVAILABLE).toPromise();
    }

    getParkingStatistics(): Promise<ParkingStatisticsResponse> {
        return this.apiService.get<ParkingStatisticsResponse>(this.apiService.API.BE.PARKING_STATISTICS).toPromise();
    }
}
