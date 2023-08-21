export enum NEWS_ACTION_TYPE {
  READ = 'Read',
  CONFIRM = 'Confirm'
};

export class RecruitingOpeningDocument {
    id: string;
    area: string;
    shortDescription: string;
    description: string;
    successMessage: string;
    start: string;
    end: string;
    site: string;
    type: string;
    quiz: string;
    customFields: any;
    mandatoryFields: any;

    static Empty(): RecruitingOpeningDocument {
        let document: RecruitingOpeningDocument = new RecruitingOpeningDocument();
        document.area = '';
        document.shortDescription = '';
        document.description = '1';
        document.successMessage = '';
        document.start = '';
        document.end = '';
        document.site = '';
        document.type = '';
        document.quiz = '';
        document.customFields = [];
        document.mandatoryFields = [];
        return document;
    }
}
