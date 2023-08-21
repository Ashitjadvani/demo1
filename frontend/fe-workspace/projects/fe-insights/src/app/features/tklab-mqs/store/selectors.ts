import {createSelector} from '@ngrx/store';
import {IState} from './models';
import {selectTklabState} from './reducer';


export const selectChoices = createSelector(selectTklabState, (state: IState, props) => {
	if (props.choice !== undefined) {
		return state.choices[props.choice];
	}
	return state.choices;
});
