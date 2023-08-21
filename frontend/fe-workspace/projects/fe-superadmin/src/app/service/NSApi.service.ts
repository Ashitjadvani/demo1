import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {NSHelperService} from './NSHelper.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NSApiService {

  constructor(private http: HttpClient,
              private router: Router) {

              }
  private httpOptions: any;
  baseUrl: string = environment.baseURL;

  public getHeader(): any {
    const tokenData = localStorage.getItem('NSTokenData');
    this.httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: (tokenData) ? `Bearer ${tokenData}` : null
      }),
    };
    return this.httpOptions;
  }

  private handleAuthError(err: HttpErrorResponse): any {
    if (err.status === 401) {
      NSHelperService.onLogOut();
      const e = err.error;
      window.location.href = '/';
    }
    return throwError(err);
  }

  login(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/login', data);
  }
  loggedIn(): any{
    return !!localStorage.getItem('NSTokenData');
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/forgot-password', data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/reset-password', data);
  }


  // ======================================================== for Features Component =============================================================================================================

  // get features list

  getFeatures(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + 'super-admin/features/list', data, this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x))).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // add a feature in records
  addFeatures(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'super-admin/features/save', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // to delete a record from Features
  deleteRec(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/features/delete' , data, this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // edit features list
  editRec(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/features/edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  changeStatus(data: any): Observable<any> {
    return this. http.post(this.baseUrl + 'super-admin/features/change-status', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)))
  }


  // ========================================================= for ContactType Component ========================================================================================================

  // contact type listing
  contactType(data: any ): Observable<any>{
    return this.http.post(this.baseUrl + 'super-admin/contact-type/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // to add a record in contact type
  addContact(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/contact-type/save', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // to delete a record from contact type
  deleteContact(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/contact-type/delete' , data, this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // to edit contact
  editContact(documentId: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/contact-type/edit', { id : documentId}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }


  // ============================================================ for client management component =================================================================================================

  // to get Client management data
  getClientData(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl + 'super-admin/client-management/list', data, this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x))).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // to delete a record from Client-management
  deleteClient(documentId: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/client-management/delete' , { id : documentId}, this.getHeader()).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // to add a record in Client management module
  addClient(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/client-management/save', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  // edit Client
  editClient(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/client-management/edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }
  // view client details
  viewClient(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/client-management/edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  chnagePassword(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/change-password',data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }
  chnageProfile(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/update-profile',data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }
  editViewProfile(id:any): Observable<any> {
    return this.http.post(this.baseUrl + 'super-admin/edit-profile',{id:id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }
  editViewProfileImg(profile_id:any): Observable<any> {
    return this.http.post(this.baseUrl + 'data-storage/image',{id:profile_id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  updateProfileImg(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'data-storage/upload',data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  viewDashboard(data:any){
    return this.http.post(this.baseUrl +'super-admin/dashboard', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  getFeaturesList(data:any){
    return this.http.post(this.baseUrl +'super-admin/client-management/features/list', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  imageDetails(data :any): Observable<any>{
    return this.http.post(this.baseUrl + 'data-storage/details', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  changePasswordAPI(data :any): Observable<any>{
    return this.http.post(this.baseUrl + 'super-admin/client-management/change-password', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  changeStatusAPI(data :any): Observable<any>{
    return this.http.post(this.baseUrl + 'super-admin/client-management/change-status', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  activityLogAPI(data :any): Observable<any>{
    return this.http.post(this.baseUrl + 'super-admin/activity-log/list', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  clientViewDashboard(data :any): Observable<any>{
    return this.http.post(this.baseUrl + 'super-admin/client-management/client-dashboard', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }

  pinChartDashboard(data :any): Observable<any>{
    return this.http.post(this.baseUrl + 'super-admin/client-management/pin-chart', data , this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError( (x) => this.handleAuthError(x)));
  }
}

