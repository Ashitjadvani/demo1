import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import { RecrutingJobOpeningManagementService } from '../../../../../../fe-common-v2/src/lib/services/recruting-job-opening-management.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SeeLogComponent } from '../../../popup/see-log/see-log.component';
import { SelectionModel } from '@angular/cdk/collections';
import { UserCapabilityService } from '../../../service/user-capability.service';

@Component({
    selector: 'app-job-openings',
    templateUrl: './job-openings.component.html',
    styleUrls: ['./job-openings.component.scss']
})
export class JobOpeningsComponent implements OnInit {
    jobOpeningList: any = new MatTableDataSource([]);
    page: any = 1;
    itemsPerPage: any = '10';
    totalItems: any = 0;
    limit: any = 10;
    search: any = '';
    sortBy: any = '-1';
    type: any = '';
    sortKey = null;
    sortClass: any = 'down';
    noRecordFound = false;
    filter: any;
    thisWeekTrue: any = '';
    public requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue };
    //jobOpeningsDisplayedColumns: string[] = ['view', 'area', 'jobType', 'scope', 'description', 'totalApplications', 'waitingCount', 'underReviewed', 'hired', 'refused', 'status', 'view-details', 'action'];
    jobOpeningsDisplayedColumns: string[] = ['select', 'wheelAction', 'area', 'jobType', 'scope', 'description', 'totalApplications', 'waitingCount', 'underReviewed', 'hired', 'refused', 'status'];
    private subject: Subject<string> = new Subject();
    thisWeekCheck: boolean = false;
    sidebarMenuName: string;
    @ViewChild('table') table: MatTable<any>;

    allowDelete: boolean;
    allowEdit: boolean;

    constructor(public dialog: MatDialog,
        private router: Router,
        private ApiService: RecrutingJobOpeningManagementService,
        private userCapabilityService: UserCapabilityService,
        private helper: MCPHelperService,
        public translate: TranslateService,
        public activatedRoute: ActivatedRoute) {
        this._setSearchSubscription();
        this.allowDelete = this.userCapabilityService.isFunctionAvailable('JobOpenings/Delete');
        this.allowEdit = this.userCapabilityService.isFunctionAvailable('JobOpenings/Edit');
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params.value) {
                this.thisWeekTrue = params.value;
                if (params.value == 'openingThisWeek') {
                    this.thisWeekCheck = true;
                } else {
                    this.thisWeekCheck = false;
                }
            }
        });
        this.requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue }
        this.getJobOpening(this.requestPara);
    }

    sideMenuName() {
        this.sidebarMenuName = 'Job Openings';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async getJobOpening(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        // if (this.thisWeekTrue !== ''){
        //   this.requestPara = {search: this.search, page: this.page, limit: this.limit, sortBy: this.sortBy, sortKey: this.sortKey, type : this.thisWeekTrue};
        // }
        const res: any = await this.ApiService.getJobOpening(this.requestPara);
        if (res) {
            this.jobOpeningList = res.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.jobOpeningList.length > 0;
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
        this.helper.toggleLoaderVisibility(false);
    }

    jobOpeningsDeleteDialog(event: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: { message: 'Are you sure you want to delete this job opening?', heading: 'Delete Job Opening' }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    that.ApiService.deleteJob(event.id).then((data: any) => {
                        const metaData: any = data.reason;
                        this.getJobOpening(this.requestPara);
                        this.selection.clear();
                        swal.fire(
                            '',
                            this.translate.instant("Job deleted successfully"),
                            'success'
                        );
                        this.helper.toggleLoaderVisibility(false);
                        if ((this.jobOpeningList.length - 1) == 0) {
                            let pageNumber = this.page - 1
                            this.pageChanged(pageNumber)
                            // that.getRole(this.requestParaR);
                            this.table.renderRows();
                        }
                        else {
                            that.getJobOpening(this.requestPara);
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

    seeLogDialog(event: any) {
        this.selection.clear();
        const dialogRef = this.dialog.open(SeeLogComponent, {
            data: {
                id: event.id,
            },
        });
    }

    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.selection.clear();
        this.itemsPerPage = event
        this.page = 1;
        this.getJobOpening(this.requestPara = {
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy, 
            sortKey: this.sortKey, type: this.thisWeekTrue
        });
        this.limit = this.itemsPerPage;
    }

    pageChanged(page): void {
        // this.search = '';
        this.selection.clear();
        this.getJobOpening(this.requestPara = {
            page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy, 
            sortKey: this.sortKey, type: this.thisWeekTrue
        });
        this.page = page;
    }

    // Sorting
    changeSorting(sortKey, sortBy): void {
        // this.search = '';
        this.selection.clear();
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.getJobOpening(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy, 
            sortKey: this.sortKey,type: this.thisWeekTrue
        });
    }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.selection.clear();
            this.page = 1;
            this.getJobOpening(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy, 
                sortKey: this.sortKey, type: this.thisWeekTrue
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
        this.getJobOpening(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy, 
            sortKey: this.sortKey, type: this.thisWeekTrue
        });
    }
    // View Detail
    viewDetail(event): void {
        this.router.navigate([`/recruiting/job-openings/view-application/` + event.id]);
    }

    edit(event): void {
        this.router.navigate([`/recruiting/job-openings/add-edit-job-opening/` + event.id]);
    }

    async showThisWeekList(event) {
        this.selection.clear();
        if (event) {
            this.thisWeekTrue = 'openingThisWeek';
            this.pageChanged(1);
            this.requestPara = { search: this.search, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue };
            await this.getJobOpening(this.requestPara);
        } else {
            this.thisWeekTrue = '';
            this.pageChanged(1);
            this.requestPara = { search: this.search, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue };
            await this.getJobOpening(this.requestPara);
        }
    }

    // multiple delete
    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.jobOpeningList.length; i++) {
            this.jobOpeningList[i].checked = checkboxvalue.checked;
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
        const numRows = this.jobOpeningList.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.jobOpeningList);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    openingID = []
    async deleteMultiOpening() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message:
                    'Are you sure you want to delete selected Job Openings?',
                heading: 'Delete Job Openings',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this

                this.helper.toggleLoaderVisibility(true);
                this.selectedItems();
                if (this.openingID.length > 0) {
                    this.helper.deleteMultiOpenings({ id: this.openingID }).subscribe((res: any) => {
                        if (res.result === true) {
                            this.getJobOpening(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            this.openingID = [];
                            swal.fire(
                                '',
                                this.translate.instant('Job deleted successfully'),
                                'success'
                            );
                            setTimeout(() => {
                                if ((this.jobOpeningList.length) == 0) {
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    // that.getRole(this.requestParaR);
                                    this.table.renderRows();
                                }
                                else {
                                    that.getJobOpening(this.requestPara);
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
                        this.translate.instant('Please select atleast one job opening to delete.'),
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
                console.log('paraName', paraName);
                this.openingID.push(paraName);
            }
        }
    }
    
    async onRefreshTable() {
        await this.getJobOpening(this.requestPara);
    }
}
