import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Subject} from "rxjs";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import swal from "sweetalert2";
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-resource-type',
  templateUrl: './resource-type.component.html',
  styleUrls: ['./resource-type.component.scss']
})
export class ResourceTypeComponent implements OnInit {
    resourceTypeList: any = new MatTableDataSource([]);
    // selection = new SelectionModel<any>(true, []);
    selection = new SelectionModel<any>(true, []);
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
    public requestPara = {search: '', page: 1, limit: 10, sortBy: '-1', sortKey: 'createdAt'};
    private subject: Subject<string> = new Subject();
    sidebarMenuName:string;
    resourceTypeDisplayedColumns:string [] = ['select','wheelAction', 'resourceType','createdDate','updatedDate'];
    @ViewChild('table') table: MatTable<any>;
    resourceTypeId= [];
  constructor(
      private ApiService:ResourceManagementService,
      private helper: MCPHelperService,
      public dialog: MatDialog,
      public translate: TranslateService,
      private router: Router
  ) {  this._setSearchSubscription(); }

  ngOnInit(): void {
    this.getResourceType({})
      this.sideMenuName()
  }
    sideMenuName() {
        this.sidebarMenuName = 'ASSETS_MANAGEMENT.ResourceType';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async getResourceType(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getResourceType(this.requestPara);
        if (res.result === true){
            this.resourceTypeList = res.data;
            this.totalItems = res.totalCount;
            this.noRecordFound = this.resourceTypeList.length > 0;
            this.helper.toggleLoaderVisibility(false);
        }else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            // swal.fire(
            //     '',
            //     // err.error.message,
            //     this.translate.instant(""),
            //     'info'
            // );
        }
        this.helper.toggleLoaderVisibility(false);
    }

    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch(){
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.selection.clear();
        this.getResourceType(this.requestPara = {  page: 1,
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
            this.getResourceType(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            });
        });
    }

    pageChanged(page): void {
        // this.search = '';
        this.selection.clear();
        this.getResourceType(this.requestPara = {
            page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.page = page;
    }

    changeItemsPerPage(event): void {
        // this.search = '';
        this.page = 1;
        this.itemsPerPage = event;
        this.selection.clear();
        this.getResourceType(this.requestPara = {
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.resourceTypeList);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    edit(event): void {
        this.router.navigate([`assets-management/add-edit-resource-type/` + event.id]);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.resourceTypeList.length;
        return numSelected === numRows;
    }

    changeSorting(sortKey, sortBy): void {
        // this.search = '';
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.selection.clear();
        this.getResourceType(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    openResourceTypeDeleteDelete(event: any): void{
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'ASSETS_MANAGEMENT.confirmDeleteResourceType', heading: 'ASSETS_MANAGEMENT.DeleteResourceType'}
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    that.ApiService.deleteResourceType({id:event.id}).then((data: any) => {
                        const metaData: any = data.reason;
                        this.getResourceType(this.requestPara);
                        this.selection.clear();
                        swal.fire(
                            '',
                            this.translate.instant(data.message),
                            'success'
                        );
                        this.helper.toggleLoaderVisibility(false);
                        if((this.resourceTypeList.length - 1) == 0){
                            let pageNumber = this.page - 1
                            this.pageChanged(pageNumber)
                            // that.getRole(this.requestParaR);
                            this.table.renderRows();
                        }
                        else{
                            that.getResourceType(this.requestPara);
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

    deleteMultiResourceType(){

        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message:
                    'ASSETS_MANAGEMENT.ConfirmDeleteSelectedResourceType',
                heading: 'ASSETS_MANAGEMENT.DeleteResourceTypes',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this
                this.helper.toggleLoaderVisibility(true);
                for(let i = 0 ; i < this.selection.selected.length;i++){
                    if(this.selection.selected){
                        let ids:string = this.selection.selected[i].id;
                        this.resourceTypeId.push(ids);

                    }else {
                        this.resourceTypeId=[];
                    }

                }
                if(this.resourceTypeId.length > 0){
                    this.ApiService.deleteResourceType({id:this.resourceTypeId}).then((res: any)=>{
                        if(res.result === true){
                            this.getResourceType(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            swal.fire(
                                '',
                                this.translate.instant(res.message),
                                'success'
                            );
                            setTimeout(() => {
                                if((this.resourceTypeList.length) == 0){
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber)
                                    // that.getRole(this.requestParaR);
                                    this.table.renderRows();
                                }
                                else{
                                    that.getResourceType(this.requestPara);
                                }
                            }, 100);

                        }else{
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                this.translate.instant(res.reason),
                                'error'
                            );
                        }
                    })
                }else{
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        this.translate.instant('ASSETS_MANAGEMENT.SelectAtLeastOneResourceType'),
                        'info'
                    );
                }

            }
        });
    }
}
