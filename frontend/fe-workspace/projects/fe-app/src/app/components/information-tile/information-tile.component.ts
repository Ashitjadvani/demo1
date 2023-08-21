import { Component, OnInit, Input } from '@angular/core';
import { InformationDocument } from 'projects/fe-common/src/lib/models/admin/information-document';
import { InfoManagementService } from 'projects/fe-common/src/lib/services/info-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { CategoryDocument } from 'projects/fe-common/src/lib/models/admin/information-category-document';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-information-tile',
    templateUrl: './information-tile.component.html',
    styleUrls: ['./information-tile.component.scss']
})
export class InformationTileComponent implements OnInit {
    @Input() infoDoc: InformationDocument = null;
    @Input() categoryDoc: CategoryDocument;
    userLanguageSelect: string;
    descriptionLang: string;
    backgroundColor: string;
    textColor: string;
    icon: string;
    safeIcon: any;


    constructor(private _settingManager: SettingsManagementService,
        private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.userLanguageSelect = this._settingManager.getSettingsValue('currentLanguage');
        if(!this.userLanguageSelect)
        {
            this.userLanguageSelect="en";
        }
        if(this.infoDoc==null)
        {
            for(let titleLang of this.categoryDoc.titleLanguages) 
            {
                if(titleLang.lang==this.userLanguageSelect) {
                    this.descriptionLang = titleLang.title;
                }
            }
            //this.descriptionLang = this.categoryDoc.titleLanguages[0].title;
            this.backgroundColor = this.categoryDoc.tileBackgroundColor;
            this.textColor = !this.categoryDoc.textColor ? '#ffffffff' : this.categoryDoc.textColor;
            this.icon = this.categoryDoc.icon;
            this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
        }
        else
        {
            for(let titleLang of this.infoDoc.titleLanguages) 
            {
                if(titleLang.lang==this.userLanguageSelect) {
                    this.descriptionLang = titleLang.title;
                }
            }
            //this.descriptionLang = this.infoDoc.titleLanguages[0].title;
            this.backgroundColor = this.infoDoc.tileBackgroundColor;
            this.textColor = !this.infoDoc.textColor ? '#ffffffff' : this.infoDoc.textColor;
            this.icon = this.infoDoc.icon;
            this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
        }

    }

    onClick() {
    }
}
