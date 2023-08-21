import {Action, createAction, props} from '@ngrx/store';


export enum TklabActionTypes {
	LoadChoices = '[TKLAB SURVEY] Load choices',
	LoadChoicesSuccess = '[TKLAB SURVEY] Load choices success',
}


export const loadChoiceList = createAction(TklabActionTypes.LoadChoices);
export const loadChoiceListSuccess = createAction(
	TklabActionTypes.LoadChoicesSuccess,
	props<{ payload: { data: any }}>()
);


