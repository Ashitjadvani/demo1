import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api/api-response';
import { ApiService } from './api';
import { BaseResponse } from './base-response';

export class EventQRCodeActionResponse extends BaseResponse {
    Message: string;
    type: string;
    message: string;
    eventName: string;
}

@Injectable({
    providedIn: 'root'
})
export class EventManagementActionService {

    constructor(private api: ApiService) {
        console.log('EventManagementActionService.constructor: ', api);
    }

    async eventQRCodeAction(eventId: string, userMail: string, userId: string, eventType: string = 'checkEventType'): Promise<EventQRCodeActionResponse> {
        let body = {
            eventId: eventId,
            email: userMail, 
            userId: userId, 
            type: eventType
        }
        return this.api.post<EventQRCodeActionResponse>(this.api.API.BE.EVENT_CHECK_IN_OUT_ACTION, body).toPromise();
    }

}
