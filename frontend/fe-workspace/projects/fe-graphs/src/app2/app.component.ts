import { Component } from '@angular/core';
import {ChartOptions} from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe-graphs';

  public lineChartData: any = [
    { data: [61, 59, 80, 65, 45, 55, 40, 56, 76, 65, 77, 60], label: 'Apple' },
    { data: [57, 50, 75, 87, 43, 46, 37, 48, 67, 56, 70, 50], label: 'Mi' },
  ];

  public lineChartLabels: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType: any = 'line';
  public lineChartPlugins = [];

  public doughnutChartLabels: any = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public doughnutChartData: any = [120, 150, 180, 90];
  public doughnutChartType: any = 'doughnut';

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: any = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public pieChartData: any = [120, 150, 180, 90];
  public pieChartType: any = 'pie';

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: any = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: any = 'bar';
  public barChartLegend: any = true;
  public barChartData: any = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  public radarChartLabels: any = ['Q1', 'Q2', 'Q3', 'Q4'];
  public radarChartData: any = [
    {data: [120, 130, 180, 70], label: '2017'},
    {data: [90, 150, 200, 45], label: '2018'}
  ];
  public radarChartType: any = 'radar';
}
