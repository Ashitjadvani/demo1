import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MCPHelperService {

    constructor(private http: HttpClient) {

        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            // this.token = authUser.token;
            this.companyId = authUser.person.companyId;
        }
    }

    public static authUser: any = {};
    public static loginUserData: any = null;
    public static loginUserID = '';
    public static loginUserToken = '';

    invokeFirstComponentFunction = new EventEmitter();
    chartUpdateDataEmitter = new EventEmitter();
    updateSideMenuEmitter = new EventEmitter();
    clearEventSelectionEmitter = new EventEmitter();
    subsVar: Subscription;

    sideMenuListName = new Subject<any>();
    userLanguageSelect = new Subject<any>();
    languageList = new Subject<any>();
    totalCount = new Subject<any>();
    baseUrl: string = environment.api_host;
    languageTranslatorChange: Subject<string> = new Subject<string>();
    changeLogoTranslatorChange: Subject<string> = new Subject<string>();
    setLanguageTranslator = 'it';
    loaderVisibilityChange: Subject<boolean> = new Subject<boolean>();
    listCountData: BehaviorSubject<any>;
    isLoaderVisible = false;
    private httpLoading$ = new ReplaySubject<boolean>(1);
    private countData: any;

    companyId: any;

    public static getLanguageName(): string {
        const languageData = localStorage.getItem('currentLanguage');
        if (languageData) {
            return languageData;
        }
        return null;
    }

    public static onLogOut(): void {
        localStorage.removeItem('credentials');
        localStorage.removeItem('MCPToken');
        localStorage.removeItem('MCPLoggedInUser');
        localStorage.removeItem('MCPLoginId');
        MCPHelperService.loginUserData = null;
        MCPHelperService.loginUserID = null;
        MCPHelperService.loginUserToken = null;
    }

    public static saveLocalStorage(loginUser): void {
        MCPHelperService.loginUserData = loginUser;
        MCPHelperService.loginUserID = loginUser.id;
        MCPHelperService.loginUserToken = loginUser.token;
        localStorage.removeItem('MCPTokenData');
        localStorage.removeItem('MCPLoggedInUser');
        localStorage.removeItem('MCPLoginId');
        localStorage.setItem('MCPLoggedInUser', JSON.stringify(loginUser));
        localStorage.setItem('MCPLoginId', MCPHelperService.loginUserID);
        localStorage.setItem('MCPTokenData', MCPHelperService.loginUserToken);
    }

    public static getLocalStorage(): void {
        const loginUser: any = JSON.parse(localStorage.getItem('credentials'));
        if (loginUser) {
            MCPHelperService.loginUserData = loginUser.person;
            MCPHelperService.loginUserID = loginUser.person.id;
            MCPHelperService.loginUserToken = loginUser.token;
        }
    }

    static noWhitespaceValidator(control: FormControl): any {
        const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : {required: true};
    }

    static nameValidator(control: FormControl): { [key: string]: boolean } {
        const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (control.value && nameRegexp.test(control.value)) {
            return {nameValidator: true};
        }
    }

    toggleLoaderVisibility(isSidebarVisible: boolean): void {
        this.isLoaderVisible = isSidebarVisible;
        this.loaderVisibilityChange.next(this.isLoaderVisible);
    }
    setListCount(countData: any): void {
       this.countData = countData;
       console.log(this.countData);
       this.listCountData?.next(this.countData);
    }

    // tslint:disable-next-line:typedef
    getListCount() {
        return this.countData?.asObservable();
    }
    // Global loader
    httpProgress(): Observable<boolean> {
        return this.httpLoading$.asObservable();
    }

    // tslint:disable-next-line:typedef
    setHttpProgressStatus(inprogess: boolean) {
        this.httpLoading$.next(inprogess);
    }

    languageTranslator(isSidebarVisible: string): void {
        this.setLanguageTranslator = isSidebarVisible;
        this.languageTranslatorChange.next(this.setLanguageTranslator);
    }

    onFirstComponentButtonClick() {
        this.invokeFirstComponentFunction.emit();
    }

    chartUpdateData() {
        this.chartUpdateDataEmitter.emit();
    }

    updateSideMenuData() {
        this.updateSideMenuEmitter.emit();
    }

    clearEventSelection(stepName: string) {
        this.clearEventSelectionEmitter.emit(stepName);
    }

    serviceCategoryList(data: any = null): Observable<any> {
        return this.http.post(this.baseUrl + 'v2/mqs-service/list', data);
    }

    signupSupplierDocument(data: any): Observable<any> {
        return this.http.post(this.baseUrl + '/v2/mqs-procurement/document/list', data);
    }

    getCMSDetails(data: any): Observable<any> {
        return this.http.post(this.baseUrl + '/v2/mqs-dashboard/cms', data);
    }

    getFitIndexDetails(data: any): Observable<any> {
        return this.http.post(this.baseUrl + '/v2/mqs-quiz/metric/survey/view', data);
    }

    getClientDashboardData(data: any): Observable<any> {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/dashboard/count', data);
    }

    getEditEventTypeData(eventId, id): Observable<any> {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/edit/event/type', {eventId, id});
    }

    // Multiple Delete APIs

    deleteMultiScopes(scope: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/delete/scopes', scope);
    }

    deleteMultiSites(id: any) {
        return this.http.post(this.baseUrl + '/v2/site-manager/delete/sites', id);
    }

    deleteMultiArea(name: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/areas/delete', name);
    }

    deleteMultiRoles(name: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/roles/delete', name);
    }

    deleteMultiJobTitle(title: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/jobTitles/delete', title);
    }

    deleteMultiDegrees(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-dashboard/delete/degrees', id);
    }

    deleteMultiPeopleGroups(id: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/delete/groups', id);
    }

    deleteMultiAccounts(id: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/delete/accounts', id);
    }

    deleteMultiAlerts(id: any) {
        return this.http.post(this.baseUrl + '/v2/delete/alerts', id);
    }

    deleteMultiPushNotifications(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-recruiting/delete/push-notifications', id);
    }

    deleteMultiTouchPoints(id: any) {
        return this.http.post(this.baseUrl + '/v2/touchpoint/deletes', id);
    }

    deleteMultiPeople(id: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/delete/persons', id);
    }

    deleteMultiCategory(id: any) {
        return this.http.post(this.baseUrl + '/v2/info-category/deletes', id);
    }

    deleteMultiInformation(id: any) {
        return this.http.post(this.baseUrl + '/v2/info/deletes', id);
    }

    deleteMultiCandidates(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-recruiting/candidates/delete', id);
    }

    deleteMultiApplications(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-recruiting/applications/delete', id);
    }

    deleteMultiOpenings(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-recruiting/jobs/delete', id);
    }

    deleteMultiMetrics(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-quiz/metrics/deletes', id);
    }

    deleteMultiQuestions(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-questions/multiple/delete', id);
    }

    deleteMultiSurvey(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-quiz/survey/delete', id);
    }

    deleteMultiUniversity(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-dashboard/universities/delete', id);
    }

    deleteMultiDispute(name: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/' + this.companyId + '/disputes/delete', name);
    }

    deleteMultiEvent(id: any) {
        return this.http.post(this.baseUrl + '/v2/user-manager/company/event/types/delete', {
            id,
            companyId: this.companyId
        });
    }

    deleteMultiCountry(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-procurement/countries/delete', {id});
    }

    deleteMultiRegion(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-procurement/multiple/states/delete', {id});
    }

    deleteMultiCities(id: any) {
        return this.http.post(this.baseUrl + '/v2/mqs-procurement/multiple/city/delete', {id});
    }

    deleteMultiResourceGroups(id: any) {
        return this.http.post(this.baseUrl + '/v2/booking/resource/type/delete', id);
    }

    back() {
        history.back();
    }
}
