import {Injectable} from '@angular/core';

import {Actions, createEffect, Effect, ofType, OnInitEffects} from '@ngrx/effects';
import {map, tap} from 'rxjs/operators';
import {RecruitingService} from '../../../../../../fe-common/src/lib/services/recruiting.service';
import {Action, Store} from '@ngrx/store';
import {IState} from '../../../../../../fe-common/src/lib/models/recruiting/models';
import {
  loadChoiceList,
  loadChoiceListSuccess, loadDashboard, loadDashboardSuccess, loadJobApplicationDetail, loadJobApplicationDetailSuccess,
  loadJobOpeningDetail,
  loadJobOpeningDetailSuccess,
  loadMandatoryFields,
  loadMandatoryFieldsSuccess,
  loadPersonDetail,
  loadPersonDetailSuccess,
  RecruitingActionTypes
} from './actions';
import {ApiResponse} from '../../../../../../fe-common/src/lib/models/api/api-response';
import {Person} from '../../../../../../fe-common/src/lib/models/recruiting/models';

@Injectable()
export class RecruitingEffects implements OnInitEffects {

  choicesLoad$ = createEffect(
    () => this.actions$.pipe(
      ofType(loadChoiceList),
      tap(action => {
        this.service.loadChoices().subscribe(data => {
          this.store.dispatch(loadChoiceListSuccess({payload: {data}}));
        });
      })
    ),
    {
      dispatch: false
    }
  );

  loadPersonDetail$ = createEffect(
    () => this.actions$.pipe(
      ofType(loadPersonDetail),
      tap(action => {
        this.service.loadPersonDetail(action.payload.pk).subscribe(person => {
          this.store.dispatch(loadPersonDetailSuccess({payload: {person}}));
        });
      })
    ), {
      dispatch: false
    }
  );

  loadJobOpeningDetail$ = createEffect(() => this.actions$.pipe(
    ofType(loadJobOpeningDetail),
    tap(action => {
      this.service.loadJobOpeningDetail(action.payload.pk).subscribe(detail => {
        this.store.dispatch(loadJobOpeningDetailSuccess({payload: {detail}}));
      });
    })
  ), {dispatch: false});

  loadJobApplicationDetail$ = createEffect(() => this.actions$.pipe(
    ofType(loadJobApplicationDetail),
    tap(action => {
      this.service.loadJobApplicationDetail(action.payload.pk).subscribe(detail => {
        this.store.dispatch(loadJobApplicationDetailSuccess({payload: {detail}}));
      });
    })
  ), {dispatch: false});

  loadMandatoryFields$ = createEffect(() => this.actions$.pipe(
    ofType(loadMandatoryFields),
    tap(action => {
      this.service.loadMandatoryFields().subscribe(fields => {
        this.store.dispatch(loadMandatoryFieldsSuccess({payload: {detail: fields}}));
      });
    })
  ), {dispatch: false});

  loadDashboard$ = createEffect( () => this.actions$.pipe(
    ofType(loadDashboard),
    tap( action => {
      this.service.loadDashboard().subscribe( data => {
        this.store.dispatch(loadDashboardSuccess({payload: {data}}));
      });
    })
    ),
    {dispatch: false});

  ngrxOnInitEffects(): Action {
    return {type: RecruitingActionTypes.LoadChoices};
  }

  constructor(
    private actions$: Actions,
    private service: RecruitingService,
    private store: Store<IState>
  ) {
  }
}
