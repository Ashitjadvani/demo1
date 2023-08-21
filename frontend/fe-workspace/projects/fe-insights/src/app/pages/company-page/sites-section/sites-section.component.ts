import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';

@Component({
    selector: 'app-sites-section',
    templateUrl: './sites-section.component.html',
    styleUrls: ['./sites-section.component.scss']
})
export class SitesSectionComponent implements OnInit {
    @ViewChild('file', { static: true }) file: ElementRef;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    sites: Site[];
    sitesTableData: any;

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Key'), columnName: 'Key', columnDataField: 'key', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Status'), columnName: 'Status', columnDataField: 'globalStatus', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.OfficeReservations'), columnName: 'OfficeReservations', columnDataField: 'reservationCount', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.OfficeIn'), columnName: 'OfficeIn', columnDataField: 'officeInCount', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.OfficeOut'), columnName: 'OfficeOut', columnDataField: 'officeOutCount', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifySite', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteSite', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Site'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddSite', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Import Sites'), image: null, icon: 'cloud_upload', color: '#ffffff', action: 'onImportSites', context: this },
    ]

    constructor(private adminSiteManagementService: AdminSiteManagementService,
        public commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) {

    }

    async ngOnInit() {
        await this.loadSiteList();
    }

    async loadSiteList() {
        this.sites = await this.adminSiteManagementService.siteList();

        let todayYYYYMMDD = this.commonService.toYYYYMMDD(new Date());
        let sitesStats: any[] = await Promise.all(this.sites.map(site => {
            return new Promise(async (resolve, reject) => {
                let res = await this.adminSiteManagementService.getSitePresenceStatistics(site.key, todayYYYYMMDD, todayYYYYMMDD);
                if (res.result) {
                    resolve({
                        siteKey: site.key,
                        stats: res.stats[0]
                    });
                } else {
                    resolve({
                        siteKey: site.key,
                        stats: null
                    });
                }
            });
        }));

        this.sitesTableData = this.sites.map(site => {
            let siteStats = sitesStats.find(ss => ss.siteKey == site.key);
            return Object.assign({
                reservationCount: siteStats ? siteStats.stats.resevationCount : -1,
                officeInCount: siteStats ? siteStats.stats.officeInCount : -1,
                officeOutCount: siteStats ? siteStats.stats.officeOutCount : -1
            }, site)
        });
    }

    async onAddSite() {
        // let res = await this.dialog.open(SiteManagementDialogComponent, {
        //     width: '600px',
        //     minHeight: '500px',
        //     panelClass: 'custom-dialog-container',
        //     data: {
        //         isModify: false,
        //         site: null
        //     }
        // }).afterClosed().toPromise();
        // if (res) {
        //     await this.loadSiteList();
        // }
    }

    async onModifySite() {

    }

    onImportSites() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.file.nativeElement.click();
    }

    async onUploadFile() {
        let fileChoosen = this.file.nativeElement.files[0];
        if (!fileChoosen)
            return;

        if (fileChoosen.size > (10 * 1024 * 1024)) {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.FILE SIZE BIG'), this.translate.instant('GENERAL.OK'), { duration: 2000 });
            return;
        }

        let file = this.file.nativeElement.files[0];
        await this.adminSiteManagementService.uploadSites(file);

        await this.loadSiteList();
    }
}
