import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router) {
  }

  canActivate(): boolean {
    const pTokenData = localStorage.getItem('pTokenData');
    if (pTokenData) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
