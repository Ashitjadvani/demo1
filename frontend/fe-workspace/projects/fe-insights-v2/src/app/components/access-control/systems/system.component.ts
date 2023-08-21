import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DeletePopupComponent} from '../../../popup/delete-popup/delete-popup.component';
import {AccessControlService} from '../../../../../../fe-common-v2/src/lib/services/access-control.service';
import {MatTableDataSource} from '@angular/material/table';
import {ApiService, buildRequest} from '../../../../../../fe-common-v2/src/lib/services/api';
import {Subject} from 'rxjs';
import {debounceTime} from "rxjs/operators";
import swal from "sweetalert2";
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from "@ngx-translate/core";
import { ACCESS_CONTROL_LEVEL, Person } from 'projects/fe-common-v2/src/lib/models/person';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { BlockPopupComponent } from '../../../popup/block-popup/block-popup.component';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { Router } from '@angular/router';
import { AC_SYSTEM_STATE } from 'projects/fe-common-v2/src/lib/models/access-control/models';

// import { ApiService} from './api';

@Component({
  selector: 'app-access-control-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class AccessControlSystemComponent implements OnInit {
  systemList: any = new MatTableDataSource([]);
  systemListTransformed: any = new MatTableDataSource([]);

  acState = AC_SYSTEM_STATE;
  checkingSystems = true;
  systemsChecked = false;
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '-1';
  sortBy = 'name';
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  companyId: any;
  search1: any = null;
  systemDisplayedColumns: string[] = ['wheelAction', 'name', 'type', 'url', 'status'];
  public requestPara = {search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: ''};

  private subject: Subject<string> = new Subject();

  constructor(public dialog: MatDialog,
              private apiServices: AccessControlService,
              private helper: MCPHelperService,
              private tr: TranslateService,
              private router: Router,
              private com: CommonService) {

    this._setSearchSubscription();
  }

  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.getSystemList();
  }

  getSystemList(): void {
    this.apiServices.getCompanySystems( {
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortKey,
      sortKey: this.sortBy
    }, this.companyId).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.helper.toggleLoaderVisibility(false);
        this.systemList = res.data;
        this.systemListTransformed = res.data;
        this.transformSystemList();
        if(!this.systemsChecked) this.checkSystemsOnline();
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.systemList.length > 0;
      }else {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          res.reason,
          'info'
        );
      }
    }, (err: any) => {
      this.helper.toggleLoaderVisibility(false);
      const e = err.error;
      swal.fire(
        '',
        this.tr.instant('ACCESS_CONTROL.SystemListNotFound'),
        'info'
      );
    });
    this.helper.toggleLoaderVisibility(false);
  }

  editSystem(id: string) {
    this.router.navigate([`access-control/systems/add-edit-system/` + id]);
  }

  checkSystemsOnline() {
    if(this.systemList)  {
      for(let system of this.systemList) {
        this.apiServices.checkSystem(null, system.id).subscribe((res: any) => {
          setTimeout(async () => {
            this.systemsChecked = true;
            this.getSystemList();
            this.checkingSystems = false;
          }, 2000);
        }, (err: any)=>{});
      }
    }
  }

  deleteSystem(system: any) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message: this.tr.instant('ACCESS_CONTROL.DeleteSystemSure') + "\"" + system.name + "\"?",
        heading: this.tr.instant('ACCESS_CONTROL.DeleteSystem')
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.helper.toggleLoaderVisibility(true);
        this.apiServices.deleteSystem(system.id).subscribe((data: any) => {    
          this.helper.toggleLoaderVisibility(false);
          this.getSystemList();
            swal.fire(
              this.tr.instant('ACCESS_CONTROL.Deleted'),
              this.tr.instant('ACCESS_CONTROL.SystemDeleted'),
              'success'
            );
        }, (err: any) => {
          this.helper.toggleLoaderVisibility(false);
          const e = err.error;
          swal.fire(
            this.tr.instant('ACCESS_CONTROL.ConnectionError'),
            this.tr.instant('ACCESS_CONTROL.TryAgain'),
            'error'
          );
        });
      }
    });
  }

  transformSystemList() {
    /*for(let transform of this.systemListTransformed) {

    }*/
  }

  // Searching
  onKeyUp(searchTextValue: any): void {
    this.subject.next(searchTextValue);
  }
  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.page = 1;
      this.getSystemList();
    });
  }

  // Pagination
  changeItemsPerPage(): void {
    // this.search = '';
    this.limit = this.itemsPerPage;
    this.page = 1;
    this.getSystemList();
  }
  pageChanged(page): void {
    // this.search = '';
    this.page = page;
    this.getSystemList();
  }

  // Sorting
  changeSorting(sortBy, sortKey): void {
    // this.search = '';
    if(this.sortBy == sortBy) {
      this.sortKey = (this.sortKey === '-1') ? '1' : '-1';
    }
    else this.sortKey = '-1'
    this.sortBy = sortBy;
    this.page = 1;
    this.getSystemList();
  }


  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void {
    this.myInputVariable.nativeElement.value = '';
    this.search = '';
    this.getSystemList();
  }

}
