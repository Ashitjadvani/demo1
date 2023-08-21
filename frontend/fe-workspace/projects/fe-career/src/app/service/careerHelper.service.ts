import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractControl, FormControl} from '@angular/forms';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerHelperService {

public static authUser:any={};
public static loginUserData: any = {};
public static loginUserID: any = "0";
public static loginUserToken: any = "";
public static loginUserMetaData:any;
public static resetPasswordToken: any = "";
public static signUPEmailID: any = "";
public static filterApplicationStatus: any = "";
sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();
loginVisibilityChange: Subject<boolean> = new Subject<boolean>();
languageTranslatorChange: Subject<string> = new Subject<string>();
isSidebarVisible: boolean = false;
isLoginVisible: boolean = false;
setLanguageTranslator: string = "en";

public static ApplicationTypeArray: any = ['-', 'OTHERS.OpenPositions', 'OTHERS.SpontaneousApplication'];
public static saveLoginData(loginUser: any) {
  return new Promise((resolve, reject) => {
    if (loginUser) {
     CareerHelperService.loginUserData.tokenObject = loginUser;

     CareerHelperService.loginUserID =CareerHelperService.loginUserData.tokenObject._id;
      if (loginUser) {
        if (this.loginUserData) {

         CareerHelperService.loginUserData = loginUser;
         CareerHelperService.loginUserID =CareerHelperService.loginUserData.tokenObject._id;
        }

      }
      localStorage.setItem('loggedInUser', JSON.stringify(loginUser));
      localStorage.setItem('tokenData',CareerHelperService.loginUserData.tokenData);
      resolve(0)
    } else {
      resolve(0)
    }
  });
}

/*public static saveLanguageName(data: any) {
  localStorage.setItem('languageName', JSON.stringify(data));
}*/

public static getLanguageName() {
  let languageData = localStorage.getItem('currentLanguage');
  if(languageData) {
    return languageData;
  }
  return null;
}

static noWhitespaceValidator(control: FormControl): any {
  const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'required': true };
}

toggleSidebarVisibility(isSidebarVisible: boolean): void {
  this.isSidebarVisible = isSidebarVisible;
  this.sidebarVisibilityChange.next(this.isSidebarVisible);
}

languageTranslator(isSidebarVisible: string): void {
  this.setLanguageTranslator = isSidebarVisible;
  this.languageTranslatorChange.next(this.setLanguageTranslator);
}

toggleLoginVisibility(isLoginVisible: boolean): void {
    this.isLoginVisible = isLoginVisible;
    this.loginVisibilityChange.next(this.isLoginVisible);
}

setLocalStorage() {
  let getToken = localStorage.getItem('tokenData');
  let loggedInUser = localStorage.getItem('loggedInUser');
  if(getToken && loggedInUser) {
    let loginUser: any = JSON.parse(loggedInUser);
    localStorage.getItem('loginId');
    CareerHelperService.loginUserData = loginUser.user;
    CareerHelperService.loginUserID = loginUser.user.id;
    CareerHelperService.loginUserToken = loginUser.user.token;
  }
}

saveLocalStorage(loginUser) {
  CareerHelperService.loginUserData = loginUser.user;
  CareerHelperService.loginUserMetaData = loginUser.result;
  CareerHelperService.loginUserID = loginUser.user.user.id;
  CareerHelperService.loginUserToken = loginUser.user.token;
  localStorage.removeItem('tokenData');
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loginId');
  localStorage.setItem('loggedInUser', JSON.stringify(loginUser));
  localStorage.setItem('loginId', CareerHelperService.loginUserID);
  localStorage.setItem('tokenData', CareerHelperService.loginUserToken);
}

public static onLogOut(): void {
  localStorage.removeItem("tokenData");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loginId");
  CareerHelperService.loginUserData = null;
  CareerHelperService.loginUserMetaData = null;
  CareerHelperService.loginUserID = null;
  CareerHelperService.loginUserToken = null;
}

  public isEmpty(obj): boolean {
    return typeof obj === 'object' && Object.keys(obj).length === 0;
  }

}
