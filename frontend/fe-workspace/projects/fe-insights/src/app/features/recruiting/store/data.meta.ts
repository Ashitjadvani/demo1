import {EntityDataModuleConfig, EntityMetadataMap} from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  JobOpening: {},
  JobApplication: {},
  Laurea: {},
  Person: {},
  Universita: {},
  CustomField: {}
};


export const pluralNames = {
  JobOpening: 'jobopening',
  JobApplication: 'jobapplication',
  Laurea: 'laurea',
  Person: 'person',
  Universita: 'universita',
  CustomField: 'customfield'
};


export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};
