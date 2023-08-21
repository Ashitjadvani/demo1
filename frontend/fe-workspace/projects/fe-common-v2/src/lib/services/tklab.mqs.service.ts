import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../../../../fe-insights/src/app/features/tklab/store/models';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights/src/environments/environment';


@Injectable()
export class TklabMqsService {
  static config = {
    TKLAB_API_ROOT: environment.api_host + '/v2/tklab',
    TKLAB_SURVEY_API_ROOT: environment.api_host + '/v2/tklab/survey',
    TKLAB_GET_SURVEY_CHOICES: '/v2/tklab/survey/choices',
    TKLAB_GET_APP_SURVEY: '/v2/mqs-quiz/quiz-list',
    TKLAB_GET_APP_SURVEY_CREATE: '/v2/mqs-quiz/quiz-create',
    TKLAB_GET_APP_SURVEY_DELETE: '/v2/mqs-quiz/quiz-delete',
    TKLAB_GET_APP_QUESTION: '/v2/mqs-questions/list',
    TKLAB_GET_APP_QUESTION_CREATE: '/v2/mqs-questions/create',
    TKLAB_GET_APP_QUESTION_DELETE: '/v2/mqs-questions/delete',
    TKLAB_GET_APP_QUIZ_QUESTION: '/v2/mqs-quiz/quiz-question-list',
    TKLAB_GET_APP_QUIZ_QUESTION_CREATE: '/v2/mqs-quiz/quiz-question-create',
    TKLAB_GET_APP_QUIZ_QUESTION_DELETE: '/v2/mqs-quiz/quiz-question-delete',
    TKLAB_GET_APP_METRIC: '/v2/mqs-quiz/metric/list',
    TKLAB_GET_APP_ORDER_NUMBER: '/v2/mqs-quiz/quiz-question-list-order-number',
    TKLAB_GET_APP_METRIC_CREATE: '/v2/mqs-quiz/metric/save',
    TKLAB_GET_APP_METRIC_DELETE: '/v2/mqs-quiz/metric/delete',
    TKLAB_GET_APP_METRIC_ANSWER: '/v2/mqs-quiz/metric-answer/list',
    TKLAB_GET_APP_METRIC_ANSWER_CREATE: '/v2/mqs-quiz/metric-answer/save',
    TKLAB_GET_APP_METRIC_ANSWER_DELETE: '/v2/mqs-quiz/metric-answer/delete',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC: '/v2/mqs-quiz/get/metric',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC_SAVE: '/v2/mqs-quiz/survey-calculation/save',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC_LIST: '/v2/mqs-quiz/survey-calculation/list',
    TKLAB_GET_APP_QUIZ_QUESTION_LIST_SURVEY: '/v2/mqs-quiz/metric/listBySurvey',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC_DELETE: '/v2/mqs-quiz/survey-calculation/delete',
  };

  constructor(private api: ApiService) {
  }

  public loadSurveyChoices(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(TklabMqsService.config.TKLAB_GET_SURVEY_CHOICES);
  }

  /*public loadAppSurvey(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(TklabMqsService.config.TKLAB_GET_APP_SURVEY);
  }*/

  async loadAppSurvey() {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_SURVEY, null).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppSurvey(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_SURVEY_CREATE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppSurveyMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC_SAVE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppSurveyMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC_DELETE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppSurvey(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_SURVEY_DELETE, data).toPromise();
      return {
        result: res.result,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUESTION_CREATE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUESTION_DELETE, data).toPromise();
      return {
        result: res.result,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuestion() {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUESTION, null).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppQuizQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_CREATE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuizQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuizMetricList(data:any) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC_LIST, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadlistBySurvey(data:any) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_LIST_SURVEY, data).toPromise();
      return {
        meta: res.meta,
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuizMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppQuizQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_DELETE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadOrderNumber(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_ORDER_NUMBER, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  public loadAppSurveyQuestion(survey_id): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(TklabMqsService.config.TKLAB_GET_APP_SURVEY + '/' + survey_id);
  }

  public sendSurveyAnswer(survey_id: number, payload): Observable<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(TklabMqsService.config.TKLAB_GET_APP_SURVEY + '/' + survey_id + '/answer', payload);
  }

  async saveAppMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_CREATE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppMetric() {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC, null).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_DELETE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppMetricAnswer(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_ANSWER_CREATE, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppMetricAnswer(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_ANSWER, data).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppMetricAnswer(data) {
    try {
      var params = {
        id : data
      }
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_ANSWER_DELETE, params).toPromise();
      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

}
