import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import swal from 'sweetalert2';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {MasterModuleEventTypeService} from '../../../../../../fe-common-v2/src/lib/services/master-module-event-type.service';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styleUrls: ['./event-types.component.scss']
})
export class EventTypesComponent implements OnInit {
  eventTypeList: any = new MatTableDataSource([]);
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any;
  limit: any = 10;
  search: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  userAccount: Person;
  allPeople: Person[];
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private helper: MCPHelperService,
              public translate: TranslateService,
              public router: Router,
              private ApiService: MasterModuleEventTypeService,
              private userManagementService: UserManagementService,
              private adminUserManagementService: AdminUserManagementService,
              private commonService: CommonService) {
          
                this._setSearchSubscription();
  }

  eventTypeDisplayedColumns: string[] = ['select','wheelAction', 'eventName','eventEnable', 'eventApproval','eventType', 'noticeAdvance', 'eventSilent' ,'responsable', 'accountable', 'consulted', 'informed']


  async ngOnInit() {
    this.sideMenuName();
    this.getEventList(this.requestPara);
    this.userAccount = this.userManagementService.getAccount();
    let res = await this.adminUserManagementService.getPeopleList(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.allPeople = res.people;
      }
  }
  sideMenuName(){
    this.sidebarMenuName = 'Event Types';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getEventList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getEvent(this.requestPara);
    if (res.statusCode === 200){
      this.eventTypeList = res.data;
      // console.log(this.eventTypeList)
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.eventTypeList.length > 0;
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant(res.reason),
        // this.translate.instant('Event type list not found (server error)'),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  openAccountDeleteDialog(event){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'MASTER_MODULE.Are You Sure You Want To Delete This Event?', heading: 'Delete Event'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteEvent(event.id).then( (data: any) => {
            const metaData: any = data.reason;
            this.getEventList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Event deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.eventTypeList.length - 1) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getEventList(this.requestPara);
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

  onModifyJustification(element){
    this.router.navigate(['master-modules/event-types/add-edit-event/' + element.id]);
  }


  onKeyUp(searchTextValue: any): void {
    this.selection.clear();
    this.subject.next(searchTextValue);
  }

  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.selection.clear();
      this.page = 1;
      this.getEventList(this.requestPara = {
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
    this.selection.clear();
    this.itemsPerPage = event
    this.page = 1;
    this.getEventList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    this.selection.clear();
    this.getEventList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }
  // Sorting
  changeSorting(sortKey, sortBy): void {
    this.selection.clear();
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.getEventList(this.requestPara = {
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
    this.selection.clear();
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.getEventList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
// multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.eventTypeList.length; i++) {
    this.eventTypeList[i].checked = checkboxvalue.checked;
    if (checkboxvalue.checked){
      this.checkboxvalue = true;
    }else {
      this.checkboxvalue = false;
    }
  }
}

selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.eventTypeList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.eventTypeList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  eventID=[]
  async deleteMultiEvent(){

    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Event Types ?',
        heading: 'Delete Event Types',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
     this.selectedItems();
    if(this.eventID.length > 0){
      this.helper.deleteMultiEvent(this.eventID).subscribe((res: any)=>{
        if(res.result === true){
          this.getEventList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.eventID=[];
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Event deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.eventTypeList.length) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getEventList(this.requestPara);
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
        this.translate.instant('Please select atleast one event to delete.'),
        'info'
      );
    }
  }
  });
}

  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].id;
        console.log('paraName',paraName);
        this.eventID.push(paraName);
      }
    }
  }
}
