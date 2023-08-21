import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../../../../fe-insights/src/app/features/tklab/store/models';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights/src/environments/environment';


@Injectable()
export class TklabMqsService {
  static config = {
    TKLAB_API_ROOT: environment.api_host + '/v1/tklab',
    TKLAB_SURVEY_API_ROOT: environment.api_host + '/v1/tklab/survey',
    TKLAB_GET_SURVEY_CHOICES: '/v1/tklab/survey/choices',
    TKLAB_GET_APP_SURVEY: '/v1/mqs-quiz/quiz-list',
    TKLAB_GET_APP_SURVEY_CREATE: '/v1/mqs-quiz/quiz-create',
    TKLAB_GET_APP_SURVEY_DELETE: '/v1/mqs-quiz/quiz-delete',
    TKLAB_GET_APP_QUESTION: '/v1/mqs-questions/list',
    TKLAB_GET_APP_QUESTION_CREATE: '/v1/mqs-questions/create',
    TKLAB_GET_APP_QUESTION_DELETE: '/v1/mqs-questions/delete',
    TKLAB_GET_APP_QUIZ_QUESTION: '/v1/mqs-quiz/quiz-question-list',
    TKLAB_GET_APP_QUIZ_QUESTION_CREATE: '/v1/mqs-quiz/quiz-question-create',
    TKLAB_GET_APP_QUIZ_QUESTION_DELETE: '/v1/mqs-quiz/quiz-question-delete',
    TKLAB_GET_APP_METRIC: '/v1/mqs-quiz/metric/list',
    TKLAB_GET_APP_ORDER_NUMBER: '/v1/mqs-quiz/quiz-question-list-order-number',
    TKLAB_GET_APP_METRIC_CREATE: '/v1/mqs-quiz/metric/save',
    TKLAB_GET_APP_METRIC_DELETE: '/v1/mqs-quiz/metric/delete',
    TKLAB_GET_APP_METRIC_ANSWER: '/v1/mqs-quiz/metric-answer/list',
    TKLAB_GET_APP_METRIC_ANSWER_CREATE: '/v1/mqs-quiz/metric-answer/save',
    TKLAB_GET_APP_METRIC_ANSWER_DELETE: '/v1/mqs-quiz/metric-answer/delete',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC: '/v1/mqs-quiz/get/metric',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC_SAVE: '/v1/mqs-quiz/survey-calculation/save',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC_LIST: '/v1/mqs-quiz/survey-calculation/list',
    TKLAB_GET_APP_QUIZ_QUESTION_METRIC_DELETE: '/v1/mqs-quiz/survey-calculation/delete',
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
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppSurvey(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_SURVEY_CREATE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppSurveyMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC_SAVE, data).toPromise();
      console.log("save metric: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppSurveyMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC_DELETE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppSurvey(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_SURVEY_DELETE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.result,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
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
      console.log('UserManagementService.login: exception - ', ex);
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
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuestion() {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUESTION, null).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppQuizQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_CREATE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuizQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuizMetricList(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC_LIST, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppQuizMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_METRIC, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppQuizQuestion(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_QUIZ_QUESTION_DELETE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
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
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppMetric() {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC, null).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadOrderNumber(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_ORDER_NUMBER, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppMetric(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_DELETE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async saveAppMetricAnswer(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_ANSWER_CREATE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async loadAppMetricAnswer(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_ANSWER, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

  async deleteAppMetricAnswer(data) {
    try {
      let res = await this.api.post<any>(TklabMqsService.config.TKLAB_GET_APP_METRIC_ANSWER_DELETE, data).toPromise();
      console.log("UserManagementService.login: result - ", res);

      return {
        result: res.data,
        reason: res.reason
      };
    } catch (ex) {
      console.log('UserManagementService.login: exception - ', ex);
      return {
        result: false,
        reason: 'Internal error'
      };
    }
  }

}
