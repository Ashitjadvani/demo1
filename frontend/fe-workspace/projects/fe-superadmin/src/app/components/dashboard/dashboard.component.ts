import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {ChartOptions} from 'chart.js';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PinUnpinComponent} from '../../popups/pin-unpin/pin-unpin.component';
import {NSHelperService} from '../../service/NSHelper.service';
import {NSApiService} from '../../service/NSApi.service';
import {BaseChartDirective} from "ng2-charts";
import swal from "sweetalert2";
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';


export interface DialogData {
    message: any;
    heading: any;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    public mainDashboardData: any;
    contactTypeIMG = 'assets/images/statistic-1.svg';
    featuresIMG = 'assets/images/statistic-2.svg';
    clientsIMG = 'assets/images/statistic-3.svg';
    sidebarMenuName: string;
    statesticData: any;
    dashboardData: any;
    getRecruitingChartData: any;
    getrecruitingChartGetData: any;
    tabSelectValue: any = "weekly";
    peopleManagementPin: boolean = false;
    masterModulesPin: boolean = false;
    alertsPin: boolean = false;
    recruitingPin: boolean = false;
    touchPointPin: boolean = false;
    public pinDashboardData: any = [];
    activeClientDate = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
    });
    endDate: any;
    // client report chart
    public barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: any = [];
    public barChartType: any = 'bar';
    public barChartLegend: any = true;
    public barChartColors: Array<any> = [{
        backgroundColor: ['#ffad5f', '#28c76f', '#877df2', '#00cfe8', '#ea5455', '#66d1d1', '#4b6ba2']
    }];
    public barChartData: any = [];

    // Clients Report
    public clientReportChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    };
    // Clients Report
    public clientActiveReportChartOptions = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    };
    //client active report Chart

    public clientReportChartLabels: any = [];
    public clientReportChartType: any = 'bar';
    public clientReportChartLegend: any = false;
    public clientReportChartColors: Array<any> = [{
        backgroundColor: ['#ffad5f', '#28c76f', '#877df2', '#00cfe8', '#ea5455', '#66d1d1', '#4b6ba2']
    }];
    public clientReportChartData: any = [];

    // Features chart

    public featureChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    };
    public featureChartLabels: any = [];
    public featureChartType: any = 'bar';
    public featureChartLegend: any = false;
    public featureChartColors: Array<any> = [{
        backgroundColor: ['#ffad5f', '#28c76f', '#877df2', '#00cfe8', '#ea5455', '#66d1d1', '#ff66ff', '#609', '#fc0', '#f66', '#099', '#0c0', '#c90', '#6fc', '#00f', '#600']
    }];
    public featureChartData: any = [];

    // Client By Type chart
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };

    public pieChartLabels: any = ['Multi Tenant', 'Tenant'];
    public pieChartData: any = [];
    public pieChartType: any = 'pie';
    public pieChartColors: Array<any> = [{
        backgroundColor: ['#4b6ba2', '#ffad5f', 'rgba(148,159,177,0.2)']
    }];

    //Features Report chart
    public recruitingChartGetData: any = [];
    public recruitingOpeningData: any = [];
    public recruitingCandidateData: any = [];
    public recruitingApplicationData: any = [];
    public recruitingHiredApplicationData: any = [];
    public recruitingRejectedApplicationData: any = [];
    public recruitingChartData: any = [
        {data: [], label: 'Job Openings'},
        {data: [], label: 'Candidates'},
        {data: [], label: 'Job Applications'},
        {data: [], label: 'Hired_Applications'},
        {data: [], label: 'Rejected Applications'},
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
                    beginAtZero: true
                }
            }]
        }
    };
    public recruitingChartLegend = false;
    public recruitingChartType: any = 'line';
    public recruitingChartPlugins = [];
    // active client report line chart
    public lineChartData: any = [
        {data: [9, 8, 6, 10, 5, 2, 3, 0], label: ''},
    ];
    /*public lineChartColors: Array < any > = [{
      backgroundColor: ['#17B6CB', '#D77FB3', '#4292F2']
    }];*/

    public lineChartColors: any = [
        { // grey
            backgroundColor: 'rgba(255, 99, 71, 0)',
            borderColor: '#17B6CB',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }];

    public lineChartLabels: any = ['Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15', 'Jan 16'];

    public lineChartOptions = {
        responsive: true,
    };

    public lineChartLegend = true;
    public lineChartType: any = 'line';
    public lineChartPlugins = [];

    // company chart

    // people by gender chart

    public genderPieChartOptions: ChartOptions = {
        responsive: true,
    };

    public genderPieChartLabels: any = ['Male', 'Female', 'Other', 'Not Specified'];
    public genderPieChartData: any = [];
    public genderPieChartType: any = 'pie';
    public genderPieChartColors: Array<any> = [{
        backgroundColor: ['#4b6ba2', '#ffad5f', '#28C76F', '#877df2']
    }];

    // People by chart
    public peopleByRoleChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    };
    public peopleByRoleChartLabels: any = [];
    public peopleByRoleChartType: any = 'bar';
    public peopleByRoleChartLegend: any = false;
    public peopleByRoleChartColors: Array<any> = [{
        backgroundColor: ['#ffad5f', '#28c76f', '#877df2', '#00cfe8', '#ea5455', '#66d1d1', '#4b6ba2']
    }];
    public peopleByRoleChartData: any = [];

    constructor(
        public dialog: MatDialog,
        public helper: NSHelperService,
        private APIservice: NSApiService
    ) {
    }

    ngOnInit() {
        this.superAdminData();
        this.sideMenuName();
        // console.log(this.onStartChange(event));

    }

    sideMenuName() {
        this.sidebarMenuName = 'Dashboard';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    getPaiChartData: any;
    getClientReportChartData: any;

    getFeatureChartData: any;
    companyData: any = [];
    getPeopleByRoleChartData: any = [];
    peopleData: any = [];
    masterModuleData: any = [];
    //client active reports
    fourteenDayActiveClientsCount: any
    fourteenDayActiveClientsPercentage: any
    oneDayActiveClientsCount: any
    oneDayActiveClientsPercentage: any
    sevenDayActiveClientsCount: any
    sevenDayActiveClientsPercentage: any
    twentyEightDayActiveClientsCount: any
    twentyEightDayActiveClientsPercentage: any
    getClientActiveReportChartData: any;
    getClientActiveReportsData: any;
    clientActiveReportChartData: any = [];
    clientActiveReportChartLabels: any = [];
    clientActiveReportChartType: any = 'line';
    clientActiveReportChartLegend: any = false;
    clientActiveReportChartColors: Array<any> = [{
        backgroundColor: ['#ffad5f', '#28c76f', '#877df2', '#00cfe8', '#ea5455', '#66d1d1', '#4b6ba2']
    }];

    superAdminData() {
        this.helper.toggleLoaderVisibility(true);
        this.APIservice.viewDashboard({type: 'weekly'}).subscribe((res: any) => {
            this.dashboardData = res;
            //client active reports

            this.fourteenDayActiveClientsCount = this.dashboardData?.data?.clientActivity?.fourteenDayActiveClientsCount
            this.fourteenDayActiveClientsPercentage = this.dashboardData?.data?.clientActivity?.fourteenDayActiveClientsPercentage
            this.oneDayActiveClientsCount = this.dashboardData?.data?.clientActivity?.oneDayActiveClientsCount
            this.oneDayActiveClientsPercentage = this.dashboardData?.data?.clientActivity?.oneDayActiveClientsPercentage
            this.sevenDayActiveClientsCount = this.dashboardData?.data?.clientActivity?.sevenDayActiveClientsCount;
            this.sevenDayActiveClientsPercentage = this.dashboardData?.data?.clientActivity?.sevenDayActiveClientsPercentage
            this.twentyEightDayActiveClientsCount = this.dashboardData?.data?.clientActivity?.twentyEightDayActiveClientsCount
            this.twentyEightDayActiveClientsPercentage = this.dashboardData?.data?.clientActivity?.twentyEightDayActiveClientsPercentage

            this.getClientActiveReportChartData = this.dashboardData?.data?.clientActivity?.clientActivityData
            for (let i = 0; i < this.getClientActiveReportChartData.length; i++) {
                this.clientActiveReportChartData.push(this.getClientActiveReportChartData[i].noOfClient)
                this.clientActiveReportChartLabels.push(this.getClientActiveReportChartData[i].date)
            }
            this.chart.chart.update();

            this.statesticData = this.dashboardData.data.statisticsData;
            this.getPaiChartData = this.dashboardData.data.clientByType;
            for (let i = 0; i < this.getPaiChartData.length; i++) {
                this.pieChartData.push(this.getPaiChartData[i].count);
            }
            //client active reports
            this.getClientReportChartData = this.dashboardData.data.ClientReport;

            for (let i = 0; i < this.getClientReportChartData.length; i++) {
                this.clientReportChartData.push(this.getClientReportChartData[i].count);
                this.clientReportChartLabels.push(this.getClientReportChartData[i]._id);
            }
            this.getFeatureChartData = this.dashboardData.data.featuresReport;
            for (let i = 0; i < this.getFeatureChartData.length; i++) {
                this.featureChartData.push(this.getFeatureChartData[i].count);
                this.featureChartLabels.push(this.getFeatureChartData[i].featureName);
            }
            this.companyData = this.dashboardData?.data?.companyDashboardData;
            for (let i = 0; i < this.companyData.length; i++) {
                this.genderPieChartData[i] = this.genderPieChartData;
                this.genderPieChartData[i] = this.companyData[i]?.peopleModule?.peopleByGender ? this.companyData[i].peopleModule.peopleByGender : [];
                this.getPeopleByRoleChartData[i] = this.getPeopleByRoleChartData;
                this.getPeopleByRoleChartData[i] = this.companyData[i]?.peopleModule?.peopleByRoleCount ? this.companyData[i].peopleModule.peopleByRoleCount : [];
                this.peopleData[i] = this.peopleData;
                this.peopleData[i] = this.companyData[i]?.peopleModule ? this.companyData[i].peopleModule : [];
                this.masterModuleData[i] = this.masterModuleData;
                this.masterModuleData[i] = this.companyData[i]?.masterModule ? this.companyData[i].masterModule : [];
                this.peopleByRoleChartData[i] = [];
                this.peopleByRoleChartLabels[i] = [];
                this.pinDashboardData[i] = this.companyData[i]?.dashboardCustomization ? this.companyData[i].dashboardCustomization : [];
                for (let n = 0; n < this.getPeopleByRoleChartData[i].length; n++) {
                    this.peopleByRoleChartData[i].push(this.getPeopleByRoleChartData[i][n].count);
                    this.peopleByRoleChartLabels[i].push(this.getPeopleByRoleChartData[i][n]._id)
                }
                //this.getRecruitingChartData = this.companyData;
                this.recruitingChartGetData[i] = this.companyData[i]?.RecruitingLineChart ? this.companyData[i].RecruitingLineChart : [];
                this.mainRecruitingChartData(i);
                this.checkPinStatus(i);
            }

            this.helper.toggleLoaderVisibility(false);
        });
    }

    getClientReportsData: any;

    clientReportCall(type) {
        this.helper.toggleLoaderVisibility(true);
        this.clientReportChartData = [];
        this.clientReportChartLabels = [];
        this.helper.toggleLoaderVisibility(true);
        this.APIservice.viewDashboard({type: type}).subscribe((res) => {
            this.helper.toggleLoaderVisibility(false);
            this.getClientReportsData = res
            this.getClientReportChartData = this.getClientReportsData.data.ClientReport
            for (let i = 0; i < this.getClientReportChartData.length; i++) {
                this.clientReportChartData.push(this.getClientReportChartData[i].count);
                this.clientReportChartLabels.push(this.getClientReportChartData[i]._id);
            }
            this.helper.toggleLoaderVisibility(false);
        });
    }


    clientActiveReportCall(type) {
        this.helper.toggleLoaderVisibility(true);
        this.clientActiveReportChartData = [];
        this.clientActiveReportChartLabels = [];
        this.helper.toggleLoaderVisibility(true);
        this.APIservice.viewDashboard({reportDays: type}).subscribe((res) => {
            this.helper.toggleLoaderVisibility(false);
            this.getClientActiveReportsData = res
            console.log(this.getClientActiveReportsData, 'data');

            this.getClientActiveReportChartData = this.getClientActiveReportsData.data.clientActivity.clientActivityData.reverse()
            for (let i = 0; i < this.getClientActiveReportChartData.length; i++) {
                this.clientActiveReportChartData.push(this.getClientActiveReportChartData[i].noOfClient)
                this.clientActiveReportChartLabels.push(this.getClientActiveReportChartData[i].date)
                //this.clientActiveReportChartData.push(this.getClientActiveReportChartData[i].date);
                // this.clientActiveReportChartLabels.push(this.getClientActiveReportChartData[i].noOfClient);
            }
            this.chart.chart.update();
            this.helper.toggleLoaderVisibility(false);
        });
    }

    onStartChange(startDate: any, endDate: any) {
        // console.log('event',event.value)
        if (startDate && endDate) {
            const start = new Date(startDate).toISOString();
            this.endDate = new Date(endDate).toISOString();
            this.clientActiveReportChartData = [];
            this.clientActiveReportChartLabels = [];
            this.APIservice.viewDashboard({startDate: start, endDate: this.endDate}).subscribe((res) => {
                this.dashboardData = res;
                console.log(res);
                this.getClientActiveReportChartData = this.dashboardData?.data?.clientActivity?.clientActivityData.reverse()
                for (let i = 0; i < this.getClientActiveReportChartData.length; i++) {
                    this.clientActiveReportChartData.push(this.getClientActiveReportChartData[i].noOfClient)
                    this.clientActiveReportChartLabels.push(this.getClientActiveReportChartData[i].date)
                }
                this.chart.chart.update();
            });
        } else {
            this.clientActiveReportCall('7');
        }

    }

    onTabChanged($event, index) {
        const eventLabel = $event.tab.textLabel
        if (eventLabel == 'This Year' || eventLabel == 'Anno') {
            this.tabSelectValue = 'yearly'
        } else if (eventLabel == 'This Month' || eventLabel == 'Mese') {
            this.tabSelectValue = 'monthly'
        } else {
            this.tabSelectValue = 'weekly'
        }
        this.loadRecrutingChartData(index);
    }

    async loadRecrutingChartData(index: any) {
        this.helper.toggleLoaderVisibility(true);
        this.APIservice.viewDashboard({type: this.tabSelectValue}).subscribe((res) => {
            this.helper.toggleLoaderVisibility(false);
            //this.dashboardData = res.data;
            this.getrecruitingChartGetData = res
            //this.getRecruitingChartData = this.getrecruitingChartGetData.data.companyDashboardData[0]
            this.recruitingChartGetData[index] = this.getrecruitingChartGetData.data.companyDashboardData[index].RecruitingLineChart;
            this.mainRecruitingChartData(index);
        });
    }

    mainRecruitingChartData(index: any): void {
        this.recruitingOpeningData[index] = [];
        this.recruitingCandidateData[index] = [];
        this.recruitingApplicationData[index] = [];
        this.recruitingChartLabels[index] = [];
        this.recruitingHiredApplicationData[index] = [];
        this.recruitingRejectedApplicationData[index] = [];
        this.recruitingChartData[index] = this.recruitingChartData;
        this.recruitingChartData[index].forEach(o => o.data = []);
        // recruiting dashboard main chart
        //this.recruitingChartGetData = this.getRecruitingChartData.RecruitingLineChart;
        /*this.recruitingChartGetData[index] = this.companyData[index].RecruitingLineChart;*/
        this.recruitingOpeningData[index] = this.recruitingChartGetData[index].lineChartDataForOpening;
        this.recruitingCandidateData[index] = this.recruitingChartGetData[index].lineChartDataForCandidate;
        this.recruitingApplicationData[index] = this.recruitingChartGetData[index].lineChartDataForApplication;
        this.recruitingHiredApplicationData[index] = this.recruitingChartGetData[index].lineChartDataHiredApplication;
        this.recruitingRejectedApplicationData[index] = this.recruitingChartGetData[index].lineChartDataRejectApplication;

        for (let i = 0; i < this.recruitingOpeningData[index]?.length; i++) {
            this.recruitingChartData[index][0].data.push(this.recruitingOpeningData[index][i].count);
            this.recruitingChartData[index][0].label = "Job Openings";
            if (this.recruitingChartLabels[index].indexOf(this.recruitingOpeningData[index][i]._id) == -1) {
                this.recruitingChartLabels[index].push(this.recruitingOpeningData[index][i]._id);
            }
        }

        for (let i = 0; i < this.recruitingCandidateData[index]?.length; i++) {
            this.recruitingChartData[index][1].data.push(this.recruitingCandidateData[index][i].count);
            this.recruitingChartData[index][1].label = 'Candidates';
            if (this.recruitingChartLabels[index].indexOf(this.recruitingCandidateData[index][i]._id) == -1) {
                this.recruitingChartLabels[index].push(this.recruitingCandidateData[index][i]._id);
            }
        }

        for (let i = 0; i < this.recruitingApplicationData[index]?.length; i++) {
            this.recruitingChartData[index][2].data.push(this.recruitingApplicationData[index][i].count);
            this.recruitingChartData[index][2].label = 'Job Applications';
            if (this.recruitingChartLabels[index].indexOf(this.recruitingApplicationData[index][i]._id) == -1) {
                this.recruitingChartLabels[index].push(this.recruitingApplicationData[index][i]._id);
            }
        }

        for (let i = 0; i < this.recruitingHiredApplicationData[index]?.length; i++) {
            this.recruitingChartData[index][3].data.push(this.recruitingHiredApplicationData[index][i].count);
            this.recruitingChartData[index][3].label = 'Hired Applications';
            if (this.recruitingChartLabels[index].indexOf(this.recruitingHiredApplicationData[index][i]._id) == -1) {
                this.recruitingChartLabels[index].push(this.recruitingHiredApplicationData[index][i]._id);
            }
        }

        for (let i = 0; i < this.recruitingRejectedApplicationData[index]?.length; i++) {
            this.recruitingChartData[index][4].data.push(this.recruitingRejectedApplicationData[index][i].count);
            this.recruitingChartData[index][4].label = 'Rejected Applications';
            if (this.recruitingChartLabels[index].indexOf(this.recruitingRejectedApplicationData[index][i]._id) == -1) {
                this.recruitingChartLabels[index].push(this.recruitingRejectedApplicationData[index][i]._id);
            }
        }
        this.chart.chart.update();
    }

    changePinDialog(txt: string, currentPin: boolean, cmpID: any, index: any) {
        const dialogRef = this.dialog.open(PinUnpinComponent, {
            data: {
                heading: currentPin,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                currentPin = !currentPin;
                this.APIservice.pinChartDashboard({
                    companyId: cmpID,
                    moduleName: txt,
                    pin: currentPin
                }).subscribe(res => {
                    console.log('resPINPINPIN>>>>>', res)
                    this.pinDashboardData[index] = res.data.dashboardCustomization;
                    this.checkPinStatus(index);
                    swal.fire(
                        'success',
                        'Pin status has been changed successfully',
                        'success'
                    )
                });
            }
        });
    }

    checkPinStatus(index: any): void {


        for (let i = 0; i < this.pinDashboardData[index].length; i++) {
            if (this.pinDashboardData[index][i].moduleName == "peopleManagement") {
                this.peopleManagementPin = this.pinDashboardData[index][i].pin
            }
            if (this.pinDashboardData[index][i].moduleName == "masterModules") {
                this.masterModulesPin = this.pinDashboardData[index][i].pin
            }
            if (this.pinDashboardData[index][i].moduleName == "alerts") {
                this.alertsPin = this.pinDashboardData[index][i].pin
            }
            if (this.pinDashboardData[index][i].moduleName == "recruiting") {
                this.recruitingPin = this.pinDashboardData[index][i].pin
            }
            if (this.pinDashboardData[index][i].moduleName == "touchPoint") {
                this.touchPointPin = this.pinDashboardData[index][i].pin
            }
        }
    }
}
