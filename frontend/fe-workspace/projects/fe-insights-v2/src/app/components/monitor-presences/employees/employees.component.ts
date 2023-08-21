import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { ChartOptions } from 'chart.js';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import { jsPDF } from "jspdf";
import swal from "sweetalert2";
import html2canvas from 'html2canvas';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MonitorEmployeeSettingsPopupComponent } from '../../../popup/monitor-employee-settings-popup/monitor-employee-settings-popup.component';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { UserProfile } from 'projects/fe-common-v2/src/lib/models/admin/user';
import { UserCapabilityService } from '../../../service/user-capability.service';

@Component({
  selector: 'app-monitor-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class MonitorEmployeesComponent implements OnInit {

  private subject: Subject<string> = new Subject();

  periodType: string = "Daily";
  selectedDate: Date = new Date();
  selectedMonth: number = 0;
  selectedCity: string = "";
  selectedSiteId: string = "";
  selectedSiteName: string = "";
  selectedDateYYYYMMDD = "";
  
  sidebarMenuName = "MonitorEmployees";

  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '1';
  sortBy = 'site';
  sortClass: any = 'down';
  docPdf = new jsPDF();

  today = new Date();
  dateHasPassed = false;
  selectedChart = null;

  currentMonth = 0;

  totals = new Array();
  monthlyTotals = new Array();
  charts = new Array();
  officeWorkingList = new Array();
  smartWorkingList = new Array();
  noWorkingList = new Array();

  tabIndex: number = 0;
  tabDayIndex: number = 1;

  tableData = new Array();
  tableDataFiltered = new Array();
  tableDataPaginated = new Array();

  public chartColors: any = [
    { //blu
      backgroundColor: 'rgb(75 107 162 / 10%)',
      borderColor: '#262f79',
      pointBackgroundColor: '#4b6ba2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { //verde
      backgroundColor: 'rgb(40 199 111 / 10%)',
      borderColor: '#30c76f',
      pointBackgroundColor: '#28C76F',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { //rosso
      backgroundColor: 'rgb(255 68 58 / 10%)',
      borderColor: '#FF443A',
      pointBackgroundColor: '#FF443A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgb(135 125 242 / 10%)',
      borderColor: '#877DF2',
      pointBackgroundColor: '#877DF2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgb(0 207 232 / 10%)',
      borderColor: '#00CFE8',
      pointBackgroundColor: '#00CFE8',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }

  ];
  public chartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };
  public chartLegend = false;
  public chartType: any = 'line';
  public chartPlugins = [];

  constructor(private apiService: AccessControlService,
    private helper:MCPHelperService,
    private common: CommonService,
    private _adapter: DateAdapter<any>,
    private dialog: MatDialog,
    private translate: TranslateService,
    private userManagementService: UserManagementService,
    private userCapabilityService: UserCapabilityService) { 
      this._setSearchSubscription();
      this._adapter.setLocale('it-IT');}

  async ngOnInit() {
    this.selectedDate = new Date();
    this.selectedDateYYYYMMDD = this.common.formatDateTime(this.selectedDate,"YYYYMMdd");
    this.currentMonth = this.today.getMonth();
    this.sideMenuName();
    this.getData();
  }

  getData() {
    this.helper.toggleLoaderVisibility(true);
    this.tabIndex = 0;
    this.selectedChart = null;
    this.totals = new Array();
    this.tableData = new Array();
    this.charts = new Array();
    this.officeWorkingList = new Array();
    this.smartWorkingList = new Array();
    this.noWorkingList = new Array();
    let now = new Date();
    now.setDate(now.getDate()-1);
    now.setHours(23);
    now.setMinutes(59);
    this.selectedDate.getTime() <= now.getTime() ? this.dateHasPassed = true : this.dateHasPassed = false;
    let data = {
      periodType: this.periodType,
      selectedDate: this.selectedDate,
      selectedMonth: this.selectedMonth,
      selectedCity: this.selectedCity,
      selectedSiteId: this.selectedSiteId
    }
    this.apiService.getEmployeePresences(data).subscribe((res: any) => {
      try {
        console.log(res);
        if(this.periodType=='Daily') this.totals = res.data.totals;
        else {
          this.monthlyTotals = res.data.totals;
          this.totals = this.monthlyTotals[0].totals;
        }
        this.officeWorkingList = res.data.list.officeWorking;
        this.smartWorkingList = res.data.list.smartWorking;
        this.noWorkingList = res.data.list.noWorking;
        this.tableData = this.officeWorkingList;
        this.charts = res.data.charts;
        for(let chart of this.charts) {
          for(let data of chart.chartData) {
            data.label = this.translate.instant(data.label);
          }
        }
        this.selectedChart = this.charts[0];
        this.tabIndex = 0;
        this.tableData = this.officeWorkingList;
        this.formatData();
        this.helper.toggleLoaderVisibility(false);
      }
      catch(e) { 
        this.helper.toggleLoaderVisibility(false);
      }
    },
    (err: any) => {
      this.helper.toggleLoaderVisibility(false);

    });
  }

  sideMenuName(){
    this.sidebarMenuName = this.translate.instant("INSIGHTS_MENU.MONITOR_PRESENCES")
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  onSettingsClick() {
    const dialogRef = this.dialog.open(MonitorEmployeeSettingsPopupComponent,{
      data: {
        periodType: this.periodType,
        selectedMonth: this.selectedMonth,
        selectedDate: this.selectedDate,
        selectedDateYYYYMMDD: this.selectedDateYYYYMMDD,
        selectedCity: this.selectedCity,
        selectedSiteId: this.selectedSiteId,
        selectedSiteName: this.selectedSiteName
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(result) {
        this.periodType = result.periodType;
        this.selectedMonth = result.selectedMonth;
        this.selectedDate = result.selectedDate;
        this.selectedCity = result.selectedCity;
        this.selectedSiteId = result.selectedSiteId;
        this.selectedSiteName = result.selectedSiteName;
        this.getData();        
      }
    });
  }

  getSelectedMonthYear() {
    let monthYear = "";
    if(this.selectedMonth == 0) monthYear = this.translate.instant("MONITOR_PRESENCES.January");
    else if (this.selectedMonth == 1) monthYear = this.translate.instant("MONITOR_PRESENCES.February");
    else if (this.selectedMonth == 2) monthYear = this.translate.instant("MONITOR_PRESENCES.March");
    else if (this.selectedMonth == 3) monthYear = this.translate.instant("MONITOR_PRESENCES.April");
    else if (this.selectedMonth == 4) monthYear = this.translate.instant("MONITOR_PRESENCES.May");
    else if (this.selectedMonth == 5) monthYear = this.translate.instant("MONITOR_PRESENCES.June");
    else if (this.selectedMonth == 6) monthYear = this.translate.instant("MONITOR_PRESENCES.July");
    else if (this.selectedMonth == 7) monthYear = this.translate.instant("MONITOR_PRESENCES.August");
    else if (this.selectedMonth == 8) monthYear = this.translate.instant("MONITOR_PRESENCES.September");
    else if (this.selectedMonth == 9) monthYear = this.translate.instant("MONITOR_PRESENCES.October");
    else if (this.selectedMonth == 10) monthYear = this.translate.instant("MONITOR_PRESENCES.November");
    else if (this.selectedMonth == 11) monthYear = this.translate.instant("MONITOR_PRESENCES.December");
    if(this.selectedMonth <= this.currentMonth) monthYear = monthYear + " " + this.today.getFullYear();
    else monthYear = monthYear + " " + (this.today.getFullYear()-1);

    return monthYear;
  }

  downloadChartsPdf() {}


  onTabChange(event: any) {
    this.tabIndex = event.index;
    if(this.periodType == "Daily") {
      if(this.tabIndex == 0) {
        this.tableData = this.officeWorkingList;
        this.sortBy = "name";
        this.formatData();
      }
      else if (this.tabIndex == 1) {
        this.tableData = this.smartWorkingList;
        this.sortBy = "name";
        this.formatData();
      }
      else  if (this.tabIndex == 2) {
        this.tableData = this.noWorkingList;
        this.sortBy = "name";
        this.formatData();
      }
      else {
        this.tableData = new Array();
        this.formatData();
      }
    }
    else if(this.periodType=="Monthly") {
      if(this.tabIndex == 0) {
        this.tableData = this.officeWorkingList[this.tabDayIndex].officeWorking;
        this.sortBy = "site";
        this.formatData();
      }
      else if (this.tabIndex == 1) {
        this.tableData = this.smartWorkingList[this.tabDayIndex].smartWorking;
        this.sortBy = "name";
        this.formatData();
      }
      else  if (this.tabIndex == 2) {
        this.tableData = this.noWorkingList[this.tabDayIndex].noWorking;
        this.sortBy = "info";
        this.formatData();
      }
      else {
        this.tableData = new Array();
        this.formatData();
      }
    }
  }

  onDayTabChange(event: any) {
    this.tabDayIndex = event.index;
    if(this.tabIndex == 0) {
      this.tableData = this.officeWorkingList[this.tabDayIndex].officeWorking;
      this.sortBy = "site";
      this.formatData();
    }
    else if (this.tabIndex == 1) {
      this.tableData = this.smartWorkingList[this.tabDayIndex].smartWorking;
      this.sortBy = "name";
      this.formatData();
    }
    else  if (this.tabIndex == 2) {
      this.tableData = this.noWorkingList[this.tabDayIndex].noWorking;
      this.sortBy = "info";
      this.formatData();
    }
    else {
      this.tableData = new Array();
      this.formatData();
    }
  }

  changeSorting(sortBy: string, sortKey: string) {
    if(this.sortBy == sortBy) {
      this.sortKey = (this.sortKey === '-1') ? '1' : '-1';
    }
    else this.sortKey = '-1'
    this.sortBy = sortBy;
    this.formatData();
  }

  sortList() {
    try {
      if(this.sortBy == "name") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => a.userName.localeCompare(b.userName));
        else this.tableData.sort((a,b) => b.userName.localeCompare(a.userName));
      }
      else if(this.sortBy == "info") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => a.detail.localeCompare(b.detail));
        else this.tableData.sort((a,b) => b.detail.localeCompare(a.detail));
      }
      else if(this.sortBy == "site") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => a.siteName.localeCompare(b.siteName));
        else this.tableData.sort((a,b) => b.siteName.localeCompare(a.siteName));
      }
      else if(this.sortBy == "start") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => this.common.compareOnlyTime(a.start, b.start));
        else this.tableData.sort((a,b) => this.common.compareOnlyTime(b.start, a.start));
      }
      else if(this.sortBy == "lunchStart") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => this.common.compareOnlyTime(a.lunchStart, b.lunchStart));
        else this.tableData.sort((a,b) => this.common.compareOnlyTime(b.lunchStart, a.lunchStart));
      }
      else if(this.sortBy == "lunchEnd") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => this.common.compareOnlyTime(a.lunchEnd, b.lunchEnd));
        else this.tableData.sort((a,b) => this.common.compareOnlyTime(b.lunchEnd, a.lunchEnd));
      }
      else if(this.sortBy == "end") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => this.common.compareOnlyTime(a.end, b.end));
        else this.tableData.sort((a,b) => this.common.compareOnlyTime(b.end, a.end));
      }
      else if(this.sortBy == "duration") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => a.duration.localeCompare(b.duration));
        else this.tableData.sort((a,b) => b.duration.localeCompare(a.duration));
      }
      else if(this.sortBy == "userHours") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => a.userHours - b.userHours);
        else this.tableData.sort((a,b) => b.userHours - a.userHours);
      }
      else if(this.sortBy == "minutesDifference") {
        if(this.sortKey == -1) this.tableData.sort((a,b) => a.minutesDifference - b.minutesDifference);
        else this.tableData.sort((a,b) => b.minutesDifference - a.minutesDifference);
      }
    }
    catch(e) { console.log(e) }
  }

  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void {
    this.myInputVariable.nativeElement.value = '';
    this.search = '';
    this.formatData();
  }

  // Searching
  onKeyUp(searchTextValue: any): void {
    this.subject.next(searchTextValue);
  }
  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.formatData();
    });
  }

  searchData() {
    this.tableDataFiltered = new Array();
    if(this.search!="") {
      this.page = 1;
      if(this.tabIndex==0) {
        this.tableDataFiltered = this.tableData.filter(data => data.userName.toLowerCase().includes(this.search.toLowerCase()) || data.siteName.toLowerCase().includes(this.search.toLowerCase()));
      }
      else {
        this.tableDataFiltered = this.tableData.filter(data => data.userName.toLowerCase().includes(this.search.toLowerCase()));
      }
    }
    else {
      for(let data of this.tableData) {
        this.tableDataFiltered.push(data);
      }
    }
  }

  formatData() {
    this.sortList();
    this.searchData();
    this.totalItems = this.tableDataFiltered.length;
    this.paginateData();
  }

  checkValidWork(minDiff: string) {
    if(minDiff) {
      if(+minDiff >= 0) return true;
      else return false;
    }
    return false;
  }

    // Pagination
    changeItemsPerPage(): void {
      this.limit = this.itemsPerPage;
      this.page = 1;
      this.paginateData();
    }
    pageChanged(page): void {
      this.page = page;
      this.paginateData();
    }

    paginateData() {
      try {
        this.tableDataPaginated = new Array();
        for(let i=((this.page*this.itemsPerPage)-this.itemsPerPage); i<(this.page*this.itemsPerPage); i++) {
          if(i<this.tableDataFiltered.length) this.tableDataPaginated.push(this.tableDataFiltered[i]);
        }
      }
      catch(e) {
        console.log(e);
      }
    }

    isFunctionAvailable(functionId: string): boolean {
      return this.userCapabilityService.isFunctionAvailable(functionId);
    }



}
