import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ChartOptions} from 'chart.js';
import {FormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'fe-graphs';

  toppings = new FormControl();
  toppingList: string[] = ['Milano_B20', 'Milano_ST5'];

  public lineChartData: any = [
    { data: [61, 59, 80, 65, 45, 55, 40, 56, 76, 65, 77, 60], label: 'Office Working' },
    { data: [57, 50, 75, 87, 43, 46, 37, 48, 67, 56, 70, 50], label: 'Smart Working' },
    { data: [51, 59, 55, 40, 30, 56, 47, 38, 47, 66, 50, 80], label: 'No Working' },
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
    },
    { // red
      backgroundColor: 'rgba(255, 99, 71, 0)',
      borderColor: '#D77FB3',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgba(255, 99, 71, 0)',
      borderColor: '#4292F2',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];

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

  public pieChartLabels: any = ['Milano_B20', 'Milano_ST5'];
  public pieChartData: any = [120, 150];
  public pieChartType: any = 'pie';
  public pieChartColors: Array < any > = [{
    backgroundColor: ['#4D6CA1', '#F3F3F3', 'rgba(148,159,177,0.2)']
  }];

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: any = ['Milano_ST5', 'Milano_B20'];
  public barChartType: any = 'horizontalBar';
  public barChartLegend: any = true;
  public barChartColors: Array < any > = [{
    backgroundColor: ['#17B6CB', '#17B6CB']
  }];
  public barChartData: any = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'OfficeWorking'}
  ];

  public radarChartLabels: any = ['Q1', 'Q2', 'Q3', 'Q4'];
  public radarChartData: any = [
    {data: [120, 130, 180, 70], label: '2017'},
    {data: [90, 150, 200, 45], label: '2018'}
  ];
  public radarChartType: any = 'radar';

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'symbol2'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: any = [
  {position: 1, name: 'ALLI', weight: 0, symbol: 0},
  {position: 2, name: 'AMMIRATI', weight: 0, symbol: 0},
  {position: 3, name: 'AVANZO', weight: 0, symbol: 0},
  {position: 4, name: 'BONCINELLI', weight: 0, symbol: 0},
  {position: 5, name: 'BONOMO', weight: 0, symbol: 0},
  {position: 6, name: 'BRAMBILLA', weight: 0, symbol: 0},
  {position: 7, name: 'BRASCHI', weight: 0, symbol: 0},
  {position: 8, name: 'CAJANI', weight: 0, symbol: 0},
  {position: 9, name: 'CAPPELLETTI', weight: 0, symbol: 0},
  {position: 10, name: 'CARDIA', weight: 0, symbol: 0},
  {position: 11, name: 'Sodium', weight: 0, symbol: 0},
  {position: 12, name: 'Magnesium', weight: 0, symbol: 0},
  {position: 13, name: 'Aluminum', weight: 0, symbol: 0},
  {position: 14, name: 'Silicon', weight: 0, symbol: 0},
  {position: 15, name: 'Phosphorus', weight: 0, symbol: 0},
  {position: 16, name: 'Sulfur', weight: 0, symbol: 0},
  {position: 17, name: 'Chlorine', weight: 0, symbol: 0},
  {position: 18, name: 'Argon', weight: 0, symbol: 0},
  {position: 19, name: 'Potassium', weight: 0, symbol: 0},
  {position: 20, name: 'Calcium', weight: 0, symbol: 0},
];
