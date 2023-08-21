import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {AddContactComponent} from '../../popups/add-contact/add-contact.component';
import {DeletePopupComponent} from '../../popups/delete-popup/delete-popup.component';
import {NSApiService} from '../../service/NSApi.service';
import swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';
import {of, Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {NSHelperService} from '../../service/NSHelper.service';
import {SelectionModel} from '@angular/cdk/collections';

export interface DialogData {
    message: any;
    heading: any;
}

@Component({
    selector: 'app-contact-type',
    templateUrl: './contact-type.component.html',
    styleUrls: ['./contact-type.component.scss']
})
export class ContactTypeComponent implements OnInit {
    contactType: any = new MatTableDataSource([]);
    public requestPara = {page: 1, limit: 10, search: '', sortBy: '', sortKey: ''};
    private subject: Subject<string> = new Subject();
    documentData: any;
    document: any;
    documentName: any;
    editMode: string = 'Add';
    page = 1;
    itemsPerPage = '10';
    totalItems: any = 0;
    limit: any = 10;
    sortBy: any = '-1';
    sortKey = null;
    sortClass: any = 'down';
    sidebarMenuName: string;
    @ViewChild('table') table: MatTable<any>;

    constructor(
        public dialog: MatDialog,
        private  Api: NSApiService,
        private route: ActivatedRoute,
        private helper: NSHelperService
    ) {
        const id = this.route.snapshot.paramMap.get('id');
    }

    displayedColumns: string[] = ['select', 'wheelAction', 'contactType', 'status'];
    resultsLength = 0;
    public filter: any;

    // searching
    onKeyUp(event: any): any {
        this.page = 1;
        this.subject.next(event.target.value);
    }

    sideMenuName() {
        this.sidebarMenuName = 'Contact Type';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.getContactTypeData(this.requestPara);
        this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
            this.applyFilter(searchTextValue);
        });
    }

    applyFilter(filterValue: string): void {
        if (filterValue) {
            filterValue = filterValue.trim();
            filterValue = filterValue.toLowerCase();
        }
        this.filter = filterValue;
        this.contactType.data = [];

        this.requestPara = {
            page: this.page,
            limit: this.limit,
            search: filterValue,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.getContactTypeData(this.requestPara);
    }

    // Sorting
    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.getContactTypeData(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.filter,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    // listing api called
    getContactTypeData(req: any): any {
        this.helper.toggleLoaderVisibility(true);
        this.Api.contactType(req).subscribe((res: any) => {
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                this.contactType = res.data;
                this.totalItems = res.meta.totalCount;
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

    // delete
    openDialog(id: any, index: number, event: any): any {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete this Contact Type?', heading: 'Delete Contact Type'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.Api.deleteContact({id: id}).subscribe((res: any) => {
                    const metaData: any = res.meta.message;
                    this.contactType.splice(index, 1);
                    this.contactType = new MatTableDataSource(this.contactType);
                    this.getContactTypeData((this.requestPara));
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

    // add
    openDialog1(id: any): any {
        const dialogRef = this.dialog.open(AddContactComponent, {
            data: {
                heading: 'Add Contact Type',
                id: id
            }
        });
        dialogRef.afterClosed().subscribe((com: any) => {
            if (com === true) {
                this.getContactTypeData(this.requestPara);
            }
        });
        this.getContactTypeData(this.requestPara);
    }

    // edit
    openDialog2(name: any, statusId: any, id: any): any {
        const dialogRef = this.dialog.open(AddContactComponent, {
            data: {
                heading: 'Edit Contact Type',
                id: id,
                name: name,
                statusId: statusId
            }
        });
        dialogRef.afterClosed().subscribe((com: any) => {
            if (com === true) {
                setTimeout(() => {
                    this.getContactTypeData(this.requestPara);
                }, 300)
            }
        });
        //this.getContactTypeData(this.requestPara);
    }


    // shorting
    sortContact(sort: Sort): void {
        const data = this.contactType.slice();
        if (!sort.active || sort.direction === '') {
            this.contactType = data;
            return;
        }
        this.contactType = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name':
                    return compare(a.name, b.name, isAsc);
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


    //  pagination
    pageChanged(page): void {
        this.getContactTypeData({page, limit: this.itemsPerPage});
        this.page = page;
    }

    changeItemsPerPage(): void {
        this.getContactTypeData({page: 1, limit: this.itemsPerPage});
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
        this.getContactTypeData(this.requestPara);
    }


    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.contactType.length; i++) {
            this.contactType[i].checked = checkboxvalue.checked;
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
        const numRows = this.contactType.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.contactType);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    //multiple delete record
    sitesID = []

    deleteMultiContactTypes() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Are you sure you want to delete selected Contact Type?',
                heading: 'Delete Contact Types',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this
                this.helper.toggleLoaderVisibility(true);
                for (let i = 0; i < this.selection.selected.length; i++) {
                    if (this.selection.selected) {
                        let paraName: string = this.selection.selected[i].id;
                        this.sitesID.push(paraName);
                    }
                }

                if (this.sitesID.length > 0) {
                    this.sitesID.toString()
                    this.Api.deleteContact({id: this.sitesID.toString()}).subscribe((res: any) => {
                        console.log('ressss', res);
                        if (res.statusCode === 200) {
                            this.getContactTypeData(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            swal.fire(
                                'Deleted',
                                'Contact Type has been deleted successfully',
                                'success'
                            );
                            setTimeout(() => {

                                if ((this.contactType.length) == 0) {
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    this.table.renderRows();
                                } else {
                                    that.getContactTypeData(this.requestPara);
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
                        'Please select atleast one Contact Type to delete.',
                        'info'
                    );
                }

            }
        });
    }

}
