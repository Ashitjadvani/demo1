import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ProcurementService} from '../../../../../../fe-common-v2/src/lib/services/procurement.service';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-supplier-log',
  templateUrl: './supplier-log.component.html',
  styleUrls: ['./supplier-log.component.scss']
})
export class SupplierLogComponent implements OnInit {
  page = 1;
  itemsPerPage = 10;
  search = '';
  serviceList = [];
  noRecordFound = false;
  totalItems = 0;
  sortKey = 'createdAt';
  sortBy = -1;
  sortClass = 'down';
  panelOpenState = false;
  RFQDisplayedColumns: string[] = ['ServiceCategory', 'CompanyName', 'createdAt', 'updatedAt', 'Status'];
  private searchSubject: Subject<string> = new Subject();
  covenants: any = [
    { provinceID: 1 },
    { provinceID: 2 },
    { provinceID: 3 },
    { provinceID: 4 },
    { provinceID: 5 },
  ];

  openCoverages = false;
  indexSelectedCoverage = 1;
  constructor(
    private procurementService: ProcurementService,
  ) {
    this._setSearchSubscription();
  }

  ngOnInit(): void {
    const request = {search: this.search, page: this.page, limit: this.itemsPerPage, sortBy: '', sortKey: ''};
    this.loadServiceList(request);
    this.covenants.forEach((_covenants) => {
      _covenants.isExpanded = false;
    });
  }

  async loadServiceList(request): Promise<void> {
    const res: any = await this.procurementService.loadSupplierList(request);
    this.serviceList = res.data;
    this.noRecordFound = this.serviceList.length > 0;
    this.totalItems = res.meta.totalCount;
  }

  onKeyUp(searchTextValue: any): void {
    this.searchSubject.next( searchTextValue );
  }
  private _setSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.page = 1;
      this.loadServiceList({page: 1, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey: this.sortKey});
    });
  }
  changeSorting(sortKey): void {
    this.page = 1;
    this.sortKey = sortKey;
    this.sortBy = (this.sortBy === 1) ? -1  : 1;
    this.sortClass = (this.sortBy === 1) ? 'down'  : 'up';
    this.loadServiceList({page: this.page, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey});
  }

  changeSelectOption(): void {
    this.page = 1;
    this.loadServiceList({page: 1, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey: this.sortKey});
  }

  pageChanged(page): void {
    this.loadServiceList({page, limit: this.itemsPerPage, search: this.search, sortBy : this.sortBy, sortKey: this.sortKey});
    this.page = page;
  }

  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(){
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    const request = {search: '', page: this.page, limit: this.itemsPerPage, sortBy: '', sortKey: ''};
    this.loadServiceList(request);
  }
}
