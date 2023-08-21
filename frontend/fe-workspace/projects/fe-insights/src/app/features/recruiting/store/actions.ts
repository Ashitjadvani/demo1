import {createAction, props} from '@ngrx/store';
import {
  JobApplication,
  JobOpening,
  MandatoryField,
  Person
} from '../../../../../../fe-common/src/lib/models/recruiting/models';


export enum RecruitingActionTypes {
  LoadChoices = '[RECRUITING] Load choices',
  LoadChoicesSuccess = '[RECRUITING] Load choices success',
  LoadPersonDetail = '[RECRUITING] Load person detail',
  LoadPersonDetailSucess = '[RECRUITING] Load person detail success',
  LoadJobOpeningDetail = '[RECRUITING] Load Job Opening detail',
  LoadJobOpeningDetailSuccess = '[RECRUITING] Load Job Opening detail success',
  LoadMandatoryFields = '[RECRUITING] Load Mandatory fields',
  LoadMandatoryFieldsSuccess = '[RECRUITING] Load Mandatory fields success',
  LoadJobApplicationDetail = '[RECRUITING] Load Job Application detail',
  LoadJobApplicationDetailSuccess = '[RECRUITING] Load Job Application detail success',
  LoadDashboard = '[RECRUITING] LoadDashboard',
  LoadDashboardSuccess = '[RECRUITING] LoadDashboard success',
}


export const loadChoiceList = createAction(RecruitingActionTypes.LoadChoices);
export const loadChoiceListSuccess = createAction(
  RecruitingActionTypes.LoadChoicesSuccess,
  props<{ payload: { data: any } }>()
);

export const loadDashboard = createAction(RecruitingActionTypes.LoadDashboard);
export const loadDashboardSuccess = createAction(
  RecruitingActionTypes.LoadDashboardSuccess,
  props<{ payload: { data: any } }>()
);

export const loadPersonDetail = createAction(
  RecruitingActionTypes.LoadPersonDetail,
  props<{ payload: { pk: number } }>()
);

export const loadPersonDetailSuccess = createAction(
  RecruitingActionTypes.LoadPersonDetailSucess,
  props<{ payload: { person: Person } }>()
);

export const loadJobOpeningDetail = createAction(
  RecruitingActionTypes.LoadJobOpeningDetail,
  props<{ payload: { pk: number } }>()
);

export const loadJobOpeningDetailSuccess = createAction(
  RecruitingActionTypes.LoadJobOpeningDetailSuccess,
  props<{ payload: { detail: JobOpening } }>()
);

export const loadMandatoryFields = createAction(RecruitingActionTypes.LoadMandatoryFields);

export const loadMandatoryFieldsSuccess = createAction(
  RecruitingActionTypes.LoadMandatoryFieldsSuccess,
  props<{ payload: { detail: MandatoryField[] } }>()
);

export const loadJobApplicationDetail = createAction(
  RecruitingActionTypes.LoadJobApplicationDetail,
  props<{ payload: { pk: number } }>()
);

export const loadJobApplicationDetailSuccess = createAction(
  RecruitingActionTypes.LoadJobApplicationDetailSuccess,
  props<{ payload: { detail: JobApplication } }>()
);


