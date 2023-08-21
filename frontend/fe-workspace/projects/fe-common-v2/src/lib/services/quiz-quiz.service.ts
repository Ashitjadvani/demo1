import { Injectable } from '@angular/core';
import {environment} from '../../../../fe-insights-v2/src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {ApiService, buildRequest} from './api';
import {RecruitingCandidateDocument} from '../models/admin/recruiting-candidate-document';

@Injectable({
  providedIn: 'root'
})
export class QuizQuizService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  async getQuiz(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.QUIZ_LISTING, data).toPromise();
  }
  async deleteQuiz(id: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.QUIZ_QUESTION_DELETE, {id: id}).toPromise();
  }
  async viewQuiz(data): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.VIEW_QUIZ_DEATILS, data).toPromise();
  }
  async addQuestion(data): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.ADD_QUESTION, data).toPromise();
  }
}
