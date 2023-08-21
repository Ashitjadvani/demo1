import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core"; 
import { InformationDocument } from 'projects/fe-common/src/lib/models/admin/information-document';
import { CategoryDocument } from 'projects/fe-common/src/lib/models/admin/information-category-document';
import { InfoManagementService } from 'projects/fe-common/src/lib/services/info-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { MatTabGroup } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'app-information-page',
    templateUrl: './information-page.component.html',
    styleUrls: ['./information-page.component.scss']
})
export class InformationPageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    infoListEmpty: boolean;
    infoList : InformationDocument[];
    categoriesList : CategoryDocument[];
    usedCategoriesList: CategoryDocument[];
    usedInfoList: InformationDocument[];
    infoInCategoryList: InformationDocument[];
    url: string = '';
    selectedCategory: CategoryDocument = CategoryDocument.Empty();
    userLanguageSelect: string;
    langIt: boolean = false;
    langEn: boolean = false;
    langFr: boolean = false;
    langEs: boolean = false;
    docIsPdf: boolean = false;
    docIsImage: boolean = false;
    docIsAudio: boolean = false;
    docIsVideo: boolean = false;
    trustedUrl: any;
    counter: number = 0;
    currentTitle: string;
    currentFile: File;
    currentCategoryTitle: string;
    

    constructor(private router: Router,
        public translate: TranslateService,
        private infoManagementService: InfoManagementService,
        private _settingManager: SettingsManagementService,
        private sanitizer: DomSanitizer) {}

    async ngOnInit() {
        this.userLanguageSelect = this._settingManager.getSettingsValue('currentLanguage');
        if(this.userLanguageSelect=="it")   this.langIt=true;
            else if(this.userLanguageSelect=="en")   this.langEn=true;
            else if(this.userLanguageSelect=="es")   this.langEs=true;
            else if(this.userLanguageSelect=="fr")   this.langFr=true;
            else {
                this.langEn=true;
                this.userLanguageSelect="en";
            }
        await this.loadInfoList();
    }

    async loadInfoList() {
        let validLangCat = false;
        let validLangInfo = false;
        this.counter = 0;
        this.selectedCategory.id="";
        this.usedCategoriesList = new Array();
        this.usedInfoList = new Array();

        let allInfo = await this.infoManagementService.getInformationsList();
        this.infoList =  allInfo.filter(inf => !inf.isPublic);

        if(this.infoList.length == 0) {
            this.infoListEmpty = true;           
        }
        else
        {
            this.infoListEmpty = false;
            this.categoriesList = await this.infoManagementService.getCategoriesList();
            for(let category of this.categoriesList) 
            {
                validLangCat = false;
                for(let titleLang of category.titleLanguages) 
                {
                    if(titleLang.lang==this.userLanguageSelect) {
                        if(titleLang.title!="") validLangCat = true;
                    }
                }
                for(let information of this.infoList)
                {
                    if(information.category == category.id && validLangCat)
                    {
                        this.usedCategoriesList.push(category);
                        this.counter++;
                        break;
                    }
                }
            }
            for(let information of this.infoList)
            {
                validLangInfo = false;
                for(let titleLang of information.titleLanguages) 
                {
                    if(titleLang.lang==this.userLanguageSelect) {
                        if(titleLang.title!="") validLangInfo = true;
                    }
                }
                if(information.category == "" && validLangInfo)
                {
                    this.usedInfoList.push(information);
                    this.counter++;
                }
            }
        }
    }

    async loadInfoInCategoryList() {
        let validLangInfo = false
        this.counter = 0;
        this.infoInCategoryList = new Array();
        for(let info of this.infoList)
        {
            validLangInfo = false;
            for(let titleLang of info.titleLanguages) 
            {
                if(titleLang.lang==this.userLanguageSelect) {
                    if(titleLang.title!="") validLangInfo = true;
                }
            }
            if(info.category == this.selectedCategory.id && validLangInfo)
            {
                this.infoInCategoryList.push(info);
                this.counter++;
            }
        }
    }

    async onInfoClick(info: InformationDocument) {
        for(let filename of info.file) {
            if(filename.lang == this.userLanguageSelect) {
                this.currentTitle = filename.file;
                break;
            }
        }
        let result = await this.infoManagementService.downloadDocument(this.currentTitle).toPromise();
        let blob = new Blob([result]);
        this.url = window.URL.createObjectURL(blob);
        this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(this.url); 
        
        if(this.currentTitle.indexOf("pdf")>0)
        {
            this.docIsImage=false;
            this.docIsAudio=false;
            this.docIsVideo=false;
            this.docIsPdf=true;
        }
        else if(this.currentTitle.indexOf("png")>0 || this.currentTitle.indexOf("jpg")>0 || this.currentTitle.indexOf("jpeg")>0)
        { 
            this.docIsPdf=false;
            this.docIsAudio=false;
            this.docIsVideo=false;
            this.docIsImage=true;      
        }
        else if(this.currentTitle.indexOf("mp3")>0)
        {
            this.docIsPdf=false;
            this.docIsImage=false;
            this.docIsVideo=false;
            this.docIsAudio=true;            
        }
        else if(this.currentTitle.indexOf("mp4") || this.currentTitle.indexOf("m4v")>0)
        {
            this.docIsPdf=false;
            this.docIsImage=false;
            this.docIsAudio=false;
            this.docIsVideo=true;            
        }
        this.tabgroup.selectedIndex = 2;
    }

    async onCategoryClick(category: CategoryDocument) {
        this.selectedCategory = category;
        for(let title of category.titleLanguages) {
            if(title.lang == this.userLanguageSelect) {
                this.currentCategoryTitle = title.title;
                break;
            }
        }
        await this.loadInfoInCategoryList();
        this.tabgroup.selectedIndex = 1;
    }

    async onBack() {
        try {
            if (this.tabgroup.selectedIndex == 2) {
                if(this.selectedCategory.id=="")
                {
                    await this.loadInfoList();
                    this.tabgroup.selectedIndex = 0;
                }
                else 
                {
                    await this.loadInfoInCategoryList();
                    this.tabgroup.selectedIndex = 1;
                }
            }
            else if(this.tabgroup.selectedIndex == 1) 
            {
                await this.loadInfoList();
                this.tabgroup.selectedIndex = 0;
                this.selectedCategory.id="";
            }
            else this.router.navigate(["home"]);
        } catch (ex) {
            console.error('exception: ', ex)
        }
    }

}
