import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import { RecruitingDashboardManagementService } from '../../../../../../fe-common-v2/src/lib/services/recruiting-dashboard-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BaseChartDirective } from "ng2-charts";
import { RecruitingApplicationManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-application-management.service';

@Component({
    selector: 'app-recruiting-dashboard',
    templateUrl: './recruiting-dashboard.component.html',
    styleUrls: ['./recruiting-dashboard.component.scss']
})
export class RecruitingDashboardComponent implements OnInit {
    sidebarMenuName: string;
    genderChartValue: boolean = false;
    // Job Opening & Application By Site
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    userLanguage: any;
    public getBySiteAppChartData: any = [];
    public getBySiteOpeChartData: any = [];
    public bySiteChartOptions = {
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
    public bySiteChartLabels: any = [];
    public bySiteChartType: any = 'bar';
    public bySiteChartLegend: any = false;
    public bySiteChartColors: Array<any> = [{
        backgroundColor: '#4B6BA2'
    }];
    public bySiteChartData: any = [
        { data: [], label: this.translate.instant('Job Openings'), },
        { data: [], label: this.translate.instant('Job Applications'), backgroundColor: '#FFAD5F' }
    ];

    // Job Opening & Application By Area
    public getOpeningAreaChartData: any = [];
    public getApplicationAreaChartData: any = [];
    public areaChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        borderRadius: 6,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    };
    public areaChartLabels: any = [];
    public areaChartType: any = 'bar';
    public areaChartLegend: any = false;
    public areaChartColors: Array<any> = [{
        backgroundColor: '#4B6BA2'
    }];
    public areaChartData: any = [
        { data: [], label: this.translate.instant('Job Openings'), },
        { data: [], label: this.translate.instant('Job Applications'), backgroundColor: '#FFAD5F' }
    ];

    // Job Application By Status
    public getStatusChartData: any = [];
    public jobAppStatusOptions = {
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        plugins: {
            datalabels: {
                display: true,
                align: 'center',
                anchor: 'center'
            }
        },
        responsive: true,
    };
    public jobAppStatusLabels: any = []
    public jobAppStatusType: any = 'horizontalBar';
    public jobAppStatusLegend: any = false;
    public jobAppStatusColors: Array<any> = [{
        backgroundColor: [
          '#877df2',
          '#262f79',
          '#fdb167',
          '#30c76f',
          '#ea5455',
          '#66d1d1',
          '#26cfe8',
          '#f967ff']
    }];
    public jobAppStatusData: any = [
        {
            data: []
        }
    ];

    // Job Application By Gender
    public getGenderChartData: any = [];
    public genderChartOptions: ChartOptions = {
        responsive: true,
    };
    public genderChartLabels: any = [this.translate.instant('Male'), this.translate.instant('Female'), this.translate.instant('Other'), this.translate.instant('Not Specified')];
    public genderChartData: any = [];
    public genderChartLegend: any = false;
    public genderChartType: any = 'pie';
    public genderChartColors: Array<any> = [{
        backgroundColor: ['#4b6ba2', '#ffad5f', '#28C76F', '#877df2']
    }];

    // Job Application By Age
    public getAgeChartData: any = [];
    public ageChartOptions = {
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
    public ageChartLabels: any = [];
    public ageChartType: any = 'bar';
    public ageChartLegend: any = false;
    public ageChartColors: Array<any> = [{
        backgroundColor: ['#4B6BA2', '#FFAD5F', '#28C76F', '#00CFE8']
    }];
    public ageChartData: any = [
        { data: [], label: '' }
    ];

    // Job Application By Degree Mark
    public getDegreeMarkChartData: any = [];
    public degreeMarkChartOptions = {
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
    public degreeMarkChartLabels: any = [];
    public degreeMarkChartType: any = 'bar';
    public degreeMarkChartLegend: any = false;
    public degreeMarkChartColors: Array<any> = [{
        backgroundColor: ['#FFAD5F', '#28C76F', '#877DF2', '#00CFE8', '#EA5455', '#66D1D1', '#FF66FF', '#660099', '#FFCC00', '#FF6666', '#009999', '#00CC00', '#CC9900', '#66FFCC', '#0000FF', '#660000']
    }];
    public degreeMarkChartData: any = [
        { data: [], label: '' }
    ];

    // Job Opening By Scope
    public getScopeChartData: any = [];
    public scopeChartLegend: any = false;
    public scopeChartOptions: ChartOptions = {
        responsive: true,
    };
    public scopeChartLabels: any = [];
    public scopeChartData: any = [];
    public scopeChartType: any = 'pie';
    public scopeChartColors: Array<any> = [{
        backgroundColor: ['#4b6ba2', '#ffad5f', '#28C76F', '#877DF2', '#00CFE8', '#EA5455', '#66D1D1', '#FF66FF', '#e0987b', '#fff13a', '#6bc12e', '#96b6f2', '#9772d3', '#fdadff', '#c9fc99']
    }];

    // Recruiting Chart
    public recruitingChartGetData: any = [];
    public recruitingOpeningData: any = [];
    public recruitingCandidateData: any = [];
    public recruitingApplicationData: any = [];
    public recruitingHiredApplicationData: any = [];
    public recruitingRejectedApplicationData: any = [];
    public recruitingChartData: any = [
        { data: [], label: this.translate.instant('Job Openings') },
        { data: [], label: this.translate.instant('Candidates') },
        { data: [], label: this.translate.instant('Job Applications') },
        { data: [], label: this.translate.instant('Hired Applications') },
        { data: [], label: this.translate.instant('Rejected Applications') }
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
                    beginAtZero: true
                }
            }]
        }
    };
    public recruitingChartLegend = false;
    public recruitingChartType: any = 'line';
    public recruitingChartPlugins = [];

    dashboardStatisticsData: any = new MatTableDataSource([]);
    dashboardData: any = new MatTableDataSource([]);
    pieChartData1: any = new MatTableDataSource([]);
    tabSelectValue: any = "weekly";

    areas: any[] = [];
    chartFilterByArea: any = {};
    showChartFilter: boolean = false;

    constructor(
        private helper: MCPHelperService,
        private ApiService: RecruitingDashboardManagementService,
        private recruitingManagementApplicationService: RecruitingApplicationManagementService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
    ) {
        const languageData = localStorage.getItem('currentLanguage');
        this.userLanguage = languageData
        this.helper.chartUpdateDataEmitter.subscribe((name: string) => {
            this.updateChartDataFunc();
            this.getStatusChartDataFunc();
        });
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.getDashboardData({});

        this.recruitingManagementApplicationService.getCandidateAreas().then((data: any) => {
            this.areas = data.data;
        });
    }

    sideMenuName() {
        this.sidebarMenuName = 'Dashboard';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    updateChartDataFunc(): void {
        const languageData = localStorage.getItem('currentLanguage');
        this.userLanguage = languageData
        this.getDashboardMainData({});
        for (let i = 0; i < this.getStatusChartData.length; i++) {
          this.jobAppStatusData[0].data.push(this.getStatusChartData[i].count);
        };
        setTimeout(() => {
            this.bySiteChartData[0].label = this.translate.instant('Job Openings');
            this.bySiteChartData[1].label = this.translate.instant('Job Applications');
            this.areaChartData[0].label = this.translate.instant('Job Openings');
            this.areaChartData[1].label = this.translate.instant('Job Applications');
            this.genderChartLabels = [this.translate.instant('Male'), this.translate.instant('Female'), this.translate.instant('Other'), this.translate.instant('Not Specified')];
        }, 300);
        this.chart.chart.update();
    };

    onTabChanged($event) {
        const eventLabel = $event.tab.textLabel
        if (eventLabel == 'This Year' || eventLabel == 'Anno') {
            this.tabSelectValue = 'yearly'
        } else if (eventLabel == 'This Month' || eventLabel == 'Mese') {
            this.tabSelectValue = 'monthly'
        } else {
            this.tabSelectValue = 'weekly'
        }
        this.getDashboardMainData({});
    }
    async getDashboardMainData(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getDashboard({ type: this.tabSelectValue, chartFilter: this.chartFilterByArea });
        this.helper.toggleLoaderVisibility(false);
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
        this.mainChartData();
    }

    async mainChartData() {
        this.recruitingChartGetData = this.dashboardData.lineChartData;
        this.recruitingOpeningData = this.recruitingChartGetData.lineChartDataForOpening;
        this.recruitingCandidateData = this.recruitingChartGetData.lineChartDataForCandidate;
        this.recruitingApplicationData = this.recruitingChartGetData.lineChartDataForApplication;
        this.recruitingHiredApplicationData = this.recruitingChartGetData.lineChartDataHiredApplication;
        this.recruitingRejectedApplicationData = this.recruitingChartGetData.lineChartDataRejectApplication;
        for (let i = 0; i < this.recruitingOpeningData.length; i++) {
            this.recruitingChartData[0].data.push(this.recruitingOpeningData[i].count);
            this.recruitingChartData[0].label = this.translate.instant('Job Openings');
            if (this.recruitingOpeningData[0] !== 0) {
                //this.recruitingChartLabels.push(this.recruitingOpeningData[i]._id);
                if (this.userLanguage == 'it') {
                    this.recruitingChartLabels.push(this.recruitingOpeningData[i].ItDay);
                } else {
                    this.recruitingChartLabels.push(this.recruitingOpeningData[i]._id);
                }
            }
        }
        for (let i = 0; i < this.recruitingCandidateData.length; i++) {
            this.recruitingChartData[1].data.push(this.recruitingCandidateData[i].count);
            this.recruitingChartData[1].label = this.translate.instant('Candidates');
        }
        for (let i = 0; i < this.recruitingApplicationData.length; i++) {
            this.recruitingChartData[2].data.push(this.recruitingApplicationData[i].count);
            this.recruitingChartData[2].label = this.translate.instant('Job Applications');
        }
        for (let i = 0; i < this.recruitingHiredApplicationData.length; i++) {
            this.recruitingChartData[3].data.push(this.recruitingHiredApplicationData[i].count);
            this.recruitingChartData[3].label = this.translate.instant('Hired Applications');
        }
        for (let i = 0; i < this.recruitingRejectedApplicationData.length; i++) {
            this.recruitingChartData[4].data.push(this.recruitingRejectedApplicationData[i].count);
            this.recruitingChartData[4].label = this.translate.instant('Rejected Applications');
        }
    }

    async getDashboardData(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getDashboard({ type: 'weekly' });
        if (res) {
            this.helper.toggleLoaderVisibility(false);
        }
        this.dashboardData = res.data;
        this.showChartFilter = this.dashboardData.showChartAreaFilter;
        this.dashboardStatisticsData = res.data.statisticsData;
        this.pieChartData1 = res.data.userByScope;

        // recruiting dashboard main chart
        this.mainChartData();

        // Job Opening By Scope Chart
        this.getScopeChartData = this.dashboardData.jobOpeningByScope;
        for (let i = 0; i < this.getScopeChartData.length; i++) {
            this.scopeChartData.push(this.getScopeChartData[i].count);
            this.scopeChartLabels.push(this.getScopeChartData[i].scopeName);
        }

        // Job Application By Status Chart
        this.getStatusChartData = this.dashboardData.jobApplicationByStatus;
        for (let i = 0; i < this.getStatusChartData.length; i++) {
            this.jobAppStatusData[0].data.push(this.getStatusChartData[i].count);
            this.jobAppStatusLabels.push(this.translate.instant(this.getStatusChartData[i].status));
            if (this.getStatusChartData[i].status == "ASSUNTO") {
                this.jobAppStatusColors[0].backgroundColor[i] = '#30c76f';
            } else if (this.getStatusChartData[i].status == "DA_INTERVISTARE") {
                this.jobAppStatusColors[0].backgroundColor[i] = '#262f79';
            } else if (this.getStatusChartData[i].status == "INVIATA") {
                this.jobAppStatusColors[0].backgroundColor[i] = '#fdb167';
            } else if (this.getStatusChartData[i].status == "RIFIUTATO") {
                this.jobAppStatusColors[0].backgroundColor[i] = '#ea5455';
            } else if (this.getStatusChartData[i].status == "INTERVISTA_FISSATA") {
                this.jobAppStatusColors[0].backgroundColor[i] = '#877df2';
            } else if (this.getStatusChartData[i].status == "INTERVISTATO") {
                this.jobAppStatusColors[0].backgroundColor[i] = '#00CFE8';
            } else if (this.getStatusChartData[i].status == "INTERESSANTE") {
                this.jobAppStatusColors[0].backgroundColor[i] = '#ecec00';
            } else if (this.getStatusChartData[i].status == "DRAFT") {
              this.jobAppStatusColors[0].backgroundColor[i] = '#26cfe8';
            }else if (this.getStatusChartData[i].status == "NON DISPONIBILE") {
              this.jobAppStatusColors[0].backgroundColor[i] = '#000000';
            }
        }

        // Job Opening & Application By Site Chart
        this.getBySiteOpeChartData = this.dashboardData.jobOpeningBySite;
        this.bySiteChartData = [
            { data: [], label: this.translate.instant('Job Openings'), },
            { data: [], label: this.translate.instant('Job Applications'), backgroundColor: '#FFAD5F' }
        ];
        for (let i = 0; i < this.getBySiteOpeChartData.length; i++) {
            this.bySiteChartData[0].data.push(this.getBySiteOpeChartData[i].count);
            this.bySiteChartLabels.push(this.getBySiteOpeChartData[i].site);
        }
        this.getBySiteAppChartData = this.dashboardData.jobApplicationBySite;
        for (let i = 0; i < this.getBySiteAppChartData.length; i++) {
            this.bySiteChartData[1].data.push(this.getBySiteAppChartData[i].count);
        }

        // Job Application By Gender Chart
        this.getGenderChartData = this.dashboardData.jobApplicationByGender;
        for (let i = 0; i < this.getGenderChartData.length; i++) {
            if (this.getGenderChartData[i] != 0) {
                this.genderChartValue = true;
                break
            } else { this.genderChartValue = false; }
        };

        for (let i = 0; i < this.getGenderChartData.length; i++) {
            this.genderChartData.push(this.getGenderChartData[i]);
        };

        // Job Application By Age Chart
        this.getAgeChartData = this.dashboardData.jobApplicationByAge;

        for (let i = 0; i < this.getAgeChartData.length; i++) {
            if (this.getAgeChartData[i].ageGroup != 'AgeNotSelected') {
                this.ageChartData[0].data.push(this.getAgeChartData[i].count);
                this.ageChartLabels.push(this.getAgeChartData[i].ageGroup);
            }

        }

        // Job Application By Degree Mark Chart
        this.getDegreeMarkChartData = this.dashboardData.JobApplicationByDegreeMark;
        for (let i = 0; i < this.getDegreeMarkChartData.length; i++) {
            this.degreeMarkChartData[0].data.push(this.getDegreeMarkChartData[i].count);
            this.degreeMarkChartLabels.push(this.getDegreeMarkChartData[i].degreeGroup);
        }
        //this.degreeMarkChartData[0].data.push(this.getDegreeMarkChartData[0].count);
        //this.degreeMarkChartLabels.push(this.getDegreeMarkChartData[0].degreeGroup);

        // Job Opening & Application By Area Chart
        this.getOpeningAreaChartData = this.dashboardData.jobOpeningByArea;
        this.areaChartData = [
            { data: [], label: this.translate.instant('Job Openings'), },
            { data: [], label: this.translate.instant('Job Applications'), backgroundColor: '#FFAD5F' }
        ];
        for (let i = 0; i < this.getOpeningAreaChartData.length; i++) {
            this.areaChartData[0].data.push(this.getOpeningAreaChartData[i].count);
            this.areaChartLabels.push(this.getOpeningAreaChartData[i].areaName);
        }
        this.getApplicationAreaChartData = this.dashboardData.jobApplicationByArea;
        for (let i = 0; i < this.getApplicationAreaChartData.length; i++) {
            this.areaChartData[1].data.push(this.getApplicationAreaChartData[i].count);
        }
    }

    getStatusChartDataFunc(){
      // Job Application By Status Chart
      setTimeout(()=>{
        this.jobAppStatusLabels = [];
        for (let i = 0; i < this.getStatusChartData.length; i++) {
          this.jobAppStatusLabels.push(this.translate.instant(this.getStatusChartData[i].status));
        }
      },100);
    }

    onSelectChangeFilterArea(args) {
        this.chartFilterByArea.areaId = args.value;
        this.getDashboardMainData({});
    }
}
