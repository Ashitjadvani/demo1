import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { InformationDocument } from 'projects/fe-common/src/lib/models/admin/information-document';
import { CategoryDocument } from 'projects/fe-common/src/lib/models/admin/information-category-document';
import { InfoManagementService } from 'projects/fe-common/src/lib/services/info-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { TitleLanguage } from 'projects/fe-common/src/lib/models/admin/information-document';
import { FileLanguage } from 'projects/fe-common/src/lib/models/admin/information-document';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'projects/fe-insights/src/environments/environment';

class LangAvailable {
    id: string;
    desc: string;
}

@Component({
    selector: 'app-informations-section',
    templateUrl: './informations-section.component.html',
    styleUrls: ['./informations-section.component.scss']
})
export class InformationsSectionComponent implements OnInit {
    @ViewChild('file', { static: false }) file: ElementRef;
    @ViewChild('icon', { static: false }) iconFile: ElementRef;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;


    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INFORMATION_PAGE.Info Title'), columnName: 'Title', columnDataField: 'titleLanguages', columnFormatter: 'titleLanguagesFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INFORMATION_PAGE.Category'), columnName: 'Category', columnDataField: 'category', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INFORMATION_PAGE.File Name'), columnName: 'File Name', columnDataField: 'file', columnFormatter: 'fileLanguagesFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: 'QR code', image: null, icon: 'qr_code_2', color: '#000000', action: 'onPublicQrCodeClick', context: this },
        { tooltip: this.translate.instant('INFORMATION_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifyInfo', context: this },
        { tooltip: this.translate.instant('INFORMATION_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteInfo', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INFORMATION_PAGE.New Information'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddInfo', context: this }
    ]

    attachmentFiles: File[] = new Array();
    infoFiles: FileLanguage[] = new Array();
    attachmentIcon: any;
    attachmentFileName: string;
    informationsTableData: InformationDocument[];
    informationsTableDataDisplay: InformationDocument[];
    categoriesTableData: CategoryDocument[];
    titleCard: string;
    currentInfo: InformationDocument = InformationDocument.Empty();
    currentIcon: string;
    emptyCategory: CategoryDocument = CategoryDocument.Empty();
    userLanguageSelect: string;
    langIt: boolean = false;
    langEn: boolean = false;
    langFr: boolean = false;
    langEs: boolean = false;
    images: string[];
    languageSelected: string;
    titles: TitleLanguage[] = new Array();
    availableLanguages: LangAvailable[] = [];
    currentTitle: string;
    safeSvg: any;
    iconColor = "#ffffff";
    selectedImage: string;
    iconUploaded = false;
    iconUploadedVal: string;
    safeSvgUploaded: any;
    langTabIndex: any;
    publicDocumentQR: string[] = [];
    showQR: boolean;
    qrLevel: string = 'Q';
    currentPublicDocument: InformationDocument;

    constructor(private infoManagementService: InfoManagementService,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService,
        private _settingManager: SettingsManagementService,
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

        this.userLanguageSelect = this._settingManager.getSettingsValue('currentLanguage');
        if (this.userLanguageSelect == "it") this.langIt = true;
        else if (this.userLanguageSelect == "en") this.langEn = true;
        else if (this.userLanguageSelect == "es") this.langEs = true;
        else if (this.userLanguageSelect == "fr") this.langFr = true;
        else this.langEn = true;
        this.emptyCategory.id = "";
        this.emptyCategory.titleLanguages.push(new TitleLanguage("en", "No Category"));
        this.emptyCategory.titleLanguages.push(new TitleLanguage("it", "Nessuna Categoria"));
        this.emptyCategory.titleLanguages.push(new TitleLanguage("es", "No Category"));
        this.emptyCategory.titleLanguages.push(new TitleLanguage("fr", "No Category"));
        this.loadCategories();
        this.loadInformations();
    }

    readLanguages() {
        this.titles = new Array();

        this.availableLanguages = [];
        this.availableLanguages.push({ id: "en", desc: "English" });
        this.availableLanguages.push({ id: "it", desc: "Italiano" });
        this.availableLanguages.push({ id: "es", desc: "Español" });
        this.availableLanguages.push({ id: "fr", desc: "Français" });

        this.languageSelected = this.availableLanguages[0].id;

        for (let lang of this.availableLanguages) {
            this.titles.push(new TitleLanguage(lang.id, ""));
        }
        this.currentTitle = this.titles[0].title;
    }

    async loadInformations() {
        this.informationsTableData = await this.infoManagementService.getInformationsList();
        this.informationsTableDataDisplay = await this.infoManagementService.getInformationsList();
        for (let category of this.categoriesTableData) {
            for (let information of this.informationsTableDataDisplay) {
                if (category.id == information.category && category.id != "") {
                    information.category = category.titleLanguages[0].title;
                }
            }
        }
    }
    async loadCategories() {
        this.categoriesTableData = await this.infoManagementService.getCategoriesList();
        this.categoriesTableData.push(this.emptyCategory);
    }


    async onAddInfo() {
        await this.loadInformations();
        this.loadCategories();
        this.selectedImage = this.images[0];
        this.infoFiles = new Array();
        this.attachmentFiles = new Array();
        let idx = 0;
        for (let lang of this.availableLanguages) {
            this.infoFiles[idx] = { lang: lang.id, file: null };
            idx++;
        }
        this.langTabIndex = 0;
        this.languageSelected = this.availableLanguages[0].id;
        this.titleCard = this.translate.instant('INFORMATION_PAGE.Add Information');
        this.currentInfo = InformationDocument.Empty();
        this.iconColor = "#ffffff";
        this.httpClient.get('./assets/images/information-outline-white.svg', { responseType: 'text' })
            .subscribe(data => {
                this.currentIcon = data;
                this.changeSvgSize();
                this.changeSvgFill();
            });
        this.readLanguages();
        this.tabgroup.selectedIndex = 1;
    }

    async onModifyInfo(info: InformationDocument) {
        for (let originInfo of this.informationsTableData) {
            if (originInfo.id == info.id) {
                info.category = originInfo.category;
                break;
            }
        }
        this.loadCategories();
        this.langTabIndex = 0;
        this.languageSelected = this.availableLanguages[0].id;
        this.titleCard = this.translate.instant('INFORMATION_PAGE.Modify Information');
        this.currentInfo = info;
        this.infoFiles = info.file;
        this.attachmentFiles = new Array();
        for (let fileForLang of this.infoFiles) {
            if (fileForLang.lang == this.languageSelected) {
                this.attachmentFileName = fileForLang.file;
                break;
            }
        }
        this.selectedImage = "";
        this.readLanguages();
        this.titles = info.titleLanguages;
        this.currentTitle = this.titles[0].title;
        this.tabgroup.selectedIndex = 1;
        this.currentIcon = info.icon;
        this.readIconColor();
        this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);

    }

    async onDeleteInfo(info: InformationDocument) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteAlert'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.infoManagementService.deleteDocument(info.id);
            if (res.result) {
                this.loadCategories();
                this.loadInformations();
            }
            else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.message, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    onAttachment() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.file.nativeElement.click();
    }

    onIconAttachment() {
        if (this.iconFile.nativeElement.files.length > 0) {
            this.iconFile.nativeElement.value = '';
        }
        this.iconFile.nativeElement.click();
    }


    async onUploadFile() {
        try {
            this.attachmentFiles[this.langTabIndex] = this.file.nativeElement.files[0];
            this.attachmentFileName = this.file.nativeElement.files[0].name;
            this.infoFiles[this.langTabIndex].file = this.attachmentFileName;
            this.currentInfo.file = this.infoFiles;
            for (let fileForLang of this.infoFiles) {
                if (fileForLang.lang == this.languageSelected) {
                    this.attachmentFileName = fileForLang.file;
                    break;
                }
            }
        }
        catch (ex) {
            console.error('upload file exception: ', ex);
        }
    }

    async onUploadIcon(e) {
        this.attachmentIcon = this.iconFile.nativeElement.files[0];
        let reader = new FileReader();
        var that = this;
        reader.onloadend = await function (event) {
            const fileText = reader.result;
            that.iconUploadedVal = fileText.toString();
            that.modifyIconUploaded();
        }
        reader.readAsText(this.attachmentIcon);
    }

    isConfirmEnabled() {
        return this.titles.length > 0
            && this.commonService.isValidField(this.currentInfo.icon);
    }

    onCancelClick() {
        this.tabgroup.selectedIndex = 0;
        this.attachmentFiles = new Array();
        this.attachmentFileName = null;
    }

    async onConfirmClick() {
        let ok = false;
        for (let title of this.titles) {
            if (title.title) {
                for (let file of this.infoFiles) {
                    if (file.lang == title.lang) {
                        if (file.file) ok = true;
                    }
                }
            }
        }   // verifica che ci sia almeno un titolo con un file allegato

        if (ok) {
            this.currentInfo.titleLanguages = this.titles;
            this.infoManagementService.uploadDocument(this.attachmentFiles, this.currentInfo)
                .subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.loadCategories();
                        this.loadInformations();
                        this.tabgroup.selectedIndex = 0;
                        this.attachmentFiles = new Array();
                        this.attachmentFileName = null;
                    }
                }, error => {
                    this.snackBar.open(this.translate.instant('ADMIN DIALOGS.ERROR UPLOADING FILE'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
                });
        }
        else this.snackBar.open(this.translate.instant('ADMIN DIALOGS.ERRORSAVINGINFO'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
    }

    onImageClick(url: string) {
        this.selectedImage = url;
        let path = './assets/images/' + url;
        this.httpClient.get(path, { responseType: 'text' })
            .subscribe(data => {
                this.currentIcon = data;
                this.changeSvgSize();
                this.changeSvgFill();

            });

    }

    onUploadedClick() {
        this.selectedImage = "uploaded";
        this.currentIcon = this.iconUploadedVal;
        this.changeSvgSize();
        this.changeSvgFill();
    }



    onTitleChange() {
        let id = 0;
        for (let title of this.titles) {
            if (title.lang == this.languageSelected) {
                this.titles[id].title = this.currentTitle;
            }
            id++;
        }
    }

    onLanguageChange() {
        this.languageSelected = this.availableLanguages[this.langTabIndex].id;
        for (let title of this.titles) {
            if (title.lang == this.languageSelected) {
                this.currentTitle = title.title;
                break;
            }
        }
        for (let fileForLang of this.infoFiles) {
            if (fileForLang.lang == this.languageSelected) {
                this.attachmentFileName = fileForLang.file;
                break;
            }
        }
    }

    titleLanguagesFormatter(titleLang: TitleLanguage[]) {
        for (let title of titleLang) {
            if (title.lang == this.userLanguageSelect) {
                return title.title;
            }
        }
        return titleLang[0].title;
    }

    fileLanguagesFormatter(fileLang: FileLanguage[]) {
        for (let file of fileLang) {
            if (file.lang == this.userLanguageSelect) {
                return file.file;
            }
        }
        return fileLang[0].file;
    }


    changeSvgSize() {
        let widthIndexStart = this.currentIcon.indexOf('width="');
        let widthIndexEnd = this.currentIcon.indexOf('"', widthIndexStart + 7) + 1;
        let heightIndexStart = this.currentIcon.indexOf('height="');
        let heightIndexEnd = this.currentIcon.indexOf('"', heightIndexStart + 8) + 1;
        let viewBoxIndex = this.currentIcon.indexOf('viewBox=');

        let widthReaded = this.currentIcon.substring(widthIndexStart, widthIndexEnd);
        let heightReaded = this.currentIcon.substring(heightIndexStart, heightIndexEnd);

        this.currentIcon = this.currentIcon.replace(widthReaded, 'width="70"');
        this.currentIcon = this.currentIcon.replace(heightReaded, 'height="70"');
        if (viewBoxIndex < 0) {
            this.currentIcon = this.currentIcon.replace('height="70"', 'height="70" viewBox="0 0 24 24"');
        }
        this.currentInfo.icon = this.currentIcon;
        this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    }

    changeSvgFill() {
        let fillIndexStart = this.currentIcon.indexOf('fill="');
        let fillIndexEnd = this.currentIcon.indexOf('"', fillIndexStart + 6) + 1;
        if (fillIndexStart < 0) {
            fillIndexStart = this.currentIcon.indexOf("fill='");
            fillIndexEnd = this.currentIcon.indexOf("'", fillIndexStart + 6) + 1;
        }
        let fillReaded = this.currentIcon.substring(fillIndexStart, fillIndexEnd);
        this.currentIcon = this.currentIcon.replace(fillReaded, 'fill="' + this.iconColor + '"');
        this.currentInfo.icon = this.currentIcon;
        this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    }

    onIconColorChange(event) {
        this.changeSvgFill();
    }

    readIconColor() {
        let fillIndexStart = this.currentIcon.indexOf('fill="');
        let fillIndexEnd = this.currentIcon.indexOf('"', fillIndexStart + 6) + 1;
        this.iconColor = this.currentIcon.substring(fillIndexStart + 6, fillIndexEnd - 1);
    }

    modifyIconUploaded() {
        let widthIndexStart = this.iconUploadedVal.indexOf('width="');
        let widthIndexEnd = this.iconUploadedVal.indexOf('"', widthIndexStart + 7) + 1;
        let heightIndexStart = this.iconUploadedVal.indexOf('height="');
        let heightIndexEnd = this.iconUploadedVal.indexOf('"', heightIndexStart + 8) + 1;
        let viewBoxIndex = this.iconUploadedVal.indexOf('viewBox=');

        let widthReaded = this.iconUploadedVal.substring(widthIndexStart, widthIndexEnd);
        let heightReaded = this.iconUploadedVal.substring(heightIndexStart, heightIndexEnd);

        this.iconUploadedVal = this.iconUploadedVal.replace(widthReaded, 'width="40"');
        this.iconUploadedVal = this.iconUploadedVal.replace(heightReaded, 'height="36"');
        if (viewBoxIndex < 0) {
            this.iconUploadedVal = this.iconUploadedVal.replace('height="36"', 'height="36" viewBox="0 0 24 24"');
        }

        let fillIndexStart = this.iconUploadedVal.indexOf('fill="');
        let fillIndexEnd = this.iconUploadedVal.indexOf('"', fillIndexStart + 6) + 1;
        if (fillIndexStart < 0) {
            fillIndexStart = this.iconUploadedVal.indexOf("fill='");
            fillIndexEnd = this.iconUploadedVal.indexOf("'", fillIndexStart + 6) + 1;
        }
        if (fillIndexStart < 0) {
            this.iconUploadedVal = this.iconUploadedVal.replace('height="36"', 'height="36" fill="#ffffff"');
        }
        else {
            let fillReaded = this.iconUploadedVal.substring(fillIndexStart, fillIndexEnd);
            this.iconUploadedVal = this.iconUploadedVal.replace(fillReaded, 'fill="#ffffff"');
        }

        this.safeSvgUploaded = this.sanitizer.bypassSecurityTrustHtml(this.iconUploadedVal);

        this.iconUploaded = true;
    }

    onPublicQrCodeClick(info: InformationDocument) {
        this.publicDocumentQR = this.availableLanguages.map(lang => {
            return environment.app_page + '/public-info/' + lang.id + '/' + info.id
        });
        this.currentPublicDocument = info;
        this.showQR = true;
    }

    onCloseLoginQR() {
        this.showQR = false;
    }

    onDownloadLoginQR(qrcode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this.commonService.downloadImageBase64(qrImage, this.currentPublicDocument.file);
    }

    onPublicLanguageChange() {

    }
}
