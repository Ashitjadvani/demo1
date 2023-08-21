// Angular
import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
// RxJS
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {entityByModule} from '../features/ngrx.conf';


@Injectable()
export class InterceptService implements HttpInterceptor {
  // intercept request and add token
  constructor() {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // tslint:disable-next-line:variable-name
    let new_url = '';
    if (request.url.indexOf('{api_prefix}') > -1) {
      for (const mod in entityByModule) {
        for( const cls of entityByModule[mod].items){
          if (request.url.indexOf(cls.toLowerCase()) > -1){
            new_url = request.url.replace('{api_prefix}', entityByModule[mod].prefix)
          }
        }
      }

    }
    request = request.clone({
      url: (new_url !== '') ? new_url : request.url,
    });
    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            // http response status code
          }
        },
        error => {
          // http response status code
          // console.error('status code:');
          // tslint:disable-next-line:no-debugger
          console.error(error.status);
          console.error(error.message);
        }
      )
    );
  }
}
