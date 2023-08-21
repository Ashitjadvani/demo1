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
import { AccessControlBadgeFilterPopupComponent } from '../../../popup/access-control-badge-filter-popup/access-control-badge-filter-popup.component';
import { AccessControlGatesGroup } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { SelectionModel } from '@angular/cdk/collections';
import { YesNoPopupComponent } from '../../../popup/yesno-popup/yesno-popup.component';

// import { ApiService} from './api';

@Component({
  selector: 'app-access-control-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.scss']
})
export class AccessControlUserBadgeComponent implements OnInit {
  userBadgeList: any = new MatTableDataSource([]);
  userBadgeListTransformed: any = new MatTableDataSource([]);

  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '-1';
  sortBy = 'codeData.startDate';
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  companyId: any;
  search1: any = null;
  filterGroupId: string = null;
  filterOnlyActive: boolean = null;
  filterGroup: AccessControlGatesGroup = null;
  personList: Person[] = new Array();
  userBadgeDisplayedColumns: string[] = ['select', 'wheelAction', 'surnameName', 'email', 'type', 'startDate', 'endDate', 'scope', 'status'];
  public requestPara = {search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: ''};

  private subject: Subject<string> = new Subject();

  constructor(public dialog: MatDialog,
              private apiServices: AccessControlService,
              private userApiServices: AdminUserManagementService,
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
    await this.getUserList();
    this.getBadgeList();
  }

  async getUserList() {
    let res = await this.userApiServices.getPeopleList(this.companyId);
    if(res.result) {
      this.personList = res.people
    }
  }

  getBadgeList(): void {
    this.selection.clear();
    this.apiServices.getUserBadges( {
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortKey,
      sortKey: this.sortBy,
      filterGroupId: this.filterGroupId,
      filterOnlyActive: this.filterOnlyActive
    }).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.helper.toggleLoaderVisibility(false);
        this.userBadgeList = res.data;
        this.userBadgeListTransformed = res.data;
        this.transformBadgeList();
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.userBadgeList.length > 0;
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
        this.tr.instant('ACCESS_CONTROL.BadgeListNotFound'),
        'info'
      );
    });
    this.helper.toggleLoaderVisibility(false);
  }

transformBadgeList() {
    for(let transform of this.userBadgeListTransformed) {

      // TRASFORM TYPE
      if(transform.codeData.type == ACCESS_CONTROL_LEVEL.GROUP) {
        transform.codeData.type = this.tr.instant('ACCESS_CONTROL.Gates Groups');
      }
      else if(transform.codeData.type == ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES) {
        transform.codeData.type = this.tr.instant('ACCESS_CONTROL.Single Gates');
      }
      else if(transform.codeData.type == ACCESS_CONTROL_LEVEL.PASSEPARTOUT) {
        transform.codeData.type = "Passepartout";  
      }

      //TRANSFORM STATUS
      transform.status = this.checkBadgeStatus(transform);

      // TRANSFOM EXPIRED
      transform.expired = this.com.checkDateExpired(new Date(transform.codeData.endDate));
      transform.valid = (transform.status === 2);

      // TRANSFORM SCOPE
      let user = this.personList.find(person => person.id == transform.codeData.idutente);
      if(user) transform.scope = user.scope;

      // TRASNSFORM SURNAME NAME
      transform.codeData.surnameName = transform.codeData.surname + " " + transform.codeData.name;

    }
  }

  checkBadgeStatus(badge: any) {
    if(badge.blocked) return 0;
    else if(this.com.checkDateExpired(new Date(badge.codeData.endDate))) return 1;
    else return 2;
  }

  userBadgeBlockDialog(badge: any, index: number, event: any): void {
    const dialogRef = this.dialog.open(BlockPopupComponent, {
      data: {
        message1: this.tr.instant('ACCESS_CONTROL.BlockBadgeSure'),
        message2: badge.codeData.name + " " + badge.codeData.surname,
        message3: this.tr.instant('ACCESS_CONTROL.Validity') + ": " + this.com.toYYYYMMDDv2(badge.codeData.startDate) + " - " + this.com.toYYYYMMDDv2(badge.codeData.endDate),
        heading: this.tr.instant('ACCESS_CONTROL.BlockBadge')
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.helper.toggleLoaderVisibility(true);
        this.apiServices.blockUserBadge(badge.id).subscribe((res: any) => {    
          let reqId = res.data;
          setTimeout(async () => {
            this.apiServices.getRequest(reqId).subscribe((res: any) => {
              this.helper.toggleLoaderVisibility(false);
              let request = res.data;
              if(request.responseAccepted) {
                this.getBadgeList();
                swal.fire(
                  this.tr.instant('ACCESS_CONTROL.Blocked'),
                  this.tr.instant('ACCESS_CONTROL.BadgeBlocked'),
                  'success'
                );
              }
              else {
                this.getBadgeList();
                swal.fire(
                  this.tr.instant('ACCESS_CONTROL.ConnectionError'),
                  this.tr.instant('ACCESS_CONTROL.LomniaOffline'),
                  'error'
                );
              }
            }, (err: any) => {
              this.helper.toggleLoaderVisibility(false);
              const e = err.error;
              swal.fire(
                this.tr.instant('ACCESS_CONTROL.ConnectionError'),
                this.tr.instant('ACCESS_CONTROL.LomniaOffline'),
                'error'
              );
            });
          }, 2000);
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

  // Searching
  onKeyUp(searchTextValue: any): void {
    this.subject.next(searchTextValue);
    this.selection.clear();
  }
  private _setSearchSubscription(): void {
    this.selection.clear();
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.page = 1;
      this.getBadgeList();
    });
  }

  // Pagination
  changeItemsPerPage(): void {
    this.selection.clear();
    // this.search = '';
    this.limit = this.itemsPerPage;
    this.page = 1;
    this.getBadgeList();
  }
  pageChanged(page): void {
    this.selection.clear();
    // this.search = '';
    this.page = page;
    this.getBadgeList();
  }

  // Sorting
  changeSorting(sortBy, sortKey): void {
    this.selection.clear();
    // this.search = '';
    if(this.sortBy == sortBy) {
      this.sortKey = (this.sortKey === '-1') ? '1' : '-1';
    }
    else this.sortKey = '-1'
    this.sortBy = sortBy;
    this.page = 1;
    this.getBadgeList();
  }


  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void {
    this.selection.clear();
    this.myInputVariable.nativeElement.value = '';
    this.search = '';
    this.getBadgeList();
  }

  viewBadge(id: string): void {
    this.router.navigate([`access-control/badges/user/view-user-badge/` + id]);
  }

  onFilterClick() {
    const dialogRef = this.dialog.open(AccessControlBadgeFilterPopupComponent,{
      data: {selectedGroupId: this.filterGroupId, getOnlyActive: this.filterOnlyActive}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(result) {
        this.filterGroupId = result.selectedGroupId;
        this.filterOnlyActive = result.onlyActive;
      }
      else {
        this.filterGroupId = null;
        this.filterOnlyActive = null;
      }
      this.getFilterGroup();
    });
  }

  getFilterGroup() {
    if(this.filterGroupId) {
      this.apiServices.getGatesGroup(this.filterGroupId).subscribe((res) => {
        if(res.data) this.filterGroup = res.data;
      });
    }
    else this.filterGroup = null;
    this.getBadgeList();
  }
  
  selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.userBadgeList != undefined && this.userBadgeList.length > 0) {
        const numRows = this.userBadgeList.length;
        return numSelected === numRows;
    }
  }

  toggleAllRows() {
      if (this.isAllSelected()) {
          this.selection.clear();
          return;
      }

      this.selection.select(...this.userBadgeList);
  }

  checkboxLabel(row?: any): string {
      if (!row) {
          return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  removeSelectionGroupAccess() {    
    if(this.selection.selected.length == 0) {
      swal.fire(
        '',
        this.tr.instant("SelectBadgeFirst"),
        'info'
      );
    }
    else {
      let userList = this.personList.filter(person => this.selection.selected.find(badge => badge.codeData.idutente == person.id));
      let message1 = this.tr.instant("ConfirmRemoveFromAcGroupMessage") + " " +this.filterGroup.name+": ";
      for(let person of userList) {
        message1 = message1 + person.name + " " + person.surname + ", ";
      }
      const dialogRef = this.dialog.open(YesNoPopupComponent,{
        data: {title: this.tr.instant("Confirm"), message1: message1, message2: this.tr.instant("ACCESS_CONTROL.Sure"), icon: "close"}
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if(result) {
          this.helper.toggleLoaderVisibility(true);
          let count = 0;
          for(let person of userList) {
            setTimeout(async () => {
              person.accessControlGroupsId = person.accessControlGroupsId.filter(groupId => groupId != this.filterGroupId);
              await this.userApiServices.addOrUpdatePerson(person);
              await this.userApiServices.generateAccessControlQrCode(person.id);
              this.helper.toggleLoaderVisibility(true);
            }, count*300, person);
            count++;
          }
          setTimeout(() => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
              '',
              this.tr.instant('PeopleRemovedFromGroup'),
              'success'
            );
            this.filterGroupId = null;
            this.getFilterGroup();
            this.getBadgeList();
          }, count*500)
        }
      });
    }
  }
}
