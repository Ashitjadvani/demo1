import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DeletePopupComponent} from '../../../popup/delete-popup/delete-popup.component';
import swal from "sweetalert2";
import {CommonService} from "../../../../../../fe-common-v2/src/lib/services/common.service";
import {ResourceManagementService} from "../../../../../../fe-common-v2/src/lib/services/resource-management.service";
import {EventHelper, EventRequestParams, PaginationModel} from "../../../../../../fe-common-v2/src/lib";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {SelectionModel} from "@angular/cdk/collections";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {MatTable} from "@angular/material/table";
import {Router} from "@angular/router";

@Component({
    selector: 'app-resource-group',
    templateUrl: './resource-group.component.html',
    styleUrls: ['./resource-group.component.scss']
})
export class ResourceGroupComponent implements OnInit {
    page = 1;
    itemsPerPage: any = '10';
    totalItems = 0;
    search: any = '';
    sortBy: any = '-1';
    sortKey: any = '';
    sortClass = 'down';
    limit: any = 10;
    sidebarMenuName: string;
    noRecordFound: boolean = false;
    public requestPara = {search: '', page: 1, limit: 10, sortBy: this.sortBy, sortKey: ''};
    selection = new SelectionModel<any>(true, []);
    private subject: Subject<string> = new Subject();
    paginationModel: PaginationModel = new PaginationModel();
    @ViewChild('searchBox') myInputVariable: ElementRef;
    @ViewChild('table') table: MatTable<any>;

    constructor(
        public dialog: MatDialog,
        private commonService: CommonService,
        private resourceManagementService: ResourceManagementService,
        private helper: MCPHelperService,
        private translate: TranslateService,
        private router: Router
    ) {
        this._setSearchSubscription();
    }

    resourceGroupList = [];

    resourceGroupDisplayedColumns: string[] = ['select', 'wheelAction', 'resourceType', 'name', 'description', 'availabilityStart', 'availabilityHours']

    async ngOnInit() {
        this.sideMenuName();
        await this.getReourceGroupList(this.requestPara);
    }

    sideMenuName() {
        this.sidebarMenuName = 'INSIGHTS_MENU.Resource_Group';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async getReourceGroupList(request) {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.resourceManagementService.getBookableResourceTypes(this.requestPara);
        if (this.commonService.isValidResponse(res)) {
            this.helper.toggleLoaderVisibility(false);
            this.resourceGroupList = res.data;
            this.totalItems = res.totalCount;
            this.noRecordFound = this.resourceGroupList.length > 0;
        } else {
            this.helper.toggleLoaderVisibility(false);
            swal.fire('', 'Error loading resource types', 'info');
        }
    }



    deleteSingleResourceGroup(id: any) {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'ASSETS_MANAGEMENT.SureDeleteResourceGroup',
                heading: 'ASSETS_MANAGEMENT.DeleteResourceGroup'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.resourceManagementService.deleteResourceGroup(id).then((data: any) => {
                    if (data.result) {
                        swal.fire(
                            '',
                            this.translate.instant('ASSETS_MANAGEMENT.ResourceGroupDeletedSuccessfully'),
                            'success'
                        );
                        if ((this.resourceGroupList.length - 1) == 0) {
                            let pageNumber = this.page - 1
                            this.pageChanged(pageNumber)
                            this.table.renderRows();
                        } else {
                            this.getReourceGroupList(this.requestPara);
                        }
                        this.selection.clear();
                    }

                }, (err: any) => {
                    const e = err.error;
                    swal.fire(
                        '',
                        this.translate.instant(result.reason),
                        'info'
                    );
                    this.selection.clear();
                });
            }
        });
    }

    availabilityFormatter(fieldValue: any) {
        try {
            if (fieldValue) {
                let dateTime = new Date(fieldValue);
                return this.commonService.timeFormat(dateTime);
            }
        } catch (ex) {

        }
        return fieldValue;
    }

    onKeyUp(searchTextValue: any) {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    private _setSearchSubscription(): void {
        this.subject.pipe(debounceTime(500)).subscribe((searchValue: string) => {
            this.page = 1;
            this.selection.clear();
            this.getReourceGroupList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            });
        });
    }

    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.selection.clear();
        this.getReourceGroupList(this.requestPara = {
            search: '',
            page: 1,
            limit: 10,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }
    editResource(id:any){
        this.router.navigate(['/assets-management/resource-group/add-edit-resource-group'],{ queryParams: { id:id}});

    }
    resource(type){
        this.router.navigate(['/assets-management/resource-group/resource-group-info'],{ queryParams: { type:type}});
    }

    resetSearch() {
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.selection.clear();
        this.getReourceGroupList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    pageChanged(page): void {
        this.selection.clear();
        this.getReourceGroupList(this.requestPara = {
            search: this.search,
            page: page,
            limit: this.itemsPerPage,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.page = page;
    }

    changeItemsPerPage(event): void {
        this.page = 1;
        this.itemsPerPage = event;
        this.selection.clear();
        this.getReourceGroupList(this.requestPara = {
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.resourceGroupList.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.resourceGroupList);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    resourceGroupID = []

    deleteMultiResourceGroups() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'ASSETS_MANAGEMENT.DeleteSelectedResourceGroups',
                heading: 'ASSETS_MANAGEMENT.DeleteResourceGroups',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.selection
                const that = this;
                this.helper.toggleLoaderVisibility(true);
                for (let i = 0; i < this.selection.selected.length; i++) {
                    if (this.selection.selected) {
                        let paraName: string = this.selection.selected[i].id;
                        this.resourceGroupID.push(paraName);
                    }
                }
                if (this.resourceGroupID.length > 0) {
                    this.helper.deleteMultiResourceGroups({id: this.resourceGroupID}).subscribe((res: any) => {
                        if (res.result === true) {
                            this.getReourceGroupList(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            this.resourceGroupID = [];
                            swal.fire(
                                '',
                                this.translate.instant('ASSETS_MANAGEMENT.ResourceGroupDeletedSuccessfully'),
                                'success'
                            );
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
                        this.translate.instant('ASSETS_MANAGEMENT.SelectAtleastOneResourceGroup'),
                        'info'
                    );
                }

            }
        });
    }


}

