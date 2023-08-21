import {Injectable} from '@angular/core';
import {
  EntityCollectionReducerMethods,
  EntityDefinition,
  EntityCollection,
  EntityAction,
  EntityDefinitionService,
  EntityCollectionReducerMethodMap
} from '@ngrx/data';

@Injectable()
export class AdditionalEntityCollectionReducerMethods<T> extends EntityCollectionReducerMethods<T> {
  constructor(public entityName: string, public definition: EntityDefinition<T>) {
    super(entityName, definition);
  }

  protected queryManySuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T> {
    const ec = super.queryManySuccess(collection, action);
    if ((action.payload as any).count) {
      // save the foo count from action.payload to entityCollection instance
      (ec as any).count = (action.payload as any).count;
    }
    return ec;
  }
}

@Injectable()
export class AdditionalEntityCollectionReducerMethodsFactory {
  constructor(private entityDefinitionService: EntityDefinitionService) {
  }

  /** Create the  {EntityCollectionReducerMethods} for the named entity type */
  create<T>(entityName: string): EntityCollectionReducerMethodMap<T> {
    const definition = this.entityDefinitionService.getDefinition<T>(entityName);
    const methodsClass = new AdditionalEntityCollectionReducerMethods(entityName, definition);
    return methodsClass.methods;
  }
}
