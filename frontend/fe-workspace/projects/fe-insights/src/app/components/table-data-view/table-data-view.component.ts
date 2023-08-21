import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import * as moment from 'moment';

export class ColumnTemplate {
    public columnName: string;
    public columnCaption: string;
    public columnDataField: string;
    public columnFormatter: string;
    public columnRenderer: string;
    public columnTooltip: string;
    public context: any;
    public filterValue?: any;
    public grow?: any;
    public isCenter?: boolean;
    public isColumnShow?: boolean;
    public filterWidget?: any;
}

export class Action {
    public tooltip: string;
    public icon: string;
    public image: string;
    public color: string;
    public action: string;
    public context: any;
    public dots?: boolean;
}

@Component({
    selector: 'app-table-data-view',
    templateUrl: './table-data-view.component.html',
    styleUrls: ['./table-data-view.component.scss']
})
export class TableDataViewComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    @Input() set tableDataSet(data: any[]) {
        if (data) {
          this.fullDataSet = data;
          this.updateDataSource(data);
          if (this.currentFilter.length > 0) {
              this.applyFilter(this.currentFilter);
          }
        }
    }

    @Output() outFullDataSet: EventEmitter<any> = new EventEmitter();
    @Input() columnTemplates: ColumnTemplate[] = [];
    @Input() rowActions: Action[] = [];
    @Input() mainActions: Action[] = [];
    @Input() filteredValueShow: any;
    @Input() pageSize: number = 10;
    tableColumnTemplatesFilter: any = [];

    // @Input() filteredValue: any;
    @Input() set filteredValue(data: any) {
        if (data && this.filteredValueShow) {
            this.filterDataValue = data;
            if (this.filterDataValue) {
                const filterValue = (this.filterDataValue) ? Object.keys(this.filterDataValue) : [];
                filterValue.forEach((b) => {
                    if (this.filterDataValue[b]) {
                        this.filterValues[b] = this.filterDataValue[b].trim().toLowerCase();
                    }
                });
                this.tableDataSource.filter = JSON.stringify(this.filterValues);
                this.outFullDataSet.emit(this.tableDataSource.filteredData);
            }
        }
    }

    @Input() filterFunction: (filterValue: string, data: any) => boolean = null;
    @Input() headerColor: string;
    @Input()
    set page(index: number) {
        if (this.paginator && (index != null)) {
            this.paginator.pageIndex = index;
        }
    }

    get page(): number {
        if (this.paginator) {
            return this.paginator.pageIndex;
        }
        else {
            return -1;
        }
    }

    fullDataSet: any[] = [];
    filterDataValue: any = null;
    tableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns: string[] = [];
    currentFilter = '';
    filterValues: any = {};

    constructor() {
    }

    ngOnInit() {
      this.outFullDataSet.emit(this.tableDataSource.data);
    }

    applyFilter(filterValue: string) {
        let filteredItems = this.fullDataSet;
        if (filterValue && (filterValue.length > 2)) {
            filteredItems = this.fullDataSet.filter(data => {
                if (this.filterFunction) {
                    return this.filterFunction(filterValue, data);
                }
                else {
                    return JSON.stringify(data).toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
                }
            });
            this.currentFilter = filterValue;
        } else {
            this.currentFilter = '';
        }

        this.updateDataSource(filteredItems);
    }

  createFilter() {
    const that = this;
    return (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }
      const nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          const filterAndCondition = [];
          for (let col in searchTerms) {
            //   searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
            if (col !== 'data_completamento' && col !== 'person.max_age' && col !== 'person.min_age'
            && col !== 'person.max_voto_laurea' && col !== 'person.min_voto_laurea' && col !== 'person.sesso') {
              const colValue = that.ref(data, col);
              const searchValue = searchTerms[col].trim().toLowerCase();
              if (colValue.toString().toLowerCase().indexOf(searchValue) !== -1 && isFilterSet) {
                found = true;
                filterAndCondition.push(true);
              } else {
                filterAndCondition.push(false);
              }
            } else if (col === 'data_completamento') {
              const colValue = that.ref(data, col);
              const searchValue = searchTerms[col].trim().toLowerCase();
              if (colValue && isFilterSet) {
                const [sDate, lDate] = searchValue.split(' to ');
                if (moment(colValue).isBetween(lDate, sDate)) {
                  found = true;
                  filterAndCondition.push(true);
                } else {
                  filterAndCondition.push(false);
                }
              } else {
                filterAndCondition.push(false);
              }
            } else if (col === 'person.sesso') {
              const colValue = that.ref(data, col);
              const searchValue = searchTerms[col].trim().toLowerCase();
              if (colValue && isFilterSet) {
                if (colValue.toString().toLowerCase()  === searchValue && isFilterSet) {
                  found = true;
                  filterAndCondition.push(true);
                } else {
                  filterAndCondition.push(false);
                }
              } else {
                filterAndCondition.push(false);
              }
            } else if (col === 'person.max_age' || col === 'person.min_age') {
              const colValue = that.ref(data, 'person.age_round');
              const searchValue = searchTerms[col].trim().toLowerCase();
              if (colValue && isFilterSet) {
                if (this.ageFilter(col, colValue, searchValue)) {
                  found = true;
                  filterAndCondition.push(true);
                } else {
                  filterAndCondition.push(false);
                }
              } else {
                filterAndCondition.push(false);
              }
            } else if (col === 'person.min_voto_laurea' || col === 'person.max_voto_laurea') {
              //person.voto_laurea
              let isNumber = true;
              let colValue;
              if(isNaN(that.ref(data, 'person.voto_laurea'))){
                let splittedArr = that.ref(data, 'person.voto_laurea').split('-');
                if(splittedArr.length > 1){
                  colValue = splittedArr[0].replace(' ', '');
                }else {
                  splittedArr = that.ref(data, 'person.voto_laurea').split('/');
                  if(splittedArr.length > 1){
                    colValue = splittedArr[0].replace(' ', '');
                  }
                }
              }else{
                colValue = +that.ref(data, 'person.voto_laurea');
              }

              const searchValue = searchTerms[col].trim().toLowerCase();
              if (colValue && isFilterSet) {
                if (this.degreeMarkFilter(col, colValue, searchValue)) {
                  found = true;
                  filterAndCondition.push(true);
                } else {
                  filterAndCondition.push(false);
                }
              } else {
                filterAndCondition.push(false);
              }

              // const colValue = that.ref(data, "person.voto_laurea");
              // const searchValue = searchTerms[col].trim().toLowerCase();
              // if (colValue && isFilterSet) {
              //   const arrayFound = [];
              //   searchValue.split(' ').forEach(word => {
              //         if (colValue.toString().toLowerCase().indexOf(word) !== -1){
              //           arrayFound.push(true);
              //         }
              //   });
              //   found = arrayFound.filter( () => true).length > 0;
              //   if (found) {
              //     filterAndCondition.push(true);
              //   } else {
              //     filterAndCondition.push(false);
              //   }
              // } else {
              //   filterAndCondition.push(false);
              // }
            }
          }
          return Object.keys(searchTerms).length === filterAndCondition.filter((b) => b).length;
        } else {
          return true;
        }
      };
      return nameSearch();
    };
  }

  ref(obj, str): any {
      return str.split('.').reduce( (o, x) => o[x] , obj);
  }

  ageFilter(col, age, searchValue): boolean {
    let ageResult = false;
    searchValue = parseInt(searchValue);
    switch (col) {
      case 'person.max_age':
        ageResult = age <= searchValue;
        break;
      case 'person.min_age':
        ageResult = age >= searchValue;
        break;
    }
    return ageResult;
  }

  degreeMarkFilter(col, degreeMark, searchValue): boolean {
    let dmResult = false;
    searchValue = parseInt(searchValue);
    switch (col) {
      case 'person.max_voto_laurea':
        dmResult = degreeMark <= searchValue;
        break;
      case 'person.min_voto_laurea':
        dmResult = degreeMark >= searchValue;
        break;
    }
    return dmResult;
  }

    updateDataSource(data: any[]) {
      try {
            this.tableDataSource = new MatTableDataSource(data);
            this.tableDataSource.filterPredicate = this.createFilter();
            this.tableDataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'opening.description': return item.opening.description;
                case 'laurea.description': return item.laurea.description;
                case 'person.cognome': return item.person.cognome;
                case 'person.nome': return item.person.nome;
                case 'person.age': return item.person.age;
                case 'person.age_round': return item.person.age_round;
                case 'person.sesso': return item.person.sesso;
                case 'person.voto_laurea': return item.person.voto_laurea;
                case 'univ.description': return item.univ.description;
                case 'person.degreeYear': return item.person.degreeYear;
                case 'person.degreeMark': return item.person.degreeMark ? parseInt(item.person.degreeMark) : null;
                case 'person.livello_studi': return item.person.livello_studi;
                case 'status.description': return item.status.description;
                default: return item[property];
              }
            };
            this.tableDataSource.paginator = this.paginator;
            this.tableDataSource.sort = this.sort;
            this.updateDisplayedColumns();
            /*this.tableDataSource.data = data.slice(0, this.paginator.pageSize);
            this.paginator.length = data.length;
            this.paginator.page.subscribe((args) => {
              this.viewDataOfSelectedPage(data);
            });

            this.viewDataOfSelectedPage(data);
            this.updateDisplayedColumns();*/
        } catch (ex) {
        }
    }

    viewDataOfSelectedPage(data: any[]) {
        const startPage = this.paginator.pageIndex * this.paginator.pageSize;
        const pageItems = data.slice(
            startPage,
            startPage + this.paginator.pageSize
        );
        this.tableDataSource.data = pageItems;
    }

    updateDisplayedColumns(): void {
        this.displayedColumns = this.columnTemplates.filter( (b) => !b.isColumnShow ).map(ct => ct.columnName);
    }

    onMainAction(mainAction: Action) {
        mainAction.context[mainAction.action]();
    }

    onRowAction(element: any, rowAction: Action) {
        rowAction.context[rowAction.action](element);
    }

    getNestedField(element: any, fieldList: string[]) {
        try {
            const fName = fieldList.pop();
            if (fieldList.length > 0) {
                return this.getNestedField(element[fName], fieldList);
            }
            else {
                return element[fName];
            }
        } catch (ex) {
            return null;
        }
    }

    getElementValue(element: any, columnTemplate: ColumnTemplate) {
        const nestedSplit = columnTemplate.columnDataField.split('.');
        let fieldValue = this.getNestedField(element, nestedSplit.reverse());
        if(element.lode && columnTemplate.columnDataField.indexOf("voto_laurea") > -1){
          fieldValue = fieldValue  + " - Lode";
        }


        if (!columnTemplate.columnFormatter) {
            return fieldValue;
        }
        else {
            return columnTemplate.context[columnTemplate.columnFormatter](fieldValue, element);
        }
    }

    onChipRemove(col: ColumnTemplate): any {
        this.filterDataValue[col.columnDataField] = null;
        this.filterValues = {};
        if (this.filterDataValue) {
            const filterValue = (this.filterDataValue) ? Object.keys(this.filterDataValue) : [];
            filterValue.forEach((b) => {
                if (this.filterDataValue[b]) {
                    this.filterValues[b] = this.filterDataValue[b].trim().toLowerCase();
                }
            });
            if (!this.isEmptyObject(this.filterValues)) {
                this.tableDataSource.filter = JSON.stringify(this.filterValues);
                this.outFullDataSet.emit(this.tableDataSource.filteredData);
                this.tableDataSource.paginator = this.paginator;
            } else {
                this.tableDataSource.filter = '';
                this.outFullDataSet.emit(this.tableDataSource.data);
            }
        }
        col.filterValue = null;
    }

    public get filters(): any {
        return this.columnTemplates.filter(col => col.filterWidget);
    }

    public get activeFilters(): any {
        return this.filters.filter(col => col.filterValue);
    }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    getElementTooltip(element: any, columnTemplate: ColumnTemplate) {
        if (columnTemplate.columnTooltip) {
            return columnTemplate.context[columnTemplate.columnTooltip](element, element);
        }
    }
    renderCell(element: any, columnTemplate: ColumnTemplate) {
        if (columnTemplate.columnRenderer) {
            return columnTemplate.context[columnTemplate.columnRenderer](element, element);
        }
    }

    getRowActions(element: any) {
        return this.rowActions;
    }
}
