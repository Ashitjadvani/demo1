import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class AddressManagementService {
  baseUrl: string = environment.api_host;
  token: any;
  companyId: any;
  private httpOptions: any;
  constructor(private http: HttpClient,
              private apiService: ApiService) {

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
      // console.log('token', this.token);
      // console.log('id', this.companyId);
    }
  }

  getCountryList(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/country/list', data);
  }
  deleteCountry(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/country/delete',{id:id});
  }
  addCountry(name: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/country/add', name);
  }
  editCountry(name: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/country/edit', name);
  }
  deleteMultiCountry(id:any){
    return this.http.post(this.baseUrl + 'v2/mqs-procurement/countries/delete',{id:id});
  }
  getRegionList(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/state/list', data);
  }
  getCountryDropdown(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/countries', data);
  }
  addRegion(name: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/state/add', name);
  }
  editRegion(name: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/state/view', name);
  }
  deleteRegion(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/state/delete',{id:id});
  }
  getCitiesList(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/city/list', data);
  }
  addCity(name: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/city/add', name);
  }
  getRegionDropdown(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/states', data);
  }
  editCity(name: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/city/view', name);
  }
  deleteCity(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/city/delete',{id:id});
  }
  getSelectedCountryRegion(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/statesByCountry', {countryID: id});
  }
  getSelectedProvince(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v2/mqs-procurement/provinceByStates', id);
  }

}
