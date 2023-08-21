import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../models/api/api-response';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ProcurementService {
    static config = {
        RECRUITING_API_ROOT: environment.api_host + '/v1/recruiting',
        PROCUREMENT_LIST_SUPPLIERS: '/v2/mqs-procurement/supplier/list',
        PROCUREMENT_LIST_SERVICE_SUPPLIERS: '/v2/mqs-procurement/supplier/service',
        PROCUREMENT_SAVE_SUPPLIERS: '/v2/mqs-procurement/supplier/save',
        PROCUREMENT_DELETE_SUPPLIERS: '/v2/mqs-procurement/supplier/delete',
        PROCUREMENT_GET_SUPPLIERS: '/v2/mqs-procurement/supplier/viewSupplierDetails',
        PROCUREMENT_GET_DASHBOARD: '/v2/mqs-procurement/dashboard',
        PROCUREMENT_VIEW_PDF_FILE: '/v2/data-storage/vew-pdf',
        PROCUREMENT_PDF_DOWNLOAD: '/v2/data-storage/download/',
        PROCUREMENT_LIST_SERVICE: '/v2/mqs-procurement/service/listServicesBE',
        PROCUREMENT_SAVE_SERVICE: '/v2/mqs-procurement/service/save',
        PROCUREMENT_DELETE_SERVICE: '/v2/mqs-procurement/service/delete',
        PROCUREMENT_GET_SERVICE: '/v2/mqs-procurement/service/viewServiceDetails',
        PROCUREMENT_GET_SERVICE_SURVEY: '/v2/mqs-procurement/service/get-survey',
        PROCUREMENT_EDIT_SERVICE_SURVEY: '/v2/mqs-procurement/service/get-survey-by-service',
        PROCUREMENT_SAVE_SERVICE_AGREEMENT: '/v2/mqs-procurement/service-agreement/save',
        PROCUREMENT_SAVE_BY_ID_SERVICE_AGREEMENT: '/v2/mqs-procurement/service-agreement/editServiceAgreement',
        PROCUREMENT_DELETE_SERVICE_AGREEMENT: '/v2/mqs-procurement/service-agreement/delete',
        PROCUREMENT_DELETE_SERVICE_SRUVEY: '/v2/mqs-procurement/service/delete-survey',
        PROCUREMENT_ACCEPT_REJECT_SUPPLIERS: '/v2/mqs-procurement/changeStatus',
        PROCUREMENT_QUESTION_LIST: '/v2/mqs-procurement/quiz/question/list',
        PROCUREMENT_EDIT_EMAIL: '/v2/mqs-procurement/editEmail',
        PROCUREMENT_DECLINE_DELETE: '/v2/mqs-procurement/supplier/delete',
        PROCUREMENT_SUPPLIER_COUNT_BY_STATUS: '/v2/mqs-procurement/supplierCountByStatus',
        PROCUREMENT_REQUEST_MORE_DETAIL: '/v2/mqs-procurement/AskMoreInformationSupplier',
        PROCUREMENT_LIST_SUPPLIER_FIT_INDEX: '/v2/mqs-procurement/list-supplier-fit-index',
        PROCUREMENT_SURVEY_CALCULATION: '/v2/mqs-quiz/survey-calculation/list',
        PROCUREMENT_SUPPLIER_LOG_ACTIVITY: '/v2/mqs-procurement/supplier-activity',
        PROCUREMENT_SETTINGS_SAVE_DOC: '/v2/mqs-procurement/setting/add',
        PROCUREMENT_SETTINGS_VIEW_DOC: '/v2/mqs-procurement/setting/list',
        PROCUREMENT_SETTINGS_UPDATE_EMAIL_NOTICE: '/v2/mqs-procurement/supplier/change-send-notice',
        PROCUREMENT_SETTINGS_EMAIL_CONFIGURATION: '/v2/mqs-procurement/add-email-configuration',
        PROCUREMENT_SETTINGS_LIST_EMAIL_CONFIGURATION: '/v2/mqs-procurement/list-email-configuration',
        PROCUREMENT_SEND_EXPIRING_DOCUMENT_NOTICE: '/v2/mqs-procurement/send-expiring-document-notice',
    };

    constructor(private api: ApiService) {
    }

    public loadSupplierList(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_LIST_SUPPLIERS, data).toPromise();
    }

    public loadServiceSupplierList(): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_LIST_SERVICE_SUPPLIERS, null).toPromise();
    }

    public saveSupplier(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SAVE_SUPPLIERS, data).toPromise();
    }

    public getSupplier(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_GET_SUPPLIERS, data).toPromise();
    }

    public getDashboardData(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_GET_DASHBOARD, data).toPromise();
    }

    public viewPDFFile(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_VIEW_PDF_FILE, data, {responseType: 'arraybuffer'}).toPromise();
    }

    downloadDocument(id: string): Observable<any> {
        let url = ProcurementService.config.PROCUREMENT_PDF_DOWNLOAD + id;
        return this.api.get(url, {responseType: 'arraybuffer'});
    }

    public deleteSupplier(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_DELETE_SUPPLIERS, data).toPromise();
    }

    public loadManageServiceList(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_LIST_SERVICE, data).toPromise();
    }

    public saveService(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SAVE_SERVICE, data).toPromise();
    }

    public getService(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_GET_SERVICE, data).toPromise();
    }

    public editServiceSurvey(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_EDIT_SERVICE_SURVEY, data).toPromise();
    }

    public getServiceSurvey(): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_GET_SERVICE_SURVEY, null).toPromise();
    }

    public deleteService(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_DELETE_SERVICE, data).toPromise();
    }

    public saveServiceAgreement(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SAVE_SERVICE_AGREEMENT, data).toPromise();
    }

    public saveServiceAgreementByID(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SAVE_BY_ID_SERVICE_AGREEMENT, data).toPromise();
    }

    public deleteServiceAgreement(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_DELETE_SERVICE_AGREEMENT, data).toPromise();
    }

    public deleteserviceSurvey(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_DELETE_SERVICE_SRUVEY, data).toPromise();
    }

    public serviceAcceptReject(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_ACCEPT_REJECT_SUPPLIERS, data).toPromise();
    }

    public sendExpiringDocumentNotice(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SEND_EXPIRING_DOCUMENT_NOTICE, data).toPromise();
    }

    public questionList(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_QUESTION_LIST, data).toPromise();
    }

    public editEmail(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_EDIT_EMAIL, data).toPromise();
    }

    public deleteDeclineAPI(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_DECLINE_DELETE, data).toPromise();
    }

    public supplierCountByStatus(): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SUPPLIER_COUNT_BY_STATUS, null).toPromise();
    }

    public requestMoreDetailAPI(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_REQUEST_MORE_DETAIL, data).toPromise();
    }

    public listSupplierFitIndex(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_LIST_SUPPLIER_FIT_INDEX, data).toPromise();
    }

    public loadAppQuizMetricList(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SURVEY_CALCULATION, data).toPromise();
    }

    public supplierLogActivity(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SUPPLIER_LOG_ACTIVITY, data).toPromise();
    }

    public saveProcurementSetting(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SETTINGS_SAVE_DOC, data).toPromise();
    }

    public viewProcurementSetting(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SETTINGS_VIEW_DOC, data).toPromise();
    }

    public updateEmailConfig(data): Promise<ApiResponse<any>> {
        return this.api.post<ApiResponse<any>>(ProcurementService.config.PROCUREMENT_SETTINGS_EMAIL_CONFIGURATION, data).toPromise();
    }

    updateSupplierEmailNotice(data: any): Observable<any> {
        return this.api.post<any>(ProcurementService.config.PROCUREMENT_SETTINGS_UPDATE_EMAIL_NOTICE, data);
    }

    getListEmailConfig(data: any): Observable<any> {
        return this.api.post<any>(ProcurementService.config.PROCUREMENT_SETTINGS_LIST_EMAIL_CONFIGURATION, data);
    }
}
