import * as recr from './recruiting/store/data.meta';
import * as tklab from './tklab/store/data.meta';
import {EntityDataModuleConfig, EntityMetadataMap} from '@ngrx/data';


const entityMetadata: EntityMetadataMap = {
  ...recr.entityMetadata,
  ...tklab.entityMetadata
};

const pluralNames = {
  ...recr.pluralNames,
  ...tklab.pluralNames
};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};

export const entityByModule = {
  'recruiting': {
    prefix: '/v1/recruiting',
    items: Object.keys(recr.entityMetadata)
  },
  'tklab': {
    prefix: '/v1/tklab/survey',
    items: Object.keys(tklab.entityMetadata)},
}
