import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import { ChartOptions } from 'chart.js';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MCPHelperService} from "../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {RecruitingDashboardManagementService} from "../../../../../fe-common-v2/src/lib/services/recruiting-dashboard-management.service";
import {AdminUserManagementService} from "../../../../../fe-common-v2/src/lib/services/admin-user-management.service";
import {BaseChartDirective} from "ng2-charts";
import {Router} from "@angular/router";



export interface DialogData {
  message:any;
  heading:any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  contactTypeIMG = 'assets/images/statistic-1.svg';
  featuresIMG = 'assets/images/statistic-2.svg';
  clientsIMG = 'assets/images/statistic-3.svg';
  sidebarMenuName:string;
  paiChartValue:boolean = false;
  // client report chart
  public getPeopleByRoleData: any = [];
  public peopleByRoleOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    },
  };
  public peopleByRoleLabels: any = [];
  public peopleByRoleType: any = 'bar';
  public peopleByRoleLegend: any = false;
  public peopleByRoleColors: Array < any > = [{
    backgroundColor: ['#FFAD5F','#28C76F','#877DF2','#00CFE8','#EA5455','#66D1D1','#FF66FF','#660099','#FFCC00','#FF6666','#009999','#00CC00','#CC9900','#66FFCC','#0000FF','#660000']

  }];
  public peopleByRoleData: any = [ ];

  // Client By Type chart
  public peopleByGenderOptions: ChartOptions = {
    responsive: true,
  };
  public peopleByGenderLabels: any = [ this.translate.instant('Male'), this.translate.instant('Female'),this.translate.instant('Other'), this.translate.instant('Not Specified')];
  public peopleByGenderData: any = [];
  public peopleByGenderType: any = 'pie';
  public peopleByGenderColors: Array < any > = [{
    backgroundColor: ['#4b6ba2', '#ffad5f','#28C76F',  '#877df2']
  }];

  //Features Report chart

  public recruitingChartGetData : any = [];
  public recruitingOpeningData : any = [];
  public recruitingCandidateData : any = [];
  public recruitingApplicationData : any = [];
  public recruitingHiredApplicationData : any = [];
  public recruitingRejectedApplicationData:any = [];
  public companyDashboardData : any = [];
  public recruitingChartData: any = [
    { data: [ ], label: this.translate.instant('Job Openings') },
    { data: [ ], label: this.translate.instant('Candidates') },
    { data: [ ], label: this.translate.instant('Job Applications') },
    { data: [ ], label: this.translate.instant('Hired_Applications') },
    { data: [ ], label: this.translate.instant('Rejected Applications') },
  ];
  // public recruitingChartColors: Array < any > = [{
  //   backgroundColor: ['#17B6CB', '#D77FB3', '#4292F2']
  // }];

  public recruitingChartColors: any = [
    {
      backgroundColor: 'rgb(75 107 162 / 10%)',
      borderColor: '#262f79',
      pointBackgroundColor: '#4b6ba2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgb(255 177 103 / 10%)',
      borderColor: '#fdb167',
      pointBackgroundColor: '#FFB167',
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
      backgroundColor: 'rgb(40 199 111 / 10%)',
      borderColor: '#30c76f',
      pointBackgroundColor: '#28C76F',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgb(0 207 232 / 10%)',
      borderColor: '#ff0000',
      pointBackgroundColor: '#ff0000',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public recruitingChartLabels: any = [];
  public recruitingChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };
  public recruitingChartLegend = false;
  public recruitingChartType: any = 'line';
  public recruitingChartPlugins = [];

  public lineChartLegend = true;
  public lineChartType: any = 'line';
  public lineChartPlugins = [];
  public companyId : any;
  public dashboardData : any;
  public mainDashboardData : any;
  public peopleModuleData : any;
  public masterModuleData : any;
  tabSelectValue :any = "weekly";
  showEventTypes : boolean = true;
  showDisputeTypes : boolean = true;
  showScope : boolean = true;
  showSites : boolean = true;
  showUniversity : boolean = true;
  showDegree : boolean = true;
  showMasterModule : boolean = false;
  showPeopleManagement : boolean = true;
  showPeople : boolean = true;
  showPeopleGroup : boolean = true;
  showAccounts : boolean = true;
  showPeopleByGender : boolean = true;
  showPeopleByRole : boolean = true;
  showPeopleManagementModule : boolean = false;
  showAlerts : boolean = true;
  showTouchPoint : boolean = true;
  showAlertsModule : boolean = false;
  showJobOpenings : boolean = true;
  showCandidates : boolean = true;
  showHiredApplications : boolean = true;
  showRejectedApplications : boolean = true;
  showJobApplications : boolean = true;
  showRecruitingModule : boolean = false;
  orderMasterModules : number;
  orderRecruiting : number;
  orderPeopleManagement : number;
  orderAlerts : number;
  userLanguage:any;
  constructor(
    public dialog: MatDialog,
    private helper: MCPHelperService,
    private translate: TranslateService,
    private ApiService: RecruitingDashboardManagementService,
    private adminUserManagementService : AdminUserManagementService,
    private router: Router,
  ){
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }else {
      this.router.navigate(['']);
    }
    this.helper.chartUpdateDataEmitter.subscribe((name:string) => {
      this.updateChartDataFunc();
    });
   }

  async ngOnInit() {
    this.sideMenuName();
    const languageData = localStorage.getItem('currentLanguage');
    this.userLanguage = languageData
    this.helper.toggleLoaderVisibility(true);
    let res = await this.adminUserManagementService.getCompany(this.companyId);
    this.companyDashboardData = res.company;
    const masterModulesData = this.companyDashboardData.dashboardCustomization.masterModules;
    const peopleManagementData = this.companyDashboardData.dashboardCustomization.peopleManagement;
    const alertsData = this.companyDashboardData.dashboardCustomization.alerts;
    const recruitingData = this.companyDashboardData.dashboardCustomization.recruiting;
    const dashboardChangeOrder = this.companyDashboardData.dashboardChangeOrder;
    for (let i= 0; i < masterModulesData.length; i++){
      if (masterModulesData[i].moduleStatus == true){
        this.showMasterModule = true
      }else if (masterModulesData[i].moduleName == "Event Types"){
        this.showEventTypes = masterModulesData[i].moduleStatus
      }else if (masterModulesData[i].moduleName == "Global Types"){
        this.showDisputeTypes = masterModulesData[i].moduleStatus
      }else if (masterModulesData[i].moduleName == "Scopes"){
        this.showScope = masterModulesData[i].moduleStatus
      }else if (masterModulesData[i].moduleName == "Sites"){
        this.showSites = masterModulesData[i].moduleStatus
      }else if (masterModulesData[i].moduleName == "University"){
        this.showUniversity = masterModulesData[i].moduleStatus
      }else if (masterModulesData[i].moduleName == "Degree"){
        this.showDegree = masterModulesData[i].moduleStatus
      }
    }
    for (let i=0; i < peopleManagementData.length; i++){
      if (peopleManagementData[i].moduleStatus == true){
        this.showPeopleManagementModule = true
      }else if (peopleManagementData[i].moduleName == "People Management"){
        this.showPeopleManagement = peopleManagementData[i].moduleStatus
      }else if (peopleManagementData[i].moduleName == "People"){
        this.showPeople = peopleManagementData[i].moduleStatus
      }else if (peopleManagementData[i].moduleName == "People Group"){
        this.showPeopleGroup = peopleManagementData[i].moduleStatus
      }else if (peopleManagementData[i].moduleName == "Accounts"){
        this.showAccounts = peopleManagementData[i].moduleStatus
      }else if (peopleManagementData[i].moduleName == "People By Gender"){
        this.showPeopleByGender = peopleManagementData[i].moduleStatus
      }else if (peopleManagementData[i].moduleName == "People By Role"){
        this.showPeopleByRole = peopleManagementData[i].moduleStatus
      }

    }
    for (let i=0; i < alertsData.length; i++){
      if (alertsData[i].moduleStatus == true){
        this.showAlertsModule = true
      }else if (alertsData[i].moduleName == "Alerts"){
        this.showAlerts = alertsData[i].moduleStatus
      }else if (alertsData[i].moduleName == "Touch Point"){
        this.showTouchPoint = alertsData[i].moduleStatus
      }
    }
    for (let i=0; i < recruitingData.length; i++){
      if (recruitingData[i].moduleStatus == true){
        this.showRecruitingModule = true
      }else if (recruitingData[i].moduleName == "Job Openings"){
        this.showJobOpenings = recruitingData[i].moduleStatus
      }else if (recruitingData[i].moduleName == "Candidates"){
        this.showCandidates = recruitingData[i].moduleStatus
      }else if (recruitingData[i].moduleName == "Job Applications"){
        this.showJobApplications = recruitingData[i].moduleStatus
      }else if (recruitingData[i].moduleName == "Hired Applications"){
        this.showHiredApplications = recruitingData[i].moduleStatus
      }else if (recruitingData[i].moduleName == "Rejected Applications"){
        this.showRejectedApplications = recruitingData[i].moduleStatus
      }
    }
    if(dashboardChangeOrder)
    for (let i=0; i < dashboardChangeOrder.length; i++){
      if (dashboardChangeOrder[i].moduleStatus == true){
        this.showRecruitingModule = true
      }else if (dashboardChangeOrder[i].modulename == "Master Modules"){
        this.orderMasterModules = dashboardChangeOrder[i].order
      }else if (dashboardChangeOrder[i].modulename == "Recruiting"){
        this.orderRecruiting = dashboardChangeOrder[i].order
      }else if (dashboardChangeOrder[i].modulename == "People Management"){
        this.orderPeopleManagement = dashboardChangeOrder[i].order
      }else if (dashboardChangeOrder[i].modulename == "Alerts and TouchPoint"){
          this.orderAlerts = dashboardChangeOrder[i].order
      }
    }
    /*this.helper.getClientDashboardData({id: this.companyId, type: "weekly"}).subscribe((data:any) =>{
      this.mainDashboardData = data.dashboard;
      this.dashboardData = this.mainDashboardData.jobApplicationCount;
      this.peopleModuleData = this.mainDashboardData.peopleModule;
      this.masterModuleData = this.mainDashboardData.masterModule;
      this.peopleByGenderData = this.peopleModuleData.peopleByGender;
      this.getPeopleByRoleData = this.peopleModuleData.peopleByRoleCount;

      for (let i = 0; i < this.getPeopleByRoleData.length; i++){
        this.peopleByRoleData.push(this.getPeopleByRoleData[i].count);
        this.peopleByRoleLabels.push(this.getPeopleByRoleData[i]._id);
      }
      this.getDashboardMainData({});
    });*/
    this.helper.getClientDashboardData({id: this.companyId, type: "weekly"}).subscribe((data:any) =>{
      this.mainDashboardData = data.dashboard;
      this.dashboardData = this.mainDashboardData?.jobApplicationCount;
      this.peopleModuleData = this.mainDashboardData?.peopleModule;
      this.masterModuleData = this.mainDashboardData?.masterModule;
      this.peopleByGenderData = this.peopleModuleData?.peopleByGender;
      for(let i=0;i<this.peopleByGenderData.length;i++){
        if(this.peopleByGenderData[i] != 0){
          this.paiChartValue =true;
          break
        }else{this.paiChartValue = false;}
      }
      this.getPeopleByRoleData = this.peopleModuleData.peopleByRoleCount;
      for (let i = 0; i < this.getPeopleByRoleData.length; i++){
        this.peopleByRoleData.push(this.getPeopleByRoleData[i].count);
        this.peopleByRoleLabels.push(this.getPeopleByRoleData[i]._id);
      }
      this.getDashboardMainData({});
    });
  }

  sideMenuName(){
    this.sidebarMenuName = 'Home';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  updateChartDataFunc():void{
    const languageData = localStorage.getItem('currentLanguage');
    this.userLanguage = languageData
    this.getDashboardMainData({});
    this.peopleByGenderLabels = [ this.translate.instant('Male'), this.translate.instant('Female'),this.translate.instant('Other'), this.translate.instant('Not Specified')];
    this.chart.chart?.update();
  };

  onTabChanged($event) {
    const eventLabel = $event.tab.textLabel
    if (eventLabel == 'This Year' || eventLabel == 'Anno'){
      this.tabSelectValue = 'yearly'
    }else if (eventLabel == 'This Month' || eventLabel == 'Mese'){
      this.tabSelectValue = 'monthly'
    }else {
      this.tabSelectValue = 'weekly'
    }
    this.getDashboardMainData({});
    /*this.helper.getClientDashboardData({id: this.companyId, type: this.tabSelectValue}).subscribe((data:any) =>{
      this.mainDashboardData = data.dashboard;
      this.dashboardData = this.mainDashboardData.jobApplicationCount;
      this.getDashboardMainData({});
    });*/
  }
  async getDashboardMainData(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getDashboard({type: this.tabSelectValue});
    if (res.statusCode == 200){
      this.helper.toggleLoaderVisibility(false);
    }
    this.dashboardData = res.data;
    // Job Opening By Scope Chart
    //this.recruitingChartGetData = this.dashboardData.lineChartData;
    this.recruitingOpeningData = [];
    this.recruitingCandidateData = [];
    this.recruitingApplicationData = [];
    this.recruitingChartLabels = [];
    this.recruitingHiredApplicationData = [];
    this.recruitingRejectedApplicationData = [];
    this.recruitingChartData.forEach(o => o.data = []);

    // recruiting dashboard main chart
    this.recruitingChartGetData = this.dashboardData.lineChartData;
    this.recruitingOpeningData = this.recruitingChartGetData.lineChartDataForOpening;
    this.recruitingCandidateData = this.recruitingChartGetData.lineChartDataForCandidate;
    this.recruitingApplicationData = this.recruitingChartGetData.lineChartDataForApplication;
    this.recruitingHiredApplicationData = this.recruitingChartGetData.lineChartDataHiredApplication;
    this.recruitingRejectedApplicationData = this.recruitingChartGetData.lineChartDataRejectApplication;

    if (this.showJobOpenings === true) {
      this.recruitingChartLabels = [];
      for (let i = 0; i < this.recruitingOpeningData.length; i++){
        this.recruitingChartData[0].data.push(this.recruitingOpeningData[i].count);
        this.recruitingChartData[0].label = this.translate.instant('Job Openings');
        // this.recruitingChartLabels.push(this.recruitingOpeningData[i]._id);
        if(this.userLanguage == 'it'){
          if (this.recruitingChartLabels.indexOf(this.recruitingOpeningData[i].ItDay) == -1){
            this.recruitingChartLabels.push(this.recruitingOpeningData[i].ItDay);
          }
        }else{
          if (this.recruitingChartLabels.indexOf(this.recruitingOpeningData[i]._id) == -1) {
            this.recruitingChartLabels.push(this.recruitingOpeningData[i]._id);
          }
        }
      }
    }

    if (this.showCandidates === true) {
      this.recruitingChartLabels = [];
      for (let i = 0; i < this.recruitingCandidateData.length; i++){
        this.recruitingChartData[1].data.push(this.recruitingCandidateData[i].count);
        this.recruitingChartData[1].label = this.translate.instant('Candidates');
        if(this.userLanguage == 'it'){
          if (this.recruitingChartLabels.indexOf(this.recruitingCandidateData[i].ItDay) == -1){
            this.recruitingChartLabels.push(this.recruitingCandidateData[i].ItDay);
          }
        }else{
          if (this.recruitingChartLabels.indexOf(this.recruitingCandidateData[i]._id) == -1) {
            this.recruitingChartLabels.push(this.recruitingCandidateData[i]._id);
          }
        }
      }
    }

    if (this.showJobApplications === true) {
      this.recruitingChartLabels = [];
      for (let i = 0; i < this.recruitingApplicationData.length; i++){
        this.recruitingChartData[2].data.push(this.recruitingApplicationData[i].count);
        this.recruitingChartData[2].label = this.translate.instant('Job Applications');
        if(this.userLanguage == 'it'){
          if (this.recruitingChartLabels.indexOf(this.recruitingApplicationData[i].ItDay) == -1){
            this.recruitingChartLabels.push(this.recruitingApplicationData[i].ItDay);
          }
        }else{
          if (this.recruitingChartLabels.indexOf(this.recruitingApplicationData[i]._id) == -1) {
            this.recruitingChartLabels.push(this.recruitingApplicationData[i]._id);
          }
        }
      }
    }

    if(this.showHiredApplications === true){
      this.recruitingChartLabels = [];
      for(let i = 0; i < this.recruitingHiredApplicationData.length;i++){
        this.recruitingChartData[3].data.push(this.recruitingHiredApplicationData[i].count);
        this.recruitingChartData[3].label = this.translate.instant('Hired Applications');
        if(this.userLanguage == 'it'){
          if (this.recruitingChartLabels.indexOf(this.recruitingHiredApplicationData[i].ItDay) == -1){
            this.recruitingChartLabels.push(this.recruitingHiredApplicationData[i].ItDay);
          }
        }else{
          if (this.recruitingChartLabels.indexOf(this.recruitingHiredApplicationData[i]._id) == -1) {
            this.recruitingChartLabels.push(this.recruitingHiredApplicationData[i]._id);
          }
        }
      }
    }

    if(this.showRejectedApplications === true){
      this.recruitingChartLabels = [];
      for(let i=0; i < this.recruitingRejectedApplicationData.length;i++){
        this.recruitingChartData[4].data.push(this.recruitingRejectedApplicationData[i].count);
        this.recruitingChartData[4].label = this.translate.instant('Rejected Applications');
        if(this.userLanguage == 'it'){
          if (this.recruitingChartLabels.indexOf(this.recruitingRejectedApplicationData[i].ItDay) == -1){
            this.recruitingChartLabels.push(this.recruitingRejectedApplicationData[i].ItDay);
          }
        }else{
          if (this.recruitingChartLabels.indexOf(this.recruitingRejectedApplicationData[i]._id) == -1) {
            this.recruitingChartLabels.push(this.recruitingRejectedApplicationData[i]._id);
          }
        }
      }
    }
    this.helper.toggleLoaderVisibility(false);
  }
  /*async getDashboardMainData(request): Promise<void> {
    // this.helper.toggleLoaderVisibility(true);
    // const res: any = await this.ApiService.getDashboard({type: this.tabSelectValue});
    // if (res.statusCode == 200){
    //   this.helper.toggleLoaderVisibility(false);
    // }
    // this.dashboardData = res.data;

    // Job Opening By Scope Chart
    //this.recruitingChartGetData = this.dashboardData.lineChartData;
    this.recruitingOpeningData = [];
    this.recruitingCandidateData = [];
    this.recruitingApplicationData = [];
    this.recruitingChartLabels = [];
    this.recruitingChartData.forEach(o => o.data = []);

    // recruiting dashboard main chart
    this.recruitingChartGetData = this.dashboardData;
    this.recruitingOpeningData = this.recruitingChartGetData.lineChartDataForOpening;
    this.recruitingCandidateData = this.recruitingChartGetData.lineChartDataForCandidate;
    this.recruitingApplicationData = this.recruitingChartGetData.lineChartDataForApplication;

    for (let i = 0; i < this.recruitingOpeningData.length; i++){
      if (this.showJobOpenings === true){
        this.recruitingChartData[0].data.push(this.recruitingOpeningData[i].count);
        if (this.recruitingOpeningData[0] !== 0){
          this.recruitingChartLabels.push(this.recruitingOpeningData[i]._id);
        }
      }
    }
    for (let i = 0; i < this.recruitingCandidateData.length; i++){
      if (this.showCandidates === true) {
        this.recruitingChartData[1].data.push(this.recruitingCandidateData[i].count);
      }
    }
    for (let i = 0; i < this.recruitingApplicationData.length; i++){
      if (this.showJobApplications === true) {
        this.recruitingChartData[2].data.push(this.recruitingApplicationData[i].count);
      }
    }
    this.helper.toggleLoaderVisibility(false);
  }*/
}
