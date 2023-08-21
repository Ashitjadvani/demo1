
export class TitleLanguage {
    lang: string;
    title: string;

    constructor(lang: string, title:string) {
        this.lang = lang;
        this.title = title;
    }
}

export class FileLanguage {
    lang: string;
    file: string;

    constructor(lang: string, file:string) {
        this.lang = lang;
        this.file = file;
    }
}

export class InformationDocument {
    id: string;
    titleLanguages: TitleLanguage[];
    category: string;
    tileBackgroundColor: string;
    textColor: string;
    file: FileLanguage[];
    icon: string;
    isPublic: boolean;

    static Empty(): InformationDocument {
        let information: InformationDocument = new InformationDocument();
        
        information.titleLanguages = [];
        information.category = '';
        information.tileBackgroundColor = '#D96B8B';
        information.textColor = '#FFFFFF';
        information.file = [];
        information.icon = 'information-outline-white.svg';

        return information;
    }
}