import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../../../../fe-insights/src/app/features/tklab/store/models';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights/src/environments/environment';


@Injectable()
export class TklabService {
  static config = {
    TKLAB_API_ROOT: environment.api_host + '/v1/tklab',
    TKLAB_SURVEY_API_ROOT: environment.api_host + '/v1/tklab/survey',
    TKLAB_GET_SURVEY_CHOICES: '/v1/tklab/survey/choices',
    TKLAB_GET_APP_SURVEY: '/v1/tklab/survey/player'
  };

  constructor(private api: ApiService) {
  }

  public loadSurveyChoices(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(TklabService.config.TKLAB_GET_SURVEY_CHOICES);
  }

  public loadAppSurvey(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(TklabService.config.TKLAB_GET_APP_SURVEY);
  }

  public loadAppSurveyQuestion(survey_id): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(TklabService.config.TKLAB_GET_APP_SURVEY + '/' + survey_id);
  }

  public sendSurveyAnswer(survey_id: number, payload): Observable<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(TklabService.config.TKLAB_GET_APP_SURVEY + '/' + survey_id + '/answer', payload);
  }
}
