import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ProcurementService } from 'projects/fe-common-v2/src/lib/services/procurement.service';
import { MCPHelperService } from '../../../service/MCPHelper.service';

@Component({
  selector: 'app-procurement-dashboard',
  templateUrl: './procurement-dashboard.component.html',
  styleUrls: ['./procurement-dashboard.component.scss']
})
export class ProcurementDashboardComponent implements OnInit {
sidebarMenuName:string;
// bar chart
public barChartOptions4 = {
  scaleShowVerticalLines: false,
  responsive: true,
  gridLines: {
    display:false
  },
  display: false,
  scales : {
    yAxes: [{
      ticks: {
        min: 0, // it is for ignoring negative step.
        beginAtZero: true,
        callback: function(value, index, values) {
            if (Math.floor(value) === value) {
                return value;
            }
        }
    }
    }]
  }
};

// public barChartLabels4: any = [ 'Invited Suppliers','Supplier Applications','Suppliers In Progresss','Suppliers To Validate','Active Suppliers','Refused Suppliers','Suppliers Declined'];
public barChartLabels4: any = [ 'Fornitori invitati','Applicazioni del fornitore','Fornitori in progress','Fornitori da validare','Attiva Fornitore','Refiuta Fornitore','Fornitore Declinato'];
public barChartType4: any = 'bar';
public barChartLegend4: any = false;
public barChartColors4: Array < any > = [{
  backgroundColor: ['#4B6BA2', '#4B6BA2','#4B6BA2','#4B6BA2','#4B6BA2','#4B6BA2','#4B6BA2']
}];
barChartData4: any = [
  { data: [], label: [''] },
];

statisticsData = [];

// pai chart
public pieChartOptions: ChartOptions = {
  responsive: true,
};

public pieChartLabels: any = [ 'RFQ Created', 'Suppliers', 'RFQ Received'];
public pieChartData: any =   [77 , 10 , 13];
public pieChartType: any = 'pie';
public pieChartColors: Array < any > = [{
  backgroundColor: ['#4b6ba2', '#28C76F', '#ffad5f']
}];

constructor(private apiService: ProcurementService,
    private helper:MCPHelperService) { }



ngOnInit(): void {
  this.sideMenuName();
  this.apiService.getDashboardData({}).then((data) => {
    this.statisticsData = data.data;
    this.barChartData4[0].data = data.data.supplierByStatus;
  });

}
sideMenuName(){
  this.sidebarMenuName = 'Dashboard';
  this.helper.sideMenuListName.next(this.sidebarMenuName);
}

reloadCurrentPage() {
  window.location.reload();
 }


}
