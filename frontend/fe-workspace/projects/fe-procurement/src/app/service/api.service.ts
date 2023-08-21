import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {throwError, Observable, forkJoin} from 'rxjs';
import {environment} from '../../environments/environment';
import {HelperService} from './helper.service';
import {catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = environment.baseURL;
  private httpOptions: any;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  public getHeader(): any {
    const pTokenData = localStorage.getItem('NPToken');
    if (pTokenData) {
      this.httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + pTokenData
        }),
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json'
        }),
      };
    }
    return this.httpOptions;
  }

  public getHeaderDownload(): any {
    const pTokenData = localStorage.getItem('pTokenData');
    if (pTokenData) {
      this.httpOptions = {
        responseType: 'blob',
      };
    }
    return this.httpOptions;
  }

  login(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/login', data);
  }

  signup(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/signup', data);
  }

  signupSupplier(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/supplierDetail/save', data);
  }

  updateSignupSupplier(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/updateSupplierProfile', data);
  }

  signupSupplierSurvey(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/service/get-survey-question', data);
  }

  saveSupplierSurvey(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/quiz/save', data);
  }

  signupSupplierDocument(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/document/list', data);
  }

  uploadSupplierFiles(file1, file2, file3, file4, file5): Observable<any> {

    /*let formData: FormData = new FormData();
    formData.append('file', fileToUpload);*/
    const callApi = [];
    if (file1) {
      let formData: FormData = new FormData();
      formData.append('file', file1);
      const call1 = this.http.post(this.baseUrl + 'data-storage/upload', formData).pipe(map((res: any) => {
        return { DURCFileId: res.fileId };
      }));
      callApi.push(call1);
    }
    if (file2) {
      let formData: FormData = new FormData();
      formData.append('file', file2);
      const call2 = this.http.post(this.baseUrl + 'data-storage/upload', formData).pipe(map((res: any) => {
        return { DURFFileId: res.fileId };
      }));
      callApi.push(call2);
    }
    if (file3) {
      let formData: FormData = new FormData();
      formData.append('file', file3);
      const call3 = this.http.post(this.baseUrl + 'data-storage/upload', formData).pipe(map((res: any) => {
        return { visuraCameraleFileId: res.fileId };
      }));
      callApi.push(call3);
    }
    if (file4) {
      let formData: FormData = new FormData();
      formData.append('file', file4);
      const call4 = this.http.post(this.baseUrl + 'data-storage/upload', formData).pipe(map((res: any) => {
        return { condizioniFileId: res.fileId };
      }));
      callApi.push(call4);
    }
    if (file5) {
      let formData: FormData = new FormData();
      formData.append('file', file5);
      const call5 = this.http.post(this.baseUrl + 'data-storage/upload', formData).pipe(map((res: any) => {
        return { companyBroucher: res.fileId };
      }));
      callApi.push(call5);
    }
    if (callApi.length > 0) {
      return forkJoin(callApi);
    } else {
      return of(null);
    }
  }

  signupSupplierAgreement(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/supplierDetail/viewUserSelectedServiceAgreement', data);
  }

  getSupplierAgreement(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/supplierDetail/viewSubmittedData', data);
  }

  getSupplierSurvey(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/service/get-survey-question', data);
  }

  getSupplierAteco(): Observable<any> {
    return this.http.get('./assets/data/ateco.json');
  }

  signupVerification(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/verifyOtp', data);
  }

  resendVerification(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/resendOtp', data);
  }

  uploadFile(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'data-storage/upload', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  serviceList(): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/service/listServicesFe', null);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/forgot-password', data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/reset-password', data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/change-password', data, this.getHeader());
  }

  deleteUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/account/delete', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getEditProfile(): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/supplier/viewSupplierProfile', null, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  declineByUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/declineByUser', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getCountryList(): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/countries', null);
  }

  getStatesList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/statesByCountry', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getCitiesList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/cityByProvince', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getSelectedProvince(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'mqs-procurement/provinceByStates', id);
  }

  getCMSDetails(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-dashboard/cms', data)
  }

  getActivityLogList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-procurement/supplier-activity', data,this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)))
  }


  private handleAuthError(err: HttpErrorResponse): any {
    if (err.status === 401) {
      HelperService.onLogOut();
      const e = err.error;
      // window.location.href = '/';
    }
    return throwError(err);
  }

}
