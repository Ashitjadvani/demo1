import {Injectable} from '@angular/core';

import {Actions, createEffect, Effect, ofType, OnInitEffects} from '@ngrx/effects';
import {map, tap} from 'rxjs/operators';
import {TklabService} from '../../../../../../fe-common/src/lib/services/tklab.service';
import {Action, Store} from '@ngrx/store';
import {IState} from './models';
import {loadChoiceList, loadChoiceListSuccess, TklabActionTypes} from './actions';

@Injectable()
export class TklabEffects implements OnInitEffects {

  choicesLoad$ = createEffect(
    () => this.actions$.pipe(
      ofType(loadChoiceList),
      tap(action => {
        this.service.loadSurveyChoices().subscribe(data => {
          this.store.dispatch(loadChoiceListSuccess({payload: {data}}));
        });
      })
    ),
    {
      dispatch: false
    }
  );

  ngrxOnInitEffects(): Action {
    return {type: TklabActionTypes.LoadChoices};
  }

  constructor(
    private actions$: Actions,
    private service: TklabService,
    private store: Store<IState>
  ) {
  }
}
