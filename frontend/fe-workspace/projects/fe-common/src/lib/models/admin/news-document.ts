export enum NEWS_ACTION_TYPE {
    READ = 'Read',
    CONFIRM = 'Confirm'
};

export class NewsDocument {
    id: string;
    name: string;
    file: string;
    createdAt: Date;
    publicationDate: Date;
    title: string;
    description: string;
    userView: number;
    userConfirmed: number;
    readed: boolean;
    confirmed: boolean;
    showPopup: boolean;
    distributionSites: string[];
    distributionGroups: string[];

    static Empty(): NewsDocument {
        let document: NewsDocument = new NewsDocument();
        
        document.publicationDate = new Date();
        document.name = '';
        document.file = '';
        document.title = '';
        document.description = '';
        document.createdAt = new Date();
        document.userView = 0;
        document.userConfirmed = 0;
        document.distributionSites = ['-1'];
        document.distributionGroups = ['-1'];

        return document;
    }
}