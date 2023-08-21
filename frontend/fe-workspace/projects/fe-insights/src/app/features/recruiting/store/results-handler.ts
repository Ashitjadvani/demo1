import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {DefaultPersistenceResultHandler, EntityAction} from '@ngrx/data';

@Injectable()
export class AdditionalPropertyPersistenceResultHandler extends DefaultPersistenceResultHandler {
  handleSuccess(originalAction: EntityAction): (data: any) => Action {
    const actionHandler = super.handleSuccess(originalAction);
    // return a factory to get a data handler to
    // parse data from DataService and save to action.payload
    return function(data: any): any {
      const action = actionHandler.call(this, data);
      if (action && data && data.count) {
        // save the data.count to action.payload.count
        (action as any).payload.count = data.count;
      }
      if (action && data && data.results) {
        // save the data.entities to action.payload.data
        (action as any).payload.data = data.results;
      }
      return action;
    };
  }
}
