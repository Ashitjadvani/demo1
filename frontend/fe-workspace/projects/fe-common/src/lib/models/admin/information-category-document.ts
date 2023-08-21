export class TitleLanguage {
    lang: string;
    title: string;

    constructor(lang: string, title:string) {
        this.lang = lang;
        this.title = title;
    }
}

export class CategoryDocument {
    id: string;
    titleLanguages: TitleLanguage[];
    tileBackgroundColor: string;
    textColor: string;
    icon: string;


    static Empty(): CategoryDocument {
        let category: CategoryDocument = new CategoryDocument();
        
        category.titleLanguages = [];
        category.tileBackgroundColor = '#D96B8B';
        category.textColor = '#FFFFFF';
        category.icon = 'information-outline.svg';

        return category;
    }
}