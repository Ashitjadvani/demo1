import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ChartOptions} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import Swal from 'sweetalert2';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-event-dashboard',
    templateUrl: './event-dashboard.component.html',
    styleUrls: ['./event-dashboard.component.scss']
})
export class EventDashboardComponent implements OnInit {
    dashboardData: any = [];
    totalStatisticsData: any = [];
    userLanguage: any;
    eventStatisticsList: any = [];
    eventByType: boolean = false;
    scopeId: any;
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;

    constructor(
        private translate: TranslateService,
        private apiService: EventManagementListOfEventService,
        public helper: MCPHelperService,
        public route: ActivatedRoute,
        private router: Router) {
        this.helper.chartUpdateDataEmitter.subscribe((name: string) => {
            this.updateChartDataFunc();
        });
    }

    // Event by Types chart
    public eventByTypeOptions: ChartOptions = {
        responsive: true,
    };
    public eventByTypeLabels: any = [this.translate.instant('Live'), this.translate.instant('Online'), this.translate.instant('Hybrid'),];
    public eventByTypeData: any = [];
    public eventByTypeType: any = 'pie';
    public eventByTypeColors: Array<any> = [{
        backgroundColor: ['#4b6ba2', '#ffad5f', '#28C76F']
    }];

    // Event by Scopes
    public eventByScopesChartData: any = [];
    public eventByScopesOptions = {
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
    public eventByScopesLabels: any = [];
    public eventByScopesType: any = 'bar';
    public eventByScopesLegend: any = false;
    public eventByScopesColors: Array<any> = [{
        backgroundColor: ['#FFAD5F', '#28C76F', '#877DF2', '#00CFE8', '#EA5455', '#66D1D1', '#FF66FF', '#660099', '#FFCC00', '#FF6666', '#009999', '#00CC00', '#CC9900', '#66FFCC', '#0000FF', '#660000']
    }];
    public eventByScopesData: any = [];

    ngOnInit(): void {
        this.sideMenuName();
        this.scopeId = this.route.snapshot.paramMap.get('scopeId');
        this.getDashboardData();
    }
    sidebarMenuName:any;
    sideMenuName(){
        this.sidebarMenuName = 'Dashboard'; 
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }
0.
    async getDashboardData() {
        this.helper.toggleLoaderVisibility(true);
        await this.apiService.getEventsDashboard({scope: this.scopeId}).then((res: any) => {
            if (res.result || res.statusCode == 200) {
                this.dashboardData = res.data;
                this.totalStatisticsData = this.dashboardData.Statistics;
                this.eventByTypeData = this.dashboardData.EventByTypes;
                this.eventByScopesChartData = this.dashboardData.EventByScope;
                this.eventStatisticsList = this.dashboardData.EventStatistics;
                this.eventByScopesData = [];
                this.eventByScopesLabels = [];
                if ((this.eventByTypeData[0] !== 0) || (this.eventByTypeData[1] !== 0) || (this.eventByTypeData[2] !== 0)) {
                    this.eventByType = true;
                } else {
                    this.eventByType = false;
                }
                for (let i = 0; i < this.eventByScopesChartData.length; i++) {
                    this.eventByScopesData.push(this.eventByScopesChartData[i].count);
                    this.eventByScopesLabels.push(this.eventByScopesChartData[i].scope);
                }
                this.helper.toggleLoaderVisibility(false);
            } else {
                Swal.fire('',
                    res.reason,
                    'info')
                this.helper.toggleLoaderVisibility(false);
            }
        }, (err) => {
            Swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            )
            this.helper.toggleLoaderVisibility(false);
        });

    }

    redirectPage(): void {
        if (this.scopeId !== null){
            this.router.navigate['/training/event-list/' + this.scopeId]
        }else {
            this.router.navigate['/event-management/event-list']
        }
    }

    updateChartDataFunc(): void {
        const languageData = localStorage.getItem('currentLanguage');
        this.userLanguage = languageData;
        this.getDashboardData();
        this.eventByTypeLabels = [this.translate.instant('Live'), this.translate.instant('Online'), this.translate.instant('Hybrid'),];
        this.chart.chart?.update();
    };

}
