import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InfoManagementService } from 'projects/fe-common/src/lib/services/info-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';

@Component({
    selector: 'app-information-public-page',
    templateUrl: './information-public-page.component.html',
    styleUrls: ['./information-public-page.component.scss']
})
export class InformationPublicPageComponent implements OnInit {
    url: string = '';
    currentTitle: string;
    docIsPdf: boolean = false;
    docIsImage: boolean = false;
    docIsAudio: boolean = false;
    docIsVideo: boolean = false;
    trustedUrl: any;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        public translate: TranslateService,
        private infoManagementService: InfoManagementService,
        private _settingManager: SettingsManagementService,
        private sanitizer: DomSanitizer) { }

    async ngOnInit() {
        let lang = this.activatedRoute.snapshot.params['lang'];
        let id = this.activatedRoute.snapshot.params['id'];

        console.log('info-public-page: ', lang, id);

        await this.loadPublicDocument(lang, id);
    }

    async loadPublicDocument(lang, id) {
        let allDocument = await this.infoManagementService.getPublicInformationsList();
        let currentDoc = allDocument.find(doc => doc.id == id);
        if (currentDoc != null) {
            let result = await this.infoManagementService.downloadPublicDocument(lang, id).toPromise();
            let blob = new Blob([result]);
            this.url = window.URL.createObjectURL(blob);
            this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(this.url);
            
            let fileInfo = currentDoc.file.find(f => f.lang == lang);
            if (fileInfo && fileInfo.file) {
                

                if (fileInfo.file.indexOf("pdf") > 0) {
                    this.docIsImage = false;
                    this.docIsAudio = false;
                    this.docIsVideo = false;
                    this.docIsPdf = true;
                }
                else if (fileInfo.file.indexOf("png") > 0 || fileInfo.file.indexOf("jpg") > 0 || fileInfo.file.indexOf("jpeg") > 0) {
                    this.docIsPdf = false;
                    this.docIsAudio = false;
                    this.docIsVideo = false;
                    this.docIsImage = true;
                }
                else if (fileInfo.file.indexOf("mp3") > 0) {
                    this.currentTitle = fileInfo.file;

                    this.docIsPdf = false;
                    this.docIsImage = false;
                    this.docIsVideo = false;
                    this.docIsAudio = true;
                }
                else if (fileInfo.file.indexOf("mp4") || fileInfo.file.indexOf("m4v") > 0) {
                    this.currentTitle = fileInfo.file;
                    
                    this.docIsPdf = false;
                    this.docIsImage = false;
                    this.docIsAudio = false;
                    this.docIsVideo = true;
                }
            }
        }
    }

}
