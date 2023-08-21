import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeletePopupComponent} from '../../popups/delete-popup/delete-popup.component';
import {NSApiService} from '../../service/NSApi.service';
import swal from 'sweetalert2';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Sort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {NSHelperService} from '../../service/NSHelper.service';
import {SelectionModel} from '@angular/cdk/collections';
import {TranslateService} from '@ngx-translate/core';


export interface DialogData {
    message: any;
    heading: any;
}

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
    public requestPara = {page: 1, limit: 10, search: '', sortBy: '', sortKey: ''};
    // public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
    featuresList: any = new MatTableDataSource([]);
    deleteIcon = 'assets/images/delete-action.svg';
    editIcon = 'assets/images/edit-action.svg';
    checked: any;
    page = 1;
    itemsPerPage = '10';
    totalItems: any = 0;
    limit: any = 10;
    sortBy: any = '-1';
    sortKey = null;
    sortClass: any = 'down';
    sidebarMenuName: string;
    private subject: Subject<string> = new Subject();
    @ViewChild('table') table: MatTable<any>;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private api: NSApiService,
        private helper: NSHelperService,
        // private translate: TranslateService,
    ) {
    }

    displayedColumns: string[] = ['select', 'wheelAction', 'featuresTitle', 'mode', 'featuresStatus'];
    resultsLength = 0;

    public filter: any;
    public selectedRow: any = [];


    // Searching
    onKeyUp(event: any): void {
        this.page = 1;
        this.subject.next(event.target.value);
        this.fetch(this.requestPara);
    }

    sideMenuName() {
        this.sidebarMenuName = 'Features';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.fetch(this.requestPara);
        this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
            this.applyFilter(searchTextValue);
        });
    }

    applyFilter(filterValue: string): void {
        if (filterValue) {
            filterValue = filterValue.trim(); // Remove whitespace
            filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        }
        this.filter = filterValue;
        this.featuresList.data = [];

        this.requestPara = {
            page: this.page,
            limit: this.limit,
            search: filterValue,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.fetch(this.requestPara);
    }

    // listing Api called
    fetch(req: any): void {
        this.helper.toggleLoaderVisibility(true);
        this.api.getFeatures(req).subscribe((res: any) => {
            if (res.statusCode === 200){
                this.helper.toggleLoaderVisibility(false);
                this.featuresList = res.data;
                this.totalItems = res.meta.totalCount;
            } else {
                Swal.fire('', res.error.message, 'error')
            }
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            const e = error.error;
            swal.fire(
                'Info!',
                e.message,
                'error'
            );
        });
    }

    // edit
    edit(id: string): void {
        this.router.navigate([`/features/add-features/` + id]);
    }


    // Delete Api called
    openDialog(id: any, index: number, event: any): any {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete this Feature?', heading: 'Delete Feature'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.deleteRec({id: id}).subscribe((data: any) => {
                    const metaData: any = data.meta.message;
                    // this.featuresList.splice(index, 1);
                    this.fetch(this.requestPara);
                    swal.fire(
                        'Deleted!',
                        metaData,
                        'success'
                    );
                }, (err: any) => {
                    const e = err.error;
                    swal.fire(
                        'Error!',
                        err.error.message,
                        'info'
                    );

                });
            }
        });
    }

    //  sorting
    sortData(sort: Sort): void {
        const data = this.featuresList.slice();
        if (!sort.active || sort.direction === '') {
            this.featuresList = data;
            return;
        }
        this.featuresList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name':
                    return compare(a.name, b.name, isAsc);
                case 'mode':
                    return compare(a.mode, b.mode, isAsc);
                case 'statusId':
                    return compare(a.statusId, b.statusId, isAsc);
                default:
                    return 0;
            }
        });

        function compare(a: number | string, b: number | string, isAsc: boolean) {
            return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
        }
    }


    // Pagination
    pageChanged(page): void {
        this.fetch({page, limit: this.itemsPerPage});
        this.page = page;
    }

    changeItemsPerPage(): void {
        this.fetch({page: 1, limit: this.itemsPerPage});
        this.page = 1;
    }

    // Sorting
    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.fetch(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.filter,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }


    button(id: any, status: any): any {
        this.api.changeStatus({id, status}).subscribe((res: any) => {
            this.fetch(this.requestPara);
        });
    }

    changeSlideToggle(status, id): any {
        this.api.changeStatus({id: id, status: status.toString()}).subscribe((res: any) => {
            if (res.statusCode === 200) {
                const metaData: any = res.meta.message;
                swal.fire(
                    'Success!',
                    metaData,
                    'success'
                );
                this.fetch(this.requestPara);
            }
        }, (err: any) => {
            const e = err.error;
            swal.fire(
                'Error!',
                err.error.message,
                'info'
            );

        });
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;

    resetSearch() {
        this.myInputVariable.nativeElement.value = '';
        this.requestPara = {
            page: this.page,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.fetch(this.requestPara);
    }

    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.featuresList.length; i++) {
            this.featuresList[i].checked = checkboxvalue.checked;
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
        const numRows = this.featuresList.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.featuresList);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    sitesID = []

    deleteMultiAlert() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message:
                    'Are you sure you want to delete selected Features?',
                heading: 'Delete Alerts',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this

                this.helper.toggleLoaderVisibility(true);
                for (let i = 0; i < this.selection.selected.length; i++) {
                    if (this.selection.selected) {
                        let paraName: string = this.selection.selected[i].id;
                        // console.log('paraName',paraName);
                        this.sitesID.push(paraName);
                    }
                }

                if (this.sitesID.length > 0) {
                    this.sitesID.toString()
                    this.api.deleteRec({id: this.sitesID.toString()}).subscribe((res: any) => {
                        console.log('ressss', res);
                        if (res.statusCode === 200) {
                            this.fetch(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            swal.fire(
                                'Deleted',
                                'Alert has been deleted successfully',
                                //  this.translate.instant('Alert has been deleted successfully'),
                                'success'
                            );
                            setTimeout(() => {
                                if ((this.featuresList.length) == 0) {
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    this.table.renderRows();
                                } else {
                                    that.fetch(this.requestPara);
                                }
                            }, 200);
                        } else {
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                // this.translate.instant(res.reason),
                                'error'
                            );
                        }
                    })
                } else {
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        //  this.translate.instant('Please select atleast one alert to delete.'),
                        'info'
                    );
                }

            }
        });
    }


}
