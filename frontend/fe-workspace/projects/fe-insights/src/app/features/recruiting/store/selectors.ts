import {createSelector} from '@ngrx/store';
import {IState} from '../../../../../../fe-common/src/lib/models/recruiting/models';
import {selectEntityState, selectRecruitingState} from './reducer';


export const selectChoices = () => createSelector(
  selectRecruitingState,
  (state: IState) => {
    return state.choices;
  }
);

export const selectCurrentPerson = () => createSelector(
  selectRecruitingState,
  (state: IState) => {
    return state.currentPerson;
  }
);


export const selectCurrentJobOpening = () => createSelector(
  selectRecruitingState,
  (state: IState) => {
    return state.currentJobOpening;
  }
);

export const selectCurrentJobApplication = () => createSelector(
  selectRecruitingState,
  (state: IState) => {
    return state.currentJobApplication;
  }
);

export const selectMandatoryFields = () => createSelector(
  selectRecruitingState,
  (state: IState) => {
    return state.mandatoryFields;
  }
);

export const selectDashboard = () => createSelector(
  selectRecruitingState,
  (state: IState) => {
    return state.dashboard;
  }
);

export const selectEntityStore = (entityName: string) => createSelector(
  selectEntityState,
  (entityState) => entityState[entityName]
);

