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
import html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MonitorPresencesSettingsPopupComponent } from '../../../popup/monitor-presences-settings-popup/monitor-presences-settings-popup.component';
import swal from "sweetalert2";

@Component({
  selector: 'app-access-control-dashboard',
  templateUrl: './access-control-dashboard.component.html',
  styleUrls: ['./access-control-dashboard.component.scss']
})
export class AccessControlDashboardComponent implements OnInit {

  private subject: Subject<string> = new Subject();

  periodType: string = "Daily";
  selectedDate: Date = new Date();
  selectedMonth: number = 0;
  selectedCity: string = "";
  selectedSiteId: string = "";
  selectedSiteName: string = "";
  selectedGateId: string = "";
  selectedGateName: string = "";
  selectedDateYYYYMMDD = "";
  
  sidebarMenuName = "MonitorPresences";
  sitePresences = new Array();
  userPresences = new Array();
  userPresencesFiltered = new Array();
  userPresencesPaginated = new Array();
  userPresencesDisplayedColumns: string[] = ['name', 'site', 'scope', 'firstIn', 'lastOut'];
  sitePresenceDetailDispayedColumns: string[] = [];
  logDetailsData = new Array();
  selectedIndex: number = null;

  totalPresences: any = null;

  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '1';
  sortBy = 'name';
  sortClass: any = 'down';
  docPdf = new jsPDF();

  today = new Date();
  dateHasPassed = false;
  chartsHour = new Array();
  chartsDay = new Array();
  chartType = 0;
  dynamicChartLabels = new Array();
  dynamicChartData = new Array();

  currentMonth = 0;

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
  public totalChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };
  public totalChartLegend = false;
  public totalChartType: any = 'line';
  public totalChartPlugins = [];

  selectedChart : any = null;

  constructor(private apiService: AccessControlService,
    private helper:MCPHelperService,
    private common: CommonService,
    private _adapter: DateAdapter<any>,
    private dialog: MatDialog,
    private translate: TranslateService) { 
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
    this.sitePresences = new Array();
    this.userPresences = new Array();
    this.totalPresences = null;
    this.selectedIndex = null;
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
      selectedSiteId: this.selectedSiteId,
      selectedGateId: this.selectedGateId
    }
    this.apiService.getUserPresences(data).subscribe((res: any) => {
      console.log(res);
      try {
        if(this.periodType=="Daily") {
          this.sitePresences = res.data.sitePresence;
          this.userPresences = res.data.userPresence;
          this.totalPresences = res.data.totalPresence;
          this.chartsDay = new Array();
          this.chartsHour = res.data.totalPresence.charts[0].charts;
          this.chartType = 0;
        }
        else if(this.periodType == "Monthly") {
          this.userPresences = res.data.totalPresence.users;
          this.totalPresences = res.data.totalPresence;
          this.sitePresences = res.data.sitePresence;
          this.chartsDay = res.data.totalPresence.charts[0].charts;
          this.chartsHour = res.data.totalPresence.charts[1].charts;
          this.chartType = 0;
        }
        this.dynamicChartLabels = this.chartsHour[0].chartLabels;
        this.dynamicChartData = this.chartsHour[0].chartData;
        this.selectedChart = this.chartsHour[0];
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

  formatData() {
    this.searchUserPresences();
    this.totalItems = this.userPresencesFiltered.length;
    this.sortUserPresence();
    this.paginateUserPresences();
  }

  searchUserPresences() {
    this.userPresencesFiltered = new Array();
    if(this.search!="") {
      this.userPresencesFiltered = this.userPresences.filter(userPr => userPr.userName.toLowerCase().includes(this.search.toLowerCase()));
    }
    else {
      for(let userPr of this.userPresences) {
        this.userPresencesFiltered.push(userPr);
      }
    }
  }

  sideMenuName(){
    this.sidebarMenuName = this.translate.instant("INSIGHTS_MENU.MONITOR_PRESENCES")
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  paginateUserPresences() {
    try {
      this.userPresencesPaginated = new Array();
      for(let i=((this.page*this.itemsPerPage)-this.itemsPerPage); i<(this.page*this.itemsPerPage); i++) {
        if(i<this.userPresencesFiltered.length) this.userPresencesPaginated.push(this.userPresencesFiltered[i]);
      }
    }
    catch(e) {
      console.log(e);
    }
  }

  sortUserPresence() {
    try {
      if(this.sortBy == "name") {
        if(this.sortKey == 1) this.userPresencesFiltered.sort((a,b) => a.userName.localeCompare(b.userName));
        else this.userPresencesFiltered.sort((a,b) => b.userName.localeCompare(a.userName));
      }
      else if(this.sortBy == "site") {
        if(this.sortKey == 1) this.userPresencesFiltered.sort((a,b) => a.siteName.localeCompare(b.siteName));
        else this.userPresencesFiltered.sort((a,b) => b.siteName.localeCompare(a.siteName));
      }
      else if(this.sortBy == "scope") {
        if(this.sortKey == 1) this.userPresencesFiltered.sort((a,b) => a.userScope.localeCompare(b.userScope));
        else this.userPresencesFiltered.sort((a,b) => b.userScope.localeCompare(a.userScope));
      }
      else if(this.sortBy == "firstIn") {
        if(this.sortKey == 1) this.userPresencesFiltered.sort((a,b) => this.common.compareOnlyTime(a.firstIn,b.firstIn));
        else this.userPresencesFiltered.sort((a,b) => this.common.compareOnlyTime(b.firstIn,a.firstIn));
      }
      else if(this.sortBy == "lastOut") {
        if(this.sortKey == 1) this.userPresencesFiltered.sort((a,b) => this.common.compareOnlyTime(a.lastOut,b.lastOut));
        else this.userPresencesFiltered.sort((a,b) => this.common.compareOnlyTime(b.lastOut,a.lastOut));
      }
    }
    catch(e) { console.log(e) }
  }

  // Sorting
  changeSorting(sortBy, sortKey): void {
    if(this.sortBy == sortBy) {
      this.sortKey = (this.sortKey === '-1') ? '1' : '-1';
    }
    else this.sortKey = '-1'
    this.sortBy = sortBy;
    this.page = 1;
    this.formatData();
  }

  // Pagination
  changeItemsPerPage(): void {
    this.limit = this.itemsPerPage;
    this.page = 1;
    this.paginateUserPresences();
  }
  pageChanged(page): void {
    this.page = page;
    this.paginateUserPresences();
  }

  getLogDetails(element: any, index: any) {
    this.logDetailsData = element.events;
    if (this.selectedIndex == index){
      this.selectedIndex = null;
    }else {
      this.selectedIndex = index;
    }
    element.isExpanded = !element.isExpanded;
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
      this.page = 1;
      this.formatData();
    });
  }

  async downloadReportPdf() {
    this.helper.toggleLoaderVisibility(true);
    try {
      let datas = new Array();
      let canvas = new Array();
      let repInfo = null;
      let repInfoCanvas = null;
      let repInfoUrl = null;
      if(this.periodType == "Daily") {
        let tot = document.getElementById('repDayTot');
        if(tot) datas.push(tot);
        for(let site of this.sitePresences) {
          let str = "repDay" + site.siteName;
          let siteDoc = document.getElementById(str);
          if(siteDoc) datas.push(siteDoc);
        }
      }
      else if (this.periodType == "Monthly" && this.selectedGateId!="") {
        let str = "repMonUnit";
        let doc = document.getElementById(str);
        if(doc) datas.push(doc);
      }
      else if (this.periodType == "Monthly" && this.selectedSiteId!="") {
        let str = "repMonSite";
        let doc = document.getElementById(str);
        if(doc) datas.push(doc);
      }
      else if (this.periodType == "Monthly") {
        let tot = document.getElementById('repMonTot');
        if(tot) datas.push(tot);
        for(let site of this.sitePresences) {
          let str = "repMon" + site.siteName;
          let siteDoc = document.getElementById(str);
          if(siteDoc) datas.push(siteDoc);
        }
      }

      repInfo = document.getElementById('repInfo');
      if(repInfo) repInfoCanvas = await html2canvas(repInfo);
      if(repInfoCanvas) repInfoUrl = repInfoCanvas.toDataURL('image/jpeg');
      
      for(let data of datas) {
        let canva = await html2canvas(data);
        if(canva) canvas.push(canva);
      }

      if(canvas.length > 0) {
        let pdf = new jsPDF('l', 'cm', 'a4', true);
        let logo = new Image();
        logo.src = '/assets/images/legance-color.png';
        pdf.addImage(logo, 'JPEG', 8, 6.5, 13, 4, undefined, 'FAST');

        logo.src = '/assets/images/nunow-footer.png';
        pdf.addImage(logo, 'JPEG', 0.6, 0.5, 2.5, 1.5, undefined, 'FAST');
    
        pdf.setFont("helvetica");
        pdf.setFontSize(22);

        let txtString = "REPORT PRESENZE";
        let txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
        let txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
        pdf.text(txtString, txtOffset, 12);

        if(this.periodType == "Daily") {
          txtString = this.common.formatDateTime(this.selectedDate,"dd-MM-YYYY");
          txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
          txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
          pdf.text(txtString, txtOffset, 13);
        }
        else if(this.periodType == "Monthly") {
          let fullYear = this.today.getFullYear();
          if(this.currentMonth < this.selectedMonth) fullYear = fullYear-1;
          if(this.selectedMonth == 0) txtString = "GENNAIO " + fullYear;
          else if(this.selectedMonth == 1) txtString = "FEBBRAIO " + fullYear;
          else if(this.selectedMonth == 2) txtString = "MARZO " + fullYear;
          else if(this.selectedMonth == 3) txtString = "APRILE " + fullYear;
          else if(this.selectedMonth == 4) txtString = "MAGGIO " + fullYear;
          else if(this.selectedMonth == 5) txtString = "GIUGNO " + fullYear;
          else if(this.selectedMonth == 6) txtString = "LUGLIO " + fullYear;
          else if(this.selectedMonth == 7) txtString = "AGOSTO " + fullYear;
          else if(this.selectedMonth == 8) txtString = "SETTEMBRE " + fullYear;
          else if(this.selectedMonth == 9) txtString = "OTTOBRE " + fullYear;
          else if(this.selectedMonth == 10) txtString = "NOVEMBRE " + fullYear;
          else if(this.selectedMonth == 11) txtString = "DICEMBRE " + fullYear;
          txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
          txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
          pdf.text(txtString, txtOffset, 13);
        }

        if(this.selectedGateId) {
          txtString = this.selectedGateName + " " + this.selectedSiteName;
          txtString = txtString.toUpperCase();
          txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
          txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
          pdf.text(txtString, txtOffset, 14);
        }
        else if(this.selectedSiteId) {
          txtString = this.selectedSiteName;
          txtString = txtString.toUpperCase();
          txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
          txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
          pdf.text(txtString, txtOffset, 14);
        }
        else if(this.selectedCity) {
          txtString = this.selectedCity;
          txtString = txtString.toUpperCase();
          txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
          txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
          pdf.text(txtString, txtOffset, 14);
        }

        canvas.forEach((canva, index) => {
          pdf.addPage();
          pdf.addImage(logo, 'JPEG', 0.6, 0.5, 2.5, 1.5, undefined, 'FAST');
          let imageURL = canva.toDataURL('image/jpeg');
          let imgRatio = datas[index].clientHeight / datas[index].clientWidth;
          let pdfWidth = pdf.internal.pageSize.getWidth();
          let finalWidth = (pdfWidth*90)/100;
          let finalHeight = finalWidth * imgRatio;
          if(this.periodType=="Daily") pdf.addImage(imageURL, 'JPEG', 1.5, 5, finalWidth, finalHeight, undefined, 'FAST');
          if(this.periodType=="Monthly") pdf.addImage(imageURL, 'JPEG', 1.5, 3.3, finalWidth, finalHeight, undefined, 'FAST');
          if(repInfoUrl) {
            let imgPaddingTop = 4.8 + finalHeight + 0.5;
            let imgRatio = repInfo.clientHeight / repInfo.clientWidth;
            let finalWidth = 26;
            finalHeight = finalWidth * imgRatio;
            pdf.addImage(repInfoUrl, 'JPEG', 1.5, imgPaddingTop, finalWidth, finalHeight, undefined, 'FAST');
          }
        });

        let fileName = "Report Presenze " + this.common.formatDateTime(this.selectedDate,"dd-MM-YYYY");
        if(this.selectedGateId) fileName = fileName + " " + this.selectedGateName + " " + this.selectedSiteName + ".pdf";
        else if(this.selectedSiteId) fileName = fileName + " " + this.selectedSiteName + ".pdf";
        else if(this.selectedCity)fileName = fileName + " " + this.selectedCity + ".pdf";   
        else fileName = fileName + ".pdf";
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          this.translate.instant('PdfGenerated'),
          this.translate.instant('Downloaded'),
          'success'
        );
        pdf.save(fileName);
      }
      else {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          this.translate.instant('PdfGenerationError'),
          this.translate.instant('ACCESS_CONTROL.TryAgain'),
          'error'
        );
      }
    }
    catch(e) {
      console.log(e);
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        this.translate.instant('PdfGenerationError'),
        this.translate.instant('ACCESS_CONTROL.TryAgain'),
        'error'
      );
    }
  }

  async downloadChartsPdf() {
    this.helper.toggleLoaderVisibility(true);
    try {
      let data = document.getElementById('chartsPdf');
      let canvas = await html2canvas(data); 

      let pdf = new jsPDF('l', 'cm', 'a4', true);
      let logo = new Image();
      logo.src = '/assets/images/legance-color.png';
      pdf.addImage(logo, 'JPEG', 8, 6.5, 13, 4, undefined, 'FAST');

      logo.src = '/assets/images/nunow-footer.png';
      pdf.addImage(logo, 'JPEG', 0.6, 0.5, 2.5, 1.5, undefined, 'FAST');

      pdf.setFont("helvetica");
      pdf.setFontSize(22);

      let txtString = "GRAFICO PRESENZE ";
      if(this.selectedChart.chartName == "Totale") txtString = txtString + "UTENTI";
      else txtString = txtString = txtString + this.selectedChart.chartName;
      txtString = txtString.toUpperCase();
      let txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
      let txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
      pdf.text(txtString, txtOffset, 12);

      if(this.periodType == "Daily") {
        txtString = this.common.formatDateTime(this.selectedDate,"dd-MM-YYYY");
        txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
        txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
        pdf.text(txtString, txtOffset, 13);
      }
      else if(this.periodType == "Monthly") {
        let fullYear = this.today.getFullYear();
        if(this.currentMonth < this.selectedMonth) fullYear = fullYear-1;
        if(this.selectedMonth == 0) txtString = "GENNAIO " + fullYear;
        else if(this.selectedMonth == 1) txtString = "FEBBRAIO " + fullYear;
        else if(this.selectedMonth == 2) txtString = "MARZO " + fullYear;
        else if(this.selectedMonth == 3) txtString = "APRILE " + fullYear;
        else if(this.selectedMonth == 4) txtString = "MAGGIO " + fullYear;
        else if(this.selectedMonth == 5) txtString = "GIUGNO " + fullYear;
        else if(this.selectedMonth == 6) txtString = "LUGLIO " + fullYear;
        else if(this.selectedMonth == 7) txtString = "AGOSTO " + fullYear;
        else if(this.selectedMonth == 8) txtString = "SETTEMBRE " + fullYear;
        else if(this.selectedMonth == 9) txtString = "OTTOBRE " + fullYear;
        else if(this.selectedMonth == 10) txtString = "NOVEMBRE " + fullYear;
        else if(this.selectedMonth == 11) txtString = "DICEMBRE " + fullYear;
        txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
        txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
        pdf.text(txtString, txtOffset, 13);
      }

      if(this.selectedGateId) {
        txtString = this.selectedGateName + " " + this.selectedSiteName;
        txtString = txtString.toUpperCase();
        txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
        txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
        pdf.text(txtString, txtOffset, 14);
      }
      else if(this.selectedSiteId) {
        txtString = this.selectedSiteName;
        txtString = txtString.toUpperCase();
        txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
        txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
        pdf.text(txtString, txtOffset, 14);
      }
      else if(this.selectedCity) {
        txtString = this.selectedCity;
        txtString = txtString.toUpperCase();
        txtWidth = pdf.getStringUnitWidth(txtString) * pdf.getFontSize() / pdf.internal.scaleFactor;
        txtOffset = (pdf.internal.pageSize.width - txtWidth) / 2;
        pdf.text(txtString, txtOffset, 14);
      }
      
      pdf.addPage();
      pdf.addImage(logo, 'JPEG', 0.6, 0.5, 2.5, 1.5, undefined, 'FAST');
      let imageURL = canvas.toDataURL('image/jpeg');
      let imgRatio = data.clientHeight / data.clientWidth;
      let pdfWidth = pdf.internal.pageSize.getWidth();
      let finalWidth = (pdfWidth*60)/100;
      let finalHeight = finalWidth * imgRatio;
      let offset = (pdf.internal.pageSize.width - finalWidth) / 2;
      pdf.addImage(imageURL, 'JPEG', offset, 4.5, finalWidth, finalHeight, undefined, 'FAST');

      let fileName = "Grafico Presenze " + this.common.formatDateTime(this.selectedDate,"dd-MM-YYYY");
      if(this.selectedGateId) fileName = fileName + " " + this.selectedGateName + " " + this.selectedSiteName + ".pdf";
      else if(this.selectedSiteId) fileName = fileName + " " + this.selectedSiteName + ".pdf";
      else if(this.selectedCity)fileName = fileName + " " + this.selectedCity + ".pdf";   
      else fileName = fileName + ".pdf";
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        this.translate.instant('PdfGenerated'),
        this.translate.instant('Downloaded'),
        'success'
      );
      pdf.save(fileName);
    }
    catch(e) {
      console.log(e);
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        this.translate.instant('PdfGenerationError'),
        this.translate.instant('ACCESS_CONTROL.TryAgain'),
        'error'
      );
    }
  }

  onSettingsClick() {
    const dialogRef = this.dialog.open(MonitorPresencesSettingsPopupComponent,{
      data: {
        periodType: this.periodType,
        selectedMonth: this.selectedMonth,
        selectedDate: this.selectedDate,
        selectedDateYYYYMMDD: this.selectedDateYYYYMMDD,
        selectedCity: this.selectedCity,
        selectedSiteId: this.selectedSiteId,
        selectedSiteName: this.selectedSiteName,
        selectedGateId: this.selectedGateId,
        selectedGateName: this.selectedGateName
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
        this.selectedGateId = result.selectedGateId;
        this.selectedGateName = result.selectedGateName;
        this.getData();        
      }
    });
  }

  getChartData(scope: any) {
    let chartData = [
      { data: [ ], label: this.translate.instant("MONITOR_PRESENCES.UsersNumber") },
      { data: [ ], label: this.translate.instant("MONITOR_PRESENCES.Entrances") },
      { data: [ ], label: this.translate.instant("MONITOR_PRESENCES.Exites") }
    ];
    for(let enNum of scope.entrancesNum) {
      chartData[0].data.push(scope.totalUsersNum);
      chartData[1].data.push(enNum);
    }
    for(let extNum of scope.exitesNum) {
      chartData[2].data.push(extNum);
    }
    return chartData;
  }

  onChartTabChanged($event: any) {
    this.chartType = $event.index;
    this.chartType==1 ? this.dynamicChartLabels = this.chartsDay[0].chartLabels : this.dynamicChartLabels = this.chartsHour[0].chartLabels;
    this.chartType==1 ? this.dynamicChartData = this.chartsDay[0].chartData : this.dynamicChartData = this.chartsHour[0].chartData;
    this.chartType==1 ? this.selectedChart = this.chartsDay[0] : this.selectedChart = this.chartsHour[0];

    console.log(this.selectedChart);
  }

  onChartSelectionChanged($event: any) {
    this.dynamicChartLabels = $event.value.chartLabels;
    this.dynamicChartData = $event.value.chartData;
    this.selectedChart = $event.value;
    console.log(this.selectedChart);
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

}