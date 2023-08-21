import {Component, OnInit, ViewChild} from '@angular/core';
import {MetricService} from '../../../store/data.service';
import {Observable} from 'rxjs';
import {CRUDMode, Metric, Question} from '../../../store/models';
import {QueryParams} from '@ngrx/data';
import {MatDialog} from '@angular/material/dialog';
import {MetricDialogComponent} from './metric-dialog/metric-dialog.component';
import {TklabMqsService} from "../../../../../../../../fe-common/src/lib/services/tklab.mqs.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-tkl-metrics',
  templateUrl: './tkl-metrics.component.html',
  styleUrls: ['./tkl-metrics.component.scss']
})
export class TklMetricsComponent implements OnInit {
  public elements$: Observable<Metric[]>;
  public elementFilter = '';
  public displayedColumns: string[] = [ 'name', 'description', 'type', 'aggregation_strategy', 'actions'];
  loading$: Observable<boolean>;
  getMetric: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
     // private service: MetricService,
      private tklabMqsService: TklabMqsService,
      public dialog: MatDialog) { }

  ngOnInit(): void {
    //this.elements$ = this.service.entities$;
    //this.loading$ = this.service.loading$;
    this.getFilteredElements();
  }

  async getFilteredElements($event?) {
    const params: QueryParams = {
      filter: this.elementFilter
    };
    let res: any = await this.tklabMqsService.loadAppMetric();
    this.getMetric = new MatTableDataSource<any>(res.result);
    this.getMetric.sort = this.sort;
    this.getMetric.paginator = this.paginator;

  //  this.service.clearCache();
  //  this.service.getWithQuery(params);*/
  }

  applyFilter(): void {
    this.getMetric.filter = this.elementFilter.trim().toLowerCase();
  }

  addElement(): void {
    const element = new Question();
    this.setCurrentElement(element, CRUDMode.ADD);
  }

  editElement(element): void {
    this.setCurrentElement(element, CRUDMode.EDIT);
  }

  viewElement(element): void {
    this.setCurrentElement(element, CRUDMode.VIEW);
  }

  deleteElement(element): void {
    this.setCurrentElement(element, CRUDMode.DELETE, {height: '20%'});
  }


  setCurrentElement(element, mode: string, config_ovveride?) {
    const dialogRef = this.dialog.open(MetricDialogComponent, {
      width: '80%',
      height: '70%',
      data: {
        currentElement: element,
        mode,
        service: null,
      },
      ...config_ovveride
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result) {
          this.getFilteredElements();
        }
      });

    return dialogRef;
  }

}
