import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../popup/delete-popup/delete-popup.component';
import { ImportAccountComponent } from '../../popup/import-account/import-account.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AccountService } from '../../../../../fe-common-v2/src/lib/services/account.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MCPHelperService } from '../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
    accountsList: any = new MatTableDataSource([]);
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
    sidebarMenuName: string;


    public requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '' };
    AccountsDisplayedColumns: string[] = ['select', 'wheelAction', 'accountID', 'name', 'surname', 'authentication', 'firstLogin', 'lastLogin'];
    private subject: Subject<string> = new Subject();
    @ViewChild('table') table: MatTable<any>;

    constructor(public dialog: MatDialog,
        private ApiServices: AccountService,
        private router: Router,
        private helper: MCPHelperService,
        public translate: TranslateService) {
        this._setSearchSubscription();
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.getAccList(this.requestPara);
    }

    sideMenuName() {
        this.sidebarMenuName = 'Accounts';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    getAccList(request): any {
        this.ApiServices.getAccounts(this.requestPara).subscribe((res: any) => {
            this.helper.toggleLoaderVisibility(true);
            if (res.statusCode === 200) {
                this.accountsList = res.data;
                this.totalItems = res.meta.totalCount;
                this.noRecordFound = this.accountsList.length > 0;
                this.helper.toggleLoaderVisibility(false);
            }
        }, (err: any) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            );

        });
    }

    //   if (data && data?.meta && data.meta.status == 1) {
    //   if (data.meta.status == 1) {
    //   this.userList = data.data
    // } else {
    //   this.toastr.error(data.meta.message, 'Error!');
    // }
    // } else {
    //   this.toastr.error("Something went wrong!", 'Error!');
    // }

    // edit
    edit(event): void {
        this.router.navigate([`accounts/add-edit-account/` + event.id]);
    }

    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    openAccountDeleteDialog(event: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: { message: 'Are you sure you want to delete this Account?', heading: 'Delete Account' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ApiServices.deleteAcc(event.id).subscribe((data: any) => {
                    const metaData: any = data.reason;
                    // this.featuresList.splice(index, 1);
                    this.getAccList(this.requestPara);
                    this.selection.clear();
                    swal.fire(
                        '',
                        this.translate.instant('Account has been deleted successfully'),
                        'success'
                    );
                    console.log('this.accountsList', this.accountsList);
                    if ((this.accountsList.length - 1) == 0) {
                        let pageNumber = this.page - 1
                        this.pageChanged(pageNumber)
                        // that.getRole(this.requestParaR);
                        this.table.renderRows();
                    }
                    else {
                        that.getAccList(this.requestPara);
                    }
                    this.selection.clear();
                }, (err: any) => {
                    const e = err.error;
                    swal.fire(
                        '',
                        this.translate.instant(err.error.message),
                        'info'
                    );
                });
            }
            this.selection.clear();
        });
    }

    openImportAccountDialog(): void {
        this.selection.clear();
        const dialogRef = this.dialog.open(ImportAccountComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.helper.toggleLoaderVisibility(true);
            if (result === true) {
                this.helper.toggleLoaderVisibility(false);
                this.getAccList(this.requestPara);
            } else {
                this.helper.toggleLoaderVisibility(false);
            }
        });
    }

    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.page = 1;
        this.itemsPerPage = event
        this.selection.clear();
        this.getAccList(this.requestPara = {
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
    }

    pageChanged(page: number): void {
        // this.search = '';
        this.selection.clear();
        this.getAccList(this.requestPara = {
            page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
        });
        this.page = page;
    }

    // Sorting
    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.selection.clear();
        this.getAccList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch() {
        this.search = '';
        this.selection.clear();
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.getAccList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.page = 1;
            this.selection.clear();
            this.getAccList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            });
        });
    }
    // multiple delete
    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.accountsList.length; i++) {
            this.accountsList[i].checked = checkboxvalue.checked;
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
        const numRows = this.accountsList.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.accountsList);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    accountsID = []
    deleteMultiAccounts() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message:
                    'Are you sure you want to delete selected Accounts?',
                heading: 'Delete Accounts',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this

                this.helper.toggleLoaderVisibility(true);
                for (let i = 0; i < this.selection.selected.length; i++) {
                    if (this.selection.selected) {
                        let paraName: string = this.selection.selected[i].id;
                        this.accountsID.push(paraName);
                    }
                }
                if (this.accountsID.length > 0) {
                    this.helper.deleteMultiAccounts({ id: this.accountsID }).subscribe((res: any) => {
                        if (res.result === true) {
                            this.getAccList(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            this.accountsID = [];
                            swal.fire(
                                '',
                                this.translate.instant('Account has been deleted successfully'),
                                'success'
                            );
                            setTimeout(() => {
                                if ((this.accountsList.length) == 0) {
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    // that.getRole(this.requestParaR);
                                    this.table.renderRows();
                                }
                                else {
                                    that.getAccList(this.requestPara);
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
                        this.translate.instant('Please select atleast one account to delete.'),
                        'info'
                    );
                }

            }
        });
    }


}
