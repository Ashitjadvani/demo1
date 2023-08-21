import {EntityDataModuleConfig, EntityMetadataMap} from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
	Question: {},
	Survey: {},
	AnswerSideEffect: {},
	Metric: {},
	SurveyQuestion: {},
	Condition: {},
};


export const pluralNames = {
	Question: 'question',
	Survey: 'survey',
	AnswerSideEffect: 'answersideeffect',
	Metric: 'metric',
	SurveyQuestion: 'surveyquestion',
	Condition: 'condition'
};


export const entityConfig: EntityDataModuleConfig = {
	entityMetadata,
	pluralNames
};
