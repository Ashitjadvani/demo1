import { Injectable } from '@angular/core';
import { ActionTile } from '../models/app';
import { HomeData } from '../models/home-data';
import { Person } from '../models/person';
import { UserCalendarData } from '../models/user-calendar-data';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';

export class CanteenInfo {
    occupance: number;
    updated: Date;
    lastUpdateTimeStamp: number
}

export class TrackUserActivityResult {
    result: boolean;
    message: string;
}

export class HomeDataResult extends BaseResponse {
    data: HomeData;
}

export class HomeTilesResult extends BaseResponse {
    homeTiles: ActionTile[];
}

export class UserHasOfficeReservationResult extends BaseResponse {
    person: Person;
}

export enum USER_ACTIVITY_TYPE {
    SMARTWORK_IN = 'SmartworkIn',
    SMARTWORK_OUT = 'SmartworkOut',
    OFFICE_IN = 'OfficeIn',
    OFFICE_OUT = 'OfficeOut',
    DESK_CHECKIN = 'DeskCheckIn',
    DESK_CHECKOUT = 'DeskCheckOut',
    NOP = 'Nop'
};

@Injectable({
  providedIn: 'root'
})
export class CoreService {

    constructor(private apiService: ApiService) {

    }

    getUserHomeData(userId: string): Promise<HomeDataResult> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_HOME_DATA,
            {
                ':userId': userId
            });
        return this.apiService.get<HomeDataResult>(url).toPromise();
    }   

    getUserHomeTiles(userId: string, lang: string = 'en'): Promise<HomeTilesResult> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_HOME_TILES,
            {
                ':userId': userId,
                ':lang': lang
            });
        return this.apiService.get<HomeTilesResult>(url).toPromise();
    }   

    userHasOfficeReservation(userId: string, siteKey: string): Promise<UserHasOfficeReservationResult> {
        let url = buildRequest(this.apiService.API.BE.USER_HAS_OFFICE_RESERVATION,
            {
                ':userId': userId,
                ':siteKey': siteKey
            });
        return this.apiService.get<UserHasOfficeReservationResult>(url).toPromise();
    }   
}
