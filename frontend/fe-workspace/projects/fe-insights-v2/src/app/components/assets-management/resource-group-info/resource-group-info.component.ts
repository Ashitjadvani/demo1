import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {Subject} from "rxjs";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {debounceTime, map, startWith} from "rxjs/operators";
import {EventManagementEventServices} from "../../../../../../fe-common-v2/src/lib/services/event-services.service";
import {AdminSiteManagementService} from "../../../../../../fe-common-v2/src/lib/services/admin-site-management.service";
import {UserManagementService} from "../../../../../../fe-common-v2/src/lib/services/user-management.service";
import {CommonService} from "../../../../../../fe-common-v2/src/lib/services/common.service";
import {Site} from "../../../../../../fe-common-v2/src/lib/models/admin/site";
import {IrinaResource, IrinaResourceType} from "../../../../../../fe-common-v2/src/lib/models/bookable-assets";
import {BookableAssetsManagementService} from "../../../../../../fe-common-v2/src/lib/services/bookable-assets-management.service";
import {SendEmailPopupComponent} from "../../../popup/send-email-popup/send-email-popup.component";
import { BookResourcePopupComponent } from '../../../popup/book-resource-popup/book-resource-popup.component';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-resource-group-info',
  templateUrl: './resource-group-info.component.html',
  styleUrls: ['./resource-group-info.component.scss']
})
export class ResourceGroupInfoComponent implements OnInit {
    resources: any = new MatTableDataSource([]);
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
    resourceId =[]
    public requestPara = {search: '', page: 1, limit: 10, sortBy: '-1', sortKey: ''};
    private subject: Subject<string> = new Subject();
    sidebarMenuName:string;
    @ViewChild('table') table: MatTable<any>;
    @Input() currentResourceType: IrinaResourceType;
    userAccount: any;
    allSites: Site[];
    allResources: IrinaResource[] = [];
    resourcesType: any;
  constructor(public dialog: MatDialog,
              private ApiService: EventManagementEventServices,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              private adminSiteManagementService: AdminSiteManagementService,
              private userManagementService: UserManagementService,
              private commonService: CommonService,
              private bookableAssetsManagementService: BookableAssetsManagementService,
              private route: ActivatedRoute) {
      this._setSearchSubscription();
  }
    eventServicesDisplayedColumns: string [] = ['select', 'wheelAction', 'site', 'code', 'description', 'enabled'];
  async ngOnInit() {
      this.resourcesType = this.route.snapshot.queryParams.type;
      this.userAccount = this.userManagementService.getAccount();
      await this.loadSites();
      await this.loadReourceList(this.requestPara);
      await this.sideMenuName()
  }
    sideMenuName() {
        this.sidebarMenuName = 'INSIGHTS_MENU.Resource_Group';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.resources.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.resources);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    openAccountDeleteDialog(event: any){
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: this.translate.instant('Are you sure you want to delete this Resource?'),
                heading: this.translate.instant('Delete Resource'),
            }
        });
        dialogRef.afterClosed().subscribe(
            async result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    let res = await this.bookableAssetsManagementService.deleteBookableResource(event.code);
                    if(res.result===true){
                        swal.fire(
                            '',
                            this.translate.instant('Resource has been deleted successfully '),
                            'success'
                        );
                        await this.loadReourceList(this.requestPara);
                    }else {
                        this.helper.toggleLoaderVisibility(false);
                        swal.fire(
                            '',
                            this.translate.instant(res.reason),
                            'info'
                        );
                    }
                }
            });
    }

    deleteMultiEventServices(){
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: this.translate.instant('Are you sure you want to delete selected Resources?'),
                heading: this.translate.instant('Delete Resource'),
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this
                this.helper.toggleLoaderVisibility(true);
                    for(let i = 0 ; i < this.selection.selected.length;i++) {
                        if(this.selection.selected){
                            let paraName: string = this.selection.selected[i].code;
                            this.resourceId.push(paraName);
                        }
                    }

                if(this.resourceId.length > 0){
                    this.bookableAssetsManagementService.multipleBookableResource({id:this.resourceId}).subscribe((res: any)=>{
                        if (res.result === true){
                            this.loadReourceList(this.requestPara);
                            this.selection.clear();
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                this.translate.instant('Resources has been deleted successfully'),
                                'success'
                            );
                            setTimeout(() => {
                                if((this.resources.length) == 0){
                                    let pageNumber = this.page - 1
                                    this.pageChanged(pageNumber);
                                    this.selection.clear();
                                    // that.getRole(this.requestParaR);
                                    this.table.renderRows();
                                } else{
                                }
                            }, 100);

                        }else{
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                this.translate.instant(res.reason),
                                'info'
                            );
                        }
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        swal.fire(
                            '',
                            this.translate.instant(err.error.message),
                            'info'
                        );
                    })
                }else{
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        this.translate.instant('Please select atleast one resource to delete.'),
                        'info'
                    );
                }

            }
        });}

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
            this.loadReourceList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            });
        });
    }
    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.page = 1;
        this.itemsPerPage = event;
        this.selection.clear();
        this.loadReourceList(this.requestPara = {
            search: '',
            page: 1,
            limit: 10,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
    }

    pageChanged(page): void {
        // this.search = '';
        this.selection.clear();
        this.loadReourceList(this.requestPara = {
            search: this.search,
            page: page,
            limit: this.itemsPerPage,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.page = page;
    }
    async loadSites() {

        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);

        if (res) {
            this.allSites = res.data;
        }
    }
    siteFormatter(element: any) {
        if(element){
            let site = this.allSites.filter(s=>s.key === element)
            return site ? site[0].name : element.site;
        }

    }
    async loadReourceList(request) {
        this.helper.toggleLoaderVisibility(true);
        // this.tableTitle = this.currentResourceType.type + " Resources";

            let res = await this.bookableAssetsManagementService.getBookableResourcesParam(this.resourcesType,this.requestPara);

        if (this.commonService.isValidResponse(res)) {
            this.allResources = res.data;
            this.resources = res.data; // TODO Optimize this
            this.noRecordFound = this.resources.length > 0;
            this.totalItems = res.totalCount;
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

    openBookResource(){
        const dialogRef = this.dialog.open(BookResourcePopupComponent, {
            data: {
                type:this.resourcesType
            }
        });
    }

    displaySite(siteKey: string) {
        if (this.allSites) {
            let site = this.allSites.find(s => s.key == siteKey);
            return site ? site.name : siteKey;
        }
        return null;
    }
    filterSites(value: string) {
        return this.allSites.filter(s => Site.filterMatch(s, value));
    }
    // Sorting
    changeSorting(sortKey, sortBy): void {
        // this.search = '';
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.loadReourceList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.selection.clear();
    }
    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch(){
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.selection.clear();
        this.loadReourceList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }
    edit(event): void {
        this.router.navigate([`assets-management/add-edit-resource`],{ queryParams: { resource:event.code,type:this.resourcesType,id:event._id}});
    }
    add(){
        this.router.navigate([`assets-management/add-edit-resource`],{ queryParams: { type:this.resourcesType,id:0}});
    }
    async refreshApi() {
        await this.loadReourceList(this.requestPara);
    }
    reservation(event):void{
        this.router.navigate([`assets-management/resource-group/resource-group-info/reservation`],{ queryParams: { resource:event.code,type:this.resourcesType}});
    }



    // multiple delete
    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any){
        for (var i = 0; i < this.resources.length; i++) {
            this.resources[i].checked = checkboxvalue.checked;
            if (checkboxvalue.checked){
                this.checkboxvalue = true;
            }else {
                this.checkboxvalue = false;
            }
        }
    }

}
