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
import { UserACQrCode, UserACQrCodeData } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { ACCESS_CONTROL_LEVEL, Person } from 'projects/fe-common-v2/src/lib/models/person';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { BlockPopupComponent } from '../../../popup/block-popup/block-popup.component';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { Router } from '@angular/router';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { SiteService } from 'projects/fe-common-v2/src/lib/services/site.service';
import { FilterAccessControlLogPopupComponent } from '../../../popup/filter-access-control-log-popup/filter-access-control-log-popup.component';
import { ExtractAccessControlLogPopupComponent } from '../../../popup/extract-access-control-log-popup/extract-access-control-log-popup.component';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../../service/excel.service';
import { AddAccessControlLogPopupComponent } from '../../../popup/add-access-control-log-popup/add-access-control-log-popup.component';

// import { ApiService} from './api';

@Component({
  selector: 'app-access-control-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class AccessControlLogsComponent implements OnInit {
  logsList: any = new MatTableDataSource([]);
  logsListTransformed: any = new MatTableDataSource([]);

  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '-1';
  sortBy = 'timestamp';
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  companyId: any;
  search1: any = null;
  personList: Person[] = new Array();
  siteList: Site[] = new Array();
  gatesList: any[] = new Array();
  logsDisplayedColumns: string[] = ['wheelAction', 'type', 'site', 'gate', 'timestamp', 'surname', 'scope', 'valid'];
  public requestPara = {search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: ''};

  private subject: Subject<string> = new Subject();

  constructor(public dialog: MatDialog,
              private apiServices: AccessControlService,
              private userApiServices: AdminUserManagementService,
              private siteApiServices: AdminSiteManagementService,
              private helper: MCPHelperService,
              private tr: TranslateService,
              private router: Router,
              public translate: TranslateService,
              private com: CommonService,
              private excelService: ExcelService) {

    this._setSearchSubscription();
  }

  async ngOnInit() {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    await this.getUserList();
    await this.getSiteList();
    this.getLogsList();
  }

  async getUserList() {
    let res = await this.userApiServices.getPeopleList(this.companyId);
    if(res.result) {
      this.personList = res.people
    }
  }

  async getSiteList() {
    let res = await this.siteApiServices.getFullSites(this.companyId);
    if(res) this.siteList = res.data;
  }

  getLogsList(): void {
    this.apiServices.getLogs( {
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortKey,
      sortKey: this.sortBy,
      filter: this.filter
    }).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.helper.toggleLoaderVisibility(false);
        this.logsList = res.data;
        this.logsListTransformed = res.data;
        this.transformLogsList();
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.logsList.length > 0;
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
        this.tr.instant('ACCESS_CONTROL.LogListNotFound'),
        'info'
      );
    });
    this.helper.toggleLoaderVisibility(false);
  }

  transformLogsList() {
    for(let transform of this.logsListTransformed) {

      //TRANSFORM SITE
      let site = this.siteList.find(site => site.id == transform.siteId);
      if(site) transform.siteName = site.name;

      // TRANSFORM SCOPE
      let user = this.personList.find(person => person.id == transform.idutente);
      if(user) transform.scope = user.scope;
      else {
        this.apiServices.getExtBadgeByName({name: transform.name, surname: transform.surname}).subscribe((res) => {
          if(res.data) {
            let badge = res.data;
            if(badge.codeData.notes) {
              if(badge.codeData.notes != "") transform.scope = badge.codeData.notes;
              else if(badge.codeData.number != "") transform.number = badge.codeData.number;
            }
            else if(badge.codeData.number != "") transform.number = badge.codeData.number;
          }
        })
      }

      // TRANSFORM GATE NAME
      let gateName = "* "+transform.centralUnitId;
      try {
        gateName = transform.gate[0].name;
      }
      catch(e) {

      }
      transform.gateName = gateName;

      // TRASNFORM NAME SURNAME
      transform.surnameName = transform.surname + " " + transform.name;
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
      this.getLogsList();
    });
  }

  // Pagination
  changeItemsPerPage(): void {
    // this.search = '';
    this.limit = this.itemsPerPage;
    this.page = 1;
    this.getLogsList();
  }
  pageChanged(page): void {
    // this.search = '';
    this.page = page;
    this.getLogsList();
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
    this.getLogsList();
  }


  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void {
    this.myInputVariable.nativeElement.value = '';
    this.search = '';
    this.getLogsList();
  }

  viewLogBadge(log: any) {
    console.log(log);
  }

  async onDownloadLogReport() {
    let list = new Array();
    let res = await this.dialog.open(ExtractAccessControlLogPopupComponent, {}).afterClosed().toPromise();
    if(res) {
      this.helper.toggleLoaderVisibility(true);
      /*
      this.apiServices.getLogsReportCsv({
        startDate: res.startDate,
        endDate: res.endDate
      }).subscribe(result => {
        this.helper.toggleLoaderVisibility(false);
        if(result.meta.totalCount > 0) {
          csv = result.data;
          saveCSV("log-report.csv");
          swal.fire(
            'Success',
            this.translate.instant('INSIGHTS_PEOPLE_PAGE.DOWNLOAD_SUCCESSFULLY'),
            'success'
          );
        }
        else {
          swal.fire(
          '',
          this.tr.instant('ACCESS_CONTROL.LogReportNoItems'),
          'error'
        );
        }
      });*/
      let startDate = res.startDate;
      let endDate = res.endDate;
      this.apiServices.getLogsReport({
        startDate: res.startDate,
        endDate: res.endDate
      }).subscribe(result => {
        this.helper.toggleLoaderVisibility(false);
        if(result.meta.totalCount > 0) {
          list = result.data;
          let filename = "Log Accessi "+this.com.toDDMMYYYYv2(startDate)+ " - "+this.com.toDDMMYYYYv2(endDate);
          let colsWidth = [
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }
          ];
          this.excelService.exportAsExcelFile(list, filename, colsWidth);
          swal.fire(
            'Success',
            this.translate.instant('INSIGHTS_PEOPLE_PAGE.DOWNLOAD_SUCCESSFULLY'),
            'success'
          );
        }
        else {
          swal.fire(
          '',
          this.tr.instant('ACCESS_CONTROL.LogReportNoItems'),
          'error'
        );
        }
      });
    }
  }

  async onFilter() {
    let res = await this.dialog.open(FilterAccessControlLogPopupComponent, {}).afterClosed().toPromise();
    if(res) {
      this.filter = res;
    }
    else this.filter = null;
    this.getLogsList();
  }

  async addLog() {
    let res = await this.dialog.open(AddAccessControlLogPopupComponent, {}).afterClosed().toPromise();
    if(res) {
      this.apiServices.addManualLog(res).subscribe((res) => {
        this.getLogsList();
      })
    }
  }
}
