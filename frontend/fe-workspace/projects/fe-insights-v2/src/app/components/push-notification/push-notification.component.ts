import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { Subject } from 'rxjs';
import { DeletePopupComponent } from '../../popup/delete-popup/delete-popup.component';
import {debounceTime} from 'rxjs/operators';
import { MCPHelperService } from '../../service/MCPHelper.service';
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  noRecordFound = false;

  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  @ViewChild('table') table: MatTable<any>;

  sidebarMenuName:string;
  constructor(public dialog: MatDialog,
              private userManagementService: UserManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              public activatedRoute: ActivatedRoute) {
      this._setSearchSubscription();
     }

  pushNotificationList = [];

  pushNotificationDisplayedColumns: string[]= ['select','action' ,'dateTime', 'title', 'description'];


  ngOnInit(): void {
    this.sideMenuName();
    this.getPushnotification(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'Push Notification';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  getPushnotification(request){
    this.helper.toggleLoaderVisibility(true);
    this.userManagementService.getnotificationsList(this.requestPara).subscribe((res: any) => {
      this.pushNotificationList = res.data;
      this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.pushNotificationList.length > 0;
      //  console.log('notificatioon', res);
      this.helper.toggleLoaderVisibility(false);
  });
   // const res: any = await this.userManagementService.getNotification({});
   //    this.notification = res;
    // console.log('notification', this.notification);
  }

  openAccountDeleteDialog(id: any, index: number, event: any){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are You Sure You Want To Delete This Push Notification?', heading: 'Delete Push Notification'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.userManagementService.deletepushNotification({id:id}).then((data: any) => {
            const metaData: any = data.reason;
            this.getPushnotification(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant("Notification has been deleted successfully"),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.pushNotificationList.length - 1) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getPushnotification(this.requestPara);
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

   // Pagination
   changeItemsPerPage(event): void {
    // this.search = '';
    this.selection.clear();
    this.page = 1;
    this.itemsPerPage = event
    this.getPushnotification(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page: number): void {
    // this.search = '';
    this.selection.clear();
    this.getPushnotification(this.requestPara = {
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
    this.getPushnotification(this.requestPara = {
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
    this.getPushnotification(this.requestPara = {  page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.selection.clear();
      this.page = 1;
      this.getPushnotification(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      });
    });
  }

  onKeyUp(searchTextValue: any): void {
    this.selection.clear();
    this.subject.next(searchTextValue);
  }

  changeSelectOption(){}

  // multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.pushNotificationList.length; i++) {
    this.pushNotificationList[i].checked = checkboxvalue.checked;
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
  const numRows = this.pushNotificationList.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.pushNotificationList);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}


pushNotificationID=[]
deleteMultiPushNotifications(){
  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected Notifications?',
      heading: 'Delete Notifications',
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      const that = this
  this.helper.toggleLoaderVisibility(true);
  for(let i = 0 ; i < this.selection.selected.length;i++){
    if(this.selection.selected){
      let paraName:string = this.selection.selected[i].id;
      console.log('paraName',paraName);
      this.pushNotificationID.push(paraName);
    }
  }
  if(this.pushNotificationID.length > 0){
    

    this.helper.deleteMultiPushNotifications({id:this.pushNotificationID}).subscribe((res: any)=>{
      if(res.result === true){
        this.getPushnotification(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selection.clear();
        this.pushNotificationID = [];
        swal.fire(
          '',
          this.translate.instant('Notification has been deleted successfully'),
          'success'
        );
        setTimeout(() => {
          if((this.pushNotificationList.length) == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getPushnotification(this.requestPara);
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
      this.translate.instant('Please select atleast one notification to delete.'),
      'info'
    );
  }

}
});}

}
