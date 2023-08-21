import { Injectable } from '@angular/core';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import { NotifyManagementService } from './notify-management.service';
import { USER_ACTIVITY_TYPE } from './user-action.service';

export class UserOfficeActionResult extends BaseResponse {
    message: string;
    action: USER_ACTIVITY_TYPE;
}

export class UserDeskActionResult extends BaseResponse {
    message: string;
}

export class UserSmartworkingActionResult extends BaseResponse {
    message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserActionManagementService {

    constructor(private apiService: ApiService,
        private notifyManagementService: NotifyManagementService) 
    {

    }

    async showConfirmMessage(userAction:USER_ACTIVITY_TYPE, desk: string) {
        let title = '';
        let message = '';
        switch (userAction) {
            case USER_ACTIVITY_TYPE.OFFICE_IN: {
                title = 'Entering Office';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.OFFICE_OUT: {
                title = 'Exiting Office';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.SMARTWORK_IN: {
                title = 'Smart Working Start';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.SMARTWORK_OUT: {
                title = 'Smart Working End';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.DESK_CHECKIN: {
                title = 'Desk Booking';
                message = 'Do you confirm ? ' + (desk ? '(' + desk + ')' : '');
                break;
            }
            case USER_ACTIVITY_TYPE.DESK_CHECKOUT: {
                title = 'Desk Check-Out';
                message = 'Do you confirm ? ' + (desk ? '(' + desk + ')' : '');
                break;
            }
        }

        return await this.notifyManagementService.openConfirmDialog(title, message);
    }

    sendOfficeAction(siteKey: string): Promise<UserOfficeActionResult> {
        let url = buildRequest(this.apiService.API.BE.USER_ACTION_OFFICE,
            {
                ':siteKey': siteKey
            });
        return this.apiService.get<UserOfficeActionResult>(url).toPromise();
    }

    sendTouchpointOfficeAction(siteKey: string, userId: string): Promise<UserOfficeActionResult> {
        let url = buildRequest(this.apiService.API.BE.TOUCHPOINT_ACTION_OFFICE,
            {
                ':siteKey': siteKey,
                ':userId': userId
            });
        return this.apiService.get<UserOfficeActionResult>(url).toPromise();
    }


    sendDeskAction(deskId: string): Promise<UserDeskActionResult> {
        let url = buildRequest(this.apiService.API.BE.USER_ACTION_DESK,
            {
                ':deskId': deskId
            });
        return this.apiService.get<UserDeskActionResult>(url).toPromise();
    }   

    sendSmartworkingAction(): Promise<UserSmartworkingActionResult> {
        return this.apiService.get<UserSmartworkingActionResult>(this.apiService.API.BE.USER_ACTION_SMARTWORKING).toPromise();
    } 
}
