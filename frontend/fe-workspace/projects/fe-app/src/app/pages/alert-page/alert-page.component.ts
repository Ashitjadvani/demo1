import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NewsDocument, NEWS_ACTION_TYPE } from 'projects/fe-common/src/lib/models/admin/news-document';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { saveAs } from 'file-saver';
import { AlertsManagementService } from 'projects/fe-common/src/lib/services/alerts-management.service';
import { Person } from 'projects/fe-common/src/lib/models/person';

const BACKGROUND_UNREAD = '#FDF1E6';
const BACKGROUND_READ = '#E6F3FE';
const BACKGROUND_CONFIRMED = '#E9F8F0';

@Component({
    selector: 'app-alert-page',
    templateUrl: './alert-page.component.html',
    styleUrls: ['./alert-page.component.scss']
})
export class AlertPageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    @ViewChild(MatSlideToggle, { static: false }) confirmToggle: MatSlideToggle;

    currAccount: Person;

    newsList: NewsDocument[];
    selectedNews: NewsDocument = NewsDocument.Empty();
    newsListEmpty: boolean;
    backgroundColor: string;

    constructor(private alertsManagementService: AlertsManagementService,
        private router: Router,
        private userManagementService: UserManagementService) { }

    async ngOnInit() {
        this.currAccount = this.userManagementService.getAccount();

        await this.loadNewsList();
    }

    async loadNewsList() {
        this.newsList = await this.alertsManagementService.getUserAlertList(this.currAccount.id);
        this.newsListEmpty = this.newsList.length == 0;
    }

    async onDownloadFile() {
        let result = await this.alertsManagementService.downloadDocument(this.selectedNews.id).toPromise();
        let blob = new Blob([result]);
        let url = window.URL.createObjectURL(blob);
        saveAs(blob, this.selectedNews.file);
    }

    async onNewsClick(news: NewsDocument) {
        this.selectedNews = news;
        this.tabgroup.selectedIndex = 1;

        this.confirmToggle.checked = this.selectedNews.confirmed;
        this.confirmToggle.disabled = this.selectedNews.confirmed;

        this.backgroundColor = BACKGROUND_UNREAD;
        if (this.selectedNews.readed) {
            this.backgroundColor = BACKGROUND_READ;
        }
        if (this.selectedNews.confirmed) {
            this.backgroundColor = BACKGROUND_CONFIRMED;
        }
    }

    async onClickViewConfirm() {
        this.tabgroup.selectedIndex = 0;
        this.selectedNews.readed = true;

        if (this.confirmToggle.checked && !this.selectedNews.confirmed) {
            await this.alertsManagementService.actionOnDocument(this.selectedNews.id, this.currAccount.id, NEWS_ACTION_TYPE.CONFIRM);
            this.selectedNews.confirmed = true;
        } else
            await this.alertsManagementService.actionOnDocument(this.selectedNews.id, this.currAccount.id, NEWS_ACTION_TYPE.READ);

        await this.loadNewsList();
    }

    async onBack() {
        try {
            if (this.tabgroup.selectedIndex == 0)
                this.router.navigate(["home"]);
            else {
                this.selectedNews.readed = true;

                if (this.confirmToggle.checked && !this.selectedNews.confirmed) {
                    await this.alertsManagementService.actionOnDocument(this.selectedNews.id, this.currAccount.id, NEWS_ACTION_TYPE.CONFIRM);
                    this.selectedNews.confirmed = true;
                } else
                    await this.alertsManagementService.actionOnDocument(this.selectedNews.id, this.currAccount.id, NEWS_ACTION_TYPE.READ);

                await this.loadNewsList();

                this.tabgroup.selectedIndex = 0;
            }
        } catch (ex) {
            console.error('exception: ', ex)
        }
    }
}
