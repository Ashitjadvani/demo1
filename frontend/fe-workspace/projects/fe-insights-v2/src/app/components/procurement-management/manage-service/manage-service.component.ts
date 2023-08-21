import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination/dist/ngx-pagination.module';
import {MatDialog} from '@angular/material/dialog';
import {DeletePopupComponent} from '../../../popup/delete-popup/delete-popup.component';
import {Subject} from 'rxjs';
import {ProcurementService} from '../../../../../../fe-common-v2/src/lib/services/procurement.service';
import {debounceTime} from 'rxjs/operators';
import swal from 'sweetalert2';
import {TranslateService} from "@ngx-translate/core";
import { MCPHelperService } from '../../../service/MCPHelper.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-service.component.html',
  styleUrls: ['./manage-service.component.scss']
})
export class ManageServiceComponent implements OnInit {
  page = 1;
  itemsPerPage = '10';
  totalItems = 0;
  serviceList = [];
  search = '';
  sortKey = 'createdAt';
  sortBy = -1;
  sortClass = 'down';
  saveTabInfo: any;
  noRecordFound = false;
  //RFQDisplayedColumns: string[] = ['wheelAction', 'serviceName', 'description', 'viewDetails' , 'action'];
  RFQDisplayedColumns: string[] = ['wheelAction', 'serviceName', 'description'];
  private searchSubject: Subject<string> = new Subject();
  sidebarMenuName:string;
  constructor(public dialog: MatDialog,
              private procurementService: ProcurementService,
              private translate: TranslateService,
              private helper:MCPHelperService,
              private router: Router) {
    this._setSearchSubscription();
  }

  async ngOnInit(): Promise<void> {
    this.sideMenuName();
    const request = {search: '', page: this.page, limit: this.itemsPerPage, sortBy: '', sortKey: '' };
    await this.loadServiceList(request);
  }
  sideMenuName(){
    this.sidebarMenuName = 'Manage Services';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async loadServiceList(request): Promise<void> {
    const res: any = await this.procurementService.loadManageServiceList(request);
    this.serviceList = res.data;
    this.noRecordFound = this.serviceList.length > 0;
    this.totalItems = res.meta.totalCount;
  }

  onKeyUp(searchTextValue: any): void {
    this.searchSubject.next( searchTextValue );
  }

  changeSorting(sortKey): void {
    // this.search = '';
    this.sortKey = sortKey;
    this.sortBy = (this.sortBy === 1) ? -1  : 1;
    this.sortClass = (this.sortBy === 1) ? 'down'  : 'up';
    this.page = 1;
    this.loadServiceList({page: 1, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey, status: Number(this.saveTabInfo)});
  }

  pageChanged(page): void {
    this.page = page;
    // this.search = '';
    this.loadServiceList({page: this.page, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey: this.sortKey});
  }

  changeSelectOption(event): void {
    // this.search = '';
    this.itemsPerPage = event
    this.loadServiceList({page: this.page, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey: this.sortKey});
  }
  edit(event): void {
    this.router.navigate([`manage-service/add-edit-services/` + event.id]);
  }
  view(event): void {
    this.router.navigate([`manage-service/view-details/` + event.id]);
  }

  openRFQDeleteDialog(event): void {
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Procurement_Management.DeleteServiceMessage', heading: 'Procurement_Management.DeleteService'}
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          that.procurementService.deleteService({id: event.id}).then( (data: any) => {
            swal.fire(
              '',
              this.translate.instant('Service has been deleted successfully'),
              'success'
            );
            that.loadServiceList({page: this.page, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey: this.sortKey});
          }, (err) => {
            swal.fire(
              '',
              this.translate.instant(err.error.message),
              'info'
            );
          });
        }
      });
  }

  private _setSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.page = 1;
      this.loadServiceList({page: 1, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey: this.sortKey});
    });
  }

  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void{
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    const request = {search: '', page: this.page, limit: this.itemsPerPage, sortBy: '', sortKey: '' };
    this.loadServiceList(request);
  }
}
