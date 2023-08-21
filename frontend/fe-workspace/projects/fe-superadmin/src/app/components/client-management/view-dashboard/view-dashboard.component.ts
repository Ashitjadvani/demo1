import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions } from 'chart.js';
import { PinUnpinComponent } from '../../../popups/pin-unpin/pin-unpin.component';
import {NSApiService} from "../../../service/NSApi.service";
import {ActivatedRoute} from "@angular/router";
import {NSHelperService} from "../../../service/NSHelper.service";
import swal from "sweetalert2";

export interface DialogData {
  message:any;
  heading:any;
}

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.scss']
})
export class ViewDashboardComponent implements OnInit {
  id: any;
  public mainDashboardData : any;
  public dashboardData : any;
  public peopleModuleData : any;
  public masterModuleData : any;
  clientName : any;
  tabSelectValue :any = "weekly";
  peopleManagementPin : boolean = false;
  masterModulesPin : boolean = false;
  alertsPin : boolean = false;
  recruitingPin : boolean = false;
  touchPointPin : boolean = false;
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
  public peopleByGenderLabels: any = [ 'Male', 'Female','Other', 'Not Specified'];
  public peopleByGenderData: any = [];
  public pinDashboardData: any = [];
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
    { data: [ ], label: 'Job Openings'},
    { data: [ ], label: 'Candidates'},
    { data: [ ], label: 'Job Applications'},
    { data: [ ], label: 'Hired_Applications'},
    { data: [ ], label: 'Rejected Applications'},
  ];
  // public recruitingChartColors: Array < any > = [{
  //   backgroundColor: ['#17B6CB', '#D77FB3', '#4292F2']
  // }];

  public recruitingChartColors: any = [
    { // grey
      backgroundColor: 'rgb(75 107 162 / 10%)',
      borderColor: '#262f79',
      pointBackgroundColor: '#4b6ba2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // Blue
      backgroundColor: 'rgb(255 177 103 / 10%)',
      borderColor: '#fdb167',
      pointBackgroundColor: '#FFB167',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgb(40 199 111 / 10%)',
      borderColor: '#30c76f',
      pointBackgroundColor: '#28C76F',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgb(135 125 242 / 10%)',
      borderColor: '#877DF2',
      pointBackgroundColor: '#877DF2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgb(0 207 232 / 10%)',
      borderColor: '#00CFE8',
      pointBackgroundColor: '#00CFE8',
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

  constructor(
    public dialog: MatDialog,
    public api: NSApiService,
    public activitedRoute: ActivatedRoute,
    private helper: NSHelperService
  ){
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
  }

  changePinDialog(txt : string, currentPin : boolean) {
    const dialogRef = this.dialog.open(PinUnpinComponent, {
      data: {
        heading: currentPin,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        currentPin = !currentPin;
        this.api.pinChartDashboard({companyId:this.id, moduleName: txt, pin:currentPin}).subscribe( res => {
          this.pinDashboardData = res.data.dashboardCustomization;
          this.checkPinStatus()
          swal.fire(
            'success',
            'Pin status has been changed successfully',
            'success'
          )
        });
      }
    });
  }


  ngOnInit(): void {
    this.helper.toggleLoaderVisibility(true);
    this.api.clientViewDashboard({companyId: this.id, type: this.tabSelectValue}).subscribe((data : any) => {
      this.helper.toggleLoaderVisibility(false);
      this.mainDashboardData = data.data;
      this.peopleModuleData = []
      this.masterModuleData = []
      this.peopleByGenderData = []
      this.clientName = this.mainDashboardData.clientName;
      this.peopleModuleData = this.mainDashboardData.peopleModule;
      this.masterModuleData = this.mainDashboardData.masterModule;
      this.peopleByGenderData = this.peopleModuleData.peopleByGender;
      this.pinDashboardData = this.mainDashboardData.clientData;
      this.checkPinStatus();
      this.getPeopleByRoleData = this.peopleModuleData.peopleByRoleCount;
      for (let i = 0; i < this.getPeopleByRoleData.length; i++){
        this.peopleByRoleData.push(this.getPeopleByRoleData[i].count);
        this.peopleByRoleLabels.push(this.getPeopleByRoleData[i]._id);
      }
      this.loadRecrutingChartData();
    });
  }

  checkPinStatus():void{
    for (let i=0;i<this.pinDashboardData.length;i++){
      if (this.pinDashboardData[i].moduleName == "peopleManagement"){
        this.peopleManagementPin  = this.pinDashboardData[i].pin
      }
      if (this.pinDashboardData[i].moduleName == "masterModules"){
        this.masterModulesPin  = this.pinDashboardData[i].pin
      }
      if (this.pinDashboardData[i].moduleName == "alerts"){
        this.alertsPin  = this.pinDashboardData[i].pin
      }
      if (this.pinDashboardData[i].moduleName == "recruiting"){
        this.recruitingPin  = this.pinDashboardData[i].pin
      }
      if (this.pinDashboardData[i].moduleName == "touchPoint"){
        this.touchPointPin  = this.pinDashboardData[i].pin
      }
    }
  }

  onTabChanged($event) {
    const eventLabel = $event.tab.textLabel
    if (eventLabel == 'This Year' || eventLabel == 'Anno'){
      this.tabSelectValue = 'yearly'
    }else if (eventLabel == 'This Month' || eventLabel == 'Mese'){
      this.tabSelectValue = 'monthly'
    }else {
      this.tabSelectValue = 'weekly'
    }
    this.mainRecruitingChartData();
  }

  mainRecruitingChartData(){
    this.helper.toggleLoaderVisibility(true);
    this.api.clientViewDashboard({companyId: this.id, type: this.tabSelectValue}).subscribe((data : any) => {
    this.loadRecrutingChartData();
    });
  }

  loadRecrutingChartData(){
    this.helper.toggleLoaderVisibility(false);
    this.recruitingOpeningData = [];
    this.recruitingCandidateData = [];
    this.recruitingApplicationData = [];
    this.recruitingChartLabels = [];
    this.recruitingHiredApplicationData = [];
    this.recruitingRejectedApplicationData = [];
    this.recruitingChartData.forEach(o => o.data = []);

    // recruiting dashboard main chart
    this.recruitingChartGetData = this.mainDashboardData.RecruitingLineChart;
    this.recruitingOpeningData = this.recruitingChartGetData.lineChartDataForOpening;
    this.recruitingCandidateData = this.recruitingChartGetData.lineChartDataForCandidate;
    this.recruitingApplicationData = this.recruitingChartGetData.lineChartDataForApplication;
    this.recruitingHiredApplicationData = this.recruitingChartGetData.lineChartDataHiredApplication;
    this.recruitingRejectedApplicationData = this.recruitingChartGetData.lineChartDataRejectApplication;

    this.recruitingChartLabels = [];
    for (let i = 0; i < this.recruitingOpeningData.length; i++){
      this.recruitingChartData[0].data.push(this.recruitingOpeningData[i].count);
      this.recruitingChartData[0].label = "Job Openings";
      // this.recruitingChartLabels.push(this.recruitingOpeningData[i]._id);
      if (this.recruitingChartLabels.indexOf(this.recruitingOpeningData[i]._id) == -1) {
        this.recruitingChartLabels.push(this.recruitingOpeningData[i]._id);
      }
    }

    this.recruitingChartLabels = [];
    for (let i = 0; i < this.recruitingCandidateData.length; i++){
      this.recruitingChartData[1].data.push(this.recruitingCandidateData[i].count);
      this.recruitingChartData[1].label = 'Candidates';
      if (this.recruitingChartLabels.indexOf(this.recruitingCandidateData[i]._id) == -1) {
        this.recruitingChartLabels.push(this.recruitingCandidateData[i]._id);
      }
    }

    this.recruitingChartLabels = [];
    for (let i = 0; i < this.recruitingApplicationData.length; i++){
      this.recruitingChartData[2].data.push(this.recruitingApplicationData[i].count);
      this.recruitingChartData[2].label = 'Job Applications';
      if (this.recruitingChartLabels.indexOf(this.recruitingApplicationData[i]._id) == -1) {
        this.recruitingChartLabels.push(this.recruitingApplicationData[i]._id);
      }
    }

    this.recruitingChartLabels = [];
    for(let i = 0; i < this.recruitingHiredApplicationData.length;i++){
      this.recruitingChartData[3].data.push(this.recruitingHiredApplicationData[i].count);
      this.recruitingChartData[3].label = 'Hired Applications';
      if (this.recruitingChartLabels.indexOf(this.recruitingHiredApplicationData[i]._id) == -1) {
        this.recruitingChartLabels.push(this.recruitingHiredApplicationData[i]._id);
      }
    }

    this.recruitingChartLabels = [];
    for(let i=0; i < this.recruitingRejectedApplicationData.length;i++){
      this.recruitingChartData[4].data.push(this.recruitingRejectedApplicationData[i].count);
      this.recruitingChartData[4].label = 'Rejected Applications';
      if (this.recruitingChartLabels.indexOf(this.recruitingRejectedApplicationData[i]._id) == -1) {
        this.recruitingChartLabels.push(this.recruitingRejectedApplicationData[i]._id);
      }
    }
  }

}
