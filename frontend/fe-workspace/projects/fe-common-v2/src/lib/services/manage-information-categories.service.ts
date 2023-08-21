import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class ManageInformationCategoriesService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  async getCategoriesList(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.INFO_CATEGORY_LISTALL, data).toPromise();
  }

  async deleteCategories(id: any): Promise<RecruitingCandidateDocument[]> {
    let url = buildRequest(this.apiService.API.BE.INFO_CATEGORY_DOC,
      {
        ':id': id
      });
    return await this.apiService.delete<any>(url).toPromise();
  }
}
