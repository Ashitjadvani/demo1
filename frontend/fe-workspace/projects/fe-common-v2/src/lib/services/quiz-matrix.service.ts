import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class QuizMatrixService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  async getMatrix(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MATRIX_LIST, data).toPromise();
  }
  async addMatrix(data): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.ADD_MATRIX, data).toPromise();
  }
  async deleteMatrix(id: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.DELETE_MATRIX, {id: id}).toPromise();
  }
  async viewMatrix(data): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.VIEW_MATRIX, data).toPromise();
  }
  // async editMatrix(data): Promise<RecruitingCandidateDocument[]> {
  //   return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.VIEW_MATRIX, data).toPromise();
  // }
}
