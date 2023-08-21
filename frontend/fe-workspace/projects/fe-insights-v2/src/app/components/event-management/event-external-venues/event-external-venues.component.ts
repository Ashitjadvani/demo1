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
import {EventManagementExternalVenuesService} from "../../../../../../fe-common-v2/src/lib/services/event-management-external-venues.service";

@Component({
  selector: 'app-event-external-venues',
  templateUrl: './event-external-venues.component.html',
  styleUrls: ['./event-external-venues.component.scss']
})
export class EventExternalVenuesComponent implements OnInit {
  externalVenuesList: any = new MatTableDataSource([]);
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
  externalVenuesId =[]
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '-1', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
   msg1: string;
   msg2: string;
  constructor(public dialog: MatDialog,
              private ApiService: EventManagementExternalVenuesService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router) {
    this._setSearchSubscription();
  }
  externalVenuesDisplayedColumns: string [] = ['select','wheelAction', 'externalVenuesName', 'CreatedDate', 'UpdatedDate'];

  ngOnInit(): void {
    this.sideMenuName();
    this.getExternalVenuesList(this.requestPara);
  }
  sideMenuName(){
    this.sidebarMenuName = 'INSIGHTS_MENU.External_venues';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getExternalVenuesList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getEventExternalVenuesList(this.requestPara);
    if (res.statusCode === 200){
      this.externalVenuesList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.externalVenuesList.length > 0;
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
    const numRows = this.externalVenuesList.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.externalVenuesList);
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
      data: {message: 'EVENT_MANAGEMENT.Are you sure you want to delete this External venue?', heading: 'EVENT_MANAGEMENT.Delete_External_Venues'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteEventExternalVenues({id: event.id}).then((data: any) => {
            const metaData: any = data.reason;
            this.getExternalVenuesList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('EVENT_MANAGEMENT.External venues has been deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.externalVenuesList.length - 1) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getExternalVenuesList(this.requestPara);
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
  deleteMultiExternalVenues(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message: 'EVENT_MANAGEMENT.Are you sure you want to delete selected External venues?',
        heading: 'EVENT_MANAGEMENT.Delete_External_Venues',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this
        this.helper.toggleLoaderVisibility(true);
        for(let i = 0 ; i < this.selection.selected.length;i++){
          if(this.selection.selected){
            let paraName:string = this.selection.selected[i].id;
            this.externalVenuesId.push(paraName);
          }
        }
        if(this.externalVenuesId.length > 0){
          this.ApiService.multipleDeleteExternalVenuesType({id:this.externalVenuesId}).subscribe((res: any)=>{
            if (res.statusCode === 200){
              this.getExternalVenuesList(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              this.selection.clear();
              this.externalVenuesId =[];
              swal.fire(
                '',
                this.translate.instant('Swal_Message.External venues deleted successfully'),
                'success'
              );
              setTimeout(() => {
                if((this.externalVenuesList.length) == 0){
                  let pageNumber = this.page - 1
                  this.pageChanged(pageNumber)
                  // that.getRole(this.requestParaR);
                  this.table.renderRows();
                }
                else{
                  that.getExternalVenuesList(this.requestPara);
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
          });
        }else{
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant('EVENT_MANAGEMENT.Please select atleast one external venues to delete.'),
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
      this.getExternalVenuesList(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      });
    });
  }
  changeItemsPerPage(event): void {
    // this.search = '';
    this.page = 1;
    this.itemsPerPage = event;
    this.selection.clear();
    this.getExternalVenuesList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }
  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getExternalVenuesList(this.requestPara = {
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
    this.getExternalVenuesList(this.requestPara = {
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
    this.getExternalVenuesList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  edit(event): void {
    this.router.navigate([`event-management/event-external-venues/add-edit-external-venues/` + event.id]);
  }

  // multiple delete
  checkboxvalue: boolean = false;
  toggleAllSelection(checkboxvalue: any){
    for (var i = 0; i < this.externalVenuesList.length; i++) {
      this.externalVenuesList[i].checked = checkboxvalue.checked;
      if (checkboxvalue.checked){
        this.checkboxvalue = true;
      }else {
        this.checkboxvalue = false;
      }
    }
  }
}

export class AddEditEventExternalVenuesComponent {
}
