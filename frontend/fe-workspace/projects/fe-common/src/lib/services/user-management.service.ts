import { Injectable } from '@angular/core';
import { ApiService, buildRequest } from './api';
import { User } from '../models/admin/user';
import { NfsUser } from '../models/api/nfs-user';
import { Person } from '../models/person';
import jwtDecode from 'jwt-decode';


class Credentials {
    token: string;
    person: Person;

    constructor(token: string, person: Person) {
        this.token = token;
        this.person = person;
    }
}

class LoginResponse {
    result: boolean;
    user: {
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
    //
    // API documentation: https://agos.nfsonline.net/WorkspaceAPI/Help
    //
    private userCredentials: Credentials;
    private authorizationToken: Credentials;

    constructor(private apiService: ApiService)
    {
        this.loadCredentials();
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

    private loadCredentials(): boolean {
        let credentials: Credentials = JSON.parse(localStorage.getItem("credentials"));
        if (credentials == null)
            return false;

        this.userCredentials = credentials;

        return true;
    }

    private saveCredentials(token: string, person: Person) {
        let credentials = new Credentials(token, person);

        this.userCredentials = credentials;
        localStorage.setItem("credentials", JSON.stringify(credentials));
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
      } else {
        //bodyRequest.otp = this.authorizationToken;
        bodyRequest = {
          password: username,
          confPassword: password,
          otp: this.authorizationToken
        };
        res = await this.apiService.post<LoginResponse>(this.apiService.API.ACCOUNT.LOGINRESETPASSWORD, bodyRequest).toPromise();
      }
      console.log("UserManagementService.login: result - ", res);

      if (res.result && res.resetPassword)
        this.saveCredentials(res.user.token, res.user.person);

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

    async touchPointAuth(touchPointId: string) {
        try {
            let url = buildRequest(this.apiService.API.BE.TOUCHPOINT_AUTH,
                {
                    ':id': touchPointId
                });

            let res = await this.apiService.get<LoginResponse>(url).toPromise();
            console.log("UserManagementService.touchPointAuth: result - ", res);

            if (res.result)
                this.saveCredentials(res.user.token, res.user.person);

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
        console.log('jwtDecode(this.userCredentials.token)>>>>>',jwtDecode(this.userCredentials.token));
    }

    getAccount(): Person {
        return this.userCredentials ? this.userCredentials.person : null;
    }

    logout() {
        localStorage.removeItem('credentials');
    }
}
