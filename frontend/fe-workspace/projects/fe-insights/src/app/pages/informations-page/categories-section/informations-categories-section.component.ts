import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { CategoryDocument } from 'projects/fe-common/src/lib/models/admin/information-category-document';
import { InformationDocument } from 'projects/fe-common/src/lib/models/admin/information-document';
import { InfoManagementService } from 'projects/fe-common/src/lib/services/info-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { TitleLanguage } from 'projects/fe-common/src/lib/models/admin/information-category-document';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-informations-categories-section',
    templateUrl: './informations-categories-section.component.html',
    styleUrls: ['./informations-categories-section.component.scss']
})
export class InformationsCategoriesSectionComponent implements OnInit {
    @ViewChild('icon', { static: false }) iconFile: ElementRef;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;


    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INFORMATION_PAGE.Category Title'), columnName: 'Title', columnDataField: 'titleLanguages', columnFormatter: 'titleLanguagesFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: this.translate.instant('INFORMATION_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifyCategory', context: this },
        { tooltip: this.translate.instant('INFORMATION_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteCategory', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INFORMATION_PAGE.New Information'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddCategory', context: this }
    ]

    attachmentIcon: any;
    informationsTableData: InformationDocument[];
    categoriesTableData: CategoryDocument[];
    titleCard: string;
    currentCategory: CategoryDocument = CategoryDocument.Empty();
    images: string[];
    languageSelected: string;
    currentIcon: string;
    titles: TitleLanguage[] = new Array();
    availableLanguages: {"id":string, "desc":string}[] = new Array();
    currentTitle: string;
    safeSvg: any;
    iconColor = "#ffffff";
    selectedImage: string;
    iconUploaded = false;
    iconUploadedVal: string;
    safeSvgUploaded: any;
    langTabIndex: any;

    constructor(private infoManagementService: InfoManagementService,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService,
        private sanitizer: DomSanitizer,
        private httpClient: HttpClient) { }

    ngOnInit() {
        this.images = new Array();
        this.images.push("information-outline-white.svg");
        this.images.push("paperclip-white.svg");
        this.images.push("file-pdf-white.svg");
        this.images.push("video-white.svg");
        this.images.push("audio-white.svg");
        this.images.push("picture-white.svg");
        this.selectedImage = this.images[0];
        this.readLanguages();
        this.loadCategories();
    }

    async loadCategories() {
        this.categoriesTableData = await this.infoManagementService.getCategoriesList();
    }


    async onAddCategory() {
        await this.loadCategories();
        this.titleCard = this.translate.instant('INFORMATION_PAGE.Add Category');
        this.currentCategory = CategoryDocument.Empty();
        this.iconColor="#ffffff";
        this.langTabIndex=0;
        this.languageSelected=this.availableLanguages[0].id;
        this.httpClient.get('./assets/images/information-outline-white.svg', { responseType: 'text' })
        .subscribe(data => {
            this.currentIcon=data;
            this.changeSvgSize();
            this.changeSvgFill();
        });
        this.readLanguages();
        this.tabgroup.selectedIndex = 1;
    }

    onModifyCategory(category: CategoryDocument) {
        this.titleCard = this.translate.instant('INFORMATION_PAGE.Modify Category');
        this.currentCategory = category;
        this.langTabIndex=0;
        this.languageSelected=this.availableLanguages[0].id;
        this.tabgroup.selectedIndex = 1;
        this.selectedImage = "";
        this.readLanguages();
        this.titles = category.titleLanguages;
        this.currentTitle = this.titles[0].title;
        this.currentIcon = category.icon;
        this.readIconColor();
        this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    }

    readLanguages()
    {
        this.availableLanguages = new Array();
        this.titles = new Array();
        this.availableLanguages[0]={id:"en",desc:"English"};
        this.availableLanguages[1]={id:"it",desc:"Italiano"};
        this.availableLanguages[2]={id:"es",desc:"Español"};
        this.availableLanguages[3]={id:"fr",desc:"Français"};
        this.languageSelected = this.availableLanguages[0].id;
        for(let lang of this.availableLanguages)
        {
            this.titles.push(new TitleLanguage(lang.id,""));
        }
        this.currentTitle = this.titles[0].title;
    }

    async onDeleteCategory(category: CategoryDocument) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteAlert'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            this.informationsTableData = await this.infoManagementService.getInformationsList();
            for(let info of this.informationsTableData)
            {
                if(info.category==category.id)
                {
                    info.category = "";
                    await this.infoManagementService.uploadDocument(null, info).subscribe();
                }
            }
            this.informationsTableData = await this.infoManagementService.getInformationsList();
            let res = await this.infoManagementService.deleteCategory(category.id);
            if (res.result)
                await this.loadCategories();
            else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.message, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onUploadIcon(e) {
        this.attachmentIcon = this.iconFile.nativeElement.files[0];
        let reader = new FileReader();
        var that = this;
        reader.onloadend = await function(event) {
            const fileText = reader.result;
            that.iconUploadedVal = fileText.toString();
            that.modifyIconUploaded();
        }
        reader.readAsText(this.attachmentIcon);
    }


    isConfirmEnabled() {
        return this.titles.length>0
            && this.commonService.isValidField(this.currentCategory.icon);
    }

    onCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onConfirmClick() {
        this.currentCategory.titleLanguages = this.titles;
        let res = await this.infoManagementService.createOrUpdateCategory(this.currentCategory);
        if (res.result) {
            await this.loadCategories();
            this.tabgroup.selectedIndex = 0;
        }
        else
        {
            this.snackBar.open(this.translate.instant('GENERAL.ERROR'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }

    }

    onImageClick(url: string) {
        this.selectedImage = url;
        let path = './assets/images/'+url;
        this.httpClient.get(path, { responseType: 'text' })
        .subscribe(data => {
            this.currentIcon=data;
            this.changeSvgSize();
            this.changeSvgFill();

        });

    }

    onUploadedClick() {
        this.selectedImage = "uploaded";
        this.currentIcon=this.iconUploadedVal;
        this.changeSvgSize();
        this.changeSvgFill();
    }

    onIconAttachment()
    {
        if (this.iconFile.nativeElement.files.length > 0) {
            this.iconFile.nativeElement.value = '';
        }
        this.iconFile.nativeElement.click();
    }

    onTitleChange()
    {
        let id=0;
        for(let title of this.titles)
        {
            if(title.lang==this.languageSelected)    {
                this.titles[id].title=this.currentTitle;
            }
            id++;
        }
    }

    onLanguageChange()
    {
        this.languageSelected = this.availableLanguages[this.langTabIndex].id;
        for(let title of this.titles)
        {
            if(title.lang==this.languageSelected){
                this.currentTitle=title.title;
                break;
            }
        }
    }

    titleLanguagesFormatter(titleLang: TitleLanguage[])
    {
        return titleLang[0].title;
    }

    changeSvgSize()
    {
        let widthIndexStart = this.currentIcon.indexOf('width="');
        let widthIndexEnd = this.currentIcon.indexOf('"',widthIndexStart+7)+1;
        let heightIndexStart = this.currentIcon.indexOf('height="');
        let heightIndexEnd = this.currentIcon.indexOf('"',heightIndexStart+8)+1;
        let viewBoxIndex = this.currentIcon.indexOf('viewBox=');

        let widthReaded = this.currentIcon.substring(widthIndexStart,widthIndexEnd);
        let heightReaded = this.currentIcon.substring(heightIndexStart,heightIndexEnd);

        this.currentIcon = this.currentIcon.replace(widthReaded,'width="70"');
        this.currentIcon = this.currentIcon.replace(heightReaded,'height="70"');
        if(viewBoxIndex<0)
        {
            this.currentIcon = this.currentIcon.replace('height="70"','height="70" viewBox="0 0 24 24"');
        }
        this.currentCategory.icon = this.currentIcon;
        this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    }

    changeSvgFill() {
        let fillIndexStart = this.currentIcon.indexOf('fill="');
        let fillIndexEnd = this.currentIcon.indexOf('"',fillIndexStart+6)+1;
        if(fillIndexStart<0)
        {
            fillIndexStart = this.currentIcon.indexOf("fill='");
            fillIndexEnd = this.currentIcon.indexOf("'",fillIndexStart+6)+1;
        }
        let fillReaded = this.currentIcon.substring(fillIndexStart,fillIndexEnd);
        this.currentIcon = this.currentIcon.replace(fillReaded,'fill="'+this.iconColor+'"');
        this.currentCategory.icon = this.currentIcon;
        this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    }

    onIconColorChange(event) {
        this.changeSvgFill();
    }

    readIconColor() {
        let fillIndexStart = this.currentIcon.indexOf('fill="');
        let fillIndexEnd = this.currentIcon.indexOf('"',fillIndexStart+6)+1;
        this.iconColor = this.currentIcon.substring(fillIndexStart+6,fillIndexEnd-1);
    }


    modifyIconUploaded() {
        let widthIndexStart = this.iconUploadedVal.indexOf('width="');
        let widthIndexEnd = this.iconUploadedVal.indexOf('"',widthIndexStart+7)+1;
        let heightIndexStart = this.iconUploadedVal.indexOf('height="');
        let heightIndexEnd = this.iconUploadedVal.indexOf('"',heightIndexStart+8)+1;
        let viewBoxIndex = this.iconUploadedVal.indexOf('viewBox=');

        let widthReaded = this.iconUploadedVal.substring(widthIndexStart,widthIndexEnd);
        let heightReaded = this.iconUploadedVal.substring(heightIndexStart,heightIndexEnd);

        this.iconUploadedVal = this.iconUploadedVal.replace(widthReaded,'width="40"');
        this.iconUploadedVal = this.iconUploadedVal.replace(heightReaded,'height="36"');
        if(viewBoxIndex<0)
        {
            this.iconUploadedVal = this.iconUploadedVal.replace('height="36"','height="36" viewBox="0 0 24 24"');
        }

        let fillIndexStart = this.iconUploadedVal.indexOf('fill="');
        let fillIndexEnd = this.iconUploadedVal.indexOf('"',fillIndexStart+6)+1;
        if(fillIndexStart<0)
        {
            fillIndexStart = this.iconUploadedVal.indexOf("fill='");
            fillIndexEnd = this.iconUploadedVal.indexOf("'",fillIndexStart+6)+1;
        }
        if(fillIndexStart<0)
        {
            this.iconUploadedVal = this.iconUploadedVal.replace('height="36"','height="36" fill="#ffffff"');
        }
        else
        {
            let fillReaded = this.iconUploadedVal.substring(fillIndexStart,fillIndexEnd);
            this.iconUploadedVal = this.iconUploadedVal.replace(fillReaded,'fill="#ffffff"');
        }

        this.safeSvgUploaded = this.sanitizer.bypassSecurityTrustHtml(this.iconUploadedVal);

        this.iconUploaded = true;
    }

}
