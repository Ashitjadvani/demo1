import {ActionReducerMap, createFeatureSelector, createReducer, on} from '@ngrx/store';
import {IState} from './models';
import {loadChoiceListSuccess} from './actions';


export const STORE_FEATURE = 'tklab';

export let initialState: IState = {
	choices: null
};

export const tklabReducer = createReducer(
	initialState,
	on(loadChoiceListSuccess, (state, {payload}) => ({
			...state,
			choices: payload.data
		}))
);

export const selectTklabState = createFeatureSelector(STORE_FEATURE);


