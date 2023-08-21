import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DBApiService {
  baseUrl: string = environment.baseURL;
  constructor(private http:HttpClient) { }

  contactType(data :any = null): Observable<any>{
    return this.http.post(this.baseUrl + 'contact-type/list',data)
  }
  
}
