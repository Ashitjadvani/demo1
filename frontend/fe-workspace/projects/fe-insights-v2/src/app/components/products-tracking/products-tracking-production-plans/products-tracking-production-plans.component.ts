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
import { DateAdapter } from '@angular/material/core';
import { EventHelper } from 'projects/fe-common-v2/src/lib';

@Component({
    selector: 'app-products-tracking-production-plans',
    templateUrl: './products-tracking-production-plans.component.html',
    styleUrls: ['./products-tracking-production-plans.component.scss'],
    animations: [EventHelper.animationForDetailExpand()]
})
export class ProductsTrackingProductionPlansComponent implements OnInit {
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
        'code_resource',
        'code_odl',
        'serial'
    ];
    listOfProductionPlans: any = new MatTableDataSource([]);
    productionDate: Date = new Date();

    expandedElement: any | null;
    currentPlanItems: any;
    degreeDisplayedColumns: string[];

    public requestPara = { date: this.commonService.toYYYYMMDD(this.productionDate), search: '', page: 1, limit: 10, sortBy: '', sortKey: '' };

    constructor(public dialog: MatDialog,
        public commonService: CommonService,
        private productsTrackingService: ProductsTrackingService,
        private router: Router,
        private helper: MCPHelperService,
        private dateAdapter: DateAdapter<Date>,
        public translate: TranslateService) {

        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        this.setSearch();
    }


    private setSearch(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.page = 1;
            this.requestPara = {
                date: this.commonService.toYYYYMMDD(this.productionDate),
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            };
            this.getProductionPlans();
        });
    }

    async ngOnInit() {
        this.degreeDisplayedColumns = EventHelper.getDegreeDisplayedColumns();
        await this.getProductionPlans();

    }

    onKeyUp(searchTextValue: any): void {
        this.subject.next(searchTextValue);
    }

    async pageChanged(page) {
        this.requestPara = {
            date: this.commonService.toYYYYMMDD(this.productionDate),
            page: page, 
            limit: this.itemsPerPage, 
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
        };
        await this.getProductionPlans();

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
            date: this.commonService.toYYYYMMDD(this.productionDate),
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.getProductionPlans();
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch() {
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.requestPara = {
            date: this.commonService.toYYYYMMDD(this.productionDate),
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        }
        this.getProductionPlans();
    }

    async getProductionPlans() {
        let res = await this.productsTrackingService.getProductionPlans(this.requestPara);
        if (!this.commonService.isValidResponse(res)) {
            swal.fire('', res.reason, 'error');
        } else {
            this.listOfProductionPlans = res.meta.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.listOfProductionPlans.length > 0;
        }
    }

    async onRefreshTable() {
        await this.getProductionPlans();
    }

    async onFilterItems() {

    }

    async onSyncProductionPlans() {
        let res = await this.productsTrackingService.syncProductionPlans(this.commonService.toYYYYMMDD(this.productionDate));
        if (this.commonService.isValidResponse(res)) {
            swal.fire('', 'Sincronizzazione OK', 'success');
        } else {
            swal.fire('', res.reason, 'error');
        }
    }

    async onDateProductionChange($event) {
        this.productionDate = new Date($event);
        this.requestPara.date = this.commonService.toYYYYMMDD(this.productionDate);

        await this.getProductionPlans();
    }

    onPlanItemsExpand(element) {
        console.log(this.expandedElement);
    }
}
