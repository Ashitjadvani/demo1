import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserManagementService } from '../services/user-management.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    
    constructor (
        private userManagementService: UserManagementService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // TODO: add authorization header with jwt token if available
        let currentToken = this.userManagementService.getToken();
        if (currentToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentToken}`
                }
            });
        }
        // TODO: cleanup http errors
        return next.handle(request);
    }
}