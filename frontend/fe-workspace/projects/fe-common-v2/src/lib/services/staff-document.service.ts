import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api";
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MasterStaffDocumentService {

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
    }


    async getStaffDocsList(data: any, companyId: string): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_STAFF_DOCUMENT_LIST + companyId, data).toPromise();
    }

    async deleteStaffDocument(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_STAFF_DOCUMENT_DELETE, data).toPromise();
    }

    async viewStaffDocument(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_STAFF_DOCUMENT_VIEW, data).toPromise();
    }

    async addStaffDocument(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_STAFF_DOCUMENT_ADD, data).toPromise();
    }

    async editStaffDocument(data: any): Promise<RecruitingCandidateDocument[]> {
        return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_STAFF_DOCUMENT_ADD, data).toPromise();
    }

    // multipleDeleteCostCenterType(data: any):<Observable<any> {
    //   return this.apiService.post<any>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_MULTIPLE_DELETE, data);
    // }

    multipleDeleteStaffDocument(data: any): Observable<any> {
        return this.apiService.post<any>(this.apiService.API.BE.MASTER_STAFF_DOCUMENT_MULTIPLE_DELETE, data);
    }

    getSingleRecord(data: any): Observable<any> {
        return this.apiService.post<any>(this.apiService.API.BE.MASTER_STAFF_DOCUMENT_EDIT, data);
    }

}
