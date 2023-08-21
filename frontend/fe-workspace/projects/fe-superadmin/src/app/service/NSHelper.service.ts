import {EventEmitter, Injectable} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NSHelperService {
  sideMenuListName = new Subject<any>();
  profileFirstName = new Subject<any>();
  profileLastName = new Subject<any>();
  loaderVisibilityChange: Subject<boolean> = new Subject<boolean>();
  isLoaderVisible = false;
  invokeFirstComponentFunction = new EventEmitter();

  onFirstComponentButtonClick() {
    this.invokeFirstComponentFunction.emit();
  }

  public static authUser: any = {};
  public static loginUserData: any = {};
  public static loginUserID = '';
  public static loginUserToken = '';

  public static onLogOut(): void {
    localStorage.removeItem('NSToken');
    localStorage.removeItem('NSLoggedInUser');
    localStorage.removeItem('NSLoginId');
    NSHelperService.loginUserData = null;
    NSHelperService.loginUserID = null;
    NSHelperService.loginUserToken = null;
  }

  public static saveLocalStorage(loginUser): void {
    NSHelperService.loginUserData = loginUser;
    NSHelperService.loginUserID = loginUser.id;
    NSHelperService.loginUserToken = loginUser.token;
    localStorage.removeItem('NSTokenData');
    localStorage.removeItem('NSLoggedInUser');
    localStorage.removeItem('NSLoginId');
    localStorage.setItem('NSLoggedInUser', JSON.stringify(loginUser));
    localStorage.setItem('NSLoginId', NSHelperService.loginUserID);
    localStorage.setItem('NSTokenData', NSHelperService.loginUserToken);
  }

  public static getLocalStorage(): void {
    const loginUser: any = localStorage.getItem('NSLoggedInUser');
    if (loginUser) {
      NSHelperService.loginUserData = loginUser;
      NSHelperService.loginUserID = loginUser.id;
      NSHelperService.loginUserToken = loginUser.token;
    }
  }

  toggleLoaderVisibility(isSidebarVisible: boolean): void {
    this.isLoaderVisible = isSidebarVisible;
    this.loaderVisibilityChange.next(this.isLoaderVisible);
  }
}
