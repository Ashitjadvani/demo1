import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { any } from 'codelyzer/util/function';
import { data } from 'jquery';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { RecruitingCandidateManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-candidate-management.service';
import { Subject } from 'rxjs';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { UserCapabilityService } from '../../../service/user-capability.service';
import { ConfirmPopupComponent } from '../../../popup/confirm-popup/confirm-popup.component';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';


// Delete popup Dialog data
export interface DialogData {
    message: any;
    heading: any;
}

@Component({
    selector: 'app-candidates',
    templateUrl: './candidates.component.html',
    styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit, OnDestroy {
    candidates_data: any = new MatTableDataSource([]);
    page: any = 1;
    itemsPerPage: any = '10';
    totalItems: any = 0;
    limit: any = 10;
    search: any = '';
    sortBy: any = '-1';
    sortKey = null;
    sortClass: any = 'down';
    noRecordFound = false;
    filter: any;
    momentTime: any = new Date().getTime();
    public requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '', type: '', appliedJobs: '' };
    public config: PaginationInstance = {
        id: 'advanced',
        itemsPerPage: 5,
        currentPage: this.page
    };

    //displayedColumns: string[] = ['Surname', 'Name', 'age', 'Email', 'PhoneNo', 'Degree', 'DegreeMark', 'viewDetails', 'action'];
    displayedColumns: string[] = ['select', 'view', 'Surname', 'Name', 'age', 'Email', 'PhoneNo', 'Degree', 'DegreeMark'];
    resultsLength = 0;
    thisWeekTrue: any = '';
    thisAppliedCheck: boolean = false;
    thisWeekCheck: boolean = false;

    public selectedRow: any = [];
    private subject: Subject<string> = new Subject();
    sidebarMenuName: string;
    @ViewChild('table') table: MatTable<any>;

    allowDelete: boolean;
    allowRemainder: boolean;

    constructor(public dialog: MatDialog,
        private ApiServices: RecruitingCandidateManagementService,
        private userCapabilityService: UserCapabilityService,
        private commonService: CommonService,
        private helper: MCPHelperService,
        private router: Router,
        public translate: TranslateService,
        public activatedRoute: ActivatedRoute) {
        this._setSearchSubscription();
        this.allowDelete = this.userCapabilityService.isFunctionAvailable('Candidates/Delete');
        this.allowRemainder = this.userCapabilityService.isFunctionAvailable('Recruiting/Remainder');
    }



    async ngOnInit(): Promise<void> {
        this.sideMenuName();
        document.body.classList.add('candidate-list');
        const request = { search: '', page: this.page, limit: this.itemsPerPage, sortBy: '', sortKey: '' };
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params.value) {
                this.thisWeekTrue = params.value;
                this.thisAppiedJobTrue = params.value;
                if (params.value == 'candidateThisWeek') {
                    this.thisWeekCheck = true;
                }
                else if (params.value == 'appliedJobs') {
                    this.thisAppliedCheck = true;
                    this.thisWeekCheck = true;
                    this.thisWeekTrue = 'candidateThisWeek';
                } else {
                    this.thisAppliedCheck = false;
                    this.thisWeekCheck = false;
                }
            }
        });
        this.requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, appliedJobs: this.thisAppiedJobTrue }
        await this.getCandidateList(this.requestPara);
    }

    sideMenuName() {
        this.sidebarMenuName = 'Candidates';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async getCandidateList(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        // if (this.thisWeekTrue !== ''){
        //   this.requestPara = {search: this.search, page: this.page, limit: this.limit, sortBy: this.sortBy, sortKey: this.sortKey, type : this.thisWeekTrue};
        // }
        const res: any = await this.ApiServices.getCandidateList(this.requestPara);
        if (res.statusCode === 200) {
            this.candidates_data = res.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.candidates_data.length > 0;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant(res.reason),
                'info'
            );
        }
    }


    // Sorting
    changeSorting(sortKey, sortBy): void {
        // this.search = '';
        this.selection.clear();
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.getCandidateList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            appliedJobs: this.thisAppiedJobTrue
        });
    }

    onDownloadUserPresenceReport(): void {
        this.selection.clear();
        this.helper.toggleLoaderVisibility(true);
        let data = this.candidates_data;
        const replacer = (key, value) => value === null ? '-' : value; // specify how you want to handle null values here
        const header = [
            'nome',
            'cognome',
            'email'
        ];
        let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');
        var blob = new Blob([csvArray], { type: 'text/csv' });
        saveAs(blob, 'candidate-report-' + this.momentTime + '.csv');
        setTimeout(() => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant('Candidate report downloaded successfully'),
                'success'
            );
        }, 500);

    }

    openDeleteDialog(event: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: { message: 'Are you sure you want to Delete this candidate?', heading: 'Delete Candidate' }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    that.ApiServices.deleteCandidate(event.id).then((data: any) => {
                        const metaData: any = data.reason;
                        this.getCandidateList(this.requestPara);
                        this.selection.clear();
                        swal.fire(
                            '',
                            this.translate.instant('Candidate has been deleted successfully'),
                            'success'
                        );
                        this.helper.toggleLoaderVisibility(false);
                        if ((this.candidates_data.length - 1) == 0) {
                            let pageNumber = this.page - 1
                            this.pageChanged(pageNumber)
                            // that.getRole(this.requestParaR);
                            this.table.renderRows();
                        }
                        else {
                            that.getCandidateList(this.requestPara);
                        }
                        this.selection.clear();
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        const e = err.error;
                        swal.fire(
                            '',
                            this.translate.instant(err.error.message),
                            'info'
                        );
                        this.selection.clear();
                    });
                }
            });
    }

    // View Detail
    async viewDetail(event): Promise<void> {
        this.router.navigate([`/recruiting/candidates/view-candidates/` + event.id]);
        if (event.isReadCandidate) {
            await this.ApiServices.readCandidate({ id: event.id });
            this.helper.updateSideMenuData();
        }
    }
    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.selection.clear();
        this.page = 1;
        this.itemsPerPage = event
        this.getCandidateList(this.requestPara = {
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            appliedJobs: this.thisAppiedJobTrue
        });
        this.limit = this.itemsPerPage;
    }

    pageChanged(page): void {
        // this.search = '';
        this.selection.clear();
        this.getCandidateList(this.requestPara = {
            page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            appliedJobs: this.thisAppiedJobTrue
        });
        this.page = page;
    }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.selection.clear();
            this.page = 1;
            this.getCandidateList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey, type: this.thisWeekTrue,
                appliedJobs: this.thisAppiedJobTrue
            });
        });
    }
    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch(): void {
        this.selection.clear();
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.getCandidateList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            appliedJobs: this.thisAppiedJobTrue
        });
    }

    ngOnDestroy(): void {
        document.body.classList.remove('candidate-list');
    }

    async showThisWeekList(event) {
        if (event) {
            this.thisWeekTrue = 'candidateThisWeek';
            this.pageChanged(1);
            this.requestPara = { search: this.search, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, appliedJobs: this.thisAppiedJobTrue };
            await this.getCandidateList(this.requestPara);

        } else {
            this.thisWeekTrue = '';
            this.pageChanged(1);
            this.requestPara = { search: this.search, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, appliedJobs: this.thisAppiedJobTrue };
            await this.getCandidateList(this.requestPara);
        }
    }
    thisAppiedJobTrue: any;
    async showAppliedJobList(event) {
        if (event) {
            this.thisAppiedJobTrue = 'appliedJobs';
            this.pageChanged(1);
            this.requestPara = { search: this.search, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, appliedJobs: this.thisAppiedJobTrue };
            await this.getCandidateList(this.requestPara);
        } else {
            this.thisAppiedJobTrue = '';
            this.pageChanged(1);
            this.requestPara = { search: this.search, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, appliedJobs: this.thisAppiedJobTrue };
            await this.getCandidateList(this.requestPara);
        }
    }

    // multiple delete
    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.candidates_data.length; i++) {
            this.candidates_data[i].checked = checkboxvalue.checked;
            if (checkboxvalue.checked) {
                this.checkboxvalue = true;
            } else {
                this.checkboxvalue = false;
            }
        }
    }

    selection = new SelectionModel<any>(true, []);

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.candidates_data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.candidates_data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    candidateID = []
    async deleteMultiCandidate() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message:
                    'Are you sure you want to delete selected Candidates?',
                heading: 'Delete Candidates',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this

                this.helper.toggleLoaderVisibility(true);
                this.selectedItems();
                if (this.candidateID.length > 0) {
                    this.helper.deleteMultiCandidates({ id: this.candidateID }).subscribe((res: any) => {
                        if (res.result === true) {
                            this.getCandidateList(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            this.candidateID = [];
                            swal.fire(
                                '',
                                this.translate.instant('Candidate has been deleted successfully'),
                                'success'
                            );
                            setTimeout(() => {
                                if ((this.candidates_data.length) == 0) {
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    // that.getRole(this.requestParaR);
                                    this.table.renderRows();
                                }
                                else {
                                    that.getCandidateList(this.requestPara);
                                }
                            }, 200);
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
                        this.translate.instant('Please select atleast one candidate to delete.'),
                        'info'
                    );
                }
            }
        });
    }

    async selectedItems() {
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let paraName: string = this.selection.selected[i].id;
                this.candidateID.push(paraName);
            }
        }
    }

    async onRefreshTable() {
        await this.getCandidateList(this.requestPara);
    }

    async onEditRemainder() {
        this.router.navigate([`/recruiting/candidates/edit-candidate-remainder`]);
    }

    async onSendRemainder() {
        const dialogRef = this.dialog.open(ConfirmPopupComponent, {
            data: {
                message:
                    this.translate.instant('RECRUITING.SendRemainderAreYouSure'),
                heading: this.translate.instant('RECRUITING.SendRemainder'),
            },
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                this.helper.toggleLoaderVisibility(true);

                let res = await this.ApiServices.sendCandidatesRemainder();

                this.helper.toggleLoaderVisibility(false);

                if (!this.commonService.isValidResponse(res)) {
                    swal.fire('', this.translate.instant(res.reason), 'error');
                }
            }
        });
    }
}
