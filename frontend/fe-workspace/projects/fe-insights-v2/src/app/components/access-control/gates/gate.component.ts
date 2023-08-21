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
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';


// import { ApiService} from './api';

@Component({
  selector: 'app-access-control-gate',
  templateUrl: './gate.component.html',
  styleUrls: ['./gate.component.scss']
})
export class AccessControlGateComponent implements OnInit {

  selectedIndex: any = 0;

  gateList: any = new MatTableDataSource([]);
  gateListTransformed: any = new MatTableDataSource([]);
  groupList: any = new MatTableDataSource([]);
  groupListTransformed: any = new MatTableDataSource([]);

  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '1';
  sortBy = 'siteId';
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;

  pageG: any = 1;
  itemsPerPageG: any = '10';
  totalItemsG: any = 0;
  limitG: any = 10;
  searchG: any = '';
  sortKeyG: any = '1';
  sortByG = 'name';
  sortClassG: any = 'down';
  noRecordFoundG = false;
  filterG: any;

  tabParam = "";
  companyId: any;
  siteList: Site[] = new Array();
  search1: any = null;
  gateDisplayedColumns: string[] = ['wheelAction', 'name', 'site', 'lastConnection', 'status'];
  groupDisplayedColumns: string[] = ['wheelAction', 'name'];
  public requestPara = {search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: ''};
  public requestParaG = {search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: ''};

  private subject: Subject<string> = new Subject();
  private subjectG: Subject<string> = new Subject();

  constructor(public dialog: MatDialog,
              public route: ActivatedRoute,
              private apiServices: AccessControlService,
              private siteApiServices: AdminSiteManagementService,
              private helper: MCPHelperService,
              private tr: TranslateService,
              private router: Router,
              private com: CommonService) {

    this._setSearchSubscription();
    this._setSearchSubscriptionG();
  }

  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.tabParam = this.route.snapshot.paramMap.get('tab');
    if(this.route.snapshot.paramMap.get('tab') == "groups") this.selectedIndex = 1;
    else if(this.route.snapshot.paramMap.get('tab') == "gates") this.selectedIndex = 0;
    await this.getSiteList();
    this.getGateList();
    this.getGroupList();
  }

  async getSiteList() {
    let res = await this.siteApiServices.getFullSites(this.companyId);
    if(res) this.siteList = res.data;
  }

  getGateList(): void {
    this.apiServices.getGates( {
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortKey,
      sortKey: this.sortBy
    }).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.helper.toggleLoaderVisibility(false);
        this.gateList = res.data;
        this.gateListTransformed = res.data;
        this.transformGateList();
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.gateList.length > 0;
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
        this.tr.instant('ACCESS_CONTROL.GateListNotFound'),
        'info'
      );
    });
    this.helper.toggleLoaderVisibility(false);
  }

  getGroupList(): void {
    this.apiServices.getGatesGroups( {
      page: this.pageG,
      limit: this.limitG,
      search: this.searchG,
      sortBy: this.sortKeyG,
      sortKey: this.sortByG
    }).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.helper.toggleLoaderVisibility(false);
        this.groupList = res.data;
        this.groupListTransformed = res.data;
        this.transformGroupList();
        this.totalItemsG = res.meta.totalCount;
        this.noRecordFoundG = this.groupList.length > 0;
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
        this.tr.instant('ACCESS_CONTROL.GroupListNotFound'),
        'info'
      );
    });
    this.helper.toggleLoaderVisibility(false);
  }

  editGate(id: string) {
    this.router.navigate([`/access-control/gates/add-edit-gate/` + id]);
  }

  editGroup(id: string) {
    this.router.navigate([`/access-control/gates/add-edit-group/` + id]);
  }

  openGate(id: string) {
    // this.router.navigate([`access-control/gates/add-edit-gate/` + id]);
  }

  deleteGate(gate: any) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message: this.tr.instant('ACCESS_CONTROL.DeleteGateSure') + "\"" + gate.name + "\"?",
        heading: this.tr.instant('ACCESS_CONTROL.DeleteGate')
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.helper.toggleLoaderVisibility(true);
        this.apiServices.deleteGate(gate.id).subscribe((data: any) => {    
          this.helper.toggleLoaderVisibility(false);
          this.getGateList();
            swal.fire(
              this.tr.instant('ACCESS_CONTROL.Deleted'),
              this.tr.instant('ACCESS_CONTROL.GateDeleted'),
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

  deleteGroup(group: any) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message: this.tr.instant('ACCESS_CONTROL.DeleteGroupSure') + "\"" + group.name + "\"?",
        heading: this.tr.instant('ACCESS_CONTROL.DeleteGroup')
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.helper.toggleLoaderVisibility(true);
        this.apiServices.deleteGatesGroup(group.id).subscribe((data: any) => {    
          this.helper.toggleLoaderVisibility(false);
          this.getGroupList();
            swal.fire(
              this.tr.instant('ACCESS_CONTROL.Deleted'),
              this.tr.instant('ACCESS_CONTROL.GroupDeleted'),
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

  transformGateList() {
    for(let transform of this.gateListTransformed) {
      // TRANSFORM SITE NAME
      let site = this.siteList.find(site => site.id == transform.siteId);
      if(site) transform.siteName = site.name;
    }
  }

  transformGroupList() {
    for(let transform of this.groupListTransformed) {

    }
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
      this.getGateList();
    });
  }
  onKeyUpG(searchTextValue: any): void {
    this.subjectG.next(searchTextValue);
  }
  private _setSearchSubscriptionG(): void {
    this.subjectG.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.pageG = 1;
      this.getGroupList();
    });
  } 

  // Pagination
  changeItemsPerPage(): void {
    // this.search = '';
    this.limit = this.itemsPerPage;
    this.page = 1;
    this.getGateList();
  }
  pageChanged(page): void {
    // this.search = '';
    this.page = page;
    this.getGateList();
  }
  changeItemsPerPageG(): void {
    // this.search = '';
    this.limitG = this.itemsPerPageG;
    this.pageG = 1;
    this.getGroupList();
  }
  pageChangedG(page): void {
    // this.search = '';
    this.pageG = page;
    this.getGroupList();
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
    this.getGateList();
  }
  changeSortingG(sortBy, sortKey): void {
    // this.search = '';
    if(this.sortByG == sortBy) {
      this.sortKeyG = (this.sortKeyG === '-1') ? '1' : '-1';
    }
    else this.sortKeyG = '-1'
    this.sortByG = sortBy;
    this.pageG = 1;
    this.getGroupList();
  }


  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void {
    this.myInputVariable.nativeElement.value = '';
    this.search = '';
    this.getGateList();
  }
  @ViewChild('searchBoxG') myInputVariableG: ElementRef;
  resetSearchG(): void {
    this.myInputVariableG.nativeElement.value = '';
    this.searchG = '';
    this.getGroupList();
  }

  viewGroupUsers(id: string) {
    this.router.navigate([`/access-control/gates/group-users-list/` + id]);
    
  }

}
