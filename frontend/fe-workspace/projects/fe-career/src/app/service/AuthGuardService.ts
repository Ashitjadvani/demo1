import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {CareerApiService} from "./careerApi.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router,
              private apiService: CareerApiService) {
  }

  canActivate(): Promise<boolean> {
    return this.apiService.getUserdetail().toPromise().then((data: any) => {
      return true;
    }, (err) => {
      console.log('!!!!!!!!!!!!!!!!!', err);
      return false;
    });

  }
}
