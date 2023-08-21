import {HttpClient, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingOpeningDocument, NEWS_ACTION_TYPE} from '../models/admin/recruiting-opening-document';
import {User} from "../models/admin/user";
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import { EventManagementSettingService } from './event-management-setting.service';

@Injectable({
    providedIn: 'root'
})
export class RecruitingManagementService {
    baseURL:any;
    constructor(private http: HttpClient,
                private apiService: ApiService,
                private ApiService: EventManagementSettingService,) {
            this.reloadBaseURL();
    }

    reloadBaseURL(){
        this.ApiService.getListForGeneralSettings({}).subscribe((data: any) => {
            const documentData = data.data;
            this.baseURL = documentData.baseURL
            localStorage.setItem('baseURL',this.baseURL)
        });
    }

    async getUserAlertList(userId: string): Promise<RecruitingOpeningDocument[]> {
        let url = buildRequest(this.apiService.API.BE.TICKET_DOCLIST,
            {
                ':userId': userId
            });
        return await this.apiService.get<RecruitingOpeningDocument[]>(url).toPromise();
    }

    async getOpeningList(): Promise<RecruitingOpeningDocument[]> {
        return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_OPENING_LISTING, null).toPromise();
    }

    async getOpeningImage(id: any): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DATA_STORAGE_DETAILS, {id: id}).toPromise();
    }

    async getQuizList(): Promise<RecruitingOpeningDocument[]> {
        return this.apiService.post<RecruitingOpeningDocument[]>(this.apiService.API.BE.RECRUITING_OPENING_QUIZ_LISTING, null).toPromise();
    }

    async getHistoryList(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_OPENING_HISTORY_LISTING, data).toPromise();
    }

    async getRecruitingDashBoard(): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_LISTING, null).toPromise();
    }

    async universityList(): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_UNIVERSITY_LIST, null).toPromise();
    }

    async universitySave(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_UNIVERSITY_SAVE, data).toPromise();
    }

    async universityDelete(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_UNIVERSITY_DELETE, data).toPromise();
    }

    async degreeList(): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_DEGREE_LIST, null).toPromise();
    }

    async degreeSave(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_DEGREE_SAVE, data).toPromise();
    }

    async degreeDelete(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_DEGREE_DELETE, data).toPromise();
    }

    async customFiledList(): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_CUSTOM_FIELD_LIST, null).toPromise();
    }

    async customFiledSave(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_CUSTOM_FIELD_SAVE, data).toPromise();
    }

    async customFiledDelete(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_CUSTOM_FIELD_DELETE, data).toPromise();
    }

    async videoQuestionList(): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_VIDEO_QUESTION_LIST, null).toPromise();
    }

    async videoQuestionSave(data): Promise<any> {
        var params: any = {};
        if (data.id != null) {
            params = {
                id: data.id,
                question: data.question
            }
        } else {
            params = {
                question: data.question
            }
        }
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_VIDEO_QUESTION_SAVE, params).toPromise();
    }

    async videoQuestionDelete(data): Promise<any> {
        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DASHBOARD_VIDEO_QUESTION_DELETE, data).toPromise();
    }

    async getQuizJobList(
        scopeParam: string
    ): Promise<RecruitingOpeningDocument[]> {
        var params = {
            scope: scopeParam,
        };
        return this.apiService
            .post<RecruitingOpeningDocument[]>(
                this.apiService.API.BE.RECRUITING_OPENING_QUIZ_JOB_LISTING,
                params
            )
            .toPromise();
    }

    async getCustomFieldJobList(
        scopeParam: string
    ): Promise<RecruitingOpeningDocument[]> {
        var params = {
            scope: scopeParam,
        };
        return this.apiService
            .post<RecruitingOpeningDocument[]>(
                this.apiService.API.BE.RECRUITING_OPENING_CUSTOMFIELD_JOB_LISTING,
                params
            )
            .toPromise();
    }

    async getJobOpeningById(
        scopeParam: string
    ): Promise<RecruitingOpeningDocument[]> {
        var params = {
            id: scopeParam,
        };
        return this.apiService
            .post<RecruitingOpeningDocument[]>(
                this.apiService.API.BE.RECRUITING_OPENING_JOB_VIEW,
                params
            )
            .toPromise();
    }

    // async getJobOpeningById(id: string){
    //   return this.apiService
    //     .post<any>(this.apiService.API.BE.RECRUITING_JOB_OPENING_VIEW, id)
    //     .toPromise();
    // }

    uploadDocument(file: File, job: RecruitingOpeningDocument): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("document", JSON.stringify(job));
        if (file)
            formData.append("file", file, file.name);

        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_CREATE);
        let req = new HttpRequest("POST", url, formData, {
            reportProgress: true
        });

        let progress = new Subject<number>();
        return this.http.request(req);
    }

    uploadDocumentFile(file: File) {
        let formData: FormData = new FormData();
        if (file)
            formData.append("file", file, file.name);

        return this.apiService.post<any>(this.apiService.API.BE.RECRUITING_DATA_STORAGE_UPLOAD, formData).toPromise();
    }

    async getUploadDocument(body: any): Promise<any> {
        const url = this.apiService.API.BE.RECRUITING_DATA_STORAGE_IMAGE;
        return await this.apiService.post<any>(url, body).toPromise();
    }

    insertDocument(job: RecruitingOpeningDocument): Observable<any> {
        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_CREATE);
        let req = new HttpRequest("POST", url, job, {
            reportProgress: true
        });
        return this.http.request(req);
    }

    async deletePostDocument(body: any): Promise<any> {
        const url = this.apiService.API.BE.RECRUITING_OPENING_DELETE;
        return await this.apiService.post<any>(url, body).toPromise();
    }

    async deleteDocument(id: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.RECRUITING_OPENING_DELETE,
            {
                ':id': id
            });
        return await this.apiService.delete<any>(url).toPromise();
    }

    downloadDocument(id: string): Observable<any> {
        let url = buildRequest(this.apiService.API.BE.TICKET_DOWNLOAD,
            {
                ':id': id
            });
        return this.apiService.get(url, {responseType: 'arraybuffer'});
    }

    async actionOnDocument(id: string, userId: string, action: NEWS_ACTION_TYPE): Promise<RecruitingOpeningDocument> {
        let url = buildRequest(this.apiService.API.BE.TICKET_ACTION,
            {
                ':id': id
            });
        let body = {
            userId: userId,
            action: action
        }
        return await this.apiService.put<RecruitingOpeningDocument>(url, body).toPromise();
    }

    createQRCode(jobDetailsId: string): Observable<any> {
        var barcodeURL = `${environment.home_page}${jobDetailsId}`;
        var requestParam = {
            url: barcodeURL
        }
        let url = this.apiService.resolveApiUrl(this.apiService.API.BE.RECRUITING_OPENING_QRCODE_CREATE);
        let req = new HttpRequest("POST", url, requestParam, {
            reportProgress: true
        });
        return this.http.request(req);
    }

    createQRCodeAcceptEvent(eventId: string): Observable<any> {
        const that = this
        that.baseURL = localStorage.getItem('baseURL');
        // console.log('that.baseURL>>',that.baseURL);
        var barcodeURL = that.baseURL+"event-manager/event/"+eventId;
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
