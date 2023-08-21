import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request, REQUEST_STATE } from '../models/requests';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';

@Injectable({
    providedIn: 'root'
})
  
export class RequestManagementService {

    constructor(private apiService: ApiService) { }

    async addOrUpdateRequest(request: Request): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.UPDATE_REQUEST, request).toPromise();
    }

    async getAllRequests(): Promise<Request[]> {
        return this.apiService.get<Request[]>(this.apiService.API.BE.GET_ALL_REQUESTS).toPromise();
    }
/*
    async getUserRequests(userId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_REQUESTS,
            {
                ':userId': userId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }
*/
    async getAccountableRequests(accountableId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCOUNTABLE_REQUESTS,
            {
                ':accountableId': accountableId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getResponsableRequests(responsableId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_RESPONSABLE_REQUESTS,
            {
                ':responsableId': responsableId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getConsultedRequests(consultedId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_CONSULTED_REQUESTS,
            {
                ':consultedId': consultedId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getInformedRequests(informedId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_INFORMED_REQUESTS,
            {
                ':informedId': informedId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }


    // BY STATE

    async getAllRequestsByState(state: REQUEST_STATE): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ALL_REQUESTS_BYSTATE,
            {
                ':state': state
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getUserRequestsByState(userId: string, state: REQUEST_STATE): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_REQUESTS_BYSTATE,
            {
                ':userId': userId,
                ':state': state
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getAccountableRequestsByState(accountableId: string, state: REQUEST_STATE): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCOUNTABLE_REQUESTS_BYSTATE,
            {
                ':accountableId': accountableId,
                ':state': state
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getResponsableRequestsByState(responsableId: string, state: REQUEST_STATE): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_RESPONSABLE_REQUESTS_BYSTATE,
            {
                ':responsableId': responsableId,
                ':state': state
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getConsultedRequestsByState(consultedId: string, state: REQUEST_STATE): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_CONSULTED_REQUESTS_BYSTATE,
            {
                ':consultedId': consultedId,
                ':state': state
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getInformedRequestsByState(informedId: string, state: REQUEST_STATE): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_INFORMED_REQUESTS_BYSTATE,
            {
                ':informedId': informedId,
                ':state': state
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    // BY DATE

    async getAllRequestsByDate(startYYYYMMDD: string, endYYYYMMDD: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ALL_REQUESTS_BYDATE,
            {
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getUserRequestsByDate(userId: string, startYYYYMMDD: string, endYYYYMMDD: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_REQUESTS_BYDATE,
            {
                ':userId': userId,
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getAccountableRequestsByDate(accountableId: string, startYYYYMMDD: string, endYYYYMMDD: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCOUNTABLE_REQUESTS_BYDATE,
            {
                ':accountableId': accountableId,
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getResponsableRequestsByDate(responsableId: string, startYYYYMMDD: string, endYYYYMMDD: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_RESPONSABLE_REQUESTS_BYDATE,
            {
                ':responsableId': responsableId,
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getConsultedRequestsByDate(consultedId: string, startYYYYMMDD: string, endYYYYMMDD: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_CONSULTED_REQUESTS_BYDATE,
            {
                ':consultedId': consultedId,
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getInformedRequestsByDate(informedId: string, startYYYYMMDD: string, endYYYYMMDD: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_INFORMED_REQUESTS_BYDATE,
            {
                ':informedId': informedId,
                ':start': startYYYYMMDD,
                ':end': endYYYYMMDD
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }
    
    // BY JUSTIFICATIVE

    async getAllRequestsByJustificative(justificative: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ALL_REQUESTS_BYJUSTIFICATIVE,
            {
                ':justificative': justificative
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getUserRequestsByJustificative(userId: string, justificative: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_REQUESTS_BYJUSTIFICATIVE,
            {
                ':userId': userId,
                ':justificative': justificative
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getAccountableRequestsByJustificative(accountableId: string, justificative: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCOUNTABLE_REQUESTS_BYJUSTIFICATIVE,
            {
                ':accountableId': accountableId,
                ':justificative': justificative
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getResponsableRequestsByJustificative(responsableId: string, justificative: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_RESPONSABLE_REQUESTS_BYJUSTIFICATIVE,
            {
                ':responsableId': responsableId,
                ':justificative': justificative
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getConsultedRequestsByJustificative(consultedId: string, justificative: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_CONSULTED_REQUESTS_BYJUSTIFICATIVE,
            {
                ':consultedId': consultedId,
                ':justificative': justificative
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getInformedRequestsByJustificative(informedId: string, justificative: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_INFORMED_REQUESTS_BYJUSTIFICATIVE,
            {
                ':informedId': informedId,
                ':justificative': justificative
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

        
    // BY USER

    async getAllRequestsByUser(userId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ALL_REQUESTS_BYUSER,
            {
                ':userId': userId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getAccountableRequestsByUser(accountableId: string, userId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCOUNTABLE_REQUESTS_BYUSER,
            {
                ':accountableId': accountableId,
                ':userId': userId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getResponsableRequestsByUser(responsableId: string, userId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_RESPONSABLE_REQUESTS_BYUSER,
            {
                ':responsableId': responsableId,
                ':userId': userId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getConsultedRequestsByUser(consultedId: string, userId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_CONSULTED_REQUESTS_BYUSER,
            {
                ':consultedId': consultedId,
                ':userId': userId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }

    async getInformedRequestsByUser(informedId: string, userId: string): Promise<Request[]> {
        let url = buildRequest(this.apiService.API.BE.GET_INFORMED_REQUESTS_BYUSER,
            {
                ':informedId': informedId,
                ':userId': userId
            });
        return this.apiService.get<Request[]>(url).toPromise();
    }
}