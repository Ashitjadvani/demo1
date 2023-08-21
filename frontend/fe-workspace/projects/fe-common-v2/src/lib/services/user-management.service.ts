import { Injectable } from '@angular/core';
import { ApiService, buildRequest } from './api';
import { User } from '../models/admin/user';
import { NfsUser } from '../models/api/nfs-user';
import { Person } from '../models/person';
import jwtDecode from 'jwt-decode';
import {BaseResponse} from "./base-response";
import {Observable} from "rxjs";
import {environment} from "../../../../fe-insights-v2/src/environments/environment";
import {HttpClient} from "@angular/common/http";


class Credentials {
  brandColor: string;
  groupCount: string;
  token: string;
  person: Person;

    constructor(brandColor: string, groupCount: string, token: string, person: Person) {
        this.token = token;
        this.person = person;
        this.brandColor = brandColor;
        this.groupCount = groupCount;
    }
}

class LoginResponse {
    result: boolean;
    user: {
      brandColor: string
      groupCount: string
      token: string;
      person: Person;
    };
    reason: string;
    resetPassword?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {
  baseUrl: string = environment.api_host;
    //
    // API documentation: https://agos.nfsonline.net/WorkspaceAPI/Help
    //
    private userCredentials: Credentials;
    private authorizationToken: Credentials;
    companyId: any;

    constructor(private apiService: ApiService,
                private http: HttpClient)
    {
        this.loadCredentials();
      const credentials = localStorage.getItem('credentials');
      if (credentials) {
        const authUser: any = JSON.parse(credentials);
        // this.token = authUser.token;
        this.companyId = authUser.person.companyId;
        // console.log('token', this.token);
        // console.log('id', this.companyId);
      }
    }

    initialize() {
        console.log('UserManagementService: initialization begin');
        return new Promise(async (resolve, reject) => {
            if (!this.loadCredentials()) {
                this.userCredentials = null;
            }
            resolve(null);
        });
    }

  async login(username: string, password: string, isConsole: boolean, isLogin: boolean= true) {
    try {
      let bodyRequest: any = {
        user: username,
        password: password,
        isConsole: isConsole
      };
      let res = null;
      if (isLogin) {
        res = await this.apiService.post<LoginResponse>(this.apiService.API.ACCOUNT.LOGIN, bodyRequest).toPromise();
        if (res.result)
          this.authorizationToken = res.user.otp;
          localStorage.setItem('reset-otp', JSON.stringify(this.authorizationToken));
          localStorage.setItem('reset-password', JSON.stringify(res.resetPassword));
      } else {
        //bodyRequest.otp = this.authorizationToken;
        bodyRequest = {
          password: username,
          confPassword: password,
          otp: this.authorizationToken
        };
        res = await this.apiService.post<LoginResponse>(this.apiService.API.ACCOUNT.LOGINRESETPASSWORD, bodyRequest).toPromise();
        localStorage.setItem('reset-otp', JSON.stringify(this.authorizationToken));
      }
      console.log("UserManagementService.login: result - ", res);

      if (res.result && res.resetPassword)
        this.saveCredentials(res.user.brandColor,res.user.groupCount, res.user.token, res.user.person);

      return {
        result: res.result,
        resetPassword: res.resetPassword,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'You don\'t have access to this system'
      };
    }
  }

  async forgotPassword(email: string) {
    try {
      let bodyRequest = {
        email: email
      };
      let res = await this.apiService.post<any>(this.apiService.API.ACCOUNT.ForgotPassword, bodyRequest).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.result,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async resetPassword(otp: string, password: string, confPassword: string) {
    try {
      let bodyRequest = {
        otp: otp,
        password: password,
        confPassword: confPassword
      };
      let res = await this.apiService.post<any>(this.apiService.API.ACCOUNT.ResetPassword, bodyRequest).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.result,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async resetPasswordLogin(otp: string, password: string, confPassword: string) {
    try {
      let bodyRequest = {
        otp: otp,
        password: password,
        confPassword: confPassword
      };
      let res = await this.apiService.post<any>(this.apiService.API.ACCOUNT.LOGINRESETPASSWORD, bodyRequest).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.result,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }


    async touchPointAuth(touchPointId: string) {
        try {
            let url = buildRequest(this.apiService.API.BE.TOUCHPOINT_AUTH,
                {
                    ':id': touchPointId
                });

            let res = await this.apiService.get<LoginResponse>(url).toPromise();
            console.log("UserManagementService.touchPointAuth: result - ", res);

            if (res.result)
                this.saveCredentials(res.user.brandColor,res.user.groupCount, res.user.token, res.user.person);

            return {
                result: res.result,
                reason: res.reason
            };
        } catch (ex) {
            console.log('UserManagementService.touchPointAuth: exception - ', ex);
            return {
                result: false,
                reason: 'Internal error'
            };
        }
    }

    invalidateToken() {
        this.userCredentials = null;
        localStorage.removeItem("credentials");
    }

    getToken(): string {
        return this.userCredentials ? this.userCredentials.token : null;
    }

    getTokenDecoded(): any {
        return this.userCredentials ? jwtDecode(this.userCredentials.token) : null;
    }

    getAccount(): Person {
        return this.userCredentials ? this.userCredentials.person : null;
    }
    getBrandColor(): string {
      return this.userCredentials ? this.userCredentials.brandColor : null;
    }

    groupCount(): string {
      return this.userCredentials ? this.userCredentials.groupCount : null;
    }

    logout() {
        localStorage.removeItem("credentials");
    }

    private loadCredentials(): boolean {
        let credentials: Credentials = JSON.parse(localStorage.getItem("credentials"));
        if (credentials == null)
            return false;

        this.userCredentials = credentials;

        return true;
    }

    private saveCredentials(brandColor: string,groupCount: string, token: string, person: Person) {
        let credentials = new Credentials(brandColor, groupCount, token, person);

        this.userCredentials = credentials;
        localStorage.setItem("credentials", JSON.stringify(credentials));
    }

  // async getNotification(data: any): Promise<BaseResponse> {
  //   return this.apiService.post<BaseResponse>(this.apiService.API.BE.BELL_NOTIFICATION_LIST, {isUnRead : false}).toPromise();
  // }

  getnotifications(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-recruiting/notification-listing', data);
  }
  getnotificationsList(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-recruiting/push-notification/list', data);
  }

  async pushNotification(data: any): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(this.apiService.API.BE.PUSH_NOTIFICATION, data).toPromise();
  }

   async deletepushNotification(data: any): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(this.apiService.API.BE.DELETE_PUSH_NOTIFICATION, data).toPromise();
  }
  getnotificationsRead(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-recruiting/notification/read-unread', data);
  }

}
