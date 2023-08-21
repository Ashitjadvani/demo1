
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { environment } from 'projects/fe-career/src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CareerHelperService } from './careerHelper.service';




@Injectable({
  providedIn: 'root'
})
export class CareerApiService {

  constructor(private http: HttpClient,
              private router: Router,) {
  }

  private httpOptions: any;
  baseUrl: string = environment.baseURL;
  baseImageUrl: string = this.baseUrl+'data-storage/download/';

  public getHeader(): any {
    const tokenData = localStorage.getItem('tokenData');
    if (tokenData) {
      this.httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + tokenData
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
    const tokenData = localStorage.getItem('tokenData');
    if (tokenData) {
      this.httpOptions = {
        responseType: 'blob',
      };
    }
    return this.httpOptions;
  }

  private handleAuthError(err: HttpErrorResponse): any {
    if (err.status === 401) {
      CareerHelperService.onLogOut();
      const e = err.error;
      window.location.href = '/';
    }
    return throwError(err);
  }

  login(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/login-api', data);
  }
  signup(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/register-api', data);
  }
  loginwithlinkedin(data:any): Observable<any> {
   return this.http.post(this.baseUrl + 'job-persons/login-linkedIn-api', data);

  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/reset-password', data);
  }

  verifyOTP(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/verifyOTP', data);
  }

  resendOTP(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/resendOtp', data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/forgot-password', data);
  }

  listOfPostion(data:any):Observable<any>{
    return this.http.post(this.baseUrl + 'job-recruitment/listing', data, this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x))).pipe(catchError( (x) => this.handleAuthError(x)))
   }

  detailsOfPostion(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-recruitment/details', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getDefaultImage(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-dashboard/default-image', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getImage(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'data-storage/image', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  listOfDepartment():Observable<any>{
    return this.http.post(this.baseUrl + 'job-recruitment/department-list',this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x))).pipe(catchError( (x) => this.handleAuthError(x)))
   }

  listOfScope():Observable<any>{
    return this.http.post(this.baseUrl + 'job-recruitment/area-list', this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x))).pipe(catchError( (x) => this.handleAuthError(x)))
  }

  searchPostionData(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-recruitment/listing', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getUniversity(): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/university', null, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getDegree(): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/degree', null, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getJobApplication(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/get-job-application', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getImageData(id: any): Observable<any> {
    return this.http.get(this.baseUrl + 'data-storage/download/'+id, this.getHeaderDownload()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getApplicationById(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/get-application-by-job-id', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getMyApplicationById(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/get-application-by-id', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  saveApplication(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/save-application', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getQuizByID(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-quiz/getQuestionBySurvey', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  saveQuestionAnswer(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-quiz/save-answer', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  uploadPdf(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'data-storage/upload', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getUploadedfileDetails(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'data-storage/details', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getApplicationQuestionBySurvey(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-quiz/getApplicationQuestionBySurvey', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  // MyAccount
  changePassword(data:any):Observable<any>{
    return this.http.post(this.baseUrl + 'job-persons/change-password',data,this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x))).pipe(catchError( (x) => this.handleAuthError(x)))
  }
  getUserdetail(): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/user-details', null, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }
  editUserProfile(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/edit-profile', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }
  applicationDataListing(data :any = null): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/applications-list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  statusDraft(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-recruitment/status-draft', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  statusSent(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-recruitment/status-sent', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getFileDetails(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'data-storage/details', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  deleteJobApplication(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-application/delete-application', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  deleteUser(): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/delete-user',null, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  listActivityLog(data): Observable<any> {
    return this.http.post(this.baseUrl + 'job-persons/activity-log', data,this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  findIDFromList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'job-recruitment/listing', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  // getCMSDetails(): Observable<any> {
  //   return this.http.post(this.baseUrl + 'mqs-dashboard/cms/list', null);
  // }

  getCMSDetails(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-dashboard/cms', data)
  }

  saveActivityLog(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-dashboard/active/save', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getAdditionalDetailBySurveyId(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mqs-quiz/getQuestionBySurveyAdditionalDetail', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

}
