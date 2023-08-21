import { Component, OnInit } from '@angular/core';
import {MetricService} from '../../../store/data.service';
import {Observable} from 'rxjs';
import {CRUDMode, Metric, Question} from '../../../store/models';
import {QueryParams} from '@ngrx/data';
import {MatDialog} from '@angular/material/dialog';
import {MetricDialogComponent} from './metric-dialog/metric-dialog.component';

@Component({
  selector: 'app-tkl-metrics',
  templateUrl: './tkl-metrics.component.html',
  styleUrls: ['./tkl-metrics.component.scss']
})
export class TklMetricsComponent implements OnInit {
  public elements$: Observable<Metric[]>;
  public elementFilter = '';
  public displayedColumns: string[] = [ 'code', 'description', 'type', 'aggregation_strategy', 'actions'];
  loading$: Observable<boolean>;


  constructor(
      private service: MetricService,
      public dialog: MatDialog) { }

  ngOnInit(): void {
    this.elements$ = this.service.entities$;
    this.loading$ = this.service.loading$;
    this.getFilteredElements()
  }

  getFilteredElements($event?) {
    const params: QueryParams = {
      filter: this.elementFilter
    };
    this.service.clearCache();
    this.service.getWithQuery(params);
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
        service: this.service,
      },
      ...config_ovveride
    });
    return dialogRef;
  }

}
