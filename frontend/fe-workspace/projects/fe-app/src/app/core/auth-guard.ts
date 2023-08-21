import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private userManagementServer: UserManagementService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('AuthGuard.canActivate: route ', route);

        if (this.userManagementServer.getToken() != null) {
            return true;
        }

        console.log('AuthGuard.canActivate: no logged user navigate to login', route);
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}