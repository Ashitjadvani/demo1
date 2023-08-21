import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductsTrackingService } from 'projects/fe-common-v2/src/lib/services/products-tracking.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { Subject } from 'rxjs';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import swal from 'sweetalert2';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-products-tracking-work-orders',
  templateUrl: './products-tracking-work-orders.component.html',
  styleUrls: ['./products-tracking-work-orders.component.scss']
})
export class ProductsTrackingWorkOrdersComponent implements OnInit {
    private subject: Subject<string> = new Subject();

    page: any = 1;
    totalItems: any = 0;
    limit: any = 10;
    itemsPerPage: any = '10';
    search: any = '';
    sortBy: any = '-1';
    sortKey = null;
    noRecordFound = false;

    displayedColumns: string[] = [
        // "code",
        "status",
        "req_code",
        "measure_unit",
        "qty_ordered",
        "qty_delivered",
        "qty_residual",
        "qty_scrap",
        "delivery_date",
        "start_date"        
    ];
    listOfWorkingOrders: any = new MatTableDataSource([]);

    public requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '' };

    constructor(public dialog: MatDialog,
        public commonService: CommonService,
        private productsTrackingService: ProductsTrackingService,
        private router: Router,
        private helper: MCPHelperService,
        public translate: TranslateService) {
        this.setSearch();
    }


    private setSearch(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.page = 1;
            this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            };
            this.getWorkingOrders();
        });
    }

    async ngOnInit() {
        await this.getWorkingOrders();

    }

    onKeyUp(searchTextValue: any): void {
        this.subject.next(searchTextValue);
    }

    async pageChanged(page) {
        this.requestPara = {
            page: page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
        };
        await this.getWorkingOrders();

        this.page = page;
    }

    changeItemsPerPage(event): void {
        // this.search = '';
        this.itemsPerPage = event
        this.page = 1;
        this.limit = this.itemsPerPage;
    }

    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.getWorkingOrders();
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch() {
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        }
        this.getWorkingOrders();
    }

    async getWorkingOrders() {
        let res = await this.productsTrackingService.getWorkingOrders(this.requestPara);
        if (!this.commonService.isValidResponse(res)) {
            swal.fire('', res.reason, 'error');
        } else {
            this.listOfWorkingOrders = res.meta.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.listOfWorkingOrders.length > 0;
        }
    }

    async onRefreshTable() {

    }

    async onFilterItems() {

    }

    async onSyncWorkingOrders() {
        let res = await this.productsTrackingService.syncWorkingOrders();
        if (this.commonService.isValidResponse(res)) {
            swal.fire('', 'Sincronizzazione OK', 'success');

            await this.getWorkingOrders();
        } else {
            swal.fire('', res.reason, 'error');
        }
    }
}
