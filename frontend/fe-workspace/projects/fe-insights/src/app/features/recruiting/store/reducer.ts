import {ActionReducerMap, createFeatureSelector, createReducer, on} from '@ngrx/store';
import {Dashboard, IState} from '../../../../../../fe-common/src/lib/models/recruiting/models';
import {
  loadChoiceListSuccess, loadDashboardSuccess, loadJobApplicationDetailSuccess,
  loadJobOpeningDetailSuccess,
  loadMandatoryFieldsSuccess,
  loadPersonDetailSuccess
} from './actions';


export const STORE_FEATURE = 'recruiting';

export let initialState: IState = {
  choices: null,
  currentPerson: null,
  currentJobOpening: null,
  currentJobApplication: null,
  mandatoryFields: [],
  dashboard: new Dashboard()
};

export const recruitingReducer = createReducer(
  initialState,
  on(loadChoiceListSuccess, (state, {payload}) => ({
    ...state,
    choices: payload.data
  })),
  on(loadPersonDetailSuccess, (state, {payload}) => ({
    ...state,
    currentPerson: payload.person
  })),
  on(loadJobOpeningDetailSuccess, (state, {payload}) => ({
    ...state,
    currentJobOpening: payload.detail
  })),
  on(loadMandatoryFieldsSuccess, (state, {payload}) => ({
    ...state,
    mandatoryFields: payload.detail
  })),
  on(loadJobApplicationDetailSuccess, (state, {payload}) => ({
    ...state,
    currentJobApplication: payload.detail
  })),
  on(loadDashboardSuccess, (state, {payload}) => ({
    ...state,
    dashboard: payload.data
  })),


);

export const selectRecruitingState = createFeatureSelector(STORE_FEATURE);
export const selectEntityState = createFeatureSelector('entityCache');


