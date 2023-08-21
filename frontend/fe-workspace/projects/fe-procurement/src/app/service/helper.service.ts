import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {FormControl} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  languageTranslatorChange: Subject<string> = new Subject<string>();
  loaderVisibilityChange: Subject<boolean> = new Subject<boolean>();
  public static authUser: any = {};
  public static loginUserData: any = {};
  public static loginUserID = '';
  public static loginUserToken = '';
  public static companyReferenceEmail = '';
  setLanguageTranslator: string = 'en';
  isLoaderVisible = false;
  public lang: string;
  static languageData: string;

  constructor(public translate: TranslateService,) {
    translate.addLangs(['en', 'it']);
    translate.setDefaultLang('it');
  }
  public static getLanguageName() {

    let languageData = localStorage.getItem('currentLanguage') || "en";
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

  languageTranslator(isSidebarVisible: string): void {
    this.setLanguageTranslator = isSidebarVisible;
    this.languageTranslatorChange.next(this.setLanguageTranslator);
  }

  toggleLoaderVisibility(isSidebarVisible: boolean): void {
    this.isLoaderVisible = isSidebarVisible;
    this.loaderVisibilityChange.next(this.isLoaderVisible);
  }

  public static onLogOut(): void {
    localStorage.removeItem('NPToken');
    localStorage.removeItem('NPLoggedInUser');
    localStorage.removeItem('NPLoginId');
    HelperService.loginUserData = null;
    HelperService.loginUserID = null;
    HelperService.loginUserToken = null;
  }

  public static saveLocalStorage(loginUser): void {
    HelperService.loginUserData = loginUser;
    HelperService.loginUserID = loginUser.id;
    HelperService.loginUserToken = loginUser.token;
    localStorage.removeItem('NPToken');
    localStorage.removeItem('NPLoggedInUser');
    localStorage.removeItem('NPLoginId');
    localStorage.setItem('NPLoggedInUser', JSON.stringify(loginUser));
    localStorage.setItem('NPLoginId', HelperService.loginUserID);
    localStorage.setItem('NPToken', HelperService.loginUserToken);
  }

  public static getLocalStorage(): void {
    const loginUser: any = localStorage.getItem('NPLoggedInUser');
    if (loginUser) {
      HelperService.loginUserData = loginUser;
      HelperService.loginUserID = loginUser.id;
      HelperService.loginUserToken = loginUser.token;
    }
  }

}
