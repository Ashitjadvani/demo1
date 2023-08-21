import {BaseResponse} from '../../../../../../fe-common/src/lib/services/base-response';


export class ApiResponse<T> extends BaseResponse {
  data: T[];
}

export class IState {
  choices: [string: any[]];
}

export enum CRUDMode {
  ADD = '[CRUDMode] add',
  EDIT = '[CRUDMode] edit',
  VIEW = '[CRUDMode] view',
  DELETE = '[CRUDMode] delete'
}

export enum QuestionType {
  SINGLE_LIST = 'SingleList',
  SINGLE_RADIO = 'SingleRadio',
  MULTIPLE_LIST = 'MultipleList',
  SINGLE_CHECK = 'SingleCheck',
  MULTIPLE_CHECK = 'MultipleCheck',
  FREE_TEXT = 'FreeText',
  FREE_TEXTAREA = 'FreeTextArea',
  FREE_NUMBER = 'FreeNumber',
  DATE = 'Date',
  STATIC_PAGE = 'StaticPage',
}

export class Survey {
  id: any;
  title: string;
  subTitle: string;
  disclaimer: string;
  on_complete: string;
  startDate: string;
  endDate: string;
  privacy: string;
}


export class Question {
  id: any;
  question: string;
  subtitle: string;
  content: string;
  mandatory: boolean;
  type: string;
  widget: string;
  numeric_range_min: number;
  numeric_range_max: number;
  numeric_step: number;
  answers: Answer[] = [];
}

export class SurveyQuestion {
  id: number;
  survey: number;
  question: Question;
  question_label: string;
  order: number;
  condition: any[];
}

export class Answer {
  id: number;
  value: any;
  order: number;
  question_id: number;
}


export class AnswerSideEffect {
  id: number;
  answer: number;
  effect: string;
  var_name: string;
  val_txt: string;
  val_numeric: number;
  val_bool: boolean;
  scope: string;
  metric: number;

  constructor(answer_id: number) {
    this.id = null;
    this.answer = answer_id;
    this.effect = null;
    this.var_name = '';
    this.val_txt = '';
    this.val_numeric = null;
    this.val_bool = false;
    this.scope = '';
    this.metric = null;
  }
}

export class Metric {
  id: number;
  code: string;
  description: string;
  type: string;
  aggregation_strategy: string;
}


export enum MetricType {
  FLAG = 'flag',
  TEXT = 'text',
  NUMERIC = 'numeric'
}

export enum MetricAggregationStrategy {
  NOOP = 'noop',  // no operation
  AVG = 'avg',    // average
  ACC = 'acc',    // accumulation
}


export class Condition {
  constructor(
    public survey_question_id: number = null,
    public code: string = '',
    public descripition: string = '',
    public metric: number = null,
    public action: string = '',
    public operator: string = '',
    public value: any = null,
  ) {}
}
