import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {debounceTime, filter, skipWhile, take, takeUntil} from 'rxjs/operators';
import {EntityCollectionServiceBase, QueryParams} from '@ngrx/data';
import {combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FiltersDialogMqsComponent} from '../filtering/filters-dialog/filters-dialog.component';
import {selectEntityStore} from '../../../../features/recruiting/store/selectors';

export class ColumnTemplate {
  public columnName: string;
  public columnCaption: string;
  public columnDataField: string;
  public columnFormatter: string;
  public context: any;
  public filterValue?: any;
  public filterWidget?: any;
}

export class Action {
  public tooltip: string;
  public icon: string;
  public image: string;
  public color: string;
  public action: string;
  public context: any;
}

@Component({
  selector: 'app-table-data-view-mqs',
  templateUrl: './table-data-view.component.html',
  styleUrls: ['./table-data-view.component.scss']
})
export class TableDataViewMqsComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  queryParams: QueryParams = {};
  queryParams$: ReplaySubject<QueryParams> = new ReplaySubject<QueryParams>();

  service: EntityCollectionServiceBase<any>;
  entities$: Observable<any[]>;
  loading$: Observable<boolean>;

  serviceReady$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  paginatorReady$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  @Input() set tableDataService(service: EntityCollectionServiceBase<any>) {
    if (service) {
      this.service = service;
      this.entities$ = this.service.entities$;
      this.loading$ = this.service.loading$;
      this.queryParams$.next(this.queryParams);
      this.serviceReady$.next(true);
    }
  }

  // tslint:disable-next-line:variable-name
  public _columnTemplates: ColumnTemplate[] = [];
  @Input() set columnTemplates(cl: ColumnTemplate[]) {
    this._columnTemplates = cl;
    this.displayedColumns = this._columnTemplates.map(ct => ct.columnName);
  }

  @Input() set externalFilter(filters: any) {
    this.queryParams = {
      ...this.queryParams,
      ...filters
    };
    this.queryParams$.next(this.queryParams)
  }

  @Input() rowActions: Action[] = [];
  @Input() mainActions: Action[] = [];
  @Input() filterFunction: (filterValue: string, data: any) => boolean = null;
  @Input() headerColor: string;
  @Output() onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();

  public get filters(): any {
    return this._columnTemplates.filter(col => col.filterWidget);
  }

  public get activeFilters(): any {
    return this.filters.filter(col => col.filterValue);
  }

  displayedColumns: string[] = [];
  currentFilter = '';


  constructor(public store: Store,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    combineLatest([this.serviceReady$, this.paginatorReady$])
      .subscribe(([service, paginator]) => {
        this.store
          .select(selectEntityStore(this.service.entityName))
          .pipe(
            takeUntil(this.destroyed$),
            skipWhile(val => !val)
          )
          .subscribe(entity => {
            this.paginator.length = entity.count;
          });
      });

    this.queryParams$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroyed$))
      .subscribe(qp => {
        this.loadData();
      });
  }

  ngAfterViewInit(): void {
    this.paginatorReady$.next(true)
    this.paginator.page.subscribe((args) => {
      this.queryParams = {
        ...this.queryParams,
        limit: args.pageSize.toString(),
        offset: (args.pageIndex * args.pageSize).toString()
      };
      this.service.clearCache();
      this.queryParams$.next(this.queryParams)
    });
  }

  private loadData(): void {
    /*this.service.clearCache();
    let params = this.queryParams;
    let ngFilters = this.activeFilters;
    if (ngFilters.length) {
      ngFilters = Object.assign({}, ...ngFilters.map(item => ({[item.columnDataField]: item.filterValue})));
      // unescape + encodeURIComponent necessary for encoding accents
      ngFilters = btoa(unescape(encodeURIComponent(JSON.stringify(ngFilters))));
      params = {
        ...params,
        ngFilters
      };
    };
    this.service.getWithQuery(params);*/
  }

  applyFilter(filterValue: string): void {
    this.onFilterUpdate.emit(filterValue)
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.columnTemplates.map(ct => ct.columnName);
  }

  onMainAction(mainAction: Action): void {
    mainAction.context[mainAction.action]();
  }

  onRowAction(element: any, rowAction: Action): void {
    rowAction.context[rowAction.action](element);
  }

  getNestedField(element: any, fieldList: string[]): any {
    if (element) {
      const fName = fieldList.pop();
      if (fieldList.length > 0) {
        return this.getNestedField(element[fName], fieldList);
      } else {
        return element[fName];
      }
    } else {
      return '';
    }

  }

  getElementValue(element: any, columnTemplate: ColumnTemplate): any {
    const nestedSplit = columnTemplate.columnDataField.split('.');
    const fieldValue = this.getNestedField(element, nestedSplit.reverse());

    if (!columnTemplate.columnFormatter) {
      return fieldValue;
    } else {
      return columnTemplate.context[columnTemplate.columnFormatter](fieldValue);
    }
  }

  ngOnDestroy(): void {
    this.service.clearCache();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  openFiltersDialog(): void {
    const config = new MatDialogConfig();
    config.width = "30%";
    config.data = {
      filters: this.filters
    };
    const dialogRef = this.dialog.open(FiltersDialogMqsComponent, config);
    dialogRef.afterClosed()
      .pipe(skipWhile(res => !res), takeUntil(this.destroyed$))
      .subscribe(filters => {
        this._columnTemplates = this._columnTemplates.map(col => {
          if (Object.keys(filters).indexOf(col.columnDataField) > -1) {
            return {
              ...col,
              filterValue: filters[col.columnDataField]
            };
          } else {
            return col;
          }
        });
        this.queryParams = {
          ...this.queryParams,
          offset: '0'
        };
        this.paginator.pageIndex = 0;
        this.queryParams$.next(this.queryParams);
      });
  }

  onChipRemove(col: ColumnTemplate): any {
    col.filterValue = null;
    this.loadData();
  }
}
