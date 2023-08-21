export class TitleLanguage {
    lang: string;
    title: string;

    constructor(lang: string, title: string) {
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
    iconBackgroundColor: string;
    iconName: string;


    static Empty(): CategoryDocument {
        let category: CategoryDocument = new CategoryDocument();

        category.titleLanguages = [];
        category.tileBackgroundColor = '#D96B8B';
        category.textColor = '#FFFFFF';
        category.icon = 'information-icon.svg';
        category.iconName = 'information-icon.svg';
        category.iconBackgroundColor = '#000000';

        return category;
    }
}
