export const AGOS_AND_YOU_SURVEY = 'AgosAndYou';

// Survey models
//
export enum SurveyItemType {
    SingleList = 'SingleList',
    SingleRadio = 'SingleRadio',
    MultipleList = 'MultipleList',
    MultipleCheck = 'MultipleCheck',
    FreeText = 'FreeText',
    FreeTextNumber = 'FreeTextNumber'
}

export class SurveyAnswer {
    id: string;
    value: string;

    constructor(id: string, value: string) {
        this.id = id;
        this.value = value;
    }
}

export class SurveyResultItem {
    aId: string;
    aTitle: string;
    aCount: number;
    aValues: string[];
}

export class AnswerResult {
    qId: string;
    qTitle: string;
    qType: SurveyItemType; 
    qResult: any | SurveyResultItem[];
}

export class SurveyResults {
    userCount: number;
    responseCount: number;
    incompleteCount: number;
    answerResult: AnswerResult[];

    constructor() {
        this.answerResult = [];
    }
}

export class SurveyItem {
    id: string;
    question: string;
    mandatory: boolean;
    answers: SurveyAnswer[];
    type: SurveyItemType;

    constructor(id: string, question: string, mandatory: boolean, type: SurveyItemType, ...answers) {
        this.id = id;
        this.question = question;
        this.mandatory =  mandatory;
        this.type = type;
        this.answers = answers;
    }
}

export class Survey {
    surveyId: string;
    title: string;
    subTitle: string;
    disclaimer: string;
    startDate: string;
    endDate: string;
    items: SurveyItem[];
    results: SurveyResults;
    createdAt: Date;

    constructor() {
        this.items = [];
        this.results = new SurveyResults();    
    }
}

// User statistics
//
export class SurveyUserItem {
    userId: string;
    startedAt: string;
    completedAt: string;
}

export class SurveyUserStat {
    surveyId: string;
    users: SurveyUserItem[];
}

// User answers
//
export class SurveyUserAnswer {
    questionId: string;
    value: string;

    constructor(questionId: string, value: string) {
        this.questionId = questionId;
        this.value = value;
    }
}

export class SurveyUserData {
    surveyId: string;
    answers: SurveyUserAnswer[];

    constructor(surveyId: string) {
        this.surveyId = surveyId;
        this.answers = [];
    }
}
