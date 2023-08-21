import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {ApiService, buildRequest} from "./api";
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventManagementListOfEventService {

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
    }

    async getListOfEventList(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_EVENT_LIST, data).toPromise();
    }

    async getCreateEvent(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_CREATE_EVENT, data).toPromise();
    }
    async getCreateEventCheckpointControl(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_CHECKPOINT_CONTROL, data).toPromise();
    }


    multipleDeleteListOfEvent(data: any): Observable<any> {
        return this.apiService.post<any>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_EVENT_MULTIPLE_DELETE, data);
    }

    async deleteListOfItem(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_EVENT_DELETE, data).toPromise();
    }

    async cancelListOfItem(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_EVENT_CANCEL, data).toPromise();
    }

    async reActivateListOfItem(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_EVENT_RE_ACTIVATE, data).toPromise();
    }

    async getEditEvent(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_EDIT_EVENT, data).toPromise();
    }
    async getEventCheckInData(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_CHECK_IN_DATA, data).toPromise();
    }

    async getActivityLogList(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_EVENT_ACTIVITY_LOG, data).toPromise();
    }

    async getAttendeeActivityLogList(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_EVENT_Attendee_ACTIVITY_LOG, data).toPromise();
    }

    async getAssetLogList(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_ASSET_TYPE, data).toPromise();
    }

    async getResourceByAssetType(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_LIST_OF_RESOURCE_BY_ASSET_TYPE, data).toPromise();
    }

    async getCalenderEvents(data: any): Promise<any[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_GET_CALENDER_EVENTS, data).toPromise();
    }

    async getEventsDashboard(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_GET_DASHBOARD, data).toPromise();
    }

    async createICSAPI(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_CREATE_ICS_FILE, data).toPromise();
    }

    async downloadICSAPI(data:any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_DOWNLOAD_ICS_FILE, data).toPromise();
    }

    async attendeesCertificateAPI(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_ATTENDEES_CERTIFICATE_LIST, data).toPromise();
    }

    async acceptEventByMail(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_ACCEPT_EVENT, data).toPromise();
    }

    async declineEventByMail(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_DECLINE_EVENT, data).toPromise();
    }

    async reInviteALLByMail(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_RESEND_INVITATION_EMAIL, data).toPromise();
    }

    async reInviteUserByMail(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_RESEND_INVITATION_USER, data).toPromise();
    }

    async sendAttendeeCertificate(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_SEND_ATTENDEE_CERTIFICATE, data).toPromise();
    }

    async sendEmailReminder(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_SEND_REMINDER_INVITATION, data).toPromise();
    }

    async editAttendeesCredit(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_EDIT_ATTENDEES_CREDITS, data).toPromise();
    }
    async getEventDetailsCount(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_EDIT_EVENT_DETAILS_COUNT, data).toPromise();
    }
    async sendPushNotification(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_SEND_PUSH_NOTIFICATION, data).toPromise();
    }

    async webexCheckInOut(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_WEBEX_CHECKIN_OUT, data).toPromise();
    }

    async sendPersonalPincodeEmail(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_SEND_PERSONAL_PINCODE_EMAIL, data).toPromise();
    }

    async sendIndividualPersonalPincodeEmail(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_SEND_INDIVIDUAL_PERSONAL_PINCODE_EMAIL, data).toPromise();
    }

    async activeMeetingPage(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.EVENT_MANAGEMENT_ACTIVE_MEETING_LINK, data).toPromise();
    }

    createQRCodeEventPublic(eventId: string, baseURL: string): Observable<any> {
        const that = this
        // console.log('that.baseURL>>',that.baseURL);
        var barcodeURL = baseURL+"event-manager/event/"+eventId;
        var requestParam = {
            url: barcodeURL
        }
        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_QRCODE_CREATE);
        let req = new HttpRequest("POST", url, requestParam, {
            reportProgress: true
        });
        return this.http.request(req);
    }

}
