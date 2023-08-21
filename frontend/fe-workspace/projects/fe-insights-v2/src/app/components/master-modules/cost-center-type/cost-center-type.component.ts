import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import swal from 'sweetalert2';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {MatDialog} from '@angular/material/dialog';
import {MasterModulesCostCenterTypeService} from '../../../../../../fe-common-v2/src/lib/services/master-modules-cost-center-type.service';
import {TranslateService} from '@ngx-translate/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {DeletePopupComponent} from '../../../popup/delete-popup/delete-popup.component';
import {Router} from "@angular/router";
import {debounceTime} from "rxjs/operators";

@Component({
    selector: 'app-cost-center-type',
    templateUrl: './cost-center-type.component.html',
    styleUrls: ['./cost-center-type.component.scss']
})
export class CostCenterTypeComponent implements OnInit {


    constructor(public dialog: MatDialog,
                private ApiService: MasterModulesCostCenterTypeService,
                private helper: MCPHelperService,
                public translate: TranslateService,
                private router: Router) {
        this._setSearchSubscription();
    }

    degreeDisplayedColumns: string[] = ['select', 'wheelAction', 'CostCentersTypeName', 'CreatedDate', 'UpdatedDate'];
    selection = new SelectionModel<any>(true, []);

    private subject: Subject<string> = new Subject();
    search: any = '';
    itemsPerPage: any = '10';
    limit: any = 10;
    page: any = 1;
    sidebarMenuName: string;
    public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
    costCenterList: any = new MatTableDataSource([]);
    totalItems: any = 0;
    noRecordFound = false;
    sortBy: any = '-1';
    sortKey = null;
    costCenterId = []
    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    @ViewChild('table') table: MatTable<any>;
    checkboxvalue: boolean = false;

    ngOnInit(): void {
        this.getCostCenterList({});
    }

    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.page = 1;
            this.selection.clear();
            this.getCostCenterList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            });
        });
    }

    resetSearch(): void {
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.selection.clear();
        this.getCostCenterList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    changeSorting(sortKey, sortBy): void {
        // this.search = '';
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.selection.clear();
        this.getCostCenterList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }


    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.page = 1;
        this.itemsPerPage = event;
        this.selection.clear();
        this.getCostCenterList(this.requestPara = {
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
    }

    edit(event: any): void {
        this.router.navigate([`master-modules/cost-center-type/add-edit-cost-center-type/` + event.id]);
    }

    pageChanged(page): void {
        this.selection.clear();
        this.getCostCenterList(this.requestPara = {
            page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.page = page;
    }

    openAccountDeleteDialog(event: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'MASTER_MODULE.Delete_Cost_Center_type', heading: 'Delete cost center type'}
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    that.ApiService.deleteCostCenterType({id: event.id}).then((data: any) => {
                        const metaData: any = data.reason;
                        this.getCostCenterList(this.requestPara);
                        this.selection.clear();
                        this.costCenterId = [];
                        swal.fire(
                            '',
                            this.translate.instant('Swal_Message.DELETE_COST_CENTER_TYPE'),
                            'success'
                        );
                        this.helper.toggleLoaderVisibility(false);
                        if ((this.costCenterList.length - 1) === 0) {
                            const pageNumber = this.page - 1;
                            this.pageChanged(pageNumber);
                            // that.getRole(this.requestParaR);
                            this.table.renderRows();
                        } else {
                            that.getCostCenterList(this.requestPara);
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

    sideMenuName() {
        this.sidebarMenuName = 'Cost Center type';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    deleteMultipleCostCenterType() {
        console.log("this.costCenterId", this.costCenterId)
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message:
                    'Are you sure you want to delete selected Cost Center Types ?',
                heading: 'Delete Cost Center Types',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this
                this.helper.toggleLoaderVisibility(true);
                if (this.selection.selected.length > 0) {
                    for (let i = 0; i < this.selection.selected.length; i++) {
                        let paraName: string = this.selection.selected[i].id;
                        this.costCenterId.push(paraName);
                    }
                } else {
                    this.costCenterId = [];
                }
                if (this.costCenterId.length > 0) {
                    this.ApiService.multipleDeleteCostCenterType({id: this.costCenterId}).subscribe((res: any) => {
                        if (res.statusCode === 200) {
                            this.getCostCenterList(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            swal.fire(
                                '',
                                this.translate.instant('Swal_Message.DELETE_COST_CENTER_TYPE'),
                                'success'
                            );
                            setTimeout(() => {
                                if ((this.costCenterList.length) == 0) {
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    // that.getRole(this.requestParaR);
                                    this.table.renderRows();
                                } else {
                                    that.getCostCenterList(this.requestPara);
                                }
                            }, 100);

                        } else {
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                this.translate.instant(res.reason),
                                'error'
                            );
                            this.getCostCenterList(this.requestPara);
                        }
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        const e = err.error;
                        swal.fire(
                            '',
                            this.translate.instant(err.error.message),
                            'info'
                        );
                        this.getCostCenterList(this.requestPara);
                        this.selection.clear();
                        this.costCenterId = [];
                    });
                } else {
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        this.translate.instant('Please select at least one cost center type to delete.'),
                        'info'
                    );
                }

            }
        });
    }


    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.costCenterList);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.costCenterList.length;
        return numSelected === numRows;
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.costCenterList.length; i++) {
            this.costCenterList[i].checked = checkboxvalue.checked;
            if (checkboxvalue.checked) {
                this.checkboxvalue = true;
            } else {
                this.checkboxvalue = false;
            }
        }
    }

    async getCostCenterList(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getCostCenterType(this.requestPara);
        if (res.statusCode === 200) {
            this.costCenterList = res.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.costCenterList.length > 0;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(res.reason),
                'info'
            );
        }
        this.helper.toggleLoaderVisibility(false);
    }

}
