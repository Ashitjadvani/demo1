import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../popup/delete-popup/delete-popup.component';
import {MatTableDataSource} from '@angular/material/table';
import {AlertsManagementService} from '../../../../../fe-common-v2/src/lib/services/alerts-management.service';
import {MCPHelperService} from '../../service/MCPHelper.service';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import {LogManagementService} from '../../../../../fe-common-v2/src/lib/services/log-management.service';

@Component({
  selector: 'app-log-audit',
  templateUrl: './log-audit.component.html',
  styleUrls: ['./log-audit.component.scss']
})
export class LogAuditComponent implements OnInit {
  logAuditList: any = new MatTableDataSource([]);
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
  sidebarMenuName:string;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();

  constructor(public dialog: MatDialog,
              private ApiService: LogManagementService,
              private helper: MCPHelperService,
              private translate: TranslateService) {
    this._setSearchSubscription();
  }

  alertsDisplayedColumns: string[] = ['alertDate', 'title', 'publicationDate', 'view'];


  ngOnInit(): void {
    this.sideMenuName();
    this.getLog(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'Log Audit'; 
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getLog(request): Promise<void> {
     this.helper.toggleLoaderVisibility(true);
     const res: any = await this.ApiService.getlogEvents(this.requestPara);
     if (res.statusCode === 200) {
      this.helper.toggleLoaderVisibility(false);
      this.logAuditList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.logAuditList.length > 0;

    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }


  // openAccountDeleteDialog(id: any, index: number, event: any): void{
  //   const that = this;
  //   const dialogRef = this.dialog.open(DeletePopupComponent, {
  //     data: {message: 'Are You Sure You Want To Delete This Alert?', heading: 'Delete Alert'}
  //   });
  //   // dialogRef.afterClosed().subscribe(
  //   //   result => {
  //   //
  //   //     if (result) {
  //   //       this.helper.toggleLoaderVisibility(true);
  //   //       that.ApiService.deleteAlert(id).then((data: any) => {
  //   //         const metaData: any = data.reason;
  //   //         this.getAlerts(this.requestPara);
  //   //         swal.fire(
  //   //           '',
  //   //           metaData,
  //   //           'success'
  //   //         );
  //   //         this.helper.toggleLoaderVisibility(false);
  //   //         that.getAlerts(this.requestPara);
  //   //       }, (err) => {
  //   //         this.helper.toggleLoaderVisibility(false);
  //   //         const e = err.error;
  //   //         swal.fire(
  //   //           'Sorry!',
  //   //           err.error.message,
  //   //           'info'
  //   //         );
  //   //       });
  //   //     }
  //   //   });
  // }

  onKeyUp(searchTextValue: any): void {
    this.subject.next(searchTextValue);
  }
  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.page = 1;
      this.getLog(this.requestPara = {
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
    this.page = 1;
    this.itemsPerPage = event
    this.getLog(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    this.getLog(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void{
    this.search = '';
    this.page = 1;
    this.myInputVariable.nativeElement.value = '';
    this.getLog(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  // Sorting
  changeSorting(sortKey, sortBy): void {
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.getLog(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
}
