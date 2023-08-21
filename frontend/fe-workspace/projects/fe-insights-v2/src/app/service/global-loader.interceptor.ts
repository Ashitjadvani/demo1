import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MCPHelperService} from './MCPHelper.service';
import {finalize} from 'rxjs/operators';

@Injectable()
export class GlobalLoaderInterceptor implements HttpInterceptor {
    private count = 0;

    constructor(private loaderService: MCPHelperService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.count === 0) {
            this.loaderService.setHttpProgressStatus(true);
        }
        this.count++;
        return next.handle(request).pipe(
            finalize(() => {

                this.count--;
                if (this.count === 0) {
                    this.loaderService.setHttpProgressStatus(false);
                }
            }));
    }
}
