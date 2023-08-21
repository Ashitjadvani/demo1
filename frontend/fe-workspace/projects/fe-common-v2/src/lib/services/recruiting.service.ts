import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {ApiResponse} from '../models/api/api-response';
import {Observable} from 'rxjs';
import {environment} from '../../../../fe-insights/src/environments/environment';
import {MandatoryField} from '../models/recruiting/models';


@Injectable()
export class RecruitingService {
  static config = {
    RECRUITING_API_ROOT: environment.api_host + '/v1/recruiting',
    RECRUITING_DASHBOARD: '/v1/recruiting/dashboard',
    RECRUITING_GET_CHOICES: '/v1/recruiting/choices',
    RECRUITING_JOB_OPENING: '/v1/recruiting/jobopening',
    RECRUITING_JOB_APPLICATION: '/v1/recruiting/jobapplication',
    RECRUITING_MANDATORY_FIELDS: '/v1/recruiting/jobopening/mandatory_fields',
    RECRUITING_PERSON: '/v1/recruiting/person'
  };

  constructor(private api: ApiService) {
  }

  public loadChoices(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(RecruitingService.config.RECRUITING_GET_CHOICES);
  }

  public loadPerson(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>(RecruitingService.config.RECRUITING_PERSON);
  }

  public downloadCv(id: number): Observable<any> {
    return this.api.get<any>(RecruitingService.config.RECRUITING_PERSON + '/' + id + '/cv', {responseType: 'arraybuffer'});
  }

  public loadPersonDetail(pk: number): Observable<any> {
    return this.api.get<any>(RecruitingService.config.RECRUITING_PERSON + '/' + pk);
  }

  public loadJobOpeningDetail(pk: number): Observable<any> {
    return this.api.get<any>(RecruitingService.config.RECRUITING_JOB_OPENING + '/' + pk);
  }

  public loadJobApplicationDetail(pk: number): Observable<any> {
    return this.api.get<any>(RecruitingService.config.RECRUITING_JOB_APPLICATION + '/' + pk);
  }

  public loadMandatoryFields(): Observable<any> {
    return this.api.get<any>(RecruitingService.config.RECRUITING_MANDATORY_FIELDS)
  }

  public setApplicationStatus(rec: any): Observable<any> {
    return this.api.post<any>(RecruitingService.config.RECRUITING_JOB_APPLICATION + '/' + rec.id + '/set_status', rec);
  }

  public loadDashboard(): Observable<any> {
    return this.api.get<any>(RecruitingService.config.RECRUITING_DASHBOARD);
  }
}


