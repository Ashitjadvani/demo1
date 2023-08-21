import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { TicketGenerateDocument } from 'projects/fe-common/src/lib/models/admin/ticket-generate-document';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { AlertsManagementService } from 'projects/fe-common/src/lib/services/alerts-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { TicketManagementService } from 'projects/fe-common/src/lib/services/ticket-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';
import { PeopleGroupPageComponent } from '../people-group-page/people-group-page.component';

@Component({
    selector: 'app-ticket-generate',
    templateUrl: './ticket-generate-page.component.html',
    styleUrls: ['./ticket-generate-page.component.scss']
})
export class TicketGeneratePageComponent implements OnInit {
    @ViewChild('file', { static: false }) file: ElementRef;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.YOUR NAME'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.YOUR EMAIL'), columnName: 'Email', columnDataField: 'email', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.SUBJECT'), columnName: 'Subject', columnDataField: 'subject', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.URGENCY'), columnName: 'Urgency', columnDataField: 'urgencyString', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.MESSAGE'), columnName: 'Message', columnDataField: 'message', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ];

    tableRowActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifyAlert', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteAlert', context: this }
    ];

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.New Alert'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddAlert', context: this }
    ];

    attachmentFile: any;

    userAccount: Person;

    sites: Site[];
    groups: PersonProfileGroup[];
    alertsTableData: any;
    titleCard: string;

    datePipe: DatePipe = new DatePipe('it-IT');

    currentTicket: TicketGenerateDocument = TicketGenerateDocument.Empty();

    urgencyList: any = [
      {name: 'Low', value: '1'},
      {name: 'Medium', value: '2'},
      {name: 'High', value: '3'},
    ];

    constructor(private ticketManagementService: TicketManagementService,
                private adminSiteManagementService: AdminSiteManagementService,
                private adminUserManagementService: AdminUserManagementService,
                private userManagementService: UserManagementService,
                private commonService: CommonService,
                private snackBar: MatSnackBar,
                private dialog: MatDialog,
                public translate: TranslateService) {
    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();
        await this.loadSites();
        await this.loadGroupList();
        await this.loadAlerts();
    }

    async loadAlerts() {
        this.alertsTableData = await this.ticketManagementService.getAlertsList();
    }

    async loadSites() {
        const allSite: Site = Site.Empty();
        allSite.key = '-1';
        allSite.name = this.translate.instant('ADMIN DIALOGS.ALL SITES');

        const res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.sites = [allSite].concat(res.sites);
        } else {
            this.sites = [allSite];
        }
    }

    async loadGroupList() {
        const allGroup: PersonProfileGroup = PersonProfileGroup.Empty();
        allGroup.id = '-1';
        allGroup.name = this.translate.instant('INSIGHTS_PEOPLE_PAGE.ALL GROUPS');

        const userAccount = this.userManagementService.getAccount();
        const res = await this.adminUserManagementService.getPeopleGroups(userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.groups = [allGroup].concat(res.groups);
        } else {
            this.groups = [allGroup];
        }
    }

    onAddAlert() {
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Ticket');
        this.currentTicket = TicketGenerateDocument.Empty();
        this.currentTicket.name = this.userAccount.name;
        this.currentTicket.email = this.userAccount.email;
        this.tabgroup.selectedIndex = 1;
    }

    onModifyAlert(alert: TicketGenerateDocument) {
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Modify Ticket');
        this.currentTicket = alert;
        this.tabgroup.selectedIndex = 1;
    }

    async onDeleteAlert(alert: TicketGenerateDocument) {
        const res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteAlert'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            const res = await this.ticketManagementService.deleteDocument(alert.id);
            if (res.result) {
                this.snackBar.open(this.translate.instant(res.reason), this.translate.instant('GENERAL.OK'), { duration: 3000 });
                await this.loadAlerts();
            }
            else {
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.message, this.translate.instant('GENERAL.OK'), { duration: 3000 });
            }
        }
    }

    dateColumnFormatter(fieldValue: any) {
        try {
            return this.datePipe.transform(new Date(fieldValue), 'dd/MM/yyyy');
        } catch (ex) {
            console.error('dateColumnFormatter exception: ', ex);
        }

        return '#NA';
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
      return true;
      //  return this.commonService.isValidField(this.currentTicket.title) && this.commonService.isValidField(this.currentTicket.description);
    }

    onCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onConfirmClick() {
        this.ticketManagementService.uploadDocument(this.attachmentFile, this.currentTicket)
            .subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.snackBar.open(this.translate.instant(event.body.reason), this.translate.instant('GENERAL.OK'), { duration: 3000 });
                    this.loadAlerts();
                    this.tabgroup.selectedIndex = 0;
                }
            }, error => {
                this.snackBar.open(this.translate.instant('ADMIN DIALOGS.ERROR UPLOADING FILE'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
            });

    }
}
