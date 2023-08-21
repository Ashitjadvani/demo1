import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {debounceTime} from "rxjs/operators";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import swal from "sweetalert2";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {EventManagementScopesService} from "../../../../../../fe-common-v2/src/lib/services/event-management-scopes.service";

@Component({
  selector: 'app-event-scopes',
  templateUrl: './event-scopes.component.html',
  styleUrls: ['./event-scopes.component.scss']
})
export class EventScopesComponent implements OnInit {
  scopesList: any = new MatTableDataSource([]);
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
  scopeId =[]
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '-1', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private ApiService: EventManagementScopesService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router) {
    this._setSearchSubscription();
  }

  scopesDisplayedColumns: string [] = ['select','wheelAction', 'scopeName', 'CreatedDate', 'UpdatedDate'];

  ngOnInit(): void {
    this.sideMenuName();
    this.getScopesList(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'EVENT_MANAGEMENT.SCOPES';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getScopesList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getScopesList(this.requestPara);
    if (res.statusCode === 200){
      this.scopesList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.scopesList.length > 0;
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant(res.error),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.scopesList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.scopesList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  openAccountDeleteDialog(event: any): void{
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'EVENT_MANAGEMENT.Are you sure you want to delete this Scope ?', heading: 'EVENT_MANAGEMENT.Delete_Scope'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteEventScopes({id: event.id}).then((data: any) => {
            const metaData: any = data.reason;
            this.getScopesList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('EVENT_MANAGEMENT.Scope has been deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.scopesList.length - 1) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getScopesList(this.requestPara);
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

  deleteMultiScopes(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'EVENT_MANAGEMENT.Are_you_sure_you_want_to_delete_selected_Scopes?',
        heading: 'EVENT_MANAGEMENT.Delete_Scopes',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this;
        this.helper.toggleLoaderVisibility(true);
        if (this.selection.selected.length > 0 ){
          for(let i = 0 ; i < this.selection.selected.length;i++) {
            let paraName: string = this.selection.selected[i].id;
            this.scopeId.push(paraName);
          }
        }else {
          this.scopeId = [];
        }

        if(this.scopeId.length > 0){
          this.ApiService.multipleDeleteScopesType({id:this.scopeId}).subscribe((res: any)=>{
            if (res.statusCode === 200){
              this.getScopesList(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              this.selection.clear();
              swal.fire(
                '',
                this.translate.instant('Swal_Message.Scope deleted successfully'),
                'success'
              );
              setTimeout(() => {
                if((this.scopesList.length) == 0){
                  let pageNumber = this.page - 1
                  this.pageChanged(pageNumber)
                  // that.getRole(this.requestParaR);
                  this.table.renderRows();
                }
                else{
                  that.getScopesList(this.requestPara);
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
          }, (err) => {
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                  '',
                  this.translate.instant(err.error.message),
                  'error'
              );
              this.getScopesList(this.requestPara);
              this.selection.clear();
              this.scopeId = [];
          })
        }else{
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant('EVENT_MANAGEMENT.Please select atleast one scope to delete.'),
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
      this.getScopesList(this.requestPara = {
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
    this.getScopesList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getScopesList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }


  // Sorting
  changeSorting(sortKey, sortBy): void {
    // this.search = '';
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getScopesList(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(){
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.selection.clear();
    this.getScopesList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  edit(event): void {
    this.router.navigate([`event-management/event-scopes/add-edit-event-scopes/` + event.id]);
  }

  // multiple delete
  checkboxvalue: boolean = false;

  toggleAllSelection(checkboxvalue: any){
    for (var i = 0; i < this.scopesList.length; i++) {
      this.scopesList[i].checked = checkboxvalue.checked;
      if (checkboxvalue.checked){
        this.checkboxvalue = true;
      }else {
        this.checkboxvalue = false;
      }
    }
  }
}


