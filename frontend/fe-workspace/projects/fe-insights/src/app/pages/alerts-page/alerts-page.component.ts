import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { NewsDocument } from 'projects/fe-common/src/lib/models/admin/news-document';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { AlertsManagementService } from 'projects/fe-common/src/lib/services/alerts-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';
import { PeopleGroupPageComponent } from '../people-group-page/people-group-page.component';

@Component({
    selector: 'app-alerts-page',
    templateUrl: './alerts-page.component.html',
    styleUrls: ['./alerts-page.component.scss']
})
export class AlertsPageComponent implements OnInit {
    @ViewChild('documentInput', { static: false }) file: ElementRef;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Date'), columnName: 'Date', columnDataField: 'createdAt', columnFormatter: 'dateColumnFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.TITLE'), columnName: 'Title', columnDataField: 'title', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Publication Date'), columnName: 'PublicationDate', columnDataField: 'publicationDate', columnFormatter: 'dateColumnFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Views'), columnName: 'Views', columnDataField: 'userView', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Confirmed'), columnName: 'Confirmed', columnDataField: 'userConfirmed', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifyAlert', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteAlert', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.New Alert'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddAlert', context: this }
    ]

    attachmentFile: any;

    userAccount: Person;

    sites: Site[];
    groups: PersonProfileGroup[];
    alertsTableData: any;
    titleCard: string;

    datePipe: DatePipe = new DatePipe('it-IT');

    currentAlert: NewsDocument = NewsDocument.Empty();

    constructor(private alertsManagementService: AlertsManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) { }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();

        await this.loadSites();
        await this.loadGroupList();
        await this.loadAlerts();
    }

    async loadAlerts() {
        this.alertsTableData = await this.alertsManagementService.getAlertsList();
    }

    async loadSites() {
        let allSite: Site = Site.Empty();
        allSite.id = '-1';
        allSite.name = this.translate.instant('ADMIN DIALOGS.ALL SITES');

        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.sites = [allSite].concat(res.sites);
        } else {
            this.sites = [allSite];
        }
    }

    async loadGroupList() {
        let allGroup: PersonProfileGroup = PersonProfileGroup.Empty();
        allGroup.id = '-1';
        allGroup.name = this.translate.instant('INSIGHTS_PEOPLE_PAGE.ALL GROUPS');

        const userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getPeopleGroups(userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.groups = [allGroup].concat(res.groups);
        } else {
            this.groups = [allGroup];
        }
    }

    onAddAlert() {
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Alert');
        this.currentAlert = NewsDocument.Empty();
        this.tabgroup.selectedIndex = 1;
    }

    onModifyAlert(alert: NewsDocument) {
        this.currentAlert = alert;
        this.tabgroup.selectedIndex = 1;
    }

    async onDeleteAlert(alert: NewsDocument) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteAlert'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.alertsManagementService.deleteDocument(alert.id);
            if (res.result)
                await this.loadAlerts();
            else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.message, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    dateColumnFormatter(fieldValue: any) {
        try {
            return this.datePipe.transform(new Date(fieldValue), 'dd/MM/yyyy');
        } catch(ex) {
            console.error('dateColumnFormatter exception: ', ex);
        }

        return '#NA'
    }

    onAttachment() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.file.nativeElement.click();
    }

    async onUploadFile() {
        this.attachmentFile = this.file.nativeElement.files[0];
    }

    isConfirmEnabled() {
        return this.commonService.isValidField(this.currentAlert.title) && this.commonService.isValidField(this.currentAlert.description);
    }

    onCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onConfirmClick() {
        this.alertsManagementService.uploadDocument(this.attachmentFile, this.currentAlert)
            .subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.loadAlerts();
                    this.tabgroup.selectedIndex = 0;
                }
            }, error => {
                this.snackBar.open(this.translate.instant('ADMIN DIALOGS.ERROR UPLOADING FILE'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
            });
    }
}
