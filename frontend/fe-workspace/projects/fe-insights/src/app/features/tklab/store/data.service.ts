import {Injectable} from '@angular/core';
import {AnswerSideEffect, Condition, Metric, Question, Survey, SurveyQuestion} from './models';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';

@Injectable()
export class SurveyService extends EntityCollectionServiceBase<Survey>{
	constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
		super('Survey', serviceElementsFactory);
	}
}

@Injectable()
export class QuestionService extends EntityCollectionServiceBase<Question>{
	constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
		super('Question', serviceElementsFactory);
	}
}

@Injectable()
export class SurveyQuestionService extends EntityCollectionServiceBase<SurveyQuestion>{
	constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
		super('SurveyQuestion', serviceElementsFactory);
	}
}

@Injectable()
export class AnswerSideEffectService extends EntityCollectionServiceBase<AnswerSideEffect>{
	constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
		super('AnswerSideEffect', serviceElementsFactory);
	}
}

@Injectable()
export class MetricService extends EntityCollectionServiceBase<Metric>{
	constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
		super('Metric', serviceElementsFactory);
	}
}

@Injectable()
export class ConditionService extends EntityCollectionServiceBase<Condition>{
	constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
		super('Condition', serviceElementsFactory);
	}
}
