import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {
  CustomField,
  JobApplication,
  JobOpening,
  Laurea,
  Person,
  Universita
} from '../../../../../../fe-common/src/lib/models/recruiting/models';


@Injectable()
export class PersonService extends EntityCollectionServiceBase<Person>{
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Person', serviceElementsFactory);
  }
}

@Injectable()
export class JobOpeningService extends EntityCollectionServiceBase<JobOpening>{
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('JobOpening', serviceElementsFactory);
  }
}

@Injectable()
export class LaureaService extends EntityCollectionServiceBase<Laurea>{
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Laurea', serviceElementsFactory);
  }
}

@Injectable()
export class UniversitaService extends EntityCollectionServiceBase<Universita>{
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Universita', serviceElementsFactory);
  }
}


@Injectable()
export class JobApplicationService extends EntityCollectionServiceBase<JobApplication>{
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('JobApplication', serviceElementsFactory);
  }
}

@Injectable()
export class CustomFieldService extends EntityCollectionServiceBase<CustomField>{
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('CustomField', serviceElementsFactory);
  }
}


