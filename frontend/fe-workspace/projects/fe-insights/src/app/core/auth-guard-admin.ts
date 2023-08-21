import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';


@Injectable({ providedIn: 'root' })
export class AuthGuardAdmin implements CanActivate {

    constructor(
        private _router: Router,
        private _userManagementServer: UserManagementService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._userManagementServer.getToken() != null) {
            return true;
        }

        this._router.navigate(['/insights/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
