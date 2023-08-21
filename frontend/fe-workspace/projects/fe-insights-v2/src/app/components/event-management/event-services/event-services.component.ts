import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import swal from "sweetalert2";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {debounceTime} from "rxjs/operators";
import {EventManagementEventServices} from "../../../../../../fe-common-v2/src/lib/services/event-services.service";

@Component({
  selector: 'app-event-services',
  templateUrl: './event-services.component.html',
  styleUrls: ['./event-services.component.scss']
})
export class EventServicesComponent implements OnInit {
  eventServiceList: any = new MatTableDataSource([]);
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
  eventServiceId =[]
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '-1', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private ApiService: EventManagementEventServices,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router) {
    this._setSearchSubscription();
  }

  eventServicesDisplayedColumns: string [] = ['select', 'wheelAction', 'serviceName', 'nameOfSupplier', 'referenceEmail', 'referencePhoneNumber'];

  ngOnInit(): void {
    this.sideMenuName();
    this.getEventServicesList(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'INSIGHTS_MENU.Event_Services';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getEventServicesList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getEventServicesList(this.requestPara);
    if (res.statusCode === 200){
      this.eventServiceList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.eventServiceList.length > 0;
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
    const numRows = this.eventServiceList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.eventServiceList);
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
      data: {message: 'Are You Sure You Want To Delete This Event Service?', heading: 'Delete Event Service'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteEventServices({id: event.id}).then((data: any) => {
            const metaData: any = data.reason;
            this.getEventServicesList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('EVENT_MANAGEMENT.EventServiceDeletedSuccessfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.eventServiceList.length - 1) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getEventServicesList(this.requestPara);
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

  deleteMultiEventServices(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message: 'Are you sure you want to delete selected Event Services?',
        heading: 'Delete Event Services',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this
        this.helper.toggleLoaderVisibility(true);
        if (this.selection.selected.length > 0 ){
          for(let i = 0 ; i < this.selection.selected.length;i++) {
            let paraName: string = this.selection.selected[i].id;
            this.eventServiceId.push(paraName);
          }
        }else {
            this.eventServiceId = [];
        }

        if(this.eventServiceId.length > 0){
          this.ApiService.multipleDeleteEventServices({id:this.eventServiceId}).subscribe((res: any)=>{
            if (res.statusCode === 200){
              this.selection.clear();
              this.getEventServicesList(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                '',
                this.translate.instant('EVENT_MANAGEMENT.EventServiceDeletedSuccessfully'),
                'success'
              );
              setTimeout(() => {
                if((this.eventServiceList.length) == 0){
                  let pageNumber = this.page - 1
                  this.pageChanged(pageNumber);
                  this.selection.clear();
                  // that.getRole(this.requestParaR);
                  this.table.renderRows();
                } else{
                  that.getEventServicesList(this.requestPara);
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
            this.translate.instant('Please select atleast one event service to delete.'),
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
      this.getEventServicesList(this.requestPara = {
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
    this.getEventServicesList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getEventServicesList(this.requestPara = {
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
    this.getEventServicesList(this.requestPara = {
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
    this.getEventServicesList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  edit(event): void {
    this.router.navigate([`event-management/event-services/add-edit-event-services/` + event.id]);
  }

  view(event): void {
    this.router.navigate([`event-management/event-services/view-details/` + event.id]);
  }


  // multiple delete
  checkboxvalue: boolean = false;

  toggleAllSelection(checkboxvalue: any){
    for (var i = 0; i < this.eventServiceList.length; i++) {
      this.eventServiceList[i].checked = checkboxvalue.checked;
      if (checkboxvalue.checked){
        this.checkboxvalue = true;
      }else {
        this.checkboxvalue = false;
      }
    }
  }
}


