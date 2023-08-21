import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup, MAT_TABS_CONFIG } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { AccessControlPassage, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { User } from 'projects/fe-common/src/lib/models/admin/user';
import { Area, Company, Scope } from 'projects/fe-common/src/lib/models/company';
import { ACCESS_CONTROL_LEVEL, Person, PersonHistory, PERSON_PROPERTY, PERSON_TYPOLOGY } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { UserManagementDialogComponent } from '../../../dialogs/user-management-dialog/user-management-dialog.component';
import { SatPopover } from '@ncstate/sat-popover';
import { DatePipe } from '@angular/common';
import { UserCapabilityService } from '../../../services/user-capability.service';
import { saveAs } from 'file-saver';
import { ReportManagementService } from 'projects/fe-common/src/lib/services/report-management.service';
import { MonthChooserDialogComponent } from '../../../dialogs/month-chooser-dialog/month-chooser-dialog.component';
import { PeopleDashboardDialogComponent } from '../../../dialogs/people-dashboard-dialog/people-dashboard-dialog.component';
import * as XLSX from 'ts-xlsx';
import { ExcelService } from '../../../services/excel.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServerSettingsManagementService } from 'projects/fe-common/src/lib/services/server-settings-management.service';
import { ServerSettings } from '../../settings-page/settings-page.component';
import { I } from '@angular/cdk/keycodes';
import { UserDocument } from 'projects/fe-common/src/lib/models/user-document';

@Component({
    selector: 'app-people-single-scope-page',
    templateUrl: './people-single-scope-page.component.html',
    styleUrls: ['./people-single-scope-page.component.scss'],
    providers: [
        { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '500ms' } }
    ]
})
export class PeopleSingleScopePageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    @ViewChild(MatTabGroup, { static: false }) tabgroupeditor: MatTabGroup;
    @ViewChild(SatPopover, { static: false }) changeLogPopover: SatPopover;

    @ViewChild('file', { static: true }) file: ElementRef;

    @Input() scope: Scope;

    PERSON_PROPERTY = PERSON_PROPERTY;

    people: Person[];
    currentEditPerson: Person = Person.Empty();
    currentCompany: Company = new Company();
    currentPersonHistory: PersonHistory[] = [];

    isSafetyUsers: boolean;
    titleCard: string;

    sites: Site[];
    areasAvailable: Area[];
    sortedAreas: Area[];

    currentEditAccessControlLevel: ACCESS_CONTROL_LEVEL = null;
    currentEditPassagesId: any;
    currentEditPassageGroupsId: any;
    currentEditUserDocuments: UserDocument[] = new Array();

    docsModified: UserDocument[] = new Array();

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Surname'), columnName: 'Surname', columnDataField: 'surname', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        //{ columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Direction'), columnName: 'Direction', columnDataField: 'direction', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Area'), columnName: 'Area', columnDataField: 'area', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Job Title'), columnName: 'JobTitle', columnDataField: 'jobTitle', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Role'), columnName: 'Role', columnDataField: 'role', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        // { tooltip: 'User site daily access', image: './assets/images/calendar-month-outline.svg', icon: null, color: '#000000', action: 'onModifyUserSiteDailyAccess', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Change Log'), image: null, icon: 'checklist_rtl', color: '#000000', action: 'onShowChangeLog', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/account-edit.svg', icon: null, color: '#000000', action: 'onModifyUser', context: this },
        { tooltip: 'Show user activity', image: null, icon: 'comment', color: '#000000', action: 'onShowUserActivity', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteUser', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add User'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddUser', context: this },
        { tooltip: this.translate.instant('SURVEY.DOWNLOADREPORT'), image: null, icon: 'file_download', color: '#ffffff', action: 'onDownloadUserPresenceReport', context: this },
        { tooltip: this.translate.instant('Dashboard'), image: null, icon: 'analytics', color: '#ffffff', action: 'onShowPeopleDashboard', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Import People'), image: null, icon: 'cloud_upload', color: '#ffffff', action: 'onImportUser', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Export People'), image: null, icon: 'cloud_download', color: '#ffffff', action: 'onExportUser', context: this },
        // { tooltip: 'INIT SCOPE', image: null, icon: 'settings', color: '#ffffff', action: 'onInitScope', context: this },
        // { tooltip: 'Add Safety Users', image: null, icon: 'health_and_safety', color: '#ffffff', action: 'onImportSafetyUser', context: this },
        // { tooltip: 'Clear Users', image: './assets/images/cloud-delete.svg', icon: null, color: '#ffffff', action: 'onClearUsers', context: this },
    ]

    filterCallback: Function;
    userAccount: Person;

    disputeAvailable: boolean = false;
    economicsAvailable: boolean = false;
    settingsAvailable: boolean = false;

    showCard: boolean = true;
    //scope: PERSON_SCOPE;
    dashboardUrl: SafeResourceUrl;
    serverSettings: ServerSettings;
    idTemp: number = 1;

    constructor(private adminUserManagementService: AdminUserManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private notifyManagementService: NotifyManagementService,
        private userCapabilityService: UserCapabilityService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private reportManagementService: ReportManagementService,
        private excelService: ExcelService,
        private sanitizer: DomSanitizer,
        private serverSettingsManagementService: ServerSettingsManagementService,
        public translate: TranslateService) {
        this.filterCallback = this.filterPerson.bind(this);
    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();
        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.sites = res.sites;
        }

        this.disputeAvailable = this.userCapabilityService.isFunctionAvailable('People/*/Dispute');
        this.economicsAvailable = this.userCapabilityService.isFunctionAvailable('People/*/Economics');

        await this.loadServerSettings();
        await this.loadCompany();
        await this.loadUserList();
    }

    filterPerson(filterValue: string, data: any) {
        return Person.filterMatch(data, filterValue);
    }

    async loadServerSettings() {
        const ServerSettingsKey = 'server-settings';
        let res = await this.serverSettingsManagementService.getValue(ServerSettingsKey);
        if (this.commonService.isValidResponse(res))
            this.serverSettings = res.value;
        else
            this.serverSettings = null;
    }

    async loadUserList() {
        const res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        this.people = new Array();
        if (this.commonService.isValidResponse(res)) {
            for (let person of res.people) {
                if (person.scope == this.scope.name) this.people.push(person);
            }
            //this.people = res.people;
        } else {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR USERS'), this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    async loadCompany() {
        let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.currentCompany = res.company;
        }
        this.sortedAreas = this.currentCompany.areas;
        this.areasAvailable = new Array();
        if (this.currentCompany.areas) {
            for (let area of this.currentCompany.areas) {
                for (let areaScope of area.scopes) {
                    if (areaScope == this.scope.name) {
                        this.areasAvailable.push(area);
                        break;
                    }
                }
            }
        }
    }

    async onAddUser() {
        this.showCard = true;
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Person');
        this.currentEditPerson = Person.Empty();
        this.currentEditPerson.scope = this.scope.name;
        this.tabgroupeditor.selectedIndex = 0;
        this.tabgroup.selectedIndex = 1;
    }

    async onModifyUser(person: Person) {
        this.currentEditAccessControlLevel = person.accessControlLevel;
        this.currentEditPassagesId = person.accessControlPassagesId;
        this.currentEditPassageGroupsId = person.accessControlGroupsId;
        let res = await this.adminUserManagementService.getUserDocuments(person.id);
        if(res.result) {
            this.currentEditUserDocuments = res.documents; 
        }
        this.showCard = true;
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Modify Person') + ' - ' + person.name + " " + person.surname;
        this.currentEditPerson = this.commonService.cloneObject(person);
        this.tabgroupeditor.selectedIndex = 0;
        this.tabgroup.selectedIndex = 1;
    }

    async onShowUserActivity(person: Person) {
        let csv = '';
        let saveCSV = (fileName) => {
            if (csv) {
                var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
                saveAs(blob, fileName);
            }
        };

        let res = await this.dialog.open(MonthChooserDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container'
        }).afterClosed().toPromise();
        if (res) {
            let now = new Date();
            let year = now.getFullYear();
            let startDate = this.commonService.toYYYYMMDD(new Date(year, res - 1, 1));
            let endDate = this.commonService.toYYYYMMDD(new Date(year, res, 0));

            csv = await this.reportManagementService.getUserActivitiesCSV(this.scope.name, person.id, startDate, endDate);
            saveCSV(`irina-activity-report-${person.name}-${person.surname}-${year}-${res}.csv`);
        }
    }

    async onRestorePreson(personHistory: PersonHistory) {
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Modify Person From History');
        this.currentEditPerson = this.commonService.cloneObject(personHistory.d);
        this.tabgroupeditor.selectedIndex = 0;
        this.tabgroup.selectedIndex = 1;
    }

    async onDeleteUser(person: Person) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteUser'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.adminUserManagementService.deletePerson(person.id);
            if (res.result) {
                this.people = this.people.filter(u => u.id != person.id);
            } else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    getUserSafetyGroups(user: User) {
        if (user.safetyGroups && (user.safetyGroups.length > 0)) {
            let result = '';
            user.safetyGroups.forEach(val => result += ' ' + User.mapUserSafetyGroup(val) + ' ');
            return result;
        }
        return '';
    }

    onImportUser() {
        this.chooseFile(false);
    }

    onImportSafetyUser() {
        this.chooseFile(true);
    }


    chooseFile(isSafetyUsers: boolean) {
        this.isSafetyUsers = isSafetyUsers;

        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }

        this.file.nativeElement.click();
    }

    async onClearUsers() {
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
        let readed;
        let reader = new FileReader();
        var that = this;

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(async function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                readed = JSON.parse(json_object);
                let res = await that.adminUserManagementService.uploadUsersList(readed, that.currentCompany.id);
                that.snackBar.open(that.translate.instant('ADMIN COMPONENTS.DATA IMPORT COMPLETE'), 'OK', {
                    duration: 5000,
                    panelClass: 'success'
                });
                let message = "<strong>" + res.usersFound.length + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.USERS UPDATED') + "<br />" +
                    "<strong>" + res.usersNotFound.length + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.USERS NOT UPDATED') + "<br />";

                for (let user of res.usersNotFound) {
                    if (user.CF != '') message = message + "<strong>" + user.CF + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.NOT FOUND') + "<br />";
                    else message = message + "<strong>" + user.Nome + " " + user.Cognome + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.NOT FOUND') + "<br />";
                }

                that.notifyManagementService.openMessageDialog(that.translate.instant('ADMIN COMPONENTS.DETAILS'), message);
                await that.loadUserList();
            })
        };

        reader.onerror = function (ex) {
            that.notifyManagementService.displaySuccessSnackBar(that.translate.instant('ADMIN COMPONENTS.DATA IMPORT ERROR'));
        };

        reader.readAsBinaryString(file);


    }

    isEditConfirmEnabled() {
        return this.commonService.isValidField(this.currentEditPerson.name) &&
            this.commonService.isValidField(this.currentEditPerson.surname) &&
            this.commonService.isValidField(this.currentEditPerson.email);
    }

    onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
        this.docsModified = new Array();
    }

    async onShowChangeLog(person: Person) {
        let res = await this.adminUserManagementService.getPersonHistory(person.id);
        if (this.commonService.isValidResponse(res)) {
            this.currentPersonHistory = res.history;
            this.changeLogPopover.open();
        }
    }

    async onEditConfirmClick() {
        if (this.currentEditPerson.accessControlLevel && (this.currentEditPerson.accessControlLevel != this.currentEditAccessControlLevel || JSON.stringify(this.currentEditPerson.accessControlPassagesId) != JSON.stringify(this.currentEditPassagesId) || JSON.stringify(this.currentEditPerson.accessControlGroupsId) != JSON.stringify(this.currentEditPassageGroupsId))) {
            let reply = await this.dialog.open(ConfirmDialogComponent, {
                width: '400px',
                panelClass: 'custom-dialog-container',
                data: new ConfirmDialogData(this.translate.instant('ACCESS_CONTROL.Attention'), this.translate.instant('ACCESS_CONTROL.ModifiedLevelBody'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
            }).afterClosed().toPromise();
            if (reply) {
                for(let doc of this.docsModified) {
                    if(doc.id.search("temp")==0) doc.id = undefined;
                    await this.adminUserManagementService.addUpdateUserDocument(doc);
                }
                this.currentEditPerson.companyId = this.userAccount.companyId;
                const findAreaUID = this.sortedAreas.find((b) => {
                    return b.name === this.currentEditPerson.area;
                });
                this.currentEditPerson.areaID = (findAreaUID && findAreaUID?.id) ? findAreaUID.id : null;
                let res = await this.adminUserManagementService.addOrUpdatePerson(this.currentEditPerson);
                if (this.commonService.isValidResponse(res)) {
                    let res2 = await this.adminSiteManagementService.getSites(this.currentEditPerson.companyId);
                    let sites = res2.sites;
                    let site = sites.filter(site => site.id == this.currentEditPerson.site)[0];
                    if (site && site.accessControlEnable) {
                        res = await this.adminUserManagementService.generateAccessControlQrCode(this.currentEditPerson.id);
                    }
                    await this.loadUserList();
                    this.tabgroup.selectedIndex = 0;
                } else {
                    await this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), res.reason);
                }
            }
        }
        else if(this.docsModified.length) {
            let reply = await this.dialog.open(ConfirmDialogComponent, {
                width: '400px',
                panelClass: 'custom-dialog-container',
                data: new ConfirmDialogData(this.translate.instant('ACCESS_CONTROL.Attention'), this.translate.instant('ACCESS_CONTROL.ModifiedDocumentsBody'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
            }).afterClosed().toPromise();
            if (reply) {
                for(let doc of this.docsModified) {
                    if(doc.id.search("temp")==0) doc.id = undefined;
                    await this.adminUserManagementService.addUpdateUserDocument(doc);
                }
                this.currentEditPerson.companyId = this.userAccount.companyId;
                const findAreaUID = this.sortedAreas.find((b) => {
                    return b.name === this.currentEditPerson.area;
                });
                this.currentEditPerson.areaID = (findAreaUID && findAreaUID?.id) ? findAreaUID.id : null;
                let res = await this.adminUserManagementService.addOrUpdatePerson(this.currentEditPerson);
                if (this.commonService.isValidResponse(res)) {
                    let res2 = await this.adminSiteManagementService.getSites(this.currentEditPerson.companyId);
                    let sites = res2.sites;
                    let site = sites.filter(site => site.id == this.currentEditPerson.site)[0];
                    if (site && site.accessControlEnable) {
                        res = await this.adminUserManagementService.generateAccessControlQrCode(this.currentEditPerson.id);
                    }
                    await this.loadUserList();
                    this.tabgroup.selectedIndex = 0;
                } else {
                    await this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), res.reason);
                }
            }
        }
        else {
            this.currentEditPerson.companyId = this.userAccount.companyId;
            const findAreaUID = this.sortedAreas.find((b) => {
                return b.name === this.currentEditPerson.area;
            });
            this.currentEditPerson.areaID = (findAreaUID && findAreaUID?.id) ? findAreaUID.id : null;
            let res = await this.adminUserManagementService.addOrUpdatePerson(this.currentEditPerson);
            if (this.commonService.isValidResponse(res)) {
                await this.loadUserList();
                this.tabgroup.selectedIndex = 0;
            } else {
                await this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), res.reason);
            }
        }
        this.docsModified = new Array();
    }

    async onDownloadUserPresenceReport() {
        let csv = '';
        let saveCSV = (fileName) => {
            if (csv) {
                var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
                saveAs(blob, fileName);
            }
        };

        let res = await this.dialog.open(MonthChooserDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container'
        }).afterClosed().toPromise();
        if (res) {
            let now = new Date();
            let year = now.getFullYear();

            if (res == -1) {
                let startDate = this.commonService.toYYYYMMDD(new Date(year, 0, 1));
                let endDate = this.commonService.toYYYYMMDD(new Date(year, 11, 31));

                csv = await this.reportManagementService.getUserActivitiesCSV(this.scope.name, null, startDate, endDate);
                saveCSV(`irina-activity-report-full-${year}.csv`);
            } else {
                let startDate = this.commonService.toYYYYMMDD(new Date(year, res - 1, 1));
                let endDate = this.commonService.toYYYYMMDD(new Date(year, res, 0));

                csv = await this.reportManagementService.getUserActivitiesCSV(this.scope.name, null, startDate, endDate);
                saveCSV(`irina-activity-report-full-${year}-${res}.csv`);
            }
        }
    }

    async onShowPeopleDashboard() {
        // await this.dialog.open(PeopleDashboardDialogComponent, {
        //     width: '1000px',
        //     panelClass: 'custom-dialog-container'
        // }).afterClosed().toPromise();

        if (this.serverSettings && this.commonService.isValidField(this.serverSettings.peopleDashboardUrl))
            this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.serverSettings.peopleDashboardUrl);
        else
            this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://datastudio.google.com/embed/reporting/44ea2c64-f321-4564-ad22-b3e554a043f5/page/p_hbekue65mc');

        this.showCard = false;
        this.tabgroup.selectedIndex = 1;
    }



    async onExportUser() {
        let data = await this.adminUserManagementService.downloadUsersList(this.currentCompany.id, this.scope.name);
        if (data.result) {
            let people = data.people;
            let colsWidth = [
                { wch: 20 }, { wch: 8 }, { wch: 18 }, { wch: 18 },
                { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 9 },
                { wch: 38 }, { wch: 20 }, { wch: 20 }, { wch: 8 },
                { wch: 17 }, { wch: 30 }, { wch: 14 }, { wch: 24 },
                { wch: 24 }, { wch: 14 }, { wch: 22 }, { wch: 18 },
                { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 14 },
                { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
                { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
                { wch: 18 }, { wch: 24 }, { wch: 24 }, { wch: 20 }
            ];
            let filename = "Irina_" + this.currentCompany.name + "_" + this.scope.name;
            this.excelService.exportAsExcelFile(people, filename, colsWidth);
        }
        else {
            this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.ERROR DOWNLOADING'), 'OK', {
                duration: 3000,
                panelClass: 'success'
            })
        }
    }

    checkTabAvailable(index: number) {
        switch (index) {
            case 3: {
                return true; // scheda settings visibile per ogni scope perchè contiene il site
            }
            case 4: {
                if (this.scope.enableDisputes) return true;
                return false;
            }
            case 5: {
                if (this.scope.enableSalary || this.scope.enableMbo || this.scope.enableBonus || this.scope.enableContractLevel) return true;
                return false;
            }
        }
    }

    accessFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('People/*/Accesses');
    }

    documentsFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('People/*/Documents');
    }

    docModified(doc: UserDocument) {
        if(!doc.id) {
            doc.id = "temp"+this.idTemp;
            this.idTemp++;
        }
        else {
            this.docsModified = this.docsModified.filter(docf => docf.id != doc.id);
            this.currentEditUserDocuments = this.currentEditUserDocuments.filter(docf => docf.id != doc.id);
        }
        this.docsModified.push(doc);
        let temp = new Array();
        for(let doc of this.currentEditUserDocuments) {
            temp.push(doc);
        }
        this.currentEditUserDocuments = new Array();
        if(!doc.deleted) temp.push(doc);
        this.currentEditUserDocuments = temp;
    }

}
