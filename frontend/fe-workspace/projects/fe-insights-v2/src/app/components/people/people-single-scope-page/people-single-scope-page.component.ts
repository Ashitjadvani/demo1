import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup, MAT_TABS_CONFIG } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { User } from 'projects/fe-common-v2/src/lib/models/admin/user';
import { Area, Company, Scope } from 'projects/fe-common-v2/src/lib/models/company';
import { Person, PersonHistory, PERSON_PROPERTY, PERSON_TYPOLOGY } from 'projects/fe-common-v2/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common-v2/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { UserCapabilityService } from '../../../service/user-capability.service';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ChangeLogDialogPopupComponent } from '../../../popup/change-log-dialog-popup/change-log-dialog-popup.component';
import { ShowUserActivityPopupComponent } from "../../../popup/show-user-activity-popup/show-user-activity-popup.component";
import { ReportManagementService } from "../../../../../../fe-common-v2/src/lib/services/report-management.service";
import { ExcelService } from "../../../service/excel.service";
import swal from "sweetalert2";
import { ImportPeopleReportPopupComponent } from "../../../popup/import-people-report-popup/import-people-report-popup.component";
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { MCPHelperService } from '../../../service/MCPHelper.service';
import { SelectionModel } from '@angular/cdk/collections';
import { UserPlanPopupComponent } from '../../../popup/user-plan-popup/user-plan-popup.component';

@Component({
    selector: 'app-people-single-scope-page',
    templateUrl: './people-single-scope-page.component.html',
    styleUrls: ['./people-single-scope-page.component.scss'],
    providers: [
        { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '500ms' } }
    ]
})
export class PeopleSingleScopePageComponent implements OnInit {
    // @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    // @ViewChild(MatTabGroup, { static: false }) tabgroupeditor: MatTabGroup;
    // @ViewChild(SatPopover, { static: false }) changeLogPopover: SatPopover;

    // @ViewChild('file', { static: true }) file: ElementRef;

    @Input() scope: Scope;
    @Input() userAccount: Person;
    @Input() currentCompany: Company = new Company();

    PERSON_PROPERTY = PERSON_PROPERTY;

    people: Person[];
    currentEditPerson: Person = Person.Empty();
    currentPersonHistory: PersonHistory[] = [];

    isSafetyUsers: boolean;
    titleCard: string;

    sites: Site[];
    areasAvailable: Area[];
    sortedAreas: Area[];
    page = 1;
    itemsPerPage = '10';
    limit: any = 10;
    totalItems = null;
    search = '';
    sortBy = '-1';
    sortKey = null;
    noRecordFound = false;
    //employeesDisplayedColumns: string[] = [ 'wheelAction', 'Name', 'Surname', 'Area', 'JobTitle', 'Role', 'action'];
    employeesDisplayedColumns: string[] = ['state', 'select', 'wheelAction', 'Name', 'Surname', 'Area', 'JobTitle', 'Role'];
    filterCallback: Function;
    // userAccount: Person;

    disputeAvailable: boolean = false;
    economicsAvailable: boolean = false;
    settingsAvailable: boolean = false;

    showCard: boolean = true;
    //scope: PERSON_SCOPE;
    //    dashboardUrl: SafeResourceUrl;
    private _searchSubject: Subject<string> = new Subject();
    sidebarMenuName: string;
    @ViewChild('table') table: MatTable<any>;

    constructor(private adminUserManagementService: AdminUserManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private notifyManagementService: NotifyManagementService,
        private userCapabilityService: UserCapabilityService,
        private router: Router,
        private helper: MCPHelperService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        public translate: TranslateService,
        private reportManagementService: ReportManagementService,
        private excelService: ExcelService,
    ) {
        this.filterCallback = this.filterPerson.bind(this);
        this._setSearchSubscription();
    }

    async ngOnInit(): Promise<void> {
        this.sideMenuName();
        this.disputeAvailable = this.userCapabilityService.isFunctionAvailable('People/*/Dispute');
        this.economicsAvailable = this.userCapabilityService.isFunctionAvailable('People/*/Economics');
        const request = { scope: this.scope.name, search: '', page: this.page, limit: this.itemsPerPage, sortBy: '', sortKey: '' };
        await this.loadUserList(request);
    }
    sideMenuName() {
        this.sidebarMenuName = 'People';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    filterPerson(filterValue: string, data: any): any {
        return Person.filterMatch(data, filterValue);
    }

    async loadUserList(request): Promise<void> {
        const res: any = await this.adminUserManagementService.getPeople(this.userAccount.companyId, request);
        this.people = res.data;
        //console.log('this.people',this.people);

        this.noRecordFound = this.people.length > 0;
        this.totalItems = res.meta.totalCount;
    }

    // multiple delete
    // checkboxvalue: boolean = false;

    // toggleAllSelection(checkboxvalue: any){

    //   for (var i = 0; i < this.people.length; i++) {
    //     this.people[i].checked = checkboxvalue.checked;
    //     if (checkboxvalue.checked){
    //       this.checkboxvalue = true;
    //     }else {
    //       this.checkboxvalue = false;
    //     }
    //   }
    // }

    getUserSafetyGroups(user: User): any {
        if (user.safetyGroups && (user.safetyGroups.length > 0)) {
            let result = '';
            user.safetyGroups.forEach(val => result += ' ' + User.mapUserSafetyGroup(val) + ' ');
            return result;
        }
        return '';
    }


    isEditConfirmEnabled(): any {
        return this.commonService.isValidField(this.currentEditPerson.name) &&
            this.commonService.isValidField(this.currentEditPerson.surname) &&
            this.commonService.isValidField(this.currentEditPerson.email);
    }

    openDeleteDialog(event): void {
        const that = this
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: this.translate.instant('Are you sure you want to delete this') + ' ' + this.scope.name + '?',
                heading: 'Delete ' + this.scope.name
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                this.helper.toggleLoaderVisibility(true);
                this.adminUserManagementService.deletePerson(event.id);
                this.helper.toggleLoaderVisibility(false);
                const request = { scope: this.scope.name, search: '', page: this.page, limit: this.itemsPerPage, sortBy: '', sortKey: '' };
                setTimeout(() => {
                    this.loadUserList(request);
                }, 100);
                this.selection.clear();
                swal.fire(
                    '',
                    this.scope.name + ' ' + this.translate.instant('has been deleted successfully'),
                    'success'
                )
                if ((this.people.length - 1) == 0) {
                    let pageNumber = this.page - 1
                    this.pageChanged(pageNumber)
                    // that.getRole(this.requestParaR);
                    this.table.renderRows();
                }
                else {
                    that.loadUserList(request);
                }
                this.selection.clear();
            }
        })

    }

    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this._searchSubject.next(searchTextValue);
    }

    pageChanged(page): void {
        this.selection.clear();
        this.loadUserList({ scope: this.scope.name, page, limit: this.itemsPerPage });
        this.page = page;
    }

    // changeSelectOption(): void {
    //   this.loadUserList({scope: this.scope.name, page: this.page, limit: this.itemsPerPage, search: this.search, sortBy : Number(this.sortKey), sortKey: this.sortBy});
    // }

    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.selection.clear();
        this.page = 1;
        this.itemsPerPage = event
        this.loadUserList({
            scope: this.scope.name,
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
    }

    changeSorting(sortKey, sortBy): void {
        this.selection.clear();
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.loadUserList({ scope: this.scope.name, page: 1, limit: this.limit, search: this.search, sortBy: Number(this.sortBy), sortKey: this.sortKey });
    }

    private _setSearchSubscription(): void {
        this._searchSubject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.selection.clear();
            this.page = 1;
            this.loadUserList({ scope: this.scope.name, page: 1, limit: this.limit, search: this.search, sortBy: Number(this.sortBy), sortKey: this.sortKey });
        });
    }
    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch(): void {
        this.selection.clear();
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.search = ''
        this.loadUserList({ scope: this.scope.name, page: 1, limit: this.limit, search: '', sortBy: Number(this.sortBy), sortKey: this.sortKey });
    }
    edit(event): void {
        this.router.navigate([`people/edit-employee/` + event.id]);
    }

    changeLog(event): void {
        this.selection.clear();
        const dialogRef = this.dialog.open(ChangeLogDialogPopupComponent, {
            data: {
                message: '',
                heading: '',
                id: event.id,
            }
        });
    }

    async showUserActivity(person: Person): Promise<void> {
        let csv = '';
        let saveCSV = (fileName) => {
            if (csv) {
                var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
                saveAs(blob, fileName);
            }
        };

        let res = await this.dialog.open(ShowUserActivityPopupComponent, {
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

    async onDownloadUserPresenceReport() {
        this.selection.clear();
        let csv = '';
        let saveCSV = (fileName) => {
            if (csv) {
                var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
                saveAs(blob, fileName);
            }
        };
        let res = await this.dialog.open(ShowUserActivityPopupComponent, {}).afterClosed().toPromise();
        if (res) {
            let now = new Date();
            let year = now.getFullYear();

            if (res == -1) {
                let startDate = this.commonService.toYYYYMMDD(new Date(year, 0, 1));
                let endDate = this.commonService.toYYYYMMDD(new Date(year, 11, 31));

                csv = await this.reportManagementService.getUserActivitiesCSV(this.scope.name, null, startDate, endDate);
                saveCSV(`irina-activity-report-full-${year}.csv`);
                swal.fire(
                    '',
                    this.translate.instant('INSIGHTS_PEOPLE_PAGE.DOWNLOAD_SUCCESSFULLY'),
                    'success'
                );
            } else {
                let startDate = this.commonService.toYYYYMMDD(new Date(year, res - 1, 1));
                let endDate = this.commonService.toYYYYMMDD(new Date(year, res, 0));

                csv = await this.reportManagementService.getUserActivitiesCSV(this.scope.name, null, startDate, endDate);
                saveCSV(`irina-activity-report-full-${year}-${res}.csv`);
                swal.fire(
                    '',
                    this.translate.instant('INSIGHTS_PEOPLE_PAGE.DOWNLOAD_SUCCESSFULLY'),
                    'success'
                );
            }
        }
    }

    async onExportUser() {
        this.selection.clear();
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
            swal.fire(
                '',
                this.translate.instant('INSIGHTS_PEOPLE_PAGE.EXPORT_SUCCESSFULLY'),
                'success'
            );
        } else if (data.reason) {
            swal.fire(
                '',
                this.translate.instant(data.reason),
                'error'
            );
            // this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.ERROR DOWNLOADING'), 'OK', {
            //   duration: 3000,
            //   panelClass: 'success'
            // })
        }
    }

    async importPeopleData(scopeName) {
        this.selection.clear();
        let res = await this.dialog.open(ImportPeopleReportPopupComponent, {
            data: {
                scope: scopeName
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                const request = { scope: this.scope.name, search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: '' };
                this.loadUserList(request);
            }
        });
    }


    selection = new SelectionModel<any>(true, []);

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        if (this.people != undefined && this.people.length > 0) {
            const numRows = this.people.length;
            return numSelected === numRows;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.people);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    peopleID = []
    deleteMultiPeople() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message:
                    'Are you sure you want to delete selected Employees ?',
                heading: 'Delete Employees',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this

                this.helper.toggleLoaderVisibility(true);
                for (let i = 0; i < this.selection.selected.length; i++) {
                    if (this.selection.selected) {
                        let paraName: string = this.selection.selected[i].id;
                        console.log('paraName', paraName);
                        this.peopleID.push(paraName);
                    }
                }
                if (this.peopleID.length > 0) {
                    this.helper.deleteMultiPeople({ id: this.peopleID }).subscribe((res: any) => {
                        if (res.result === true) {
                            const request = { scope: this.scope.name, search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: '' };
                            this.loadUserList(request);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            this.peopleID = []
                            swal.fire(
                                '',
                                this.scope.name + ' ' + this.translate.instant('has been deleted successfully'),
                                'success'
                            );
                            setTimeout(() => {
                                if ((this.people.length) == 0) {
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    // that.getRole(this.requestParaR);
                                    this.table.renderRows();
                                }
                                else {
                                    that.loadUserList(request);
                                }
                            }, 100);
                        } else {
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                this.translate.instant(res.reason),
                                'error'
                            );
                        }
                    })
                } else {
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        this.translate.instant('Please select atleast one people.'),
                        'info'
                    );
                }

            }
        });
    }

    async showUserPlan(person: Person) {
        console.log('showUserPlan ', person);

        let res = await this.dialog.open(UserPlanPopupComponent, { data: { person: person } }).afterClosed().toPromise();

    }


}
