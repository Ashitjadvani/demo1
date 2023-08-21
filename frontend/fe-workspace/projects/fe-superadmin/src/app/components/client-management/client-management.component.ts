import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeletePopupComponent} from '../../popups/delete-popup/delete-popup.component';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ChangePasswordPopupComponent} from '../../popups/change-password-popup/change-password-popup.component';
import {PaginationInstance} from 'ngx-pagination/dist/ngx-pagination.module';
import {NSApiService} from '../../service/NSApi.service';
import {debounceTime} from 'rxjs/operators';
import swal from 'sweetalert2';
import {NSHelperService} from '../../service/NSHelper.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {SelectionModel} from "@angular/cdk/collections";


export interface DialogData {
    message: any;
    heading: any;
}

export interface elm {
    colorCode: any;
    logo: any;
    clientName: string;
    contactPerson: string;
    email: string;
    phone: number;
    tenantType: string;
    clientStatus: string;
}

@Component({
    selector: 'app-client-management',
    templateUrl: './client-management.component.html',
    styleUrls: ['./client-management.component.scss']
})
export class ClientManagementComponent implements OnInit {
    clientManagement: any = new MatTableDataSource([]);
    base64Image!: any
    imageData!: any
    clientData: any = new MatTableDataSource([]);
    sortKey = null;
    sortBy: any = '-1';
    searchArea: any = '';
    page = 1;
    itemsPerPage: any = '10';
    totalItems: any = 0;
    limit: any = 10;
    public requestPara = {
        search: '',
        page: 1,
        limit: 10,
        sortBy: '-1',
        sortKey: '',
    };
    sidebarMenuName: string;
    @ViewChild('table') table: MatTable<any>;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        public api: NSApiService,
        public helper: NSHelperService,
        private domSanitizer: DomSanitizer,
        @Inject(DOCUMENT) document: Document,
        private  Api: NSApiService,
    ) {
        document.querySelector("svg")

    }

    displayedColumns: string[] = ['select', 'wheelAction', 'logo', 'clientName', 'contactPerson', 'email', 'phone', 'tenantType', 'clientStatus', 'view-dashboard', 'status'];
    resultsLength = 0;

    public filter: any;
    public selectedRow: any = [];
    private subject: Subject<string> = new Subject();


    onKeyUp(event: any): void {
        this.page = 1;
        this.subject.next(event.target.value);
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.fetchClient(this.requestPara);
        this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
            this.filterclinet(searchTextValue);
        });

    }

    ngAfterViewInit() {

        const svg = document.querySelector("svg");
        if (svg) {
            const s = new XMLSerializer().serializeToString(svg)
            const encodedData = window.btoa(s)
        }
    }

    sideMenuName() {
        this.sidebarMenuName = 'Client Management';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    filterclinet(filterClient: string): void {
        if (filterClient) {
            filterClient = filterClient.trim();
            filterClient = filterClient;
        }
        this.filter = filterClient;
        this.clientData.data = [];

        this.requestPara = {
            page: this.page,
            limit: this.limit,
            search: filterClient,
            sortBy: '-1',
            sortKey: '',
        };
        this.fetchClient(this.requestPara);
    }

    // Client Data listing Api
    fetchClient(req: any): any {
        this.helper.toggleLoaderVisibility(true);
        this.api.getClientData(req).subscribe((res: any) => {
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                this.clientData = res.data;
                localStorage.setItem('details', this.clientData);
                this.totalItems = res.meta.totalCount;
                for (let i = 0; i < this.clientData.length; i++) {
                    if (this.clientData[i].company_logo_image) {
                        // localStorage.setItem('logo', this.clientData[i].company_logo);
                        this.imageData = this.clientData[i].company_logo_image
                        this.base64Image = this.domSanitizer.bypassSecurityTrustResourceUrl(this.imageData);
                    }
                }
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
    onEdit(id: string): void {
        this.router.navigate([`client-management/add-edit-client/` + id]);
    }

    openDeleteDialog(id: any, index: number, event: any): any {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete this Client?', heading: 'Delete Client'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.deleteClient(id).subscribe((data: any) => {
                    const metaData: any = data.meta.message;
                    // this.featuresList.splice(index, 1);
                    this.fetchClient(this.requestPara);
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

    openChangePasswordDialog(id): void {
        const dialogRef = this.dialog.open(ChangePasswordPopupComponent, {
            data: {
                id: id
            }
        });
    }

    changeClientStatus(clientId: any, status: string) {
        this.helper.toggleLoaderVisibility(true);
        const changeStatusData = {
            id: clientId,
            status: status.toString()
        }
        this.api.changeStatusAPI(changeStatusData).subscribe((data: any) => {
            if (data.statusCode === 200){
                this.helper.toggleLoaderVisibility(false);
                const metaData: any = data.meta.message;
                swal.fire(
                    'Success!',
                    metaData,
                    'success'
                );
            }
        }, (err: any) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
                'Error!',
                err.error.message,
                'info'
            );

        });
    }

    // ngAfterViewInit(): void {
    //  // this.dataSource.sort = this.sort;
    // }

    announceSortChange(sortState: Sort): void {

    }


    //  sorting
    sortData(sort: Sort): void {
        const data = this.clientData.slice();
        if (!sort.active || sort.direction === '') {
            this.clientData = data;
            return;
        }
        this.clientData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'contact_name ':
                    return compare(a.contact_name, b.contact_name, isAsc);
                case 'email':
                    return compare(a.email, b.email, isAsc);
                case 'tenantType':
                    return compare(a.tenantType, b.tenantType, isAsc);
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

    // Sorting
    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = sortBy === '-1' ? '1' : '-1';
        this.fetchClient(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.searchArea,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    pageChanged(page): void {
        this.fetchClient(
            (this.requestPara = {
                page,
                limit: this.itemsPerPage,
                search: this.searchArea,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
            })
        );
        this.page = page;
    }

    changeItemsPerPage(): void {
        this.page = 1;
        this.fetchClient({
            page: 1,
            limit: this.itemsPerPage,
            search: this.searchArea,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
        //this.fetchClient({page: 1, limit: this.itemsPerPage});
    }

    // View Detail
    viewDetail(id: string): void {
        this.router.navigate(['/client-management/view-client-details/' + id]);
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;

    resetSearch() {
        this.myInputVariable.nativeElement.value = '';
        this.requestPara = {
            page: this.page,
            limit: this.limit,
            search: '',
            sortBy: '1',
            sortKey: '',
        };
        this.fetchClient(this.requestPara);
    }

    viewDashboard(id: any) {
        this.helper.toggleLoaderVisibility(true)
        this.api.clientViewDashboard({companyId: id, type: "weekly"}).subscribe((data: any) => {
            this.router.navigate(['/client-management/view-dashboard/' + id]);
        }, (err: any) => {
            this.helper.toggleLoaderVisibility(false)
            swal.fire(
                'Error!',
                err.error.message,
                'error'
            );
        });
    }

    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.clientManagement.length; i++) {
            this.clientManagement[i].checked = checkboxvalue.checked;
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
        const numRows = this.clientManagement.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.clientManagement);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    sitesID = []
    deleteMultiClients() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Are you sure you want to delete selected Clients?',
                heading: 'Delete Clients',
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
                    this.sitesID.toString();
                    this.api.deleteClient(this.sitesID.toString()).subscribe((res: any) => {
                        if (res.statusCode === 200) {
                            this.fetchClient(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            swal.fire(
                                'Deleted',
                                'Client has been deleted successfully',
                                'success'
                            );
                            setTimeout(() => {
                                if ((this.clientManagement.length) === 0) {
                                    const pageNumber = this.page - 1;
                                    this.pageChanged(pageNumber);
                                    this.table.renderRows();
                                } else {
                                    that.fetchClient(this.requestPara);
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
                        'Please select atleast one Client to delete.',
                        'info'
                    );
                }
            }
        });
    }
}
